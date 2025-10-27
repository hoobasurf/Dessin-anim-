// story.js — utilise les MP3 en racine fournis, anime bouche pendant playback, >=60s
document.addEventListener("DOMContentLoaded", ()=>{

  // list of mp3 filenames (in root) — user provided 8 files
  const VOICE_FILES = [
    "20251027_201425_1.mp3",
    "20251027_201425_2.mp3",
    "20251027_201425_3.mp3",
    "20251027_201425_4.mp3",
    "20251027_201425_5.mp3",
    "20251027_201425_6.mp3",
    "20251027_201425_7.mp3",
    "20251027_201425_8.mp3"
  ];

  // pool of longer narrative sentences (variety). Can be expanded easily.
  const STORY_SENTENCES = [
    "Aujourd'hui, une belle aventure commence.",
    "Nos amis se retrouvent pour partager un grand secret.",
    "Ils traversent des paysages merveilleux et découvrent des trésors.",
    "Chacun raconte une petite histoire de son coin préféré.",
    "Un nouveau mystère va les conduire vers la surprise.",
    "Ils chantent, rient et jouent ensemble sous le ciel bleu.",
    "On partage un goûter et on se raconte des souvenirs drôles.",
    "Sur le chemin, ils apprennent quelque chose d'important.",
    "La journée devient magique grâce à l'amitié de tous.",
    "La nuit approche doucement, mais l'aventure continue encore un peu."
  ];

  // utility shuffle
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  // main exported function that app.js will call
  window._finalStoryEngine = async function(){
    const preview = document.getElementById('preview-container');
    if(!preview) return alert("Oups : preview introuvable.");

    // stop any currently playing audios
    document.querySelectorAll('audio.story-audio').forEach(a=>{
      try{ a.pause(); a.currentTime = 0; }catch(e){}
      a.remove();
    });

    // collect char wrappers from preview (these were created in app.js goPreview)
    const wrappers = Array.from(preview.querySelectorAll('.char-wrapper'));
    if(wrappers.length === 0){
      alert("Ajoute un dessin ou sélectionne des cartes puis prévisualise avant de lancer l'histoire.");
      return;
    }

    // cap to 5
    const participants = wrappers.slice(0,5).map(w => {
      const img = w.querySelector('img');
      return { wrapper: w, imgEl: img, voiceFile: null };
    });

    // assign a random voice file to each participant (duplicates allowed)
    participants.forEach(p => {
      const f = VOICE_FILES[Math.floor(Math.random()*VOICE_FILES.length)];
      p.voiceFile = f;
    });

    // prepare blinking for each participant's eyes (simple opacity toggle)
    const blinkIntervals = [];
    participants.forEach(p => {
      const eyes = p.wrapper.querySelector('.eyes-overlay');
      if(!eyes) return;
      // random blink timing
      const blink = () => {
        eyes.style.opacity = '0.2';
        setTimeout(()=> eyes.style.opacity = '1', 120);
      };
      const t = setInterval(blink, 2500 + Math.random()*4000);
      blinkIntervals.push(t);
    });

    // play sequence until minDuration reached
    const minDuration = 60 * 1000;
    const startTime = Date.now();

    // create a narrative plan: array of (participantIndex, sentence)
    // We'll loop participants in shuffled order and pick sentences from STORY_SENTENCES to display (optional)
    let sentenceIdx = 0;

    // helper to play one participant's voice once and animate mouth for the duration
    function playVoiceForParticipant(p){
      return new Promise((resolve) => {
        const audio = document.createElement('audio');
        audio.className = 'story-audio';
        audio.src = p.voiceFile;
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';
        // attach to DOM so browsers allow control
        document.body.appendChild(audio);

        const mouth = p.wrapper.querySelector('.mouth-overlay');
        // ensure mouth visible
        if(mouth) mouth.style.display = 'block';

        // animate mouth while playing using WebAudio (level detection fallback not used) — simple looped CSS
        if(mouth) mouth.style.transform = 'scaleY(1.0)';
        p.wrapper.classList.add('speaking');

        // safety timeout in case audio fails or very short
        let fallbackTimeout = null;
        const cleanup = () => {
          if(fallbackTimeout) clearTimeout(fallbackTimeout);
          if(mouth) { mouth.style.display = 'none'; mouth.style.transform = ''; }
          p.wrapper.classList.remove('speaking');
          try{ audio.pause(); }catch(e){}
          audio.remove();
          resolve();
        };

        audio.addEventListener('playing', () => {
          // animate mouth rhythmically while audio plays
          if(mouth){
            mouth.style.animation = 'mouthTalk 180ms infinite';
          }
        });

        audio.addEventListener('ended', () => {
          cleanup();
        });

        audio.addEventListener('error', () => {
          // fallback: animate mouth for an estimated duration ~ 1500ms
          fallbackTimeout = setTimeout(cleanup, 1500);
        });

        // play (user clicked generate so should be allowed)
        audio.play().catch(() => {
          // if play() rejected, still resolve after short fallback
          fallbackTimeout = setTimeout(cleanup, 1500);
        });
      });
    }

    // main loop: keep playing voices in rounds until >= minDuration
    while(Date.now() - startTime < minDuration){
      const order = shuffle(participants.slice()); // new order each round
      for(const p of order){
        // optional: you can display sentence text as caption (skipped to keep only audio)
        await playVoiceForParticipant(p);
        // short pause
        await new Promise(r => setTimeout(r, 350 + Math.random()*600));
        if(Date.now() - startTime >= minDuration) break;
      }
    }

    // cleanup blinks
    blinkIntervals.forEach(t => clearInterval(t));
    // hide all mouths
    participants.forEach(p => {
      const mouth = p.wrapper.querySelector('.mouth-overlay');
      if(mouth) { mouth.style.display = 'none'; mouth.style.animation = ''; }
      p.wrapper.classList.remove('speaking');
    });
  };

  // CSS keyframes injection for mouth animation (ensures present even if user CSS missing)
  (function injectKeyframes(){
    const css = `@keyframes mouthTalk { 0% { transform: scaleY(1); } 50% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }`;
    const style = document.createElement('style'); style.innerHTML = css; document.head.appendChild(style);
  })();

});
