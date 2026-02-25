# 🌅 Morning Journal Prompts

**Good morning!** Take 2-3 minutes to set your intention for the day.

```dataviewjs
// Stop Recording Button
const btn = dv.el("button", "⏹️ Stop Recording & Process Journal");
btn.style.cssText = `
  background: var(--interactive-accent);
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 20px 0;
  width: 100%;
`;
btn.onclick = () => {
  if (window.isThinkRecording) {
    window.isThinkRecording = false;
    window.journalRecording = false;
    window.morningJournal = true; // Flag for morning
    
    app.commands.executeCommandById("audio-recorder:stop");
    new Notice("💾 Processing your morning journal...");
    
    setTimeout(() => {
      const tpPlugin = app.plugins.plugins["templater-obsidian"];
      if (tpPlugin) {
        const tp = tpPlugin.templater;
        const templateFile = app.vault.getAbstractFileByPath(`Templates/Template - Voice Journal.md`);
        if (templateFile) {
          tp.create_new_note_from_template(templateFile, "1. Inbox");
        }
      }
    }, 1500);
  } else {
    new Notice("⚠️ No recording in progress");
  }
};
```

---

## ✅ Morning Habits
*"Did I do my meditation today? Did I exercise?"*

- Meditation: Yes/No
- Exercise: Yes/No

---

## 🎯 Top 3 Priorities for Today
*"Today I want to focus on..."*

1. 
2. 
3. 

---

## 💭 Mood Intention
*"Today I want to feel..."*

(Examples: calm, energized, focused, creative, peaceful, confident)

---

## 🙏 Quick Gratitude
*"I'm grateful for..."*

(1-2 things)

---

## 📋 Plan for the Day
*"Here's what I have planned..."*

(Meetings, tasks, appointments)

---

> **Tip:** Just speak naturally! Example:
> 
> "Yes, I did my meditation this morning. I haven't exercised yet but I plan to after lunch. Today I want to focus on finishing the client photoshoot, editing yesterday's photos, and planning next week's schedule. I want to feel calm and creative today. I'm grateful for the beautiful weather and my morning coffee. I have a client meeting at 10 AM, then editing work in the afternoon."
