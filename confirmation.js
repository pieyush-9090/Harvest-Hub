document.addEventListener('DOMContentLoaded', function () {
    // Retrieve address from localStorage
    const storedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
    const formattedAddress = `${storedAddress.street || ''}, ${storedAddress.city || ''}, ${storedAddress.state || ''}, ${storedAddress.pinCode || ''}, ${storedAddress.country || ''}`;
    document.querySelector('.delivery-address').textContent = formattedAddress;

    // Generate random 8-digit order ID
    const orderId = Math.floor(10000000 + Math.random() * 90000000);
    document.getElementById('order-id').textContent = orderId;

    // Set current date
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('order-date').textContent = currentDate.toLocaleDateString('en-US', options);

    // Calculate delivery date (4-6 days from current date)
    const deliveryStartDate = new Date(currentDate);
    deliveryStartDate.setDate(currentDate.getDate() + 4);
    const deliveryEndDate = new Date(currentDate);
    deliveryEndDate.setDate(currentDate.getDate() + 6);
    const deliveryStartFormatted = deliveryStartDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    const deliveryEndFormatted = deliveryEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    document.getElementById('delivery-date').textContent = `${deliveryStartFormatted} - ${deliveryEndFormatted}`;

    // Get total amount from localStorage
    const total = parseFloat(localStorage.getItem('totalPrice')) || 0;
    document.getElementById('total-amount').textContent = `Rs ${total.toFixed(2)}`;

    // Get payment method from localStorage
    let paymentMethod = 'Credit Card'; // Default value
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    if (storedPaymentMethod) {
        switch (storedPaymentMethod) {
            case 'credit-card':
                paymentMethod = 'Credit Card';
                break;
            case 'upi':
                paymentMethod = 'UPI';
                break;
            case 'netbanking':
                paymentMethod = 'Net Banking';
                break;
            case 'cod':
                paymentMethod = 'Cash on Delivery';
                break;
            default:
                paymentMethod = 'Credit Card';
        }
    }
    document.getElementById('payment-method').textContent = paymentMethod;

    // Clear the cart after successful order
    localStorage.removeItem('cart');
    localStorage.removeItem('discount');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('shippingAddress');
    document.querySelector('.cart-count').textContent = '0';

    // Print only the confirmation section
    document.getElementById('print-receipt').addEventListener('click', function () {
        const confirmationSection = document.querySelector('.confirmation-section');
        const originalContent = document.body.innerHTML;

        // Replace body content with confirmation section for printing
        document.body.innerHTML = confirmationSection.outerHTML;

        // Trigger print dialog
        window.print();

        // Restore original content after printing
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore JavaScript functionality
    });
});
