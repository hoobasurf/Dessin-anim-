document.addEventListener("DOMContentLoaded", () => {
  const generateStoryBtn = document.getElementById("generate-story");
  const backgroundChoices = document.querySelectorAll(".background-choice");
  const animalChoices = document.querySelectorAll(".animal-choice");

  let selectedBackground = "foret";
  let selectedAnimals = [];

  // --- Sélection du décor ---
  backgroundChoices.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedBackground = btn.dataset.bg;
      document.querySelectorAll(".background-choice").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // --- Sélection des animaux ---
  animalChoices.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.animal;
      if (selectedAnimals.includes(name)) {
        selectedAnimals = selectedAnimals.filter(a => a !== name);
        btn.classList.remove("active");
      } else {
        if (selectedAnimals.length < 3) {
          selectedAnimals.push(name);
          btn.classList.add("active");
        }
      }
    });
  });

  // --- Lancement de l’histoire ---
  generateStoryBtn.addEventListener("click", () => {
    startStory(selectedBackground, selectedAnimals);
  });
});
