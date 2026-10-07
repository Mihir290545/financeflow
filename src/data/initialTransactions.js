/**
 * Category definitions and initial seed data for FinanceFlow
 * Designed with realistic Indian Rupee (₹) amounts for a college student / fresher developer.
 */

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Bills',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Other',
];

export const ALL_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    title: 'Monthly Salary',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    date: '2026-10-01',
  },
  {
    id: 'tx-102',
    title: 'Semester College Fees',
    amount: 18000,
    type: 'expense',
    category: 'Education',
    date: '2026-10-02',
  },
  {
    id: 'tx-103',
    title: 'Grocery & Essentials',
    amount: 4250,
    type: 'expense',
    category: 'Food',
    date: '2026-10-03',
  },
  {
    id: 'tx-104',
    title: 'Freelance Web Design',
    amount: 14500,
    type: 'income',
    category: 'Freelance',
    date: '2026-10-04',
  },
  {
    id: 'tx-105',
    title: 'High-speed Internet Bill',
    amount: 1199,
    type: 'expense',
    category: 'Bills',
    date: '2026-10-04',
  },
  {
    id: 'tx-106',
    title: 'Metro Pass & Commute',
    amount: 1450,
    type: 'expense',
    category: 'Transportation',
    date: '2026-10-05',
  },
  {
    id: 'tx-107',
    title: 'Tech Book & Study Material',
    amount: 980,
    type: 'expense',
    category: 'Education',
    date: '2026-10-06',
  },
  {
    id: 'tx-108',
    title: 'Team Dinner / Restaurant',
    amount: 1650,
    type: 'expense',
    category: 'Food',
    date: '2026-09-28',
  },
  {
    id: 'tx-109',
    title: 'Electricity Utility Bill',
    amount: 2400,
    type: 'expense',
    category: 'Bills',
    date: '2026-09-22',
  },
  {
    id: 'tx-110',
    title: 'Freelance Frontend Task',
    amount: 8000,
    type: 'income',
    category: 'Freelance',
    date: '2026-09-15',
  },
  {
    id: 'tx-111',
    title: 'Monthly Salary',
    amount: 45000,
    type: 'income',
    category: 'Salary',
    date: '2026-08-01',
  },
  {
    id: 'tx-112',
    title: 'Laptop Repair & Service',
    amount: 3200,
    type: 'expense',
    category: 'Bills',
    date: '2026-08-14',
  },
  {
    id: 'tx-113',
    title: 'Monthly Salary',
    amount: 42000,
    type: 'income',
    category: 'Salary',
    date: '2026-07-01',
  },
  {
    id: 'tx-114',
    title: 'Online Course Certification',
    amount: 4500,
    type: 'expense',
    category: 'Education',
    date: '2026-07-18',
  },
  {
    id: 'tx-115',
    title: 'Monthly Salary',
    amount: 42000,
    type: 'income',
    category: 'Salary',
    date: '2026-06-01',
  },
  {
    id: 'tx-116',
    title: 'Summer Commute Pass',
    amount: 1800,
    type: 'expense',
    category: 'Transportation',
    date: '2026-06-12',
  },
  {
    id: 'tx-117',
    title: 'Monthly Salary',
    amount: 40000,
    type: 'income',
    category: 'Salary',
    date: '2026-05-01',
  },
  {
    id: 'tx-118',
    title: 'Groceries & Provisions',
    amount: 3800,
    type: 'expense',
    category: 'Food',
    date: '2026-05-20',
  },
];
