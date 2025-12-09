import './Help.css';

function Help() {
  const quickStartSteps = [
    {
      icon: '💸',
      title: 'Track Transactions',
      description: 'Add your income and expenses manually or import them from your bank CSV files.',
      tips: ['Use the Import CSV feature to bulk add transactions', 'Edit transactions anytime by clicking the edit button']
    },
    {
      icon: '💵',
      title: 'Set Up Your Budget',
      description: 'Allocate your income across different spending categories using percentage sliders.',
      tips: ['Make sure your percentages add up to 100%', 'Adjust your budget as your spending habits change']
    },
    {
      icon: '📊',
      title: 'Monitor Your Health',
      description: 'Your Financial Health Score (0-100) tracks your spending, savings, budget adherence, and debt.',
      tips: ['Aim for a score above 70', 'Check the Dashboard to see what affects your score']
    },
    {
      icon: '📦',
      title: 'Archive Monthly Data',
      description: 'Save monthly financial snapshots to track your progress over time.',
      tips: ['Archive at the end of each month', 'View trends in the Archives page']
    },
    {
      icon: '🔥',
      title: 'Build Your Streak',
      description: 'Log in daily to build your streak and stay consistent with budget tracking.',
      tips: ['Your streak shows in the top bar', 'Consistency helps you stay on track']
    }
  ];

  const features = [
    { icon: '📈', name: 'Reports', desc: 'Visualize spending patterns with charts' },
    { icon: '✏️', name: 'Edit Transactions', desc: 'Modify any transaction details' },
    { icon: '📁', name: 'Categories', desc: 'Organize spending by custom categories' },
    { icon: '🧮', name: 'Calculator', desc: 'Quick math without leaving the app' },
  ];

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <h1>📚 Quick Start Guide</h1>
        <p className="help-subtitle">Everything you need to know to get started with Enna</p>
      </div>

      {/* Quick Start Steps */}
      <div className="help-section">
        <h2 className="section-title">Getting Started</h2>
        <div className="steps-grid">
          {quickStartSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-header">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">Step {index + 1}</div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-tips">
                <div className="tips-label">💡 Tips:</div>
                <ul>
                  {step.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="help-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <div className="feature-name">{feature.name}</div>
                <div className="feature-desc">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="help-section">
        <h2 className="section-title">Navigation</h2>
        <div className="shortcuts-box">
          <div className="shortcut-item">
            <span className="shortcut-label">Sidebar Menu:</span>
            <span className="shortcut-desc">Access all main features from the left sidebar</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-label">Profile Menu:</span>
            <span className="shortcut-desc">Click your name (bottom of sidebar) for settings and help</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-label">Calculator:</span>
            <span className="shortcut-desc">Toggle with the calculator icon in the top bar</span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="help-section">
        <h2 className="section-title">Pro Tips</h2>
        <div className="tips-box">
          <div className="tip-item">
            <span className="tip-icon">⚡</span>
            <span className="tip-text">Import multiple months of transactions at once using CSV files</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <span className="tip-text">Set realistic budget percentages based on your actual spending</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📊</span>
            <span className="tip-text">Check Reports regularly to spot spending patterns</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">💾</span>
            <span className="tip-text">Archive your data monthly to keep things organized</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔥</span>
            <span className="tip-text">Maintain your streak by checking in daily</span>
          </div>
        </div>
      </div>

      {/* Need More Help */}
      <div className="help-footer">
        <div className="footer-card">
          <h3>Need More Help?</h3>
          <p>Enna is designed to be intuitive, but if you have questions, explore each section to discover all the features!</p>
          <div className="footer-mascot">
            <img src="/Logo.png" alt="Enna" className="mascot-image" />
            <div className="mascot-message">
              <div className="mascot-name">Enna says:</div>
              <div className="mascot-text">"You've got this! Start by adding a few transactions and watch your financial health improve! 💚"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
