/* Achievements. Strings: ach_<id>, ach_<id>_d. Checked after every verdict. */
HC.ach = (function () {
  const defs = [
    { id: 'first', ok: s => s.total >= 1 },
    { id: 'ten', ok: s => s.total >= 10 },
    { id: 'hundred', ok: s => s.total >= 100 },
    { id: 'streak5', ok: s => s.stats.bestStreak >= 5 },
    { id: 'streak15', ok: s => s.stats.bestStreak >= 15 },
    { id: 'hire', ok: s => s.stats.hired >= 1 },
    { id: 'chaos', ok: s => s.stats.wrongRow >= 4 },
    { id: 'rich', ok: s => s.stats.xuEarned >= 1000 },
    { id: 'staff', ok: s => s.rank >= 1 },
    { id: 'boss', ok: s => s.rank >= 4 },
    { id: 'lore5', ok: s => Object.keys(s.codex.lore).length >= 5 },
    { id: 'deaths50', ok: s => s.codex.log.length >= 50 },
    { id: 'ceo', ok: s => s.endingSeen }
  ];
  function check() {
    const s = HC.store.get(), got = [];
    defs.forEach(d => { if (!s.ach[d.id] && d.ok(s)) { s.ach[d.id] = true; got.push(d.id); } });
    if (got.length) HC.store.save();
    return got;
  }
  return { defs, check };
})();
