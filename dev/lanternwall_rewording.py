import sys
p='lanternwall.html'; s=open(p,encoding='utf-8').read()
reps=[
("Pick a creature card, then a tile. Tap pearls to collect them. Keys: <b>1–5</b> creatures,","Pick a lantern card, then a tile. Tap fireflies to catch them. Keys: <b>1–5</b> lanterns,"),
("name: 'Pearl Clam',   ","name: 'Firefly Lantern',"),
("name: 'Spine Urchin', ","name: 'Ember Lantern',  "),
("name: 'Frost Anemone',","name: 'Frost Lantern',  "),
("name: 'Brain Coral',  ","name: 'Stone Lantern',  "),
("name: 'Puffer',       ","name: 'Firecracker',    "),
("banner('A huge tide is rising!', 'Tide ' + n)","banner('A long dark is falling!', 'Night ' + n)"),
("else banner('Tide ' + n);","else banner('Night ' + n);"),
("`Tide ${S.wave} · endless` : S.wave === 0 ? 'Calm water' : `Tide ${","`Night ${S.wave} · endless` : S.wave === 0 ? 'Quiet dusk' : `Night ${"),
("label: 'Defend the reef'","label: 'Light the garden'"),
("['Trash is drifting in on the tide. Plant reef creatures to hold the line.', 'Clams make pearls · urchins shoot spines · anemones freeze · puffers burst']",
 "['Shadows are creeping in from the dark. Plant paper lanterns to hold the line.', 'Firefly lanterns gather light · ember lanterns shoot sparks · frost lanterns chill · firecrackers burst']"),
("overlay('Reef overrun', [`The tide reached the grotto on tide ${S.wave}.`, `You cleared ${S.kills} pieces of trash.`]",
 "overlay('Garden lost', [`The shadows reached the teahouse on night ${S.wave}.`, `You banished ${S.kills} shadows.`]"),
("overlay('Reef saved!', [`All ${TOTAL_WAVES} tides held back. ${S.kills} pieces of trash cleared.`, 'Stay on and see how long the reef can last.']",
 "overlay('Dawn breaks!', [`All ${TOTAL_WAVES} nights held. ${S.kills} shadows banished.`, 'Stay on and see how long the lanterns can burn.']"),
("${S.kills} cleared`","${S.kills} banished`"),
]
for a,b in reps:
    if s.count(a)!=1: sys.exit(f'COUNT {s.count(a)}: {a}')
    s=s.replace(a,b)
open(p,'w',encoding='utf-8',newline='\n').write(s); print('ok')
