// Variables globales
// IMPORTANT : ne pas redéclarer dessins et selectedCartes ici, elles sont déjà dans script.js
let selectedBackground = null;

// Jouer un son au clic (optionnel)
function playClick() {
  // document.getElementById("clickSound")?.play();
}

// -------------------------
// BOUTON CHOISIR FOND
// -------------------------
document.getElementById("choose-background").addEventListener("click", () => {
    showPage("page-background"); // Affiche la section des fonds
    loadBackgroundOptions();      // Charge les fonds
});

// -------------------------
// CHARGER LES FONDS
// -------------------------
function loadBackgroundOptions() {
  const grid = document.getElementById("background-grid");
  grid.innerHTML = "";

  const backgrounds = ["foret.jpg", "ferme.jpg", "ocean.jpg", "savane.jpg"]; // Les 4 fonds

  backgrounds.forEach(name => {
    const img = document.createElement("img");
    img.src = name;
    img.classList.add("fond-option");
    img.onclick = () => {
      document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      selectedBackground = name; // Fond choisi
      playClick();
    };
    grid.appendChild(img);
  });
}

// -------------------------
// FOND ALÉATOIRE
// -------------------------
document.getElementById("random-background").addEventListener("click", () => {
  const arr = ["foret.jpg", "ferme.jpg", "ocean.jpg", "savane.jpg"];
  selectedBackground = arr[Math.floor(Math.random() * arr.length)];
  goPreview();
});

// -------------------------
// PRÉVISUALISATION
// -------------------------
document.getElementById("preview-btn").addEventListener("click", goPreview);

function goPreview() {
  if (!selectedBackground) return alert("Choisis un fond !");

  const preview = document.getElementById("preview-container");
  preview.innerHTML = "";

  preview.style.backgroundImage = `url(${selectedBackground})`;
  preview.style.backgroundSize = "cover";
  preview.style.backgroundPosition = "center";

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
// GÉNÉRER HISTOIRE (placeholder)
// -------------------------
document.getElementById("generate-story").addEventListener("click", () => {
  alert("La petite histoire s’animera ici 📽✨ (phase 2)");
});

// -------------------------
// UTILITAIRES
// -------------------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}
