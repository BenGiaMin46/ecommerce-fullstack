import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../utils/Themes';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setIsDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <DarkModeContext.Provider value={{ theme, isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
