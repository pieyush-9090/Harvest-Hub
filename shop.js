// Shop page specific JavaScript

// Price range slider
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', () => {
    priceValue.textContent = `Rs ${priceRange.value}`;
});

// View options (grid/list)
const gridViewBtn = document.querySelector('.grid-view');
const listViewBtn = document.querySelector('.list-view');
const productsGrid = document.querySelector('.products-grid');

gridViewBtn.addEventListener('click', () => {
    productsGrid.classList.remove('list-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    productsGrid.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

// Filter buttons
const applyFilterBtn = document.querySelector('.apply-filter-btn');
const resetFilterBtn = document.querySelector('.reset-filter-btn');

applyFilterBtn.addEventListener('click', () => {
    // In a real application, this would filter products based on selected criteria
    showNotification('Filters applied!');
});

resetFilterBtn.addEventListener('click', () => {
    // Reset all filter inputs
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    priceRange.value = 100;
    priceValue.textContent = 'Rs600';
    
    showNotification('Filters reset!');
});

// Category filter
// const categoryLinks = document.querySelectorAll('.filter-list a');

// categoryLinks.forEach(link => {
//     link.addEventListener('click', (e) => {
//         e.preventDefault();
        
//         // Remove active class from all links
//         categoryLinks.forEach(item => item.classList.remove('active'));
        
//         // Add active class to clicked link
//         link.classList.add('active');
        
//         // In a real application, this would filter products by category
//         showNotification(`Category: ${link.textContent} selected!`);
//     });
// });

// Sort products
const sortSelect = document.getElementById('sort');

sortSelect.addEventListener('change', () => {
    const selectedOption = sortSelect.options[sortSelect.selectedIndex].text;
    showNotification(`Products sorted by: ${selectedOption}`);
    
    // In a real application, this would sort the products
});

// Pagination
const paginationLinks = document.querySelectorAll('.pagination a');

paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all pagination links
        paginationLinks.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked link (except for the next button)
        if (!link.classList.contains('next')) {
            link.classList.add('active');
        }
        
        // In a real application, this would load the corresponding page of products
        showNotification(`Page ${link.textContent} selected!`);
    });
});
