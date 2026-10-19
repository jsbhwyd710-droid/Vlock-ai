// Web Audio Sound Effects Synthesizer Engine
// Generates realistic world sounds, animal sounds (monkeys, jungle, wildlife), 
// vehicle engines, storms, and cinematic soundscapes in real-time.

let audioCtx: AudioContext | null = null;
let currentLoopNodes: { stop: () => void }[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundFxEngine = {
  // 🐒 1. Monkey & Jungle Wildlife Sound Effects
  playMonkeyJungle() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Monkey chattering sequence: rapid modulated formant chirps
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        const startTime = now + i * 0.14 + (Math.random() * 0.04);
        const duration = 0.08 + Math.random() * 0.04;

        // Rapid pitch inflection like monkey call: 800Hz -> 2400Hz -> 1200Hz
        osc.frequency.setValueAtTime(900 + (i % 2 === 0 ? 600 : 200), startTime);
        osc.frequency.exponentialRampToValueAtTime(2200 + Math.random() * 400, startTime + duration * 0.4);
        osc.frequency.exponentialRampToValueAtTime(1100, startTime + duration);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, startTime);
        filter.Q.setValueAtTime(3, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      }

      // Background jungle bird chirp
      const birdOsc = ctx.createOscillator();
      const birdGain = ctx.createGain();
      birdOsc.type = 'sine';
      birdOsc.frequency.setValueAtTime(3200, now + 0.3);
      birdOsc.frequency.exponentialRampToValueAtTime(4800, now + 0.45);
      birdOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.6);

      birdGain.gain.setValueAtTime(0.001, now + 0.3);
      birdGain.gain.linearRampToValueAtTime(0.12, now + 0.35);
      birdGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      birdOsc.connect(birdGain);
      birdGain.connect(ctx.destination);
      birdOsc.start(now + 0.3);
      birdOsc.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🏎️ 2. Supercar Acceleration & Engine Revving
  playSupercarEngine() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      // Idle -> Rev -> Shift
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(140, now + 1.0);
      osc.frequency.exponentialRampToValueAtTime(360, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(800, now + 1.0);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 1.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.1);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🚀 3. Sci-Fi Laser & Warp Sound
  playSciFiWarp() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.7);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🌧️ 4. Nature Storm & Thunder Rumble
  playThunderstorm() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Low frequency thunder rumble
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.linearRampToValueAtTime(70, now + 1.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 1.5);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🥁 5. Epic Cinematic Impact & Taiko Drum
  playEpicCinematicHit() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🦁 6. Wildlife & Lion Roar Effect
  playWildlifeRoar() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // 🌊 7. Ocean Waves & Water
  playOceanWaves() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.linearRampToValueAtTime(650, now + 1.0);
      filter.frequency.linearRampToValueAtTime(280, now + 2.0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 2.0);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  },

  // Play based on detected theme or selection
  playSoundForTheme(theme: string) {
    const t = theme.toLowerCase();
    if (t.includes('monkey') || t.includes('jungle') || t.includes('قرد') || t.includes('غابة')) {
      this.playMonkeyJungle();
    } else if (t.includes('car') || t.includes('racing') || t.includes('supercar') || t.includes('سيار')) {
      this.playSupercarEngine();
    } else if (t.includes('space') || t.includes('sci_fi') || t.includes('laser') || t.includes('فضاء')) {
      this.playSciFiWarp();
    } else if (t.includes('storm') || t.includes('rain') || t.includes('thunder') || t.includes('مطر') || t.includes('رعد')) {
      this.playThunderstorm();
    } else if (t.includes('water') || t.includes('ocean') || t.includes('sea') || t.includes('بحر')) {
      this.playOceanWaves();
    } else if (t.includes('animal') || t.includes('lion') || t.includes('حيوان') || t.includes('أسد')) {
      this.playWildlifeRoar();
    } else {
      this.playEpicCinematicHit();
    }
  },

  // Stop any active audio
  stopAll() {
    currentLoopNodes.forEach((node) => {
      try {
        node.stop();
      } catch {}
    });
    currentLoopNodes = [];
  }
};
