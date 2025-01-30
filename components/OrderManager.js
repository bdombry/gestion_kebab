import Timer from "./Timer.js";

class OrderManager {
  constructor(recipeManager) {
    this.recipeManager = recipeManager;
    this.cart = [];
    this.cartList = document.getElementById("cart-list");
    this.orders = JSON.parse(localStorage.getItem("orders")) || [];
    this.orders.forEach((order) => {
      order.timerElement = document.createElement("span");
    });
    this.cartTotalDisplay = document.getElementById("cart-total");
    this.orderList = document.getElementById("order-list");
    this.basePrice = 5.0;
    this.meatSupplementPrice = 1.0;
    this.sauceSupplementPrice = 0.5;
    this.cheeseSupplementPrice = 0.5;

    this.init();
  }

  init() {
    const addKebabBtn = document.getElementById("add-kebab-btn");
    const validateOrderBtn = document.getElementById("validate-order-btn");
    const recipeSelect = document.getElementById("recipe-select");

    if (addKebabBtn) {
      addKebabBtn.addEventListener("click", () => this.addToCart());
    } else {
      console.error("Erreur : Bouton 'Ajouter au Panier' non trouvé !");
    }

    if (validateOrderBtn) {
      validateOrderBtn.addEventListener("click", () =>
        this.sendOrderToKitchen()
      );
    } else {
      console.error("Erreur : Bouton 'Valider la Commande' non trouvé !");
    }

    if (recipeSelect) {
      recipeSelect.addEventListener("change", () => this.preselectRecipe());
    } else {
      console.error("Erreur : Sélecteur de recette non trouvé !");
    }

    this.displayOrders();

    document
      .querySelectorAll("#order-meat-options input[type='checkbox']")
      .forEach((meat) =>
        meat.addEventListener("change", () => this.updatePrice())
      );
    document
      .querySelectorAll("#sauce-options input[type='checkbox']")
      .forEach((sauce) =>
        sauce.addEventListener("change", () => this.updatePrice())
      );
    document
      .querySelectorAll("#cheese-options input[type='checkbox']")
      .forEach((cheese) =>
        cheese.addEventListener("change", () => this.updatePrice())
      );
  }

  preselectRecipe() {
    let selectedOption =
      document.getElementById("recipe-select").selectedOptions[0];
    if (!selectedOption || !selectedOption.dataset.sauce) return;

    let recommendedSauce = selectedOption.dataset.sauce;

    document
      .querySelectorAll("#sauce-options input[type='checkbox']")
      .forEach((sauce) => {
        sauce.checked = sauce.value === recommendedSauce;
      });

    this.updatePrice();
  }

  resetSelection() {
    document.getElementById("recipe-select").value = "";
    document
      .querySelectorAll("#order-meat-options input[type='checkbox']")
      .forEach((meat) => (meat.checked = false));
    document
      .querySelectorAll("#sauce-options input[type='checkbox']")
      .forEach((sauce) => (sauce.checked = false));
    document
      .querySelectorAll("#cheese-options input[type='checkbox']")
      .forEach((cheese) => (cheese.checked = false));
    this.updatePrice();
  }

  addToCart() {
    let selectedRecipe = document.getElementById("recipe-select").value;
    let selectedMeats = Array.from(
      document.querySelectorAll(
        "#order-meat-options input[type='checkbox']:checked"
      )
    ).map((meat) => meat.value);
    let selectedSauces = Array.from(
      document.querySelectorAll("#sauce-options input[type='checkbox']:checked")
    ).map((sauce) => sauce.value);
    let selectedCheeses = Array.from(
      document.querySelectorAll(
        "#cheese-options input[type='checkbox']:checked"
      )
    ).map((cheese) => cheese.value);

    if (!selectedRecipe) {
      alert("Veuillez choisir un kebab !");
      return;
    }

    let extraMeatCharge = selectedMeats.length * this.meatSupplementPrice;
    let extraSauceCharge =
      Math.max(0, selectedSauces.length - 2) * this.sauceSupplementPrice;
    let extraCheeseCharge = selectedCheeses.length * this.cheeseSupplementPrice;
    let kebabPrice =
      this.basePrice + extraMeatCharge + extraSauceCharge + extraCheeseCharge;

    let kebab = {
      recipe: selectedRecipe,
      meats: selectedMeats,
      sauces: selectedSauces,
      cheeses: selectedCheeses,
      price: kebabPrice,
      extraMeatCount: selectedMeats.length,
      extraSauceCount: Math.max(0, selectedSauces.length - 2),
      extraCheeseCount: selectedCheeses.length,
    };

    this.cart.push(kebab);
    this.updateCart();
    this.resetSelection();
  }

  updatePrice() {
    let selectedMeats = Array.from(
      document.querySelectorAll(
        "#order-meat-options input[type='checkbox']:checked"
      )
    );
    let selectedSauces = Array.from(
      document.querySelectorAll("#sauce-options input[type='checkbox']:checked")
    );
    let selectedCheeses = Array.from(
      document.querySelectorAll(
        "#cheese-options input[type='checkbox']:checked"
      )
    );

    let extraMeatCharge = selectedMeats.length * this.meatSupplementPrice;
    let extraSauceCharge =
      Math.max(0, selectedSauces.length - 2) * this.sauceSupplementPrice;
    let extraCheeseCharge = selectedCheeses.length * this.cheeseSupplementPrice;
    let totalPrice =
      this.basePrice + extraMeatCharge + extraSauceCharge + extraCheeseCharge;

    this.cartTotalDisplay.textContent = totalPrice.toFixed(2) + "€";

    let warningMessage = "";
    if (selectedMeats.length > 0)
      warningMessage += `Supplément viande : ${extraMeatCharge.toFixed(2)}€\n`;
    if (selectedSauces.length > 2)
      warningMessage += `Supplément sauce : ${extraSauceCharge.toFixed(2)}€\n`;
    if (selectedCheeses.length > 0)
      warningMessage += `Supplément fromage : ${extraCheeseCharge.toFixed(
        2
      )}€\n`;
    document.getElementById("price-warning").textContent = warningMessage;
  }

  updateCart() {
    this.cartList.innerHTML = "";
    let totalPrice = 0;

    this.cart.forEach((kebab, index) => {
      let kebabTotal = 0;

      let extraMeatCharge = kebab.extraMeatCount * this.meatSupplementPrice;
      let extraSauceCharge = kebab.extraSauceCount * this.sauceSupplementPrice;
      let extraCheeseCharge =
        kebab.extraCheeseCount * this.cheeseSupplementPrice;

      kebabTotal =
        this.basePrice + extraMeatCharge + extraSauceCharge + extraCheeseCharge;
      totalPrice += kebabTotal;

      let supplementDetails = [];
      if (kebab.extraMeatCount > 0)
        supplementDetails.push(`Supplément viande: ${kebab.meats.join(", ")}`);
      if (kebab.extraCheeseCount > 0)
        supplementDetails.push(
          `Supplément fromage: ${kebab.cheeses.join(", ")}`
        );

      let listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      listItem.innerHTML = `
            <span><strong>${kebab.recipe}</strong> avec ${kebab.sauces.join(
        ", "
      )}
            ${
              supplementDetails.length > 0
                ? " - " + supplementDetails.join(", ")
                : ""
            }</span>
            <span class="badge bg-warning text-dark">${kebabTotal.toFixed(
              2
            )}€</span>
            <button class="btn btn-sm btn-danger remove-kebab" data-index="${index}">Supprimer</button>
        `;

      this.cartList.appendChild(listItem);
    });

    this.cartTotalDisplay.textContent = totalPrice.toFixed(2) + "€";

    document.getElementById("cart-total-commande").textContent =
      totalPrice.toFixed(2) + "€";

    document.querySelectorAll(".remove-kebab").forEach((button) => {
      button.addEventListener("click", (event) => {
        let index = event.target.dataset.index;
        this.cart.splice(index, 1);
        this.updateCart();
      });
    });
  }

  validateOrder() {
    this.cart = [];
    this.updateCart();
    localStorage.removeItem("cart");
  }

  async sendOrderToKitchen() {
    if (this.cart.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    try {
      let response = await fetch(
        "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Paris"
      );
      let data = await response.json();

      let timestamp = `${data.date} ${data.time}`;

      let timerElement = document.createElement("span");

      let order = {
        id: Date.now(),
        items: [...this.cart],
        timestamp: timestamp,
        timerElement: timerElement,
      };

      this.orders.push(order);
      this.orders.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      localStorage.setItem("orders", JSON.stringify(this.orders));
      this.displayOrders();
      this.clearCart();
    } catch (error) {
      console.error("Erreur lors de la récupération de l'heure :", error);
      alert(
        "Impossible de récupérer l'heure de la commande. Veuillez réessayer."
      );
    }
  }

  displayOrders() {
    this.orderList.innerHTML = "";
    this.orders.forEach((order) => {
      let listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      order.timer = new Timer(order.timerElement);
      let orderDetails = document.createElement("div");
      orderDetails.innerHTML = `
            <strong>Commande #${order.id}</strong> - ${
        order.items.length
      } kebabs
            <br><small>Prise le : ${order.timestamp}</small>
            <br>Ingrédients : ${order.items
              .map(
                (item) => `
                ${item.recipe} avec ${item.sauces.join(", ")}
                ${
                  item.meats.length > 0
                    ? "- Supplément viande : " + item.meats.join(", ")
                    : ""
                }
                ${
                  item.cheeses.length > 0
                    ? "- Supplément fromage : " + item.cheeses.join(", ")
                    : ""
                }
            `
              )
              .join("<br>")}
        `;

      listItem.appendChild(orderDetails);
      listItem.appendChild(order.timerElement);

      let buttonGroup = document.createElement("div");

      let validateButton = document.createElement("button");
      validateButton.classList.add("btn", "btn-success", "btn-sm", "mx-2");
      validateButton.textContent = "Valider";
      validateButton.addEventListener("click", () =>
        this.completeOrder(order.id)
      );

      let deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener("click", () => this.removeOrder(order.id));

      buttonGroup.appendChild(validateButton);
      buttonGroup.appendChild(deleteButton);
      listItem.appendChild(buttonGroup);

      this.orderList.appendChild(listItem);
    });
  }
  clearCart() {
    this.cart = [];
    this.updateCart();
  }
  completeOrder(orderId) {
    this.orders = this.orders.filter((order) => order.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(this.orders));
    this.displayOrders();
  }

  removeOrder(orderId) {
    this.orders = this.orders.filter((order) => order.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(this.orders));
    this.displayOrders();
  }
}

export default OrderManager;
