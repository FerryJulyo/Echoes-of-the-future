// ... (state & functions lain tetap sama, tambahkan di bagian bawah)

// === Dynamic Ending Registry ===
const ENDINGS = [
  // Contoh ending utama
  {key:'rich_house', title:'🏠 Rumah Mewah', desc:'Kamu membangun rumah mewah di masa depan.'},
  {key:'mystical_garden', title:'🌸 Taman Mistis', desc:'Taman abadi penuh keajaiban.'},
  {key:'artifact', title:'🗿 Artefak Kuno', desc:'Kamu menemukan artefak kuno.'},
  {key:'barren', title:'💀 Dunia Tandus', desc:'Masa depan kering dan sunyi.'},
  // Dynamic/Combinatorial
];

// Generate 200+ more endings dynamically
(function generateDynamicEndings(){
  const actions = [
    {key:'tree', label:'menanam pohon'},
    {key:'flower', label:'menanam bunga'},
    {key:'mushroom', label:'menanam jamur'},
    {key:'water', label:'menyiram air'},
    {key:'shovel', label:'menggali'},
    {key:'key', label:'menemukan kunci'},
    {key:'fertilizer', label:'memupuk'},
    {key:'cut', label:'menebang pohon'},
    {key:'move_stone', label:'memindahkan batu'},
  ];
  const funEndings = [
    {name:"Ending Pencinta Alam", logic:(s)=>s.treeSeedPlanted&&s.flowerSeedPlanted&&s.mushroomSeedPlanted&&!s.treeCut&&!s.barrenEnding},
    {name:"Ending Tukang Tebang", logic:(s)=>s.treeSeedPlanted&&s.treeCut&&!s.flowerSeedPlanted},
    {name:"Ending Tukang Batu", logic:(s)=>s.stoneMoved&&!s.treeCut},
    {name:"Ending Jamur Beracun", logic:(s)=>s.mushroomGrown&&!s.mushroomWatered},
    {name:"Ending Banjir", logic:(s)=>s.waterDrawn&&s.waterGiven&&!s.treeSeedPlanted},
    {name:"Ending Pemburu Artefak", logic:(s)=>s.artifactFound&&!s.houseBuilt},
    {name:"Ending Kunci Hilang", logic:(s)=>!s.keyDug&&s.chestOpened},
    {name:"Ending Kebun Suram", logic:(s)=>s.flowerSeedPlanted&&!s.flowerGrown},
    {name:"Ending Tukang Siram Batu", logic:(s)=>s.waterDrawn&&s.stoneMoved&&s.mushroomGrown&&!s.flowerSeedPlanted},
    // + puluhan pola lain
  ];
  let id = 1;
  // Kombinasi 1-2 aksi, generate ending
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
    desc:`Skenario unik sesuai pola. [Ending fun #${idx+1}]`,
    logic:e.logic
  }));
  // Easter egg endings
  for(let i=1;i<=30;i++){
    ENDINGS.push({
      key:`egg_${i}`,
      title:`🥚 Easter Egg #${i}`,
      desc:`Kamu menemukan ending rahasia ke-${i}!`
    });
  }
})();

// === Dynamic Ending Evaluation ===
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
  const randIdx = Math.floor(Math.random()*30)+ENDINGS.length-30;
  return ENDINGS[randIdx];
}

// === Show Ending (Revised) ===
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

// === Trigger Ending (di renderFuture misal) ===
function renderFuture() {
  let out = [];
  // ... (tampilkan elemen sesuai state)
  // AUTO-EVALUATE ending jika semua aksi selesai atau inventory penuh, dst
  if(/* kondisi selesai atau ingin trigger ending */ false){
    showEnding();
  }
  // ...
  out.push(renderInventory());
  document.getElementById('scene-future').innerHTML = out.join('');
}