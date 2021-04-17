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

            days.textContent = t.days;
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;
        }

    }

    setTimeInTimer(".timer", deadline);
    
});