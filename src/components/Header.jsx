import React from 'react';

/**
 * Topbar Header component
 * Includes Hamburger Menu (humble menu) for mobile sidebar, view title, and quick header utilities
 */
export function Header({
  activeTab,
  onOpenMobileSidebar,
  transactionCount,
  onOpenNewTransaction,
  onSimulateLoad,
  isLoading,
  theme,
  onToggleTheme,
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'ledger':
        return 'Transaction Ledger';
      case 'analytics':
        return 'Financial Analytics';
      case 'budgets':
        return 'Budget Targets';
      default:
        return 'Financial Overview';
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left: Mobile Hamburger (Humble Menu) & Brand */}
        <div className="header-left">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation menu"
            title="Open Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Brand Mark (visible on mobile / tablet when sidebar hidden) */}
          <div className="header-mobile-brand">
            <div className="brand-logo-img-wrapper">
              <img src="/logo.jpg" alt="FinanceFlow" className="brand-logo-img" />
            </div>
            <span className="brand-title">FinanceFlow</span>
          </div>

          {/* Desktop View Title & Breadcrumb */}
          <div className="header-desktop-title">
            <h1 className="header-view-title">{getTabTitle()}</h1>
            <span className="header-view-sub">Real-time Financial Ledger</span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* Records count pill */}
          <div className="storage-badge" title="Data stored in browser LocalStorage">
            <span className={`status-dot ${isLoading ? 'status-dot--pulse' : ''}`}></span>
            <span>{isLoading ? 'Syncing...' : `${transactionCount} Records`}</span>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Refresh / Sync Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm header-action-btn"
            onClick={onSimulateLoad}
            disabled={isLoading}
            title="Refresh and simulate loading skeleton"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? 'spin-icon' : ''}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span className="btn-label-desktop">Sync</span>
          </button>

          {/* New Transaction Button */}
          <button
            type="button"
            className="btn btn-primary btn-sm header-action-btn"
            onClick={onOpenNewTransaction}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ New</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
