const carouselTrack = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
let currentIndex = 0;

// Function to update the active image and animate the sliding effect
function updateActiveImage() {
  slides.forEach((slide, index) => {
    const image = slide.querySelector('.carousel-image');
    if (index === currentIndex) {
      image.classList.add('active');
    } else {
      image.classList.remove('active');
    }
  });
}

// Function to move the carousel to the left
function moveCarousel() {
  currentIndex = (currentIndex + 1) % slides.length; 
  const offset = currentIndex * -100; 
  carouselTrack.style.transform = `translateX(${offset}%)`;
  updateActiveImage();
}


updateActiveImage(); 
setInterval(moveCarousel, 3000); 

// Fetch product data from the API and display it
const productsList = document.getElementById('products-list');

// Function to fetch products
const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    
    products.forEach(product => {
   
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-card'); 

      // Add product content (image, title, description, price, and "Add to Cart" button)
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">$${product.price}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      `;

      
      const addToCartButton = productDiv.querySelector('.add-to-cart');
      addToCartButton.addEventListener('click', () => addToCart(product));

     
      productsList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    productsList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
  }
};

// Function to handle the "Add to Cart" action
function addToCart(product) {
 
  const cart = JSON.parse(localStorage.getItem('cart')) || [];


  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex === -1) {
  
    cart.push({ ...product, quantity: 1 });
  } else {
    
    cart[existingProductIndex].quantity++;
  }


  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${product.title} added to your cart!`);
}

// Function to display cart items in the cart page
function displayCart() {
  const cartList = document.getElementById('cart-list');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTotal = document.getElementById('cart-total');
  
  cartList.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image">
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p>Price: $${item.price}</p>
        <input type="number" value="${item.quantity}" min="1" class="cart-quantity" data-index="${index}">
        <button class="remove-item" data-index="${index}">Remove</button>
      </div>
    `;

    cartList.appendChild(itemDiv);
  });

 
  cartTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;

 
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', removeFromCart);
  });

  document.querySelectorAll('.cart-quantity').forEach(input => {
    input.addEventListener('change', updateQuantity);
  });
}

// Function to remove item from the cart
function removeFromCart(event) {
  const index = event.target.getAttribute('data-index');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  cart.splice(index, 1); 

 
  localStorage.setItem('cart', JSON.stringify(cart));


  displayCart();
}

// Function to update the quantity of an item in the cart
function updateQuantity(event) {
  const index = event.target.getAttribute('data-index');
  const newQuantity = parseInt(event.target.value, 10);

  if (newQuantity > 0) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = newQuantity;

  
    localStorage.setItem('cart', JSON.stringify(cart));


    displayCart();
  }
}

fetchProducts();


if (document.getElementById('cart-list')) {
  displayCart();
}
// ----------------------------

