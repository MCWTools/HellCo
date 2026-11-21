/* Tiny WebAudio sfx (no files needed). */
HC.audio = (function () {
  let ctx = null;
  function on() { return HC.store.get().settings.sound !== false; }
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(f, dur, type, vol, slide) {
    if (!on()) return; const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + dur);
    g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol) {
    if (!on()) return; const c = ac(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; g.gain.value = vol || 0.15;
    s.connect(g); g.connect(c.destination); s.start();
  }
  return {
    unlock() { ac(); },
    blip(i) { tone(180 + (i % 5) * 30, 0.035, 'square', 0.025); },
    click() { tone(520, 0.05, 'square', 0.05); },
    stamp() { tone(90, 0.22, 'sine', 0.25, 0.4); noise(0.12, 0.2); },
    good() { tone(660, 0.1, 'square', 0.06); setTimeout(() => tone(880, 0.16, 'square', 0.06), 90); },
    near() { tone(440, 0.14, 'triangle', 0.08); },
    bad() { tone(200, 0.28, 'sawtooth', 0.07, 0.5); },
    fall() { tone(500, 0.6, 'sine', 0.08, 0.15); },
    rise() { tone(300, 0.7, 'sine', 0.07, 3); },
    rank() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'square', 0.06), i * 110)); },
    whoosh() { noise(0.4, 0.1); tone(120, 0.4, 'sawtooth', 0.03, 3); }
  };
})();
