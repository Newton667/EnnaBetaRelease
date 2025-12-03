/**
 * Utility functions for date/time handling with developer override support
 */

/**
 * Get the current date/time, respecting developer override settings
 * @returns {Date} Current date/time (overridden or system)
 */
export const getCurrentDateTime = () => {
  const override = localStorage.getItem('enna_datetime_override') === 'true';
  
  if (override) {
    const overrideDate = localStorage.getItem('enna_override_date');
    const overrideTime = localStorage.getItem('enna_override_time');
    
    if (overrideDate && overrideTime) {
      const [year, month, day] = overrideDate.split('-');
      const [hours, minutes] = overrideTime.split(':');
      
      return new Date(
        parseInt(year),
        parseInt(month) - 1, // months are 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        0
      );
    }
  }
  
  return new Date();
};

/**
 * Get the current date string in YYYY-MM-DD format
 * @returns {string} Date string
 */
export const getCurrentDateString = () => {
  const date = getCurrentDateTime();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get the current time string in HH:MM format
 * @returns {string} Time string
 */
export const getCurrentTimeString = () => {
  const date = getCurrentDateTime();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Check if date/time override is currently enabled
 * @returns {boolean}
 */
export const isDateTimeOverrideEnabled = () => {
  return localStorage.getItem('enna_datetime_override') === 'true';
};

/**
 * Format a date object for display
 * @param {Date} date - The date to format
 * @param {boolean} showOverrideIndicator - Whether to show 🔧 icon when override is active
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date, showOverrideIndicator = true) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  if (showOverrideIndicator && isDateTimeOverrideEnabled()) {
    return `🔧 ${formattedDate}`;
  }
  
  return formattedDate;
};

/**
 * Format a date object for time display
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatDisplayTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });
};
