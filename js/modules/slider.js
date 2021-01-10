function slider() {
    const slides = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total');
    let slideCounter = 1;

    showSlide(slideCounter);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlide(n = 1) {
        if (n > slides.length) {
            slideCounter = 1;
        }

        if (n < 1) {
            slideCounter = slides.length;
        }

        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        slides[slideCounter - 1].style.display = 'block';
        slides[slideCounter - 1].classList.add('fade');
        
        if (slides.length < 10) {
            current.textContent = `0${slideCounter}`;
        } else {
            total.textContent = slideCounter;
        }
    }

    function plusSlide(n) {
        showSlide(slideCounter += n);
    }

    next.addEventListener('click', () => {
        plusSlide(1);
    });

    prev.addEventListener('click', () => {
        plusSlide(-1);
    });
}

module.exports = slider;