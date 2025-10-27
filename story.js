// story.js — moteur d’histoire animé pour enfants
document.addEventListener("DOMContentLoaded", () => {
  if (!window.dessins || !window.selectedCartes || !window.selectedBackground) return;

  window._finalStoryEngine = true; // signal pour app.js

  const genBtn = document.getElementById("generate-story");
  const preview = document.getElementById("preview-container");

  // Limiter le nombre d'animaux affichés
  const animaux = window.selectedCartes.slice(0,5);

  // Histoire aléatoire pour chaque fond
  const histoires = [
    "Aujourd'hui, nous allons explorer le {fond} et rencontrer plein d'amis !",
    "Dans la {fond}, il y avait des surprises pour tous les animaux.",
    "Une grande aventure commence dans la {fond} avec nos amis !",
    "Regarde ce qui se passe dans la {fond}, c'est magique !",
    "Les animaux s'amusent dans la {fond} et découvrent des trésors."
  ];

  // voix par animal
  const voixAnimaux = {
    "cochon.png": {rate:0.8, pitch:0.6},
    "chat.png": {rate:1.2, pitch:1.2},
    "cheval.png": {rate:0.9, pitch:0.7},
    "chien.png": {rate:1, pitch:0.9},
    "vache.png": {rate:0.7, pitch:0.6},
    "mouton.png": {rate:1, pitch:0.8},
    "poule.png": {rate:1.2, pitch:1.1},
    "poussin.png": {rate:1.3, pitch:1.4},
    "lion.png": {rate:0.8, pitch:0.9},
    "tortue.png": {rate:0.6, pitch:0.5},
    "elephant.png": {rate:0.7, pitch:0.5},
    "zebre.png": {rate:1, pitch:1},
    "singe.png": {rate:1.3, pitch:1.2},
    "girafe.PNG": {rate:0.9, pitch:1},
    "loup.png": {rate:0.9, pitch:0.8},
    "renard.png": {rate:1.1, pitch:1.1},
    "dauphin.png": {rate:1.2, pitch:1.3},
    "poisson.png": {rate:1.1, pitch:1.2},
    "pieuvre.png": {rate:1, pitch:1.1},
    "ecureuil.png": {rate:1.3, pitch:1.4},
    "otarie.png": {rate:1, pitch:1},
    "requin.png": {rate:0.8, pitch:0.7},
    "ours.png": {rate:0.8, pitch:0.6},
    "cerf.png": {rate:0.9, pitch:0.7},
    "guepard.png": {rate:1.3, pitch:1.2}
  };

  // Animation bouche (simple : agrandir / réduire)
  function animeBouche(img){
    let open = false;
    return setInterval(() => {
      img.style.transform = open ? "scaleY(1)" : "scaleY(1.4)";
      open = !open;
    }, 400);
  }

  // Animation yeux clignotants
  function animeYeux(img){
    let open = true;
    return setInterval(() => {
      img.style.opacity = open ? "1" : "0.6";
      open = !open;
    }, 600);
  }

  // lancer la story
  genBtn.addEventListener("click", () => {
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    animaux.forEach((fileName,i)=>{
      const img = document.createElement("img");
      img.src = fileName;
      img.style.position = "absolute";
      img.style.bottom = "20px";
      img.style.left = `${50 + i*150}px`;
      img.style.width = "120px";
      preview.appendChild(img);

      animeBouche(img);
      animeYeux(img);
    });

    // narration aléatoire
    const synth = window.speechSynthesis;
    animaux.forEach((fileName,i)=>{
      const storyText = histoires[Math.floor(Math.random()*histoires.length)]
                        .replace("{fond}", window.selectedBackground.split(".")[0]);

      const utter = new SpeechSynthesisUtterance(`${storyText}`);
      const v = voixAnimaux[fileName] || {rate:1, pitch:1};
      utter.rate = v.rate;
      utter.pitch = v.pitch;
      utter.voice = synth.getVoices().find(voice => voice.lang.startsWith("fr")) || null;

      setTimeout(()=> synth.speak(utter), i*3000); // décalage voix
    });
  });
});
