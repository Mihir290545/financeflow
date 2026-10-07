import React from 'react';
import { SkeletonBreakdown } from './SkeletonLoader';
import {
  calculateMonthlySpendingHistory,
  formatCurrency,
} from '../utils/calculations';

/**
 * MonthlySpending component showing spending totals across months from actual data
 */
export function MonthlySpending({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <section className="card monthly-spending-card" aria-labelledby="monthly-spending-title">
        <div className="card-header">
          <div className="card-title-group">
            <h2 id="monthly-spending-title" className="card-title">Monthly Spending</h2>
          </div>
        </div>
        <div className="monthly-spending-body">
          <SkeletonBreakdown />
        </div>
      </section>
    );
  }

  const history = calculateMonthlySpendingHistory(transactions);

  // Compute total and monthly average
  const totalTrackedExpenses = history.reduce((sum, item) => sum + item.total, 0);
  const averageMonthlySpend =
    history.length > 0 ? Math.round(totalTrackedExpenses / history.length) : 0;

  return (
    <section className="card monthly-spending-card" aria-labelledby="monthly-spending-title">
      <div className="card-header">
        <div className="card-title-group">
          <h2 id="monthly-spending-title" className="card-title">Monthly Spending</h2>
        </div>
        {history.length > 0 && (
          <div className="monthly-stat-badge">
            <span className="monthly-stat-label">Avg:</span>
            <span className="monthly-stat-val">{formatCurrency(averageMonthlySpend)}</span>
          </div>
        )}
      </div>

      <div className="monthly-spending-body">
        {history.length === 0 ? (
          <div className="empty-category-note">
            <p>No expense transactions recorded yet.</p>
          </div>
        ) : (
          <div className="monthly-bars-list">
            {history.map(({ monthKey, monthLabel, total, relativeWidth }) => (
              <div key={monthKey} className="monthly-bar-item">
                <div className="monthly-item-header">
                  <span className="monthly-label">{monthLabel}</span>
                  <span className="monthly-amount">{formatCurrency(total)}</span>
                </div>

                <div
                  className="monthly-track"
                  role="progressbar"
                  aria-valuenow={relativeWidth}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`${monthLabel}: ${formatCurrency(total)}`}
                >
                  <div
                    className="monthly-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(3, relativeWidth))}%` }}
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

export default MonthlySpending;
