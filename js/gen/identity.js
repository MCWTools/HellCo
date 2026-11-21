/* Name, country, age, gender, job. */
HC.gen.identity = (function () {
  function makeName(c, g, r) {
    const D = HC.data;
    if (r.chance(0.05)) return r.pick(D.sillyNames);
    const pool = g === 'f' ? c.f : g === 'm' ? c.m : (r.chance(0.5) ? c.m : c.f);
    const first = r.pick(pool);
    let last = r.pick(c.last);
    if (r.chance(0.08)) last += '-' + r.pick(c.last);
    const mid = r.chance(0.15) ? ' ' + r.pick(D.middleInitials) + '.' : '';
    const nick = r.chance(0.10) ? ' “' + r.pick(D.nicknames) + '”' : '';
    const title = r.chance(0.05) ? r.pick(D.titles) + ' ' : '';
    if (c.id === 'vn') {
      const m = g === 'f' ? 'Thị' : g === 'm' ? 'Văn' : r.pick(['Minh', 'Ngọc']);
      return title + last + ' ' + (r.chance(0.6) ? m + ' ' : '') + first + nick;
    }
    if (c.order === 'lf') return title + last + ' ' + first + nick;
    return title + first + mid + ' ' + last + nick;
  }
  function make(seed) {
    const r = HC.RNG(seed);
    const g = r.weighted([['m', 45], ['f', 45], ['x', 10]], x => x[1])[0];
    const c = r.weighted(HC.data.countries, HC.data.countryWeight);
    const age = Math.round(HC.clamp(30 + r.gauss() * 38 + (r.chance(0.18) ? 30 : 0), 7, 96));
    const jobIdx = r.idx(HC.data.jobs);
    return { gender: g, countryId: c.id, name: makeName(c, g, r), age: age, jobIdx: jobIdx };
  }
  function country(id) { return HC.data.countries.find(c => c.id === id); }
  return { make, country, makeName };
})();
