import React, { Suspense, lazy, use, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider, themeStyles } from './components/theme-provider';
import { Navbar } from './components/navbar/navbar';
import { useScrollRestore } from './hooks';
import { useHydrated } from './hooks/useHydrated';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';
import { Contact } from './features/contact';
import { Connect } from './features/connect';
const Home = lazy(() => import('./features/home'));
const Sphere3D = lazy(() => import('./features/sphere3D'));

const Root = () => {
  const { state } = useNavigate();
  const { pathname } = useLocation();
  const isHydrated = useHydrated();
  const [pastHero, setPastHero] = useState(false);
  useScrollRestore();

  // The sphere is the hero on the home page, but once you scroll past it the
  // full-strength blob sits behind body copy and makes it hard to read. Fade it
  // back at that point, so it reads as "3D at the top only" while still being a
  // single never-torn-down instance.
  useEffect(() => {
    if (pathname !== '/') {
      setPastHero(false);
      return undefined;
    }

    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <>
      <Navbar />
      {/* One sphere for the whole app. Mounting it per route meant every
          navigation tore down a WebGL context and built a new one, and while the
          outgoing page was still animating out both existed at once — which is
          what threw "Argument 1 ('shader') ... must be an instance of
          WebGLShader". Mounted here it is created once and never destroyed. */}
      {isHydrated && (
        <div
          className={styles.sphere}
          data-dim={pathname !== '/' || pastHero}
          data-past-hero={pathname === '/' && pastHero}
          aria-hidden
        >
          <Suspense fallback={null}>
            <Sphere3D />
          </Suspense>
        </div>
      )}
      <main
        id="main-content"
        key={pathname}
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