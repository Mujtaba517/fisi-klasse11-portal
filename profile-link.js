/* Makes the sidebar profile box a link to profile.html and paints the chosen avatar (photo, icon or color). */
(function () {
  'use strict';
  var COLORS = {
    lime: ['#d8ef85', '#20342d'], sun: ['#ffd166', '#5c3b00'], coral: ['#ff8f70', '#4a1d0e'],
    sky: ['#9bd6f5', '#10435e'], lilac: ['#cdbdf2', '#32215c'], mint: ['#a7e8c4', '#0f4a2f']
  };
  window.LERNOVA_AVATARS = COLORS;

  function record() {
    try {
      var s = JSON.parse(sessionStorage.getItem('fisi-auth') || 'null');
      if (!s) return null;
      var list = JSON.parse(localStorage.getItem('fisi-users') || '[]');
      for (var i = 0; i < list.length; i++) if (list[i].username === s.username) return list[i];
    } catch (e) {}
    return null;
  }

  window.lernovaPaintAvatar = function (el, r) {
    if (!el || !r) return;
    var c = COLORS[r.avatar];
    if (c) { el.style.background = c[0]; el.style.color = c[1]; }
    if (r.photo) {
      el.textContent = '';
      el.style.backgroundImage = 'url(' + r.photo + ')';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    } else if (r.avatarIcon) {
      el.textContent = r.avatarIcon;
    }
  };

  var css = document.createElement('style');
  css.textContent = '.profile[data-pl]{cursor:pointer;border-radius:16px;transition:background .2s,transform .2s}.profile[data-pl]:hover{background:rgba(216,239,133,.16);transform:translateY(-1px)}.profile[data-pl]:focus-visible{outline:2px solid var(--primary-strong,#215c43);outline-offset:2px}';
  document.head.appendChild(css);

  function setup() {
    var p = document.querySelector('.profile');
    if (!p || p.getAttribute('data-pl')) return !!p;
    p.setAttribute('data-pl', '1');
    p.setAttribute('role', 'link');
    p.tabIndex = 0;
    p.setAttribute('aria-label', 'Profil');
    window.lernovaPaintAvatar(p.querySelector('.avatar'), record());
    p.addEventListener('click', function (e) {
      if (e.target.closest('#shellLogout')) return;
      location.href = 'profile.html';
    });
    p.addEventListener('keydown', function (e) {
      if (e.target !== p) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = 'profile.html'; }
    });
    return true;
  }

  function start() {
    if (setup()) return;
    var mo = new MutationObserver(function () { if (setup()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 8000);
  }
  start();
})();
