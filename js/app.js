import { CHEKI_POSES, MODE_INFO } from "./poses-data.js";
import { renderPoseDiagram } from "./diagrams.js";
import { sfx } from "./audio.js";

class ChekiPoseApp {
  constructor() {
    this.currentMode = "cute";
    this.selectedPose = null;
    this.isRolling = false;
    this.wakeLock = null;
    this.decks = {};
    this.imageCache = new Map();

    this.init();
  }

  init() {
    this.syncSoundButton();
    this.updateChipCounts();
    this.bindEvents();
    this.preloadAllImages();

    const initialPoses = this.getPosesByMode(this.currentMode);
    if (initialPoses.length > 0) {
      this.displayPose(initialPoses[0], false);
    }
  }

  updateChipCounts() {
    const counts = {
      all: CHEKI_POSES.length,
      cute: CHEKI_POSES.filter((p) => p.mode === "cute").length,
      fun: CHEKI_POSES.filter((p) => p.mode === "fun").length,
      meme: CHEKI_POSES.filter((p) => p.mode === "meme").length,
    };
    document.querySelectorAll(".mode-chip").forEach((btn) => {
      const mode = btn.dataset.mode;
      const countEl = btn.querySelector(".mode-chip-num");
      if (countEl && counts[mode] !== undefined) {
        countEl.textContent = String(counts[mode]).padStart(2, "0");
      }
    });
  }

  getPosesByMode(mode = this.currentMode) {
    if (mode === "all") return [...CHEKI_POSES];
    return CHEKI_POSES.filter((p) => p.mode === mode);
  }

  preloadAllImages() {
    CHEKI_POSES.forEach((pose) => {
      if (pose.image && !this.imageCache.has(pose.image)) {
        const img = new Image();
        img.src = pose.image;
        this.imageCache.set(pose.image, img);
      }
    });
  }

  drawFromDeck() {
    const pool = this.getPosesByMode(this.currentMode);
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    const deckKey = this.currentMode;
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
    if (this.currentMode === modeKey || this.isRolling) return;
    this.currentMode = modeKey;
    sfx.playTick(450);

    document.documentElement.dataset.mode = modeKey;
    document.body.dataset.mode = modeKey;

    document.querySelectorAll(".mode-chip").forEach((btn) => {
      const isActive = btn.dataset.mode === modeKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    const modePoses = this.getPosesByMode(modeKey);
    if (modePoses.length > 0) {
      const pick = this.drawFromDeck() || modePoses[0];
      this.displayPose(pick, false);
    }
  }

  rollRoulette() {
    if (this.isRolling) return;
    const pool = this.getPosesByMode(this.currentMode);
    if (pool.length === 0) return;

    const finalPick = this.drawFromDeck() || pool[0];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      sfx.playLock();
      this.displayPose(finalPick, true);
      return;
    }

    this.isRolling = true;
    const btnRoll = document.getElementById("btn-roll-gacha");
    const card = document.getElementById("polaroid-card");
    const flashEl = document.getElementById("flash-overlay");

    if (btnRoll) btnRoll.disabled = true;
    if (card) card.classList.add("is-spinning");

    // Deceleration schedule across ~2.6 seconds (16 steps with gradually expanding intervals)
    const delays = [55, 55, 60, 65, 70, 80, 95, 115, 140, 175, 220, 275, 340, 420, 510];
    let stepIndex = 0;
    let lastCandidateId = this.selectedPose ? this.selectedPose.id : null;

    const executeStep = () => {
      if (stepIndex < delays.length) {
        // High-speed reel and gradual deceleration phase
        let candidate = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1 && candidate.id === lastCandidateId) {
          candidate = pool.find((p) => p.id !== lastCandidateId) || candidate;
        }
        lastCandidateId = candidate.id;

        this.renderVisual(candidate, document.getElementById("photo-render-area"));
        const titleEl = document.getElementById("pose-title");
        const titleJpEl = document.getElementById("pose-title-jp");
        if (titleEl) titleEl.textContent = candidate.title;
        if (titleJpEl) titleJpEl.textContent = candidate.titleJp || "";

        // Pitch slides slightly lower as wheel slows down
        const pitch = 560 - stepIndex * 15;
        sfx.playTick(pitch);

        const currentDelay = delays[stepIndex];
        stepIndex++;
        setTimeout(executeStep, currentDelay);
      } else {
        // Final jackpot lock
        if (card) card.classList.remove("is-spinning");
        this.displayPose(finalPick, true);
        sfx.playLock();

        if (flashEl) {
          flashEl.classList.add("active");
          setTimeout(() => flashEl.classList.remove("active"), 280);
        }

        if (card) {
          card.classList.add("lock-celebrate");
          setTimeout(() => card.classList.remove("lock-celebrate"), 450);
        }

        this.isRolling = false;
        if (btnRoll) btnRoll.disabled = false;
      }
    };

    executeStep();
  }

  displayPose(pose, isFinalLock = false) {
    this.selectedPose = pose;
    const modeMeta = MODE_INFO[pose.mode] || MODE_INFO.cute;

    const modeBadge = document.getElementById("mode-badge-label");
    if (modeBadge) {
      modeBadge.textContent = `${modeMeta.name} (${modeMeta.jpName})`;
    }

    const sopBadge = document.getElementById("sop-badge-label");
    if (sopBadge) {
      const isSafe = pose.sop === "safe";
      sopBadge.textContent = isSafe ? "SOP: Aman (Tanpa Sentuh)" : "SOP: Pose Dekat";
      sopBadge.className = `badge-sop ${isSafe ? "sop-safe" : "sop-close"}`;
    }

    const titleEl = document.getElementById("pose-title");
    if (titleEl) titleEl.textContent = pose.title;

    const titleJpEl = document.getElementById("pose-title-jp");
    if (titleJpEl) titleJpEl.textContent = pose.titleJp || "";

    const romajiEl = document.getElementById("pose-romaji");
    if (romajiEl) romajiEl.textContent = pose.romaji ? `(${pose.romaji})` : "";

    const descEl = document.getElementById("pose-description");
    if (descEl) descEl.textContent = pose.description || "";

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
      this.renderVisual(pose, renderArea);
    }

    if (this.isFullscreenOpen()) {
      this.populateFullscreen(pose);
    }
  }

  renderVisual(pose, targetElement) {
    if (!targetElement) return;

    if (!pose.image) {
      targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
      return;
    }

    const cached = this.imageCache.get(pose.image);
    targetElement.innerHTML = "";

    const ambient = new Image();
    ambient.src = pose.image;
    ambient.className = "viewfinder-ambient";
    ambient.alt = "";
    ambient.setAttribute("aria-hidden", "true");
    targetElement.appendChild(ambient);

    if (cached && cached.complete && cached.naturalWidth > 0) {
      const img = cached.cloneNode();
      img.className = "pose-img";
      img.alt = `${pose.title} (${pose.titleJp || ""})`;
      targetElement.appendChild(img);
    } else {
      const img = new Image();
      img.className = "pose-img";
      img.alt = `${pose.title} (${pose.titleJp || ""})`;
      img.onload = () => {
        this.imageCache.set(pose.image, img);
      };
      img.onerror = () => {
        targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
      };
      img.src = pose.image;
      targetElement.appendChild(img);
    }
  }

  isFullscreenOpen() {
    const modal = document.getElementById("modal-show-idol");
    return Boolean(modal && !modal.hidden);
  }

  populateFullscreen(pose) {
    const modeTag = document.getElementById("fs-mode-tag");
    const modeMeta = MODE_INFO[pose.mode] || MODE_INFO.cute;
    if (modeTag) {
      modeTag.textContent = `${modeMeta.name} // TUNJUKKAN KE OSHI`;
    }

    document.getElementById("fs-title").textContent = pose.title;
    document.getElementById("fs-title-jp").textContent = pose.titleJp || "";
    document.getElementById("fs-cue-id").textContent = `"${pose.cueId}"`;
    document.getElementById("fs-cue-jp").textContent = pose.cueJp || "";
    document.getElementById("fs-fan-act").textContent = pose.fanAction;
    document.getElementById("fs-idol-act").textContent = pose.idolAction;

    const fsVisual = document.getElementById("fs-visual");
    if (fsVisual) {
      fsVisual.innerHTML = "";
      if (pose.image) {
        const img = new Image();
        img.className = "fs-img";
        img.alt = pose.title;
        img.src = pose.image;
        fsVisual.appendChild(img);
      } else {
        fsVisual.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
      }
    }
  }

  openShowToIdol() {
    if (!this.selectedPose) return;
    sfx.playTick(520);

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

  async copyCue() {
    if (!this.selectedPose) return;
    const btn = document.getElementById("btn-copy-cue");
    const text = this.selectedPose.cueId;
    let copied = false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (e) {}

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
      } catch (e) {}
    }

    sfx.playTick(600);
    if (btn) {
      btn.textContent = copied ? "Tersalin!" : "Gagal";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Salin Teks";
        btn.classList.remove("copied");
      }, 1600);
    }
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
    document.querySelectorAll(".mode-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchMode(btn.dataset.mode);
      });
    });

    const btnRoll = document.getElementById("btn-roll-gacha");
    if (btnRoll) {
      btnRoll.addEventListener("click", () => this.rollRoulette());
      btnRoll.addEventListener("pointermove", (e) => {
        const rect = btnRoll.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        btnRoll.style.setProperty("--fill-x", `${x}%`);
        btnRoll.style.setProperty("--fill-y", `${y}%`);
      });
    }

    const photoBox = document.getElementById("viewfinder-box");
    if (photoBox) {
      photoBox.addEventListener("click", () => this.openShowToIdol());
      photoBox.addEventListener("keydown", (e) => {
        if (e.target !== photoBox) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.openShowToIdol();
        }
      });
    }

    const btnFsPill = document.getElementById("btn-fullscreen-trigger");
    if (btnFsPill) {
      btnFsPill.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openShowToIdol();
      });
    }

    const btnShowBottom = document.getElementById("btn-show-oshi-bottom");
    if (btnShowBottom) {
      btnShowBottom.addEventListener("click", () => this.openShowToIdol());
    }

    const btnCloseFs = document.getElementById("btn-close-fullscreen");
    if (btnCloseFs) {
      btnCloseFs.addEventListener("click", () => this.closeShowToIdol());
    }

    const btnCopy = document.getElementById("btn-copy-cue");
    if (btnCopy) {
      btnCopy.addEventListener("click", () => this.copyCue());
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

      if ((e.key === " " || e.key.toLowerCase() === "r") && e.target === document.body) {
        e.preventDefault();
        this.rollRoulette();
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
