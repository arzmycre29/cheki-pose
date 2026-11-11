// Web Audio synthesizer for roulette ticks, mechanical deceleration, and jackpot fanfare.

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
      this.playTick(500);
    }
    return this.enabled;
  }

  playTick(frequency = 400) {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  playLock() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;

      // Mechanical shutter snap
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = "square";
      snapOsc.frequency.setValueAtTime(800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
      snapGain.gain.setValueAtTime(0.18, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.05);

      // Harmonious chime chord (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + 0.03 + idx * 0.04);

        gain.gain.setValueAtTime(0.14, now + 0.03 + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03 + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + 0.03 + idx * 0.04);
        osc.stop(now + 0.03 + idx * 0.04 + 0.28);
      });
    } catch (e) {}
  }
}

export const sfx = new SoundEffects();
