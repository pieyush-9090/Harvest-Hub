// Cart functionality
class ShoppingCart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem('cart')) || [];
      this.updateCartDisplay();
    }
  
    addItem(id, name, price, image, category) {
      const existingItem = this.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          id,
          name,
          price,
          image,
          category,
          quantity: 1
        });
      }
      
      this.saveCart();
      this.updateCartDisplay();
      this.showNotification('Item added to cart');
    }
  
    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveCart();
      this.updateCartDisplay();
    }
  
    updateQuantity(id, quantity) {
      const item = this.items.find(item => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  
    clearCart() {
      this.items = [];
      this.saveCart();
      this.updateCartDisplay();
    }
  
    getTotal() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  
    getItemCount() {
      return this.items.reduce((count, item) => count + item.quantity, 0);
    }
  
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  
    updateCartDisplay() {
      // Update cart count in header
      const cartCount = document.querySelector('.cart-count');
      cartCount.textContent = this.getItemCount();
  
      // Update cart items display
      const cartItems = document.querySelector('.cart-items');
      if (!cartItems) return;
  
      if (this.items.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-basket"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="shop.html" class="btn primary-btn">Start Shopping</a>
          </div>
        `;
        return;
      }
  
      cartItems.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-category">${item.category}</p>
            <div class="item-price">Rs ${item.price}</div>
          </div>
          <div class="item-quantity">
            <button class="quantity-btn decrease"><i class="fas fa-minus"></i></button>
            <input type="number" value="${item.quantity}" min="1" max="99">
            <button class="quantity-btn increase"><i class="fas fa-plus"></i></button>
          </div>
          <div class="item-total">Rs ${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
        </div>
      `).join('');
  
      // Update cart summary
      const subtotal = this.getTotal();
      const shipping = 19; // Changed shipping to Rs 19
      const discountEl = document.querySelector('.discount span:last-child');
      const discount = discountEl ? parseFloat(discountEl.textContent.replace('-Rs ', '')) || 0 : 0;
      const total = subtotal + shipping - discount;
  
      const summaryRow = document.querySelector('.summary-row.subtotal span:last-child');
      if (summaryRow) {
        summaryRow.textContent = `Rs ${subtotal.toFixed(2)}`;
      }
  
      const shippingEl = document.querySelector('.summary-row.shipping span:last-child');
      if (shippingEl) {
        shippingEl.textContent = `Rs ${shipping.toFixed(2)}`;
      }
  
      const totalEl = document.querySelector('.total span:last-child');
      if (totalEl) {
        totalEl.textContent = `Rs ${total.toFixed(2)}`;
      }
  
      // Update cart header
      const cartHeader = document.querySelector('.cart-header h2');
      if (cartHeader) {
        cartHeader.textContent = `Shopping Cart (${this.getItemCount()} items)`;
      }
  
      // Add event listeners to new cart items
      this.addCartItemListeners();
    }
  
    addCartItemListeners() {
      // Quantity buttons
      document.querySelectorAll('.cart-item').forEach(item => {
        const id = item.dataset.id;
        const decreaseBtn = item.querySelector('.decrease');
        const increaseBtn = item.querySelector('.increase');
        const quantityInput = item.querySelector('input');
        const removeBtn = item.querySelector('.remove-item');
  
        decreaseBtn?.addEventListener('click', () => {
          const currentValue = parseInt(quantityInput.value);
          if (currentValue > 1) {
            this.updateQuantity(id, currentValue - 1);
          }
        });
  
        increaseBtn?.addEventListener('click', () => {
          const currentValue = parseInt(quantityInput.value);
          this.updateQuantity(id, currentValue + 1);
        });
  
        quantityInput?.addEventListener('change', (e) => {
          const value = parseInt(e.target.value);
          if (value >= 1) {
            this.updateQuantity(id, value);
          }
        });
  
        removeBtn?.addEventListener('click', () => {
          this.removeItem(id);
        });
      });
    }
  
    showNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      
      // Style the notification
      Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#2a5c39',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s ease',
        zIndex: '9999'
      });
      
      document.body.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
      }, 100);
      
      // Hide notification
      setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }
  }
  
  // Initialize cart
  const cart = new ShoppingCart();
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const product = button.closest('.product-card');
      const id = product.dataset.id || Math.random().toString(36).substr(2, 9);
      const name = product.querySelector('h3').textContent;
      const price = parseFloat(product.querySelector('.product-price').textContent.replace('Rs ', ''));
      const category = product.querySelector('.product-category')?.textContent || '';
      const image = product.querySelector('img').src;
  
      cart.addItem(id, name, price, image, category);
  
      // Add animation
      product.style.transform = 'scale(1.05)';
      setTimeout(() => {
        product.style.transform = '';
      }, 200);
    });
  });
  
  // Clear cart button
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  clearCartBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      cart.clearCart();
    }
  });
  
  // Apply coupon button
  const applyCouponBtn = document.querySelector('.coupon-section .primary-btn');
  const couponInput = document.querySelector('.coupon-section input');
  
  applyCouponBtn?.addEventListener('click', () => {
    const couponCode = couponInput.value.trim();
    
    if (couponCode === '') {
      cart.showNotification('Please enter a coupon code');
      return;
    }
    
    if (couponCode.toLowerCase() === 'harvest20') {
      const discountEl = document.querySelector('.discount span:last-child');
      const subtotal = cart.getTotal();
      const discount = (subtotal * 0.2).toFixed(2);
      
      if (discountEl) {
        discountEl.textContent = `-Rs ${discount}`;
        cart.updateCartDisplay();
      }
      
      cart.showNotification('Coupon applied successfully! 20% discount');
      
      if (couponInput && applyCouponBtn) {
        couponInput.disabled = true;
        applyCouponBtn.disabled = true;
        applyCouponBtn.textContent = 'Applied';
        applyCouponBtn.style.backgroundColor = '#888';
      }
    } else {
      cart.showNotification('Invalid coupon code');
    }
  });
  
  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  checkoutBtn?.addEventListener('click', () => {
    cart.showNotification('Proceeding to checkout...');
     setTimeout(() => {
       window.location.href = 'checkout.html';
     }, 1000);
  });
  // Add this function at the end of cart.js

  document.querySelector('.checkout-btn').addEventListener('click', async () => {
    const userId = localStorage.getItem('user_id'); // Assume user ID is stored in local storage after login
    if (!userId) {
      alert('Please log in before proceeding to checkout.');
      return;
    }
  
    // Retrieve cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const formattedItems = cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })); // Extract name, price, and quantity
  
    // Calculate total price using ShoppingCart's getTotal method
    //const total = cart.getTotal(); // Assuming getTotal() calculates total price
  
    // Check if cart is empty
    if (formattedItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
  
    // console.log('Checkout Data:', { user_id: userId, items: formattedItems, total }); // Debugging log
  
    // try {
    //   // Send cart data to the backend
    //   const response = await fetch('/checkout', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ user_id: userId, items: formattedItems, total }),
    //   });
  
    //   const result = await response.json();
    //   if (response.ok) {
    //     alert(result.message);
    //     cart.clearCart(); // Clear cart after successful checkout
    //     window.location.href = '/profile.html'; // Redirect to profile page
    //   } else {
    //     alert(result.error || 'Failed to place order.');
    //   }
    // } catch (error) {
    //   console.error('Error during checkout:', error);
    // }
  });
  
  
  