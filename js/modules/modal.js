function hideModal(modalSelector) {
  const modal = document.querySelector(modalSelector);

  modal.classList.add("hide");
  modal.classList.remove("show");
  document.body.style.overflow = "visible";
  
  // document.removeEventListener("scroll", showModalByScroll);
}

function showModal(modalSelector, modalTimeout) {
  const modal = document.querySelector(modalSelector);

  modal.classList.add("show");
  modal.classList.remove("hide");
  document.body.style.overflow = "hidden";
  if (modalTimeout) {
    clearTimeout(modalTimeout);
  }
}

function modal(modalSelector, triggerSelector, modalTimeout) {
  // Modal

  const modal = document.querySelector(modalSelector);
  const modalBtn = document.querySelectorAll(triggerSelector);
  
  modalBtn.forEach(item => {
    item.addEventListener("click", ()=> showModal(modalSelector, modalTimeout));
  });

  modal.addEventListener("click", (e) => {
    if((e.target && e.target.getAttribute("data-close") == "") || e.target == modal) {
      hideModal(modalSelector);
    }
  });

  document.addEventListener("keyup", (e) => {
    if(e.code == "Escape" && modal.classList.contains("show")) {
      hideModal(modalSelector);
    }
  });

  window.addEventListener("scroll", showModalByScroll);

  function showModalByScroll() {
    if(document.documentElement.scrollHeight <= document.documentElement.clientHeight + window.pageYOffset) {
      showModal(modalSelector, modalTimeout);
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
}

export default modal;
export {showModal, hideModal};