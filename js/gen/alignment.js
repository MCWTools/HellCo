/* Good / Evil are two separate bars. A soul can be both. Verdict = what the paperwork *should* say. */
HC.gen.alignment = (function () {
  const ARCH = [
    { id: 'saint', w: 12, m: [3, 4], s: [0, 1] },
    { id: 'decent', w: 22, m: [2, 3], s: [0, 2] },
    { id: 'bland', w: 18, m: [1, 2], s: [1, 2] },
    { id: 'mixed', w: 16, m: [2, 3], s: [2, 3] },
    { id: 'rotten', w: 16, m: [0, 1], s: [3, 4] },
    { id: 'monster', w: 9, m: [0, 0], s: [4, 5] },
    { id: 'dual', w: 7, m: [4, 4], s: [4, 4], top: true }
  ];
  const recent = [];
  function pickN(r, list, n, top) {
    let src = top ? list.slice().sort((a, b) => b.pts - a.pts).slice(0, 24) : list.slice();
    const fresh = src.filter(x => recent.indexOf(x) < 0);
    if (fresh.length >= n) src = fresh;
    const out = [];
    while (out.length < n && src.length) { const x = src.splice(r.idx(src), 1)[0]; out.push(x); recent.push(x); }
    while (recent.length > 70) recent.shift();
    return out;
  }
  function sum(l) { return Math.min(100, l.reduce((a, x) => a + x.pts, 0)); }
  // Rule (shown to the player): net = Evil - Good. hire if both >= 55.
  function verdictFor(good, evil) {
    if (good >= 55 && evil >= 55) return 'hire';
    const s = evil - good;
    if (s <= 0) return 'up';
    if (s <= 15) return 'f3';
    if (s <= 35) return 'f6';
    return 'f9';
  }
  function make(r) {
    const a = r.weighted(ARCH, x => x.w);
    const merits = pickN(r, HC.data.merits, r.int(a.m[0], a.m[1]), a.top);
    const sins = pickN(r, HC.data.sins, r.int(a.s[0], a.s[1]), a.top);
    return finish(merits, sins, a.id);
  }
  function finish(merits, sins, arch) {
    const good = sum(merits), evil = sum(sins);
    return { merits, sins, good, evil, ideal: verdictFor(good, evil), arch };
  }
  // order used to measure how far a wrong stamp is from the right one
  const ORDER = { up: 0, f3: 1, f6: 2, f9: 3 };
  function distance(ideal, chosen) {
    if (ideal === chosen) return 0;
    if (ideal === 'hire' || chosen === 'hire') return 2;
    return Math.abs(ORDER[ideal] - ORDER[chosen]);
  }
  return { make, finish, verdictFor, distance };
})();
