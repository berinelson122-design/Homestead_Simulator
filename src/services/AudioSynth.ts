export class AudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15;
    this.masterGain.connect(this.ctx.destination);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, slide?: number) {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slide) {
      osc.frequency.exponentialRampToValueAtTime(slide, this.ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playPlace() {
    this.playTone(300, 'sine', 0.08, 600);
  }

  public playRemove() {
    this.playTone(400, 'sawtooth', 0.1, 150);
  }

  public playSelect() {
    this.playTone(880, 'triangle', 0.04);
  }

  public playAlert() {
    this.playTone(200, 'sawtooth', 0.3, 100);
  }

  public playSuccess() {
    this.playTone(523.25, 'sine', 0.1);
    setTimeout(() => this.playTone(659.25, 'sine', 0.15), 100);
  }

  public playWeatherChange(type: 'CLEAR' | 'RAIN' | 'SNOW' | 'ACID_STORM') {
    this.init();
    switch (type) {
      case 'RAIN':
        this.playTone(180, 'sine', 0.4, 90);
        setTimeout(() => this.playTone(280, 'triangle', 0.25, 140), 80);
        break;
      case 'SNOW':
        this.playTone(1200, 'sine', 0.35, 1400);
        setTimeout(() => this.playTone(1800, 'triangle', 0.2, 1600), 70);
        break;
      case 'ACID_STORM':
        this.playTone(90, 'sawtooth', 0.5, 45);
        setTimeout(() => this.playTone(140, 'sawtooth', 0.3, 70), 100);
        break;
      case 'CLEAR':
      default:
        this.playTone(440, 'triangle', 0.15, 660);
        setTimeout(() => this.playTone(660, 'sine', 0.25, 880), 90);
        break;
    }
  }

  public playCameraShutter() {
    this.init();
    this.playTone(1200, 'square', 0.04, 300);
    setTimeout(() => {
      this.playTone(400, 'sawtooth', 0.06, 150);
    }, 45);
  }

  public playTimelapseStep() {
    this.init();
    this.playTone(950, 'triangle', 0.02);
  }

  public playBlueprintToggle(active: boolean) {
    this.init();
    if (active) {
      this.playTone(600, 'square', 0.05, 1200);
      setTimeout(() => this.playTone(1200, 'sine', 0.08, 1800), 40);
    } else {
      this.playTone(1400, 'sine', 0.06, 600);
    }
  }

  public playEnergyOverlayToggle(active: boolean) {
    this.init();
    if (active) {
      this.playTone(350, 'sawtooth', 0.06, 700);
      setTimeout(() => this.playTone(700, 'triangle', 0.1, 1050), 50);
    } else {
      this.playTone(700, 'triangle', 0.08, 300);
    }
  }

  public playIntelOpen() {
    this.init();
    this.playTone(500, 'sine', 0.06);
    setTimeout(() => this.playTone(750, 'sine', 0.06), 50);
    setTimeout(() => this.playTone(1000, 'triangle', 0.08), 100);
  }
}

export const audioSynth = new AudioSynth();