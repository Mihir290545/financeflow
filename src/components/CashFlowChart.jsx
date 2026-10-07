import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/calculations';

/**
 * CashFlowChart component
 * High-end Fintech Cash Flow Trend visualizer with Area Curve, Guide Grid, and Tooltip Inspection
 */
export function CashFlowChart({ transactions }) {
  // Aggregate data by month
  const data = useMemo(() => {
    const monthsMap = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const monthKey = tx.date.slice(0, 7); // "YYYY-MM"
      if (!monthsMap[monthKey]) {
        const dateObj = new Date(monthKey + '-01');
        const label = dateObj.toLocaleDateString('en-IN', { month: 'short' });
        monthsMap[monthKey] = {
          key: monthKey,
          label,
          income: 0,
          expense: 0,
        };
      }
      if (tx.type === 'income') {
        monthsMap[monthKey].income += Number(tx.amount) || 0;
      } else {
        monthsMap[monthKey].expense += Number(tx.amount) || 0;
      }
    });

    const keys = Object.keys(monthsMap).sort();
    return keys.map((k) => monthsMap[k]);
  }, [transactions]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [chartType, setChartType] = useState('bars'); // 'bars' | 'area'

  if (data.length === 0) return null;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    10000
  );

  const activeIndex = hoveredIndex !== null ? hoveredIndex : data.length - 1;
  const activeMonth = data[activeIndex] || data[data.length - 1];
  const netSaved = activeMonth ? activeMonth.income - activeMonth.expense : 0;

  // Chart dimensions for SVG area rendering
  const width = 600;
  const height = 180;
  const paddingX = 30;
  const paddingY = 20;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Compute SVG Points for Area chart
  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const incomePoints = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + chartH - (d.income / maxVal) * chartH;
    return { x, y };
  });

  const expensePoints = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + chartH - (d.expense / maxVal) * chartH;
    return { x, y };
  });

  const buildPath = (pts) => {
    if (!pts.length) return '';
    return pts.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
  };

  const incomePath = buildPath(incomePoints);
  const expensePath = buildPath(expensePoints);

  const incomeArea = incomePoints.length
    ? `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${height - paddingY} L ${incomePoints[0].x} ${height - paddingY} Z`
    : '';

  const expenseArea = expensePoints.length
    ? `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${height - paddingY} L ${expensePoints[0].x} ${height - paddingY} Z`
    : '';

  return (
    <section className="card cashflow-chart-card" aria-labelledby="cashflow-heading">
      <div className="card-header cashflow-header">
        <div className="card-title-group">
          <h2 id="cashflow-heading" className="card-title">Cash Flow Trajectory</h2>
          <span className="count-tag">{data.length} Months Tracked</span>
        </div>

        <div className="chart-header-controls">
          <div className="chart-type-toggle">
            <button
              type="button"
              className={`chart-type-btn ${chartType === 'bars' ? 'is-active' : ''}`}
              onClick={() => setChartType('bars')}
              title="Bar Comparison"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="20" x2="6" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="18" y1="20" x2="18" y2="14"></line>
              </svg>
              <span>Bars</span>
            </button>
            <button
              type="button"
              className={`chart-type-btn ${chartType === 'area' ? 'is-active' : ''}`}
              onClick={() => setChartType('area')}
              title="Area Trend"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17l6-6 4 4 8-8"></path>
              </svg>
              <span>Trend</span>
            </button>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot legend-dot--income"></span>
              <span>Inflow</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-dot--expense"></span>
              <span>Outflow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cashflow-body">
        {/* Active Month Inspection Strip */}
        {activeMonth && (
          <div className="chart-active-stat-bar">
            <div className="active-stat-col">
              <span className="stat-label">Month</span>
              <span className="stat-value">{activeMonth.label}</span>
            </div>
            <div className="active-stat-col">
              <span className="stat-label">Inflow</span>
              <span className="stat-value text-income">+{formatCurrency(activeMonth.income)}</span>
            </div>
            <div className="active-stat-col">
              <span className="stat-label">Outflow</span>
              <span className="stat-value text-expense">-{formatCurrency(activeMonth.expense)}</span>
            </div>
            <div className="active-stat-col">
              <span className="stat-label">Net Saved</span>
              <span className={`stat-value ${netSaved >= 0 ? 'text-income' : 'text-expense'}`}>
                {netSaved >= 0 ? '+' : ''}{formatCurrency(netSaved)}
              </span>
            </div>
          </div>
        )}

        {/* Visualizer Area */}
        <div className="chart-canvas-area">
          {chartType === 'bars' ? (
            /* Bar Chart Layout */
            <div className="chart-bars-viewport">
              {/* Background Guide Rules */}
              <div className="chart-grid-guides">
                <div className="guide-line"><span>{formatCurrency(maxVal)}</span></div>
                <div className="guide-line"><span>{formatCurrency(maxVal / 2)}</span></div>
                <div className="guide-line"><span>₹0</span></div>
              </div>

              <div className="chart-bars-container">
                {data.map((item, idx) => {
                  const incomeHeight = Math.max(4, Math.round((item.income / maxVal) * 100));
                  const expenseHeight = Math.max(4, Math.round((item.expense / maxVal) * 100));
                  const isSelected = idx === activeIndex;

                  return (
                    <div
                      key={item.key}
                      className={`chart-bar-group ${isSelected ? 'is-selected' : ''}`}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onClick={() => setHoveredIndex(idx)}
                    >
                      <div className="bars-track-pair">
                        <div className="bar-wrapper" title={`Inflow: ${formatCurrency(item.income)}`}>
                          <div
                            className="bar-fill bar-fill--income"
                            style={{ height: `${incomeHeight}%` }}
                          ></div>
                        </div>

                        <div className="bar-wrapper" title={`Outflow: ${formatCurrency(item.expense)}`}>
                          <div
                            className="bar-fill bar-fill--expense"
                            style={{ height: `${expenseHeight}%` }}
                          ></div>
                        </div>
                      </div>

                      <span className="chart-bar-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Area Trend SVG Wave Layout */
            <div className="chart-svg-viewport">
              <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg-elem" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--color-border)" strokeDasharray="3 3" />
                <line x1={paddingX} y1={paddingY + chartH / 2} x2={width - paddingX} y2={paddingY + chartH / 2} stroke="var(--color-border)" strokeDasharray="3 3" />
                <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--color-border)" />

                {/* Area Fills */}
                <path d={incomeArea} fill="url(#incomeAreaGrad)" />
                <path d={expenseArea} fill="url(#expenseAreaGrad)" />

                {/* Stroke Lines */}
                <path d={incomePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <path d={expensePath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

                {/* Data Points */}
                {incomePoints.map((pt, i) => (
                  <circle
                    key={`inc-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === activeIndex ? 5 : 3.5}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="chart-data-node"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                ))}
                {expensePoints.map((pt, i) => (
                  <circle
                    key={`exp-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === activeIndex ? 5 : 3.5}
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="chart-data-node"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                ))}
              </svg>

              {/* Month Labels below SVG */}
              <div className="chart-svg-labels">
                {data.map((d, i) => (
                  <span
                    key={d.key}
                    className={`svg-label-item ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => setHoveredIndex(i)}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CashFlowChart;
