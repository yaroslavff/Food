import tabs from "./modules/tabs";
import modal from "./modules/modal";
import timer from "./modules/timer";
import card from "./modules/card";
import calc from "./modules/calc";
import form from "./modules/form";
import slider from "./modules/slider";
import {showModal} from "./modules/modal";

window.addEventListener("DOMContentLoaded", () => {

  const modalTimeout = setTimeout(() => showModal(".modal", modalTimeout), 100000);

  tabs(".tabheader__items", ".tabheader__item", ".tabcontent", "tabheader__item_active");
  modal(".modal", "[data-modal]", modalTimeout);
  timer(".timer", Date.parse(new Date()) + (3 * 24 * 60 * 60 * 1000));
  card();
  calc();
  form("form", modalTimeout);
  slider({
    container: ".offer__slider",
    slidesArray: ".offer__slide",
    currCounter: "#current",
    maxCounter: "#total",
    prevArrow: ".offer__slider-prev",
    nextArrow: ".offer__slider-next",
    wrapper: ".offer__slider-wrapper",
    slideField: ".offer__slider-inner"
  });
  
});