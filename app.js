document.addEventListener("DOMContentLoaded", () => {
  window.dessins = [];
  window.selectedCartes = [];
  window.selectedBackground = null;

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  const cartesAnimaux = [
    "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
    "chat.png","chien.png","poule.png","poussin.png","cheval.png",
    "vache.png","mouton.png","pieuvre.png","poisson.png","tortue.png",
    "requin.png","dauphin.png","otarie.png","singe.png","zebre.png",
    "elephant.png","girafe.png","guepard.png","lion.png"
  ];

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      modeSelection.classList.add('hidden');

      if(mode === 'cartes'){
        cartesSection.classList.remove('hidden');
        loadCartes();
      } else if(mode === 'dessins'){
        importDessins.classList.remove('hidden');
      } else if(mode === 'dessins-cartes'){
        importDessins.classList.remove('hidden');
        cartesSection.classList.remove('hidden');
        loadCartes();
      }
    });
  });

  // Import dessins (max 3)
  document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    window.dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';
    for(let i=0;i<Math.min(files.length,3);i++){
      const reader = new FileReader();
      reader.onload = (event) => {
        window.dessins.push(event.target.result);
        const img = document.createElement('img');
        img.src = event.target.result;
        document.getElementById('dessins-preview').appendChild(img);
      };
      reader.readAsDataURL(files[i]);
    }
  });

  // Suivant -> cartes
  const nextBtn = document.getElementById('next-to-cards');
  if(nextBtn) nextBtn.addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML = "";
    cartesAnimaux.forEach(name => {
      const img = document.createElement("img");
      img.src = name;
      img.classList.add("carte");
      img.onclick = () => {
        if(!window.selectedCartes.includes(name) && window.selectedCartes.length<5) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c => c!==name);
        img.classList.toggle("selected");
      };
      container.appendChild(img);
    });
  }

  // Choisir fond
  const chooseBgBtn = document.getElementById("choose-background");
  if(chooseBgBtn){
    chooseBgBtn.addEventListener("click", () => {
      showPage("page-background");
      loadBackgroundOptions();
    });
  }

  function loadBackgroundOptions(){
    const grid = document.getElementById("background-grid");
    grid.innerHTML = "";
    const backgrounds = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    backgrounds.forEach(name => {
      const img = document.createElement("img");
      img.src = name;
      img.classList.add("fond-option");
      img.onclick = () => {
        document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
        img.classList.add("selected");
        window.selectedBackground = name;
      };
      grid.appendChild(img);
    });
  }

  // Fond aléatoire
  const randomBgBtn = document.getElementById("random-background");
  if(randomBgBtn){
    randomBgBtn.addEventListener("click", () => {
      const arr = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
      window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
      goPreview();
    });
  }

  // Preview
  const previewBtn = document.getElementById("preview-btn");
  if(previewBtn) previewBtn.addEventListener("click", goPreview);

  function goPreview(){
    if(!window.selectedBackground) return alert("Choisis un fond !");
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // Dessins
    window.dessins.forEach((src,i)=>{
      const img = document.createElement("img");
      img.src = src;
      img.style.position="absolute";
      img.style.bottom="0";
      img.style.left=`${10+i*120}px`;
      img.style.width="90px";
      preview.appendChild(img);
    });

    // Cartes
    window.selectedCartes.forEach((name,i)=>{
      const img = document.createElement("img");
      img.src = name;
      img.style.position="absolute";
      img.style.bottom="0";
      img.style.left=`${300+i*120}px`;
      img.style.width="90px";
      preview.appendChild(img);
    });

    showPage("page-preview");
  }

  const genBtn = document.getElementById("generate-story");
  if(genBtn){
    genBtn.addEventListener("click", () => {
      if(window._finalStoryEngine) return; 
      goPreview();
      alert("Histoire (moteur absent) — si story.js est présent il prendra le relais.");
    });
  }

  function showPage(pageId){
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const el=document.getElementById(pageId);
    if(el) el.classList.remove("hidden");
  }

});
