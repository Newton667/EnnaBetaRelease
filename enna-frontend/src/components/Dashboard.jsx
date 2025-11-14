import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    net: 0,
    expenses_by_category: []
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [chartData, setChartData] = useState([]);
  
  // Form states
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: ''
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch summary
      const summaryRes = await fetch('http://localhost:5000/api/summary');
      const summaryData = await summaryRes.json();
      if (summaryData.status === 'success') {
        setSummary(summaryData.summary);
      }

      // Fetch recent transactions
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=10');
      const transData = await transRes.json();
      if (transData.status === 'success') {
        setTransactions(transData.transactions);
      }

      // Fetch categories
      const catRes = await fetch('http://localhost:5000/api/categories');
      const catData = await catRes.json();
      if (catData.status === 'success') {
        setCategories(catData.categories);
      }

      // Generate chart data after fetching transactions
      if (transData.status === 'success') {
        generateChartData(transData.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartData = (transactions) => {
    // Get last 30 days
    const today = new Date();
    const last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last30Days.push({
        date: dateStr,
        fullDate: date.toISOString().split('T')[0],
        expenses: 0,
        cumulative: 0
      });
    }

    // Accumulate expenses by date
    let cumulative = 0;
    transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(trans => {
        const transDate = trans.date.split('T')[0];
        const dayData = last30Days.find(d => d.fullDate === transDate);
        if (dayData) {
          dayData.expenses += trans.amount;
        }
      });

    // Calculate cumulative
    last30Days.forEach(day => {
      cumulative += day.expenses;
      day.cumulative = cumulative;
    });

    setChartData(last30Days);
  };

  const getCategorySpendingChart = (categoryId) => {
    // Get last 7 days for mini charts
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push({
        date: dateStr,
        amount: 0
      });
    }

    // Get transactions for this category
    const categoryTransactions = transactions.filter(
      t => t.category_id === categoryId && t.type === 'expense'
    );

    // Accumulate spending by day
    categoryTransactions.forEach(trans => {
      const transDate = trans.date.split('T')[0];
      const dayData = last7Days.find(d => d.date === transDate);
      if (dayData) {
        dayData.amount += trans.amount;
      }
    });

    return last7Days;
  };

  const handleCloseTransaction = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowAddTransaction(false);
      setIsClosing(false);
    }, 300);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Reset form
        setNewTransaction({
          type: 'expense',
          amount: '',
          description: '',
          category_id: ''
        });
        
        // Close form with animation
        handleCloseTransaction();
        
        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <button 
          className="btn-add"
          onClick={() => {
            if (showAddTransaction) {
              handleCloseTransaction();
            } else {
              setShowAddTransaction(true);
            }
          }}
        >
          {showAddTransaction ? '✕ Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddTransaction && (
        <div className={`add-transaction-form ${isClosing ? 'closing' : ''}`}>
          <h3>Add New Transaction</h3>
          <form onSubmit={handleAddTransaction}>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="What's this for?"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newTransaction.category_id}
                onChange={(e) => setNewTransaction({...newTransaction, category_id: e.target.value})}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Add Transaction
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">${summary.total_income.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="amount">${summary.total_expenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card net">
          <div className="card-icon">{summary.net >= 0 ? '✅' : '⚠️'}</div>
          <div className="card-content">
            <h3>Net Balance</h3>
            <p className={`amount ${summary.net >= 0 ? 'positive' : 'negative'}`}>
              ${summary.net.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Spending Overview Chart */}
      {chartData.length > 0 && (
        <div className="spending-chart-section">
          <h2>📈 Spending Overview (Last 30 Days)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(52, 211, 153, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#a0a0a0"
                  tick={{ fill: '#a0a0a0', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  tick={{ fill: '#a0a0a0', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#34d399' }}
                  itemStyle={{ color: '#ffffff' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Total Spent']}
                />
                <Legend 
                  wrapperStyle={{ color: '#a0a0a0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#34d399" 
                  strokeWidth={3}
                  dot={{ fill: '#34d399', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Cumulative Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Spending Overview with Mini Charts */}
      {summary.expenses_by_category.length > 0 && (
        <div className="category-spending-overview">
          <h2>📈 Spending by Category</h2>
          <div className="category-chart-grid">
            {summary.expenses_by_category.map((cat) => {
              const chartData = getCategorySpendingChart(cat.id);
              const hasData = chartData.some(d => d.amount > 0);
              
              return (
                <div key={cat.name} className="mini-category-card">
                  <div className="mini-card-header">
                    <span className="mini-icon">{cat.icon}</span>
                    <div className="mini-info">
                      <span className="mini-name">{cat.name}</span>
                      <span className="mini-amount" style={{ color: cat.color }}>
                        ${cat.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mini-chart-container">
                    {hasData ? (
                      <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={chartData}>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                              border: '1px solid rgba(52, 211, 153, 0.3)',
                              borderRadius: '6px',
                              fontSize: '11px',
                              padding: '5px 10px'
                            }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                            labelFormatter={(label) => {
                              const date = new Date(label);
                              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke={cat.color} 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="no-data-chart">No recent activity</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions yet. Add your first one above!</p>
        ) : (
          <div className="transaction-list">
            {transactions.map((trans) => (
              <div key={trans.id} className={`transaction-item ${trans.type}`}>
                <div className="transaction-left">
                  <span className="transaction-icon">
                    {trans.category_icon || (trans.type === 'income' ? '💰' : '💸')}
                  </span>
                  <div className="transaction-details">
                    <p className="transaction-desc">{trans.description || 'No description'}</p>
                    <p className="transaction-meta">
                      {trans.category_name || 'Uncategorized'} • {new Date(trans.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="transaction-right">
                  <p className={`transaction-amount ${trans.type}`}>
                    {trans.type === 'income' ? '+' : '-'}${trans.amount.toFixed(2)}
                  </p>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTransaction(trans.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
