import { CHEKI_POSES, MODE_INFO } from "./poses-data.js";
import { renderPoseDiagram } from "./diagrams.js";
import { sfx } from "./audio.js";

const SETTINGS_STORAGE_KEY = "chekipose_settings";
const USED_POSES_STORAGE_KEY = "chekipose_used_poses";

const DEFAULT_SETTINGS = {
  duration: "normal",
  customDurationSec: 5,
  rollCount: "1",
  autoMarkUsed: false,
};

const DURATION_LABELS = {
  fast: "Cepat",
  normal: "Normal",
  dramatic: "Dramatis",
  custom: "Custom",
};

const ROLL_COUNT_LABELS = {
  "1": "1x",
  "2": "2x",
  "3": "3x",
  random: "Acak 1–3x",
};

class ChekiPoseApp {
  constructor() {
    this.currentMode = "cute";
    this.selectedPose = null;
    this.isRolling = false;
    this.wakeLock = null;
    this.decks = {};
    this.imageCache = new Map();
    this.settings = this.loadSettings();
    this.usedPoseIds = this.loadUsedPoses();

    this.init();
  }

  init() {
    this.syncSoundButton();
    this.syncSettingsUI();
    this.updateChipCounts();
    this.bindEvents();
    this.preloadAllImages();
    this.displayStandby(this.currentMode);
  }

  /* ── LocalStorage Persistence ─────────────────────────────────────── */

  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          duration: ["fast", "normal", "dramatic", "custom"].includes(
            parsed.duration
          )
            ? parsed.duration
            : DEFAULT_SETTINGS.duration,
          customDurationSec: this.clampCustomDuration(parsed.customDurationSec),
          rollCount: ["1", "2", "3", "random"].includes(String(parsed.rollCount))
            ? String(parsed.rollCount)
            : DEFAULT_SETTINGS.rollCount,
          autoMarkUsed: Boolean(parsed.autoMarkUsed),
        };
      }
    } catch (e) {}
    return { ...DEFAULT_SETTINGS };
  }

  clampCustomDuration(val) {
    const num = parseFloat(val);
    if (Number.isNaN(num)) return DEFAULT_SETTINGS.customDurationSec;
    return Math.min(10, Math.max(0.5, Math.round(num * 2) / 2));
  }

  saveSettings() {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {}
  }

  loadUsedPoses() {
    try {
      const raw = localStorage.getItem(USED_POSES_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const validIds = new Set(CHEKI_POSES.map((p) => p.id));
          return new Set(arr.filter((id) => validIds.has(id)));
        }
      }
    } catch (e) {}
    return new Set();
  }

  saveUsedPoses() {
    try {
      localStorage.setItem(
        USED_POSES_STORAGE_KEY,
        JSON.stringify([...this.usedPoseIds])
      );
    } catch (e) {}
  }

  /* ── Pool & Counts ────────────────────────────────────────────────── */

  getPosesByMode(mode = this.currentMode) {
    if (mode === "all") return [...CHEKI_POSES];
    return CHEKI_POSES.filter((p) => p.mode === mode);
  }

  getAvailablePoses(mode = this.currentMode) {
    return this.getPosesByMode(mode).filter((p) => !this.usedPoseIds.has(p.id));
  }

  updateChipCounts() {
    const modes = ["all", "cute", "fun", "meme"];
    document.querySelectorAll(".mode-chip").forEach((btn) => {
      const mode = btn.dataset.mode;
      if (!modes.includes(mode)) return;
      const total = this.getPosesByMode(mode).length;
      const avail = this.getAvailablePoses(mode).length;
      const countEl = btn.querySelector(".mode-chip-num");
      if (countEl) {
        countEl.textContent =
          avail < total
            ? `${avail}/${total}`
            : String(total).padStart(2, "0");
      }
    });
    this.syncSettingsStats();
    this.syncStandbyMeta();
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
    const pool = this.getAvailablePoses(this.currentMode);
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];

    const deckKey = this.currentMode;
    let deck = (this.decks[deckKey] || []).filter(
      (p) => !this.usedPoseIds.has(p.id)
    );

    if (deck.length === 0) {
      deck = [...pool];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (
        this.selectedPose &&
        deck.length > 1 &&
        deck[deck.length - 1].id === this.selectedPose.id
      ) {
        [deck[0], deck[deck.length - 1]] = [deck[deck.length - 1], deck[0]];
      }
    }

    const picked = deck.pop();
    this.decks[deckKey] = deck;
    return picked;
  }

  /* ── Mode Switching & Blank Standby Card ──────────────────────────── */

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

    this.displayStandby(modeKey);
    this.syncSettingsStats();
  }

  displayStandby(modeKey = this.currentMode) {
    this.selectedPose = null;
    const modeMeta = MODE_INFO[modeKey] || MODE_INFO.cute;
    const total = this.getPosesByMode(modeKey).length;
    const avail = this.getAvailablePoses(modeKey).length;
    const isExhausted = avail === 0;

    const modeBadge = document.getElementById("mode-badge-label");
    if (modeBadge) {
      modeBadge.textContent = `${modeMeta.name} (${modeMeta.jpName})`;
    }

    const sopBadge = document.getElementById("sop-badge-label");
    if (sopBadge) {
      sopBadge.textContent = isExhausted ? "STOK HABIS" : "STANDBY // SIAP ROLL";
      sopBadge.className = "badge-sop sop-standby";
    }

    const viewfinder = document.getElementById("viewfinder-box");
    if (viewfinder) {
      viewfinder.classList.add("is-standby");
      viewfinder.title = isExhausted
        ? "Semua pose pada mode ini sudah dipakai"
        : "Putar gacha untuk memilih pose";
    }

    const fsPill = document.getElementById("btn-fullscreen-trigger");
    if (fsPill) fsPill.hidden = true;

    const roundBadge = document.getElementById("roll-round-badge");
    if (roundBadge) roundBadge.hidden = true;

    const poseInfoBox = document.getElementById("pose-info-box");
    const standbyInfo = document.getElementById("pose-standby-info");
    if (poseInfoBox) poseInfoBox.hidden = true;
    if (standbyInfo) standbyInfo.hidden = false;

    const renderArea = document.getElementById("photo-render-area");
    if (renderArea) {
      if (isExhausted) {
        renderArea.innerHTML = `
          <div class="standby-card is-exhausted">
            <div class="standby-reticle" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="standby-kicker">SEMUA POSE TERPAKAI</span>
            <p class="standby-mode-name">${modeMeta.name}</p>
            <span class="standby-count">0 / ${total} POSE TERSISA</span>
            <p class="standby-hint">Semua pose di kategori ini sudah ditandai selesai. Reset riwayat untuk mengundi ulang.</p>
            <button type="button" class="btn-reset-inline" id="btn-inline-reset-mode">Reset Riwayat Mode Ini</button>
          </div>
        `;
        const inlineBtn = document.getElementById("btn-inline-reset-mode");
        if (inlineBtn) {
          inlineBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.resetUsedPoses("current");
          });
        }
      } else {
        renderArea.innerHTML = `
          <div class="standby-card">
            <div class="standby-reticle" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <circle cx="12" cy="12" r="3.5"></circle>
                <line x1="7" y1="17" x2="17" y2="17"></line>
              </svg>
            </div>
            <span class="standby-kicker">VIEWFINDER // STANDBY</span>
            <p class="standby-mode-name">${modeMeta.name}</p>
            <span class="standby-jp" lang="ja">${modeMeta.jpName}</span>
            <span class="standby-count">${avail} / ${total} POSE TERSEDIA</span>
            <p class="standby-hint">Tekan tombol <strong>PUTAR GACHA POSE!</strong> di bawah untuk mengundi pose cheki.</p>
          </div>
        `;
      }
    }

    const btnRoll = document.getElementById("btn-roll-gacha");
    if (btnRoll) {
      btnRoll.disabled = isExhausted;
    }
    this.setRollButtonLabel(
      isExhausted ? "SEMUA POSE SUDAH DIPAKAI" : "PUTAR GACHA POSE!"
    );

    this.syncStandbyMeta();
  }

  syncStandbyMeta() {
    const modeMeta = MODE_INFO[this.currentMode] || MODE_INFO.cute;
    const total = this.getPosesByMode(this.currentMode).length;
    const avail = this.getAvailablePoses(this.currentMode).length;

    const kicker = document.getElementById("standby-info-kicker");
    const title = document.getElementById("standby-info-title");
    const desc = document.getElementById("standby-info-desc");
    const poolPill = document.getElementById("standby-meta-pool");
    const rollPill = document.getElementById("standby-meta-roll");

    if (kicker) {
      kicker.textContent =
        avail === 0
          ? `SELESAI // ${modeMeta.name.toUpperCase()}`
          : `STANDBY // ${modeMeta.name.toUpperCase()}`;
    }
    if (title) {
      title.textContent =
        avail === 0
          ? "Semua Pose di Mode Ini Sudah Dipakai"
          : "Siap Mengundi Pose Cheki";
    }
    if (desc) {
      desc.innerHTML =
        avail === 0
          ? "Tekan <strong>Reset Riwayat Mode Ini</strong> pada kartu atau buka <strong>Pengaturan (⚙)</strong> untuk mengosongkan riwayat."
          : "Tekan tombol <strong>PUTAR GACHA POSE!</strong> untuk mengacak pose. Foto &amp; detail pose hanya muncul setelah putaran berhenti.";
    }
    if (poolPill) {
      poolPill.textContent = `${avail} / ${total} pose tersedia`;
    }
    if (rollPill) {
      const durLabel =
        this.settings.duration === "custom"
          ? `${this.settings.customDurationSec.toFixed(1)} dtk`
          : DURATION_LABELS[this.settings.duration] || "Normal";
      const cntLabel = ROLL_COUNT_LABELS[this.settings.rollCount] || "1x";
      rollPill.textContent = `Roll: ${durLabel} · ${cntLabel}`;
    }
  }

  setRollButtonLabel(text) {
    const primary = document.getElementById("spin-label-primary");
    const hover = document.getElementById("spin-label-hover");
    if (primary) primary.textContent = text;
    if (hover) hover.textContent = text;
  }

  /* ── Configurable Duration & Multi-Roll Engine ────────────────────── */

  buildDelaySchedule(durationPreset, isIntermediate = false) {
    if (durationPreset === "custom") {
      const sec = this.clampCustomDuration(this.settings.customDurationSec);
      const targetMs = sec * 1000 * (isIntermediate ? 0.65 : 1);
      const steps = Math.max(6, Math.min(34, Math.round((targetMs / 1000) * 5.5)));
      const weights = [];
      let sum = 0;
      for (let i = 0; i < steps; i++) {
        const t = steps === 1 ? 1 : i / (steps - 1);
        const w = 0.08 + 0.92 * Math.pow(t, 2.5);
        weights.push(w);
        sum += w;
      }
      return weights.map((w) => Math.max(35, Math.round((w / sum) * targetMs)));
    }

    let base;
    if (durationPreset === "fast") {
      base = [45, 50, 55, 65, 80, 105, 145, 210, 320];
    } else if (durationPreset === "dramatic") {
      base = [
        45, 45, 50, 50, 55, 60, 65, 75, 85, 100, 120, 145, 175, 215, 265, 325,
        395, 475, 565, 660, 760,
      ];
    } else {
      base = [
        55, 55, 60, 65, 70, 80, 95, 115, 140, 175, 220, 275, 340, 420, 510,
      ];
    }

    if (!isIntermediate) return base;
    // Intermediate fake-out rounds are ~35% shorter so multi-roll stays punchy
    const targetLen = Math.max(6, Math.round(base.length * 0.65));
    return base.slice(0, targetLen).map((ms) => Math.round(ms * 0.85));
  }

  resolveTotalRounds() {
    if (this.settings.rollCount === "random") {
      return Math.floor(Math.random() * 3) + 1;
    }
    const parsed = parseInt(this.settings.rollCount, 10);
    return [1, 2, 3].includes(parsed) ? parsed : 1;
  }

  rollRoulette() {
    if (this.isRolling) return;
    const availablePool = this.getAvailablePoses(this.currentMode);
    if (availablePool.length === 0) {
      this.displayStandby(this.currentMode);
      return;
    }

    const finalPick = this.drawFromDeck() || availablePool[0];
    const visualPool =
      availablePool.length > 1
        ? availablePool
        : this.getPosesByMode(this.currentMode);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      this.finishRollLock(finalPick);
      return;
    }

    const totalRounds = this.resolveTotalRounds();
    this.isRolling = true;

    const btnRoll = document.getElementById("btn-roll-gacha");
    const card = document.getElementById("polaroid-card");
    const viewfinder = document.getElementById("viewfinder-box");
    const roundBadge = document.getElementById("roll-round-badge");
    const fsPill = document.getElementById("btn-fullscreen-trigger");

    if (btnRoll) btnRoll.disabled = true;
    if (card) card.classList.add("is-spinning");
    if (viewfinder) viewfinder.classList.remove("is-standby");
    if (fsPill) fsPill.hidden = true;

    let currentRound = 1;
    let lastCandidateId = this.selectedPose ? this.selectedPose.id : null;

    const runRound = () => {
      const isFinalRound = currentRound === totalRounds;
      const delays = this.buildDelaySchedule(
        this.settings.duration,
        !isFinalRound
      );

      if (roundBadge) {
        if (totalRounds > 1) {
          roundBadge.hidden = false;
          roundBadge.classList.remove("is-fakeout");
          roundBadge.textContent = isFinalRound
            ? `PUTARAN FINAL (${currentRound}/${totalRounds})`
            : `RONDE ${currentRound} / ${totalRounds}`;
        } else {
          roundBadge.hidden = true;
        }
      }

      this.setRollButtonLabel(
        totalRounds > 1
          ? isFinalRound
            ? `PUTARAN FINAL (${currentRound}/${totalRounds})...`
            : `MEMUTAR (${currentRound}/${totalRounds})...`
          : "MEMUTAR GACHA..."
      );

      let stepIndex = 0;

      const executeStep = () => {
        if (stepIndex < delays.length) {
          let candidate =
            visualPool[Math.floor(Math.random() * visualPool.length)];
          if (visualPool.length > 1 && candidate.id === lastCandidateId) {
            candidate =
              visualPool.find((p) => p.id !== lastCandidateId) || candidate;
          }
          lastCandidateId = candidate.id;

          this.renderVisual(
            candidate,
            document.getElementById("photo-render-area")
          );

          const pitch = Math.max(280, 580 - stepIndex * 14);
          sfx.playTick(pitch);

          const currentDelay = delays[stepIndex];
          stepIndex++;
          setTimeout(executeStep, currentDelay);
        } else if (!isFinalRound) {
          // Intermediate fake-out stop!
          let fakePose =
            visualPool[Math.floor(Math.random() * visualPool.length)];
          if (visualPool.length > 1 && fakePose.id === finalPick.id) {
            fakePose =
              visualPool.find((p) => p.id !== finalPick.id) || fakePose;
          }
          lastCandidateId = fakePose.id;
          this.renderVisual(
            fakePose,
            document.getElementById("photo-render-area")
          );

          if (card) card.classList.remove("is-spinning");
          sfx.playFakeStop();

          if (roundBadge) {
            roundBadge.classList.add("is-fakeout");
            roundBadge.textContent = `FAKE-OUT! LANJUT RONDE ${currentRound + 1}...`;
          }

          setTimeout(() => {
            currentRound++;
            if (card) card.classList.add("is-spinning");
            runRound();
          }, 620);
        } else {
          // Final jackpot lock
          if (card) card.classList.remove("is-spinning");
          if (roundBadge) {
            roundBadge.hidden = true;
            roundBadge.classList.remove("is-fakeout");
          }
          this.finishRollLock(finalPick);
        }
      };

      executeStep();
    };

    runRound();
  }

  finishRollLock(finalPick) {
    const flashEl = document.getElementById("flash-overlay");
    const card = document.getElementById("polaroid-card");
    const btnRoll = document.getElementById("btn-roll-gacha");

    this.displayPose(finalPick, true);
    sfx.playLock();

    if (this.settings.autoMarkUsed && !this.usedPoseIds.has(finalPick.id)) {
      this.usedPoseIds.add(finalPick.id);
      this.saveUsedPoses();
      this.updateChipCounts();
      this.syncMarkUsedButtons();
    }

    if (flashEl) {
      flashEl.classList.add("active");
      setTimeout(() => flashEl.classList.remove("active"), 280);
    }

    if (card) {
      card.classList.add("lock-celebrate");
      setTimeout(() => card.classList.remove("lock-celebrate"), 450);
    }

    this.isRolling = false;
    const remaining = this.getAvailablePoses(this.currentMode).length;
    if (btnRoll) btnRoll.disabled = remaining === 0;
    this.setRollButtonLabel(
      remaining === 0 ? "SEMUA POSE SUDAH DIPAKAI" : "PUTAR GACHA POSE!"
    );
  }

  /* ── Pose Rendering ───────────────────────────────────────────────── */

  displayPose(pose, isFinalLock = false) {
    this.selectedPose = pose;
    const modeMeta = MODE_INFO[pose.mode] || MODE_INFO.cute;

    const viewfinder = document.getElementById("viewfinder-box");
    if (viewfinder) {
      viewfinder.classList.remove("is-standby");
      viewfinder.title = "Ketuk untuk perbesar (Layar Penuh ke Oshi)";
    }

    const fsPill = document.getElementById("btn-fullscreen-trigger");
    if (fsPill) fsPill.hidden = false;

    const poseInfoBox = document.getElementById("pose-info-box");
    const standbyInfo = document.getElementById("pose-standby-info");
    if (poseInfoBox) poseInfoBox.hidden = false;
    if (standbyInfo) standbyInfo.hidden = true;

    const modeBadge = document.getElementById("mode-badge-label");
    if (modeBadge) {
      modeBadge.textContent = `${modeMeta.name} (${modeMeta.jpName})`;
    }

    const sopBadge = document.getElementById("sop-badge-label");
    if (sopBadge) {
      const isSafe = pose.sop === "safe";
      sopBadge.textContent = isSafe
        ? "SOP: Aman (Tanpa Sentuh)"
        : "SOP: Pose Dekat";
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

    this.syncMarkUsedButtons();

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
        targetElement.innerHTML = renderPoseDiagram(
          pose.diagramType,
          pose.mode
        );
      };
      img.src = pose.image;
      targetElement.appendChild(img);
    }
  }

  /* ── Mark Used & Reset ────────────────────────────────────────────── */

  toggleUsedPose(poseId) {
    if (!poseId) return;
    if (this.usedPoseIds.has(poseId)) {
      this.usedPoseIds.delete(poseId);
    } else {
      this.usedPoseIds.add(poseId);
    }
    this.saveUsedPoses();
    sfx.playTick(540);
    this.updateChipCounts();
    this.syncMarkUsedButtons();

    const remaining = this.getAvailablePoses(this.currentMode).length;
    const btnRoll = document.getElementById("btn-roll-gacha");
    if (btnRoll && !this.isRolling) {
      btnRoll.disabled = remaining === 0;
      this.setRollButtonLabel(
        remaining === 0 ? "SEMUA POSE SUDAH DIPAKAI" : "PUTAR GACHA POSE!"
      );
    }
  }

  syncMarkUsedButtons() {
    const isUsed = Boolean(
      this.selectedPose && this.usedPoseIds.has(this.selectedPose.id)
    );

    const btnMain = document.getElementById("btn-mark-used");
    const lblMain = document.getElementById("mark-used-label");
    if (btnMain) btnMain.setAttribute("aria-pressed", String(isUsed));
    if (lblMain) {
      lblMain.textContent = isUsed
        ? "Sudah Diposekan (Ketuk untuk Batal)"
        : "Tandai Sudah Diposekan";
    }

    const btnFs = document.getElementById("btn-fs-mark-used");
    const lblFs = document.getElementById("fs-mark-used-label");
    if (btnFs) btnFs.setAttribute("aria-pressed", String(isUsed));
    if (lblFs) {
      lblFs.textContent = isUsed ? "✓ Sudah Dipakai" : "Tandai Dipakai";
    }
  }

  resetUsedPoses(scope = "current") {
    if (scope === "all") {
      this.usedPoseIds.clear();
      this.decks = {};
    } else {
      const modeIds = new Set(
        this.getPosesByMode(this.currentMode).map((p) => p.id)
      );
      modeIds.forEach((id) => this.usedPoseIds.delete(id));
      delete this.decks[this.currentMode];
    }

    this.saveUsedPoses();
    sfx.playTick(620);
    this.updateChipCounts();
    this.syncMarkUsedButtons();

    if (!this.selectedPose) {
      this.displayStandby(this.currentMode);
    } else {
      const btnRoll = document.getElementById("btn-roll-gacha");
      if (btnRoll && !this.isRolling) {
        btnRoll.disabled = false;
        this.setRollButtonLabel("PUTAR GACHA POSE!");
      }
    }
  }

  /* ── Settings Modal ───────────────────────────────────────────────── */

  isSettingsOpen() {
    const modal = document.getElementById("modal-settings");
    return Boolean(modal && !modal.hidden);
  }

  openSettings() {
    if (this.isRolling) return;
    const modal = document.getElementById("modal-settings");
    if (!modal) return;
    this.syncSettingsUI();
    this.syncSettingsStats();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    sfx.playTick(480);

    const closeBtn = document.getElementById("btn-close-settings");
    if (closeBtn) closeBtn.focus();
  }

  closeSettings() {
    const modal = document.getElementById("modal-settings");
    if (modal) modal.hidden = true;
    if (!this.isFullscreenOpen()) {
      document.body.style.overflow = "";
    }
  }

  syncSettingsUI() {
    document.querySelectorAll(".setting-opt-btn").forEach((btn) => {
      const key = btn.dataset.setting;
      const val = btn.dataset.value;
      const isActive = String(this.settings[key]) === String(val);
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    const autoToggle = document.getElementById("toggle-auto-mark");
    if (autoToggle) {
      autoToggle.checked = Boolean(this.settings.autoMarkUsed);
    }

    const customRow = document.getElementById("custom-duration-row");
    const customInput = document.getElementById("input-custom-duration");
    const customVal = document.getElementById("custom-duration-value");
    const clamped = this.clampCustomDuration(this.settings.customDurationSec);
    if (customRow) {
      customRow.hidden = this.settings.duration !== "custom";
    }
    if (customInput) {
      customInput.value = String(clamped);
    }
    if (customVal) {
      customVal.textContent = `${clamped.toFixed(1)} dtk`;
    }
    this.syncStandbyMeta();
  }

  syncSettingsStats() {
    const totalAll = CHEKI_POSES.length;
    const usedAll = this.usedPoseIds.size;

    const modeMeta = MODE_INFO[this.currentMode] || MODE_INFO.cute;
    const totalMode = this.getPosesByMode(this.currentMode).length;
    const availMode = this.getAvailablePoses(this.currentMode).length;
    const usedMode = totalMode - availMode;

    const usedEl = document.getElementById("settings-used-summary");
    const modeEl = document.getElementById("settings-mode-summary");
    if (usedEl) {
      usedEl.textContent = `Terpakai: ${usedAll} / ${totalAll} pose`;
    }
    if (modeEl) {
      modeEl.textContent = `Mode aktif (${modeMeta.name}): ${availMode} / ${totalMode} tersedia`;
    }

    const btnResetMode = document.getElementById("btn-reset-mode-used");
    const btnResetAll = document.getElementById("btn-reset-all-used");
    if (btnResetMode) btnResetMode.disabled = usedMode === 0;
    if (btnResetAll) btnResetAll.disabled = usedAll === 0;
  }

  /* ── Fullscreen Modal ─────────────────────────────────────────────── */

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

    this.syncMarkUsedButtons();
  }

  openShowToIdol() {
    if (!this.selectedPose || this.isRolling) return;
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
    if (!this.isSettingsOpen()) {
      document.body.style.overflow = "";
    }
    this.releaseWakeLock();
  }

  /* ── Utilities & Sound ────────────────────────────────────────────── */

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

  /* ── Events ───────────────────────────────────────────────────────── */

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
      photoBox.addEventListener("click", () => {
        if (this.selectedPose) this.openShowToIdol();
      });
      photoBox.addEventListener("keydown", (e) => {
        if (e.target !== photoBox || !this.selectedPose) return;
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

    const btnMarkUsed = document.getElementById("btn-mark-used");
    if (btnMarkUsed) {
      btnMarkUsed.addEventListener("click", () => {
        if (this.selectedPose) this.toggleUsedPose(this.selectedPose.id);
      });
    }

    const btnFsMarkUsed = document.getElementById("btn-fs-mark-used");
    if (btnFsMarkUsed) {
      btnFsMarkUsed.addEventListener("click", () => {
        if (this.selectedPose) this.toggleUsedPose(this.selectedPose.id);
      });
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

    // Settings Modal
    const btnOpenSettings = document.getElementById("btn-open-settings");
    if (btnOpenSettings) {
      btnOpenSettings.addEventListener("click", () => this.openSettings());
    }

    const btnCloseSettings = document.getElementById("btn-close-settings");
    if (btnCloseSettings) {
      btnCloseSettings.addEventListener("click", () => this.closeSettings());
    }

    const settingsModal = document.getElementById("modal-settings");
    if (settingsModal) {
      settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) this.closeSettings();
      });
    }

    document.querySelectorAll(".setting-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.setting;
        const val = btn.dataset.value;
        this.settings[key] = val;
        this.saveSettings();
        this.syncSettingsUI();
        sfx.playTick(500);
      });
    });

    const autoToggle = document.getElementById("toggle-auto-mark");
    if (autoToggle) {
      autoToggle.addEventListener("change", () => {
        this.settings.autoMarkUsed = autoToggle.checked;
        this.saveSettings();
        sfx.playTick(500);
      });
    }

    const customSlider = document.getElementById("input-custom-duration");
    if (customSlider) {
      customSlider.addEventListener("input", () => {
        this.settings.customDurationSec = this.clampCustomDuration(
          customSlider.value
        );
        this.saveSettings();
        const customVal = document.getElementById("custom-duration-value");
        if (customVal) {
          customVal.textContent = `${this.settings.customDurationSec.toFixed(1)} dtk`;
        }
        this.syncStandbyMeta();
      });
    }

    const btnResetMode = document.getElementById("btn-reset-mode-used");
    if (btnResetMode) {
      btnResetMode.addEventListener("click", () =>
        this.resetUsedPoses("current")
      );
    }

    const btnResetAll = document.getElementById("btn-reset-all-used");
    if (btnResetAll) {
      btnResetAll.addEventListener("click", () => this.resetUsedPoses("all"));
    }

    window.addEventListener("keydown", (e) => {
      if (
        e.target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (this.isSettingsOpen()) {
          e.preventDefault();
          this.closeSettings();
          return;
        }
        if (this.isFullscreenOpen()) {
          e.preventDefault();
          this.closeShowToIdol();
          return;
        }
      }

      if (this.isSettingsOpen()) return;

      if (
        (e.key === " " || e.key.toLowerCase() === "r") &&
        e.target === document.body
      ) {
        e.preventDefault();
        this.rollRoulette();
      } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
        if (!this.selectedPose) return;
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
