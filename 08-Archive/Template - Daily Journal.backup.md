<%*
// Set the filename and delete the temporary untitled file
const filename = "Journal " + tp.date.now("YYYY-MM-DD");
await tp.file.rename(filename);

// ROLLOVER LOGIC: Fetch uncompleted priorities + "Tomorrow" section from yesterday
let prioritiesOutput = "";
try {
   const yesterday = tp.date.now("YYYY-MM-DD", -1);
   const prevFile = app.vault.getAbstractFileByPath(`3. Permanent Notes/Daily Notes/Journal ${yesterday}.md`);
   
   let tasks = [];
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
   
   // Remove duplicates
   tasks = [...new Set(tasks)];
   
   // Generate Numbered Checkbox List (Minimum 3 slots)
   const minSlots = Math.max(3, tasks.length);
   for (let i = 0; i < minSlots; i++) {
       const taskText = tasks[i] || ""; 
       prioritiesOutput += `> ${i+1}. [ ] ${taskText}`;
       if (i < minSlots - 1) prioritiesOutput += "\n";
   }
} catch(e) { console.log("Rollover Error:", e); }
%>
---
type: journal
date: <% tp.date.now("YYYY-MM-DD") %>
tags: [journal, daily-journal]

---

```dataviewjs
// 🎨 BEAUTIFUL CONFIGURATION
const accentColor = "var(--interactive-accent)";
const dateString = moment().format("dddd, MMMM Do YYYY");

// Access Templater from Dataview
let quoteText = "Your mind is for having ideas, not holding them.";
try {
    // Fetch daily quote from API
    const response = await fetch("https://api.quotable.io/random?maxLength=100");
    if (response.ok) {
        const data = await response.json();
        quoteText = `"${data.content}" — ${data.author}`;
    }
} catch (e) {
    console.log("Error fetching quote:", e);
}

// 🖌️ STYLES
const style = document.createElement("style");
style.textContent = `
  /* COMPACT METADATA (Reading Mode) */
  body {
    --metadata-padding: 0px;
    --metadata-label-width: 80px;
    --metadata-input-height: 24px;
    --metadata-gap: 4px;
  }
  .metadata-container {
    margin-bottom: 10px !important;
    font-size: 0.8em !important;
  }
  
  /* COMPACT METADATA (Editing/Live Preview Mode) */
  /* Target every possible part of the frontmatter to prevent huge text */
  .cm-hmd-frontmatter,
  .cm-line .cm-hmd-frontmatter.cm-atom,
  .cm-line .cm-hmd-frontmatter.cm-keyword,
  .cm-line .cm-hmd-frontmatter.cm-string,
  .cm-line .cm-hmd-frontmatter.cm-variable-2 {
    font-size: 0.8em !important;
    color: var(--text-muted) !important;
    line-height: 1.2 !important;
    font-family: var(--font-monospace) !important;
    font-weight: normal !important;
  }
  
  /* HERO HEADER STYLING */
  .journal-hero {
    background: linear-gradient(120deg, ${accentColor} 0%, rgba(30,30,30,0.8) 100%);
    border-radius: 8px;
    padding: 20px 25px;
    margin-bottom: 20px;
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
  }
  
  /* Date Styling */
  .journal-date {
    font-size: 1.6em;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  /* Quote styling */
  .journal-quote {
    font-family: var(--font-text);
    font-style: italic;
    opacity: 0.85;
    font-size: 0.95em;
    border-left: 2px solid rgba(255,255,255,0.4);
    padding-left: 12px;
    margin-top: 12px;
    max-width: 90%;
  }

  /* Recording Button Container */
  .recorder-container {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }

  /* The actual button */
  .recorder-btn {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .recorder-btn:hover {
    background: rgba(255,255,255,0.25);
    transform: translateY(-1px);
  }
  .recorder-btn.recording {
    background: #ff4b4b;
    border-color: #ff4b4b;
    animation: pulse 2s infinite;
  }
`;
document.head.appendChild(style);

// 🏗️ RENDER HERO UI
const hero = dv.el("div", "", { cls: "journal-hero" });

// Date
hero.createEl("div", { text: dateString, cls: "journal-date" });

// Quote (Static text for stability, using templater fallback only if JS fails)
hero.createEl("div", { 
  text: quoteText || '"Your mind is for having ideas, not holding them."', 
  cls: "journal-quote" 
});

// Button Container
const btnContainer = hero.createEl("div", { cls: "recorder-container" });
const btn = btnContainer.createEl("button", { text: "🎙️ Capture", cls: "recorder-btn" });

// 🧠 LOGIC
const updateButton = () => {
  if (window.isThinkRecording) {
    btn.innerHTML = "⏹️ Finish";
    btn.classList.add("recording");
  } else {
    btn.innerHTML = "🎙️ Capture";
    btn.classList.remove("recording");
  }
};

btn.onclick = () => {
  if (window.isThinkRecording) {
    // STOP
    window.isThinkRecording = false;
    window.journalRecording = false;
    
    app.commands.executeCommandById("audio-recorder:stop");
    btn.innerHTML = "✨ Processing...";
    btn.disabled = true;
    
    setTimeout(async () => {
      // 🧹 INVISIBLE AUDIO WORKFLOW
      // Save current journal path so we can return to it
      const journalFile = app.workspace.getActiveFile();
      const journalPath = journalFile ? journalFile.path : null;
      
      // Remove the recording link immediately so the page stays clean
      if (journalFile) {
          let content = await app.vault.read(journalFile);
          // Regex to match ![[Recording...]] or ![[path/to/Recording...]]
          const linkRegex = /!\[\[(.*?\/)?Recording \d{14}\.(m4a|webm|mp3|wav|ogg)\]\]\n?/g;
          if (content.match(linkRegex)) {
              content = content.replace(linkRegex, "");
              await app.vault.modify(journalFile, content);
              new Notice("🧹 Removed audio link from page.");
          }
      }

      const tpPlugin = app.plugins.plugins["templater-obsidian"];
      if (tpPlugin) {
        const tp = tpPlugin.templater;
        const templateFile = app.vault.getAbstractFileByPath(`Templates/Template - Voice Journal.md`);
        if (templateFile) {
          // Trigger template processing in background
          tp.create_new_note_from_template(templateFile, "1. Inbox");
          
          // Immediately switch back to journal page so user doesn't see the Untitled file
          if (journalPath) {
            setTimeout(() => {
              app.workspace.openLinkText(journalPath, "", false);
              new Notice("🎙️ Processing in background...");
            }, 100);
          }
          
          // Delete Untitled files - run multiple times to catch them
          const cleanupUntitled = async () => {
            const inboxFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("1. Inbox"));
            for (const file of inboxFiles) {
              if (file.name.startsWith("Untitled")) {
                try { await app.vault.delete(file); } catch (e) {}
              }
            }
          };
          setTimeout(cleanupUntitled, 500);
          setTimeout(cleanupUntitled, 2000);
          setTimeout(cleanupUntitled, 5000);
        }
      }
      btn.disabled = false;
      updateButton();
    }, 1500);
  } else {
    // START
    new Notice("🎙️ Listening...");
    window.isThinkRecording = true;
    window.journalRecording = true;
    app.commands.executeCommandById("audio-recorder:start");
    updateButton();
  }
};

// Start loop
updateButton();
const checker = setInterval(() => {
    if (!document.body.contains(btn)) {
        clearInterval(checker);
        return;
    }
    updateButton();
}, 1000);
```

> [!tip]+ 🌅 Morning Intention
> ### ✅ Habits
> - [ ] Meditation
> - [ ] Exercise
> 
> ### 🎯 Priorities
<%* tR += prioritiesOutput %> 
> 
> ### 💭 Mood & Plan
> *How do I want to feel today?*
> 
> 
> 
> **🙏 Gratitude:**
> - 
> - 

> [!example]+ 🌙 Evening Reflection
> ### 🙏 Gratitude
> 1. 
> 2. 
> 3. 
> 
> ### 💭 Review
> ````dataviewjs
> await dv.view("Templates/Scripts/MoodPicker");
> ````
> **Mood:** 
> **Highlight:** 
> **Challenge:** 
> **Learning:** 
> **Wins:** 
> 
> ### 🔮 Tomorrow
> *One thing to focus on:*
> 
> 
> 
> **📝 Notes:**
> 

---
<center style="opacity: 0.5; font-size: 0.8em; margin-top: 50px;">
✨ <i>"Your mind is for having ideas, not holding them."</i>
</center>
