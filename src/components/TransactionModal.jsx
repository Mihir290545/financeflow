import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/initialTransactions';

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_MODAL_STATE = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: getTodayDateString(),
};

/**
 * TransactionModal component
 * Executive modal / slide-over dialog for adding or editing transactions
 */
export function TransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
}) {
  const [formData, setFormData] = useState(() => {
    if (editingTransaction) {
      return {
        title: editingTransaction.title || '',
        amount: editingTransaction.amount?.toString() || '',
        type: editingTransaction.type || 'expense',
        category: editingTransaction.category || 'Food',
        date: editingTransaction.date || getTodayDateString(),
      };
    }
    return DEFAULT_MODAL_STATE;
  });
  const [errors, setErrors] = useState({});

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const availableCategories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        const nextCategories =
          value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        if (!nextCategories.includes(prev.category)) {
          updated.category = nextCategories[0];
        }
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const setPresetAmount = (val) => {
    const current = Number(formData.amount) || 0;
    setFormData((prev) => ({
      ...prev,
      amount: (current + val).toString(),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Must be at least 2 chars';
    }

    const num = Number(formData.amount);
    if (!formData.amount || formData.amount.toString().trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(num) || num <= 0) {
      newErrors.amount = 'Enter amount > 0';
    }

    if (!formData.category) {
      newErrors.category = 'Select category';
    }

    if (!formData.date) {
      newErrors.date = 'Select date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(Number(formData.amount).toFixed(2)),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    if (editingTransaction) {
      onUpdateTransaction({
        ...payload,
        id: editingTransaction.id,
      });
    } else {
      onAddTransaction({
        ...payload,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      });
    }

    onClose();
  };

  const isEditing = Boolean(editingTransaction);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">
              {isEditing ? 'Modify Transaction' : 'Record Transaction'}
            </h3>
            <span className="modal-subtitle">
              {isEditing ? 'Update transaction details' : 'Enter transaction information'}
            </span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Segmented Type Toggle */}
          <div className="form-group">
            <div className="type-toggle-group" role="radiogroup" aria-label="Transaction Type">
              <button
                type="button"
                className={`type-toggle-btn type-toggle-btn--expense ${formData.type === 'expense' ? 'is-active' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                aria-checked={formData.type === 'expense'}
                role="radio"
              >
                Expense (-)
              </button>
              <button
                type="button"
                className={`type-toggle-btn type-toggle-btn--income ${formData.type === 'income' ? 'is-active' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                aria-checked={formData.type === 'income'}
                role="radio"
              >
                Income (+)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="modal-tx-title" className="form-label">
              Transaction Title <span className="required-star">*</span>
            </label>
            <input
              id="modal-tx-title"
              name="title"
              type="text"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Flight Ticket, Freelance Pay"
              value={formData.title}
              onChange={handleChange}
              maxLength={80}
              autoFocus
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="modal-tx-amount" className="form-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">₹</span>
              <input
                id="modal-tx-amount"
                name="amount"
                type="number"
                step="any"
                min="0"
                className={`form-input input-with-prefix ${errors.amount ? 'is-invalid' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            {errors.amount && <span className="field-error">{errors.amount}</span>}

            {/* Quick Presets */}
            <div className="amount-quick-presets">
              <span className="preset-label">Quick Add:</span>
              <button type="button" className="preset-chip" onClick={() => setPresetAmount(500)}>+₹500</button>
              <button type="button" className="preset-chip" onClick={() => setPresetAmount(1000)}>+₹1,000</button>
              <button type="button" className="preset-chip" onClick={() => setPresetAmount(5000)}>+₹5,000</button>
            </div>
          </div>

          {/* Category & Date */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modal-tx-category" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="modal-tx-category"
                name="category"
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="modal-tx-date" className="form-label">
                Date <span className="required-star">*</span>
              </label>
              <input
                id="modal-tx-date"
                name="date"
                type="date"
                className={`form-input ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Confirm Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
