// Contact page specific JavaScript

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your server
    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);
    
    console.log('Form submitted:', formObject);
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// FAQ accordion functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');
    
    answer.style.display = 'none'; // Initially hide all answers
    
    question.addEventListener('click', () => {
        const isOpen = answer.style.display === 'block';
        
        // Close all other open FAQs
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector('p').style.display = 'none';
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        answer.style.display = isOpen ? 'none' : 'block';
        item.classList.toggle('active', !isOpen);
    });
});
