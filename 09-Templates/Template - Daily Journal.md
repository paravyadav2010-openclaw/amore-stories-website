<%*
const filename = "Journal " + tp.date.now("DD-MM-YYYY");
await tp.file.rename(filename);

// ROLLOVER LOGIC
let rollover = "";
try {
   const yesterday = tp.date.now("DD-MM-YYYY", -1);
   const prevFile = app.vault.getAbstractFileByPath(`3. Permanent Notes/Daily Notes/Journal ${yesterday}.md`);
   let tasks = [];
   if (prevFile) {
      const content = await app.vault.read(prevFile);
      const prioritiesMatch = content.match(/> ### 🎯 Priorities\n((?:> \d+\. \[.\].*\n?)*)/);
      if (prioritiesMatch && prioritiesMatch[1]) {
          for (const line of prioritiesMatch[1].split("\n")) {
              const unchecked = line.match(/> \d+\. \[ \] (.+)/);
              if (unchecked && unchecked[1].trim()) tasks.push(unchecked[1].trim());
          }
      }
      const tomorrowMatch = content.match(/> ### 🔮 Tomorrow\n((?:.|\n)*?)(?=> \*\*📝 Notes:\*\*|> \[!|---|$)/);
      if (tomorrowMatch && tomorrowMatch[1]) {
          let raw = tomorrowMatch[1].replace(/> \*One thing to focus on:\*/g, "").replace(/>\s*\n/g, "").trim();
          if (raw.length > 2) {
             tasks = tasks.concat(raw.split("\n").map(l => l.replace(/^> /, "").replace(/^[-*] /, "").replace(/^\d+\. /, "").trim()).filter(l => l.length > 0));
          }
      }
   }
   tasks = [...new Set(tasks)];
   const minSlots = Math.max(3, tasks.length);
   for (let i = 0; i < minSlots; i++) {
       rollover += `> ${i+1}. [ ] ${tasks[i] || ""}`;
       if (i < minSlots - 1) rollover += "\n";
   }
} catch(e) { console.log("Rollover Error:", e); }
%>
---
type: journal
date: <% tp.date.now("DD-MM-YYYY") %>
tags: [journal, daily-journal]

---

```dataviewjs
await dv.view("Templates/Scripts/HeroHeader");
```

```dataviewjs
await dv.view("Templates/Scripts/PhotoGallery");
```


> [!tip]+ 🌅 Morning Intention
> ### ✅ Habits
> - [ ] Meditation
> - [ ] Exercise
> - [ ] Focus Hour
> 
> ### 🎯 Priorities
<%* tR += rollover %> 
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
