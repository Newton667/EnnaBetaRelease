import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdvicePage.css';

function RetirementPlanning() {
  // Hypothetical growth of retirement savings over time
  const growthData = [
    { age: '30', balance: 50000 },
    { age: '40', balance: 180000 },
    { age: '50', balance: 450000 },
    { age: '60', balance: 950000 },
    { age: '65', balance: 1400000 },
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">🏖️</div>
        <div className="header-text">
          <h1>Retirement Planning</h1>
          <p className="page-subtitle">Turn your working years into a secure, comfortable future</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>The Magic Number:</strong> Aim for 25x your annual expenses (The "Rule of 25").</li>
          <li><strong>Safe Withdrawal:</strong> Plan to withdraw 4% of your portfolio in year one, adjusted for inflation thereafter.</li>
          <li><strong>Free Money:</strong> Always contribute enough to your 401(k) to get your full employer match.</li>
          <li><strong>Tax Diversification:</strong> Use a mix of Pre-Tax (Traditional) and After-Tax (Roth) accounts.</li>
          <li><strong>Catch-Up:</strong> If you're 50+, you can contribute extra ($7,500+ for 401ks) to make up for lost time.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>How Much Do You Need? (The Rule of 25)</h2>
        <p>
          The most common question is "What is my number?" A simple, widely accepted heuristic is the <strong>Rule of 25</strong>. 
          Estimate your annual expenses in retirement (subtracting Social Security income), and multiply that by 25.
        </p>
        <div className="example-box">
          <h4>🧮 Example Calculation</h4>
          <p>
            You need <strong>$60,000/year</strong> to live on.<br/>
            Social Security covers <strong>$20,000/year</strong>.<br/>
            Gap to fill: <strong>$40,000/year</strong>.<br/>
            <strong>Your Number:</strong> $40,000 x 25 = <strong>$1,000,000</strong>.
          </p>
        </div>
        <p>
          This math is derived from the <strong>4% Rule</strong>, which suggests that if you have a diversified portfolio 
          (stocks/bonds), you can safely withdraw 4% of it in your first year of retirement and adjust that dollar amount 
          for inflation every subsequent year with a very low risk of running out of money over 30 years.
        </p>
      </section>

      <section className="diagram-section">
        <h2>The Power of Starting Early</h2>
        <p className="diagram-intro">
          Compound interest needs time to work. The chart below shows a typical growth trajectory. The steepest growth happens 
          at the end, but it's fueled by the contributions made at the beginning.
        </p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="age" stroke="#a0a0a0" />
              <YAxis 
                stroke="#a0a0a0" 
                tickFormatter={(val) => `$${val/1000}k`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', color: '#000', borderRadius: '8px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Balance']}
              />
              <Area type="monotone" dataKey="balance" stroke="#34d399" fill="#34d399" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="content-section">
        <h2>Account Types: 401(k) vs. IRA vs. Roth</h2>
        <p>
          Think of these accounts as "tax buckets." The investment inside (stocks, bonds) matters, but the bucket determines 
          how the IRS treats your money.
        </p>
        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#60a5fa' }}>
            <h3 style={{ color: '#60a5fa' }}>🏢 401(k) / 403(b)</h3>
            <p><strong>Best For:</strong> Employees with matching.</p>
            <p><strong>Benefit:</strong> High limits ($23,500+ for 2025). Contributions lower your taxable income today. Employer match is free money.</p>
          </div>

          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>🏦 Roth IRA</h3>
            <p><strong>Best For:</strong> Future tax savings.</p>
            <p><strong>Benefit:</strong> You pay tax <em>now</em>, but money grows tax-free and withdrawals in retirement are <strong>100% tax-free</strong>.</p>
          </div>

          <div className="comparison-card" style={{ borderColor: '#f59e0b' }}>
            <h3 style={{ color: '#f59e0b' }}>👴 Traditional IRA</h3>
            <p><strong>Best For:</strong> Those without a workplace plan.</p>
            <p><strong>Benefit:</strong> Tax deduction today (income limits apply). You pay taxes when you withdraw the money in retirement.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Catch-Up Contributions (Age 50+)</h2>
        <p>
          Behind on savings? The IRS allows "Catch-Up Contributions" starting the year you turn 50. This is a massive opportunity 
          to supercharge your portfolio in your highest-earning years.
        </p>
        <div className="tip-box">
          <h4>📈 2025 Limits & Catch-Ups</h4>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>401(k):</strong> Standard limit $23,500 + $7,500 Catch-up = <strong>$31,000 total</strong>.</li>
            <li><strong>IRA:</strong> Standard limit $7,000 + $1,000 Catch-up = <strong>$8,000 total</strong>.</li>
            <li><em>Note: Limits often adjust annually for inflation.</em></li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Social Security: The Foundation</h2>
        <p>
          Social Security was never meant to be your <em>only</em> income, but it is a critical safety net.
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '10px' }}>🔹 <strong>Age 62:</strong> Earliest you can claim, but benefits are permanently reduced (up to 30%).</li>
          <li style={{ marginBottom: '10px' }}>🔹 <strong>Age 67:</strong> "Full Retirement Age" (for those born 1960+). You get 100% of your benefit.</li>
          <li>🔹 <strong>Age 70:</strong> Maximum benefit. For every year you wait past 67, your check grows by ~8%.</li>
        </ul>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Recommended Tools</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.citizensbank.com/learning/ira-vs-401k.aspx" 
               target="_blank" rel="noopener noreferrer">
              Citizens Bank - "IRA vs. 401(k): What's the difference?"
            </a>
          </li>
          <li>
            <a href="https://www.bankrate.com/retirement/rule-of-25/" 
               target="_blank" rel="noopener noreferrer">
              Bankrate - "The Rule of 25: How Much Do You Need?"
            </a>
          </li>
          <li>
            <a href="https://smartasset.com/retirement/25x-retirement-rule" 
               target="_blank" rel="noopener noreferrer">
              SmartAsset - "Calculating Your Retirement Number"
            </a>
          </li>
          <li>
            <a href="https://www.ssa.gov/oact/cola/Benefits.html" 
               target="_blank" rel="noopener noreferrer">
              Social Security Administration - "Benefit Calculation Basics"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default RetirementPlanning;