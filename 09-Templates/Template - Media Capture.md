<%*
// 1. Get Input
const url = await tp.system.prompt("🔗 Paste Link (YouTube/Spotify) or 'Skip'");
if (!url) return; // Stop execution

// 2. Fetch Metadata & Content (Smart)
let title = null;
let author = null;
let description = "";

if (url && url !== "Skip") {
    new Notice("⏳ Fetching metadata...");
    try {
        const html = await requestUrl({ url: url }).text;
        
        // Extract Title
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1]
                .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                .replace(" - YouTube", "")
                .trim();
        }

        // Extract Author
        const authorMatch = html.match(/<link itemprop="name" content="(.*?)">/) || html.match(/<meta name="author" content="(.*?)">/i);
        if (authorMatch && authorMatch[1]) author = authorMatch[1].trim();

        // Extract Description (for AI Context)
        const descMatch = html.match(/<meta name="description" content="(.*?)">/i) || html.match(/<meta property="og:description" content="(.*?)">/i);
        if (descMatch && descMatch[1]) description = descMatch[1].replace(/&quot;/g, '"');

    } catch (e) { console.error("Fetch failed", e); }
}

// Fallback Title
if (!title) title = await tp.system.prompt("📝 Enter Title:");

// 3. AI Summarization (Gemini)
let aiSummary = "> [!info] AI Status\n> Processing...";
let aiTakeaways = "- Waiting for AI...";
let debugError = "";

try {
    const keyFile = app.vault.getAbstractFileByPath("Keys/gemini_api_key.md");
    if (keyFile) {
        const apiKey = (await app.vault.read(keyFile)).trim();
        new Notice("🧠 Generating AI Summary...");
        
        // Sanitize inputs
        const safeDesc = description ? description.substring(0, 1000) : "No description available.";
        
        const prompt = `Analyze this media content.
        
        Title: ${title}
        Author: ${author || "Unknown"}
        URL: ${url}
        Context/Description: ${safeDesc}
        
        Task:
        1. **Summary:** Write 2-3 short, punchy bullet points explaining the core content. Use simple, easy-to-understand language (EL15). Use **Australian English**.
        2. **Takeaways:** List 3-5 practical key takeaways.
        
        Return STRICT JSON format: { "summary_points": ["...", "..."], "takeaways": ["...", "...", "..."] }`;

        // Helper: Sleep
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Helper: Retry Wrapper
        async function callGemini(payload) {
            const maxRetries = 3;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const req = await requestUrl({
                        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    
                    if (req.status === 200) return req;
                    if (req.status === 503 || req.status === 429) {
                        throw new Error(`Busy (${req.status})`);
                    }
                    throw new Error(`HTTP ${req.status}`);
                    
                } catch (e) {
                    if (i === maxRetries - 1) throw e;
                    new Notice(`⚠️ AI Busy, retrying (${i+1}/${maxRetries})...`);
                    await sleep(2000 * (i + 1)); // Wait 2s, 4s...
                }
            }
        }

        // Use 'gemini-flash-latest' (Matches working Smart Capture template)
        const response = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });

        if (response.status !== 200) {
            throw new Error(`API Error ${response.status}`);
        }

        const data = response.json;
        if (!data.candidates || !data.candidates[0].content) {
             throw new Error("No AI response content");
        }

        const raw = data.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
        const json = JSON.parse(raw);
        
        // Handle both old "summary" string and new "summary_points" array
        if (Array.isArray(json.summary_points)) {
             aiSummary = json.summary_points.map(s => `> - ${s}`).join("\n");
        } else {
             aiSummary = `> ${json.summary}`;
        }
        
        aiTakeaways = json.takeaways.map(t => `- ${t}`).join("\n");
        new Notice("✅ AI Summary Complete!");
    } else {
        aiSummary = "⚠️ API Key missing (Keys/gemini_api_key.md)";
    }
} catch (e) {
    console.error("Gemini Error:", e);
    debugError = e.message; // Capture error
    aiSummary = `❌ AI Failed: ${e.message}`;
}


// 4. Auto-Detect Type
let type = "video"; // Default
if (url.includes("spotify") || url.includes("apple.com/podcast")) { type = "podcast"; }

// 5. Metadata
const date = tp.date.now("YYYY-MM-DD HH:mm");
const status = "Watched"; // User requested change from To Watch
const folder = type === "podcast" ? "2. Sources/Podcasts" : "2. Sources/YouTube";

// 6. Filename (Max 5 words)
let cleanTitle = title.replace(/[:/\\|?*<>"]/g, "").trim();
let words = cleanTitle.split(/\s+/);
if (words.length > 5) cleanTitle = words.slice(0, 5).join(" ");
let safeTitle = cleanTitle || "Media " + tp.date.now("YYYYMMDD HHmm");

// 7. Structure Note
let frontmatter = `created: ${date}
tags:
  - ${type}
  - media
  - to-watch
url: "${url === 'Skip' ? '' : url}"
status: ${status}`;
if (author) frontmatter += `\n${type === 'video' ? 'channel' : 'author'}: "${author}"`;

const content = `---
${frontmatter}
---

# ${title}

> [!abstract] Meta
> **URL:** ${url}
> **Type:** ${type.toUpperCase()}
${author ? `> **Channel:** ${author}` : ""}

> [!summary] AI Overview
> ${aiSummary}

## 📝 Notes
- 

## 🧠 Key Takeaways
${aiTakeaways}

`;

// 6. File Handling (Fix Duplicate Bug)
// We are ALREADY in a new file (created by the button). We just need to rename and move it.
try {
    const currentFile = app.workspace.getActiveFile();
    await tp.file.rename(safeTitle);
    
    // Check if destination folder exists
    if (!app.vault.getAbstractFileByPath(folder)) {
        await app.vault.createFolder(folder);
    }
    
    // Move to correct folder
    if (!tp.file.folder().includes(folder)) {
        await tp.file.move(folder + "/" + safeTitle);
    }

} catch (e) {
    new Notice("Error moving file: " + e.message);
}

// 7. Output to THIS file
tR = content;
%>
