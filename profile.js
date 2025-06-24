document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('user_id');
  
    if (!userId) {
      alert('Please log in to view your profile.');
      window.location.href = '/login.html'; // Redirect to login page if not logged in
      return;
    }
  
    try {
      const response = await fetch(`/profile?user_id=${userId}`);
      const result = await response.json();
  
      if (response.ok) {
        // Update profile page with user data
        document.querySelector('.profile-name').textContent = result.name;
        document.querySelector('.profile-email').textContent = result.email;
  
        // Update Total Orders count
        const totalOrdersCountElement = document.querySelector('.total-orders-count');
        totalOrdersCountElement.textContent = result.all_orders.length; // Use all_orders length
  
        // Populate Recent Orders section (last 5 orders)
        const recentOrdersContainer = document.querySelector('.recent-orders');
        recentOrdersContainer.innerHTML = ''; // Clear existing content
  
        result.recent_orders.forEach((order, index) => {
          const orderItem = document.createElement('div');
          orderItem.className = 'order-item';
          orderItem.innerHTML = `
            <div class="order-info">
              <span class="order-id">${order.order_number}</span>
              <span class="order-date">${order.date}</span>
            </div>
            <div class="order-status delivered">Delivered</div>
            <div class="order-total">Rs ${order.total.toFixed(2)}</div>
            <button class="btn secondary-btn sm-btn details-btn" data-order-index="${index}" data-section="recent">Details</button>
          `;
          recentOrdersContainer.appendChild(orderItem);
        });
  
        // Populate Total Orders section (all orders)
        const totalOrdersContainer = document.querySelector('#orders .orders-list');
        totalOrdersContainer.innerHTML = ''; // Clear existing content
  
        result.all_orders.forEach((order, index) => {
          const orderItem = document.createElement('div');
          orderItem.className = 'order-item';
          orderItem.innerHTML = `
            <div class="order-info">
              <span class="order-id">${order.order_number}</span>
              <span class="order-date">${order.date}</span>
            </div>
            <div class="order-status delivered">Delivered</div>
            <div class="order-total">Rs ${order.total.toFixed(2)}</div>
            <button class="btn secondary-btn sm-btn details-btn" data-order-index="${index}" data-section="all">Details</button>
          `;
          totalOrdersContainer.appendChild(orderItem);
        });
  
        // Add event listeners for "Details" buttons
        document.querySelectorAll('.details-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const orderIndex = e.target.dataset.orderIndex;
            const section = e.target.dataset.section;
            const orderDetails =
              section === 'recent' ? result.recent_orders[orderIndex] : result.all_orders[orderIndex];
            showOrderDetailsPopup(orderDetails);
          });
        });
      } else {
        alert(result.error || 'Failed to load profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  // Function to show order details in a popup
  function showOrderDetailsPopup(order) {
    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
  
    // Create the popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.innerHTML = `
      <h3>Order Details</h3>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} - Rs ${item.price} x ${item.quantity}</li>
        `).join('')}
      </ul>
      <button class="btn close-popup-btn">Close</button>
    `;
  
    // Append the content to the container
    popupContainer.appendChild(popupContent);
  
    // Append the container to the body
    document.body.appendChild(popupContainer);
  
    // Add event listener to close the popup
    popupContainer.querySelector('.close-popup-btn').addEventListener('click', () => {
      document.body.removeChild(popupContainer);
    });
  }
  
  // Tab switching functionality
  const menuItems = document.querySelectorAll('.profile-menu li:not(.logout)');
  const profileTabs = document.querySelectorAll('.profile-tab');
  
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all menu items and tabs
      menuItems.forEach(i => i.classList.remove('active'));
      profileTabs.forEach(t => t.classList.remove('active'));
  
      // Add active class to clicked menu item and corresponding tab
      item.classList.add('active');
      const tabToShow = document.getElementById(item.dataset.tab);
      tabToShow.classList.add('active');
    });
  });
  
  // View all links in dashboard
  const viewAllLinks = document.querySelectorAll('.view-all');
  viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
  
      // Get the tab to show
      const tabToShow = link.dataset.tab;
  
      // Remove active class from all menu items and tabs
      menuItems.forEach(i => i.classList.remove('active'));
      profileTabs.forEach(t => t.classList.remove('active'));
  
      // Add active class to corresponding menu item and tab
      document.querySelector(`.profile-menu li[data-tab="${tabToShow}"]`).classList.add('active');
      document.getElementById(tabToShow).classList.add('active');
    });
  });
  

// Logout functionality
const logoutBtn = document.querySelector('.profile-menu .logout'); // Ensure this matches your logout button's class or ID

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      // Clear all user-related data from local storage
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('cart'); // Clear cart if stored in local storage

      // Redirect to login page
      window.location.href = '/login.html';
    }
  });
}

// Change avatar functionality
const changeAvatarBtn = document.querySelector('.change-avatar-btn');
changeAvatarBtn.addEventListener('click', () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Trigger click on the file input
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        
        if (file) {
            // Create a FileReader to read the selected image
            const reader = new FileReader();
            
            reader.onload = (e) => {
                // Update the avatar image with the selected image
                document.querySelector('.profile-avatar img').src = e.target.result;
                showNotification('Profile picture updated successfully!');
            };
            
            reader.readAsDataURL(file);
        }
    });
});

// Form submissions
const forms = document.querySelectorAll('.settings-form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success notification
        showNotification('Changes saved successfully!');
    });
});

// Delete account confirmation
const deleteAccountBtn = document.querySelector('.delete-account-btn');
deleteAccountBtn.addEventListener('click', () => {
    // Show a more serious confirmation dialog
    const confirmed = confirm('WARNING: You are about to delete your account. This action is irreversible and all your data will be permanently lost. Are you absolutely sure you want to proceed?');
    
    if (confirmed) {
        // Show a second confirmation for extra safety
        const finalConfirmation = confirm('Please confirm once more that you want to permanently delete your account.');
        
        if (finalConfirmation) {
            showNotification('Account deletion initiated. You will be logged out shortly.');
            
            // Simulate account deletion process
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
});

// Order filtering functionality
const orderStatusSelect = document.getElementById('orderStatus');
const orderDateSelect = document.getElementById('orderDate');
const orderItems = document.querySelectorAll('.orders-list .order-item');

orderStatusSelect.addEventListener('change', filterOrders);
orderDateSelect.addEventListener('change', filterOrders);

function filterOrders() {
    const statusFilter = orderStatusSelect.value;
    const dateFilter = orderDateSelect.value;
    
    // In a real application, this would filter orders based on the selected criteria
    // For this demo, we'll just show a notification
    showNotification(`Filtering orders: Status = ${statusFilter}, Date = ${dateFilter}`);
}

// Search functionality
const searchInput = document.querySelector('.search-group input');
const searchButton = document.querySelector('.search-group button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showNotification(`Searching for: ${searchTerm}`);
        }
    }
});

// Subscription actions
const skipNextBtn = document.querySelector('.subscription-actions .secondary-btn');
const customizeBtn = document.querySelector('.subscription-actions .primary-btn');
const cancelBtn = document.querySelector('.subscription-actions .cancel-btn');

skipNextBtn.addEventListener('click', () => {
    showNotification('Next delivery has been skipped!');
    skipNextBtn.textContent = 'Skipped';
    skipNextBtn.disabled = true;
    skipNextBtn.style.backgroundColor = '#888';
});

customizeBtn.addEventListener('click', () => {
    showNotification('Opening subscription customization options...');
});

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            showNotification('Subscription cancelled successfully!');
            
            // Update the subscription card to show cancelled status
            document.querySelector('.subscription-status').textContent = 'Cancelled';
            document.querySelector('.subscription-status').style.backgroundColor = '#ffebee';
            document.querySelector('.subscription-status').style.color = '#d32f2f';
            
            // Disable the buttons
            skipNextBtn.disabled = true;
            customizeBtn.disabled = true;
            cancelBtn.disabled = true;
            
            // Change button styles
            skipNextBtn.style.backgroundColor = '#888';
            customizeBtn.style.backgroundColor = '#888';
            cancelBtn.style.backgroundColor = '#888';
            cancelBtn.style.borderColor = '#888';
            cancelBtn.style.color = '#fff';
        }
    });
}

// Address and payment method actions
const editButtons = document.querySelectorAll('.address-actions .secondary-btn, .payment-actions .secondary-btn');
const deleteButtons = document.querySelectorAll('.address-actions .text-btn:nth-child(2), .payment-actions .text-btn:nth-child(2)');
const setDefaultButtons = document.querySelectorAll('.address-actions .text-btn:nth-child(3), .payment-actions .text-btn:nth-child(3)');
const addButtons = document.querySelectorAll('.address-card.add-new .primary-btn, .payment-card.add-new .primary-btn');

editButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.closest('.address-card') ? 'address' : 'payment method';
        showNotification(`Edit ${type} form opened`);
    });
});

deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.closest('.address-card') ? 'address' : 'payment method';
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
            
            // Remove the card with animation
            const card = button.closest('.address-card, .payment-card');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
});

setDefaultButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.closest('.address-card') ? 'address' : 'payment method';
        showNotification(`Default ${type} updated successfully!`);
        
        // Remove default class from current default
        const currentDefault = document.querySelector(`.address-card.default, .payment-card.default`);
        currentDefault.classList.remove('default');
        currentDefault.querySelector('.address-badge, .payment-badge').remove();
        
        // Add default class to the new default
        const newDefault = button.closest('.address-card, .payment-card');
        newDefault.classList.add('default');
        
        // Create and add badge
        const badge = document.createElement('div');
        badge.className = button.closest('.address-card') ? 'address-badge' : 'payment-badge';
        badge.textContent = 'Default';
        newDefault.appendChild(badge);
        
        // Remove the "Set as Default" button
        button.remove();
    });
});

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.closest('.address-card') ? 'address' : 'payment method';
        showNotification(`Add new ${type} form opened`);
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show dashboard tab by default
    document.querySelector('.profile-menu li[data-tab="dashboard"]').classList.add('active');
    document.getElementById('dashboard').classList.add('active');
});
