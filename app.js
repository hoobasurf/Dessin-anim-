// app.js — interface, import dessins, cartes, fond, preview
document.addEventListener("DOMContentLoaded", () => {
  window.dessins = [];
  window.selectedCartes = [];
  window.selectedBackground = null;

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  const cartesAnimaux = [
    "cerf.png","chat.png","cheval.png","chien.png","dauphin.png",
    "ecureuil.png","elephant.png","girafe.png","lion.png","loup.png",
    "mouton.png","otarie.png","ours.png","pieuvre.png","poisson.png",
    "poule.png","poussin.png","renard.png","requin.png","singe.png",
    "zebre.png"
  ];

  // mode buttons
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

  // import dessins
  const fileInput = document.getElementById('file-input');
  if(fileInput){
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      window.dessins = [];
      document.getElementById('dessins-preview').innerHTML = '';
      for(let i=0;i<Math.min(files.length,3);i++){
        const reader = new FileReader();
        reader.onload = (ev) => {
          window.dessins.push(ev.target.result);
          const img = document.createElement('img');
          img.src = ev.target.result;
          document.getElementById('dessins-preview').appendChild(img);
        };
        reader.readAsDataURL(files[i]);
      }
    });
  }

  // next button
  document.getElementById('next-to-cards')?.addEventListener('click', () => {
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
        if(!window.selectedCartes.includes(name) && window.selectedCartes.length >= 5) {
          alert("Maximum 5 animaux !");
          return;
        }
        if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c => c!==name);
        img.classList.toggle("selected");
      };
      container.appendChild(img);
    });
  }

  // choose background
  document.getElementById("choose-background")?.addEventListener("click", () => {
    showPage("page-background");
    loadBackgroundOptions();
  });

  function loadBackgroundOptions(){
    const grid = document.getElementById("background-grid");
    grid.innerHTML = "";
    const backgrounds = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    backgrounds.forEach(name => {
      const img = document.createElement("img");
      img.src = name;
      img.onclick = () => {
        document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
        img.classList.add("selected");
        window.selectedBackground = name;
      };
      grid.appendChild(img);
    });
  }

  // preview
  document.getElementById("preview-btn")?.addEventListener("click", () => {
    if(!window.selectedBackground) return alert("Choisis un fond !");
    const preview = document.getElementById("preview-container");
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.innerHTML = '<div id="object-layer"></div><div id="animal-layer"></div><div class="story-line" id="story-line"></div>';
    // animals and dessins placed by story.js when launch
    showPage("page-preview");
  });

  // generate story (this just ensures story.js will run when clicking create)
  document.getElementById("generate-story")?.addEventListener("click", () => {
    // story.js handles checks and playback
    const ev = new Event('startStory');
    document.dispatchEvent(ev);
  });

  function showPage(pageId){
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const el = document.getElementById(pageId);
    if(el) el.classList.remove("hidden");
  }
});
