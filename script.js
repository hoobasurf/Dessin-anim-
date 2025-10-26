// Variables
let dessins = [];
let selectedCartes = [];

// Écrans
const modeSelection = document.getElementById('mode-selection');
const importDessins = document.getElementById('import-dessins');
const cartesSection = document.getElementById('cartes-section');

// Mode selection
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

// Bouton suivant
document.getElementById('next-to-cards').addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
    loadCartes();
});

// Liste complète des cartes animaux
const cartesAnimaux = [
  "cerf.png","chat.png","cheval.png","chien.png",
  "dauphin.png","ecureuil.png","elephant.png","girafe.PNG",
  "guepard.png","lion.png","loup.png","mouton.png",
  "otarie.png","ours.png","pieuvre.png","poisson.png",
  "poule.png","poussin.png","renard.png","requin.png",
  "singe.png","tortue.png","vache.png","zebre.png"
];

// Charger cartes
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
