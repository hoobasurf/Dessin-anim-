function startStory(fond, animaux) {
  const preview = document.getElementById("preview-container");
  preview.innerHTML = "";

  const scenes = {
    foret: {
      fond: "fond_foret.jpg",
      objets: ["buisson.png", "grotte.png", "tronc.png", "panier.png", "ruisseau.png"],
      audio: "laforetenchantee.mp3"
    },
    ocean: {
      fond: "fond_ocean.jpg",
      objets: ["coquillage.png", "poisson.png", "algue.png", "bulle.png"],
      audio: "histoireocean.mp3"
    },
    ferme: {
      fond: "fond_ferme.jpg",
      objets: ["seau.png", "paille.png", "grange.png", "cloche.png"],
      audio: "histoireferme.mp3"
    },
    neige: {
      fond: "fond_neige.jpg",
      objets: ["flocon.png", "sapin.png", "bonhomme.png", "maison.png"],
      audio: "histoireneige.mp3"
    }
  };

  const scene = scenes[fond] || scenes.foret;

  // Fond
  const background = document.createElement("img");
  background.src = scene.fond;
  background.classList.add("fond-scene");
  preview.appendChild(background);

  // Objets animés
  scene.objets.forEach((obj, i) => {
    const el = document.createElement("img");
    el.src = obj;
    el.classList.add("objet-scene");
    el.style.left = (10 + i * 18) + "%";
    el.style.bottom = (5 + (Math.random() * 10)) + "%";
    preview.appendChild(el);

    el.animate([
      { transform: "translateY(0px)" },
      { transform: "translateY(-8px)" },
      { transform: "translateY(0px)" }
    ], {
      duration: 2500 + Math.random() * 1500,
      iterations: Infinity
    });
  });

  // Animaux (petit mouvement discret)
  animaux.forEach((nom, i) => {
    const a = document.createElement("img");
    a.src = `${nom}.png`;
    a.classList.add("animal-scene");
    a.style.left = `${15 + i * 25}%`;
    a.style.bottom = "10%";
    preview.appendChild(a);

    a.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" }
    ], {
      duration: 1800,
      iterations: Infinity
    });
  });

  // Audio
  const audio = new Audio(scene.audio);
  audio.play();
}
