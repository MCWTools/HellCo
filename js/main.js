/* Boot */
(function () {
  function boot() {
    HC.store.load();
    HC.i18n.init();
    document.title = HC.CONFIG.name;
    HC.stage.init(document.getElementById('gl'));
    HC.dialogue.init(); HC.hud.init(); HC.dossier.init(); HC.panels.init();
    document.addEventListener('pointerdown', () => HC.audio.unlock(), { once: true });
    window.addEventListener('keydown', e => { if (e.key === 'f' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') HC.fullscreen(); });
    HC.scenes.start();
    HC.scenes.go('title');
    if (window.HC_TEST) HC_TEST();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
