// Simulate the rollover logic - testing with today's (2026-01-30) journal content
const content = `
> ### 🎯 Priorities
> 1. [x] Focus on fixing the fan
> 2. [ ] doing office tasks
> 3. [ ] avoiding touching any code.

> ### 🔮 Tomorrow
> *One thing to focus on:*
>
> Prepare for the weekly review
>
> **📝 Notes:**
`;

let tasks = [];

// 1. Find UNCOMPLETED priorities from yesterday
const prioritiesMatch = content.match(/> ### 🎯 Priorities\n((?:> \d+\. \[.\].*\n?)*)/);
if (prioritiesMatch && prioritiesMatch[1]) {
    const lines = prioritiesMatch[1].split('\n');
    for (const line of lines) {
        const unchecked = line.match(/> \d+\. \[ \] (.+)/);
        if (unchecked && unchecked[1].trim()) {
            tasks.push(unchecked[1].trim());
        }
    }
}

// 2. Also get items from Tomorrow section  
const tomorrowMatch = content.match(/> ### 🔮 Tomorrow\n((?:.|\n)*?)(?=> \*\*📝 Notes:\*\*|> \[!|---|$)/);
if (tomorrowMatch && tomorrowMatch[1]) {
    let raw = tomorrowMatch[1].replace(/> \*One thing to focus on:\*/g, '').replace(/>\s*\n/g, '').trim();
    if (raw.length > 2) {
        const tomorrowTasks = raw.split('\n')
            .map(l => l.replace(/^> /, '').replace(/^[-*] /, '').replace(/^\d+\. /, '').trim())
            .filter(l => l.length > 0);
        tasks = tasks.concat(tomorrowTasks);
    }
}

// Remove duplicates
tasks = [...new Set(tasks)];

// Generate output
console.log('\n📋 ROLLOVER TEST RESULTS:\n');
console.log('✅ Completed (will NOT roll over):');
console.log('   1. [x] Focus on fixing the fan\n');
console.log('⬜ Uncompleted priorities (WILL roll over):');
tasks.slice(0, 2).forEach((t, i) => console.log('   ' + (i + 1) + '. [ ] ' + t));
console.log('\n🔮 Tomorrow items (WILL be added):');
tasks.slice(2).forEach((t, i) => console.log('   ' + (i + 1) + '. ' + t));

console.log('\n' + '═'.repeat(50));
console.log("📅 TOMORROW'S PRIORITIES WOULD BE:");
console.log('═'.repeat(50) + '\n');

const minSlots = Math.max(3, tasks.length);
for (let i = 0; i < minSlots; i++) {
    const taskText = tasks[i] || '';
    console.log('> ' + (i + 1) + '. [ ] ' + taskText);
}
console.log('');
