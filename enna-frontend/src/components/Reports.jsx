import React, { useState, useEffect } from 'react';
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

      // Fetch transactions
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=1000');
      const transData = await transRes.json();
      if (transData.status === 'success') {
        setTransactions(transData.transactions);
      }

      // Fetch budgets
      const budgetRes = await fetch('http://localhost:5000/api/budgets');
      const budgetData = await budgetRes.json();
      if (budgetData.status === 'success') {
        setBudgets(budgetData.budgets);
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
    
    if (savingsRate >= 30) {
      score = 100;
      rating = 'Excellent';
    } else if (savingsRate >= 20) {
      score = 85;
      rating = 'Great';
    } else if (savingsRate >= 10) {
      score = 70;
      rating = 'Good';
    } else if (savingsRate >= 0) {
      score = 50;
      rating = 'Fair';
    } else {
      score = 25;
      rating = 'Poor';
    }
    
    return { score, rating, savingsRate: savingsRate.toFixed(1) };
  };

  // Calculate Budget Adherence Score (0-100)
  const calculateBudgetScore = () => {
    if (budgets.length === 0) {
      return { score: 50, rating: 'N/A', adherence: 0 };
    }

    let totalCategories = 0;
    let withinBudget = 0;

    budgets.forEach(budget => {
      totalCategories++;
      const spent = summary.expenses_by_category.find(c => c.category_id === budget.category_id)?.total || 0;
      const budgetAmount = budget.amount;
      
      if (spent <= budgetAmount) {
        withinBudget++;
      }
    });

    const adherenceRate = (withinBudget / totalCategories) * 100;
    let score = 0;
    let rating = '';

    if (adherenceRate >= 90) {
      score = 100;
      rating = 'Excellent';
    } else if (adherenceRate >= 75) {
      score = 85;
      rating = 'Great';
    } else if (adherenceRate >= 60) {
      score = 70;
      rating = 'Good';
    } else if (adherenceRate >= 40) {
      score = 50;
      rating = 'Fair';
    } else {
      score = 30;
      rating = 'Poor';
    }

    return { score, rating, adherence: adherenceRate.toFixed(0), withinBudget, totalCategories };
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
    if (summary.expenses_by_category.length === 0) {
      return { score: 50, rating: 'N/A' };
    }

    // Calculate how evenly distributed spending is across categories
    const categoryPercentages = summary.expenses_by_category.map(c => 
      (c.total / summary.total_expenses) * 100
    );

    // Check if any category dominates (>60% of spending)
    const maxPercentage = Math.max(...categoryPercentages);
    
    let score = 0;
    let rating = '';

    if (maxPercentage < 40) {
      score = 100;
      rating = 'Excellent';
    } else if (maxPercentage < 50) {
      score = 85;
      rating = 'Great';
    } else if (maxPercentage < 60) {
      score = 70;
      rating = 'Good';
    } else if (maxPercentage < 75) {
      score = 50;
      rating = 'Fair';
    } else {
      score = 30;
      rating = 'Poor';
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
      savings: 0.35,
      budget: 0.30,
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
        fair: "You're saving less than 10% of your income. Review your expenses and find areas where you can cut back.",
        poor: "You're spending more than you earn. This is unsustainable. Review your budget immediately and cut non-essential expenses.",
        na: "Add income and expense transactions to get your savings score."
      },
      budget: {
        excellent: "Perfect! You're staying within budget on 90%+ of your categories. Keep up the disciplined approach!",
        great: "Great work! You're within budget on 75-90% of categories. Focus on the categories where you're overspending.",
        good: "You're within budget on 60-75% of categories. Identify problem areas and adjust spending or budgets accordingly.",
        fair: "You're only within budget on 40-60% of categories. Review your budgets and make them more realistic or cut spending.",
        poor: "You're exceeding budgets on most categories. Your budgets may be unrealistic or spending is out of control.",
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
        great: "Good balance! No category takes up more than 50% of spending. This indicates healthy financial distribution.",
        good: "Decent balance, but one category takes 50-60% of spending. Consider if this allocation aligns with your goals.",
        fair: "One category dominates 60-75% of your spending. This concentration could be risky if that area experiences changes.",
        poor: "Over 75% of spending is in one category. This is very concentrated and could indicate poor spending balance.",
        na: "Add transactions across different categories to get your spending balance score."
      }
    };

    const key = data.rating.toLowerCase();
    return advice[type][key] || advice[type].na;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#34d399';
    if (score >= 60) return '#fbbf24';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
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
                  <span className="breakdown-calc">{savingsMetric.score} × 35%</span>
                  <span className="breakdown-value">= {Math.round(savingsMetric.score * 0.35)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">🎯 Budget Adherence</span>
                  <span className="breakdown-calc">{budgetMetric.score} × 30%</span>
                  <span className="breakdown-value">= {Math.round(budgetMetric.score * 0.30)}</span>
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

      {/* Individual Metrics */}
      <div className="metrics-grid">
        {/* Savings Rate */}
        <div className="metric-card">
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
        <div className="metric-card">
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
            </div>
          )}

          <div className="metric-advice">
            <div className="advice-header">💡 Advice</div>
            <p>{getAdvice('budget', budgetMetric)}</p>
          </div>
        </div>

        {/* Transaction Consistency */}
        <div className="metric-card">
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
        <div className="metric-card">
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
