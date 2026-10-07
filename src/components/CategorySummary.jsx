import React from 'react';
import CategoryIcon from './CategoryIcon';
import { SkeletonBreakdown } from './SkeletonLoader';
import { calculateCategoryTotals, formatCurrency } from '../utils/calculations';

/**
 * CategorySummary component showing expense breakdown by category with sleek progress bars and icons
 */
export function CategorySummary({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <section className="card category-summary-card" aria-labelledby="category-summary-title">
        <div className="card-header">
          <div className="card-title-group">
            <h2 id="category-summary-title" className="card-title">Expense by Category</h2>
          </div>
        </div>
        <div className="category-summary-body">
          <SkeletonBreakdown />
        </div>
      </section>
    );
  }

  const categoryTotals = calculateCategoryTotals(transactions);

  return (
    <section className="card category-summary-card" aria-labelledby="category-summary-title">
      <div className="card-header">
        <div className="card-title-group">
          <h2 id="category-summary-title" className="card-title">Expense by Category</h2>
        </div>
        {categoryTotals.length > 0 && (
          <span className="count-tag">{categoryTotals.length} Categories</span>
        )}
      </div>

      <div className="category-summary-body">
        {categoryTotals.length === 0 ? (
          <div className="empty-category-note">
            <p>No expense transactions recorded yet.</p>
          </div>
        ) : (
          <div className="category-breakdown-list">
            {categoryTotals.map(({ category, total, percentage }) => (
              <div key={category} className="category-breakdown-item">
                <div className="category-item-header">
                  <div className="category-item-title-group">
                    <span className="category-mini-icon">
                      <CategoryIcon category={category} size={14} />
                    </span>
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="category-figures">
                    <span className="category-amount">{formatCurrency(total)}</span>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${category}: ${percentage}% of total expenses`}
                >
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(3, percentage))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategorySummary;
