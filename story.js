// story.js — moteur complet pour La Forêt Enchantée
// ATTENTION: ton MP3 "laforetenchantee.mp3" doit être dans la racine.
// Les images d'objets (tronc.png, panier.png, ruisseau.png) et animaux doivent être présentes à la racine.

(function(){
  // timeline in seconds (approx). These times control when objects appear & which animal "speaks".
  // Adjust times to match exactly ton MP3 si tu veux affiner.
  const TIMELINE = [
    { t: 0.2, action: "showObject", id: "buisson" },        // début : buissons
    { t: 3.5, action: "narration", text: "intro" },
    { t: 6.5, action: "animalSpeak", idx: 0 },              // animal 0 (chat) parle
    { t: 12.0, action: "animalSpeak", idx: 1 },             // animal 1 (chien)
    { t: 18.0, action: "showObject", id: "grotte" },       // la grotte apparaît
    { t: 22.0, action: "animalSpeak", idx: 2 },             // animal 2 (girafe) parle
    { t: 28.0, action: "animalSpeak", idx: 3 },             // animal 3 (singe)
    { t: 34.0, action: "showObject", id: "tronc" },         // tronc animé
    { t: 38.0, action: "animalSpeak", idx: 4 },             // animal 4 (éléphant)
    { t: 44.0, action: "showObject", id: "panier" },        // panier découvert
    { t: 48.0, action: "question", text: "Quelle couleur est cette baie ?" }, // question to child
    { t: 52.0, action: "narration", text: "treasure" },
    { t: 56.0, action: "final" },                           // fin
  ];

  // objects config: image name and default positions
  const OBJECTS = {
    buisson: { img: "buisson.png", x: 60, y: 320, w: 160 },
    grotte:  { img: "grotte.png", x: 360, y: 200, w: 220 },
    tronc:   { img: "tronc.png", x: 220, y: 300, w: 160 },
    panier:  { img: "panier.png", x: 260, y: 340, w: 110 },
    ruisseau: { img: "ruisseau.png", x: 120, y: 380, w: 260 }
  };

  // story lines (displayed in the small story-line box) — kept short, actual audio is your MP3
  const STORY_LINES = {
    intro: "Aujourd'hui, le soleil brillait dans la Forêt des Secrets. Nos amis animaux avaient décidé de partir à l'aventure pour découvrir un trésor caché.",
    treasure: "Après avoir rigolé, sauté, et exploré, nos amis découvrent enfin le trésor : un cercle de fleurs dorées qui brille sous le soleil.",
  };

  // select containers
  let objectLayer, animalLayer, storyBox, previewContainer;
  let audio;
  let lastTriggered = new Set();
  let scheduled = [];

  // helper to create and show object
  function createObject(id){
    if(!OBJECTS[id]) return null;
    const cfg = OBJECTS[id];
    const el = document.createElement("img");
    el.className = "object";
    el.src = cfg.img;
    el.style.left = cfg.x + "px";
    el.style.top = cfg.y + "px";
    el.style.width = cfg.w + "px";
    el.dataset.objid = id;
    objectLayer.appendChild(el);
    // fade in
    requestAnimationFrame(()=> {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return el;
  }

  function showObject(id){
    // if already present, just pulse
    const existing = objectLayer.querySelector(`[data-objid="${id}"]`);
    if(existing){
      existing.style.transform = "translateY(-6px)";
      setTimeout(()=> existing.style.transform = "translateY(0)", 420);
      return;
    }
    createObject(id);
  }

  function clearObjects(){
    objectLayer.querySelectorAll(".object").forEach(o => o.remove());
  }

  // place animals: combines window.dessins (dataURL) and selectedCartes filenames
  function placeAnimals(){
    animalLayer.innerHTML = "";
    const chosen = [...(window.dessins || []), ...(window.selectedCartes || [])].slice(0,5);
    const basePositions = [50, 170, 290, 410, 530];
    const imgs = [];
    chosen.forEach((src, i) => {
      const im = document.createElement("img");
      im.className = "animal";
      im.src = src;
      im.style.left = basePositions[i] + "px";
      im.dataset.index = i;
      animalLayer.appendChild(im);
      imgs.push(im);
    });
    return imgs;
  }

  // animate single animal (discreet speaking pulse)
  function speakAnimal(img){
    if(!img) return;
    img.classList.add("speaking");
    setTimeout(()=> img.classList.remove("speaking"), 1200);
  }

  // play audio and drive timeline
  function playStory() {
    if(!audio) audio = new Audio("laforetenchantee.mp3");
    audio.currentTime = 0;
    audio.play().catch(err => {
      // autoplay may be blocked if not initiated by user click — but we trigger on click
      console.error("audio play failed:", err);
    });

    // reset
    lastTriggered.clear();
    scheduled.forEach(id => clearTimeout(id));
    scheduled = [];

    // use timeupdate + small check to trigger timeline events reliably
    function checkTimeline(){
      const t = audio.currentTime;
      TIMELINE.forEach(item => {
        if(t >= item.t && !lastTriggered.has(item.t)) {
          lastTriggered.add(item.t);
          handleTimelineAction(item);
        }
      });
    }

    const onTime = () => checkTimeline();
    audio.addEventListener("timeupdate", onTime);

    audio.addEventListener("ended", () => {
      audio.removeEventListener("timeupdate", onTime);
      // final cleanup/visual
      storyBox.style.display = "none";
      // ensure animals stop speaking
      animalLayer.querySelectorAll(".animal").forEach(a => a.classList.remove("speaking"));
    });
  }

  function handleTimelineAction(item){
    switch(item.action){
      case "showObject":
        showObject(item.id);
        break;
      case "narration":
        // display small text box
        storyBox.style.display = "block";
        storyBox.innerText = STORY_LINES[item.text] || "";
        // hide after 4s
        setTimeout(()=> { storyBox.style.display = "none"; }, 4500);
        break;
      case "animalSpeak":
        {
          const imgs = animalLayer.querySelectorAll(".animal");
          // choose which animal to animate:
          const img = imgs[item.idx] || imgs[0];
          speakAnimal(img);
          // optionally show the line text in storyBox short moment
          storyBox.style.display = "block";
          // here we do not show the animal's text (audio does the voice)
          storyBox.innerText = ""; 
          setTimeout(()=> storyBox.style.display = "none", 1200);
        }
        break;
      case "question":
        storyBox.style.display = "block";
        storyBox.innerText = item.text;
        // leave it a bit longer for Malo to answer
        setTimeout(()=> { storyBox.style.display = "none"; }, 4000);
        break;
      case "final":
        storyBox.style.display = "block";
        storyBox.innerText = "Quelle belle journée !";
        setTimeout(()=> storyBox.style.display = "none", 4000);
        break;
    }
  }

  // stop current audio if playing
  function stopStory(){
    if(audio && !audio.paused){
      audio.pause();
      audio.currentTime = 0;
    }
    // clear intervals
    clearObjects();
    animalLayer.innerHTML = "";
    storyBox.style.display = "none";
  }

  // entry: wait for user to open preview and request start
  function setup(){
    previewContainer = document.getElementById("preview-container");
    objectLayer = document.getElementById("object-layer");
    animalLayer = document.getElementById("animal-layer");
    storyBox = document.getElementById("story-line");

    // ensure these exist
    if(!previewContainer || !objectLayer || !animalLayer || !storyBox) return;

    // listen for app.js 'startStory' click or generate-story button
    document.addEventListener('startStory', startFromApp);
    document.getElementById("generate-story")?.addEventListener("click", startFromApp);

    // also provide play/stop inside preview
    document.getElementById("play-audio")?.addEventListener("click", () => {
      // if preview not set, set forest
      if(!window.selectedBackground) window.selectedBackground = "foret.jpg";
      previewContainer.style.backgroundImage = `url(${window.selectedBackground})`;
      // place animals
      placeAnimals();
      playStory();
    });
    document.getElementById("stop-audio")?.addEventListener("click", stopStory);
  }

  function startFromApp(){
    if(!window.selectedBackground) window.selectedBackground = "foret.jpg";
    // force forest background for this story
    window.selectedBackground = "foret.jpg";
    previewContainer = document.getElementById("preview-container");
    previewContainer.style.backgroundImage = `url(${window.selectedBackground})`;
    previewContainer.innerHTML = '<div id="object-layer"></div><div id="animal-layer"></div><div class="story-line" id="story-line"></div>';
    objectLayer = document.getElementById("object-layer");
    animalLayer = document.getElementById("animal-layer");
    storyBox = document.getElementById("story-line");
    // place animals
    placeAnimals();
    // small delay to allow images to load visually
    setTimeout(()=> {
      // start the audio-driven timeline
      playStory();
    }, 300);
  }

  // initialize
  document.addEventListener("DOMContentLoaded", setup);
})();
