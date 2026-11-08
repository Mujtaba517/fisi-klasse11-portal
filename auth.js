// Auth check — include this in all protected pages
(function() {
  // Skip check on login page
  if (window.location.pathname.endsWith('login.html')) return;

  const auth = sessionStorage.getItem('fisi-auth');
  if (!auth) {
    window.location.href = 'login.html';
    return;
  }

  // Optional: show logout button
  document.addEventListener('DOMContentLoaded', function() {
    const topActions = document.querySelector('.top-actions');
    if (topActions && !document.getElementById('logoutBtn')) {
      const btn = document.createElement('button');
      btn.id = 'logoutBtn';
      btn.className = 'theme-toggle';
      btn.textContent = 'Abmelden';
      btn.onclick = function() {
        sessionStorage.removeItem('fisi-auth');
        window.location.href = 'login.html';
      };
      topActions.insertBefore(btn, topActions.firstChild);
    }
  });
})();