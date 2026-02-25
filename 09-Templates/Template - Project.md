<%*
// ⚡ PROJECT TEMPLATE
// INTERACTIVE MODE

// 1. Get Input: Project Name
const title = await tp.system.prompt("⚡ Project Name:");
if (!title) { await app.vault.trash(app.workspace.getActiveFile(), true); return; }

// 2. Get Input: Client (Auto-Link)
const clientFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("5. Photography Business/Clients"));
const clientNames = clientFiles.map(f => f.basename);
clientNames.unshift("None (Personal)");
const client = await tp.system.suggester(clientNames, clientNames);
if (!client) { await app.vault.trash(app.workspace.getActiveFile(), true); return; }

// 3. Get Input: Area
const area = await tp.system.prompt("📂 Area (e.g. Health, Work):") || "General";
if (area === null) return;

// 4. Set Metadata
const date = tp.date.now("YYYY-MM-DD");
const safeTitle = title.replace(/[:/\\|?*<>"]/g, "") || "Project " + tp.date.now("YYYYMMDD");
const folder = "4. Goals & Projects";

// 5. Rename & Move
try {
  await tp.file.rename(safeTitle);
  if (!app.vault.getAbstractFileByPath(folder)) { await app.vault.createFolder(folder); }
  if (!tp.file.folder().includes(folder)) { await tp.file.move(folder + "/" + safeTitle); }
} catch (e) { }

// 6. Output Content
%>---
type: project
status: active
tags:
  - project
  - <% area.replace(" ", "-").toLowerCase() %>
alias: "<% title %>"
client: <% client !== "None (Personal)" ? `[[${client}]]` : "" %>
created: <% date %>
updated: <% date %>
---

# Project – <% title %>

> [!abstract] Overview
> **Status:** Active
> **Area:** [[<% area %>]]
> **Client:** <% client !== "None (Personal)" ? `[[${client}]]` : "N/A" %>
> **Goal:** 

## 🎯 Outcome
> **Definition of Done:** 

## 🧠 Why This Matters
1. 

## 🗓️ Plan
- [ ] Step 1
- [ ] Step 2

## 📝 Notes & Ideas
- 

## 📊 Progress Log
| Date | Update |
|:----:|:-------|
| <% date %> | Project Initiated | 
