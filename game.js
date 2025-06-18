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
    showEnding('rich_house');
    renderAll();
  }
}
function bloomGarden() {
  if (state.flowerGrown && state.mushroomWatered && !state.gardenBloomed) {
    state.gardenBloomed = true;
    addEcho("🌺🌿 Taman mistis tumbuh karena kombinasi bunga dan jamur ajaib!");
    showEnding('mystical_garden');
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
    showEnding('artifact');
  }
}
function barrenWorld() {
  if (!state.treeSeedPlanted && !state.flowerSeedPlanted && !state.mushroomSeedPlanted && !state.barrenEnding) {
    state.barrenEnding = true;
    showEnding('barren');
  }
}
function removeFromInventory(item) {
  const idx = state.inventory.indexOf(item);
  if (idx > -1) state.inventory.splice(idx, 1);
}

// =============== ERA RENDERING ===============

function renderPast() {
  let out = [];
  // Seeds
  if (!state.treeSeedPlanted) out.push(`<div class="item" onclick="plantTreeSeed()">🌱 Benih Pohon (tanam)</div>`);
  else out.push(`<div class="item">🌱 Benih pohon tertanam</div>`);
  if (!state.flowerSeedPlanted) out.push(`<div class="item" onclick="plantFlowerSeed()">🌸 Benih Bunga (tanam)</div>`);
  else out.push(`<div class="item">🌸 Benih bunga tertanam</div>`);
  if (!state.mushroomSeedPlanted) out.push(`<div class="item" onclick="plantMushroomSeed()">🍄 Benih Jamur (tanam)</div>`);
  else out.push(`<div class="item">🍄 Benih jamur tertanam</div>`);
  // Shovel
  if (!state.shovelTaken) out.push(`<div class="item" onclick="takeShovel()">🛠️ Sekop (ambil)</div>`);
  // Fertilizer
  if (!state.fertilizerTaken) out.push(`<div class="item" onclick="takeFertilizer()">🌾 Pupuk Kuno (ambil)</div>`);
  // Water
  if (!state.waterDrawn) out.push(`<div class="item" onclick="drawWater()">💧 Sumur Air (ambil air)</div>`);
  // Dig Key
  if (state.shovelTaken && !state.keyDug) out.push(`<div class="item" onclick="digKey()">🕳️ Tanah Longgar (gali: cari sesuatu)</div>`);
  if (state.keyDug && !state.keyTaken) out.push(`<div class="item" onclick="takeKey()">🔑 Kunci Terkubur (ambil)</div>`);
  // Fertilizer use
  if (state.fertilizerTaken && state.treeSeedPlanted && !state.fertilizerGiven)
    out.push(`<div class="item" onclick="applyFertilizer()">🌾 Pupuk pohon</div>`);
  // Show inventory
  out.push(renderInventory());
  document.getElementById('scene-past').innerHTML = out.join('');
}
function renderPresent() {
  let out = [];
  // Tree grows if planted in past
  if (state.treeSeedPlanted && !state.treeCut) {
    out.push(`<div class="item">🌳 Pohon besar tumbuh</div>`);
    state.treeGrown = true;
    if (state.fertilizerGiven) out.push(`<div class="item">🌱 Pohon tampak luar biasa subur!</div>`);
    out.push(`<div class="item" onclick="cutTree()">🪓 Tebang pohon (butuh sekop di inventory)</div>`);
  }
  if (state.treeCut && !state.logTaken)
    out.push(`<div class="item" onclick="takeLog()">🪵 Kayu hasil tebang (ambil)</div>`);
  if (state.logTaken) out.push(`<div class="item">🪵 Kayu di inventory</div>`);
  // Stone
  if (state.treeCut && !state.stoneMoved)
    out.push(`<div class="item" onclick="moveStone()">🪨 Batu besar (sekarang bisa dipindahkan)</div>`);
  if (state.stoneMoved) out.push(`<div class="item">🪨 Batu telah dipindahkan</div>`);
  // Flower
  if (state.flowerSeedPlanted) {
    state.flowerGrown = true;
    out.push(`<div class="item">🌸 Bunga bermekaran</div>`);
  }
  // Mushroom
  if (state.mushroomSeedPlanted && !state.mushroomWatered) {
    out.push(`<div class="item" onclick="waterMushroom()">🍄 Jamur tumbuh (sirami dengan air)</div>`);
  }
  if (state.mushroomWatered) out.push(`<div class="item">🍄 Jamur ajaib (disiram air)</div>`);
  // Show inventory
  out.push(renderInventory());
  document.getElementById('scene-present').innerHTML = out.join('');
}
function renderFuture() {
  let out = [];
  if (state.houseBuilt) out.push(`<div class="item">🏠 Rumah Mewah Berdiri</div>`);
  if (state.gardenBloomed) out.push(`<div class="item">🌺🌿 Taman Mistis Mekar</div>`);
  if (state.artifactFound) out.push(`<div class="item">🗿 Artefak Kuno ditemukan!</div>`);
  // Barren
  if (state.barrenEnding) out.push(`<div class="item">💀 Tanah tandus. Tidak ada kehidupan...</div>`);
  // Chest only appears if stone moved
  if (state.stoneMoved && !state.chestOpened)
    out.push(`<div class="item" onclick="openChest()">🗝️ Peti Terkubur (buka dengan kunci)</div>`);
  if (state.chestOpened && !state.artifactFound)
    out.push(`<div class="item">🎁 Peti telah terbuka (periksa: artefak?)</div>`);
  // Garden (ending)
  if (state.flowerGrown && state.mushroomWatered && !state.gardenBloomed)
    out.push(`<div class="item" onclick="bloomGarden()">🌺🌿 Taman Mistis (bloom!)</div>`);
  // House (ending)
  if (state.logTaken && state.keyTaken && !state.houseBuilt)
    out.push(`<div class="item" onclick="buildHouse()">🏠 Bangun rumah mewah (butuh kayu & kunci)</div>`);
  // Barren world ending (no seeds planted at all)
  if (!state.treeSeedPlanted && !state.flowerSeedPlanted && !state.mushroomSeedPlanted && !state.barrenEnding)
    out.push(`<div class="item" onclick="barrenWorld()">💀 Tidak ada kehidupan... (ending buruk)</div>`);
  // Show inventory
  out.push(renderInventory());
  document.getElementById('scene-future').innerHTML = out.join('');
}
function renderInventory() {
  if (state.inventory.length === 0) return `<div class="item" style="opacity:.6;">[Inventory kosong]</div>`;
  return `<div class="item" style="background:#111a;">🎒 Inventory: ${state.inventory.join(', ')}</div>`;
}

function showEnding(type) {
  if (state.ending === type) return;
  state.ending = type;
  let el = document.getElementById('ending');
  let txt = '';
  switch (type) {
    case 'rich_house':
      txt = `<div class="ending-title">🏠 Ending: Rumah Mewah</div>Anda berhasil membangun rumah mewah di masa depan dengan memanfaatkan sumber daya masa lalu dan masa kini secara optimal.<br><br>Kemakmuran menanti keluargamu!`;
      break;
    case 'mystical_garden':
      txt = `<div class="ending-title">🌸 Ending: Taman Mistis</div>Perpaduan bunga dan jamur ajaib menciptakan taman abadi penuh keajaiban di masa depan!<br><br>Lingkunganmu jadi surga alami.`;
      break;
    case 'artifact':
      txt = `<div class="ending-title">🗿 Ending: Artefak Kuno</div>Anda menemukan artefak kuno yang mengubah sejarah dan membuka rahasia dunia.<br><br>Pengetahuan dan kebijaksanaan masa lalu menjadi milikmu.`;
      break;
    case 'barren':
      txt = `<div class="ending-title">💀 Ending: Dunia Tandus</div>Karena tidak ada yang ditanam, masa depan menjadi tandus, kering, dan sunyi.<br><br>Lingkungan gagal berkembang tanpa tindakanmu di masa lalu.`;
      break;
    default:
      txt = '';
  }
  el.innerHTML = txt;
  el.classList.remove('hidden');
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