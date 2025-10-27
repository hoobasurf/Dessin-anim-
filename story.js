document.addEventListener("DOMContentLoaded", () => {
  if(!window.dessins || !window.selectedCartes || !window.selectedBackground) return;

  window._finalStoryEngine = true;

  const genBtn = document.getElementById("generate-story");

  const histoires = [
    "Aujourd'hui dans la forêt, les animaux se préparent pour une grande fête.",
    "Au bord de l'océan, les poissons racontent leurs aventures à la pieuvre.",
    "La ferme est en effervescence, le cochon et le cheval découvrent un secret.",
    "Dans la savane, le lion et la girafe discutent d'une mission importante.",
    "Un jour étrange où tous les animaux se rencontrent et partagent leurs histoires.",
    "Le chat curieux explore la ferme et rencontre le poussin.",
    "Le dauphin joue avec les poissons près de l'océan.",
    "Le singe espiègle grimpe aux arbres de la forêt.",
    "Le loup raconte une blague au renard dans la savane.",
    "Le mouton et la vache se promènent dans la ferme.",
    "Le lion organise une course dans la savane avec ses amis.",
    "La tortue fait découvrir l'océan aux poissons.",
    "L'éléphant et le zèbre préparent une surprise pour la girafe.",
    "Le cheval et le cochon s'amusent dans la ferme.",
    "Le cerf raconte une histoire à l'ecureuil dans la forêt.",
    "Le requin et l'otarie jouent à cache-cache sous l'océan.",
    "Le chat raconte ses aventures à la poule.",
    "Le poussin découvre le monde avec le lapin.",
    "Le guépard organise une course avec le lion.",
    "Le singe et le dauphin inventent un jeu amusant.",
    "La pieuvre enseigne aux poissons comment danser.",
    "Le chien et le chat se font des farces dans la ferme.",
    "Le renard et le loup découvrent un trésor caché.",
    "Le cheval et la vache explorent les prairies.",
    "Le lion partage ses secrets avec le zèbre.",
    "L'éléphant aide la girafe à cueillir des fruits.",
    "La tortue rencontre le dauphin et devient amie.",
    "Le singe et le cerf préparent une fête dans la forêt.",
    "Le cochon et le mouton s'amusent dans la boue.",
    "Le chat aide le poussin à trouver sa maman.",
    "Le chien guide le lapin à travers la ferme.",
    "Le guépard et le lion courent dans la savane.",
    "Le dauphin et l'otarie jouent avec des coquillages.",
    "Le renard et le loup observent les étoiles la nuit.",
    "Le cheval et le cochon construisent une cabane.",
    "La girafe raconte une histoire à l'éléphant.",
    "La pieuvre et le poisson explorent une épave sous-marine.",
    "Le chat et le chien découvrent un champ de fleurs.",
    "Le singe grimpe sur l'éléphant pour rigoler.",
    "Le lion et le guépard organisent un concours de rugissements.",
    "Le mouton et la vache apprennent à danser ensemble.",
    "Le poussin et le lapin jouent à cache-cache.",
    "Le dauphin raconte ses aventures aux poissons.",
    "L'otarie et le requin s'amusent dans les vagues.",
    "Le cerf et l'écureuil cueillent des noisettes.",
    "Le renard et le loup partent en exploration.",
    "Le chat et le chien prennent un bain de soleil.",
    "Le cheval et le cochon font la course jusqu'à la ferme.",
    "La girafe et l'éléphant admirent le coucher de soleil.",
    "La tortue et le dauphin jouent à faire des bulles.",
    "Le singe et le lion préparent une surprise pour les amis."
  ];

  genBtn.addEventListener("click", () => {
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    const allAnimals = [...window.selectedCartes];
    window.dessins.forEach((src,i)=>allAnimals.push(`dessin${i}`));

    const positions = [10,130,250,370,490]; // max 5 animaux
    const animalElements = [];

    // Créer les animaux
    allAnimals.slice(0,5).forEach((name,i)=>{
      const container = document.createElement("div");
      container.classList.add("animal");
      container.style.position="absolute";
      container.style.bottom="0";
      container.style.left=`${positions[i]}px`;

      const img = document.createElement("img");
      img.src = name.includes("dessin") ? window.dessins[parseInt(name.replace("dessin",""))] : name;
      img.style.width="90px";
      container.appendChild(img);

      // bouche animée
      const mouth = document.createElement("div");
      mouth.classList.add("mouth");
      mouth.style.width="30px";
      mouth.style.height="10px";
      mouth.style.background="red";
      mouth.style.borderRadius="50%";
      mouth.style.position="absolute";
      mouth.style.bottom="10px";
      mouth.style.left="30px";
      container.appendChild(mouth);

      // yeux animés
      const eyes = document.createElement("div");
      eyes.classList.add("eyes");
      eyes.style.width="15px";
      eyes.style.height="15px";
      eyes.style.background="black";
      eyes.style.borderRadius="50%";
      eyes.style.position="absolute";
      eyes.style.top="10px";
      eyes.style.left="20px";
      container.appendChild(eyes);

      preview.appendChild(container);
      animalElements.push(container);
    });

    // Histoire aléatoire
    let storyIndex = 0;

    function playNextSentence(){
      if(storyIndex >=  histoires.length) return;
      const sentence = histoires[storyIndex];

      // voix douce par animal avec Web Speech API
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.rate = 0.9;
      utter.pitch = 1.2;
      utter.volume = 1;
      utter.lang = "fr-FR";
      speechSynthesis.speak(utter);

      // bouche animée pendant la phrase
      animalElements.forEach(el=>{
        const mouth = el.querySelector(".mouth");
        mouth.style.animation="mouthMove 0.5s infinite alternate";
      });

      setTimeout(()=>{
        animalElements.forEach(el=>{
          const mouth = el.querySelector(".mouth");
          mouth.style.animation="";
        });
        storyIndex++;
        setTimeout(playNextSentence,1000);
      }, 4000);
    }

    playNextSentence();
  });
});
