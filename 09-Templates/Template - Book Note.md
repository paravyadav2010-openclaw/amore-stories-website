<%*
// 📚 BOOK NOTE TEMPLATE (AUTO-FETCH)
// Using Google Books API

// 1. Get Input
const query = await tp.system.prompt("📚 Book Title (Auto-Search):");
if (!query) { await app.vault.trash(app.workspace.getActiveFile(), true); return; }

// 2. Fetch Data (Google Books)
new Notice(`Searching Google Books for: ${query}...`);
let book = {
    title: query,
    author: "Unknown",
    published: "",
    cover: "",
    pages: "",
    description: "",
    rating: ""
};

try {
    const response = await requestUrl(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = response.json;
    
    if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo;
        book.title = info.title || query;
        book.author = info.authors ? info.authors.join(", ") : "Unknown";
        book.published = info.publishedDate || "";
        book.pages = info.pageCount || "";
        book.description = info.description || "";
        book.rating = info.averageRating || "";
        
        // Try to get high-res cover
        if (info.imageLinks) {
            book.cover = info.imageLinks.thumbnail.replace("http://", "https://").replace("&edge=curl", "");
        }
        new Notice("✅ Found Book: " + book.title);
    } else {
        new Notice("⚠️ Book not found. Using manual input.");
    }
} catch (e) {
    new Notice("Error fetching book: " + e.message);
}

// 3. Organization (Rename & Move)
const safeTitle = book.title.replace(/[:/\\|?*<>"]/g, "") || "Book " + tp.date.now("YYYYMMDD");
const folder = "2. Sources/Books";
try {
  await tp.file.rename(safeTitle);
  if (!app.vault.getAbstractFileByPath(folder)) { await app.vault.createFolder(folder); }
  if (!tp.file.folder().includes(folder)) { await tp.file.move(folder + "/" + safeTitle); }
} catch (e) { }

// 4. Output
%>---
tags:
  - book
  - source/book
aliases: ["<% book.title %>"]
author: "<% book.author %>"
status: reading
rating: <% book.rating %>
pages: <% book.pages %>
published: <% book.published %>
cover: "<% book.cover %>"
date_started: <% tp.date.now("YYYY-MM-DD") %>
date_finished: 
---

# <% book.title %>

> [!abstract] Book Info
> **Author:** <% book.author %>
> **Pages:** <% book.pages %>
> **Published:** <% book.published %>

## 🚀 The Book in 3 Sentences
<% book.description ? `> ${book.description.substring(0, 300)}...` : "" %>

## 🎨 Impressions

## 📖 Who Should Read It?

## ✍️ My Top 3 Quotes

## 📝 Summary + Notes

### Summary
- (Your raw notes, highlights, and thoughts as you read)

### Raw Notes & Highlights (Capture)
- (For unprocessed highlights, quotes, or fleeting thoughts)

### Distilled Ideas (Distill)
- (Summarize the key ideas and concepts in your own words)

### Related Permanent Notes (Express)
- 

