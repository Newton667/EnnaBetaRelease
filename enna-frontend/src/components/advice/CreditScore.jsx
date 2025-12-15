import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './AdvicePage.css';

function CreditScore() {
  // FICO Score Factors Data
  const scoreFactors = [
    { name: 'Payment History', value: 35, color: '#34d399', description: 'On-time payments (most critical)' },
    { name: 'Amounts Owed', value: 30, color: '#60a5fa', description: 'Credit utilization ratio' },
    { name: 'Length of History', value: 15, color: '#f59e0b', description: 'Age of oldest account' },
    { name: 'New Credit', value: 10, color: '#f87171', description: 'Recent hard inquiries' },
    { name: 'Credit Mix', value: 10, color: '#a78bfa', description: 'Cards, mortgages, loans' }
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">⭐</div>
        <div className="header-text">
          <h1>Credit Score Guide</h1>
          <p className="page-subtitle">Understand, build, and protect your financial reputation</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>Pay on Time:</strong> Payment history is 35% of your score. Never miss a due date.</li>
          <li><strong>Keep Balances Low:</strong> Keep credit card utilization below 30% (ideally below 10%).</li>
          <li><strong>Don't Close Old Cards:</strong> Length of history matters (15%). Keep your oldest accounts open.</li>
          <li><strong>Check Reports:</strong> You are entitled to a free credit report annually from AnnualCreditReport.com.</li>
          <li><strong>FICO vs. Vantage:</strong> FICO is used by 90% of top lenders; VantageScore is common on free sites.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>What Makes Up Your FICO Score?</h2>
        <p>
          Your credit score isn't a random number; it's a calculated grade of your reliability as a borrower. 
          Most lenders use the <strong>FICO Score 8</strong> model. Understanding the weights helps you prioritize your actions.
        </p>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scoreFactors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {scoreFactors.map((entry, index) => (
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
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="content-section">
        <h2>FICO vs. VantageScore</h2>
        <p>
          You actually have dozens of credit scores. The two main scoring models are <strong>FICO</strong> (used by lenders for mortgages/loans) 
          and <strong>VantageScore</strong> (often seen on free credit apps like Credit Karma).
        </p>
        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>📊 FICO Score</h3>
            <p><strong>Used By:</strong> 90% of top lenders.</p>
            <p><strong>Requires:</strong> 6 months of credit history.</p>
            <p><strong>Focus:</strong> Heavily weights payment history.</p>
          </div>

          <div className="comparison-card" style={{ borderColor: '#60a5fa' }}>
            <h3 style={{ color: '#60a5fa' }}>📉 VantageScore 3.0/4.0</h3>
            <p><strong>Used By:</strong> Free credit monitoring apps.</p>
            <p><strong>Requires:</strong> Only 1 month of history.</p>
            <p><strong>Focus:</strong> Weights trended data & utilization more.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>The 30% Utilization Rule</h2>
        <p>
          <strong>Credit Utilization</strong> is the ratio of your credit card balance to your credit limit. 
          If you have a $1,000 limit and a $500 balance, your utilization is 50%.
        </p>
        <div className="tip-box">
          <h4>💡 The Golden Rule</h4>
          <p>
            Lenders get nervous when you use too much of your available credit.
            <br/>
            ✅ <strong>0-10%:</strong> Excellent (Best for max score)
            <br/>
            ✅ <strong>10-30%:</strong> Good (Standard advice)
            <br/>
            ⚠️ <strong>30%+:</strong> Can hurt your score significantly
          </p>
        </div>
        <p>
          <em>Pro Tip:</em> Pay your bill <strong>before</strong> the statement closing date (not just the due date) to report a lower balance to bureaus.
        </p>
      </section>

      <section className="content-section">
        <h2>How to Improve Your Score Fast</h2>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '15px' }}>
            🚀 <strong>Dispute Errors:</strong> 1 in 5 people have an error on their report. Check for accounts that aren't yours or incorrect late payments.
          </li>
          <li style={{ marginBottom: '15px' }}>
            🚀 <strong>Become an Authorized User:</strong> Ask a family member with great credit to add you to their card. You inherit their positive history.
          </li>
          <li>
            🚀 <strong>Experian Boost:</strong> A free service that lets you add utility and telecom bills to your credit file to potentially boost your FICO score instantly.
          </li>
        </ul>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Recommended Tools</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.myfico.com/credit-education/whats-in-your-credit-score" 
               target="_blank" rel="noopener noreferrer">
              myFICO - "What's in my FICO® Scores?"
            </a>
          </li>
          <li>
            <a href="https://www.experian.com/blogs/ask-experian/credit-education/score-basics/credit-utilization-rate/" 
               target="_blank" rel="noopener noreferrer">
              Experian - "Credit Utilization Rate Explained"
            </a>
          </li>
          <li>
            <a href="https://www.annualcreditreport.com/index.action" 
               target="_blank" rel="noopener noreferrer">
              AnnualCreditReport.com (Official Free Federal Site)
            </a>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/how-do-i-get-and-keep-a-good-credit-score-en-318/" 
               target="_blank" rel="noopener noreferrer">
              CFPB - "How to Get and Keep a Good Credit Score"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default CreditScore;