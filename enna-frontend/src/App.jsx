import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Streaks from './components/Streaks';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Tutorial from './components/Tutorial';
import Reports from './components/Reports';
import Archives from './components/Archives';
import Clock from './components/Clock';
import Calculator from './components/Calculator';
import ProfileMenu from './components/ProfileMenu';
import Help from './components/Help';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [backendConnected, setBackendConnected] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isCheckingTutorial, setIsCheckingTutorial] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [userName, setUserName] = useState('Friend');
  const [userEmoji, setUserEmoji] = useState('👤');

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

  // Fetch streak data from database
  const fetchStreaks = async () => {
    try {
      // Check if date override is active
      const override = localStorage.getItem('enna_datetime_override') === 'true';
      let queryParams = '';
      
      if (override) {
        const overrideDate = localStorage.getItem('enna_override_date');
        if (overrideDate) {
          queryParams = `?login_date=${overrideDate}&current_date=${overrideDate}`;
        }
      }
      
      const response = await fetch(`http://localhost:5000/api/streaks${queryParams}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setCurrentStreak(data.streaks.current_streak);
        setLongestStreak(data.streaks.longest_streak);
      }
    } catch (error) {
      console.error('Failed to fetch streaks:', error);
      setCurrentStreak(0);
      setLongestStreak(0);
    }
  };

  // Fetch user name and emoji
  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/name');
      const data = await response.json();
      if (data.status === 'success' && data.name) {
        setUserName(data.name);
      }

      const emojiResponse = await fetch('http://localhost:5000/api/user/emoji');
      const emojiData = await emojiResponse.json();
      if (emojiData.status === 'success' && emojiData.emoji) {
        setUserEmoji(emojiData.emoji);
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
  };

  // Profile menu handlers
  const handleProfileMenuToggle = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleHelpClick = () => {
    setProfileMenuOpen(false);
    setCurrentView('help');
  };

  const handleSettingsClick = () => {
    setProfileMenuOpen(false);
    setCurrentView('settings');
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
    fetchStreaks(); // Fetch streaks from database instead of localStorage
    fetchUserName(); // Fetch user name
    
    // Refresh streaks every 30 seconds to stay updated when transactions are added
    const streakInterval = setInterval(fetchStreaks, 30000);
    
    return () => clearInterval(streakInterval);
  }, []);

  // Refresh streaks when view changes (in case transactions were added)
  useEffect(() => {
    fetchStreaks();
  }, [currentView]);

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
        return <Transactions />;
      case 'categories':
        return <div className="view-placeholder">🏷️ Categories view coming soon!</div>;
      case 'reports':
        return <Reports />;
      case 'archives':
        return <Archives />;
      case 'streaks':
        return <Streaks />;
      case 'help':
        return <Help />;
      case 'settings':
        return <Settings />;
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
        onProfileMenuClick={handleProfileMenuToggle}
      />

      {/* Profile Menu */}
      <ProfileMenu
        isOpen={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        onHelpClick={handleHelpClick}
        onSettingsClick={handleSettingsClick}
        userName={userName}
        userEmoji={userEmoji}
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
            <div className="streak-display" title={`Current: ${currentStreak} days | Longest: ${longestStreak} days`}>
              <span className="streak-icon">🔥</span>
              <span className="streak-count">{currentStreak}</span>
              <span className="streak-label">day{currentStreak !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="top-bar-right">
            <button 
              className="toggle-calculator-btn"
              onClick={() => setCalculatorOpen(!calculatorOpen)}
              title={calculatorOpen ? 'Close calculator' : 'Open calculator'}
            >
              <img src="/Calculator.png" alt="Calculator" className="calculator-icon-img" />
            </button>
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

      {/* Right Sidebar - Calculator */}
      <Calculator 
        isOpen={calculatorOpen}
        onToggle={() => setCalculatorOpen(!calculatorOpen)}
      />
    </div>
  );
}

export default App;
