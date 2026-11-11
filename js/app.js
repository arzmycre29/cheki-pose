import { CHEKI_POSES, MODE_INFO } from './poses-data.js';
import { renderPoseDiagram } from './diagrams.js';
import { sfx } from './audio.js';
import { wishlist } from './wishlist.js';
import { PolaroidStudio } from './polaroid.js';

class ChekiApp {
  constructor() {
    this.currentTab = 'gacha';
    this.currentMode = 'cute'; // cute (default), fun, meme, all
    this.currentSopFilter = 'all';
    this.searchQuery = '';
    this.selectedPose = null;
    this.isRolling = false;
    this.polaroidStudio = new PolaroidStudio('polaroid-canvas');
    this.wakeLock = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupTheme();
    this.renderCurrentView();
    this.updateWishlistBadge();
    
    // Default initial gacha display
    const cutePoses = this.getFilteredPoses('cute');
    if (cutePoses.length > 0) {
      this.displayGachaResult(cutePoses[0], false);
    }
  }

  // --- Data Getter ---
  getAllPoses() {
    return [...CHEKI_POSES, ...wishlist.customPoses];
  }

  getFilteredPoses(mode = this.currentMode, sop = this.currentSopFilter, query = this.searchQuery) {
    let list = this.getAllPoses();

    if (mode && mode !== 'all') {
      list = list.filter(p => p.mode === mode);
    }

    if (sop && sop !== 'all') {
      list = list.filter(p => p.sop === sop);
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.titleJp && p.titleJp.toLowerCase().includes(q)) ||
        (p.cueId && p.cueId.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return list;
  }

  getPoseById(id) {
    return this.getAllPoses().find(p => p.id === id);
  }

  // --- Theme & Sound Setup ---
  setupTheme() {
    if (wishlist.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    sfx.enabled = wishlist.settings.soundEnabled ?? true;
  }

  // --- Navigation & Tabs ---
  switchTab(tabId) {
    this.currentTab = tabId;
    sfx.playPop();

    // Update bottom nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.dataset.tab === tabId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update views
    document.querySelectorAll('.view-container').forEach(el => {
      el.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${tabId}`);
    if (activeView) {
      activeView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (tabId === 'katalog') {
      this.renderKatalog();
    } else if (tabId === 'wishlist') {
      this.renderWishlist();
    } else if (tabId === 'studio') {
      this.initStudioView();
    }
  }

  // --- Mode Switcher ---
  switchMode(modeKey) {
    this.currentMode = modeKey;
    sfx.playPop();

    // Update Mode Pill UI in Gacha & Katalog
    document.querySelectorAll('.mode-pill').forEach(btn => {
      if (btn.dataset.mode === modeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update body theme class for dynamic color accents
    document.body.dataset.mode = modeKey;

    if (this.currentTab === 'katalog') {
      this.renderKatalog();
    }
  }

  // ==========================================
  // GACHA / ROULETTE LOGIC
  // ==========================================
  rollGacha() {
    if (this.isRolling) return;

    const availablePoses = this.getFilteredPoses(this.currentMode, this.currentSopFilter);
    if (availablePoses.length === 0) {
      alert("Tidak ada pose yang cocok dengan filter saat ini! Coba ganti mode atau filter.");
      return;
    }

    this.isRolling = true;
    sfx.playPop();

    const gachaCard = document.getElementById('gacha-card');
    const rollBtn = document.getElementById('btn-roll-gacha');
    if (rollBtn) rollBtn.disabled = true;
    if (gachaCard) gachaCard.classList.add('spinning');

    let speed = 40;
    let counter = 0;
    const maxIterations = 18;

    const spinInterval = setInterval(() => {
      counter++;
      const randomCandidate = availablePoses[Math.floor(Math.random() * availablePoses.length)];
      this.displayGachaResult(randomCandidate, false);
      sfx.playSpin();

      if (counter >= maxIterations) {
        clearInterval(spinInterval);
        this.isRolling = false;
        if (rollBtn) rollBtn.disabled = false;
        if (gachaCard) gachaCard.classList.remove('spinning');

        // Final picked pose
        const finalPick = availablePoses[Math.floor(Math.random() * availablePoses.length)];
        this.displayGachaResult(finalPick, true);
        sfx.playFanfare();
        this.triggerConfetti();
      }
    }, speed);
  }

  displayGachaResult(pose, animate = false) {
    this.selectedPose = pose;
    const container = document.getElementById('gacha-result-content');
    if (!container) return;

    const customPhoto = wishlist.getCustomPhoto(pose.id);
    const diagramHtml = customPhoto 
      ? `<div class="custom-photo-wrap"><img src="${customPhoto}" alt="${pose.title}" class="custom-photo-img" /></div>`
      : renderPoseDiagram(pose.diagramType, pose.mode);

    const sopBadge = this.getSopBadgeHtml(pose.sop);
    const modeBadge = `<span class="badge badge-${pose.mode}">${MODE_INFO[pose.mode]?.emoji || '✨'} ${MODE_INFO[pose.mode]?.name || pose.mode}</span>`;

    container.innerHTML = `
      <div class="result-header">
        <div class="badges-row">
          ${modeBadge}
          ${sopBadge}
        </div>
        <h3 class="pose-title">${pose.title}</h3>
        <p class="pose-title-jp">${pose.titleJp || ''}</p>
      </div>

      <div class="diagram-container ${animate ? 'pop-in' : ''}">
        ${diagramHtml}
      </div>

      <div class="cue-box">
        <div class="cue-header">
          <span class="cue-label">🗣️ Cara Ngomong ke Oshi:</span>
          <button class="btn-copy-cue" title="Salin Cue" id="btn-copy-cue">📋 Salin</button>
        </div>
        <p class="cue-id">"${pose.cueId}"</p>
        <p class="cue-jp">🇯🇵 ${pose.cueJp}</p>
      </div>

      <div class="action-roles">
        <div class="role-col fan-role">
          <span class="role-tag">👤 Kamu (Fan)</span>
          <p>${pose.fanAction}</p>
        </div>
        <div class="role-col idol-role">
          <span class="role-tag">💖 Oshi (Idol)</span>
          <p>${pose.idolAction}</p>
        </div>
      </div>
    `;

    // Rebind copy cue button
    const copyBtn = document.getElementById('btn-copy-cue');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pose.cueId);
        copyBtn.textContent = '✅ Tersalin!';
        setTimeout(() => copyBtn.textContent = '📋 Salin', 2000);
      });
    }
  }

  triggerConfetti() {
    const card = document.getElementById('gacha-card');
    if (!card) return;
    card.classList.add('celebrate');
    setTimeout(() => card.classList.remove('celebrate'), 1000);
  }

  // ==========================================
  // KATALOG VIEW LOGIC
  // ==========================================
  renderKatalog() {
    const grid = document.getElementById('katalog-grid');
    if (!grid) return;

    const poses = this.getFilteredPoses();
    const countLabel = document.getElementById('katalog-count');
    if (countLabel) {
      countLabel.textContent = `${poses.length} pose ditemukan`;
    }

    if (poses.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <h4>Tidak ada pose yang cocok</h4>
          <p>Coba gunakan kata kunci lain atau ubah filter mode.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = poses.map(pose => {
      const customPhoto = wishlist.getCustomPhoto(pose.id);
      const thumbVisual = customPhoto
        ? `<img src="${customPhoto}" class="thumb-img" alt="${pose.title}" />`
        : renderPoseDiagram(pose.diagramType, pose.mode);

      return `
        <div class="pose-card" data-id="${pose.id}">
          <div class="pose-card-thumb">
            ${thumbVisual}
            <span class="card-mode-badge badge-${pose.mode}">
              ${MODE_INFO[pose.mode]?.emoji || '✨'}
            </span>
          </div>
          <div class="pose-card-body">
            <div class="badges-row">
              ${this.getSopBadgeHtml(pose.sop)}
            </div>
            <h4 class="card-title">${pose.title}</h4>
            <p class="card-title-jp">${pose.titleJp || ''}</p>
            <p class="card-cue-snippet">"${pose.cueId}"</p>
          </div>
          <div class="pose-card-footer">
            <button class="btn-card-action btn-show-idol-quick" data-id="${pose.id}" title="Tunjukkan ke Oshi">
              📱 Show
            </button>
            <button class="btn-card-action btn-add-ticket-quick" data-id="${pose.id}" title="Tambah ke Tiket">
              🎫 +Tiket
            </button>
            <button class="btn-card-action btn-detail-quick" data-id="${pose.id}" title="Detail Pose">
              ℹ️ Detail
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind card clicks
    grid.querySelectorAll('.pose-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('.pose-card-thumb').addEventListener('click', () => this.openPoseDetail(id));
      card.querySelector('.pose-card-body').addEventListener('click', () => this.openPoseDetail(id));
    });

    grid.querySelectorAll('.btn-show-idol-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openShowToIdol(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.btn-add-ticket-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAssignTicketModal(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.btn-detail-quick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPoseDetail(btn.dataset.id);
      });
    });
  }

  // ==========================================
  // WISHLIST & TICKET MANAGER VIEW
  // ==========================================
  renderWishlist() {
    const listContainer = document.getElementById('tickets-list');
    if (!listContainer) return;

    const tickets = wishlist.tickets;
    const total = tickets.length;
    const doneCount = tickets.filter(t => t.isDone).length;

    // Summary Counter
    const countEl = document.getElementById('wishlist-summary');
    if (countEl) {
      countEl.innerHTML = `
        <div class="summary-pill">🎫 Total: <strong>${total}</strong></div>
        <div class="summary-pill done">✅ Selesai: <strong>${doneCount}</strong></div>
        <div class="summary-pill pending">⏳ Sisa: <strong>${total - doneCount}</strong></div>
      `;
    }

    if (tickets.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🎟️</span>
          <h4>Belum ada tiket cheki yang direncanakan</h4>
          <p>Pilih pose dari <strong>Katalog</strong> atau putar <strong>Gacha</strong> lalu klik "+Tiket" untuk mulai menyusun rencana event hari ini!</p>
          <button class="btn btn-primary" id="btn-goto-katalog">📚 Buka Katalog Pose</button>
        </div>
      `;
      const btnGoto = document.getElementById('btn-goto-katalog');
      if (btnGoto) btnGoto.addEventListener('click', () => this.switchTab('katalog'));
      return;
    }

    listContainer.innerHTML = tickets.map(ticket => {
      const pose = this.getPoseById(ticket.poseId);
      if (!pose) return '';

      const customPhoto = wishlist.getCustomPhoto(pose.id);
      const thumbVisual = customPhoto
        ? `<img src="${customPhoto}" class="thumb-mini" alt="${pose.title}" />`
        : `<div class="thumb-mini-svg">${renderPoseDiagram(pose.diagramType, pose.mode)}</div>`;

      return `
        <div class="ticket-card ${ticket.isDone ? 'done' : ''}" data-ticket-id="${ticket.id}">
          <div class="ticket-status-check">
            <input type="checkbox" class="ticket-checkbox" id="check-${ticket.id}" ${ticket.isDone ? 'checked' : ''} />
            <label for="check-${ticket.id}" class="ticket-number-badge">#${ticket.ticketNumber}</label>
          </div>

          <div class="ticket-visual">
            ${thumbVisual}
          </div>

          <div class="ticket-info">
            <h4 class="ticket-pose-title">${pose.title}</h4>
            <p class="ticket-oshi-label">💖 Oshi: <strong>${ticket.oshiName || 'Oshi'}</strong></p>
            ${ticket.notes ? `<p class="ticket-notes">📝 ${ticket.notes}</p>` : ''}
          </div>

          <div class="ticket-actions">
            <button class="btn-ticket-act btn-show-idol-ticket" data-pose-id="${pose.id}" title="Tunjukkan ke Oshi di Bilik">
              📱 Show
            </button>
            <button class="btn-ticket-act btn-polaroid-ticket" data-pose-id="${pose.id}" data-ticket-id="${ticket.id}" title="Simulasikan Instax">
              📸 Instax
            </button>
            <button class="btn-ticket-act btn-delete-ticket" data-ticket-id="${ticket.id}" title="Hapus Tiket">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Event listeners on tickets
    listContainer.querySelectorAll('.ticket-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const ticketCard = e.target.closest('.ticket-card');
        const ticketId = ticketCard.dataset.ticketId;
        wishlist.toggleTicketDone(ticketId);
        sfx.playPop();
        this.renderWishlist();
        this.updateWishlistBadge();
      });
    });

    listContainer.querySelectorAll('.btn-show-idol-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openShowToIdol(btn.dataset.poseId);
      });
    });

    listContainer.querySelectorAll('.btn-polaroid-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = wishlist.tickets.find(t => t.id === btn.dataset.ticketId);
        this.openStudioWithPose(btn.dataset.poseId, ticket?.oshiName, ticket?.notes);
      });
    });

    listContainer.querySelectorAll('.btn-delete-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("Hapus tiket ini dari rencana cheki?")) {
          wishlist.removeTicket(btn.dataset.ticketId);
          sfx.playPop();
          this.renderWishlist();
          this.updateWishlistBadge();
        }
      });
    });
  }

  updateWishlistBadge() {
    const badge = document.getElementById('nav-wishlist-badge');
    if (!badge) return;
    const remaining = wishlist.tickets.filter(t => !t.isDone).length;
    if (remaining > 0) {
      badge.textContent = remaining;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // ==========================================
  // INSTAX POLAROID STUDIO VIEW
  // ==========================================
  initStudioView() {
    const selectPose = document.getElementById('studio-select-pose');
    if (selectPose) {
      const poses = this.getAllPoses();
      selectPose.innerHTML = poses.map(p => `
        <option value="${p.id}" ${this.selectedPose && this.selectedPose.id === p.id ? 'selected' : ''}>
          ${p.title} (${MODE_INFO[p.mode]?.name || p.mode})
        </option>
      `).join('');
    }

    const oshiInput = document.getElementById('studio-oshi-name');
    if (oshiInput && !oshiInput.value) {
      oshiInput.value = wishlist.settings.defaultOshi || "Oshi-chan";
    }

    const dateInput = document.getElementById('studio-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    this.updateStudioPreview();
  }

  openStudioWithPose(poseId, oshiName = "", note = "") {
    this.selectedPose = this.getPoseById(poseId);
    this.switchTab('studio');

    const selectPose = document.getElementById('studio-select-pose');
    if (selectPose) selectPose.value = poseId;

    if (oshiName) {
      const oshiInput = document.getElementById('studio-oshi-name');
      if (oshiInput) oshiInput.value = oshiName;
    }

    if (note) {
      const noteInput = document.getElementById('studio-note');
      if (noteInput) noteInput.value = note;
    }

    this.updateStudioPreview();
  }

  async updateStudioPreview() {
    const selectPose = document.getElementById('studio-select-pose');
    const oshiInput = document.getElementById('studio-oshi-name');
    const dateInput = document.getElementById('studio-date');
    const noteInput = document.getElementById('studio-note');

    const poseId = selectPose ? selectPose.value : (this.selectedPose?.id || 'half-heart');
    const pose = this.getPoseById(poseId);
    if (!pose) return;

    const customPhoto = wishlist.getCustomPhoto(pose.id);
    const svgStr = customPhoto ? null : renderPoseDiagram(pose.diagramType, pose.mode);

    await this.polaroidStudio.generate({
      title: pose.title,
      oshiName: oshiInput ? oshiInput.value || "Oshi-chan" : "Oshi-chan",
      date: dateInput ? dateInput.value : new Date().toISOString().split('T')[0],
      note: noteInput ? noteInput.value : "2-Shot Cheki Event 💖",
      svgString: svgStr,
      customImage: customPhoto,
      themeColor: MODE_INFO[pose.mode]?.color || "#FF6584"
    });
  }

  // ==========================================
  // SHOW TO IDOL (FULLSCREEN MODE)
  // ==========================================
  openShowToIdol(poseId) {
    const pose = this.getPoseById(poseId);
    if (!pose) return;

    this.selectedPose = pose;
    sfx.playFanfare();
    const modal = document.getElementById('modal-show-idol');
    if (!modal) return;

    const customPhoto = wishlist.getCustomPhoto(pose.id);
    const visualHtml = customPhoto
      ? `<img src="${customPhoto}" class="fullscreen-photo" alt="${pose.title}" />`
      : renderPoseDiagram(pose.diagramType, pose.mode);

    document.getElementById('show-idol-title').textContent = pose.title;
    document.getElementById('show-idol-title-jp').textContent = pose.titleJp || '';
    document.getElementById('show-idol-visual').innerHTML = visualHtml;
    document.getElementById('show-idol-cue-id').textContent = `"${pose.cueId}"`;
    document.getElementById('show-idol-cue-jp').textContent = pose.cueJp;
    document.getElementById('show-idol-fan-action').textContent = pose.fanAction;
    document.getElementById('show-idol-idol-action').textContent = pose.idolAction;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Request screen WakeLock so screen doesn't turn off in queue!
    this.requestWakeLock();
  }

  closeShowToIdol() {
    const modal = document.getElementById('modal-show-idol');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    this.releaseWakeLock();
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {}
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
      });
    }
  }

  // ==========================================
  // POSE DETAIL MODAL
  // ==========================================
  openPoseDetail(poseId) {
    const pose = this.getPoseById(poseId);
    if (!pose) return;

    this.selectedPose = pose;
    sfx.playPop();
    const modal = document.getElementById('modal-pose-detail');
    if (!modal) return;

    const customPhoto = wishlist.getCustomPhoto(pose.id);
    const visualHtml = customPhoto
      ? `<div class="detail-photo-wrap"><img src="${customPhoto}" alt="${pose.title}" class="detail-custom-img" /><button class="btn-remove-photo" id="btn-remove-custom-photo">🗑️ Hapus Foto Kustom</button></div>`
      : renderPoseDiagram(pose.diagramType, pose.mode);

    document.getElementById('detail-title').textContent = pose.title;
    document.getElementById('detail-title-jp').textContent = pose.titleJp || '';
    document.getElementById('detail-visual').innerHTML = visualHtml;
    document.getElementById('detail-desc').textContent = pose.description || '';
    document.getElementById('detail-cue-id').textContent = `"${pose.cueId}"`;
    document.getElementById('detail-cue-jp').textContent = pose.cueJp;
    document.getElementById('detail-fan-act').textContent = pose.fanAction;
    document.getElementById('detail-idol-act').textContent = pose.idolAction;

    // Twitter inspiration link
    const twitterLink = document.getElementById('link-twitter-inspo');
    if (twitterLink) {
      const q = encodeURIComponent(`#チェキポーズ ${pose.titleJp || pose.title}`);
      twitterLink.href = `https://x.com/search?q=${q}&f=live`;
    }

    // Modal buttons
    const btnShow = document.getElementById('btn-detail-show-idol');
    if (btnShow) {
      btnShow.onclick = () => {
        this.closeModal('modal-pose-detail');
        this.openShowToIdol(pose.id);
      };
    }

    const btnAddTicket = document.getElementById('btn-detail-add-ticket');
    if (btnAddTicket) {
      btnAddTicket.onclick = () => {
        this.closeModal('modal-pose-detail');
        this.openAssignTicketModal(pose.id);
      };
    }

    const btnPolaroid = document.getElementById('btn-detail-polaroid');
    if (btnPolaroid) {
      btnPolaroid.onclick = () => {
        this.closeModal('modal-pose-detail');
        this.openStudioWithPose(pose.id);
      };
    }

    // Handle remove custom photo
    const btnRemovePhoto = document.getElementById('btn-remove-custom-photo');
    if (btnRemovePhoto) {
      btnRemovePhoto.onclick = () => {
        wishlist.removeCustomPhoto(pose.id);
        this.openPoseDetail(pose.id);
        if (this.currentTab === 'katalog') this.renderKatalog();
      };
    }

    modal.classList.add('active');
  }

  // ==========================================
  // ASSIGN TICKET MODAL
  // ==========================================
  openAssignTicketModal(poseId) {
    const pose = this.getPoseById(poseId);
    if (!pose) return;

    const modal = document.getElementById('modal-assign-ticket');
    if (!modal) return;

    document.getElementById('assign-pose-name').textContent = pose.title;
    const oshiInput = document.getElementById('assign-oshi-name');
    if (oshiInput) oshiInput.value = wishlist.settings.defaultOshi || "";
    const notesInput = document.getElementById('assign-notes');
    if (notesInput) notesInput.value = "";

    const btnConfirm = document.getElementById('btn-confirm-assign');
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        wishlist.addTicket(
          pose.id, 
          oshiInput?.value || "Oshi", 
          notesInput?.value || ""
        );
        sfx.playFanfare();
        this.closeModal('modal-assign-ticket');
        this.updateWishlistBadge();
        alert(`✅ Pose "${pose.title}" berhasil ditambahkan ke Tiket Cheki!`);
      };
    }

    modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // ==========================================
  // HELPER BADGES & UI
  // ==========================================
  getSopBadgeHtml(sop) {
    if (sop === 'safe') {
      return `<span class="badge badge-sop-safe" title="No Contact - Aman Sesuai SOP Event">🟢 Safe (No Touch)</span>`;
    } else if (sop === 'close') {
      return `<span class="badge badge-sop-close" title="Jarak Dekat - Patuhi Batasan SOP Event">🟡 Jarak Dekat</span>`;
    } else if (sop === 'prop') {
      return `<span class="badge badge-sop-prop" title="Perlu Properti: Lightstick/Photocard/Dll">🎒 Pakai Prop</span>`;
    }
    return '';
  }

  renderCurrentView() {
    this.switchTab(this.currentTab);
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // Bottom Nav Tabs
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.switchTab(item.dataset.tab);
      });
    });

    // Mode Switcher Pills (Gacha & Katalog)
    document.querySelectorAll('.mode-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchMode(btn.dataset.mode);
      });
    });

    // Gacha Roll Buttons
    const btnRoll = document.getElementById('btn-roll-gacha');
    if (btnRoll) {
      btnRoll.addEventListener('click', () => this.rollGacha());
    }

    const btnGachaShow = document.getElementById('btn-gacha-show-idol');
    if (btnGachaShow) {
      btnGachaShow.addEventListener('click', () => {
        if (this.selectedPose) this.openShowToIdol(this.selectedPose.id);
      });
    }

    const btnGachaTicket = document.getElementById('btn-gacha-add-ticket');
    if (btnGachaTicket) {
      btnGachaTicket.addEventListener('click', () => {
        if (this.selectedPose) this.openAssignTicketModal(this.selectedPose.id);
      });
    }

    const btnGachaStudio = document.getElementById('btn-gacha-studio');
    if (btnGachaStudio) {
      btnGachaStudio.addEventListener('click', () => {
        if (this.selectedPose) this.openStudioWithPose(this.selectedPose.id);
      });
    }

    // Katalog SOP Filter Buttons
    document.querySelectorAll('.sop-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.sop-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentSopFilter = chip.dataset.sop;
        sfx.playPop();
        if (this.currentTab === 'katalog') this.renderKatalog();
      });
    });

    // Katalog Search Input
    const searchInput = document.getElementById('katalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderKatalog();
      });
    }

    // Show to Idol Modal Close
    const btnCloseShow = document.getElementById('btn-close-show-idol');
    if (btnCloseShow) {
      btnCloseShow.addEventListener('click', () => this.closeShowToIdol());
    }

    // Generic Modal Close Buttons
    document.querySelectorAll('.btn-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) modal.classList.remove('active');
      });
    });

    // Studio Inputs Change
    ['studio-select-pose', 'studio-oshi-name', 'studio-date', 'studio-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateStudioPreview());
      }
    });

    // Download Polaroid Button
    const btnDownloadPolaroid = document.getElementById('btn-download-polaroid');
    if (btnDownloadPolaroid) {
      btnDownloadPolaroid.addEventListener('click', () => {
        sfx.playFanfare();
        const oshi = document.getElementById('studio-oshi-name')?.value || "cheki";
        this.polaroidStudio.download(`cheki-${oshi}-${Date.now()}.png`);
      });
    }

    // Custom Photo Upload Input
    const photoUploadInput = document.getElementById('input-custom-photo');
    if (photoUploadInput) {
      photoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && this.selectedPose) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            wishlist.saveCustomPhoto(this.selectedPose.id, dataUrl);
            sfx.playFanfare();
            alert("✅ Foto referensi berhasil disimpan untuk pose ini!");
            this.openPoseDetail(this.selectedPose.id);
            if (this.currentTab === 'katalog') this.renderKatalog();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Add Custom Pose Trigger
    const btnAddCustom = document.getElementById('btn-open-custom-pose');
    if (btnAddCustom) {
      btnAddCustom.addEventListener('click', () => {
        const modal = document.getElementById('modal-custom-pose');
        if (modal) modal.classList.add('active');
      });
    }

    // Form Submit Custom Pose
    const formCustom = document.getElementById('form-add-custom-pose');
    if (formCustom) {
      formCustom.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('custom-title').value;
        const mode = document.getElementById('custom-mode').value;
        const cueId = document.getElementById('custom-cue-id').value;
        const cueJp = document.getElementById('custom-cue-jp').value;
        const fanAction = document.getElementById('custom-fan-act').value;
        const idolAction = document.getElementById('custom-idol-act').value;

        wishlist.addCustomPose({
          title,
          titleJp: "オリジナルポーズ",
          mode,
          sop: "safe",
          cueId,
          cueJp: cueJp || "一緒にポーズしましょう！",
          fanAction,
          idolAction,
          diagramType: "default",
          description: "Pose kustom kreasi kamu sendiri."
        });

        sfx.playFanfare();
        this.closeModal('modal-custom-pose');
        formCustom.reset();
        alert(`✅ Pose kustom "${title}" berhasil ditambahkan!`);
        if (this.currentTab === 'katalog') this.renderKatalog();
      });
    }

    // Sound Toggle in Header
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isEnabled = sfx.toggle();
        btnSound.textContent = isEnabled ? '🔔' : '🔕';
        wishlist.saveSettings({ soundEnabled: isEnabled });
      });
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ChekiApp();
});
