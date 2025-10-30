// story.js — moteur des histoires et lecture MP3
document.addEventListener("DOMContentLoaded", () => {

  window._finalStoryEngine = true; // indique que story.js est chargé

  const generateBtn = document.getElementById("generate-story");
  generateBtn.addEventListener("click", () => {

    const preview = document.getElementById("preview-container");
    if(!window.selectedBackground) return alert("Choisis un fond !");
    if(window.selectedCartes.length === 0 && window.dessins.length === 0) return alert("Choisis au moins un animal !");

    // Histoires aléatoires (exemple 1)
    const storyText = [
      {speaker:"Narrateur", text:"Aujourd’hui, le soleil brillait dans la Forêt des Secrets. Nos amis animaux partent à l’aventure."},
      {speaker:"Chat", text:"Hé ! Regardez là-bas ! Une grotte mystérieuse derrière les buissons."},
      {speaker:"Chien", text:"Moi ! Attention aux racines… Oh, une feuille colorée ! Quelle couleur vois-tu, Malo ?"},
      {speaker:"Girafe", text:"Et si on montait là-haut pour voir la forêt entière ? Les oiseaux chantent des mélodies rigolotes !"},
      {speaker:"Singe", text:"Hahaha ! Regardez ce tronc qui bouge ! On dirait qu’il danse !"},
      {speaker:"Éléphant", text:"Et si nous faisions une course jusqu’au ruisseau ? Attention, l’eau éclabousse !"},
      {speaker:"Narrateur", text:"Après avoir rigolé, sauté, et exploré, nos amis découvrent enfin le trésor."},
      {speaker:"Chien", text:"Quelle belle journée ! On a joué, exploré, et appris de nouvelles couleurs."},
      {speaker:"Narrateur", text:"Et ainsi, la Forêt des Secrets reste un endroit magique, rempli d’aventures et de rires."}
    ];

    let currentIndex = 0;

    function playNext(){
      if(currentIndex >= storyText.length) return;
      const part = storyText[currentIndex];
      highlightSpeaker(part.speaker);

      const audio = new Audio(`20251027_201425_1.mp3`); // ta voix MP3
      audio.play();
      audio.onended = () => {
        currentIndex++;
        setTimeout(playNext, 1200); // pause 1.2 sec entre phrases
      };
    }

    function highlightSpeaker(speaker){
      const imgs = preview.querySelectorAll("img");
      imgs.forEach(img => img.style.transform = "scale(1)");
      // on fait un léger mouvement sur le premier animal pour indiquer qui parle
      if(window.selectedCartes.length > 0){
        imgs[0].style.transform = "scale(1.05)";
      } else if(window.dessins.length > 0){
        imgs[0].style.transform = "scale(1.05)";
      }
    }

    playNext();
  });

});
