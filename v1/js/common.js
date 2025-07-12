/**
 * FinSmart - Utility Functions and Shared Functionality
 */

// API functions for fetching data
const API = {
    /**
     * Fetch data from a JSON file
     * @param {string} endpoint - The endpoint/file to fetch from
     * @returns {Promise<any>} - The parsed JSON data
     */
    async get(endpoint) {
        try {
            const response = await fetch(`data/${endpoint}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    },
    
    /**
     * Mock POST request (would normally send data to a server)
     * @param {string} endpoint - The endpoint to post to
     * @param {object} data - The data to send
     * @returns {Promise<object>} - Response with success status
     */
    async post(endpoint, data) {
        // For demo purposes, just log the data and return a success response
        console.log(`POST to ${endpoint}:`, data);
        return { success: true, data };
    },
    
    /**
     * Mock PUT request for updating data
     * @param {string} endpoint - The endpoint to update
     * @param {object} data - The data to update
     * @returns {Promise<object>} - Response with success status
     */
    async put(endpoint, data) {
        // For demo purposes, just log the data and return a success response
        console.log(`PUT to ${endpoint}:`, data);
        return { success: true, data };
    },
    
    /**
     * Mock DELETE request
     * @param {string} endpoint - The endpoint/ID to delete
     * @returns {Promise<object>} - Response with success status
     */
    async delete(endpoint) {
        // For demo purposes, just log and return a success response
        console.log(`DELETE ${endpoint}`);
        return { success: true };
    }
};

// Format utilities
const Format = {
    /**
     * Format currency
     * @param {number} amount - The amount to format
     * @param {boolean} abbreviated - Whether to abbreviate large numbers
     * @returns {string} - Formatted currency string
     */
    currency(amount, abbreviated = false) {
        // Default currency is USD
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        if (abbreviated && Math.abs(amount) >= 1000) {
            return formatter.format(amount / 1000) + 'K';
        }
        
        return formatter.format(amount);
    },
    
    /**
     * Get payment method icon class
     * @param {string} method - The payment method
     * @returns {string} - FontAwesome icon class
     */
    paymentMethodIcon(method) {
        switch (method.toLowerCase()) {
            case 'card':
                return 'fa-credit-card';
            case 'cash':
                return 'fa-money-bill-alt';
            case 'bank':
                return 'fa-university';
            default:
                return 'fa-money-bill-alt';
        }
    },
    
    /**
     * Capitalize first letter of a string
     * @param {string} string - The string to capitalize
     * @returns {string} - Capitalized string
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    /**
     * Get ordinal suffix for a number
     * @param {number} n - The number
     * @returns {string} - Number with ordinal suffix
     */
    ordinalSuffix(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    
    /**
     * Format date
     * @param {string} dateString - The date string to format
     * @param {string} format - The format to use (short, long)
     * @returns {string} - Formatted date string
     */
    date(dateString, format = 'short') {
        const date = new Date(dateString);
        
        if (format === 'short') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (format === 'long') {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        
        return date.toLocaleDateString();
    },
    
    /**
     * Format percentage
     * @param {number} value - The value to format as percentage
     * @param {number} decimals - Number of decimal places
     * @returns {string} - Formatted percentage string
     */
    percentage(value, decimals = 1) {
        return value.toFixed(decimals) + '%';
    }
};

// UI utilities
const UI = {
    /**
     * Toggle mobile sidebar
     */
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');
        
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        } else {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        }
    },
    
    /**
     * Navigate to a page
     * @param {string} pageId - The ID of the page to navigate to
     */
    navigateToPage(pageId) {
        // Update active menu item
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        menuItems.forEach(item => item.classList.remove('active'));
        
        const activeMenuItem = document.querySelector(`.sidebar-menu li[data-page="${pageId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
        
        // Show corresponding page
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
                // Update page title
                const pageTitle = document.querySelector('.page-title');
                if (pageTitle && activeMenuItem) {
                    pageTitle.textContent = activeMenuItem.querySelector('span').textContent;
                }
            }
        });
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 992) {
            UI.toggleSidebar();
        }
    },
    
    /**
     * Open a modal
     * @param {string} modalId - The ID of the modal to open
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.querySelector('.overlay');
        
        if (modal && overlay) {
            modal.style.display = 'block';
            overlay.classList.add('active');
        }
    },
    
    /**
     * Close a modal
     * @param {string} modalId - The ID of the modal to close
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.querySelector('.overlay');
        
        if (modal && overlay) {
            modal.style.display = 'none';
            overlay.classList.remove('active');
        }
    },
    
    /**
     * Show toast notification
     * @param {string} message - The message to display
     * @param {string} type - The type of toast (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">${message}</div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        // Append toast to container
        toastContainer.appendChild(toast);
        
        // Add show class after a small delay (for animation)
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    },
    
    /**
     * Get icon for toast notification
     * @param {string} type - The type of toast
     * @returns {string} - FontAwesome icon class
     */
    getToastIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    },
    
    /**
     * Create a loading spinner
     * @param {HTMLElement} container - The container to append the spinner to
     * @param {string} size - Size of the spinner (small, medium, large)
     * @returns {HTMLElement} - The spinner element
     */
    createSpinner(container, size = 'medium') {
        const spinner = document.createElement('div');
        spinner.className = `spinner spinner-${size}`;
        
        if (container) {
            container.appendChild(spinner);
        }
        
        return spinner;
    },
    
    /**
     * Remove a spinner
     * @param {HTMLElement} spinner - The spinner element to remove
     */
    removeSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }
};

/**
 * Event delegation helper
 * @param {HTMLElement} element - The element to delegate events from
 * @param {string} eventType - The event type to listen for
 * @param {string} selector - The CSS selector to match
 * @param {Function} handler - The event handler
 */
function delegate(element, eventType, selector, handler) {
    element.addEventListener(eventType, function(event) {
        const targetElement = event.target.closest(selector);
        
        if (targetElement && element.contains(targetElement)) {
            handler.call(targetElement, event, targetElement);
        }
    });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities
window.API = API;
window.Format = Format;
window.UI = UI;
window.delegate = delegate;
window.debounce = debounce;