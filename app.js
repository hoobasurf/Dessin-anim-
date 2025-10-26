let mode = null;
let selectedBackground = null;

function playClick() {
  // si tu veux un son
  // document.getElementById("clickSound").play();
}

function selectMode(m) {
  mode = m;
  showPage("page-background");
  loadBackgroundOptions();
}

function loadBackgroundOptions() {
  const grid = document.getElementById("background-grid");
  grid.innerHTML = "";
  const backgrounds = ["ferme-1.png","savane-1.png","ocean-1.png","foret-1.png"];
  backgrounds.forEach(name => {
    const img = document.createElement("img");
    img.src = name;
    img.onclick = () => {
      document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      selectedBackground = name;
      playClick();
    };
    grid.appendChild(img);
  });
}

document.getElementById("random-background").addEventListener("click", () => {
  const arr = ["ferme-1.png","savane-1.png","ocean-1.png","foret-1.png"];
  selectedBackground = arr[Math.floor(Math.random()*arr.length)];
  showPage("page-preview");
  goPreview();
});

document.getElementById("preview-btn").addEventListener("click", goPreview);

function goPreview() {
  if (!selectedBackground) return alert("Choisis un fond !");
  const preview = document.getElementById("preview-container");
  preview.style.backgroundImage = `url(${selectedBackground})`;

  // ajouter dessins importés
  dessins.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });

  // ajouter cartes sélectionnées
  selectedCartes.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });

  showPage("page-preview");
}

document.getElementById("generate-story").addEventListener("click", () => {
  alert("La petite histoire s’animera ici 📽✨ (phase 2)");
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}
