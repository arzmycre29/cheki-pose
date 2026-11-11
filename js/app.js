import { CHEKI_POSES, MODE_INFO } from './poses-data.js';
import { renderPoseDiagram } from './diagrams.js';
import { sfx } from './audio.js';

class PureGachaApp {
  constructor() {
    this.currentMode = 'cute'; // cute (default), fun, meme
    this.selectedPose = null;
    this.isRolling = false;
    this.wakeLock = null;

    this.init();
  }

  init() {
    this.bindEvents();
    // Default initial display with first cute pose
    const initialPoses = this.getPosesByMode(this.currentMode);
    if (initialPoses.length > 0) {
      this.displayPose(initialPoses[0], false);
    }
  }

  getPosesByMode(mode = this.currentMode) {
    return CHEKI_POSES.filter(p => p.mode === mode);
  }

  switchMode(modeKey) {
    if (this.currentMode === modeKey) return;
    this.currentMode = modeKey;
    sfx.playPop();

    // Update body theme and pill UI
    document.body.dataset.mode = modeKey;
    document.querySelectorAll('.mode-pill').forEach(btn => {
      if (btn.dataset.mode === modeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Roll immediately into a pose of the selected mode
    const modePoses = this.getPosesByMode(modeKey);
    if (modePoses.length > 0) {
      const pick = modePoses[Math.floor(Math.random() * modePoses.length)];
      this.displayPose(pick, true);
    }
  }

  rollGacha() {
    if (this.isRolling) return;

    const availablePoses = this.getPosesByMode(this.currentMode);
    if (availablePoses.length === 0) return;

    this.isRolling = true;
    sfx.playPop();

    const card = document.getElementById('polaroid-card');
    const btnRoll = document.getElementById('btn-roll-gacha');
    if (btnRoll) btnRoll.disabled = true;
    if (card) card.classList.add('spinning');

    let counter = 0;
    const maxIterations = 14;

    const spinInterval = setInterval(() => {
      counter++;
      const candidate = availablePoses[Math.floor(Math.random() * availablePoses.length)];
      this.displayPose(candidate, false);
      sfx.playSpin();

      if (counter >= maxIterations) {
        clearInterval(spinInterval);
        this.isRolling = false;
        if (btnRoll) btnRoll.disabled = false;
        if (card) card.classList.remove('spinning');

        // Final random pick (different from previous if possible)
        let finalPick = availablePoses[Math.floor(Math.random() * availablePoses.length)];
        if (availablePoses.length > 1 && this.selectedPose && finalPick.id === this.selectedPose.id) {
          finalPick = availablePoses.find(p => p.id !== this.selectedPose.id) || finalPick;
        }

        this.displayPose(finalPick, true);
        sfx.playFanfare();

        if (card) {
          card.classList.add('celebrate');
          setTimeout(() => card.classList.remove('celebrate'), 600);
        }
      }
    }, 50);
  }

  displayPose(pose, animate = false) {
    this.selectedPose = pose;

    // Title & Japanese
    const titleEl = document.getElementById('pose-title');
    const titleJpEl = document.getElementById('pose-title-jp');
    if (titleEl) titleEl.textContent = pose.title;
    if (titleJpEl) titleJpEl.textContent = pose.titleJp || '';

    // Cue Box
    const cueIdEl = document.getElementById('pose-cue-id');
    const cueJpEl = document.getElementById('pose-cue-jp');
    if (cueIdEl) cueIdEl.textContent = `"${pose.cueId}"`;
    if (cueJpEl) cueJpEl.textContent = pose.cueJp;

    // Stance Guide
    const fanActEl = document.getElementById('pose-fan-action');
    const idolActEl = document.getElementById('pose-idol-action');
    if (fanActEl) fanActEl.textContent = pose.fanAction;
    if (idolActEl) idolActEl.textContent = pose.idolAction;

    // Render 3:4 Photo or SVG Diagram
    const renderArea = document.getElementById('photo-render-area');
    if (renderArea) {
      this.renderVisual(pose, renderArea, 'pose-img-34');
    }
  }

  renderVisual(pose, targetElement, imgClass = 'pose-img-34') {
    targetElement.innerHTML = '';

    if (pose.image) {
      const img = new Image();
      img.src = pose.image;
      img.className = imgClass;
      img.alt = pose.title;

      img.onload = () => {
        targetElement.innerHTML = '';
        targetElement.appendChild(img);
      };

      img.onerror = () => {
        // Fallback to crisp SVG silhouette diagram
        targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
      };
    } else {
      targetElement.innerHTML = renderPoseDiagram(pose.diagramType, pose.mode);
    }
  }

  openShowToIdol() {
    if (!this.selectedPose) return;
    const pose = this.selectedPose;
    sfx.playFanfare();

    const modal = document.getElementById('modal-show-idol');
    if (!modal) return;

    document.getElementById('fs-title').textContent = pose.title;
    document.getElementById('fs-title-jp').textContent = pose.titleJp || '';
    document.getElementById('fs-cue-id').textContent = `"${pose.cueId}"`;
    document.getElementById('fs-cue-jp').textContent = pose.cueJp;
    document.getElementById('fs-fan-act').textContent = pose.fanAction;
    document.getElementById('fs-idol-act').textContent = pose.idolAction;

    const fsVisual = document.getElementById('fs-visual');
    if (fsVisual) {
      this.renderVisual(pose, fsVisual, 'fs-img-34');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

  bindEvents() {
    // Mode Pills
    document.querySelectorAll('.mode-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchMode(btn.dataset.mode);
      });
    });

    // Roll Gacha Button
    const btnRoll = document.getElementById('btn-roll-gacha');
    if (btnRoll) {
      btnRoll.addEventListener('click', () => this.rollGacha());
    }

    // Photo Click / Fullscreen Trigger
    const photoTrigger = document.getElementById('photo-frame-trigger');
    if (photoTrigger) {
      photoTrigger.addEventListener('click', () => this.openShowToIdol());
    }

    const btnFsBadge = document.getElementById('btn-fullscreen-badge');
    if (btnFsBadge) {
      btnFsBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openShowToIdol();
      });
    }

    // Close Fullscreen Modal
    const btnCloseFs = document.getElementById('btn-close-fullscreen');
    if (btnCloseFs) {
      btnCloseFs.addEventListener('click', () => this.closeShowToIdol());
    }

    // Copy Cue Button
    const btnCopy = document.getElementById('btn-copy-cue');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        if (!this.selectedPose) return;
        navigator.clipboard.writeText(this.selectedPose.cueId);
        btnCopy.textContent = '✅ Tersalin!';
        setTimeout(() => btnCopy.textContent = '📋 Salin', 2000);
      });
    }

    // Sound Toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isEnabled = sfx.toggle();
        btnSound.textContent = isEnabled ? '🔔' : '🔕';
      });
    }
  }
}

// Start app
window.addEventListener('DOMContentLoaded', () => {
  window.app = new PureGachaApp();
});
