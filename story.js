// story.js — lecture MP3 et animation discrète des animaux
document.addEventListener("DOMContentLoaded", () => {
    // référence au bouton créer histoire
    const genBtn = document.getElementById("generate-story");
    if(!genBtn) return;

    // conteneur de prévisualisation
    const preview = document.getElementById("preview-container");

    // léger mouvement quand l'animal "parle"
    function animateSpeaking(img) {
        let scale = 1;
        const interval = setInterval(() => {
            scale = scale === 1 ? 1.05 : 1;
            img.style.transform = `scale(${scale})`;
        }, 300);
        return interval;
    }

    genBtn.addEventListener("click", () => {
        if(!window.selectedBackground) {
            alert("Choisis un fond !");
            return;
        }
        if(window.selectedCartes.length === 0 && window.dessins.length === 0) {
            alert("Choisis au moins un animal ou dessin !");
            return;
        }

        preview.innerHTML = "";
        preview.style.backgroundImage = `url(${window.selectedBackground})`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";

        // placer animaux sélectionnés (max 5)
        const animals = window.selectedCartes.slice(0,5);
        const positions = [50, 180, 310, 440, 570]; // x positions
        const animalImgs = [];

        animals.forEach((name,i) => {
            const img = document.createElement("img");
            img.src = name;
            img.style.position = "absolute";
            img.style.bottom = "0";
            img.style.left = `${positions[i]}px`;
            img.style.width = "90px";
            preview.appendChild(img);
            animalImgs.push(img);
        });

        // dessins importés
        window.dessins.forEach((src,i) => {
            const img = document.createElement("img");
            img.src = src;
            img.style.position = "absolute";
            img.style.bottom = "0";
            img.style.left = `${positions[i + animals.length]}px`;
            img.style.width = "90px";
            preview.appendChild(img);
            animalImgs.push(img);
        });

        // jouer le MP3
        const audio = new Audio("laforetenchantee.mp3");
        audio.play();

        // animation légère des animaux pendant le MP3
        const intervals = [];
        audio.addEventListener("play", () => {
            animalImgs.forEach(img => {
                intervals.push(animateSpeaking(img));
            });
        });

        // arrêter l'animation quand le MP3 se termine
        audio.addEventListener("ended", () => {
            intervals.forEach(interval => clearInterval(interval));
            animalImgs.forEach(img => img.style.transform = "scale(1)");
        });
    });
});
