// Variables globales
let dessins = [];           // Dessins importés
let selectedCartes = [];    // Cartes animaux sélectionnées
let selectedBackground = null;

// Jouer un son au clic (optionnel)
function playClick() {
  // document.getElementById("clickSound")?.play();
}

// -------------------------
// SECTION FONDS
// -------------------------
function loadBackgroundOptions() {
  const grid = document.getElementById("background-grid");
  grid.innerHTML = "";

  // Les fonds disponibles
  const backgrounds = ["foret.jpg", "ferme.jpg", "ocean.jpg", "savane.jpg", "mix"];

  backgrounds.forEach(name => {
    const img = document.createElement("img");
    img.src = name === "mix" ? "savane.jpg" : name; // aperçu du mix
    img.classList.add("fond-option");
    img.onclick = () => {
      document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      selectedBackground = name;
      playClick();
    };
    grid.appendChild(img);
  });
}

// Bouton fond aléatoire
document.getElementById("random-background").addEventListener("click", () => {
  const arr = ["foret.jpg", "ferme.jpg", "ocean.jpg", "savane.jpg", "mix"];
  selectedBackground = arr[Math.floor(Math.random() * arr.length)];
  goPreview();
});

// Bouton Choisir Fond
document.getElementById("choose-background").addEventListener("click", () => {
    showPage("page-background"); // Affiche la section des fonds
    loadBackgroundOptions();      // Charge les images des fonds
});

// -------------------------
// SECTION PRÉVISUALISATION
// -------------------------
document.getElementById("preview-btn").addEventListener("click", goPreview);

function goPreview() {
  if (!selectedBackground) return alert("Choisis un fond !");

  const preview = document.getElementById("preview-container");
  preview.innerHTML = "";

  // Fond mix
  if(selectedBackground === "mix") {
    preview.style.backgroundImage =
      "url('savane.jpg'), url('foret.jpg'), url('ocean.jpg'), url('ferme.jpg')";
    preview.style.backgroundSize = "cover, cover, cover, cover";
    preview.style.backgroundPosition = "center, center, center, center";
  } else {
    preview.style.backgroundImage = `url(${selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";
  }

  // Ajouter dessins importés
  dessins.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });

  // Ajouter cartes sélectionnées
  selectedCartes.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    preview.appendChild(img);
  });

  showPage("page-preview");
}

// -------------------------
// SECTION HISTOIRE
// -------------------------
document.getElementById("generate-story").addEventListener("click", () => {
  alert("La petite histoire s’animera ici 📽✨ (phase 2)");
});

// -------------------------
// UTILS
// -------------------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}
