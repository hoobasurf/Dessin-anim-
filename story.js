// story.js — moteur d'histoire stable, bouche+yeux, dessins parlent aussi
document.addEventListener("DOMContentLoaded", ()=>{

  const genBtn = document.getElementById('generate-story');
  const preview = document.getElementById('preview-container');

  // pools de phrases par type (ajoute en quantité pour variété)
  const phrases = {
    chat: [
      "Bonjour, je suis Minou, j'aime les papillons et les secrets de la forêt.",
      "Je suis curieux et j'adore explorer les coins fleuris.",
      "Regarde comme la lune brille au-dessus des arbres."
    ],
    chien: [
      "Wouf ! Je cours vite, viens jouer avec moi dans le pré.",
      "J'ai trouvé un bâton magique, on part à l'aventure !",
      "Mon cœur est grand, j'aime faire des câlins."
    ],
    vache: [
      "Meuh, le soleil chauffe mes sabots, le pré est doux aujourd'hui.",
      "Je chante doucement une chanson pour mes amis.",
      "On va partager un joli pique-nique sous l'arbre."
    ],
    cochon: [
      "Hihi, j'adore la boue, mais aujourd'hui j'ai trouvé une surprise.",
      "Viens, on creuse ensemble pour découvrir un trésor.",
      "Je ris très fort et ça réchauffe tout le monde."
    ],
    cheval: [
      "Hiii, je galope au pas du vent, suis-moi !",
      "Ma crinière danse, le ciel est grand et bleu.",
      "On traverse une colline où poussent des étoiles."
    ],
    poule: [
      "Cot cot, les petits me suivent et picorent des graines dorées.",
      "Je connais un chemin qui sent le pain chaud.",
      "Viens voir le petit poussin qui fait ses premiers pas."
    ],
    child: [ // phrases pour dessins de l'enfant (parle comme personnage créé)
      "Je suis ton dessin, merci de m'avoir colorié !",
      "J'adore mes couleurs, partons jouer ensemble !",
      "Regarde, je peux danser et raconter une histoire."
    ],
    default: [
      "Bonjour, je suis un ami curieux, partons explorer ensemble.",
      "Quel beau jour pour une aventure pleine de rires."
    ]
  };

  // voix / modulation par type
  const voiceConfig = {
    chat: { pitch:1.6, rate:1.2 },
    chien: { pitch:1.1, rate:1.0 },
    vache: { pitch:0.7, rate:0.8 },
    cochon: { pitch:0.85, rate:0.85 },
    cheval: { pitch:0.9, rate:0.8 },
    poule: { pitch:1.4, rate:1.15 },
    child: { pitch:1.05, rate:1.0 },
    default: { pitch:1.0, rate:1.0 }
  };

  // helper: find type from filename or dataURL
  function detectType(src){
    if(!src) return 'default';
    if(src.startsWith('data:')) return 'child';
    const lower = src.toLowerCase();
    for(const key of Object.keys(voiceConfig)){
      if(key !== 'default' && lower.includes(key)) return key;
    }
    // fallback by some keywords
    if(lower.includes('poussin')) return 'poule';
    if(lower.includes('vache')) return 'vache';
    return 'default';
  }

  // wrap existing preview images into containers + add mouth/eyes overlays (only once)
  function ensureContainers() {
    const imgs = Array.from(preview.querySelectorAll('img'));
    const containers = [];
    imgs.forEach((img, idx)=>{
      // if already wrapped, find parent with .char
      if(img.parentElement && img.parentElement.classList.contains('char')){
        containers.push({ img, container: img.parentElement });
        return;
      }
      const container = document.createElement('div');
      container.className = 'char';
      // preserve position left/bottom
      container.style.left = img.style.left || `${20 + idx*110}px`;
      container.style.bottom = img.style.bottom || '8px';
      // insert container at same place and move img inside
      preview.appendChild(container);
      // move img into container
      img.style.position = 'static';
      img.style.bottom = 'auto';
      img.style.left = 'auto';
      container.appendChild(img);

      // eyes (two small divs)
      const eyeL = document.createElement('div'); eyeL.className = 'eye-left';
      const eyeR = document.createElement('div'); eyeR.className = 'eye-right';
      container.appendChild(eyeL); container.appendChild(eyeR);

      // mouth
      const mouth = document.createElement('div'); mouth.className = 'mouth';
      mouth.style.display = 'none'; // hidden until speaking
      container.appendChild(mouth);

      containers.push({ img, container, mouth, eyeL, eyeR });
    });
    return containers;
  }

  // blink eyes periodically per container
  function startBlinking(containers){
    containers.forEach(c=>{
      // randomize blink interval per char
      const tick = () => {
        // scale Y to simulate blink by adding class
        c.eyeL.classList.add('blink'); c.eyeR.classList.add('blink');
        setTimeout(()=>{ c.eyeL.classList.remove('blink'); c.eyeR.classList.remove('blink'); }, 140);
        const next = 2500 + Math.random()*4000;
        c._blinkTimeout = setTimeout(tick, next);
      };
      // initial
      c._blinkTimeout = setTimeout(tick, 800 + Math.random()*2000);
    });
  }

  function stopBlinking(containers){
    containers.forEach(c=>{ if(c._blinkTimeout) clearTimeout(c._blinkTimeout); });
  }

  // speak a single phrase with mouth animation & talking class, returns promise
  function speakPhrase(text, cfg, containerObj){
    return new Promise(resolve=>{
      const utter = new SpeechSynthesisUtterance(text);
      utter.pitch = cfg.pitch;
      utter.rate = cfg.rate;
      // try to pick a french voice if available
      const voices = window.speechSynthesis.getVoices();
      if(voices && voices.length){
        const fr = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
        if(fr) utter.voice = fr;
      }
      // prepare mouth visible
      if(containerObj && containerObj.mouth){
        containerObj.mouth.style.display = 'block';
        containerObj.container.classList.add('talking');
      }
      utter.onend = () => {
        if(containerObj && containerObj.mouth){
          containerObj.mouth.style.display = 'none';
          containerObj.container.classList.remove('talking');
        }
        resolve();
      };
      // safety: if speechSynthesis blocked, fallback to setTimeout approx
      let ended=false;
      utter.onerror = () => { if(!ended){ ended=true; if(containerObj){ containerObj.mouth.style.display='none'; containerObj.container.classList.remove('talking'); } resolve(); } };
      window.speechSynthesis.speak(utter);
      // in some browsers voices not ready; set a timeout fallback
      // estimate duration roughly: words*350ms
      const words = (text||'').split(/\s+/).length || 1;
      const fallback = setTimeout(()=>{ if(!ended){ ended=true; if(containerObj){ containerObj.mouth.style.display='none'; containerObj.container.classList.remove('talking'); } resolve(); } }, Math.max(3000, words*350));
      utter.onend = ()=>{ if(!ended){ ended=true; clearTimeout(fallback); if(containerObj){ containerObj.mouth.style.display='none'; containerObj.container.classList.remove('talking'); } resolve(); } };
    });
  }

  // main: play story until minDuration reached (60s)
  genBtn.addEventListener('click', async ()=>{
    // clear any existing speech queue
    window.speechSynthesis.cancel();

    // ensure preview has content
    if(!preview) return;
    const imgs = Array.from(preview.querySelectorAll('img'));
    if(imgs.length === 0) { alert("Ajoute un dessin ou choisis des cartes avant de lancer l'histoire."); return; }

    // wrap images into containers & overlays (only once)
    const containers = ensureContainers();

    // start blinking
    startBlinking(containers);

    // prepare participants list (stable order)
    const participants = containers.map(c=>{
      const src = c.img.src;
      const type = detectType(src);
      return { src, type, containerObj: c };
    });

    // ensure background present
    if(window.selectedBackground){
      preview.style.backgroundImage = `url(${window.selectedBackground})`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
    }

    const minDuration = 60 * 1000;
    const startTime = Date.now();

    // loop participants in random order each round until minDuration satisfied
    while(Date.now() - startTime < minDuration){
      // shuffle order
      shuffleArray(participants);
      for(let p of participants){
        // pick a random phrase for this type
        const pool = phrases[p.type] || phrases.default;
        const sentence = pool[Math.floor(Math.random()*pool.length)];
        // maybe personalize with background name or index
        const fondName = (window.selectedBackground || 'ce lieu').split('.')[0];
        const text = sentence.replace('{fond}', fondName).replace('{animal}', p.type);
        // voice cfg
        const cfg = voiceConfig[p.type] || voiceConfig.default;
        await speakPhrase(text, cfg, p.containerObj);
        // small pause between turns
        await wait(300 + Math.random()*700);
        // break early if we've reached minDuration
        if(Date.now() - startTime >= minDuration) break;
      }
    }

    // finished: stop blinking timers
    stopBlinking(containers);
  });

  // util: shuffle in place
  function shuffleArray(a){
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
  }
  function wait(ms){ return new Promise(res=>setTimeout(res, ms)); }

});
