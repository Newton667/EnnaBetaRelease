import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle, currentView, onViewChange }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'budget', icon: '💵', label: 'Budget' },
    { id: 'transactions', icon: '💸', label: 'Transactions' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'streaks', icon: '🔥', label: 'Streaks' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

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
        <button className="nav-item" title="Help">
          <span className="nav-icon">❓</span>
          {isOpen && <span className="nav-label">Help</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
