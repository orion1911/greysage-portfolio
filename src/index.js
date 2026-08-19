import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './root';
// import reportWebVitals from './reportWebVitals';

// Set before the first render — a layout effect runs too late to stop the
// browser painting at the previously restored scroll offset on reload.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
