/* Core rules: judging a soul, KPI, ranks, quota, days. */
HC.game = (function () {
  const st = () => HC.store.get();
  const ranks = () => HC.data.ranks;

  function quota() { return HC.CONFIG.quotaBase + st().rank; }
  function xuMult() { return 1 + 0.1 * HC.shop.lv('stamp'); }
  function kpiMult() { return 1 + 0.08 * HC.shop.lv('chair'); }
  function streakCap() { return 10 + 5 * HC.shop.lv('streak'); }
  function rankName(i) { const r = ranks()[i]; return HC.i18n.lang === 'vi' ? r.vi : r.en; }
  function floorKpi() { return ranks()[st().rank].kpi; }
  function nextKpi() { const n = ranks()[st().rank + 1]; return n ? n.kpi : null; }
  function newEvent() { const s = st(); s.event = HC.RNG((s.day * 2654435761 + s.cycle) >>> 0).pick(HC.data.events); }

  function judge(soul, verdict) {
    const s = st(), res = { verdict, ideal: soul.ideal, rankUp: [], lore: [], ach: [], ending: false, hired: false };
    const d = HC.gen.alignment.distance(soul.ideal, verdict);
    res.outcome = d === 0 ? 'perfect' : (d === 1 ? 'near' : 'wrong');
    const ev = s.event || 'normal';
    let kpi = 0, xu = 0;
    if (res.outcome === 'perfect') {
      s.streak++; s.stats.perfect++; s.stats.wrongRow = 0; s.todayStats.ok++;
      kpi = Math.round((10 + Math.min(s.streak, streakCap())) * kpiMult() * (ev === 'double' ? 2 : 1));
      xu = Math.round((6 + s.staff.length) * xuMult() * (ev === 'coffee' ? 1.5 : 1)) + (ev === 'vip' ? 4 : 0);
    } else if (res.outcome === 'near') {
      s.streak = 0; s.stats.near++; s.stats.wrongRow = 0; s.todayStats.near++;
      kpi = Math.round(3 * kpiMult()); xu = 2;
    } else {
      s.streak = 0; s.stats.wrong++; s.stats.wrongRow++; s.todayStats.bad++;
      kpi = ev === 'audit' ? -15 : -5; xu = 0;
    }
    s.stats.bestStreak = Math.max(s.stats.bestStreak, s.streak);
    const before = s.kpi;
    s.kpi = Math.max(floorKpi(), s.kpi + kpi); kpi = s.kpi - before;
    s.xu += xu; s.stats.xuEarned += xu; s.todayStats.xu += xu; s.todayStats.kpi += kpi;
    s.total++; s.doneToday++;
    res.kpi = kpi; res.xu = xu; res.streak = s.streak;

    // hire
    if (verdict === 'hire' && soul.ideal === 'hire') {
      s.staff.push({ s: soul.seed, sp: soul.special || null }); if (s.staff.length > 12) s.staff.shift();
      s.stats.hired++; res.hired = true;
    }
    // codex
    const fam = soul.death.f === 'fixed' ? 'classic' : soul.death.f;
    s.codex.families[fam] = (s.codex.families[fam] || 0) + 1;
    s.codex.log.push({ n: soul.name, d: soul.death });
    if (s.codex.log.length > HC.CONFIG.logCap) s.codex.log.shift();
    if (soul.special) {
      s.codex.specials[soul.special] = true;
      HC.data.lore.filter(l => l.special === soul.special && !s.codex.lore[l.id]).forEach(l => { s.codex.lore[l.id] = true; res.lore.push(l.id); });
    }
    // ranks
    while (ranks()[s.rank + 1] && s.kpi >= ranks()[s.rank + 1].kpi) {
      s.rank++; res.rankUp.push(s.rank); s.xu += 50 * s.rank;
      HC.data.lore.filter(l => l.rank === s.rank && !s.codex.lore[l.id]).forEach(l => { s.codex.lore[l.id] = true; res.lore.push(l.id); });
    }
    if (s.rank >= ranks().length - 1 && !s.endingSeen) res.ending = true;
    res.dayDone = s.doneToday >= quota();
    res.ach = HC.ach.check();
    HC.store.save();
    HC.bus.emit('state');
    return res;
  }

  function endDay() {
    const s = st(), salary = ranks()[s.rank].salary + s.staff.length * 3;
    const sum = { day: s.day, stats: Object.assign({}, s.todayStats), salary, event: s.event };
    s.xu += salary; s.stats.xuEarned += salary;
    s.day++; s.doneToday = 0; s.todayStats = { ok: 0, near: 0, bad: 0, xu: 0, kpi: 0 }; s.streak = 0;
    newEvent(); HC.store.save(); HC.bus.emit('state');
    return sum;
  }

  // rebuild hired souls for the 3D staff row
  function staffSouls() {
    return st().staff.map(e => {
      if (e.sp) { const sp = HC.data.specials.find(x => x.id === e.sp); if (sp) return HC.gen.soul.special(sp, e.s); }
      return HC.gen.soul.normal(e.s);
    });
  }
  return { quota, xuMult, kpiMult, streakCap, rankName, floorKpi, nextKpi, newEvent, judge, endDay, staffSouls };
})();
