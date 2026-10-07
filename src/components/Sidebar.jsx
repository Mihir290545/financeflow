import React from 'react';

/**
 * Sidebar component
 * Serves as persistent desktop sidebar and animated slide-out mobile drawer
 */
export function Sidebar({
  activeTab,
  onTabChange,
  transactionCount,
  isOpenMobile,
  onCloseMobile,
  theme,
  onToggleTheme,
  onResetData,
  onSimulateLoad,
  isLoading,
  onOpenNewTransaction,
}) {
  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpenMobile ? 'is-mobile-open' : ''}`} aria-label="Sidebar Navigation">
        <div className="sidebar-container">
          {/* Top Brand */}
          <div className="sidebar-brand">
            <div className="brand-logo-img-wrapper" title="FinanceFlow Operating System">
              <img src="/logo.jpg" alt="FinanceFlow Logo" className="brand-logo-img" />
            </div>
            <div className="brand-text">
              <div className="brand-title-wrap">
                <span className="brand-title">FinanceFlow</span>
                <span className="brand-badge-pro">PRO</span>
              </div>
              <span className="brand-tagline">Financial OS</span>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              className="sidebar-mobile-close"
              onClick={onCloseMobile}
              aria-label="Close navigation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="sidebar-action-wrap">
            <button
              type="button"
              className="btn btn-primary sidebar-new-btn"
              onClick={() => {
                onOpenNewTransaction();
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>New Transaction</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <div className="sidebar-nav-section-title">Menu</div>
            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'overview' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('overview')}
            >
              <div className="nav-item-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <span className="nav-item-label">Overview</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'ledger' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('ledger')}
            >
              <div className="nav-item-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
              <span className="nav-item-label">Transaction Ledger</span>
              <span className="sidebar-count-badge">{transactionCount}</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'analytics' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('analytics')}
            >
              <div className="nav-item-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <span className="nav-item-label">Analytics</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-item ${activeTab === 'budgets' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('budgets')}
            >
              <div className="nav-item-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="12 6 12 12 16 14"></polygon>
                </svg>
              </div>
              <span className="nav-item-label">Budgets &amp; Goals</span>
            </button>
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="sidebar-footer">
            <div className="sidebar-quick-status">
              <span className="sidebar-status-dot"></span>
              <span className="sidebar-status-text">Encrypted Storage</span>
            </div>

            <div className="sidebar-footer-actions">
              {/* Theme Toggle */}
              <button
                type="button"
                className="sidebar-tool-btn"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Sync Button */}
              <button
                type="button"
                className="sidebar-tool-btn"
                onClick={onSimulateLoad}
                disabled={isLoading}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isLoading ? 'spin-icon' : ''}>
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
              </button>

              {/* Reset Demo Data */}
              <button
                type="button"
                className="sidebar-tool-btn sidebar-tool-btn--danger"
                onClick={onResetData}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
