import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './AdvicePage.css';

function BudgetingBasics() {
  // 50/30/20 Budget allocation data
  const budgetData = [
    { name: 'Needs (50%)', value: 50, color: '#34d399', description: 'Housing, utilities, groceries, transport' },
    { name: 'Wants (30%)', value: 30, color: '#60a5fa', description: 'Dining out, entertainment, hobbies' },
    { name: 'Savings (20%)', value: 20, color: '#f59e0b', description: 'Emergency fund, retirement, debt' }
  ];

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
          <li>Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt</li>
          <li>Track every expense for at least 30 days to understand your spending patterns</li>
          <li>Zero-based budgeting ensures every dollar has a specific purpose before the month begins</li>
          <li>Start small with one category and gradually expand your budget over time</li>
          <li>Most people underestimate their spending by 10-20% - tracking reveals the truth</li>
        </ul>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <h2>Why Budgeting Matters</h2>
        <p>
          Budgeting is the cornerstone of financial success, yet it's often misunderstood as restrictive or tedious. 
          In reality, a budget is simply a plan for your money—a roadmap that tells you where your hard-earned dollars 
          are going before they disappear. Without a budget, most people experience what financial experts call "income 
          evaporation": money seems to vanish without a trace, leaving you wondering where your paycheck went.
        </p>
        <p>
          Research consistently shows that people who budget regularly are significantly more likely to achieve their 
          financial goals, whether that's buying a home, becoming debt-free, or building wealth. The act of budgeting 
          itself creates awareness, and awareness is the first step toward control. When you know exactly where your 
          money goes, you can make intentional decisions rather than reactive ones.
        </p>
        <p>
          The psychological benefit is equally important. A budget eliminates the constant mental stress of wondering 
          if you can afford something. Instead of feeling guilty about spending, you'll know exactly what you can spend 
          without jeopardizing your financial stability. This mental clarity alone makes budgeting worthwhile.
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                formatter={(value, entry) => (
                  <span style={{ color: '#ffffff' }}>
                    {entry.payload.description}
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
              insurance, and minimum debt payments. If your needs exceed 50%, you're likely living beyond your means 
              and should look for ways to reduce housing costs or refinance debt.
            </p>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header" style={{ color: '#60a5fa' }}>
              <span className="breakdown-percentage">30%</span>
              <span className="breakdown-label">Wants</span>
            </div>
            <p>
              Things that make life enjoyable: dining out, entertainment, hobbies, subscriptions, shopping, vacations. 
              This category is crucial because a budget that's too restrictive will fail. You need permission to enjoy 
              your money, and this 30% provides that guilt-free spending space.
            </p>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header" style={{ color: '#f59e0b' }}>
              <span className="breakdown-percentage">20%</span>
              <span className="breakdown-label">Savings & Debt</span>
            </div>
            <p>
              Your path to financial freedom: emergency fund, retirement contributions, paying extra on debts beyond 
              minimums, and investing for future goals. Many advisors argue this should be higher if you're behind 
              on retirement, but 20% is a solid starting point most people can achieve.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Zero-Based Budgeting: Give Every Dollar a Job</h2>
        <p>
          Zero-based budgeting takes a different approach: every single dollar of income gets assigned to a specific 
          category before the month begins. Your income minus your expenses should equal zero—not because you're 
          spending everything, but because every dollar has a job, including the dollars assigned to savings.
        </p>
        <p>
          This method forces intentionality. Instead of seeing what's left over at the end of the month (usually nothing), 
          you decide upfront how much goes to each category. If you earn $4,000 per month, you might allocate: $1,400 to 
          rent, $400 to groceries, $200 to utilities, $300 to car expenses, $150 to insurance, $400 to debt payments, 
          $600 to retirement, $300 to emergency savings, and $250 to entertainment. That totals $4,000—every dollar assigned.
        </p>
        <p>
          The power of zero-based budgeting becomes apparent when you receive unexpected income. Instead of that $500 bonus 
          disappearing into general spending, you immediately decide its purpose: should it go toward your emergency fund, 
          an extra debt payment, or saving for a vacation? This prevents lifestyle inflation and accelerates your financial goals.
        </p>
        <p>
          Popular apps like YNAB (You Need A Budget) are built entirely on this principle. While you can do zero-based 
          budgeting with a simple spreadsheet, apps provide automated tracking and instant visibility into how much you 
          have left in each category as you spend throughout the month.
        </p>
      </section>

      <section className="content-section">
        <h2>Track Everything for 30 Days</h2>
        <p>
          Most people drastically underestimate their spending. Studies show that the average person underestimates their 
          discretionary spending by 10-20%, with some categories like food and entertainment being off by as much as 50%. 
          This is why the first step in budgeting isn't creating a budget—it's tracking your actual spending.
        </p>
        <p>
          For 30 days, record every single transaction, no matter how small. That $3 coffee, the $1.50 parking meter, 
          the $12 lunch—everything. Use a notes app on your phone, a budgeting app, or even a small notebook. Categorize 
          each expense: groceries, dining out, transportation, entertainment, utilities, etc.
        </p>
        <p>
          At the end of 30 days, you'll have an accurate picture of where your money actually goes. This is often a 
          revelatory moment. Many people discover they're spending $400 per month dining out when they thought it was $150. 
          Or they're paying for six streaming services they rarely use. Or small convenience purchases add up to hundreds of dollars.
        </p>
        <p>
          This data becomes the foundation for your realistic budget. You can't budget $200 for groceries if you've been 
          spending $500. Well, you can, but you'll fail unless you fundamentally change your shopping habits. Real data 
          leads to real budgets, and real budgets lead to real change.
        </p>
      </section>

      <section className="content-section">
        <h2>Start Small and Build Momentum</h2>
        <p>
          The biggest mistake new budgeters make is trying to overhaul everything at once. They create an elaborate 
          spreadsheet with 25 categories, tracking every penny with military precision. Within two weeks, they're 
          exhausted and abandon the whole project.
        </p>
        <p>
          Instead, start with one problem area. If you know you overspend on food, focus exclusively on that category 
          for the first month. Set a reasonable goal—maybe reduce restaurant spending from $400 to $300—and track only 
          food expenses. Once you've successfully managed that category for a month, add another.
        </p>
        <p>
          This incremental approach works because it builds competence and confidence. Each small win makes you more 
          capable of handling the next challenge. After three months of successfully managing three categories, adding 
          a fourth feels natural, not overwhelming.
        </p>
        <p>
          Think of budgeting like going to the gym. You wouldn't attempt to deadlift 300 pounds on your first day. 
          You'd start with lighter weights, master the form, and gradually increase the load. Budgeting requires the 
          same progressive approach. Start with one category, master it, and build from there.
        </p>
      </section>

      {/* Sources Section */}
      <section className="sources-section">
        <h2>📚 Sources & Further Reading</h2>
        <ul className="sources-list">
          <li>
            <a href="https://www.harpercollins.com/products/all-your-worth-elizabeth-warrenamazon-warren-tyagi" 
               target="_blank" rel="noopener noreferrer">
              Senator Elizabeth Warren, "All Your Worth: The Ultimate Lifetime Money Plan"
            </a>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/blog/how-to-make-a-budget/" 
               target="_blank" rel="noopener noreferrer">
              Consumer Financial Protection Bureau - "How to Make a Budget"
            </a>
          </li>
          <li>
            <a href="https://www.nfcc.org/" 
               target="_blank" rel="noopener noreferrer">
              National Foundation for Credit Counseling - "Budgeting Best Practices"
            </a>
          </li>
          <li>
            <a href="https://www.ynab.com/the-four-rules" 
               target="_blank" rel="noopener noreferrer">
              You Need A Budget (YNAB) - "The Four Rules of YNAB"
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default BudgetingBasics;
