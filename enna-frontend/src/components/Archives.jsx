import React, { useState, useEffect } from 'react';
import './Archives.css';

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [lastArchiveDate, setLastArchiveDate] = useState(null);
  const [editingArchiveId, setEditingArchiveId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [nextStartDate, setNextStartDate] = useState(null);

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
        
        // Get the most recent archive date
        if (data.archives.length > 0) {
          setLastArchiveDate(data.archives[0].month_year);
        }
      }

      // Get next start date
      const startDateRes = await fetch('http://localhost:5000/api/archives/next-start-date');
      const startDateData = await startDateRes.json();
      if (startDateData.status === 'success') {
        setNextStartDate(startDateData.start_date);
      }
    } catch (error) {
      console.error('Failed to fetch archives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveClick = () => {
    // Get current date (with dev override support)
    let today;
    const devOverride = localStorage.getItem('enna_datetime_override') === 'true';
    
    if (devOverride) {
      const overrideDate = localStorage.getItem('enna_override_date');
      if (overrideDate) {
        today = new Date(overrideDate);
      } else {
        today = new Date();
      }
    } else {
      today = new Date();
    }
    
    const dayOfMonth = today.getDate();
    const currentMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Calculate what month we're trying to archive (previous month)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthName = lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Check if this month already archived
    if (lastArchiveDate === lastMonthYear) {
      setWarningMessage(`⚠️ ${lastMonthName} has already been archived! Archiving again will overwrite the existing data.`);
    }
    // Check if it's too early (not first week)
    else if (dayOfMonth > 7) {
      setWarningMessage(`⏰ It's currently day ${dayOfMonth} of the month. It's recommended to archive during the first week (days 1-7) to ensure you've added all transactions from last month.`);
    }
    // All good - ideal time to archive
    else {
      setWarningMessage('');
    }
    
    setShowConfirmation(true);
  };

  const handleArchiveMonth = async () => {
    try {
      setIsArchiving(true);
      setShowConfirmation(false);
      
      // Get current date (with dev override support)
      let today;
      const devOverride = localStorage.getItem('enna_datetime_override') === 'true';
      
      if (devOverride) {
        const overrideDate = localStorage.getItem('enna_override_date');
        if (overrideDate) {
          today = new Date(overrideDate);
        } else {
          today = new Date();
        }
      } else {
        today = new Date();
      }
      
      // Get previous month for the archive key
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const monthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
      
      // Fetch current summary and transactions
      const summaryRes = await fetch('http://localhost:5000/api/summary');
      const summaryData = await summaryRes.json();
      
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=1000');
      const transData = await transRes.json();
      
      if (summaryData.status !== 'success' || transData.status !== 'success') {
        alert('Failed to fetch data for archiving');
        return;
      }
      
      // Calculate financial health scores
      const scores = calculateScores(
        summaryData.summary.total_income,
        summaryData.summary.total_expenses,
        transData.transactions.length
      );
      
      // Use dynamic date range: from nextStartDate to today
      const endDateStr = today.toISOString().split('T')[0];
      const startDateStr = nextStartDate || endDateStr; // Fallback to today if no next start date
      
      const dateRange = {
        start: startDateStr,
        end: endDateStr
      };

      // Generate archive name from date range
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const archiveName = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
      
      // Create archive
      const archiveData = {
        month_year: monthYear,
        name: archiveName,
        summary_data: {
          total_income: summaryData.summary.total_income,
          total_expenses: summaryData.summary.total_expenses,
          net: summaryData.summary.net,
          transaction_count: transData.transactions.length
        },
        scores: scores,
        transactions_json: JSON.stringify(transData.transactions),
        date_range: dateRange
      };
      
      const response = await fetch('http://localhost:5000/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archiveData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        alert(`📦 Archive "${archiveName}" created successfully! ${data.transactions_cleared} transactions cleared.`);
        fetchArchives(); // Refresh archives list
      } else {
        alert('Failed to create archive: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to archive month:', error);
      alert('Failed to create archive. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  };

  const handleRenameClick = (archive, e) => {
    e.stopPropagation(); // Prevent opening archive detail
    setEditingArchiveId(archive.id);
    setEditingName(archive.name || formatMonthYear(archive));
  };

  const handleRenameSave = async (archiveId, e) => {
    e?.stopPropagation();
    
    if (!editingName.trim()) {
      alert('Please enter a name for the archive');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/archives/${archiveId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingName })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Update local state
        setArchives(archives.map(a => 
          a.id === archiveId ? { ...a, name: editingName } : a
        ));
        
        // Update selected archive if it's the one being renamed
        if (selectedArchive && selectedArchive.id === archiveId) {
          setSelectedArchive({ ...selectedArchive, name: editingName });
        }
        
        setEditingArchiveId(null);
        setEditingName('');
      } else {
        alert('Failed to rename archive: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to rename archive:', error);
      alert('Failed to rename archive. Please try again.');
    }
  };

  const handleRenameCancel = (e) => {
    e?.stopPropagation();
    setEditingArchiveId(null);
    setEditingName('');
  };

  const calculateScores = (income, expenses, transactionCount) => {
    // Calculate savings score (0-100)
    const savingsScore = (() => {
      if (income === 0) return 0;
      const savingsRate = ((income - expenses) / income) * 100;
      
      if (savingsRate < -50) return 0;
      if (savingsRate < -25) return 10;
      if (savingsRate < 0) return 25;
      if (savingsRate >= 30) return 100;
      if (savingsRate >= 20) return 85;
      if (savingsRate >= 10) return 70;
      if (savingsRate >= 5) return 55;
      return 40;
    })();
    
    // Calculate budget score (simplified - just based on whether spending less than income)
    const budgetScore = (() => {
      if (income === 0) return 50;
      const spendingRatio = expenses / income;
      
      if (spendingRatio > 2.0) return 10; // Spending 2x income
      if (spendingRatio > 1.5) return 25;
      if (spendingRatio > 1.2) return 40;
      if (spendingRatio > 1.0) return 60;
      if (spendingRatio <= 0.7) return 100; // Spending ≤70% of income
      if (spendingRatio <= 0.8) return 85;
      if (spendingRatio <= 0.9) return 75;
      return 65;
    })();
    
    // Calculate consistency score (based on transaction count)
    const consistencyScore = (() => {
      if (transactionCount >= 30) return 100; // ~1 per day
      if (transactionCount >= 20) return 85;
      if (transactionCount >= 15) return 70;
      if (transactionCount >= 10) return 55;
      if (transactionCount >= 5) return 40;
      if (transactionCount > 0) return 25;
      return 0;
    })();
    
    // Calculate balance score (based on net income/expenses ratio)
    const balanceScore = (() => {
      if (income === 0 && expenses === 0) return 50;
      const net = income - expenses;
      
      if (net < 0) {
        // Negative balance
        const deficit = Math.abs(net);
        if (deficit > income * 0.5) return 10; // Huge deficit
        if (deficit > income * 0.25) return 30;
        return 40;
      } else {
        // Positive balance
        if (net >= income * 0.3) return 100; // Great surplus
        if (net >= income * 0.2) return 85;
        if (net >= income * 0.1) return 70;
        return 55;
      }
    })();
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
      (savingsScore * 0.35) +
      (budgetScore * 0.25) +
      (consistencyScore * 0.20) +
      (balanceScore * 0.20)
    );
    
    return {
      overall,
      savings: savingsScore,
      budget: budgetScore,
      consistency: consistencyScore,
      balance: balanceScore
    };
  };

  const formatMonthYear = (archive) => {
    // Prioritize custom name if set
    if (archive.name) {
      return archive.name;
    }
    
    // If archive has date_range, use it
    if (archive.date_range_start && archive.date_range_end) {
      const start = new Date(archive.date_range_start);
      const end = new Date(archive.date_range_end);
      
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const startDay = start.getDate();
      const endDay = end.getDate();
      const year = end.getFullYear();
      
      // If same month, show "Nov 5 - 28, 2024"
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
      }
      // If different months, show "Oct 28 - Nov 5, 2024"
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
    
    // Fallback to month_year
    const [year, month] = archive.month_year.split('-');
    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 0);
    
    const monthName = startDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    return `${monthName} ${startDay} - ${endDay}, ${year}`;
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
            <div className="archive-detail-title-row">
              {editingArchiveId === selectedArchive.id ? (
                <div className="archive-detail-rename-container">
                  <input
                    type="text"
                    className="archive-detail-rename-input"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSave(selectedArchive.id);
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                    autoFocus
                  />
                  <button 
                    className="btn-detail-rename-save"
                    onClick={() => handleRenameSave(selectedArchive.id)}
                  >
                    ✓ Save
                  </button>
                  <button 
                    className="btn-detail-rename-cancel"
                    onClick={handleRenameCancel}
                  >
                    ✕ Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1>{formatMonthYear(selectedArchive)}</h1>
                  <button 
                    className="btn-detail-rename"
                    onClick={(e) => handleRenameClick(selectedArchive, e)}
                    title="Rename archive"
                  >
                    ✏️ Rename
                  </button>
                </>
              )}
            </div>
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
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <h3>⚠️ Archive Last Month?</h3>
            </div>
            <div className="confirmation-body">
              <p>This will save all your transactions and financial data from last month.</p>
              <p><strong>After archiving:</strong></p>
              <ul>
                <li>✅ Last month's data will be safely stored</li>
                <li>🗑️ All current month expenses will be cleared</li>
                <li>🔒 Archived data cannot be edited</li>
              </ul>
              <p>Are you sure you want to continue?</p>
            </div>
            <div className="confirmation-actions">
              <button 
                className="btn-confirm-cancel" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-archive" 
                onClick={handleArchiveMonth}
                disabled={isArchiving}
              >
                {isArchiving ? '📦 Archiving...' : '📦 Archive Last Month'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="archives-header">
        <div className="header-content">
          <h1>📦 Monthly Archives</h1>
          <p className="archives-subtitle">
            View your financial history and past monthly reports
          </p>
        </div>
        
        <button 
          className="btn-archive-month"
          onClick={handleArchiveClick}
        >
          📦 Archive Last Month
        </button>
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
                <div className="archive-title-section">
                  {editingArchiveId === archive.id ? (
                    <div className="archive-rename-input-container" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="archive-rename-input"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSave(archive.id, e);
                          if (e.key === 'Escape') handleRenameCancel(e);
                        }}
                        autoFocus
                      />
                      <button 
                        className="btn-rename-save"
                        onClick={(e) => handleRenameSave(archive.id, e)}
                        title="Save"
                      >
                        ✓
                      </button>
                      <button 
                        className="btn-rename-cancel"
                        onClick={handleRenameCancel}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3>{formatMonthYear(archive)}</h3>
                      <button 
                        className="btn-rename-archive"
                        onClick={(e) => handleRenameClick(archive, e)}
                        title="Rename archive"
                      >
                        ✏️
                      </button>
                    </>
                  )}
                </div>
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
