// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
      const loadingScreen = document.querySelector('.loading-screen');
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
          loadingScreen.style.display = 'none';
      }, 500);
  }, 1500);
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
      header.classList.add('scrolled');
  } else {
      header.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  
  // Animate hamburger to X
  const lines = hamburger.querySelectorAll('.line');
  if (hamburger.classList.contains('active')) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
  } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
  }
});

// Testimonial Slider
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentSlide = 0;

function showSlide(index) {
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  testimonialSlides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

nextBtn.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % testimonialSlides.length;
  showSlide(currentSlide);
});

prevBtn.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
  showSlide(currentSlide);
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
      showSlide(index);
  });
});

// Auto slide testimonials
let testimonialInterval = setInterval(() => {
  currentSlide = (currentSlide + 1) % testimonialSlides.length;
  showSlide(currentSlide);
}, 5000);

document.querySelector('.testimonial-slider').addEventListener('mouseenter', () => {
  clearInterval(testimonialInterval);
});

document.querySelector('.testimonial-slider').addEventListener('mouseleave', () => {
  testimonialInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % testimonialSlides.length;
      showSlide(currentSlide);
  }, 5000);
});

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
let cartCount = 0;

addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
      cartCount++;
      document.querySelector('.cart-count').textContent = cartCount;
      
      // Product added animation
      const product = button.closest('.product-card');
      product.style.transform = 'scale(1.05)';
      setTimeout(() => {
          product.style.transform = '';
      }, 200);
      
      // Show notification
      showNotification('Product added to cart!');
  });
});

// // Notification System
// function showNotification(message) {
//   // Create notification element if it doesn't exist
//   if (!document.querySelector('.notification')) {
//       const notification = document.createElement('div');
//       notification.className = 'notification';
//       document.body.appendChild(notification);
      
//       // Style the notification
//       notification.style.position = 'fixed';
//       notification.style.bottom = '20px';
//       notification.style.right = '20px';
//       notification.style.backgroundColor = 'var(--primary-color)';
//       notification.style.color = 'white';
//       notification.style.padding = '12px 20px';
//       notification.style.borderRadius = '5px';
//       notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
//       notification.style.transform = 'translateY(100px)';
//       notification.style.opacity = '0';
//       notification.style.transition = 'all 0.3s ease';
//       notification.style.zIndex = '9999';
//   }
  
//   const notification = document.querySelector('.notification');
//   notification.textContent = message;
  
//   // Show notification
//   setTimeout(() => {
//       notification.style.transform = 'translateY(0)';
//       notification.style.opacity = '1';
//   }, 100);
  
//   // Hide notification after 3 seconds
//   setTimeout(() => {
//       notification.style.transform = 'translateY(100px)';
//       notification.style.opacity = '0';
//   }, 3000);
// }

// Subscription Form
const subscriptionForm = document.querySelector('.subscription-form');
if (subscriptionForm) {
  subscriptionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = subscriptionForm.querySelector('input').value;
      if (email) {
          subscriptionForm.querySelector('input').value = '';
          showNotification('Thank you for subscribing!');
      }
  });
}

// Animate elements on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.feature-card, .product-card, .section-title');
  
  elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
      }
  });
};

// Set initial state for animated elements
document.querySelectorAll('.feature-card, .product-card, .section-title').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'all 0.8s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
