// story.js
document.addEventListener("DOMContentLoaded", ()=>{

  const genBtn = document.getElementById("generate-story");

  genBtn.addEventListener("click", ()=>{
    if(window.selectedBackground == null) return alert("Choisis un fond !");
    playHistoire(window.selectedCartes.concat(window.dessins));
  });

  async function playHistoire(animaux){
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // mélanger l’ordre
    animaux = animaux.sort(()=>0.5 - Math.random());

    const startTime = Date.now();
    const minDuration = 60 * 1000; // 60 secondes

    while(Date.now() - startTime < minDuration){
      for(let i=0; i<animaux.length; i++){
        const animal = animaux[i];
        const img = document.createElement("img");
        img.src = animal;
        img.classList.add("animal");
        img.style.position="absolute";
        img.style.bottom=`${Math.floor(Math.random()*50)}px`;
        img.style.left=`${Math.floor(Math.random()*500)}px`;
        preview.appendChild(img);

        const texte = genererDialogue(animal);
        await lireTexteAvecBouche(img, texte, animal);

        // léger déplacement aléatoire pour cartoon
        animeMouvement(img);
        await delay(300);
      }
    }
  }

  function genererDialogue(animal){
    const dialogues = {
      chat: ["Miaou ! Je vais te montrer un secret de la forêt.", "Regarde mes pattes agiles !"],
      chien: ["Wouf ! Suivez-moi, j’ai trouvé un trésor !", "Oh oh oh, quelle aventure !"],
      vache: ["Meuh, le pré est magnifique aujourd’hui.", "Regarde les fleurs colorées !"],
      cochon: ["Coucou, je joue dans la boue !", "Hihi, quelle journée amusante !"],
      cheval: ["Hiii, je cours très vite !", "Admirez ma crinière !"],
      poule: ["Cot cot, venez voir les poussins.", "Je picore des graines rigolotes."],
      default: ["Bonjour ! Je suis un animal curieux.", "Allons découvrir ce lieu !"]
    };

    animal = animal.toLowerCase();
    for(const key in dialogues){
      if(animal.includes(key)) {
        const arr = dialogues[key];
        return arr[Math.floor(Math.random()*arr.length)];
      }
    }
    const arr = dialogues.default;
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function lireTexteAvecBouche(img, texte, animal){
    return new Promise(res=>{
      const utter = new SpeechSynthesisUtterance(texte);

      if(animal.includes("chat")) {utter.pitch=1.8; utter.rate=1.2;}
      else if(animal.includes("chien")) {utter.pitch=1.2; utter.rate=1;}
      else if(animal.includes("vache")) {utter.pitch=0.6; utter.rate=0.8;}
      else if(animal.includes("cochon")) {utter.pitch=0.7; utter.rate=0.8;}
      else if(animal.includes("cheval")) {utter.pitch=0.8; utter.rate=0.7;}
      else if(animal.includes("poule")) {utter.pitch=1.5; utter.rate=1.3;}
      else {utter.pitch=1; utter.rate=1;}

      utter.onstart = ()=> img.classList.add("bouche-anim");
      utter.onend = ()=>{
        img.classList.remove("bouche-anim");
        res();
      };

      speechSynthesis.speak(utter);
    });
  }

  function animeMouvement(img){
    const deltaX = Math.floor(Math.random()*20 - 10);
    const deltaY = Math.floor(Math.random()*10 - 5);
    img.style.transition = "transform 0.5s ease";
    img.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    setTimeout(()=>{img.style.transform="translate(0,0)";}, 500);
  }

});
