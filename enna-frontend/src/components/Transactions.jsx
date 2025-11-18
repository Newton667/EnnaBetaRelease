import { useState, useEffect } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount'
  
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

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.status === 'success') {
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

  const filteredTransactions = getFilteredTransactions();

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
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
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
          filteredTransactions.map((transaction) => (
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
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  title="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Transaction</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="transaction-form">
              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                  >
                    💰 Income
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                  >
                    💸 Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this for?"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
