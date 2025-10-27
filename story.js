// story.js — moteur d’histoire avec MP3 voix humaine
window.storyEngine = (function(){
  const mp3Voices = [
    "20251027_201425_1.mp3",
    "20251027_201425_2.mp3",
    "20251027_201425_3.mp3",
    "20251027_201425_4.mp3",
    "20251027_201425_5.mp3",
    "20251027_201425_6.mp3",
    "20251027_201425_7.mp3",
    "20251027_201425_8.mp3"
  ];

  const storyTexts = [
    "Bonjour Malo ! Aujourd'hui nous allons explorer ensemble.",
    "Regarde, le lion arrive doucement dans la savane.",
    "Le chat curieux rencontre le chien joueur.",
    "Mme Girafe observe les oiseaux voler dans le ciel.",
    "Le cochon rigole en voyant le mouton sauter.",
    "Et maintenant, un dauphin vient saluer l'enfant.",
    "Oh regarde le singe grimper dans les arbres !",
    "Le renard fait une surprise à tous les animaux.",
    "Une petite aventure commence dans la forêt."
  ];

  function playVoice(index){
    if(!window.selectedCartes.length && !window.dessins.length) return;
    const audio = new Audio(mp3Voices[index % mp3Voices.length]);
    audio.play();
  }

  function animateAnimal(img){
    let scale = 1;
    let growing = true;
    setInterval(()=>{
      if(growing){ scale += 0.01; if(scale>1.1) growing=false; }
      else { scale -= 0.01; if(scale<1) growing=true; }
      img.style.transform = `scale(${scale})`;
    }, 80);
  }

  function displayText(text){
    const container = document.getElementById("preview-container");
    let existing = container.querySelector(".story-text");
    if(!existing){
      existing = document.createElement("div");
      existing.classList.add("story-text");
      container.appendChild(existing);
    }
    existing.innerText = text;
  }

  function startStory(){
    const container = document.getElementById("preview-container");
    let index = 0;
    const animals = Array.from(container.querySelectorAll("img")).slice(0,5); // max 5 animaux
    animals.forEach(a => animateAnimal(a));

    function next(){
      if(index >= storyTexts.length) return;
      displayText(storyTexts[index]);
      playVoice(index);
      index++;
      setTimeout(next, 4000); // 4 sec par phrase
    }
    next();
  }

  return { startStory };
})();
