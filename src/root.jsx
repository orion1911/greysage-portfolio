import React, { use, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, themeStyles } from './components/theme-provider';
import { Navbar } from './components/navbar/navbar';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';
import Home from './features/home';
// import Sphere3D from './features/sphere3D';

const Root = () => {
  const { state } = useNavigate();
  return (
    <>
    {/* <Sphere3D /> */}
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
  // LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE_KEY);

  // const [variant, setVariant] = React.useState('purple');
  // const [darkMode, setDarkMode] = React.useState(false);

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [theme, setTheme] = useState('light');
  // const theme = session.get('theme') || 'dark';
  // const theme = 'light';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = themeStyles;
    document.head.appendChild(styleElement);

    // const canvasElement = document.createElement('canvas');
    // canvasElement.id = 'scene';
    // document.body.appendChild(canvasElement);

    // const script = document.createElement('script');
    // script.src = './sphere3d.js';
    // script.async = true;
    // document.html.appendChild(script);

    return () => {
      document.head.removeChild(styleElement);
      // document.body.removeChild(canvasElement);
      // document.html.removeChild(script);
    };
  }, []);


  return (
    <>
      <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
        <BrowserRouter>
          <Routes>
              <Route element={<Root />}>
                <Route path="/" index element={<Home />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;