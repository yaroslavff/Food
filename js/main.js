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
            if (Boolean(this.parent) === false) {
                this.parent = document.querySelector('.menu .container');
            }
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
    .then((data) => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price).render();
        });
    })
    .catch(() => {
        console.log('Error 404');
    });

    const allForms = document.querySelectorAll('form');

    allForms.forEach(item => {
        bindPostData(item);
    });

    const message = {
        loading: 'img/form/spinner.svg',
        succsess: 'Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так :('
    };

    const postData = async function(url, data) {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await response.json();
    };

    async function getResource(url) {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`server ${url}: Error ${res.status}`);
        }

       return await res.json();
    }

    function bindPostData(form) {
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

            let json = JSON.stringify(Object.fromEntries(formData.entries()));
            dontLoopSubmit(true);

            postData('http://localhost:3000/requests', json)
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
    
    const slides = document.querySelectorAll('.offer__slide'),
          next = document.querySelector('.offer__slider-next'),
          prev = document.querySelector('.offer__slider-prev'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total');
    let slideCounter = 1;

    showSlide(slideCounter);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlide(n = 1) {
        if (n > slides.length) {
            slideCounter = 1;
        }

        if (n < 1) {
            slideCounter = slides.length;
        }

        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        slides[slideCounter - 1].style.display = 'block';
        slides[slideCounter - 1].classList.add('fade');
        
        if (slides.length < 10) {
            current.textContent = `0${slideCounter}`;
        } else {
            total.textContent = slideCounter;
        }
    }

    function plusSlide(n) {
        showSlide(slideCounter += n);
    }

    next.addEventListener('click', () => {
        plusSlide(1);
    });

    prev.addEventListener('click', () => {
        plusSlide(-1);
    });

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        weight, height, age,
        ratio = 1.375;

    function calcResult() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '_____';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcResult();

    function calcStaticInfo(parentSelector, active) {
        let elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

                elements.forEach(element => {
                    element.classList.remove(active);
                });

                e.target.classList.add(active);

                calcResult();
            });
        });
    }

    calcStaticInfo('#gender', 'calculating__choose-item_active');
    calcStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function calcDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    console.log(age);
                    break;
            }

            calcResult();
        });
    }

    calcDynamicInfo('#height');
    calcDynamicInfo('#weight');
    calcDynamicInfo('#age');
});