import { useState, useEffect } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount'
  const [groupBy, setGroupBy] = useState('date'); // 'date' or 'category'
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch transactions and categories
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/transactions?limit=500');
      const data = await response.json();
      
      if (data.status === 'success') {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (data.status === 'success') {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          category_id: formData.category_id ? parseInt(formData.category_id) : null
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Reset form
        setFormData({
          type: 'expense',
          amount: '',
          description: '',
          category_id: '',
          date: new Date().toISOString().split('T')[0]
        });
        
        // Close modal and refresh
        setShowAddModal(false);
        fetchTransactions();
      } else {
        alert('Failed to add transaction: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowConfirmDelete(false);
        setTransactionToDelete(null);
        fetchTransactions();
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  // Filter and sort transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Apply sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    return filtered;
  };

  // Group transactions by date
  const getGroupedTransactions = () => {
    const filtered = getFilteredTransactions();
    
    // No grouping
    if (groupBy === 'none') {
      return [{ label: null, transactions: filtered, icon: null }];
    }

    // Group by category
    if (groupBy === 'category') {
      const groups = {};
      
      filtered.forEach(transaction => {
        const categoryName = transaction.category_name || 'Uncategorized';
        const categoryIcon = transaction.icon || '📦';
        
        if (!groups[categoryName]) {
          groups[categoryName] = {
            label: categoryName,
            icon: categoryIcon,
            transactions: [],
            totalAmount: 0
          };
        }
        
        groups[categoryName].transactions.push(transaction);
        groups[categoryName].totalAmount += transaction.amount;
      });
      
      // Convert to array and sort by total amount
      return Object.values(groups).sort((a, b) => b.totalAmount - a.totalAmount);
    }

    // Group by date (original logic)
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - today.getDay());
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    filtered.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      
      let groupKey;
      
      if (transactionDate.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday';
      } else if (transactionDate >= thisWeekStart && transactionDate < today) {
        groupKey = 'This Week';
      } else if (transactionDate >= thisMonthStart && transactionDate < thisWeekStart) {
        groupKey = 'Earlier This Month';
      } else if (transactionDate.getFullYear() === today.getFullYear()) {
        groupKey = transactionDate.toLocaleDateString('en-US', { month: 'long' });
      } else {
        groupKey = transactionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          label: groupKey,
          transactions: [],
          timestamp: transactionDate.getTime(),
          icon: null
        };
      }
      
      groups[groupKey].transactions.push(transaction);
    });
    
    // Convert to array and sort by timestamp
    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
  };

  const groupedTransactions = getGroupedTransactions();

  // Calculate totals
  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') {
      acc.income += t.amount;
    } else {
      acc.expense += t.amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="transactions-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      {/* Header */}
      <div className="transactions-header">
        <div className="header-left">
          <h1>📊 Transactions</h1>
          <p className="subtitle">Track your income and expenses</p>
        </div>
        <button 
          className="add-transaction-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span className="btn-icon">+</span>
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total Income</div>
            <div className="card-value">{formatCurrency(totals.income)}</div>
          </div>
        </div>
        
        <div className="summary-card expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">{formatCurrency(totals.expense)}</div>
          </div>
        </div>
        
        <div className={`summary-card net ${totals.income - totals.expense >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-label">Net Balance</div>
            <div className="card-value">{formatCurrency(totals.income - totals.expense)}</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="transactions-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn income-btn ${filter === 'income' ? 'active' : ''}`}
              onClick={() => setFilter('income')}
            >
              Income
            </button>
            <button 
              className={`filter-btn expense-btn ${filter === 'expense' ? 'active' : ''}`}
              onClick={() => setFilter('expense')}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Group by:</label>
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">📅 Date</option>
            <option value="category">📂 Category</option>
            <option value="none">📋 None</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {groupedTransactions.length === 0 || groupedTransactions.every(g => g.transactions.length === 0) ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>Start tracking your finances by adding your first transaction</p>
            <button 
              className="add-transaction-btn"
              onClick={() => setShowAddModal(true)}
            >
              Add Transaction
            </button>
          </div>
        ) : (
          groupedTransactions.map((group, groupIndex) => (
            <div key={groupIndex} className="transaction-group">
              {group.label && (
                <div className="date-group-header">
                  <span className="date-group-title">
                    {group.icon && <span style={{ marginRight: '8px' }}>{group.icon}</span>}
                    {group.label}
                  </span>
                  <span className="date-group-count">
                    {group.transactions.length} transaction{group.transactions.length !== 1 ? 's' : ''}
                    {groupBy === 'category' && group.totalAmount && (
                      <span style={{ marginLeft: '8px', color: '#34d399' }}>
                        • {formatCurrency(group.totalAmount)}
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {group.transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-icon">
                    {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-description">
                      {transaction.description || 'No description'}
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-category">
                        {transaction.category_name || 'Uncategorized'}
                      </span>
                      <span className="transaction-date">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(transaction)}
                      title="Delete transaction"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid rgba(52, 211, 153, 0.2)'
            }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 600,
                margin: 0
              }}>Add Transaction</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(160, 160, 160, 0.1)',
                  border: '1px solid rgba(160, 160, 160, 0.3)',
                  color: '#a0a0a0',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} style={{ padding: '24px' }}>
              {/* Type Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#a0a0a0',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>Type</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    style={{
                      background: formData.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 30, 30, 0.6)',
                      border: `2px solid ${formData.type === 'income' ? '#10b981' : 'rgba(52, 211, 153, 0.2)'}`,
                      color: formData.type === 'income' ? '#10b981' : '#a0a0a0',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💰 Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    style={{
                      background: formData.type === 'expense' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(30, 30, 30, 0.6)',
                      border: `2px solid ${formData.type === 'expense' ? '#ef4444' : 'rgba(52, 211, 153, 0.2)'}`,
                      color: formData.type === 'expense' ? '#ef4444' : '#a0a0a0',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💸 Expense
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#a0a0a0',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#a0a0a0',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this for?"
                  style={{
                    width: '100%',
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#a0a0a0',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#a0a0a0',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'rgba(30, 30, 30, 0.8)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    color: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    border: '1px solid transparent',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && transactionToDelete && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConfirmDelete(false);
              setTransactionToDelete(null);
            }
          }}
        >
          <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <h3>
                <span className="warning-icon">⚠️</span>
                Delete Transaction
              </h3>
            </div>

            <div className="confirmation-body">
              <p>Are you sure you want to delete this transaction?</p>
              <p>This action cannot be undone.</p>
              
              <div className="transaction-preview">
                <div className="transaction-preview-item">
                  <span className="preview-label">📝 Description:</span>
                  <span className="preview-value">{transactionToDelete.description || 'No description'}</span>
                </div>
                <div className="transaction-preview-item">
                  <span className="preview-label">💵 Amount:</span>
                  <span className="preview-value">
                    {transactionToDelete.type === 'income' ? '+' : '-'}
                    {formatCurrency(transactionToDelete.amount)}
                  </span>
                </div>
                <div className="transaction-preview-item">
                  <span className="preview-label">📅 Date:</span>
                  <span className="preview-value">{formatDate(transactionToDelete.date)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button 
                className="btn-confirm-cancel"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setTransactionToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-delete"
                onClick={() => handleDeleteTransaction(transactionToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
