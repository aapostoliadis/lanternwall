import sys
p='lanternwall.html'; s=open(p,encoding='utf-8').read()
i=s.index('// ---------- drawing: HUD ----------'); j=s.index('// ---------- input')  if '// ---------- input' in s else None
head, hud = s[:i], s[i:]
def R(src, a, b, n=None):
    c = src.count(a)
    if c == 0: sys.exit('MISSING: '+a)
    if n is not None and c != n: sys.exit(f'COUNT {c}!={n}: '+a)
    return src.replace(a, b)
# HUD band + panels
hud=R(hud,"'rgba(3,22,30,.85)'); g.addColorStop(1, 'rgba(3,22,30,.35)')","'rgba(20,18,58,.85)'); g.addColorStop(1, 'rgba(20,18,58,.35)')",1)
hud=R(hud,"'#0b2f3b'","'#211d55'")
hud=R(hud,"'#1a6b7c'","'#3a2f78'")
hud=R(hud,"'#0f4c5c'","'#2a2566'")
hud=R(hud,"'#062633'","'#120f36'")
hud=R(hud,"'rgba(233,251,247,.15)'","'rgba(255,190,110,.18)'")
hud=R(hud,"'rgba(233,251,247,.18)'","'rgba(255,190,110,.2)'")
hud=R(hud,"'#ffd447'","'#ffb347'")
hud=R(hud,"'#e9fbf7'","'#ffe6b8'")
hud=R(hud,"'#ff8f80'","'#ff7a6a'")
hud=R(hud,"'rgba(2,14,20,.55)'","'rgba(8,6,28,.6)'")
hud=R(hud,"'#2ee6c9'); pg.addColorStop(1, '#ff7a6b')","'#ffbf7a'); pg.addColorStop(1, '#ff4f5e')",1)
hud=R(hud,"ctx.fillStyle = '#ffe6b8'; ctx.font = '17px","ctx.fillStyle = '#ffbf7a'; ctx.font = '17px",1)
# shovel: bamboo handle + iron blade
hud=R(hud,"'#9c7a52'","'#8a6a3c'",1); hud=R(hud,"'#c9d3d8'","'#6d6688'",1)
# overlay / pause / banner
hud=R(hud,"'rgba(3,22,30,.72)'","'rgba(13,11,42,.74)'",1)
hud=R(hud,"'rgba(3,22,30,.55)'","'rgba(13,11,42,.55)'",1)
hud=R(hud,"'#ffd9a0'","'#ffd58a'")
hud=R(hud,"'#ff9184' : '#ff7a6b'","'#ffb066' : '#ff9d4d'",1)
hud=R(hud,"'#3a0f0a'","'#3a1d10'",1)
hud=R(hud,"'#ff9a8a'","'#ff8a6a'",1)
# title glow behind overlay title
hud=R(hud,"  ctx.font = '78px \"Lilita One\", sans-serif';\n","  glow(W / 2, 214, 260, 'rgba(255,157,77,.22)');\n  ctx.font = '78px \"Lilita One\", sans-serif';\n",1)
# render: tints
hud=R(hud,"'rgba(255,90,70,.25)'","'rgba(255,80,60,.22)'",1)
hud=R(hud,"'rgba(255,255,255,.18)'","'rgba(255,200,120,.14)'",1)
# shots -> fireflies
old_shots=hud[hud.index('  for (const s of S.shots) {'):hud.index('  // fx')]
hud=hud.replace(old_shots,"""  for (const s of S.shots) {
    const fr = s.k === 'frost';
    glow(s.x, s.y, 16, fr ? 'rgba(150,210,255,.8)' : 'rgba(255,230,120,.8)');
    ctx.fillStyle = fr ? 'rgba(170,220,255,.35)' : 'rgba(255,230,140,.3)';
    ctx.beginPath(); ctx.ellipse(s.x - 10, s.y, 10, 3, 0, 0, 7); ctx.fill();
    ctx.fillStyle = fr ? '#e2f2ff' : '#fff3b0'; ctx.beginPath(); ctx.arc(s.x, s.y, 4.5, 0, 7); ctx.fill();
  }

""")
# ambient bubbles -> drifting fireflies
hud=R(hud,"""  ctx.strokeStyle = 'rgba(233,251,247,.22)'; ctx.lineWidth = 1.2;
  for (const b of bubbles) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); }""","""  for (const b of bubbles) {
    const fl = .4 + .6 * Math.abs(Math.sin(t * 2 + b.x * .05));
    glow(b.x, b.y, b.r * 3, `rgba(255,230,140,${.35 * fl})`);
    ctx.fillStyle = `rgba(255,243,176,${.7 * fl})`; ctx.beginPath(); ctx.arc(b.x, b.y, Math.min(2.2, b.r * .5), 0, 7); ctx.fill();
  }""",1)
# pearl halo
hud=R(hud,"ctx.globalAlpha = .35; ctx.fillStyle = '#fff3fb';","ctx.globalAlpha = .3; ctx.fillStyle = '#fff1c4';",1)
s=head+hud
# effect colours across update/input
for a,b in [("['#2f80ed', '#8cc0ff']","['#6d6688', '#ffb347']"),
            ("color: '#ffd447'","color: '#ffb347'"),
            ("['#ffd447', '#ff9f43', '#fff3c4', '#7a4b1c']","['#ffcf5a', '#ff4f7b', '#fff1c4', '#ff9d4d']"),
            ("['#bff6ff', '#7fe7ff'] : ['#5b2d8a', '#c79bff']","['#e2f2ff', '#8cc8ff'] : ['#fff3b0', '#ffcf6a']"),
            ("['#e3be82', '#ffffff', '#c9a36a']","['#ff9d4d', '#fff1c4', '#3a1d10']"),
            ("color: 'rgba(233,251,247,.8)', type: 'bubble'","color: 'rgba(255,200,120,.8)', type: 'bubble'"),
            ("['#1e1530', '#7b5cff', '#2ee6c9'] : f.k === 'eel' ? ['#6f8f4e', '#ffffff', '#a9c27e'] : ['#b8c2c8', '#e04a3f', '#e2553f']","['#07061a', '#ff3c3c', '#2a2566'] : f.k === 'eel' ? ['#07061a', '#ffb347', '#1d1950'] : ['#07061a', '#ff3c3c', '#3a2f78']")]:
    s=R(s,a,b)
s=s.replace("['#e3be82','#fff']","['#ff9d4d','#fff1c4']").replace("['#e3be82', '#fff']","['#ff9d4d', '#fff1c4']")
s=s.replace('then a sand tile','then a tile')
open(p,'w',encoding='utf-8',newline='\n').write(s); print('ok')
