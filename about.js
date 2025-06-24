// About page specific JavaScript

// Animate stats on scroll
function animateStats() {
    const stats = document.querySelectorAll('.impact-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // Animation duration in milliseconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateStat = () => {
            current += step;
            if (current < target) {
                if (target >= 100) {
                    stat.textContent = Math.floor(current);
                } else {
                    stat.textContent = current.toFixed(1);
                }
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target % 1 === 0 ? target : target.toFixed(1);
            }
        };
        
        updateStat();
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate elements when they come into view
let hasAnimated = false;
function handleScroll() {
    if (!hasAnimated && isInViewport(document.querySelector('.impact-stats'))) {
        animateStats();
        hasAnimated = true;
        window.removeEventListener('scroll', handleScroll);
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// Timeline animation on scroll
const timelineItems = document.querySelectorAll('.timeline-item');

function animateTimeline() {
    timelineItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (itemPosition < screenPosition) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state for timeline items
timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'all 0.8s ease';
});

window.addEventListener('scroll', animateTimeline);
window.addEventListener('load', animateTimeline);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Partner with us button
const partnerBtn = document.querySelector('.partner-cta .primary-btn');
partnerBtn.addEventListener('click', () => {
    showNotification('Redirecting to contact page...');
});
