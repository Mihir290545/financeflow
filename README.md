# FinanceFlow — Personal Finance Dashboard

A clean, responsive, frontend-only personal finance dashboard built with **React.js**, **JavaScript (ES6+)**, **CSS3**, and **LocalStorage**.

Designed and implemented as a portfolio project demonstrating component architecture, state management, pure CSS layouts, and client-side data persistence.

---

## Features

- **Transaction Management**:
  - Add income and expense transactions with validation.
  - In-place editing of transactions with real-time recalculation of all metrics.
  - Deletion with an inline confirmation prompt to prevent accidental data loss.
- **Dynamic Financial Summaries**:
  - **Net Balance**: Dynamically calculated (`Total Income - Total Expenses`).
  - **Total Income**: Aggregate of all income records.
  - **Total Expenses**: Aggregate of all expense records.
  - **Monthly Spending**: Automatically computed for the current calendar month.
- **Spending Distribution by Category**:
  - Dynamically calculates expense totals per category.
  - Displays percentage distribution with custom progress indicators.
- **Monthly Spending Overview**:
  - Groups recorded expenses by calendar month.
  - Provides a clean comparative visual representation of monthly cash outflow.
- **Search, Filtering & Sorting**:
  - Real-time instant title search.
  - Compound filters: Filter by Type (`Income` / `Expense`), Category, and Month simultaneously.
  - Sorting: By date (newest/oldest) and amount (highest/lowest).
- **Client-Side Persistence**:
  - Saves data automatically to browser `LocalStorage` (`financeflow_transactions`).
  - Safe error recovery and graceful fallback.
  - Includes realistic seed sample data for first-time visitors with a one-click reset option.
- **Responsive Design**:
  - Desktop-first layout using CSS Grid and Flexbox.
  - Fully responsive and tested across mobile (320px+), tablet, and desktop viewports.
  - No horizontal scrollbars; compact mobile-friendly table transformations.

---

## Technology Stack

- **Framework**: React 19 (Functional Components, Hooks)
- **Tooling**: Vite
- **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid)
- **Persistence**: Browser LocalStorage API
- **Language**: JavaScript (ES6+)

*No external UI component libraries (Tailwind, Bootstrap, MUI, etc.) or backend frameworks were used.*

---

## Project Structure

```text
src/
├── components/
│   ├── Header.jsx             # Top bar branding & action buttons
│   ├── SummaryCards.jsx       # Grid container for KPI metrics
│   ├── SummaryCard.jsx        # Reusable metric card
│   ├── TransactionForm.jsx    # Add / Edit form with validation
│   ├── FilterBar.jsx          # Search, category, type, month filters & sort
│   ├── TransactionList.jsx    # Ledger table & empty state handler
│   ├── TransactionItem.jsx    # Individual row with inline delete confirmation
│   ├── CategorySummary.jsx    # Expense breakdown by category
│   └── MonthlySpending.jsx    # Expense trends by calendar month
├── utils/
│   ├── calculations.js        # Pure functions for totals, filters & sorting
│   └── storage.js             # LocalStorage read/write service
├── data/
│   └── initialTransactions.js # Sample realistic Indian Rupee seed data
├── App.jsx                    # Root state coordinator
├── main.jsx                   # Entry point
└── index.css                  # Custom design tokens & stylesheet
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation & Run

1. Clone or open the repository folder:
   ```bash
   cd PROJECTS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173/` in your browser.

---

## Code Quality

- Check code style and linting:
  ```bash
  npm run lint
  ```
- Build for production:
  ```bash
  npm run build
  ```
