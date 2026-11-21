/* The game: souls queue up, you read the file, you stamp. */
HC.scenes.register('office', (function () {
  const OF = () => HC.office3d;
  const QN = 5;
  let queue = [], front = null, busy = true, bubbleT = 0, walkers = [];

  function queuedIds() { return queue.map(q => q.soul.special).filter(Boolean); }
  function makeRig(soul) {
    const rig = soul.kind === 'ant' ? HC.Character.buildAnt({ scale: 1.1 }) : HC.Character.build(soul.look);
    rig.group.rotation.y = 0.35; HC.stage.root.add(rig.group); return rig;
  }
  function spawn(slot) {
    const soul = HC.gen.soul.next(queuedIds());
    const rig = makeRig(soul), p = OF().pos(slot);
    rig.group.position.set(p.x, 0, p.z);
    return { soul, rig };
  }
  function bubble(who, text, detail) {
    const b = document.getElementById('bubble');
    b.innerHTML = '<div class="bw">' + HC.esc(who) + '</div>' + HC.esc(text) + (detail ? '<div class="bd">' + HC.esc(detail) + '</div>' : '');
    b.classList.remove('hide'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.add('hide'), 3600);
  }
  function stampPop(v, outcome) {
    const e = document.getElementById('stampPop');
    e.textContent = HC.t('v_' + v).toUpperCase();
    const col = outcome === 'perfect' ? '#5fd36a' : outcome === 'near' ? '#f0c020' : '#ff4a4a';
    e.style.color = col; e.style.borderColor = col; e.classList.remove('hide');
    e.style.animation = 'none'; void e.offsetWidth; e.style.animation = '';
    setTimeout(() => e.classList.add('hide'), 1100);
  }
  function feedback(res, soul) {
    const sin = soul.sins.length ? HC.i18n.pair(soul.sins.slice().sort((a, b) => b.pts - a.pts)[0].t) : HC.t('fb_nothing');
    const n = res.outcome === 'perfect' ? 5 : res.outcome === 'near' ? 3 : 5;
    const k = 'fb_' + res.outcome + '_' + (1 + Math.floor(Math.random() * n));
    const detail = (res.kpi >= 0 ? '+' : '') + res.kpi + ' KPI   ' + (res.xu ? '+' + res.xu + ' Xu' : '') + (res.streak >= 3 ? '   🔥' + res.streak : '');
    bubble(HC.t('who_boss'), HC.t(k, { name: soul.name, sin: sin, right: HC.t('v_' + res.ideal) }), detail);
  }

  /* ---- animations ---- */
  function walkTo(rig, p, ms) {
    const x0 = rig.group.position.x, z0 = rig.group.position.z; rig.setWalking(true);
    const dx = p.x - x0, dz = p.z - z0; if (Math.abs(dx) + Math.abs(dz) > 0.01) rig.group.rotation.y = Math.atan2(dx, dz) * 0.35 + 0.2;
    return HC.tween.run(ms || 800, e => { rig.group.position.x = x0 + dx * e; rig.group.position.z = z0 + dz * e; }, 'io').then(() => { rig.setWalking(false); rig.group.rotation.y = 0.35; });
  }
  function exitSoul(q, v) {
    const g = q.rig.group, p = g.position, y0 = p.y, sc = g.scale.x;
    if (v === 'up') {
      HC.audio.rise();
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 5, 12), new THREE.MeshBasicMaterial({ color: 0xffe680 })); halo.rotation.x = Math.PI / 2; halo.position.y = q.rig.height + 0.25; halo.userData.ownMat = true; g.add(halo);
      return HC.tween.run(1500, e => { p.y = y0 + e * 7; g.rotation.y = 0.35 + e * 9; g.scale.setScalar(sc * (1 - e * 0.6)); }, 'in');
    }
    if (v === 'hire') {
      return walkTo(q.rig, OF().staffTarget(Math.min(HC.store.get().staff.length - 1, 11)), 1100);
    }
    HC.audio.fall(); OF().flash(0xff2200, v === 'f9' ? 6 : v === 'f6' ? 4 : 3); HC.stage.addShake(v === 'f9' ? 1.4 : v === 'f6' ? 0.9 : 0.5);
    return HC.tween.run(900, e => { p.y = y0 - e * 3.4; g.scale.setScalar(sc * (1 - e * 0.35)); q.rig.mood = 1; }, 'in');
  }

  async function advanceQueue() {
    queue.shift();
    const tail = spawn(QN - 1); queue.push(tail);
    const base = tail.rig.group.scale.x; tail.rig.group.scale.setScalar(0.01);
    HC.tween.run(450, e => tail.rig.group.scale.setScalar(Math.max(0.01, e) * base), 'out');
    await Promise.all(queue.slice(0, -1).map((q, i) => walkTo(q.rig, OF().pos(i), 800)));
  }

  async function present() {
    front = queue[0];
    HC.dossier.render(front.soul);
    busy = false; HC.dossier.setEnabled(true);
  }

  async function onVerdict(v) {
    if (busy) return; busy = true; HC.dossier.setEnabled(false);
    const q = queue[0], soul = q.soul;
    await OF().stamp();
    const res = HC.game.judge(soul, v);
    (res.outcome === 'perfect' ? HC.audio.good : res.outcome === 'near' ? HC.audio.near : HC.audio.bad)();
    stampPop(v, res.outcome); feedback(res, soul); HC.hud.update();
    await exitSoul(q, v);
    HC.stage.root.remove(q.rig.group); HC.dispose(q.rig.group);
    if (res.hired) OF().setStaff(HC.game.staffSouls());
    // announcements
    res.lore.forEach(id => HC.toast(HC.t('toast_lore'), 'lore'));
    res.ach.forEach(id => HC.toast('🏆 ' + HC.t('ach_' + id), ''));
    for (const r of res.rankUp) {
      HC.audio.rank(); HC.toast(HC.t('toast_rank', { r: HC.game.rankName(r) }), 'rank');
      await HC.sleep(600);
      await HC.dialogue.play([HC.dialogue.line('boss', 'rk_' + r, { rank: HC.game.rankName(r) })]);
    }
    if (res.lore.length && soul.special) {
      const l = HC.data.lore.find(x => x.special === soul.special);
      if (l) await HC.dialogue.play([{ who: null, text: HC.i18n.pair(l.t) }]);
    }
    if (soul.special) await HC.dialogue.play([HC.dialogue.line('boss', 'sp_' + soul.special + '_out')]);
    if (res.ending) { HC.transition.run(async () => HC.scenes.go('ending')); return; }
    if (res.dayDone) {
      await HC.sleep(400);
      const sum = HC.game.endDay();
      await HC.panels.summary(sum); HC.hud.update(); announceDay(true);
    }
    await advanceQueue();
    await present();
    if (queue[0].soul.special) HC.dialogue.play([HC.dialogue.line('boss', 'sp_' + queue[0].soul.special + '_in')]);
  }

  function announceDay(force) {
    const s = HC.store.get();
    if (s.event && s.event !== 'normal') HC.toast(HC.t('ev_' + s.event + '_d'), '');
  }

  async function tutorial() {
    const L = HC.dialogue.line;
    await HC.dialogue.play([L('boss', 'tut_1'), L('boss', 'tut_2'), L('boss', 'tut_3')]);
  }

  return {
    enter(args) {
      const s = HC.store.get();
      HC.dossier.onPick(onVerdict);
      OF().build(); OF().setDecor(s.upg); OF().setStaff(HC.game.staffSouls());
      HC.stage.setCam({ x: 0, y: 2.05, z: 5.7, lx: 0, ly: 1.0, lz: 0 });
      if (!s.event) HC.game.newEvent();
      queue = []; busy = true;
      for (let i = 0; i < QN; i++) queue.push(spawn(i));
      document.getElementById('side').classList.remove('hide'); HC.hud.show(true); HC.hud.update();
      HC.dossier.render(null); HC.dossier.setEnabled(false);
      HC.bus.on('upgrade', this._up = () => { OF().setDecor(HC.store.get().upg); HC.dossier.render(); });
      const front0 = queue[0].rig; front0.group.position.x -= 2.5; front0.group.position.z -= 1.5;
      const p = OF().pos(0);
      (async () => {
        await HC.sleep(250);
        announceDay();
        await walkTo(front0, p, 1000);
        if (args && args.first || (HC.store.get().total === 0 && !HC.store.get().tutorialDone)) { HC.store.get().tutorialDone = true; HC.store.save(); await tutorial(); }
        await present();
        if (queue[0].soul.special) HC.dialogue.play([HC.dialogue.line('boss', 'sp_' + queue[0].soul.special + '_in')]);
      })();
    },
    exit() { HC.bus.off('upgrade', this._up); document.getElementById('side').classList.add('hide'); HC.hud.show(false); document.getElementById('bubble').classList.add('hide'); },
    update(t, dt) {
      OF().update(t, dt);
      queue.forEach(q => q.rig.update(t, dt));
    }
  };
})());
