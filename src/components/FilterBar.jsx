import React from 'react';
import { ALL_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/initialTransactions';

/**
 * FilterBar component for searching, filtering, sorting, export, and view switching
 */
export function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  availableMonths,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  onExportCSV,
}) {
  const { searchTerm, typeFilter, categoryFilter, monthFilter, sortKey } = filters;

  let categoryOptions = ALL_CATEGORIES;
  if (typeFilter === 'income') {
    categoryOptions = INCOME_CATEGORIES;
  } else if (typeFilter === 'expense') {
    categoryOptions = EXPENSE_CATEGORIES;
  }

  const isFiltered =
    searchTerm !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    monthFilter !== 'all' ||
    sortKey !== 'newest';

  return (
    <div className="filter-bar">
      {/* Top row: Search input, View mode switcher, Export, and count */}
      <div className="filter-top-row">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            aria-label="Search transactions"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onFilterChange('searchTerm', '')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-top-actions">
          {/* Export to CSV */}
          {onExportCSV && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onExportCSV}
              title="Download filtered transactions as CSV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export CSV</span>
            </button>
          )}

          {/* View Mode Switcher */}
          <div className="view-mode-toggle" role="group" aria-label="Display View">
            <button
              type="button"
              className={`view-mode-btn ${viewMode !== 'cards' ? 'is-active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
              aria-label="Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="view-mode-label">Table</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'cards' ? 'is-active' : ''}`}
              onClick={() => onViewModeChange('cards')}
              title="Card View"
              aria-label="Card View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span className="view-mode-label">Cards</span>
            </button>
          </div>

          <div className="filter-count-badge">
            <span>{filteredCount} of {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Filter dropdowns and Sort */}
      <div className="filter-controls-row">
        {/* Type Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-type" className="filter-label">Type</label>
          <select
            id="filter-type"
            className="filter-select"
            value={typeFilter}
            onChange={(e) => {
              onFilterChange('typeFilter', e.target.value);
              onFilterChange('categoryFilter', 'all');
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-category" className="filter-label">Category</label>
          <select
            id="filter-category"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => onFilterChange('categoryFilter', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-month" className="filter-label">Month</label>
          <select
            id="filter-month"
            className="filter-select"
            value={monthFilter}
            onChange={(e) => onFilterChange('monthFilter', e.target.value)}
          >
            <option value="all">All Months</option>
            {availableMonths.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-control-item">
          <label htmlFor="filter-sort" className="filter-label">Sort</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={sortKey}
            onChange={(e) => onFilterChange('sortKey', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <div className="filter-control-item filter-control-item--reset">
            <button
              type="button"
              className="btn btn-secondary btn-sm filter-reset-btn"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
