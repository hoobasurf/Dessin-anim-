// -------------------------
// VARIABLES GLOBALES
// -------------------------
let dessins = [];           // Dessins importés
let selectedCartes = [];    // Cartes sélectionnées
let selectedBackground = null;

const modeSelection = document.getElementById('mode-selection');
const importDessins = document.getElementById('import-dessins');
const cartesSection = document.getElementById('cartes-section');

// Liste complète des cartes animaux
const cartesAnimaux = [
  "ours.png","cerf.png","renard.png","loup.png","ecureuil.png",
  "chat.png","chien.png","poule.png","poussin.png","cheval.png",
  "vache.png","mouton.png","pieuvre.png","poisson.png","tortue.png",
  "requin.png","dauphin.png","otarie.png","singe.png","zebre.png",
  "elephant.png","girafe.png","guepard.png","lion.png"
];

// -------------------------
// SELECTION DU MODE (fonctionne maintenant)
// -------------------------
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        modeSelection.classList.add('hidden');

        if(mode === 'cartes') {
            cartesSection.classList.remove('hidden');
            loadCartes();
        } else if(mode === 'dessins') {
            importDessins.classList.remove('hidden');
        } else if(mode === 'dessins-cartes') {
            importDessins.classList.remove('hidden');
            cartesSection.classList.remove('hidden');
            loadCartes();
        }
    });
});

// -------------------------
// IMPORTER DESSINS ET DECOUPER FOND
// -------------------------
document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';

    for(let i=0; i<Math.min(files.length,3); i++){
        const reader = new FileReader();
        reader.onload = (event) => {
            removeBackground(event.target.result, (transparentSrc) => {
                dessins.push(transparentSrc);
                const img = document.createElement('img');
                img.src = transparentSrc;
                document.getElementById('dessins-preview').appendChild(img);
            });
        };
        reader.readAsDataURL(files[i]);
    }
});

// -------------------------
// BOUTON SUIVANT DESSINS -> CARTES
// -------------------------
document.getElementById('next-to-cards').addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
});

// -------------------------
// CHARGER LES CARTES
// -------------------------
function loadCartes() {
    const container = document.getElementById("cartes-container");
    container.innerHTML = "";
    cartesAnimaux.forEach(name => {
        const img = document.createElement("img");
        img.src = name;
        img.classList.add("carte");
        img.onclick = () => {
            if(!selectedCartes.includes(name)) selectedCartes.push(name);
            else selectedCartes = selectedCartes.filter(c => c!==name);
            img.classList.toggle("selected");
        }
        container.appendChild(img);
    });
}

// -------------------------
// BOUTON CHOISIR FOND
// -------------------------
document.getElementById("choose-background").addEventListener("click", () => {
    showPage("page-background");
    loadBackgroundOptions();
});

// -------------------------
// CHARGER LES FONDS
// -------------------------
function loadBackgroundOptions() {
    const grid = document.getElementById("background-grid");
    grid.innerHTML = "";

    const backgrounds = ["foret.jpg", "ferme.jpg", "ocean.jpg", "savane.jpg"];

    backgrounds.forEach(name => {
        const img = document.createElement("img");
        img.src = name;
        img.onclick = () => {
            document.querySelectorAll("#background-grid img").forEach(i => i.classList.remove("selected"));
            img.classList.add("selected");
            selectedBackground = name;
        };
        grid.appendChild(img);
    });
}

// -------------------------
// FOND ALEATOIRE
// -------------------------
document.getElementById("random-background").addEventListener("click", () => {
    const arr = ["foret.jpg","ferme.jpg","ocean.jpg","savane.jpg"];
    selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    goPreview();
});

// -------------------------
// PREVISUALISATION + ANIMATION + VOIX CARTOON
// -------------------------
document.getElementById("preview-btn").addEventListener("click", goPreview);

function goPreview() {
    if(!selectedBackground) return alert("Choisis un fond !");

    const preview = document.getElementById("preview-container");
    preview.innerHTML = "";
    preview.style.backgroundImage = `url(${selectedBackground})`;
    preview.style.backgroundSize = "cover";
    preview.style.backgroundPosition = "center";

    // Ajouter dessins importés
    dessins.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.style.position = "absolute";
        img.style.bottom = "0";
        img.style.left = `${10 + i*120}px`;
        preview.appendChild(img);
        animateCharacter(img, selectedCartes[i] || null);
    });

    // Ajouter cartes sélectionnées
    selectedCartes.forEach((name, i) => {
        const img = document.createElement("img");
        img.src = name;
        img.style.position = "absolute";
        img.style.bottom = "0";
        img.style.left = `${300 + i*120}px`;
        preview.appendChild(img);
        animateCharacter(img, name);
    });

    showPage("page-preview");
}

// -------------------------
// ANIMATION + VOIX CARTOON
// -------------------------
function animateCharacter(img, animal) {
    img.animate([
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-15px)' },
        { transform: 'translateY(0px)' }
    ], { duration: 1000 + Math.random()*500, iterations: Infinity });

    if(animal) {
        let utter = new SpeechSynthesisUtterance();
        switch(animal.toLowerCase()){
            case "chat.png": utter.text = "Miaou!"; break;
            case "chien.png": utter.text = "Ouaf! Ouaf!"; break;
            case "vache.png": utter.text = "Meuh!"; break;
            case "cochon.png": utter.text = "Groin!"; break;
            case "poule.png": utter.text = "Cot cot!"; break;
            case "poussin.png": utter.text = "Piii!"; break;
            case "elephant.png": utter.text = "Prrr!"; break;
            case "lion.png": utter.text = "Roaar!"; break;
            case "zebre.png": utter.text = "Brrr!"; break;
            default: utter.text = "Hi hi!";
        }
        utter.pitch = 2;
        utter.rate = 1.2;
        window.speechSynthesis.speak(utter);
    }
}

// -------------------------
// CREER HISTOIRE
// -------------------------
document.getElementById("generate-story").addEventListener("click", () => {
    goPreview(); // affiche scène + animation + sons
});

// -------------------------
// UTILS
// -------------------------
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

// -------------------------
// SUPPRESSION FOND DES DESSINS
// -------------------------
function removeBackground(imageSrc, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for(let i = 0; i < data.length; i += 4){
            const r = data[i], g = data[i+1], b = data[i+2];
            if(r > 240 && g > 240 && b > 240) data[i+3] = 0;
        }

        ctx.putImageData(imageData, 0, 0);
        callback(canvas.toDataURL("image/png"));
    };
}
