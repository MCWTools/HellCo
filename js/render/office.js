/* The Hell Corp office (3D, low-poly, intentionally tacky). */
HC.office3d = (function () {
  let grp, desk, stampG, decor = {}, staffGroup, lights = [], trapdoor, doorGlow, built = false;
  const SPOT = { x: -1.3, z: 0.4 };

  function tex(w, h, draw, rx, ry) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
    if (rx) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry || rx); }
    return t;
  }
  function mat(map, extra) { const m = new THREE.MeshPhongMaterial(Object.assign({ map, flatShading: true, shininess: 0 }, extra || {})); return m; }
  function plain(hex, extra) { return new THREE.MeshPhongMaterial(Object.assign({ color: hex, flatShading: true, shininess: 0 }, extra || {})); }
  function B(w, h, d, m, x, y, z, parent) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); (parent || grp).add(o); o.userData.ownMat = true; return o; }

  function build() {
    grp = new THREE.Group(); built = true; decor = {}; lights = []; staffRigs.length = 0;
    const S = HC.stage.scene;
    S.fog = new THREE.Fog(0x07040a, 9, 24);
    S.background = new THREE.Color(0x07040a);

    // floor: dark tiles with cracks
    const floorTex = tex(64, 64, (x, w, h) => {
      x.fillStyle = '#2a1418'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#34191e'; x.fillRect(0, 0, 32, 32); x.fillRect(32, 32, 32, 32);
      x.fillStyle = '#12080a'; x.fillRect(0, 0, w, 2); x.fillRect(0, 0, 2, h); x.fillRect(0, 32, w, 1); x.fillRect(32, 0, 1, h);
      x.strokeStyle = '#0c0506'; x.lineWidth = 1; x.beginPath(); x.moveTo(8, 6); x.lineTo(14, 18); x.lineTo(11, 28); x.moveTo(44, 40); x.lineTo(52, 52); x.stroke();
      x.fillStyle = '#ff6a1a'; x.fillRect(12, 17, 2, 2); x.fillRect(51, 50, 1, 2);
    }, 9, 9);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), mat(floorTex)); floor.rotation.x = -Math.PI / 2; floor.userData.ownMat = true; grp.add(floor);

    // walls: bricks
    const brickTex = tex(64, 64, (x, w, h) => {
      x.fillStyle = '#4a1d1d'; x.fillRect(0, 0, w, h);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
        const ox = (r % 2) * 16, tone = ['#5e2525', '#521f20', '#6a2a28', '#4a1c1c'][(r * 3 + c) % 4];
        x.fillStyle = tone; x.fillRect(c * 32 + ox + 1, r * 16 + 1, 30, 14);
      }
      x.fillStyle = '#1a0808'; for (let r = 0; r < 4; r++) x.fillRect(0, r * 16, w, 1);
    }, 6, 3);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), mat(brickTex)); back.position.set(0, 4, -7); back.userData.ownMat = true; grp.add(back);
    [-1, 1].forEach(s => { const side = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), mat(brickTex)); side.position.set(s * 8, 4, 0); side.rotation.y = -s * Math.PI / 2; side.userData.ownMat = true; grp.add(side); });
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), plain(0x120708)); ceil.position.y = 7; ceil.rotation.x = Math.PI / 2; ceil.userData.ownMat = true; grp.add(ceil);

    // sign
    const signTex = tex(256, 64, (x, w, h) => {
      x.fillStyle = '#16080a'; x.fillRect(0, 0, w, h); x.strokeStyle = '#ff6a1a'; x.lineWidth = 4; x.strokeRect(3, 3, w - 6, h - 6);
      x.fillStyle = '#ff8a2a'; x.font = 'bold 34px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(HC.CONFIG.name.toUpperCase(), w / 2, h / 2 + 2);
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshBasicMaterial({ map: signTex })); sign.position.set(-1.2, 5.3, -6.9); sign.userData.ownMat = true; grp.add(sign);
    // lava windows
    const lavaTex = tex(32, 32, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ffcc33'); g.addColorStop(0.5, '#ff6a1a'); g.addColorStop(1, '#a01800'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = '#ffe680'; for (let i = 0; i < 6; i++) x.fillRect((i * 11) % 32, (i * 7) % 32, 4, 2); });
    [-4.8, 3.2].forEach(px => { const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.2), new THREE.MeshBasicMaterial({ map: lavaTex })); win.position.set(px, 3.1, -6.95); win.userData.ownMat = true; grp.add(win); B(2.0, 0.12, 0.12, plain(0x1a0a0a), px, 4.25, -6.9); B(2.0, 0.12, 0.12, plain(0x1a0a0a), px, 1.95, -6.9); B(0.1, 2.3, 0.1, plain(0x1a0a0a), px, 3.1, -6.9); });
    // CEO door (closed for 2000 years)
    B(1.5, 3.0, 0.15, plain(0x2a140e), 1.0, 1.5, -6.9); B(1.2, 2.6, 0.18, plain(0x3b1c12), 1.0, 1.4, -6.85);
    B(0.1, 0.1, 0.1, plain(0xf0c020, { emissive: 0x6a4a00 }), 1.35, 1.4, -6.72);
    const plaque = tex(64, 24, (x, w, h) => { x.fillStyle = '#f0c020'; x.fillRect(0, 0, w, h); x.fillStyle = '#331a00'; x.font = 'bold 16px monospace'; x.textAlign = 'center'; x.fillText('CEO', w / 2, 18); });
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.22), new THREE.MeshBasicMaterial({ map: plaque })); pl.position.set(1.0, 2.9, -6.74); pl.userData.ownMat = true; grp.add(pl);
    doorGlow = new THREE.PointLight(0xffaa44, 0.0, 6); doorGlow.position.set(1.0, 0.2, -6.0); grp.add(doorGlow);
    // pipes
    [-5, -1, 3].forEach(px => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 18, 6), plain(0x3a2a2a)); p.rotation.x = Math.PI / 2; p.position.set(px, 6.6, 0); p.userData.ownMat = true; grp.add(p); });

    // desk
    desk = new THREE.Group(); grp.add(desk);
    const wood = plain(0x4a2a1a), woodDark = plain(0x2e1a10);
    B(4.4, 0.14, 1.2, wood, 0, 0.88, 2.3, desk);
    const frontTex = tex(128, 32, (x, w, h) => { x.fillStyle = '#2e1a10'; x.fillRect(0, 0, w, h); x.fillStyle = '#ff8a2a'; x.font = 'bold 14px monospace'; x.textAlign = 'center'; x.fillText('INTERN #666,013', w / 2, 20); });
    const front = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.85, 0.1), mat(frontTex)); front.position.set(0, 0.42, 2.85); front.userData.ownMat = true; desk.add(front);
    B(0.12, 0.85, 1.2, woodDark, -2.15, 0.42, 2.3, desk); B(0.12, 0.85, 1.2, woodDark, 2.15, 0.42, 2.3, desk);
    // monitor
    B(0.9, 0.62, 0.08, plain(0x181818), 1.45, 1.35, 1.95, desk);
    B(0.8, 0.52, 0.02, plain(0x1fff7a, { emissive: 0x0a7a38 }), 1.45, 1.35, 1.99, desk);
    B(0.1, 0.25, 0.1, plain(0x181818), 1.45, 1.0, 1.95, desk);
    // papers
    for (let i = 0; i < 5; i++) { const p = B(0.62, 0.012, 0.8, plain(0xf0e8d0), 0.45 + (i % 2) * 0.02, 0.96 + i * 0.012, 2.1 + (i % 3) * 0.01, desk); p.rotation.y = (i - 2) * 0.08; }
    // stamp
    stampG = new THREE.Group(); stampG.position.set(0.5, 1.1, 2.1); desk.add(stampG);
    B(0.22, 0.28, 0.22, plain(0x6a1a1a), 0, 0.2, 0, stampG); B(0.1, 0.22, 0.1, plain(0x2a1010), 0, 0.45, 0, stampG); B(0.36, 0.06, 0.28, plain(0x151515), 0, 0.02, 0, stampG);
    B(0.5, 0.03, 0.4, plain(0xa02020), 0.5, 0.96, 2.1, desk);
    // trapdoor
    trapdoor = new THREE.Mesh(new THREE.CircleGeometry(0.8, 14), new THREE.MeshBasicMaterial({ color: 0x050102 })); trapdoor.rotation.x = -Math.PI / 2; trapdoor.position.set(SPOT.x, 0.02, SPOT.z); trapdoor.userData.ownMat = true; grp.add(trapdoor);
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.9, 14), new THREE.MeshBasicMaterial({ color: 0xff5a1a })); rim.rotation.x = -Math.PI / 2; rim.position.set(SPOT.x, 0.025, SPOT.z); rim.userData.ownMat = true; grp.add(rim);

    // queue rope posts
    for (let i = 0; i < 5; i++) { B(0.08, 0.7, 0.08, plain(0xb08a20), -2.1 - i * 0.55, 0.35, 1.4 - i * 1.3 - 0.9, grp); }

    // lights
    grp.add(new THREE.AmbientLight(0x6a3a4a, 1.0));
    const key = new THREE.PointLight(0xff9a4a, 1.5, 18); key.position.set(0, 4.5, 2.5); grp.add(key); lights.push(key);
    const back1 = new THREE.PointLight(0xff3a1a, 1.1, 14); back1.position.set(-3, 3, -4); grp.add(back1); lights.push(back1);
    const dirL = new THREE.DirectionalLight(0xffe0c0, 0.55); dirL.position.set(1, 3, 6); grp.add(dirL);

    staffGroup = new THREE.Group(); grp.add(staffGroup);
    HC.stage.root.add(grp);
    return grp;
  }

  function setDecor(upg) {
    ['plant', 'lava', 'poster', 'coffee'].forEach(k => { if (decor[k]) { desk.remove(decor[k]); grp.remove(decor[k]); HC.dispose(decor[k]); decor[k] = null; } });
    if ((upg.plant || 0) > 0) { const g = new THREE.Group(); B(0.22, 0.2, 0.22, plain(0x8a3a1a), 0, 0.1, 0, g); const l = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), plain(0x2f8a3a)); l.position.y = 0.4; l.scale.y = 1.3; l.userData.ownMat = true; g.add(l); g.position.set(1.95, 0.95, 2.4); desk.add(g); decor.plant = g; }
    if ((upg.lava || 0) > 0) { const g = new THREE.Group(); B(0.16, 0.08, 0.16, plain(0x222222), 0, 0.04, 0, g); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.4, 7), plain(0xff3a8a, { emissive: 0x801040 })); c.position.y = 0.28; c.userData.ownMat = true; g.add(c); B(0.1, 0.06, 0.1, plain(0x222222), 0, 0.5, 0, g); g.position.set(-1.9, 0.95, 2.3); desk.add(g); decor.lava = g; }
    if ((upg.poster || 0) > 0) { const t = tex(64, 96, (x, w, h) => { x.fillStyle = '#f0e0b0'; x.fillRect(0, 0, w, h); x.fillStyle = '#331a00'; x.font = 'bold 9px monospace'; x.textAlign = 'center'; x.fillText('HANG IN', w / 2, 14); x.fillText('THERE!', w / 2, 26); x.fillStyle = '#c0392b'; x.beginPath(); x.arc(32, 56, 16, 0, 7); x.fill(); x.fillStyle = '#000'; x.fillRect(25, 52, 4, 4); x.fillRect(36, 52, 4, 4); x.fillRect(26, 62, 12, 2); x.font = '8px monospace'; x.fillStyle = '#331a00'; x.fillText('(you are dead)', w / 2, 88); }); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.65), new THREE.MeshBasicMaterial({ map: t })); p.position.set(-5.5, 3.2, -6.9); p.userData.ownMat = true; grp.add(p); decor.poster = p; }
    if ((upg.coffee || 0) > 0) { const g = new THREE.Group(); B(0.5, 0.8, 0.4, plain(0x303030), 0, 0.4, 0, g); B(0.3, 0.12, 0.05, plain(0xff4020, { emissive: 0x802010 }), 0, 0.62, 0.21, g); B(0.12, 0.12, 0.12, plain(0xf0f0f0), 0, 0.14, 0.18, g); g.position.set(4.1, 0, -2.5); grp.add(g); decor.coffee = g; }
  }

  function clearStaff() { for (let i = staffGroup.children.length - 1; i >= 0; i--) { const c = staffGroup.children[i]; staffGroup.remove(c); HC.dispose(c); } staffRigs.length = 0; }
  const staffRigs = [];
  function staffPos(i) { return { x: 0.5 + (i % 6) * 0.78, z: -3.6 - Math.floor(i / 6) * 1.1 }; }
  function addStaff(look, i) {
    const rig = look.kind === 'ant' ? HC.Character.buildAnt({ scale: 1 }) : HC.Character.build(look);
    const p = staffPos(i); rig.group.position.set(p.x, 0, p.z); rig.group.rotation.y = -0.15;
    if (rig.body && look.kind !== 'ant') { const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.02), new THREE.MeshPhongMaterial({ color: 0x20c0ff, flatShading: true })); l.position.set(0, 1.25, 0.2); l.userData.ownMat = true; rig.body.add(l); }
    staffGroup.add(rig.group); staffRigs.push(rig); return rig;
  }
  function setStaff(souls) { clearStaff(); souls.forEach((s, i) => addStaff(s.kind === 'ant' ? { kind: 'ant' } : Object.assign({}, s.look, { kind: s.kind }), i)); }

  function stamp() {
    HC.audio.stamp(); HC.stage.addShake(0.5);
    return HC.tween.run(220, k => { stampG.position.y = 1.1 - Math.sin(k * Math.PI) * 0.22; }, 'lin');
  }
  function flash(hex, n) { lights[0].color.setHex(hex); lights[0].intensity = n || 3; }
  function update(t, dt) {
    lights[0].intensity += (1.5 - lights[0].intensity) * Math.min(1, dt * 4);
    lights[0].color.lerp(new THREE.Color(0xff9a4a), Math.min(1, dt * 3));
    lights[1].intensity = 1.1 + Math.sin(t * 7) * 0.12 + Math.sin(t * 13.1) * 0.08;
    staffRigs.forEach(r => r.update(t, dt));
    if (decor.lava) decor.lava.children[1].material.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.3;
  }
  function pos(i) { return { x: SPOT.x - i * 0.95, z: SPOT.z - i * 1.35 }; }
  function staffTarget(i) { return staffPos(i); }
  return { build, setDecor, setStaff, addStaff, stamp, flash, update, pos, staffTarget, SPOT, isBuilt: () => built, get door() { return doorGlow; } };
})();
