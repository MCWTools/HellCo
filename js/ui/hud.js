/* Top bar. */
HC.hud = (function () {
  const $ = id => document.getElementById(id);
  function show(b) { $('hud').classList.toggle('hide', !b); }
  function update() {
    const s = HC.store.get(), G = HC.game;
    $('hDay').textContent = HC.t('hud_day', { n: s.day });
    $('hQuota').textContent = HC.t('hud_quota', { a: s.doneToday, b: G.quota() });
    $('hEvent').textContent = (s.event && s.event !== 'normal') ? HC.t('ev_' + s.event) : '';
    $('hRank').textContent = G.rankName(s.rank) + (s.streak >= 2 ? '  🔥' + s.streak : '');
    const nk = G.nextKpi(), fk = G.floorKpi();
    const pct = nk == null ? 100 : HC.clamp((s.kpi - fk) / (nk - fk) * 100, 0, 100);
    $('hKpiFill').style.width = pct + '%';
    $('hKpiTxt').textContent = nk == null ? 'KPI ' + s.kpi : 'KPI ' + s.kpi + ' / ' + nk;
    $('hXu').textContent = '🪙 ' + s.xu;
  }
  function init() {
    $('bCodex').onclick = () => { HC.audio.click(); HC.panels.codex(); };
    $('bShop').onclick = () => { HC.audio.click(); HC.panels.shop(); };
    $('bSet').onclick = () => { HC.audio.click(); HC.panels.settings(); };
    HC.bus.on('state', update); HC.bus.on('upgrade', update); HC.bus.on('lang', update);
  }
  return { init, show, update };
})();
