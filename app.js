let selectedBackground = null;

// Jouer un son au clic (optionnel)
function playClick() {
  // document.getElementById("clickSound")?.play();
}

// Charger les options de fonds
function loadBackgroundOptions() {
  const grid = document.getElementById("background-grid");
  grid.innerHTML = "";

  const backgrounds = ["ferme-1.png","savane-1.png","ocean-1.png","foret-1.png","mix"];

  backgrounds.forEach(name => {
    const img = document.createElement("img");
    img.src = name.includes("mix") ? "savane-1.png" : name; // aperçu du mix
    img.onclick = () => {
      document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      selectedBackground = name;
      playClick();
    };
    grid.appendChild(img);
  });
}

// Fond aléatoire
document.getElementById("random-background").addEventListener("click", () => {
  const arr = ["ferme-1.png","savane-1.png","ocean-1.png","foret-1.png","mix"];
  selectedBackground = arr[Math.floor(Math.random()*arr.length)];
  goPreview();
});

// Prévisualisation
document.getElementById("preview-btn").addEventListener("click", goPreview);

function goPreview() {
  if (!selectedBackground) return alert("Choisis un fond !");
  const preview = document.getElementById("preview-container");

  preview.innerHTML = "";

  // Fond mix
  if(selectedBackground === "mix") {
    preview.style.backgroundImage =
      "url('savane-1.png'), url('foret-1.png'), url('ocean-1.png'), url('ferme-1.png')";
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

// Générer histoire (placeholder)
document.getElementById("generate-story").addEventListener("click", () => {
  alert("La petite histoire s’animera ici 📽✨ (phase 2)");
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}
