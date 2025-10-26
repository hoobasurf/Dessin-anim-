// story.js — animation propre et voix cartoon
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

  function animateImage(img, startLeft) {
    let bottom = Math.random() * 150 + 20;
    let direction = Math.random() > 0.5 ? 1 : -1;
    img.style.position = "absolute";
    img.style.bottom = `${bottom}px`;
    img.style.left = `${startLeft}px`;
    img.style.width = "90px";
    img.style.transition = "transform 0.1s";

    setInterval(() => {
      if (bottom > 220) direction = -1;
      if (bottom < 20) direction = 1;
      bottom += direction * 1.5;
      img.style.bottom = `${bottom}px`;
      img.style.transform = `rotate(${Math.sin(Date.now()/200)*5}deg)`;
    }, 30);
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
    preview.style.position = "relative";

    let index = 0;

    // Dessins importés (pas de son)
    window.dessins.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      preview.appendChild(img);
      animateImage(img, 50 + index * 120);
      index++;
    });

    // Cartes animaux (avec voix)
    window.selectedCartes.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      preview.appendChild(img);
      animateImage(img, 50 + index * 120);
      speakAnimal(src);
      index++;
    });
  });

});
