import React, { useState, useEffect } from 'react';
import './Archives.css';

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState(null);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/archives?limit=12');
      const data = await response.json();
      
      if (data.status === 'success') {
        setArchives(data.archives);
      }
    } catch (error) {
      console.error('Failed to fetch archives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#34d399';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreRating = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="archives-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading archives...</p>
        </div>
      </div>
    );
  }

  if (selectedArchive) {
    return (
      <div className="archives-container">
        <div className="archive-detail">
          <button className="btn-back" onClick={() => setSelectedArchive(null)}>
            ← Back to Archives
          </button>
          
          <div className="archive-detail-header">
            <h1>{formatMonthYear(selectedArchive.month_year)}</h1>
            <p className="archive-date">Archived on {new Date(selectedArchive.archived_at).toLocaleDateString()}</p>
          </div>

          {/* Financial Health Score */}
          <div className="archive-score-card">
            <h2>Financial Health Score</h2>
            <div className="score-display">
              <div 
                className="score-circle" 
                style={{ 
                  borderColor: getScoreColor(selectedArchive.financial_health_score),
                  boxShadow: `0 0 20px ${getScoreColor(selectedArchive.financial_health_score)}40`
                }}
              >
                <div className="score-circle-inner">
                  <div className="score-number">{selectedArchive.financial_health_score}</div>
                  <div className="score-total">/100</div>
                </div>
              </div>
              <div 
                className="score-rating" 
                style={{ color: getScoreColor(selectedArchive.financial_health_score) }}
              >
                {getScoreRating(selectedArchive.financial_health_score)}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">💰 Savings Rate</span>
                <span className="breakdown-value">{selectedArchive.savings_score}/100</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">🎯 Budget Adherence</span>
                <span className="breakdown-value">{selectedArchive.budget_score}/100</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">📅 Tracking Consistency</span>
                <span className="breakdown-value">{selectedArchive.consistency_score}/100</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">⚖️ Spending Balance</span>
                <span className="breakdown-value">{selectedArchive.balance_score}/100</span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="archive-summary-grid">
            <div className="archive-stat-card income">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-label">Total Income</div>
                <div className="stat-value">${selectedArchive.total_income.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="archive-stat-card expense">
              <div className="stat-icon">💸</div>
              <div className="stat-content">
                <div className="stat-label">Total Expenses</div>
                <div className="stat-value">${selectedArchive.total_expenses.toFixed(2)}</div>
              </div>
            </div>
            
            <div className={`archive-stat-card net ${selectedArchive.net >= 0 ? 'positive' : 'negative'}`}>
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Net</div>
                <div className="stat-value">
                  {selectedArchive.net >= 0 ? '+' : ''}{selectedArchive.net.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="archive-stat-card transactions">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{selectedArchive.transaction_count}</div>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          {selectedArchive.transactions_json && (
            <div className="archive-transactions-section">
              <h3>📝 Transactions</h3>
              <div className="archive-transactions-list">
                {JSON.parse(selectedArchive.transactions_json).map((transaction, index) => (
                  <div key={index} className={`archive-transaction-item ${transaction.type}`}>
                    <div className="transaction-left">
                      <div className="transaction-type-icon">
                        {transaction.type === 'income' ? '💰' : '💸'}
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-description">{transaction.description}</div>
                        <div className="transaction-meta">
                          {transaction.category_name || 'Uncategorized'} • {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="archives-container">
      <div className="archives-header">
        <h1>📦 Monthly Archives</h1>
        <p className="archives-subtitle">
          View your financial history and past monthly reports
        </p>
      </div>

      {archives.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Archives Yet</h3>
          <p>Archives will appear here after you save your monthly reports.</p>
          <p className="empty-hint">Click "Archive This Month" on the dashboard to create your first archive!</p>
        </div>
      ) : (
        <div className="archives-grid">
          {archives.map(archive => (
            <div 
              key={archive.id} 
              className="archive-card"
              onClick={() => setSelectedArchive(archive)}
            >
              <div className="archive-card-header">
                <h3>{formatMonthYear(archive.month_year)}</h3>
                <div 
                  className="archive-score-badge"
                  style={{ 
                    backgroundColor: `${getScoreColor(archive.financial_health_score)}20`,
                    borderColor: getScoreColor(archive.financial_health_score),
                    color: getScoreColor(archive.financial_health_score)
                  }}
                >
                  {archive.financial_health_score}
                </div>
              </div>

              <div className="archive-card-stats">
                <div className="archive-mini-stat">
                  <span className="mini-stat-label">Income</span>
                  <span className="mini-stat-value income">${archive.total_income.toFixed(0)}</span>
                </div>
                <div className="archive-mini-stat">
                  <span className="mini-stat-label">Expenses</span>
                  <span className="mini-stat-value expense">${archive.total_expenses.toFixed(0)}</span>
                </div>
                <div className="archive-mini-stat">
                  <span className="mini-stat-label">Net</span>
                  <span className={`mini-stat-value ${archive.net >= 0 ? 'positive' : 'negative'}`}>
                    ${Math.abs(archive.net).toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="archive-card-footer">
                <span className="transaction-count">📝 {archive.transaction_count} transactions</span>
                <span className="view-details">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archives;
