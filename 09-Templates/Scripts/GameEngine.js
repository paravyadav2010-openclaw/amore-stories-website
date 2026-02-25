// 🎮 GAME ENGINE (GameEngine.js)
// Style V4: "Modern Bento" (Crextio Inspired)
// Clean, Soft Rounded, Yellow Accents.

// 1. CONFIGURATION
const VISION_NAME = "Shadow Monarch";

// 2. FETCH DATA
const journals = dv.pages('"3. Permanent Notes/Daily Notes"')
    .where(p => p.file.day && p.file.name.startsWith("Journal "))
    .sort(p => p.file.day, "desc");

// 3. CALCULATE XP
let totalXP = 0;
let streak = 0;
let totalQuests = 0;

journals.forEach(p => {
    totalXP += 10;
    if (p.file.tasks) {
        const count = p.file.tasks.where(t => t.completed).length;
        totalXP += (count * 5);
        totalQuests += count;
    }
    if (p.habits && Array.isArray(p.habits)) {
        const habitCount = p.habits.length;
        totalXP += (habitCount * 5);
        totalQuests += habitCount;
    }
});

const todayStr = moment().format("YYYY-MM-DD");
for (let i = 0; i < 365; i++) {
    const d = moment().subtract(i, 'days').format("YYYY-MM-DD");
    const found = journals.find(p => p.file.day && p.file.day.toFormat("YYYY-MM-DD") === d);
    if (found) streak++;
    else if (i === 0 && d === todayStr) continue;
    else break;
}

// 4. CALCULATE LEVEL
const safeXP = Math.max(0, totalXP);
const level = Math.floor(Math.sqrt(safeXP / 100)) || 1;
const nextLevelStart = 100 * Math.pow(level, 2);
const nextLevelEnd = 100 * Math.pow(level + 1, 2);
const xpNeeded = nextLevelEnd - nextLevelStart;
const xpInLevel = safeXP - nextLevelStart;
const progress = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 0;

// 5. RENDER UI
const isCompact = input && input.mode === "compact";

let container;
if (input && input.container) {
    container = isCompact ? input.container.createDiv({ cls: "bento-compact" }) : input.container.createDiv({ cls: "bento-container" });
} else {
    container = dv.el("div", "", { cls: isCompact ? "bento-compact" : "bento-container" });
}

const style = document.createElement("style");
style.textContent = `
    /* --- BENTO STYLES (Crextio Inspired) --- */
    .bento-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        /* Dark Grey Card Base */
        background: #1F2937; 
        color: #F9FAFB;
        border-radius: 32px; /* Soft rounding */
        padding: 30px;
        box-shadow: 0 20px 40px -5px rgba(0,0,0,0.3);
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    /* HEADER: Left Text, Right Avatar */
    .bt-header {
        display: flex; justify-content: space-between; align-items: flex-start;
    }
    .bt-title-group { display: flex; flex-direction: column; gap: 4px; }
    .bt-welcome { font-size: 0.9em; color: #9CA3AF; letter-spacing: 0.5px; }
    .bt-name { font-size: 2.2em; font-weight: 700; color: #F3F4F6; letter-spacing: -0.5px; line-height: 1.1; }
    
    .bt-avatar-box {
        width: 60px; height: 60px;
        background: #374151; /* Lighter grey */
        border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        font-size: 2em;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
    }

    /* STATS ROW (Big Numbers) */
    .bt-stats-row {
        display: flex; gap: 40px; align-items: center;
    }
    .bt-stat { display: flex; flex-direction: column; gap: 2px; }
    .bt-num { font-size: 3em; font-weight: 300; line-height: 1; color: #FCD34D; /* Soft Yellow */ }
    .bt-label { font-size: 0.85em; color: #D1D5DB; font-weight: 500; display: flex; align-items: center; gap: 6px; }
    .bt-icon { font-size: 1.1em; color: #9CA3AF; }

    /* PROGRESS (Yellow Pill) */
    .bt-progress-section {
        background: #374151;
        border-radius: 24px;
        padding: 20px;
        display: flex; flex-direction: column; gap: 10px;
    }
    .bt-prog-header { display: flex; justify-content: space-between; align-items: flex-end; }
    .bt-lvl { font-size: 1.8em; font-weight: 700; color: #FCD34D; line-height: 1; }
    .bt-sub { font-size: 0.85em; color: #9CA3AF; margin-bottom: 4px; }
    
    .bt-bar-bg {
        width: 100%; height: 16px; 
        background: #1F2937; /* Darker Layout */
        border-radius: 100px;
        position: relative; overflow: hidden;
    }
    .bt-bar-fill {
        height: 100%;
        background: #FCD34D; /* Yellow */
        border-radius: 100px;
        width: 0%; transition: width 1s ease;
    }

    /* COMPACT MODE */
    .bento-compact {
        display: flex; align-items: center; gap: 12px;
        background: #1F2937; color: #F3F4F6;
        padding: 8px 16px; border-radius: 100px;
        width: fit-content; margin: 10px 0;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .bc-icon { font-size: 1.2em; }
    .bc-lvl { font-weight: 700; color: #FCD34D; }
    .bc-bar-bg { width: 80px; height: 6px; background: #374151; border-radius: 10px; overflow: hidden; }
    .bc-bar-fill { height: 100%; background: #FCD34D; }
    .bc-streak { font-size: 0.9em; font-weight: 600; color: #9CA3AF; border-left: 1px solid #374151; padding-left: 10px; }
`;

if (isCompact) {
    container.innerHTML = `
        <div class="bc-icon">🦄</div>
        <div class="bc-lvl">Lvl ${level}</div>
        <div class="bc-bar-bg" title="${Math.round(progress)}% to Next Level">
            <div class="bc-bar-fill" style="width: ${progress}%"></div>
        </div>
        <div class="bc-streak">🔥 ${streak}</div>
    `;
} else {
    container.innerHTML = `
        <div class="bt-header">
            <div class="bt-title-group">
                <div class="bt-welcome">Welcome back,</div>
                <div class="bt-name">${VISION_NAME}</div>
            </div>
            <div class="bt-avatar-box">🦄</div>
        </div>

        <div class="bt-stats-row">
            <div class="bt-stat">
                <div class="bt-num">${streak}</div>
                <div class="bt-label"><span class="bt-icon">🔥</span> Day Streak</div>
            </div>
            <div class="bt-stat">
                <div class="bt-num">${Math.floor(totalQuests)}</div>
                <div class="bt-label"><span class="bt-icon">⚔️</span> Quests</div>
            </div>
            <div class="bt-stat">
                <div class="bt-num" style="color:#F3F4F6; font-size:2.5em;">${safeXP}</div>
                <div class="bt-label"><span class="bt-icon">✨</span> Total XP</div>
            </div>
        </div>

        <div class="bt-progress-section">
            <div class="bt-prog-header">
                <div>
                   <div class="bt-sub">Current Rank</div>
                   <div class="bt-lvl">Level ${level}</div>
                </div>
                <div class="bt-sub" style="color:#FCD34D; font-weight:600;">${Math.round(progress)}% Complete</div>
            </div>
            <div class="bt-bar-bg">
                <div class="bt-bar-fill" style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

container.appendChild(style);
