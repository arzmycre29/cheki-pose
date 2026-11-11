// Offline Web Audio synthesizer for analog shutter and UI feedback.

const STORAGE_KEY = "chekipose_sound_enabled";

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = this.loadPreference();
  }

  loadPreference() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved === "true";
    } catch (e) {}
    return false;
  }

  savePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, String(this.enabled));
    } catch (e) {}
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.savePreference();
    if (this.enabled) {
      this.playPop();
    }
    return this.enabled;
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.065);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.065);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch (e) {}
  }

  playSpin() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(280 + Math.random() * 90, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      // Mechanical shutter click followed by two-note confirmation chime
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createOscillator ? this.ctx.createGain() : null;
        if (!gain) return;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);

        gain.gain.setValueAtTime(0.14, now + idx * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + 0.22);
      });
    } catch (e) {}
  }
}

export const sfx = new SoundEffects();
