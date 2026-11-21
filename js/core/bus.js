/* Tiny event bus */
HC.bus = (function () {
  const m = {};
  return {
    on(e, f) { (m[e] = m[e] || []).push(f); },
    off(e, f) { m[e] = (m[e] || []).filter(x => x !== f); },
    emit(e, a, b) { (m[e] || []).slice().forEach(f => { try { f(a, b); } catch (err) { console.error(err); } }); }
  };
})();
