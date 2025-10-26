document.addEventListener("DOMContentLoaded", () => {

  const generateBtn = document.getElementById("generate-story");
  const preview = document.getElementById("preview-container");

  const histoires = [
    "Aujourd'hui, {animal} se promène dans {fond} et rencontre plein d'amis.",
    "{animal} chante une chanson et tout le monde l'écoute attentivement.",
    "Une aventure commence quand {animal} découvre un trésor caché dans {fond}.",
    "{animal} raconte une blague à ses amis et ils rient ensemble.",
    "{animal} et ses copains jouent à cache-cache dans {fond}.",
    "Dans {fond}, {animal} trouve une surprise inattendue.",
    "C'est l'heure du goûter pour {animal} et ses amis dans {fond}.",
    "{animal} apprend à nager dans l'eau claire de {fond}.",
    "Un oiseau indique le chemin secret à {animal} dans {fond}.",
    "{animal} rêve de devenir le héros de {fond}."
  ];

  // voix par type d'animal
  const voixAnimaux = {
    "cochon": {rate:0.8, pitch:0.8, lang:'fr-FR'},
    "chat": {rate:1.3, pitch:1.8, lang:'fr-FR'},
    "cheval": {rate:0.9, pitch:0.7, lang:'fr-FR'},
    "chien": {rate:1, pitch:1.2, lang:'fr-FR'},
    "vache": {rate:0.8, pitch:0.7, lang:'fr-FR'},
    "poule": {rate:1.2, pitch:1.5, lang:'fr-FR'},
    "dauphin": {rate:1.1, pitch:1.7, lang:'fr-FR'},
    "elephant": {rate:0.7, pitch:0.5, lang:'fr-FR'},
    "lion": {rate:0.9, pitch:1.1, lang:'fr-FR'},
    "zebre": {rate:1, pitch:1.0, lang:'fr-FR'},
    "girafe": {rate:1, pitch:1.3, lang:'fr-FR'},
    "ours": {rate:0.8, pitch:0.6, lang:'fr-FR'},
    // compléter selon besoin...
  };

  function parler(animal, texte, imgEl) {
    return new Promise(resolve => {
      const synth = window.speechSynthesis;
      const msg = new SpeechSynthesisUtterance(texte);

      const voix = voixAnimaux[animal.toLowerCase()] || {rate:1, pitch:1, lang:'fr-FR'};
      msg.rate = voix.rate;
      msg.pitch = voix.pitch;
      msg.lang = voix.lang;

      msg.onstart = () => {
        imgEl.classList.add("bouche-anim");
      };
      msg.onend = () => {
        imgEl.classList.remove("bouche-anim");
        resolve();
      };
      synth.speak(msg);
    });
  }

  async function lancerHistoire() {
    const animaux = Array.from(preview.querySelectorAll("img"));
    if(animaux.length===0) return;

    // chaque animal dit 1-2 phrases aléatoires
    for(let animalEl of animaux){
      const nom = animalEl.src.split("/").pop().split(".")[0]; // ex: chat.png => chat
      const n = Math.floor(Math.random()*3)+1; // 1-3 phrases
      for(let i=0;i<n;i++){
        const h = histoires[Math.floor(Math.random()*histoires.length)];
        const phrase = h.replace("{animal}", nom).replace("{fond}", window.selectedBackground?.split(".")[0] || "l'endroit");
        await parler(nom, phrase, animalEl);
      }
    }
  }

  if(generateBtn){
    generateBtn.addEventListener("click", lancerHistoire);
  }

});
