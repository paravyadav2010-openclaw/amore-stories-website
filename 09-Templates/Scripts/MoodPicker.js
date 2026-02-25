// Mood Picker Script
// Renders a dropdown to select a mood score (1-10) and saves it to frontmatter.

const container = dv.el("div", "", { cls: "mood-row" });
container.style.display = "flex";
container.style.alignItems = "center";
container.style.justifyContent = "flex-start"; // Left align
container.style.gap = "10px";
container.style.marginLeft = "0"; 
container.style.marginTop = "0"; 
container.style.marginBottom = "8px"; 

// 1. Render Label
const label = container.createEl("strong", { text: "Mood Score: " });
label.style.color = "var(--text-normal)";

// 2. Render Dropdown
const select = container.createEl("select");
select.style.padding = "2px 8px"; 
select.style.borderRadius = "4px";
select.style.border = "1px solid var(--background-modifier-border)";
select.style.fontSize = "1em"; 
select.style.fontFamily = "var(--font-text)";
select.style.cursor = "pointer";
select.style.height = "24px"; 

// Options
select.createEl("option", { text: "-", value: "" });
for (let i = 1; i <= 10; i++) select.createEl("option", { text: i.toString(), value: i.toString() });

// 3. Sync Logic
const currentFile = dv.current().file;
const currentScore = dv.current().mood_score;
if (currentScore) select.value = currentScore.toString();

select.onchange = async () => {
    const val = select.value;
    const file = app.vault.getAbstractFileByPath(currentFile.path);
    
    await app.fileManager.processFrontMatter(file, (fm) => {
        if (val) fm["mood_score"] = parseInt(val);
        else delete fm["mood_score"];
    });
    
    new Notice(`Mood saved: ${val}/10`);
}
