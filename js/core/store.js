/* Save data in localStorage (forever, until the player resets). */
HC.store = (function () {
  function defaults() {
    return {
      v: 1,
      name: '',
      lang: '',
      introDone: false,
      cycle: 1,            // intern number is 666012 + cycle
      kpi: 0,
      rank: 0,
      xu: 0,
      day: 1,
      doneToday: 0,        // souls judged today
      todayStats: { ok: 0, near: 0, bad: 0, xu: 0, kpi: 0 },
      streak: 0,
      seedCounter: 0,
      total: 0,            // souls judged, ever
      stats: { perfect: 0, near: 0, wrong: 0, bestStreak: 0, hired: 0, xuEarned: 0, wrongRow: 0 },
      upg: {},             // upgrade levels
      staff: [],           // seeds of hired souls (shown standing in the office)
      codex: { families: {}, specials: {}, lore: {}, log: [] },
      ach: {},
      ending: null,
      endingSeen: false,
      settings: { sound: true },
      event: null          // today's event id
    };
  }
  let state = null;
  let mem = null;
  function raw(get, val) {
    try {
      if (get) return window.localStorage.getItem(HC.CONFIG.saveKey);
      if (val === null) window.localStorage.removeItem(HC.CONFIG.saveKey);
      else window.localStorage.setItem(HC.CONFIG.saveKey, val);
    } catch (e) { if (get) return mem; mem = val; }
  }
  function merge(base, src) {
    for (const k in src) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && src[k] && typeof src[k] === 'object') merge(base[k], src[k]);
      else base[k] = src[k];
    }
    return base;
  }
  return {
    load() {
      state = defaults();
      try { const s = raw(true); if (s) merge(state, JSON.parse(s)); } catch (e) { console.warn('save corrupted, starting fresh'); }
      return state;
    },
    get() { return state || this.load(); },
    save() { try { raw(false, JSON.stringify(state)); } catch (e) { } },
    reset() { raw(false, null); state = defaults(); },
    newCycle() { // keep codex, achievements, upgrades; restart the career
      const s = state;
      const keep = { codex: s.codex, ach: s.ach, upg: s.upg, settings: s.settings, lang: s.lang, name: s.name, cycle: s.cycle + 1, stats: s.stats, seedCounter: s.seedCounter, total: s.total };
      state = merge(defaults(), keep);
      state.introDone = true;
      this.save();
    }
  };
})();
