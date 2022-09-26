const buy = () => {
  alert('Поздравляем, Вы Д О Л Б О Ё Б!!!')
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
          this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
          this.totalPrice = this.totalPrice.toFixed(2)
          this.render(this.products)
        };
      })
    }

    makeElement = (tagName, className, text) => {
      let element = document.createElement(tagName);
      element.classList.add(className);
      if (text) {
        element.textContent = text;
      }
      return element;
    };  

    deleteProduct = () => {
      const product = event.target.closest('.shopcart__item')
      this.products.some(element => {
        if (element.id === product.dataset.id) {
          this.totalPriceHidden -= element.price * element.count
          this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
          this.totalPrice = this.totalPrice.toFixed(2)
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
          this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
          this.totalPrice = this.totalPrice.toFixed(2)
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
          this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
          this.totalPrice = this.totalPrice.toFixed(2)
        }
        if (element.count <= 0) {
          this.products = this.products.filter(n => n.id !== product.dataset.id);
        }
      })
      this.render(this.products)
    }

    createCard = (product) => {
      let shopcartItem = this.makeElement('div', 'shopcart__item')
      shopcartItem.dataset['id'] = product.id

      let shopcartImg = this.makeElement('img', 'shopcart__item-img')
      shopcartImg.src = product.img
      shopcartItem.append(shopcartImg);

      let shopcartDesc = this.makeElement('p', 'shopcart__item-desc', product.description)
      shopcartItem.append(shopcartDesc);
      
      let shopcartItemQu = this.makeElement('div', 'shopcart__item-quantity-cntrl')
  
      let minusButton = this.makeElement('button', 'shopcart__item-btn-minus', '-')
      minusButton.addEventListener("click", this.minusCount, false);
      shopcartItemQu.append(minusButton)

      let shopQuantity = this.makeElement('span', 'shopcart__item-quantity', `Количество: ${product.count}`)
      shopcartItemQu.append(shopQuantity)
      
      let plusButton = this.makeElement('button', 'shopcart__item-btn-plus', '+')
      plusButton.addEventListener("click", this.addCount, false);
      shopcartItemQu.append(plusButton)

      let cancelButton = this.makeElement('button', 'shopcart__item-delete', 'X')
      cancelButton.addEventListener("click", this.deleteProduct, false);
      shopcartItemQu.append(cancelButton)

      let price = this.makeElement('span', 'shopcart__item-price', `Цена: ${product.price * product.count} ₽`)
      shopcartItemQu.append(price)
      shopcartItem.append(shopcartItemQu)

      return shopcartItem;
    };

    render = (prod) => {
      this.deleteItems()
      const shopcartMain = document.querySelector('.shopcart__itemlist')
      const shopcartTotalPrice = document.querySelector('.shopcart__price-overall')
      shopcartTotalPrice.textContent = `Всего: ${this.totalPrice} ₽`
      for (let i = 0; i < prod.length; i++) {
        let cartItem = this.createCard(prod[i])
        shopcartMain.append(cartItem)
      }
    };
    
    addProduct = () => {
      document.onclick = (event) => {
        if (event.target.classList.contains('product__buy-button')){
              const product = (event.target.closest('.product'))
              const isFound = this.products.some(element => {
                if (element.id === product.dataset.id) {
                  element.count += 1
                  this.totalPriceHidden += element.price
                  this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
                  this.totalPrice = this.totalPrice.toFixed(2)
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
                this.totalPrice = this.totalPriceHidden / 100 * this.discountHidden
                this.totalPrice = this.totalPrice.toFixed(2)
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
