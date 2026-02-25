// DEFERRED SAVE MECHANISM
// Changes are stored in memory and saved only when navigating away or after idle time
if (!window.dtPendingChanges) {
    window.dtPendingChanges = {};
    window.dtSaveTimeout = null;
    window.dtCurrentFile = null;

    // Save pending changes function
    window.dtSavePending = async () => {
        if (Object.keys(window.dtPendingChanges).length === 0) return;

        const file = window.dtCurrentFile;
        if (!file) return;

        const changes = { ...window.dtPendingChanges };
        window.dtPendingChanges = {};

        try {
            await app.fileManager.processFrontMatter(file, (fm) => {
                for (const [key, value] of Object.entries(changes)) {
                    if (key === 'habits') {
                        fm.habits = value;
                    } else if (!isNaN(value) && key !== "mood_morning" && key !== "mood_evening") {
                        fm[key] = parseFloat(value);
                    } else {
                        fm[key] = value;
                    }
                }
            });
            console.log("📝 Saved pending changes:", changes);
        } catch (e) {
            console.error("Failed to save pending changes:", e);
        }
    };

    // Listen for file change / navigation to trigger save
    app.workspace.on('file-open', () => {
        window.dtSavePending();
    });

    // Listen for window close / visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.dtSavePending();
        }
    });

    // Save before page unload
    window.addEventListener('beforeunload', () => {
        window.dtSavePending();
    });
}

class DailyTracker {
    constructor(container, app) {
        this.container = container;
        this.app = app;
        this.file = app.workspace.getActiveFile();
        this.metadata = null;

        // Store reference to current file for deferred save
        window.dtCurrentFile = this.file;

        this.render();
    }

    render() {
        // 1. Inject Styles Once (in Head)
        const styleId = "daily-tracker-styles-v2";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                .daily-tracker-container {
                    padding: 15px;
                    background: var(--background-secondary);
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    border: 1px solid var(--background-modifier-border);
                    min-height: 320px;
                    contain: content;
                }
                .dt-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .dt-header {
                    margin: 0;
                    font-size: 0.95em;
                    font-weight: 700;
                    color: var(--text-normal);
                    border-bottom: 1px solid var(--background-modifier-border);
                    padding-bottom: 5px;
                }
                .dt-separator {
                    margin: 5px 0;
                    border: none;
                    border-top: 1px dashed var(--background-modifier-border);
                }
                .dt-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                .dt-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    flex: 1;
                    min-width: 120px;
                }
                .dt-label {
                    font-size: 0.8em;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .dt-select {
                    padding: 6px;
                    border-radius: 6px;
                    background: var(--background-primary);
                    border: 1px solid var(--background-modifier-border);
                    color: var(--text-normal);
                    min-height: 32px;
                }
                .dt-select.pending {
                    border-color: var(--interactive-accent);
                    box-shadow: 0 0 0 1px var(--interactive-accent);
                }
                .dt-habits {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .dt-habit-btn {
                    padding: 6px 12px;
                    border-radius: 20px;
                    border: 1px solid transparent;
                    border-color: var(--background-modifier-border);
                    background: var(--background-primary);
                    cursor: pointer;
                    font-size: 0.9em;
                    transition: all 0.2s ease;
                    opacity: 0.7;
                }
                .dt-habit-btn.active {
                    background: var(--interactive-accent);
                    color: white;
                    border-color: var(--interactive-accent);
                    opacity: 1;
                }
                .dt-habit-btn:hover {
                    transform: translateY(-1px);
                }
                .dt-save-indicator {
                    font-size: 0.7em;
                    color: var(--text-muted);
                    text-align: right;
                    font-style: italic;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .dt-save-indicator.visible {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Load data FIRST (Synchronously)
        this.loadMetadata();

        // 3. Build UI
        const fragment = document.createDocumentFragment();
        const wrapper = fragment.createEl("div", { cls: "daily-tracker-container" });

        // Save indicator
        const saveIndicator = wrapper.createEl("div", { cls: "dt-save-indicator" });
        saveIndicator.textContent = "💾 Changes saved when you leave";
        this.saveIndicator = saveIndicator;

        // 1. Morning Section
        const morningContainer = wrapper.createEl("div", { cls: "dt-section" });
        morningContainer.createEl("h4", { text: "☀️ Morning Trackers", cls: "dt-header" });
        const morningRow = morningContainer.createEl("div", { cls: "dt-row" });

        // Sleep Score
        this.createDropdown(morningRow, "Sleep (Hrs)", "sleep_hours", [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10]);
        // Energy Score
        this.createDropdown(morningRow, "Energy (1-10)", "energy_score", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        // Mood AM
        this.createDropdown(morningRow, "Mood (AM)", "mood_morning", ["😫 Drained", "😐 Okay", "🙂 Good", "🤩 Great", "🧘‍♂️ Zen"]);

        // Separator
        wrapper.createEl("hr", { cls: "dt-separator" });

        // 2. Evening Section
        const eveningContainer = wrapper.createEl("div", { cls: "dt-section" });
        eveningContainer.createEl("h4", { text: "🌙 Evening Trackers", cls: "dt-header" });
        const eveningRow = eveningContainer.createEl("div", { cls: "dt-row" });

        // Mood PM
        this.createDropdown(eveningRow, "Mood (PM)", "mood_evening", ["😫 Drained", "😐 Okay", "🙂 Good", "🤩 Great", "🧘‍♂️ Zen"]);
        // Relationship Score
        this.createDropdown(eveningRow, "Relationship (1-10)", "relationship_score", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        // Habits
        const habitsContainer = eveningContainer.createEl("div", { cls: "dt-group" });
        habitsContainer.createEl("div", { text: "DAILY HABITS", cls: "dt-label" });
        const habitsRow = habitsContainer.createEl("div", { cls: "dt-habits" });

        const habits = ["Meditation", "Workout", "Reading", "Water 2L", "Focus Hour"];

        habits.forEach(habit => {
            const btn = habitsRow.createEl("button", { text: habit, cls: "dt-habit-btn" });

            // Check if active (from frontmatter OR pending)
            const pendingHabits = window.dtPendingChanges.habits;
            const currentHabits = pendingHabits || this.metadata.habits || [];
            if (currentHabits.includes(habit)) btn.addClass("active");

            btn.onclick = () => {
                // Optimistic UI Update
                btn.classList.toggle("active");

                // Queue the change (deferred save)
                this.queueHabitChange(habit, btn.classList.contains("active"));
            };
        });

        // 4. SWAP
        this.container.empty();
        this.container.appendChild(fragment);
    }

    createDropdown(parent, label, key, options) {
        const group = parent.createEl("div", { cls: "dt-group" });
        group.createEl("div", { text: label, cls: "dt-label" });

        const select = group.createEl("select", { cls: "dt-select" });

        // Check for pending value first, then metadata
        const pendingValue = window.dtPendingChanges[key];
        const savedValue = pendingValue !== undefined ? pendingValue : this.metadata[key];

        options.forEach(opt => {
            const option = select.createEl("option");
            option.value = opt;
            option.text = opt;
            if (savedValue == opt) option.selected = true;
        });

        // Empty option if nothing selected
        if (savedValue === undefined || savedValue === null) {
            const placeholder = document.createElement("option");
            placeholder.text = "-";
            placeholder.value = "";
            placeholder.selected = true;
            placeholder.disabled = true;
            select.prepend(placeholder);
        }

        select.onchange = (e) => {
            // Queue the change (NO immediate save, NO scroll jump)
            this.queueChange(key, e.target.value);

            // Visual feedback
            select.classList.add("pending");
            this.showSaveIndicator();
        };
    }

    loadMetadata() {
        if (!this.file) return;
        const cache = this.app.metadataCache.getFileCache(this.file);
        this.metadata = cache ? cache.frontmatter : {};
        if (!this.metadata) this.metadata = {};
    }

    // Queue a change for deferred save
    queueChange(key, value) {
        window.dtPendingChanges[key] = value;

        // Auto-save after 10 seconds of inactivity
        clearTimeout(window.dtSaveTimeout);
        window.dtSaveTimeout = setTimeout(() => {
            window.dtSavePending();
        }, 10000);
    }

    // Queue habit change
    queueHabitChange(habit, isActive) {
        // Get current habits (from pending or metadata)
        let current = window.dtPendingChanges.habits || [...(this.metadata.habits || [])];
        if (!Array.isArray(current)) current = [];

        if (isActive) {
            if (!current.includes(habit)) current.push(habit);
        } else {
            current = current.filter(h => h !== habit);
        }

        window.dtPendingChanges.habits = current;
        this.showSaveIndicator();

        // Auto-save after 10 seconds of inactivity
        clearTimeout(window.dtSaveTimeout);
        window.dtSaveTimeout = setTimeout(() => {
            window.dtSavePending();
        }, 10000);
    }

    showSaveIndicator() {
        if (this.saveIndicator) {
            this.saveIndicator.classList.add("visible");
        }
    }
}

// Instantiate the tracker
new DailyTracker(dv.container, app);
