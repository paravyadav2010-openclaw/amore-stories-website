<%*
// 🎙️ VOICE TRANSCRIPTION TEMPLATE (v1.0)
// Powered by Gemini 1.5 Flash
// ----------------------------------------

// 1. Configuration
const API_KEY_FILE = "Keys/gemini_api_key.md";
const AUDIO_EXTENSIONS = ["m4a", "webm", "mp3", "wav", "ogg"];
const LOOKBACK_MINUTES = 60; // Only look for audio created in the last hour

// 2. Helper: Get API Keys
const apiKeyFile = app.vault.getAbstractFileByPath(API_KEY_FILE);
if (!apiKeyFile) { new Notice("❌ API Key file not found!"); return; }
const fileContent = await app.vault.read(apiKeyFile);
const apiKeys = fileContent.split("\n").map(k => k.trim()).filter(k => k.length > 5);

// 3. Helper: Find Latest Audio File
const files = app.vault.getFiles();
const recentAudio = files.filter(f => {
    return AUDIO_EXTENSIONS.includes(f.extension) && 
           (Date.now() - f.stat.ctime < LOOKBACK_MINUTES * 60 * 1000);
}).sort((a, b) => b.stat.ctime - a.stat.ctime);

let audioFile = null;

if (recentAudio.length === 0) {
    // If no recent file, ask user to pick one? Or just fail.
    // Let's try to prompt if nothing recent found, or just fail for speed.
    new Notice("⚠️ No recent audio recording found (last 60 mins).");
    return;
} else {
    audioFile = recentAudio[0];
}

new Notice(`🎙️ Transcribing: ${audioFile.name}...`);

// 4. Helper: ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// 5. Read & Prepare Audio
const audioBuffer = await app.vault.readBinary(audioFile);
const base64Audio = arrayBufferToBase64(audioBuffer);
const mimeType = "audio/" + (audioFile.extension === "m4a" ? "mp4" : audioFile.extension);

// 6. Call Gemini API
// const endpoint = ... (Defined in loop below)
new Notice("🧠 Analyzing Audio (Gemini Flash)...");



const prompt = `
You are a note-taking assistant specialized in Indian English transcription. 
1. Transcribe the audio verbatim based on these rules:
   - Preserves Indian English pronunciation patterns
   - **REMOVE disfluencies**: Delete repeated words, stutters ("I-I-I"), and filler words ("um," "uh," "you know")
   - **Keep voice intact**: Maintain natural Indian English expressions and vocabulary
   - **Smart cleaning**: Remove ONLY unintentional repetitions, keep intentional emphasis

2. Analyze it to generate a concise, valid JSON object.
3. Determine the best folder based on these rules:
   - "2. Sources/Books" (if discussing a book)
   - "4. Goals & Projects" (if planning a project)
   - "5. Photography Business" (if client/shoot related)
   - "1. Inbox" (default/random thoughts)

Output ONLY this JSON format:
{
  "title": "A short, descriptive file name (no special chars)",
  "transcript": "The full verbatim text with proper markdown headings and bullets...",
  "summary": "A 3-bullet point summary...",
  "tags": ["tag1", "tag2"],
  "folder": "The Determined Folder Path"
}
`;

try {
    let response;
    let lastError;
    
    for (let i = 0; i < apiKeys.length; i++) {
        const currentKey = apiKeys[i];
        const ep = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${currentKey}`;
        
        if (i > 0) new Notice(`🔄 Switching to API Key ${i + 1}...`);
        
        try {
            response = await requestUrl({
                url: ep,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: mimeType, data: base64Audio } }
                        ]
                    }]
                })
            });
            lastError = null;
            break; // Success
        } catch (err) {
            lastError = err;
            if (err.status === 429 || err.status === 503 || err.status === 401) continue;
            throw err;
        }
    }
    
    if (lastError) throw lastError;

    const result = response.json;
    if (result.candidates && result.candidates.length > 0) {
        let rawText = result.candidates[0].content.parts[0].text;
        // Clean markdown code blocks if present
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        try {
            const data = JSON.parse(rawText);
            
            // A. Rename File
            const safeTitle = data.title.replace(/[:/\\|?*<>"]/g, "-");
            await tp.file.rename(safeTitle);
            
            // B. Move File
            if (!app.vault.getAbstractFileByPath(data.folder)) { await app.vault.createFolder(data.folder); }
            if (!tp.file.folder().includes(data.folder)) { await tp.file.move(data.folder + "/" + safeTitle); }
            
            // C. Output Content
            const tagStr = data.tags.map(t => t.startsWith("#") ? t : "#"+t).join("\n  - ");
            
            tR += `---
tags:
  - voice-note
  - ${tagStr}
date: ${tp.date.now("YYYY-MM-DD HH:mm")}
---

# 🎙️ ${data.title}

> [!summary] AI Summary
> ${data.summary}

## Transcript
${data.transcript}

---
> *Processed by Gemini Voice AI*
`;
            new Notice(`✨ Organized: "${safeTitle}" into ${data.folder}`);

            // Delete the original audio recording
            try {
                await app.vault.trash(audioFile, true);
            } catch (e) {
                new Notice("⚠️ Could not delete audio file.");
            }

        } catch (jsonErr) {
            new Notice("⚠️ AI JSON Parse Error. Dumping raw text.");
            tR += rawText;
        }
        
    } else {
        new Notice("⚠️ AI returned empty response.");
        tR += "> [!error] Empty Response from AI";
    }

} catch (e) {
    const errInfo = e.status || e.message || "Unknown Error";
    new Notice("❌ API Error: " + errInfo + ". Switching to Backup Mode.");
    
    // BACKUP: Safely save the recording even if AI failed
    const safeTitle = `Untitled Recording ${tp.date.now("YYYY-MM-DD HH-mm-ss")}`;
    await tp.file.rename(safeTitle);
    
    // Embed the raw audio file so user can listen later
    const backupContent = `---
tags:
  - backup-recording
  - to-transcribe
date: ${tp.date.now("YYYY-MM-DD HH:mm")}
error: ${e.message}
---

# 🎙️ ${safeTitle}

> [!warning] Transcription Failed
> **Error:** ${errInfo}
> **Reason:** ${errInfo.includes("429") || errInfo.includes("QUOTA") ? "Rate Limit or Daily Quota Exceeded." : "Connection or API Key Issue."}
> **Solution:** Wait 1 minute and click the button below.

## Audio Recording
![[${audioFile.name || "Audio File"}]]

` + "```dataviewjs" + `
const btn = dv.el("button", "🔄 Retry Transcription");
btn.onclick = async () => {
    new Notice("🔄 Retrying...");
    const tp = app.plugins.plugins["templater-obsidian"].templater;
    const t = app.vault.getAbstractFileByPath("Templates/Template - Voice Transcription.md");
    
    // 1. Capture current file (the backup)
    const currentFileStr = dv.current().file.path;
    const currentFile = app.vault.getAbstractFileByPath(currentFileStr);

    // 2. Spawn new attempt
    const newFile = await tp.create_new_note_from_template(t, "1. Inbox");

    // 3. If new file created successfully, delete this old backup to avoid clutter
    if (newFile && currentFile) {
        // Double check we aren't deleting the file we just made (sanity check)
        if (newFile.path !== currentFile.path) {
             await app.vault.trash(currentFile, true); // Move to trash
             new Notice("🗑️ Old backup deleted.");
        }
    }
}
` + "```" + `

---
> *Saved by redundancy protocol.*
`;
    tR += backupContent;
}
%>
