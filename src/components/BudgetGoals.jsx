import React from 'react';
import CategoryIcon from './CategoryIcon';
import { calculateCategoryTotals, formatCurrency } from '../utils/calculations';

// Default monthly category budget benchmarks
const DEFAULT_BUDGETS = {
  Food: 6000,
  Transportation: 2500,
  Education: 20000,
  Bills: 5000,
  Shopping: 4000,
  Entertainment: 3000,
  Healthcare: 5000,
  Other: 3000,
};

/**
 * BudgetGoals component
 * Tracks category expense thresholds with progress bars and alerts
 */
export function BudgetGoals({ transactions }) {
  const categoryTotals = calculateCategoryTotals(transactions);

  // Map category spent against allocated budgets
  const budgetList = Object.entries(DEFAULT_BUDGETS).map(([category, budgetAmount]) => {
    const item = categoryTotals.find((c) => c.category === category);
    const spent = item ? item.total : 0;
    const percentage = Math.round((spent / budgetAmount) * 100);
    const isOver = spent > budgetAmount;
    const isWarning = percentage >= 80 && !isOver;

    return {
      category,
      budgetAmount,
      spent,
      percentage,
      isOver,
      isWarning,
    };
  });

  const totalBudget = Object.values(DEFAULT_BUDGETS).reduce((a, b) => a + b, 0);
  const totalSpent = budgetList.reduce((sum, b) => sum + b.spent, 0);
  const overallPace = Math.round((totalSpent / totalBudget) * 100);

  return (
    <section className="card budget-card" aria-labelledby="budget-heading">
      <div className="card-header">
        <div className="card-title-group">
          <h2 id="budget-heading" className="card-title">Monthly Budget Targets</h2>
        </div>
        <div className="budget-overall-pill">
          <span>Overall: <strong>{overallPace}%</strong> of {formatCurrency(totalBudget)}</span>
        </div>
      </div>

      <div className="budget-body">
        <div className="budget-grid-list">
          {budgetList.map((b) => (
            <div key={b.category} className="budget-item">
              <div className="budget-item-top">
                <div className="budget-cat-info">
                  <div className="budget-cat-icon">
                    <CategoryIcon category={b.category} size={15} />
                  </div>
                  <span className="budget-cat-name">{b.category}</span>
                </div>

                <div className="budget-item-amounts">
                  <span className={`budget-spent ${b.isOver ? 'text-expense font-bold' : ''}`}>
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="budget-target">/ {formatCurrency(b.budgetAmount)}</span>
                </div>
              </div>

              <div
                className="budget-track"
                role="progressbar"
                aria-valuenow={b.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className={`budget-fill ${
                    b.isOver ? 'budget-fill--over' : b.isWarning ? 'budget-fill--warn' : 'budget-fill--safe'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(3, b.percentage))}%` }}
                ></div>
              </div>

              <div className="budget-item-bottom">
                <span className="budget-status-text">
                  {b.isOver ? 'Budget Exceeded!' : `${formatCurrency(b.budgetAmount - b.spent)} remaining`}
                </span>
                <span className={`budget-pct-badge ${b.isOver ? 'badge-danger' : b.isWarning ? 'badge-warn' : ''}`}>
                  {b.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BudgetGoals;
