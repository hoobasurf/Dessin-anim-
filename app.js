// app.js — gestion UI, import dessins, cartes, fonds, prévisualisation
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

      if(mode === 'cartes') {
        cartesSection.classList.remove('hidden');
        loadCartes();
      } else if(mode === 'dessins') {
        importDessins.classList.remove('hidden');
      } else if(mode === 'dessins-cartes') {
        importDessins.classList.remove('hidden');
        cartesSection.classList.remove('hidden');
        loadCartes();
      }
    });
  });

  // Import dessins + suppression fond
  document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    window.dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';
    for(let i=0;i<Math.min(files.length,3);i++){
      const reader = new FileReader();
      reader.onload = (event)=>{
        removeBackground(event.target.result, (transparentSrc)=>{
          window.dessins.push(transparentSrc);
          const img = document.createElement('img');
          img.src = transparentSrc;
          document.getElementById('dessins-preview').appendChild(img);
        });
      };
      reader.readAsDataURL(files[i]);
    }
  });

  // Bouton suivant
  document.getElementById('next-to-cards')?.addEventListener('click', ()=>{
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  // Charger cartes
  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML = "";
    cartesAnimaux.forEach(name=>{
      const img = document.createElement("img");
      img.src = name;
      img.classList.add("carte");
      img.onclick = ()=>{
        if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c=>c!==name);
        img.classList.toggle("selected");
      };
      container.appendChild(img);
    });
  }

  // Bouton choisir fond
  document.getElementById("choose-background")?.addEventListener("click", ()=>{
    showPage("page-background");
    loadBackgroundOptions();
  });

  // Charger fonds
  function loadBackgroundOptions(){
    const grid = document.getElementById("background-grid");
    grid.innerHTML = "";
    const backgrounds = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    backgrounds.forEach(name=>{
      const img = document.createElement("img");
      img.src = name;
      img.classList.add("fond-option");
      img.onclick = ()=>{
        document.querySelectorAll("#background-grid img").forEach(i=>i.classList.remove("selected"));
        img.classList.add("selected");
        window.selectedBackground = name;
      };
      grid.appendChild(img);
    });
  }

  // Fond aléatoire
  document.getElementById("random-background")?.addEventListener("click", ()=>{
    const arr = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    goPreview();
  });

  // Preview
  document.getElementById("preview-btn")?.addEventListener("click", goPreview);

  function goPreview(){
    // si selectedBackground pas défini mais qu'il y a déjà un style, on le récupère
    if(!window.selectedBackground){
      const bg = document.getElementById("preview-container").style.backgroundImage;
      if(bg) window.selectedBackground = bg.replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
    }
    if(!window.selectedBackground) return alert("Choisis un fond !");

    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    // Dessins
    window.dessins.forEach((src,i)=>{
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.bottom = "0";
      img.style.left = `${10+i*120}px`;
      img.style.width = "90px";
      preview.appendChild(img);
    });

    // Cartes
    window.selectedCartes.forEach((name,i)=>{
      const img = document.createElement("img");
      img.src = name;
      img.style.position = "absolute";
      img.style.bottom = "0";
      img.style.left = `${300+i*120}px`;
      img.style.width = "90px";
      preview.appendChild(img);
    });

    showPage("page-preview");
  }

  // Générer histoire
  document.getElementById("generate-story")?.addEventListener("click", ()=>{
    if(window._finalStoryEngine){
      window._finalStoryEngine(); // story.js override
    } else {
      goPreview();
      alert("Histoire moteur absent — si story.js est chargé il prendra le relais.");
    }
  });

  function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
    document.getElementById(id)?.classList.remove("hidden");
  }

  // remove background (canvas simple)
  window.removeBackground = function(src,callback){
    const img = new Image();
    img.crossOrigin="anonymous";
    img.src = src;
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=img.width;
      canvas.height=img.height;
      const ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0);
      const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
      const data=imageData.data;
      for(let i=0;i<data.length;i+=4){
        if(data[i]>240 && data[i+1]>240 && data[i+2]>240) data[i+3]=0;
      }
      ctx.putImageData(imageData,0,0);
      callback(canvas.toDataURL("image/png"));
    };
    img.onerror=()=>{callback(src);}
  };
});
