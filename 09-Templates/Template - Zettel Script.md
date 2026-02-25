<%*
// 1. Get Source File Name
let sourceFile = "Unknown Source";
try {
  const activeFile = app.workspace.getActiveFile();
  if (activeFile && activeFile.basename !== tp.file.title) {
    sourceFile = activeFile.basename;
  }
} catch (e) {}

// 2. Get Title (Selection vs Prompt)
let selection = tp.file.selection();
let zettelTitle = selection;

if (!zettelTitle) {
    zettelTitle = await tp.system.prompt("💡 What is the core idea?");
} else {
    // Sanitize selection for filename (shorten + remove invalid chars)
    zettelTitle = zettelTitle.replace(/\n/g, " ").slice(0, 50).replace(/[:/\\|?*<>"]/g, "");
}

// Default fallback
if (!zettelTitle) { zettelTitle = "Untitled Idea " + tp.date.now("HHmm"); }

// 3. Select Note Type
const type = await tp.system.suggester(
    ["💡 Concept", "🧪 Fact", "❓ Question", "🧱 Principle"],
    ["concept", "fact", "question", "principle"],
    true,
    "📂 What type of note is this?"
);

// 4. Smart Linking (V3): Connect to existing ideas
let relatedLink = "";
// Get all markdown files in "3. Permanent Notes"
const files = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("3. Permanent Notes"));
if (files.length > 0) {
    const selectedFile = await tp.system.suggester(
        (f) => f.basename, 
        files, 
        false, 
        "🔗 Does this relate to an existing idea?"
    );
    if (selectedFile) {
        relatedLink = `- [[${selectedFile.basename}]]`;
    }
}

// 5. Rename File
await tp.file.rename(zettelTitle);
%>---
type: zettel
subtype: <% type %>
aliases: []
status: seedling
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
source: [[<% sourceFile %>]]
tags:
  - type/<% type %>
  - status/seedling
---

# <% zettelTitle %>

**Source:** [[<% sourceFile %>]]
**Created:** [[<% tp.date.now("YYYY-MM-DD") %>]]

> [!quote] Context
> <% selection ? selection : "*No original text selected*" %>

## Explanation


## Connections
<% relatedLink %>
- 