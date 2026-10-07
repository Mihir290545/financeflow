import React from 'react';
import SummaryCard from './SummaryCard';
import { SkeletonSummaryCards } from './SkeletonLoader';
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateMonthlyExpenses,
} from '../utils/calculations';

/**
 * SummaryCards grid displaying key dashboard financial metrics with crisp executive badges
 */
export function SummaryCards({ transactions, currentMonthKey, currentMonthLabel, isLoading }) {
  if (isLoading) {
    return <SkeletonSummaryCards />;
  }

  const balance = calculateBalance(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const monthlyExpenses = calculateMonthlyExpenses(transactions, currentMonthKey);

  const incomeTxCount = transactions.filter((t) => t.type === 'income').length;
  const expenseTxCount = transactions.filter((t) => t.type === 'expense').length;

  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;

  return (
    <section className="summary-cards-section" aria-label="Financial Overview">
      <div className="summary-grid">
        <SummaryCard
          title="Net Balance"
          amount={balance}
          badgeText={balance >= 0 ? `${savingsRate}% Saved` : 'Deficit'}
          badgeVariant={balance >= 0 ? 'success' : 'danger'}
          variant="balance"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          }
        />

        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          badgeText={`${incomeTxCount} ${incomeTxCount === 1 ? 'Inflow' : 'Inflows'}`}
          badgeVariant="success"
          variant="income"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          }
        />

        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          badgeText={`${expenseTxCount} ${expenseTxCount === 1 ? 'Outflow' : 'Outflows'}`}
          badgeVariant="danger"
          variant="expense"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          }
        />

        <SummaryCard
          title="Monthly Spending"
          amount={monthlyExpenses}
          badgeText={currentMonthLabel || 'This Month'}
          badgeVariant="primary"
          variant="monthly"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="22" y2="10"></line>
            </svg>
          }
        />
      </div>
    </section>
  );
}

export default SummaryCards;
