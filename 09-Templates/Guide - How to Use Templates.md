### How to Use Templates in Obsidian

First, ensure the **Templates** core plugin is enabled and configured:
1.  Go to `Settings` > `Core Plugins` and make sure **Templates** is turned on.
2.  In the options for the **Templates** plugin, set the "Template folder location" to `_Templates`.
3.  Now, when you're in a new note, you can use the command palette (`Cmd/Ctrl + P`) and search for "Templates: Insert template" to insert the content of a template file. You can also set a hotkey for this.

---

### Guide to Your Templates

Here’s a breakdown of each template and how to use it:

#### 1. Source Note (`Template - Source Note.md`)

*   **Purpose:** To capture notes and key ideas from external sources like books, articles, or videos. This is your "literature note."
*   **How to Use:**
    1.  Create a new note in the appropriate folder, like `📚 Sources/Books/`.
    2.  Insert the `Template - Source Note`.
    3.  **Title:** Change `{{title}}` to the title of the book, article, or video.
    4.  **Frontmatter:** Update the `status` (e.g., `in progress`, `read`) and `tags`.
    5.  **Details:** Fill in the `Type`, `Author/Creator`, and `Link`.
    6.  **Summary:** After finishing the source, write a brief summary in your own words.
    7.  **Key Ideas & Quotes:** Capture the most important concepts and memorable quotes as you go.
    8.  **Zettels to Create:** This is the most important step. As you identify a core, atomic idea, create a link for a new Permanent Note (e.g., `[[New Idea Title]]`). You will create these notes later using the Zettel template.

#### 2. Permanent Note (`Template - Zettel.md`)

*   **Purpose:** To store a single, atomic idea. This is the core of your knowledge base. These notes are meant to be linked together to form a web of ideas.
*   **How to Use:**
    1.  Create a new note in your `Permanent Notes` folder. The filename should be the title of the idea itself (e.g., `Environment design is more powerful than motivation.md`).
    2.  Insert the `Template - Zettel`.
    3.  **Title:** The title of the note will automatically be the filename.
    4.  **Source:** Link back to the source note where the idea came from (e.g., `Source: [[Atomic Habits]]`).
    5.  **Explanation:** Explain the idea in your own words. Focus on what it means, why it matters, and how you might use it. Keep it concise.
    6.  **Links:** Link to other Permanent Notes that are related to this idea. This is how you build connections in your knowledge.
    7.  **Tags:** Add specific tags (e.g., `#productivity`, `#habits`).

#### 3. Project Note (`Template - Project.md`)

*   **Purpose:** To manage a specific, actionable project with a clear outcome.
*   **How to Use:**
    1.  Create a new note in the `🎯 Goals & Projects` folder.
    2.  Insert the `Template - Project`.
    3.  **Title:** Name your project.
    4.  **Metadata:** Link to the broader `Area` or `Goal` this project serves.
    5.  **Outcome:** Clearly define what "done" looks like.
    6.  **Plan:** Break the project down into concrete, actionable steps.
    7.  **Progress:** Keep a running log of updates to track your journey.

#### 4. Client Note (`Template - Client.md`)

*   **Purpose:** To keep all information about a photography client in one place.
*   **How to Use:**
    1.  Create a new note in `📸 Photography Business/Clients`. A good filename is `Client – [Client Name] – [Date]`.
    2.  Insert the `Template - Client`.
    3.  Fill in all the details before the shoot (`Status`, `People`, `Preferences`, `Plan`).
    4.  The `Poses` field already links to your `[[Posing Guide – Family Sessions]]` note for quick reference during a shoot.
    5.  After the shoot, use the checklist to track your post-production workflow (`Culling`, `Editing`, `Gallery delivered`).

#### 5. Daily Note (`Template - Daily Note.md`)

*   **Purpose:** To plan your day, focus your efforts, and conduct a "shutdown ritual" to end your workday with a clear mind.
*   **How to Use:**
    1.  Enable the **Daily notes** core plugin in `Settings` > `Core Plugins`.
    2.  In the plugin settings, set the "Template file location" to `_Templates/Template - Daily Note.md`.
    3.  Now, when you click the "Open today's daily note" button in the sidebar, a new note will be created with this template automatically.
    4.  Fill it out throughout your day to stay organized and focused.
