function calc() {
    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        weight, height, age,
        ratio = 1.375;

    function calcResult() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '_____';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcResult();

    function calcStaticInfo(parentSelector, active) {
        let elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

                elements.forEach(element => {
                    element.classList.remove(active);
                });

                e.target.classList.add(active);

                calcResult();
            });
        });
    }

    calcStaticInfo('#gender', 'calculating__choose-item_active');
    calcStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function calcDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    console.log(age);
                    break;
            }

            calcResult();
        });
    }

    calcDynamicInfo('#height');
    calcDynamicInfo('#weight');
    calcDynamicInfo('#age');
}

module.exports = calc;