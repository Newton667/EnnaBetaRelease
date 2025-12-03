import { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const getTime = () => {
      // Check if date/time override is enabled
      const override = localStorage.getItem('enna_datetime_override') === 'true';
      
      if (override) {
        const overrideDate = localStorage.getItem('enna_override_date');
        const overrideTime = localStorage.getItem('enna_override_time');
        
        if (overrideDate && overrideTime) {
          const [year, month, day] = overrideDate.split('-');
          const [hours, minutes] = overrideTime.split(':');
          
          return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            0
          );
        }
      }
      
      return new Date();
    };

    // Update immediately
    setCurrentTime(getTime());

    // Update every second
    const clockInterval = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Add 🔧 indicator if override is active
  const isOverride = localStorage.getItem('enna_datetime_override') === 'true';
  const datePrefix = isOverride ? '🔧 ' : '';

  return (
    <div className="date-time-display">
      <span className="date-text">
        {datePrefix}{currentTime.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </span>
      <span className="time-text">
        {currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })}
      </span>
    </div>
  );
};

export default Clock;
