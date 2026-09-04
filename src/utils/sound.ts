// Web Audio API Sound Synthesizer & Cheerful Classroom Background Music & Speech Synthesis

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isBgmMuted: boolean = false;
  public isBgmPlaying: boolean = false;
  public voiceEnabled: boolean = true;

  // BGM scheduler state
  private bgmIntervalId: number | null = null;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private bgmGainNode: GainNode | null = null;

  // Cheerful, friendly melody loop for elementary classroom (Key of C / G Major, cute marimba tones)
  // Step length = 16th notes at 112 BPM (approx 0.134s per step, 32 steps = 2 bars)
  private melodyNotes: (number | null)[] = [
    // Bar 1: C - E - G - A - G - E - D - E
    523.25, null, 659.25, null, 783.99, null, 880.00, null,
    783.99, null, 659.25, null, 587.33, 659.25, 587.33, null,
    // Bar 2: C - D - E - G - A - C6 - A - G
    523.25, null, 587.33, null, 659.25, null, 783.99, null,
    880.00, 1046.5, 880.00, null, 783.99, null, null, null,
    // Bar 3: A - G - E - D - C - D - E - G
    880.00, null, 783.99, null, 659.25, null, 587.33, null,
    523.25, null, 587.33, null, 659.25, null, 783.99, null,
    // Bar 4: E - D - C - D - C (cheerful resolve)
    659.25, null, 587.33, null, 523.25, null, 587.33, null,
    523.25, null, null, null, null, null, null, null,
  ];

  // Soft bass accompaniment (C3, G3, A2, F2)
  private bassNotes: (number | null)[] = [
    // Bar 1 (C3)
    130.81, null, null, null, 196.00, null, null, null,
    130.81, null, null, null, 196.00, null, null, null,
    // Bar 2 (A2)
    110.00, null, null, null, 164.81, null, null, null,
    110.00, null, null, null, 164.81, null, null, null,
    // Bar 3 (F2)
    87.31,  null, null, null, 130.81, null, null, null,
    87.31,  null, null, null, 130.81, null, null, null,
    // Bar 4 (G2 -> C3)
    98.00,  null, null, null, 146.83, null, null, null,
    130.81, null, null, null, 196.00, null, null, null,
  ];

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.bgmGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Background Music (BGM) Engine ---
  startBGM() {
    this.initCtx();
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    // Scheduler tick every 35ms with a 100ms lookahead
    this.bgmIntervalId = window.setInterval(() => {
      this.scheduleBgmNotes();
    }, 35);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  private scheduleBgmNotes() {
    if (!this.ctx || !this.isBgmPlaying || this.isBgmMuted) return;

    const stepDuration = 0.135; // ~112 BPM sixteenth notes
    const lookahead = 0.12;

    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      const step = this.currentStep % this.melodyNotes.length;
      const melodyFreq = this.melodyNotes[step];
      const bassFreq = this.bassNotes[step];

      // Play soft marimba melody note
      if (melodyFreq) {
        this.playMarimbaTone(melodyFreq, this.nextNoteTime, 0.22, 0.18);
      }

      // Play warm bass note
      if (bassFreq) {
        this.playBassTone(bassFreq, this.nextNoteTime, 0.35, 0.12);
      }

      this.nextNoteTime += stepDuration;
      this.currentStep++;
    }
  }

  // Warm marimba/kalimba note synthesis
  private playMarimbaTone(freq: number, time: number, duration: number, volume: number) {
    if (!this.ctx || !this.bgmGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Warm snappy wooden hit
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Soft mellow bass note
  private playBassTone(freq: number, time: number, duration: number, volume: number) {
    if (!this.ctx || !this.bgmGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Play rewarding positive chime arpeggio (C5 -> E5 -> G5 -> C6)
  playSuccessChime(isCombo = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = isCombo
        ? [523.25, 659.25, 783.99, 1046.5, 1318.51]
        : [523.25, 659.25, 783.99, 1046.5];
      const duration = 0.12;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.24, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + duration + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + duration + 0.2);
      });
    } catch {
      // AudioContext recovery
    }
  }

  // Play big streak celebration fanfare
  playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 587.33, t: 0.0, d: 0.1 },
        { f: 587.33, t: 0.12, d: 0.1 },
        { f: 587.33, t: 0.24, d: 0.1 },
        { f: 880.0, t: 0.38, d: 0.35 },
      ];
      fanfare.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.25, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    } catch {
      // ignore
    }
  }

  // Play bubbly pop sound
  playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Speak the English word aloud with Web Speech API
  speakWord(word: 'trousers' | 'shorts') {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Oliver') ||
              v.name.includes('David'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // fallback
    }
  }
}

export const sound = new SoundManager();
