/**
 * FinSmart - Shared UI Components
 * This file contains functionality for shared UI components
 */

// Components object for organizing functions
const Components = {
    /**
     * Initialize all shared UI components
     */
    init() {
        this.initModals();
        this.initSidebar();
        this.initToastContainer();
        this.setupChartDefaults();
    },
    
    /**
     * Initialize modals functionality
     */
    initModals() {
        // Create modals container if it doesn't exist
        let modalsContainer = document.getElementById('modals-container');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modals-container';
            document.body.appendChild(modalsContainer);
        }
        
        // Overlay click to close modals
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                overlay.classList.remove('active');
            });
        }
        
        // Close modals on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
        
        // Delegate for close button clicks
        delegate(document, 'click', '.close-modal', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    },
    
    /**
     * Initialize sidebar functionality
     */
    initSidebar() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const closeSidebar = document.querySelector('.close-sidebar');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => UI.toggleSidebar());
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => UI.toggleSidebar());
        }
        
        // Sidebar menu navigation
        delegate(document, 'click', '.sidebar-menu li[data-page]', function() {
            const pageId = this.getAttribute('data-page');
            UI.navigateToPage(pageId);
        });
        
        // View all links
        delegate(document, 'click', '.view-all[data-target]', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-target');
            UI.navigateToPage(targetPage);
        });
        
        // Responsive adjustments on window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= 992) {
                const sidebar = document.querySelector('.sidebar');
                const overlay = document.querySelector('.overlay');
                if (sidebar) sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        }, 100));
    },
    
    /**
     * Initialize toast notification container
     */
    initToastContainer() {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    },
    
    /**
     * Set up Chart.js global defaults
     */
    setupChartDefaults() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";
            Chart.defaults.color = '#6b7280';
            Chart.defaults.elements.point.radius = 3;
            Chart.defaults.elements.point.hoverRadius = 5;
            Chart.defaults.elements.line.borderWidth = 2;
            Chart.defaults.elements.bar.borderRadius = 4;
            Chart.defaults.plugins.tooltip.enabled = true;
            Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            Chart.defaults.plugins.tooltip.titleColor = '#1f2937';
            Chart.defaults.plugins.tooltip.bodyColor = '#1f2937';
            Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
            Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
            Chart.defaults.plugins.tooltip.padding = 12;
            Chart.defaults.plugins.tooltip.boxPadding = 8;
            Chart.defaults.plugins.tooltip.cornerRadius = 8;
            Chart.defaults.plugins.tooltip.usePointStyle = true;
        }
    },
    
    /**
     * Create modal from template
     * @param {object} options - Modal options
     * @returns {HTMLElement} - The created modal
     */
    createModal(options = {}) {
        const defaults = {
            id: 'custom-modal-' + new Date().getTime(),
            title: 'Modal Title',
            content: '',
            width: 500,
            closable: true,
            onOpen: null,
            onClose: null
        };
        
        const settings = { ...defaults, ...options };
        
        // Check if modal already exists
        let modal = document.getElementById(settings.id);
        if (modal) return modal;
        
        // Create modal elements
        modal = document.createElement('div');
        modal.id = settings.id;
        modal.className = 'modal';
        
        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';
        modalDialog.style.maxWidth = `${settings.width}px`;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = settings.title;
        
        modalHeader.appendChild(modalTitle);
        
        if (settings.closable) {
            const closeButton = document.createElement('button');
            closeButton.className = 'close-modal';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.addEventListener('click', () => {
                UI.closeModal(settings.id);
                if (typeof settings.onClose === 'function') {
                    settings.onClose();
                }
            });
            
            modalHeader.appendChild(closeButton);
        }
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        if (typeof settings.content === 'string') {
            modalBody.innerHTML = settings.content;
        } else if (settings.content instanceof HTMLElement) {
            modalBody.appendChild(settings.content);
        }
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);
        
        // Add to modals container
        const modalsContainer = document.getElementById('modals-container');
        modalsContainer.appendChild(modal);
        
        return modal;
    },
    
    /**
     * Create a doughnut chart
     * @param {string} canvasId - The ID of the canvas element
     * @param {object} data - Chart data
     * @param {object} options - Chart options
     * @returns {Chart} - The created chart
     */
    createDoughnutChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return null;
        
        const defaultOptions = {
            cutout: '65%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${Format.currency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        const chartOptions = { ...defaultOptions, ...options };
        
        // Create or update chart
        if (window[canvasId + 'Chart']) {
            window[canvasId + 'Chart'].destroy();
        }
        
        window[canvasId + 'Chart'] = new Chart(canvas, {
            type: 'doughnut',
            data: data,
            options: chartOptions
        });
        
        return window[canvasId + 'Chart'];
    },
    
    /**
     * Create a line chart
     * @param {string} canvasId - The ID of the canvas element
     * @param {object} data - Chart data
     * @param {object} options - Chart options
     * @returns {Chart} - The created chart
     */
    createLineChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${Format.currency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Format.currency(value, true);
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(209, 213, 219, 0.5)'
                    }
                }
            }
        };
        
        const chartOptions = { ...defaultOptions, ...options };
        
        // Create or update chart
        if (window[canvasId + 'Chart']) {
            window[canvasId + 'Chart'].destroy();
        }
        
        window[canvasId + 'Chart'] = new Chart(canvas, {
            type: 'line',
            data: data,
            options: chartOptions
        });
        
        return window[canvasId + 'Chart'];
    },
    
    /**
     * Create a bar chart
     * @param {string} canvasId - The ID of the canvas element
     * @param {object} data - Chart data
     * @param {object} options - Chart options
     * @returns {Chart} - The created chart
     */
    createBarChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${Format.currency(value)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Format.currency(value, true);
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(209, 213, 219, 0.5)'
                    }
                }
            }
        };
        
        const chartOptions = { ...defaultOptions, ...options };
        
        // Create or update chart
        if (window[canvasId + 'Chart']) {
            window[canvasId + 'Chart'].destroy();
        }
        
        window[canvasId + 'Chart'] = new Chart(canvas, {
            type: 'bar',
            data: data,
            options: chartOptions
        });
        
        return window[canvasId + 'Chart'];
    },
    
    /**
     * Create a custom legend for a chart
     * @param {string} containerId - The ID of the container element
     * @param {Array} labels - Legend labels
     * @param {Array} colors - Legend colors
     */
    createChartLegend(containerId, labels, colors) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${colors[index]}"></div>
                <div class="legend-label">${label}</div>
            `;
            
            container.appendChild(legendItem);
        });
    },
    
    /**
     * Create a data table
     * @param {string} containerId - The ID of the container element
     * @param {object} options - Table options
     */
    createDataTable(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const defaults = {
            columns: [],
            data: [],
            pagination: true,
            rowsPerPage: 10,
            search: true,
            searchPlaceholder: 'Search...',
            emptyMessage: 'No data available',
            onRowClick: null
        };
        
        const settings = { ...defaults, ...options };
        
        // Create table structure
        const tableCard = document.createElement('div');
        tableCard.className = 'card table-card';
        
        // Search functionality
        if (settings.search) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'table-search-wrapper';
            searchWrapper.innerHTML = `
                <div class="search-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="${settings.searchPlaceholder}" class="table-search-input">
                </div>
            `;
            
            tableCard.appendChild(searchWrapper);
            
            // Search functionality
            const searchInput = searchWrapper.querySelector('.table-search-input');
            searchInput.addEventListener('input', debounce(() => {
                const searchText = searchInput.value.toLowerCase();
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    const display = text.includes(searchText) ? '' : 'none';
                    row.style.display = display;
                });
                
                updatePagination();
            }, 300));
        }
        
        // Create table responsive wrapper
        const tableResponsive = document.createElement('div');
        tableResponsive.className = 'table-responsive';
        
        // Create table element
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create table header
        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        settings.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            if (column.width) {
                th.style.width = column.width;
            }
            headerRow.appendChild(th);
        });
        
        tableHead.appendChild(headerRow);
        table.appendChild(tableHead);
        
        // Create table body
        const tableBody = document.createElement('tbody');
        
        // Add row data
        if (settings.data.length > 0) {
            settings.data.forEach(item => {
                const row = document.createElement('tr');
                
                settings.columns.forEach(column => {
                    const td = document.createElement('td');
                    
                    if (column.render) {
                        // Custom cell rendering
                        const content = column.render(item, td);
                        if (typeof content === 'string') {
                            td.innerHTML = content;
                        } else if (content instanceof HTMLElement) {
                            td.appendChild(content);
                        }
                    } else if (column.field) {
                        // Simple field display
                        td.textContent = item[column.field] || '';
                    }
                    
                    row.appendChild(td);
                });
                
                // Row click event
                if (typeof settings.onRowClick === 'function') {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => settings.onRowClick(item, row));
                }
                
                tableBody.appendChild(row);
            });
        } else {
            // Empty state
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = settings.columns.length;
            emptyCell.textContent = settings.emptyMessage;
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '2rem';
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
        }
        
        table.appendChild(tableBody);
        tableResponsive.appendChild(table);
        tableCard.appendChild(tableResponsive);
        
        // Add pagination
        let currentPage = 1;
        const totalPages = Math.ceil(settings.data.length / settings.rowsPerPage);
        
        if (settings.pagination && settings.data.length > settings.rowsPerPage) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination';
            
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.disabled = true;
            
            const pageIndicator = document.createElement('span');
            pageIndicator.id = 'page-indicator';
            pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
            
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.disabled = totalPages <= 1;
            
            pagination.appendChild(prevButton);
            pagination.appendChild(pageIndicator);
            pagination.appendChild(nextButton);
            
            tableCard.appendChild(pagination);
            
            // Pagination functionality
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
            
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
            
            // Update pagination display
            function updatePagination() {
                const visibleRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
                const filteredTotalPages = Math.ceil(visibleRows.length / settings.rowsPerPage);
                
                const startIndex = (currentPage - 1) * settings.rowsPerPage;
                const endIndex = startIndex + settings.rowsPerPage;
                
                visibleRows.forEach((row, index) => {
                    row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
                });
                
                prevButton.disabled = currentPage <= 1;
                nextButton.disabled = currentPage >= filteredTotalPages || filteredTotalPages <= 1;
                
                pageIndicator.textContent = `Page ${currentPage} of ${Math.max(1, filteredTotalPages)}`;
            }
            
            // Initial pagination
            updatePagination();
        }
        
        // Replace any existing content and append the table
        container.innerHTML = '';
        container.appendChild(tableCard);
    },
    
    /**
     * Create a progress bar
     * @param {HTMLElement} container - The container to append the progress bar to
     * @param {number} value - The progress value (0-100)
     * @param {object} options - Progress bar options
     * @returns {HTMLElement} - The created progress bar
     */
    createProgressBar(container, value, options = {}) {
        const defaults = {
            height: 6,
            radius: 9999,
            color: null,
            background: '#e5e7eb',
            showLabel: false,
            labelPosition: 'right' // 'right', 'top'
        };
        
        const settings = { ...defaults, ...options };
        
        // Determine color based on value
        if (!settings.color) {
            if (value < 50) {
                settings.color = '#10b981'; // success
            } else if (value < 75) {
                settings.color = '#f59e0b'; // warning
            } else {
                settings.color = '#ef4444'; // danger
            }
        }
        
        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.height = `${settings.height}px`;
        progressContainer.style.backgroundColor = settings.background;
        progressContainer.style.borderRadius = `${settings.radius}px`;
        progressContainer.style.position = 'relative';
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.style.width = `${value}%`;
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = settings.color;
        progressBar.style.borderRadius = `${settings.radius}px`;
        progressBar.style.transition = 'width 0.3s ease';
        
        progressContainer.appendChild(progressBar);
        
        // Add label if needed
        if (settings.showLabel) {
            const label = document.createElement('span');
            label.textContent = `${value}%`;
            label.style.fontWeight = '600';
            label.style.fontSize = '0.875rem';
            
            if (settings.labelPosition === 'right') {
                label.style.position = 'absolute';
                label.style.right = '0';
                label.style.top = '50%';
                label.style.transform = 'translateY(-50%)';
            } else if (settings.labelPosition === 'top') {
                label.style.position = 'absolute';
                label.style.right = '0';
                label.style.top = '-22px';
            }
            
            progressContainer.appendChild(label);
        }
        
        if (container) {
            container.appendChild(progressContainer);
        }
        
        return progressContainer;
    }
};

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Components.init();
});

// Export components
window.Components = Components;