const buy = () => {
  alert('Поздравляем с покупкой!')
}

class ShopCart{
    constructor() {
        this.products = [];
        this.discount = 0
        this.discountHidden = 100 - this.discount
        this.totalPriceHidden = 0
        this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
    };
    
    deleteItems = () => {
      const deleteElements = document.querySelector(".shopcart__itemlist");
      deleteElements.innerHTML = "";
    }

    discountCount = () => {
      this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
      this.totalPrice = this.totalPrice.toFixed(2)
    }

    validation = () => {
      const inputForm = document.querySelector(".shopcart__discount")
      inputForm.addEventListener('input', () => {   
        console.log('input detect')
        if (inputForm.validity.patternMismatch) {
          inputForm.setCustomValidity("Введите число");
        } 
        else {inputForm.setCustomValidity("");}
      })
    }

    takeDiscount = () => {
      const button = document.querySelector(".shopcart__discount-btn")
      button.addEventListener('click', () => {
        const inputValue = Number(document.querySelector(".shopcart__discount").value);
        const currentDiscount = document.querySelector(".shopcart__discount-current");
        const isInt = Number.isInteger(Number(inputValue))
        if (isInt && inputValue < 100) {
          this.discount = inputValue
          this.discountHidden = 100 - this.discount
          currentDiscount.textContent = `Текущая скидка: ${this.discount}%`
          this.discountCount()
          this.render(this.products)
        };
      })
    }

    deleteProduct = () => {
      const product = event.target.closest('.shopcart__item')
      this.products.some(element => {
        if (element.id === product.dataset.id) {
          this.totalPriceHidden -= element.price * element.count
          this.discountCount()
        }
      })
      this.products = this.products.filter(n => n.id !== product.dataset.id);
      this.render(this.products)
    }

    addCount = () => {
      const product = event.target.closest('.shopcart__item')
      this.products.some(element => {
        if (element.id === product.dataset.id) {
          element.count += 1
          this.totalPriceHidden += element.price
          this.discountCount()
        }
      })
      this.render(this.products)
    }

    minusCount = () => {
      const product = event.target.closest('.shopcart__item')
      this.products.some(element => {
        if (element.id === product.dataset.id) {
          element.count -= 1
          this.totalPriceHidden -= element.price
          this.discountCount()
        }
        if (element.count <= 0) {
          this.products = this.products.filter(n => n.id !== product.dataset.id);
        }
      })
      this.render(this.products)
    }

    createCard = (product) => {
      const shopcart = document.querySelector(".shopcart__itemlist")
      const template = `
      <div id="${product.id}" class="shopcart__item" data-id="${product.id}">
        <img class="shopcart__item-img" src="${product.img}">
          <p class="shopcart__item-desc">${product.description}</p>
          <div class="shopcart__item-quantity-cntrl">
            <button class="shopcart__item-btn-minus">-</button>
            <span class="shopcart__item-quantity">Количество: ${product.count}</span>
            <button class="shopcart__item-btn-plus">+</button>
            <button class="shopcart__item-delete">X</button>
            <span class="shopcart__item-price">Цена: ${product.price * product.count} ₽</span>
          </div>
      </div>`

      shopcart.insertAdjacentHTML('beforeend', template);

      const card = document.getElementById(`${product.id}`)

      let minusButton = card.querySelector('.shopcart__item-btn-minus')
      minusButton.addEventListener("click", this.minusCount, false);

      let plusButton = card.querySelector('.shopcart__item-btn-plus')
      plusButton.addEventListener("click", this.addCount, false);

      let deleteButton = card.querySelector('.shopcart__item-delete')
      deleteButton.addEventListener("click", this.deleteProduct, false);
    };

    render = (prod) => {
      this.deleteItems()
      const shopcartTotalPrice = document.querySelector('.shopcart__price-overall')
      shopcartTotalPrice.textContent = `Всего: ${this.totalPrice} ₽`
      prod.forEach(element => this.createCard(element))
    };

    addProduct = () => {
      document.onclick = (event) => {
        if (event.target.classList.contains('product__buy-button')){
              const product = (event.target.closest('.product'))
              const isFound = this.products.some(element => {
                if (element.id === product.dataset.id) {
                  element.count += 1
                  this.totalPriceHidden += element.price
                  this.discountCount()
                  return true
                }
                return false
              });
              if (!isFound) {
                let productObj = {
                  id: product.dataset.id,
                  description: product.querySelector('.product__description').textContent,
                  price: Number(product.querySelector('.product__price').textContent.slice(0, -1)),
                  count: 1,
                  img: product.querySelector('.product__img').src
                }
                this.totalPriceHidden += productObj.price * productObj.count
                this.discountCount()
                this.products.push(productObj)
              }
            this.render(this.products)
            }
        }
    };
    
};

let cart = new ShopCart()
cart.validation();
cart.takeDiscount();
cart.addProduct();
