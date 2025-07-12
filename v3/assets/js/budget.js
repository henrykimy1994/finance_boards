/**
 * FinSmart - Budget Page
 * This file contains functionality specific to the budget page
 */

const Budget = {
    // Store for budget data
    data: {
        budgets: [],
        categories: null,
        transactions: [],
        currentMonth: new Date().getMonth() + 1,
        currentYear: new Date().getFullYear()
    },
    
    /**
     * Initialize budget page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Load budget modal template
            await this.loadBudgetModal();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderBudgetPage();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing budget:', error);
            UI.showToast('Failed to load budget data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const budgetPage = document.getElementById('budget');
        if (!budgetPage) return;
        
        budgetPage.innerHTML = `
            <div class="budget-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading budget data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.budget-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Load budget modal template
     */
    async loadBudgetModal() {
        try {
            // In a real application, this would be loaded from a separate template file
            // For demo purposes, we'll create it dynamically
            
            const modalsContainer = document.getElementById('modals-container');
            if (!modalsContainer) return;
            
            // Check if modal already exists
            if (document.getElementById('budget-modal')) return;
            
            // Create budget modal
            const budgetModal = document.createElement('div');
            budgetModal.className = 'modal';
            budgetModal.id = 'budget-modal';
            
            budgetModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Add Budget Category</h3>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-body">
                            <form id="budget-form">
                                <div class="form-group">
                                    <label for="budget-category">Category</label>
                                    <select id="budget-category" required>
                                        <option value="" disabled selected>Select category</option>
                                        <!-- Categories will be populated by JavaScript -->
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="budget-amount">Budget Amount</label>
                                    <div class="amount-input">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="budget-amount" placeholder="0.00" step="0.01" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="budget-period">Budget Period</label>
                                    <select id="budget-period" required>
                                        <option value="monthly" selected>Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="cancel-btn close-modal">Cancel</button>
                                    <button type="submit" class="save-btn">Save Budget</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            modalsContainer.appendChild(budgetModal);
            
            return true;
        } catch (error) {
            console.error('Error loading budget modal:', error);
            return false;
        }
    },
    
    /**
     * Fetch budget data
     */
    async fetchData() {
        try {
            // Fetch all required data in parallel
            const [budgets, categories, transactions] = await Promise.all([
                API.get('budgets'),
                API.get('categories'),
                API.get('transactions')
            ]);
            
            // Store the data
            this.data.budgets = budgets;
            this.data.categories = categories;
            this.data.transactions = transactions;
            
            return true;
        } catch (error) {
            console.error('Error fetching budget data:', error);
            throw error;
        }
    },
    
    /**
     * Render budget page
     */
    renderBudgetPage() {
        const budgetPage = document.getElementById('budget');
        if (!budgetPage) return;
        
        // Create page structure
        budgetPage.innerHTML = `
            <div class="page-header">
                <h2>Budget</h2>
                <div class="header-actions">
                    <div class="date-filter-group">
                        <select id="budget-month">
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <select id="budget-year">
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                    <button class="add-btn" id="add-budget-btn">
                        <i class="fas fa-plus"></i>
                        <span>Add Budget</span>
                    </button>
                </div>
            </div>

            <div class="budget-summary-cards">
                <div class="budget-card total">
                    <h3>Total Budget</h3>
                    <p class="amount">$0.00</p>
                </div>
                <div class="budget-card spent">
                    <h3>Spent So Far</h3>
                    <p class="amount">$0.00</p>
                </div>
                <div class="budget-card remaining">
                    <h3>Remaining</h3>
                    <p class="amount positive">$0.00</p>
                </div>
                <div class="budget-card progress">
                    <h3>Budget Progress</h3>
                    <div class="budget-progress-container">
                        <div class="budget-progress-bar" style="width: 0%;"></div>
                        <span class="budget-progress-label">0%</span>
                    </div>
                </div>
            </div>

            <div class="budget-categories" id="budget-categories-container">
                <!-- Will be populated by JavaScript -->
            </div>
        `;
        
        // Set current month and year
        document.getElementById('budget-month').value = this.data.currentMonth.toString().padStart(2, '0');
        document.getElementById('budget-year').value = this.data.currentYear.toString();
        
        // Populate budget categories
        this.populateBudgetCategories();
    },
    
    /**
     * Calculate spending for a specific category
     * @param {string} category - The category name
     * @param {number} month - The month number (1-12)
     * @param {number} year - The year
     * @returns {number} - Total spending for the category
     */
    calculateCategorySpending(category, month, year) {
        if (!this.data.transactions) return 0;
        
        // Create date range for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month
        
        // Filter transactions for the category and date range
        const filteredTransactions = this.data.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return (
                transaction.category === category &&
                transaction.type === 'expense' &&
                transactionDate >= startDate &&
                transactionDate <= endDate
            );
        });
        
        // Sum the amounts (expenses are stored as negative values)
        return filteredTransactions.reduce((total, transaction) => {
            return total + Math.abs(transaction.amount);
        }, 0);
    },
    
    /**
     * Populate budget categories
     */
    populateBudgetCategories() {
        const budgetCategoriesContainer = document.getElementById('budget-categories-container');
        if (!budgetCategoriesContainer || !this.data.budgets) return;
        
        budgetCategoriesContainer.innerHTML = '';
        
        // Calculate total budget and spent
        let totalBudget = 0;
        let totalSpent = 0;
        
        this.data.budgets.forEach(budget => {
            // Calculate spent amount for the current month/year
            const spent = this.calculateCategorySpending(
                budget.category,
                this.data.currentMonth,
                this.data.currentYear
            );
            
            // Update totals
            totalBudget += budget.allocated;
            totalSpent += spent;
            
            // Calculate percentage spent
            const percentageSpent = budget.allocated > 0 ? Math.round((spent / budget.allocated) * 100) : 0;
            
            // Determine status class
            let statusClass = 'good';
            if (percentageSpent >= 90) {
                statusClass = 'danger';
            } else if (percentageSpent >= 75) {
                statusClass = 'warning';
            }
            
            // Find category details
            const category = this.findCategory(budget.category, 'expense');
            
            // Create budget category card
            const budgetCard = document.createElement('div');
            budgetCard.className = 'budget-category';
            
            budgetCard.innerHTML = `
                <div class="budget-category-header">
                    <div class="budget-category-name">
                        <i class="fas ${category ? category.icon : 'fa-question'}" style="color: ${category ? category.color : '#9E9E9E'}"></i>
                        ${budget.category}
                    </div>
                </div>
                <div class="budget-stats">
                    <div class="stat spent">Spent: ${Format.currency(spent)}</div>
                    <div class="stat allocated">of ${Format.currency(budget.allocated)}</div>
                </div>
                <div class="budget-category-progress">
                    <div class="budget-category-bar ${statusClass}" style="width: ${percentageSpent}%"></div>
                </div>
                <div class="budget-category-footer">
                    <div class="remaining">${Format.currency(budget.allocated - spent)} remaining</div>
                    <div class="percentage">${percentageSpent}% used</div>
                </div>
            `;
            
            budgetCategoriesContainer.appendChild(budgetCard);
        });
        
        // Update budget summary cards
        this.updateBudgetSummary(totalBudget, totalSpent);
    },
    
    /**
     * Update budget summary cards
     * @param {number} totalBudget - Total budget amount
     * @param {number} totalSpent - Total spent amount
     */
    updateBudgetSummary(totalBudget, totalSpent) {
        // Calculate remaining budget
        const remaining = totalBudget - totalSpent;
        
        // Calculate progress percentage
        const progressPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
        
        // Update summary cards
        document.querySelector('.budget-summary-cards .budget-card.total .amount').textContent = Format.currency(totalBudget);
        document.querySelector('.budget-summary-cards .budget-card.spent .amount').textContent = Format.currency(totalSpent);
        
        const remainingElement = document.querySelector('.budget-summary-cards .budget-card.remaining .amount');
        remainingElement.textContent = Format.currency(remaining);
        
        // Add/remove classes for positive/negative remaining
        if (remaining >= 0) {
            remainingElement.classList.add('positive');
            remainingElement.classList.remove('negative');
        } else {
            remainingElement.classList.add('negative');
            remainingElement.classList.remove('positive');
        }
        
        // Update progress bar
        document.querySelector('.budget-summary-cards .budget-progress-bar').style.width = `${progressPercentage}%`;
        document.querySelector('.budget-summary-cards .budget-progress-label').textContent = `${progressPercentage}%`;
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
     * Initialize event listeners
     */
    initEventListeners() {
        // Add budget button
        const addBudgetBtn = document.getElementById('add-budget-btn');
        if (addBudgetBtn) {
            addBudgetBtn.addEventListener('click', () => {
                this.openBudgetModal();
            });
        }
        
        // Month and year change event
        const budgetMonth = document.getElementById('budget-month');
        const budgetYear = document.getElementById('budget-year');
        
        if (budgetMonth && budgetYear) {
            budgetMonth.addEventListener('change', () => {
                this.data.currentMonth = parseInt(budgetMonth.value);
                this.updateBudgetData();
            });
            
            budgetYear.addEventListener('change', () => {
                this.data.currentYear = parseInt(budgetYear.value);
                this.updateBudgetData();
            });
        }
        
        // Budget form submission
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveBudget();
            });
        }
    },
    
    /**
     * Update budget data based on selected month/year
     */
    updateBudgetData() {
        // In a real application, this would fetch new data for the selected period
        // For demo purposes, we'll just update the UI with current data
        this.populateBudgetCategories();
    },
    
    /**
     * Open budget modal
     */
    openBudgetModal() {
        // Reset form
        const budgetForm = document.getElementById('budget-form');
        if (budgetForm) {
            budgetForm.reset();
        }
        
        // Populate budget category select
        this.populateBudgetCategorySelect();
        
        // Open modal
        UI.openModal('budget-modal');
    },
    
    /**
     * Populate budget category select
     */
    populateBudgetCategorySelect() {
        const budgetCategorySelect = document.getElementById('budget-category');
        if (!budgetCategorySelect || !this.data.categories) return;
        
        // Clear existing options
        budgetCategorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
        
        // Add expense categories
        if (this.data.categories.expense && this.data.categories.expense.length > 0) {
            this.data.categories.expense.forEach(category => {
                // Check if budget already exists for this category
                const existingBudget = this.data.budgets.find(b => b.category === category.name);
                
                // Only add categories that don't already have a budget
                if (!existingBudget) {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    budgetCategorySelect.appendChild(option);
                }
            });
        }
        
        // Show message if all categories have budgets
        if (budgetCategorySelect.options.length === 1) {
            const option = document.createElement('option');
            option.value = "";
            option.disabled = true;
            option.textContent = "All categories have budgets";
            budgetCategorySelect.appendChild(option);
        }
    },
    
    /**
     * Save budget
     */
    async saveBudget() {
        try {
            // Get form values
            const category = document.getElementById('budget-category').value;
            const amount = parseFloat(document.getElementById('budget-amount').value);
            const period = document.getElementById('budget-period').value;
            
            // Create budget object
            const newBudget = {
                id: this.data.budgets.length + 1, // In a real app, this would be generated by the server
                category: category,
                allocated: amount,
                spent: 0.00,
                period: period
            };
            
            // In a real app, this would be sent to the server
            // For demo purposes, we'll just add it to our local data
            this.data.budgets.push(newBudget);
            
            // Close modal
            UI.closeModal('budget-modal');
            
            // Show success message
            UI.showToast('Budget saved successfully', 'success');
            
            // Refresh budget categories
            this.populateBudgetCategories();
            
            return true;
        } catch (error) {
            console.error('Error saving budget:', error);
            UI.showToast('Failed to save budget', 'error');
            return false;
        }
    }
};

// Initialize budget page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="budget"]', function() {
    setTimeout(() => {
        Budget.init();
    }, 100);
});

// Also initialize if we're starting on the budget page
document.addEventListener('DOMContentLoaded', function() {
    const budgetPage = document.getElementById('budget');
    if (budgetPage && budgetPage.classList.contains('active')) {
        Budget.init();
    }
});

// Export budget module
window.Budget = Budget;