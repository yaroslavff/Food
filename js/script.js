window.addEventListener("DOMContentLoaded", () => {

    // Tabs

    const tabsMenu = document.querySelector(".tabheader__items");
    const tabs = tabsMenu.querySelectorAll(".tabheader__item");
    const tabsContent = document.querySelectorAll(".tabcontent");

    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.classList.add("hide");
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTab(i) {
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabsContent();
    showTab(0);
    
    tabsMenu.addEventListener("click", (e) => {
        if(e.target && e.target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if(e.target == item) {
                    hideTabsContent();
                    showTab(i);
                }
            });
        }
    });

    // Timer

    const deadline = Date.parse(new Date()) + (3 * 24 * 60 * 60 * 1000);

    function getTime(endtime) {
        const t = endtime - new Date();
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((t / (1000 * 60)) % 60);
        const seconds = Math.floor((t / (1000)) % 60);

        return {
            "result": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function getZero(n) {
        if(n < 10) {
            return `0${n}`;
        } else {
            return n;
        }
    }

    function setTimeInTimer(selector, endtime) {

        const timer = document.querySelector(selector);
        const days = timer.querySelector("#days");
        const hours = timer.querySelector("#hours");
        const minutes = timer.querySelector("#minutes");
        const seconds = timer.querySelector("#seconds");
        const clockInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTime(endtime);

            if(t.result <= 0) {
                return clearInterval(clockInterval);
            }

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);
        }

    }

    setTimeInTimer(".timer", deadline);

    // Modal

    const modal = document.querySelector(".modal");
    const modalBtn = document.querySelectorAll("[data-modal]");
    const modalTimeout = setTimeout(showModal, 50000);
    
    modalBtn.forEach(item => {
        item.addEventListener("click", ()=> {
            showModal();
        });
    });

    modal.addEventListener("click", (e) => {
        if((e.target && e.target.getAttribute("data-close") == "") || e.target == modal) {
            hideModal();
        }
    });

    document.addEventListener("keyup", (e) => {

        if(e.code == "Escape" && modal.classList.contains("show")) {
            hideModal();
        }
    });

    document.addEventListener("scroll", showModalByScroll);

    function hideModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "visible";
        
        document.removeEventListener("scroll", showModalByScroll);
    }

    function showModal() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
        clearTimeout(modalTimeout);
    }

    function showModalByScroll() {
        if(document.documentElement.scrollHeight <= document.documentElement.clientHeight + window.pageYOffset) {
            showModal();
        }
    }

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

    const getData = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };


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

    // Form

    const form = document.querySelectorAll("form");
    const messages = {
        succsess: "Спасибо, скоро мы с вами свяжемся!",
        loading: "img/form/spinner.svg",
        error: "Что-то пошло не так...("
    };

    form.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=utf-8"
            },
            body: data
        });

        if(!result.ok) {
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    };

    function bindPostData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const statusMessage = document.createElement("img");
            statusMessage.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement("afterend", statusMessage);
            form.querySelector("button").disabled = true;
            
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests1", json)
            .then(data => {
                showThanksModal(messages.succsess);
                console.log(data);
            })
            .catch(() => {
                showThanksModal(messages.error);
            })
            .finally(() => {
                form.querySelector("button").disabled = false;
                statusMessage.remove();
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector(".modal__dialog");

        prevModal.classList.remove("show");
        prevModal.classList.add("hide");
        showModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.add("show");
            prevModal.classList.remove("hide");
            hideModal();
        }, 4000);
    }

    // slider

    const slider = document.querySelector(".offer__slider");
    const slides = document.querySelectorAll(".offer__slide");
    const currentSlideCounter = document.querySelector("#current");
    const totalSlideCounter = document.querySelector("#total");
    const prevSlide = document.querySelector(".offer__slider-prev");
    const nextSlide = document.querySelector(".offer__slider-next");
    const slidesWrapper = document.querySelector(".offer__slider-wrapper");
    const slidesField = document.querySelector(".offer__slider-inner");
    const width = window.getComputedStyle(slidesWrapper).width;
    const sliderNav = document.createElement("ul");
    let current = 1;
    let offset = 0;
    let dots = [];

    totalSlideCounter.textContent = getZero(slides.length);
    currentSlideCounter.textContent = getZero(current);

    slider.style.position = "relative";
    sliderNav.classList.add("carousel-indicators");

    slider.append(sliderNav);
    
    slidesField.style.cssText = `
        width: ${100 * slides.length}%;
        display: flex;
        transition: 0.5s all;
    `;

    slidesWrapper.style.overflow = "hidden";
    slides.forEach(slide => {
        slide.style.width = width;
    });

    nextSlide.addEventListener("click", () => {
        if(offset === +width.slice(0, -2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, -2);
        }
        
        current++;

        showSlide(current, offset);
    });

    prevSlide.addEventListener("click", () => {
        if(offset === 0) {
            offset = +width.slice(0, -2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, -2);
        }

        current--;

        showSlide(current, offset);
    });

    for(let i = 0; i < slides.length; i++) {
        dots[i] = document.createElement("li");
    }

    dots.forEach((slideBtn, i) => {
        slideBtn.id = `slide${i}`;
        slideBtn.classList.add("dot");
        sliderNav.append(slideBtn);
        slideBtn.addEventListener("click", (e) => {
            if(e.target && e.target.id === `slide${i}`) {
                selectSlideForNav(i)
            }
        });
    });

    function showSlide(n, offset) {
        if(n < 1) {
            current = slides.length;
        } if(n > slides.length) {
            current = 1;
        }
        
        getCurrentSlide(current);
        slidesField.style.transform = `translateX(-${offset}px)`;
    }
    
    function getCurrentSlide(curr) {
        dots.forEach(dot => dot.style.opacity = 0.5);
        dots[curr - 1].style.opacity = 1;
        currentSlideCounter.textContent = getZero(curr);
    }

    function selectSlideForNav(i) {
        offset = width.slice(0, -2) * i++;
        current = i++;

        showSlide(current, offset);
    }

    showSlide(current, offset);
});