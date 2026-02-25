// 📋 JOURNAL ROLLOVER - Fetches uncompleted tasks from yesterday
// Used by Template - Daily Journal.md

async function getRolloverPriorities(tp) {
    let tasks = [];

    try {
        const yesterday = tp.date.now("YYYY-MM-DD", -1);
        const prevFile = app.vault.getAbstractFileByPath(`3. Permanent Notes/Daily Notes/Journal ${yesterday}.md`);

        if (prevFile) {
            const content = await app.vault.read(prevFile);

            // 1. Find UNCOMPLETED priorities from yesterday (checkboxes that are NOT checked)
            const prioritiesMatch = content.match(/> ### 🎯 Priorities\n((?:> \d+\. \[.\].*\n?)*)/);
            if (prioritiesMatch && prioritiesMatch[1]) {
                const lines = prioritiesMatch[1].split("\n");
                for (const line of lines) {
                    // Match unchecked boxes: "> 1. [ ] task text"
                    const unchecked = line.match(/> \d+\. \[ \] (.+)/);
                    if (unchecked && unchecked[1].trim()) {
                        tasks.push(unchecked[1].trim());
                    }
                }
            }

            // 2. Also get items from "Tomorrow" section
            const tomorrowMatch = content.match(/> ### 🔮 Tomorrow\n((?:.|\n)*?)(?=> \*\*📝 Notes:\*\*|> \[!|---|$)/);
            if (tomorrowMatch && tomorrowMatch[1]) {
                let raw = tomorrowMatch[1].replace(/> \*One thing to focus on:\*/g, "").replace(/>\s*\n/g, "").trim();
                if (raw.length > 2) {
                    const tomorrowTasks = raw.split("\n")
                        .map(l => l.replace(/^> /, "").replace(/^[-*] /, "").replace(/^\d+\. /, "").trim())
                        .filter(l => l.length > 0);
                    tasks = tasks.concat(tomorrowTasks);
                }
            }
        }
    } catch (e) {
        console.log("Rollover Error:", e);
    }

    // Remove duplicates
    tasks = [...new Set(tasks)];

    // Generate Numbered Checkbox List (Minimum 3 slots)
    let output = "";
    const minSlots = Math.max(3, tasks.length);
    for (let i = 0; i < minSlots; i++) {
        const taskText = tasks[i] || "";
        output += `> ${i + 1}. [ ] ${taskText}`;
        if (i < minSlots - 1) output += "\n";
    }

    return output;
}

module.exports = getRolloverPriorities;
