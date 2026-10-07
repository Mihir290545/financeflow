import React from 'react';
import { formatCurrency } from '../utils/calculations';

/**
 * SummaryCard component with sleek modern metrics display
 */
export function SummaryCard({ title, amount, badgeText, badgeVariant = 'neutral', variant = 'neutral', icon }) {
  const isNegative = amount < 0;

  return (
    <div className={`summary-card summary-card--${variant}`}>
      <div className="summary-card__header">
        <span className="summary-card__title">{title}</span>
        {icon && <div className="summary-card__icon" aria-hidden="true">{icon}</div>}
      </div>

      <div className="summary-card__body">
        <div className={`summary-card__amount ${isNegative && variant === 'balance' ? 'amount--negative' : ''}`}>
          {formatCurrency(amount)}
        </div>
        {badgeText && (
          <div className="summary-card__badge-row">
            <span className={`metric-pill metric-pill--${badgeVariant}`}>
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
