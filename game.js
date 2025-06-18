// Static demo logic for Echoes of the Future

// State
let state = {
  seedPlanted: false,
  treeGrown: false,
  treeCut: false,
  logUsed: false
};

function updateScene() {
  // Past
  document.getElementById('seed').classList.toggle('hidden', state.seedPlanted);
  document.getElementById('past-tree').classList.toggle('hidden', !state.seedPlanted);

  // Present
  document.getElementById('present-tree').classList.toggle('hidden', !state.seedPlanted || state.treeCut);
  document.getElementById('present-stump').classList.toggle('hidden', !(state.seedPlanted && state.treeCut && !state.logUsed));
  document.getElementById('present-log').classList.toggle('hidden', !(state.treeCut && !state.logUsed));

  // Future
  // If the log is used for building, show the house. Otherwise, show tree or stump.
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
}

function plantSeed() {
  if (!state.seedPlanted) {
    state.seedPlanted = true;
    logEcho("You planted a seed in the past. A tree will grow in the present and future.");
    updateScene();
  }
}

function cutTree() {
  if (state.seedPlanted && !state.treeCut) {
    state.treeCut = true;
    logEcho("You cut down the tree in the present. Now there's a stump and a log. In the future, the tree is gone.");
    updateScene();
    // Offer to use the log
    setTimeout(() => {
      if (!state.logUsed) {
        logEcho("Use the log to build something?");
        document.getElementById('present-log').onclick = buildHouse;
        document.getElementById('present-log').classList.add('item');
        document.getElementById('present-log').classList.remove('hidden');
      }
    }, 1000);
  }
}

function buildHouse() {
  if (state.treeCut && !state.logUsed) {
    state.logUsed = true;
    logEcho("You used the log to build a wooden house in the future!");
    updateScene();
    document.getElementById('present-log').onclick = null;
    document.getElementById('present-log').classList.remove('item');
  }
}

function logEcho(msg) {
  const log = document.getElementById('echo-log');
  log.textContent = msg + "\n" + log.textContent;
}

window.onload = updateScene;