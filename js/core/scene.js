/* Scene manager + main loop. A scene = { enter(args), exit(), update(t,dt) }. */
HC.scenes = (function () {
  const reg = {}; let cur = null, curName = '', last = 0, running = false;
  function register(name, s) { reg[name] = s; }
  function go(name, args) {
    if (cur && cur.exit) { try { cur.exit(); } catch (e) { console.error(e); } }
    HC.tween.clear();
    HC.stage.clearRoot();
    curName = name; cur = reg[name];
    if (!cur) throw new Error('no scene ' + name);
    cur.enter(args);
  }
  function loop(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
    HC.tween.update(dt);
    if (cur && cur.update) { try { cur.update(HC.stage.t, dt); } catch (e) { console.error(e); } }
    HC.stage.render(dt);
    requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; requestAnimationFrame(loop); }
  return { register, go, start, get name() { return curName; }, get current() { return cur; } };
})();
