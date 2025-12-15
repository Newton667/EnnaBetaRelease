import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdvicePage.css';

function TaxOptimization() {
  // Hypothetical comparison of taxable vs tax-advantaged growth
  // Assuming $10k investment, 7% return, 25% tax rate
  const taxData = [
    { 
      name: 'Taxable Account', 
      value: 76123, 
      label: 'Taxable Growth',
      description: 'Taxes paid annually on dividends/gains drag down growth'
    },
    { 
      name: 'Tax-Deferred (401k/IRA)', 
      value: 100000, 
      label: 'Tax-Deferred Growth',
      description: 'Money grows faster without annual tax drag (taxes paid at end)'
    }
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">📋</div>
        <div className="header-text">
          <h1>Tax Optimization</h1>
          <p className="page-subtitle">Legal strategies to keep more of your hard-earned money</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>Max Tax-Advantaged Accounts:</strong> Prioritize 401(k), IRA, and HSA before taxable brokerage accounts.</li>
          <li><strong>Asset Location:</strong> Keep high-tax assets (bonds, REITs) in tax-deferred accounts; stocks in taxable.</li>
          <li><strong>Tax-Loss Harvesting:</strong> Sell losing investments to offset gains and reduce your tax bill.</li>
          <li><strong>HSA Triple Threat:</strong> HSAs are the only account with tax-free in, tax-free growth, and tax-free out.</li>
          <li><strong>Hold Long Term:</strong> Assets held {'>'}1 year get lower "Long-Term Capital Gains" tax rates (0%, 15%, 20%).</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>The Cost of Taxes (Tax Drag)</h2>
        <p>
          Taxes act like friction on your portfolio. In a standard taxable account, you pay taxes on dividends and interest 
          every year, which reduces the amount of money left to compound.
        </p>
        <p>
          <strong>Tax-Advantaged Accounts</strong> (like 401ks and IRAs) shield your money from this annual drag, allowing it 
          to grow significantly faster over 20-30 years.
        </p>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taxData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#a0a0a0" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#a0a0a0" 
                width={150}
                style={{ fontSize: '14px' }}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                itemStyle={{ color: '#ffffff' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Projected Value']}
              />
              <Bar dataKey="value" fill="#34d399" radius={[0, 4, 4, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#a0a0a0', marginTop: '10px' }}>
            *Hypothetical growth of $10k over 30 years at 7% return vs. taxable equivalent
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2>Tax-Loss Harvesting</h2>
        <p>
          This is a strategy to lower your tax bill by turning investment losses into a tax deduction.
        </p>
        <div className="example-box">
          <h4>📉 How it Works</h4>
          <p>
            1. You own Stock A, which has dropped <strong>$3,000</strong> in value.<br/>
            2. You sell Stock A to "realize" the loss.<br/>
            3. You immediately buy a similar (but not identical) fund to stay invested.<br/>
            4. You use that $3,000 loss to offset other gains or <strong>deduct it from your regular income</strong> on your tax return.
          </p>
        </div>
        <p>
          <em>Note:</em> Be careful of the "Wash Sale Rule," which disallows the deduction if you buy the 
          <strong>same</strong> or "substantially identical" security within 30 days.
        </p>
      </section>

      <section className="content-section">
        <h2>Asset Location: What Goes Where?</h2>
        <p>
          Not all investments are taxed the same. Placing them in the right account can save you money.
        </p>
        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#f59e0b' }}>
            <h3 style={{ color: '#f59e0b' }}>Put in Tax-Deferred (IRA/401k)</h3>
            <p><strong>Bonds, REITs, High-Dividend Stocks.</strong> These pay frequent interest/dividends that are taxed at high ordinary income rates. Shield them here.</p>
          </div>

          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>Put in Taxable Brokerage</h3>
            <p><strong>Growth Stocks, Index Funds.</strong> These grow mostly through price appreciation, which you control (you only get taxed when you sell). Plus, they get lower Long-Term Capital Gains rates.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>The HSA: The Ultimate Tax Vehicle</h2>
        <p>
          The Health Savings Account (HSA) is often called the "Triple Crown" of tax optimization because it offers three distinct tax breaks:
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '10px' }}>1️⃣ <strong>Tax-Deduction In:</strong> Contributions reduce your taxable income today.</li>
          <li style={{ marginBottom: '10px' }}>2️⃣ <strong>Tax-Free Growth:</strong> Invested funds grow tax-free (like a Roth).</li>
          <li style={{ marginBottom: '10px' }}>3️⃣ <strong>Tax-Free Out:</strong> Withdrawals for qualified medical expenses are 100% tax-free.</li>
        </ul>
        <p>
          <em>Strategy:</em> If you can afford it, pay medical bills out-of-pocket and let your HSA grow invested for decades. 
          It effectively becomes a super-charged retirement account for future healthcare costs.
        </p>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://investor.vanguard.com/investor-resources-education/article/year-end-tax-tips" 
               target="_blank" rel="noopener noreferrer">
              Vanguard - "Year-End Tax Optimization Tips"
            </a>
          </li>
          <li>
            <a href="https://www.fidelity.com/viewpoints/personal-finance/tax-loss-harvesting" 
               target="_blank" rel="noopener noreferrer">
              Fidelity - "Tax-Loss Harvesting Explained"
            </a>
          </li>
          <li>
            <a href="https://www.schwab.com/learn/story/how-to-cut-your-tax-bill-with-tax-loss-harvesting" 
               target="_blank" rel="noopener noreferrer">
              Charles Schwab - "Cutting Your Tax Bill Strategies"
            </a>
          </li>
          <li>
            <a href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" 
               target="_blank" rel="noopener noreferrer">
              IRS.gov - "Tax Inflation Adjustments & Standard Deductions 2025/2026"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default TaxOptimization;