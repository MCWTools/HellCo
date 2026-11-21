/* Death files: pick a family, fill slots, optionally add a forensic note. Stored as a small spec. */
HC.gen.death = (function () {
  const L = HC.data.deathLex, F = HC.data.deathFamilies;

  function make(r, ctx) {
    const fam = r.weighted(F, f => f.w);
    const ti = r.idx(fam.tpl);
    const t = fam.tpl[ti];
    const spec = { f: fam.id, t: ti, p: [] };
    if (t.job) spec.j = ctx.jobIdx;
    else if (t.fixed) {
      const pool = L.fixed.map((x, i) => [x, i]).filter(x => !x[0].g || x[0].g === ctx.gender);
      spec.x = r.pick(pool)[1];
    } else {
      const used = [];
      t.s.forEach(name => {
        let i = r.idx(L[name]), guard = 0;
        if (t.uniq) while (used.indexOf(i) >= 0 && guard++ < 20) i = r.idx(L[name]);
        used.push(i); spec.p.push(i);
      });
      if (t.num) spec.n = r.int(t.num[0], t.num[1]);
    }
    if (r.chance(0.42)) spec.note = [r.idx(L.notePre), r.idx(L.note)];
    return spec;
  }

  function render(spec, lang) {
    lang = lang || HC.i18n.lang;
    const li = lang === 'vi' ? 1 : 0;
    let body;
    if (spec.f === 'fixed') body = spec.text[li];
    else {
      const fam = F.find(f => f.id === spec.f); const t = fam.tpl[spec.t];
      body = t[lang === 'vi' ? 'vi' : 'en'];
      if (t.job) body = HC.data.jobs[spec.j].death[li];
      else if (t.fixed) body = L.fixed[spec.x].t[li];
      else {
        t.s.forEach((name, i) => { body = body.replace('{' + i + '}', L[name][spec.p[i]][li]); });
        if (t.num) body = body.replace('{n}', spec.n);
      }
    }
    return body;
  }
  function note(spec, lang) {
    if (!spec.note) return '';
    const li = (lang || HC.i18n.lang) === 'vi' ? 1 : 0;
    return L.notePre[spec.note[0]][li] + ': ' + L.note[spec.note[1]][li];
  }
  function family(spec) { return spec.f; }
  return { make, render, note, family };
})();
