import React from 'react';
import TransactionItem from './TransactionItem';
import TransactionCardItem from './TransactionCardItem';
import { SkeletonTransactionTable, SkeletonTransactionCards } from './SkeletonLoader';

/**
 * TransactionList component rendering table on desktop / laptop
 * and dedicated card layout on mobile devices (or when Card view is active)
 */
export function TransactionList({
  transactions,
  totalUnfilteredCount,
  onEdit,
  onDelete,
  editingTransactionId,
  onResetFilters,
  onScrollToForm,
  viewMode = 'auto', // 'auto', 'table', 'cards'
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="card transaction-list-card">
        <div className="desktop-view-only">
          <SkeletonTransactionTable />
        </div>
        <div className="mobile-view-only">
          <SkeletonTransactionCards />
        </div>
      </div>
    );
  }

  // Empty state: No transactions at all in the system
  if (totalUnfilteredCount === 0) {
    return (
      <div className="card transaction-list-card">
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No transactions recorded</h3>
          <p className="empty-state-description">
            Add your first income or expense entry to start tracking cash flow.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onScrollToForm}
          >
            + Add Transaction
          </button>
        </div>
      </div>
    );
  }

  // Filter empty state: Filter criteria yielded no results
  if (transactions.length === 0) {
    return (
      <div className="card transaction-list-card">
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No matching transactions</h3>
          <p className="empty-state-description">
            No transactions match the selected filters or search keyword.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card transaction-list-card">
      {/* Desktop & Tablet Table (Hidden on mobile <768px via CSS) */}
      <div className={`desktop-table-container ${viewMode === 'cards' ? 'desktop-table--hidden' : ''}`}>
        <div className="table-responsive-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th scope="col" className="th-title">Transaction</th>
                <th scope="col" className="th-category">Category</th>
                <th scope="col" className="th-date">Date</th>
                <th scope="col" className="th-type">Type</th>
                <th scope="col" className="th-amount">Amount</th>
                <th scope="col" className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isCurrentlyEditing={editingTransactionId === tx.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List (Active on mobile <768px, or when viewMode is 'cards') */}
      <div className={`mobile-cards-container ${viewMode === 'cards' ? 'mobile-cards--forced-show' : ''}`}>
        <div className="mobile-cards-list">
          {transactions.map((tx) => (
            <TransactionCardItem
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
              onDelete={onDelete}
              isCurrentlyEditing={editingTransactionId === tx.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
