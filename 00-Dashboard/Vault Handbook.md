# 📘 Vault Handbook: The Master Manual

Welcome to your **AI-Enhanced, Self-Organizing Second Brain**.
This vault helps you capture ideas instantly, manage projects effortlessly, and turn content into knowledge.

---

## ⚡ Quick Start (The "One-Button" Rule)
Everything in this vault starts from the **Dashboard** (`Cmd+H` or `00. Home (Dashboard)`).
All action buttons are **"Prompt-First"**—you click, it asks, it creates.

| Button | Function | Destination |
| :--- | :--- | :--- |
| **✎ Note** | For quick thoughts, tasks, or random ideas. Uses AI to tag/format. | `1. Inbox` |
| **⚡ Project** | Asks for **Name** & **Area**. Creates a project dashboard. | `4. Goals & Projects` |
| **👤 Client** | Asks for **Client Name**. Creates a shoot planner. | `5. Photography` |
| **📖 Book** | Asks for **Title** & **Author**. Auto-tags as source. | `2. Sources/Books` |
| **⏯️ Watch/Listen** | Asks for **URL**. Auto-fetches Title/Author + **AI Summary**. | `1. Inbox` |
| **🧹 Janitor** | **Auto-Sorts All Files**. Moves files to correct folders based on tags. | *Smart Organize* |

> [!check] Safety Feature
> If you click a button but change your mind, just press **`Esc`** or **`Cancel`**. 
> The system will **cleanly delete** the partial file. No "Untitled" clutter!

---

## 📓 The Elegant Journal System
This vault features a **smart, premium journaling** experience.

### 1. Creating a Journal
*   Click **`📔 Journal`** on the Dashboard (or press `Cmd+D`).
*   It creates today's note with a **Hero Header** containing:
    *   Beautiful Gradient Banner
    *   Today's Date
    *   Inspirational Daily Quote
    *   **🎙️ Capture Button**

### 2. Voice AI Journaling 🎙️
Stop typing. Just speak.
1.  Click **"🎙️ Capture"** inside your journal.
2.  Talk about your day.
    *   **Morning?** Talk about plans, exercise, priorities.
    *   **Evening?** Talk about wins, challenges, gratitude.
3.  Click **"⏹️ Finish"**.
4.  **AI Magic:** It automatically detects if it's Morning or Evening and fills in the correct sections using sophisticated structure.

### 3. Mood Tracking 📊
In the **Evening Section**, you have a Smart Mood Picker:
*   **Use the Dropdown:** Select a score (1-10).
*   **Zero Clutter:** The score is saved in the file's background (metadata) but displayed cleanly in the dropdown.
*   **Re-selectable:** Changed your mind? Just pick a new number.

---

## 🧠 Think Mode (Universal Capture)
Built directly into the **`✎ Note`** button.
1.  Click **`✎ Note`** -> Select **`🧠 Think Mode`**.
2.  Speak your mind (ideas, rants, drafts).
3.  Click **Stop**.
4.  **Result:** A perfectly formatted markdown note with **AI Summary**, **Key Points**, and a **To-Do List** derived from your speech.

---

## 🏗️ Structure & "The Janitor"
You never need to manually move files.
1.  Create files anywhere (usually Inbox).
2.  Add tags (`#project`, `#book`, `#client`).
3.  Click **`🧹 Janitor`** on the Dashboard.
4.  **Done!** Files fly to their correct folders automatically.

| Tag | Moves To |
| :--- | :--- |
| `#source`, `#book` | `2. Sources` |
| `#project` | `4. Goals & Projects` |
| `#client` | `5. Photography` |
| `#archive` | `6. Archive` |
| *(No Tag)* | `1. Inbox` |

---

## 🗂️ Zettelkasten (Knowledge Base)
Build an interconnected web of ideas.

### The Workflow
1.  **Capture:** Read something interesting.
2.  **Create:** Run `Template - Zettel Script` (Cmd+P).
3.  **Link:** Connect it to other notes using `[[...]]`.
4.  **Sort:** The Janitor will auto-sort it into `Concepts`, `Facts`, or `Questions` based on type.

---

## 🛠️ Admin & Setup (Handover Guide)
If you are setting this up on a new device, follow these steps:

### 1. Required Plugins
Ensure these core plugins are installed and enabled:
*   **Templater:** For all automation scripts.
*   **Dataview:** For dashboards and the mood picker.
*   **Audio Recorder:** For voice capture.
*   **Note Toolbar:** For the button bar on top of notes.
*   **Buttons:** For the Dashboard interface.

### 2. API Keys (Critical)
The AI features (Voice, Summaries) rely on **Google Gemini**.
*   **Location:** Keys are stored in `Keys/gemini_api_key.md`.
*   **Format:** The file simply contains the API key string (or multiple keys separated by newlines for rotation).
*   **Update:** If AI stops working, generate a new free API key from Google AI Studio and paste it there.

### 3. Troubleshooting
*   **"tp is not defined":** Restart Obsidian.
*   **AI Error:** Check your internet connection or update the API Key.
*   **Formatting Issues:** Run the **Janitor** button to tidy up the vault.

---
*System Design by Antigravity*
