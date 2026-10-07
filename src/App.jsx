import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import CashFlowChart from './components/CashFlowChart';
import FilterBar from './components/FilterBar';
import TransactionList from './components/TransactionList';
import CategorySummary from './components/CategorySummary';
import MonthlySpending from './components/MonthlySpending';
import BudgetGoals from './components/BudgetGoals';
import TransactionModal from './components/TransactionModal';
import {
  loadTransactions,
  saveTransactions,
  resetToSampleData,
} from './utils/storage';
import {
  filterTransactions,
  sortTransactions,
  getAvailableMonths,
  exportTransactionsCSV,
} from './utils/calculations';

const DEFAULT_FILTERS = {
  searchTerm: '',
  typeFilter: 'all',
  categoryFilter: 'all',
  monthFilter: 'all',
  sortKey: 'newest',
};

function getCurrentMonthInfo() {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const label = now.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
  return { currentMonthKey: key, currentMonthLabel: label };
}

const { currentMonthKey, currentMonthLabel } = getCurrentMonthInfo();

export function App() {
  // Main transaction state
  const [transactions, setTransactions] = useState(() => loadTransactions());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Light theme by default as requested by user
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('financeflow_theme') || 'light';
  });

  // Mobile navigation sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal dialog state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Loading skeleton state
  const [isLoading, setIsLoading] = useState(true);

  // View mode for transactions: 'table' | 'cards'
  const [viewMode, setViewMode] = useState('table');

  // Filter & search state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Synchronize theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('financeflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initial load skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Available months
  const availableMonths = useMemo(() => {
    return getAvailableMonths(transactions);
  }, [transactions]);

  // Displayed transactions (filtered & sorted)
  const displayedTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, filters);
    return sortTransactions(filtered, filters.sortKey);
  }, [transactions, filters]);

  // Recent 5 transactions for overview dashboard
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  // Handlers
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetToSampleData = () => {
    const confirmed = window.confirm(
      'Reset all data back to the default sample dataset? Any custom transactions will be replaced.'
    );
    if (confirmed) {
      setIsLoading(true);
      setTimeout(() => {
        const seeded = resetToSampleData();
        setTransactions(seeded);
        setEditingTransaction(null);
        setFilters(DEFAULT_FILTERS);
        setIsLoading(false);
      }, 400);
    }
  };

  const handleSimulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  const handleExportCSV = () => {
    exportTransactionsCSV(displayedTransactions);
  };

  return (
    <div className="app-layout">
      {/* Executive Sidebar (Desktop Persistent + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactionCount={transactions.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onResetData={handleResetToSampleData}
        onSimulateLoad={handleSimulateLoad}
        isLoading={isLoading}
        onOpenNewTransaction={handleOpenNew}
      />

      {/* Main Content Area */}
      <div className="app-main-viewport">
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          transactionCount={transactions.length}
          onOpenNewTransaction={handleOpenNew}
          onSimulateLoad={handleSimulateLoad}
          isLoading={isLoading}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="app-main">
          <div className="content-container">
            {/* Top KPI Cards */}
            <SummaryCards
              transactions={transactions}
              currentMonthKey={currentMonthKey}
              currentMonthLabel={currentMonthLabel}
              isLoading={isLoading}
            />

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="overview-tab-content">
                {/* Balanced Grid: Left Chart & Recent Activity, Right Breakdowns */}
                <div className="dashboard-grid">
                  {/* Left Column */}
                  <div className="dashboard-column dashboard-column--main">
                    {/* Rich Cash Flow Trajectory Chart */}
                    <CashFlowChart transactions={transactions} />

                    {/* Recent Activity List */}
                    <section className="card recent-activity-card" aria-labelledby="recent-heading">
                      <div className="card-header">
                        <div className="card-title-group">
                          <h2 id="recent-heading" className="card-title">Recent Activity</h2>
                          <span className="count-tag">Latest Entries</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setActiveTab('ledger')}
                        >
                          <span>Full Ledger &rarr;</span>
                        </button>
                      </div>

                      <div className="recent-activity-body">
                        <TransactionList
                          transactions={recentTransactions}
                          totalUnfilteredCount={transactions.length}
                          onEdit={handleStartEdit}
                          onDelete={handleDeleteTransaction}
                          editingTransactionId={editingTransaction?.id}
                          onResetFilters={handleResetFilters}
                          onScrollToForm={handleOpenNew}
                          viewMode={viewMode}
                          isLoading={isLoading}
                        />
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Spending Breakdowns */}
                  <div className="dashboard-column dashboard-column--side">
                    <CategorySummary
                      transactions={transactions}
                      isLoading={isLoading}
                    />

                    <MonthlySpending
                      transactions={transactions}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LEDGER */}
            {activeTab === 'ledger' && (
              <section className="card ledger-card ledger-full-page" aria-labelledby="ledger-page-heading">
                <div className="card-header ledger-header">
                  <div className="card-title-group">
                    <h2 id="ledger-page-heading" className="card-title">
                      Complete Transaction Ledger
                    </h2>
                    <span className="count-tag">{displayedTransactions.length} of {transactions.length}</span>
                  </div>
                </div>

                <div className="ledger-body">
                  <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    availableMonths={availableMonths}
                    totalCount={transactions.length}
                    filteredCount={displayedTransactions.length}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onExportCSV={handleExportCSV}
                  />

                  <TransactionList
                    transactions={displayedTransactions}
                    totalUnfilteredCount={transactions.length}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteTransaction}
                    editingTransactionId={editingTransaction?.id}
                    onResetFilters={handleResetFilters}
                    onScrollToForm={handleOpenNew}
                    viewMode={viewMode}
                    isLoading={isLoading}
                  />
                </div>
              </section>
            )}

            {/* TAB 3: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="analytics-tab-content">
                <CashFlowChart transactions={transactions} />

                <div className="dashboard-grid dashboard-grid--equal">
                  <CategorySummary
                    transactions={transactions}
                    isLoading={isLoading}
                  />
                  <MonthlySpending
                    transactions={transactions}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: BUDGETS */}
            {activeTab === 'budgets' && (
              <div className="budgets-tab-content">
                <BudgetGoals transactions={transactions} />
              </div>
            )}
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-info">
              <span className="footer-title">FinanceFlow</span>
              <span className="footer-separator">•</span>
              <span className="footer-text">Personal Finance Dashboard</span>
            </div>
            <div className="footer-meta">
              <span>Client-side Encrypted Storage</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Slide-over Transaction Modal */}
      <TransactionModal
        key={editingTransaction ? editingTransaction.id : (isModalOpen ? 'open' : 'closed')}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}

export default App;
