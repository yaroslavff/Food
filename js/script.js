window.addEventListener("DOMContentLoaded", () => {

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
});