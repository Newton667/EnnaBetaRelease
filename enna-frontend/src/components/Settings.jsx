import { useState, useEffect } from 'react';
import './Settings.css';

function Settings() {
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmSlider, setDeleteConfirmSlider] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Developer Settings
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [dateTimeOverride, setDateTimeOverride] = useState(false);
  const [overrideDate, setOverrideDate] = useState('');
  const [overrideTime, setOverrideTime] = useState('');
  const [devMessage, setDevMessage] = useState('');

  useEffect(() => {
    fetchUserName();
    loadDevSettings();
  }, []);

  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/name');
      const data = await response.json();
      if (data.status === 'success') {
        setUserName(data.name);
        setNewName(data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setSaveMessage('Name cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setUserName(newName.trim());
        setIsEditing(false);
        setSaveMessage('Name updated successfully! ✓');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save name:', error);
      setSaveMessage('Failed to save name');
    }
  };

  const handleCancelEdit = () => {
    setNewName(userName);
    setIsEditing(false);
    setSaveMessage('');
  };

  const handleDeleteDatabase = async () => {
    if (deleteConfirmSlider < 100) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch('http://localhost:5000/api/database/reset', {
        method: 'POST'
      });

      const data = await response.json();
      if (data.status === 'success') {
        // Clear localStorage
        localStorage.removeItem('enna_tutorial_complete');
        
        // Reload the page to restart tutorial
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to reset database:', error);
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmSlider(0);
  };

  // Developer Settings Functions
  const loadDevSettings = () => {
    const devMode = localStorage.getItem('enna_dev_mode') === 'true';
    setShowDevSettings(devMode);
    
    const override = localStorage.getItem('enna_datetime_override') === 'true';
    setDateTimeOverride(override);
    
    if (override) {
      const savedDate = localStorage.getItem('enna_override_date');
      const savedTime = localStorage.getItem('enna_override_time');
      if (savedDate) setOverrideDate(savedDate);
      if (savedTime) setOverrideTime(savedTime);
    } else {
      // Set to current date/time
      const now = new Date();
      setOverrideDate(now.toISOString().split('T')[0]);
      setOverrideTime(now.toTimeString().slice(0, 5));
    }
  };

  const handleToggleDevSettings = () => {
    const newValue = !showDevSettings;
    setShowDevSettings(newValue);
    localStorage.setItem('enna_dev_mode', newValue.toString());
    
    if (!newValue) {
      // When disabling dev settings, also disable overrides
      handleDisableDateTimeOverride();
    }
  };

  const handleToggleDateTimeOverride = () => {
    const newValue = !dateTimeOverride;
    setDateTimeOverride(newValue);
    
    if (newValue) {
      // Enable override - save current values
      const now = new Date();
      const currentDate = overrideDate || now.toISOString().split('T')[0];
      const currentTime = overrideTime || now.toTimeString().slice(0, 5);
      
      setOverrideDate(currentDate);
      setOverrideTime(currentTime);
      
      localStorage.setItem('enna_datetime_override', 'true');
      localStorage.setItem('enna_override_date', currentDate);
      localStorage.setItem('enna_override_time', currentTime);
      
      setDevMessage('Date/Time override enabled! ✓');
    } else {
      handleDisableDateTimeOverride();
    }
    
    setTimeout(() => setDevMessage(''), 3000);
  };

  const handleDisableDateTimeOverride = () => {
    setDateTimeOverride(false);
    localStorage.setItem('enna_datetime_override', 'false');
    localStorage.removeItem('enna_override_date');
    localStorage.removeItem('enna_override_time');
    setDevMessage('Date/Time override disabled - using system time ✓');
  };

  const handleSaveDateTimeOverride = () => {
    if (!overrideDate || !overrideTime) {
      setDevMessage('Please set both date and time');
      setTimeout(() => setDevMessage(''), 3000);
      return;
    }
    
    localStorage.setItem('enna_override_date', overrideDate);
    localStorage.setItem('enna_override_time', overrideTime);
    
    setDevMessage('Override date/time saved! Refresh the page to apply. ✓');
    setTimeout(() => setDevMessage(''), 3000);
  };

  const handleResetToNow = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setOverrideDate(currentDate);
    setOverrideTime(currentTime);
    
    if (dateTimeOverride) {
      localStorage.setItem('enna_override_date', currentDate);
      localStorage.setItem('enna_override_time', currentTime);
      setDevMessage('Reset to current time! Refresh to apply. ✓');
      setTimeout(() => setDevMessage(''), 3000);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p className="subtitle">Manage your account and preferences</p>
      </div>

      {/* User Profile Section */}
      <div className="settings-section">
        <div className="section-header">
          <h2>Profile</h2>
          <p>Update your personal information</p>
        </div>

        <div className="profile-card">
          <div className="profile-icon">👤</div>
          <div className="profile-info">
            <label>Display Name</label>
            {isEditing ? (
              <div className="edit-name-container">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <div className="edit-buttons">
                  <button className="btn-save" onClick={handleSaveName}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="display-name-container">
                <span className="current-name">{userName}</span>
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
              </div>
            )}
            {saveMessage && (
              <div className={`save-message ${saveMessage.includes('✓') ? 'success' : 'error'}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger-zone">
        <div className="section-header">
          <h2>⚠️ Danger Zone</h2>
          <p>Irreversible actions that will affect your data</p>
        </div>

        <div className="danger-card">
          <div className="danger-info">
            <h3>Reset All Data</h3>
            <p>This will delete all your transactions, budgets, and reset your account. This action cannot be undone.</p>
          </div>
          <button 
            className="btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑️ Delete Database
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Confirm Database Deletion</h2>
              <button className="modal-close" onClick={handleCloseDeleteModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-message">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <h3>This action is permanent!</h3>
                  <p>All of your data will be deleted including:</p>
                  <ul>
                    <li>All transactions (income & expenses)</li>
                    <li>Budget allocations</li>
                    <li>Streak data</li>
                    <li>User preferences</li>
                  </ul>
                  <p className="final-warning">This cannot be undone!</p>
                </div>
              </div>

              <div className="slider-confirmation">
                <label>
                  Slide to confirm deletion
                  <span className={`slider-percentage ${deleteConfirmSlider === 100 ? 'complete' : ''}`}>
                    {deleteConfirmSlider}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={deleteConfirmSlider}
                  onChange={(e) => setDeleteConfirmSlider(parseInt(e.target.value))}
                  className={`delete-slider ${deleteConfirmSlider === 100 ? 'complete' : ''}`}
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${deleteConfirmSlider}%, rgba(239, 68, 68, 0.2) ${deleteConfirmSlider}%, rgba(239, 68, 68, 0.2) 100%)`
                  }}
                />
                {deleteConfirmSlider === 100 && (
                  <div className="slider-ready">
                    ✓ Ready to delete
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-cancel-modal"
                  onClick={handleCloseDeleteModal}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm-delete"
                  onClick={handleDeleteDatabase}
                  disabled={deleteConfirmSlider < 100 || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Settings Toggle */}
      <div className="dev-toggle-container">
        <label className="dev-toggle-label">
          <input
            type="checkbox"
            checked={showDevSettings}
            onChange={handleToggleDevSettings}
            className="dev-checkbox"
          />
          <span className="dev-toggle-text">
            🔧 Enable Developer Settings
          </span>
        </label>
      </div>

      {/* Developer Settings Section */}
      {showDevSettings && (
        <div className="settings-section dev-settings">
          <div className="section-header">
            <h2>🔧 Developer Settings</h2>
            <p>Advanced options for testing and debugging</p>
          </div>

          {/* Date/Time Override */}
          <div className="dev-card">
            <div className="dev-card-header">
              <div className="dev-card-title">
                <h3>🕐 Date/Time Override</h3>
                <p>Override system date and time for testing streaks and time-based features</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dateTimeOverride}
                  onChange={handleToggleDateTimeOverride}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {dateTimeOverride && (
              <div className="dev-card-content">
                <div className="datetime-inputs">
                  <div className="input-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={overrideDate}
                      onChange={(e) => setOverrideDate(e.target.value)}
                      className="datetime-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={overrideTime}
                      onChange={(e) => setOverrideTime(e.target.value)}
                      className="datetime-input"
                    />
                  </div>
                </div>

                <div className="dev-actions">
                  <button 
                    className="btn-dev-action"
                    onClick={handleResetToNow}
                  >
                    🔄 Reset to Now
                  </button>
                  <button 
                    className="btn-dev-save"
                    onClick={handleSaveDateTimeOverride}
                  >
                    💾 Save Override
                  </button>
                </div>

                <div className="dev-info-box">
                  <div className="info-icon">ℹ️</div>
                  <div className="info-text">
                    <strong>How it works:</strong> When enabled, the Clock component and any time-based features will use your override date/time instead of the system time. Perfect for testing streaks without waiting for days to pass!
                    <br /><br />
                    <strong>Note:</strong> You'll need to refresh the page after saving for changes to take effect.
                  </div>
                </div>

                {devMessage && (
                  <div className={`dev-message ${devMessage.includes('✓') ? 'success' : 'error'}`}>
                    {devMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
