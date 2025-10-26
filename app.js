let mode = null;
let selectedBackground = null;

function playClick() {
    document.getElementById("clickSound").play();
}

function selectMode(m) {
    mode = m;
    playClick();
    showPage("page-background");
    loadBackgroundOptions();
}

function loadBackgroundOptions() {
    const grid = document.getElementById("background-grid");
    grid.innerHTML = "";

    const backgrounds = [
        "ferme-1.png",
        "savane-1.png",
        "ocean-1.png",
        "foret-1.png"
    ];

    backgrounds.forEach(name => {
        const img = document.createElement("img");
        img.src = name;
        img.onclick = () => {
            document.querySelectorAll(".grid img").forEach(i => i.classList.remove("selected"));
            img.classList.add("selected");
            selectedBackground = name;
            playClick();
        };
        grid.appendChild(img);
    });
}

function selectBackground(bg) {
    if (bg === "random") {
        const arr = ["ferme-1.png","savane-1.png","ocean-1.png","foret-1.png"];
        selectedBackground = arr[Math.floor(Math.random()*arr.length)];
    }
    playClick();
}

function goPreview() {
    if (!selectedBackground) return alert("Choisis un fond !");
    document.getElementById("preview-container").style.backgroundImage = `url(${selectedBackground})`;
    showPage("page-preview");
}

function generateStory() {
    alert("La petite histoire s’animera ici 📽✨ (phase 2)");
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}
