// story.js — moteur complet d'animation + voix cartoon

document.addEventListener("DOMContentLoaded", () => {

  if(!window.dessins) window.dessins = [];
  if(!window.selectedCartes) window.selectedCartes = [];
  if(!window.selectedBackground) window.selectedBackground = null;

  const preview = document.getElementById("preview-container");
  const generateBtn = document.getElementById("generate-story");

  // configuration des animaux et voix
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
    "girafe.png": { pitch: 1.0, rate: 1.0, text: "Hmm !" },
    // ajouter les autres animaux ici
  };

  function createAnimalElement(src, index) {
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "absolute";
    img.style.width = "90px";
    img.style.bottom = `${Math.random() * 150}px`;
    img.style.left = `${50 + index * 120}px`;
    img.dataset.index = index;

    // animation haut-bas + rotation + clignement yeux simple
    let direction = 1;
    setInterval(() => {
      let bottom = parseFloat(img.style.bottom);
      if(bottom > 200) direction = -1;
      if(bottom < 20) direction = 1;
      img.style.bottom = `${bottom + direction*1.5}px`;
      img.style.transform = `rotate(${Math.sin(Date.now()/200)*5}deg)`;
    }, 30);

    return img;
  }

  function speakAnimal(src) {
    if(!animauxVoix[src]) return;
    const voice = animauxVoix[src];
    const utter = new SpeechSynthesisUtterance(voice.text);
    utter.pitch = voice.pitch;
    utter.rate = voice.rate;
    window.speechSynthesis.speak(utter);
  }

  generateBtn.addEventListener("click", () => {
    if(!window.selectedBackground) return alert("Choisis un fond !");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // Dessins de l'enfant
    window.dessins.forEach((src, i) => {
      const el = createAnimalElement(src, i);
      preview.appendChild(el);
      // dessins animés muets par défaut
    });

    // Cartes animaux
    window.selectedCartes.forEach((src, i) => {
      const el = createAnimalElement(src, i + window.dessins.length);
      preview.appendChild(el);

      // lancer voix avec délai pour chaque animal pour la séquence
      setTimeout(() => speakAnimal(src), i * 1500);
    });
  });

});
