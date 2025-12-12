import React, { useState, useEffect } from 'react';
import './Greeting.css';

const Greeting = () => {
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Check if username is cached
    const cachedName = sessionStorage.getItem('userName');
    
    if (cachedName) {
      // Use cached name immediately
      setUserName(cachedName);
    } else {
      // Fetch from API if not cached
      fetchUserName();
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/name');
      const data = await response.json();
      
      if (data.status === 'success' && data.name) {
        setUserName(data.name);
        // Cache the username in sessionStorage
        sessionStorage.setItem('userName', data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
  };

  return (
    <div className="greeting-container">
      <h1 className="greeting-text">
        {greeting}{userName && <span className="greeting-name">, {userName}</span>}! <span className="greeting-wave">👋</span>
      </h1>
      <p className="greeting-subtitle">Let's make today financially awesome!</p>
    </div>
  );
};

export default Greeting;
