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
    const modalTimeout = setTimeout(showModal, 40000);
    
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
    
});