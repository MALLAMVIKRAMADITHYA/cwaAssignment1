'use client';

import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check if user has dark mode enabled
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    toggleDarkClass(isDark);
  }, []);

  const toggleDarkClass = (enable: boolean) => {
    if (enable) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    toggleDarkClass(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={handleToggle}
      style={{
        padding: '6px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#333',
      }}
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
