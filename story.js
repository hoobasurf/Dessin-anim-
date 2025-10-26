// story.js — moteur complet d'animation + voix cartoon + bouche qui bouge
document.addEventListener("DOMContentLoaded", () => {

  const preview = document.getElementById("preview-container");
  const generateBtn = document.getElementById("generate-story");

  if (!window.dessins) window.dessins = [];
  if (!window.selectedCartes) window.selectedCartes = [];
  if (!window.selectedBackground) window.selectedBackground = null;

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
  };

  function createAnimal(src, index, totalOffset = 0) {
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "absolute";
    img.style.width = "90px";
    img.style.bottom = `${Math.random() * 150}px`;
    img.style.left = `${50 + index * 120 + totalOffset}px`;

    // yeux clignement
    img.style.transition = "transform 0.2s";

    // animation haut-bas + rotation légère
    let direction = 1;
    setInterval(() => {
      let bottom = parseFloat(img.style.bottom);
      if (bottom > 200) direction = -1;
      if (bottom < 20) direction = 1;
      img.style.bottom = `${bottom + direction * 1.5}px`;
      img.style.transform = `rotate(${Math.sin(Date.now() / 200) * 5}deg)`;
    }, 30);

    return img;
  }

  function speakAnimal(src, delay = 0) {
    if (!animauxVoix[src]) return;
    setTimeout(() => {
      const voice = animauxVoix[src];
      const utter = new SpeechSynthesisUtterance(voice.text);
      utter.pitch = voice.pitch;
      utter.rate = voice.rate;
      window.speechSynthesis.speak(utter);

      // bouche animation (simple scaleY)
      const imgs = Array.from(preview.querySelectorAll("img"));
      const animalImg = imgs.find(i => i.src.includes(src));
      if (!animalImg) return;
      let mouthOpen = false;
      const mouthInterval = setInterval(() => {
        animalImg.style.transform = `scaleY(${mouthOpen ? 1 : 0.8}) rotate(${Math.sin(Date.now()/200)*5}deg)`;
        mouthOpen = !mouthOpen;
      }, 300);
      setTimeout(() => clearInterval(mouthInterval), voice.text.length * 400); // durée voix
    }, delay);
  }

  generateBtn.addEventListener("click", () => {
    if (!window.selectedBackground) return alert("Choisis un fond !");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // Dessins de l'enfant
    window.dessins.forEach((src, i) => {
      const el = createAnimal(src, i);
      preview.appendChild(el);
    });

    // Cartes animaux avec séquence aléatoire
    window.selectedCartes.forEach((src, i) => {
      const el = createAnimal(src, i + window.dessins.length);
      preview.appendChild(el);

      speakAnimal(src, i * 1500);
    });
  });

});
