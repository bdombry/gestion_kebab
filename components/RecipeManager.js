class RecipeManager {
  constructor() {
    this.recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    console.log("Chargement des recettes :", this.recipes);

    this.recipeList = document.getElementById("recipe-list");
    this.recipeSelect = document.getElementById("recipe-select");

    this.init();
  }

  init() {
    this.displayRecipes();
    document
      .getElementById("add-recipe-btn")
      .addEventListener("click", () => this.addRecipe());
  }

  saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(this.recipes));
    console.log("Recettes sauvegardées :", this.recipes);
  }

  displayRecipes() {
    this.recipeList.innerHTML = "";
    this.recipeSelect.innerHTML = `<option value="">Sélectionner une recette</option>`;

    this.recipes.forEach((recipe, index) => {
      let listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      listItem.innerHTML = `
            <span><strong>${recipe.name}</strong> - ${recipe.bread}, 
            ${
              Array.isArray(recipe.meat) ? recipe.meat.join(", ") : recipe.meat
            }, 
            ${recipe.veggies} - 
            Sauce: <em>${recipe.sauce}</em>, Fromage: <em>${
        recipe.cheese
      }</em></span>
            <button class="btn btn-sm btn-danger delete-recipe" data-index="${index}">Supprimer</button>
        `;
      this.recipeList.appendChild(listItem);

      let option = document.createElement("option");
      option.value = recipe.name;
      option.textContent = recipe.name;
      option.dataset.sauce = recipe.sauce;
      option.dataset.cheese = recipe.cheese;
      option.dataset.meat = Array.isArray(recipe.meat)
        ? recipe.meat.join(", ")
        : recipe.meat;
      this.recipeSelect.appendChild(option);
    });

    document.querySelectorAll(".delete-recipe").forEach((btn) => {
      btn.addEventListener("click", (e) => this.deleteRecipe(e));
    });

    document.querySelectorAll(".delete-recipe").forEach((btn) => {
      btn.addEventListener("click", (e) => this.deleteRecipe(e));
    });
  }

  addRecipe() {
    let name = document.getElementById("recipe-name").value.trim();
    let bread = document.getElementById("recipe-bread").value;
    let meat = Array.from(
      document.querySelectorAll(
        "#recipe-meat-options input[type='checkbox']:checked"
      )
    ).map((meat) => meat.value);
    let veggies = document.getElementById("recipe-veggies").value.trim();
    let sauce = document.getElementById("recipe-sauce").value;
    let cheese = document.getElementById("recipe-cheese").value;

    if (!name || meat.length === 0 || !veggies) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    let newRecipe = { name, bread, meat, veggies, sauce, cheese };
    this.recipes.push(newRecipe);
    this.saveRecipes();
    this.displayRecipes();
    this.clearForm();
  }

  deleteRecipe(event) {
    let index = event.target.getAttribute("data-index");
    this.recipes.splice(index, 1);
    this.saveRecipes();
    this.displayRecipes();
  }

  clearForm() {
    document.getElementById("recipe-name").value = "";
    document
      .querySelectorAll("#recipe-meat-options input[type='checkbox']")
      .forEach((meat) => (meat.checked = false));
    document.getElementById("recipe-veggies").value = "";
  }
}

export default RecipeManager;
