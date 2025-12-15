import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdvicePage.css';

function InvestingGuide() {
  // Compound interest projection data: $10k initial, $500/mo contribution, 7% annual return
  const compoundData = [
    { year: 'Year 0', principal: 10000, interest: 0 },
    { year: 'Year 5', principal: 40000, interest: 7000 },
    { year: 'Year 10', principal: 70000, interest: 28000 },
    { year: 'Year 15', principal: 100000, interest: 65000 },
    { year: 'Year 20', principal: 130000, interest: 125000 },
    { year: 'Year 25', principal: 160000, interest: 220000 },
    { year: 'Year 30', principal: 190000, interest: 360000 },
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">📈</div>
        <div className="header-text">
          <h1>Investing 101</h1>
          <p className="page-subtitle">Build long-term wealth through smart, proven strategies</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>Start Early:</strong> Time is your biggest asset due to compound interest (interest earning interest).</li>
          <li><strong>Diversify:</strong> Don't put all your eggs in one basket; buy broad market index funds or ETFs.</li>
          <li><strong>Minimize Fees:</strong> High expense ratios eat your profits. Aim for funds with fees under 0.10%.</li>
          <li><strong>Tax Advantage:</strong> Maximize 401(k) matches and IRAs before taxable brokerage accounts.</li>
          <li><strong>Stay the Course:</strong> Time in the market beats timing the market. Ignore short-term volatility.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>The Power of Compound Interest</h2>
        <p>
          Albert Einstein reputedly called compound interest the "eighth wonder of the world." It’s the snow-ball effect of your money earning money, 
          and then that new money earning even more money.
        </p>
        <p>
          The chart below shows the growth of a portfolio starting with <strong>$10,000</strong> and adding <strong>$500/month</strong> at a 7% average annual return 
          (historical stock market average). Notice how the "Interest" component eventually grows larger than your contributions!
        </p>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={compoundData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="year" stroke="#a0a0a0" style={{ fontSize: '14px' }} />
              <YAxis 
                stroke="#a0a0a0" 
                style={{ fontSize: '14px' }} 
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                itemStyle={{ color: '#ffffff' }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ color: '#ffffff' }} />
              <Area 
                type="monotone" 
                dataKey="principal" 
                stackId="1" 
                stroke="#60a5fa" 
                fill="#60a5fa" 
                name="Your Contributions" 
              />
              <Area 
                type="monotone" 
                dataKey="interest" 
                stackId="1" 
                stroke="#34d399" 
                fill="#34d399" 
                name="Interest Earned" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="content-section">
        <h2>Index Funds vs. Individual Stocks</h2>
        <p>
          Buying individual stocks (like Apple or Tesla) is exciting but risky. If that one company fails, you lose money.
        </p>
        <p>
          <strong>Index Funds (and ETFs)</strong> allow you to buy "the whole haystack" instead of searching for the needle. 
          An S&P 500 index fund buys tiny pieces of the 500 largest US companies. If one fails, the others keep you afloat. 
          Historically, very few professional investors beat the S&P 500 over a 10-year period.
        </p>
        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>✅ Passive Investing</h3>
            <p>Buying index funds/ETFs. Lower risk, lower stress, reliable long-term returns. "Set it and forget it."</p>
          </div>
          <div className="comparison-card" style={{ borderColor: '#ef4444' }}>
            <h3 style={{ color: '#ef4444' }}>❌ Active Trading</h3>
            <p>Picking stocks and timing buys/sells. High stress, high tax implications, and statistically likely to underperform the market.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Watch Out for Fees (Expense Ratios)</h2>
        <p>
          Investment fees are silent wealth killers. The "Expense Ratio" is the annual fee funds charge. 
          A 1% fee sounds small, but over 30 years, it can cost you <strong>hundreds of thousands of dollars</strong> in lost growth.
        </p>
        <div className="example-box">
          <h4>💡 The 1% Difference</h4>
          <p>
            On a $100,000 portfolio over 30 years: <br/>
            - <strong>0.04% fee</strong> (typical index fund) costs ~$2,500.<br/>
            - <strong>1.00% fee</strong> (typical mutual fund) costs ~$50,000+.<br/>
            Always check the Expense Ratio before buying!
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2>Tax-Advantaged Accounts: 401(k) & IRA</h2>
        <p>
          Don't pay more taxes than you have to. Use these accounts to supercharge your savings:
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '15px' }}>
            🏢 <strong>401(k):</strong> Employer-sponsored. Contributions reduce your taxable income now. 
            <strong> Always contribute enough to get the "Employer Match"</strong>—that is literally free money (100% return)!
          </li>
          <li style={{ marginBottom: '15px' }}>
            🏦 <strong>Roth IRA:</strong> An individual account you open. You pay taxes on money <em>now</em>, but it grows 
            tax-free and you pay <strong>zero taxes</strong> when you withdraw in retirement. Great for younger investors!
          </li>
          <li>
            👴 <strong>Traditional IRA:</strong> Similar to a 401(k) but individual. You get a tax break now, but pay taxes when you withdraw later.
          </li>
        </ul>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.sec.gov/reports/beginners-guide-investing" 
               target="_blank" rel="noopener noreferrer">
              U.S. SEC - "Beginner's Guide to Investing"
            </a>
          </li>
          <li>
            <a href="https://investor.vanguard.com/investor-resources-education/article/how-to-start-investing" 
               target="_blank" rel="noopener noreferrer">
              Vanguard - "How to Start Investing: A Guide for Beginners"
            </a>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/c/compoundinterest.asp" 
               target="_blank" rel="noopener noreferrer">
              Investopedia - "The Power of Compound Interest"
            </a>
          </li>
          <li>
            <a href="https://www.schwab.com/learn/story/stock-investment-tips-beginners" 
               target="_blank" rel="noopener noreferrer">
              Charles Schwab - "Stock Investment Tips for Beginners"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default InvestingGuide;