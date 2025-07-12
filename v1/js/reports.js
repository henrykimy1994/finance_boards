/**
 * FinSmart - Reports Page
 * This file contains functionality specific to the reports page
 */

const Reports = {
    // Store for reports data
    data: {
        transactions: [],
        income: [],
        expenses: [],
        categories: null,
        period: 'year',
        activeReport: 'income-expense'
    },
    
    /**
     * Initialize reports page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderReportsPage();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing reports:', error);
            UI.showToast('Failed to load reports data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const reportsPage = document.getElementById('reports');
        if (!reportsPage) return;
        
        reportsPage.innerHTML = `
            <div class="reports-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading reports data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.reports-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Fetch reports data
     */
    async fetchData() {
        try {
            // Fetch all required data in parallel
            const [transactions, categories, charts] = await Promise.all([
                API.get('transactions'),
                API.get('categories'),
                API.get('charts')
            ]);
            
            // Store the data
            this.data.transactions = transactions;
            this.data.categories = categories;
            
            // Process income and expense data
            this.data.income = transactions.filter(t => t.type === 'income');
            this.data.expenses = transactions.filter(t => t.type === 'expense');
            
            // Store chart data
            this.data.monthlyIncome = charts.monthlyIncome;
            this.data.monthlySpending = charts.monthlySpending;
            
            return true;
        } catch (error) {
            console.error('Error fetching reports data:', error);
            throw error;
        }
    },
    
    /**
     * Render reports page
     */
    renderReportsPage() {
        const reportsPage = document.getElementById('reports');
        if (!reportsPage) return;
        
        // Create page structure
        reportsPage.innerHTML = `
            <div class="page-header">
                <h2>Financial Reports</h2>
                <div class="date-filter">
                    <select id="report-period">
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year" selected>This Year</option>
                    </select>
                </div>
            </div>

            <div class="reports-container">
                <div class="reports-sidebar card">
                    <ul class="report-types">
                        <li class="active" data-report="income-expense">Income vs. Expense</li>
                        <li data-report="category-breakdown">Category Breakdown</li>
                        <li data-report="monthly-comparison">Monthly Comparison</li>
                        <li data-report="savings-analysis">Savings Analysis</li>
                        <li data-report="spending-trends">Spending Trends</li>
                        <li data-report="net-worth">Net Worth</li>
                    </ul>
                    <button id="export-report" class="export-btn">
                        <i class="fas fa-file-export"></i> Export Report
                    </button>
                </div>

                <div class="report-content card">
                    <!-- Income vs. Expense Report -->
                    <div class="report active" id="income-expense-report">
                        <h3>Income vs. Expense</h3>
                        <div class="chart-container">
                            <canvas id="income-expense-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Category Breakdown Report -->
                    <div class="report" id="category-breakdown-report">
                        <h3>Category Breakdown</h3>
                        <div class="chart-container">
                            <canvas id="category-breakdown-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Monthly Comparison Report -->
                    <div class="report" id="monthly-comparison-report">
                        <h3>Monthly Comparison</h3>
                        <div class="chart-container">
                            <canvas id="monthly-comparison-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Savings Analysis Report -->
                    <div class="report" id="savings-analysis-report">
                        <h3>Savings Analysis</h3>
                        <div class="chart-container">
                            <canvas id="savings-analysis-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Spending Trends Report -->
                    <div class="report" id="spending-trends-report">
                        <h3>Spending Trends</h3>
                        <div class="chart-container">
                            <canvas id="spending-trends-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Net Worth Report -->
                    <div class="report" id="net-worth-report">
                        <h3>Net Worth</h3>
                        <div class="chart-container">
                            <canvas id="net-worth-chart"></canvas>
                        </div>
                        <div class="report-summary">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize the active report
        this.initActiveReport();
    },
    
    /**
     * Initialize the active report
     */
    initActiveReport() {
        switch (this.data.activeReport) {
            case 'income-expense':
                this.initIncomeExpenseReport();
                break;
            case 'category-breakdown':
                this.initCategoryBreakdownReport();
                break;
            case 'monthly-comparison':
                this.initMonthlyComparisonReport();
                break;
            case 'savings-analysis':
                this.initSavingsAnalysisReport();
                break;
            case 'spending-trends':
                this.initSpendingTrendsReport();
                break;
            case 'net-worth':
                this.initNetWorthReport();
                break;
            default:
                this.initIncomeExpenseReport();
        }
    },
    
    /**
     * Initialize Income vs. Expense report
     */
    initIncomeExpenseReport() {
        const ctx = document.getElementById('income-expense-chart');
        const summaryContainer = document.querySelector('#income-expense-report .report-summary');
        
        if (!ctx || !summaryContainer) return;
        
        // Prepare data for chart
        const months = this.data.monthlySpending.map(item => item.month);
        const spending = this.data.monthlySpending.map(item => item.amount);
        const income = this.data.monthlyIncome.map(item => item.amount);
        
        // Calculate savings data (income - spending)
        const savings = income.map((inc, index) => inc - spending[index]);
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: income,
                    backgroundColor: '#10b981',
                    borderWidth: 0,
                    borderRadius: 4
                },
                {
                    label: 'Expenses',
                    data: spending,
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    borderRadius: 4
                },
                {
                    label: 'Savings',
                    data: savings,
                    backgroundColor: '#3b82f6',
                    borderWidth: 0,
                    borderRadius: 4
                }
            ]
        };
        
        // Create chart
        Components.createBarChart('income-expense-chart', data);
        
        // Calculate summary data
        const totalIncome = income.reduce((sum, val) => sum + val, 0);
        const totalExpenses = spending.reduce((sum, val) => sum + val, 0);
        const totalSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
        
        // Update summary
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h4>Total Income</h4>
                <p>${Format.currency(totalIncome)}</p>
            </div>
            <div class="summary-item">
                <h4>Total Expenses</h4>
                <p>${Format.currency(totalExpenses)}</p>
            </div>
            <div class="summary-item">
                <h4>Net Savings</h4>
                <p class="${totalSavings >= 0 ? 'positive' : 'negative'}">${Format.currency(totalSavings)}</p>
            </div>
            <div class="summary-item">
                <h4>Savings Rate</h4>
                <p>${savingsRate.toFixed(1)}%</p>
            </div>
        `;
    },
    
    /**
     * Initialize Category Breakdown report
     */
    initCategoryBreakdownReport() {
        const ctx = document.getElementById('category-breakdown-chart');
        const summaryContainer = document.querySelector('#category-breakdown-report .report-summary');
        
        if (!ctx || !summaryContainer || !this.data.expenses) return;
        
        // Group expenses by category
        const categoryExpenses = {};
        let totalExpenses = 0;
        
        this.data.expenses.forEach(expense => {
            const amount = Math.abs(expense.amount);
            totalExpenses += amount;
            
            if (!categoryExpenses[expense.category]) {
                categoryExpenses[expense.category] = 0;
            }
            
            categoryExpenses[expense.category] += amount;
        });
        
        // Sort categories by amount (highest first)
        const sortedCategories = Object.keys(categoryExpenses).sort((a, b) => {
            return categoryExpenses[b] - categoryExpenses[a];
        });
        
        // Get top 5 categories and group the rest as "Other"
        const topCategories = sortedCategories.slice(0, 5);
        const otherCategories = sortedCategories.slice(5);
        
        // Calculate "Other" total
        let otherTotal = 0;
        otherCategories.forEach(category => {
            otherTotal += categoryExpenses[category];
        });
        
        // Prepare data for chart
        const labels = [...topCategories];
        const values = topCategories.map(category => categoryExpenses[category]);
        const colors = topCategories.map(category => {
            const categoryInfo = this.findCategory(category, 'expense');
            return categoryInfo ? categoryInfo.color : '#9E9E9E';
        });
        
        // Add "Other" if there are more than 5 categories
        if (otherCategories.length > 0) {
            labels.push('Other');
            values.push(otherTotal);
            colors.push('#9E9E9E');
        }
        
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
        Components.createDoughnutChart('category-breakdown-chart', data, {
            cutout: '65%',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = Math.round((value / totalExpenses) * 100);
                            return `${context.label}: ${Format.currency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        });
        
        // Update summary
        summaryContainer.innerHTML = '';
        
        // Create summary items for each category
        labels.forEach((category, index) => {
            const amount = values[index];
            const percentage = Math.round((amount / totalExpenses) * 100);
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <h4>${category}</h4>
                <p>${Format.currency(amount)} (${percentage}%)</p>
                <div class="category-bar-container">
                    <div class="category-bar" style="width: ${percentage}%; background-color: ${colors[index]}"></div>
                </div>
            `;
            
            summaryContainer.appendChild(summaryItem);
        });
    },
    
    /**
     * Initialize Monthly Comparison report
     */
    initMonthlyComparisonReport() {
        const ctx = document.getElementById('monthly-comparison-chart');
        const summaryContainer = document.querySelector('#monthly-comparison-report .report-summary');
        
        if (!ctx || !summaryContainer) return;
        
        // Prepare data for chart
        const months = this.data.monthlySpending.map(item => item.month);
        const spending = this.data.monthlySpending.map(item => item.amount);
        
        // Calculate month-over-month changes
        const monthlyChanges = [];
        for (let i = 1; i < spending.length; i++) {
            if (spending[i] === 0 || spending[i-1] === 0) {
                monthlyChanges.push(0);
            } else {
                const change = ((spending[i] - spending[i-1]) / spending[i-1]) * 100;
                monthlyChanges.push(change);
            }
        }
        
        // Add 0 for the first month (no previous month to compare)
        monthlyChanges.unshift(0);
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [
                {
                    type: 'line',
                    label: 'Month-over-Month Change (%)',
                    data: monthlyChanges,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1',
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1'
                },
                {
                    type: 'bar',
                    label: 'Monthly Spending',
                    data: spending,
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    borderRadius: 4,
                    yAxisID: 'y'
                }
            ]
        };
        
        // Create chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return Format.currency(value, true);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Spending Amount',
                        color: '#6b7280'
                    }
                },
                y1: {
                    beginAtZero: false,
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Month-over-Month Change',
                        color: '#6b7280'
                    }
                }
            }
        };
        
        // Create chart (using native Chart.js for this complex chart)
        if (window.monthlyComparisonChart) {
            window.monthlyComparisonChart.destroy();
        }
        
        window.monthlyComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
        
        // Calculate summary data
        const averageSpending = spending.reduce((sum, val) => sum + val, 0) / spending.length;
        const maxSpending = Math.max(...spending);
        const maxSpendingMonth = months[spending.indexOf(maxSpending)];
        const minSpending = Math.min(...spending.filter(val => val > 0));
        const minSpendingMonth = months[spending.indexOf(minSpending)];
        
        // Update summary
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h4>Average Monthly Spending</h4>
                <p>${Format.currency(averageSpending)}</p>
            </div>
            <div class="summary-item">
                <h4>Highest Spending Month</h4>
                <p>${maxSpendingMonth} (${Format.currency(maxSpending)})</p>
            </div>
            <div class="summary-item">
                <h4>Lowest Spending Month</h4>
                <p>${minSpendingMonth} (${Format.currency(minSpending)})</p>
            </div>
        `;
    },
    
    /**
     * Initialize Savings Analysis report
     */
    initSavingsAnalysisReport() {
        const ctx = document.getElementById('savings-analysis-chart');
        const summaryContainer = document.querySelector('#savings-analysis-report .report-summary');
        
        if (!ctx || !summaryContainer) return;
        
        // Prepare data for chart
        const months = this.data.monthlySpending.map(item => item.month);
        const spending = this.data.monthlySpending.map(item => item.amount);
        const income = this.data.monthlyIncome.map(item => item.amount);
        
        // Calculate savings and savings rate
        const savings = [];
        const savingsRate = [];
        
        for (let i = 0; i < income.length; i++) {
            const monthSavings = income[i] - spending[i];
            savings.push(monthSavings);
            
            const rate = income[i] > 0 ? (monthSavings / income[i]) * 100 : 0;
            savingsRate.push(rate);
        }
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [
                {
                    type: 'bar',
                    label: 'Monthly Savings',
                    data: savings,
                    backgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    borderWidth: 0,
                    borderRadius: 4,
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'Savings Rate (%)',
                    data: savingsRate,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1',
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1'
                }
            ]
        };
        
        // Create chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return Format.currency(value, true);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Savings Amount',
                        color: '#6b7280'
                    }
                },
                y1: {
                    beginAtZero: true,
                    type: 'linear',
                    position: 'right',
                    max: 100,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Savings Rate',
                        color: '#6b7280'
                    }
                }
            }
        };
        
        // Create chart (using native Chart.js for this complex chart)
        if (window.savingsAnalysisChart) {
            window.savingsAnalysisChart.destroy();
        }
        
        window.savingsAnalysisChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
        
        // Calculate summary data
        const totalSavings = savings.reduce((sum, val) => sum + val, 0);
        const averageSavingsRate = savingsRate.reduce((sum, val) => sum + val, 0) / savingsRate.length;
        const positiveSavingsMonths = savings.filter(val => val > 0).length;
        const savingsPercentage = (positiveSavingsMonths / savings.length) * 100;
        
        // Update summary
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h4>Total Savings</h4>
                <p class="${totalSavings >= 0 ? 'positive' : 'negative'}">${Format.currency(totalSavings)}</p>
            </div>
            <div class="summary-item">
                <h4>Average Savings Rate</h4>
                <p>${averageSavingsRate.toFixed(1)}%</p>
            </div>
            <div class="summary-item">
                <h4>Positive Savings Months</h4>
                <p>${positiveSavingsMonths} of ${savings.length} (${savingsPercentage.toFixed(0)}%)</p>
            </div>
        `;
    },
    
    /**
     * Initialize Spending Trends report
     */
    initSpendingTrendsReport() {
        const ctx = document.getElementById('spending-trends-chart');
        const summaryContainer = document.querySelector('#spending-trends-report .report-summary');
        
        if (!ctx || !summaryContainer || !this.data.expenses) return;
        
        // Group expenses by month and category
        const monthlyCategories = {};
        const categories = new Set();
        
        this.data.expenses.forEach(expense => {
            const date = new Date(expense.date);
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const category = expense.category;
            const amount = Math.abs(expense.amount);
            
            if (!monthlyCategories[month]) {
                monthlyCategories[month] = {};
            }
            
            if (!monthlyCategories[month][category]) {
                monthlyCategories[month][category] = 0;
            }
            
            monthlyCategories[month][category] += amount;
            categories.add(category);
        });
        
        // Sort months chronologically
        const months = Object.keys(monthlyCategories).sort((a, b) => {
            const monthOrder = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
                               'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
            return monthOrder[a] - monthOrder[b];
        });
        
        // Get top categories by total spending
        const categoryTotals = {};
        categories.forEach(category => {
            categoryTotals[category] = 0;
            
            months.forEach(month => {
                if (monthlyCategories[month][category]) {
                    categoryTotals[category] += monthlyCategories[month][category];
                }
            });
        });
        
        // Sort categories by total spending and get top 5
        const topCategories = Object.keys(categoryTotals)
            .sort((a, b) => categoryTotals[b] - categoryTotals[a])
            .slice(0, 5);
        
        // Prepare datasets for each top category
        const datasets = topCategories.map(category => {
            const categoryInfo = this.findCategory(category, 'expense');
            const color = categoryInfo ? categoryInfo.color : '#9E9E9E';
            
            const data = months.map(month => {
                return monthlyCategories[month][category] || 0;
            });
            
            return {
                label: category,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                tension: 0.3,
                fill: false,
                pointRadius: 4
            };
        });
        
        // Create chart data
        const data = {
            labels: months,
            datasets: datasets
        };
        
        // Create chart
        Components.createLineChart('spending-trends-chart', data);
        
        // Update summary
        summaryContainer.innerHTML = '';
        
        // Create summary items for each top category
        topCategories.forEach(category => {
            const totalSpent = categoryTotals[category];
            const categoryInfo = this.findCategory(category, 'expense');
            const color = categoryInfo ? categoryInfo.color : '#9E9E9E';
            
            // Calculate trend (simplified)
            let trend = 'Stable';
            let trendIcon = 'fa-minus';
            let trendClass = '';
            
            // Compare last two months if available
            if (months.length >= 2) {
                const lastMonth = months[months.length - 1];
                const previousMonth = months[months.length - 2];
                
                const lastMonthAmount = monthlyCategories[lastMonth][category] || 0;
                const previousMonthAmount = monthlyCategories[previousMonth][category] || 0;
                
                if (previousMonthAmount > 0) {
                    const changePercent = ((lastMonthAmount - previousMonthAmount) / previousMonthAmount) * 100;
                    
                    if (changePercent > 10) {
                        trend = 'Increasing';
                        trendIcon = 'fa-arrow-up';
                        trendClass = 'negative'; // Increasing spending is negative
                    } else if (changePercent < -10) {
                        trend = 'Decreasing';
                        trendIcon = 'fa-arrow-down';
                        trendClass = 'positive'; // Decreasing spending is positive
                    }
                }
            }
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <h4>${category}</h4>
                <p>${Format.currency(totalSpent)}</p>
                <p class="trend ${trendClass}"><i class="fas ${trendIcon}"></i> ${trend}</p>
            `;
            
            summaryContainer.appendChild(summaryItem);
        });
    },
    
    /**
     * Initialize Net Worth report
     */
    initNetWorthReport() {
        const ctx = document.getElementById('net-worth-chart');
        const summaryContainer = document.querySelector('#net-worth-report .report-summary');
        
        if (!ctx || !summaryContainer) return;
        
        // This is a simplified net worth calculation
        // In a real app, this would include assets, liabilities, investments, etc.
        
        // Mock net worth data - in a real app, this would be calculated from actual data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const assets = [95000, 96200, 97500, 98600, 100200, 102000];
        const liabilities = [58000, 57500, 57000, 56200, 55500, 54800];
        const netWorth = assets.map((asset, index) => asset - liabilities[index]);
        
        // Create chart data
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Assets',
                    data: assets,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'Liabilities',
                    data: liabilities,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'Net Worth',
                    data: netWorth,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#6366f1'
                }
            ]
        };
        
        // Create chart
        Components.createLineChart('net-worth-chart', data);
        
        // Calculate summary data
        const currentAssets = assets[assets.length - 1];
        const currentLiabilities = liabilities[liabilities.length - 1];
        const currentNetWorth = currentAssets - currentLiabilities;
        
        // Calculate change over period
        const startNetWorth = netWorth[0];
        const netWorthChange = currentNetWorth - startNetWorth;
        const netWorthChangePercent = (netWorthChange / startNetWorth) * 100;
        
        // Update summary
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h4>Current Net Worth</h4>
                <p>${Format.currency(currentNetWorth)}</p>
            </div>
            <div class="summary-item">
                <h4>Total Assets</h4>
                <p>${Format.currency(currentAssets)}</p>
            </div>
            <div class="summary-item">
                <h4>Total Liabilities</h4>
                <p>${Format.currency(currentLiabilities)}</p>
            </div>
            <div class="summary-item">
                <h4>Net Worth Change</h4>
                <p class="${netWorthChange >= 0 ? 'positive' : 'negative'}">
                    ${Format.currency(netWorthChange)} (${netWorthChangePercent.toFixed(1)}%)
                </p>
            </div>
        `;
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
        // Report type selection
        delegate(document, 'click', '.report-types li', (e) => {
            // Update active report type
            document.querySelectorAll('.report-types li').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Get selected report type
            const reportType = e.target.getAttribute('data-report');
            this.data.activeReport = reportType;
            
            // Show corresponding report
            document.querySelectorAll('.report').forEach(report => {
                report.classList.remove('active');
            });
            document.getElementById(`${reportType}-report`).classList.add('active');
            
            // Initialize the selected report
            this.initActiveReport();
        });
        
        // Report period selector
        const reportPeriod = document.getElementById('report-period');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', () => {
                this.data.period = reportPeriod.value;
                this.updateReportData();
            });
        }
        
        // Export report button
        const exportReport = document.getElementById('export-report');
        if (exportReport) {
            exportReport.addEventListener('click', () => {
                this.exportReport();
            });
        }
    },
    
    /**
     * Update report data based on selected period
     */
    updateReportData() {
        // In a real application, this would fetch new data for the selected period
        // For demo purposes, we'll just refresh the active report
        
        UI.showToast(`Report updated for ${this.data.period}`, 'info');
        
        // Refresh active report
        this.initActiveReport();
    },
    
    /**
     * Export the current report
     */
    exportReport() {
        // In a real application, this would generate a PDF or CSV export
        // For demo purposes, we'll just show a toast message
        
        const reportNames = {
            'income-expense': 'Income vs. Expense',
            'category-breakdown': 'Category Breakdown',
            'monthly-comparison': 'Monthly Comparison',
            'savings-analysis': 'Savings Analysis',
            'spending-trends': 'Spending Trends',
            'net-worth': 'Net Worth'
        };
        
        const reportName = reportNames[this.data.activeReport] || 'Report';
        
        UI.showToast(`Exporting ${reportName} report. Download will start shortly.`, 'info');
        
        // Simulate download delay
        setTimeout(() => {
            UI.showToast(`${reportName} report exported successfully!`, 'success');
        }, 1500);
    }
};

// Initialize reports page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="reports"]', function() {
    setTimeout(() => {
        Reports.init();
    }, 100);
});

// Also initialize if we're starting on the reports page
document.addEventListener('DOMContentLoaded', function() {
    const reportsPage = document.getElementById('reports');
    if (reportsPage && reportsPage.classList.contains('active')) {
        Reports.init();
    }
});

// Export reports module
window.Reports = Reports;