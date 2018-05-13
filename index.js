const sheet = (width, height) => `#slider-container {
                                      display:flex;
                                      flex-flow:row;
                                      align-items: center;
                                      justify-content: flex-start;
                                      width:${width};
                                      height:auto;
                                      overflow:hidden;
                                  }
                                  #slider-container img {
                                    width:${width};
                                    min-height:${height};
                                    order: var(--order);
                                  }`;

class Image_slider extends HTMLElement {
  constructor() {
    super();
    this.dom = this.attachShadow({ mode: "open" });
  }

  switchImages() {
    const images = [...this.dom.querySelectorAll("img")];
    const positions = images.map(img =>
      getComputedStyle(img).getPropertyValue("--order")
    );
    positions.push(positions.shift());
    images.forEach((img, index) => {
      img.style.setProperty("--order", positions[index]);
    });
  }

  addStyle(sheet, location) {
    const style = document.createElement("style");
    style.type = `text/css`;
    style.appendChild(document.createTextNode(sheet));
    location.appendChild(style);
  }

  connectedCallback() {
    const width = this.getAttribute("width") || "300px";
    const height = this.getAttribute("height") || "250px";
    const interval = this.getAttribute("interval") || 3000;
    const clone = this.getAttribute("clone") || false;

    const images = this.querySelectorAll("img");
    const container = document.createElement("div");
    container.id = "slider-container";

    this.addStyle(sheet(width, height), this.dom);
    this.dom.appendChild(container);

    images.forEach((img, index) => {
      img.style.setProperty("--order", index);
      container.appendChild(img);
      if (clone) this.appendChild(img.cloneNode(true));
    });

    this.interval = setInterval(() => this.switchImages(), interval);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }
}

customElements.define("image-slider", Image_slider);
