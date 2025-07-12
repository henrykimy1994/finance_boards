# FinSmart - Personal Finance Dashboard

A modern, responsive personal finance dashboard application built with HTML, CSS, and JavaScript.

## Project Structure

```
/finsmart
  /css
    - common.css (base styles, variables, resets)
    - components.css (for shared components)
    - dashboard.css
    - transactions.css
    - budget.css
    - subscriptions.css
    - debts.css
    - reports.css
    - settings.css
  /js
    - common.js (utilities, shared functions)
    - app.js (main initialization)
    - components.js (shared component functionality)
    - dashboard.js
    - transactions.js
    - budget.js
    - subscriptions.js
    - debts.js
    - reports.js
    - settings.js
  /data
    - summary.json
    - transactions.json
    - categories.json
    - budgets.json
    - subscriptions.json
    - debts.json
    - charts.json
  - index.html
  - README.md
```

## Features

- **Dashboard**: Overview of finances with key metrics and visualizations
- **Transactions**: Track, filter, and manage income and expenses
- **Budget**: Set and monitor spending limits by category
- **Subscriptions**: Track recurring payments and upcoming bills
- **Debts**: Track loans and credit cards with payoff strategies
- **Reports**: Visual analysis of financial data and trends
- **Settings**: Customize application settings and preferences

## Technologies Used

- HTML5
- CSS3 (with CSS variables, flexbox, grid)
- JavaScript (ES6+)
- Chart.js for data visualization
- Font Awesome for icons

## Setup Instructions

1. Clone or download the repository
2. Set up a local server (using XAMPP, WAMP, Live Server extension, etc.)
3. Navigate to the project directory in your local server
4. Open `index.html` in your browser

## API Simulation

This project uses local JSON files to simulate API responses. In a real-world application, these would be replaced with actual API endpoints.

- `/data/summary.json`: Dashboard summary data
- `/data/transactions.json`: Transaction records
- `/data/categories.json`: Income and expense categories
- `/data/budgets.json`: Budget allocations and spending
- `/data/subscriptions.json`: Recurring payments
- `/data/debts.json`: Loans and credit cards
- `/data/charts.json`: Data for various charts and visualizations

## Responsive Design

The application is fully responsive and works on:
- Desktop screens
- Tablets
- Mobile devices

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and multi-user support
- Dark mode
- Export data to CSV/PDF
- Savings goals tracking
- Investment portfolio tracking
- Bank account integration
- Mobile app version