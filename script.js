// --------------------------------------------------------- Carousel Section
const carouselTrack = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
let currentIndex = 0;

// ---------------------------------Function to update the active image and animate the sliding effect
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

// ------------------------------------Function to move the carousel to the left
function moveCarousel() {
  currentIndex = (currentIndex + 1) % slides.length;
  const offset = currentIndex * -100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
  updateActiveImage();
}

updateActiveImage();
setInterval(moveCarousel, 3000);

// --------------------------------------------------------- Fetch Product Data Section
const productsList = document.getElementById('products-list');

// --------------------------Function to fetch product data from the API
const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');  // Fetch from API
    const products = await response.json();

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-card');
    
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description" style="display: none;">${product.description}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      `;

      const productImage = productDiv.querySelector('.product-image');
      const productDescription = productDiv.querySelector('.product-description');
      productImage.addEventListener('click', () => {
        const isVisible = productDescription.style.display === 'block';
        productDescription.style.display = isVisible ? 'none' : 'block';
      });

      const addToCartButton = productDiv.querySelector('.add-to-cart');
      addToCartButton.addEventListener('click', () => addToCart(product)); 

      productsList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    productsList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
  }
};

// --------------------------------------------------------- Add to Cart Functionality Section
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

// --------------------------------------------------------- Display Cart Section
function displayCart() {
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-btn');
  
  const cart = JSON.parse(localStorage.getItem('cart')) || []; 
  
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
  checkoutButton.style.display = cart.length > 0 ? 'block' : 'none';

  // Reattach event listeners after re-rendering cart items
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', removeFromCart); 
  });

  document.querySelectorAll('.cart-quantity').forEach(input => {
    input.addEventListener('change', updateQuantity); 
  });
}

// --------------------------------------------------------- Remove Item from Cart Section
function removeFromCart(event) {
  const index = event.target.getAttribute('data-index');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  cart.splice(index, 1); 

  
  localStorage.setItem('cart', JSON.stringify(cart)); 

  displayCart(); 
}

// --------------------------------------------------------- Update Cart Quantity Section
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

// --------------------------------------------------------- Checkout Section
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert("Cart is empty.");
  } else {
    alert("Sure ka na?");
   
    localStorage.removeItem('cart'); 
    displayCart();  
  }
}

const checkoutButton = document.getElementById('checkout-btn');
if (checkoutButton) {
  checkoutButton.addEventListener('click', checkout); 
}

// --------------------------------------------------------- Initialize and Fetch Products
fetchProducts();

// --------------------------------------------------------- Display Cart on Cart Page
if (document.getElementById('cart-list')) {
  displayCart(); 
}
