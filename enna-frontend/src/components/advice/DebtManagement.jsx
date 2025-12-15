import './AdvicePage.css';

function DebtManagement() {
  return (
    <div className="advice-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">💳</div>
        <div className="header-text">
          <h1>Debt Management</h1>
          <p className="page-subtitle">Strategic approaches to eliminating debt and reclaiming financial freedom</p>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="tldr-section">
        <h2>📌 TL;DR - Quick Takeaways</h2>
        <ul className="tldr-list">
          <li><strong>Avalanche vs. Snowball:</strong> Choose Avalanche (highest interest first) to save money, or Snowball (lowest balance first) for psychological wins.</li>
          <li><strong>Negotiate Rates:</strong> Call your credit card issuer; a simple request can often lower your APR by 1-3%.</li>
          <li><strong>Balance Transfers:</strong> Move high-interest debt to a 0% intro APR card to pay down principal faster (watch out for transfer fees).</li>
          <li><strong>Know Your DTI:</strong> Keep your Debt-to-Income ratio below 36% to maintain healthy borrowing power.</li>
          <li><strong>Avoid Predatory Loans:</strong> Steer clear of payday loans and lenders who guarantee approval without checking credit.</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>Debt Avalanche vs. Debt Snowball</h2>
        <p>
          Two primary strategies exist for paying off multiple debts. Both require you to pay the minimum on all accounts, 
          then throw every extra dollar at one specific debt until it's gone.
        </p>
        
        <div className="comparison-grid" style={{ marginTop: '20px' }}>
          <div className="comparison-card" style={{ borderColor: '#34d399' }}>
            <h3 style={{ color: '#34d399' }}>🏔️ Debt Avalanche</h3>
            <p><strong>Focus:</strong> Highest interest rate first.</p>
            <p><strong>Pros:</strong> Mathematically optimal. You save the most money on interest and get out of debt faster.</p>
            <p><strong>Cons:</strong> Requires discipline. You might not see a debt fully disappear for a while.</p>
          </div>

          <div className="comparison-card" style={{ borderColor: '#60a5fa' }}>
            <h3 style={{ color: '#60a5fa' }}>❄️ Debt Snowball</h3>
            <p><strong>Focus:</strong> Lowest balance first.</p>
            <p><strong>Pros:</strong> Psychological wins. Eliminating small debts quickly builds momentum and motivation.</p>
            <p><strong>Cons:</strong> You pay more in interest over time compared to the avalanche method.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Negotiating Lower Interest Rates</h2>
        <p>
          Credit card companies want to keep you as a customer. If you have a history of on-time payments, you have leverage. 
          A 15-minute phone call could save you hundreds of dollars.
        </p>
        <div className="tip-box">
          <h4>📞 What to Say:</h4>
          <p>
            "I've been a loyal customer for [X] years and always pay on time. I've received offers for 0% balance transfers from other banks, 
            but I'd prefer to stay with you. Can you lower my current APR to match the market rate?"
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2>Consolidating with Balance Transfers</h2>
        <p>
          A balance transfer involves moving debt from a high-interest credit card (often 20-25% APR) to a new card 
          offering a <strong>0% introductory APR</strong> for 12-21 months.
        </p>
        <p>
          <strong>The Catch:</strong> Most cards charge a balance transfer fee (usually 3-5%). You must calculate if the interest saved 
          outweighs this fee. Also, if you don't pay off the entire balance before the promo period ends, you may be hit with deferred interest.
        </p>
        <div className="example-box">
          <h4>💡 The Math</h4>
          <p>
            Transferring $5,000 from a 24% APR card to a 0% card (with a 3% fee) saves you over <strong>$1,000 in interest</strong> 
            if paid off within 12 months.
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2>Understanding Debt-to-Income (DTI) Ratio</h2>
        <p>
          Your DTI is a key number lenders use to gauge your financial health. It's calculated by dividing your total monthly debt payments 
          by your gross monthly income.
        </p>
        <p>
          <strong>Formula:</strong> (Total Monthly Debt / Gross Monthly Income) x 100 = DTI %
        </p>
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '15px', color: '#e0e0e0' }}>
          <li style={{ marginBottom: '8px' }}>✅ <strong>Under 36%:</strong> Healthy. You are likely eligible for most loans.</li>
          <li style={{ marginBottom: '8px' }}>⚠️ <strong>36% - 49%:</strong> Manageable, but lenders may see you as risky.</li>
          <li style={{ marginBottom: '8px' }}>❌ <strong>50%+:</strong> Critical. You may struggle to borrow and need aggressive debt reduction.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Avoiding Predatory Lending</h2>
        <p>
          When you are desperate for cash, predatory lenders appear with "easy" solutions that trap you in cycles of debt. 
          Watch out for <strong>Payday Loans</strong>, <strong>Title Loans</strong>, and lenders who guarantee approval without a credit check.
        </p>
        <div className="warning-box">
          <h4>🚩 Red Flags to Watch For:</h4>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>Triple-digit APRs (e.g., 400%+ interest)</li>
            <li>Fees for paying off the loan early (Prepayment penalties)</li>
            <li>Balloon payments (small monthly payments with a huge lump sum at the end)</li>
            <li>Pressure to sign paperwork immediately without reading</li>
          </ul>
        </div>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Recommended Tools</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.fidelity.com/learning-center/personal-finance/avalanche-snowball-debt" 
               target="_blank" rel="noopener noreferrer">
              Fidelity - "Debt Snowball vs. Debt Avalanche: Which is Right for You?"
            </a>
          </li>
          <li>
            <a href="https://www.experian.com/blogs/ask-experian/can-i-negotiate-a-lower-interest-rate-on-my-credit-card/" 
               target="_blank" rel="noopener noreferrer">
              Experian - "How to Negotiate a Lower Credit Card Interest Rate"
            </a>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" 
               target="_blank" rel="noopener noreferrer">
              Consumer Financial Protection Bureau - "What is a Debt-to-Income Ratio?"
            </a>
          </li>
          <li>
            <a href="https://www.bankrate.com/mortgages/predatory-lending-what-it-is-and-how-to-avoid-it/" 
               target="_blank" rel="noopener noreferrer">
              Bankrate - "Predatory Lending: What It Is and How to Avoid It"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default DebtManagement;