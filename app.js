// app.js — gestion UI, import dessins, cartes, fonds, prévisualisation
// NE PAS modifier le CSS/HTML — garde le visuel tel quel.

document.addEventListener("DOMContentLoaded", () => {
  // globals used by story.js too
  window.dessins = [];           // tableaux accessibles globalement
  window.selectedCartes = [];
  window.selectedBackground = null;

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  // liste des cartes — assure-toi que ces fichiers existent à la racine
  const cartesAnimaux = [
    "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
    "chat.png","chien.png","poule.png","poussin.png","cheval.png",
    "vache.png","mouton.png","pieuvre.png","poisson.png","tortue.png",
    "requin.png","dauphin.png","otarie.png","singe.png","zebre.png",
    "elephant.png","girafe.png","guepard.png","lion.png"
  ];

  // mode buttons (Dessins / Cartes / Dessin+Cartes)
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

  // Import dessins (max 3) + suppression fond via canvas
  document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    window.dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';

    for(let i=0; i<Math.min(files.length, 3); i++){
      const reader = new FileReader();
      reader.onload = (event) => {
        removeBackground(event.target.result, (transparentSrc) => {
          window.dessins.push(transparentSrc);
          const img = document.createElement('img');
          img.src = transparentSrc;
          document.getElementById('dessins-preview').appendChild(img);
        });
      };
      reader.readAsDataURL(files[i]);
    }
  });

  // bouton suivant (dessins -> cartes)
  const nextBtn = document.getElementById('next-to-cards');
  if(nextBtn) nextBtn.addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  // charger et afficher cartes
  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML = "";
    cartesAnimaux.forEach(name => {
      const img = document.createElement("img");
      img.src = name;
      img.classList.add("carte");
      img.onclick = () => {
        if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c => c!==name);
        img.classList.toggle("selected");
      };
      container.appendChild(img);
    });
  }

  // bouton choisir fond -> afficher page de fonds
  const chooseBgBtn = document.getElementById("choose-background");
  if(chooseBgBtn){
    chooseBgBtn.addEventListener("click", () => {
      showPage("page-background");
      loadBackgroundOptions();
    });
  }

  // charger fonds (nom EXACTS fournis)
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

  // fond aléatoire
  const randomBgBtn = document.getElementById("random-background");
  if(randomBgBtn){
    randomBgBtn.addEventListener("click", () => {
      const arr = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
      window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
      goPreview();
    });
  }

  // preview bouton
  const previewBtn = document.getElementById("preview-btn");
  if(previewBtn) previewBtn.addEventListener("click", goPreview);

  // goPreview: applique fond + place dessins et cartes (sans lancer l'histoire)
  function goPreview(){
    if(!window.selectedBackground) return alert("Choisis un fond !");
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    // dessins (dataURL)
    window.dessins.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.bottom = "0";
      img.style.left = `${10 + i*120}px`;
      img.style.width = "90px";
      preview.appendChild(img);
    });

    // cartes
    window.selectedCartes.forEach((name, i) => {
      const img = document.createElement("img");
      img.src = name;
      img.style.position = "absolute";
      img.style.bottom = "0";
      img.style.left = `${300 + i*120}px`;
      img.style.width = "90px";
      preview.appendChild(img);
    });

    showPage("page-preview");
  }

  // generate story button: story.js overrideera ce comportement si présent
  const genBtn = document.getElementById("generate-story");
  if(genBtn){
    // keep a default if story.js not loaded
    genBtn.addEventListener("click", () => {
      // if story.js exists it will replace this handler
      if(window._finalStoryEngine) return;
      goPreview();
      alert("Histoire (moteur absent) — si story.js est présent il prendra le relais.");
    });
  }

  // helper showPage
  function showPage(pageId){
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const el = document.getElementById(pageId);
    if(el) el.classList.remove("hidden");
  }

  // remove background simple (canvas threshold)
  window.removeBackground = function(imageSrc, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // threshold : pixels très clairs deviennent transparents
      for (let i = 0; i < data.length; i += 4){
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r > 240 && g > 240 && b > 240) data[i+3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      callback(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { callback(imageSrc); };
  };

}); // DOMContentLoaded end
