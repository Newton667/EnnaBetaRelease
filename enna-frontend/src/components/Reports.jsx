import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

const Reports = () => {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    net: 0,
    expenses_by_category: []
  });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [monthlySpendingData, setMonthlySpendingData] = useState([]);
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
        console.log('Summary data:', summaryData.summary);
      }

      // Fetch transactions
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=1000');
      const transData = await transRes.json();
      if (transData.status === 'success') {
        setTransactions(transData.transactions);
        console.log('Transactions count:', transData.transactions.length);
      }

      // Fetch budgets
      const budgetRes = await fetch('http://localhost:5000/api/budgets');
      const budgetData = await budgetRes.json();
      if (budgetData.status === 'success') {
        setBudgets(budgetData.budgets);
        console.log('Budgets:', budgetData.budgets);
      }

      // Fetch monthly spending chart data
      const spendingRes = await fetch('http://localhost:5000/api/archives/monthly-spending?months=6');
      const spendingData = await spendingRes.json();
      if (spendingData.status === 'success') {
        const formatted = spendingData.data.map(month => {
          // Use archive name if available, otherwise format from month_year
          let displayName;
          if (month.name) {
            displayName = month.name;
          } else {
            displayName = new Date(month.month_year + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
          
          return {
            month: displayName,
            income: month.total_income,
            expenses: month.total_expenses,
            net: month.net
          };
        });
        setMonthlySpendingData(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Savings Rate Score (0-100)
  const calculateSavingsScore = () => {
    if (summary.total_income === 0) return { score: 0, rating: 'N/A' };
    
    const savingsRate = ((summary.total_income - summary.total_expenses) / summary.total_income) * 100;
    
    let score = 0;
    let rating = '';
    
    // Negative savings (spending more than earning)
    if (savingsRate < -50) {
      score = 0;
      rating = 'Critical';
    } else if (savingsRate < -25) {
      score = 10;
      rating = 'Danger';
    } else if (savingsRate < 0) {
      score = 25;
      rating = 'Poor';
    }
    // Positive savings
    else if (savingsRate >= 30) {
      score = 100;
      rating = 'Excellent';
    } else if (savingsRate >= 20) {
      score = 85;
      rating = 'Great';
    } else if (savingsRate >= 10) {
      score = 70;
      rating = 'Good';
    } else if (savingsRate >= 5) {
      score = 55;
      rating = 'Fair';
    } else {
      // 0-5% savings
      score = 40;
      rating = 'Poor';
    }
    
    return { score, rating, savingsRate: savingsRate.toFixed(1) };
  };

  // Calculate Budget Adherence Score (0-100)
  const calculateBudgetScore = () => {
    if (budgets.length === 0 || summary.total_income === 0) {
      return { score: 50, rating: 'N/A', adherence: 0, withinBudget: 0, totalCategories: 0 };
    }

    let totalCategories = 0;
    let withinBudget = 0;
    let totalOverspend = 0; // Track how much over budget
    let totalBudgetAmount = 0;

    budgets.forEach(budget => {
      totalCategories++;
      
      // Find actual spending for this category
      const categoryExpense = summary.expenses_by_category.find(c => c.id === budget.category_id);
      const spent = categoryExpense ? categoryExpense.total : 0;
      
      // Calculate budget amount from percentage of income
      const budgetAmount = (budget.percentage / 100) * summary.total_income;
      totalBudgetAmount += budgetAmount;
      
      if (spent <= budgetAmount) {
        withinBudget++;
      } else {
        // Track overspending
        totalOverspend += (spent - budgetAmount);
      }
    });

    if (totalCategories === 0) {
      return { score: 50, rating: 'N/A', adherence: 0, withinBudget: 0, totalCategories: 0 };
    }

    // Calculate both metrics
    const categorySuccessRate = (withinBudget / totalCategories) * 100;
    const overspendPercentage = totalBudgetAmount > 0 ? (totalOverspend / totalBudgetAmount) * 100 : 0;
    
    // Score based on BOTH category success AND overspend severity
    let score = 0;
    let rating = '';

    // If massively overspending (>100% over budget total), score tanks
    if (overspendPercentage > 100) {
      score = 10;
      rating = 'Critical';
    } else if (overspendPercentage > 50) {
      score = 25;
      rating = 'Poor';
    } else if (overspendPercentage > 25) {
      score = 40;
      rating = 'Fair';
    } else {
      // Normal scoring based on category success rate
      if (categorySuccessRate >= 90) {
        score = 100;
        rating = 'Excellent';
      } else if (categorySuccessRate >= 75) {
        score = 85;
        rating = 'Great';
      } else if (categorySuccessRate >= 60) {
        score = 70;
        rating = 'Good';
      } else if (categorySuccessRate >= 40) {
        score = 50;
        rating = 'Fair';
      } else {
        score = 30;
        rating = 'Poor';
      }
    }

    return { 
      score, 
      rating, 
      adherence: categorySuccessRate.toFixed(0), 
      withinBudget, 
      totalCategories,
      overspendAmount: totalOverspend,
      overspendPercentage: overspendPercentage.toFixed(0)
    };
  };

  // Calculate Transaction Consistency Score (0-100)
  const calculateConsistencyScore = () => {
    if (transactions.length === 0) return { score: 0, rating: 'N/A' };

    // Get last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    const daysWithTransactions = new Set(recentTransactions.map(t => t.date.split('T')[0])).size;
    
    const consistencyRate = (daysWithTransactions / 30) * 100;
    let score = 0;
    let rating = '';

    if (consistencyRate >= 80) {
      score = 100;
      rating = 'Excellent';
    } else if (consistencyRate >= 60) {
      score = 85;
      rating = 'Great';
    } else if (consistencyRate >= 40) {
      score = 70;
      rating = 'Good';
    } else if (consistencyRate >= 20) {
      score = 50;
      rating = 'Fair';
    } else {
      score = 30;
      rating = 'Poor';
    }

    return { score, rating, daysActive: daysWithTransactions, totalDays: 30 };
  };

  // Calculate Spending Balance Score (0-100)
  const calculateBalanceScore = () => {
    if (summary.expenses_by_category.length === 0 || summary.total_expenses === 0) {
      return { score: 50, rating: 'N/A', maxCategory: 0, categories: 0 };
    }

    // Don't penalize if total spending is very low (under $100)
    // Early in the month or just starting out, balance doesn't matter yet
    if (summary.total_expenses < 100) {
      return { 
        score: 75, 
        rating: 'Good', 
        maxCategory: 0, 
        categories: summary.expenses_by_category.length,
        note: 'Not enough spending data yet'
      };
    }

    // Only consider if there are multiple categories
    if (summary.expenses_by_category.length === 1) {
      return { 
        score: 60, 
        rating: 'Fair', 
        maxCategory: 100, 
        categories: 1,
        note: 'Add expenses in other categories'
      };
    }

    // Calculate how evenly distributed spending is across categories
    const categoryPercentages = summary.expenses_by_category.map(c => 
      (c.total / summary.total_expenses) * 100
    );

    // Check if any category dominates
    const maxPercentage = Math.max(...categoryPercentages);
    
    let score = 0;
    let rating = '';

    // More severe scoring for concentrated spending (when it matters)
    if (maxPercentage >= 80) {
      score = 10;
      rating = 'Critical';
    } else if (maxPercentage >= 70) {
      score = 25;
      rating = 'Poor';
    } else if (maxPercentage >= 60) {
      score = 40;
      rating = 'Fair';
    } else if (maxPercentage >= 50) {
      score = 60;
      rating = 'Good';
    } else if (maxPercentage >= 40) {
      score = 80;
      rating = 'Great';
    } else {
      score = 100;
      rating = 'Excellent';
    }

    return { score, rating, maxCategory: maxPercentage.toFixed(0), categories: summary.expenses_by_category.length };
  };

  // Calculate Overall Financial Health Score
  const calculateOverallScore = () => {
    const savings = calculateSavingsScore();
    const budget = calculateBudgetScore();
    const consistency = calculateConsistencyScore();
    const balance = calculateBalanceScore();

    // Weight the scores
    const weights = {
      savings: 0.40,      // Increased from 0.35
      budget: 0.25,       // Decreased from 0.30
      consistency: 0.20,
      balance: 0.15
    };

    const overallScore = Math.round(
      savings.score * weights.savings +
      budget.score * weights.budget +
      consistency.score * weights.consistency +
      balance.score * weights.balance
    );

    let rating = '';
    let color = '';

    if (overallScore >= 90) {
      rating = 'Excellent';
      color = '#10b981';
    } else if (overallScore >= 75) {
      rating = 'Great';
      color = '#34d399';
    } else if (overallScore >= 60) {
      rating = 'Good';
      color = '#fbbf24';
    } else if (overallScore >= 40) {
      rating = 'Fair';
      color = '#f59e0b';
    } else {
      rating = 'Poor';
      color = '#ef4444';
    }

    return { score: overallScore, rating, color };
  };

  // Get advice for each metric
  const getAdvice = (type, data) => {
    const advice = {
      savings: {
        excellent: "Outstanding! You're saving 30%+ of your income. Consider investing your surplus or building an emergency fund.",
        great: "Great job! You're saving 20-30% of your income. Try to increase this slightly for even better financial security.",
        good: "You're saving 10-20% of your income, which is solid. Look for small ways to cut expenses and boost this rate.",
        fair: "You're saving 0-5% of your income. Review your expenses and find areas where you can cut back to reach 10%.",
        poor: "You're spending more than you earn or barely breaking even. This is unsustainable. Cut non-essential expenses immediately.",
        danger: "⚠️ ALERT: You're spending significantly more than you earn. Stop all discretionary spending NOW and create an emergency budget.",
        critical: "🚨 CRITICAL: Your spending is far beyond your income. This is a financial emergency. Seek immediate help and stop all non-essential spending.",
        na: "Add income and expense transactions to get your savings score."
      },
      budget: {
        excellent: "Perfect! You're staying within budget on 90%+ of your categories. Keep up the disciplined approach!",
        great: "Great work! You're within budget on 75-90% of categories. Focus on the categories where you're overspending.",
        good: "You're within budget on 60-75% of categories. Identify problem areas and adjust spending or budgets accordingly.",
        fair: "You're only within budget on 40-60% of categories or moderately overspending. Review your budgets and spending patterns.",
        poor: "You're significantly overspending across categories. Your budgets may be unrealistic or spending needs immediate attention.",
        critical: "🚨 CRITICAL: You're spending 2x+ your total budget. This is unsustainable. Stop discretionary spending immediately and reassess your budget.",
        na: "Set up budgets for your spending categories to track your progress and improve financial discipline."
      },
      consistency: {
        excellent: "Amazing! You're tracking transactions 80%+ of days. This gives you excellent financial visibility.",
        great: "Great consistency! You're tracking 60-80% of days. Try to log transactions daily for even better insights.",
        good: "You're tracking 40-60% of days, which is good. Aim for daily tracking to get a complete picture of your finances.",
        fair: "You're only tracking 20-40% of days. More consistent tracking will help you understand your spending patterns better.",
        poor: "You're tracking less than 20% of days. Make it a daily habit to log all transactions for accurate financial management.",
        na: "Start adding transactions daily to build a consistent tracking habit and improve your financial awareness."
      },
      balance: {
        excellent: "Excellent diversification! Your spending is well-balanced across categories with no single area dominating.",
        great: "Good balance! No category takes up more than 40% of spending. This indicates healthy financial distribution.",
        good: "Decent balance, but one category takes 40-50% of spending. Consider if this allocation aligns with your goals.",
        fair: "One category dominates 50-60% of your spending. This concentration could be risky if that area experiences changes.",
        poor: "Over 60-70% of spending is in one category. This is very concentrated and indicates poor spending balance.",
        critical: "🚨 CRITICAL: Over 70% of spending is in ONE category. This extreme concentration is financially dangerous. Diversify immediately.",
        na: "Add transactions across different categories to get your spending balance score."
      }
    };

    const key = data.rating.toLowerCase();
    return advice[type][key] || advice[type].na;
  };

  const getScoreBorderStyle = (score) => {
    const color = getScoreColor(score);
    let boxShadow = 'none';
    
    // Add glow effect for critical/poor scores
    if (score < 15) {
      boxShadow = `0 0 20px ${color}80, 0 4px 12px rgba(0, 0, 0, 0.3)`;
    } else if (score < 40) {
      boxShadow = `0 0 15px ${color}60, 0 4px 12px rgba(0, 0, 0, 0.3)`;
    } else if (score < 60) {
      boxShadow = `0 0 10px ${color}40`;
    }
    
    return {
      borderColor: color,
      borderWidth: '2px',
      boxShadow: boxShadow
    };
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';  // Green
    if (score >= 75) return '#34d399';  // Light green
    if (score >= 60) return '#fbbf24';  // Yellow
    if (score >= 40) return '#f59e0b';  // Orange
    if (score >= 15) return '#ef4444';  // Red
    return '#dc2626';                    // Dark red (critical)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading financial report...</p>
      </div>
    );
  }

  const savingsMetric = calculateSavingsScore();
  const budgetMetric = calculateBudgetScore();
  const consistencyMetric = calculateConsistencyScore();
  const balanceMetric = calculateBalanceScore();
  const overallMetric = calculateOverallScore();

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <h1>📊 Financial Health Report</h1>
        <p className="reports-subtitle">
          Track your financial performance and get personalized advice
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="overall-score-card">
        <div className="overall-score-content">
          <div className="overall-score-left">
            <h2>Overall Financial Health</h2>
            <div className="overall-score-display">
              <div 
                className="score-circle"
                style={{
                  background: `conic-gradient(${overallMetric.color} ${overallMetric.score * 3.6}deg, rgba(30, 30, 30, 0.5) 0deg)`
                }}
              >
                <div className="score-circle-inner">
                  <span className="score-number">{overallMetric.score}</span>
                  <span className="score-total">/100</span>
                </div>
              </div>
              <div className="overall-rating" style={{ color: overallMetric.color }}>
                {overallMetric.rating}
              </div>
            </div>
          </div>
          <div className="overall-score-right">
            <h3>What This Means</h3>
            <p className="overall-description">
              {overallMetric.score >= 90 && "Your finances are in excellent shape! You're saving well, staying within budget, tracking consistently, and maintaining balanced spending. Keep up the outstanding work!"}
              {overallMetric.score >= 75 && overallMetric.score < 90 && "Your financial health is great! You're doing well in most areas. Review the specific metrics below to see where you can improve further."}
              {overallMetric.score >= 60 && overallMetric.score < 75 && "Your finances are in good shape, but there's room for improvement. Focus on the areas with lower scores to boost your overall financial health."}
              {overallMetric.score >= 40 && overallMetric.score < 60 && "Your financial health is fair. Several areas need attention. Review the advice below and create an action plan to improve your scores."}
              {overallMetric.score < 40 && "Your finances need immediate attention. Multiple areas are concerning. Start with the lowest-scoring metrics and make changes today."}
            </p>
            
            <div className="score-breakdown">
              <h4>How Your Score is Calculated</h4>
              <div className="breakdown-items">
                <div className="breakdown-item">
                  <span className="breakdown-label">💰 Savings Rate</span>
                  <span className="breakdown-calc">{savingsMetric.score} × 40%</span>
                  <span className="breakdown-value">= {Math.round(savingsMetric.score * 0.40)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">🎯 Budget Adherence</span>
                  <span className="breakdown-calc">{budgetMetric.score} × 25%</span>
                  <span className="breakdown-value">= {Math.round(budgetMetric.score * 0.25)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">📅 Tracking Consistency</span>
                  <span className="breakdown-calc">{consistencyMetric.score} × 20%</span>
                  <span className="breakdown-value">= {Math.round(consistencyMetric.score * 0.20)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">⚖️ Spending Balance</span>
                  <span className="breakdown-calc">{balanceMetric.score} × 15%</span>
                  <span className="breakdown-value">= {Math.round(balanceMetric.score * 0.15)}</span>
                </div>
                <div className="breakdown-total">
                  <span className="breakdown-label">Total Score</span>
                  <span className="breakdown-value-large">{overallMetric.score}</span>
                </div>
              </div>
              <p className="breakdown-note">
                💡 Each metric contributes differently to your overall financial health score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Spending Trend Chart */}
      {monthlySpendingData.length > 0 && (
        <div className="monthly-chart-card">
          <h2>📈 Monthly Spending Trends</h2>
          <p className="chart-subtitle">Last 6 months of income, expenses, and net savings</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(52, 211, 153, 0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#a0a0a0"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#a0a0a0"
                style={{ fontSize: '14px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#34d399' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Legend 
                wrapperStyle={{ color: '#a0a0a0' }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Income"
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Expenses"
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#34d399" 
                strokeWidth={3}
                name="Net Savings"
                dot={{ fill: '#34d399', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Individual Metrics */}
      <div className="metrics-grid">
        {/* Savings Rate */}
        <div className="metric-card" style={getScoreBorderStyle(savingsMetric.score)}>
          <div className="metric-header">
            <div className="metric-icon">💰</div>
            <div className="metric-title-section">
              <h3>Savings Rate</h3>
              <p className="metric-subtitle">How much you save vs. earn</p>
            </div>
          </div>
          
          <div className="metric-score-section">
            <div className="metric-score" style={{ color: getScoreColor(savingsMetric.score) }}>
              {savingsMetric.score}
              <span className="metric-score-max">/100</span>
            </div>
            <div className="metric-rating" style={{ color: getScoreColor(savingsMetric.score) }}>
              {savingsMetric.rating}
            </div>
          </div>

          {savingsMetric.rating !== 'N/A' && (
            <div className="metric-stats">
              <div className="stat-item">
                <span className="stat-label">Savings Rate:</span>
                <span className="stat-value">{savingsMetric.savingsRate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Income:</span>
                <span className="stat-value">{formatCurrency(summary.total_income)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expenses:</span>
                <span className="stat-value">{formatCurrency(summary.total_expenses)}</span>
              </div>
            </div>
          )}

          <div className="metric-advice">
            <div className="advice-header">💡 Advice</div>
            <p>{getAdvice('savings', savingsMetric)}</p>
          </div>
        </div>

        {/* Budget Adherence */}
        <div className="metric-card" style={getScoreBorderStyle(budgetMetric.score)}>
          <div className="metric-header">
            <div className="metric-icon">🎯</div>
            <div className="metric-title-section">
              <h3>Budget Adherence</h3>
              <p className="metric-subtitle">Staying within your budgets</p>
            </div>
          </div>
          
          <div className="metric-score-section">
            <div className="metric-score" style={{ color: getScoreColor(budgetMetric.score) }}>
              {budgetMetric.score}
              <span className="metric-score-max">/100</span>
            </div>
            <div className="metric-rating" style={{ color: getScoreColor(budgetMetric.score) }}>
              {budgetMetric.rating}
            </div>
          </div>

          {budgetMetric.rating !== 'N/A' && (
            <div className="metric-stats">
              <div className="stat-item">
                <span className="stat-label">On Budget:</span>
                <span className="stat-value">{budgetMetric.withinBudget} / {budgetMetric.totalCategories}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Success Rate:</span>
                <span className="stat-value">{budgetMetric.adherence}%</span>
              </div>
              {budgetMetric.overspendAmount > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Total Overspent:</span>
                  <span className="stat-value" style={{ color: '#ef4444' }}>
                    {formatCurrency(budgetMetric.overspendAmount)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="metric-advice">
            <div className="advice-header">💡 Advice</div>
            <p>{getAdvice('budget', budgetMetric)}</p>
          </div>
        </div>

        {/* Transaction Consistency */}
        <div className="metric-card" style={getScoreBorderStyle(consistencyMetric.score)}>
          <div className="metric-header">
            <div className="metric-icon">📅</div>
            <div className="metric-title-section">
              <h3>Tracking Consistency</h3>
              <p className="metric-subtitle">Regular transaction logging</p>
            </div>
          </div>
          
          <div className="metric-score-section">
            <div className="metric-score" style={{ color: getScoreColor(consistencyMetric.score) }}>
              {consistencyMetric.score}
              <span className="metric-score-max">/100</span>
            </div>
            <div className="metric-rating" style={{ color: getScoreColor(consistencyMetric.score) }}>
              {consistencyMetric.rating}
            </div>
          </div>

          {consistencyMetric.rating !== 'N/A' && (
            <div className="metric-stats">
              <div className="stat-item">
                <span className="stat-label">Active Days:</span>
                <span className="stat-value">{consistencyMetric.daysActive} / {consistencyMetric.totalDays}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Consistency:</span>
                <span className="stat-value">{((consistencyMetric.daysActive / consistencyMetric.totalDays) * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}

          <div className="metric-advice">
            <div className="advice-header">💡 Advice</div>
            <p>{getAdvice('consistency', consistencyMetric)}</p>
          </div>
        </div>

        {/* Spending Balance */}
        <div className="metric-card" style={getScoreBorderStyle(balanceMetric.score)}>
          <div className="metric-header">
            <div className="metric-icon">⚖️</div>
            <div className="metric-title-section">
              <h3>Spending Balance</h3>
              <p className="metric-subtitle">Diversified spending habits</p>
            </div>
          </div>
          
          <div className="metric-score-section">
            <div className="metric-score" style={{ color: getScoreColor(balanceMetric.score) }}>
              {balanceMetric.score}
              <span className="metric-score-max">/100</span>
            </div>
            <div className="metric-rating" style={{ color: getScoreColor(balanceMetric.score) }}>
              {balanceMetric.rating}
            </div>
          </div>

          {balanceMetric.rating !== 'N/A' && (
            <div className="metric-stats">
              <div className="stat-item">
                <span className="stat-label">Categories:</span>
                <span className="stat-value">{balanceMetric.categories}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Largest Category:</span>
                <span className="stat-value">{balanceMetric.maxCategory}%</span>
              </div>
              {balanceMetric.note && (
                <div className="stat-item">
                  <span className="stat-label" style={{ color: '#fbbf24', fontSize: '13px' }}>
                    ℹ️ {balanceMetric.note}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="metric-advice">
            <div className="advice-header">💡 Advice</div>
            <p>{getAdvice('balance', balanceMetric)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
