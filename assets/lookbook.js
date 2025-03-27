class LookbookPopup extends HTMLElement {
  constructor() {
    super();
    this.modal = this.querySelector(".lookbook-popup-modal");
    this.openModal = this.querySelector(".lookbook--dot");
    this.closeButton = this.querySelector(".close");
    this.popupContent = this.modal?.querySelector(".lookbook-popup-content");
    this.overlay = this.querySelector(".lookbook-overlay");
    this.openModal?.addEventListener("click", () => this.openPopup());
    this.overlay?.addEventListener("click", () => this.closePopup());
    this.closeButton?.addEventListener("click", () => this.closePopup());
}

  openPopup() {
    this.modal?.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  closePopup() {
    this.modal?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

}

customElements.define("lookbook-popup", LookbookPopup);
