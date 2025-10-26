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
        cartesSection.classList.remove('hidden'); loadCartes();
      } else if(mode === 'dessins'){
        importDessins.classList.remove('hidden');
      } else if(mode === 'dessins-cartes'){
        importDessins.classList.remove('hidden'); cartesSection.classList.remove('hidden'); loadCartes();
      }
    });
  });

  // Import dessins (max 3)
  document.getElementById('file-input').addEventListener('change', (e)=>{
    const files = e.target.files;
    window.dessins = [];
    document.getElementById('dessins-preview').innerHTML='';
    for(let i=0;i<Math.min(files.length,3);i++){
      const reader = new FileReader();
      reader.onload = (event)=>{
        removeBackground(event.target.result,(transparentSrc)=>{
          window.dessins.push(transparentSrc);
          const img = document.createElement("img");
          img.src = transparentSrc;
          document.getElementById('dessins-preview').appendChild(img);
        });
      };
      reader.readAsDataURL(files[i]);
    }
  });

  document.getElementById('next-to-cards')?.addEventListener('click',()=>{
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
  });

  // Load cartes
  function loadCartes(){
    const container = document.getElementById("cartes-container");
    container.innerHTML="";
    cartesAnimaux.forEach(name=>{
      const img = document.createElement("img");
      img.src=name;
      img.classList.add("carte");
      img.onclick=()=>{
        if(!window.selectedCartes.includes(name)) window.selectedCartes.push(name);
        else window.selectedCartes = window.selectedCartes.filter(c=>c!==name);
        img.classList.toggle("selected");
      };
      container.appendChild(img);
    });
  }

  // Choisir fond
  document.getElementById("choose-background")?.addEventListener("click",()=>{
    showPage("page-background");
    loadBackgroundOptions();
  });

  function loadBackgroundOptions(){
    const grid = document.getElementById("background-grid");
    grid.innerHTML="";
    const backgrounds = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    backgrounds.forEach(name=>{
      const img = document.createElement("img");
      img.src=name;
      img.classList.add("fond-option");
      img.onclick=()=>{
        document.querySelectorAll("#background-grid img").forEach(i=>i.classList.remove("selected"));
        img.classList.add("selected");
        window.selectedBackground = name;
      };
      grid.appendChild(img);
    });
  }

  document.getElementById("random-background")?.addEventListener("click",()=>{
    const arr=["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    goPreview();
  });

  document.getElementById("preview-btn")?.addEventListener("click",goPreview);

  // Preview
  function goPreview(){
    const preview = document.getElementById("preview-container");
    preview.innerHTML="";

    if(!window.selectedBackground){
      const arr=["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
      window.selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    }

    preview.style.backgroundImage=`url(${window.selectedBackground})`;
    preview.style.backgroundSize="cover";
    preview.style.backgroundPosition="center";
    preview.style.position="relative";

    window.dessins.forEach((src,i)=>{
      const img=document.createElement("img");
      img.src=src;
      img.style.position="absolute";
      img.style.bottom="0";
      img.style.left=`${10+i*120}px`;
      img.style.width="90px";
      preview.appendChild(img);
    });

    window.selectedCartes.forEach((name,i)=>{
      const img=document.createElement("img");
      img.src=name;
      img.style.position="absolute";
      img.style.bottom="0";
      img.style.left=`${300+i*120}px`;
      img.style.width="90px";
      preview.appendChild(img);
    });

    showPage("page-preview");
  }

  // Bouton créer histoire
  document.getElementById("generate-story")?.addEventListener("click",()=>{
    if(window._finalStoryEngine) window._finalStoryEngine();
    else goPreview();
  });

  function showPage(pageId){
    document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
    document.getElementById(pageId)?.classList.remove("hidden");
  }

  // Découpe fond clair
  window.removeBackground = function(imageSrc,callback){
    const img=new Image();
    img.crossOrigin="anonymous";
    img.src=imageSrc;
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=img.width;
      canvas.height=img.height;
      const ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0);
      const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
      const data=imageData.data;
      for(let i=0;i<data.length;i+=4){
        const r=data[i],g=data[i+1],b=data[i+2];
        if(r>240 && g>240 && b>240) data[i+3]=0;
      }
      ctx.putImageData(imageData,0,0);
      callback(canvas.toDataURL("image/png"));
    };
    img.onerror=()=>{callback(imageSrc);};
  };

});
