// story.js — moteur complet d'animation et voix cartoon
document.addEventListener("DOMContentLoaded", () => {

  // mapping animal -> voix
  const animalVoix = {
    "cochon.png": { rate: 0.8, pitch: 0.5 },
    "chat.png": { rate: 1.5, pitch: 1.5 },
    "cheval.png": { rate: 0.7, pitch: 1.2 },
    "chien.png": { rate: 1, pitch: 1 },
    "vache.png": { rate: 0.6, pitch: 0.6 },
    "poule.png": { rate: 1.2, pitch: 1.4 },
    "poussin.png": { rate: 1.5, pitch: 1.6 },
    "lion.png": { rate: 0.8, pitch: 0.9 },
    "tigre.png": { rate: 0.9, pitch: 1 },
    "zebre.png": { rate: 0.8, pitch: 1.1 },
    "elephant.png": { rate: 0.5, pitch: 0.5 },
    "girafe.PNG": { rate: 0.6, pitch: 0.6 },
    "ours.png": { rate: 0.7, pitch: 0.5 },
    "loup.png": { rate: 0.9, pitch: 1 },
    "renard.png": { rate: 1.2, pitch: 1.3 },
    "cerf.png": { rate: 1, pitch: 1 },
    "dauphin.png": { rate: 1.2, pitch: 1.5 },
    "poisson.png": { rate: 1.5, pitch: 1.8 },
    "pieuvre.png": { rate: 1.3, pitch: 1.5 },
    "tortue.png": { rate: 0.5, pitch: 0.5 },
    "otarie.png": { rate: 1, pitch: 1 },
    "singe.png": { rate: 1.8, pitch: 1.5 },
    "requin.png": { rate: 0.8, pitch: 0.9 },
    "ecureuil.png": { rate: 1.5, pitch: 1.7 },
    "guepard.png": { rate: 1.2, pitch: 1.2 }
  };

  const genBtn = document.getElementById("generate-story");
  genBtn.addEventListener("click", startStory);

  function startStory() {
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.position = "relative";
    preview.style.overflow = "hidden";

    // fond
    const bg = window.selectedBackground || "savane.jpg";
    preview.style.backgroundImage = `url(${bg})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // mélanger dessins + cartes
    const animaux = [...(window.dessins || []), ...(window.selectedCartes || [])];

    // créer images sur fond
    animaux.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.width = "100px";
      img.style.bottom = "0px";
      img.style.left = `${50 + idx * 110}px`;
      preview.appendChild(img);

      animateAnimal(img, src);
    });
  }

  function animateAnimal(img, src) {
    let direction = 1; // 1 = monter, -1 = descendre
    let pos = 0; // position relative
    const max = 80; // hauteur max

    setInterval(() => {
      pos += direction * 1; // vitesse
      if(pos >= max) direction = -1;
      if(pos <= 0) direction = 1;
      img.style.bottom = `${pos}px`;
    }, 30);

    // voix
    if(animalVoix[src]) {
      const utter = new SpeechSynthesisUtterance(getPhrase(src));
      utter.rate = animalVoix[src].rate;
      utter.pitch = animalVoix[src].pitch;
      speechSynthesis.speak(utter);
    }
  }

  function getPhrase(src) {
    switch(src) {
      case "cochon.png": return "Groink groink !";
      case "chat.png": return "Miaou miaou !";
      case "cheval.png": return "Hiiii haaa !";
      case "chien.png": return "Ouaf ouaf !";
      case "vache.png": return "Meuh !";
      case "poule.png": return "Cot cot !";
      case "poussin.png": return "Piiip piiip !";
      case "lion.png": return "Roaaar !";
      case "tigre.png": return "Grrr !";
      case "zebre.png": return "Hiiii !";
      case "elephant.png": return "Tooooot !";
      case "girafe.PNG": return "Mmmm !";
      case "ours.png": return "Grrrr !";
      case "loup.png": return "Ahouuu !";
      case "renard.png": return "Kikiki !";
      case "cerf.png": return "Brrr !";
      case "dauphin.png": return "Siff siff !";
      case "poisson.png": return "Bloup bloup !";
      case "pieuvre.png": return "Squiii !";
      case "tortue.png": return "Toc toc !";
      case "otarie.png": return "Hiiii !";
      case "singe.png": return "Ououou !";
      case "requin.png": return "Groum !";
      case "ecureuil.png": return "Tchik tchik !";
      case "guepard.png": return "Prrr !";
      default: return "Bip bip !";
    }
  }

});
