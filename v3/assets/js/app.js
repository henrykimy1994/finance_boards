/**
 * FinSmart - Main Application
 * This file handles the initialization of the application and common functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Initialize layout components
        this.initLayout();
        
        // Initialize modals
        this.initModals();
        
        // Initialize page-specific content
        this.initActivePageContent();
        
        // Set current date for transaction form
        this.setCurrentDateForForms();
        
        // Set up global event listeners
        this.setupGlobalEventListeners();
        
        // Show welcome message
        UI.showToast('Welcome to FinSmart!', 'info');
    },
    
    /**
     * Initialize layout components and navigation
     */
    initLayout() {
        // Sidebar navigation
        const sidebarMenuItems = document.querySelectorAll('.sidebar-menu li');
        
        sidebarMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Update active menu item
                sidebarMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding page
                const targetPage = this.getAttribute('data-page');
                const pages = document.querySelectorAll('.page');
                
                pages.forEach(page => {
                    page.classList.remove('active');
                    if (page.id === targetPage) {
                        page.classList.add('active');
                        // Update page title
                        document.querySelector('.page-title').textContent = this.querySelector('span').textContent;
                    }
                });
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 992) {
                    document.querySelector('.sidebar').classList.remove('active');
                    document.querySelector('.overlay').classList.remove('active');
                }
                
                // Initialize the active page content
                App.initActivePageContent();
            });
        });
        
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const closeSidebar = document.querySelector('.close-sidebar');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            });
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                // Also close any open modals
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                overlay.classList.remove('active');
            });
        }
        
        // Responsive adjustments on window resize
        window.addEventListener('resize', this.handleWindowResize);
        
        // View all links
        const viewAllLinks = document.querySelectorAll('.view-all');
        
        viewAllLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetPage = this.getAttribute('data-target');
                
                // Update active menu item
                sidebarMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
                document.querySelector(`.sidebar-menu li[data-page="${targetPage}"]`).classList.add('active');
                
                // Show corresponding page
                const pages = document.querySelectorAll('.page');
                
                pages.forEach(page => {
                    page.classList.remove('active');
                    if (page.id === targetPage) {
                        page.classList.add('active');
                        // Update page title
                        document.querySelector('.page-title').textContent = document.querySelector(`.sidebar-menu li[data-page="${targetPage}"] span`).textContent;
                    }
                });
                
                // Initialize the active page content
                App.initActivePageContent();
            });
        });
        
        // Add transaction button
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', function() {
                UI.openModal('transaction-modal');
            });
        }
    },
    
    /**
     * Initialize active page content
     */
    initActivePageContent() {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;
        
        const pageId = activePage.id;
        
        // Initialize page-specific content based on page ID
        switch (pageId) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') {
                    Dashboard.init();
                }
                break;
            case 'transactions':
                if (typeof Transactions !== 'undefined') {
                    Transactions.init();
                }
                break;
            case 'budget':
                if (typeof Budget !== 'undefined') {
                    Budget.init();
                }
                break;
            case 'subscriptions':
                if (typeof Subscriptions !== 'undefined') {
                    Subscriptions.init();
                }
                break;
            case 'debts':
                if (typeof Debts !== 'undefined') {
                    Debts.init();
                }
                break;
            case 'reports':
                if (typeof Reports !== 'undefined') {
                    Reports.init();
                }
                break;
            case 'settings':
                if (typeof Settings !== 'undefined') {
                    Settings.init();
                }
                break;
            default:
                console.log(`No initialization function for page: ${pageId}`);
        }
    },
    
    /**
     * Initialize modals
     */
    initModals() {
        // Preload common modals
        this.loadTransactionModal();
    },
    
    /**
     * Load transaction modal
     */
    loadTransactionModal() {
        // Check if modal already exists
        if (document.getElementById('transaction-modal')) return;
        
        // Create transaction modal container
        const modalsContainer = document.getElementById('modals-container');
        
        if (!modalsContainer) return;
        
        // Create transaction modal HTML
        const transactionModal = document.createElement('div');
        transactionModal.className = 'modal';
        transactionModal.id = 'transaction-modal';
        
        transactionModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Add New Transaction</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="transaction-form">
                            <div class="form-group">
                                <label>Transaction Type</label>
                                <div class="transaction-type-selector">
                                    <div class="type-option active" data-type="expense">
                                        <i class="fas fa-arrow-up"></i>
                                        <span>Expense</span>
                                    </div>
                                    <div class="type-option" data-type="income">
                                        <i class="fas fa-arrow-down"></i>
                                        <span>Income</span>
                                    </div>
                                </div>
                                <input type="hidden" id="transaction-type" value="expense">
                            </div>
                            <div class="form-group">
                                <label for="transaction-amount">Amount</label>
                                <div class="amount-input">
                                    <span class="currency-symbol">$</span>
                                    <input type="number" id="transaction-amount" placeholder="0.00" step="0.01" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="transaction-date">Date</label>
                                <input type="date" id="transaction-date" required>
                            </div>
                            <div class="form-group">
                                <label for="transaction-description">Description</label>
                                <input type="text" id="transaction-description" placeholder="Enter description" required>
                            </div>
                            <div class="form-group">
                                <label for="transaction-category">Category</label>
                                <select id="transaction-category" required>
                                    <option value="" disabled selected>Select category</option>
                                    <!-- Categories will be populated based on transaction type -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="transaction-payment">Payment Method</label>
                                <select id="transaction-payment" required>
                                    <option value="card">Card</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="transaction-notes">Notes (Optional)</label>
                                <textarea id="transaction-notes" placeholder="Add any additional notes"></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="cancel-btn close-modal">Cancel</button>
                                <button type="submit" class="save-btn">Save Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        modalsContainer.appendChild(transactionModal);
        
        // Set up event listeners for transaction modal
        this.setupTransactionModalListeners();
    },
    
    /**
     * Set up transaction modal event listeners
     */
    setupTransactionModalListeners() {
        // Get modal elements
        const transactionModal = document.getElementById('transaction-modal');
        if (!transactionModal) return;
        
        // Type options click handler
        const typeOptions = transactionModal.querySelectorAll('.type-option');
        
        typeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                typeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Set hidden input value
                const type = this.getAttribute('data-type');
                document.getElementById('transaction-type').value = type;
                
                // Update category options based on type
                App.updateCategoryOptions(type);
            });
        });
        
        // Form submission
        const transactionForm = document.getElementById('transaction-form');
        
        if (transactionForm) {
            transactionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Save transaction
                App.saveTransaction();
            });
        }
    },
    
    /**
     * Update category options based on transaction type
     * @param {string} type - Transaction type (income/expense)
     */
    async updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transaction-category');
        if (!categorySelect) return;
        
        // Clear existing options
        categorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
        
        try {
            // Fetch categories if not already available
            const categories = await API.get('categories');
            
            // Add categories based on type
            const categoryList = type === 'income' ? categories.income : categories.expense;
            
            if (categoryList && categoryList.length > 0) {
                categoryList.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },
    
    /**
     * Save transaction
     */
    async saveTransaction() {
        try {
            // Get form values
            const type = document.getElementById('transaction-type').value;
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            const date = document.getElementById('transaction-date').value;
            const description = document.getElementById('transaction-description').value;
            const category = document.getElementById('transaction-category').value;
            const paymentMethod = document.getElementById('transaction-payment').value;
            const notes = document.getElementById('transaction-notes').value;
            
            // Validate form
            if (!amount || !date || !description || !category || !paymentMethod) {
                UI.showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Create transaction object
            const transaction = {
                date: date,
                description: description,
                category: category,
                paymentMethod: paymentMethod,
                amount: type === 'expense' ? -amount : amount,
                type: type,
                notes: notes
            };
            
            // In a real app, this would save the transaction to the server
            // For demo purposes, we'll just use the API mock
            const result = await API.post('transactions', transaction);
            
            if (result.success) {
                // Close modal
                UI.closeModal('transaction-modal');
                
                // Reset form
                this.resetTransactionForm();
                
                // Show success message
                UI.showToast('Transaction saved successfully', 'success');
                
                // Refresh current page data
                this.initActivePageContent();
                
                return true;
            } else {
                throw new Error('Failed to save transaction');
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            UI.showToast('Failed to save transaction', 'error');
            return false;
        }
    },
    
    /**
     * Reset transaction form
     */
    resetTransactionForm() {
        const form = document.getElementById('transaction-form');
        
        if (form) {
            form.reset();
            
            // Set current date
            const today = new Date().toISOString().split('T')[0];
            if (document.getElementById('transaction-date')) {
                document.getElementById('transaction-date').value = today;
            }
            
            // Reset transaction type to expense
            document.querySelectorAll('.type-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-type') === 'expense') {
                    option.classList.add('active');
                }
            });
            
            document.getElementById('transaction-type').value = 'expense';
            
            // Reset category options
            this.updateCategoryOptions('expense');
        }
    },
    
    /**
     * Set current date for transaction form
     */
    setCurrentDateForForms() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
    },
    
    /**
     * Handle window resize
     */
    handleWindowResize() {
        if (window.innerWidth >= 992) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.overlay');
            
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
        
        // Adjust charts after resize
        setTimeout(function() {
            // Refresh any visible charts
            if (window.categoryChart && document.getElementById('category-chart')) {
                window.categoryChart.resize();
            }
            if (window.trendChart && document.getElementById('trend-chart')) {
                window.trendChart.resize();
            }
            if (window.payoffChart && document.getElementById('payoff-chart')) {
                window.payoffChart.resize();
            }
            if (window.incomeExpenseChart && document.getElementById('income-expense-chart')) {
                window.incomeExpenseChart.resize();
            }
        }, 300);
    },
    
    /**
     * Set up global event listeners
     */
    setupGlobalEventListeners() {
        // Close modals on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                
                const overlay = document.querySelector('.overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
        
        // Global close modal button handler
        delegate(document, 'click', '.close-modal', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                
                const overlay = document.querySelector('.overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Export app module
window.App = App;