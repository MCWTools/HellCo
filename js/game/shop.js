/* Upgrades bought with Xu. Names/descriptions come from lang files: shop_<id>, shop_<id>_d. */
HC.shop = (function () {
  const defs = [
    { id: 'stamp', max: 10, base: 25, mult: 1.55 },
    { id: 'chair', max: 10, base: 40, mult: 1.7 },
    { id: 'streak', max: 5, base: 60, mult: 1.8 },
    { id: 'calc', max: 2, base: 80, mult: 3.5 },
    { id: 'plant', max: 1, base: 50, mult: 1 },
    { id: 'lava', max: 1, base: 120, mult: 1 },
    { id: 'poster', max: 1, base: 200, mult: 1 },
    { id: 'coffee', max: 1, base: 300, mult: 1 }
  ];
  const lv = id => (HC.store.get().upg[id] || 0);
  function cost(d) { return Math.round(d.base * Math.pow(d.mult, lv(d.id))); }
  function buy(id) {
    const d = defs.find(x => x.id === id), st = HC.store.get();
    if (!d || lv(id) >= d.max || st.xu < cost(d)) return false;
    st.xu -= cost(d); st.upg[id] = lv(id) + 1; HC.store.save();
    HC.bus.emit('upgrade', id); return true;
  }
  return { defs, lv, cost, buy };
})();
