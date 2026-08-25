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
}

export const audioSynth = new AudioSynth();