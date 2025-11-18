import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Budget.css';

const Budget = () => {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    net: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetAllocations, setBudgetAllocations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

      // Fetch all transactions for spending calculations
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=1000');
      const transData = await transRes.json();
      if (transData.status === 'success') {
        setTransactions(transData.transactions);
      }

      // Fetch categories
      const catRes = await fetch('http://localhost:5000/api/categories');
      const catData = await catRes.json();
      if (catData.status === 'success') {
        setCategories(catData.categories);
        
        // Load saved budgets from database
        const budgetRes = await fetch('http://localhost:5000/api/budgets');
        const budgetData = await budgetRes.json();
        if (budgetData.status === 'success') {
          const budgets = {};
          budgetData.budgets.forEach(b => {
            budgets[b.category_id] = b.percentage;
          });
          setBudgetAllocations(budgets);
        } else {
          // Initialize with 0% if no budgets exist
          const initialBudgets = {};
          catData.categories.forEach(cat => {
            initialBudgets[cat.id] = 0;
          });
          setBudgetAllocations(initialBudgets);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetChange = async (categoryId, percentage) => {
    const newAllocations = {
      ...budgetAllocations,
      [categoryId]: parseFloat(percentage) || 0
    };
    setBudgetAllocations(newAllocations);
    
    // Save to database
    try {
      await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          percentage: parseFloat(percentage) || 0
        })
      });
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const getTotalBudgetPercentage = () => {
    return Object.values(budgetAllocations).reduce((sum, val) => sum + val, 0);
  };

  const getBudgetAmount = (categoryId) => {
    const percentage = budgetAllocations[categoryId] || 0;
    return (summary.total_income * percentage / 100).toFixed(2);
  };

  const getCategorySpending = (categoryId) => {
    const categoryTransactions = transactions.filter(
      t => t.category_id === categoryId && t.type === 'expense'
    );
    return categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const isCategoryOverspent = (categoryId) => {
    const budget = parseFloat(getBudgetAmount(categoryId));
    const spent = getCategorySpending(categoryId);
    return spent > budget && budget > 0;
  };

  const getCategoryChartData = (categoryId) => {
    // Get last 30 days
    const today = new Date();
    const last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      // Use local date instead of UTC to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: dateStr,
        spent: 0,
        cumulative: 0
      });
    }

    // Get transactions for this category
    const categoryTransactions = transactions
      .filter(t => t.category_id === categoryId && t.type === 'expense')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Accumulate spending
    let cumulative = 0;
    categoryTransactions.forEach(trans => {
      const transDate = trans.date.split('T')[0];
      const dayData = last30Days.find(d => d.fullDate === transDate);
      if (dayData) {
        dayData.spent += trans.amount;
      }
    });

    // Calculate cumulative
    last30Days.forEach(day => {
      cumulative += day.spent;
      day.cumulative = cumulative;
    });

    return last30Days;
  };

  if (isLoading) {
    return (
      <div className="budget-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1>💰 Budget Planning</h1>
        <p className="budget-subtitle">
          Manage your monthly budget and track spending across categories
        </p>
      </div>

      {/* Summary Overview */}
      <div className="budget-summary">
        <div className="budget-stat">
          <span className="stat-label">Monthly Income</span>
          <span className="stat-value income">${summary.total_income.toFixed(2)}</span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Total Allocated</span>
          <span className={`stat-value ${getTotalBudgetPercentage() > 100 ? 'over' : 'normal'}`}>
            {getTotalBudgetPercentage().toFixed(1)}%
          </span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value expense">${summary.total_expenses.toFixed(2)}</span>
        </div>
      </div>

      {getTotalBudgetPercentage() > 100 && (
        <div className="budget-warning">
          ⚠️ Warning: You've allocated more than 100% of your income!
        </div>
      )}

      {/* Budget Categories */}
      <div className="budget-categories">
        {categories.filter(cat => cat.name !== 'Income').map(category => {
          const isOverspent = isCategoryOverspent(category.id);
          const budgetAmount = parseFloat(getBudgetAmount(category.id));
          const spentAmount = getCategorySpending(category.id);
          const categoryChartData = getCategoryChartData(category.id);
          const percentSpent = budgetAmount > 0 ? (spentAmount / budgetAmount * 100).toFixed(1) : 0;
          
          return (
            <div 
              key={category.id} 
              className={`budget-category-card ${isOverspent ? 'overspent' : ''}`}
            >
              <div className="category-card-header">
                <div className="category-title">
                  <span className="category-icon-large">{category.icon}</span>
                  <div>
                    <h3>{category.name}</h3>
                    <div className="spending-status">
                      <span className={isOverspent ? 'amount-overspent' : 'amount-normal'}>
                        ${spentAmount.toFixed(2)}
                      </span>
                      <span className="amount-separator">of</span>
                      <span className="amount-budget">${budgetAmount}</span>
                      {budgetAmount > 0 && (
                        <span className="percent-spent">({percentSpent}%)</span>
                      )}
                    </div>
                  </div>
                </div>
                {isOverspent && (
                  <div className="overspent-badge">
                    ⚠️ Over Budget
                  </div>
                )}
              </div>

              {/* Spending Chart */}
              <div className="category-chart-container">
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(52, 211, 153, 0.05)" />
                    <XAxis 
                      dataKey="date" 
                      hide={true}
                    />
                    <YAxis 
                      hide={true}
                      domain={[0, 'dataMax + 20']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#34d399' }}
                      itemStyle={{ color: '#ffffff' }}
                    />
                    {budgetAmount > 0 && (
                      <ReferenceLine 
                        y={budgetAmount} 
                        stroke={isOverspent ? "#ef4444" : "#34d399"} 
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        label={{ 
                          value: 'Budget', 
                          position: 'insideTopRight',
                          fill: isOverspent ? "#ef4444" : "#34d399",
                          fontSize: 10
                        }}
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke={isOverspent ? "#ef4444" : category.color} 
                      strokeWidth={2}
                      dot={false}
                      name="Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Slider */}
              <div className="category-slider-section">
                <div className="slider-controls">
                  <span className="slider-label">Budget Allocation</span>
                  <span className="slider-value-display">
                    {budgetAllocations[category.id] || 0}% (${budgetAmount})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={budgetAllocations[category.id] || 0}
                  onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                  className="budget-slider"
                  style={{
                    background: `linear-gradient(to right, ${isOverspent ? '#ef4444' : category.color} 0%, ${isOverspent ? '#ef4444' : category.color} ${budgetAllocations[category.id] || 0}%, rgba(52, 211, 153, 0.2) ${budgetAllocations[category.id] || 0}%, rgba(52, 211, 153, 0.2) 100%)`
                  }}
                />
              </div>

              {/* Progress Bar */}
              {budgetAmount > 0 && (
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${isOverspent ? 'overspent' : ''}`}
                    style={{ 
                      width: `${Math.min(percentSpent, 100)}%`,
                      backgroundColor: isOverspent ? '#ef4444' : category.color
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Budget);
