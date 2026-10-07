import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('Service Worker registered successfully:', registration);
    showNotification('App is ready for offline use! 🌾');
  },
  onUpdate: (registration) => {
    console.log('New version available! Please refresh.');
    showUpdatePrompt(registration);
  },
});

// Setup offline detection
serviceWorkerRegistration.setupOfflineDetection(
  () => {
    // Online callback
    hideOfflineIndicator();
    showNotification('You are back online! 🌐');
  },
  () => {
    // Offline callback
    showOfflineIndicator();
  }
);

// Show offline indicator
function showOfflineIndicator() {
  const indicator = document.getElementById('offline-indicator');
  if (indicator) {
    indicator.style.display = 'block';
  }
}

// Hide offline indicator
function hideOfflineIndicator() {
  const indicator = document.getElementById('offline-indicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
}

// Show notification
function showNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    serviceWorkerRegistration.showNotification('AgriSmart', {
      body: message,
      icon: '/logo192.png',
    });
  }
}

// Show update prompt
function showUpdatePrompt(registration) {
  const message = 'A new version is available! Click OK to update.';
  if (window.confirm(message)) {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.waiting.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }
}

// Request notification permission on first load
if ('Notification' in window && Notification.permission === 'default') {
  setTimeout(() => {
    serviceWorkerRegistration.requestNotificationPermission();
  }, 3000); // Wait 3 seconds before asking
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
