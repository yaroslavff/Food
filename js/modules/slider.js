function slider({container, slidesArray, currCounter, maxCounter, prevArrow, nextArrow, wrapper, slideField}) {
  // slider

  // settings
  const slider = document.querySelector(container);
  const slides = document.querySelectorAll(slidesArray);
  const currentSlideCounter = document.querySelector(currCounter);
  const totalSlideCounter = document.querySelector(maxCounter);
  const prevSlide = document.querySelector(prevArrow);
  const nextSlide = document.querySelector(nextArrow);
  const slidesWrapper = document.querySelector(wrapper);
  const slidesField = document.querySelector(slideField);


  const width = window.getComputedStyle(slidesWrapper).width;
  const sliderNav = document.createElement("ul");
  let current = 1;
  let offset = 0;
  let dots = [];

  function getZero(n) {
    if(n < 10) {
      return `0${n}`;
    } else {
      return n;
    }
  }

  totalSlideCounter.textContent = getZero(slides.length);
  currentSlideCounter.textContent = getZero(current);

  slider.style.position = "relative";
  sliderNav.classList.add("carousel-indicators");

  slider.append(sliderNav);
  
  slidesField.style.cssText = `
    width: ${100 * slides.length}%;
    display: flex;
    transition: 0.5s all;
  `;

  slidesWrapper.style.overflow = "hidden";
  slides.forEach(slide => {
    slide.style.width = width;
  });

  nextSlide.addEventListener("click", () => {
    if(offset === deleteNotDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNotDigits(width);
    }
    
    current++;

    showSlide(current, offset);
  });

  prevSlide.addEventListener("click", () => {
    if(offset === 0) {
      offset = deleteNotDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNotDigits(width);
    }

    current--;

    showSlide(current, offset);
  });

  for(let i = 0; i < slides.length; i++) {
    dots[i] = document.createElement("li");
  }

  dots.forEach((slideBtn, i) => {
    slideBtn.id = `slide${i}`;
    slideBtn.classList.add("dot");
    sliderNav.append(slideBtn);
    slideBtn.addEventListener("click", (e) => {
      if(e.target && e.target.id === `slide${i}`) {
        selectSlideForNav(i)
      }
    });
  });

  function showSlide(n, offset) {
    if(n < 1) {
      current = slides.length;
    } if(n > slides.length) {
      current = 1;
    }
      
    getCurrentSlide(current);
    slidesField.style.transform = `translateX(-${offset}px)`;
  }
  
  function getCurrentSlide(curr) {
    dots.forEach(dot => dot.style.opacity = 0.5);
    dots[curr - 1].style.opacity = 1;
    currentSlideCounter.textContent = getZero(curr);
  }

  function selectSlideForNav(i) {
    offset = width.slice(0, -2) * i++;
    current = i++;

    showSlide(current, offset);
  }

  function deleteNotDigits(string) {
    return +string.replace(/\D/g, '');
  }

  showSlide(current, offset);
}

export default slider;