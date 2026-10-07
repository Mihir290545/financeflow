import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { formatCurrency, formatDate } from '../utils/calculations';

/**
 * TransactionItem component representing a single row in the desktop ledger table
 */
export function TransactionItem({ transaction, onEdit, onDelete, isCurrentlyEditing }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isIncome = transaction.type === 'income';
  const formattedAmount = formatCurrency(transaction.amount);

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(transaction.id);
    setIsConfirmingDelete(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <tr className={`transaction-row ${isCurrentlyEditing ? 'is-editing-row' : ''}`}>
      {/* Title & Icon */}
      <td className="cell-title">
        <div className="title-wrapper">
          <div className={`table-cat-icon ${isIncome ? 'table-cat-icon--income' : 'table-cat-icon--expense'}`}>
            <CategoryIcon category={transaction.category} size={15} />
          </div>
          <div className="title-text-group">
            <span className="transaction-title-text" title={transaction.title}>{transaction.title}</span>
            <span className="mobile-meta">
              <span className={`badge badge--xs ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                {transaction.category}
              </span>
              <span className="mobile-date">{formatDate(transaction.date)}</span>
            </span>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="cell-category">
        <span className="category-pill">{transaction.category}</span>
      </td>

      {/* Date */}
      <td className="cell-date">
        <time dateTime={transaction.date}>{formatDate(transaction.date)}</time>
      </td>

      {/* Type */}
      <td className="cell-type">
        <span className={`type-badge ${isIncome ? 'type-badge--income' : 'type-badge--expense'}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>

      {/* Amount */}
      <td className="cell-amount">
        <span className={`amount-display ${isIncome ? 'amount-income' : 'amount-expense'}`}>
          {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
        </span>
      </td>

      {/* Actions */}
      <td className="cell-actions">
        {isConfirmingDelete ? (
          <div className="delete-confirm-box" role="alert">
            <span className="delete-confirm-prompt">Confirm?</span>
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={handleConfirmDelete}
              aria-label={`Confirm delete of ${transaction.title}`}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={handleCancelDelete}
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="actions-wrapper">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(transaction)}
              disabled={isCurrentlyEditing}
              aria-label={`Edit ${transaction.title}`}
              title="Edit transaction"
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-ghost-danger btn-sm"
              onClick={handleDeleteClick}
              disabled={isCurrentlyEditing}
              aria-label={`Delete ${transaction.title}`}
              title="Delete transaction"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default TransactionItem;
