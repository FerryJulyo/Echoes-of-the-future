// ====== State & Persistence ========
const LOCAL_KEY = "echoesOfFutureComplex_v1";

let state = {
  seedPlanted: false,
  flowerPlanted: false,
  treeCut: false,
  logUsed: false,
  dugKey: false,
  haveKey: false,
  chestOpened: false,
  echoes: []
};

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch {}
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

// ====== Game Logic ======

function updateScene() {
  // Past
  document.getElementById('seed').classList.toggle('hidden', state.seedPlanted);
  document.getElementById('past-tree').classList.toggle('hidden', !state.seedPlanted);

  document.getElementById('flowerSeed').classList.toggle('hidden', state.flowerPlanted);
  document.getElementById('past-flower').classList.toggle('hidden', !state.flowerPlanted);

  document.getElementById('digSpot').classList.toggle('hidden', state.dugKey);
  document.getElementById('keyFound').classList.toggle('hidden', !state.dugKey);

  // Present
  document.getElementById('present-tree').classList.toggle('hidden', !state.seedPlanted || state.treeCut);
  document.getElementById('present-stump').classList.toggle('hidden', !(state.seedPlanted && state.treeCut && !state.logUsed));
  document.getElementById('present-log').classList.toggle('hidden', !(state.treeCut && !state.logUsed));
  document.getElementById('present-flower').classList.toggle('hidden', !state.flowerPlanted);
  document.getElementById('present-key').classList.toggle('hidden', !(state.dugKey && state.haveKey));

  // Future
  if (state.logUsed) {
    document.getElementById('future-house').classList.remove('hidden');
    document.getElementById('future-stump').classList.add('hidden');
    document.getElementById('future-tree').classList.add('hidden');
  } else if (state.treeCut) {
    document.getElementById('future-stump').classList.remove('hidden');
    document.getElementById('future-tree').classList.add('hidden');
    document.getElementById('future-house').classList.add('hidden');
  } else if (state.seedPlanted) {
    document.getElementById('future-tree').classList.remove('hidden');
    document.getElementById('future-stump').classList.add('hidden');
    document.getElementById('future-house').classList.add('hidden');
  } else {
    document.getElementById('future-tree').classList.add('hidden');
    document.getElementById('future-stump').classList.add('hidden');
    document.getElementById('future-house').classList.add('hidden');
  }

  document.getElementById('future-flower').classList.toggle('hidden', !state.flowerPlanted);

  // Chest Logic
  if (state.logUsed && state.haveKey && !state.chestOpened) {
    document.getElementById('future-chest-locked').classList.remove('hidden');
    document.getElementById('future-chest-opened').classList.add('hidden');
  } else if (state.chestOpened) {
    document.getElementById('future-chest-locked').classList.add('hidden');
    document.getElementById('future-chest-opened').classList.remove('hidden');
  } else if (state.logUsed) {
    document.getElementById('future-chest-locked').classList.remove('hidden');
    document.getElementById('future-chest-opened').classList.add('hidden');
  } else {
    document.getElementById('future-chest-locked').classList.add('hidden');
    document.getElementById('future-chest-opened').classList.add('hidden');
  }

  // Key logic
  // Key only appears in present if found in past
  document.getElementById('present-key').classList.toggle('hidden', !(state.dugKey && state.haveKey));

  // Echoes
  updateEchoLog();
  saveState();
}

// ====== Actions ======

function plantSeed() {
  if (!state.seedPlanted) {
    state.seedPlanted = true;
    addEcho("🌱 Anda menanam benih pohon di masa lalu. Pohon tumbuh di masa kini & masa depan.");
    updateScene();
  }
}

function plantFlower() {
  if (!state.flowerPlanted) {
    state.flowerPlanted = true;
    addEcho("🌸 Anda menanam benih bunga di masa lalu. Bunga indah muncul di masa kini & masa depan.");
    updateScene();
  }
}

function digKey() {
  if (!state.dugKey) {
    state.dugKey = true;
    state.haveKey = true;
    addEcho("🕳️ Anda menggali dan menemukan kunci tersembunyi! Kunci bisa digunakan di masa depan.");
    updateScene();
  }
}

function cutTree() {
  if (state.seedPlanted && !state.treeCut) {
    state.treeCut = true;
    addEcho("🪓 Anda menebang pohon di masa kini. Sekarang ada tunggul & kayu. Di masa depan, pohon hilang.");
    updateScene();
  }
}

function buildHouse() {
  if (state.treeCut && !state.logUsed) {
    state.logUsed = true;
    addEcho("🏠 Anda membangun rumah kayu! Di masa depan, rumah muncul.");
    updateScene();
  }
}

function openChest() {
  if (state.logUsed && state.haveKey && !state.chestOpened) {
    state.chestOpened = true;
    addEcho("🎁 Anda membuka peti misterius di masa depan dan menemukan artefak masa depan!");
    updateScene();
  } else if (state.logUsed && !state.haveKey) {
    addEcho("❌ Peti masih terkunci. Anda membutuhkan kunci yang ditemukan di masa lalu!");
  }
}

// Echoes
function addEcho(msg) {
  state.echoes.unshift(msg);
  if (state.echoes.length > 8) state.echoes = state.echoes.slice(0, 8);
  updateEchoLog();
  saveState();
}
function updateEchoLog() {
  let log = document.getElementById('echo-log');
  log.textContent = state.echoes.join('\n');
}

// Reset
function resetProgress() {
  if (confirm("Yakin ingin mengulang progress? Semua aksi akan hilang.")) {
    localStorage.removeItem(LOCAL_KEY);
    state = {
      seedPlanted: false,
      flowerPlanted: false,
      treeCut: false,
      logUsed: false,
      dugKey: false,
      haveKey: false,
      chestOpened: false,
      echoes: []
    };
    updateScene();
  }
}

// === Pickup key in present (if found in past) ===
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('present-key').onclick = function() {
    if (state.dugKey && state.haveKey) {
      addEcho("🔑 Anda mengambil kunci ke masa depan!");
      // Key stays with player (state.haveKey = true)
      updateScene();
    }
  };
});

// ====== Start ======
window.onload = function() {
  loadState();
  updateScene();
};