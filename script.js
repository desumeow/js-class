let products = []
let discount = 0
let discountHidden = 100 - discount
let totalPriceHidden = 0
let totalPrice = totalPriceHidden / 100 * discountHidden


const deleteItems = () => {
  const deleteElements = document.querySelector(".shopcart__itemlist");
  deleteElements.innerHTML = "";
}

const validation = () => {
  const inputForm = document.querySelector(".shopcart__discount")
  inputForm.addEventListener('input', () => {   
    console.log('input detect')
    if (inputForm.validity.patternMismatch) {
      inputForm.setCustomValidity("Введите число");
    } else {inputForm.setCustomValidity("");}
  })
}

const takeDiscount = () => {
  document.onclick = () => {
    if (event.target.classList.contains('shopcart__discount-btn')){
      console.log('button click')
      const inputValue = Number(document.querySelector(".shopcart__discount").value);
      const currentDiscount = document.querySelector(".shopcart__discount-current");
      const isInt = Number.isInteger(Number(inputValue))
      if (isInt && inputValue < 100) {
        discount = inputValue
        discountHidden = 100 - discount
        currentDiscount.textContent = `Текущая скидка: ${discount}%`
        totalPrice = totalPriceHidden / 100 * discountHidden
        totalPrice = totalPrice.toFixed(2)
        render(products)
      };
    }
}}

const makeElement = (tagName, className, text) => {
  let element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};  

const deleteProduct = () => {
  const product = event.target.closest('.shopcart__item')
  products.some(element => {
    if (element.id === product.dataset.id) {
      totalPriceHidden -= element.price * element.count
      totalPrice = totalPriceHidden / 100 * discountHidden
      totalPrice = totalPrice.toFixed(2)
    }})
  products = products.filter(n => n.id !== product.dataset.id);
  render(products)
}

const addCount = () => {
  const product = event.target.closest('.shopcart__item')
  products.some(element => {
    if (element.id === product.dataset.id) {
      element.count += 1
      totalPriceHidden += element.price
      totalPrice = totalPriceHidden / 100 * discountHidden
      totalPrice = totalPrice.toFixed(2)
    }})
  render(products)
}

const minusCount = () => {
  const product = event.target.closest('.shopcart__item')
  products.some(element => {
    if (element.id === product.dataset.id) {
      element.count -= 1
      totalPriceHidden -= element.price
      totalPrice = totalPriceHidden / 100 * discountHidden
      totalPrice = totalPrice.toFixed(2)
    }
    if (element.count <= 0) {
      products = products.filter(n => n.id !== product.dataset.id);
    }
  })
  render(products)
}

const createCard = (product) => {
  let shopcartItem = makeElement('div', 'shopcart__item')
  shopcartItem.dataset['id'] = product.id

  let shopcartImg = makeElement('img', 'shopcart__item-img')
  shopcartImg.src = product.img
  shopcartItem.append(shopcartImg);

  let shopcartDesc = makeElement('p', 'shopcart__item-desc', product.description)
  shopcartItem.append(shopcartDesc);

  let shopcartItemQu = makeElement('div', 'shopcart__item-quantity-cntrl')
  
  let minusButton = makeElement('button', 'shopcart__item-btn-minus', '-')
  minusButton.addEventListener("click", minusCount, false);
  shopcartItemQu.append(minusButton)

  let shopQuantity = makeElement('span', 'shopcart__item-quantity', `Количество: ${product.count}`)
  shopcartItemQu.append(shopQuantity)

  let plusButton = makeElement('button', 'shopcart__item-btn-plus', '+')
  plusButton.addEventListener("click", addCount, false);
  shopcartItemQu.append(plusButton)

  let cancelButton = makeElement('button', 'shopcart__item-delete', 'X')
  cancelButton.addEventListener("click", deleteProduct, false);
  shopcartItemQu.append(cancelButton)

  let price = makeElement('span', 'shopcart__item-price', `Цена: ${product.price * product.count} ₽`)
  shopcartItemQu.append(price)
  shopcartItem.append(shopcartItemQu)

  return shopcartItem;
};

const render = (prod) => {
  deleteItems()
  const shopcartMain = document.querySelector('.shopcart__itemlist')
  const shopcartTotalPrice = document.querySelector('.shopcart__price-overall')
  shopcartTotalPrice.textContent = `Всего: ${totalPrice} ₽`
  for (let i = 0; i < prod.length; i++) {
    let cartItem = createCard(prod[i])
    shopcartMain.append(cartItem)
  }
};

const addProduct = () => {
  const product = (event.target.closest('.product'))
  const isFound = products.some(element => {
    if (element.id === product.dataset.id) {
      element.count += 1
      totalPriceHidden += element.price
      totalPrice = totalPriceHidden / 100 * discountHidden
      totalPrice = totalPrice.toFixed(2)
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
    totalPriceHidden += productObj.price * productObj.count
    totalPrice = totalPriceHidden / 100 * discountHidden
    totalPrice = totalPrice.toFixed(2)
    products.push(productObj)
  }
  
  render(products);
};

const onPageReady = () => {
  validation();
  takeDiscount();
  addProduct();
}

onPageReady();


/*
class ShopCart {
    constructor() {
      this.reset()
      this.products = [];
      this.totalPriceHidden = 0

      const activeProduct = this.products.find(item => item.id === id);
     }

     addProduct() {
      document.onclick = (event) => {
        let productObj = {}
        if (event.target.classList.contains('product__buy-button')){
          const product = (event.target.closest('.product'))
          const isFound = this.products.some(element => {
            if (element.id === product.dataset.id) {
              element.count += 1
              return true
            }
            return false
          });
          if (!isFound) {
            productObj = {
              id: product.dataset.id,
              description: product.querySelector('.product__description').textContent,
              price: Number(product.querySelector('.product__price').textContent.slice(0, -1)),
              count: 1,
              img: product.querySelector('.product__img').src
            }
            this.products.push(productObj)
            this.totalPriceHidden += productObj.price * productObj.count
          }
          console.log(this.products)
        }
      }
     };

     render() {
      const shopcartMain = document.querySelector('.shopcart__itemlist')
      const makeElement = (tagName, className, text) =>{
        let element = document.createElement(tagName);
        element.classList.add(className);
        if (text) {
          element.textContent = text;
        }
        return element;
      };
      const createCard = (product) => {
        let shopcartItem = makeElement({
          tagName:'div', 
          className:'shopcart__item', 
          text: product.description})
        shopcartItem.setAttribute('id', product.id)

        let shopcartImg = makeElement('img', 'shopcart__item-img')
        shopcartImg.src = document.img
        shopcartItem.append(shopcartImg);

        let shopcartDesc = makeElement('p', 'shopcart__item-desc', product.description)
        shopcartItem.append(shopcartDesc);

        let shopcartItemQu = makeElement('div', 'shopcart__item-quantity-cntrl')
        
        let minusButton = makeElement('button', 'shopcart__item-btn-minus')
        shopcartItemQu.append(minusButton)
        let shopQuantity = makeElement('span', 'shopcart__item-quantity', `Количество: ${product.count}`)
        shopcartItemQu.append(shopQuantity)
        let plusButton = makeElement('button, shopcart__item-btn-plus')
        shopcartItemQu.append(plusButton)
        let price = makeElement('span', 'shopcart__item-price', `Цена: ${product.price * product.count} ₽`)
        shopcartItemQu.append(price)
        shopcartItem.append(shopcartItemQu)
      };
      for (let i = 0; i < this.products.length; i++) {
        let cartItem = createCard(this.products[i])
        shopcartMain.append(cartItem)
      }
     }

     reset() {
      objectFor(
        this,
        (key, value) => {
          delete this[key]
        }
      );
    };
}

let cart = new ShopCart
cart.addProduct()
cart.render()*/









/*
const addProduct = () => {
  document.onclick = (event) => {
  if (event.target.classList.contains('product__buy-button')){
    const product = (event.target.closest('.product'))
    const isFound = products.some(element => {
      if (element.id === product.dataset.id) {
        element.count += 1
        totalPriceHidden += element.price
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
      totalPriceHidden += productObj.price * productObj.count
      products.push(productObj)
    }
    render(products);
  }
}};*/
