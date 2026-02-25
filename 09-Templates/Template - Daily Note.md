# <% tp.date.now("YYYY-MM-DD") %> – <% tp.date.now("dddd") %>

**Week**: <% tp.date.now("gggg-[W]ww") %> | **Weather**: ☀️

---

## 🎯 Top 3 Priorities
- [ ] 
- [ ] 
- [ ] 

## 📝 Quick Capture
<!-- Brain dump area - capture thoughts freely throughout the day -->


## 📝 Today's Captures
```dataview
LIST
WHERE file.cday = this.file.day 
  AND !contains(file.path, "Daily Notes")
  AND !contains(file.path, "Templates")
  AND !contains(file.path, "Keys")
SORT file.ctime DESC
LIMIT 20
```

## ⚡ Active Projects
```dataview
TABLE status as Status, file.mtime as "Last Updated"
FROM "4. Goals & Projects"
WHERE status = "active"
LIMIT 5
```

## 📖 Currently Reading
```dataview
TABLE author as Author, status as Status
FROM "2. Sources/Books"
WHERE status = "reading"
LIMIT 3
```

---

## 🔗 Links & References
<!-- Add [[links]] to related notes as you work -->


## 🌙 Evening Reflection
- **What went well?** 
- **What to improve?** 
- **Tomorrow's focus:** 

---

> *Created: <% tp.date.now("HH:mm") %>*
