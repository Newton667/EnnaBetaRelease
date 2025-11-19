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

  useEffect(() => {
    fetchUserName();
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
    </div>
  );
}

export default Settings;
