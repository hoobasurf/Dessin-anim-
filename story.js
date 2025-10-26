window._finalStoryEngine = function(){
  const preview = document.getElementById("preview-container");
  if(!preview) return;

  const animauxVoix = {
    "cochon.png": { pitch: 0.5, rate: 0.8 },
    "chat.png": { pitch: 1.5, rate: 1.5 },
    "cheval.png": { pitch: 0.8, rate: 1.0 },
    "chien.png": { pitch: 1.0, rate: 1.2 },
    "vache.png": { pitch: 0.6, rate: 0.9 },
    "poule.png": { pitch: 1.2, rate: 1.3 }
  };

  preview.querySelectorAll("img").forEach((img,i)=>{
    img.style.transition="transform 1s";
    img.style.transform="translateY(0)";
    setInterval(()=>{
      const offset = Math.random()*50;
      img.style.transform=`translateY(${offset}px)`;
      // voix cartoon si animal
      if(animauxVoix[img.src.split("/").pop()]){
        const synth=window.speechSynthesis;
        const utter=new SpeechSynthesisUtterance("🐾");
        utter.pitch=animauxVoix[img.src.split("/").pop()].pitch;
        utter.rate=animauxVoix[img.src.split("/").pop()].rate;
        synth.speak(utter);
      }
    }, 2000+Math.random()*2000);
  });
};
