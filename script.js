// Variables
let mode = '';
let dessins = [];
let selectedFond = null;
let selectedCartes = [];

// Écrans
const modeSelection = document.getElementById('mode-selection');
const importDessins = document.getElementById('import-dessins');
const cartesSection = document.getElementById('cartes-section');
const storySection = document.getElementById('story-section');

// Mode selection
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        modeSelection.classList.add('hidden');

        if(mode === 'cartes') {
            cartesSection.classList.remove('hidden');
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

document.getElementById('next-to-cards').addEventListener('click', () => {
    importDessins.classList.add('hidden');
    cartesSection.classList.remove('hidden');
});

// TODO : Charger les images des fonds et cartes, drag & drop, générer histoire animée
