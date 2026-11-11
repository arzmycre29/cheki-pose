import { CHEKI_POSES, MODE_INFO } from "./poses-data.js";
import { renderPoseDiagram } from "./diagrams.js";
import { sfx } from "./audio.js";

class ChekiPoseApp {
  constructor() {
    this.currentMode = "cute";
    this.sopFilter = "all";
    this.visualMode = "photo";
    this.selectedPose = null;
    this.isRolling = false;
    this.wakeLock = null;
    this.decks = {};
    this.imageCache = new Map();

    this.init();
  }

  init() {
    this.syncSoundButton();
    this.bindEvents();
    this.preloadModeImages(this.currentMode);

    const initialPoses = this.getFilteredPoses();
    if (initialPoses.length > 0) {
      this.displayPose(initialPoses[0], false);
    }
    this.renderContactSheet();
  }

  getPosesByMode(mode = this.currentMode) {
    if (mode === "all") return [...CHEKI_POSES];
    return CHEKI_POSES.filter((p) => p.mode === mode);
  }

  getFilteredPoses() {
    const modePoses = this.getPosesByMode(this.currentMode);
    if (this.sopFilter === "all") return modePoses;
    return modePoses.filter((p) => p.sop === this.sopFilter);
  }

  preloadModeImages(mode) {
    const poses = this.getPosesByMode(mode);
    poses.forEach((pose) => {
      if (pose.image && !this.imageCache.has(pose.image)) {
        const img = new Image();
        img.src = pose.image;
        this.imageCache.set(pose.image, img);
      }
    });
  }

  // Fisher-Yates shuffle keeps gacha rolls fair and prevents back-to-back duplicates.
  drawFromDeck() {
    const pool = this.getFilteredPoses();
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    const deckKey = `${this.currentMode}:${this.sopFilter}`;
    let deck = this.decks[deckKey];

    if (!deck || deck.length === 0) {
      deck = [...pool];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (this.selectedPose && deck[deck.length - 1].id === this.selectedPose.id) {
        [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
      }
      this.decks[deckKey] = deck;
    }

    return deck.pop();
  }

  switchMode(modeKey) {
    if (this.currentMode === modeKey) return;
    this.currentMode = modeKey;
    sfx.playPop();

    document.documentElement.dataset.mode = modeKey;
    document.body.dataset.mode = modeKey;

    document.querySelectorAll(".mode-tab").forEach((btn) => {
      const isActive = btn.dataset.mode === modeKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    this.preloadModeImages(modeKey);

    let filtered = this.getFilteredPoses();
    if (filtered.length === 0 && this.sopFilter !== "all") {
      this.setSopFilter("all", false);
      filtered = this.getFilteredPoses();
    }

    this.renderContactSheet();

    const nextPick = this.drawFromDeck() || filtered[0];
    if (nextPick) {
      this.triggerShutterTransition(nextPick);
    }
  }

  setSopFilter(sopValue, shouldRender = true) {
    this.sopFilter = sopValue;
    document.querySelectorAll(".sop-filter-btn").forEach((btn) => {
      const isActive = btn.dataset.sop === sopValue;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    if (shouldRender) {
      sfx.playPop();
      this.renderContactSheet();
    }
  }

  stepPose(direction) {
    const pool = this.getFilteredPoses();
    const activePool = pool.length > 0 ? pool : this.getPosesByMode(this.currentMode);
    if (activePool.length === 0) return;

    const currentIndex = this.selectedPose
      ? activePool.findIndex((p) => p.id === this.selectedPose.id)
      : 0;
    const nextIndex = (currentIndex + direction + activePool.length) % activePool.length;
    const targetPose = activePool[nextIndex];

    sfx.playPop();
    this.displayPose(targetPose, true);
    if (this.isFullscreenOpen()) {
      this.populateFullscreen(targetPose);
    }
  }

  rollGacha() {
    if (this.isRolling) return;
    let pool = this.getFilteredPoses();
    if (pool.length === 0) {
      this.setSopFilter("all", true);
      pool = this.getFilteredPoses();
    }
    if (pool.length === 0) return;

    const finalPick = this.drawFromDeck() || pool[0];
    this.triggerShutterTransition(finalPick);
  }

  triggerShutterTransition(targetPose) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      sfx.playFanfare();
      this.displayPose(targetPose, false);
      return;
    }

    this.isRolling = true;
    const btnRoll = document.getElementById("btn-roll-gacha");
    const curtain = document.getElementById("shutter-curtain");
    const filmCodeEl = document.getElementById("film-code");

    if (btnRoll) btnRoll.disabled = true;
    if (curtain) curtain.classList.add("snap-closed");
    sfx.playSpin();

    const pool = this.getPosesByMode(this.currentMode);
    let ticks = 0;
    const ticker = setInterval(() => {
      ticks++;
      if (filmCodeEl && pool.length > 0) {
        const sample = pool[ticks % pool.length];
        filmCodeEl.textContent = `SHUTTER // ${sample.code} · ROLLING`;
      }
      sfx.playSpin();
      if (ticks >= 4) {
        clearInterval(ticker);
        this.displayPose(targetPose, true);
        sfx.playFanfare();

        setTimeout(() => {
          if (curtain) curtain.classList.remove("snap-closed");
          this.isRolling = false;
          if (btnRoll) btnRoll.disabled = false;
        }, 90);
      }
    }, 55);
  }

  displayPose(pose, animateDevelop = false) {
    this.selectedPose = pose;
    const modePoses = this.getPosesByMode(this.currentMode);
    const indexInMode = modePoses.findIndex((p) => p.id === pose.id);
    const ordinal = indexInMode >= 0 ? String(indexInMode + 1).padStart(2, "0") : "01";
    const total = String(modePoses.length).padStart(2, "0");
    const modeMeta = MODE_INFO[pose.mode] || MODE_INFO.cute;

    const filmCodeEl = document.getElementById("film-code");
    if (filmCodeEl) {
      filmCodeEl.textContent = `EXP ${ordinal} / ${total} · ${pose.mode.toUpperCase()}`;
    }

    const sopBadge = document.getElementById("pose-sop-badge");
    if (sopBadge) {
      const isSafe = pose.sop === "safe";
      sopBadge.textContent = isSafe ? "SOP: AMAN (TANPA SENTUH)" : "SOP: POSE DEKAT";
      sopBadge.className = `sop-stamp ${isSafe ? "sop-safe" : "sop-close"}`;
    }

    const serialEl = document.getElementById("deck-serial-code");
    if (serialEl) serialEl.textContent = `SEIRIKEN // ${pose.code}`;

    const modeTagEl = document.getElementById("deck-mode-tag");
    if (modeTagEl) modeTagEl.textContent = `${modeMeta.name} (${modeMeta.jpName})`;

    const titleEl = document.getElementById("pose-title");
    if (titleEl) titleEl.textContent = pose.title;

    const titleJpEl = document.getElementById("pose-title-jp");
    if (titleJpEl) titleJpEl.textContent = pose.titleJp || "";

    const romajiEl = document.getElementById("pose-romaji");
    if (romajiEl) romajiEl.textContent = pose.romaji ? `(${pose.romaji})` : "";

    const descEl = document.getElementById("pose-description");
    if (descEl) descEl.textContent = pose.description || "";

    const captionJpEl = document.getElementById("film-caption-jp");
    if (captionJpEl) captionJpEl.textContent = pose.titleJp || pose.title;

    const cueIdEl = document.getElementById("pose-cue-id");
    const cueJpEl = document.getElementById("pose-cue-jp");
    if (cueIdEl) cueIdEl.textContent = `"${pose.cueId}"`;
    if (cueJpEl) cueJpEl.textContent = pose.cueJp || "";

    const fanActEl = document.getElementById("pose-fan-action");
    const idolActEl = document.getElementById("pose-idol-action");
    if (fanActEl) fanActEl.textContent = pose.fanAction;
    if (idolActEl) idolActEl.textContent = pose.idolAction;

    const renderArea = document.getElementById("photo-render-area");
    if (renderArea) {
      this.renderVisual(pose, renderArea, "pose-img", animateDevelop);
    }

    this.highlightActiveSheetItem();
  }

  renderVisual(pose, targetElement, imgClass = "pose-img", animateDevelop = false) {
    const loadingEl = document.getElementById("photo-loading");
    const fallbackNotice = document.getElementById("VisualFallbackNotice");
    const dimEl = document.getElementById("film-dimensions");
    const isMainStage = targetElement.id === "photo-render-area";

    if (this.visualMode === "diagram" || !pose.image) {
      if (isMainStage && loadingEl) loadingEl.hidden = true;
      if (isMainStage && fallbackNotice) fallbackNotice.hidden = false;
      if (isMainStage && dimEl) dimEl.textContent = "VEKTOR // SKEMA POSISI";
      targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
      return;
    }

    if (isMainStage && loadingEl) loadingEl.hidden = false;
    if (isMainStage && fallbackNotice) fallbackNotice.hidden = true;

    const img = new Image();
    img.className = animateDevelop ? `${imgClass} developing` : imgClass;
    img.alt = `${pose.title} (${pose.titleJp})`;
    img.decoding = "async";

    img.onload = () => {
      if (isMainStage && loadingEl) loadingEl.hidden = true;
      targetElement.innerHTML = "";

      if (isMainStage) {
        const ambient = new Image();
        ambient.src = pose.image;
        ambient.className = "viewfinder-ambient";
        ambient.alt = "";
        ambient.setAttribute("aria-hidden", "true");
        targetElement.appendChild(ambient);

        if (dimEl && img.naturalWidth && img.naturalHeight) {
          dimEl.textContent = `${img.naturalWidth}×${img.naturalHeight} · 100% UTUH`;
        }
      }

      targetElement.appendChild(img);

      if (animateDevelop) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            img.classList.remove("developing");
          });
        });
      }
    };

    img.onerror = () => {
      if (isMainStage && loadingEl) loadingEl.hidden = true;
      if (isMainStage && fallbackNotice) {
        fallbackNotice.textContent = "Foto tidak ditemukan, menampilkan skema posisi vektor.";
        fallbackNotice.hidden = false;
      }
      if (isMainStage && dimEl) dimEl.textContent = "FALLBACK // SKEMA SVG";
      targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
    };

    img.src = pose.image;
  }

  toggleVisualMode() {
    this.visualMode = this.visualMode === "photo" ? "diagram" : "photo";
    sfx.playPop();

    const labelEl = document.getElementById("visual-mode-label");
    if (labelEl) {
      labelEl.textContent =
        this.visualMode === "photo" ? "Tampilan: Foto Asli" : "Tampilan: Skema SVG";
    }

    if (this.selectedPose) {
      const renderArea = document.getElementById("photo-render-area");
      if (renderArea) {
        this.renderVisual(this.selectedPose, renderArea, "pose-img", false);
      }
      if (this.isFullscreenOpen()) {
        this.populateFullscreen(this.selectedPose);
      }
    }
  }

  renderContactSheet() {
    const grid = document.getElementById("contact-sheet-grid");
    const emptyState = document.getElementById("contact-sheet-empty");
    if (!grid) return;

    const poses = this.getFilteredPoses();
    grid.innerHTML = "";

    if (poses.length === 0) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    poses.forEach((pose) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `sheet-item${this.selectedPose && this.selectedPose.id === pose.id ? " active" : ""}`;
      card.dataset.poseId = pose.id;
      card.setAttribute("role", "listitem");

      const isSafe = pose.sop === "safe";
      const sopLabel = isSafe ? "AMAN" : "DEKAT";
      const sopClass = isSafe ? "sop-safe" : "sop-close";

      card.innerHTML = `
        <div class="sheet-item-top">
          <span class="sheet-exp-code">${pose.code}</span>
          <span class="sheet-sop-dot ${sopClass}">${sopLabel}</span>
        </div>
        <div class="sheet-thumb-gate">
          <img src="${pose.image}" alt="${pose.title}" class="sheet-thumb-img" loading="lazy" decoding="async">
        </div>
        <div class="sheet-item-title">${pose.title}</div>
        <div class="sheet-item-jp" lang="ja">${pose.titleJp}</div>
      `;

      const thumbImg = card.querySelector(".sheet-thumb-img");
      if (thumbImg) {
        thumbImg.addEventListener("error", () => {
          const gate = card.querySelector(".sheet-thumb-gate");
          if (gate) gate.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
        });
      }

      card.addEventListener("click", () => {
        sfx.playPop();
        this.displayPose(pose, true);
        if (window.innerWidth < 1024) {
          const stage = document.getElementById("main-stage");
          if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      grid.appendChild(card);
    });
  }

  highlightActiveSheetItem() {
    if (!this.selectedPose) return;
    document.querySelectorAll(".sheet-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.poseId === this.selectedPose.id);
    });
  }

  isFullscreenOpen() {
    const modal = document.getElementById("modal-show-idol");
    return Boolean(modal && !modal.hidden);
  }

  populateFullscreen(pose) {
    const serialTag = document.getElementById("fs-serial-tag");
    if (serialTag) {
      serialTag.textContent = `${pose.code} // TUNJUKKAN KE OSHI`;
    }

    const sopTag = document.getElementById("fs-sop-tag");
    if (sopTag) {
      sopTag.textContent = pose.sop === "safe" ? "SOP: AMAN" : "SOP: DEKAT";
    }

    document.getElementById("fs-title").textContent = pose.title;
    document.getElementById("fs-title-jp").textContent = pose.titleJp || "";
    document.getElementById("fs-cue-id").textContent = `"${pose.cueId}"`;
    document.getElementById("fs-cue-jp").textContent = pose.cueJp || "";
    document.getElementById("fs-fan-act").textContent = pose.fanAction;
    document.getElementById("fs-idol-act").textContent = pose.idolAction;

    const fsVisual = document.getElementById("fs-visual");
    if (fsVisual) {
      this.renderVisual(pose, fsVisual, "fs-img", false);
    }
  }

  openShowToIdol() {
    if (!this.selectedPose) return;
    sfx.playPop();

    const modal = document.getElementById("modal-show-idol");
    if (!modal) return;

    this.populateFullscreen(this.selectedPose);
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("btn-close-fullscreen");
    if (closeBtn) closeBtn.focus();

    this.requestWakeLock();
  }

  closeShowToIdol() {
    const modal = document.getElementById("modal-show-idol");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
    this.releaseWakeLock();
  }

  async copyText(text, buttonEl, defaultLabel) {
    if (!text || !buttonEl) return;
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (err) {
      copied = false;
    }

    if (!copied) {
      try {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.top = "0";
        temp.style.left = "0";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        temp.setSelectionRange(0, temp.value.length);
        copied = document.execCommand("copy");
        document.body.removeChild(temp);
      } catch (e) {
        copied = false;
      }
    }

    sfx.playPop();
    buttonEl.textContent = copied ? "Tersalin" : "Gagal Salin";
    buttonEl.classList.add("copied");
    setTimeout(() => {
      buttonEl.textContent = defaultLabel;
      buttonEl.classList.remove("copied");
    }, 1800);
  }

  syncSoundButton() {
    const btnSound = document.getElementById("btn-toggle-sound");
    const label = document.getElementById("sound-label");
    const iconOn = document.getElementById("icon-sound-on");
    const iconOff = document.getElementById("icon-sound-off");
    if (!btnSound) return;

    const isOn = sfx.enabled;
    btnSound.setAttribute("aria-pressed", String(isOn));
    if (label) label.textContent = isOn ? "Suara: Aktif" : "Suara: Mati";
    if (iconOn) iconOn.hidden = !isOn;
    if (iconOff) iconOff.hidden = isOn;
  }

  async requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        this.wakeLock = await navigator.wakeLock.request("screen");
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

  bindEvents() {
    document.querySelectorAll(".mode-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchMode(btn.dataset.mode);
      });
    });

    document.querySelectorAll(".sop-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setSopFilter(btn.dataset.sop, true);
      });
    });

    const btnResetFilter = document.getElementById("btn-reset-filter");
    if (btnResetFilter) {
      btnResetFilter.addEventListener("click", () => {
        this.setSopFilter("all", true);
      });
    }

    const btnRoll = document.getElementById("btn-roll-gacha");
    if (btnRoll) {
      btnRoll.addEventListener("click", () => this.rollGacha());
      btnRoll.addEventListener("pointermove", (e) => {
        const rect = btnRoll.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        btnRoll.style.setProperty("--fill-x", `${x}%`);
        btnRoll.style.setProperty("--fill-y", `${y}%`);
      });
    }

    const btnPrev = document.getElementById("btn-prev-pose");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => this.stepPose(-1));
    }

    const btnNext = document.getElementById("btn-next-pose");
    if (btnNext) {
      btnNext.addEventListener("click", () => this.stepPose(1));
    }

    const btnFsPrev = document.getElementById("btn-fs-prev");
    if (btnFsPrev) {
      btnFsPrev.addEventListener("click", () => this.stepPose(-1));
    }

    const btnFsNext = document.getElementById("btn-fs-next");
    if (btnFsNext) {
      btnFsNext.addEventListener("click", () => this.stepPose(1));
    }

    const photoTrigger = document.getElementById("photo-frame-trigger");
    if (photoTrigger) {
      photoTrigger.addEventListener("click", (e) => {
        if (e.target.closest("#btn-toggle-visual")) return;
        this.openShowToIdol();
      });
      photoTrigger.addEventListener("keydown", (e) => {
        if (e.target !== photoTrigger) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.openShowToIdol();
        }
      });
    }

    const btnToggleVisual = document.getElementById("btn-toggle-visual");
    if (btnToggleVisual) {
      btnToggleVisual.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleVisualMode();
      });
    }

    const btnFsBadge = document.getElementById("btn-fullscreen-badge");
    if (btnFsBadge) {
      btnFsBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openShowToIdol();
      });
    }

    const btnOpenBoard = document.getElementById("btn-open-board");
    if (btnOpenBoard) {
      btnOpenBoard.addEventListener("click", () => this.openShowToIdol());
    }

    const btnCloseFs = document.getElementById("btn-close-fullscreen");
    if (btnCloseFs) {
      btnCloseFs.addEventListener("click", () => this.closeShowToIdol());
    }

    const btnCopyId = document.getElementById("btn-copy-cue");
    if (btnCopyId) {
      btnCopyId.addEventListener("click", () => {
        if (!this.selectedPose) return;
        this.copyText(this.selectedPose.cueId, btnCopyId, "Salin ID");
      });
    }

    const btnCopyJp = document.getElementById("btn-copy-jp");
    if (btnCopyJp) {
      btnCopyJp.addEventListener("click", () => {
        if (!this.selectedPose) return;
        this.copyText(this.selectedPose.cueJp, btnCopyJp, "Salin JP");
      });
    }

    const btnSound = document.getElementById("btn-toggle-sound");
    if (btnSound) {
      btnSound.addEventListener("click", () => {
        sfx.toggle();
        this.syncSoundButton();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.target && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (e.key === "Escape" && this.isFullscreenOpen()) {
        e.preventDefault();
        this.closeShowToIdol();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.stepPose(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.stepPose(1);
      } else if ((e.key === " " || e.key.toLowerCase() === "r") && e.target === document.body) {
        e.preventDefault();
        this.rollGacha();
      } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (this.isFullscreenOpen()) {
          this.closeShowToIdol();
        } else {
          this.openShowToIdol();
        }
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new ChekiPoseApp();
});
