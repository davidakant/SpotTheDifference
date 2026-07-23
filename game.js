'use strict';

/* =========================================================================
   Spot the Difference — single-page app
   Views:  Collections  ->  Collection (image grid)  ->  Game (2-up)
   Progress (found differences per set) persists in localStorage.
   ========================================================================= */

/* ---- Set definitions -----------------------------------------------------
   Zones are normalized to the source image (0..1): cx,cy = center,
   rx,ry = radii (ellipse) as a fraction of image width/height.
   Extracted from each NN_HIT.png (848 x 1264).                             */
const SETS = {
  '01': {
    a: '01_A.png', b: '01_B.png',
    zones: [
      { cx: 0.2455, cy: 0.0536, rx: 0.0407, ry: 0.0273 },
      { cx: 0.5887, cy: 0.2612, rx: 0.0348, ry: 0.0233 },
      { cx: 0.4884, cy: 0.3411, rx: 0.0531, ry: 0.0356 },
      { cx: 0.8205, cy: 0.3528, rx: 0.0354, ry: 0.0447 },
      { cx: 0.7085, cy: 0.4294, rx: 0.0348, ry: 0.0233 },
      { cx: 0.3748, cy: 0.4943, rx: 0.0407, ry: 0.0273 },
      { cx: 0.1849, cy: 0.6850, rx: 0.0584, ry: 0.0392 },
      { cx: 0.6594, cy: 0.6945, rx: 0.0348, ry: 0.0233 },
      { cx: 0.9031, cy: 0.7617, rx: 0.0348, ry: 0.0233 },
      { cx: 0.2568, cy: 0.9598, rx: 0.0584, ry: 0.0392 },
    ],
  },
  '02': {
    a: '02_A.png', b: '02_B.png',
    zones: [
      { cx: 0.6279, cy: 0.1717, rx: 0.0295, ry: 0.0194 },
      { cx: 0.0463, cy: 0.2722, rx: 0.0489, ry: 0.0360 },
      { cx: 0.7962, cy: 0.4565, rx: 0.0413, ry: 0.0273 },
      { cx: 0.3491, cy: 0.4569, rx: 0.0206, ry: 0.0134 },
      { cx: 0.9419, cy: 0.5404, rx: 0.0472, ry: 0.0313 },
      { cx: 0.6361, cy: 0.5470, rx: 0.0590, ry: 0.0396 },
      { cx: 0.1182, cy: 0.5626, rx: 0.0472, ry: 0.0313 },
      { cx: 0.1560, cy: 0.7327, rx: 0.0236, ry: 0.0162 },
      { cx: 0.4766, cy: 0.7972, rx: 0.0879, ry: 0.0593 },
      { cx: 0.4882, cy: 0.9027, rx: 0.0289, ry: 0.0194 },
    ],
  },
  '03': {
    a: '03_A.png', b: '03_B.png',
    zones: [
      { cx: 0.5676, cy: 0.0482, rx: 0.1462, ry: 0.0566 },
      { cx: 0.2166, cy: 0.2128, rx: 0.0731, ry: 0.0494 },
      { cx: 0.3659, cy: 0.2931, rx: 0.0731, ry: 0.0491 },
      { cx: 0.2161, cy: 0.3209, rx: 0.0584, ry: 0.0396 },
      { cx: 0.8982, cy: 0.4583, rx: 0.0731, ry: 0.0491 },
      { cx: 0.1130, cy: 0.5262, rx: 0.0731, ry: 0.0491 },
      { cx: 0.7226, cy: 0.6327, rx: 0.0407, ry: 0.0273 },
      { cx: 0.1149, cy: 0.6909, rx: 0.0731, ry: 0.0491 },
      { cx: 0.2998, cy: 0.9032, rx: 0.0879, ry: 0.0589 },
      { cx: 0.9282, cy: 0.9535, rx: 0.0719, ry: 0.0475 },
    ],
  },
  '04': {
    a: '04_A.png', b: '04_B.png',
    zones: [
      { cx: 0.5719, cy: 0.0757, rx: 0.1173, ry: 0.0771 },
      { cx: 0.3950, cy: 0.3236, rx: 0.0407, ry: 0.0273 },
      { cx: 0.2094, cy: 0.4252, rx: 0.0731, ry: 0.0491 },
      { cx: 0.6679, cy: 0.4396, rx: 0.0531, ry: 0.0356 },
      { cx: 0.2613, cy: 0.5764, rx: 0.0654, ry: 0.0704 },
      { cx: 0.1297, cy: 0.6930, rx: 0.0525, ry: 0.0352 },
      { cx: 0.5022, cy: 0.7134, rx: 0.0731, ry: 0.0491 },
      { cx: 0.3301, cy: 0.7155, rx: 0.0525, ry: 0.0356 },
      { cx: 0.8304, cy: 0.7385, rx: 0.0584, ry: 0.0396 },
      { cx: 0.4843, cy: 0.9214, rx: 0.1173, ry: 0.0783 },
    ],
  },
  '05': {
    a: '05_A.png', b: '05_B.png',
    zones: [
      { cx: 0.4211, cy: 0.0829, rx: 0.0377, ry: 0.0653 },
      { cx: 0.2985, cy: 0.2128, rx: 0.0466, ry: 0.0313 },
      { cx: 0.8436, cy: 0.2412, rx: 0.0348, ry: 0.0233 },
      { cx: 0.4922, cy: 0.3604, rx: 0.0531, ry: 0.0356 },
      { cx: 0.2779, cy: 0.5187, rx: 0.0531, ry: 0.0356 },
      { cx: 0.1190, cy: 0.6834, rx: 0.0584, ry: 0.0392 },
      { cx: 0.3580, cy: 0.7449, rx: 0.0731, ry: 0.0491 },
      { cx: 0.5145, cy: 0.7508, rx: 0.0584, ry: 0.0392 },
      { cx: 0.9338, cy: 0.7813, rx: 0.0584, ry: 0.0396 },
      { cx: 0.5783, cy: 0.9097, rx: 0.0879, ry: 0.0589 },
    ],
  },
  '06': {
    a: '06_A.png', b: '06_B.png',
    zones: [
      { cx: 0.8050, cy: 0.1299, rx: 0.0295, ry: 0.0198 },
      { cx: 0.8519, cy: 0.3037, rx: 0.0295, ry: 0.0198 },
      { cx: 0.4002, cy: 0.5101, rx: 0.0472, ry: 0.0313 },
      { cx: 0.1628, cy: 0.5497, rx: 0.0466, ry: 0.0313 },
      { cx: 0.7652, cy: 0.5504, rx: 0.0466, ry: 0.0313 },
      { cx: 0.4012, cy: 0.5654, rx: 0.0177, ry: 0.0119 },
      { cx: 0.5247, cy: 0.7048, rx: 0.0348, ry: 0.0233 },
      { cx: 0.8304, cy: 0.7937, rx: 0.0731, ry: 0.0491 },
      { cx: 0.3389, cy: 0.8189, rx: 0.1356, ry: 0.0316 },
      { cx: 0.1934, cy: 0.9447, rx: 0.0525, ry: 0.0352 },
    ],
  },
  '07': {
    a: '07_A.png', b: '07_B.png',
    zones: [
      { cx: 0.8213, cy: 0.1305, rx: 0.0731, ry: 0.0494 },
      { cx: 0.3974, cy: 0.2198, rx: 0.1032, ry: 0.0688 },
      { cx: 0.1330, cy: 0.2984, rx: 0.0348, ry: 0.0233 },
      { cx: 0.5879, cy: 0.3000, rx: 0.0731, ry: 0.0491 },
      { cx: 0.9186, cy: 0.3835, rx: 0.0584, ry: 0.0392 },
      { cx: 0.7185, cy: 0.4327, rx: 0.0295, ry: 0.0194 },
      { cx: 0.2628, cy: 0.5000, rx: 0.0407, ry: 0.0273 },
      { cx: 0.7512, cy: 0.5781, rx: 0.0289, ry: 0.0198 },
      { cx: 0.5225, cy: 0.7642, rx: 0.0584, ry: 0.0392 },
      { cx: 0.2348, cy: 0.8075, rx: 0.0584, ry: 0.0392 },
    ],
  },
  '08': {
    a: '08_A.png', b: '08_B.png',
    zones: [
      { cx: 0.7265, cy: 0.0556, rx: 0.0407, ry: 0.0273 },
      { cx: 0.5025, cy: 0.0567, rx: 0.0407, ry: 0.0273 },
      { cx: 0.3256, cy: 0.3209, rx: 0.0407, ry: 0.0277 },
      { cx: 0.1473, cy: 0.3321, rx: 0.0407, ry: 0.0273 },
      { cx: 0.8596, cy: 0.5010, rx: 0.0407, ry: 0.0273 },
      { cx: 0.5406, cy: 0.5197, rx: 0.0236, ry: 0.0158 },
      { cx: 0.1121, cy: 0.5374, rx: 0.0407, ry: 0.0273 },
      { cx: 0.8875, cy: 0.6615, rx: 0.0413, ry: 0.0273 },
      { cx: 0.1249, cy: 0.6877, rx: 0.0407, ry: 0.0273 },
      { cx: 0.2994, cy: 0.9599, rx: 0.0407, ry: 0.0273 },
    ],
  },
  '09': {
    a: '09_A.png', b: '09_B.png',
    zones: [
      { cx: 0.3561, cy: 0.1305, rx: 0.0525, ry: 0.0352 },
      { cx: 0.8724, cy: 0.2176, rx: 0.0407, ry: 0.0273 },
      { cx: 0.8301, cy: 0.3092, rx: 0.0407, ry: 0.0273 },
      { cx: 0.3009, cy: 0.4524, rx: 0.0407, ry: 0.0273 },
      { cx: 0.6756, cy: 0.4829, rx: 0.0289, ry: 0.0198 },
      { cx: 0.1663, cy: 0.5112, rx: 0.0879, ry: 0.0589 },
      { cx: 0.6014, cy: 0.6027, rx: 0.0525, ry: 0.0352 },
      { cx: 0.7449, cy: 0.6791, rx: 0.0407, ry: 0.0277 },
      { cx: 0.7288, cy: 0.7658, rx: 0.0407, ry: 0.0273 },
      { cx: 0.4445, cy: 0.8048, rx: 0.0407, ry: 0.0273 },
    ],
  },
  '10': {
    a: '10_A.png', b: '10_B.png',
    zones: [
      { cx: 0.4198, cy: 0.1165, rx: 0.0584, ry: 0.0392 },
      { cx: 0.9296, cy: 0.1733, rx: 0.0348, ry: 0.0233 },
      { cx: 0.5361, cy: 0.2454, rx: 0.0413, ry: 0.0273 },
      { cx: 0.2006, cy: 0.4925, rx: 0.0407, ry: 0.0277 },
      { cx: 0.5751, cy: 0.5840, rx: 0.0731, ry: 0.0491 },
      { cx: 0.1529, cy: 0.5951, rx: 0.0354, ry: 0.0233 },
      { cx: 0.9361, cy: 0.6149, rx: 0.0348, ry: 0.0233 },
      { cx: 0.4182, cy: 0.6637, rx: 0.0590, ry: 0.0392 },
      { cx: 0.8715, cy: 0.8220, rx: 0.0348, ry: 0.0233 },
      { cx: 0.7822, cy: 0.9541, rx: 0.0584, ry: 0.0392 },
    ],
  },
};

const DIFFS_PER_SET = 10;

/* ---- Collections ---------------------------------------------------------
   `slots` is the planned image count; entries hold a set id when that image
   exists, or null for a not-yet-added ("coming soon") slot.                */
const COLLECTIONS = [
  {
    id: '01',
    name: 'Collection 01',
    slots: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  },
  {
    id: '02',
    name: 'Collection 02',
    comingSoon: true,
  },
];

/* ---- Tunables ---- */
const MIN_SCALE = 1, MAX_SCALE = 6;
const TAP_MOVE_TOL = 8, TAP_TIME_TOL = 350;
const DOUBLE_TAP_MS = 300, DOUBLE_TAP_DIST = 40;
const HIT_TOLERANCE = 1.4;

/* ========================================================================= */
/* Progress persistence                                                      */

function progressKey(setId) { return 'std_found_' + setId; }
function loadProgress(setId) {
  try { return new Set(JSON.parse(localStorage.getItem(progressKey(setId)) || '[]')); }
  catch (e) { return new Set(); }
}
function saveProgress(setId, set) {
  try { localStorage.setItem(progressKey(setId), JSON.stringify([...set])); } catch (e) {}
}
function setScore(setId) { return loadProgress(setId).size; }

function collectionPlayableSets(col) {
  if (!col.slots) return [];
  return col.slots.filter(s => s && SETS[s]);
}
function collectionScore(col) {
  const sets = collectionPlayableSets(col);
  const done = sets.reduce((sum, s) => sum + setScore(s), 0);
  return { done, total: sets.length * DIFFS_PER_SET };
}

/* ========================================================================= */
/* DOM                                                                       */

const els = {
  // views
  viewCollections: document.getElementById('viewCollections'),
  viewCollection: document.getElementById('viewCollection'),
  viewGame: document.getElementById('viewGame'),
  // collections
  collectionsGrid: document.getElementById('collectionsGrid'),
  // collection
  collectionTitle: document.getElementById('collectionTitle'),
  collectionScore: document.getElementById('collectionScore'),
  collectionScoreTotal: document.getElementById('collectionScoreTotal'),
  cardsGrid: document.getElementById('cardsGrid'),
  backToCollections: document.getElementById('backToCollections'),
  // game
  imgA: document.getElementById('imgA'),
  imgB: document.getElementById('imgB'),
  contentA: document.getElementById('contentA'),
  contentB: document.getElementById('contentB'),
  markersA: document.getElementById('markersA'),
  markersB: document.getElementById('markersB'),
  panelA: document.getElementById('panelA'),
  panelB: document.getElementById('panelB'),
  scoreFound: document.getElementById('scoreFound'),
  scoreTotal: document.getElementById('scoreTotal'),
  score: document.getElementById('score'),
  gameTitle: document.getElementById('gameTitle'),
  backToCollection: document.getElementById('backToCollection'),
  winOverlay: document.getElementById('winOverlay'),
  playAgain: document.getElementById('playAgain'),
  winBack: document.getElementById('winBack'),
  // confirm dialog
  confirmOverlay: document.getElementById('confirmOverlay'),
  confirmMsg: document.getElementById('confirmMsg'),
  confirmOk: document.getElementById('confirmOk'),
  confirmCancel: document.getElementById('confirmCancel'),
  // tutorial
  tutorial: document.getElementById('tutorial'),
  tutCursor: document.getElementById('tutCursor'),
  tutMarkersA: document.getElementById('tutMarkersA'),
  tutMarkersB: document.getElementById('tutMarkersB'),
};

/* ---- Confirm dialog ---- */
let pendingConfirm = null;
function openConfirm(message, onOk) {
  els.confirmMsg.textContent = message;
  pendingConfirm = onOk;
  els.confirmOverlay.classList.remove('hidden');
}
function closeConfirm() {
  pendingConfirm = null;
  els.confirmOverlay.classList.add('hidden');
}

function resetCollectionProgress(colId) {
  const col = COLLECTIONS.find(c => c.id === colId);
  collectionPlayableSets(col).forEach(s => {
    try { localStorage.removeItem(progressKey(s)); } catch (e) {}
  });
  renderCollections();
}

/* ========================================================================= */
/* Router                                                                    */

let currentCollectionId = null;
let currentSetId = null;

function showView(view) {
  [els.viewCollections, els.viewCollection, els.viewGame]
    .forEach(v => v.classList.toggle('active', v === view));
}

function goCollections() {
  currentCollectionId = null;
  els.winOverlay.classList.add('hidden');
  renderCollections();
  showView(els.viewCollections);
}

function goCollection(collectionId) {
  currentCollectionId = collectionId;
  els.winOverlay.classList.add('hidden');
  renderCollection(collectionId);
  showView(els.viewCollection);
}

/* ========================================================================= */
/* Rendering — Collections                                                   */

function collageHTML(imgSrcs) {
  const shown = imgSrcs.slice(0, 4);
  const extra = imgSrcs.length - shown.length;
  const tiles = shown.map((src, i) => {
    const badge = (i === shown.length - 1 && extra > 0) ? `<span class="cc-more">+${extra}</span>` : '';
    return `<div class="cc-tile" style="background-image:url('${src}')">${badge}</div>`;
  }).join('');
  return `<div class="cc-collage cc-${shown.length}">${tiles}</div>`;
}

function renderCollections() {
  els.collectionsGrid.innerHTML = '';
  for (const col of COLLECTIONS) {
    const card = document.createElement('div');
    if (col.comingSoon) {
      card.className = 'collection-card locked';
      card.innerHTML = `
        <div class="cc-collage cc-empty"><span>🔒</span></div>
        <div class="cc-body">
          <span class="badge-soon">Coming soon</span>
          <h2>${col.name}</h2>
          <div class="cc-meta">New puzzles on the way</div>
        </div>`;
    } else {
      const { done, total } = collectionScore(col);
      const pct = total ? Math.round((done / total) * 100) : 0;
      const sets = collectionPlayableSets(col);
      const imgs = sets.map(s => SETS[s].a);
      card.className = 'collection-card playable';
      card.innerHTML = `
        ${collageHTML(imgs)}
        <div class="cc-body">
          <h2>${col.name}</h2>
          <div class="cc-meta">${sets.length} image${sets.length === 1 ? '' : 's'} available</div>
          <div class="progress-bar"><span style="width:${pct}%"></span></div>
          <div class="cc-footer">
            <div class="cc-score"><span class="done">${done}</span><span class="tot">/${total}</span><span class="cc-star">⭐</span></div>
            <button class="cc-reset" type="button">Reset</button>
          </div>
        </div>`;
      card.addEventListener('click', () => goCollection(col.id));
      const resetBtn = card.querySelector('.cc-reset');
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openConfirm(
          `Reset all progress for ${col.name}? This clears your stars for its ${sets.length} image${sets.length === 1 ? '' : 's'}.`,
          () => resetCollectionProgress(col.id)
        );
      });
    }
    els.collectionsGrid.appendChild(card);
  }
}

/* ========================================================================= */
/* Rendering — Collection (image grid)                                       */

function renderCollection(collectionId) {
  const col = COLLECTIONS.find(c => c.id === collectionId);
  els.collectionTitle.textContent = col.name;
  const { done, total } = collectionScore(col);
  els.collectionScore.textContent = done;
  els.collectionScoreTotal.textContent = total;

  els.cardsGrid.innerHTML = '';
  col.slots.forEach((setId) => {
    const card = document.createElement('div');
    card.className = 'image-card';

    if (setId && SETS[setId]) {
      const score = setScore(setId);
      const complete = score >= DIFFS_PER_SET;
      const icons = '⭐'.repeat(score) + '❓'.repeat(DIFFS_PER_SET - score);
      card.innerHTML = `
        <div class="card-thumb playable" role="button" tabindex="0">
          <img src="${SETS[setId].a}" alt="Puzzle image" draggable="false" />
          ${complete ? '<div class="complete-badge">✓</div>' : ''}
        </div>
        <div class="card-stars${complete ? ' complete' : ''}" aria-label="${score} of ${DIFFS_PER_SET} found">${icons}</div>`;
      const thumb = card.querySelector('.card-thumb');
      thumb.addEventListener('click', () => startGame(setId, collectionId));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(setId, collectionId); }
      });
    } else {
      card.innerHTML = `<div class="card-thumb soon"><span>Coming<br>soon</span></div>`;
    }
    els.cardsGrid.appendChild(card);
  });
}

/* ========================================================================= */
/* Game engine                                                               */

const view = { scale: 1, tx: 0, ty: 0 };
let panelW = 0, panelH = 0, baseW = 0, baseH = 0, imgNatW = 0, imgNatH = 0;
let currentZones = [];
let found = new Set();

function startGame(setId, collectionId) {
  currentSetId = setId;
  currentCollectionId = collectionId;
  currentZones = SETS[setId].zones;
  found = loadProgress(setId);

  const col = COLLECTIONS.find(c => c.id === collectionId);
  els.gameTitle.textContent = col ? col.name : '';
  els.scoreTotal.textContent = String(currentZones.length);
  els.winOverlay.classList.add('hidden');
  showView(els.viewGame);

  // Load images (A drives natural dims; A and B match).
  els.imgA.src = SETS[setId].a;
  els.imgB.src = SETS[setId].b;
  if (els.imgA.complete && els.imgA.naturalWidth) {
    onImageReady();
  } else {
    els.imgA.addEventListener('load', onImageReady, { once: true });
  }
}

function onImageReady() {
  imgNatW = els.imgA.naturalWidth;
  imgNatH = els.imgA.naturalHeight;
  computeLayout();
  resetView();
  renderExistingMarkers();
  updateScoreUI(false);
}

function renderExistingMarkers() {
  els.markersA.innerHTML = '';
  els.markersB.innerHTML = '';
  found.forEach(i => {
    addMarker(els.markersA, currentZones[i]);
    addMarker(els.markersB, currentZones[i]);
  });
}

function computeLayout() {
  const rect = els.panelA.getBoundingClientRect();
  panelW = rect.width; panelH = rect.height;
  const s = Math.min(panelW / imgNatW, panelH / imgNatH);
  baseW = imgNatW * s; baseH = imgNatH * s;
  els.contentA.style.width = els.contentB.style.width = baseW + 'px';
  els.contentA.style.height = els.contentB.style.height = baseH + 'px';
}

function clampView() {
  view.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale));
  const sw = baseW * view.scale, sh = baseH * view.scale;
  view.tx = sw <= panelW ? (panelW - sw) / 2 : Math.min(0, Math.max(panelW - sw, view.tx));
  view.ty = sh <= panelH ? (panelH - sh) / 2 : Math.min(0, Math.max(panelH - sh, view.ty));
}
function applyTransform() {
  clampView();
  const t = `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`;
  els.contentA.style.transform = t;
  els.contentB.style.transform = t;
}
function resetView() {
  view.scale = 1;
  view.tx = (panelW - baseW) / 2;
  view.ty = (panelH - baseH) / 2;
  applyTransform();
}
function zoomAt(localX, localY, factor) {
  const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale * factor));
  const ratio = newScale / view.scale;
  view.tx = localX - (localX - view.tx) * ratio;
  view.ty = localY - (localY - view.ty) * ratio;
  view.scale = newScale;
  applyTransform();
}
function localToNorm(localX, localY) {
  return {
    cx: (localX - view.tx) / (baseW * view.scale),
    cy: (localY - view.ty) / (baseH * view.scale),
  };
}

/* ---- Hit testing ---- */
function testHit(cx, cy) {
  for (let i = 0; i < currentZones.length; i++) {
    if (found.has(i)) continue;
    const z = currentZones[i];
    const dx = (cx - z.cx) / (z.rx * HIT_TOLERANCE);
    const dy = (cy - z.cy) / (z.ry * HIT_TOLERANCE);
    if (dx * dx + dy * dy <= 1) return i;
  }
  return -1;
}
function markFound(index) {
  found.add(index);
  saveProgress(currentSetId, found);
  const z = currentZones[index];
  addMarker(els.markersA, z);
  addMarker(els.markersB, z);
  updateScoreUI(true);
  if (found.size === currentZones.length) setTimeout(showWin, 500);
}
function addMarker(container, z) {
  const m = document.createElement('div');
  m.className = 'marker';
  const wPx = z.rx * 2 * baseW;
  const hPx = z.ry * 2 * baseH;
  const sizePx = Math.max(wPx, hPx);
  m.style.left = (z.cx * 100) + '%';
  m.style.top = (z.cy * 100) + '%';
  m.style.width = (sizePx / baseW * 100) + '%';
  m.style.height = (sizePx / baseH * 100) + '%';
  container.appendChild(m);
}
function showMiss(container, cx, cy) {
  const m = document.createElement('div');
  m.className = 'miss';
  m.textContent = '✕';
  m.style.left = (cx * 100) + '%';
  m.style.top = (cy * 100) + '%';
  container.appendChild(m);
  setTimeout(() => m.remove(), 650);
}
function updateScoreUI(animate) {
  els.scoreFound.textContent = String(found.size);
  if (animate) {
    els.score.classList.remove('bump');
    void els.score.offsetWidth;
    els.score.classList.add('bump');
  }
}
function showWin() { els.winOverlay.classList.remove('hidden'); }

function replayCurrent() {
  found = new Set();
  saveProgress(currentSetId, found);
  els.markersA.innerHTML = '';
  els.markersB.innerHTML = '';
  updateScoreUI(false);
  els.winOverlay.classList.add('hidden');
  resetView();
}

/* ========================================================================= */
/* Pointer / gesture handling (per panel)                                    */

function setupPanel(panel, markersContainer) {
  const pointers = new Map();
  let dragging = false, pinchDist = 0, pinchMid = { x: 0, y: 0 };
  let startPoint = null, startTime = 0, moved = 0;
  let lastTapTime = 0, lastTapPos = null;

  const localCoords = (e) => {
    const r = panel.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  panel.addEventListener('pointerdown', (e) => {
    panel.setPointerCapture(e.pointerId);
    const p = localCoords(e);
    pointers.set(e.pointerId, p);
    if (pointers.size === 1) {
      dragging = true; panel.classList.add('dragging');
      startPoint = p; startTime = e.timeStamp; moved = 0;
    } else if (pointers.size === 2) {
      dragging = false;
      const pts = [...pointers.values()];
      pinchDist = dist(pts[0], pts[1]);
      pinchMid = mid(pts[0], pts[1]);
    }
  });

  panel.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const p = localCoords(e);
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, p);
    if (pointers.size === 1 && dragging) {
      const dx = p.x - prev.x, dy = p.y - prev.y;
      moved += Math.abs(dx) + Math.abs(dy);
      view.tx += dx; view.ty += dy;
      applyTransform();
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const nd = dist(pts[0], pts[1]), nm = mid(pts[0], pts[1]);
      if (pinchDist > 0) {
        zoomAt(nm.x, nm.y, nd / pinchDist);
        view.tx += nm.x - pinchMid.x;
        view.ty += nm.y - pinchMid.y;
        applyTransform();
      }
      pinchDist = nd; pinchMid = nm;
    }
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    const p = localCoords(e);
    const wasSingle = pointers.size === 1;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;

    if (pointers.size === 0) {
      panel.classList.remove('dragging');
      dragging = false;
      if (wasSingle && startPoint && moved < TAP_MOVE_TOL &&
          (e.timeStamp - startTime) < TAP_TIME_TOL) {
        const now = e.timeStamp;
        const near = lastTapPos && dist(p, lastTapPos) < DOUBLE_TAP_DIST;
        if (now - lastTapTime < DOUBLE_TAP_MS && near) {
          resetView();
          lastTapTime = 0; lastTapPos = null;
        } else {
          lastTapTime = now; lastTapPos = p;
          handleTap(p);
        }
      }
    } else if (pointers.size === 1) {
      dragging = true;
      startPoint = [...pointers.values()][0];
      moved = TAP_MOVE_TOL; // don't treat the pinch tail as a tap
    }
  }
  panel.addEventListener('pointerup', endPointer);
  panel.addEventListener('pointercancel', endPointer);

  panel.addEventListener('wheel', (e) => {
    e.preventDefault();
    const { x, y } = localCoords(e);
    zoomAt(x, y, Math.pow(1.0015, -e.deltaY));
  }, { passive: false });

  function handleTap(p) {
    const { cx, cy } = localToNorm(p.x, p.y);
    if (cx < 0 || cx > 1 || cy < 0 || cy > 1) return;
    const hit = testHit(cx, cy);
    if (hit >= 0) markFound(hit);
    else showMiss(markersContainer, cx, cy);
  }
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/* ========================================================================= */
/* Looping tutorial on the Collections page                                  */
/* Non-interactive: an enlarged cursor glides to the first 5 differences of  */
/* set 01 and "clicks" each, then resets and loops forever.                  */

function startTutorial() {
  const tut = els.tutorial;
  if (!tut) return;
  const cursor = els.tutCursor;
  const panelA = tut.querySelector('.tut-panel');   // left image
  const zones = SETS['01'].zones.slice(5, 10);   // the easier (larger) half
  let step = 0;

  function moveCursor(cx, cy, animate) {
    const tr = tut.getBoundingClientRect();
    const pr = panelA.getBoundingClientRect();
    if (pr.width === 0) return false;                // hidden view
    const x = (pr.left - tr.left) + cx * pr.width;
    const y = (pr.top - tr.top) + cy * pr.height;
    if (animate) {
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      cursor.style.transition = 'none';
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      void cursor.offsetWidth;                       // flush, then restore
      cursor.style.transition = '';
    }
    return true;
  }

  function addTutMarker(container, z) {
    const m = document.createElement('div');
    m.className = 'tut-marker';
    m.style.left = (z.cx * 100) + '%';
    m.style.top = (z.cy * 100) + '%';
    container.appendChild(m);
  }

  function resetLoop() {
    els.tutMarkersA.innerHTML = '';
    els.tutMarkersB.innerHTML = '';
    moveCursor(0.5, 0.5, false);
    step = 0;
  }

  function tick() {
    // Pause while the Collections view isn't visible.
    if (panelA.getBoundingClientRect().width === 0) {
      setTimeout(tick, 500);
      return;
    }
    if (step >= zones.length) {
      setTimeout(() => { resetLoop(); setTimeout(tick, 700); }, 1400);
      return;
    }
    const z = zones[step];
    moveCursor(z.cx, z.cy, true);                    // glide to difference
    setTimeout(() => {
      cursor.classList.add('clicking');              // press + ripple
      addTutMarker(els.tutMarkersA, z);
      addTutMarker(els.tutMarkersB, z);
      setTimeout(() => cursor.classList.remove('clicking'), 300);
      step++;
      setTimeout(tick, 850);
    }, 950);
  }

  resetLoop();
  setTimeout(tick, 900);
}

/* ========================================================================= */
/* Boot                                                                      */

setupPanel(els.panelA, els.markersA);
setupPanel(els.panelB, els.markersB);

els.backToCollections.addEventListener('click', goCollections);
els.backToCollection.addEventListener('click', () => goCollection(currentCollectionId));
els.winBack.addEventListener('click', () => goCollection(currentCollectionId));
els.playAgain.addEventListener('click', replayCurrent);

els.confirmCancel.addEventListener('click', closeConfirm);
els.confirmOk.addEventListener('click', () => {
  const fn = pendingConfirm;
  closeConfirm();
  if (fn) fn();
});
els.confirmOverlay.addEventListener('click', (e) => {
  if (e.target === els.confirmOverlay) closeConfirm();
});

document.addEventListener('gesturestart', (e) => e.preventDefault());
els.viewGame.addEventListener('dblclick', (e) => e.preventDefault());

let resizeRAF = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(() => {
    if (!els.viewGame.classList.contains('active') || !imgNatW) return;
    computeLayout();
    resetView();
  });
});

goCollections();
startTutorial();
