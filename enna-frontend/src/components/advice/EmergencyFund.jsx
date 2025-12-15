import './AdvicePage.css';

function EmergencyFund() {
  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">🆘</div>
        <div className="header-text">
          <h1>Emergency Fund</h1>
          <p className="page-subtitle">Your financial safety net for life's unexpected turns</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>The Goal:</strong> Save 3-6 months of essential living expenses (rent, food, utilities, etc.).</li>
          <li><strong>Start Small:</strong> Aim for a $1,000 "starter fund" first to cover minor mishaps.</li>
          <li><strong>Where to Keep It:</strong> High-Yield Savings Account (HYSA). Accessible but separate from spending.</li>
          <li><strong>What It's For:</strong> Job loss, medical emergencies, urgent home/car repairs. NOT vacations or gifts.</li>
          <li><strong>Automate:</strong> Set up automatic transfers to build your fund without thinking about it.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>How Much Should You Save? (3 vs. 6 Months)</h2>
        <p>
          The standard advice is 3 to 6 months of expenses, but your specific number depends on your stability.
        </p>
        <div className="comparison-grid" style={{ marginTop: '20px' }}>
          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>Aim for 3 Months If...</h3>
            <ul style={{ listStyle: 'none', padding: '0', color: '#d0d0d0', fontSize: '14px', lineHeight: '1.6' }}>
              <li>✅ You are single with no dependents.</li>
              <li>✅ You have a very stable job.</li>
              <li>✅ You rent your home (fewer surprise repairs).</li>
              <li>✅ You have low debt obligations.</li>
            </ul>
          </div>

          <div className="comparison-card" style={{ borderColor: '#60a5fa' }}>
            <h3 style={{ color: '#60a5fa' }}>Aim for 6+ Months If...</h3>
            <ul style={{ listStyle: 'none', padding: '0', color: '#d0d0d0', fontSize: '14px', lineHeight: '1.6' }}>
              <li>⚠️ You have children or dependents.</li>
              <li>⚠️ You are self-employed or have variable income.</li>
              <li>⚠️ You own a home (potential for big repairs).</li>
              <li>⚠️ You have a chronic health condition.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Where to Keep Your Fund</h2>
        <p>
          Your emergency fund needs to be <strong>liquid</strong> (easy to access) but not <em>too</em> accessible (so you don't spend it).
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '15px' }}>
            🏆 <strong>High-Yield Savings Account (HYSA):</strong> The best option. Earns 4-5% interest, FDIC insured, and separates money from your checking.
          </li>
          <li style={{ marginBottom: '15px' }}>
            ⚠️ <strong>Checking Account:</strong> Risky. Too easy to accidentally spend on non-emergencies. Earns almost zero interest.
          </li>
          <li>
            ❌ <strong>Investments (Stocks/Crypto):</strong> Terrible idea. If the market crashes when you lose your job, you lock in losses.
          </li>
        </ul>
      </section>

      <section className="content-section">
        <h2>What Counts as an Emergency?</h2>
        <p>
          It can be tempting to raid the fund for "urgent" wants. Be strict.
        </p>
        <div className="comparison-grid">
          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>✅ True Emergencies</h3>
            <p>Job loss, ER visit, broken furnace in winter, car transmission failure (if you need it for work).</p>
          </div>
          <div className="comparison-card" style={{ borderColor: '#ef4444' }}>
            <h3 style={{ color: '#ef4444' }}>❌ Not Emergencies</h3>
            <p>Holiday gifts, vacations, new iPhone launch, car maintenance (oil change/tires - budget for these!), concert tickets.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Strategies to Build It Fast</h2>
        <p>
          Building a full 6-month fund takes time. Don't get discouraged.
        </p>
        <div className="tip-box">
          <h4>🚀 Turbo-Charge Your Savings</h4>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>The "Windfall" Rule:</strong> Commit 100% of tax refunds, work bonuses, or birthday money to the fund until it's full.</li>
            <li><strong>Sell Clutter:</strong> Sell unused electronics, clothes, or furniture. It's instant cash for the fund.</li>
            <li><strong>Temporary Side Hustle:</strong> Pick up gig work (DoorDash, Uber, Freelancing) specifically to fill the fund, then quit.</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <h2>Emergency Fund vs. Sinking Fund</h2>
        <p>
          Don't confuse the two. A <strong>Sinking Fund</strong> is savings for a <em>known</em> future expense (like a wedding, vacation, or new car). 
          An <strong>Emergency Fund</strong> is for the <em>unknown</em>. Keep them in separate accounts if possible to avoid mixing goals.
        </p>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/" 
               target="_blank" rel="noopener noreferrer">
              CFPB - "An Essential Guide to Building an Emergency Fund"
            </a>
          </li>
          <li>
            <a href="https://www.ramseysolutions.com/saving/quick-guide-to-your-emergency-fund" 
               target="_blank" rel="noopener noreferrer">
              Ramsey Solutions - "Emergency Fund: Why You Need One & How Much to Save"
            </a>
          </li>
          <li>
            <a href="https://www.bankrate.com/banking/savings/starting-an-emergency-fund/" 
               target="_blank" rel="noopener noreferrer">
              Bankrate - "How to Start (and Build) an Emergency Fund"
            </a>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/banking/learn/emergency-fund-why-it-matters" 
               target="_blank" rel="noopener noreferrer">
              NerdWallet - "Emergency Fund: What It Is and Why It Matters"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default EmergencyFund;