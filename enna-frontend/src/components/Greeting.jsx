import { useState, useEffect } from 'react';
import './Greeting.css';

function Greeting() {
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchUserName();
    updateGreeting();
    
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/name');
      const data = await response.json();
      if (data.status === 'success') {
        setUserName(data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
      setUserName('Friend');
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good night');
    }
  };

  return (
    <div className="greeting-container">
      <h1 className="greeting-text">
        {greeting}, <span className="user-name">{userName}</span>! 👋
      </h1>
      <p className="greeting-subtitle">Here's your financial overview</p>
    </div>
  );
}

export default Greeting;
