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
          modal = document.querySelector('.modal');

    modalBtn.forEach(button => {
        button.addEventListener('click', () => {
            openModal();
        });
    });

    modal.addEventListener('click', event => {
        if (event.target && event.target === modal || event.target.getAttribute('data-close') == '') {
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
        document.querySelector('.modal-form').reset();
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        // clearInterval(modalInterval);
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // const modalInterval = setInterval(openModal, 30000);

    class MenuCard {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 73;
            this.changeToRUB();
            this.parent = document.querySelector(parent);
        }

        changeToRUB() {
            this.price = +this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.class = 'menu__item';
                element.classList.add(this.class);
            } else {
                this.classes.forEach(className => element.classList.add(className));   
            }
            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
            </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        8,
        '.menu .container'
        ).render();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        15,
        '.menu .container',
        'menu__item'
    ).render();

    const allForms = document.querySelectorAll('form');

    allForms.forEach(item => {
        postData(item);
    });

    const message = {
        loading: 'img/form/spinner.svg',
        succsess: 'Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так :('
    };

    function postData(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block; 
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const object = {};

            formData.forEach((item, key) => {
                object[key] = item;
            });

            dontLoopSubmit(true);

            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            }).then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.succsess);
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
                statusMessage.remove();
                dontLoopSubmit(false);
            });
        });
    }

    const submitBtn = document.querySelectorAll('.btn__submit');
    function dontLoopSubmit(boolean) {
        if(boolean == true) {
            submitBtn.forEach(item => {
                item.setAttribute('disabled', 'true');
            });
        } else {
            submitBtn.forEach(item => {
                item.removeAttribute('disabled', 'true');
            });
        }
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        prevModal.classList.remove('show');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.remove('hide');
            prevModal.classList.add('show');
            closeModal();
        }, 4000);
    }
});