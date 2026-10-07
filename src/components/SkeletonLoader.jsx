import React from 'react';

/**
 * Skeleton loaders with high-fidelity shimmer animations for fintech polish
 */

export function SkeletonSummaryCards() {
  return (
    <section className="summary-cards-section" aria-label="Loading Overview">
      <div className="summary-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="summary-card skeleton-card">
            <div className="summary-card__header">
              <div className="skeleton-line skeleton-title-pill"></div>
              <div className="skeleton-avatar"></div>
            </div>
            <div className="summary-card__body">
              <div className="skeleton-line skeleton-amount-lg"></div>
              <div className="skeleton-line skeleton-subtitle-sm"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkeletonTransactionTable() {
  return (
    <div className="skeleton-table-wrapper">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton-table-row">
          <div className="skeleton-avatar skeleton-avatar--sm"></div>
          <div className="skeleton-col-group">
            <div className="skeleton-line skeleton-tx-title"></div>
            <div className="skeleton-line skeleton-tx-sub"></div>
          </div>
          <div className="skeleton-line skeleton-pill"></div>
          <div className="skeleton-line skeleton-date"></div>
          <div className="skeleton-line skeleton-amount-pill"></div>
          <div className="skeleton-line skeleton-btn"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTransactionCards() {
  return (
    <div className="mobile-cards-list skeleton-cards-list">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="tx-card-mobile skeleton-card">
          <div className="tx-card-mobile__top">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-col-group" style={{ flex: 1 }}>
              <div className="skeleton-line skeleton-tx-title"></div>
              <div className="skeleton-line skeleton-tx-sub"></div>
            </div>
            <div className="skeleton-line skeleton-amount-pill"></div>
          </div>
          <div className="tx-card-mobile__bottom">
            <div className="skeleton-line skeleton-pill"></div>
            <div className="skeleton-line skeleton-btn"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonBreakdown() {
  return (
    <div className="skeleton-breakdown-list">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-bar-item">
          <div className="skeleton-bar-header">
            <div className="skeleton-line skeleton-label"></div>
            <div className="skeleton-line skeleton-val"></div>
          </div>
          <div className="skeleton-line skeleton-progress-track"></div>
        </div>
      ))}
    </div>
  );
}
