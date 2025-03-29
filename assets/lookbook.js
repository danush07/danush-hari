class LookbookPopup extends HTMLElement {
  constructor() {
    super();
    this.modal = this.querySelector(".lookbook-popup-modal");
    this.openModal = this.querySelector(".lookbook--dot");
    this.closeButton = this.querySelector(".close");
    this.overlay = this.querySelector(".lookbook-overlay");
    this.addToCartButton = this.querySelector(".lookbook--atc");
    this.selectElements = this.querySelectorAll(".custom-select");
    this.radioElements = this.querySelectorAll(".lookbook-radio");

    this.openModal?.addEventListener("click", () => this.openPopup());
    this.overlay?.addEventListener("click", () => this.closePopup());
    this.closeButton?.addEventListener("click", () => this.closePopup());
    this.addToCartButton?.addEventListener("click", () => this.addToCart());
  }

  openPopup() {
    this.modal?.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  closePopup() {
    this.modal?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  async addToCart() {
    const productId = this.dataset.productId;
    if (!productId) {
      console.error("Product ID is missing!");
      return;
    }

    //getting product variant options
    let selectedOptions = [];
    this.selectElements.forEach((select) => selectedOptions.push(select.value));
    this.radioElements.forEach((radio) => {
      if (radio.checked) selectedOptions.push(radio.value);
    });

    const variants = JSON.parse(this.dataset.variants);
    const selectedVariant = variants.find(
      (v) => JSON.stringify(v.options) === JSON.stringify(selectedOptions)
    );

    if (!selectedVariant) {
      this.querySelector(".lookbook-error").classList.remove("hidden");
      return;
    }

    // for adding additional item to cart
    const cartItems = [{ id: selectedVariant.id, quantity: 1 }];
    if (
      selectedOptions.includes("Black") &&
      selectedOptions.includes("M")
    ) {
      try {
        const response = await fetch(`/products/dark-winter-jacket.json`);
        const data = await response.json();
        if (data && data.product && data.product.variants.length > 0) {
          const jacketVariant = data.product.variants[0]; 
          cartItems.push({ id: jacketVariant.id, quantity: 1 });
        }
      } catch (error) {
        console.error("Error fetching dark-winter-jacket variant:", error);
      }
    }

    // add to cart functionality
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location = window.routes.cart_url;
      })
      .catch((error) => {
        this.querySelector(".lookbook-error").classList.remove("hidden");
        this.querySelector(".lookbook-error").textContent =
          "Error Adding Product to Cart";
        console.error("Error adding to cart:", error);
      });
  }
}

// defining custom element
customElements.define("lookbook-popup", LookbookPopup);
