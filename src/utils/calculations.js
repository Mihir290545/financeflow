/**
 * Financial Calculation Utilities
 * Pure functions for aggregating, filtering, sorting, and formatting transaction data.
 */

/**
 * Calculates total income across all transactions.
 * @param {Array} transactions
 * @returns {number}
 */
export function calculateTotalIncome(transactions = []) {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

/**
 * Calculates total expenses across all transactions.
 * @param {Array} transactions
 * @returns {number}
 */
export function calculateTotalExpenses(transactions = []) {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

/**
 * Calculates net balance (Total Income - Total Expenses).
 * @param {Array} transactions
 * @returns {number}
 */
export function calculateBalance(transactions = []) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

/**
 * Calculates total expenses for a specific month (format: "YYYY-MM").
 * Defaults to the current calendar month if no month is specified.
 * @param {Array} transactions
 * @param {string} [targetMonth] e.g. "2026-10"
 * @returns {number}
 */
export function calculateMonthlyExpenses(transactions = [], targetMonth = '') {
  let monthToMatch = targetMonth;

  if (!monthToMatch) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    monthToMatch = `${year}-${month}`;
  }

  return transactions
    .filter(
      (tx) =>
        tx.type === 'expense' &&
        typeof tx.date === 'string' &&
        tx.date.startsWith(monthToMatch)
    )
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

/**
 * Calculates expense distribution by category.
 * Returns an array of category summaries sorted from highest spend to lowest.
 * @param {Array} transactions
 * @returns {Array<{ category: string, total: number, percentage: number }>}
 */
export function calculateCategoryTotals(transactions = []) {
  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense');
  const totalExpenses = expenseTransactions.reduce(
    (sum, tx) => sum + (Number(tx.amount) || 0),
    0
  );

  if (totalExpenses === 0) {
    return [];
  }

  const categoryMap = {};

  expenseTransactions.forEach((tx) => {
    const cat = tx.category || 'Other';
    const amount = Number(tx.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + amount;
  });

  return Object.entries(categoryMap)
    .map(([category, total]) => ({
      category,
      total,
      percentage: Math.round((total / totalExpenses) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Groups expenses by month and returns historical spending data for simple visualization.
 * @param {Array} transactions
 * @returns {Array<{ monthKey: string, monthLabel: string, total: number, relativeWidth: number }>}
 */
export function calculateMonthlySpendingHistory(transactions = []) {
  const expenseTransactions = transactions.filter(
    (tx) => tx.type === 'expense' && tx.date
  );

  if (expenseTransactions.length === 0) {
    return [];
  }

  const monthlyTotals = {};

  expenseTransactions.forEach((tx) => {
    const monthKey = tx.date.substring(0, 7); // "YYYY-MM"
    const amount = Number(tx.amount) || 0;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amount;
  });

  const sortedMonthKeys = Object.keys(monthlyTotals).sort();
  const maxSpend = Math.max(...Object.values(monthlyTotals), 1);

  return sortedMonthKeys.map((key) => {
    const [year, month] = key.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const monthLabel = isNaN(dateObj.getTime())
      ? key
      : dateObj.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

    const total = monthlyTotals[key];
    const relativeWidth = Math.max(8, Math.round((total / maxSpend) * 100));

    return {
      monthKey: key,
      monthLabel,
      total,
      relativeWidth,
    };
  });
}

/**
 * Extracts unique available months (YYYY-MM) from transactions for filtering.
 * @param {Array} transactions
 * @returns {Array<{ key: string, label: string }>}
 */
export function getAvailableMonths(transactions = []) {
  const monthSet = new Set();

  transactions.forEach((tx) => {
    if (tx.date && tx.date.length >= 7) {
      monthSet.add(tx.date.substring(0, 7));
    }
  });

  // Ensure current month is available even if no transactions yet
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthSet.add(currentKey);

  return Array.from(monthSet)
    .sort()
    .reverse()
    .map((key) => {
      const [year, month] = key.split('-');
      const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const label = isNaN(dateObj.getTime())
        ? key
        : dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      return { key, label };
    });
}

/**
 * Filters transactions by search query, transaction type, category, and month.
 * All filters apply conjunctively.
 * @param {Array} transactions
 * @param {Object} filters
 * @returns {Array}
 */
export function filterTransactions(transactions = [], filters = {}) {
  const {
    searchTerm = '',
    typeFilter = 'all',
    categoryFilter = 'all',
    monthFilter = 'all',
  } = filters;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  return transactions.filter((tx) => {
    // 1. Title search filter
    if (normalizedSearch && !tx.title.toLowerCase().includes(normalizedSearch)) {
      return false;
    }

    // 2. Type filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) {
      return false;
    }

    // 3. Category filter
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
      return false;
    }

    // 4. Month filter
    if (
      monthFilter !== 'all' &&
      (!tx.date || !tx.date.startsWith(monthFilter))
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts transactions according to the given sort option.
 * @param {Array} transactions
 * @param {string} sortKey ('newest' | 'oldest' | 'highest' | 'lowest')
 * @returns {Array}
 */
export function sortTransactions(transactions = [], sortKey = 'newest') {
  const sorted = [...transactions];

  switch (sortKey) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'highest':
      return sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
    case 'lowest':
      return sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
    default:
      return sorted;
  }
}

/**
 * Formats a number to Indian Rupee currency string (e.g. ₹45,000)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount = 0) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Formats standard ISO date string (YYYY-MM-DD) into readable format (e.g. 04 Oct 2026)
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString = '') {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const dateObj = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  if (isNaN(dateObj.getTime())) return dateString;

  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generates and downloads a CSV file of transactions
 * @param {Array} transactions
 */
export function exportTransactionsCSV(transactions = []) {
  if (!transactions.length) return;
  const headers = ['ID', 'Title', 'Type', 'Category', 'Amount', 'Date'];
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    t.amount,
    `"${t.date}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FinanceFlow_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

