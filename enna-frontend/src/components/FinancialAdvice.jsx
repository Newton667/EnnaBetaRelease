import { useState } from 'react';
import BudgetingBasics from './advice/BudgetingBasics';
import SavingStrategies from './advice/SavingStrategies';
import DebtManagement from './advice/DebtManagement';
import InvestingGuide from './advice/InvestingGuide';
import EmergencyFund from './advice/EmergencyFund';
import RetirementPlanning from './advice/RetirementPlanning';
import CreditScore from './advice/CreditScore';
import TaxOptimization from './advice/TaxOptimization';
import './FinancialAdvice.css';

function FinancialAdvice() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    { 
      id: 'budgeting', 
      name: 'Budgeting Basics', 
      icon: '💰',
      description: 'Master the 50/30/20 rule and zero-based budgeting',
      component: BudgetingBasics
    },
    { 
      id: 'saving', 
      name: 'Saving Strategies', 
      icon: '🏦',
      description: 'Build wealth through systematic saving habits',
      component: SavingStrategies
    },
    { 
      id: 'debt', 
      name: 'Debt Management', 
      icon: '💳',
      description: 'Strategic approaches to becoming debt-free',
      component: DebtManagement
    },
    { 
      id: 'investing', 
      name: 'Investing 101', 
      icon: '📈',
      description: 'Build long-term wealth through smart investing',
      component: InvestingGuide
    },
    { 
      id: 'emergency', 
      name: 'Emergency Fund', 
      icon: '🆘',
      description: 'Build your financial safety net',
      component: EmergencyFund
    },
    { 
      id: 'retirement', 
      name: 'Retirement Planning', 
      icon: '🏖️',
      description: 'Secure your financial future',
      component: RetirementPlanning
    },
    { 
      id: 'credit', 
      name: 'Credit Score', 
      icon: '⭐',
      description: 'Build and protect your financial reputation',
      component: CreditScore
    },
    { 
      id: 'taxes', 
      name: 'Tax Optimization', 
      icon: '📋',
      description: 'Legally minimize your tax burden',
      component: TaxOptimization
    }
  ];

  // If a topic is selected, render its component
  if (selectedTopic) {
    const SelectedComponent = selectedTopic.component;
    return (
      <div className="financial-advice">
        <button 
          className="back-button"
          onClick={() => setSelectedTopic(null)}
        >
          ← Back to Topics
        </button>
        <SelectedComponent />
      </div>
    );
  }

  // Otherwise, show the topic selection grid
  return (
    <div className="financial-advice">
      <div className="advice-header">
        <h1>📚 Financial Advice Center</h1>
        <p className="advice-subtitle">Evidence-based strategies for building wealth and financial security</p>
      </div>

      <div className="topics-grid">
        {topics.map(topic => (
          <button
            key={topic.id}
            className="topic-card"
            onClick={() => setSelectedTopic(topic)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <h3 className="topic-name">{topic.name}</h3>
            <p className="topic-description">{topic.description}</p>
            <div className="topic-arrow">→</div>
          </button>
        ))}
      </div>

      <div className="disclaimer-section">
        <h3>📖 About This Resource</h3>
        <p>
          All information provided is for educational purposes only and should not be considered 
          professional financial advice. Always consult with a qualified financial advisor, tax 
          professional, or certified financial planner before making major financial decisions. 
          Individual circumstances vary significantly.
        </p>
      </div>
    </div>
  );
}

export default FinancialAdvice;
