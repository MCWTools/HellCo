/* Three.js stage: low-res canvas (PS1 crunch, cheap on phones), one root group per scene. */
HC.stage = (function () {
  let renderer, scene, camera, root, canvas, w = 640, h = 360, shake = 0, baseCam = { x: 0, y: 1.7, z: 4.4, lx: 0, ly: 1.15, lz: 0 };
  const clock = { t: 0 };

  function init(cv) {
    canvas = cv;
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(1);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07040a);
    camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 80);
    root = new THREE.Group(); scene.add(root);
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  }
  function resize() {
    const W = window.innerWidth || 640, H = window.innerHeight || 360;
    const ph = HC.CONFIG.pixelHeight;
    h = Math.min(ph, Math.max(180, H));
    w = Math.round(h * (W / H));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the same horizontal framing on narrow/ultra-wide screens
    camera.fov = camera.aspect < 1.6 ? 58 : 50;
    camera.updateProjectionMatrix();
  }
  function clearRoot() {
    for (let i = root.children.length - 1; i >= 0; i--) { const c = root.children[i]; root.remove(c); HC.dispose(c); }
    scene.fog = null;
  }
  function setCam(p) { Object.assign(baseCam, p); }
  function addShake(a) { shake = Math.max(shake, a); }
  function render(dt) {
    clock.t += dt;
    shake = Math.max(0, shake - dt * 1.6);
    const sx = (Math.random() - 0.5) * shake * 0.25, sy = (Math.random() - 0.5) * shake * 0.25;
    camera.position.set(baseCam.x + sx + Math.sin(clock.t * 0.4) * 0.05, baseCam.y + sy + Math.sin(clock.t * 0.55) * 0.03, baseCam.z);
    camera.lookAt(baseCam.lx, baseCam.ly, baseCam.lz);
    renderer.render(scene, camera);
  }
  return {
    init, resize, clearRoot, setCam, addShake, render,
    get root() { return root; }, get scene() { return scene; }, get camera() { return camera; }, get t() { return clock.t; }
  };
})();

/* dispose helper: frees geometries + non-shared materials/textures of a group */
HC.dispose = function (obj) {
  obj.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material && o.userData && o.userData.ownMat) {
      if (o.material.map) o.material.map.dispose();
      o.material.dispose();
    }
  });
};
