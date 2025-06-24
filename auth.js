// Authentication pages JavaScript

// Tab switching functionality
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        const formToShow = document.querySelector(`.${tab.dataset.tab}-form`);
        formToShow.classList.add('active');
    });
});

// Password visibility toggle
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const passwordInput = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        // Toggle password visibility
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password strength meter
const signupPassword = document.getElementById('signupPassword');
const strengthSegments = document.querySelectorAll('.strength-segment');
const strengthText = document.querySelector('.strength-text');

signupPassword.addEventListener('input', () => {
    const password = signupPassword.value;
    let strength = 0;
    
    // Check password length
    if (password.length >= 8) {
        strength += 1;
    }
    
    // Check for lowercase and uppercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength += 1;
    }
    
    // Check for numbers
    if (/\d/.test(password)) {
        strength += 1;
    }
    
    // Check for special characters
    if (/[^a-zA-Z0-9]/.test(password)) {
        strength += 1;
    }
    
    // Update strength meter
    strengthSegments.forEach((segment, index) => {
        segment.className = 'strength-segment';
        if (index < strength) {
            if (strength === 1) {
                segment.classList.add('weak');
            } else if (strength === 2 || strength === 3) {
                segment.classList.add('medium');
            } else {
                segment.classList.add('strong');
            }
        }
    });
    
    // Update strength text
    if (password === '') {
        strengthText.textContent = '';
        strengthText.style.color = '';
    } else if (strength === 1) {
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#e74c3c';
    } else if (strength === 2) {
        strengthText.textContent = 'Fair';
        strengthText.style.color = '#f39c12';
    } else if (strength === 3) {
        strengthText.textContent = 'Good';
        strengthText.style.color = '#f39c12';
    } else {
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#2ecc71';
    }
});

// Form submission
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Handle Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        showNotification(result.message);
        // Redirect to login tab after successful signup
        document.querySelector('.auth-tab[data-tab="login"]').click();
        document.getElementById('loginEmail').value = email; // Pre-fill login form with email
      } else {
        showNotification(result.error, true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  // Handle Login Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user_name', result.name);
        localStorage.setItem('user_email', result.email);
        localStorage.setItem('user_id', result.user_id);
  
        showNotification(result.message);
  
        // Clear cart on successful login
        localStorage.removeItem('cart');
  
        // Redirect to profile page after successful login
        setTimeout(() => {
          window.location.href = '/profile.html';
        }, 1500);
      } else {
        showNotification(result.error, true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  

// Custom notification function
function showNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    if (!document.querySelector('.auth-notification')) {
        const notification = document.createElement('div');
        notification.className = 'auth-notification';
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
    
    const notification = document.querySelector('.auth-notification');
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
