<%*
// 🎙️ VOICE JOURNAL TEMPLATE
// Speak your answers, AI fills in the sections
// ----------------------------------------

// 0. Store reference to this temporary file for later deletion
const tempFile = tp.config.target_file;

// 1. Configuration
const API_KEY_FILE = "Keys/gemini_api_key.md";
const AUDIO_EXTENSIONS = ["m4a", "webm", "mp3", "wav", "ogg"];
const LOOKBACK_MINUTES = 60;

// 2. Get API Keys
const apiKeyFile = app.vault.getAbstractFileByPath(API_KEY_FILE);
if (!apiKeyFile) { new Notice("❌ API Key file not found!"); return; }
const fileContent = await app.vault.read(apiKeyFile);
const apiKeys = fileContent.split("\n").map(k => k.trim()).filter(k => k.length > 5);

// 3. Find Latest Audio File
const files = app.vault.getFiles();
const recentAudio = files.filter(f => {
    return AUDIO_EXTENSIONS.includes(f.extension) && 
           (Date.now() - f.stat.ctime < LOOKBACK_MINUTES * 60 * 1000);
}).sort((a, b) => b.stat.ctime - a.stat.ctime);

let audioFile = null;

if (recentAudio.length === 0) {
    new Notice("⚠️ No recent audio recording found (last 60 mins).");
    return;
} else {
    audioFile = recentAudio[0];
}

new Notice(`🎙️ Processing Voice Journal...`);

// 4. ArrayBuffer to Base64
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

// 6. Detect Morning vs Evening
const isMorning = window.morningJournal === true;
const isEvening = window.eveningJournal === true;
window.morningJournal = false; // Reset flags
window.eveningJournal = false;

// 7. AI Prompt for Structured Journal
const smartPrompt = `
You are a journaling assistant. The user has recorded their journal entry.

First, determine if this is a MORNING or EVENING journal based on the content:
- MORNING: mentions plans for today, sleeping hours, morning energy, what they want to do
- EVENING: reflects on what happened, gratitude for the day, challenges faced

Then transcribe and organize into the appropriate JSON format:

FOR MORNING:
{
  "type": "morning",
  "sleep_hours": Number or null (e.g. 7.5),
  "energy_score": Number 1-10 or null,
  "mood_label": "MUST be one of: 🤩 Great, 🙂 Good, 😐 Okay, 😫 Drained, 🧘‍♂️ Zen",
  "habits": ["habit1", "habit2"],
  "priorities": ["priority1", "priority2", "priority3"],
  "notes": "Any other thoughts"
}

FOR EVENING:
{
  "type": "evening",
  "mood_label": "MUST be one of: 🤩 Great, 🙂 Good, 😐 Okay, 😫 Drained, 🧘‍♂️ Zen",
  "relationship_score": Number 1-10 or null,
  "habits": ["habit1", "habit2"],
  "highlight": "The best part...",
  "improvement": "One thing to improve tomorrow...",
  "wins": ["win1", "win2", "win3"],
  "gratitude": ["thing1", "thing2", "thing3"],
  "notes": "Additional thoughts..."
}

Rules:
- CRITICAL: Extract TRACKERS if mentioned:
  - Sleep: "slept 7 hours" -> 7, "7.5 hours sleep" -> 7.5
  - Energy: "energy is 8", "energy level 8" -> 8
  - Mood: Map to emoji labels: 
    - great/amazing/fantastic/excellent -> "🤩 Great"
    - good/happy/fine/okay -> "🙂 Good" 
    - neutral/average/meh -> "😐 Okay"
    - tired/exhausted/bad/low -> "😫 Drained"
    - calm/peaceful/zen/relaxed -> "🧘‍♂️ Zen"
  - Relationship: "relationship is 9", "marriage is 10" -> 9 or 10
  - Relationship: "relationship is 9", "marriage is 10" -> 9 or 10
- For habits, look for: Meditation, Workout, Reading, Water 2L, Focus Hour/Deep Work/Monk Mode -> "Focus Hour"
- MUST output mood_label with the EXACT emoji prefix shown above
- If missing, use null
- Output ONLY valid JSON.
`;

// Helper to normalize mood labels to match dropdowns
const normalizeMood = (moodLabel) => {
    if (!moodLabel) return null;
    const lower = moodLabel.toLowerCase();
    if (lower.includes("great") || lower.includes("amazing") || lower.includes("fantastic") || lower.includes("excellent") || lower.includes("🤩")) return "🤩 Great";
    if (lower.includes("good") || lower.includes("happy") || lower.includes("fine") || lower.includes("🙂")) return "🙂 Good";
    if (lower.includes("okay") || lower.includes("neutral") || lower.includes("average") || lower.includes("meh") || lower.includes("😐")) return "😐 Okay";
    if (lower.includes("tired") || lower.includes("drained") || lower.includes("exhausted") || lower.includes("bad") || lower.includes("low") || lower.includes("😫")) return "😫 Drained";
    if (lower.includes("zen") || lower.includes("calm") || lower.includes("peaceful") || lower.includes("relaxed") || lower.includes("🧘")) return "🧘‍♂️ Zen";
    return moodLabel; // Return as-is if no match
};

const prompt = smartPrompt;

// 7. Call Gemini API with Key Rotation
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
            break;
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
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        try {
            const data = JSON.parse(rawText);
            
            // A. Check if today's journal already exists
            const today = moment().format("YYYY-MM-DD");
            const journalPath = `3. Permanent Notes/Daily Notes/Journal ${today}.md`;
            let journalFile = app.vault.getAbstractFileByPath(journalPath);
            
            // AUTO-CREATE if missing
            if (!journalFile) {
                new Notice("🆕 Creating today's journal...");
                try {
                    const template = app.vault.getAbstractFileByPath("Templates/Template - Hybrid Journal.md");
                    const folder = app.vault.getAbstractFileByPath("3. Permanent Notes/Daily Notes");
                    if (template && folder) {
                        journalFile = await tp.file.create_new(template, `Journal ${today}`, false, folder);
                        await new Promise(r => setTimeout(r, 1000)); // Wait for creation
                    } else {
                        new Notice("❌ Error: Missing Template or Folder for auto-creation.");
                    }
                } catch (createErr) {
                    console.error("Auto-create failed", createErr);
                }
            }
            
            // Detect morning vs evening from AI response
            const detectedMorning = data.type === "morning";
            
            if (journalFile) {
                // APPEND to existing journal
                const currentContent = await app.vault.read(journalFile);
                let updatedContent = currentContent;
                
                // Remove the audio embed link if present
                if (audioFile) {
                    const escapedName = audioFile.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const linkRegex = new RegExp(`!?\\[\\[(.*?/)?${escapedName}\\]\\]\\n?`, "g");
                    updatedContent = updatedContent.replace(linkRegex, "");
                }
                
                // Update Frontmatter with stats
                await app.fileManager.processFrontMatter(journalFile, (fm) => {
                    if (data.sleep_hours !== undefined && data.sleep_hours !== null) fm["sleep_hours"] = data.sleep_hours;
                    if (data.energy_score !== undefined && data.energy_score !== null) fm["energy_score"] = data.energy_score;
                    if (data.relationship_score !== undefined && data.relationship_score !== null) fm["relationship_score"] = data.relationship_score;
                    if (data.mood_label) {
                        const normalizedMood = normalizeMood(data.mood_label);
                        if (detectedMorning) fm["mood_morning"] = normalizedMood;
                        else fm["mood_evening"] = normalizedMood;
                    } else if (data.mood_score) { 
                         // Fallback if AI sends score
                         const score = data.mood_score;
                         const label = score >= 8 ? "🤩 Great" : score >= 6 ? "🙂 Good" : score >= 4 ? "😐 Okay" : "😫 Drained";
                         if (detectedMorning) fm["mood_morning"] = label;
                         else fm["mood_evening"] = label;
                    }
                    if (data.habits && data.habits.length > 0) {
                        const currentHabits = fm["habits"] || [];
                        const newHabits = [...new Set([...currentHabits, ...data.habits])];
                        fm["habits"] = newHabits;
                    }
                });

                if (detectedMorning) {
                    // MORNING SECTION
                    
                    // Update Priorities (The Big 3 - Red/Yellow/Green)
                    if (data.priorities && data.priorities.length > 0) {
                        const p = data.priorities;
                        const p1 = p[0] ? `- [ ] 🔴 ${p[0]}` : `- [ ] 🔴 `;
                        const p2 = p[1] ? `- [ ] 🟡 ${p[1]}` : `- [ ] 🟡 `;
                        const p3 = p[2] ? `- [ ] 🟢 ${p[2]}` : `- [ ] 🟢 `;
                        
                        updatedContent = updatedContent.replace(
                            /# 🎯 The Big 3\n> .*\n\n(- \[ \] .*\n){3}/,
                            `# 🎯 The Big 3\n> *Priorities set via Voice*\n\n${p1}\n${p2}\n${p3}\n`
                        );
                    }
                    
                    if (data.notes) updatedContent = updatedContent.replace(/### 📝 Notes & Thoughts\n- /, `### 📝 Notes & Thoughts\n- ${data.notes}\n- `);

                    await app.vault.modify(journalFile, updatedContent);
                    new Notice("✨ Morning intention set!");
                    
                } else {
                    // EVENING SECTION
                    
                    let eveningBlock = `### 🌙 Evening Retrospective\n> *Kaizen: What is ONE thing I can improve tomorrow?*\n\n`;
                    if (data.improvement) eveningBlock += `- **📉 Improvement:** ${data.improvement}\n`;
                    
                    // Format wins - numbered only if more than 1
                    if (data.wins) {
                        const winsArr = Array.isArray(data.wins) ? data.wins : [data.wins];
                        if (winsArr.length === 1) {
                            eveningBlock += `- **✅ Wins:** ${winsArr[0]}\n`;
                        } else {
                            eveningBlock += `- **✅ Wins:**\n`;
                            winsArr.forEach((w, i) => {
                                eveningBlock += `  ${i + 1}. ${w}\n`;
                            });
                        }
                    }
                    
                    // Format gratitude - numbered only if more than 1
                    if (data.gratitude) {
                        const gratArr = Array.isArray(data.gratitude) ? data.gratitude : [data.gratitude];
                        if (gratArr.length === 1) {
                            eveningBlock += `- **🙏 Gratitude:** ${gratArr[0]}\n`;
                        } else {
                            eveningBlock += `- **🙏 Gratitude:**\n`;
                            gratArr.forEach((g, i) => {
                                eveningBlock += `  ${i + 1}. ${g}\n`;
                            });
                        }
                    }
                    
                    // Replace the empty evening block
                    updatedContent = updatedContent.replace(
                        /### 🌙 Evening Retrospective\n> .*\n\n- \*\*📉 Improvement:\*\* \n- \*\*✅ Wins:\*\* \n- \*\*🙏 Gratitude:\*\* /,
                        eveningBlock
                    );
                    
                    await app.vault.modify(journalFile, updatedContent);
                    new Notice("✨ Evening reflection processed!");
                }
                
                // Delete this temporary processing file
                try {
                    await app.vault.delete(tempFile);
                } catch (deleteErr) {
                    // Ignore
                }
                
                // Also cleanup any 'Untitled' files in Inbox
                try {
                    const untitledFile = app.vault.getAbstractFileByPath("1. Inbox/Untitled.md");
                    if (untitledFile) await app.vault.delete(untitledFile);
                } catch (e) { }

                // Delete the original audio recording (Standard Delete)
                try {
                    await app.vault.delete(audioFile); 
                    new Notice("🗑️ Audio file deleted.");
                } catch (e) {
                    console.log("Could not delete audio file:", e);
                }
                
                // Open the updated journal
                await app.workspace.openLinkText(journalPath, "", false);
                
            } else {
                new Notice("⚠️ Could not locate or create Journal file.");
                try { await app.vault.delete(tempFile); } catch (e) {}
            }

        } catch (jsonErr) {
            new Notice("⚠️ AI JSON Parse Error. See raw output.");
            tR += `## Raw Output\n${rawText}`;
        }
        
    } else {
        new Notice("⚠️ AI returned empty response.");
    }

} catch (e) {
    const errInfo = e.status || e.message || "Unknown Error";
    new Notice("❌ API Error: " + errInfo);
    
    // Log Error to Journal
    const today = moment().format("YYYY-MM-DD");
    const journalPath = `3. Permanent Notes/Daily Notes/Journal ${today}.md`;
    const existingJournal = app.vault.getAbstractFileByPath(journalPath);
    
    if (existingJournal) {
        const errorContent = `\n\n---\n> [!error] Voice Processing Failed\n> ${errInfo}\n\n`;
        const current = await app.vault.read(existingJournal);
        await app.vault.modify(existingJournal, current + errorContent);
        
        // PREVENT LOOP: Rename audio file
        if (audioFile) {
            try {
                const newName = `ERROR - ${audioFile.name}`;
                const newPath = audioFile.path.replace(audioFile.name, newName);
                await app.fileManager.renameFile(audioFile, newPath);
            } catch (renErr) { console.log("Rename failed", renErr); }
        }
        
        try { await app.vault.delete(tempFile); } catch (e) {}
        await app.workspace.openLinkText(journalPath, "", false);
    }
}
%>
