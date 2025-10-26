// story.js — moteur histoire animé enfant
document.addEventListener("DOMContentLoaded", ()=>{
  window._finalStoryEngine = function(){

    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    const allItems = [...window.dessins, ...window.selectedCartes];

    // position de départ aléatoire
    const positions = allItems.map((_,i)=>({
      x: 50 + Math.random()*500,
      y: 50 + Math.random()*300,
      dirX: Math.random()>0.5?1:-1,
      dirY: Math.random()>0.5?1:-1
    }));

    // Voix cartoon par animal
    const voices = {
      "cochon.png": {pitch:0.6, rate:0.8},
      "chat.png": {pitch:1.8, rate:1.5},
      "cheval.png": {pitch:0.9, rate:0.7},
      "chien.png": {pitch:1.2, rate:1.0},
      "vache.png": {pitch:0.7, rate:0.8},
      "mouton.png": {pitch:1.0, rate:1.0},
      "elephant.png": {pitch:0.5, rate:0.6},
      "lion.png": {pitch:0.8, rate:0.9},
      "zebre.png": {pitch:1.0, rate:1.1},
      // autres animaux par défaut
    };

    // créer images
    const elements = allItems.map((src,i)=>{
      const img = document.createElement("img");
      img.src = src;
      img.style.position="absolute";
      img.style.width="90px";
      img.style.left = positions[i].x+"px";
      img.style.top = positions[i].y+"px";
      preview.appendChild(img);
      return img;
    });

    // créer histoire aléatoire (texte pour la voix, pas affiché)
    const phrases = [
      "Un petit animal curieux explore la forêt.",
      "Dans le pré, les amis jouent ensemble.",
      "Une aventure rigolote commence ici.",
      "Le soleil brille et tout le monde s'amuse.",
      "Les animaux découvrent un secret magique."
    ];

    const storyText = [];
    elements.forEach((el,i)=>{
      const animal = allItems[i].split("/").pop();
      const phrase = phrases[Math.floor(Math.random()*phrases.length)];
      storyText.push({animal, phrase});
    });

    // fonction voix
    function speak(text, animal){
      const msg = new SpeechSynthesisUtterance(text);
      if(voices[animal]){
        msg.pitch = voices[animal].pitch;
        msg.rate = voices[animal].rate;
      } else {
        msg.pitch = 1;
        msg.rate = 1;
      }
      window.speechSynthesis.speak(msg);
    }

    // animer chaque image
    function animate(){
      elements.forEach((el,i)=>{
        positions[i].x += positions[i].dirX*1.5;
        positions[i].y += positions[i].dirY*1.5;

        // rebond sur les bords
        if(positions[i].x < 0 || positions[i].x > preview.clientWidth-90) positions[i].dirX *= -1;
        if(positions[i].y < 0 || positions[i].y > preview.clientHeight-90) positions[i].dirY *= -1;

        el.style.left = positions[i].x+"px";
        el.style.top = positions[i].y+"px";
      });
      requestAnimationFrame(animate);
    }
    animate();

    // lancer la voix pour chaque animal avec délai
    storyText.forEach((item,i)=>{
      setTimeout(()=>{
        speak(item.phrase,item.animal);
      }, i*1500);
    });
  };
});
