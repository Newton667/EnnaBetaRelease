import React, { useState, useEffect } from 'react';
import './Streaks.css';

const Streaks = () => {
  const [streakData, setStreakData] = useState({
    current_streak: 0,
    longest_streak: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [activeDays, setActiveDays] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch streak data
      const streakRes = await fetch('http://localhost:5000/api/streaks');
      const streakData = await streakRes.json();
      if (streakData.status === 'success') {
        setStreakData(streakData.streaks);
      }

      // Fetch all transactions to build calendar
      const transRes = await fetch('http://localhost:5000/api/transactions?limit=1000');
      const transData = await transRes.json();
      if (transData.status === 'success') {
        setTransactions(transData.transactions);
        
        // Build set of active days
        const days = new Set();
        transData.transactions.forEach(t => {
          const date = t.date.split('T')[0];
          days.add(date);
        });
        setActiveDays(days);
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isActiveDay = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activeDays.has(dateStr);
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const active = isActiveDay(year, month, day);
      const today = isToday(year, month, day);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${active ? 'active' : ''} ${today ? 'today' : ''}`}
          title={active ? `${day} - Active day` : `${day} - No activity`}
        >
          <span className="day-number">{day}</span>
          {active && <span className="activity-dot">🔥</span>}
        </div>
      );
    }
    
    return days;
  };

  const getMonthStats = () => {
    const { year, month } = getDaysInMonth(currentMonth);
    let activeDaysInMonth = 0;
    
    for (let day = 1; day <= getDaysInMonth(currentMonth).daysInMonth; day++) {
      if (isActiveDay(year, month, day)) {
        activeDaysInMonth++;
      }
    }
    
    return activeDaysInMonth;
  };

  const getTotalActiveDays = () => {
    return activeDays.size;
  };

  const getThisMonthTransactions = () => {
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === now.getMonth() && 
             transDate.getFullYear() === now.getFullYear();
    });
    return thisMonth.length;
  };

  if (isLoading) {
    return <div className="loading">Loading streak data...</div>;
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="streaks-page">
      <div className="streaks-header">
        <h1>🔥 Streak Tracker</h1>
        <p className="streaks-subtitle">
          Keep the fire burning! Log transactions daily to build your streak.
        </p>
      </div>

      {/* Streak Stats */}
      <div className="streak-stats-grid">
        <div className="streak-stat-card current">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-label">Current Streak</span>
            <span className="stat-value">{streakData.current_streak}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        <div className="streak-stat-card longest">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <span className="stat-label">Longest Streak</span>
            <span className="stat-value">{streakData.longest_streak}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        <div className="streak-stat-card total">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-label">Total Active Days</span>
            <span className="stat-value">{getTotalActiveDays()}</span>
            <span className="stat-unit">days</span>
          </div>
        </div>

        <div className="streak-stat-card month">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">This Month</span>
            <span className="stat-value">{getThisMonthTransactions()}</span>
            <span className="stat-unit">transactions</span>
          </div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="streak-info">
        <h3>How Streaks Work</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">✅</span>
            <div className="info-text">
              <strong>Keep Your Streak:</strong> Log at least one transaction today or yesterday
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">❌</span>
            <div className="info-text">
              <strong>Break Your Streak:</strong> Miss a day with no transactions
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🏆</span>
            <div className="info-text">
              <strong>Longest Streak:</strong> Your personal record is saved forever
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🔥</span>
            <div className="info-text">
              <strong>Active Days:</strong> Days with 🔥 mean you logged transactions
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="calendar-section">
        <div className="calendar-header">
          <button 
            className="month-nav-btn"
            onClick={() => changeMonth(-1)}
          >
            ◀ Previous
          </button>
          <h2>{monthName}</h2>
          <button 
            className="month-nav-btn"
            onClick={() => changeMonth(1)}
          >
            Next ▶
          </button>
        </div>

        <div className="calendar-stats">
          <span className="calendar-stat">
            <strong>{getMonthStats()}</strong> active days this month
          </span>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-box today"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-box active"></div>
            <span>Active Day</span>
          </div>
          <div className="legend-item">
            <div className="legend-box inactive"></div>
            <span>Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Streaks);
