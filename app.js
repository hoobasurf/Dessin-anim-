// app.js — gestion UI, import dessins, cartes, fonds, preview (ne modifie pas le visuel)
document.addEventListener("DOMContentLoaded", () => {

  window.dessins = [];         // dataURLs of uploaded drawings
  window.selectedCartes = [];  // filenames of chosen cards (png)
  window.selectedBackground = null;

  const modeSelection = document.getElementById('mode-selection');
  const importDessins = document.getElementById('import-dessins');
  const cartesSection = document.getElementById('cartes-section');

  // adjust this list to match files in your repo root
  const cartesAnimaux = [
    "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
    "chat.png","chien.png","poule.png","poussin.png","cheval.png",
    "vache.png","mouton.png","pieuvre.png","poisson.png","tortue.png",
    "requin.png","dauphin.png","otarie.png","singe.png","zebre.png",
    "elephant.png","girafe.PNG","guepard.png","lion.png"
  ];

  // mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const mode = btn.dataset.mode;
      document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
      if(mode === 'dessins'){ importDessins.classList.remove('hidden'); }
      else if(mode === 'cartes'){ cartesSection.classList.remove('hidden'); loadCartes(); }
      else { importDessins.classList.remove('hidden'); cartesSection.classList.remove('hidden'); loadCartes(); }
    });
  });

  // import drawings (max 3)
  document.getElementById('file-input').addEventListener('change', e=>{
    const files = Array.from(e.target.files || []);
    window.dessins = [];
    const preview = document.getElementById('dessins-preview');
    preview.innerHTML = '';
    Promise.all(files.slice(0,3).map(f => readFileAsDataURL(f))).then(dataUrls=>{
      dataUrls.forEach(src=>{
        // keep as dataURL; we will process in story.js
        window.dessins.push(src);
        const img = document.createElement('img'); img.src = src; preview.appendChild(img);
      });
    });
  });

  function readFileAsDataURL(file){
    return new Promise((res, rej)=>{
      const r = new FileReader();
      r.onload = ()=>res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // next button
  document.getElementById('next-to-cards').addEventListener('click', ()=>{
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  function loadCartes(){
    const container = document.getElementById('cartes-container');
    container.innerHTML = '';
    cartesAnimaux.forEach(name=>{
      const img = document.createElement('img');
      img.src = name;
      img.className = 'carte';
      img.alt = name;
      img.onclick = ()=>{
        if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c=>c !== name);
        img.classList.toggle('selected');
      };
      container.appendChild(img);
    });
  }

  // choose background
  document.getElementById('choose-background').addEventListener('click', ()=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    document.getElementById('page-background').classList.remove('hidden');
    loadBackgroundOptions();
  });

  function loadBackgroundOptions(){
    const grid = document.getElementById('background-grid');
    grid.innerHTML = '';
    const backgrounds = ['foret.jpg','ferme.jpg','ocean.jpg','savane.jpg'];
    backgrounds.forEach(name=>{
      const img = document.createElement('img'); img.src = name; img.alt = name;
      img.addEventListener('click', ()=>{ window.selectedBackground = name; document.querySelectorAll('#background-grid img').forEach(i=>i.classList.remove('selected')); img.classList.add('selected'); });
      grid.appendChild(img);
    });
  }

  // random bg
  document.getElementById('random-background').addEventListener('click', ()=>{
    const arr = ['foret.jpg','ferme.jpg','ocean.jpg','savane.jpg'];
    window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    goPreview();
  });

  document.getElementById('preview-btn').addEventListener('click', goPreview);

  function goPreview(){
    if(!window.selectedBackground) {
      alert('Choisis un fond !');
      return;
    }
    const preview = document.getElementById('preview-container');
    preview.innerHTML = '';
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';

    // add drawings (dataURLs) — placed left
    let x = 20;
    window.dessins.forEach((src,i)=>{
      const img = document.createElement('img');
      img.src = src;
      img.dataset.type = 'child';
      img.style.position = 'absolute';
      img.style.bottom = '8px';
      img.style.left = `${x}px`;
      img.style.width = '90px';
      preview.appendChild(img);
      x += 120;
    });

    // add selected cards — placed from right of drawings
    window.selectedCartes.forEach((name,i)=>{
      const img = document.createElement('img');
      img.src = name;
      img.dataset.type = 'card';
      img.style.position = 'absolute';
      img.style.bottom = '8px';
      img.style.left = `${x}px`;
      img.style.width = '90px';
      preview.appendChild(img);
      x += 120;
    });

    // show preview page
    document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
    document.getElementById('page-preview').classList.remove('hidden');
  }

});
