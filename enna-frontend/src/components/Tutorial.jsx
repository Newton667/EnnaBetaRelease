import { useState, useEffect } from 'react';
import './Tutorial.css';

function Tutorial({ onComplete }) {
  const [step, setStep] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [userName, setUserName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.status === 'success') {
        // Store all categories
        setAllCategories(data.categories);
        // Filter out the "Income" category for expenses
        const expenseCategories = data.categories.filter(cat => cat.name !== 'Income');
        setCategories(expenseCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Animate Enna talking when step changes
  useEffect(() => {
    // Start talking animation
    let mouthInterval;
    let talkTimeout;
    
    // Set talking to true and start mouth animation
    setIsTalking(true);
    
    // Animate mouth opening/closing
    mouthInterval = setInterval(() => {
      setIsTalking(prev => !prev);
    }, 250); // Mouth opens/closes every 250ms
    
    // Stop talking after 4 seconds
    talkTimeout = setTimeout(() => {
      clearInterval(mouthInterval);
      setIsTalking(false);
    }, 4000);

    return () => {
      clearInterval(mouthInterval);
      clearTimeout(talkTimeout);
    };
  }, [step]);

  const handleIncomeSubmit = () => {
    if (monthlyIncome && parseFloat(monthlyIncome) > 0) {
      setStep(3);
    }
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setStep(2);
    }
  };

  const handleGoBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleProceedToStreak = () => {
    setStep(4);
  };

  const handleAddExpense = () => {
    if (currentExpense.category && currentExpense.amount && parseFloat(currentExpense.amount) > 0) {
      setExpenses([...expenses, {
        category_id: parseInt(currentExpense.category),
        category_name: categories.find(c => c.id === parseInt(currentExpense.category))?.name,
        amount: parseFloat(currentExpense.amount),
        description: currentExpense.description || `Monthly ${categories.find(c => c.id === parseInt(currentExpense.category))?.name}`
      }]);
      setCurrentExpense({ category: '', amount: '', description: '' });
    }
  };

  const handleRemoveExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    try {
      // Save user name
      await fetch('http://localhost:5000/api/user/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName })
      });

      // Add income transaction
      await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'income',
          amount: parseFloat(monthlyIncome),
          description: 'Monthly Income',
          category_id: allCategories.find(c => c.name === 'Income')?.id || null
        })
      });

      // Add all expense transactions
      for (const expense of expenses) {
        await fetch('http://localhost:5000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'expense',
            amount: expense.amount,
            description: expense.description,
            category_id: expense.category_id
          })
        });
      }

      // Mark tutorial as complete
      localStorage.setItem('enna_tutorial_complete', 'true');
      onComplete();
    } catch (error) {
      console.error('Failed to save initial budget:', error);
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getRemaining = () => {
    return parseFloat(monthlyIncome || 0) - getTotalExpenses();
  };

  const messages = [
    {
      text: "Hi there! I'm Enna, your personal budgeting assistant! 💚",
      subtext: "Let's get you set up with your first budget. This will only take a minute!"
    },
    {
      text: "First, what's your name?",
      subtext: "I'd love to get to know you better!"
    },
    {
      text: `Nice to meet you, ${userName}! 😊`,
      subtext: "Now, what's your total monthly income?"
    },
    {
      text: "Great! Now let's add your monthly expenses.",
      subtext: "Add the bills and expenses you have each month. Don't worry, you can always adjust these later!"
    },
    {
      text: "One more thing - we have a streak system! 🔥",
      subtext: "Log in every day to build your streak and stay on top of your finances. The longer your streak, the better you'll get at managing your budget!"
    }
  ];

  return (
    <div className="tutorial-container">
      <div className="tutorial-content">
        {/* Enna Character */}
        <div className="enna-character">
          <img 
            src={isTalking ? "/Enna/EnnaNeutralOpen.png" : "/Enna/EnnaNeutral.png"}
            alt="Enna"
            className="enna-image"
          />
        </div>

        {/* Message Bubble */}
        <div className="enna-message">
          <h2>{messages[step].text}</h2>
          <p>{messages[step].subtext}</p>
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="tutorial-step">
            <button className="btn-primary" onClick={() => setStep(1)}>
              Let's Get Started! 🚀
            </button>
          </div>
        )}

        {/* Step 1: Name Input */}
        {step === 1 && (
          <div className="tutorial-step">
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                autoFocus
              />
            </div>
            <div className="button-row">
              <button className="btn-back" onClick={handleGoBack}>
                ← Back
              </button>
              <button 
                className="btn-primary"
                onClick={handleNameSubmit}
                disabled={!userName.trim()}
              >
                Next ➜
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Income Input */}
        {step === 2 && (
          <div className="tutorial-step">
            <div className="input-group">
              <label>Monthly Income</label>
              <div className="input-with-symbol">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount (e.g. 3000)"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleIncomeSubmit()}
                  autoFocus
                />
              </div>
            </div>
            <div className="button-row">
              <button className="btn-back" onClick={handleGoBack}>
                ← Back
              </button>
              <button 
                className="btn-primary"
                onClick={handleIncomeSubmit}
                disabled={!monthlyIncome || parseFloat(monthlyIncome) <= 0}
              >
                Next ➜
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Expenses */}
        {step === 3 && (
          <div className="tutorial-step expenses-step">
            {/* Expense Input */}
            <div className="expense-input-section">
              <div className="input-row">
                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={currentExpense.category}
                    onChange={(e) => setCurrentExpense({...currentExpense, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Monthly Amount</label>
                  <div className="input-with-symbol">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      value={currentExpense.amount}
                      onChange={(e) => setCurrentExpense({...currentExpense, amount: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Rent, Netflix, Grocery shopping..."
                  value={currentExpense.description}
                  onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
                />
              </div>

              <button 
                className="btn-add-expense"
                onClick={handleAddExpense}
                disabled={!currentExpense.category || !currentExpense.amount}
              >
                + Add Expense
              </button>
            </div>

            {/* Expense List */}
            {expenses.length > 0 && (
              <div className="expense-list">
                <h3>Your Monthly Expenses</h3>
                {expenses.map((exp, index) => (
                  <div key={index} className="expense-item">
                    <div className="expense-info">
                      <span className="expense-name">{exp.description}</span>
                      <span className="expense-category">{exp.category_name}</span>
                    </div>
                    <div className="expense-right">
                      <span className="expense-amount">${exp.amount.toFixed(2)}</span>
                      <button 
                        className="btn-remove"
                        onClick={() => handleRemoveExpense(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="budget-summary">
              <div className="summary-row">
                <span>Monthly Income:</span>
                <span className="positive">${parseFloat(monthlyIncome).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total Expenses:</span>
                <span className="negative">${getTotalExpenses().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Remaining:</span>
                <span className={getRemaining() >= 0 ? 'positive' : 'negative'}>
                  ${getRemaining().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-row">
              <button className="btn-back" onClick={handleGoBack}>
                ← Back
              </button>
              <button className="btn-primary" onClick={handleProceedToStreak}>
                Next ➜
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Streak System Explanation */}
        {step === 4 && (
          <div className="tutorial-step">
            <div className="streak-info">
              <div className="streak-visual">
                <div className="streak-icon">🔥</div>
                <div className="streak-number">0</div>
                <div className="streak-label">Day Streak</div>
              </div>
              <p className="streak-description">
                Your streak increases each day you log in. Keep it going to build healthy financial habits!
              </p>
              <div className="streak-benefits">
                <h4>Why streaks matter:</h4>
                <ul>
                  <li>📊 Regular check-ins keep you aware of your spending</li>
                  <li>💪 Build consistent financial habits</li>
                  <li>🎯 Stay motivated to reach your budget goals</li>
                  <li>✨ Track your progress over time</li>
                </ul>
              </div>
            </div>

            <div className="button-row">
              <button className="btn-back" onClick={handleGoBack}>
                ← Back
              </button>
              <button className="btn-primary" onClick={handleComplete}>
                Complete Setup ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tutorial;
