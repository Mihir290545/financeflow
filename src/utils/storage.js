/**
 * LocalStorage Service for FinanceFlow
 * Handles resilient data persistence, deserialization, and recovery.
 */

import { INITIAL_TRANSACTIONS } from '../data/initialTransactions';

const STORAGE_KEY = 'financeflow_transactions';

/**
 * Loads transactions from browser LocalStorage.
 * Falls back safely to initial sample transactions if storage is empty or corrupted.
 * @returns {Array} Array of transaction objects
 */
export function loadTransactions() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (rawData === null) {
      // First-time visit: seed with realistic initial sample data
      saveTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }

    const parsed = JSON.parse(rawData);

    // Validate that stored data is an array
    if (Array.isArray(parsed)) {
      return parsed;
    }

    console.warn('FinanceFlow: LocalStorage data corrupted, resetting to sample transactions.');
    return INITIAL_TRANSACTIONS;
  } catch (error) {
    console.error('FinanceFlow: Failed to read from LocalStorage:', error);
    return INITIAL_TRANSACTIONS;
  }
}

/**
 * Persists transactions array to browser LocalStorage.
 * @param {Array} transactions
 * @returns {boolean} True if successfully stored, false otherwise
 */
export function saveTransactions(transactions) {
  try {
    if (!Array.isArray(transactions)) {
      console.warn('FinanceFlow: Attempted to save non-array to LocalStorage.');
      return false;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('FinanceFlow: Failed to write to LocalStorage:', error);
    return false;
  }
}

/**
 * Resets stored data back to the default initial sample transactions.
 * Useful for demo / interview presentations.
 * @returns {Array}
 */
export function resetToSampleData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  } catch (error) {
    console.error('FinanceFlow: Failed to reset sample data:', error);
    return INITIAL_TRANSACTIONS;
  }
}

/**
 * Clears all transactions from LocalStorage.
 * @returns {Array} Empty array
 */
export function clearAllTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error('FinanceFlow: Failed to clear transactions:', error);
    return [];
  }
}
