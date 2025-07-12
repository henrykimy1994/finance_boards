/**
 * FinSmart - Settings Page
 * This file contains functionality specific to the settings page
 */

const Settings = {
    // Store for settings data
    data: {
        profile: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY'
        },
        activeSection: 'profile',
        categories: null,
        notifications: {
            transactionAlerts: true,
            budgetAlerts: true,
            billReminders: true,
            weeklyReports: false,
            savingsGoals: true,
            tips: true
        },
        preferences: {
            theme: 'light',
            language: 'en',
            startPage: 'dashboard',
            defaultView: 'monthly'
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            lastPasswordChange: '2025-01-15'
        }
    },
    
    /**
     * Initialize settings page
     */
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch data
            await this.fetchData();
            
            // Initialize UI components
            this.renderSettingsPage();
            this.initEventListeners();
            
            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing settings:', error);
            UI.showToast('Failed to load settings data. Please try again.', 'error');
            this.hideLoading();
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const settingsPage = document.getElementById('settings');
        if (!settingsPage) return;
        
        settingsPage.innerHTML = `
            <div class="settings-loading">
                <div class="spinner spinner-large"></div>
                <p>Loading settings data...</p>
            </div>
        `;
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.querySelector('.settings-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    /**
     * Fetch settings data
     */
    async fetchData() {
        try {
            // Fetch categories data (other settings data is stored locally)
            const categories = await API.get('categories');
            
            // Store the data
            this.data.categories = categories;
            
            return true;
        } catch (error) {
            console.error('Error fetching settings data:', error);
            throw error;
        }
    },
    
    /**
     * Render settings page
     */
    renderSettingsPage() {
        const settingsPage = document.getElementById('settings');
        if (!settingsPage) return;
        
        // Create page structure
        settingsPage.innerHTML = `
            <div class="page-header">
                <h2>Settings</h2>
            </div>

            <div class="settings-container">
                <div class="settings-sidebar card">
                    <ul class="settings-menu">
                        <li class="active" data-settings="profile">Profile</li>
                        <li data-settings="accounts">Accounts</li>
                        <li data-settings="categories">Categories</li>
                        <li data-settings="notifications">Notifications</li>
                        <li data-settings="preferences">Preferences</li>
                        <li data-settings="security">Security</li>
                        <li data-settings="data">Data Management</li>
                    </ul>
                </div>

                <div class="settings-content card">
                    <!-- Profile Settings -->
                    <div class="settings-section active" id="profile-settings">
                        <h3>Profile Settings</h3>
                        <form id="profile-form" class="settings-form">
                            <div class="form-group">
                                <label for="profile-name">Name</label>
                                <input type="text" id="profile-name" value="${this.data.profile.name}">
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" value="${this.data.profile.email}">
                            </div>
                            <div class="form-group">
                                <label for="profile-currency">Currency</label>
                                <select id="profile-currency">
                                    <option value="USD" ${this.data.profile.currency === 'USD' ? 'selected' : ''}>USD - US Dollar</option>
                                    <option value="EUR" ${this.data.profile.currency === 'EUR' ? 'selected' : ''}>EUR - Euro</option>
                                    <option value="GBP" ${this.data.profile.currency === 'GBP' ? 'selected' : ''}>GBP - British Pound</option>
                                    <option value="JPY" ${this.data.profile.currency === 'JPY' ? 'selected' : ''}>JPY - Japanese Yen</option>
                                    <option value="CAD" ${this.data.profile.currency === 'CAD' ? 'selected' : ''}>CAD - Canadian Dollar</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="profile-date-format">Date Format</label>
                                <select id="profile-date-format">
                                    <option value="MM/DD/YYYY" ${this.data.profile.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY" ${this.data.profile.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD" ${this.data.profile.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    <!-- Accounts Settings -->
                    <div class="settings-section" id="accounts-settings">
                        <h3>Connected Accounts</h3>
                        <div class="accounts-list">
                            <div class="account-item">
                                <div class="account-info">
                                    <div class="account-logo">
                                        <i class="fas fa-university"></i>
                                    </div>
                                    <div class="account-details">
                                        <h4>Bank of America</h4>
                                        <p>Checking ••••1234</p>
                                    </div>
                                </div>
                                <div class="account-actions">
                                    <button class="edit-account-btn">Edit</button>
                                    <button class="disconnect-account-btn">Disconnect</button>
                                </div>
                            </div>
                            <div class="account-item">
                                <div class="account-info">
                                    <div class="account-logo">
                                        <i class="fas fa-credit-card"></i>
                                    </div>
                                    <div class="account-details">
                                        <h4>Chase</h4>
                                        <p>Credit Card ••••5678</p>
                                    </div>
                                </div>
                                <div class="account-actions">
                                    <button class="edit-account-btn">Edit</button>
                                    <button class="disconnect-account-btn">Disconnect</button>
                                </div>
                            </div>
                        </div>
                        <button class="add-btn" id="add-account-btn">
                            <i class="fas fa-plus"></i>
                            <span>Connect New Account</span>
                        </button>
                    </div>

                    <!-- Categories Settings -->
                    <div class="settings-section" id="categories-settings">
                        <h3>Categories</h3>
                        <div class="category-tabs">
                            <button class="category-tab active" data-type="expense">Expense Categories</button>
                            <button class="category-tab" data-type="income">Income Categories</button>
                        </div>
                        <div class="category-content active" id="expense-categories">
                            <div class="category-list">
                                <!-- Will be populated with expense categories -->
                            </div>
                            <button class="add-btn" id="add-expense-category-btn">
                                <i class="fas fa-plus"></i>
                                <span>Add Expense Category</span>
                            </button>
                        </div>
                        <div class="category-content" id="income-categories">
                            <div class="category-list">
                                <!-- Will be populated with income categories -->
                            </div>
                            <button class="add-btn" id="add-income-category-btn">
                                <i class="fas fa-plus"></i>
                                <span>Add Income Category</span>
                            </button>
                        </div>
                    </div>

                    <!-- Notifications Settings -->
                    <div class="settings-section" id="notifications-settings">
                        <h3>Notifications Settings</h3>
                        <div class="notification-toggles">
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Transaction Alerts</h4>
                                    <p>Get notified about new transactions</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="transaction-alerts" ${this.data.notifications.transactionAlerts ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Budget Alerts</h4>
                                    <p>Get notified when you're close to budget limits</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="budget-alerts" ${this.data.notifications.budgetAlerts ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Bill Reminders</h4>
                                    <p>Get reminded about upcoming bills and subscriptions</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="bill-reminders" ${this.data.notifications.billReminders ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Weekly Reports</h4>
                                    <p>Receive weekly summary reports of your finances</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="weekly-reports" ${this.data.notifications.weeklyReports ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Savings Goals</h4>
                                    <p>Get updates on your savings goals progress</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="savings-goals" ${this.data.notifications.savingsGoals ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="notification-toggle">
                                <div class="notification-info">
                                    <h4>Tips & Recommendations</h4>
                                    <p>Receive personalized financial tips</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="tips" ${this.data.notifications.tips ? 'checked' : ''}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button id="save-notifications" class="save-btn">Save Changes</button>
                        </div>
                    </div>

                    <!-- Preferences Settings -->
                    <div class="settings-section" id="preferences-settings">
                        <h3>Preferences</h3>
                        <form id="preferences-form" class="settings-form">
                            <div class="form-group">
                                <label for="preferences-theme">Theme</label>
                                <select id="preferences-theme">
                                    <option value="light" ${this.data.preferences.theme === 'light' ? 'selected' : ''}>Light</option>
                                    <option value="dark" ${this.data.preferences.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                    <option value="system" ${this.data.preferences.theme === 'system' ? 'selected' : ''}>System Default</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="preferences-language">Language</label>
                                <select id="preferences-language">
                                    <option value="en" ${this.data.preferences.language === 'en' ? 'selected' : ''}>English</option>
                                    <option value="es" ${this.data.preferences.language === 'es' ? 'selected' : ''}>Spanish</option>
                                    <option value="fr" ${this.data.preferences.language === 'fr' ? 'selected' : ''}>French</option>
                                    <option value="de" ${this.data.preferences.language === 'de' ? 'selected' : ''}>German</option>
                                    <option value="ja" ${this.data.preferences.language === 'ja' ? 'selected' : ''}>Japanese</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="preferences-start-page">Default Start Page</label>
                                <select id="preferences-start-page">
                                    <option value="dashboard" ${this.data.preferences.startPage === 'dashboard' ? 'selected' : ''}>Dashboard</option>
                                    <option value="transactions" ${this.data.preferences.startPage === 'transactions' ? 'selected' : ''}>Transactions</option>
                                    <option value="budget" ${this.data.preferences.startPage === 'budget' ? 'selected' : ''}>Budget</option>
                                    <option value="reports" ${this.data.preferences.startPage === 'reports' ? 'selected' : ''}>Reports</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="preferences-default-view">Default View</label>
                                <select id="preferences-default-view">
                                    <option value="daily" ${this.data.preferences.defaultView === 'daily' ? 'selected' : ''}>Daily</option>
                                    <option value="weekly" ${this.data.preferences.defaultView === 'weekly' ? 'selected' : ''}>Weekly</option>
                                    <option value="monthly" ${this.data.preferences.defaultView === 'monthly' ? 'selected' : ''}>Monthly</option>
                                    <option value="yearly" ${this.data.preferences.defaultView === 'yearly' ? 'selected' : ''}>Yearly</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    <!-- Security Settings -->
                    <div class="settings-section" id="security-settings">
                        <h3>Security Settings</h3>
                        <form id="security-form" class="settings-form">
                            <div class="form-group">
                                <label for="current-password">Current Password</label>
                                <input type="password" id="current-password" placeholder="Enter your current password">
                            </div>
                            <div class="form-group">
                                <label for="new-password">New Password</label>
                                <input type="password" id="new-password" placeholder="Enter new password">
                            </div>
                            <div class="form-group">
                                <label for="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" placeholder="Confirm new password">
                            </div>
                            <div class="form-group">
                                <div class="toggle-row">
                                    <label for="two-factor-auth">Two-Factor Authentication</label>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="two-factor-auth" ${this.data.security.twoFactorAuth ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <p class="form-hint">Add an extra layer of security to your account</p>
                            </div>
                            <div class="form-group">
                                <label for="session-timeout">Session Timeout (minutes)</label>
                                <input type="number" id="session-timeout" value="${this.data.security.sessionTimeout}" min="5" max="120">
                                <p class="form-hint">Automatically log out after inactivity</p>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="save-btn">Update Security Settings</button>
                            </div>
                        </form>
                    </div>

                    <!-- Data Management Settings -->
                    <div class="settings-section" id="data-settings">
                        <h3>Data Management</h3>
                        <div class="data-management-options">
                            <div class="data-option">
                                <div class="data-option-info">
                                    <h4>Export Data</h4>
                                    <p>Download all your financial data as CSV or JSON</p>
                                </div>
                                <div class="data-option-actions">
                                    <button class="export-csv-btn">CSV</button>
                                    <button class="export-json-btn">JSON</button>
                                </div>
                            </div>
                            <div class="data-option">
                                <div class="data-option-info">
                                    <h4>Import Data</h4>
                                    <p>Upload transaction data from your bank or another app</p>
                                </div>
                                <div class="data-option-actions">
                                    <button class="import-data-btn">Upload File</button>
                                </div>
                            </div>
                            <div class="data-option">
                                <div class="data-option-info">
                                    <h4>Clear Data</h4>
                                    <p>Delete specific data from your account</p>
                                </div>
                                <div class="data-option-actions">
                                    <button class="clear-data-btn">Select Data</button>
                                </div>
                            </div>
                            <div class="data-option danger">
                                <div class="data-option-info">
                                    <h4>Delete Account</h4>
                                    <p>Permanently delete your account and all associated data</p>
                                </div>
                                <div class="data-option-actions">
                                    <button class="delete-account-btn">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Populate categories
        this.populateCategories();
    },
    
    /**
     * Populate categories in the settings
     */
    populateCategories() {
        if (!this.data.categories) return;
        
        // Populate expense categories
        const expenseCategoriesList = document.querySelector('#expense-categories .category-list');
        if (expenseCategoriesList && this.data.categories.expense) {
            expenseCategoriesList.innerHTML = '';
            
            this.data.categories.expense.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <div class="category-color" style="background-color: ${category.color}"></div>
                    <div class="category-name">${category.name}</div>
                    <div class="category-actions">
                        <button class="edit-category-btn" data-id="${category.id}" data-type="expense">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-category-btn" data-id="${category.id}" data-type="expense">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                expenseCategoriesList.appendChild(categoryItem);
            });
        }
        
        // Populate income categories
        const incomeCategoriesList = document.querySelector('#income-categories .category-list');
        if (incomeCategoriesList && this.data.categories.income) {
            incomeCategoriesList.innerHTML = '';
            
            this.data.categories.income.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';
                categoryItem.innerHTML = `
                    <div class="category-color" style="background-color: ${category.color}"></div>
                    <div class="category-name">${category.name}</div>
                    <div class="category-actions">
                        <button class="edit-category-btn" data-id="${category.id}" data-type="income">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-category-btn" data-id="${category.id}" data-type="income">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                
                incomeCategoriesList.appendChild(categoryItem);
            });
        }
    },
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Settings menu navigation
        delegate(document, 'click', '.settings-menu li', (e) => {
            // Update active menu item
            document.querySelectorAll('.settings-menu li').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Get selected settings section
            const settingsSection = e.target.getAttribute('data-settings');
            this.data.activeSection = settingsSection;
            
            // Show corresponding settings section
            document.querySelectorAll('.settings-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${settingsSection}-settings`).classList.add('active');
        });
        
        // Category tabs
        delegate(document, 'click', '.category-tab', (e) => {
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Get selected category type
            const categoryType = e.target.getAttribute('data-type');
            
            // Show corresponding category content
            document.querySelectorAll('.category-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${categoryType}-categories`).classList.add('active');
        });
        
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfileSettings();
            });
        }
        
        // Preferences form submission
        const preferencesForm = document.getElementById('preferences-form');
        if (preferencesForm) {
            preferencesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreferences();
            });
        }
        
        // Security form submission
        const securityForm = document.getElementById('security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSecuritySettings();
            });
        }
        
        // Save notifications button
        const saveNotificationsBtn = document.getElementById('save-notifications');
        if (saveNotificationsBtn) {
            saveNotificationsBtn.addEventListener('click', () => {
                this.saveNotificationSettings();
            });
        }
        
        // Add category buttons
        const addExpenseCategoryBtn = document.getElementById('add-expense-category-btn');
        if (addExpenseCategoryBtn) {
            addExpenseCategoryBtn.addEventListener('click', () => {
                this.addCategory('expense');
            });
        }
        
        const addIncomeCategoryBtn = document.getElementById('add-income-category-btn');
        if (addIncomeCategoryBtn) {
            addIncomeCategoryBtn.addEventListener('click', () => {
                this.addCategory('income');
            });
        }
        
        // Category action buttons
        delegate(document, 'click', '.edit-category-btn', (e) => {
            const categoryId = parseInt(e.target.closest('.edit-category-btn').getAttribute('data-id'));
            const categoryType = e.target.closest('.edit-category-btn').getAttribute('data-type');
            this.editCategory(categoryId, categoryType);
        });
        
        delegate(document, 'click', '.delete-category-btn', (e) => {
            const categoryId = parseInt(e.target.closest('.delete-category-btn').getAttribute('data-id'));
            const categoryType = e.target.closest('.delete-category-btn').getAttribute('data-type');
            this.deleteCategory(categoryId, categoryType);
        });
        
        // Data management buttons
        delegate(document, 'click', '.export-csv-btn', () => this.exportData('csv'));
        delegate(document, 'click', '.export-json-btn', () => this.exportData('json'));
        delegate(document, 'click', '.import-data-btn', () => this.importData());
        delegate(document, 'click', '.clear-data-btn', () => this.clearData());
        delegate(document, 'click', '.delete-account-btn', () => this.deleteAccount());
    },
    
    /**
     * Save profile settings
     */
    saveProfileSettings() {
        try {
            // Get form values
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;
            const currency = document.getElementById('profile-currency').value;
            const dateFormat = document.getElementById('profile-date-format').value;
            
            // Update data
            this.data.profile = {
                name,
                email,
                currency,
                dateFormat
            };
            
            // Show success message
            UI.showToast('Profile settings saved successfully', 'success');
            
            return true;
        } catch (error) {
            console.error('Error saving profile settings:', error);
            UI.showToast('Failed to save profile settings', 'error');
            return false;
        }
    },
    
    /**
     * Save notification settings
     */
    saveNotificationSettings() {
        try {
            // Get toggle values
            const transactionAlerts = document.getElementById('transaction-alerts').checked;
            const budgetAlerts = document.getElementById('budget-alerts').checked;
            const billReminders = document.getElementById('bill-reminders').checked;
            const weeklyReports = document.getElementById('weekly-reports').checked;
            const savingsGoals = document.getElementById('savings-goals').checked;
            const tips = document.getElementById('tips').checked;
            
            // Update data
            this.data.notifications = {
                transactionAlerts,
                budgetAlerts,
                billReminders,
                weeklyReports,
                savingsGoals,
                tips
            };
            
            // Show success message
            UI.showToast('Notification settings saved successfully', 'success');
            
            return true;
        } catch (error) {
            console.error('Error saving notification settings:', error);
            UI.showToast('Failed to save notification settings', 'error');
            return false;
        }
    },
    
    /**
     * Save preferences
     */
    savePreferences() {
        try {
            // Get form values
            const theme = document.getElementById('preferences-theme').value;
            const language = document.getElementById('preferences-language').value;
            const startPage = document.getElementById('preferences-start-page').value;
            const defaultView = document.getElementById('preferences-default-view').value;
            
            // Update data
            this.data.preferences = {
                theme,
                language,
                startPage,
                defaultView
            };
            
            // Apply theme if changed
            if (theme !== 'system') {
                document.documentElement.setAttribute('data-theme', theme);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            }
            
            // Show success message
            UI.showToast('Preferences saved successfully', 'success');
            
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            UI.showToast('Failed to save preferences', 'error');
            return false;
        }
    },
    
    /**
     * Save security settings
     */
    saveSecuritySettings() {
        try {
            // Get form values
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const twoFactorAuth = document.getElementById('two-factor-auth').checked;
            const sessionTimeout = parseInt(document.getElementById('session-timeout').value);
            
            // Validate password change
            if (newPassword && confirmPassword) {
                if (!currentPassword) {
                    UI.showToast('Please enter your current password', 'error');
                    return false;
                }
                
                if (newPassword !== confirmPassword) {
                    UI.showToast('New passwords do not match', 'error');
                    return false;
                }
                
                if (newPassword.length < 8) {
                    UI.showToast('Password must be at least 8 characters long', 'error');
                    return false;
                }
                
                // In a real app, this would verify the current password and update the new one
                
                // Update last password change date
                this.data.security.lastPasswordChange = new Date().toISOString().split('T')[0];
            }
            
            // Update other security settings
            this.data.security.twoFactorAuth = twoFactorAuth;
            this.data.security.sessionTimeout = sessionTimeout;
            
            // Clear password fields
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            
            // Show success message
            UI.showToast('Security settings updated successfully', 'success');
            
            return true;
        } catch (error) {
            console.error('Error saving security settings:', error);
            UI.showToast('Failed to update security settings', 'error');
            return false;
        }
    },
    
    /**
     * Add a new category
     * @param {string} type - Category type (expense or income)
     */
    addCategory(type) {
        // Create category modal
        const categoryModal = Components.createModal({
            id: 'category-modal',
            title: `Add ${Format.capitalizeFirstLetter(type)} Category`,
            content: `
                <form id="category-form">
                    <div class="form-group">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" placeholder="Enter category name" required>
                    </div>
                    <div class="form-group">
                        <label for="category-icon">Icon</label>
                        <select id="category-icon" required>
                            <option value="fa-shopping-basket">Shopping</option>
                            <option value="fa-bolt">Utilities</option>
                            <option value="fa-utensils">Food</option>
                            <option value="fa-car">Transportation</option>
                            <option value="fa-home">Housing</option>
                            <option value="fa-film">Entertainment</option>
                            <option value="fa-medkit">Health</option>
                            <option value="fa-graduation-cap">Education</option>
                            <option value="fa-money-bill-alt">Finance</option>
                            <option value="fa-briefcase">Work</option>
                            <option value="fa-gift">Gifts</option>
                            <option value="fa-user">Personal</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="category-color">Color</label>
                        <input type="color" id="category-color" value="#4CAF50" required>
                    </div>
                    <input type="hidden" id="category-type" value="${type}">
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="save-btn">Save Category</button>
                    </div>
                </form>
            `,
            width: 400
        });
        
        // Show modal
        UI.openModal('category-modal');
        
        // Handle form submission
        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('category-name').value;
                const icon = document.getElementById('category-icon').value;
                const color = document.getElementById('category-color').value;
                const categoryType = document.getElementById('category-type').value;
                
                // Create new category
                const newCategory = {
                    id: this.data.categories[categoryType].length + 1,
                    name: name,
                    icon: icon,
                    color: color
                };
                
                // Add to categories
                this.data.categories[categoryType].push(newCategory);
                
                // Close modal
                UI.closeModal('category-modal');
                
                // Refresh categories
                this.populateCategories();
                
                // Show success message
                UI.showToast('Category added successfully', 'success');
            });
        }
    },
    
    /**
     * Edit a category
     * @param {number} categoryId - ID of the category to edit
     * @param {string} type - Category type (expense or income)
     */
    editCategory(categoryId, type) {
        // Find category
        const category = this.data.categories[type].find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Create category modal
        const categoryModal = Components.createModal({
            id: 'category-modal',
            title: `Edit Category: ${category.name}`,
            content: `
                <form id="category-form">
                    <div class="form-group">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" value="${category.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="category-icon">Icon</label>
                        <select id="category-icon" required>
                            <option value="fa-shopping-basket" ${category.icon === 'fa-shopping-basket' ? 'selected' : ''}>Shopping</option>
                            <option value="fa-bolt" ${category.icon === 'fa-bolt' ? 'selected' : ''}>Utilities</option>
                            <option value="fa-utensils" ${category.icon === 'fa-utensils' ? 'selected' : ''}>Food</option>
                            <option value="fa-car" ${category.icon === 'fa-car' ? 'selected' : ''}>Transportation</option>
                            <option value="fa-home" ${category.icon === 'fa-home' ? 'selected' : ''}>Housing</option>
                            <option value="fa-film" ${category.icon === 'fa-film' ? 'selected' : ''}>Entertainment</option>
                            <option value="fa-medkit" ${category.icon === 'fa-medkit' ? 'selected' : ''}>Health</option>
                            <option value="fa-graduation-cap" ${category.icon === 'fa-graduation-cap' ? 'selected' : ''}>Education</option>
                            <option value="fa-money-bill-alt" ${category.icon === 'fa-money-bill-alt' ? 'selected' : ''}>Finance</option>
                            <option value="fa-briefcase" ${category.icon === 'fa-briefcase' ? 'selected' : ''}>Work</option>
                            <option value="fa-gift" ${category.icon === 'fa-gift' ? 'selected' : ''}>Gifts</option>
                            <option value="fa-user" ${category.icon === 'fa-user' ? 'selected' : ''}>Personal</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="category-color">Color</label>
                        <input type="color" id="category-color" value="${category.color}" required>
                    </div>
                    <input type="hidden" id="category-id" value="${category.id}">
                    <input type="hidden" id="category-type" value="${type}">
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="save-btn">Save Changes</button>
                    </div>
                </form>
            `,
            width: 400
        });
        
        // Show modal
        UI.openModal('category-modal');
        
        // Handle form submission
        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('category-name').value;
                const icon = document.getElementById('category-icon').value;
                const color = document.getElementById('category-color').value;
                const catId = parseInt(document.getElementById('category-id').value);
                const categoryType = document.getElementById('category-type').value;
                
                // Find and update category
                const catIndex = this.data.categories[categoryType].findIndex(cat => cat.id === catId);
                if (catIndex !== -1) {
                    this.data.categories[categoryType][catIndex] = {
                        ...this.data.categories[categoryType][catIndex],
                        name,
                        icon,
                        color
                    };
                }
                
                // Close modal
                UI.closeModal('category-modal');
                
                // Refresh categories
                this.populateCategories();
                
                // Show success message
                UI.showToast('Category updated successfully', 'success');
            });
        }
    },
    
    /**
     * Delete a category
     * @param {number} categoryId - ID of the category to delete
     * @param {string} type - Category type (expense or income)
     */
    deleteCategory(categoryId, type) {
        // Find category
        const category = this.data.categories[type].find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Confirm deletion
        if (confirm(`Are you sure you want to delete the category "${category.name}"? This cannot be undone.`)) {
            // Remove category
            const catIndex = this.data.categories[type].findIndex(cat => cat.id === categoryId);
            if (catIndex !== -1) {
                this.data.categories[type].splice(catIndex, 1);
            }
            
            // Refresh categories
            this.populateCategories();
            
            // Show success message
            UI.showToast('Category deleted successfully', 'success');
        }
    },
    
    /**
     * Export data
     * @param {string} format - Export format (csv or json)
     */
    exportData(format) {
        // In a real application, this would generate a file download
        // For demo purposes, we'll just show a toast message
        
        UI.showToast(`Exporting data in ${format.toUpperCase()} format. Download will start shortly.`, 'info');
        
        // Simulate download delay
        setTimeout(() => {
            UI.showToast(`Data exported successfully in ${format.toUpperCase()} format!`, 'success');
        }, 1500);
    },
    
    /**
     * Import data
     */
    importData() {
        // Create import modal
        const importModal = Components.createModal({
            id: 'import-modal',
            title: 'Import Data',
            content: `
                <form id="import-form">
                    <div class="form-group">
                        <label for="import-file">Select File</label>
                        <input type="file" id="import-file" accept=".csv,.json,.xlsx,.xls">
                        <p class="form-hint">Supported formats: CSV, JSON, XLSX</p>
                    </div>
                    <div class="form-group">
                        <label for="import-type">Import Type</label>
                        <select id="import-type">
                            <option value="transactions">Transactions</option>
                            <option value="budgets">Budgets</option>
                            <option value="all">All Data</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="save-btn">Import Data</button>
                    </div>
                </form>
            `,
            width: 450
        });
        
        // Show modal
        UI.openModal('import-modal');
        
        // Handle form submission
        const importForm = document.getElementById('import-form');
        if (importForm) {
            importForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get file input
                const fileInput = document.getElementById('import-file');
                const importType = document.getElementById('import-type').value;
                
                if (!fileInput.files.length) {
                    UI.showToast('Please select a file to import', 'error');
                    return;
                }
                
                // In a real application, this would process the uploaded file
                // For demo purposes, we'll just show success
                
                // Close modal
                UI.closeModal('import-modal');
                
                // Show success message
                UI.showToast(`Data imported successfully: ${importType}`, 'success');
            });
        }
    },
    
    /**
     * Clear data
     */
    clearData() {
        // Create clear data modal
        const clearDataModal = Components.createModal({
            id: 'clear-data-modal',
            title: 'Clear Data',
            content: `
                <form id="clear-data-form">
                    <p class="warning-text">Warning: This action cannot be undone. Please select the data you want to clear.</p>
                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="clear-transactions">
                            <label for="clear-transactions">Transactions</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="clear-budgets">
                            <label for="clear-budgets">Budgets</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="clear-subscriptions">
                            <label for="clear-subscriptions">Subscriptions</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="clear-debts">
                            <label for="clear-debts">Debts</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm-clear">Type "CLEAR" to confirm</label>
                        <input type="text" id="confirm-clear" placeholder="CLEAR" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="danger-btn">Clear Selected Data</button>
                    </div>
                </form>
            `,
            width: 450
        });
        
        // Show modal
        UI.openModal('clear-data-modal');
        
        // Handle form submission
        const clearDataForm = document.getElementById('clear-data-form');
        if (clearDataForm) {
            clearDataForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const confirmClear = document.getElementById('confirm-clear').value;
                
                // Check confirmation
                if (confirmClear !== 'CLEAR') {
                    UI.showToast('Please type "CLEAR" to confirm', 'error');
                    return;
                }
                
                // Get selected data types
                const clearTransactions = document.getElementById('clear-transactions').checked;
                const clearBudgets = document.getElementById('clear-budgets').checked;
                const clearSubscriptions = document.getElementById('clear-subscriptions').checked;
                const clearDebts = document.getElementById('clear-debts').checked;
                
                // In a real application, this would clear the selected data
                // For demo purposes, we'll just show success
                
                // Close modal
                UI.closeModal('clear-data-modal');
                
                // Show success message
                UI.showToast('Selected data cleared successfully', 'success');
            });
        }
    },
    
    /**
     * Delete account
     */
    deleteAccount() {
        // Create delete account modal
        const deleteAccountModal = Components.createModal({
            id: 'delete-account-modal',
            title: 'Delete Account',
            content: `
                <form id="delete-account-form">
                    <p class="warning-text">Warning: This action is permanent and cannot be undone. All your data will be deleted.</p>
                    <div class="form-group">
                        <label for="delete-reason">Reason for leaving (optional)</label>
                        <textarea id="delete-reason" placeholder="Tell us why you're leaving..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Enter your password to confirm</label>
                        <input type="password" id="confirm-password" placeholder="Password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-delete">Type "DELETE MY ACCOUNT" to confirm</label>
                        <input type="text" id="confirm-delete" placeholder="DELETE MY ACCOUNT" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn close-modal">Cancel</button>
                        <button type="submit" class="danger-btn">Permanently Delete Account</button>
                    </div>
                </form>
            `,
            width: 450
        });
        
        // Show modal
        UI.openModal('delete-account-modal');
        
        // Handle form submission
        const deleteAccountForm = document.getElementById('delete-account-form');
        if (deleteAccountForm) {
            deleteAccountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const confirmPassword = document.getElementById('confirm-password').value;
                const confirmDelete = document.getElementById('confirm-delete').value;
                
                // Check confirmation
                if (confirmDelete !== 'DELETE MY ACCOUNT') {
                    UI.showToast('Please type "DELETE MY ACCOUNT" to confirm', 'error');
                    return;
                }
                
                if (!confirmPassword) {
                    UI.showToast('Please enter your password', 'error');
                    return;
                }
                
                // In a real application, this would delete the account
                // For demo purposes, we'll just show success
                
                // Close modal
                UI.closeModal('delete-account-modal');
                
                // Show success message
                UI.showToast('Account deletion initiated. You will be logged out shortly.', 'info');
                
                // Simulate logout
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            });
        }
    }
};

// Initialize settings page when navigating to it
delegate(document, 'click', '.sidebar-menu li[data-page="settings"]', function() {
    setTimeout(() => {
        Settings.init();
    }, 100);
});

// Also initialize if we're starting on the settings page
document.addEventListener('DOMContentLoaded', function() {
    const settingsPage = document.getElementById('settings');
    if (settingsPage && settingsPage.classList.contains('active')) {
        Settings.init();
    }
});

// Export settings module
window.Settings = Settings;