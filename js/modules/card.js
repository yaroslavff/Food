import {getData} from "../services/services";

function card() {
  // Food Card

  const foodCardContainer = document.querySelector(".menu .container");
  foodCardContainer.innerHTML = "";

  class FoodCard {
    constructor(src, alt, title, descr, price, parent) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = parent;
      this.transfer = 75;
      this.changeToRUB();
    }

    changeToRUB() {
      this.price = Math.floor(this.price * this.transfer);
    }

    render() {
      const element = document.createElement("div");
      element.classList.add("menu__item");
      element.innerHTML = `
        <img src="${this.src}" alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
      `;
      this.parent.appendChild(element);
    }

  }

  getData("http://localhost:3000/menu")
  .then(result => {
    result.forEach(({img, altimg, title, descr, price}) => {
      new FoodCard(
        img,
        altimg,
        title,
        descr,
        price,
        foodCardContainer
      ).render();
    });
  });
}

export default card;