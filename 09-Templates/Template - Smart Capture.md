<%*
// 1. Get Input
let text = await tp.system.prompt("🧠 What's on your mind?");

// HANDLE CANCELLATION (Esc/Cancel)
if (text === null) {
    // If user cancelled, we shouldn't leave a blank file.
    // Since this template is usually run on a NEW file created by the button, we trash it.
    const currentFile = app.workspace.getActiveFile();
    if (currentFile.name.includes("Untitled")) {
        await app.vault.trash(currentFile, true);
    }
    return; // Stop execution
}

if (!text) text = "Untitled Thought"; // Empty enter maps to untitled

if (!text) { text = "Untitled Thought"; }

// 2. Get API Key
const keyFile = app.vault.getAbstractFileByPath("Keys/gemini_api_key.md");
if (!keyFile) { new Notice("❌ Key file missing"); return; }
const apiKey = (await app.vault.read(keyFile)).trim();

// 3. Relentless AI Call
// We switch to "gemini-flash-latest" (Stable 1.5) which often has better limits than Previews
const MODEL_NAME = "gemini-flash-latest";
new Notice(`✨ Connecting to AI (${MODEL_NAME})...`);

let response = null;
let errorMsg = "";

// Helper: Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGeminiWithRetry() {
    // Try up to 6 times (Approx 30-40 seconds of patience)
    const maxRetries = 6;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (i > 0) new Notice(`🚦 Traffic limit hit. Waiting 5s... (Attempt ${i+1}/${maxRetries})`);
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: `Analyze this input: "${text}"
                        
                        Return a JSON object with:
                        1. "title" (short, punchy title)
                        2. "summary" (one sentence)
                        3. "tags" (array of 3-5 lowercase tags)
                        4. "content" (The note body. IMPORTANT: If the input resembles a list, tasks, or groceries, format it as a clickable Markdown checklist using '- [ ]'. Otherwise, format consistently with headers/bullets.)`
                    }]
                }]
            };
            
            const req = await requestUrl({
                url: `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            
            if (req.status === 200) return req;
            if (req.status !== 429) throw new Error(`HTTP Error ${req.status}`);
            
            // If 429, throw to catch block to trigger wait
            throw new Error("429");
            
        } catch (e) {
            if (e.message.includes("429") || e.status === 429) {
                if (i === maxRetries - 1) throw new Error("Rate limit persistent. Try again in 5 mins.");
                await sleep(5000 + (i * 1000)); // Wait 5s, 6s, 7s...
                continue;
            }
            throw e; // specific error, don't retry
        }
    }
}

try {
    const responseRaw = await callGeminiWithRetry();
    const data = responseRaw.json;
    if (!data.candidates) throw new Error("No candidates.");
    
    const rawText = data.candidates[0].content.parts[0].text;
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    response = JSON.parse(jsonString);
    new Notice("✅ AI Success!");

} catch (e) {
    console.error(e);
    errorMsg = e.message;
    new Notice("❌ AI Failed: " + e.message);
    
    response = { 
        title: "Capture " + tp.date.now("YYYYMMDD HHmmss"), 
        summary: "⚠️ AI Error: " + e.message, 
        tags: ["ai-error"],
        content: text // Fallback to raw text
    };
}

// 4. Output Logic (The "Frictionless" Upgrade)
// If we are in an "Untitled" file, we use it. 
// If we are in a Daily Note or real note, we create a NEW file.

// 4. Output Logic
// We detect if we are running in the active file (Selection Mode) or a new background file (Button Mode)
const activeFile = app.workspace.getActiveFile();
const currentFilePath = tp.file.path(true);
const isBackgroundRun = activeFile.path !== currentFilePath;
const isUntitled = activeFile.name.includes("Untitled");

const safeTitle = response.title.replace(/[:/\\|?*<>"]/g, "") || "Note " + tp.date.now("HHmmss");

// Content Construction
const fileContent = `---
created: ${tp.date.now("YYYY-MM-DD HH:mm")}
tags:
${response.tags.map(t => `  - ${t}`).join("\n")}
ai_processed: ${errorMsg ? "false" : "true"}
---

# ${response.title}

> [!summary] AI Summary
> ${response.summary}

## Notes
${response.content || text}

${errorMsg ? `\n---\n### 🛑 Debug Info\n**Error:** \`${errorMsg}\`\n` : ""}
`;

try {
    // If we are in an Untitled file OR running in background (Quick Action), we populate THIS file.
    if (isUntitled || isBackgroundRun) {
        await tp.file.rename(safeTitle);
        // We move it to Inbox if it's not already there
        if (!tp.file.folder().includes("Inbox")) {
             await tp.file.move("1. Inbox/" + safeTitle);
        }
        tR = fileContent; // Output the content directly
    } else {
        // We are in a named note and selected text -> Create NEW file (Extraction)
        await tp.file.create_new(fileContent, safeTitle, true, "1. Inbox");
        new Notice("✨ Capture Saved to Inbox!");
        tR = selection || ""; // Keep original selection
    }
} catch (e) {
    console.error("File logic failed:", e);
    tR = fileContent; // Fallback
}
%>
