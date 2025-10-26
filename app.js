document.addEventListener("DOMContentLoaded", () => {
  window.dessins = [];
  window.selectedCartes = [];
  window.selectedBackground = null;

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  const cartesAnimaux = [
    "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
    "chat.png","chien.png","poule.png","poussin.png","cheval.png","vache.png","mouton.png",
    "pieuvre.png","poisson.png","tortue.png","requin.png","dauphin.png","otarie.png",
    "singe.png","zebre.png","elephant.png","girafe.png","guepard.png","lion.png"
  ];

  // Mode boutons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      modeSelection.classList.add('hidden');
      if(mode==='cartes'){ cartesSection.classList.remove('hidden'); loadCartes(); }
      else if(mode==='dessins'){ importDessins.classList.remove('hidden'); }
      else { importDessins.classList.remove('hidden'); cartesSection.classList.remove('hidden'); loadCartes(); }
    });
  });

  // Import dessins max 3 + suppression fond blanc
  document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    window.dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';
    for(let i=0;i<Math.min(files.length,3);i++){
      const reader = new FileReader();
      reader.onload = (event)=>{
        removeBackground(event.target.result,(transparentSrc)=>{
          window.dessins.push(transparentSrc);
          const img = document.createElement('img'); img.src=transparentSrc;
          document.getElementById('dessins-preview').appendChild(img);
        });
      };
      reader.readAsDataURL(files[i]);
    }
  });

  const nextBtn = document.getElementById('next-to-cards');
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ importDessins.classList.add('hidden'); cartesSection.classList.remove('hidden'); loadCartes(); });

  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML="";
    cartesAnimaux.forEach(name=>{
      const img=document.createElement("img");
      img.src=name; img.classList.add("carte");
      img.onclick=()=>{ if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name); else window.selectedCartes=window.selectedCartes.filter(c=>c!==name); img.classList.toggle("selected"); };
      container.appendChild(img);
    });
  }

  const chooseBgBtn=document.getElementById("choose-background");
  if(chooseBgBtn){ chooseBgBtn.addEventListener("click",()=>{ showPage("page-background"); loadBackgroundOptions(); }); }

  function loadBackgroundOptions(){
    const grid = document.getElementById("background-grid");
    grid.innerHTML="";
    const backgrounds=["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    backgrounds.forEach(name=>{
      const img=document.createElement("img"); img.src=name; img.classList.add("fond-option");
      img.onclick=()=>{ document.querySelectorAll("#background-grid img").forEach(i=>i.classList.remove("selected")); img.classList.add("selected"); window.selectedBackground=name; };
      grid.appendChild(img);
    });
  }

  const randomBgBtn = document.getElementById("random-background");
  if(randomBgBtn) randomBgBtn.addEventListener("click",()=>{ const arr=["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"]; window.selectedBackground=arr[Math.floor(Math.random()*arr.length)]; });

  const previewBtn = document.getElementById("preview-btn");
  if(previewBtn) previewBtn.addEventListener("click",()=>{ if(!window.selectedBackground) return alert("Choisis un fond !"); showPreview(); });

  function showPreview(){
    const preview=document.getElementById("preview-container");
    preview.innerHTML="";
    preview.style.backgroundImage=`url(${window.selectedBackground})`;
    preview.style.backgroundSize="cover"; preview.style.backgroundPosition="center"; preview.style.position="relative";

    window.dessins.forEach((src,i)=>{
      const img=document.createElement("img"); img.src=src; img.classList.add("animal");
      img.style.bottom="0px"; img.style.left=`${10+i*120}px
