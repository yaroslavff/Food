function tabs(tabsMenuSelector, tabsSelector, tabsContentSelector, activeClass) {

  const tabsMenu = document.querySelector(tabsMenuSelector);
  const tabs = tabsMenu.querySelectorAll(tabsSelector);
  const tabsContent = document.querySelectorAll(tabsContentSelector);

  function hideTabsContent() {
      tabsContent.forEach(item => {
        item.classList.add("hide");
      });

      tabs.forEach(item => {
        item.classList.remove(activeClass);
      });
  }

  function showTab(i) {
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add(activeClass);
  }

  hideTabsContent();
  showTab(0);

  tabsMenu.addEventListener("click", (e) => {
    if(e.target && e.target.classList.contains(tabsSelector.slice(1))) {
      tabs.forEach((item, i) => {
        if(e.target == item) {
          hideTabsContent();
          showTab(i);
        }
      });
    }
  });
}

export default tabs;