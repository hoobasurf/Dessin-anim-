document.addEventListener("DOMContentLoaded",()=>{
  const preview = document.getElementById("preview-container");
  const generateBtn = document.getElementById("generate-story");

  const animalVoices = {
    "cochon.png": {rate:0.8,pitch:0.6},
    "chat.png": {rate:1.4,pitch:1.5},
    "cheval.png": {rate:0.7,pitch:1.0},
    "chien.png": {rate:1.0,pitch:1.0},
    "vache.png": {rate:0.6,pitch:0.8},
    "mouton.png": {rate:0.7,pitch:1.2},
    // autres animaux par défaut
  };

  function animateMouth(img){
    let open=false;
    const interval = setInterval(()=>{
      img.style.transform=open?"scaleY(1.2)":"scaleY(1)";
      open=!open;
    },200);
    return interval;
  }

  function speakText(animal, text, callback){
    const utter = new SpeechSynthesisUtterance(text);
    const config = animalVoices[animal] || {rate:1,pitch:1};
    utter.rate=config.rate; utter.pitch=config.pitch;
    utter.onend=callback;
    window.speechSynthesis.speak(utter);
  }

  function playStory(){
    const allAnimals = [...window.dessins,...window.selectedCartes];
    let index=0;
    function nextAnimal(){
      if(index>=allAnimals.length) return;
      const src = allAnimals[index];
      const img = Array.from(preview.querySelectorAll("img")).find(i=>i.src.includes(src));
      if(!img){ index++; nextAnimal(); return;}
      const interval = animateMouth(img);
      const text = `Bonjour je suis ${src.replace(".png","")} et je vais te raconter l'histoire.`;
      speakText(src,text,()=>{ clearInterval(interval); index++; nextAnimal();});
    }
    nextAnimal();
  }

  generateBtn.addEventListener("click",()=>{ playStory(); });
});
