/* Flame-curtain wipe. run(mid) covers the screen, awaits mid(), then uncovers. */
HC.transition = (function () {
  const fx = () => document.getElementById('fx');
  async function run(mid, text) {
    const f = fx(), t = f.querySelector('.fxText');
    t.textContent = text === undefined ? HC.CONFIG.name.toUpperCase() : text;
    f.className = ''; void f.offsetWidth;
    HC.audio.whoosh();
    f.className = 'cover';
    await HC.sleep(560);
    if (mid) { try { await mid(); } catch (e) { console.error(e); } }
    await HC.sleep(250);
    f.className = 'leave';
    await HC.sleep(600);
    f.className = '';
  }
  return { run };
})();
