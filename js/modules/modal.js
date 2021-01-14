function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.querySelector('.modal-form').reset();
    document.body.style.overflow = '';
}

function openModal(modalSelector, modalInterval) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    if (modalInterval) {
        clearInterval(modalInterval);
    }
}

function modal(modalBtnSelector, modalSelector) {
    const modalBtn = document.querySelectorAll(modalBtnSelector),
          modal = document.querySelector(modalSelector);

    modalBtn.forEach(button => {
        button.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', event => {
        if (event.target && event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    const modalInterval = setInterval(() => openModal(modalSelector, modalInterval), 30000);
}

export default modal;
export {openModal, closeModal};