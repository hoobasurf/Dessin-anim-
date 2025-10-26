// ---------- STORY ENGINE (mix : aventure + fantaisie) ----------
// Coller ce bloc à la fin de script.js ou dans un nouveau story.js (après script.js)

(function(){

  // util
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // map fichier -> label / default vocal
  const ANIMAL_VOCALS = {
    "chat.png": { text: "Miaou", pitch: 2.2, rate: 1.4 },
    "chien.png": { text: "Ouaf", pitch: 1.8, rate: 1.2 },
    "vache.png": { text: "Meuh", pitch: 0.9, rate: 0.9 },
    "cochon.png": { text: "Groin", pitch: 1.3, rate: 1.1 },
    "poule.png": { text: "Cot cot", pitch: 2.0, rate: 1.3 },
    "poussin.png": { text: "Piii", pitch: 2.6, rate: 1.6 },
    "elephant.png": { text: "Prrr", pitch: 0.7, rate: 0.9 },
    "lion.png": { text: "Roaar", pitch: 0.8, rate: 0.9 },
    "zebre.png": { text: "Hii", pitch: 1.2, rate: 1.1 },
    // fallback
    "default": { text: "Hi hi", pitch: 1.6, rate: 1.2 }
  };

  // stop any ongoing speech
  function stopSpeech() {
    if(window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // speak and return Promise when done
  function speak(text, {pitch=1.5, rate=1.2, lang='fr-FR'} = {}) {
    return new Promise(resolve => {
      if(!window.speechSynthesis) { resolve(); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.pitch = pitch;
      u.rate = rate;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  // create a character DOM element inside preview
  function createCharElement(src, nameTag, x, y, scale=1) {
    const preview = document.getElementById("preview-container");
    const el = document.createElement("img");
    el.src = src;
    el.className = "story-char";
    el.dataset.name = nameTag || "";
    el.style.position = "absolute";
    el.style.left = `${x}px`;
    el.style.bottom = `${y}px`;
    el.style.width = `${80 * scale}px`;
    el.style.transformOrigin = "50% 100%";
    preview.appendChild(el);
    return el;
  }

  // animation helpers return Promises
  function walkTo(el, toX, duration=1500) {
    return new Promise(res => {
      const fromX = parseFloat(el.style.left) || 0;
      const anim = el.animate([
        { transform: 'translateX(0px)' },
        { transform: `translateX(${toX - fromX}px)` }
      ], { duration, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => {
        el.style.left = `${toX}px`;
        res();
      };
    });
  }

  function jump(el, height=30, duration=700) {
    return new Promise(res => {
      el.animate([
        { transform: 'translateY(0px)' },
        { transform: `translateY(-${height}px)` },
        { transform: 'translateY(0px)' }
      ], { duration, easing: 'ease-in-out' , iterations: 1});
      setTimeout(res, duration);
    });
  }

  function spin(el, duration=800) {
    return new Promise(res => {
      el.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
      ], { duration, easing: 'cubic-bezier(.2,.8,.2,1)' });
      setTimeout(res, duration);
    });
  }

  function nod(el, times=2, duration=400) {
    return new Promise(res => {
      const keyframes = [
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-8px)' },
        { transform: 'translateY(0px)' }
      ];
      let count = 0;
      const doOne = () => {
        el.animate(keyframes, { duration, easing: 'ease-in-out' });
        count++;
        if(count < times) setTimeout(doOne, duration);
        else setTimeout(res, duration);
      };
      doOne();
    });
  }

  // generate a short scene script based on present characters
  function generateStoryScript({ background, characters }) {
    // characters: array of objects {src, id, label}
    // We'll create 2-4 scenes with random actions
    const scenes = [];
    // random title
    const titles = [
      "La grande aventure magique",
      "Le trésor caché",
      "La balade fantastique",
      "La fête des amis"
    ];
    const title = titles[Math.floor(Math.random()*titles.length)];

    // scene 1: intro - one character greets
    if(characters.length > 0) {
      const c0 = characters[0];
      scenes.push({
        kind: 'intro',
        speaker: c0,
        line: `${capitalize(c0.label)} dit bonjour !`,
        action: { type: 'walk', targetX: 120 }
      });
    }

    // scene 2: arrival of 1-2 others with interactions
    const numAdd = Math.min(2, Math.max(0, characters.length - 1));
    for(let i=1;i<=numAdd;i++){
      const c = characters[i];
      scenes.push({
        kind: 'arrival',
        speaker: c,
        line: `${capitalize(c.label)} arrive en courant.`,
        action: { type: ['jump','walk'][Math.floor(Math.random()*2)], targetX: 180 + i*100 }
      });
    }

    // scene 3: fantaisie event (magie, trésor, nuage qui parle)
    const fant = ["un arc-en-ciel magique apparaît", "un coffre brille", "des étoiles dansent"];
    scenes.push({
      kind: 'fantasy',
      speaker: characters[Math.floor(Math.random()*characters.length)],
      line: `Oh ! ${fant[Math.floor(Math.random()*fant.length)]} !`,
      action: { type: 'spin' }
    });

    // scene 4: finale - tous dansent / saluent
    scenes.push({
      kind: 'finale',
      speaker: null,
      line: `Tous ensemble, ils célèbrent l'aventure !`,
      action: { type: 'celebrate' }
    });

    return { title, background, scenes };
  }

  function capitalize(s) {
    if(!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // map filename to friendly label
  function filenameToLabel(filename) {
    if(!filename) return "Ami";
    const n = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    return n;
  }

  // play the generated story (orchestrate)
  async function playStory(story) {
    stopSpeech();
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${story.background})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    // create characters DOM nodes
    const chars = story.characters;
    // layout start positions
    let startX = 20;
    chars.forEach((c, i) => {
      const el = createCharElement(c.src, c.label, startX + i*110, 10, 1.1);
      c.el = el;
    });

    // optional small intro sound/title
    await speak(`${story.title}`, { pitch: 1.2, rate: 0.95 });

    // iterate scenes
    for(const sc of story.scenes) {
      // play action
      if(sc.action) {
        if(sc.action.type === 'walk') {
          if(sc.speaker && sc.speaker.el) {
            await speakLineFor(sc.speaker);
            await walkTo(sc.speaker.el, sc.action.targetX, 1200);
          }
        } else if(sc.action === undefined || sc.action.type === 'jump' || sc.action.type === 'jump') {
          if(sc.speaker && sc.speaker.el) {
            await speakLineFor(sc.speaker);
            await jump(sc.speaker.el, 35, 700);
          }
        } else if(sc.action.type === 'spin') {
          // choose a target (speaker or random)
          const target = sc.speaker && sc.speaker.el ? sc.speaker.el : (chars[0] && chars[0].el);
          if(target) {
            await speak(sc.line, voiceFor(sc.speaker ? sc.speaker.src : null));
            await spin(target, 800);
          } else {
            await speak(sc.line);
            await sleep(800);
          }
        } else if(sc.action.type === 'celebrate') {
          // everybody nods/jumps, and short sounds
          const tasks = chars.map(async c => {
            if(c.el) {
              // small stagger
              await sleep(Math.random()*300);
              animateSmallCelebrate(c.el);
              const v = voiceFor(c.src);
              await speak(v.text + "!", { pitch: v.pitch, rate: v.rate });
            }
          });
          await Promise.all(tasks);
        } else {
          // fallback - speak line
          if(sc.speaker) await speakLineFor(sc.speaker);
          else await speak(sc.line);
        }
      } else {
        // simple speak
        if(sc.speaker) await speakLineFor(sc.speaker);
        else await speak(sc.line);
      }

      // small pause between scenes
      await sleep(500);
    }

    // ending jingle
    await speak("Fin de l'aventure. À la prochaine !", { pitch: 1.3, rate: 1 });
  }

  // helper: animate small celebrate (bounce + rotate small)
  function animateSmallCelebrate(el) {
    el.animate([
      { transform: 'translateY(0px) rotate(0deg)' },
      { transform: 'translateY(-18px) rotate(-6deg)' },
      { transform: 'translateY(0px) rotate(6deg)' },
      { transform: 'translateY(0px) rotate(0deg)' }
    ], { duration: 900 });
  }

  // voice for filename
  function voiceFor(src) {
    if(!src) return ANIMAL_VOCALS['default'];
    const key = Object.keys(ANIMAL_VOCALS).find(k => k.toLowerCase() === src.toLowerCase());
    return ANIMAL_VOCALS[key] || ANIMAL_VOCALS['default'];
  }

  // speak a speaker short line derived from label
  async function speakLineFor(speaker) {
    const v = voiceFor(speaker.src);
    const text = `${capitalize(speaker.label)} ! ${v.text} !`;
    await speak(text, { pitch: v.pitch, rate: v.rate });
  }

  // build "story object" from current UI selection
  function buildStoryFromUI() {
    // which background currently selected? fallback to selectedBackground global
    const bg = selectedBackground || "savane.jpg";
    // build characters list from dessins then selectedCartes
    const chars = [];
    // drawings (dataURLs)
    dessins.forEach((d, idx) => {
      chars.push({ src: d, label: `Dessin${idx+1}` });
    });
    // cards (filenames)
    selectedCartes.forEach((f, idx) => {
      chars.push({ src: f, label: filenameToLabel(f) });
    });
    // ensure at least one character (if none, create a friendly cloud)
    if(chars.length === 0) {
      chars.push({ src: "poussin.png", label: "Poussin" });
    }
    const base = generateStoryScript({ background: bg, characters: chars });
    base.characters = chars;
    return base;
  }

  // override existing generate button behavior: use new engine
  const genBtn = document.getElementById("generate-story");
  if(genBtn) {
    genBtn.removeEventListener && genBtn.removeEventListener("click", ()=>{}); // best-effort
    genBtn.onclick = async () => {
      stopSpeech();
      const story = buildStoryFromUI();
      // small transition: show preview page and prepare
      document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
      document.getElementById("page-preview").classList.remove("hidden");
      const preview = document.getElementById("preview-container");
      preview.innerHTML = "";
      preview.style.backgroundImage = `url(${story.background})`;
      preview.style.backgroundSize = "cover";
      preview.style.backgroundPosition = "center";
      // play story
      await sleep(400);
      try {
        await playStory(story);
      } catch (e) {
        console.error("Erreur story:", e);
      }
    };
  }

  // expose some helpers to console if needed
  window._storyEngine = {
    buildStoryFromUI,
    playStory
  };

})(); 
