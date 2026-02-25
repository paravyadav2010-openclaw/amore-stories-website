# 🌙 Evening Journal Prompts

**Good evening!** Take 3-5 minutes to reflect on your day.

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
    window.eveningJournal = true; // Flag for evening
    
    app.commands.executeCommandById("audio-recorder:stop");
    new Notice("💾 Processing your evening journal...");
    
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

## 🙏 Gratitude (3 things)
*"I'm grateful for..."*

1. 
2. 
3. 

---

## 💭 Mood Check
*"Today I felt..."*

(Examples: happy, calm, anxious, excited, tired, peaceful, stressed, energized)

---

## ⭐ Highlight of the Day
*"The best part of my day was..."*



---

## 🎯 Challenge I Faced
*"The biggest challenge today was..."*



---

## 💡 What I Learned
*"Today I learned that..."*



---

## ✅ Wins & Accomplishments
*"Today I accomplished..."*



---

## 🔮 Tomorrow's Focus
*"Tomorrow I want to focus on..."*



---

## 📝 Additional Reflections
*Any other thoughts...*



---

> **Tip:** Just speak naturally! Example:
> 
> "I'm grateful for the successful client meeting, my supportive partner, and the beautiful sunset I saw. Today I felt calm and focused. The best part of my day was when the client loved the photos. The biggest challenge was managing my time between editing and meetings. I learned that taking breaks actually helps me work faster. Today I accomplished finishing the wedding shoot edit and planning next week. Tomorrow I want to focus on the new client consultation."
