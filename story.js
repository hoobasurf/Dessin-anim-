window._finalStoryEngine = function(){
  const preview = document.getElementById("preview-container");
  preview.innerHTML = "";

  const animals = [...window.selectedCartes].slice(0,5);
  if(animals.length === 0 && window.dessins.length>0){
    animals.push(...window.dessins.slice(0,5));
  }

  const voices = {
    "cochon.png":"🐽","chat.png":"🐱","cheval.png":"🐴",
    "chien.png":"🐶","vache.png":"🐮","mouton.png":"🐑",
    "lion.png":"🦁","tortue.png":"🐢"
  };

  const storyTexts = [
    "Aujourd'hui, nous allons explorer le monde magique des animaux.",
    "Regardez comme chaque animal a sa propre histoire à raconter.",
    "Ils vivent dans différents fonds et adorent jouer ensemble.",
    "Préparez-vous à rencontrer des amis incroyables.",
    "Chaque animal a quelque chose d'unique à dire."
  ];

  const audioContext = new AudioContext();

  animals.forEach((src,i)=>{
    const img = document.createElement("img");
    img.src = src;
    img.style.position="absolute";
    img.style.bottom="0";
    img.style.left=`${50 + i*120}px`;
    img.style.width="100px";
    preview.appendChild(img);

    const mouth = document.createElement("div");
    mouth.style.position="absolute";
    mouth.style.width="30px";
    mouth.style.height="10px";
    mouth.style.background="red";
    mouth.style.borderRadius="50%";
    mouth.style.bottom="20px";
    mouth.style.left=`${50 + i*120 + 35}px`;
    preview.appendChild(mouth);

    // bouche clignote
    let open = false;
    setInterval(()=>{
      open = !open;
      mouth.style.height=open?"20px":"10px";
    },300);

    // parler (voix douce approximative)
    const utter = new SpeechSynthesisUtterance(storyTexts[Math.floor(Math.random()*storyTexts.length)]);
    utter.rate=0.8;
    utter.pitch=1.2;
    speechSynthesis.speak(utter);
  });
};
