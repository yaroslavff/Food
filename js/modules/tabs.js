function tabs() {
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
}

module.exports = tabs;