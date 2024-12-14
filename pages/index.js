// pages/index.js
import React, { useState } from 'react';
import WaterButton from '../components/WaterButton';
import Notification from '../components/Notification';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [notification, setNotification] = useState({ message: '', type: '' });

  const waterAmounts = [
    { amount: 150, color: '#FF6B6B' },
    { amount: 300, color: '#4ECDC4' },
    { amount: 350, color: '#45B7D1' },
    { amount: 450, color: '#96CEB4' }
  ];

  const handleWaterLog = async (amount) => {
    try {
      const response = await fetch('/api/log-water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error('Failed to log water intake');

      setNotification({ message: 'Water intake logged successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to log water intake', type: 'error' });
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  return (
    <div className={styles.app}>
      <h1>Water Intake Tracker</h1>
      <div className={styles.buttonContainer}>
        {waterAmounts.map((item) => (
          <WaterButton
            key={item.amount}
            amount={item.amount}
            color={item.color}
            onClick={() => handleWaterLog(item.amount)}
          />
        ))}
      </div>
      {notification.message && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
}