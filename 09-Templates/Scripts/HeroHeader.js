// 🎨 HERO HEADER - Journal Daily Header with Photo
// Beautiful hero section with date, quote, and action buttons

// 🎨 BEAUTIFUL CONFIGURATION
const accentColor = "var(--interactive-accent)";
const dateString = moment().format("dddd, MMMM Do YYYY");

// Access Templater from Dataview
// Access Templater from Dataview
let quoteText = "Your mind is for having ideas, not holding them.";

// 📚 CUSTOM QUOTES (Atomic Habits, Deep Work)
const customQuotes = [
  // Atomic Habits - James Clear
  `"You do not rise to the level of your goals. You fall to the level of your systems." — James Clear`,
  `"Habits are the compound interest of self-improvement." — James Clear`,
  `"Every action you take is a vote for the type of person you wish to become." — James Clear`,
  `"The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become." — James Clear`,
  `"Success is the product of daily habits—not once-in-a-lifetime transformations." — James Clear`,
  `"Small habits don't add up. They compound." — James Clear`,

  // Deep Work - Cal Newport
  `"Clarity about what matters provides clarity about what does not." — Cal Newport`,
  `"Deep work is not just a skill, it's a superpower." — Cal Newport`,
  `"If you don't produce, you won't thrive—no matter how skilled or talented you are." — Cal Newport`,
  `"Who you are, what you think, feel, and do, what you love—is the sum of what you focus on." — Cal Newport`,
  `"The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable." — Cal Newport`
];

// Pick quote based on day of year (stays consistent all day)
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
const quoteIndex = dayOfYear % customQuotes.length;
quoteText = customQuotes[quoteIndex];

// 🖌️ STYLES
const styleId = "hero-header-styles-v4";
// Force remove ANY existing versions to ensure fresh CSS
const existingStyles = document.querySelectorAll(`[id^="hero-header-styles"]`);
existingStyles.forEach(el => el.remove());

const style = document.createElement("style");
style.id = styleId;
style.textContent = `
    /* COMPACT METADATA (Reading Mode) */
      body {
        --metadata-padding: 0px;
        --metadata-label-width: 80px;
        --metadata-input-height: 24px;
        --metadata-gap: 4px;
      }
      .metadata-container {
        margin-bottom: 10px !important;
        font-size: 0.8em !important;
      }
      
      /* COMPACT METADATA (Editing/Live Preview Mode) */
      .cm-hmd-frontmatter,
      .cm-line .cm-hmd-frontmatter.cm-atom,
      .cm-line .cm-hmd-frontmatter.cm-keyword,
      .cm-line .cm-hmd-frontmatter.cm-string,
      .cm-line .cm-hmd-frontmatter.cm-variable-2 {
        font-size: 0.8em !important;
        color: var(--text-muted) !important;
        line-height: 1.2 !important;
        font-family: var(--font-monospace) !important;
        font-weight: normal !important;
      }

      /* HERO CONTAINER - Apple Journal Style */
      .journal-hero {
        position: relative;
        width: 100%;
        height: 240px;
        border-radius: 16px;
        margin: 20px 0;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end; /* Content at bottom */
        overflow: hidden;
        background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%); /* Default dark bg */
        color: white;
        background-size: cover;
        background-position: center;
        transition: background-image 0.5s ease-in-out;
      }
      
      .journal-hero.has-photo::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));
        backdrop-filter: blur(4px); /* Blur effect for text readability */
        -webkit-backdrop-filter: blur(4px);
        z-index: 1;
        border-radius: 16px;
      }

      /* Content z-index fix */
      .journal-date, .journal-quote, .recorder-container {
        position: relative;
        z-index: 2;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }

      .journal-date {
        font-size: 1.8em;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 8px;
        font-family: var(--font-interface);
        letter-spacing: -0.02em;
      }

      .journal-quote {
        font-style: italic;
        opacity: 0.9;
        font-size: 0.95em;
        border-left: 2px solid rgba(255,255,255,0.5);
        padding-left: 12px;
        margin-top: 12px;
        max-width: 90%;
        font-weight: 500;
      }

      /* Recording Button Container */
      .recorder-container {
        margin-top: 15px;
        display: flex;
        gap: 10px;
      }

      /* The visual buttons (Set Hero / Capture) */
      .recorder-btn {
        background: rgba(255,255,255,0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9em;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .recorder-btn:hover {
        background: rgba(255,255,255,0.35);
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      }
      .recorder-btn.recording {
        background: #ff4b4b;
        border-color: #ff4b4b;
        animation: pulse 2s infinite;
      }
      
      /* Quick Navigation Bar - Apple Glass Style V3 */
      .journal-quick-nav {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 24px !important;
        padding: 4px !important;
        width: 100% !important;
      }
      
      /* Target links specifically */
      .journal-quick-nav a.internal-link,
      .journal-quick-nav a {
        background: rgba(255, 255, 255, 0.6) !important; /* Lighter/Glassier */
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 10px 18px !important;
        border-radius: 24px !important;
        font-size: 0.9em !important;
        font-weight: 600 !important;
        color: var(--text-normal) !important; /* Darker text for glass */
        text-decoration: none !important;
        transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        line-height: normal !important;
      }
      
      /* Dark mode override via media query or class */
      .theme-dark .journal-quick-nav a.internal-link,
      .theme-dark .journal-quick-nav a {
          background: rgba(40, 40, 40, 0.6) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: rgba(255, 255, 255, 0.9) !important;
      }
      
      .journal-quick-nav a:hover {
        background: rgba(255, 255, 255, 0.8) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      }
      .theme-dark .journal-quick-nav a:hover {
         background: rgba(60, 60, 60, 0.8) !important;
      }
      
      .journal-quick-nav a.disabled {
        opacity: 0.4 !important;
        pointer-events: none !important;
        box-shadow: none !important;
        background: rgba(150, 150, 150, 0.1) !important;
        border-color: transparent !important;
      }
      
      /* Center Button Prominence */
      .journal-quick-nav .nav-center a {
          font-weight: 700 !important;
          letter-spacing: 0.02em !important;
      }

      /* HERO PICKER MODAL */
      .hero-picker-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.6); 
        backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        z-index: 10000; display: flex; align-items: center; justify-content: center;
        opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
      }
      .hero-picker-overlay.active { opacity: 1; pointer-events: auto; }
      
      .hero-picker-modal {
        background: var(--background-primary); width: 90%; max-width: 400px;
        max-height: 80vh; border-radius: 20px; padding: 24px;
        display: flex; flex-direction: column; gap: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5); 
        transform: scale(0.95); transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        border: 1px solid var(--background-modifier-border);
      }
      .hero-picker-overlay.active .hero-picker-modal { transform: scale(1); }

      .hp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .hp-title { font-size: 1.2em; font-weight: 700; margin: 0; }
      .hp-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; }
      
      .hp-options { display: grid; gap: 10px; }
      .hp-btn {
        padding: 14px; border-radius: 14px; border: none; font-weight: 600; font-size: 0.95em;
        background: var(--interactive-accent); color: white; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: transform 0.2s;
      }
      .hp-btn:active { transform: scale(0.98); }
      .hp-btn.secondary { background: var(--background-secondary); color: var(--text-normal); border: 1px solid var(--background-modifier-border); }

      .hp-divider { text-align: center; color: var(--text-muted); font-size: 0.8em; margin: 8px 0; position: relative; }
      .hp-divider::before, .hp-divider::after {
        content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: var(--background-modifier-border);
      }
      .hp-divider::before { left: 0; }
      .hp-divider::after { right: 0; }

      .hp-grid-label { font-size: 0.85em; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
      .hp-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 8px;
        overflow-y: auto; max-height: 300px; padding: 2px;
      }
      .hp-thumb {
        aspect-ratio: 1; border-radius: 10px; overflow: hidden; cursor: pointer;
        border: 2px solid transparent; position: relative;
      }
      .hp-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
      .hp-thumb:hover img { transform: scale(1.1); }
      .hp-thumb.selected { border-color: var(--interactive-accent); }
      .hp-empty { padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.9em; background: var(--background-secondary); border-radius: 12px; }
      
      /* DEFAULT: Hide mobile quote card on desktop */
      .mobile-quote-card {
          display: none !important;
      }
      
      /* MOBILE RESPONSIVE - Sleeker Apple Style */
      @media (max-width: 600px) {
          .journal-quick-nav {
              gap: 8px !important;
              padding: 0 4px 8px 4px !important; /* Add bottom spacing */
              margin-bottom: 20px !important;
          }
          
          /* Common Button Style on Mobile */
          .journal-quick-nav a.internal-link,
          .journal-quick-nav a {
              flex: 1 !important; /* Distribute space evenly */
              justify-content: center !important;
              padding: 10px 8px !important; /* Taller but slimmer horizontally */
              font-size: 0.75em !important; /* Smaller, crisp text */
              border-radius: 16px !important; /* Apple-style rounded corners */
              gap: 4px !important;
              background: rgba(255, 255, 255, 0.45) !important; /* More transparent glass */
              backdrop-filter: blur(15px) saturate(180%) !important;
              -webkit-backdrop-filter: blur(15px) saturate(180%);
              border: 0.5px solid rgba(255, 255, 255, 0.3) !important;
              box-shadow: 0 4px 10px rgba(0,0,0,0.03) !important;
              color: var(--text-normal) !important;
              letter-spacing: -0.01em !important;
              font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif !important;
          }
          
          /* Active/Hover State for touch */
          .journal-quick-nav a:active {
              background: rgba(255, 255, 255, 0.6) !important;
              transform: scale(0.97);
          }

          /* Dark Mode Tweaks for Mobile */
          .theme-dark .journal-quick-nav a {
               background: rgba(30, 30, 30, 0.5) !important;
               border-color: rgba(255, 255, 255, 0.1) !important;
          }

          /* HERO SECTION - ULTRA COMPACT MOBILE */
      .journal-hero {
          position: relative;
          min-height: auto; /* Let content define height */
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 22px; /* Increased padding */
          padding-top: 30px; /* Taller top buffer */
          margin-top: 0px; 
          border-radius: 12px;
          margin-bottom: 8px;
          
          /* Background Image Logic */
          background-size: cover;
          background-position: center 100%; /* Anchor to BOTTOM */
          background-color: var(--background-secondary);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.5s ease;
      }
      
      .journal-hero.has-photo::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
        z-index: 1;
      }    
      /* Ensure content sits above overlay */
      .journal-hero > * {
          position: relative;
          z-index: 2;
      }

          /* Hide/Smaller Text for Next/Prev if needed, but let's just keep it simple first */
          .journal-quick-nav a span {
              display: inline-block;
      }
      
      /* Ensure content sits above overlay */
      /* Hero Content - Mobile Optimized */
      .journal-date {
          font-family: var(--font-text-theme);
          font-weight: 800;
          font-size: 1.5em; /* Smaller to fit 100px height */
          color: white;
          margin-bottom: 4px;
          line-height: 1.0;
          letter-spacing: -0.03em;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      /* HIDE quote inside hero on mobile - will show below instead */
      .journal-quote {
          display: none !important;
      }
      
      /* Mobile Quote Card - shows below hero (MOBILE ONLY) */
      .mobile-quote-card {
          display: block !important;
          background: var(--background-secondary);
          border-radius: 12px;
          padding: 16px;
          margin: -6px 0 12px 0;
          font-size: 0.9em;
          font-style: italic;
          color: var(--text-muted);
          line-height: 1.4;
          border-left: 3px solid var(--interactive-accent);
      }
          
      /* Recorder/Photo Buttons on Mobile */
      .recorder-container {
          gap: 10px;
      }
      .recorder-btn {
          padding: 8px 16px;
          font-size: 0.9em;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
      }
      } /* End of mobile media query */
    `;
document.head.appendChild(style);


// 📸 CHECK FOR HERO PHOTO
const currentFile = dv.current().file;
// Match DD-MM-YYYY or YYYY-MM-DD format
const ddmmMatch = currentFile.name.match(/(\d{2})-(\d{2})-(\d{4})/);
const yyyyMatch = currentFile.name.match(/(\d{4})-(\d{2})-(\d{2})/);
const journalDate = ddmmMatch ? `${ddmmMatch[3]}-${ddmmMatch[2]}-${ddmmMatch[1]}` :
  yyyyMatch ? `${yyyyMatch[1]}-${yyyyMatch[2]}-${yyyyMatch[3]}` :
    moment().format("YYYY-MM-DD");
const heroPhotoPath = `Attachments/Daily Photos/${journalDate}/hero.jpg`;
const heroPhotoAlt = `Attachments/Daily Photos/${journalDate}/hero.png`;
const heroFile = app.vault.getAbstractFileByPath(heroPhotoPath) || app.vault.getAbstractFileByPath(heroPhotoAlt);

// 🔗 QUICK NAVIGATION BAR
const nav = dv.el("div", "", { cls: "journal-quick-nav" });

// Calculate prev/next dates (using moment for date math)
const currentMoment = moment(journalDate, "YYYY-MM-DD");
const prevDate = currentMoment.clone().subtract(1, 'day');
const nextDate = currentMoment.clone().add(1, 'day');

// Format dates for filenames (DD-MM-YYYY for new format, also check YYYY-MM-DD for old)
const prevDDMM = prevDate.format("DD-MM-YYYY");
const prevYYYY = prevDate.format("YYYY-MM-DD");
const nextDDMM = nextDate.format("DD-MM-YYYY");
const nextYYYY = nextDate.format("YYYY-MM-DD");

// Detect Naming Convention from current file works best
const hasJournalPrefix = currentFile.name.startsWith("Journal");

// Check if journals exist (try user's convention first, then fallback)
// Possibilities: "Journal DD-MM-YYYY", "Journal YYYY-MM-DD", "DD-MM-YYYY", "YYYY-MM-DD"

const p1 = `3. Permanent Notes/Daily Notes/Journal ${prevDDMM}.md`;
const p2 = `3. Permanent Notes/Daily Notes/Journal ${prevYYYY}.md`;
const p3 = `3. Permanent Notes/Daily Notes/${prevDDMM}.md`;
const p4 = `3. Permanent Notes/Daily Notes/${prevYYYY}.md`;

const prevFile = app.vault.getAbstractFileByPath(p1) ||
  app.vault.getAbstractFileByPath(p2) ||
  app.vault.getAbstractFileByPath(p3) ||
  app.vault.getAbstractFileByPath(p4);

const n1 = `3. Permanent Notes/Daily Notes/Journal ${nextDDMM}.md`;
const n2 = `3. Permanent Notes/Daily Notes/Journal ${nextYYYY}.md`;
const n3 = `3. Permanent Notes/Daily Notes/${nextDDMM}.md`;
const n4 = `3. Permanent Notes/Daily Notes/${nextYYYY}.md`;

const nextFile = app.vault.getAbstractFileByPath(n1) ||
  app.vault.getAbstractFileByPath(n2) ||
  app.vault.getAbstractFileByPath(n3) ||
  app.vault.getAbstractFileByPath(n4);

// Previous link
const prevLink = nav.createEl("a", { cls: prevFile ? "" : "disabled" });
prevLink.innerHTML = "❮ Previous";
if (prevFile) {
  prevLink.onclick = () => app.workspace.openLinkText(prevFile.path, "", false);
}

// Center: Dashboard
const centerNav = nav.createEl("div", { cls: "nav-center" });
const dashLink = centerNav.createEl("a");
dashLink.innerHTML = "🏠 Dashboard";
// Fixed path based on search result (Home (Dashboard))
dashLink.onclick = () => app.workspace.openLinkText("0. Dashboard/Home (Dashboard).md", "", false);

// Next link
const nextLink = nav.createEl("a", { cls: nextFile ? "" : "disabled" });
nextLink.innerHTML = "Next ❯";
if (nextFile) {
  nextLink.onclick = () => app.workspace.openLinkText(nextFile.path, "", false);
}

// 🏗️ RENDER HERO UI
const hero = dv.el("div", "", { cls: "journal-hero" });

// Apply hero photo if exists
if (heroFile) {
  hero.classList.add("has-photo");
  hero.style.backgroundImage = `url('${app.vault.adapter.getResourcePath(heroFile.path)}')`;
}

// Date
hero.createEl("div", { text: dateString, cls: "journal-date" });

// Quote
hero.createEl("div", {
  text: quoteText || '"Your mind is for having ideas, not holding them."',
  cls: "journal-quote"
});

// Button Container
const btnContainer = hero.createEl("div", { cls: "recorder-container" });

// 📱 Mobile Quote Card (separate element below hero)
dv.el("div", quoteText || '"Your mind is for having ideas, not holding them."', { cls: "mobile-quote-card" });

// 📷 Photo Button
const photoBtn = btnContainer.createEl("button", { text: "📷 Set Hero", cls: "recorder-btn" });

// ⚠️ OLD PICKER LOGIC (Overridden below)
photoBtn.onclick = async () => {
  new Notice("📸 Opening Picker...");
  try {
    // Check for existing photos
    const dailyPhotosFolder = `Attachments/Daily Photos/${journalDate}`;
    let existingPhotos = [];

    // Ensure folder exists before checking children to avoid null error
    let folder = app.vault.getAbstractFileByPath(dailyPhotosFolder);
    if (!folder) {
      try {
        await app.vault.createFolder(dailyPhotosFolder);
        folder = app.vault.getAbstractFileByPath(dailyPhotosFolder);
      } catch (e) { console.log("Folder creation fallback", e); }
    }

    if (folder && folder.children) {
      existingPhotos = folder.children
        .filter(f => /\.(jpg|jpeg|png|heic|webp)$/i.test(f.name))
        .filter(f => !f.name.toLowerCase().startsWith('hero')) // Exclude current hero
        .sort((a, b) => b.stat.mtime - a.stat.mtime);
    }

    // Create Modal UI
    const overlay = document.body.createEl("div", { cls: "hero-picker-overlay" });
    const modal = overlay.createEl("div", { cls: "hero-picker-modal" });

    // Header
    const header = modal.createEl("div", { cls: "hp-header" });
    header.createEl("h3", { text: "Set Hero Image", cls: "hp-title" });
    const closeBtn = header.createEl("button", { text: "✕", cls: "hp-close" });

    const close = () => {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 250);
    };
    closeBtn.onclick = overlay.onclick = (e) => { if (e.target === overlay || e.target === closeBtn) close(); };

    // Option 1: Upload New
    const opts = modal.createEl("div", { cls: "hp-options" });
    const uploadBtn = opts.createEl("button", { text: "⬆️ Upload New Photo", cls: "hp-btn" });

    uploadBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        if (e.target.files.length > 0) processFile(e.target.files[0]);
      };
      input.click();
      close();
    };

    // Option 2: Gallery
    if (existingPhotos.length > 0) {
      modal.createEl("div", { text: "OR", cls: "hp-divider" });
      modal.createEl("div", { text: "Choose from Gallery", cls: "hp-grid-label" });

      const grid = modal.createEl("div", { cls: "hp-grid" });
      existingPhotos.forEach(photo => {
        const thumb = grid.createEl("div", { cls: "hp-thumb" });
        const img = thumb.createEl("img");
        img.src = app.vault.adapter.getResourcePath(photo.path);

        thumb.onclick = async () => {
          new Notice("Setting hero...");
          await setHero(photo);
          close();
        };
      });
    } else {
      modal.createEl("div", { text: "OR", cls: "hp-divider" });
      modal.createEl("div", { text: "No daily photos yet", cls: "hp-empty" });
    }

    // Force reflow specifically for animation
    setTimeout(() => overlay.classList.add("active"), 10);

    // HELPER: Process Upload
    async function processFile(file) {
      const buffer = await file.arrayBuffer();
      const ext = file.name.split('.').pop().toLowerCase();
      const heroName = `hero.${ext === 'png' ? 'png' : 'jpg'}`;
      const heroPath = `Attachments/Daily Photos/${journalDate}/${heroName}`;

      // Ensure folder
      await ensureFolder(`Attachments/Daily Photos/${journalDate}`);

      // Write file (updates standard hero process)
      await writeHero(heroPath, buffer, ext);
    }

    // HELPER: Set Existing (Copy)
    async function setHero(tfile) {
      const data = await app.vault.readBinary(tfile);
      const ext = tfile.name.split('.').pop().toLowerCase();
      const heroPath = `Attachments/Daily Photos/${journalDate}/hero.${ext === 'png' ? 'png' : 'jpg'}`;

      // Instant visual update (Zero Latency)
      // Use fallback targeting if activeLeaf.view unavailable (e.g. mobile)
      let heroEl = document.querySelector('.journal-hero');
      if (app.workspace.activeLeaf && app.workspace.activeLeaf.view && app.workspace.activeLeaf.view.containerEl) {
        heroEl = app.workspace.activeLeaf.view.containerEl.querySelector('.journal-hero') || heroEl;
      }

      if (heroEl) {
        heroEl.classList.add('has-photo');
        heroEl.style.backgroundImage = `url('${app.vault.adapter.getResourcePath(tfile.path)}')`;
      }

      await writeHero(heroPath, data, ext);
    }

    // HELPER: Write and cleanup
    async function writeHero(path, data, ext) {
      // Delete old
      const jpgHero = app.vault.getAbstractFileByPath(`Attachments/Daily Photos/${journalDate}/hero.jpg`);
      const pngHero = app.vault.getAbstractFileByPath(`Attachments/Daily Photos/${journalDate}/hero.png`);
      if (jpgHero) await app.vault.delete(jpgHero);
      if (pngHero) await app.vault.delete(pngHero);

      // Create new
      await app.vault.createBinary(path, data);

      // Safety Refresh
      setTimeout(() => {
        if (app.workspace.activeLeaf) app.workspace.activeLeaf.rebuildView();
      }, 1500);

      new Notice("✨ Hero updated!");
    }

    async function ensureFolder(path) {
      const parts = path.split('/');
      let current = '';
      for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
      }
    }

  } catch (e) {
    new Notice("⚠️ Picker Error: " + e.message);
    console.error(e);
  }
};

// ✅ NEW PICKER LOGIC (UI First)
photoBtn.onclick = () => {
  // 1. Create Modal UI IMMEDIATELY using standard DOM API
  const overlay = document.createElement("div");
  overlay.className = "hero-picker-overlay";
  document.body.appendChild(overlay);

  const modal = document.createElement("div");
  modal.className = "hero-picker-modal";
  overlay.appendChild(modal);

  // Header
  const header = document.createElement("div");
  header.className = "hp-header";
  modal.appendChild(header);

  const title = document.createElement("h3");
  title.className = "hp-title";
  title.textContent = "Set Hero Image";
  header.appendChild(title);

  const closeBtn = document.createElement("button");
  closeBtn.className = "hp-close";
  closeBtn.textContent = "✕";
  header.appendChild(closeBtn);

  // Content container (for Loading/Options)
  const content = document.createElement("div");
  content.className = "hp-content";
  modal.appendChild(content);

  const loader = document.createElement("div");
  loader.className = "hp-loading";
  loader.textContent = "🔄 Finding daily photos...";
  loader.style.cssText = "padding: 20px; text-align: center; color: var(--text-muted); font-style: italic;";
  content.appendChild(loader);

  // Close logic
  const close = () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 250);
  };
  closeBtn.onclick = overlay.onclick = (e) => { if (e.target === overlay || e.target === closeBtn) close(); };

  // Show it
  setTimeout(() => overlay.classList.add("active"), 10);

  // 2. Load Data Asynchronously
  (async () => {
    try {
      // Check folders
      const dailyPhotosFolder = `Attachments/Daily Photos/${journalDate}`;
      let existingPhotos = [];

      let folder = app.vault.getAbstractFileByPath(dailyPhotosFolder);
      if (!folder) {
        try {
          await app.vault.createFolder(dailyPhotosFolder);
          folder = app.vault.getAbstractFileByPath(dailyPhotosFolder);
        } catch (e) { console.log("Folder creation fallback", e); }
      }

      if (folder && folder.children) {
        existingPhotos = folder.children
          .filter(f => /\.(jpg|jpeg|png|heic|webp)$/i.test(f.name))
          .filter(f => !f.name.toLowerCase().startsWith('hero'))
          .sort((a, b) => b.stat.mtime - a.stat.mtime);
      }

      // 3. Render Options (Clear loader)
      content.innerHTML = '';

      // Option 1: Upload New
      const uploadBtn = document.createElement("button");
      uploadBtn.className = "hp-btn";
      uploadBtn.textContent = "⬆️ Upload New Photo";
      uploadBtn.style.width = "100%";
      uploadBtn.style.marginBottom = "12px";
      content.appendChild(uploadBtn);

      uploadBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
          if (e.target.files.length > 0) processFile(e.target.files[0]);
        };
        input.click();
        close();
      };

      // Option 2: Gallery
      if (existingPhotos.length > 0) {
        const divider = document.createElement("div");
        divider.className = "hp-divider";
        divider.textContent = "OR";
        content.appendChild(divider);

        const label = document.createElement("div");
        label.className = "hp-grid-label";
        label.textContent = "Choose from Gallery";
        content.appendChild(label);

        const grid = document.createElement("div");
        grid.className = "hp-grid";
        content.appendChild(grid);

        existingPhotos.forEach(photo => {
          const thumb = document.createElement("div");
          thumb.className = "hp-thumb";
          grid.appendChild(thumb);

          const img = document.createElement("img");
          img.src = app.vault.adapter.getResourcePath(photo.path);
          thumb.appendChild(img);

          thumb.onclick = async () => {
            new Notice("Setting hero...");
            await setHero(photo);
            close();
          };
        });
      } else {
        const divider = document.createElement("div");
        divider.className = "hp-divider";
        divider.textContent = "OR";
        content.appendChild(divider);

        const empty = document.createElement("div");
        empty.className = "hp-empty";
        empty.textContent = "No daily photos yet";
        content.appendChild(empty);
      }

    } catch (err) {
      content.innerHTML = '';
      const errEl = document.createElement("div");
      errEl.textContent = "⚠️ Error: " + err.message;
      errEl.style.color = "var(--text-error)";
      content.appendChild(errEl);
      console.error(err);
    }
  })();

  // HELPER: Process Upload
  async function processFile(file) {
    const buffer = await file.arrayBuffer();
    const ext = file.name.split('.').pop().toLowerCase();
    const heroName = `hero.${ext === 'png' ? 'png' : 'jpg'}`;
    const heroPath = `Attachments/Daily Photos/${journalDate}/${heroName}`;

    await ensureFolder(`Attachments/Daily Photos/${journalDate}`);
    await writeHero(heroPath, buffer, ext);
  }

  // HELPER: Set Existing (Copy)
  async function setHero(tfile) {
    const data = await app.vault.readBinary(tfile);
    const ext = tfile.name.split('.').pop().toLowerCase();
    const heroPath = `Attachments/Daily Photos/${journalDate}/hero.${ext === 'png' ? 'png' : 'jpg'}`;

    // Instant visual update (Zero Latency)
    let heroEl = document.querySelector('.journal-hero');
    if (app.workspace.activeLeaf && app.workspace.activeLeaf.view && app.workspace.activeLeaf.view.containerEl) {
      heroEl = app.workspace.activeLeaf.view.containerEl.querySelector('.journal-hero') || heroEl;
    }

    if (heroEl) {
      heroEl.classList.add('has-photo');
      heroEl.style.backgroundImage = `url('${app.vault.adapter.getResourcePath(tfile.path)}')`;
    }

    await writeHero(heroPath, data, ext);
  }

  // HELPER: Write and cleanup
  async function writeHero(path, data, ext) {
    const jpgHero = app.vault.getAbstractFileByPath(`Attachments/Daily Photos/${journalDate}/hero.jpg`);
    const pngHero = app.vault.getAbstractFileByPath(`Attachments/Daily Photos/${journalDate}/hero.png`);
    if (jpgHero) await app.vault.delete(jpgHero);
    if (pngHero) await app.vault.delete(pngHero);

    await app.vault.createBinary(path, data);

    setTimeout(() => {
      if (app.workspace.activeLeaf) app.workspace.activeLeaf.rebuildView();
    }, 1500);

    new Notice("✨ Hero updated!");
  }

  async function ensureFolder(path) {
    const parts = path.split('/');
    let current = '';
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!app.vault.getAbstractFileByPath(current)) await app.vault.createFolder(current);
    }
  }
};

// 🎙️ Record Button
// 🎙️ Record Button
const btn = btnContainer.createEl("button", { text: "🎙️ Capture", cls: "recorder-btn" });

// 🧠 LOGIC
let inboxAudioFile = null;

const checkInboxAudio = () => {
  const inboxFolder = app.vault.getAbstractFileByPath("1. Inbox");
  if (!inboxFolder) return null;

  // Filter out files starting with "ERROR" to prevent loops
  const files = app.vault.getFiles().filter(f =>
    f.path.startsWith("1. Inbox/") &&
    !f.name.startsWith("ERROR") &&
    ["m4a", "wav", "mp3", "webm", "ogg"].includes(f.extension)
  );

  // Sort by recent
  files.sort((a, b) => b.stat.ctime - a.stat.ctime);
  return files.length > 0 ? files[0] : null;
};

const updateButton = () => {
  if (window.isThinkRecording) {
    btn.innerHTML = "⏹️ Finish";
    btn.classList.add("recording");
    btn.classList.remove("processing-ready");
  } else {
    inboxAudioFile = checkInboxAudio();
    if (inboxAudioFile) {
      btn.innerHTML = "⚡ Processing...";
      btn.classList.add("processing-ready");
      btn.classList.remove("recording");

      // AUTO-TRIGGER LOGIC
      // Prevent infinite loops with a session flag
      if (!window.isThinkProcessing) {
        window.isThinkProcessing = true;
        new Notice("⚡ Auto-processing Voice Note...");
        setTimeout(() => {
          triggerProcessing();
        }, 500);
      }
    } else {
      btn.innerHTML = "🎙️ Capture";
      btn.classList.remove("recording");
      btn.classList.remove("processing-ready");
      window.isThinkProcessing = false; // Reset when clear
    }
  }
};

// CSS for processing state
const processStyle = document.createElement("style");
processStyle.textContent = `
  .recorder-btn.processing-ready {
    background: linear-gradient(135deg, var(--interactive-accent), var(--text-accent));
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 15px var(--interactive-accent);
    animation: pulse-gold 2s infinite;
  }
  @keyframes pulse-gold {
    0% { box-shadow: 0 0 0 0 rgba(var(--interactive-accent-rgb), 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(var(--interactive-accent-rgb), 0); }
    100% { box-shadow: 0 0 0 0 rgba(var(--interactive-accent-rgb), 0); }
  }
`;
document.head.appendChild(processStyle);

btn.onclick = () => {
  // Case 1: Processing Existing File from Inbox
  if (!window.isThinkRecording && inboxAudioFile) {
    btn.innerHTML = "⏳ Processing...";
    btn.disabled = true;

    // Trigger Template Immediately
    triggerProcessing();
    return;
  }

  // Case 2: Stop Recording
  if (window.isThinkRecording) {
    // STOP
    window.isThinkRecording = false;
    window.journalRecording = false;

    app.commands.executeCommandById("audio-recorder:stop");
    btn.innerHTML = "✨ Processing...";
    btn.disabled = true;

    setTimeout(() => {
      triggerProcessing();
    }, 1500);

  } else {
    // Case 3: Start Recording
    new Notice("🎙️ Listening...");
    window.isThinkRecording = true;
    window.journalRecording = true;
    app.commands.executeCommandById("audio-recorder:start");
    updateButton();
  }
};

async function triggerProcessing() {
  const journalFile = app.workspace.getActiveFile();
  const journalPath = journalFile ? journalFile.path : null;

  // Remove the recording link (only if it was an internal recording)
  if (journalFile) {
    let content = await app.vault.read(journalFile);
    const linkRegex = /!\[\[(.*?\/)?Recording \d{14}\.(m4a|webm|mp3|wav|ogg)\]\]\n?/g;
    if (content.match(linkRegex)) {
      content = content.replace(linkRegex, "");
      await app.vault.modify(journalFile, content);
      new Notice("🧹 Removed audio link from page.");
    }
  }

  const tpPlugin = app.plugins.plugins["templater-obsidian"];
  if (tpPlugin) {
    const tp = tpPlugin.templater;
    const templateFile = app.vault.getAbstractFileByPath(`Templates/Template - Voice Journal.md`);
    if (templateFile) {
      await tp.create_new_note_from_template(templateFile, "1. Inbox");

      if (journalPath) {
        setTimeout(() => {
          app.workspace.openLinkText(journalPath, "", false);
          new Notice("🎙️ Processed!");
        }, 100);
      }

      const cleanupUntitled = async () => {
        // ... existing cleanup logic ...
        const inboxFiles = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("1. Inbox"));
        for (const file of inboxFiles) {
          if (file.name.startsWith("Untitled")) {
            try { await app.vault.delete(file); } catch (e) { }
          }
        }
      };
      setTimeout(cleanupUntitled, 500);
      setTimeout(cleanupUntitled, 2000);
    }
  }
  btn.disabled = false;
  // Re-check inbox
  setTimeout(updateButton, 2000);
}

// Initial Check
setTimeout(updateButton, 500);

// Start loop
updateButton();
const checker = setInterval(() => {
  if (!document.body.contains(btn)) {
    clearInterval(checker);
    return;
  }
  updateButton();
}, 1000);
