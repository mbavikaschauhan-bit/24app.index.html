// === INIT.JS ===
// Central startup coordinator for modular architecture
(function() {
  'use strict';

  // Fire only once when all modules are loaded
  function initializeApp() {
    try {
      if (!window.datastore || !window.main || !window.ui || !window.auth) {
        console.warn('init.js: modules not fully ready yet');
        return;
      }

      console.log('init.js: all modules ready, initializing app…');

      // Safely trigger dashboard load if user is logged in
      if (window.appState?.user) {
        window.main.loadDashboardData().then(data => {
          window.ui.renderDashboardUI(data);
          console.log('init.js: dashboard rendered');
        });
      }

      // Hook re-render on auth change
      if (window.auth?.onAuthStateChanged) {
        window.auth.onAuthStateChanged(user => {
          if (user) {
            window.main.loadDashboardData().then(data => window.ui.renderDashboardUI(data));
          }
        });
      }

      window.appReady = true;
      console.log('✅ App initialization complete');
    } catch (err) {
      console.error('init.js error:', err);
    }
  }

  // Wait until DOM and scripts are ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeApp, 100);
  } else {
    document.addEventListener('DOMContentLoaded', initializeApp);
  }
})();
