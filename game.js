const LOCAL_KEY = "echoesOfFutureUltimate_v1";

let state = {
  // Items/Actions (past)
  treeSeedPlanted: false,
  flowerSeedPlanted: false,
  mushroomSeedPlanted: false,
  shovelTaken: false,
  waterDrawn: false,
  fertilizerTaken: false,
  keyDug: false,
  keyTaken: false,
  // Items/Actions (present)
  treeGrown: false,
  flowerGrown: false,
  mushroomGrown: false,
  treeCut: false,
  logTaken: false,
  waterGiven: false,
  mushroomWatered: false,
  fertilizerGiven: false,
  stoneMoved: false,
  // Items/Actions (future)
  houseBuilt: false,
  gardenBloomed: false,
  chestOpened: false,
  artifactFound: false,
  barrenEnding: false,
  // Inventory
  inventory: [],
  echoes: [],
  ending: null
};

function saveState() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}
function loadState() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try {
      Object.assign(state, JSON.parse(saved));
    } catch {}
  }
}

function resetProgress() {
  if (confirm("Yakin ingin mengulang progress? Semua aksi akan hilang.")) {
    localStorage.removeItem(LOCAL_KEY);
    Object.assign(state, {
      treeSeedPlanted: false,
      flowerSeedPlanted: false,
      mushroomSeedPlanted: false,
      shovelTaken: false,
      waterDrawn: false,
      fertilizerTaken: false,
      keyDug: false,
      keyTaken: false,
      treeGrown: false,
      flowerGrown: false,
      mushroomGrown: false,
      treeCut: false,
      logTaken: false,
      waterGiven: false,
      mushroomWatered: false,
      fertilizerGiven: false,
      stoneMoved: false,
      houseBuilt: false,
      gardenBloomed: false,
      chestOpened: false,
      artifactFound: false,
      barrenEnding: false,
      inventory: [],
      echoes: [],
      ending: null
    });
    renderAll();
    document.getElementById('ending').classList.add('hidden');
  }
}

function addEcho(msg) {
  state.echoes.unshift(msg);
  state.echoes = state.echoes.slice(0, 12);
  renderEchoes();
}

function renderEchoes() {
  document.getElementById('echo-log').textContent = state.echoes.join('\n');
}

// =================== PUZZLE ACTIONS ===================

function takeShovel() {
  if (!state.shovelTaken) {
    state.shovelTaken = true;
    state.inventory.push('shovel');
    addEcho("🛠️ Anda mengambil sekop di masa lalu.");
    renderAll();
  }
}
function takeFertilizer() {
  if (!state.fertilizerTaken) {
    state.fertilizerTaken = true;
    state.inventory.push('fertilizer');
    addEcho("🌾 Anda mengambil pupuk kuno.");
    renderAll();
  }
}
function plantTreeSeed() {
  if (!state.treeSeedPlanted) {
    state.treeSeedPlanted = true;
    addEcho("🌱 Anda menanam benih pohon di masa lalu.");
    renderAll();
  }
}
function plantFlowerSeed() {
  if (!state.flowerSeedPlanted) {
    state.flowerSeedPlanted = true;
    addEcho("🌸 Anda menanam benih bunga. Efeknya indah di masa depan!");
    renderAll();
  }
}
function plantMushroomSeed() {
  if (!state.mushroomSeedPlanted) {
    state.mushroomSeedPlanted = true;
    addEcho("🍄 Anda menanam benih jamur misterius.");
    renderAll();
  }
}
function drawWater() {
  if (!state.waterDrawn) {
    state.waterDrawn = true;
    state.inventory.push('water');
    addEcho("💧 Anda mengambil air dari sumur kuno.");
    renderAll();
  }
}
function digKey() {
  if (state.shovelTaken && !state.keyDug) {
    state.keyDug = true;
    addEcho("🔑 Anda menggali dan menemukan kunci kuno!");
    renderAll();
  }
}
function takeKey() {
  if (state.keyDug && !state.keyTaken) {
    state.keyTaken = true;
    state.inventory.push('key');
    addEcho("🔑 Anda mengambil kunci ke masa kini/masa depan.");
    renderAll();
  }
}
function applyFertilizer() {
  if (state.fertilizerTaken && state.treeSeedPlanted && !state.fertilizerGiven) {
    state.fertilizerGiven = true;
    addEcho("🌾 Anda memupuk pohon. Pohon tumbuh lebih besar di masa depan!");
    renderAll();
  }
}
function cutTree() {
  if (state.treeGrown && !state.treeCut && state.inventory.includes('shovel')) {
    state.treeCut = true;
    addEcho("🪓 Pohon besar ditebang. Anda mendapatkan kayu dan dapat memindahkan batu.");
    state.inventory.push('log');
    renderAll();
  }
}
function takeLog() {
  if (state.treeCut && !state.logTaken) {
    state.logTaken = true;
    state.inventory.push('log');
    addEcho("🪵 Anda mengambil kayu hasil tebang.");
    renderAll();
  }
}
function moveStone() {
  if (state.treeCut && !state.stoneMoved) {
    state.stoneMoved = true;
    addEcho("🪨 Batu besar berhasil dipindahkan (karena pohon tidak menghalangi lagi). Area rahasia terbuka di masa depan!");
    renderAll();
  }
}
function waterMushroom() {
  if (state.mushroomSeedPlanted && state.inventory.includes('water') && !state.mushroomWatered) {
    state.mushroomWatered = true;
    removeFromInventory('water');
    addEcho("💧 Anda menyiram jamur. Jamur tumbuh subur dan berubah di masa depan.");
    renderAll();
  }
}
function buildHouse() {
  if (state.logTaken && state.keyTaken && !state.houseBuilt) {
    state.houseBuilt = true;
    addEcho("🏠 Anda membangun rumah mewah di masa depan dengan kayu dan membuka pintu dengan kunci.");
    showEnding();
    renderAll();
  }
}
function bloomGarden() {
  if (state.flowerGrown && state.mushroomWatered && !state.gardenBloomed) {
    state.gardenBloomed = true;
    addEcho("🌺🌿 Taman mistis tumbuh karena kombinasi bunga dan jamur ajaib!");
    showEnding();
    renderAll();
  }
}
function openChest() {
  if (state.stoneMoved && state.keyTaken && !state.chestOpened) {
    state.chestOpened = true;
    addEcho("🗝️ Anda membuka peti tersembunyi di balik batu. Artefak kuno ditemukan!");
    artifactFound();
    renderAll();
  }
}
function artifactFound() {
  if (state.chestOpened && !state.artifactFound) {
    state.artifactFound = true;
    showEnding();
  }
}
function barrenWorld() {
  if (!state.treeSeedPlanted && !state.flowerSeedPlanted && !state.mushroomSeedPlanted && !state.barrenEnding) {
    state.barrenEnding = true;
    showEnding();
  }
}
function removeFromInventory(item) {
  const idx = state.inventory.indexOf(item);
  if (idx > -1) state.inventory.splice(idx, 1);
}

// =================== ENDINGS LOGIC ===================

// Ending registry
const ENDINGS = [
  // Major endings
  {key:'rich_house', title:'🏠 Rumah Mewah', desc:'Kamu membangun rumah mewah di masa depan.'},
  {key:'mystical_garden', title:'🌸 Taman Mistis', desc:'Taman abadi penuh keajaiban.'},
  {key:'artifact', title:'🗿 Artefak Kuno', desc:'Kamu menemukan artefak kuno.'},
  {key:'barren', title:'💀 Dunia Tandus', desc:'Masa depan kering dan sunyi.'},
];

// Kombinasi aksi utama untuk ending dinamis
const actions = [
  {key:'tree', label:'menanam pohon'},
  {key:'flower', label:'menanam bunga'},
  {key:'mushroom', label:'menanam jamur'},
  {key:'water', label:'mengambil air'},
  {key:'shovel', label:'mengambil sekop'},
  {key:'key', label:'mengambil kunci'},
  {key:'fertilizer', label:'mengambil pupuk'},
  {key:'cut', label:'menebang pohon'},
  {key:'move_stone', label:'memindahkan batu'},
];

// Fun and special endings
const funEndings = [
  {name:"Ending Pencinta Alam", logic:(s)=>s.treeSeedPlanted&&s.flowerSeedPlanted&&s.mushroomSeedPlanted&&!s.treeCut&&!s.barrenEnding, desc:"Lingkunganmu sangat lestari karena semua tanaman tumbuh dan tidak ada yang ditebang."},
  {name:"Ending Tukang Tebang", logic:(s)=>s.treeSeedPlanted&&s.treeCut&&!s.flowerSeedPlanted, desc:"Kamu menanam pohon hanya untuk ditebang demi kayu, tanpa memperhatikan keindahan."},
  {name:"Ending Tukang Batu", logic:(s)=>s.stoneMoved&&!s.treeCut, desc:"Kamu lebih suka memindahkan batu daripada menebang pohon, sangat kreatif!"},
  {name:"Ending Jamur Beracun", logic:(s)=>s.mushroomSeedPlanted&&!s.mushroomWatered, desc:"Jamur tumbuh liar, sayangnya tidak pernah disiram hingga menjadi beracun."},
  {name:"Ending Pemburu Artefak", logic:(s)=>s.artifactFound&&!s.houseBuilt, desc:"Tujuanmu hanya mencari harta karun, bukan membangun masa depan."},
  {name:"Ending Kunci Hilang", logic:(s)=>!s.keyDug&&s.chestOpened, desc:"Bagaimana kamu bisa membuka peti tanpa pernah menemukan kunci? Aneh!"},
  {name:"Ending Kebun Suram", logic:(s)=>s.flowerSeedPlanted&&!s.flowerGrown, desc:"Bunga ditanam, tapi gagal tumbuh. Mungkin kurang perhatian?"},
  {name:"Ending Tukang Siram Batu", logic:(s)=>s.waterDrawn&&s.stoneMoved&&s.mushroomSeedPlanted&&!s.flowerSeedPlanted, desc:"Kamu lebih suka menyiram jamur di balik batu daripada menanam bunga."},
];

// Generate 200+ endings secara dinamis
(function generateDynamicEndings(){
  let id = 1;
  // Kombinasi 2 aksi
  actions.forEach(a=>{
    actions.forEach(b=>{
      if(a.key!==b.key) ENDINGS.push({
        key:`combo_${a.key}_${b.key}`,
        title:`${a.label[0].toUpperCase()+a.label.slice(1)} & ${b.label}`,
        desc:`Kamu ${a.label} lalu ${b.label}. Masa depan berubah dengan cara unik. [Ending #${id++}]`
      });
    });
  });
  // Kombinasi 3 aksi
  for(let i=0;i<actions.length;i++){
    for(let j=0;j<actions.length;j++){
      for(let k=0;k<actions.length;k++){
        if(i!==j&&j!==k&&i!==k){
          ENDINGS.push({
            key:`combo_${actions[i].key}_${actions[j].key}_${actions[k].key}`,
            title:`${actions[i].label}, ${actions[j].label}, lalu ${actions[k].label}`,
            desc:`Urutan unik! Masa depan penuh keanehan. [Ending #${id++}]`
          });
        }
      }
    }
  }
  // Fun endings
  funEndings.forEach((e,idx)=>ENDINGS.push({
    key:`fun_${idx+1}`,
    title:e.name,
    desc:e.desc,
    logic:e.logic
  }));
  // Easter egg endings
  for(let i=1;i<=40;i++){
    ENDINGS.push({
      key:`egg_${i}`,
      title:`🥚 Easter Egg #${i}`,
      desc:`Kamu menemukan ending rahasia ke-${i}!`
    });
  }
})();

function evaluateEnding() {
  // Priority: fun endings with logic
  for(const e of ENDINGS){
    if(typeof e.logic==='function' && e.logic(state)) return e;
  }
  // Kombinasi aksi
  const acts = [];
  if(state.treeSeedPlanted) acts.push('tree');
  if(state.flowerSeedPlanted) acts.push('flower');
  if(state.mushroomSeedPlanted) acts.push('mushroom');
  if(state.waterDrawn) acts.push('water');
  if(state.shovelTaken) acts.push('shovel');
  if(state.keyDug || state.keyTaken) acts.push('key');
  if(state.fertilizerTaken) acts.push('fertilizer');
  if(state.treeCut) acts.push('cut');
  if(state.stoneMoved) acts.push('move_stone');
  // Try 3-action ending
  if(acts.length>=3){
    const k = `combo_${acts[0]}_${acts[1]}_${acts[2]}`;
    const e = ENDINGS.find(e=>e.key===k);
    if(e) return e;
  }
  // Try 2-action ending
  if(acts.length>=2){
    const k = `combo_${acts[0]}_${acts[1]}`;
    const e = ENDINGS.find(e=>e.key===k);
    if(e) return e;
  }
  // Easter egg jika inventory penuh item
  if(state.inventory.length>=5)
    return ENDINGS.find(e=>e.key==='egg_10');
  // Default endings
  if(state.houseBuilt) return ENDINGS.find(e=>e.key==='rich_house');
  if(state.gardenBloomed) return ENDINGS.find(e=>e.key==='mystical_garden');
  if(state.artifactFound) return ENDINGS.find(e=>e.key==='artifact');
  if(state.barrenEnding) return ENDINGS.find(e=>e.key==='barren');
  // Random ending
  const randIdx = Math.floor(Math.random()*40)+ENDINGS.length-40;
  return ENDINGS[randIdx];
}

function showEnding(type){
  let ending;
  if(typeof type==='string'){
    ending = ENDINGS.find(e=>e.key===type);
  }else{
    ending = evaluateEnding();
  }
  if(!ending) ending = {title:'Ending Tidak Diketahui', desc:'Sesuatu yang unik terjadi!'};
  state.ending = ending.key;
  let el = document.getElementById('ending');
  el.innerHTML = `<div class="ending-title">${ending.title}</div>${ending.desc}`;
  el.classList.remove('hidden');
  saveState();
}

// =============== ERA RENDERING ===============

function renderPast() {
  let out = [];
  if (!state.treeSeedPlanted) out.push(`<div class="item" onclick="plantTreeSeed()">🌱 Benih Pohon (tanam)</div>`);
  else out.push(`<div class="item">🌱 Benih pohon tertanam</div>`);
  if (!state.flowerSeedPlanted) out.push(`<div class="item" onclick="plantFlowerSeed()">🌸 Benih Bunga (tanam)</div>`);
  else out.push(`<div class="item">🌸 Benih bunga tertanam</div>`);
  if (!state.mushroomSeedPlanted) out.push(`<div class="item" onclick="plantMushroomSeed()">🍄 Benih Jamur (tanam)</div>`);
  else out.push(`<div class="item">🍄 Benih jamur tertanam</div>`);
  if (!state.shovelTaken) out.push(`<div class="item" onclick="takeShovel()">🛠️ Sekop (ambil)</div>`);
  if (!state.fertilizerTaken) out.push(`<div class="item" onclick="takeFertilizer()">🌾 Pupuk Kuno (ambil)</div>`);
  if (!state.waterDrawn) out.push(`<div class="item" onclick="drawWater()">💧 Sumur Air (ambil air)</div>`);
  if (state.shovelTaken && !state.keyDug) out.push(`<div class="item" onclick="digKey()">🕳️ Tanah Longgar (gali: cari sesuatu)</div>`);
  if (state.keyDug && !state.keyTaken) out.push(`<div class="item" onclick="takeKey()">🔑 Kunci Terkubur (ambil)</div>`);
  if (state.fertilizerTaken && state.treeSeedPlanted && !state.fertilizerGiven)
    out.push(`<div class="item" onclick="applyFertilizer()">🌾 Pupuk pohon</div>`);
  out.push(renderInventory());
  document.getElementById('scene-past').innerHTML = out.join('');
}
function renderPresent() {
  let out = [];
  if (state.treeSeedPlanted && !state.treeCut) {
    out.push(`<div class="item">🌳 Pohon besar tumbuh</div>`);
    state.treeGrown = true;
    if (state.fertilizerGiven) out.push(`<div class="item">🌱 Pohon tampak luar biasa subur!</div>`);
    out.push(`<div class="item" onclick="cutTree()">🪓 Tebang pohon (butuh sekop di inventory)</div>`);
  }
  if (state.treeCut && !state.logTaken)
    out.push(`<div class="item" onclick="takeLog()">🪵 Kayu hasil tebang (ambil)</div>`);
  if (state.logTaken) out.push(`<div class="item">🪵 Kayu di inventory</div>`);
  if (state.treeCut && !state.stoneMoved)
    out.push(`<div class="item" onclick="moveStone()">🪨 Batu besar (sekarang bisa dipindahkan)</div>`);
  if (state.stoneMoved) out.push(`<div class="item">🪨 Batu telah dipindahkan</div>`);
  if (state.flowerSeedPlanted) {
    state.flowerGrown = true;
    out.push(`<div class="item">🌸 Bunga bermekaran</div>`);
  }
  if (state.mushroomSeedPlanted && !state.mushroomWatered) {
    out.push(`<div class="item" onclick="waterMushroom()">🍄 Jamur tumbuh (sirami dengan air)</div>`);
  }
  if (state.mushroomWatered) out.push(`<div class="item">🍄 Jamur ajaib (disiram air)</div>`);
  out.push(renderInventory());
  document.getElementById('scene-present').innerHTML = out.join('');
}
function renderFuture() {
  let out = [];
  if (state.houseBuilt) out.push(`<div class="item">🏠 Rumah Mewah Berdiri</div>`);
  if (state.gardenBloomed) out.push(`<div class="item">🌺🌿 Taman Mistis Mekar</div>`);
  if (state.artifactFound) out.push(`<div class="item">🗿 Artefak Kuno ditemukan!</div>`);
  if (state.barrenEnding) out.push(`<div class="item">💀 Tanah tandus. Tidak ada kehidupan...</div>`);
  if (state.stoneMoved && !state.chestOpened)
    out.push(`<div class="item" onclick="openChest()">🗝️ Peti Terkubur (buka dengan kunci)</div>`);
  if (state.chestOpened && !state.artifactFound)
    out.push(`<div class="item">🎁 Peti telah terbuka (periksa: artefak?)</div>`);
  if (state.flowerGrown && state.mushroomWatered && !state.gardenBloomed)
    out.push(`<div class="item" onclick="bloomGarden()">🌺🌿 Taman Mistis (bloom!)</div>`);
  if (state.logTaken && state.keyTaken && !state.houseBuilt)
    out.push(`<div class="item" onclick="buildHouse()">🏠 Bangun rumah mewah (butuh kayu & kunci)</div>`);
  if (!state.treeSeedPlanted && !state.flowerSeedPlanted && !state.mushroomSeedPlanted && !state.barrenEnding)
    out.push(`<div class="item" onclick="barrenWorld()">💀 Tidak ada kehidupan... (ending buruk)</div>`);
  // AUTO-EVALUATE ending jika sudah mencapai sebuah kondisi
  // (misal: jika sudah membangun rumah, taman, artefak, atau barren, tampilkan ending)
  if (
    state.houseBuilt ||
    state.gardenBloomed ||
    state.artifactFound ||
    state.barrenEnding ||
    (state.inventory.length >= 5)
  ) {
    showEnding();
  }
  out.push(renderInventory());
  document.getElementById('scene-future').innerHTML = out.join('');
}
function renderInventory() {
  if (state.inventory.length === 0) return `<div class="item" style="opacity:.6;">[Inventory kosong]</div>`;
  return `<div class="item" style="background:#111a;">🎒 Inventory: ${state.inventory.join(', ')}</div>`;
}

// =============== RENDER =================

function renderAll() {
  saveState();
  renderPast();
  renderPresent();
  renderFuture();
  renderEchoes();
}

window.onload = function() {
  loadState();
  renderAll();
};

window.plantTreeSeed = plantTreeSeed;
window.plantFlowerSeed = plantFlowerSeed;
window.plantMushroomSeed = plantMushroomSeed;
window.takeShovel = takeShovel;
window.takeFertilizer = takeFertilizer;
window.drawWater = drawWater;
window.digKey = digKey;
window.takeKey = takeKey;
window.cutTree = cutTree;
window.takeLog = takeLog;
window.moveStone = moveStone;
window.applyFertilizer = applyFertilizer;
window.waterMushroom = waterMushroom;
window.buildHouse = buildHouse;
window.bloomGarden = bloomGarden;
window.openChest = openChest;
window.resetProgress = resetProgress;
window.barrenWorld = barrenWorld;