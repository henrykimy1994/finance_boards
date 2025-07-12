/**
 * FinSmart - Debts Page
 * This file contains functionality specific to the debts page
 */

const Debts = {
    // Store for debts data
    data: {
        debts: [],
        payoffStrategy: 'avalanche' // 'avalanche' or 'snowball'
    },
    
    /**
     * Initialize debts page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Load debt modal template
            await this.loadDebtModal();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderDebtsPage();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing debts:', error);
            UI.showToast('Failed to load debts data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const debtsPage = document.getElementById('debts');
        if (!debtsPage) return;
        
        debtsPage.innerHTML = `
            <div class="debts-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading debts data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.debts-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Load debt modal template
     */
    async loadDebtModal() {
        try {
            // In a real application, this would be loaded from a separate template file
            // For demo purposes, we'll create it dynamically
            
            const modalsContainer = document.getElementById('modals-container');
            if (!modalsContainer) return;
            
            // Check if modal already exists
            if (document.getElementById('debt-modal')) return;
            
            // Create debt modal
            const debtModal = document.createElement('div');
            debtModal.className = 'modal';
            debtModal.id = 'debt-modal';
            
            debtModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Add Debt</h3>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-body">
                            <form id="debt-form">
                                <div class="form-group">
                                    <label for="debt-name">Debt Name</label>
                                    <input type="text" id="debt-name" placeholder="Enter debt name" required>
                                </div>
                                <div class="form-group">
                                    <label for="debt-type">Debt Type</label>
                                    <select id="debt-type" required>
                                        <option value="" disabled selected>Select type</option>
                                        <option value="loan">Loan</option>
                                        <option value="credit">Credit Card</option>
                                        <option value="mortgage">Mortgage</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="debt-total">Total Amount</label>
                                    <div class="amount-input">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="debt-total" placeholder="0.00" step="0.01" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="debt-remaining">Remaining Amount</label>
                                    <div class="amount-input">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="debt-remaining" placeholder="0.00" step="0.01" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="debt-interest">Interest Rate (%)</label>
                                    <input type="number" id="debt-interest" placeholder="0.0" step="0.1" required>
                                </div>
                                <div class="form-group">
                                    <label for="debt-payment">Minimum Payment</label>
                                    <div class="amount-input">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="debt-payment" placeholder="0.00" step="0.01" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="debt-due">Due Date</label>
                                    <input type="number" id="debt-due" min="1" max="31" placeholder="Day of month" required>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="cancel-btn close-modal">Cancel</button>
                                    <button type="submit" class="save-btn">Save Debt</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            modalsContainer.appendChild(debtModal);
            
            return true;
        } catch (error) {
            console.error('Error loading debt modal:', error);
            return false;
        }
    },
    
    /**
     * Fetch debts data
     */
    async fetchData() {
        try {
            // Fetch debts data
            const debts = await API.get('debts');
            
            // Store the data
            this.data.debts = debts;
            
            return true;
        } catch (error) {
            console.error('Error fetching debts data:', error);
            throw error;
        }
    },
    
    /**
     * Render debts page
     */
    renderDebtsPage() {
        const debtsPage = document.getElementById('debts');
        if (!debtsPage) return;
        
        // Calculate debt summaries
        const summaries = this.calculateDebtSummaries();
        
        // Create page structure
        debtsPage.innerHTML = `
            <div class="page-header">
                <h2>Debts</h2>
                <button class="add-btn" id="add-debt-btn">
                    <i class="fas fa-plus"></i>
                    <span>Add Debt</span>
                </button>
            </div>

            <div class="debt-summary-cards">
                <div class="debt-card total">
                    <div class="card-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="card-details">
                        <h3>Total Debt</h3>
                        <p class="amount">${Format.currency(summaries.totalDebt)}</p>
                    </div>
                </div>
                <div class="debt-card payment">
                    <div class="card-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="card-details">
                        <h3>Monthly Payment</h3>
                        <p class="amount">${Format.currency(summaries.monthlyPayment)}</p>
                    </div>
                </div>
                <div class="debt-card interest">
                    <div class="card-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="card-details">
                        <h3>Avg. Interest Rate</h3>
                        <p class="amount">${summaries.avgInterestRate.toFixed(1)}%</p>
                    </div>
                </div>
                <div class="debt-card payoff">
                    <div class="card-icon">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                    <div class="card-details">
                        <h3>Est. Payoff Time</h3>
                        <p class="amount">${summaries.payoffTime}</p>
                    </div>
                </div>
            </div>

            <div class="card table-card">
                <div class="table-responsive">
                    <table class="data-table debts-table">
                        <thead>
                            <tr>
                                <th>Debt Name</th>
                                <th>Type</th>
                                <th>Balance</th>
                                <th>Interest Rate</th>
                                <th>Minimum Payment</th>
                                <th>Due Date</th>
                                <th>Progress</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="debts-table-body">
                            <!-- Will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="payoff-strategy card">
                <div class="card-header">
                    <h3>Debt Payoff Strategy</h3>
                    <select id="payoff-strategy">
                        <option value="avalanche">Avalanche (Highest Interest First)</option>
                        <option value="snowball">Snowball (Smallest Balance First)</option>
                    </select>
                </div>
                <div class="card-body">
                    <div class="payoff-container">
                        <div class="payoff-chart">
                            <h4>Payoff Timeline</h4>
                            <div class="chart-container">
                                <canvas id="payoff-chart"></canvas>
                            </div>
                        </div>
                        <div class="payoff-steps">
                            <h4>Recommended Payoff Plan</h4>
                            <div id="payoff-steps">
                                <!-- Will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Populate debts table
        this.populateDebtsTable();
        
        // Set payoff strategy select value
        document.getElementById('payoff-strategy').value = this.data.payoffStrategy;
        
        // Update payoff plan
        this.updatePayoffPlan(this.data.payoffStrategy);
        
        // Initialize payoff chart
        this.initPayoffChart();
    },
    
    /**
     * Calculate debt summaries
     * @returns {object} - Summary statistics
     */
    calculateDebtSummaries() {
        if (!this.data.debts || this.data.debts.length === 0) {
            return {
                totalDebt: 0,
                monthlyPayment: 0,
                avgInterestRate: 0,
                payoffTime: 'N/A'
            };
        }
        
        // Calculate total debt
        const totalDebt = this.data.debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
        
        // Calculate total monthly payment
        const monthlyPayment = this.data.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        
        // Calculate average interest rate
        const avgInterestRate = this.data.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / this.data.debts.length;
        
        // Calculate estimated payoff time
        // This is a rough estimate - a real app would use a more sophisticated calculation
        let payoffTime = 'N/A';
        
        if (totalDebt > 0 && monthlyPayment > 0) {
            // Simplified calculation assuming average interest rate
            const monthlyRate = avgInterestRate / 100 / 12;
            let remainingDebt = totalDebt;
            let months = 0;
            
            // Simple simulation
            while (remainingDebt > 0 && months < 600) { // Cap at 50 years
                months++;
                remainingDebt = remainingDebt * (1 + monthlyRate) - monthlyPayment;
            }
            
            if (months < 600) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                
                if (years > 0) {
                    payoffTime = `${years} year${years !== 1 ? 's' : ''}`;
                    if (remainingMonths > 0) {
                        payoffTime += `, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                    }
                } else {
                    payoffTime = `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
                }
            } else {
                payoffTime = 'Over 50 years';
            }
        }
        
        return {
            totalDebt,
            monthlyPayment,
            avgInterestRate,
            payoffTime
        };
    },
    
    /**
     * Populate debts table
     */
    populateDebtsTable() {
        const debtsTableBody = document.getElementById('debts-table-body');
        if (!debtsTableBody || !this.data.debts) return;
        
        debtsTableBody.innerHTML = '';
        
        if (this.data.debts.length === 0) {
            // Show empty state
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="debts-empty">
                    <p>No debts found</p>
                    <button class="add-btn" id="empty-add-debt-btn">
                        <i class="fas fa-plus"></i>
                        <span>Add Debt</span>
                    </button>
                </td>
            `;
            debtsTableBody.appendChild(emptyRow);
            
            // Add event listener to empty state button
            const emptyAddBtn = document.getElementById('empty-add-debt-btn');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', () => {
                    UI.openModal('debt-modal');
                });
            }
            
            return;
        }
        
        // Populate table with debts
        this.data.debts.forEach(debt => {
            // Create table row
            const row = document.createElement('tr');
            
            // Determine debt type color and label
            let typeColor = '#9E9E9E';
            let typeBadge = 'Other';
            
            if (debt.type === 'loan') {
                typeColor = '#3b82f6';
                typeBadge = 'Loan';
            } else if (debt.type === 'credit') {
                typeColor = '#ef4444';
                typeBadge = 'Credit Card';
            } else if (debt.type === 'mortgage') {
                typeColor = '#10b981';
                typeBadge = 'Mortgage';
            }
            
            row.innerHTML = `
                <td>${debt.name}</td>
                <td><span class="debt-type-badge" style="background-color: ${typeColor}">${typeBadge}</span></td>
                <td>${Format.currency(debt.remainingAmount)}</td>
                <td>${debt.interestRate.toFixed(1)}%</td>
                <td>${Format.currency(debt.minimumPayment)}</td>
                <td>${Format.ordinalSuffix(parseInt(debt.dueDate))}</td>
                <td>
                    <div class="debt-progress-container">
                        <div class="debt-progress-bar" style="width: ${debt.progress}%"></div>
                    </div>
                </td>
                <td>
                    <div class="debt-actions">
                        <button class="action-btn payment" data-id="${debt.id}" title="Make Payment">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>
                        <button class="action-btn edit" data-id="${debt.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${debt.id}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            debtsTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        this.initDebtActions();
    },
    
    /**
     * Initialize event listeners for debt actions
     */
    initDebtActions() {
        // Payment buttons
        delegate(document, 'click', '.debt-actions .payment', (e) => {
            const debtId = parseInt(e.target.closest('.payment').getAttribute('data-id'));
            this.makePayment(debtId);
        });
        
        // Edit buttons
        delegate(document, 'click', '.debt-actions .edit', (e) => {
            const debtId = parseInt(e.target.closest('.edit').getAttribute('data-id'));
            this.editDebt(debtId);
        });
        
        // Delete buttons
        delegate(document, 'click', '.debt-actions .delete', (e) => {
            const debtId = parseInt(e.target.closest('.delete').getAttribute('data-id'));
            this.deleteDebt(debtId);
        });
    },
    
    /**
     * Initialize payoff chart
     */
    initPayoffChart() {
        const ctx = document.getElementById('payoff-chart');
        
        if (!ctx || !this.data.debts || this.data.debts.length === 0) return;
        
        // Sample data for demo - in a real app this would be calculated
        const months = ['Now', '6 mo', '12 mo', '18 mo', '24 mo', '30 mo', '36 mo', '42 mo'];
        const totalDebt = this.data.debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
        
        // Calculate a rough estimate for payoff projection
        // This is a simple approximation, a real app would use actual amortization calculations
        const monthlyPayment = this.data.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        const avgInterestRate = this.data.debts.length > 0 ? this.data.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / this.data.debts.length / 100 / 12 : 0; // Monthly rate
        
        // Simplified projection
        const debtData = [totalDebt];
        let currentDebt = totalDebt;
        
        for (let i = 1; i < 8; i++) {
            // Very simplified calculation: interest added, then payment subtracted
            const interest = currentDebt * avgInterestRate;
            currentDebt = currentDebt + interest - monthlyPayment;
            
            // Ensure we don't go below zero
            currentDebt = Math.max(0, currentDebt);
            debtData.push(currentDebt);
        }
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [{
                label: 'Total Debt',
                data: debtData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#ef4444'
            }]
        };
        
        // Create or update chart
        Components.createLineChart('payoff-chart', data);
    },
    
    /**
     * Update payoff plan based on selected strategy
     * @param {string} strategy - The payoff strategy ('avalanche' or 'snowball')
     */
    updatePayoffPlan(strategy) {
        const payoffStepsContainer = document.getElementById('payoff-steps');
        
        if (!payoffStepsContainer || !this.data.debts || this.data.debts.length === 0) return;
        
        payoffStepsContainer.innerHTML = '';
        
        // Sort debts based on strategy
        let sortedDebts = [...this.data.debts];
        
        if (strategy === 'avalanche') {
            // Sort by highest interest rate first
            sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
        } else if (strategy === 'snowball') {
            // Sort by smallest balance first
            sortedDebts.sort((a, b) => a.remainingAmount - b.remainingAmount);
        }
        
        // Create steps
        sortedDebts.forEach((debt, index) => {
            const step = document.createElement('div');
            step.className = 'payoff-step';
            
            step.innerHTML = `
                <div class="payoff-step-header">
                    <div class="payoff-step-title">Step ${index + 1}: ${debt.name}</div>
                    <div>${Format.currency(debt.remainingAmount)}</div>
                </div>
                <div class="payoff-step-description">
                    Pay minimum on all debts, then put extra money towards ${debt.name} (${debt.interestRate}% interest).
                </div>
            `;
            
            payoffStepsContainer.appendChild(step);
        });
    },
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Add debt button
        const addDebtBtn = document.getElementById('add-debt-btn');
        if (addDebtBtn) {
            addDebtBtn.addEventListener('click', () => {
                UI.openModal('debt-modal');
            });
        }
        
        // Payoff strategy selector
        const payoffStrategy = document.getElementById('payoff-strategy');
        if (payoffStrategy) {
            payoffStrategy.addEventListener('change', () => {
                this.data.payoffStrategy = payoffStrategy.value;
                this.updatePayoffPlan(payoffStrategy.value);
            });
        }
        
        // Debt form submission
        const debtForm = document.getElementById('debt-form');
        if (debtForm) {
            debtForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveDebt();
            });
        }
    },
    
    /**
     * Open debt modal
     * @param {object} debt - Optional debt object for editing
     */
    openDebtModal(debt = null) {
        // Reset form
        const debtForm = document.getElementById('debt-form');
        if (debtForm) {
            debtForm.reset();
        }
        
        // Change modal title for editing
        const modalTitle = document.querySelector('#debt-modal .modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = debt ? 'Edit Debt' : 'Add Debt';
        }
        
        // If debt is provided, populate form for editing
        if (debt) {
            document.getElementById('debt-name').value = debt.name;
            document.getElementById('debt-type').value = debt.type;
            document.getElementById('debt-total').value = debt.totalAmount;
            document.getElementById('debt-remaining').value = debt.remainingAmount;
            document.getElementById('debt-interest').value = debt.interestRate;
            document.getElementById('debt-payment').value = debt.minimumPayment;
            document.getElementById('debt-due').value = debt.dueDate;
        }
        
        // Open modal
        UI.openModal('debt-modal');
    },
    
    /**
     * Save debt (add or update)
     */
    async saveDebt() {
        try {
            // Get form values
            const name = document.getElementById('debt-name').value;
            const type = document.getElementById('debt-type').value;
            const totalAmount = parseFloat(document.getElementById('debt-total').value);
            const remainingAmount = parseFloat(document.getElementById('debt-remaining').value);
            const interestRate = parseFloat(document.getElementById('debt-interest').value);
            const minimumPayment = parseFloat(document.getElementById('debt-payment').value);
            const dueDate = document.getElementById('debt-due').value;
            
            // Calculate progress
            const progress = Math.round(((totalAmount - remainingAmount) / totalAmount) * 100);
            
            // Create debt object
            const debt = {
                id: this.data.debts.length + 1, // In a real app, this would be generated by the server
                name: name,
                type: type,
                totalAmount: totalAmount,
                remainingAmount: remainingAmount,
                interestRate: interestRate,
                minimumPayment: minimumPayment,
                dueDate: dueDate,
                progress: progress
            };
            
            // In a real app, this would be sent to the server
            // For demo purposes, we'll just add it to our local data
            this.data.debts.push(debt);
            
            // Close modal
            UI.closeModal('debt-modal');
            
            // Show success message
            UI.showToast('Debt saved successfully', 'success');
            
            // Refresh debts page
            this.renderDebtsPage();
            
            return true;
        } catch (error) {
            console.error('Error saving debt:', error);
            UI.showToast('Failed to save debt', 'error');
            return false;
        }
    },
    
    /**
     * Make payment on a debt
     * @param {number} debtId - ID of the debt to make payment on
     */
    makePayment(debtId) {
        // Find debt in data
        const debt = this.data.debts.find(d => d.id === debtId);
        
        if (!debt) return;
        
        // In a real app, this would open a payment form
        // For demo purposes, we'll just simulate a payment equal to the minimum payment
        
        // Create payment modal
        const paymentModal = Components.createModal({
            id: 'payment-modal',
            title: `Make Payment on ${debt.name}`,
            content: `
                <form id="payment-form">
                    <div class="form-group">
                        <label for="payment-amount">Payment Amount</label>
                        <div class="amount-input">
                            <span class="currency-symbol">$</span>
                            <input type="number" id="payment-amount" value="${debt.minimumPayment.toFixed(2)}" step="0.01" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="payment-date">Payment Date</label>
                        <input type="date" id="payment-date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="save-btn">Make Payment</button>
                    </div>
                </form>
            `,
            width: 400
        });
        
        // Show modal
        UI.openModal('payment-modal');
        
        // Handle form submission
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get payment amount
                const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
                
                // Update debt
                debt.remainingAmount = Math.max(0, debt.remainingAmount - paymentAmount);
                
                // Recalculate progress
                debt.progress = Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100);
                
                // Close modal
                UI.closeModal('payment-modal');
                
                // Show success message
                UI.showToast(`Payment of ${Format.currency(paymentAmount)} made successfully`, 'success');
                
                // Refresh debts page
                this.renderDebtsPage();
            });
        }
    },
    
    /**
     * Edit debt
     * @param {number} debtId - ID of the debt to edit
     */
    editDebt(debtId) {
        // Find debt in data
        const debt = this.data.debts.find(d => d.id === debtId);
        
        if (debt) {
            this.openDebtModal(debt);
        }
    },
    
    /**
     * Delete debt
     * @param {number} debtId - ID of the debt to delete
     */
    deleteDebt(debtId) {
        // In a real application, this would send a request to a server
        // For demo purposes, we'll just remove it from the local data
        const index = this.data.debts.findIndex(d => d.id === debtId);
        
        if (index !== -1) {
            // Confirm deletion
            if (confirm('Are you sure you want to delete this debt?')) {
                // Remove from data
                this.data.debts.splice(index, 1);
                
                // Show success message
                UI.showToast('Debt deleted successfully', 'success');
                
                // Refresh debts page
                this.renderDebtsPage();
            }
        }
    }
};

// Initialize debts page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="debts"]', function() {
    setTimeout(() => {
        Debts.init();
    }, 100);
});

// Also initialize if we're starting on the debts page
document.addEventListener('DOMContentLoaded', function() {
    const debtsPage = document.getElementById('debts');
    if (debtsPage && debtsPage.classList.contains('active')) {
        Debts.init();
    }
});

// Export debts module
window.Debts = Debts;