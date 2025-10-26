// story.js — moteur histoire et animation
document.addEventListener("DOMContentLoaded", () => {

  const genBtn = document.getElementById("generate-story");
  const preview = document.getElementById("preview-container");

  // Liste d’histoires aléatoires (ajoute-en 50+ pour varier)
  const stories = [
    "Il était une fois un cochon curieux qui voulait découvrir la forêt.",
    "Un chat malicieux partit explorer l’océan et y rencontra des poissons.",
    "Le cheval et le chien jouaient dans la savane quand un lion est arrivé.",
    "La vache et le mouton organisèrent une fête dans la ferme avec tous les animaux.",
    "Le lion et le singe racontaient des secrets de la jungle aux autres animaux.",
    "L’éléphant rencontra un dauphin près de l’océan et ils devinrent amis."
  ];

  // Voix personnalisées par type d’animal
  const animalVoices = {
    "cochon": { pitch: 0.8, rate: 0.9 },
    "chat": { pitch: 1.5, rate: 1.3 },
    "cheval": { pitch: 0.7, rate: 0.8 },
    "chien": { pitch: 1.0, rate: 1.0 },
    "vache": { pitch: 0.6, rate: 0.7 },
    "mouton": { pitch: 1.0, rate: 1.0 },
    "lion": { pitch: 0.9, rate: 0.9 },
    "singe": { pitch: 1.2, rate: 1.2 },
    "dauphin": { pitch: 1.3, rate: 1.4 },
    "elephant": { pitch: 0.5, rate: 0.6 },
    // Ajoute tous les animaux utilisés
  };

  genBtn.addEventListener("click", () => {

    preview.innerHTML = "";
    preview.style.position = "relative";

    if(!window.selectedBackground) return alert("Choisis un fond !");
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // Dessins + cartes
    const animaux = [...window.dessins, ...window.selectedCartes];
    if(animaux.length === 0) return alert("Pas d'animaux pour l'histoire !");

    // Choisir une histoire aléatoire
    const story = stories[Math.floor(Math.random() * stories.length)];

    animaux.forEach((src, i) => {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.bottom = "0";
      container.style.left = `${50 + i*120}px`;
      container.style.width = "100px";

      // Image animal
      const img = document.createElement("img");
      img.src = src;
      img.style.width = "100px";
      container.appendChild(img);

      // Yeux
      const eye = document.createElement("div");
      eye.className = "eye";
      container.appendChild(eye);

      // Bouche
      const mouth = document.createElement("div");
      mouth.className = "mouth";
      container.appendChild(mouth);

      preview.appendChild(container);

      // Déterminer type d'animal par nom de fichier
      let animalType = "chien"; // par défaut
      for (let key in animalVoices) {
        if(src.toLowerCase().includes(key)) animalType = key;
      }

      // Synthèse vocale
      const utter = new SpeechSynthesisUtterance(story);
      utter.pitch = animalVoices[animalType].pitch;
      utter.rate = animalVoices[animalType].rate;
      utter.volume = 1.0;
      const voices = window.speechSynthesis.getVoices();
      if(voices.length > 0) utter.voice = voices[i % voices.length];
      window.speechSynthesis.speak(utter);
    });

  });

});
