/* A soul = one integer seed (+ optional hand-written special). */
HC.gen.soul = (function () {
  const A = () => HC.gen.alignment;

  function normal(seed) {
    const id = HC.gen.identity.make(HC.mix(seed, 1));
    const look = HC.gen.appearance(HC.mix(seed, 2), id.gender, id.age);
    const death = HC.gen.death.make(HC.RNG(HC.mix(seed, 3)), { gender: id.gender, jobIdx: id.jobIdx });
    const led = A().make(HC.RNG(HC.mix(seed, 4)));
    return Object.assign({ seed, special: null, look, death, kind: 'human', job: HC.data.jobs[id.jobIdx].job }, id, led);
  }

  function special(sp, seed) {
    const look = HC.gen.appearance(HC.mix(seed, 2), sp.gender, sp.age, sp.look);
    if (sp.look && sp.look.heightMul) look.heightMul = sp.look.heightMul;
    const led = A().finish(sp.merits, sp.sins, 'special');
    return Object.assign({
      seed, special: sp.id, look, kind: sp.kind, gender: sp.gender, countryId: sp.country, name: sp.name,
      age: sp.age, job: sp.job, death: { f: 'fixed', text: sp.death }
    }, led);
  }

  // pick the next soul: a pending special if due, otherwise a procedural one
  function next(queuedIds) {
    const st = HC.store.get();
    const seed = (st.seedCounter++ * 7919 + 1337) >>> 0;
    const due = HC.data.specials.find(sp => st.seedCounter >= sp.minGen && !st.codex.specials[sp.id] && queuedIds.indexOf(sp.id) < 0);
    HC.store.save();
    return due ? special(due, seed) : normal(seed);
  }
  return { next, normal, special };
})();
