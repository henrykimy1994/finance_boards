/**
 * FinSmart - Dashboard Page
 * This file contains functionality specific to the dashboard page
 */

const Dashboard = {
    // Store for dashboard data
    data: {
        summary: null,
        transactions: null,
        categories: null,
        subscriptions: null,
        sparklines: null,
        charts: null
    },
    
    /**
     * Initialize dashboard
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.initDateFilter();
            this.initDashboardSummary();
            this.generateSparklines();
            this.populateRecentTransactions();
            this.populateCurrentSubscriptions();
            this.initCategoryChart();
            this.initTrendChart();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            UI.showToast('Failed to load dashboard data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const dashboardEl = document.getElementById('dashboard');
        if (!dashboardEl) return;
        
        dashboardEl.innerHTML = `
            <div class="dashboard-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading dashboard data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.dashboard-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Fetch dashboard data
     */
    async fetchData() {
        try {
            // Fetch all required data in parallel
            const [summary, transactions, categories, subscriptions, charts] = await Promise.all([
                API.get('summary'),
                API.get('transactions'),
                API.get('categories'),
                API.get('subscriptions'),
                API.get('charts')
            ]);
            
            // Store the data
            this.data.summary = summary;
            this.data.transactions = transactions;
            this.data.categories = categories;
            this.data.subscriptions = subscriptions;
            this.data.sparklines = summary.sparklines;
            this.data.charts = charts;
            
            return true;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },
    
    /**
     * Initialize date filter
     */
    initDateFilter() {
        const dateRange = document.getElementById('date-range');
        
        if (dateRange) {
            dateRange.addEventListener('change', () => {
                // In a real app, this would fetch data for the selected period
                this.updateDashboardData(dateRange.value);
            });
        }
    },
    
    /**
     * Initialize dashboard summary cards
     */
    initDashboardSummary() {
        if (!this.data.summary) return;
        
        // Check if dashboard container exists
        const dashboardEl = document.getElementById('dashboard');
        if (!dashboardEl) return;
        
        // Create dashboard header
        const dashboardHeader = document.createElement('div');
        dashboardHeader.className = 'dashboard-header';
        dashboardHeader.innerHTML = `
            <div class="date-filter">
                <select id="date-range">
                    <option value="today">Today</option>
                    <option value="week" selected>This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
        `;
        
        // Create financial cards
        const financialCards = document.createElement('div');
        financialCards.className = 'financial-cards';
        
        // Income card
        const incomeCard = document.createElement('div');
        incomeCard.className = 'finance-card income';
        incomeCard.innerHTML = `
            <div class="card-content">
                <div class="card-info">
                    <h3>Income</h3>
                    <p class="amount">${Format.currency(this.data.summary.income)}</p>
                    <p class="trend positive"><i class="fas fa-arrow-up"></i> ${this.data.summary.incomeChange}% from last period</p>
                </div>
                <div class="card-icon">
                    <i class="fas fa-arrow-down"></i>
                </div>
            </div>
            <div class="card-chart" id="income-sparkline"></div>
        `;
        
        // Expenses card
        const expensesCard = document.createElement('div');
        expensesCard.className = 'finance-card expenses';
        expensesCard.innerHTML = `
            <div class="card-content">
                <div class="card-info">
                    <h3>Expenses</h3>
                    <p class="amount">${Format.currency(this.data.summary.expenses)}</p>
                    <p class="trend negative"><i class="fas fa-arrow-up"></i> ${this.data.summary.expensesChange}% from last period</p>
                </div>
                <div class="card-icon">
                    <i class="fas fa-arrow-up"></i>
                </div>
            </div>
            <div class="card-chart" id="expenses-sparkline"></div>
        `;
        
        // Savings card
        const savingsCard = document.createElement('div');
        savingsCard.className = 'finance-card savings';
        savingsCard.innerHTML = `
            <div class="card-content">
                <div class="card-info">
                    <h3>Savings</h3>
                    <p class="amount">${Format.currency(this.data.summary.savings)}</p>
                    <p class="trend positive"><i class="fas fa-arrow-up"></i> ${this.data.summary.savingsChange}% from last period</p>
                </div>
                <div class="card-icon">
                    <i class="fas fa-piggy-bank"></i>
                </div>
            </div>
            <div class="card-chart" id="savings-sparkline"></div>
        `;
        
        // Balance card
        const balanceCard = document.createElement('div');
        balanceCard.className = 'finance-card balance';
        balanceCard.innerHTML = `
            <div class="card-content">
                <div class="card-info">
                    <h3>Balance</h3>
                    <p class="amount">${Format.currency(this.data.summary.balance)}</p>
                    <p class="trend positive"><i class="fas fa-arrow-up"></i> ${this.data.summary.balanceChange}% from last period</p>
                </div>
                <div class="card-icon">
                    <i class="fas fa-wallet"></i>
                </div>
            </div>
            <div class="card-chart" id="balance-sparkline"></div>
        `;
        
        // Add cards to container
        financialCards.appendChild(incomeCard);
        financialCards.appendChild(expensesCard);
        financialCards.appendChild(savingsCard);
        financialCards.appendChild(balanceCard);
        
        // Create dashboard widgets
        const dashboardWidgets = document.createElement('div');
        dashboardWidgets.className = 'dashboard-widgets';
        
        // Spending by Category Widget
        const categorySpendingWidget = document.createElement('div');
        categorySpendingWidget.className = 'widget';
        categorySpendingWidget.id = 'category-spending-widget';
        categorySpendingWidget.innerHTML = `
            <div class="widget-header">
                <h3>Spending by Category</h3>
                <div class="widget-actions">
                    <select id="category-chart-period">
                        <option value="week">Weekly</option>
                        <option value="month" selected>Monthly</option>
                    </select>
                </div>
            </div>
            <div class="widget-body">
                <div class="chart-container">
                    <canvas id="category-chart"></canvas>
                </div>
                <div class="chart-legend" id="category-legend"></div>
            </div>
        `;
        
        // Spending Trend Widget
        const spendingTrendWidget = document.createElement('div');
        spendingTrendWidget.className = 'widget';
        spendingTrendWidget.id = 'spending-trend-widget';
        spendingTrendWidget.innerHTML = `
            <div class="widget-header">
                <h3>Spending vs Income</h3>
                <div class="widget-actions">
                    <select id="trend-chart-period">
                        <option value="week">Weekly</option>
                        <option value="month" selected>Monthly</option>
                        <option value="year">Yearly</option>
                    </select>
                </div>
            </div>
            <div class="widget-body">
                <div class="chart-container">
                    <canvas id="trend-chart"></canvas>
                </div>
            </div>
        `;
        
        // Recent Transactions Widget
        const recentTransactionsWidget = document.createElement('div');
        recentTransactionsWidget.className = 'widget';
        recentTransactionsWidget.id = 'recent-transactions-widget';
        recentTransactionsWidget.innerHTML = `
            <div class="widget-header">
                <h3>Recent Transactions</h3>
                <a href="#" class="view-all" data-target="transactions">View All</a>
            </div>
            <div class="widget-body">
                <div id="recent-transactions" class="transactions-list"></div>
            </div>
        `;
        
        // Monthly Subscriptions Widget
        const subscriptionsWidget = document.createElement('div');
        subscriptionsWidget.className = 'widget';
        subscriptionsWidget.id = 'subscriptions-widget';
        subscriptionsWidget.innerHTML = `
            <div class="widget-header">
                <h3>Monthly Subscriptions</h3>
                <a href="#" class="view-all" data-target="subscriptions">View All</a>
            </div>
            <div class="widget-body">
                <div id="current-subscriptions" class="subscriptions-list"></div>
            </div>
        `;
        
        // Add widgets to container
        dashboardWidgets.appendChild(categorySpendingWidget);
        dashboardWidgets.appendChild(spendingTrendWidget);
        dashboardWidgets.appendChild(recentTransactionsWidget);
        dashboardWidgets.appendChild(subscriptionsWidget);
        
        // Clear and append to dashboard
        dashboardEl.innerHTML = '';
        dashboardEl.appendChild(dashboardHeader);
        dashboardEl.appendChild(financialCards);
        dashboardEl.appendChild(dashboardWidgets);
        
        // Reinitialize event listeners for the new date range selector
        this.initDateFilter();
    },
    
    /**
     * Generate sparklines for dashboard cards
     */
    generateSparklines() {
        if (!this.data.sparklines) return;
        
        // In a real application, these would be generated using a charting library
        // For this demo, we'll just add a placeholder
        console.log('Sparklines would be generated here for:', this.data.sparklines);
    },
    
    /**
     * Populate recent transactions widget
     */
    populateRecentTransactions() {
        const recentTransactionsContainer = document.getElementById('recent-transactions');
        if (!recentTransactionsContainer || !this.data.transactions) return;
        
        recentTransactionsContainer.innerHTML = '';
        
        // Get only the 5 most recent transactions
        const recentTransactions = this.data.transactions.slice(0, 5);
        
        recentTransactions.forEach(transaction => {
            // Find category details
            let categoryType = transaction.type === 'income' ? 'income' : 'expense';
            let category = this.findCategory(transaction.category, categoryType);
            
            // Format date
            const formattedDate = Format.date(transaction.date, 'short');
            
            // Create transaction element
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            
            transactionElement.innerHTML = `
                <div class="transaction-icon" style="background-color: ${category ? category.color : '#9E9E9E'}">
                    <i class="fas ${category ? category.icon : 'fa-question'}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-meta">
                        <div class="transaction-category">${transaction.category}</div>
                        <div class="transaction-date">${formattedDate}</div>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">${Format.currency(transaction.amount)}</div>
            `;
            
            recentTransactionsContainer.appendChild(transactionElement);
        });
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
     * Populate current subscriptions widget
     */
    populateCurrentSubscriptions() {
        const currentSubscriptionsContainer = document.getElementById('current-subscriptions');
        if (!currentSubscriptionsContainer || !this.data.subscriptions) return;
        
        currentSubscriptionsContainer.innerHTML = '';
        
        // Get only the 4 upcoming subscriptions
        const currentSubscriptions = this.data.subscriptions.slice(0, 4);
        
        currentSubscriptions.forEach(subscription => {
            // Format date
            const formattedDate = Format.date(subscription.nextPayment, 'short');
            
            // Create subscription element
            const subscriptionElement = document.createElement('div');
            subscriptionElement.className = 'subscription-item';
            
            subscriptionElement.innerHTML = `
                <div class="subscription-icon">
                    <i class="fas ${subscription.icon}"></i>
                </div>
                <div class="subscription-details">
                    <div class="subscription-title">${subscription.name}</div>
                    <div class="subscription-meta">
                        <div class="subscription-date">Next: ${formattedDate}</div>
                        <div class="subscription-frequency">${subscription.frequency}</div>
                    </div>
                </div>
                <div class="subscription-amount">${Format.currency(subscription.amount)}</div>
            `;
            
            currentSubscriptionsContainer.appendChild(subscriptionElement);
        });
    },
    
    /**
     * Initialize category chart
     */
    initCategoryChart(period = 'month') {
        const ctx = document.getElementById('category-chart');
        const legendContainer = document.getElementById('category-legend');
        
        if (!ctx || !legendContainer || !this.data.charts || !this.data.charts.categories) return;
        
        // Get chart data for the selected period
        const chartData = this.data.charts.categories[period] || this.data.charts.categories.month;
        
        // Prepare data for chart
        const labels = chartData.labels;
        const values = chartData.values;
        const colors = chartData.colors;
        
        // Create chart data
        const data = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 4,
                spacing: 2
            }]
        };
        
        // Create chart
        Components.createDoughnutChart('category-chart', data);
        
        // Create custom legend
        Components.createChartLegend('category-legend', labels, colors);
        
        // Add event listener to chart period selector
        const categoryChartPeriod = document.getElementById('category-chart-period');
        if (categoryChartPeriod) {
            categoryChartPeriod.addEventListener('change', () => {
                this.initCategoryChart(categoryChartPeriod.value);
            });
        }
    },
    
    /**
     * Initialize trend chart
     */
    initTrendChart(period = 'month') {
        const ctx = document.getElementById('trend-chart');
        
        if (!ctx || !this.data.charts || !this.data.charts.trends) return;
        
        // Get chart data for the selected period
        const chartData = this.data.charts.trends[period] || this.data.charts.trends.month;
        
        // Prepare data for chart
        const months = chartData.labels;
        const spending = chartData.expenses;
        const income = chartData.income;
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: income,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981'
                },
                {
                    label: 'Expenses',
                    data: spending,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#ef4444'
                }
            ]
        };
        
        // Create chart
        Components.createLineChart('trend-chart', data);
        
        // Add event listener to chart period selector
        const trendChartPeriod = document.getElementById('trend-chart-period');
        if (trendChartPeriod) {
            trendChartPeriod.addEventListener('change', () => {
                this.initTrendChart(trendChartPeriod.value);
            });
        }
    },
    
    /**
     * Update dashboard data based on date range
     */
    updateDashboardData(dateRange) {
        // In a real application, this would fetch new data from the server
        // For demo purposes, we'll just refresh with the current data
        
        UI.showToast(`Dashboard updated for ${dateRange}`, 'info');
        
        // Refresh all widgets
        this.initDashboardSummary();
        this.populateRecentTransactions();
        this.initCategoryChart();
        this.initTrendChart();
    },
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Add transaction button
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                // This would be handled by the modal component
                UI.openModal('transaction-modal');
            });
        }
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    const dashboardPage = document.getElementById('dashboard');
    if (dashboardPage && dashboardPage.classList.contains('active')) {
        Dashboard.init();
    }
});

// Initialize dashboard when navigating to the page
delegate(document, 'click', '.sidebar-menu li[data-page="dashboard"]', function() {
    setTimeout(() => {
        Dashboard.init();
    }, 100);
});

// Export dashboard module
window.Dashboard = Dashboard;