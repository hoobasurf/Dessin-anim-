// ---------------- STORY ENGINE FINAL (A + C, animation 3 + voix spécifiques) ----------------
// Coller à la FIN de script.js ou dans story.js (après script.js)
// Fonctionne avec la structure HTML/CSS existante (page-preview, preview-container, generate-story...)

(function(){
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // voix par fichier (pitch, rate, extra text style)
  const VOICES = {
    "cochon":   { pitch: 0.7, rate: 0.9, prefix: "Groin" },   // pig: grave rigolote
    "chat":     { pitch: 2.6, rate: 1.6, prefix: "Miaou" },   // cat: aiguë rapide
    "cheval":   { pitch: 0.85, rate: 0.95, prefix: "Hiii" },  // horse: lente et forte
    // fallback
    "default":  { pitch: 1.6, rate: 1.2, prefix: "Hi hi" }
  };

  // détecte nom simple à partir filename (ex: "cochon.png" -> "cochon")
  function basenameLabel(filename){
    if(!filename) return "ami";
    return filename.replace(/\.[^/.]+$/, "").toLowerCase();
  }

  // récupère style voix depuis le nom (gère pluriels / différences)
  function voicePropsFor(filename){
    if(!filename) return VOICES.default;
    const key = basenameLabel(filename);
    return VOICES[key] || VOICES.default;
  }

  // stop all speech
  function stopSpeech(){ if(window.speechSynthesis) window.speechSynthesis.cancel(); }

  // speak with promise
  function speak(text, {pitch=1.6, rate=1.2, lang='fr-FR'} = {}){
    return new Promise(resolve => {
      if(!window.speechSynthesis){ resolve(); return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.pitch = pitch;
      u.rate = rate;
      u.onend = resolve;
      u.onerror = resolve;
      window.speechSynthesis.speak(u);
    });
  }

  // animate "mouth" by gently scaling Y during speech (element must be image)
  async function speakWithMouth(el, text, vprops){
    if(!el) { await speak(text, vprops); return; }
    // small loop: start mouth animation, speak, stop
    const anim = el.animate([
      { transform: 'scaleY(1)' },
      { transform: 'scaleY(0.88)' },
      { transform: 'scaleY(1)' }
    ], { duration: 220, iterations: Infinity });
    await speak(text, vprops);
    anim.cancel();
    // tiny bounce after speaking
    el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 300 });
  }

  // create character element in preview container
  function createChar(src, label, x, y, size=90){
    const preview = document.getElementById("preview-container");
    const el = document.createElement("img");
    el.src = src;
    el.alt = label || "";
    el.className = "story-char";
    el.style.position = "absolute";
    el.style.left = `${x}px`;
    el.style.bottom = `${y}px`;
    el.style.width = `${size}px`;
    el.style.transition = "left 0.4s linear, bottom 0.3s ease-out";
    el.style.transformOrigin = "50% 100%";
    preview.appendChild(el);
    return el;
  }

  // movement helpers
  function moveTo(el, toX, duration=1000){
    return new Promise(res => {
      const from = parseFloat(el.style.left) || 0;
      const dx = toX - from;
      const anim = el.animate([
        { transform: 'translateX(0px)' },
        { transform: `translateX(${dx}px)` }
      ], { duration, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => { el.style.left = `${toX}px`; res(); };
    });
  }

  function jump(el, height=30, dur=700){
    return new Promise(res => {
      const anim = el.animate([
        { transform: 'translateY(0)' },
        { transform: `translateY(-${height}px)` },
        { transform: 'translateY(0)' }
      ], { duration: dur, easing: 'ease-in-out' });
      setTimeout(() => res(), dur);
    });
  }

  function smallShake(el, dur=500){
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' }
    ], { duration: dur });
  }

  // generate adaptive lines depending on background & animals (mix of A + C)
  function generateLines(background, charLabel){
    // background influences theme words
    const bgWords = {
      "foret.jpg": ["bois", "arbre", "feuilles", "écureuil"],
      "ferme.jpg": ["grange", "boue", "tracteur", "poulailler"],
      "ocean.jpg": ["vague", "bateau", "coquillage", "dauphin"],
      "savane.jpg": ["herbe", "arbre isolé", "lion", "girafe"]
    };
    const words = bgWords[background] || ["lieu magique"];
    // pick templates
    const templates = [
      `${capitalize(charLabel)} découvre ${words[0]} et s'émerveille.`,
      `${capitalize(charLabel)} entend un drôle de bruit près du ${words[1]}.`,
      `${capitalize(charLabel)} trouve un objet brillant : un ${words[2]}.`,
      `${capitalize(charLabel)} veut montrer quelque chose à ses amis.`
    ];
    // choose random template
    return templates[Math.floor(Math.random()*templates.length)];
  }

  function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

  // build story object from current UI (stronger C: behavior depends on background & animals)
  function buildStory(){
    const bg = selectedBackground || "savane.jpg";
    const chars = [];
    // drawings first (dataURLs)
    dessins.forEach((d,i) => chars.push({ src: d, label: `Dessin${i+1}`, type: 'dessin' }));
    // cards
    selectedCartes.forEach((f,i) => chars.push({ src: f, label: basenameLabel(f), type: 'card' }));
    if(chars.length === 0){ chars.push({ src: "poussin.png", label: "poussin", type: 'card' }); }

    // create scenes array dynamically based on characters and background
    // we'll make 3 main scenes + finale
    const scenes = [];
    // scene 1: intro by first character
    scenes.push({ kind: 'intro', actorIndex: 0, line: generateLines(bg, chars[0].label), action: 'walk' });

    // scene 2: maybe a second character interacts
    if(chars.length > 1){
      scenes.push({ kind: 'meet', actorIndex: 1, line: generateLines(bg, chars[1].label), action: Math.random()>0.5 ? 'jump' : 'walk' });
    }

    // scene 3: fantaisie triggered by background/animals
    const fantasyOptions = [
      { text: 'un arc-en-ciel magique apparaît', effect: 'spin' },
      { text: 'un coffre scintillant émerge', effect: 'shake' },
      { text: 'des petites étoiles tombent du ciel', effect: 'stars' }
    ];
    const chosenFant = fantasyOptions[Math.floor(Math.random()*fantasyOptions.length)];
    scenes.push({ kind: 'fantasy', actorIndex: Math.floor(Math.random()*chars.length), line: `Oh ! ${chosenFant.text} !`, action: chosenFant.effect });

    // finale: everyone celebrates
    scenes.push({ kind: 'finale', actorIndex: null, line: `Tous ensemble, ils fêtent l'aventure !`, action: 'celebrate' });

    return { background: bg, characters: chars, scenes };
  }

  // play story with timeline; uses speakWithMouth for talking animations
  async function play(story){
    stopSpeech();
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${story.background})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    // layout characters evenly
    const chars = story.characters;
    const startX = 30;
    chars.forEach((c, idx) => {
      const x = startX + idx * 120;
      const y = 10 + (idx % 2) * 6;
      c.el = createChar(c.src, c.label, x, y, 100);
    });

    // short title speak
    await speak(`Voici une nouvelle aventure`, { pitch: 1.2, rate: 0.95 });

    // iterate scenes
    for(const s of story.scenes){
      // small pause
      await sleep(300);

      if(s.kind === 'intro' || s.kind === 'meet'){
        const actor = story.characters[s.actorIndex];
        if(actor && actor.el){
          // voice props (if card file -> specific animal voice; if dessin -> default)
          const v = actor.type === 'card' ? voicePropsForActor(actor.src) : VOICES.default;
          // line depends on background & label if not set
          const line = s.line || `${capitalize(actor.label)} dit bonjour !`;
          await speakWithMouth(actor.el, line, { pitch: v.pitch, rate: v.rate });
          // action
          if(s.action === 'walk'){
            await moveTo(actor.el, (parseFloat(actor.el.style.left) || 0) + 120, 900);
          } else if(s.action === 'jump'){
            await jump(actor.el, 40, 700);
          }
        } else {
          await speak(s.line || "Quelque chose se passe...");
        }
      } else if(s.kind === 'fantasy'){
        // fantasy effect (spin / shake / stars)
        const target = story.characters[s.actorIndex] || story.characters[0];
        await speak(s.line, { pitch: 1.4, rate: 1 });
        if(s.action === 'spin' && target && target.el) { await spin(target.el); }
        else if(s.action === 'shake') {
          // shake all
          for(const c of story.characters){ if(c.el) smallShake(c.el); }
        } else if(s.action === 'stars'){
          // create simple star decorations
          createStars(preview);
          await sleep(900);
          removeStars(preview);
        }
      } else if(s.kind === 'finale'){
        // celebration: all jump and speak small sounds
        for(const c of story.characters){
          if(c.el) {
            // staggered
            await sleep(120);
            jump(c.el, 32, 600);
            const v = c.type === 'card' ? voicePropsForActor(c.src) : VOICES.default;
            // short cheer using prefix
            await speak(v.prefix + "!", { pitch: v.pitch + 0.4, rate: v.rate });
          }
        }
      }
    }

    await speak("Fin de l'aventure. À bientôt !", { pitch: 1.2, rate: 0.95 });
  }

  // helper: spin (re-used)
  function spin(el){
    return new Promise(res => {
      const anim = el.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
      anim.onfinish = () => res();
    });
  }

  // create little stars effect in preview
  function createStars(container){
    const frag = document.createDocumentFragment();
    for(let i=0;i<8;i++){
      const s = document.createElement("div");
      s.className = "tmp-star";
      s.style.position = "absolute";
      s.style.left = `${20 + Math.random()* (container.clientWidth-40)}px`;
      s.style.top = `${20 + Math.random()* (container.clientHeight-40)}px`;
      s.style.width = s.style.height = `${8 + Math.random()*12}px`;
      s.style.background = "radial-gradient(circle at 30% 30%, #fff, transparent)";
      s.style.opacity = 0.9;
      s.style.borderRadius = "50%";
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }
  function removeStars(container){
    container.querySelectorAll(".tmp-star").forEach(n => n.remove());
  }

  // small utility: map actor src -> voice props (using basename)
  function voicePropsForActor(src){
    const key = basenameLabel(src);
    if(VOICES[key]) return VOICES[key];
    return VOICES.default;
  }

  // override generate-story button
  const gbtn = document.getElementById("generate-story");
  if(gbtn){
    gbtn.onclick = async () => {
      stopSpeech();
      const story = buildStory(); // uses current global dessins, selectedCartes, selectedBackground
      // show preview page
      document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
      document.getElementById("page-preview").classList.remove("hidden");
      // tiny delay then play
      await sleep(300);
      try{ await play(story); } catch(e){ console.error(e); }
    };
  }

  // expose for debugging
  window._finalStoryEngine = { buildStory, play };

  // ---------- fin module ----------
})();
