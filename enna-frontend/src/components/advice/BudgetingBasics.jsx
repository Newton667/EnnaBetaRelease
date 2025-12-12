import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './AdvicePage.css';

function BudgetingBasics() {
  const [income, setIncome] = useState(4000);

  // 50/30/20 Budget allocation data (static for the chart)
  const budgetData = [
    { name: 'Needs (50%)', value: 50, color: '#34d399', description: 'Housing, utilities, groceries, transport' },
    { name: 'Wants (30%)', value: 30, color: '#60a5fa', description: 'Dining out, entertainment, hobbies' },
    { name: 'Savings (20%)', value: 20, color: '#f59e0b', description: 'Emergency fund, retirement, debt' }
  ];

  // Dynamic calculations for the calculator
  const needsAmount = (income * 0.50).toFixed(0);
  const wantsAmount = (income * 0.30).toFixed(0);
  const savingsAmount = (income * 0.20).toFixed(0);

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">💰</div>
        <div className="header-text">
          <h1>Budgeting Basics</h1>
          <p className="page-subtitle">Master the foundation of personal finance</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>The Golden Rule:</strong> 50% needs, 30% wants, 20% savings/debt.</li>
          <li><strong>Track First:</strong> Track every expense for 30 days before setting limits.</li>
          <li><strong>Zero-Based:</strong> Assign every dollar a job before the month begins.</li>
          <li><strong>Inflation Check:</strong> Re-evaluate your "Needs" annually as costs rise.</li>
          <li><strong>Tools:</strong> Use apps or spreadsheets; automation beats willpower.</li>
        </ul>
      </div>

      {/* Interactive Calculator Section (New!) */}
      <section className="content-section calculator-section">
        <h2 className="calculator-header">
          🧮 Interactive 50/30/20 Calculator
        </h2>
        <p>Enter your monthly after-tax income to see your personalized breakdown:</p>
        
        <div className="calculator-input-container">
          <label className="calculator-label">Monthly Income:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input 
              type="number" 
              className="income-input"
              value={income}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="comparison-grid calculator-grid">
          <div className="comparison-card needs-card">
            <h3>Needs (50%)</h3>
            <p>Rent, utilities, groceries</p>
            <span className="highlight">${needsAmount}</span>
          </div>
          <div className="comparison-card wants-card">
            <h3>Wants (30%)</h3>
            <p>Fun, dining, subscriptions</p>
            <span className="highlight">${wantsAmount}</span>
          </div>
          <div className="comparison-card savings-card">
            <h3>Savings (20%)</h3>
            <p>Investing, debt payoff</p>
            <span className="highlight">${savingsAmount}</span>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section">
        <h2>Why Budgeting Matters</h2>
        <p>
          Budgeting is the cornerstone of financial success, yet it's often misunderstood as restrictive. 
          In reality, a budget is <strong>permission to spend</strong>. It is a plan for your money—a roadmap that tells you where your hard-earned dollars 
          are going before they disappear.
        </p>
        <p>
          Research consistently shows that people who budget regularly are significantly more likely to achieve their 
          financial goals. The psychological benefit is equally important; a budget eliminates the constant mental stress of wondering 
          if you can afford that dinner out. When the money is in the "Wants" bucket, you can spend it guilt-free.
        </p>
      </section>

      {/* Diagram Section */}
      <section className="diagram-section">
        <h2>The 50/30/20 Rule: Visual Breakdown</h2>
        <p className="diagram-intro">
          Senator Elizabeth Warren popularized this simple yet effective budgeting framework. It divides your 
          after-tax income into three categories, providing a balanced approach to managing money.
        </p>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
                formatter={(value, entry) => (
                  <span style={{ color: '#e0e0e0', fontSize: '14px', marginLeft: '5px' }}>
                    {entry.payload.name}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="budget-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-header" style={{ color: '#34d399' }}>
              <span className="breakdown-percentage">50%</span>
              <span className="breakdown-label">Needs</span>
            </div>
            <p>
              Essential expenses you cannot reasonably eliminate: rent/mortgage, utilities, groceries, transportation, 
              insurance, and minimum debt payments. <em>Tip: If your needs exceed 50%, focus on major fixed costs like housing or cars first.</em>
            </p>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header" style={{ color: '#60a5fa' }}>
              <span className="breakdown-percentage">30%</span>
              <span className="breakdown-label">Wants</span>
            </div>
            <p>
              Things that make life enjoyable: dining out, entertainment, hobbies, subscriptions, shopping, vacations. 
              This category is crucial because a budget that's too restrictive will fail.
            </p>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header" style={{ color: '#f59e0b' }}>
              <span className="breakdown-percentage">20%</span>
              <span className="breakdown-label">Savings & Debt</span>
            </div>
            <p>
              Your path to financial freedom: emergency fund, retirement contributions (401k/IRA), and paying extra on debts. 
              <strong>Pay yourself first</strong> by moving this money as soon as you get paid.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Zero-Based Budgeting: Give Every Dollar a Job</h2>
        <p>
          Zero-based budgeting (ZBB) is a more hands-on approach where income minus expenses equals zero. 
          If you earn $4,000, you assign exactly $4,000 to categories—including savings.
        </p>
        <div className="example-box">
          <h4>💡 Example Allocation</h4>
          <p>
            Income: $4,000<br/>
            - $1,400 Rent<br/>
            - $400 Groceries<br/>
            - $300 Utilities/Phone<br/>
            - $300 Car/Transport<br/>
            - $600 Retirement (Savings)<br/>
            - $300 Emergency Fund (Savings)<br/>
            - $400 Debt Payoff<br/>
            - $300 "Fun Money"<br/>
            <strong>= $0 Remaining</strong> (Every dollar is assigned!)
          </p>
        </div>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Recommended Tools</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.nerdwallet.com/finance/learn/how-to-budget" 
               target="_blank" rel="noopener noreferrer">
              NerdWallet: "How to Budget Money: A Step-By-Step Guide"
            </a>
          </li>
          <li>
            <a href="https://www.investopedia.com/financial-edge/1109/6-reasons-why-you-need-a-budget.aspx" 
               target="_blank" rel="noopener noreferrer">
              Investopedia: "Budgeting Basics - Why You Need a Budget"
            </a>
          </li>
          <li>
            <a href="https://consumer.gov/content/make-budget-worksheet" 
               target="_blank" rel="noopener noreferrer">
              Consumer.gov: "Make a Budget - Official Worksheet"
            </a>
          </li>
          <li>
            <a href="https://bettermoneyhabits.bankofamerica.com/en/saving-budgeting/creating-a-budget" 
               target="_blank" rel="noopener noreferrer">
              Better Money Habits: "Your Guide to Creating a Budget Plan"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default BudgetingBasics;