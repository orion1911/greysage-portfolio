import React, { lazy, use, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, themeStyles } from './components/theme-provider';
import { Navbar } from './components/navbar/navbar';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';
import { Contact } from './features/contact';
import { Connect } from './features/connect';
const Home = lazy(() => import('./features/home'));

const Root = () => {
  const { state } = useNavigate();
  return (
    <>
    <Navbar />
    <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
      <Outlet />
    </main>
    </>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = themeStyles;
    document.head.appendChild(styleElement);
    setIsReady(true); // Set ready after styles are applied

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!isReady) {
    return null; // Or a loading spinner
  }


  return (
    <>
      <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
        <BrowserRouter>
          <Routes>
              <Route element={<Root />}>
                <Route path="/" index element={<Home />} />
                <Route path="/contact" index element={<Contact />} />
                <Route path="/connect" index element={<Connect />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;