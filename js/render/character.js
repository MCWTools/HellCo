/* Ugly-on-purpose characters from primitives. build(look) -> rig {group, update(t,dt), setWalking(b), ...}
   Feet at y=0, facing +z. All shapes are driven by the numbers in `look`. */
HC.Character = (function () {
  const matCache = new Map();
  function M(hex, shininess) {
    const k = hex + '_' + (shininess || 0);
    let m = matCache.get(k);
    if (!m) { m = new THREE.MeshPhongMaterial({ color: hex, flatShading: true, shininess: shininess || 0 }); matCache.set(k, m); }
    return m;
  }
  function mesh(geo, mat) { return new THREE.Mesh(geo, mat); }
  function box(w, h, d, hex) { return mesh(new THREE.BoxGeometry(w, h, d), M(hex)); }
  function sph(r, hex, ws, hs) { return mesh(new THREE.SphereGeometry(r, ws || 8, hs || 6), M(hex)); }
  function cyl(rt, rb, h, hex, seg) { return mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 8), M(hex)); }
  function cone(r, h, hex, seg) { return mesh(new THREE.ConeGeometry(r, h, seg || 6), M(hex)); }
  function place(o, x, y, z) { o.position.set(x, y, z); return o; }
  function add(g, o, x, y, z) { place(o, x || 0, y || 0, z || 0); g.add(o); return o; }

  function patternMat(look) {
    if (look.pattern === 'none') return M(look.topHex);
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const x = c.getContext('2d'), col = n => '#' + ('000000' + n.toString(16)).slice(-6);
    x.fillStyle = col(look.topHex); x.fillRect(0, 0, 32, 32); x.fillStyle = col(look.patHex);
    if (look.pattern === 'stripes') for (let i = 0; i < 32; i += 8) x.fillRect(0, i, 32, 3);
    else if (look.pattern === 'dots') for (let i = 4; i < 32; i += 10) for (let j = 4; j < 32; j += 10) x.fillRect(i, j, 4, 4);
    else if (look.pattern === 'check') for (let i = 0; i < 32; i += 8) for (let j = 0; j < 32; j += 8) if (((i + j) / 8) % 2 === 0) x.fillRect(i, j, 8, 8);
    else if (look.pattern === 'heart') { x.fillRect(11, 10, 4, 4); x.fillRect(17, 10, 4, 4); x.fillRect(11, 14, 10, 4); x.fillRect(13, 18, 6, 3); x.fillRect(15, 21, 2, 2); }
    else if (look.pattern === 'skull') { x.fillRect(10, 8, 12, 10); x.fillRect(12, 18, 8, 4); x.fillStyle = col(look.topHex); x.fillRect(12, 11, 3, 3); x.fillRect(17, 11, 3, 3); }
    const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    const m = new THREE.MeshPhongMaterial({ map: tex, flatShading: true, shininess: 0 });
    m.userData = { own: true };
    return m;
  }

  function hairParts(look, R) { // returns group positioned relative to head centre
    const g = new THREE.Group(), hx = look.hairHex, Rx = R.x, Ry = R.y, Rz = R.z;
    const cap = () => { const c = mesh(new THREE.SphereGeometry(1, 10, 7, 0, Math.PI * 2, 0, Math.PI * 0.56), M(hx)); c.scale.set(Rx * 1.07, Ry * 1.06, Rz * 1.07); c.position.y = 0.01; c.rotation.x = -0.22; return c; };
    switch (look.hairStyle) {
      case 'bald': break;
      case 'short': g.add(cap()); break;
      case 'spiky': { g.add(cap()); for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, c = cone(0.07, 0.22 + (i % 3) * 0.06, hx, 4); c.position.set(Math.cos(a) * Rx * 0.62, Ry * (0.78 + (i % 2) * 0.1), Math.sin(a) * Rz * 0.55); c.rotation.z = -Math.cos(a) * 0.5; c.rotation.x = Math.sin(a) * 0.5; g.add(c); } break; }
      case 'long': { g.add(cap()); add(g, box(Rx * 2.1, Ry * 1.9, 0.12, hx), 0, -Ry * 0.55, -Rz * 0.82); add(g, box(0.1, Ry * 1.5, Rz * 1.1, hx), Rx * 0.98, -Ry * 0.3, -0.02); add(g, box(0.1, Ry * 1.5, Rz * 1.1, hx), -Rx * 0.98, -Ry * 0.3, -0.02); break; }
      case 'afro': { const s = sph(1, hx, 10, 8); s.scale.set(Rx * 1.55, Ry * 1.45, Rz * 1.45); s.position.set(0, Ry * 0.25, -0.05); g.add(s); break; }
      case 'mohawk': { g.add(cap()); for (let i = 0; i < 6; i++) add(g, box(0.07, 0.2 + (i % 2) * 0.07, 0.11, hx), 0, Ry * 0.9 - i * 0.012, Rz * 0.5 - i * (Rz * 0.2)); break; }
      case 'bun': { g.add(cap()); add(g, sph(0.15, hx), 0, Ry * 1.05, -Rz * 0.2); break; }
      case 'pigtails': { g.add(cap()); [-1, 1].forEach(s => { add(g, cyl(0.04, 0.04, 0.2, hx, 5), s * Rx * 0.95, Ry * 0.15, -0.02).rotation.z = s * 0.4; add(g, sph(0.13, hx), s * Rx * 1.2, -Ry * 0.12, -0.02); }); break; }
      case 'bowl': { g.add(cap()); const r = mesh(new THREE.CylinderGeometry(Rx * 1.03, Rx * 1.08, Ry * 0.28, 10), M(hx)); r.position.y = Ry * 0.18; r.scale.z = Rz / Rx; g.add(r); break; }
      case 'topknot': { g.add(cap()); add(g, cyl(0.05, 0.08, 0.14, hx, 5), 0, Ry * 1.0, 0); add(g, sph(0.11, hx), 0, Ry * 1.18, 0); break; }
      case 'mullet': { g.add(cap()); add(g, box(Rx * 1.5, Ry * 1.2, 0.12, hx), 0, -Ry * 0.5, -Rz * 0.85); break; }
      case 'curtain': { g.add(cap()); add(g, box(Rx * 0.55, Ry * 0.9, 0.08, hx), Rx * 0.5, Ry * 0.28, Rz * 0.85); add(g, box(Rx * 0.55, Ry * 0.9, 0.08, hx), -Rx * 0.5, Ry * 0.28, Rz * 0.85); break; }
      case 'bigPuff': { [-1, 1].forEach(s => add(g, sph(0.22, hx, 8, 6), s * Rx * 0.8, Ry * 0.75, 0)); g.add(cap()); break; }
    }
    return g;
  }

  function hatParts(look, R) {
    const g = new THREE.Group(), c = look.hatHex, Rx = R.x, Ry = R.y;
    switch (look.hat) {
      case 'cap': { const d = mesh(new THREE.SphereGeometry(1, 9, 6, 0, Math.PI * 2, 0, Math.PI / 2), M(c)); d.scale.set(Rx * 1.1, Ry * 0.8, R.z * 1.1); d.position.y = Ry * 0.35; g.add(d); add(g, box(Rx * 1.2, 0.03, 0.28, c), 0, Ry * 0.4, R.z * 1.0); break; }
      case 'beanie': { const d = mesh(new THREE.SphereGeometry(1, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.58), M(c)); d.scale.set(Rx * 1.1, Ry * 1.05, R.z * 1.1); d.position.y = Ry * 0.18; g.add(d); add(g, sph(0.08, 0xffffff), 0, Ry * 1.2, 0); break; }
      case 'tophat': { add(g, cyl(Rx * 0.95, Rx * 0.95, 0.04, c, 10), 0, Ry * 0.85, 0); add(g, cyl(Rx * 0.62, Rx * 0.62, 0.38, c, 10), 0, Ry * 1.08, 0); add(g, cyl(Rx * 0.64, Rx * 0.64, 0.05, 0xd03030, 10), 0, Ry * 0.95, 0); break; }
      case 'partyhat': add(g, cone(0.16, 0.42, c, 7), 0, Ry * 1.18, 0).rotation.z = 0.15; add(g, sph(0.05, 0xffe040), 0.03, Ry * 1.42, 0); break;
      case 'crown': { add(g, cyl(Rx * 0.55, Rx * 0.6, 0.12, 0xf0c020, 8), 0, Ry * 0.95, 0); for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; add(g, cone(0.045, 0.14, 0xf0c020, 4), Math.cos(a) * Rx * 0.5, Ry * 1.1, Math.sin(a) * Rx * 0.5); } break; }
      case 'helmet': { const d = mesh(new THREE.SphereGeometry(1, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), M(0xe0b020, 20)); d.scale.set(Rx * 1.15, Ry * 1.12, R.z * 1.15); d.position.y = Ry * 0.12; g.add(d); break; }
      case 'bucket': { add(g, cyl(Rx * 0.75, Rx * 0.95, 0.22, c, 9), 0, Ry * 0.85, 0); add(g, cyl(Rx * 1.12, Rx * 1.12, 0.03, c, 9), 0, Ry * 0.74, 0); break; }
    }
    return g;
  }

  function build(look, opts) {
    opts = opts || {};
    const root = new THREE.Group();
    const body = new THREE.Group(); root.add(body);
    const hm = look.heightMul || 1;
    const fat = look.fat || 0, mus = look.muscle || 0, sh = look.shoulder || 1;
    const legLen = 0.8 * (look.legL || 1), torsoH = 0.75, headR = 0.3 * (look.headS || 1);
    const R = { x: headR * (look.headW || 1), y: headR, z: headR };
    const torsoW = (0.46 + fat * 0.34 + mus * 0.14) * sh, torsoD = 0.28 + fat * 0.3;
    const skin = look.skinHex;

    // legs
    const legR = 0.1 + fat * 0.04 + mus * 0.03;
    const legs = [-1, 1].map(s => {
      const piv = new THREE.Group(); piv.position.set(s * torsoW * 0.28, legLen, 0);
      add(piv, cyl(legR, legR * 0.95, legLen, look.bottomHex, 7), 0, -legLen / 2, 0);
      add(piv, box(legR * 2.1, 0.1, legR * 3.1, s < 0 ? look.shoeHex : look.shoeHex2), 0, -legLen + 0.04, legR * 0.6);
      body.add(piv); return piv;
    });
    // torso
    const tm = patternMat(look);
    const torso = mesh(new THREE.BoxGeometry(torsoW, torsoH, torsoD), tm); if (tm.userData && tm.userData.own) torso.userData.ownMat = true;
    torso.position.y = legLen + torsoH / 2; body.add(torso);
    add(body, box(torsoW * 0.98, 0.2, torsoD * 0.98, look.bottomHex), 0, legLen + 0.06, 0);
    if (fat > 0.45) { const b = sph(1, look.topHex, 8, 6); b.scale.set(torsoW * 0.5, 0.26 + fat * 0.12, torsoD * 0.85); b.position.set(0, legLen + 0.24, torsoD * 0.36); if (tm.map) b.material = tm; body.add(b); }
    // arms
    const armR = 0.06 + mus * 0.07 + fat * 0.02, armLen = 0.62 * (look.armL || 1);
    const arms = [-1, 1].map(s => {
      const piv = new THREE.Group(); piv.position.set(s * (torsoW / 2 + armR * 0.9), legLen + torsoH - 0.08, 0);
      add(piv, cyl(armR, armR, armLen * 0.5, look.topHex, 6), 0, -armLen * 0.25, 0);
      add(piv, cyl(armR * 0.85, armR * 0.8, armLen * 0.55, skin, 6), 0, -armLen * 0.72, 0);
      add(piv, sph(armR * 1.3, skin, 6, 5), 0, -armLen, 0);
      body.add(piv); return piv;
    });
    // neck + head
    const neckY = legLen + torsoH;
    add(body, cyl(0.07, 0.08, 0.12, skin, 6), 0, neckY + 0.04, 0);
    const head = new THREE.Group(); head.position.y = neckY + 0.08 + headR; body.add(head);
    const hs = sph(1, skin, 10, 8); hs.scale.set(R.x, R.y, R.z); head.add(hs);
    const surf = (x, y) => Math.sqrt(Math.max(0.02, 1 - (x * x) / (R.x * R.x) - (y * y) / (R.y * R.y))) * R.z;
    const asym = look.eyeAsym || 0, eyeS = look.eyeS || 1;
    // eyes
    const eyes = [];
    [-1, 1].forEach((s, i) => {
      const ex = s * (0.1 + (look.eyeGap || 0)), ey = 0.05 * R.y / 0.3 + (i === 0 ? asym * 0.045 : 0), es = eyeS * (i === 0 ? 1 + asym * 0.5 : 1);
      const g = new THREE.Group(); g.position.set(ex, ey, surf(ex, ey) - 0.01);
      const wh = sph(0.075 * es, 0xffffff, 8, 6); wh.scale.z = 0.55; g.add(wh);
      add(g, sph(0.038 * es, look.eyeHex, 6, 5), 0, 0, 0.04 * es);
      head.add(g); eyes.push(g);
    });
    // brows
    [-1, 1].forEach(s => { const b = box(0.13 * 0.9, 0.02 * (look.browT || 1), 0.02, look.hairHex === 0xe8e8e8 ? 0xaaaaaa : 0x1a1210); const bx = s * (0.1 + (look.eyeGap || 0)), by = 0.15 * R.y / 0.3; b.position.set(bx, by, surf(bx, by) + 0.005); b.rotation.z = s * -(look.browTilt || 0) * 0.9; head.add(b); });
    // nose
    const ny = -0.02, nz = surf(0, ny), ns = (look.noseS || 1);
    const nHex = new THREE.Color(skin).multiplyScalar(0.88).getHex();
    if (look.noseT === 0) add(head, sph(0.04 * ns, nHex, 6, 5), 0, ny, nz + 0.01);
    else if (look.noseT === 1) add(head, sph(0.075 * ns, nHex, 6, 5), 0, ny, nz + 0.02);
    else if (look.noseT === 2) { const c = cone(0.05 * ns, 0.14 * ns, nHex, 5); c.rotation.x = Math.PI / 2; add(head, c, 0, ny, nz + 0.05); }
    else add(head, box(0.07 * ns, 0.1 * ns, 0.07 * ns, nHex), 0, ny, nz + 0.02);
    // mouth
    const mw = 0.2 * (look.mouthW || 1), my = -0.13 * R.y / 0.3, sm = look.smile || 0, mz = surf(0, my) + 0.01;
    add(head, box(mw * 0.6, 0.026, 0.02, 0x5a1218), 0, my + sm * 0.005, mz);
    [-1, 1].forEach(s => { const c = box(mw * 0.3, 0.026, 0.02, 0x5a1218); c.position.set(s * mw * 0.36, my + sm * 0.03, mz - 0.005); c.rotation.z = s * sm * 0.7; head.add(c); });
    if (look.teeth) { add(head, box(0.045, 0.06, 0.02, 0xfff8e0), -0.025, my - 0.04, mz + 0.01); add(head, box(0.045, 0.06, 0.02, 0xfff8e0), 0.025, my - 0.04, mz + 0.01); }
    // ears
    [-1, 1].forEach(s => { const e = sph(0.06 * (look.earS || 1), skin, 6, 5); e.scale.z = 0.5; e.position.set(s * R.x * 0.98, 0, 0); head.add(e); });
    if (look.blush) [-1, 1].forEach(s => { const b = sph(0.045, 0xff7a8a, 6, 4); b.scale.z = 0.3; const bx = s * 0.17, by = -0.06; b.position.set(bx, by, surf(bx, by)); head.add(b); });
    if (look.stache) add(head, box(0.2 * (look.mouthW || 1), 0.045, 0.04, look.hairHex), 0, my + 0.055, mz + 0.012);
    if (look.beard) { const b = sph(1, look.hairHex, 8, 6); b.scale.set(R.x * 0.96, R.y * (look.beard === 2 ? 0.75 : 0.5), R.z * 0.95); b.position.set(0, -R.y * 0.52, -0.03); head.add(b); }
    if (look.scar) { const s = box(0.02, 0.17, 0.02, 0xc03030); s.position.set(0.12, -0.02, surf(0.12, -0.02) + 0.005); s.rotation.z = 0.7; head.add(s); }
    if (look.glasses) {
      const gl = look.glasses;
      [-1, 1].forEach(s => { const gx = s * (0.1 + (look.eyeGap || 0)), gy = 0.05, gz = surf(gx, gy) + 0.01;
        const t = mesh(new THREE.TorusGeometry(0.09, 0.012, 4, gl === 2 ? 4 : 10), M(gl === 3 ? 0x111111 : 0x222222)); t.position.set(gx, gy, gz); if (gl === 2) t.rotation.z = Math.PI / 4; head.add(t);
        if (gl === 3) { const d = sph(0.085, 0x080808, 8, 5); d.scale.z = 0.3; d.position.set(gx, gy, gz); head.add(d); } });
      add(head, box(0.1, 0.012, 0.012, 0x222222), 0, 0.06, surf(0, 0.06) + 0.012);
    }
    if (look.patch) { const p = sph(0.1, 0x080808, 8, 5); p.scale.z = 0.3; const px = 0.1 + (look.eyeGap || 0), py = 0.05; p.position.set(px, py, surf(px, py) + 0.02); head.add(p); add(head, box(R.x * 2.05, 0.02, 0.02, 0x080808), 0, 0.1, surf(0, 0.1) * 0.35).rotation.z = 0.15; }
    head.add(hairParts(look, R));
    if (look.hat && look.hat !== 'none') head.add(hatParts(look, R));
    // extras
    const ex = look.extras || [];
    if (ex.indexOf('horns') >= 0) [-1, 1].forEach(s => { const h = cone(0.07, 0.3, 0x2a0a0a, 6); h.position.set(s * R.x * 0.65, R.y * 0.95, 0); h.rotation.z = -s * 0.4; head.add(h); });
    if (ex.indexOf('tongue') >= 0) { const t = box(0.05, 0.016, 0.22, 0xd02050); t.position.set(0, my - 0.02, mz + 0.1); head.add(t); [-1, 1].forEach(s => { const f = box(0.02, 0.016, 0.08, 0xd02050); f.position.set(s * 0.025, my - 0.02, mz + 0.24); f.rotation.y = s * 0.4; head.add(f); }); }
    // accessory
    const ay = legLen + torsoH - 0.1, az = torsoD / 2 + 0.01;
    if (look.accessory === 'tie') { add(body, box(0.09, 0.4, 0.03, 0xc02030), 0, ay - 0.2, az); add(body, box(0.12, 0.08, 0.04, 0xc02030), 0, ay + 0.0, az); }
    else if (look.accessory === 'bowtie') { [-1, 1].forEach(s => { const b = cone(0.07, 0.12, 0xc02030, 3); b.rotation.z = s * Math.PI / 2; add(body, b, s * 0.07, ay + 0.03, az); }); add(body, sph(0.035, 0xc02030, 5, 4), 0, ay + 0.03, az); }
    else if (look.accessory === 'scarf') { const s = mesh(new THREE.TorusGeometry(0.14, 0.055, 5, 9), M(0xd04040)); s.rotation.x = Math.PI / 2; add(body, s, 0, neckY + 0.02, 0); add(body, box(0.08, 0.3, 0.05, 0xd04040), 0.1, ay - 0.15, az); }
    else if (look.accessory === 'necklace') { const s = mesh(new THREE.TorusGeometry(0.13, 0.014, 4, 10), M(0xf0c020)); s.rotation.x = Math.PI / 2; add(body, s, 0, neckY, 0.02); add(body, sph(0.04, 0xf0c020, 5, 4), 0, neckY - 0.1, 0.12); }

    root.scale.setScalar(hm * (opts.scale || 1));
    const rig = { group: root, body, head, arms, legs, eyes, walking: false, phase: Math.random() * 6, blinkT: 2 + Math.random() * 3, height: (legLen + torsoH + 0.2 + headR * 2) * hm * (opts.scale || 1), mood: 0 };
    rig.setWalking = b => { rig.walking = b; };
    rig.update = function (t, dt) {
      const p = rig.phase + t;
      if (rig.walking) {
        const w = t * 9 + rig.phase;
        legs[0].rotation.x = Math.sin(w) * 0.6; legs[1].rotation.x = -Math.sin(w) * 0.6;
        arms[0].rotation.x = -Math.sin(w) * 0.5; arms[1].rotation.x = Math.sin(w) * 0.5;
        body.position.y = Math.abs(Math.sin(w)) * 0.05; body.rotation.z = Math.sin(w * 0.5) * 0.04;
      } else {
        legs[0].rotation.x *= 0.8; legs[1].rotation.x *= 0.8;
        arms[0].rotation.x = Math.sin(p * 1.3) * 0.05 + rig.mood * 0.0; arms[1].rotation.x = -Math.sin(p * 1.3) * 0.05;
        arms[0].rotation.z = 0.05 + (rig.mood ? Math.sin(p * 24) * 0.1 * rig.mood : 0); arms[1].rotation.z = -0.05;
        body.rotation.z = Math.sin(p * 0.9) * 0.025; body.position.y = Math.sin(p * 1.8) * 0.008;
        head.rotation.z = Math.sin(p * 0.7) * 0.04; head.rotation.y = Math.sin(p * 0.5) * 0.12;
      }
      rig.blinkT -= dt; const bl = rig.blinkT < 0.1 && rig.blinkT > 0;
      if (rig.blinkT <= -0.1) rig.blinkT = 2 + Math.random() * 3.5;
      eyes.forEach(e => { e.scale.y = bl ? 0.12 : 1; });
    };
    return rig;
  }

  // tiny ant (special soul)
  function buildAnt(opts) {
    const g = new THREE.Group(), c = 0x1a1210, s = (opts && opts.scale) || 1;
    add(g, sph(0.2, c, 8, 6), 0, 0.22, -0.28); add(g, sph(0.14, c, 8, 6), 0, 0.24, 0); const h = add(g, sph(0.17, c, 8, 6), 0, 0.3, 0.26);
    [-1, 1].forEach(sd => { add(h, sph(0.045, 0xffffff, 6, 4), sd * 0.08, 0.04, 0.13); add(h, sph(0.02, 0x000000, 5, 4), sd * 0.08, 0.04, 0.17); const a = box(0.02, 0.2, 0.02, c); a.position.set(sd * 0.07, 0.2, 0.08); a.rotation.z = -sd * 0.4; h.add(a); });
    const legs = []; for (let i = 0; i < 3; i++) [-1, 1].forEach(sd => { const l = box(0.2, 0.025, 0.025, c); l.position.set(sd * 0.14, 0.12, -0.12 + i * 0.12); l.rotation.z = sd * 0.5; g.add(l); legs.push(l); });
    add(g, cyl(0.16, 0.18, 0.1, 0xe8c020, 8), 0, 0.45, 0.26);
    g.scale.setScalar(s);
    const rig = { group: g, body: g, head: h, arms: [], legs: [], eyes: [], walking: false, phase: 0, height: 0.55 * s, mood: 0 };
    rig.setWalking = b => { rig.walking = b; };
    rig.update = t => { g.position.y = Math.abs(Math.sin(t * (rig.walking ? 12 : 3))) * 0.02; h.rotation.y = Math.sin(t * 2) * 0.25; legs.forEach((l, i) => { l.rotation.y = Math.sin(t * 14 + i) * 0.4 * (rig.walking ? 1 : 0.2); }); };
    return rig;
  }

  const BOSS_LOOK = { gender: 'm', heightMul: 1.18, fat: 0.55, muscle: 0.5, shoulder: 1.15, headS: 1.25, headW: 1.1, legL: 1, armL: 1, skinHex: 0xb8322a, attr: 0.2, eyeS: 1.25, eyeGap: 0.01, eyeAsym: 0.3, eyeHex: 0xffd000, browT: 2.2, browTilt: 0.45, noseT: 2, noseS: 1.4, mouthW: 1.3, smile: -0.5, teeth: true, earS: 1.5, blush: false, glasses: 0, scar: true, patch: false, beard: 1, stache: false, hairStyle: 'bald', hairHex: 0x1a0a0a, hat: 'none', accessory: 'tie', topHex: 0x1a1a22, bottomHex: 0x101018, pattern: 'stripes', patHex: 0x3a3a50, shoeHex: 0x080808, shoeHex2: 0x080808, extras: ['horns'] };

  return { build, buildAnt, BOSS_LOOK, M };
})();
