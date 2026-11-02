// ---------- drawing: world ----------
function glow(x, y, r, col) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
const stars = Array.from({ length: 70 }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(.6, 1.8), a: rand(.2, .7), p: rand(0, 6) }));
function drawWorld(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0d0b2a'); g.addColorStop(.35, '#14123a'); g.addColorStop(1, '#1b1846');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // stars
  for (const s of stars) {
    ctx.fillStyle = `rgba(255,240,200,${s.a * (reduceMotion ? 1 : .7 + .3 * Math.sin(t * 1.5 + s.p))})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
  }

  // far bamboo silhouettes
  ctx.fillStyle = '#110f33';
  for (let i = 0; i < 14; i++) {
    const bx = 40 + i * 74, h = 60 + (i * 37 % 50);
    ctx.beginPath(); ctx.moveTo(bx - 4, GY + 4);
    for (let y = 0; y <= h; y += 10) ctx.lineTo(bx + Math.sin(t * .5 + i + y * .03) * 3 - 3, GY + 4 - y);
    for (let y = h; y >= 0; y -= 10) ctx.lineTo(bx + Math.sin(t * .5 + i + y * .03) * 3 + 3, GY + 4 - y);
    ctx.fill();
  }

  // night board
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.beginPath(); ctx.roundRect(GX - 4, GY - 2, CW * COLS + 12, CH * ROWS + 10, 14); ctx.fill();
  ctx.beginPath(); ctx.roundRect(GX, GY - 6, CW * COLS, CH * ROWS + 6, 12); ctx.clip();
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    ctx.fillStyle = (r + c) % 2 ? '#1f1c52' : '#24215c';
    ctx.fillRect(GX + c * CW, GY + r * CH - (r === 0 ? 6 : 0), CW, CH + (r === 0 ? 6 : 0));
  }
  for (let r = 1; r < ROWS; r++) { ctx.fillStyle = 'rgba(8,6,28,.35)'; ctx.fillRect(GX, GY + r * CH - 1, CW * COLS, 2); }
  for (const d of decor) {
    if (d.k === 'pebble') { ctx.fillStyle = 'rgba(8,6,28,.35)'; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 1.4, d.r, d.a, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = 'rgba(255,150,120,.22)'; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r + 1, (d.r + 1) * .5, d.a, 0, 7); ctx.fill(); }
  }
  // drifting mist
  ctx.strokeStyle = 'rgba(200,190,255,.06)'; ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const y0 = GY + i * 32 + 8;
    ctx.beginPath();
    for (let x = GX; x <= GX + CW * COLS; x += 16) {
      const y = y0 + Math.sin(x * .03 + t * (reduceMotion ? 0 : .6) + i) * 6 + Math.sin(x * .011 - t * .4 + i * 2) * 4;
      x === GX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // lantern string along the top of the board
  const spans = 8, x0 = GX - 30, span = (W + 30 - x0) / spans;
  ctx.strokeStyle = 'rgba(255,190,110,.25)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x0, GY - 6);
  for (let i = 0; i < spans; i++) { const a = x0 + i * span; ctx.quadraticCurveTo(a + span / 2, GY + 12, a + span, GY - 6); }
  ctx.stroke();
  for (let i = 0; i < spans; i++) {
    const lx = x0 + (i + .5) * span, ly = GY + 3, sw = reduceMotion ? 0 : Math.sin(t * 1.2 + i) * 1.5;
    glow(lx + sw, ly + 9, 26, 'rgba(255,170,80,.6)');
    ctx.fillStyle = '#ff9d4d'; ctx.beginPath(); ctx.ellipse(lx + sw, ly + 9, 5, 7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#3a1d10'; ctx.fillRect(lx + sw - 3, ly + 1, 6, 2); ctx.fillRect(lx + sw - 3, ly + 15, 6, 2);
  }

  // garden at the left: dark hill, a lit house, reeds
  ctx.fillStyle = '#0e0c2c';
  ctx.beginPath(); ctx.moveTo(0, GY - 20);
  ctx.bezierCurveTo(60, GY - 50, 120, GY - 10, GX - 10, GY + 10);
  ctx.lineTo(GX - 6, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#13113a';
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(30 + (i % 2) * 60, GY + 40 + i * 70, 46, 30, i, 0, 7); ctx.fill(); }
  const hx = 64, hy = H - 150;
  glow(hx, hy + 10, 80, 'rgba(255,170,80,.25)');
  ctx.fillStyle = '#07061a';
  ctx.fillRect(hx - 30, hy - 10, 60, 44);
  ctx.beginPath(); ctx.moveTo(hx - 46, hy - 6); ctx.quadraticCurveTo(hx - 22, hy - 14, hx, hy - 40); ctx.quadraticCurveTo(hx + 22, hy - 14, hx + 46, hy - 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffc06a'; ctx.fillRect(hx - 20, hy + 2, 14, 14); ctx.fillRect(hx + 6, hy + 2, 14, 14);
  ctx.strokeStyle = '#1d1a4a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const bx = 14 + i * 16, by = H - 4;
    ctx.beginPath(); ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + Math.sin(t * 1.4 + i) * 10, by - 40, bx + Math.sin(t * 1.4 + i + 1) * 14, by - 70 - (i % 3) * 18);
    ctx.stroke();
  }
  // jets
  for (let r = 0; r < ROWS; r++) {
    const j = S.jets[r];
    if (j.st === 'used') continue;
    drawJet(j.x, groundY(r) - 18, t, j.st === 'run');
  }
}
// last-ditch row clearer: a dragon lantern that sweeps the lane once
function drawJet(x, y, t, running) {
  ctx.save(); ctx.translate(x, y);
  glow(0, 0, running ? 50 : 34, 'rgba(255,170,80,.45)');
  if (running) {
    ctx.strokeStyle = 'rgba(255,200,120,.45)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-30 - i * 10, -8 + i * 8); ctx.lineTo(-70 - i * 16, -8 + i * 8); ctx.stroke(); }
  }
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 18, 22, 5, 0, 0, 7); ctx.fill();
  const g = ctx.createRadialGradient(-4, -4, 1, 0, 0, 24);
  g.addColorStop(0, '#ffd9a0'); g.addColorStop(.5, '#e0503a'); g.addColorStop(1, '#8e2418');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 24, 14, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(90,30,10,.5)'; ctx.lineWidth = 1.5;
  for (const k of [-.5, 0, .5]) { ctx.beginPath(); ctx.ellipse(0, 0, 24 * Math.abs(k) + 3, 14, 0, 0, 7); ctx.stroke(); }
  ctx.fillStyle = '#3a1d10'; ctx.fillRect(-27, -6, 4, 12);
  ctx.fillStyle = '#ffb347';
  ctx.beginPath(); ctx.moveTo(20, -12); ctx.lineTo(36, -4); ctx.lineTo(34, 6); ctx.lineTo(20, 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3a1d10'; ctx.beginPath(); ctx.arc(28, -3, 2, 0, 7); ctx.fill();
  if (!running) { ctx.fillStyle = 'rgba(255,230,160,.6)'; ctx.beginPath(); ctx.arc(40 + Math.sin(t * 3) * 2, -6 - (t * 20 % 20), 2, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ---------- drawing: creatures ----------
const INK = '#07061a';
function shadow(x, y, rx, ry) { ctx.fillStyle = 'rgba(4,3,16,.4)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); }
function pearl(x, y, r) {
  glow(x, y, r * 2.2, 'rgba(255,240,180,.55)');
  const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#fff1c4'); g.addColorStop(1, '#ffcf6a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
}
function paperLantern(x, y, rx, ry, body, deep, light) {
  if (light) glow(x, y, ry * 2.2, light);
  const g = ctx.createRadialGradient(x - rx * .3, y - ry * .3, 1, x, y, ry);
  g.addColorStop(0, '#fff4d8'); g.addColorStop(.45, body); g.addColorStop(1, deep);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(90,30,10,.5)'; ctx.lineWidth = 1.5;
  for (const k of [.4, .78]) { ctx.beginPath(); ctx.ellipse(x, y, rx * k, ry, 0, 0, 7); ctx.stroke(); }
  for (const k of [-.55, .55]) { const yy = y + ry * k, hw = rx * Math.sqrt(1 - k * k); ctx.beginPath(); ctx.moveTo(x - hw, yy); ctx.lineTo(x + hw, yy); ctx.stroke(); }
  ctx.fillStyle = '#3a1d10';
  ctx.beginPath(); ctx.roundRect(x - rx * .55, y - ry - 3, rx * 1.1, 6, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x - rx * .55, y + ry - 3, rx * 1.1, 6, 2); ctx.fill();
}
function stake(y0) { ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(0, 32); ctx.stroke(); }
function face(x, y, s) {
  ctx.fillStyle = '#5a2410';
  ctx.beginPath(); ctx.arc(x - 6 * s, y, 2.2 * s, 0, 7); ctx.arc(x + 6 * s, y, 2.2 * s, 0, 7); ctx.fill();
  ctx.strokeStyle = '#5a2410'; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.arc(x, y + 3 * s, 3.5 * s, .25, Math.PI - .25); ctx.stroke();
}
function drawClam(t, p) {
  const o = p && p.timer < 1.3 ? 1 : 0, pulse = .5 + .5 * Math.sin(t * 2);
  shadow(0, 32, 22, 5);
  stake(26);
  paperLantern(0, 0, 20, 26, '#ffc45a', '#d9792a', `rgba(255,196,90,${.35 + .15 * pulse + o * .3})`);
  face(0, 4, 1);
  if (o) pearl(Math.sin(t * 5) * 4, -40 + Math.sin(t * 7) * 2, 6);
}
function drawUrchin(t, p) {
  shadow(0, 32, 22, 5);
  stake(26);
  const sq = p && p.fire ? p.fire : 0;
  ctx.save(); ctx.scale(1 + sq * .1, 1 - sq * .08);
  ctx.fillStyle = '#3a1d10'; ctx.beginPath(); ctx.roundRect(12, -17, 18, 10, 3); ctx.fill();
  if (sq) glow(30, -12, 8 + sq * 12, 'rgba(255,230,120,.8)');
  paperLantern(0, 0, 20, 26, '#ff7a50', '#b8361f', 'rgba(255,120,80,.45)');
  face(-2, 4, .9);
  ctx.restore();
}
function drawFrost(t, p) {
  shadow(0, 32, 22, 5);
  stake(26);
  const sq = p && p.fire ? p.fire : 0;
  ctx.fillStyle = '#1d2d5a'; ctx.beginPath(); ctx.roundRect(12, -17, 18, 10, 3); ctx.fill();
  if (sq) glow(30, -12, 8 + sq * 12, 'rgba(160,210,255,.8)');
  paperLantern(0, 0, 20, 26, '#8cc8ff', '#3d6fb8', 'rgba(140,200,255,.45)');
  face(-2, 4, .9);
  ctx.fillStyle = '#e6f3ff';
  for (let i = 0; i < 3; i++) { const a = t * 1.2 + i * 2.1; ctx.globalAlpha = .5 + .5 * Math.sin(t * 3 + i); ctx.beginPath(); ctx.arc(Math.cos(a) * 30, Math.sin(a) * 22 - 4, 1.8, 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function drawCoral(t, p) {
  shadow(0, 32, 34, 7);
  const ratio = p ? p.hp / PLANTS.coral.hp : 1;
  glow(0, -4, 44, 'rgba(255,192,106,.4)');
  ctx.fillStyle = '#4a4560'; ctx.fillRect(-22, 22, 44, 10);
  ctx.fillStyle = '#5a5470'; ctx.fillRect(-10, 4, 20, 18);
  ctx.beginPath(); ctx.roundRect(-20, -14, 40, 20, 3); ctx.fill();
  ctx.fillStyle = '#ffc06a'; ctx.beginPath(); ctx.roundRect(-12, -10, 24, 12, 2); ctx.fill();
  ctx.fillStyle = '#6d6688';
  ctx.beginPath(); ctx.moveTo(-32, -13); ctx.lineTo(32, -13); ctx.lineTo(18, -26); ctx.lineTo(-18, -26); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -29, 4, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2a2638'; ctx.lineWidth = 2;
  if (ratio < .66) { ctx.beginPath(); ctx.moveTo(-16, -12); ctx.lineTo(-10, -2); ctx.lineTo(-14, 6); ctx.moveTo(-8, 6); ctx.lineTo(-4, 14); ctx.lineTo(-8, 22); ctx.stroke(); }
  if (ratio < .33) { ctx.beginPath(); ctx.moveTo(16, -12); ctx.lineTo(10, -4); ctx.lineTo(18, 4); ctx.moveTo(-26, -14); ctx.lineTo(-20, -20); ctx.stroke(); }
  const blink = Math.sin(t * 1.3) > .96;
  ctx.fillStyle = '#5a2410'; ctx.strokeStyle = '#5a2410';
  if (blink) { ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(-2, -4); ctx.moveTo(2, -4); ctx.lineTo(8, -4); ctx.stroke(); }
  else { const d = ratio < .5 ? 1.5 : 0; ctx.beginPath(); ctx.arc(-5, -4 + d, 2.2, 0, 7); ctx.arc(5, -4 + d, 2.2, 0, 7); ctx.fill(); }
}
function drawPuffer(t, p) {
  const fuse = 1.1, prog = p ? Math.min(1, 1 - p.timer / fuse) : .3;
  const r = 16 + prog * 14;
  shadow(0, 32, r * .8, 5);
  ctx.save(); ctx.translate(0, 29 - r * 1.1);
  const flash = p && p.timer < .35 && Math.floor(t * 20) % 2;
  glow(0, 0, r * 2.2, flash ? 'rgba(255,240,200,.8)' : `rgba(255,90,120,${.35 + prog * .3})`);
  paperLantern(0, 0, r * .8, r * 1.1, flash ? '#ffe3a0' : '#ff4f7b', '#a3173f', null);
  ctx.strokeStyle = '#ffcf5a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, -r * .1, r * .78, r * .2, 0, 0, Math.PI); ctx.stroke();
  ctx.strokeStyle = '#3a1d10'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -r * 1.1 - 3); ctx.quadraticCurveTo(2, -r * 1.1 - 12, 8, -r * 1.1 - 14); ctx.stroke();
  const sp = .7 + .3 * Math.sin(t * 30);
  glow(8, -r * 1.1 - 14, 8 * sp, 'rgba(255,230,140,.9)');
  ctx.fillStyle = '#fff1c4'; ctx.beginPath(); ctx.arc(8, -r * 1.1 - 14, 2, 0, 7); ctx.fill();
  face(0, r * .2, .8 + prog * .3);
  ctx.restore();
}
const PLANT_DRAW = { clam: drawClam, urchin: drawUrchin, frost: drawFrost, coral: drawCoral, puffer: drawPuffer };

// foes are shadow puppets: flat ink silhouettes, red eyes, punched holes that let the light through
function redEye(x, y, r) { glow(x, y, r * 3, 'rgba(255,60,60,.45)'); ctx.fillStyle = 'rgba(255,60,60,.95)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
function holes(x0, y, n, gap) { ctx.fillStyle = 'rgba(255,170,90,.4)'; for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x0 + i * gap, y, 1.6, 0, 7); ctx.fill(); } }
function drawCrab(f, t, bucket) {
  const w = t * 9, bob = f.eating ? Math.abs(Math.sin(w * 1.6)) * 2 : Math.abs(Math.sin(w)) * 2.5;
  shadow(0, 0, 30, 6);
  ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 3; i++) {
    const lx = -12 + i * 12, ph = f.eating ? 0 : Math.sin(w + i * 2) * 6;
    ctx.beginPath(); ctx.moveTo(lx, -16 - bob); ctx.lineTo(lx - 6 + ph * .5, -9); ctx.lineTo(lx - 4 + ph, 0); ctx.stroke();
  }
  ctx.save(); ctx.translate(0, -16 - bob);
  ctx.strokeStyle = 'rgba(7,6,26,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(10, 16 + bob); ctx.stroke();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(-18, -38, 36, 40, 6); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -38, 18, 5, 0, 0, 7); ctx.fill();
  holes(-12, -19, 5, 6);
  const snap = f.eating ? Math.abs(Math.sin(w * 1.6)) * .6 : .15;
  ctx.strokeStyle = INK; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-16, -10); ctx.lineTo(-30, -16); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.save(); ctx.translate(-34, -16);
  ctx.save(); ctx.rotate(-snap); ctx.beginPath(); ctx.ellipse(-8, -3, 11, 6, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.save(); ctx.rotate(snap); ctx.beginPath(); ctx.ellipse(-8, 4, 10, 5, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.restore();
  if (bucket) {
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(-15, -70); ctx.lineTo(15, -70); ctx.lineTo(22, -34); ctx.lineTo(-22, -34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,170,90,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillRect(-23, -38, 46, 6);
    holes(-9, -64, 4, 6);
    if (f.armor < FOES.bucket.armor * .5) { ctx.strokeStyle = 'rgba(255,170,90,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(6, -68); ctx.lineTo(1, -58); ctx.lineTo(8, -50); ctx.stroke(); }
    redEye(-10, -46, 3.5); redEye(5, -46, 3.5);
  } else {
    ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-8, -40); ctx.lineTo(-10, -52); ctx.moveTo(6, -40); ctx.lineTo(6, -52); ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-10, -54, 5.5, 0, 7); ctx.arc(6, -54, 5.5, 0, 7); ctx.fill();
    redEye(-10, -54, 3.5); redEye(6, -54, 3.5);
  }
  ctx.restore();
}
function drawEel(f, t) {
  shadow(30, 0, 50, 6);
  const N = 11, pts = [];
  for (let i = 0; i < N; i++) pts.push({ x: i * 9, y: -24 + Math.sin(t * 9 - i * .75) * 5 * (i / N + .3), r: 12 - i * .7 });
  ctx.strokeStyle = 'rgba(7,6,26,.9)'; ctx.lineWidth = 2;
  for (const i of [2, 7]) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i].x + 4, 0); ctx.stroke(); }
  ctx.fillStyle = INK;
  for (let i = N - 1; i >= 0; i--) { const q = pts[i]; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(pts[2].x, pts[2].y - 10); ctx.lineTo(pts[6].x, pts[6].y - 16); ctx.lineTo(pts[8].x, pts[8].y - 8); ctx.closePath(); ctx.fill();
  const h = pts[0];
  ctx.beginPath(); ctx.ellipse(h.x - 6, h.y, 16, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,170,90,.4)';
  for (const i of [3, 5, 7]) { const q = pts[i]; ctx.beginPath(); ctx.arc(q.x, q.y, 1.8, 0, 7); ctx.fill(); }
  const bite = f.eating ? Math.abs(Math.sin(t * 14)) * 5 : 1.5;
  ctx.fillStyle = '#1d1950'; ctx.beginPath(); ctx.moveTo(-22, h.y + 1); ctx.lineTo(-8, h.y - bite * .3); ctx.lineTo(-8, h.y + 2 + bite); ctx.closePath(); ctx.fill();
  redEye(-8, h.y - 5, 3.2);
}
function drawBlob(f, t) {
  shadow(0, 0, 40, 8);
  const sq = f.eating ? Math.sin(t * 8) * .06 : Math.sin(t * 4) * .04;
  ctx.save(); ctx.translate(0, -34); ctx.scale(1 + sq, 1 - sq);
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + .01; a += .2) {
    const r = 38 + Math.sin(a * 5 + t * 3) * 3 + (Math.sin(a) > 0 ? 4 : 0);
    const x = Math.cos(a) * r, y = Math.sin(a) * r * .9;
    a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = INK; ctx.fill();
  ctx.strokeStyle = 'rgba(255,90,90,.3)'; ctx.lineWidth = 2; ctx.stroke();
  holes(-18, 20, 6, 7);
  redEye(-14, -6, 5.5); redEye(4, -6, 5.5);
  ctx.strokeStyle = '#1d1950'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-6, 12, 10, Math.PI * 1.1, Math.PI * 1.9, false); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = INK;
  for (let i = 0; i < 3; i++) { const d = (t * 30 + i * 13) % 26; ctx.globalAlpha = 1 - d / 26; ctx.beginPath(); ctx.arc(-20 + i * 18, -4 + d * .3, 4 - d * .1, 0, 7); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function drawFoe(f) {
  const t = f.anim;
  ctx.save();
  ctx.translate(f.x + (f.hit > 0 ? rand(-1.5, 1.5) : 0), groundY(f.row));
  glow(f.k === 'eel' ? 30 : 0, -34, f.k === 'blob' ? 70 : 56, f.hit > 0 ? 'rgba(255,220,170,.35)' : 'rgba(255,150,80,.12)');
  if (f.k === 'crab') drawCrab(f, t, false);
  else if (f.k === 'bucket') drawCrab(f, t, f.armor > 0);
  else if (f.k === 'eel') drawEel(f, t);
  else drawBlob(f, t);
  if (f.slow > 0) {
    ctx.globalAlpha = .22; ctx.fillStyle = 'rgb(140,200,255)';
    ctx.beginPath(); ctx.ellipse(f.k === 'eel' ? 30 : 0, -32, f.k === 'eel' ? 56 : 34, 36, 0, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#cfe6ff'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) { const sx = -16 + i * 16, sy = -66 - (i % 2) * 6; ctx.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.moveTo(sx - Math.cos(a) * 4, sy - Math.sin(a) * 4); ctx.lineTo(sx + Math.cos(a) * 4, sy + Math.sin(a) * 4); } ctx.stroke(); }
  }
  ctx.restore();
}
