// WEEKLY STATS (WeeklyStats.js)
// Fixed: Parse day from filename instead of frontmatter

const files = dv.pages('"01-Journal"')
    .where(p => p.file.name.match(/Journal \d{4}-\d{2}-\d{4}/))
    .sort(p => p.file.ctime, 'desc')
    .limit(7)
    .sort(p => p.file.ctime, 'asc');

// Prepare Data - Convert to regular arrays with .values
const days = files.map(p => {
    const match = p.file.name.match(/Journal (\d{4}-\d{2}-\d{4})/);
    const day = match ? match[1] : null;
    return day ? moment(day).format("ddd") : "";
}).values;

const fullDates = files.map(p => {
    const match = p.file.name.match(/Journal (\d{4}-\d{2}-\d{4})/);
    const day = match ? match[1] : null;
    return day ? moment(day).format("MMM D") : "";
}).values;

const sleep = files.map(p => p.sleep_hours || 0).values;
const energy = files.map(p => p.energy_score || 0).values;
const relation = files.map(p => p.relationship_score || 0).values;

// Calculate averages
const avgSleep = sleep.length ? (sleep.reduce((a, b) => a + b, 0) / sleep.length).toFixed(1) : 0;
const avgEnergy = energy.length ? (energy.reduce((a, b) => a + b, 0) / energy.length).toFixed(1) : 0;

// Render Container
const container = input && input.container ? input.container : dv.el("div", "");

const styleId = "weekly-stats-v4";
if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        .ws-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
            border-radius: 16px;
            border: 1px solid var(--background-modifier-border);
        }
        
        .ws-header { 
            display: flex; justify-content: space-between; align-items: center; 
            margin-bottom: 20px;
        }
        .ws-title { font-size: 1em; font-weight: 700; color: var(--text-normal); }
        
        .ws-stats-row {
            display: flex; gap: 20px;
        }
        .ws-stat {
            display: flex; align-items: center; gap: 8px;
            font-size: 0.8em; color: var(--text-muted);
        }
        .ws-stat-value { font-weight: 700; font-size: 1.1em; }
        .ws-stat-value.sleep { color: #FCD34D; }
        .ws-stat-value.energy { color: #38BDF8; }
        
        .ws-chart { 
            display: flex; gap: 8px; height: 140px; 
            align-items: flex-end; justify-content: space-between;
            padding: 10px 0;
        }
        
        .ws-col { 
            display: flex; flex-direction: column; align-items: center; gap: 8px; 
            flex: 1; height: 100%; justify-content: flex-end;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .ws-col:hover { transform: scale(1.05); }
        
        .ws-bar-group {
            display: flex; gap: 4px; align-items: flex-end;
            height: 85%; width: 100%; justify-content: center;
            position: relative;
        }
        
        .ws-bar {
            width: 12px; border-radius: 6px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            cursor: pointer;
        }
        .ws-bar:hover { 
            filter: brightness(1.2); 
            transform: scaleY(1.08);
        }
        
        /* Gradient bars */
        .ws-sleep { background: linear-gradient(to top, #F59E0B, #FCD34D); box-shadow: 0 4px 15px rgba(252, 211, 77, 0.3); }
        .ws-energy { background: linear-gradient(to top, #0284C7, #38BDF8); box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }
        
        .ws-day { 
            font-size: 0.75em; color: var(--text-muted); font-weight: 600; 
            text-transform: uppercase; letter-spacing: 0.05em;
            transition: color 0.2s;
        }
        .ws-col:hover .ws-day { color: var(--text-normal); }
        
        .ws-today .ws-day { 
            color: var(--interactive-accent); 
            font-weight: 700;
        }
        .ws-today .ws-bar { 
            box-shadow: 0 0 20px rgba(var(--interactive-accent-rgb), 0.4);
        }
        
        /* Tooltip */
        .ws-tooltip {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) scale(0.9);
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.75em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .ws-col:hover .ws-tooltip {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
        .ws-tooltip-date { font-weight: 700; color: var(--text-normal); margin-bottom: 4px; }
        .ws-tooltip-row { display: flex; justify-content: space-between; gap: 15px; color: var(--text-muted); }
        .ws-tooltip-val { font-weight: 600; }
        .ws-tooltip-val.t-sleep { color: #FCD34D; }
        .ws-tooltip-val.t-energy { color: #38BDF8; }

        .ws-legend { 
            display: flex; gap: 20px; justify-content: center; 
            margin-top: 15px; padding-top: 15px;
            border-top: 1px solid var(--background-modifier-border);
        }
        .ws-leg-item { 
            display: flex; align-items: center; gap: 6px; 
            font-size: 0.75em; color: var(--text-muted); 
        }
        .ws-dot { width: 10px; height: 10px; border-radius: 50%; }
        .ws-dot.d-sleep { background: linear-gradient(135deg, #F59E0B, #FCD34D); }
        .ws-dot.d-energy { background: linear-gradient(135deg, #0284C7, #38BDF8); }

        .ws-empty { 
            height: 120px; display: flex; align-items: center; justify-content: center; 
            color: var(--text-muted); font-style: italic; font-size: 0.9em; 
        }

        /* Animation on load */
        @keyframes ws-grow {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
        }
        .ws-bar { 
            transform-origin: bottom;
            animation: ws-grow 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .ws-col:nth-child(1) .ws-bar { animation-delay: 0.05s; }
        .ws-col:nth-child(2) .ws-bar { animation-delay: 0.1s; }
        .ws-col:nth-child(3) .ws-bar { animation-delay: 0.15s; }
        .ws-col:nth-child(4) .ws-bar { animation-delay: 0.2s; }
        .ws-col:nth-child(5) .ws-bar { animation-delay: 0.25s; }
        .ws-col:nth-child(6) .ws-bar { animation-delay: 0.3s; }
        .ws-col:nth-child(7) .ws-bar { animation-delay: 0.35s; }
    `;
    document.head.appendChild(style);
}

if (files.length === 0) {
    container.innerHTML = `<div class="ws-container"><div class="ws-empty">No journals found this week. Start journaling!</div></div>`;
} else {
    const today = moment().format("ddd");

    // Generate Bars
    let barsHTML = "";
    for (let i = 0; i < files.length; i++) {
        const hSleep = Math.min((sleep[i] / 10) * 100, 100);
        const hEnergy = Math.min((energy[i] / 10) * 100, 100);
        const isToday = days[i] === today;

        barsHTML += `
            <div class="ws-col ${isToday ? 'ws-today' : ''}">
                <div class="ws-tooltip">
                    <div class="ws-tooltip-date">${fullDates[i]}</div>
                    <div class="ws-tooltip-row">
                        <span>Sleep</span>
                        <span class="ws-tooltip-val t-sleep">${sleep[i]}h</span>
                    </div>
                    <div class="ws-tooltip-row">
                        <span>Energy</span>
                        <span class="ws-tooltip-val t-energy">${energy[i]}/10</span>
                    </div>
                </div>
                <div class="ws-bar-group">
                    <div class="ws-bar ws-sleep" style="height: ${hSleep || 5}%"></div>
                    <div class="ws-bar ws-energy" style="height: ${hEnergy || 5}%"></div>
                </div>
                <div class="ws-day">${days[i]}</div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="ws-container">
            ${input?.hideTitle ? '' : `
            <div class="ws-header">
                <div class="ws-title">Weekly Progress</div>
                <div class="ws-stats-row">
                    <div class="ws-stat">
                        <span>Avg Sleep:</span>
                        <span class="ws-stat-value sleep">${avgSleep}h</span>
                    </div>
                    <div class="ws-stat">
                        <span>Avg Energy:</span>
                        <span class="ws-stat-value energy">${avgEnergy}</span>
                    </div>
                </div>
            </div>
            `}
            <div class="ws-chart">
                ${barsHTML}
            </div>
            <div class="ws-legend">
                <div class="ws-leg-item"><div class="ws-dot d-sleep"></div>Sleep Hours</div>
                <div class="ws-leg-item"><div class="ws-dot d-energy"></div>Energy Score</div>
            </div>
        </div>
    `;
}
