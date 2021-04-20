window.addEventListener("DOMContentLoaded", () => {

    // Tabs

    const tabsMenu = document.querySelector(".tabheader__items");
    const tabs = tabsMenu.querySelectorAll(".tabheader__item");
    const tabsContent = document.querySelectorAll(".tabcontent");

    function hideTabsContent() {
        tabsContent.forEach(item => {
            item.style.display = "none";
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTab(i) {
        tabsContent[i].style.display = "block";
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
    const closeModalBtn = document.querySelector("[data-close]");
    // const modalTimeout = setTimeout(showModal, 40000);
    
    modalBtn.forEach(item => {
        item.addEventListener("click", ()=> {
            showModal();
        });
    });

    modal.addEventListener("click", (e) => {
        if((e.target && e.target == closeModalBtn) || e.target == modal) {
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

    const foodCardContainer = document.querySelector(".menu__field .container");
    foodCardContainer.innerHTML = "";

    class FoodCard {
        constructor(src, title, descr, price, parent) {
            this.src = src;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = parent;
            this.transfer = 2.7;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = Math.floor(this.price * this.transfer);
        }

        render() {
            const element = document.createElement("div");
            element.classList.add("menu__item");
            element.innerHTML = `
                <img src="img/tabs/${this.src}.jpg" alt=${this.src}>
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

    new FoodCard(
        "vegy",
        "Меню “Фитнес”",
        "Меню “Фитнес” - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
        229,
        foodCardContainer
    ).render();

    new FoodCard(
        "elite",
        "Меню “Премиум”",
        "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
        550,
        foodCardContainer
    ).render();

    new FoodCard(
        "post",
        "Меню “Постное”",
        "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
        430,
        foodCardContainer
    ).render();

    // Form

    const form = document.querySelectorAll("form");
    const messages = {
        succsess: "Спасибо, скоро мы с вами свяжемся!",
        loading: "Идёт загрузка...",
        error: "Что-то пошло не так...("
    };

    form.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const statusMessage = document.createElement("div");
            statusMessage.classList.add("status");
            statusMessage.textContent = messages.loading;
            form.appendChild(statusMessage);

            const request = new XMLHttpRequest();
            request.open("POST", "server.php");
            
            const formData = new FormData(form);

            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener("load", () => {

                if(request.readyState === 4 && request.status === 200) {
                    statusMessage.textContent = messages.succsess;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                    console.log(request.response);
                } else {
                    statusMessage.textContent = messages.error;
                }
            });
        });
    }
    
});