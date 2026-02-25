<%*
/**
 * 🧹 Vault Janitor (Auto-Organizer)
 * 
 * Logic:
 * 1. Root Cleanup: Moves loose files from Root -> "1. Inbox"
 * 2. Inbox Sorting: Moves files from "1. Inbox" -> "2. Sources", "4. Goals", etc. based on tags.
 */

new Notice("🧹 Janitor starting...");
let movedCount = 0;

// Configuration
const FOLDERS = {
    INBOX: "1. Inbox",
    SOURCES: "2. Sources", 
    PROJECTS: "4. Goals & Projects",
    ARCHIVE: "6. Archive"
};

// 0. CLEANUP: Delete empty Untitled files from Inbox (from Voice Journal processing)
const inboxFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith(FOLDERS.INBOX));
for (const file of inboxFiles) {
    if (file.name.startsWith("Untitled")) {
        const content = await app.vault.read(file);
        // Delete if empty or only has template markers
        if (content.trim().length === 0 || content.trim() === "<%*" || content.trim() === "%>") {
            await app.vault.delete(file);
            new Notice(`🗑️ Deleted empty: ${file.name}`);
        }
    }
}

// 1. Get all markdown files
const files = app.vault.getMarkdownFiles();

for (const file of files) {
    // Skip if in valid folders (except Inbox which we scan for processing)
    // We check if the PATH starts with these folders to respect sub-directories
    if (file.path.startsWith(FOLDERS.SOURCES) || 
        file.path.startsWith(FOLDERS.PROJECTS) || 
        file.path.startsWith(FOLDERS.ARCHIVE) ||
        file.path.startsWith("Templates") || 
        file.path.startsWith("Keys") ||
        file.path.startsWith("Excalidraw") ||
        file.path.startsWith("3. Permanent Notes/Daily Notes") ||
        file.path.startsWith("3. Permanent Notes/Zettelkasten") ||
        file.path.startsWith("3. Permanent Notes") || 
        file.path.startsWith("5. Photography Business")) {
        continue;
    }

    let destination = null;
    let reason = "";

    // A. Root Cleanup (If file is in root "/")
    if (file.parent.path === "/") {
        // EXCEPTION: Don't move the Dashboard or Handbook
        if (file.name.includes("Home (Dashboard)") || file.name.includes("Vault Handbook")) {
            continue;
        }
        destination = FOLDERS.INBOX;
        reason = "Root -> Inbox";
    }

    // B. Tag-Based Sorting (If file is in Inbox or currently being moved to Inbox)
    // We get the cache to read tags
    const cache = app.metadataCache.getFileCache(file);
    let tags = [];
    
    // Extract Inline Tags
    if (cache?.tags) {
        tags.push(...cache.tags.map(t => t.tag));
    }
    
    // Extract Frontmatter Tags
    if (cache?.frontmatter?.tags) {
        let fmt = cache.frontmatter.tags;
        if (!Array.isArray(fmt)) fmt = String(fmt).split(",").map(t => t.trim());
        
        fmt.forEach(t => {
            if (t) tags.push(t.startsWith("#") ? t : "#" + t);
        });
    }

    // Checking Rules
    // ZETTELKASTEN SORTING (Priority: Check first)
    if (cache?.frontmatter?.type === "zettel") {
        const subtype = cache?.frontmatter?.subtype;
        if (subtype === "concept") {
            destination = "3. Permanent Notes/Zettelkasten/Concepts";
            reason = "Zettel: Concept";
        } else if (subtype === "fact") {
            destination = "3. Permanent Notes/Zettelkasten/Facts";
            reason = "Zettel: Fact";
        } else if (subtype === "question") {
            destination = "3. Permanent Notes/Zettelkasten/Questions";
            reason = "Zettel: Question";
        } else if (subtype === "principle") {
            destination = "3. Permanent Notes/Zettelkasten/Principles";
            reason = "Zettel: Principle";
        }
    }
    
    // STANDARD TAG-BASED SORTING (If not a Zettel)
    if (!destination && tags.some(t => t.includes("book"))) {
        destination = FOLDERS.SOURCES + "/Books";
        reason = "Tag: Book";
    } else if (tags.some(t => t.includes("podcast"))) {
        destination = FOLDERS.SOURCES + "/Podcasts";
        reason = "Tag: Podcast";
    } else if (tags.some(t => t.includes("youtube") || t.includes("video"))) {
        destination = FOLDERS.SOURCES + "/YouTube";
        reason = "Tag: YouTube/Video";
    } else if (tags.some(t => t.includes("source") || t.includes("article"))) {
        destination = FOLDERS.SOURCES;
        reason = "Tag: Source";
    } else if (tags.some(t => t.includes("project") || t.includes("goal"))) {
        destination = FOLDERS.PROJECTS;
        reason = "Tag: Project";
    } else if (tags.some(t => t.includes("archive") || cache?.frontmatter?.status === "archived")) {
        destination = FOLDERS.ARCHIVE;
        reason = "Tag: Archive";
    }

    // C. Move File
    if (destination && file.parent.path !== destination) {
        // Double check destination folder exists
        const targetFolder = app.vault.getAbstractFileByPath(destination);
        if (targetFolder) {
            const newPath = destination + "/" + file.name;
            try {
                // Check if file name conflict
                if (app.vault.getAbstractFileByPath(newPath)) {
                    console.warn(`Skipping ${file.name}: Destination exists.`);
                    continue;
                }
                
                await app.fileManager.renameFile(file, newPath);
                console.log(`🧹 Moved [${file.name}] to [${destination}] (${reason})`);
                movedCount++;
            } catch (e) {
                console.error(`Failed to move ${file.name}`, e);
            }
        }
    }
}

new Notice(`✨ Janitor finished! Moved ${movedCount} files.`);

// Self-Destruct: Delete this log file so we don't clutter the vault
// We wait a tiny bit to ensure execution finishes
setTimeout(async () => {
    const activeFile = app.workspace.getActiveFile();
    if (activeFile && activeFile.name.includes("Untitled")) {
        await app.vault.trash(activeFile, true);
    }
}, 1000);
%>
