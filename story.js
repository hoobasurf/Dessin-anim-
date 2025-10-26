// story.js — moteur d'histoires (mix A + C) avec animation (mouvements + bouche) et voix mix (A+B)
// Coller ce fichier à la racine et inclure AFTER app.js in index.html

(function(){
  // short helpers
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  function basenameLabel(filename){ if(!filename) return "ami"; return filename.replace(/\.[^/.]+$/, "").toLowerCase(); }
  function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

  // VOICES: mix style (A) + bruitages (B) fallback
  const VOICES = {
    "cochon":  { pitch: 0.7, rate: 0.9, prefix: "Groin" },    // grave rigolote
    "chat":    { pitch: 2.6, rate: 1.6, prefix: "Miaou" },    // aigu rapide
    "cheval":  { pitch: 0.85, rate: 0.95, prefix: "Hiii" },   // lente et forte
    // common animals
    "chien":   { pitch: 1.8, rate: 1.2, prefix: "Ouaf" },
    "vache":   { pitch: 0.9, rate: 0.95, prefix: "Meuh" },
    "poule":   { pitch: 2.0, rate: 1.3, prefix: "Cot cot" },
    "poussin": { pitch: 2.6, rate: 1.6, prefix: "Piii" },
    "elephant":{ pitch: 0.7, rate: 0.9, prefix: "Prrr" },
    "lion":    { pitch: 0.8, rate: 0.9, prefix: "Roaar" },
    "zebre":   { pitch: 1.2, rate: 1.1, prefix: "Hii" },
    "default": { pitch: 1.6, rate: 1.2, prefix: "Hi hi" }
  };

  function voicePropsFor(src){
    if(!src) return VOICES.default;
    const key = basenameLabel(src);
    return VOICES[key] || VOICES.default;
  }

  function stopSpeech(){ if(window.speechSynthesis) window.speechSynthesis.cancel(); }
  function speak(text, {pitch=1.6, rate=1.2, lang='fr-FR'} = {}) {
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

  // mouth animation while speaking
  async function speakWithMouth(el, text, vprops){
    if(!el) { await speak(text, vprops); return; }
    const anim = el.animate([
      { transform: 'scaleY(1)' },
      { transform: 'scaleY(0.85)' },
      { transform: 'scaleY(1)' }
    ], { duration: 220, iterations: Infinity });
    await speak(text, vprops);
    anim.cancel();
    el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 300 });
  }

  // create character element in preview-container
  function createCharElement(src, label, x, y, size=100){
    const preview = document.getElementById("preview-container");
    const el = document.createElement("img");
    el.src = src;
    el.alt = label || "";
    el.className = "story-char";
    el.style.position = "absolute";
    el.style.left = `${x}px`;
    el.style.bottom = `${y}px`;
    el.style.width = `${size}px`;
    el.style.transformOrigin = "50% 100%";
    preview.appendChild(el);
    return el;
  }

  // animation primitives
  function moveTo(el, toX, duration=1000){
    return new Promise(res => {
      const from = parseFloat(el.style.left) || 0;
      const dx = toX - from;
      const anim = el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => { el.style.left = `${toX}px`; res(); };
    });
  }
  function jump(el, height=34, dur=700){
    return new Promise(res => {
      el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-${height}px)` }, { transform: 'translateY(0)' }], { duration: dur, easing: 'ease-in-out' });
      setTimeout(res, dur);
    });
  }
  function spin(el, dur=700){
    return new Promise(res => {
      el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)' });
      setTimeout(res, dur);
    });
  }
  function smallShake(el, dur=500){
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: dur });
  }

  // small star effect helpers
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
      s.style.opacity = 0.95;
      s.style.borderRadius = "50%";
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }
  function removeStars(container){ container.querySelectorAll(".tmp-star").forEach(n=>n.remove()); }

  // Generate lines influenced by background
  function generateLineFor(background, label){
    const bgWords = {
      "foret.jpg":[" bois"," arbre"," feuille"," écureuil"],
      "ferme.jpg":[" grange"," boue"," tracteur"," poulailler"],
      "ocean.jpg":[" vague"," bateau"," coquillage"," dauphin"],
      "savane.jpg":[" herbe"," baobab"," girafe"," lion"]
    };
    const words = bgWords[background] || ["endroit magique"];
    const templates = [
      `${capitalize(label)} découvre${words[0]} et s'émerveille.`,
      `${capitalize(label)} entend un drôle de bruit près du ${words[1]}.`,
      `${capitalize(label)} trouve un objet brillant : un ${words[2]}.`
    ];
    return templates[Math.floor(Math.random()*templates.length)];
  }

  // build story from globals (window.dessins, window.selectedCartes, window.selectedBackground)
  function buildStoryFromUI(){
    const bg = window.selectedBackground || "savane.jpg";
    const chars = [];
    (window.dessins || []).forEach((d,i) => chars.push({ src: d, label: `Dessin${i+1}`, type: 'dessin' }));
    (window.selectedCartes || []).forEach((f,i) => chars.push({ src: f, label: basenameLabel(f), type: 'card' }));
    if(chars.length === 0) chars.push({ src: "poussin.png", label: "poussin", type: 'card' });

    // make scenes
    const scenes = [];
    scenes.push({ kind:'intro', actor:0, line: generateLineFor(bg, chars[0].label), action:'walk' });
    if(chars.length > 1) scenes.push({ kind:'meet', actor:1, line: generateLineFor(bg, chars[1].label), action: Math.random()>0.5 ? 'jump' : 'walk' });
    const fant = [{t:'un arc-en-ciel magique apparaît', a:'spin'},{t:'un coffre scintille', a:'shake'},{t:'des étoiles dansent', a:'stars'}];
    const chosen = fant[Math.floor(Math.random()*fant.length)];
    scenes.push({ kind:'fantasy', actor: Math.floor(Math.random()*chars.length), line: `Oh ! ${chosen.t} !`, action: chosen.a });
    scenes.push({ kind:'finale', actor:null, line: 'Tous ensemble, ils fêtent l\'aventure !', action:'celebrate' });

    return { background: bg, characters: chars, scenes };
  }

  // play story
  async function playStory(story){
    stopSpeech();
    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${story.background})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
    preview.style.position = "relative";

    // create elements
    const chars = story.characters;
    const startX = 30;
    chars.forEach((c, idx) => { c.el = createCharElement(c.src, c.label, startX + idx*120, 10, 100); });

    await speak("Voici une nouvelle aventure", { pitch:1.2, rate:0.95 });

    for(const sc of story.scenes){
      await sleep(300);
      if(sc.kind === 'intro' || sc.kind === 'meet'){
        const actor = story.characters[sc.actor];
        if(actor && actor.el){
          const v = actor.type === 'card' ? voicePropsFor(actor.src) : VOICES.default;
          const line = sc.line || `${capitalize(actor.label)} dit bonjour`;
          await speakWithMouth(actor.el, line, { pitch: v.pitch, rate: v.rate });
          if(sc.action === 'walk') await moveTo(actor.el, (parseFloat(actor.el.style.left)||0)+120, 900);
          else if(sc.action === 'jump') await jump(actor.el, 40, 700);
        } else {
          await speak(sc.line || "Quelque chose se passe...");
        }
      } else if(sc.kind === 'fantasy'){
        await speak(sc.line, { pitch:1.4, rate:1 });
        const target = story.characters[sc.actor] || story.characters[0];
        if(sc.action === 'spin' && target && target.el) await spin(target.el);
        else if(sc.action === 'shake') story.characters.forEach(c => c.el && smallShake(c.el));
        else if(sc.action === 'stars'){ createStars(preview); await sleep(900); removeStars(preview); }
      } else if(sc.kind === 'finale'){
        for(const c of story.characters){
          if(c.el){
            await sleep(120);
            jump(c.el, 32, 600);
            const v = c.type === 'card' ? voicePropsFor(c.src) : VOICES.default;
            await speak(v.prefix + "!", { pitch: v.pitch + 0.4, rate: v.rate });
          }
        }
      }
    }

    await speak("Fin de l'aventure. À bientôt !", { pitch:1.2, rate:0.95 });
  }

  // CSS tweak for tmp-star (if you want later adjust in CSS file instead)
  const style = document.createElement('style');
  style.innerHTML = `.tmp-star{ pointer-events:none; } .story-char{ will-change: transform; }`;
  document.head.appendChild(style);

  // override generate-story button
  const gbtn = document.getElementById("generate-story");
  if(gbtn){
    gbtn.onclick = async () => {
      stopSpeech();
      const story = buildStoryFromUI ? buildStoryFromUI() : buildStoryFromUI_glob(); // fallback
      // ensure preview page visible
      document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
      document.getElementById("page-preview").classList.remove("hidden");
      await sleep(300);
      try{ await playStory(story); } catch(e){ console.error(e); }
    };
  }

  // buildStoryFromUI uses the global arrays defined in app.js
  function buildStoryFromUI(){
    return buildStoryFromGlobals();
  }

  // compatibility wrapper
  function buildStoryFromGlobals(){
    return (function(){
      const bg = window.selectedBackground || "savane.jpg";
      const chars = [];
      (window.dessins || []).forEach((d,i) => chars.push({ src: d, label: `Dessin${i+1}`, type:'dessin' }));
      (window.selectedCartes || []).forEach((f,i) => chars.push({ src: f, label: basenameLabel(f), type:'card' }));
      if(chars.length===0) chars.push({ src: "poussin.png", label: "poussin", type:'card' });
      const scenes = [];
      scenes.push({ kind:'intro', actor:0, line: generateLineFor(bg, chars[0].label), action:'walk' });
      if(chars.length>1) scenes.push({ kind:'meet', actor:1, line: generateLineFor(bg, chars[1].label), action: Math.random()>0.5?'jump':'walk' });
      const fant = [{t:'un arc-en-ciel magique apparaît', a:'spin'},{t:'un coffre scintille', a:'shake'},{t:'des étoiles dansent', a:'stars'}];
      const chosen = fant[Math.floor(Math.random()*fant.length)];
      scenes.push({ kind:'fantasy', actor: Math.floor(Math.random()*chars.length), line: `Oh ! ${chosen.t} !`, action: chosen.a });
      scenes.push({ kind:'finale', actor:null, line: 'Tous ensemble, ils fêtent l\'aventure !', action:'celebrate' });
      return { background: bg, characters: chars, scenes };
    })();
  }

  // expose for debug
  window._finalStoryEngine = { buildStory: buildStoryFromGlobals, playStory };

})();
