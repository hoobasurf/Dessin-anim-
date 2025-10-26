// story.js — moteur complet d'animation, yeux clignotent, bouche animée, voix cartoon
document.addEventListener("DOMContentLoaded", () => {

  const preview = document.getElementById("preview-container");
  const generateBtn = document.getElementById("generate-story");

  if (!window.dessins) window.dessins = [];
  if (!window.selectedCartes) window.selectedCartes = [];
  if (!window.selectedBackground) window.selectedBackground = null;

  // Paramètres voix pour chaque animal
  const animauxVoix = {
    "cochon.png": { pitch: 0.6, rate: 0.8, text: "Groin groin !" },
    "chat.png": { pitch: 1.5, rate: 1.8, text: "Miaou !" },
    "cheval.png": { pitch: 0.8, rate: 0.7, text: "Hiiiii !" },
    "chien.png": { pitch: 1.2, rate: 1.2, text: "Ouaf !" },
    "vache.png": { pitch: 0.5, rate: 0.7, text: "Meuh !" },
    "mouton.png": { pitch: 1.0, rate: 1.0, text: "Bêê !" },
    "poule.png": { pitch: 1.2, rate: 1.4, text: "Cot cot !" },
    "poussin.png": { pitch: 1.8, rate: 2.0, text: "Piou piou !" },
    "lion.png": { pitch: 0.8, rate: 0.8, text: "Rooooar !" },
    "zebre.png": { pitch: 1.0, rate: 0.9, text: "Hiii !" },
    "elephant.png": { pitch: 0.4, rate: 0.7, text: "Brrr !" },
    "girafe.png": { pitch: 1.0, rate: 1.0, text: "Hmm !" }
  };

  function createAnimalElement(src, index, offset = 0){
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.width = "90px";
    container.style.bottom = `${Math.random()*150}px`;
    container.style.left = `${50 + index*120 + offset}px`;
    container.style.textAlign = "center";

    const img = document.createElement("img");
    img.src = src;
    img.style.width = "90px";
    container.appendChild(img);

    // Ajout yeux
    const eyes = document.createElement("div");
    eyes.style.position = "absolute";
    eyes.style.width = "20px";
    eyes.style.height = "8px";
    eyes.style.borderRadius = "50%";
    eyes.style.background = "black";
    eyes.style.top = "15px";
    eyes.style.left = "35px";
    container.appendChild(eyes);

    // Bouche
    const mouth = document.createElement("div");
    mouth.style.position = "absolute";
    mouth.style.width = "20px";
    mouth.style.height = "6px";
    mouth.style.background = "red";
    mouth.style.borderRadius = "3px";
    mouth.style.top = "60px";
    mouth.style.left = "35px";
    container.appendChild(mouth);

    // Mouvement vertical aléatoire
    let direction = 1;
    setInterval(() => {
      let bottom = parseFloat(container.style.bottom);
      if(bottom > 200) direction = -1;
      if(bottom < 20) direction = 1;
      container.style.bottom = `${bottom + direction*1.5}px`;
      container.style.transform = `rotate(${Math.sin(Date.now()/200)*5}deg)`;
    }, 30);

    // Clignement yeux
    setInterval(() => {
      eyes.style.height = eyes.style.height === "8px" ? "2px" : "8px";
    }, 1000 + Math.random()*2000);

    return { container, mouth, img };
  }

  function speakAnimal(src, el, delay = 0){
    if(!animauxVoix[src]) return;
    setTimeout(() => {
      const voice = animauxVoix[src];
      const utter = new SpeechSynthesisUtterance(voice.text);
      utter.pitch = voice.pitch;
      utter.rate = voice.rate;
      window.speechSynthesis.speak(utter);

      let mouthOpen = false;
      const mouthInterval = setInterval(() => {
        el.mouth.style.height = mouthOpen ? "6px" : "2px";
        mouthOpen = !mouthOpen;
      }, 200);

      setTimeout(() => clearInterval(mouthInterval), voice.text.length*400);
    }, delay);
  }

  generateBtn.addEventListener("click", () => {
    if(!window.selectedBackground) return alert("Choisis un fond !");

    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    const allElements = [];

    // Dessins enfant
    window.dessins.forEach((src, i) => {
      const el = createAnimalElement(src, i);
      preview.appendChild(el.container);
      allElements.push({src, el});
    });

    // Cartes animaux
    window.selectedCartes.forEach((src, i) => {
      const el = createAnimalElement(src, i + window.dessins.length);
      preview.appendChild(el.container);
      allElements.push({src, el});
    });

    // Faire parler chaque animal avec décalage
    allElements.forEach((item, i) => {
      speakAnimal(item.src, item.el, i*1500);
    });
  });

});
