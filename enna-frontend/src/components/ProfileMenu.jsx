import { useEffect, useRef } from 'react';
import './ProfileMenu.css';

function ProfileMenu({ isOpen, onClose, onHelpClick, onSettingsClick, userName, userEmoji }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="profile-menu-overlay">
      <div className="profile-menu" ref={menuRef}>
        {/* Menu Header */}
        <div className="profile-menu-header">
          <div className="profile-avatar">{userEmoji || '👤'}</div>
          <div className="profile-info">
            <div className="profile-name">{userName}</div>
            <div className="profile-subtitle">Budgeting with Enna</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="profile-menu-items">
          <button className="profile-menu-item" onClick={onHelpClick}>
            <span className="menu-item-icon">❓</span>
            <div className="menu-item-content">
              <div className="menu-item-title">Quick Start Guide</div>
              <div className="menu-item-desc">Learn how to use Enna</div>
            </div>
          </button>

          <button className="profile-menu-item" onClick={onSettingsClick}>
            <span className="menu-item-icon">⚙️</span>
            <div className="menu-item-content">
              <div className="menu-item-title">Settings</div>
              <div className="menu-item-desc">Customize your experience</div>
            </div>
          </button>
        </div>

        {/* Menu Footer */}
        <div className="profile-menu-footer">
          <div className="app-version">Enna v1.0</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileMenu;
