// 📷 MEDIA GALLERY - Apple Journal Style
// Supports Photos & Videos
// Multi-select delete, auto-hero, drag to reorder (desktop + mobile)

const currentFile = dv.current().file;
// Match DD-MM-YYYY or YYYY-MM-DD format
const ddmmMatch = currentFile.name.match(/(\d{2})-(\d{2})-(\d{4})/);
const yyyyMatch = currentFile.name.match(/(\d{4})-(\d{2})-(\d{2})/);
const journalDate = ddmmMatch ? `${ddmmMatch[3]}-${ddmmMatch[2]}-${ddmmMatch[1]}` :
    yyyyMatch ? `${yyyyMatch[1]}-${yyyyMatch[2]}-${yyyyMatch[3]}` :
        moment().format("YYYY-MM-DD");
const photoFolder = `Attachments/Daily Photos/${journalDate}`;

// Track state
let selectedPhotos = new Set();
let isEditMode = false;
let draggedPhoto = null;
let draggedElement = null;
let touchDragClone = null;

// 🎨 STYLES
const styleId = "ajd-v7-styles";
let existingStyle = document.getElementById(styleId);
if (existingStyle) existingStyle.remove();

const style = document.createElement("style");
style.id = styleId;
style.textContent = `
    .ajd-wrap { margin: 12px 0 20px 0; }
    
    .ajd-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .ajd-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .ajd-count {
        font-size: 11px;
        background: var(--interactive-accent);
        color: white;
        padding: 2px 7px;
        border-radius: 10px;
    }
    
    .ajd-btns {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    
    .ajd-btn {
        font-size: 12px;
        font-weight: 500;
        background: transparent;
        border: none;
        padding: 5px 12px;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .ajd-add { color: var(--interactive-accent); }
    .ajd-add:hover { background: var(--interactive-accent); color: white; }
    .ajd-edit { color: var(--text-muted); }
    .ajd-edit:hover { background: var(--background-modifier-hover); }
    .ajd-edit.active { background: rgba(255, 59, 48, 0.15); color: rgb(255, 59, 48); }
    
    .ajd-delete-selected { background: rgb(255, 59, 48); color: white; display: none; }
    .ajd-delete-selected.visible { display: block; }
    .ajd-delete-selected:hover { background: rgb(220, 50, 40); }
    
    .ajd-drop {
        border: 1.5px dashed var(--text-faint);
        border-radius: 14px;
        padding: 18px;
        text-align: center;
        background: var(--background-secondary);
        margin-bottom: 10px;
        display: none;
        font-size: 13px;
        color: var(--text-muted);
    }
    
    .ajd-drop.active { display: block; }
    .ajd-drop.dragover { border-color: var(--interactive-accent); }
    
    .ajd-grid {
        display: flex;
        flex-direction: column;
        gap: 3px;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .ajd-row { display: flex; gap: 3px; width: 100%; }
    
    .ajd-photo {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        background: var(--background-secondary);
        border-radius: 8px;
        flex-shrink: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        touch-action: none;
    }
    
    .ajd-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        pointer-events: none;
    }
    
    .ajd-photo:hover img { transform: scale(1.04); }
    
    .ajd-hero-badge {
        position: absolute;
        bottom: 6px;
        left: 6px;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 6px;
        z-index: 5;
    }
    
    .ajd-photo.dragging { opacity: 0.3; }
    .ajd-photo.drag-over {
        outline: 3px solid var(--interactive-accent);
        outline-offset: -3px;
    }
    
    /* Touch drag clone */
    .ajd-drag-clone {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.85;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        transform: scale(1.05);
    }
    
    .ajd-sel {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid rgba(0,0,0,0.2);
        color: transparent;
        font-size: 14px;
        font-weight: bold;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    
    .ajd-wrap.edit-mode .ajd-sel { display: flex; }
    .ajd-photo.selected .ajd-sel { background: rgb(255, 59, 48); border-color: rgb(255, 59, 48); color: white; }
    .ajd-photo.selected { opacity: 0.7; }
    .ajd-photo.selected::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 3px solid rgb(255, 59, 48);
        border-radius: 8px;
        pointer-events: none;
    }
    
    .ajd-wrap.edit-mode .ajd-photo {
        animation: wiggle 0.3s ease-in-out infinite alternate;
        cursor: grab;
    }
    .ajd-wrap.edit-mode .ajd-photo:active { cursor: grabbing; }
    
    @keyframes wiggle {
        0% { transform: rotate(-0.5deg); }
        100% { transform: rotate(0.5deg); }
    }
    
    .ajd-wrap.edit-mode .ajd-photo:hover img { transform: none; }
    
    .ajd-more {
        position: absolute;
        inset: 0;
        background: rgba(80, 80, 80, 0.65);
        backdrop-filter: blur(1px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }
    
    .ajd-more-num { font-size: 20px; font-weight: 600; color: white; }
    
    .ajd-empty {
        text-align: center;
        padding: 28px;
        background: var(--background-secondary);
        border-radius: 14px;
        color: var(--text-muted);
        font-size: 13px;
    }
    
    /* ===== APPLE STYLE LIGHTBOX ===== */
    .ajd-lb-v7 {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.92);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .ajd-lb-v7.active { 
        opacity: 1; 
        visibility: visible; 
    }
    
    /* Image container - simple single image */
    .ajd-lb-v7 .lb-wrap {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 20px 180px 20px;
        overflow: hidden;
    }
    
    .ajd-lb-v7 .lb-wrap img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 16px;
        box-shadow: 0 25px 80px rgba(0,0,0,0.6);
        user-select: none;
        transition: opacity 0.2s ease;
    }
    
    .ajd-lb-v7.active .lb-wrap img {
        animation: lb-fade-in 0.3s ease;
    }
    
    @keyframes lb-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes lb-zoom-in {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    /* Hide side nav and top close */
    .ajd-lb-v7 .lb-close,
    .ajd-lb-v7 .lb-nav { display: none; }
    
    /* ===== BOTTOM BAR WITH THUMBNAILS ===== */
    .ajd-lb-v7 .lb-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(30,30,30,0.95) 0%, rgba(30,30,30,0.9) 70%, transparent 100%);
        padding: 12px 16px 30px 16px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    /* Thumbnail strip */
    .ajd-lb-v7 .lb-thumbs {
        display: flex;
        gap: 4px;
        justify-content: center;
        overflow-x: auto;
        padding: 4px 0;
        scrollbar-width: none;
    }
    .ajd-lb-v7 .lb-thumbs::-webkit-scrollbar { display: none; }
    
    .ajd-lb-v7 .lb-thumb {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        flex-shrink: 0;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        opacity: 0.6;
    }
    
    .ajd-lb-v7 .lb-thumb:hover { opacity: 0.9; }
    
    .ajd-lb-v7 .lb-thumb.active {
        border-color: white;
        opacity: 1;
        transform: scale(1.08);
    }
    
    .ajd-lb-v7 .lb-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    /* Controls row */
    .ajd-lb-v7 .lb-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .ajd-lb-v7 .lb-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .ajd-lb-v7 .lb-btn:hover { background: rgba(255,255,255,0.2); }
    
    .ajd-lb-v7 .lb-btn.hero-btn { color: #ffd60a; }
    .ajd-lb-v7 .lb-btn.hero-btn:hover { background: rgba(255, 214, 10, 0.25); }
    
    .ajd-lb-v7 .lb-btn.delete { color: #ff453a; }
    .ajd-lb-v7 .lb-btn.delete:hover { background: rgba(255, 69, 58, 0.25); }
    
    .ajd-lb-v7 .lb-cnt {
        color: rgba(255,255,255,0.7);
        font-size: 13px;
        font-weight: 500;
        padding: 0 16px;
        min-width: 70px;
        text-align: center;
    }
    
    .ajd-lb-v7 .lb-divider {
        width: 1px;
        height: 24px;
        background: rgba(255,255,255,0.2);
        margin: 0 4px;
    }
    
    @media (max-width: 600px) {
        .ajd-lb-v7 .lb-bar { padding-bottom: 40px; }
        .ajd-lb-v7 .lb-thumb { width: 60px; height: 60px; }
        .ajd-lb-v7 .lb-btn { width: 36px; height: 36px; font-size: 14px; }
    }
`;
document.head.appendChild(style);

// 🗂️ MEDIA (Photos + Videos)
const folder = app.vault.getAbstractFileByPath(photoFolder);
let photos = []; // "photos" array now includes videos too
const imageExts = /\.(jpg|jpeg|png|gif|webp|heic)$/i;
const videoExts = /\.(mp4|mov|webm|m4v)$/i;

const isVideo = (file) => videoExts.test(file.name);
const isImage = (file) => imageExts.test(file.name);

if (folder?.children) {
    photos = folder.children
        .filter(f => imageExts.test(f.name) || videoExts.test(f.name))
        .filter(f => !f.name.toLowerCase().startsWith('hero'))
        .sort((a, b) => {
            const aOrder = a.name.match(/^(\d+)_/);
            const bOrder = b.name.match(/^(\d+)_/);
            if (aOrder && bOrder) return parseInt(aOrder[1]) - parseInt(bOrder[1]);
            return b.stat.mtime - a.stat.mtime;
        });
}

const getUrl = (p) => app.vault.adapter.getResourcePath(p.path);

// 🔄 AUTO-HERO + LIVE UPDATE
async function setFirstAsHero(forceRefresh = false) {
    if (photos.length === 0) return;
    const firstPhoto = photos[0];
    const ext = firstPhoto.name.split('.').pop().toLowerCase();
    const heroPath = `${photoFolder}/hero.${ext === 'png' ? 'png' : 'jpg'}`;

    // INSTANT UPDATE 1: Use existing file URL (Zero Latency)
    // CRITICAL FIX: Find the hero relative to THIS VIEW, not globally
    // We look up to the markdown-preview-view then down to journal-hero
    const viewContainer = wrapper.closest('.markdown-preview-view') || wrapper.closest('.markdown-source-view') || document.body;
    const heroEl = viewContainer.querySelector ? viewContainer.querySelector('.journal-hero') : document.querySelector('.journal-hero');

    if (heroEl) {
        heroEl.classList.add('has-photo');
        const quickUrl = getUrl(firstPhoto);
        heroEl.style.backgroundImage = `url('${quickUrl}')`;
    }

    try {
        // Read the photo data
        const photoData = await app.vault.readBinary(firstPhoto);

        // INSTANT UPDATE 2: Blob URL (Reliable fallback)
        if (heroEl) {
            const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
            const blob = new Blob([photoData], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            heroEl.style.backgroundImage = `url('${blobUrl}')`;
        }

        // Delete old hero files (both extensions)
        const jpgHero = app.vault.getAbstractFileByPath(`${photoFolder}/hero.jpg`);
        const pngHero = app.vault.getAbstractFileByPath(`${photoFolder}/hero.png`);
        if (jpgHero) await app.vault.delete(jpgHero);
        if (pngHero) await app.vault.delete(pngHero);

        // Write new hero file
        await app.vault.createBinary(heroPath, photoData);

        // SAFETY REFRESH: Rebuild view after delay to ensure consistency
        if (forceRefresh !== 'no-refresh') {
            setTimeout(() => {
                // Check if view is still valid
                if (wrapper && wrapper.offsetParent) {
                    app.workspace.activeLeaf.rebuildView();
                }
            }, 2000);
        }
    } catch (e) { console.log("Auto-hero error:", e); }
}

if (photos.length > 0) setFirstAsHero();

// 🏗️ BUILD
const wrapper = dv.el("div", "", { cls: "ajd-wrap" });

const header = wrapper.createEl("div", { cls: "ajd-header" });
const title = header.createEl("div", { cls: "ajd-title" });
title.createEl("span", { text: "📷 Media" });
const countBadge = title.createEl("span", { text: photos.length, cls: "ajd-count" });
if (!photos.length) countBadge.style.display = "none";

const btns = header.createEl("div", { cls: "ajd-btns" });
const deleteSelectedBtn = btns.createEl("button", { cls: "ajd-btn ajd-delete-selected" });
deleteSelectedBtn.textContent = "Delete (0)";
const editBtn = btns.createEl("button", { text: "Edit", cls: "ajd-btn ajd-edit" });
const addBtn = btns.createEl("button", { text: "Add", cls: "ajd-btn ajd-add" });

function updateDeleteBtn() {
    const count = selectedPhotos.size;
    deleteSelectedBtn.textContent = `Delete (${count})`;
    deleteSelectedBtn.classList.toggle("visible", count > 0);
}

editBtn.onclick = () => {
    isEditMode = !isEditMode;
    wrapper.classList.toggle("edit-mode", isEditMode);
    editBtn.textContent = isEditMode ? "Done" : "Edit";
    editBtn.classList.toggle("active", isEditMode);
    if (!isEditMode) {
        selectedPhotos.clear();
        wrapper.querySelectorAll(".ajd-photo.selected").forEach(p => p.classList.remove("selected"));
        updateDeleteBtn();
    }
};

deleteSelectedBtn.onclick = async () => {
    if (selectedPhotos.size === 0) return;
    const count = selectedPhotos.size;
    if (confirm(`Delete ${count} photo${count > 1 ? 's' : ''} permanently?`)) {
        for (const photoPath of Array.from(selectedPhotos)) {
            const photoFile = photos.find(p => p.path === photoPath);
            if (photoFile) {
                try {
                    await app.vault.delete(photoFile);
                    const el = wrapper.querySelector(`[data-path="${photoPath}"]`);
                    if (el) el.remove();
                    const idx = photos.findIndex(p => p.path === photoPath);
                    if (idx > -1) photos.splice(idx, 1);
                } catch (e) { }
            }
        }
        selectedPhotos.clear();
        updateDeleteBtn();
        countBadge.textContent = photos.length;
        if (!photos.length) {
            countBadge.style.display = "none";
            editBtn.style.display = "none";
            wrapper.classList.remove("edit-mode");
            isEditMode = false;
        } else {
            setFirstAsHero(true);
        }
        new Notice(`🗑 Deleted ${count} photo${count > 1 ? 's' : ''}`);
    }
};

const drop = wrapper.createEl("div", { cls: "ajd-drop" });
drop.textContent = "📸 Drop photos/videos or tap to browse";
const input = wrapper.createEl("input", { type: "file" });
input.multiple = true;
input.accept = "image/*,video/*";
input.style.display = "none";

// Store all photo elements for reordering
const photoElements = [];

// IMPROVED REORDER - More reliable
async function handleReorder(targetPath, draggedPath) {
    const draggedIdx = photos.findIndex(p => p.path === draggedPath);
    const targetIdx = photos.findIndex(p => p.path === targetPath);
    if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return;

    // Reorder the photos array
    const [moved] = photos.splice(draggedIdx, 1);
    photos.splice(targetIdx, 0, moved);

    new Notice("📷 Reordering...");

    // 1. INSTANT HERO UPDATE (If first position changed)
    if (targetIdx === 0 || draggedIdx === 0) {
        setFirstAsHero(false); // Update DOM immediately, background file ops async
    }

    // VISUALLY UPDATE FIRST for immediate feedback
    const allPhotoEls = wrapper.querySelectorAll('.ajd-photo');
    allPhotoEls.forEach((el, i) => {
        if (i < photos.length) {
            const photo = photos[i];
            el.dataset.path = photo.path;
            el.dataset.index = i;
            const img = el.querySelector('img');
            if (img) img.src = getUrl(photo);

            // Update hero badge
            const badge = el.querySelector('.ajd-hero-badge');
            if (i === 0 && !badge) {
                const newBadge = document.createElement('div');
                newBadge.className = 'ajd-hero-badge';
                newBadge.textContent = '★ HERO';
                el.appendChild(newBadge);
            } else if (i !== 0 && badge) {
                badge.remove();
            }
        }
    });

    // Rename files to persist order
    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const oldName = photo.name;
        const baseName = oldName.replace(/^\d+_/, '');
        const newName = `${String(i).padStart(3, '0')}_${baseName}`;
        if (oldName !== newName) {
            try {
                await app.vault.rename(photo, photo.path.replace(oldName, newName));
            } catch (e) {
                console.log("Rename error:", e);
            }
        }
    }

    new Notice("✅ Reordered!");
}

// Create photo element
function createPhoto(photoData, index, width, height, isLast, remaining) {
    const photo = document.createElement("div");
    photo.className = "ajd-photo";
    photo.style.width = width;
    photo.style.height = height;
    photo.dataset.path = photoData.path;
    photo.dataset.index = index;

    // Check if this is a video
    const isVid = isVideo(photoData);

    if (isVid) {
        // Video thumbnail - use a poster frame or show video icon
        const vid = photo.createEl("video");
        vid.src = getUrl(photoData);
        vid.muted = true;
        vid.preload = "metadata";
        vid.style.cssText = "width:100%;height:100%;object-fit:cover;pointer-events:none;";

        // Play icon overlay
        const playIcon = photo.createEl("div");
        playIcon.innerHTML = "▶";
        playIcon.style.cssText = `
            position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
            font-size:32px; color:white; background:rgba(0,0,0,0.3); pointer-events:none;
        `;
    } else {
        const img = photo.createEl("img");
        img.src = getUrl(photoData);
    }

    if (index === 0) {
        const badge = photo.createEl("div", { text: "★ HERO", cls: "ajd-hero-badge" });
        // Add click handler to manually force update if needed (User Request)
        badge.onclick = (e) => {
            e.stopPropagation(); // Prevent selection
            new Notice("💫 Refreshing Hero...");
            setFirstAsHero(true); // true = allow safety rebuild
        };
        badge.style.cursor = "pointer";
        badge.title = "Click to refresh Hero Image";
    }

    const sel = photo.createEl("div", { cls: "ajd-sel" });
    sel.innerHTML = "✓";

    if (isLast && remaining > 0) {
        const more = photo.createEl("div", { cls: "ajd-more" });
        more.createEl("div", { text: `+${remaining}`, cls: "ajd-more-num" });
    }

    // Desktop drag
    photo.draggable = true;
    photo.ondragstart = (e) => {
        if (!isEditMode) { e.preventDefault(); return; }
        draggedPhoto = photoData.path;
        draggedElement = photo;
        photo.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    };
    photo.ondragend = () => {
        photo.classList.remove("dragging");
        draggedPhoto = null;
        draggedElement = null;
    };
    photo.ondragover = (e) => {
        if (!isEditMode || !draggedPhoto || draggedPhoto === photoData.path) return;
        e.preventDefault();
        photo.classList.add("drag-over");
    };
    photo.ondragleave = () => photo.classList.remove("drag-over");
    photo.ondrop = (e) => {
        e.preventDefault();
        photo.classList.remove("drag-over");
        if (draggedPhoto && draggedPhoto !== photoData.path) {
            handleReorder(photoData.path, draggedPhoto);
        }
    };

    // Mobile touch drag
    let touchStartX = 0, touchStartY = 0, isDragging = false, longPressTimer = null;

    photo.ontouchstart = (e) => {
        if (!isEditMode) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Long press to start drag
        longPressTimer = setTimeout(() => {
            isDragging = true;
            draggedPhoto = photoData.path;
            draggedElement = photo;
            photo.classList.add("dragging");

            // Create visual clone
            touchDragClone = document.createElement("div");
            touchDragClone.className = "ajd-drag-clone";
            touchDragClone.innerHTML = `<img src="${getUrl(photoData)}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">`;
            touchDragClone.style.left = `${touchStartX - 40}px`;
            touchDragClone.style.top = `${touchStartY - 40}px`;
            document.body.appendChild(touchDragClone);

            navigator.vibrate?.(50);
        }, 300);
    };

    photo.ontouchmove = (e) => {
        if (!isEditMode) return;
        const touch = e.touches[0];
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);

        if (!isDragging && (moveX > 10 || moveY > 10)) {
            clearTimeout(longPressTimer);
        }

        if (isDragging && touchDragClone) {
            e.preventDefault();
            touchDragClone.style.left = `${touch.clientX - 40}px`;
            touchDragClone.style.top = `${touch.clientY - 40}px`;

            // Highlight drop target
            wrapper.querySelectorAll('.ajd-photo').forEach(p => p.classList.remove('drag-over'));
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetPhoto = target?.closest('.ajd-photo');
            if (targetPhoto && targetPhoto !== photo) {
                targetPhoto.classList.add('drag-over');
            }
        }
    };

    photo.ontouchend = async (e) => {
        clearTimeout(longPressTimer);

        if (isDragging) {
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetPhoto = target?.closest('.ajd-photo');

            if (targetPhoto && targetPhoto !== photo) {
                const targetPath = targetPhoto.dataset.path;
                // Await the reorder to ensure hero update happens
                await handleReorder(targetPath, draggedPhoto);
                // Extra safety: force hero update again on mobile (no refresh)
                if (app.isMobile) await setFirstAsHero(false);
            }

            wrapper.querySelectorAll('.ajd-photo').forEach(p => p.classList.remove('drag-over'));
            photo.classList.remove("dragging");

            if (touchDragClone) {
                touchDragClone.remove();
                touchDragClone = null;
            }

            draggedPhoto = null;
            draggedElement = null;
            isDragging = false;
            return;
        }

        // Normal tap = select/deselect
        if (!isDragging) {
            const path = photoData.path;
            if (selectedPhotos.has(path)) {
                selectedPhotos.delete(path);
                photo.classList.remove("selected");
            } else {
                selectedPhotos.add(path);
                photo.classList.add("selected");
            }
            updateDeleteBtn();
        }
    };

    photo.onclick = (e) => {
        if (e.target.closest('.ajd-sel')) {
            // Selection click
            const path = photoData.path;
            if (selectedPhotos.has(path)) {
                selectedPhotos.delete(path);
                photo.classList.remove("selected");
            } else {
                selectedPhotos.add(path);
                photo.classList.add("selected");
            }
            updateDeleteBtn();
            return;
        }

        if (!isEditMode) {
            openLb(index);
        } else if (!('ontouchstart' in window)) {
            // Desktop click = select
            const path = photoData.path;
            if (selectedPhotos.has(path)) {
                selectedPhotos.delete(path);
                photo.classList.remove("selected");
            } else {
                selectedPhotos.add(path);
                photo.classList.add("selected");
            }
            updateDeleteBtn();
        }
    };

    photoElements.push(photo);
    return photo;
}

// RENDER PHOTOS
if (!photos.length) {
    wrapper.createEl("div", { cls: "ajd-empty" }).textContent = "📷 No photos yet";
    editBtn.style.display = "none";
} else {
    const grid = wrapper.createEl("div", { cls: "ajd-grid" });
    const count = photos.length;

    if (count === 1) {
        const row = grid.createEl("div", { cls: "ajd-row" });
        row.appendChild(createPhoto(photos[0], 0, "100%", "180px", false, 0));
    } else if (count === 2) {
        const row = grid.createEl("div", { cls: "ajd-row" });
        row.appendChild(createPhoto(photos[0], 0, "50%", "140px", false, 0));
        row.appendChild(createPhoto(photos[1], 1, "50%", "140px", false, 0));
    } else if (count === 3) {
        const row = grid.createEl("div", { cls: "ajd-row" });
        row.appendChild(createPhoto(photos[0], 0, "55%", "180px", false, 0));
        const stack = document.createElement("div");
        stack.style.cssText = "display:flex;flex-direction:column;gap:3px;width:45%;height:180px;";
        stack.appendChild(createPhoto(photos[1], 1, "100%", "calc(50% - 1.5px)", false, 0));
        stack.appendChild(createPhoto(photos[2], 2, "100%", "calc(50% - 1.5px)", false, 0));
        row.appendChild(stack);
    } else if (count === 4) {
        const row = grid.createEl("div", { cls: "ajd-row" });
        row.appendChild(createPhoto(photos[0], 0, "50%", "180px", false, 0));
        const right = document.createElement("div");
        right.style.cssText = "display:flex;flex-direction:column;gap:3px;width:50%;height:180px;";
        const topRow = document.createElement("div");
        topRow.style.cssText = "display:flex;gap:3px;height:50%;";
        topRow.appendChild(createPhoto(photos[1], 1, "50%", "100%", false, 0));
        topRow.appendChild(createPhoto(photos[2], 2, "50%", "100%", false, 0));
        right.appendChild(topRow);
        right.appendChild(createPhoto(photos[3], 3, "100%", "calc(50% - 3px)", false, 0));
        row.appendChild(right);
    } else if (count === 5) {
        const row = grid.createEl("div", { cls: "ajd-row" });
        row.appendChild(createPhoto(photos[0], 0, "50%", "200px", false, 0));
        const right = document.createElement("div");
        right.style.cssText = "display:flex;flex-direction:column;gap:3px;width:50%;height:200px;";
        const topRow = document.createElement("div");
        topRow.style.cssText = "display:flex;gap:3px;height:50%;";
        topRow.appendChild(createPhoto(photos[1], 1, "50%", "100%", false, 0));
        topRow.appendChild(createPhoto(photos[2], 2, "50%", "100%", false, 0));
        right.appendChild(topRow);
        const botRow = document.createElement("div");
        botRow.style.cssText = "display:flex;gap:3px;height:50%;";
        botRow.appendChild(createPhoto(photos[3], 3, "50%", "100%", false, 0));
        botRow.appendChild(createPhoto(photos[4], 4, "50%", "100%", false, 0));
        right.appendChild(botRow);
        row.appendChild(right);
    } else {
        const maxShow = Math.min(count, 8);
        const remaining = count - maxShow;
        const mainRow = grid.createEl("div", { cls: "ajd-row" });
        mainRow.appendChild(createPhoto(photos[0], 0, "50%", "180px", false, 0));
        const right = document.createElement("div");
        right.style.cssText = "display:flex;flex-direction:column;gap:3px;width:50%;height:180px;";
        const topRow = document.createElement("div");
        topRow.style.cssText = "display:flex;gap:3px;height:50%;";
        topRow.appendChild(createPhoto(photos[1], 1, "50%", "100%", false, 0));
        topRow.appendChild(createPhoto(photos[2], 2, "50%", "100%", false, 0));
        right.appendChild(topRow);
        const midRow = document.createElement("div");
        midRow.style.cssText = "display:flex;gap:3px;height:50%;";
        midRow.appendChild(createPhoto(photos[3], 3, "50%", "100%", false, 0));
        midRow.appendChild(createPhoto(photos[4], 4, "50%", "100%", false, 0));
        right.appendChild(midRow);
        mainRow.appendChild(right);
        if (count > 5) {
            const bottomRow = grid.createEl("div", { cls: "ajd-row" });
            const bottomCount = Math.min(count - 5, 4);
            const bottomWidth = `${100 / bottomCount}%`;
            for (let i = 5; i < 5 + bottomCount; i++) {
                const isLast = (i === 5 + bottomCount - 1);
                bottomRow.appendChild(createPhoto(photos[i], i, bottomWidth, "80px", isLast, remaining));
            }
        }
    }
}

// LIGHTBOX - Apple Photos Style Carousel
const oldLb = document.querySelector(".ajd-lb-v7");
if (oldLb) oldLb.remove();

const lb = document.body.createEl("div", { cls: "ajd-lb-v7" });

// Build thumbnail strip
let thumbsHtml = '';
photos.forEach((p, i) => {
    thumbsHtml += `<div class="lb-thumb${i === 0 ? ' active' : ''}" data-idx="${i}"><img src="${getUrl(p)}"></div>`;
});

lb.innerHTML = `
    <div class="lb-wrap">
        <img src="" style="display:none;">
        <video src="" controls style="display:none; max-width:100%; max-height:100%; border-radius:16px;"></video>
    </div>
    <div class="lb-bar">
        <div class="lb-thumbs">${thumbsHtml}</div>
        <div class="lb-controls">
            <button class="lb-btn close-btn">✕</button>
            <div class="lb-divider"></div>
            <button class="lb-btn prev-btn">❮</button>
            <div class="lb-cnt">1 of ${photos.length}</div>
            <button class="lb-btn next-btn">❯</button>
            <div class="lb-divider"></div>
            <button class="lb-btn hero-btn" title="Set as Hero">★</button>
            <button class="lb-btn delete">🗑</button>
        </div>
    </div>
`;

let idx = 0;
const lbImg = lb.querySelector(".lb-wrap img");
const lbVid = lb.querySelector(".lb-wrap video");

function showMedia(mediaFile) {
    if (isVideo(mediaFile)) {
        lbImg.style.display = "none";
        lbVid.style.display = "block";
        lbVid.src = getUrl(mediaFile);
        lbVid.load();
    } else {
        lbVid.style.display = "none";
        lbVid.pause();
        lbImg.style.display = "block";
        lbImg.src = getUrl(mediaFile);
    }
}

function openLb(i) {
    idx = i;
    showMedia(photos[idx]);
    updateThumbs();
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLb() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
    lbVid.pause(); // Stop video when closing
}

function updateThumbs() {
    lb.querySelector(".lb-cnt").textContent = `${idx + 1} of ${photos.length}`;
    lb.querySelectorAll(".lb-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
    const activeThumb = lb.querySelector(".lb-thumb.active");
    if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

// Simple navigation - instant media switch
function navigateTo(newIdx) {
    if (photos.length <= 1 || newIdx === idx) return;
    lbVid.pause(); // Pause current video if playing
    idx = newIdx;
    showMedia(photos[idx]);
    updateThumbs();
}

// Thumbnail click
lb.querySelectorAll(".lb-thumb").forEach(thumb => {
    thumb.onclick = () => {
        const newIdx = parseInt(thumb.dataset.idx);
        navigateTo(newIdx);
    };
});

lb.querySelector(".close-btn").onclick = closeLb;
lb.querySelector(".lb-wrap").onclick = (e) => { if (e.target.classList.contains("lb-wrap")) closeLb(); };

// Set as Hero - moves photo to first position
lb.querySelector(".hero-btn").onclick = async () => {
    if (!photos.length || idx === 0) {
        new Notice("Already the hero!");
        return;
    }

    const photo = photos[idx];

    // Move to first position in array
    photos.splice(idx, 1);
    photos.unshift(photo);

    // Rename files to persist order
    for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const oldName = p.name;
        const baseName = oldName.replace(/^\d+_/, '');
        const newName = `${String(i).padStart(3, '0')}_${baseName}`;
        if (oldName !== newName) {
            try { await app.vault.rename(p, p.path.replace(oldName, newName)); } catch (e) { }
        }
    }

    // Update hero image
    setFirstAsHero(true);

    // Update gallery visually
    const allPhotoEls = wrapper.querySelectorAll('.ajd-photo');
    allPhotoEls.forEach((el, i) => {
        if (i < photos.length) {
            el.dataset.path = photos[i].path;
            el.dataset.index = i;
            const img = el.querySelector('img');
            if (img) img.src = getUrl(photos[i]);

            const badge = el.querySelector('.ajd-hero-badge');
            if (i === 0 && !badge) {
                const newBadge = document.createElement('div');
                newBadge.className = 'ajd-hero-badge';
                newBadge.textContent = '★ HERO';
                el.appendChild(newBadge);
            } else if (i !== 0 && badge) {
                badge.remove();
            }
        }
    });

    // Update lightbox
    idx = 0;
    currentSlide.querySelector("img").src = getUrl(photos[0]);
    updateThumbs();

    new Notice("★ Set as Hero!");
};

// Delete
lb.querySelector(".lb-btn.delete").onclick = async () => {
    if (!photos.length) return;
    const photo = photos[idx];
    if (confirm(`Delete this photo?\n${photo.name}`)) {
        try {
            await app.vault.delete(photo);
            const el = wrapper.querySelector(`[data-path="${photo.path}"]`);
            if (el) el.remove();
            photos.splice(idx, 1);
            countBadge.textContent = photos.length;
            if (!photos.length) {
                closeLb();
            } else {
                idx = Math.min(idx, photos.length - 1);
                currentSlide.querySelector("img").src = getUrl(photos[idx]);
                updateThumbs();
                setFirstAsHero(true);
            }
            new Notice("🗑 Deleted");
        } catch (e) { new Notice("❌ Failed"); }
    }
};

// Navigation buttons
lb.querySelector(".prev-btn").onclick = (e) => {
    e.stopPropagation();
    navigateTo((idx - 1 + photos.length) % photos.length);
};
lb.querySelector(".next-btn").onclick = (e) => {
    e.stopPropagation();
    navigateTo((idx + 1) % photos.length);
};

// Touch swipe
let startX = 0, startY = 0;
const lbWrap = lb.querySelector(".lb-wrap");
lbWrap.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].screenX; startY = e.changedTouches[0].screenY; }, { passive: true });
lbWrap.addEventListener("touchend", (e) => {
    const diffX = startX - e.changedTouches[0].screenX;
    const diffY = startY - e.changedTouches[0].screenY;
    if (Math.abs(diffY) > 80 && Math.abs(diffY) > Math.abs(diffX)) { closeLb(); return; }
    if (Math.abs(diffX) > 50) {
        const newIdx = diffX > 0 ? (idx + 1) % photos.length : (idx - 1 + photos.length) % photos.length;
        navigateTo(newIdx);
    }
}, { passive: true });

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") { navigateTo((idx - 1 + photos.length) % photos.length); }
    if (e.key === "ArrowRight") { navigateTo((idx + 1) % photos.length); }
});

// FILE HANDLING
async function ensureFolder() {
    const parts = photoFolder.split("/");
    let cur = "";
    for (const p of parts) {
        cur = cur ? `${cur}/${p}` : p;
        if (!app.vault.getAbstractFileByPath(cur)) await app.vault.createFolder(cur);
    }
}

async function save(files) {
    await ensureFolder();
    let n = 0;
    const startIdx = photos.length;
    let firstPhotoPath = null;

    for (const f of files) {
        try {
            const newPath = `${photoFolder}/${String(startIdx + n).padStart(3, '0')}_${Date.now()}_${f.name}`;
            await app.vault.createBinary(newPath, await f.arrayBuffer());
            if (n === 0) firstPhotoPath = newPath; // Track first photo
            n++;
        } catch (e) { }
    }

    if (n) {
        // AUTO-HERO: If no hero exists, set first uploaded photo as hero
        const heroPath = `${photoFolder}/hero.jpg`;
        const heroPngPath = `${photoFolder}/hero.png`;
        const existingHero = app.vault.getAbstractFileByPath(heroPath) || app.vault.getAbstractFileByPath(heroPngPath);

        if (!existingHero && firstPhotoPath) {
            try {
                const firstFile = app.vault.getAbstractFileByPath(firstPhotoPath);
                if (firstFile) {
                    const data = await app.vault.readBinary(firstFile);
                    await app.vault.createBinary(heroPath, data);
                    new Notice(`📸 Added ${n} photo${n > 1 ? 's' : ''} + Set Hero!`);
                }
            } catch (e) {
                new Notice(`📸 Added ${n} photo${n > 1 ? 's' : ''}`);
            }
        } else {
            new Notice(`📸 Added ${n} photo${n > 1 ? 's' : ''}`);
        }

        setTimeout(() => app.workspace.activeLeaf.rebuildView(), 400);
    }
}

addBtn.onclick = () => { drop.classList.toggle("active"); addBtn.textContent = drop.classList.contains("active") ? "Cancel" : "Add"; };
drop.onclick = () => input.click();
input.onchange = async (e) => { if (e.target.files.length) { await save(e.target.files); drop.classList.remove("active"); addBtn.textContent = "Add"; } };
drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("dragover"); };
drop.ondragleave = () => drop.classList.remove("dragover");
drop.ondrop = async (e) => {
    e.preventDefault();
    drop.classList.remove("dragover");
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (files.length) { await save(files); drop.classList.remove("active"); addBtn.textContent = "Add"; }
};
