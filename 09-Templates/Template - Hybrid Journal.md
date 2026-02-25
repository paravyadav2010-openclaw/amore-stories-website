---
date: <% tp.date.now("YYYY-MM-DD") %>
type: journal
sleep_hours: 
energy_score: 
mood_morning:
mood_evening:
relationship_score:
habits: []
highlight: ""
tags: [journal, hybrid-journal]
---
<%*
// ⚡️ HYBRID JOURNAL TEMPLATE
// Rename Note if Untitled
const date = tp.date.now("YYYY-MM-DD");
if (tp.file.title.startsWith("Untitled")) {
    await tp.file.rename(`Journal ${date}`);
}
%>

```dataviewjs
// 1. Hero Header
await dv.view("Templates/Scripts/HeroHeader");
```

```dataviewjs
// 2. Photo Gallery (Grid)
await dv.view("Templates/Scripts/PhotoGallery");
```

```dataviewjs
// 3. Daily Data Tracker (Dropdowns)
await dv.view("Templates/Scripts/DailyTracker");
```

# 🎯 The Big 3
> *If I only get 3 things done today, what must they be?*

- [ ] 🔴 
- [ ] 🟡 
- [ ] 🟢 

---

### 📝 Notes & Thoughts
- 

---

### 🌙 Evening Retrospective
> *Kaizen: What is ONE thing I can improve tomorrow?*

- **📉 Improvement:** 
- **✅ Wins:** 
- **🙏 Gratitude:** 

```dataviewjs
// 4. Daily Wisdom
await dv.view("Templates/Scripts/DailyQuotes");
```
