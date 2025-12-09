import { useState, useEffect } from 'react';
import './Transactions.css';
import CSVImportModal from './CSVImportModal';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
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

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    date: ''
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

  const handleCSVImport = async (importedTransactions) => {
    try {
      // Bulk import transactions
      const promises = importedTransactions.map(transaction =>
        fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      const successCount = results.filter(r => r.status === 'success').length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        alert(`Successfully imported ${successCount} transaction${successCount !== 1 ? 's' : ''}${failCount > 0 ? ` (${failCount} failed)` : ''}!`);
        fetchTransactions();
      } else {
        alert('Failed to import transactions. Please try again.');
      }
    } catch (error) {
      console.error('Error importing transactions:', error);
      alert('Failed to import transactions');
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

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
    setEditFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category_id: transaction.category_id || '',
      date: transaction.date
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    
    if (!editFormData.amount || editFormData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          amount: parseFloat(editFormData.amount),
          category_id: editFormData.category_id ? parseInt(editFormData.category_id) : null
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowEditModal(false);
        setTransactionToEdit(null);
        fetchTransactions();
      } else {
        alert('Failed to update transaction: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowConfirmDelete(false);
        setTransactionToDelete(null);
        fetchTransactions();
      } else {
        alert('Failed to delete transaction: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  // Filter and sort transactions
  const getFilteredAndSortedTransactions = () => {
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

  // Group transactions
  const getGroupedTransactions = () => {
    const filtered = getFilteredAndSortedTransactions();
    
    if (groupBy === 'date') {
      const groups = {};
      filtered.forEach(transaction => {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
      });
      return groups;
    }
    
    return { 'All Transactions': filtered };
  };

  // Calculate summary
  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      net: income - expense
    };
  };

  const summary = calculateSummary();
  const groupedTransactions = getGroupedTransactions();

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
          <h1>💳 Transactions</h1>
          <p className="subtitle">Manage your income and expenses</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="add-transaction-btn csv-import-btn" onClick={() => setShowCSVImport(true)}>
            <span className="btn-icon">📊</span>
            Import CSV
          </button>
          <button className="add-transaction-btn" onClick={() => setShowAddModal(true)}>
            <span className="btn-icon">+</span>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total Income</div>
            <div className="card-value">${summary.income.toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <div className="card-label">Total Expenses</div>
            <div className="card-value">${summary.expense.toFixed(2)}</div>
          </div>
        </div>

        <div className={`summary-card net ${summary.net >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-label">Net Balance</div>
            <div className="card-value">${summary.net.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
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
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (Highest First)</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No transactions yet</h3>
          <p>Start by adding your first transaction or import from CSV</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="add-transaction-btn" onClick={() => setShowCSVImport(true)}>
              <span className="btn-icon">📊</span>
              Import CSV
            </button>
            <button className="add-transaction-btn" onClick={() => setShowAddModal(true)}>
              <span className="btn-icon">+</span>
              Add Transaction
            </button>
          </div>
        </div>
      ) : (
        <div className="transactions-list">
          {Object.entries(groupedTransactions).map(([date, groupTransactions]) => (
            <div key={date} className="transaction-group">
              <div className="date-group-header">
                <div className="date-group-title">{date}</div>
                <div className="date-group-count">
                  {groupTransactions.length} transaction{groupTransactions.length !== 1 ? 's' : ''}
                </div>
              </div>

              {groupTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-icon">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div className="transaction-meta">
                      {transaction.category_name && (
                        <span className="transaction-category">
                          {transaction.category_name}
                        </span>
                      )}
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditClick(transaction)}
                      title="Edit transaction"
                    >
                      ✏️
                    </button>
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
          ))}
        </div>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={showCSVImport}
        onClose={() => setShowCSVImport(false)}
        onImport={handleCSVImport}
        categories={categories}
      />

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowAddModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Transaction</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form className="transaction-form" onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-btn income ${formData.type === 'income' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, type: 'income'})}
                  >
                    💰 Income
                  </button>
                  <button
                    type="button"
                    className={`type-btn expense ${formData.type === 'expense' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, type: 'expense'})}
                  >
                    💸 Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">-- No Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && transactionToEdit && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowEditModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Transaction</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <form className="transaction-form" onSubmit={handleUpdateTransaction}>
              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-btn income ${editFormData.type === 'income' ? 'active' : ''}`}
                    onClick={() => setEditFormData({...editFormData, type: 'income'})}
                  >
                    💰 Income
                  </button>
                  <button
                    type="button"
                    className={`type-btn expense ${editFormData.type === 'expense' ? 'active' : ''}`}
                    onClick={() => setEditFormData({...editFormData, type: 'expense'})}
                  >
                    💸 Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editFormData.category_id}
                  onChange={(e) => setEditFormData({...editFormData, category_id: e.target.value})}
                >
                  <option value="">-- No Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Update Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && transactionToDelete && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && handleCancelDelete()}>
          <div className="confirmation-dialog">
            <div className="confirmation-header">
              <h3>
                <span className="warning-icon">⚠️</span>
                Delete Transaction?
              </h3>
            </div>

            <div className="confirmation-body">
              <p>Are you sure you want to delete this transaction?</p>
              <p>This action cannot be undone.</p>

              <div className="transaction-preview">
                <div className="transaction-preview-item">
                  <span className="preview-label">Description:</span>
                  <span className="preview-value">{transactionToDelete.description}</span>
                </div>
                <div className="transaction-preview-item">
                  <span className="preview-label">Amount:</span>
                  <span className="preview-value">
                    {transactionToDelete.type === 'income' ? '+' : '-'}
                    ${transactionToDelete.amount.toFixed(2)}
                  </span>
                </div>
                <div className="transaction-preview-item">
                  <span className="preview-label">Date:</span>
                  <span className="preview-value">
                    {new Date(transactionToDelete.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="btn-confirm-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
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
