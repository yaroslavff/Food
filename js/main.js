'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsWrapper = document.querySelector('.tabheader__items');
          
    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });
    }

    function showTab(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
    }

    hideTabsContent();
    showTab();

    tabsWrapper.addEventListener('click', (event) => {
        if (event.target && event.target.classList == 'tabheader__item') {
            tabs.forEach((item, i) => {
                item.classList.remove('tabheader__item_active');
                
                if (tabs[i] == event.target) {
                    item.classList.add('tabheader__item_active');
                    hideTabsContent();
                    showTab(i);
                }
            });
        }
    });

    const deadline = Date.parse(new Date()) + (1000 * 60 * 60 * 36);

    function getTimeRemaining(endtime) {
        const t = endtime - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / (1000 * 60)) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(number) {
        if(number > 0 && number < 10) {
            return `0${number}`;
        } else {
            return number;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              interval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(interval);
            }
        }
    }

    setClock('.timer', deadline);

    const modalBtn = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloser = document.querySelector('.modal__close');

    modalBtn.forEach(button => {
        button.addEventListener('click', () => {
            openModal();
        });
    });

    modalCloser.addEventListener('click', closeModal);

    modal.addEventListener('click', event => {
        if (event.target && event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        const form = document.querySelector('.modal-form').reset();
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalInterval);
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    const modalInterval = setInterval(openModal, 30000);
});