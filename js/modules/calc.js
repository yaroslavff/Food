function calc() {
  // Calc

  const result = document.querySelector(".calculating__result span");
  let sex, height, weight, age, activity, total;

  if(localStorage.getItem("sex")) {
    sex = localStorage.sex;
  } else {
    sex = "woman";
    localStorage.setItem("sex", sex);
  }
  
  if(localStorage.getItem("activity")) {
    activity = localStorage.activity;
  } else {
    activity = 1.375;
    localStorage.setItem("activity", activity);
  }

  function calcTotal() {
    if(sex === "man") {
      total = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * activity);
    } else {
      total = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * activity);
    }

    if(!height || !weight || !age || !activity) {
      result.textContent = "______";
    } else {
      result.textContent = total;
    }

  }

  function getStaticProps(parent) {
    const elements = document.querySelectorAll(`${parent} div`);

    elements.forEach(item => {
      item.classList.remove("calculating__choose-item_active");

      if(localStorage.sex == item.id) {
        item.classList.add("calculating__choose-item_active");
      } if(localStorage.activity == item.dataset.ratio) {
        item.classList.add("calculating__choose-item_active");
      }
    });

    document.querySelector(parent).addEventListener("click", e => {
      if(e.target.classList.contains("calculating__choose-item")) {
        if(e.target.dataset.ratio) {
          activity = +e.target.dataset.ratio;
          localStorage.setItem("activity", +e.target.dataset.ratio);
        } else {
          sex = e.target.id;
          localStorage.setItem("sex", e.target.id);
        }

        elements.forEach(item => {
          item.classList.remove("calculating__choose-item_active");

          if(e.target == item) {
            item.classList.add("calculating__choose-item_active");
          }
        });
      }

      calcTotal();
    });
  }

  function getInputProps(parent) {
    const input = document.querySelector(parent);

    input.addEventListener("input", () => {

      if(!!input.value.match(/\D/g)) {
        input.style.border = "1px solid red";
      } else {
        input.style.border = "none";
      }


      switch(input.id) {
        case "height":
          height = +input.value;
          break;
        case "weight":
          weight = +input.value;
          break;
        case "age":
          age = +input.value;
          break;
      }

      calcTotal();
    });
  }
  getStaticProps("#gender");
  getStaticProps("#activity");

  getInputProps("#height");
  getInputProps("#weight");
  getInputProps("#age");

  calcTotal();
}

export default calc;