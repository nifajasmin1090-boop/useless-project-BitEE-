/**
 * BitEe - Web Audio Telemetry Synthesizer & Speech Engine
 * Generates retro aerospace beeps, warning sirens, ratio exceed chimes, and speech synthesis.
 */

class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.speechAvailable = 'speechSynthesis' in window;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.speechAvailable) {
      window.speechSynthesis.cancel();
    }
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.08, vol = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay fallback
    }
  }

  click() {
    this.playTone(800, 'triangle', 0.03, 0.05);
  }

  toggle() {
    this.playTone(600, 'square', 0.04, 0.04);
    setTimeout(() => this.playTone(900, 'square', 0.04, 0.04), 40);
  }

  calculate() {
    if (this.muted) return;
    this.init();
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.07, 0.08), idx * 60);
    });
  }

  targetLock() {
    if (this.muted) return;
    this.playTone(1200, 'sine', 0.06, 0.1);
    setTimeout(() => this.playTone(1600, 'sine', 0.12, 0.12), 80);
  }

  /**
   * Sound for ratio overload / when actual ratio increases beyond ideal ratio
   */
  ratioExceeded(categoryName = "") {
    if (this.muted) return;
    this.init();
    // Dual cautionary downward telemetry pips (840Hz -> 560Hz)
    this.playTone(840, 'triangle', 0.08, 0.12);
    setTimeout(() => {
      this.playTone(560, 'sawtooth', 0.14, 0.14);
    }, 70);
  }

  /**
   * Sound for warnings & bite stall
   */
  alarm(isCritical = false) {
    if (this.muted) return;
    this.init();

    if (isCritical) {
      // Urgent aerospace klaxon: alternating high-low alarm pulses
      const pulses = [
        { f: 520, t: 'sawtooth', d: 0.12, delay: 0 },
        { f: 380, t: 'sawtooth', d: 0.14, delay: 130 },
        { f: 520, t: 'sawtooth', d: 0.12, delay: 280 },
        { f: 380, t: 'sawtooth', d: 0.16, delay: 410 }
      ];
      pulses.forEach(p => {
        setTimeout(() => this.playTone(p.f, p.t, p.d, 0.13), p.delay);
      });
    } else {
      // Cautionary warning ping
      this.playTone(420, 'square', 0.1, 0.09);
      setTimeout(() => this.playTone(320, 'sawtooth', 0.15, 0.09), 90);
    }
  }

  /**
   * Speaks "wow bite is ready kadichoo" and plays celebration fanfare
   */
  speakPerfectBite() {
    if (this.muted) return;
    this.init();

    // 1. Celebratory victory arpeggio: C5 -> E5 -> G5 -> C6
    const fanfare = [
      { f: 523.25, delay: 0, d: 0.12 },
      { f: 659.25, delay: 100, d: 0.12 },
      { f: 783.99, delay: 200, d: 0.14 },
      { f: 1046.50, delay: 320, d: 0.35 }
    ];
    fanfare.forEach(item => {
      setTimeout(() => this.playTone(item.f, 'sine', item.d, 0.15), item.delay);
    });

    // 2. Speech synthesis: "Ente ponno! Wow bite is ready kadichoo aliya!"
    if (this.speechAvailable) {
      try {
        window.speechSynthesis.cancel(); // Clear any pending speech
        const phrase = "Wow! Bite is ready, kadichoo!";
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.95; // Clear and energetic pace
        utterance.pitch = 1.15; // Slightly excited pitch
        utterance.volume = 1.0;

        // Try to pick a natural voice if loaded
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice = voices.find(v => (v.lang.includes('en') || v.lang.includes('IN')) && !v.name.includes('Google') && v.localService) 
            || voices.find(v => v.lang.includes('en'))
            || voices[0];
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        // Slight delay so the fanfare starts first
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 350);
      } catch (err) {
        console.warn("Speech synthesis error:", err);
      }
    }
  }
}

export const sound = new SoundFX();
