/* Typewriter dialogue box. play(lines) -> Promise. line = {who, text} (who: 'boss' | 'me' | 'x:<key>' | null)
   Click / tap / Enter / Space advances. choose(options[]) -> Promise<index>. */
HC.dialogue = (function () {
  let box, whoE, txtE, choicesE, skipE, S = null;
  function els() { if (!box) { box = document.getElementById('dlg'); whoE = document.getElementById('dlgWho'); txtE = document.getElementById('dlgTxt'); choicesE = document.getElementById('dlgChoices'); skipE = document.getElementById('dlgSkip'); } }

  function whoName(w) {
    if (!w) return '';
    if (w === 'boss') return HC.t('who_boss');
    if (w === 'me') return HC.store.get().name || '???';
    if (w.indexOf('x:') === 0) return HC.t(w.slice(2));
    return w;
  }
  function line(who, key, vars) { return { who, text: HC.t(key, Object.assign({ name: HC.store.get().name }, vars || {})) }; }

  function typeLine() {
    const L = S.lines[S.i];
    whoE.textContent = whoName(L.who);
    S.full = L.text; S.pos = 0; S.typing = true; txtE.textContent = '';
    const step = () => {
      if (!S || S.typing === false) return;
      S.pos += 1; txtE.textContent = S.full.slice(0, S.pos);
      if (S.pos % 2 === 0) HC.audio.blip(S.pos);
      if (S.pos >= S.full.length) { S.typing = false; return; }
      S.timer = setTimeout(step, 1000 / HC.CONFIG.textSpeed);
    };
    clearTimeout(S.timer); step();
  }
  function advance() {
    if (!S || S.choosing) return;
    HC.audio.unlock();
    if (S.typing) { S.typing = false; clearTimeout(S.timer); txtE.textContent = S.full; return; }
    S.i++;
    if (S.i >= S.lines.length) return finish();
    typeLine();
  }
  function finish() {
    const r = S.res; clearTimeout(S.timer); S = null;
    box.classList.add('hide'); box.classList.remove('cine'); r();
  }
  function play(lines, opts) {
    els(); opts = opts || {};
    return new Promise(res => {
      if (!lines || !lines.length) return res();
      S = { lines, i: 0, res, typing: false, choosing: false };
      box.classList.remove('hide'); box.classList.toggle('cine', !!opts.cine);
      choicesE.innerHTML = ''; box.classList.remove('hasChoices');
      skipE.classList.toggle('hide', opts.noSkip === true);
      typeLine();
    });
  }
  function choose(options) {
    els();
    return new Promise(res => {
      S.choosing = true; box.classList.add('hasChoices'); choicesE.innerHTML = '';
      options.forEach((o, i) => {
        const b = HC.el('button', 'btn', HC.esc(o)); b.onclick = e => { e.stopPropagation(); HC.audio.click(); S.choosing = false; choicesE.innerHTML = ''; box.classList.remove('hasChoices'); res(i); };
        choicesE.appendChild(b);
      });
    });
  }
  // show a line, then wait for a choice, then continue with the same dialogue
  function ask(text, who, options) {
    els();
    return new Promise(res => {
      S = { lines: [{ who, text }], i: 0, res: () => { }, typing: false, choosing: false };
      box.classList.remove('hide'); skipE.classList.add('hide'); typeLine();
      const wait = () => { if (S && S.typing) return setTimeout(wait, 60); choose(options).then(i => { S = null; box.classList.add('hide'); res(i); }); };
      wait();
    });
  }
  function active() { return !!S; }
  function init() {
    els();
    box.addEventListener('click', advance);
    skipE.addEventListener('click', e => { e.stopPropagation(); if (S && !S.choosing) { S.i = S.lines.length; finish(); } });
    document.addEventListener('keydown', e => { if (S && !S.choosing && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); advance(); } });
  }
  return { init, play, choose, ask, line, active, whoName };
})();
