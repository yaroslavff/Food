function forms() {
    const allForms = document.querySelectorAll('form');

    allForms.forEach(item => {
        bindPostData(item);
    });

    const message = {
        loading: 'img/form/spinner.svg',
        succsess: 'Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так :('
    };

    const postData = async function(url, data) {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await response.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block; 
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            let json = JSON.stringify(Object.fromEntries(formData.entries()));
            dontLoopSubmit(true);

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.succsess);
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
                statusMessage.remove();
                dontLoopSubmit(false);
            });
        });
    }

    const submitBtn = document.querySelectorAll('.btn__submit');
    function dontLoopSubmit(boolean) {
        if(boolean == true) {
            submitBtn.forEach(item => {
                item.setAttribute('disabled', 'true');
            });
        } else {
            submitBtn.forEach(item => {
                item.removeAttribute('disabled', 'true');
            });
        }
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        prevModal.classList.remove('show');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModal.classList.remove('hide');
            prevModal.classList.add('show');
            closeModal();
        }, 4000);
    }
}

module.exports = forms;