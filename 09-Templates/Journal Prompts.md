# 🎙️ Voice Journal Prompts

**Instructions:** Read these prompts out loud and answer them naturally. The AI will organize your responses automatically.

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
    const isJournal = window.journalRecording === true;
    window.journalRecording = false;
    
    app.commands.executeCommandById("audio-recorder:stop");
    new Notice("💾 Processing your journal...");
    
    const templateName = isJournal ? "Template - Voice Journal" : "Template - Voice Transcription";
    setTimeout(() => {
      const tpPlugin = app.plugins.plugins["templater-obsidian"];
      if (tpPlugin) {
        const tp = tpPlugin.templater;
        const templateFile = app.vault.getAbstractFileByPath(`Templates/${templateName}.md`);
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

## 💭 Mood
*"I'm feeling..."*

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

## 🔮 Tomorrow's Focus
*"Tomorrow I want to focus on..."*



---

## 📝 Additional Reflections
*Any other thoughts...*



---

> **Tip:** Just speak naturally! You don't need to follow this exact format. The AI will understand and organize your thoughts.

**Example:**
> "I'm grateful for my morning coffee, the sunny weather, and finishing that project. I'm feeling calm and focused. The best part of my day was the client meeting - they loved the photos! The biggest challenge was managing my time. I learned that taking breaks actually helps me work faster. Tomorrow I want to focus on editing the wedding shoot."

