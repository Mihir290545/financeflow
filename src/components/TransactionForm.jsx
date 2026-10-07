import React, { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/initialTransactions';

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_FORM_STATE = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: getTodayDateString(),
};

/**
 * TransactionForm component for creating and editing financial transactions
 */
export function TransactionForm({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
  formRef,
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
    return DEFAULT_FORM_STATE;
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Must be at least 2 chars';
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount || formData.amount.toString().trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Must be greater than 0';
    } else if (numAmount > 100000000) {
      newErrors.amount = 'Exceeds maximum limit';
    }

    if (!formData.category) {
      newErrors.category = 'Select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const parsedDate = new Date(formData.date);
      if (isNaN(parsedDate.getTime())) {
        newErrors.date = 'Invalid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      setFormData({
        ...DEFAULT_FORM_STATE,
        date: formData.date,
      });
    }

    setErrors({});
  };

  const handleReset = () => {
    if (editingTransaction) {
      onCancelEdit();
    } else {
      setFormData(DEFAULT_FORM_STATE);
      setErrors({});
    }
  };

  const isEditing = Boolean(editingTransaction);

  return (
    <section
      ref={formRef}
      className={`card transaction-form-card ${isEditing ? 'is-editing-mode' : ''}`}
      aria-labelledby="form-heading"
    >
      <div className="card-header">
        <div className="card-title-group">
          <h2 id="form-heading" className="card-title">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
        </div>

        {isEditing && (
          <span className="badge badge-warning">
            Editing
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="transaction-form">
        {/* Type Selector */}
        <div className="form-group form-group--type">
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

        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="tx-title" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="tx-title"
              name="title"
              type="text"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Grocery, Salary"
              value={formData.title}
              onChange={handleChange}
              maxLength={80}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="tx-amount" className="form-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">₹</span>
              <input
                id="tx-amount"
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
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="tx-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="tx-category"
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

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="tx-date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <input
              id="tx-date"
              name="date"
              type="date"
              className={`form-input ${errors.date ? 'is-invalid' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            {isEditing ? 'Cancel' : 'Clear'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;
