// Histoire La Forêt Enchantée
document.addEventListener("DOMContentLoaded", () => {
  window._finalStoryEngine = true;

  const generateStory = document.getElementById("generate-story");
  const preview = document.getElementById("preview-container");

  const storyAudio = new Audio("laforetenchantee.mp3"); // ton MP3

  generateStory.addEventListener("click", () => {
    if(!window.selectedBackground) return alert("Choisis un fond !");
    if(window.selectedCartes.length === 0 && window.dessins.length === 0) return alert("Choisis au moins un animal !");
    
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${window.selectedBackground})`;

    const allAnimals = [...window.dessins, ...window.selectedCartes].slice(0,5);

    allAnimals.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.style.position = "absolute";
      img.style.bottom = "10px";
      img.style.left = `${50 + i*120}px`;
      img.style.width = "90px";
      img.style.transition = "transform 0.3s";
      preview.appendChild(img);

      // petit mouvement quand parle
      setTimeout(() => {
        img.style.transform = "scale(1.05)";
        setTimeout(()=> img.style.transform = "scale(1)", 60000); // dure ~60 sec
      }, 1000*i); 
    });

    storyAudio.play();
  });
});
