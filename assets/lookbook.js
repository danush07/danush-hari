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

  addToCart() {
    const productId = this.dataset.productId;
    if (!productId) {
      console.error("Product ID is missing!");
      return;
    }

    let selectedOptions = [];
    this.selectElements.forEach((select) => {
      selectedOptions.push(select.value);
    });

    this.radioElements.forEach((radio) => {
      if (radio.checked) {
        selectedOptions.push(radio.value);
      }
    });

    const variants = JSON.parse(this.dataset.variants);
    const variant = variants.find(
      (v) => JSON.stringify(v.options) === JSON.stringify(selectedOptions)
    );

    if (!variant) {
      this.querySelector(".lookbook-error ").classList.remove('hidden');
      return;
    }

    const variantId = variant.id; 
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location = window.routes.cart_url;
        return;
      })
      .catch((error) => {
        this.querySelector(".lookbook-error ").classList.remove("hidden");
        this.querySelector(".lookbook-error ").textContent('Error Adding Product to cart');
        console.error("Error adding to cart:", error);
      });
  }
}

customElements.define("lookbook-popup", LookbookPopup);
