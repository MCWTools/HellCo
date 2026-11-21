/* Procedural look. Everything is a continuous knob, so combinations are practically endless.
   Skin / hair / eyes are independent of country on purpose. */
HC.gen.appearance = function (seed, gender, age, ov) {
  const r = HC.RNG(seed);
  const g = gender || 'x';
  const L = {};
  L.gender = g; L.age = age || 30;

  // body
  L.heightMul = HC.clamp(1 + r.gauss() * 0.28, 0.72, 1.32);
  L.fat = HC.clamp(r.next() < 0.25 ? r.range(0.65, 1) : r.range(0, 0.6), 0, 1);
  L.muscle = HC.clamp(r.next() < 0.22 ? r.range(0.65, 1) : r.range(0, 0.55), 0, 1);
  L.shoulder = g === 'm' ? 1.08 : g === 'f' ? 0.9 : 1;
  L.headS = HC.clamp(1 + r.gauss() * 0.28, 0.82, 1.4);
  L.headW = HC.clamp(1 + r.gauss() * 0.2, 0.85, 1.25);
  L.legL = HC.clamp(1 + r.gauss() * 0.2, 0.78, 1.25);
  L.armL = HC.clamp(1 + r.gauss() * 0.2, 0.8, 1.25);

  // skin: continuous natural range (+ a few fantasy tones because it's Hell)
  const stops = [0xf6dcc4, 0xe8b98f, 0xc68c5b, 0x9a6540, 0x6b4328, 0x3f2616];
  if (r.chance(0.045)) L.skinHex = r.pick([0x7fbf5a, 0x6fa0d8, 0xa07ac8, 0xb4b4b4, 0xf5a0c0, 0xe0d35a]);
  else {
    const t = r.next() * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(t)), f = t - i;
    const a = new THREE.Color(stops[i]), b = new THREE.Color(stops[i + 1]);
    L.skinHex = a.lerp(b, f).getHex();
  }

  // face quality: 0 ugly .. 1 pretty. Ugly = asymmetric, bulgy, off-centre.
  const attr = HC.clamp(0.78 + r.gauss() * 0.3, 0.3, 1);
  L.attr = attr;
  const wob = 1 - attr;
  L.eyeS = HC.clamp(1.15 + r.gauss() * 0.15 + (r.chance(0.06) ? 0.4 : 0), 0.95, 1.7);
  L.eyeGap = HC.clamp(r.gauss() * 0.015 + wob * r.range(-0.02, 0.03), -0.025, 0.04);
  L.eyeAsym = wob * r.range(0, 0.8);
  L.eyeHex = r.pick([0x2a1a10, 0x111111, 0x4a2f18, 0x2f6fd8, 0x2fa05a, 0x8a6a22, 0x777777, 0x8a4ad8, 0xc02020]);
  L.browT = r.range(0.7, 2);
  L.browTilt = r.range(-0.4, 0.4);
  L.noseT = r.chance(0.8) ? 0 : r.int(1, 3);
  L.noseS = HC.clamp(0.8 + r.gauss() * 0.2 + wob * 0.4, 0.5, 1.6);
  L.mouthW = HC.clamp(0.8 + r.gauss() * 0.2, 0.55, 1.3);
  L.smile = HC.clamp(0.2 + r.gauss() * 0.6, -0.8, 1);
  L.teeth = r.chance(0.08 + wob * 0.25);
  L.earS = HC.clamp(0.9 + r.gauss() * 0.25, 0.6, 1.5);
  L.blush = r.chance(0.45);
  L.glasses = r.chance(0.42) ? r.int(1, 3) : 0;
  L.scar = r.chance(0.07 + wob * 0.07);
  L.patch = r.chance(0.04);
  L.beard = (g === 'f' ? r.chance(0.02) : r.chance(g === 'm' ? 0.28 : 0.15)) ? r.int(1, 2) : 0;
  L.stache = L.beard === 0 && g !== 'f' && r.chance(0.12);

  // hair
  const hairByG = {
    m: ['short', 'short', 'spiky', 'bald', 'mohawk', 'afro', 'bowl', 'mullet', 'topknot', 'curtain', 'bigPuff'],
    f: ['long', 'long', 'bun', 'pigtails', 'bigPuff', 'short', 'afro', 'curtain', 'bowl', 'topknot'],
    x: ['short', 'long', 'spiky', 'bun', 'pigtails', 'afro', 'mohawk', 'bowl', 'mullet', 'curtain', 'topknot', 'bigPuff', 'bald']
  };
  L.hairStyle = r.pick(hairByG[g] || hairByG.x);
  const natural = [0x15110e, 0x15110e, 0x2a1a10, 0x3b2616, 0x5a3a22, 0xd8b560, 0xa6431f, 0x9a9a9a, 0xe8e8e8];
  const dyed = [0xff6fae, 0x3fa0ff, 0x3fd06a, 0x9a5cff, 0xff8a2a, 0x2fd1c4, 0xff3030];
  if (L.age > 62 && r.chance(0.75)) L.hairHex = r.pick([0x9a9a9a, 0xe8e8e8, 0xc8c8c8]);
  else L.hairHex = r.chance(0.28) ? r.pick(dyed) : r.pick(natural.slice(0, 7));
  if (L.age > 72 && r.chance(0.35)) L.hairStyle = 'bald';

  // hats & accessories
  L.hat = r.weighted([['none', 62], ['cap', 8], ['beanie', 8], ['tophat', 4], ['partyhat', 6], ['crown', 3], ['helmet', 4], ['bucket', 5]], x => x[1])[0];
  L.hatHex = r.pick([0xd03030, 0x3070d0, 0x30a050, 0xe0c030, 0x6a3ca0, 0x202020, 0xe08030, 0xf0f0f0]);
  L.accessory = r.weighted([['none', 52], ['tie', 20], ['bowtie', 8], ['scarf', 10], ['necklace', 10]], x => x[1])[0];

  // clothes
  const tops = [0xd03030, 0x3070d0, 0x30a050, 0xe0c030, 0x6a3ca0, 0x303030, 0xe08030, 0xe8e8e8, 0x20a8a8, 0xe060a0, 0x7a5030, 0x8aa0b8, 0x88c040];
  const bots = [0x1f2a44, 0x303030, 0x5a4630, 0x2a4a2a, 0x6a2a2a, 0x4a4a5a, 0x8a7a50, 0x1a1a1a];
  L.topHex = r.pick(tops);
  L.bottomHex = r.pick(bots);
  L.pattern = r.weighted([['none', 40], ['stripes', 20], ['dots', 14], ['check', 12], ['heart', 6], ['skull', 8]], x => x[1])[0];
  L.patHex = r.pick([0xffffff, 0x111111, 0xffd84a, 0xff5a5a, 0x6ad0ff]);
  L.shoeHex = r.pick([0x111111, 0x5a3a22, 0xe8e8e8, 0xd03030, 0x3070d0]);
  L.shoeHex2 = r.chance(0.09) ? r.pick([0xff40a0, 0x40ff80, 0xffe040]) : L.shoeHex;
  L.extras = [];
  if (ov) { for (const k in ov) L[k] = ov[k]; }
  return L;
};
