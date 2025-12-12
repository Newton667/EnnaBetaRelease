import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdvicePage.css';

function SavingStrategies() {
  // Savings comparison data - traditional vs high-yield
  // Updated data to reflect current market rates (approx. 4.2-4.5% vs 0.01%)
  // Adjusted 'annual' value for Traditional Bank slightly higher for visibility on chart (e.g., 5 instead of 1)
  // while keeping the label accurate to illustrate the point.
  const savingsData = [
    { 
      name: 'Traditional Bank', 
      rate: 0.01, 
      annual: 5, // Visual boost for chart readability (actual is ~$1)
      label: '0.01% APY',
      displayValue: '$1'
    },
    { 
      name: 'High-Yield Savings', 
      rate: 4.2, 
      annual: 420, // $10,000 * 4.2%
      label: '4.20% APY',
      displayValue: '$420'
    }
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">🏦</div>
        <div className="header-text">
          <h1>Saving Strategies</h1>
          <p className="page-subtitle">Build wealth through systematic saving habits and smart accounts</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>Pay Yourself First:</strong> Treat savings like a mandatory bill—automate it immediately on payday.</li>
          <li><strong>High-Yield Savings:</strong> Switch to a HYSA to earn ~4.2% APY instead of the 0.01% average at big banks.</li>
          <li><strong>24-Hour Rule:</strong> Wait one day for purchases over $50 to let the dopamine rush fade.</li>
          <li><strong>Round-Ups:</strong> Use apps to invest "spare change" from everyday purchases effortlessly.</li>
          <li><strong>Bank Bonuses:</strong> Save 50-100% of any windfalls (bonuses, tax returns) to fight lifestyle inflation.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>The Philosophy of Paying Yourself First</h2>
        <p>
          "Pay yourself first" reverses the typical budgeting equation. Instead of saving what's left after spending (Income - Expenses = Savings), 
          you save first and spend what's left (Income - Savings = Expenses).
        </p>
        <p>
          By automating a transfer to savings the moment your paycheck hits, you artificially lower your checking account balance. 
          Psychologically, you adjust your lifestyle to fit the remaining amount, ensuring you prioritize your future financial 
          security over immediate, often trivial, wants.
        </p>
        <div className="tip-box">
          <h4>💡 Pro Tip: Split Direct Deposit</h4>
          <p>
            Ask your employer to split your paycheck deposit. Have a percentage (e.g., 10%) or a fixed dollar amount sent 
            directly to a separate savings account, so it never even touches your main spending account.
          </p>
        </div>
      </section>

      {/* Diagram Section */}
      <section className="diagram-section">
        <h2>High-Yield Savings: The Interest Rate Difference</h2>
        <p className="diagram-intro">
          Don't let your emergency fund rot in a standard checking or savings account. High-Yield Savings Accounts (HYSAs) 
          are FDIC-insured but offer significantly higher interest rates because they often have lower overhead costs (no physical branches).
          The chart below compares the annual interest earned on a <strong>$10,000 balance</strong>.
        </p>
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#a0a0a0"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#a0a0a0"
                style={{ fontSize: '14px' }}
                label={{ value: 'Annual Interest Earned ($)', angle: -90, position: 'insideLeft', fill: '#a0a0a0' }}
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
                formatter={(value, name, props) => {
                  if (name === 'annual') return [props.payload.displayValue, 'Annual Interest'];
                  return value;
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="annual" fill="#34d399" radius={[8, 8, 0, 0]} name="Annual Interest (approx)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#ef4444' }}>
            <h3 style={{ color: '#ef4444' }}>Traditional Bank (~0.01%)</h3>
            <p>Big brick-and-mortar banks pay almost nothing. On $10,000, you earn enough to buy <strong>one pack of gum</strong> per year.</p>
            <span className="highlight" style={{ color: '#ef4444' }}>~$1/year</span>
          </div>

          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>High-Yield Savings (~4.20%)</h3>
            <p>Online banks (like Ally, Marcus, SoFi) pay 400x more. That same $10,000 earns you a <strong>nice dinner or flight</strong>.</p>
            <span className="highlight" style={{ color: '#34d399' }}>~$420/year</span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>The 24-Hour Rule: Mastering Impulse Control</h2>
        <p>
          Impulse buying is often driven by a dopamine hit—the anticipation of the reward. This emotional spike overrides logical decision-making. 
          The 24-hour rule is a "cooling-off" period.
        </p>
        <p>
          <strong>How it works:</strong> If you see a non-essential item over $50, you <em>cannot</em> buy it immediately. 
          Wait 24 hours. If you still want it just as badly the next day, you can buy it. Often, the emotional urgency 
          fades, and your rational brain realizes you don't actually need it.
        </p>
        <div className="example-box">
          <h4>🧠 The Psychology</h4>
          <p>
            Retailers use "scarcity" (limited time offer!) and "social proof" (bestseller!) to bypass your logic. 
            Time is the antidote. Waiting shifts your brain from "Hot State" (emotional) to "Cold State" (rational).
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2>Round-Up Savings: "Invisible" Saving</h2>
        <p>
          This strategy makes saving painless by rounding up your transactions to the nearest dollar and depositing the difference.
          Many banking apps (like Chime or Bank of America) or third-party apps (like Acorns or Qapital) do this automatically.
        </p>
        <p>
          <strong>Example:</strong> You buy a coffee for <strong>$4.50</strong>. The app rounds it up to <strong>$5.00</strong> 
          and moves the <strong>$0.50</strong> difference into savings.
        </p>
        <p>
          While 50 cents sounds trivial, an average user making 30-40 transactions a month can effortlessly save 
          <strong>$30-$50/month</strong> without feeling a pinch in their daily budget. It's a great way to start an emergency fund.
        </p>
      </section>

      <section className="content-section">
        <h2>Combat Lifestyle Inflation</h2>
        <p>
          "Lifestyle Creep" is when your spending rises to match your income. You get a raise, so you get a nicer car, 
          a bigger apartment, or eat out more. You earn more, but you don't <em>keep</em> more.
        </p>
        <div className="tip-box">
          <h4>💡 The 50/50 Raise Rule</h4>
          <p>
            When you get a raise, commit <strong>50%</strong> of the new income to your current lifestyle (enjoy it!) 
            and send the other <strong>50%</strong> directly to savings or investments. This allows you to reward yourself 
            while still accelerating your wealth building.
          </p>
        </div>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.bankrate.com/banking/savings/best-high-yield-interests-savings-accounts/" 
               target="_blank" rel="noopener noreferrer">
              Bankrate - Current High-Yield Savings Rates (Dec 2025)
            </a>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/p/payyourselffirst.asp" 
               target="_blank" rel="noopener noreferrer">
              Investopedia - "Pay Yourself First" Explained
            </a>
          </li>
          <li>
            <a href="https://www.citizensbank.com/learning/pay-yourself-first-budget.aspx" 
               target="_blank" rel="noopener noreferrer">
              Citizens Bank - Understanding the Pay Yourself First Budgeting Method
            </a>
          </li>
          <li>
            <a href="https://www.skyboundwealth.com/news-and-insights/the-24-hour-rule-the-simple-trick-that-saves-you-thousands" 
               target="_blank" rel="noopener noreferrer">
              Skybound Wealth - The 24-Hour Rule: The Simple Trick That Saves You Thousands
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default SavingStrategies;