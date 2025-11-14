import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Tutorial from './components/Tutorial';
import Clock from './components/Clock';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [backendConnected, setBackendConnected] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isCheckingTutorial, setIsCheckingTutorial] = useState(true);
  const [streak, setStreak] = useState(0);

  // Define testBackend function FIRST
  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setBackendConnected(data.status === 'success');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendConnected(false);
    }
  };

  // Streak tracking system
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('enna_last_visit');
    const currentStreak = parseInt(localStorage.getItem('enna_streak') || '0');

    if (!lastVisit) {
      // First time user
      localStorage.setItem('enna_last_visit', today);
      localStorage.setItem('enna_streak', '1');
      setStreak(1);
      return;
    }

    const lastVisitDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastVisitDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day - keep current streak
      setStreak(currentStreak);
    } else if (diffDays === 1) {
      // Consecutive day - increment streak
      const newStreak = currentStreak + 1;
      localStorage.setItem('enna_last_visit', today);
      localStorage.setItem('enna_streak', newStreak.toString());
      setStreak(newStreak);
    } else {
      // Missed days - reset streak
      localStorage.setItem('enna_last_visit', today);
      localStorage.setItem('enna_streak', '1');
      setStreak(1);
    }
  };

  // Check if tutorial is needed
  const checkTutorialStatus = async () => {
    try {
      // ALWAYS check if there are any transactions in the database first
      const response = await fetch('http://localhost:5000/api/transactions?limit=1');
      const data = await response.json();
      
      if (data.status === 'success' && data.transactions.length === 0) {
        // Database is empty - show tutorial regardless of localStorage
        setShowTutorial(true);
        setIsCheckingTutorial(false);
        return;
      }
      
      // Database has data - skip tutorial and mark as complete
      setShowTutorial(false);
      localStorage.setItem('enna_tutorial_complete', 'true');
      setIsCheckingTutorial(false);
    } catch (error) {
      console.error('Failed to check tutorial status:', error);
      // On error, check localStorage as fallback
      const tutorialComplete = localStorage.getItem('enna_tutorial_complete');
      setShowTutorial(tutorialComplete !== 'true');
      setIsCheckingTutorial(false);
    }
  };

  // Test backend connection and check tutorial on mount
  useEffect(() => {
    testBackend();
    checkTutorialStatus();
    updateStreak();
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'budget':
        return <Budget />;
      case 'transactions':
        return <div className="view-placeholder">📊 Transactions view coming soon!</div>;
      case 'categories':
        return <div className="view-placeholder">🏷️ Categories view coming soon!</div>;
      case 'reports':
        return <div className="view-placeholder">📈 Reports view coming soon!</div>;
      case 'settings':
        return <div className="view-placeholder">⚙️ Settings view coming soon!</div>;
      default:
        return <Dashboard />;
    }
  };

  // Show loading while checking tutorial status
  if (isCheckingTutorial) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading Enna...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show tutorial for new users
  if (showTutorial) {
    return <Tutorial onComplete={handleTutorialComplete} />;
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <button 
            className="toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>

          <div className="top-bar-center">
            <Clock />
            <div className="streak-display" title="Days streak">
              <span className="streak-icon">🔥</span>
              <span className="streak-count">{streak}</span>
              <span className="streak-label">day{streak !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="top-bar-right">
            <div className={`connection-status ${backendConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              <span>{backendConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="view-content">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;
