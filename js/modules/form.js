import {showModal, hideModal} from './modal';
import {postData} from '../services/services';

function form(formSelector, modalTimeout) {
  // Form

  const form = document.querySelectorAll(formSelector);
  const messages = {
    succsess: "Спасибо, скоро мы с вами свяжемся!",
    loading: "img/form/spinner.svg",
    error: "Что-то пошло не так...("
  };

  form.forEach(item => {
    bindPostData(item);
  });

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

      postData("http://localhost:3000/requests", json)
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
    showModal(".modal", modalTimeout);

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;
    document.querySelector(".modal").append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModal.classList.add("show");
      prevModal.classList.remove("hide");
      hideModal(".modal");
    }, 4000);
  }
}

export default form;