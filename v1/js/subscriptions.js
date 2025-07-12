/**
 * FinSmart - Subscriptions Page
 * This file contains functionality specific to the subscriptions page
 */

const Subscriptions = {
    // Store for subscriptions data
    data: {
        subscriptions: [],
        filters: {
            category: 'all',
            frequency: 'all',
            search: ''
        }
    },
    
    /**
     * Initialize subscriptions page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Load subscription modal template
            await this.loadSubscriptionModal();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderSubscriptionsPage();
            this.initFilters();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing subscriptions:', error);
            UI.showToast('Failed to load subscriptions data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const subscriptionsPage = document.getElementById('subscriptions');
        if (!subscriptionsPage) return;
        
        subscriptionsPage.innerHTML = `
            <div class="subscriptions-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading subscriptions data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.subscriptions-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Load subscription modal template
     */
    async loadSubscriptionModal() {
        try {
            // In a real application, this would be loaded from a separate template file
            // For demo purposes, we'll create it dynamically
            
            const modalsContainer = document.getElementById('modals-container');
            if (!modalsContainer) return;
            
            // Check if modal already exists
            if (document.getElementById('subscription-modal')) return;
            
            // Create subscription modal
            const subscriptionModal = document.createElement('div');
            subscriptionModal.className = 'modal';
            subscriptionModal.id = 'subscription-modal';
            
            subscriptionModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Add Subscription</h3>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-body">
                            <form id="subscription-form">
                                <div class="form-group">
                                    <label for="subscription-name">Subscription Name</label>
                                    <input type="text" id="subscription-name" placeholder="Enter subscription name" required>
                                </div>
                                <div class="form-group">
                                    <label for="subscription-amount">Amount</label>
                                    <div class="amount-input">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="subscription-amount" placeholder="0.00" step="0.01" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="subscription-category">Category</label>
                                    <select id="subscription-category" required>
                                        <option value="" disabled selected>Select category</option>
                                        <option value="Streaming">Streaming</option>
                                        <option value="Software">Software</option>
                                        <option value="Membership">Membership</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="subscription-frequency">Billing Frequency</label>
                                    <select id="subscription-frequency" required>
                                        <option value="monthly" selected>Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="subscription-date">Billing Date</label>
                                    <input type="number" id="subscription-date" min="1" max="31" placeholder="Day of month" required>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="cancel-btn close-modal">Cancel</button>
                                    <button type="submit" class="save-btn">Save Subscription</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            modalsContainer.appendChild(subscriptionModal);
            
            return true;
        } catch (error) {
            console.error('Error loading subscription modal:', error);
            return false;
        }
    },
    
    /**
     * Fetch subscriptions data
     */
    async fetchData() {
        try {
            // Fetch subscriptions data
            const subscriptions = await API.get('subscriptions');
            
            // Store the data
            this.data.subscriptions = subscriptions;
            
            return true;
        } catch (error) {
            console.error('Error fetching subscriptions data:', error);
            throw error;
        }
    },
    
    /**
     * Render subscriptions page
     */
    renderSubscriptionsPage() {
        const subscriptionsPage = document.getElementById('subscriptions');
        if (!subscriptionsPage) return;
        
        // Calculate subscription summaries
        const summaries = this.calculateSubscriptionSummaries();
        
        // Create page structure
        subscriptionsPage.innerHTML = `
            <div class="page-header">
                <h2>Subscriptions</h2>
                <button class="add-btn" id="add-subscription-btn">
                    <i class="fas fa-plus"></i>
                    <span>Add Subscription</span>
                </button>
            </div>

            <div class="subscription-summary-cards">
                <div class="subscription-card monthly">
                    <div class="card-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="card-details">
                        <h3>Monthly Total</h3>
                        <p class="amount">${Format.currency(summaries.monthlyTotal)}</p>
                    </div>
                </div>
                <div class="subscription-card due">
                    <div class="card-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="card-details">
                        <h3>Due This Week</h3>
                        <p class="amount">${Format.currency(summaries.dueThisWeek)}</p>
                    </div>
                </div>
                <div class="subscription-card active">
                    <div class="card-icon">
                        <i class="fas fa-list-ul"></i>
                    </div>
                    <div class="card-details">
                        <h3>Active Subscriptions</h3>
                        <p class="amount">${summaries.activeCount}</p>
                    </div>
                </div>
            </div>

            <div class="subscriptions-container">
                <div class="filter-bar">
                    <div class="search-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="subscriptions-search" placeholder="Search subscriptions...">
                    </div>
                    <div class="filter-controls">
                        <select id="subscription-category-filter">
                            <option value="all" selected>All Categories</option>
                            <option value="Streaming">Streaming</option>
                            <option value="Software">Software</option>
                            <option value="Membership">Membership</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                        <select id="subscription-frequency-filter">
                            <option value="all" selected>All Frequencies</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                <div class="subscriptions-grid" id="subscriptions-grid">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>
        `;
        
        // Populate subscriptions grid
        this.populateSubscriptionsGrid();
    },
    
    /**
     * Calculate subscription summaries
     * @returns {object} - Summary statistics
     */
    calculateSubscriptionSummaries() {
        if (!this.data.subscriptions || this.data.subscriptions.length === 0) {
            return {
                monthlyTotal: 0,
                dueThisWeek: 0,
                activeCount: 0
            };
        }
        
        // Calculate monthly total
        const monthlyTotal = this.data.subscriptions.reduce((sum, sub) => {
            // Convert quarterly and yearly subscriptions to monthly equivalent
            let monthlyAmount = sub.amount;
            if (sub.frequency === 'quarterly') {
                monthlyAmount = sub.amount / 3;
            } else if (sub.frequency === 'yearly') {
                monthlyAmount = sub.amount / 12;
            }
            return sum + monthlyAmount;
        }, 0);
        
        // Calculate due this week
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const daysInWeek = 7;
        
        // Calculate week end date
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(currentDay + daysInWeek);
        
        const dueThisWeek = this.data.subscriptions.reduce((sum, sub) => {
            const billingDay = parseInt(sub.billingDate);
            
            // Check if billing date falls within the next 7 days
            if (billingDay >= currentDay && billingDay <= currentDay + daysInWeek) {
                return sum + sub.amount;
            }
            return sum;
        }, 0);
        
        // Count active subscriptions
        const activeCount = this.data.subscriptions.length;
        
        return {
            monthlyTotal,
            dueThisWeek,
            activeCount
        };
    },
    
    /**
     * Populate subscriptions grid
     */
    populateSubscriptionsGrid() {
        const subscriptionsGrid = document.getElementById('subscriptions-grid');
        if (!subscriptionsGrid || !this.data.subscriptions) return;
        
        subscriptionsGrid.innerHTML = '';
        
        // Get filtered subscriptions
        const filteredSubscriptions = this.getFilteredSubscriptions();
        
        if (filteredSubscriptions.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'subscriptions-empty';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-repeat"></i>
                </div>
                <h3>No subscriptions found</h3>
                <p>Add your first subscription to start tracking your recurring expenses.</p>
                <button class="add-btn" id="empty-add-subscription-btn">
                    <i class="fas fa-plus"></i>
                    <span>Add Subscription</span>
                </button>
            `;
            
            subscriptionsGrid.appendChild(emptyState);
            
            // Add event listener to empty state button
            const emptyAddBtn = document.getElementById('empty-add-subscription-btn');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', () => {
                    UI.openModal('subscription-modal');
                });
            }
            
            return;
        }
        
        // Populate grid with subscriptions
        filteredSubscriptions.forEach(subscription => {
            // Format next payment date
            const nextPaymentDate = Format.date(subscription.nextPayment, 'short');
            
            // Create subscription box
            const subscriptionBox = document.createElement('div');
            subscriptionBox.className = 'subscription-box';
            
            subscriptionBox.innerHTML = `
                <div class="subscription-header">
                    <div class="subscription-logo">
                        <i class="fas ${subscription.icon}"></i>
                    </div>
                    <div class="subscription-title-container">
                        <h3>${subscription.name}</h3>
                        <div class="subscription-category">${subscription.category}</div>
                    </div>
                </div>
                <div class="subscription-price">${Format.currency(subscription.amount)}</div>
                <div class="subscription-frequency">Billed ${subscription.frequency}</div>
                <div class="subscription-info">
                    <div class="subscription-info-item">
                        <div class="subscription-info-label">Next Payment</div>
                        <div>${nextPaymentDate}</div>
                    </div>
                    <div class="subscription-info-item">
                        <div class="subscription-info-label">Billing Day</div>
                        <div>${Format.ordinalSuffix(parseInt(subscription.billingDate))}</div>
                    </div>
                </div>
                <div class="subscription-actions">
                    <button class="edit-subscription" data-id="${subscription.id}">Edit</button>
                    <button class="cancel-subscription" data-id="${subscription.id}">Cancel</button>
                </div>
            `;
            
            subscriptionsGrid.appendChild(subscriptionBox);
        });
        
        // Add event listeners to subscription actions
        this.initSubscriptionActions();
    },
    
    /**
     * Get filtered subscriptions based on current filters
     * @returns {Array} - Filtered subscriptions array
     */
    getFilteredSubscriptions() {
        if (!this.data.subscriptions) return [];
        
        return this.data.subscriptions.filter(subscription => {
            // Filter by category
            if (this.data.filters.category !== 'all' && subscription.category !== this.data.filters.category) {
                return false;
            }
            
            // Filter by frequency
            if (this.data.filters.frequency !== 'all' && subscription.frequency !== this.data.filters.frequency) {
                return false;
            }
            
            // Filter by search term
            if (this.data.filters.search && !subscription.name.toLowerCase().includes(this.data.filters.search.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    },
    
    /**
     * Initialize event listeners for subscription actions
     */
    initSubscriptionActions() {
        // Edit subscription buttons
        delegate(document, 'click', '.edit-subscription', (e) => {
            const subscriptionId = parseInt(e.target.getAttribute('data-id'));
            this.editSubscription(subscriptionId);
        });
        
        // Cancel subscription buttons
        delegate(document, 'click', '.cancel-subscription', (e) => {
            const subscriptionId = parseInt(e.target.getAttribute('data-id'));
            this.cancelSubscription(subscriptionId);
        });
    },
    
    /**
     * Initialize filters event listeners
     */
    initFilters() {
        // Category filter
        const categoryFilter = document.getElementById('subscription-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.data.filters.category = categoryFilter.value;
                this.populateSubscriptionsGrid();
            });
        }
        
        // Frequency filter
        const frequencyFilter = document.getElementById('subscription-frequency-filter');
        if (frequencyFilter) {
            frequencyFilter.addEventListener('change', () => {
                this.data.filters.frequency = frequencyFilter.value;
                this.populateSubscriptionsGrid();
            });
        }
        
        // Search filter
        const searchFilter = document.getElementById('subscriptions-search');
        if (searchFilter) {
            searchFilter.addEventListener('input', debounce(() => {
                this.data.filters.search = searchFilter.value;
                this.populateSubscriptionsGrid();
            }, 300));
        }
    },
    
    /**
     * Initialize general event listeners
     */
    initEventListeners() {
        // Add subscription button
        const addSubscriptionBtn = document.getElementById('add-subscription-btn');
        if (addSubscriptionBtn) {
            addSubscriptionBtn.addEventListener('click', () => {
                this.openSubscriptionModal();
            });
        }
        
        // Subscription form submission
        const subscriptionForm = document.getElementById('subscription-form');
        if (subscriptionForm) {
            subscriptionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSubscription();
            });
        }
    },
    
    /**
     * Open subscription modal
     * @param {object} subscription - Optional subscription object for editing
     */
    openSubscriptionModal(subscription = null) {
        // Reset form
        const subscriptionForm = document.getElementById('subscription-form');
        if (subscriptionForm) {
            subscriptionForm.reset();
        }
        
        // Change modal title for editing
        const modalTitle = document.querySelector('#subscription-modal .modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = subscription ? 'Edit Subscription' : 'Add Subscription';
        }
        
        // If subscription is provided, populate form for editing
        if (subscription) {
            document.getElementById('subscription-name').value = subscription.name;
            document.getElementById('subscription-amount').value = subscription.amount;
            document.getElementById('subscription-category').value = subscription.category;
            document.getElementById('subscription-frequency').value = subscription.frequency;
            document.getElementById('subscription-date').value = subscription.billingDate;
        }
        
        // Open modal
        UI.openModal('subscription-modal');
    },
    
    /**
     * Save subscription (add or update)
     */
    async saveSubscription() {
        try {
            // Get form values
            const name = document.getElementById('subscription-name').value;
            const amount = parseFloat(document.getElementById('subscription-amount').value);
            const category = document.getElementById('subscription-category').value;
            const frequency = document.getElementById('subscription-frequency').value;
            const billingDate = document.getElementById('subscription-date').value;
            
            // Calculate next payment date
            const currentDate = new Date();
            let nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(billingDate));
            
            // If billing date has passed this month, set to next month
            if (nextPaymentDate < currentDate) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
            
            // Determine icon based on category
            let icon = 'fa-credit-card';
            if (category === 'Streaming') icon = 'fa-film';
            if (category === 'Software') icon = 'fa-laptop';
            if (category === 'Membership') icon = 'fa-id-card';
            if (category === 'Entertainment') icon = 'fa-gamepad';
            
            // Create subscription object
            const subscription = {
                id: this.data.subscriptions.length + 1, // In a real app, this would be generated by the server
                name: name,
                category: category,
                amount: amount,
                frequency: frequency,
                billingDate: billingDate,
                icon: icon,
                nextPayment: nextPaymentDate.toISOString().split('T')[0]
            };
            
            // In a real app, this would be sent to the server
            // For demo purposes, we'll just add it to our local data
            this.data.subscriptions.push(subscription);
            
            // Close modal
            UI.closeModal('subscription-modal');
            
            // Show success message
            UI.showToast('Subscription saved successfully', 'success');
            
            // Refresh subscriptions grid and summary
            this.renderSubscriptionsPage();
            
            return true;
        } catch (error) {
            console.error('Error saving subscription:', error);
            UI.showToast('Failed to save subscription', 'error');
            return false;
        }
    },
    
    /**
     * Edit subscription
     * @param {number} subscriptionId - ID of the subscription to edit
     */
    editSubscription(subscriptionId) {
        // Find subscription in data
        const subscription = this.data.subscriptions.find(s => s.id === subscriptionId);
        
        if (subscription) {
            this.openSubscriptionModal(subscription);
        }
    },
    
    /**
     * Cancel subscription
     * @param {number} subscriptionId - ID of the subscription to cancel
     */
    cancelSubscription(subscriptionId) {
        // In a real application, this would send a request to a server
        // For demo purposes, we'll just remove it from the local data
        const index = this.data.subscriptions.findIndex(s => s.id === subscriptionId);
        
        if (index !== -1) {
            // Confirm cancellation
            if (confirm('Are you sure you want to cancel this subscription?')) {
                // Remove from data
                this.data.subscriptions.splice(index, 1);
                
                // Show success message
                UI.showToast('Subscription cancelled successfully', 'success');
                
                // Refresh subscriptions grid and summary
                this.renderSubscriptionsPage();
            }
        }
    }
};

// Initialize subscriptions page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="subscriptions"]', function() {
    setTimeout(() => {
        Subscriptions.init();
    }, 100);
});

// Also initialize if we're starting on the subscriptions page
document.addEventListener('DOMContentLoaded', function() {
    const subscriptionsPage = document.getElementById('subscriptions');
    if (subscriptionsPage && subscriptionsPage.classList.contains('active')) {
        Subscriptions.init();
    }
});

// Export subscriptions module
window.Subscriptions = Subscriptions;