/* Seeded random + small utils. Every soul is rebuilt from one integer seed. */
(function () {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  HC.mix = function (seed, salt) {
    let h = (seed ^ Math.imul(salt | 0, 0x9E3779B1)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x85EBCA6B) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 0xC2B2AE35) >>> 0;
    return (h ^ (h >>> 16)) >>> 0;
  };
  HC.RNG = function (seed) {
    const f = mulberry32((seed >>> 0) || 1);
    const r = {
      seed: seed,
      next: f,
      range: (a, b) => a + (b - a) * f(),
      int: (a, b) => Math.floor(a + (b - a + 1) * f()),
      chance: p => f() < p,
      idx: arr => Math.floor(f() * arr.length),
      pick: arr => arr[Math.floor(f() * arr.length)],
      weighted(items, wf) {
        let tot = 0; for (const it of items) tot += wf(it);
        let x = f() * tot;
        for (const it of items) { x -= wf(it); if (x <= 0) return it; }
        return items[items.length - 1];
      },
      gauss() { return (f() + f() + f() + f() - 2) / 2; } // roughly -1..1, bell shaped
    };
    return r;
  };
  HC.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  HC.lerp = (a, b, t) => a + (b - a) * t;
  HC.cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  HC.$ = (sel, root) => (root || document).querySelector(sel);
  HC.el = function (tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  HC.sleep = ms => new Promise(r => setTimeout(r, ms));
  HC.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
})();
