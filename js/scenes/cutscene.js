/* Intro cutscene: death report -> wake up under the Boss -> briefing -> flame wipe -> office. */
HC.scenes.register('cutscene', (function () {
  let boss, bossRig;
  const D = () => HC.dialogue;

  async function run() {
    const scr = document.getElementById('screen');
    // 1) black screen: the death report
    scr.className = 'black'; scr.innerHTML = '';
    const lines = ['cs_report', 'cs_name', 'cs_cause', 'cs_note', 'cs_status'].map(k => D().line(null, k));
    await D().play(lines, { cine: true });
    await HC.sleep(300);
    // 2) wake up: camera lies on the floor, boss looms over us
    HC.stage.setCam({ x: 0.3, y: 0.35, z: 3.2, lx: -1.0, ly: 2.0, lz: 0 });
    scr.className = 'hide'; scr.innerHTML = '';
    HC.audio.rise();
    await D().play([D().line('boss', 'cs_b1')]);
    await HC.tween.run(1600, (e) => HC.stage.setCam({ y: HC.lerp(0.35, 2.05, e), z: HC.lerp(3.2, 5.7, e), x: HC.lerp(0.3, 0, e), lx: HC.lerp(-1.0, -0.2, e), ly: HC.lerp(2.0, 1.2, e) }), 'io');
    const L = (w, k) => D().line(w, k);
    await D().play([
      L('me', 'cs_m1'), L('boss', 'cs_b2'), L('boss', 'cs_b3'), L('boss', 'cs_b4'), L('me', 'cs_m2'), L('boss', 'cs_b5'),
      L('boss', 'cs_b6'), L('me', 'cs_m3'), L('boss', 'cs_b7'), L('boss', 'cs_b8'), L('boss', 'cs_b9'), L('me', 'cs_m4'),
      L('boss', 'cs_b10'), L('boss', 'cs_b11')
    ]);
    const s = HC.store.get(); s.introDone = true; HC.store.save();
    HC.transition.run(async () => { HC.scenes.go('office', { first: true }); });
  }

  return {
    enter() {
      HC.hud.show(false); document.getElementById('side').classList.add('hide');
      HC.office3d.build();
      bossRig = HC.Character.build(HC.Character.BOSS_LOOK);
      bossRig.group.position.set(-0.4, 0, 1.1); HC.stage.root.add(bossRig.group);
      HC.stage.setCam({ x: 0, y: 0.35, z: 3.2, lx: -1, ly: 2 });
      run();
    },
    update(t, dt) { bossRig.update(t, dt); HC.office3d.update(t, dt); }
  };
})());
