/* Soul file (right panel) + the verdict buttons. */
HC.dossier = (function () {
  let soul = null, handler = null, enabled = true;
  const VERDICTS = [['up', 'v_up'], ['f3', 'v_f3'], ['f6', 'v_f6'], ['f9', 'v_f9'], ['hire', 'v_hire']];
  const $ = id => document.getElementById(id);

  function render(s) {
    if (s !== undefined) soul = s;
    const box = $('dossier'); if (!soul) { box.innerHTML = ''; return; }
    const calc = HC.shop.lv('calc'), c = HC.gen.identity.country(soul.countryId);
    const lang = HC.i18n.lang, I = HC.i18n;
    const fileNo = String(soul.seed % 100000).padStart(5, '0');
    const li = x => '<li class="' + x.cls + '">' + HC.esc(I.pair(x.t)) + (calc >= 1 ? ' <b>(' + x.pts + ')</b>' : '') + '</li>';
    const merits = soul.merits.map(x => li({ t: x.t, pts: x.pts, cls: 'm' })).join('') || '<li style="list-style:none;color:#b89a86">' + HC.t('d_none') + '</li>';
    const sins = soul.sins.map(x => li({ t: x.t, pts: x.pts, cls: 's' })).join('') || '<li style="list-style:none;color:#b89a86">' + HC.t('d_none') + '</li>';
    const note = HC.gen.death.note(soul.death, lang);
    const bar = (cls, lbl, v) => '<div class="bar"><span class="lb">' + HC.t(lbl) + '</span><div class="tr"><div class="fl ' + cls + '" style="width:' + v + '%"></div></div><span class="nm">' + (calc >= 1 ? v : '') + '</span></div>';
    let hint = '';
    if (calc >= 2) hint = '<div class="hintline">🧮 ' + HC.t('d_hint', { v: HC.t(VERDICTS.find(x => x[0] === soul.ideal)[1]) }) + '</div>';
    box.innerHTML =
      '<div class="d-top"><span>' + HC.t('d_file') + ' #' + fileNo + '</span><span>' + HC.t('d_deceased') + '</span></div>' +
      '<div class="d-name">' + HC.esc(soul.name) + '</div>' +
      '<div class="d-meta">' + HC.t('d_age', { n: soul.age }) + ' · ' + HC.esc(I.lang === 'vi' ? c.vi : c.en) + ' · ' + HC.esc(I.pair(soul.job)) + '</div>' +
      '<div class="d-sec"><h4>' + HC.t('d_death') + '</h4><p>' + HC.esc(HC.gen.death.render(soul.death, lang)) + '</p>' + (note ? '<p class="note">' + HC.esc(note) + '</p>' : '') + '</div>' +
      '<div class="d-sec"><h4>' + HC.t('d_scale') + '</h4>' + bar('g', 'd_good', soul.good) + bar('e', 'd_evil', soul.evil) + '</div>' +
      '<div class="d-sec"><h4>' + HC.t('d_merits') + '</h4><ul>' + merits + '</ul></div>' +
      '<div class="d-sec"><h4>' + HC.t('d_sins') + '</h4><ul>' + sins + '</ul></div>' + hint;
    box.scrollTop = 0;
    buildActions();
  }
  function buildActions() {
    const a = $('actions'); a.innerHTML = '';
    const rec = soul && HC.shop.lv('calc') >= 2 ? soul.ideal : null;
    VERDICTS.forEach((v, i) => {
      const b = HC.el('button', 'btn ' + v[0] + (rec === v[0] ? ' rec' : ''), HC.esc(HC.t(v[1])) + '<small>[' + (i + 1) + ']</small>');
      b.disabled = !enabled || !soul;
      b.onclick = () => pick(v[0]);
      a.appendChild(b);
    });
  }
  function pick(v) { if (!enabled || !soul || !handler) return; HC.audio.click(); handler(v); }
  function setEnabled(b) { enabled = b; buildActions(); }
  function onPick(h) { handler = h; }
  function key(e) {
    if (!enabled || HC.panels.isOpen() || HC.dialogue.active()) return;
    const i = ['1', '2', '3', '4', '5'].indexOf(e.key);
    if (i >= 0) pick(VERDICTS[i][0]);
  }
  function init() { document.addEventListener('keydown', key); HC.bus.on('lang', () => render()); }
  return { init, render, setEnabled, onPick, get soul() { return soul; } };
})();
