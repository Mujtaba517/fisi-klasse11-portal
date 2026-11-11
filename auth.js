// Auth check: include this in all protected pages.
// Signed-in state lives in sessionStorage ('fisi-auth'). If only the saved Supabase session exists
// (new tab, phone), the session is restored first and the page reloads.
(function() {
  if (window.location.pathname.endsWith('login.html')) return;

  const auth = sessionStorage.getItem('fisi-auth');
  if (!auth) {
    const saved = localStorage.getItem('lernova-sb-session');
    if (saved && window.LernovaSB) {
      document.documentElement.style.visibility = 'hidden';
      window.LernovaSB.restore().then(function(ok) {
        if (ok && sessionStorage.getItem('fisi-auth')) window.location.reload();
        else window.location.href = 'login.html';
      });
    } else {
      window.location.href = 'login.html';
    }
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const topActions = document.querySelector('.top-actions');
    if (topActions && !document.getElementById('logoutBtn')) {
      const btn = document.createElement('button');
      btn.id = 'logoutBtn';
      btn.className = 'theme-toggle';
      btn.textContent = 'Abmelden';
      btn.onclick = function() {
        if (window.LernovaSB) window.LernovaSB.signOutLocal();
        sessionStorage.removeItem('fisi-auth');
        window.location.href = 'login.html';
      };
      topActions.insertBefore(btn, topActions.firstChild);
    }
  });
})();
