// app.js — UI, import dessins, cartes, fonds, preview
document.addEventListener("DOMContentLoaded", () => {
  window.dessins = [];
  window.selectedCartes = [];
  window.selectedBackground = null;
  window.maxAnimaux = 5; // limite

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  const cartesAnimaux = [
    "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
    "chat.png","chien.png","poule.png","poussin.png","cheval.png",
    "vache.png","mouton.png","pieuvre.png","poisson.png","tortue.png",
    "requin.png","dauphin.png","otarie.png","singe.png","zebre.png",
    "elephant.png","girafe.PNG","guepard.png","lion.png"
  ];

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
      if(mode === 'dessins') importDessins.classList.remove('hidden');
      else if(mode === 'cartes') { cartesSection.classList.remove('hidden'); loadCartes(); }
      else { importDessins.classList.remove('hidden'); cartesSection.classList.remove('hidden'); loadCartes(); }
    });
  });

  // Import dessins (max 3)
  document.getElementById('file-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    window.dessins = [];
    const preview = document.getElementById('dessins-preview');
    preview.innerHTML = '';
    files.slice(0,3).forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        window.dessins.push(ev.target.result); // dataURL
        const img = document.createElement('img'); img.src = ev.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(f);
    });
  });

  // next to cards
  document.getElementById('next-to-cards').addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  // load cartes with selection cap
  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML = "";
    cartesAnimaux.forEach(name => {
      const img = document.createElement("img");
      img.src = name;
      img.className = 'carte';
      img.alt = name;
      img.addEventListener('click', () => {
        const idx = window.selectedCartes.indexOf(name);
        if(idx !== -1){
          window.selectedCartes.splice(idx,1);
          img.classList.remove('selected');
        } else {
          if(window.selectedCartes.length >= window.maxAnimaux){
            alert(`Tu peux sélectionner au maximum ${window.maxAnimaux} animaux.`);
            return;
          }
          window.selectedCartes.push(name);
          img.classList.add('selected');
        }
      });
      container.appendChild(img);
    });
  }

  // choose background (selection visible immediately)
  document.getElementById('choose-background').addEventListener('click', () => {
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    document.getElementById('page-background').classList.remove('hidden');
    loadBackgroundOptions();
  });

  function loadBackgroundOptions(){
    const grid = document.getElementById('background-grid');
    grid.innerHTML = '';
    const backgrounds = ['foret.jpg','ferme.jpg','ocean.jpg','savane.jpg'];
    backgrounds.forEach(name => {
      const img = document.createElement('img');
      img.src = name;
      img.alt = name;
      img.addEventListener('click', () => {
        // visual selection immediately
        document.querySelectorAll('#background-grid img').forEach(i=>i.classList.remove('selected'));
        img.classList.add('selected');
        window.selectedBackground = name;
      });
      grid.appendChild(img);
    });
  }

  // random background button
  document.getElementById('random-background').addEventListener('click', () => {
    const arr = ['foret.jpg','ferme.jpg','ocean.jpg','savane.jpg'];
    window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    // reflect selection visually
    const gridImgs = document.querySelectorAll('#background-grid img');
    gridImgs.forEach(i=> i.classList.remove('selected'));
    // mark the matching one if present in DOM
    const found = Array.from(gridImgs).find(i => i.src.includes(window.selectedBackground));
    if(found) found.classList.add('selected');
    goPreview();
  });

  // preview button
  document.getElementById('preview-btn').addEventListener('click', goPreview);

  function goPreview(){
    if(!window.selectedBackground){
      alert('Choisis un fond !');
      return;
    }

    const preview = document.getElementById('preview-container');
    preview.innerHTML = '';
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    preview.style.position = 'relative';

    // positions (max 5)
    const positions = [20,140,260,380,500];

    // combine drawings (data URLs) and selected cartes; keep order: dessins first then cartes
    const items = [];
    window.dessins.slice(0,3).forEach(src => items.push({src, type:'dessin'}));
    window.selectedCartes.slice(0,5).forEach(name => items.push({src:name, type:'card'}));

    const displayed = items.slice(0,5); // cap 5

    displayed.forEach((it, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'char-wrapper';
      wrapper.style.position = 'absolute';
      wrapper.style.left = `${positions[i]}px`;
      wrapper.style.bottom = '10px';
      wrapper.style.width = '100px';
      wrapper.style.pointerEvents = 'none';

      const img = document.createElement('img');
      img.src = it.src;
      img.style.width = '100%';
      img.dataset.type = it.type;
      wrapper.appendChild(img);

      // mouth overlay (hidden until speaking)
      const mouth = document.createElement('div');
      mouth.className = 'mouth-overlay';
      mouth.style.display = 'none';
      wrapper.appendChild(mouth);

      // eyes overlay
      const eyes = document.createElement('div');
      eyes.className = 'eyes-overlay';
      wrapper.appendChild(eyes);

      preview.appendChild(wrapper);
    });

    // show preview page
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    document.getElementById('page-preview').classList.remove('hidden');
  }

  // generate story -> call story engine if defined, else just preview
  const genBtn = document.getElementById('generate-story');
  genBtn.addEventListener('click', () => {
    if(typeof window._finalStoryEngine === 'function'){
      window._finalStoryEngine(); // story.js will provide this
    } else {
      // fallback: just ensure preview visible
      goPreview();
      alert("Le moteur d'histoire n'est pas chargé.");
    }
  });

});
