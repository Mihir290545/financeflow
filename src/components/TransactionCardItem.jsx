import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { formatCurrency, formatDate } from '../utils/calculations';

/**
 * TransactionCardItem component
 * Dedicated mobile-first card layout designed to prevent horizontal squeezing on small devices
 */
export function TransactionCardItem({ transaction, onEdit, onDelete, isCurrentlyEditing }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isIncome = transaction.type === 'income';
  const formattedAmount = formatCurrency(transaction.amount);

  return (
    <article
      className={`tx-card-item ${isIncome ? 'tx-card-item--income' : 'tx-card-item--expense'} ${
        isCurrentlyEditing ? 'is-editing-card' : ''
      }`}
    >
      <div className="tx-card-item__main">
        {/* Category Avatar Icon */}
        <div className={`tx-card-icon-avatar ${isIncome ? 'avatar-income' : 'avatar-expense'}`}>
          <CategoryIcon category={transaction.category} size={20} />
        </div>

        {/* Content Details */}
        <div className="tx-card-details">
          <div className="tx-card-title-row">
            <h4 className="tx-card-title" title={transaction.title}>
              {transaction.title}
            </h4>
            <div className={`tx-card-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
              {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
            </div>
          </div>

          <div className="tx-card-meta-row">
            <div className="tx-card-tags">
              <span className={`badge badge--xs ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                {transaction.category}
              </span>
              <time className="tx-card-date" dateTime={transaction.date}>
                {formatDate(transaction.date)}
              </time>
            </div>

            {/* Quick Actions */}
            {isConfirmingDelete ? (
              <div className="tx-card-confirm-box" role="alert">
                <span className="confirm-text">Confirm?</span>
                <button
                  type="button"
                  className="btn btn-danger btn-xs"
                  onClick={() => {
                    onDelete(transaction.id);
                    setIsConfirmingDelete(false);
                  }}
                  aria-label="Confirm delete"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setIsConfirmingDelete(false)}
                  aria-label="Cancel delete"
                >
                  No
                </button>
              </div>
            ) : (
              <div className="tx-card-actions">
                <button
                  type="button"
                  className="btn-card-action btn-card-edit"
                  onClick={() => onEdit(transaction)}
                  disabled={isCurrentlyEditing}
                  title="Edit transaction"
                  aria-label={`Edit ${transaction.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  className="btn-card-action btn-card-delete"
                  onClick={() => setIsConfirmingDelete(true)}
                  disabled={isCurrentlyEditing}
                  title="Delete transaction"
                  aria-label={`Delete ${transaction.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TransactionCardItem;
