let dessins = [];
let selectedCartes = [];

const modeSelection = document.getElementById('mode-selection');
const importDessins = document.getElementById('import-dessins');
const cartesSection = document.getElementById('cartes-section');

// Liste complète des cartes animaux
const cartesAnimaux = [
  "chat.png","cheval.png","chien.png","poule.png",
  "poussin.png","vache.png","mouton.png",
  "ours.png","cerf.png","renard.png","loup.png","ecureuil.png", 
  "pieuvre.png","poisson.png","tortue.png",
  "requin.png","dauphin.png","otarie.png",
  "singe.png","zebre.png","elephant.png",
  "girafe.png","guepard.png","lion.png",
];

// Sélection du mode
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        modeSelection.classList.add('hidden');
        if(mode === 'cartes') {
            cartesSection.classList.remove('hidden');
            loadCartes();
        } else {
            importDessins.classList.remove('hidden');
        }
    });
});

// Import dessins
document.getElementById('file-input').addEventListener('change', (e) => {
    const files = e.target.files;
    dessins = [];
    document.getElementById('dessins-preview').innerHTML = '';
    for(let i=0; i<Math.min(files.length,3); i++){
        const reader = new FileReader();
        reader.onload = (event) => {
            dessins.push(event.target.result);
            const img = document.createElement('img');
            img.src = event.target.result;
            document.getElementById('dessins-preview').appendChild(img);
        }
        reader.readAsDataURL(files[i]);
    }
});

// Bouton suivant pour passer aux cartes
document.getElementById('next-to-cards').addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
});

// Charger les cartes
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
