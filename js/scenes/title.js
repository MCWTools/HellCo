/* Title / name entry. First launch asks for a name; Enter -> flame wipe -> cutscene. */
HC.scenes.register('title', (function () {
  let boss, t0 = 0;
  function langButtons() {
    const d = HC.el('div', 'langs');
    ['en', 'vi'].forEach(l => { const b = HC.el('button', 'tab' + (HC.i18n.lang === l ? ' on' : ''), l.toUpperCase()); b.onclick = () => { HC.i18n.set(l); draw(); }; d.appendChild(b); });
    return d;
  }
  function draw() {
    const s = HC.store.get(), scr = document.getElementById('screen');
    scr.className = 'solid'; scr.style.background = 'rgba(5,2,3,.62)'; scr.innerHTML = '';
    scr.appendChild(langButtons());
    const t = HC.el('div', 'title');
    const known = !!s.name;
    t.innerHTML = '<h1 class="flame">' + HC.esc(HC.CONFIG.name.toUpperCase()) + '</h1><div class="tag">' + HC.t('tagline') + '</div>';
    const st = HC.el('div', 'stack'); t.appendChild(st);
    if (!known) {
      const lb = HC.el('div', '', HC.t('ask_name')); st.appendChild(lb);
      const inp = HC.el('input'); inp.id = 'nameIn'; inp.maxLength = 18; inp.autocomplete = 'off'; inp.spellcheck = false; inp.placeholder = HC.t('name_ph'); st.appendChild(inp);
      const go = HC.el('button', 'btn gold', HC.t('ok_enter')); st.appendChild(go);
      const submit = () => { const v = inp.value.trim(); if (!v) { inp.focus(); inp.style.borderColor = '#ff4a4a'; return; } start(v); };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      go.onclick = submit;
      setTimeout(() => inp.focus(), 100);
    } else {
      st.appendChild(HC.el('div', '', HC.t('welcome_back', { name: HC.esc(s.name) })));
      const c = HC.el('button', 'btn gold', HC.t('btn_continue')); c.onclick = () => proceed();
      const n = HC.el('button', 'btn', HC.t('btn_new')); let armed = false;
      n.onclick = () => { if (!armed) { armed = true; n.textContent = HC.t('set_reset_sure'); setTimeout(() => { armed = false; n.textContent = HC.t('btn_new'); }, 3500); } else { const lang = s.lang; HC.store.reset(); HC.store.get().lang = lang; HC.store.save(); draw(); } };
      st.appendChild(c); st.appendChild(n);
    }
    const fsb = HC.el('button', 'mini', HC.t('set_fs_btn')); fsb.onclick = () => HC.fullscreen(); st.appendChild(fsb);
    scr.appendChild(t);
  }
  function start(name) {
    const s = HC.store.get(); s.name = name; HC.store.save(); HC.audio.unlock(); HC.audio.click();
    proceed();
  }
  function proceed() {
    HC.audio.unlock();
    HC.transition.run(async () => {
      const scr = document.getElementById('screen'); scr.className = 'hide'; scr.style.background = ''; scr.innerHTML = '';
      HC.scenes.go(HC.store.get().introDone ? 'office' : 'cutscene');
    });
  }
  return {
    enter() {
      HC.hud.show(false); document.getElementById('side').classList.add('hide');
      HC.office3d.build(); HC.office3d.setDecor(HC.store.get().upg);
      boss = HC.Character.build(HC.Character.BOSS_LOOK); boss.group.position.set(HC.office3d.SPOT.x, 0, HC.office3d.SPOT.z); HC.stage.root.add(boss.group);
      HC.stage.setCam({ x: 0, y: 1.9, z: 5.2, lx: -0.6, ly: 1.3 });
      draw();
    },
    exit() { const scr = document.getElementById('screen'); scr.style.background = ''; },
    update(t, dt) { boss.update(t, dt); HC.office3d.update(t, dt); HC.stage.setCam({ x: Math.sin(t * 0.15) * 0.8 }); }
  };
})());
