function cards() {
    class MenuCard {
        constructor(src, alt, title, descr, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 73;
            this.changeToRUB();
            this.parent = document.querySelector(parent);
        }

        changeToRUB() {
            this.price = +this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.class = 'menu__item';
                element.classList.add(this.class);
            } else {
                this.classes.forEach(className => element.classList.add(className));   
            }
            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
            </div>
            `;
            if (Boolean(this.parent) === false) {
                this.parent = document.querySelector('.menu .container');
            }
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
    .then((data) => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price).render();
        });
    })
    .catch(() => {
        console.log('Error 404');
    });

    async function getResource(url) {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`server ${url}: Error ${res.status}`);
        }

       return await res.json();
    }
}

export default cards;