/* The CEO door opens. Three endings, then free play or a new cycle (codex + upgrades are kept). */
HC.scenes.register('ending', (function () {
  let bossRig;
  async function run() {
    const D = HC.dialogue, L = D.line;
    HC.office3d.door.intensity = 3; HC.audio.rank();
    await D.play([L(null, 'en_1'), L(null, 'en_2'), L('boss', 'en_3'), L('boss', 'en_4'), L('me', 'en_5'), L('boss', 'en_6'), L('boss', 'en_7')]);
    const pick = await D.ask(HC.t('en_q'), 'boss', [HC.t('en_c1'), HC.t('en_c2'), HC.t('en_c3')]);
    const id = ['chair', 'quit', 'coup'][pick];
    const s = HC.store.get(); s.ending = id; s.endingSeen = true; HC.store.save();
    await D.play([1, 2, 3, 4].map(n => L(n === 4 ? null : (id === 'quit' && n === 2 ? 'boss' : 'me'), 'en_' + id + '_' + n)));
    await D.play([L(null, 'en_end')], { cine: true });
    HC.ach.check();
    const next = await D.ask(HC.t('en_next'), null, [HC.t('en_free'), HC.t('en_new')]);
    if (next === 1) HC.store.newCycle();
    HC.transition.run(async () => HC.scenes.go('office'));
  }
  return {
    enter() {
      HC.hud.show(false); document.getElementById('side').classList.add('hide');
      HC.office3d.build();
      bossRig = HC.Character.build(HC.Character.BOSS_LOOK); bossRig.group.position.set(-0.8, 0, 0.9); HC.stage.root.add(bossRig.group);
      HC.stage.setCam({ x: 0, y: 1.5, z: 4.6, lx: 1.0, ly: 1.5, lz: -6 });
      HC.tween.run(2500, e => HC.stage.setCam({ lx: HC.lerp(1.0, 0.5, e) }), 'io');
      run();
    },
    update(t, dt) { bossRig.update(t, dt); HC.office3d.update(t, dt); }
  };
})());
