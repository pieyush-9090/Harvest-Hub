// Checkout page specific JavaScript

// Delivery option selection
const deliveryOptions = document.querySelectorAll('.delivery-option input');
const shippingCost = document.getElementById('shipping-cost');
const totalAmount = document.getElementById('total-amount');

// Calculate initial total
let subtotal = 0;
let discount = 0;
let tax = 0;
let shipping = 19; // Default shipping cost

function updateTotal() {
    // Get current subtotal from localStorage or calculate it
    const subtotal = cart.getTotal() || 0;
    
    // Calculate GST (18% of subtotal)
    const tax = subtotal * 0.18;
    
    // Get discount if any
    const discountEl = document.querySelector('.discount span:last-child');
    const discount = discountEl ? parseFloat(discountEl.textContent.replace('Rs ', '')) || 0 : 0;
    
    // Calculate total by ADDING components, not replacing
    const total = subtotal + shipping + tax - discount;
    
    // Update the total display
    totalAmount.textContent = `Rs ${total.toFixed(2)}`;
}


// Update shipping cost and total when delivery option changes
deliveryOptions.forEach(option => {
    option.addEventListener('change', () => {
        const value = option.value;
        
        if (value === 'standard') {
            shipping = 19;
        } else if (value === 'express') {
            shipping = 99;
        } else if (value === 'same-day') {
            shipping = 199;
        }
        
        shippingCost.textContent = `Rs ${shipping}`;
        updateTotal();
    });
});

// Payment method selection
const paymentMethods = document.querySelectorAll('.payment-method input');
const creditCardForm = document.getElementById('credit-card-form');
const upiForm = document.getElementById('upi-form');
const netbankingForm = document.getElementById('netbanking-form');

paymentMethods.forEach(method => {
    method.addEventListener('change', () => {
        const value = method.value;
        localStorage.setItem('paymentMethod', value);

        // Hide all payment forms first
        creditCardForm.style.display = 'none';
        upiForm.style.display = 'none';
        netbankingForm.style.display = 'none';

        // Show the selected payment form
        if (value === 'credit-card') {
            creditCardForm.style.display = 'block';
        } else if (value === 'upi') {
            upiForm.style.display = 'block';
        } else if (value === 'netbanking') {
            netbankingForm.style.display = 'block';
        }
    });
});

// Form validation
const placeOrderBtn = document.querySelector('.place-order-btn');

placeOrderBtn.addEventListener('click', () => {
    // Get the selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    
    // Define which fields to validate based on payment method
    let fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    
    if (selectedPayment === 'credit-card') {
        fieldsToValidate = [...fieldsToValidate, 'cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    } else if (selectedPayment === 'upi') {
        fieldsToValidate = [...fieldsToValidate, 'upiId'];
    } else if (selectedPayment === 'netbanking') {
        fieldsToValidate = [...fieldsToValidate, 'bankName'];
    }
    
    // Check if all required fields are filled
    let isValid = true;
    let firstInvalidField = null;
    
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else if (field) {
            field.style.borderColor = '';
        }
    });
    
    if (isValid) {
        // Show loading state
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate order processing
        setTimeout(() => {
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        }, 2000);
    } else {
        showNotification('Please fill in all required fields', true);
        
        // Scroll to the first invalid field
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
    }
});

// Promo code functionality
const promoCodeInput = document.querySelector('.promo-code input');
const promoCodeBtn = document.querySelector('.promo-code .btn');
const discountElement = document.querySelector('.discount span:last-child');

promoCodeBtn.addEventListener('click', () => {
    const promoCode = promoCodeInput.value.trim();
    
    if (promoCode === '') {
        showNotification('Please enter a promo code', true);
        return;
    }
    // Check if promo code is valid
    if (promoCode.toLowerCase() === 'harvest20') {
        // Apply 20% discount
        discount = Math.round(subtotal * 0.2);
        discountElement.textContent = `-Rs ${discount}`;
        updateTotal();
        
        showNotification('Promo code applied successfully! 20% discount');
        
        // Disable the promo code input and button
        promoCodeInput.disabled = true;
        promoCodeBtn.disabled = true;
        promoCodeBtn.textContent = 'Applied';
        promoCodeBtn.style.backgroundColor = '#888';
    } else {
        showNotification('Invalid promo code', true);
    }
});

// Credit card input formatting
const cardNumberInput = document.getElementById('cardNumber');
const expiryDateInput = document.getElementById('expiryDate');
const cvvInput = document.getElementById('cvv');

// Format card number with spaces
cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
});

// Format expiry date with slash
expiryDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        formattedValue = value.substring(0, 2);
        if (value.length > 2) {
            formattedValue += '/' + value.substring(2, 4);
        }
    }
    
    e.target.value = formattedValue;
});

// Limit CVV to 3-4 digits
cvvInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    e.target.value = value.substring(0, 4);
});

// Custom notification function
function showNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        notification.style.zIndex = '9999';
    }
    
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    
    // Set color based on error status
    if (isError) {
        notification.style.backgroundColor = '#e74c3c';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
    }
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show credit card form by default
    creditCardForm.style.display = 'block';
    upiForm.style.display = 'none';
    netbankingForm.style.display = 'none';
    
    // Set initial values
    shippingCost.textContent = `Rs ${shipping}`;
    updateTotal();
});

// Load cart items from localStorage
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryItemsContainer = document.querySelector('.summary-items');
    
    if (cartItems.length === 0) {
        // Redirect to cart page if cart is empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Clear existing items
    summaryItemsContainer.innerHTML = '';
    
    // Add each item to the summary
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">Rs ${item.price} <span>/ unit</span></p>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <div class="item-total">Rs ${(item.price * item.quantity).toFixed(2)}</div>
        `;
        summaryItemsContainer.appendChild(itemElement);
    });
    
    // Calculate and update totals
    updateOrderSummary(cartItems);
}

// Calculate and update order summary totals
function updateOrderSummary(cartItems) {
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get shipping cost
    const shippingCostElement = document.getElementById('shipping-cost');
    const shipping = parseFloat(shippingCostElement.textContent.replace('Rs ', ''));
    
    // Calculate tax (18% of subtotal)
    const tax = subtotal * 0.18;
    
    // Get discount
    const discountElement = document.querySelector('.discount span:last-child');
    const discount = parseFloat(discountElement.textContent.replace('-Rs ', '')) || 0;
    
    // Calculate total
    const total = subtotal + shipping + tax - discount;
    // localStorage.setItem('totalPrice', total);
    // Update the DOM
    document.querySelector('.subtotal span:last-child').textContent = `Rs ${subtotal.toFixed(2)}`;
    document.querySelector('.tax span:last-child').textContent = `Rs ${tax.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `Rs ${total.toFixed(2)}`;
}

// Apply promo code functionality
function setupPromoCode() {
    const promoCodeInput = document.querySelector('.promo-code input');
    const promoCodeBtn = document.querySelector('.promo-code .btn');
    const discountElement = document.querySelector('.discount span:last-child');
    
    promoCodeBtn.addEventListener('click', () => {
        const promoCode = promoCodeInput.value.trim();
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (promoCode === '') {
            showNotification('Please enter a promo code', true);
            return;
        }
        
        // Check if promo code is valid
        if (promoCode.toLowerCase() === 'harvest20') {
            // Apply 20% discount
            const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const discount = Math.round(subtotal * 0.2);
            discountElement.textContent = `-Rs ${discount}`;
            
            // Update total
            updateOrderSummary(cartItems);
            
            showNotification('Promo code applied successfully! 20% discount');
            
            // Disable the promo code input and button
            promoCodeInput.disabled = true;
            promoCodeBtn.disabled = true;
            promoCodeBtn.textContent = 'Applied';
            promoCodeBtn.style.backgroundColor = '#888';
        } else {
            showNotification('Invalid promo code', true);
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    setupPromoCode();
    
    // Place order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    placeOrderBtn.addEventListener('click', () => {
        // Form validation and order processing code...
        
        // Clear cart after successful order
        if (formIsValid) {
            localStorage.removeItem('cart');
        }
    });
});
document.querySelector('.place-order-btn').addEventListener('click', async () => {
    const userId = localStorage.getItem('user_id'); // Assume user ID is stored in local storage after login
    // if (!userId) {
    //   alert('Please log in before proceeding to checkout.');
    //   return;
    // }
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    // Define which fields to validate based on payment method
    let fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];

    if (selectedPayment === 'credit-card') {
        fieldsToValidate = [...fieldsToValidate, 'cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    } else if (selectedPayment === 'upi') {
        fieldsToValidate = [...fieldsToValidate, 'upiId'];
    } else if (selectedPayment === 'netbanking') {
        fieldsToValidate = [...fieldsToValidate, 'bankName'];
    }

    // Check if all required fields are filled
    let isValid = true;
    let firstInvalidField = null;
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else if (field) {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', true);

        // Scroll to the first invalid field
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        return; // Exit the function if form is invalid
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
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate GST (18% of subtotal)
    const tax = subtotal * 0.18;
    
    // Get shipping cost
    const shippingCostElement = document.getElementById('shipping-cost');
    const shipping = parseFloat(shippingCostElement.textContent.replace('Rs ', ''));
    
    // Get discount if any
    const discountElement = document.querySelector('.discount span:last-child');
    const discount = parseFloat(discountElement.textContent.replace('-Rs ', '')) || 0;
    
    // Calculate final total including GST, shipping, and discount
    const total = subtotal + tax + shipping - discount;
    localStorage.setItem('totalPrice', total);
    const addressStore = {
        street: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pinCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value
    };
    localStorage.setItem('shippingAddress', JSON.stringify(addressStore));
    // Check if cart is empty
    // if (formattedItems.length === 0) {
    //   alert('Your cart is empty!');
    //   return;
    // }
  
    console.log('Checkout Data:', { user_id: userId, items: formattedItems, total }); // Debugging log
  
    try {
      // Send cart data to the backend
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, items: formattedItems, total }),
      });
  
      const result = await response.json();
      if (response.ok) {
        //alert(result.message);
        //cart.clearCart(); // Clear cart after successful checkout
        //window.location.href = '/profile.html'; // Redirect to profile page
      } else {
        alert(result.error || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  });
