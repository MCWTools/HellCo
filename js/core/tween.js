/* Minimal tween + timers driven by the main loop. */
HC.tween = (function () {
  const list = [];
  const ease = {
    lin: t => t,
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; }
  };
  function run(ms, fn, ez) {
    return new Promise(res => {
      list.push({ t: 0, ms: Math.max(1, ms), fn, ez: ease[ez || 'io'] || ease.io, res });
    });
  }
  function update(dt) {
    for (let i = list.length - 1; i >= 0; i--) {
      const a = list[i];
      a.t += dt * 1000;
      const k = Math.min(1, a.t / a.ms);
      try { a.fn(a.ez(k), k); } catch (e) { console.error(e); }
      if (k >= 1) { list.splice(i, 1); a.res(); }
    }
  }
  function clear() { list.length = 0; }
  return { run, update, clear, ease };
})();
