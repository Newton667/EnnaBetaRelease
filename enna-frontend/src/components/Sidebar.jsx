import { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle, currentView, onViewChange, onProfileMenuClick }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'budget', icon: '💵', label: 'Budget' },
    { id: 'transactions', icon: '💸', label: 'Transactions' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'archives', icon: '📦', label: 'Archives' },
    { id: 'streaks', icon: '🔥', label: 'Streaks' },
    { id: 'advice', icon: '📚', label: 'Financial Advice' },
  ];

  const [userName, setUserName] = useState('Friend');
  const [userEmoji, setUserEmoji] = useState('👤');

  useEffect(() => {
    fetchUserData();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch name
      const nameResponse = await fetch('http://localhost:5000/api/user/name');
      const nameData = await nameResponse.json();
      if (nameData.status === 'success' && nameData.name) {
        setUserName(nameData.name);
      }

      // Fetch emoji
      const emojiResponse = await fetch('http://localhost:5000/api/user/emoji');
      const emojiData = await emojiResponse.json();
      if (emojiData.status === 'success' && emojiData.emoji) {
        setUserEmoji(emojiData.emoji);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo">
            <img 
              src="/Logo.png" 
              alt="Enna Logo" 
              className="logo-image" 
            />
          {isOpen && <span className="logo-text">Enna</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={!isOpen ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="nav-item profile-btn" 
          onClick={onProfileMenuClick}
          title={!isOpen ? 'Profile Menu' : ''}
        >
          <span className="nav-icon profile-emoji">{userEmoji}</span>
          {isOpen && <span className="nav-label profile-name">{userName}</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
