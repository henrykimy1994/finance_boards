/**
 * FinSmart - Transactions Page
 * This file contains functionality specific to the transactions page
 */

const Transactions = {
    // Store for transactions data
    data: {
        transactions: [],
        categories: null,
        filters: {
            type: 'all',
            category: 'all',
            paymentMethod: 'all',
            search: '',
            dateRange: 'month'
        }
    },
    
    /**
     * Initialize transactions page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Load transaction modal template
            await this.loadTransactionModal();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderTransactionsPage();
            this.initFilters();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing transactions:', error);
            UI.showToast('Failed to load transactions data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const transactionsPage = document.getElementById('transactions');
        if (!transactionsPage) return;
        
        transactionsPage.innerHTML = `
            <div class="transactions-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading transactions data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.transactions-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Load transaction modal template
     */
    async loadTransactionModal() {
        try {
            // In a real application, this would be loaded from a separate template file
            // For demo purposes, we'll create it dynamically
            
            const modalsContainer = document.getElementById('modals-container');
            if (!modalsContainer) return;
            
            // Check if modal already exists
            if (document.getElementById('transaction-modal')) return;
            
            // Create transaction modal
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
            
            return true;
        } catch (error) {
            console.error('Error loading transaction modal:', error);
            return false;
        }
    },
    
    /**
     * Fetch transactions data
     */
    async fetchData() {
        try {
            // Fetch all required data in parallel
            const [transactions, categories] = await Promise.all([
                API.get('transactions'),
                API.get('categories')
            ]);
            
            // Store the data
            this.data.transactions = transactions;
            this.data.categories = categories;
            
            return true;
        } catch (error) {
            console.error('Error fetching transactions data:', error);
            throw error;
        }
    },
    
    /**
     * Render transactions page
     */
    renderTransactionsPage() {
        const transactionsPage = document.getElementById('transactions');
        if (!transactionsPage) return;
        
        // Create page structure
        transactionsPage.innerHTML = `
            <div class="page-header">
                <h2>Transactions</h2>
                <div class="header-actions">
                    <div class="date-filter">
                        <select id="transaction-date-range">
                            <option value="week">This Week</option>
                            <option value="month" selected>This Month</option>
                            <option value="3month">Last 3 Months</option>
                            <option value="year">This Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <button class="add-btn" id="add-transaction-page-btn">
                        <i class="fas fa-plus"></i>
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            <div class="transactions-container">
                <div class="filter-bar">
                    <div class="search-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="transactions-search" placeholder="Search transactions...">
                    </div>
                    <div class="filter-controls">
                        <select id="transaction-type-filter">
                            <option value="all" selected>All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <select id="transaction-category-filter">
                            <option value="all" selected>All Categories</option>
                        </select>
                        <select id="transaction-payment-filter">
                            <option value="all" selected>All Payment Methods</option>
                            <option value="card">Card</option>
                            <option value="cash">Cash</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                </div>

                <div class="card table-card">
                    <div class="table-responsive">
                        <table class="data-table transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Payment Method</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="transactions-table-body">
                                <!-- Will be populated by JavaScript -->
                            </tbody>
                        </table>
                    </div>

                    <div class="pagination">
                        <button id="prev-page" disabled><i class="fas fa-chevron-left"></i></button>
                        <span id="page-indicator">Page 1 of 1</span>
                        <button id="next-page" disabled><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        // Populate transactions table
        this.populateTransactionsTable();
        
        // Populate category filter
        this.populateCategoryFilter();
    },
    
    /**
     * Populate transactions table
     */
    populateTransactionsTable() {
        const transactionsTableBody = document.getElementById('transactions-table-body');
        if (!transactionsTableBody || !this.data.transactions) return;
        
        transactionsTableBody.innerHTML = '';
        
        // Get filtered transactions
        const filteredTransactions = this.getFilteredTransactions();
        
        if (filteredTransactions.length === 0) {
            // Show empty state
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="transactions-empty">
                    <p>No transactions found</p>
                    <button class="add-btn" id="empty-add-transaction-btn">
                        <i class="fas fa-plus"></i>
                        <span>Add Transaction</span>
                    </button>
                </td>
            `;
            transactionsTableBody.appendChild(emptyRow);
            
            // Add event listener to empty state button
            const emptyAddBtn = document.getElementById('empty-add-transaction-btn');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', () => {
                    UI.openModal('transaction-modal');
                });
            }
            
            return;
        }
        
        // Populate table with transactions
        filteredTransactions.forEach(transaction => {
            // Find category details
            let categoryType = transaction.type === 'income' ? 'income' : 'expense';
            let category = this.findCategory(transaction.category, categoryType);
            
            // Format date
            const formattedDate = Format.date(transaction.date, 'long');
            
            // Create table row
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>
                    <span class="category-badge" style="background-color: ${category ? category.color : '#9E9E9E'}">
                        ${transaction.category}
                    </span>
                </td>
                <td>
                    <div class="payment-method">
                        <i class="fas ${Format.paymentMethodIcon(transaction.paymentMethod)}"></i>
                        ${Format.capitalizeFirstLetter(transaction.paymentMethod)}
                    </div>
                </td>
                <td class="amount ${transaction.type}">${Format.currency(transaction.amount)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" data-id="${transaction.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${transaction.id}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            transactionsTableBody.appendChild(row);
        });
        
        // Update pagination
        this.updatePagination();
    },
    
    /**
     * Get filtered transactions based on current filters
     * @returns {Array} - Filtered transactions array
     */
    getFilteredTransactions() {
        if (!this.data.transactions) return [];
        
        return this.data.transactions.filter(transaction => {
            // Filter by type
            if (this.data.filters.type !== 'all' && transaction.type !== this.data.filters.type) {
                return false;
            }
            
            // Filter by category
            if (this.data.filters.category !== 'all' && transaction.category !== this.data.filters.category) {
                return false;
            }
            
            // Filter by payment method
            if (this.data.filters.paymentMethod !== 'all' && transaction.paymentMethod !== this.data.filters.paymentMethod) {
                return false;
            }
            
            // Filter by search term
            if (this.data.filters.search && !transaction.description.toLowerCase().includes(this.data.filters.search.toLowerCase())) {
                return false;
            }
            
            // Filter by date range
            if (this.data.filters.dateRange !== 'all') {
                const currentDate = new Date();
                const transactionDate = new Date(transaction.date);
                
                // Calculate date ranges
                let startDate;
                
                switch (this.data.filters.dateRange) {
                    case 'week':
                        startDate = new Date(currentDate);
                        startDate.setDate(currentDate.getDate() - 7);
                        break;
                    case 'month':
                        startDate = new Date(currentDate);
                        startDate.setMonth(currentDate.getMonth() - 1);
                        break;
                    case '3month':
                        startDate = new Date(currentDate);
                        startDate.setMonth(currentDate.getMonth() - 3);
                        break;
                    case 'year':
                        startDate = new Date(currentDate);
                        startDate.setFullYear(currentDate.getFullYear() - 1);
                        break;
                    default:
                        startDate = new Date(0); // Beginning of time
                }
                
                if (transactionDate < startDate) {
                    return false;
                }
            }
            
            return true;
        });
    },
    
    /**
     * Update pagination display
     */
    updatePagination() {
        // Get references to pagination elements
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const pageIndicator = document.getElementById('page-indicator');
        
        if (!prevPageBtn || !nextPageBtn || !pageIndicator) return;
        
        // For demo purposes, we'll just disable pagination
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        pageIndicator.textContent = 'Page 1 of 1';
    },
    
    /**
     * Find category by name and type
     * @param {string} categoryName - The category name
     * @param {string} type - The category type (income/expense)
     * @returns {object|null} - The category object or null if not found
     */
    findCategory(categoryName, type) {
        if (!this.data.categories) return null;
        
        const categories = this.data.categories[type] || [];
        return categories.find(cat => cat.name === categoryName) || null;
    },
    
    /**
     * Populate category filter
     */
    populateCategoryFilter() {
        const categoryFilter = document.getElementById('transaction-category-filter');
        if (!categoryFilter || !this.data.categories) return;
        
        // Clear existing options
        categoryFilter.innerHTML = '<option value="all" selected>All Categories</option>';
        
        // Add expense categories
        if (this.data.categories.expense && this.data.categories.expense.length > 0) {
            this.data.categories.expense.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }
        
        // Add income categories
        if (this.data.categories.income && this.data.categories.income.length > 0) {
            this.data.categories.income.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }
    },
    
    /**
     * Initialize filter event listeners
     */
    initFilters() {
        // Type filter
        const typeFilter = document.getElementById('transaction-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.data.filters.type = typeFilter.value;
                this.populateTransactionsTable();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('transaction-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.data.filters.category = categoryFilter.value;
                this.populateTransactionsTable();
            });
        }
        
        // Payment method filter
        const paymentFilter = document.getElementById('transaction-payment-filter');
        if (paymentFilter) {
            paymentFilter.addEventListener('change', () => {
                this.data.filters.paymentMethod = paymentFilter.value;
                this.populateTransactionsTable();
            });
        }
        
        // Search filter
        const searchFilter = document.getElementById('transactions-search');
        if (searchFilter) {
            searchFilter.addEventListener('input', debounce(() => {
                this.data.filters.search = searchFilter.value;
                this.populateTransactionsTable();
            }, 300));
        }
        
        // Date range filter
        const dateRangeFilter = document.getElementById('transaction-date-range');
        if (dateRangeFilter) {
            dateRangeFilter.addEventListener('change', () => {
                this.data.filters.dateRange = dateRangeFilter.value;
                this.populateTransactionsTable();
            });
        }
    },
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Add transaction button
        const addTransactionBtn = document.getElementById('add-transaction-page-btn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                this.openTransactionModal();
            });
        }
        
        // Edit/delete transaction buttons
        delegate(document, 'click', '.action-btn.edit', (e) => {
            const transactionId = parseInt(e.target.closest('.edit').getAttribute('data-id'));
            this.editTransaction(transactionId);
        });
        
        delegate(document, 'click', '.action-btn.delete', (e) => {
            const transactionId = parseInt(e.target.closest('.delete').getAttribute('data-id'));
            this.deleteTransaction(transactionId);
        });
        
        // Transaction form setup
        this.setupTransactionForm();
    },
    
    /**
     * Set up transaction form functionality
     */
    setupTransactionForm() {
        // Transaction modal
        const transactionModal = document.getElementById('transaction-modal');
        if (!transactionModal) return;
        
        // Transaction type selector
        delegate(transactionModal, 'click', '.type-option', function() {
            // Remove active class from all options
            const options = transactionModal.querySelectorAll('.type-option');
            options.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Set hidden input value
            const type = this.getAttribute('data-type');
            document.getElementById('transaction-type').value = type;
            
            // Update category options based on type
            Transactions.updateCategoryOptions(type);
        });
        
        // Set current date
        const transactionDate = document.getElementById('transaction-date');
        if (transactionDate) {
            const today = new Date().toISOString().split('T')[0];
            transactionDate.value = today;
        }
        
        // Form submission
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTransaction();
            });
        }
    },
    
    /**
     * Update category options based on transaction type
     * @param {string} type - Transaction type (income/expense)
     */
    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transaction-category');
        if (!categorySelect || !this.data.categories) return;
        
        // Clear existing options
        categorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
        
        // Add categories based on type
        const categoryList = type === 'income' ? this.data.categories.income : this.data.categories.expense;
        
        if (categoryList && categoryList.length > 0) {
            categoryList.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    },
    
    /**
     * Open transaction modal
     * @param {object} transaction - Optional transaction object for editing
     */
    openTransactionModal(transaction = null) {
        // Reset form
        this.resetTransactionForm();
        
        // If transaction is provided, populate form for editing
        if (transaction) {
            // Set type
            const typeOption = document.querySelector(`.type-option[data-type="${transaction.type}"]`);
            if (typeOption) {
                typeOption.click();
            }
            
            // Set values
            document.getElementById('transaction-amount').value = Math.abs(transaction.amount);
            document.getElementById('transaction-date').value = transaction.date;
            document.getElementById('transaction-description').value = transaction.description;
            
            // Set category (need to update options first)
            this.updateCategoryOptions(transaction.type);
            document.getElementById('transaction-category').value = transaction.category;
            
            // Set payment method
            document.getElementById('transaction-payment').value = transaction.paymentMethod;
            
            // Set notes if available
            if (transaction.notes) {
                document.getElementById('transaction-notes').value = transaction.notes;
            }
        }
        
        // Open modal
        UI.openModal('transaction-modal');
    },
    
    /**
     * Reset transaction form
     */
    resetTransactionForm() {
        const form = document.getElementById('transaction-form');
        if (!form) return;
        
        form.reset();
        
        // Set current date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transaction-date').value = today;
        
        // Reset transaction type to expense
        const typeOptions = document.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-type') === 'expense') {
                option.classList.add('active');
            }
        });
        
        document.getElementById('transaction-type').value = 'expense';
        
        // Reset category options
        this.updateCategoryOptions('expense');
    },
    
    /**
     * Save transaction (add or update)
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
            
            // Create transaction object
            const transaction = {
                id: this.data.transactions.length + 1, // In a real app, this would be generated by the server
                date: date,
                description: description,
                category: category,
                paymentMethod: paymentMethod,
                amount: type === 'expense' ? -amount : amount,
                type: type,
                notes: notes
            };
            
            // In a real app, this would be sent to the server
            // For demo purposes, we'll just add it to our local data
            this.data.transactions.unshift(transaction);
            
            // Close modal
            UI.closeModal('transaction-modal');
            
            // Show success message
            UI.showToast('Transaction saved successfully', 'success');
            
            // Refresh transactions table
            this.populateTransactionsTable();
            
            return true;
        } catch (error) {
            console.error('Error saving transaction:', error);
            UI.showToast('Failed to save transaction', 'error');
            return false;
        }
    },
    
    /**
     * Edit transaction
     * @param {number} transactionId - ID of the transaction to edit
     */
    editTransaction(transactionId) {
        // Find transaction in data
        const transaction = this.data.transactions.find(t => t.id === transactionId);
        
        if (transaction) {
            this.openTransactionModal(transaction);
        }
    },
    
    /**
     * Delete transaction
     * @param {number} transactionId - ID of the transaction to delete
     */
    deleteTransaction(transactionId) {
        // In a real application, this would send a request to a server
        // For demo purposes, we'll just remove it from the local data
        const index = this.data.transactions.findIndex(t => t.id === transactionId);
        
        if (index !== -1) {
            // Confirm deletion
            if (confirm('Are you sure you want to delete this transaction?')) {
                this.data.transactions.splice(index, 1);
                
                // Show success message
                UI.showToast('Transaction deleted successfully', 'success');
                
                // Refresh transactions table
                this.populateTransactionsTable();
            }
        }
    }
};

// Initialize transactions page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="transactions"]', function() {
    setTimeout(() => {
        Transactions.init();
    }, 100);
});

// Also initialize if we're starting on the transactions page
document.addEventListener('DOMContentLoaded', function() {
    const transactionsPage = document.getElementById('transactions');
    if (transactionsPage && transactionsPage.classList.contains('active')) {
        Transactions.init();
    }
});

// Export transactions module
window.Transactions = Transactions;