import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdvicePage.css';

function SavingStrategies() {
  // Savings comparison data - traditional vs high-yield
  const savingsData = [
    { 
      name: 'Traditional Bank', 
      rate: 0.01, 
      annual: 1,
      label: '0.01% APY'
    },
    { 
      name: 'High-Yield Savings', 
      rate: 4.5, 
      annual: 450,
      label: '4.5% APY'
    }
  ];

  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">🏦</div>
        <div className="header-text">
          <h1>Saving Strategies</h1>
          <p className="page-subtitle">Build wealth through systematic saving habits</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li>Automate savings before you can spend it—pay yourself first principle</li>
          <li>High-yield savings accounts offer 4-5% APY vs 0.01% at traditional banks</li>
          <li>Use the 24-hour rule for purchases over $50 to eliminate 30-40% of impulse buying</li>
          <li>Round-up savings can accumulate $300-600 annually without conscious effort</li>
          <li>Save 50-75% of raises and 100% of bonuses to avoid lifestyle inflation</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>The Philosophy of Paying Yourself First</h2>
        <p>
          "Pay yourself first" is perhaps the most powerful wealth-building principle in personal finance. The concept 
          is simple: before you pay your rent, before you buy groceries, before you do anything with your paycheck, 
          you pay yourself by moving money into savings or investments.
        </p>
        <p>
          This inverts the typical approach most people take, which is to save whatever is left over at the end of 
          the month. The problem with that strategy is there's rarely anything left over. Expenses expand to fill 
          available income—a phenomenon known as Parkinson's Law applied to money. If you have $3,000 in your checking 
          account, you'll find ways to spend $3,000.
        </p>
        <p>
          By automating savings immediately when your paycheck arrives, you never see that money, so you never miss it. 
          If $500 moves automatically to savings on payday, you'll naturally adjust your spending to the remaining amount. 
          Your brain treats the remaining balance as your "real" income, and you budget accordingly.
        </p>
        <p>
          Start with whatever percentage you can manage—even 1% is a starting point. If you can't save 1% of your income, 
          your problem isn't income, it's expenses, and you need to seriously evaluate your lifestyle. Most people can 
          start at 5-10% and work their way up to 15-20% or more as they eliminate debt and optimize expenses.
        </p>
        <p>
          The key is automation. Manual savings requires willpower every single month, and willpower is a finite resource 
          that gets depleted by stress, fatigue, and temptation. Automation removes willpower from the equation entirely. 
          Set it up once, and you'll save consistently for years without thinking about it.
        </p>
      </section>

      {/* Diagram Section */}
      <section className="diagram-section">
        <h2>High-Yield Savings: The Interest Rate Difference</h2>
        <p className="diagram-intro">
          On $10,000 in savings, the difference between traditional banks and high-yield accounts is $449 per year. 
          That's free money you're leaving on the table if you're still using a 0.01% savings account.
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
                label={{ value: 'Annual Earnings on $10,000', angle: -90, position: 'insideLeft', fill: '#a0a0a0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value, name) => {
                  if (name === 'annual') return [`$${value}`, 'Annual Interest'];
                  return value;
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="annual" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card">
            <h3>Traditional Bank (0.01%)</h3>
            <p>Most brick-and-mortar banks offer laughably low rates due to expensive overhead: building rent, tellers' salaries, ATM maintenance.</p>
            <span className="highlight">$1/year</span>
            <p style={{ marginTop: '12px', color: '#ef4444' }}>You're essentially giving the bank an interest-free loan</p>
          </div>

          <div className="comparison-card">
            <h3>High-Yield Savings (4.5%)</h3>
            <p>Online banks operate with minimal overhead, passing savings to customers through significantly higher rates. FDIC-insured up to $250k.</p>
            <span className="highlight">$450/year</span>
            <p style={{ marginTop: '12px', color: '#34d399' }}>Popular: Marcus, Ally, Capital One 360, Discover</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>The 24-Hour Rule: Defeating Impulse Purchases</h2>
        <p>
          Impulse purchases are the silent killer of financial goals. A $40 impulse buy seems harmless, but if you make 
          one every few days, that's $400-600 per month—$4,800-7,200 per year—disappearing into things you barely remember buying.
        </p>
        <p>
          The 24-hour rule is elegantly simple: for any non-essential purchase over $50, wait 24 hours before buying. 
          Add the item to a list or leave it in your online shopping cart, but don't complete the purchase immediately. 
          Return the next day and ask yourself if you still want it.
        </p>
        <p>
          Research in behavioral economics shows that desire diminishes rapidly once the immediate emotional trigger passes. 
          In the moment, your brain is flooded with dopamine, anticipating the pleasure of ownership. This neural excitement 
          makes every purchase seem justified and necessary. After 24 hours, that neurochemical response fades, and you can 
          evaluate the purchase rationally.
        </p>

        <div className="tip-box">
          <h4>💡 Graduated Waiting Periods</h4>
          <p>
            For purchases over $200, wait 72 hours. For items over $1,000, wait a full week. This ensures bigger 
            decisions receive appropriately longer consideration.
          </p>
        </div>

        <p>
          Studies suggest this simple rule eliminates 30-40% of impulse purchases. Applied to someone who would otherwise 
          spend $500 monthly on impulse items, the 24-hour rule saves $150-200 per month—$1,800-2,400 per year. That's 
          a decent vacation or a substantial emergency fund contribution, all saved by simply waiting one day.
        </p>
        <p>
          The beauty of this rule is that it doesn't prevent spending—it just delays it. If you still want the item after 
          waiting, buy it guilt-free. You've given yourself permission to spend by demonstrating it's not an impulse, 
          but a considered decision.
        </p>
      </section>

      <section className="content-section">
        <h2>Round-Up Savings: The Power of Small Amounts</h2>
        <p>
          Round-up savings leverages a simple psychological principle: we barely notice small amounts leaving our accounts, 
          but those small amounts add up surprisingly quickly. The concept is straightforward—every time you make a purchase, 
          round up to the nearest dollar and transfer the difference to savings.
        </p>
        <p>
          Buy a coffee for $3.75? Transfer $0.25 to savings. Gas for $42.18? Transfer $0.82. Each individual transaction 
          is meaningless, but making 50-100 transactions per month means $25-50 moving automatically to savings without you feeling it.
        </p>
        <p>
          Apps like Acorns, Chime, and Bank of America's "Keep the Change" program automate this process entirely. Alternatively, 
          you can approximate it manually by transferring a fixed amount—say $50—to savings every week. The key is that it 
          happens automatically and in amounts too small to trigger loss aversion.
        </p>

        <div className="example-box">
          <h4>📊 Real-World Example</h4>
          <p>
            Average person making 75 transactions per month with average round-up of $0.40 = $30/month = $360/year. 
            Over 10 years at 4.5% interest, that becomes $4,500+ without any conscious effort or behavior change.
          </p>
        </div>

        <p>
          The psychological benefit extends beyond the money saved. Watching your savings balance grow from these micro-deposits 
          creates positive reinforcement. You're "finding" money in your regular spending, turning every purchase into a dual 
          action: buying something you need while simultaneously building savings. This reframes spending as a savings opportunity 
          rather than just money leaving your account.
        </p>
      </section>

      <section className="content-section">
        <h2>Combat Lifestyle Inflation</h2>
        <p>
          Lifestyle inflation—also called lifestyle creep—is perhaps the biggest obstacle to building wealth. It's the tendency 
          to increase spending as income increases, preventing any accumulation of wealth despite earning more money. Someone 
          earning $100,000 can be just as broke as someone earning $40,000 if their expenses rise proportionally with their income.
        </p>
        <p>
          This phenomenon is so common it's almost universal. You get a raise, and suddenly the old apartment isn't quite good 
          enough—you deserve something nicer. The reliable used car feels inadequate—you deserve something newer. Your wardrobe 
          needs upgrading. You eat out more frequently at better restaurants. Within months, your expenses have absorbed your raise, 
          leaving you no better off financially.
        </p>

        <div className="tip-box">
          <h4>💡 The 50/50 Rule for Raises</h4>
          <p>
            Split raises evenly between lifestyle improvements and financial goals. Get a $400/month raise? Increase spending 
            by $200 and redirect $200 to savings or debt repayment. This gives you the psychological reward of enjoying your 
            increased income while simultaneously accelerating your financial progress.
          </p>
        </div>

        <p>
          The solution isn't to never improve your lifestyle—that would make earning more feel pointless. Instead, implement 
          the 50/50 rule for raises and bonuses: split them evenly between lifestyle improvements and financial goals.
        </p>
        <p>
          Bonuses and windfalls deserve even more aggressive saving. Consider saving 75-100% of bonuses, tax refunds, and 
          unexpected money. You weren't counting on this money for your regular lifestyle, so you won't miss it. These 
          occasional large deposits can turbocharge your emergency fund, debt payoff, or investment accounts.
        </p>
        <p>
          The mindset shift is crucial: earning more is an opportunity to build wealth, not permission to spend more. Your 
          future self—the one who wants to retire comfortably, handle emergencies without stress, and have financial options—will 
          thank you for resisting lifestyle inflation.
        </p>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.davidbach.com/books/the-automatic-millionaire/" 
               target="_blank" rel="noopener noreferrer">
              David Bach, "The Automatic Millionaire"
            </a>
          </li>
          <li>
            <a href="https://www.bankrate.com/banking/savings/best-high-yield-interests-savings-accounts/" 
               target="_blank" rel="noopener noreferrer">
              Bankrate - "Best High-Yield Savings Accounts" (updated weekly)
            </a>
          </li>
          <li>
            <a href="https://www.fdic.gov/" 
               target="_blank" rel="noopener noreferrer">
              Federal Deposit Insurance Corporation (FDIC)
            </a>
          </li>
          <li>
            <a href="https://www.iwillteachyoutoberich.com/" 
               target="_blank" rel="noopener noreferrer">
              Ramit Sethi, "I Will Teach You to Be Rich"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default SavingStrategies;
