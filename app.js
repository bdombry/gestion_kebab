import RecipeManager from "./components/RecipeManager.js";
import OrderManager from "./components/OrderManager.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Application chargée...");

  const recipeManager = new RecipeManager();

  const orderManager = new OrderManager(recipeManager);

  console.log("Gestionnaires initialisés.");
});
