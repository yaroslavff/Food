import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
// import

window.addEventListener('DOMContentLoaded', () => {

    calc();
    cards();
    forms('.modal');
    modal('[data-modal]', '.modal');
    slider({
        allSlides: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev', 
        currentCounter: '#current', 
        totalCounter: '#total'
    });
    tabs();
    timer();
});