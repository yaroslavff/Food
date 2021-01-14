function slider({allSlides, nextArrow, prevArrow, currentCounter, totalCounter}) {
    const slides = document.querySelectorAll(allSlides),
          next = document.querySelector(nextArrow),
          prev = document.querySelector(prevArrow),
          current = document.querySelector(currentCounter),
          total = document.querySelector(totalCounter);
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
        
        if (slideCounter < 10) {
            current.textContent = `0${slideCounter}`;
        } else {
            current.textContent = slideCounter;
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

export default slider;