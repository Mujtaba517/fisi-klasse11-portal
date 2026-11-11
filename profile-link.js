/* Makes the sidebar profile box a link to profile.html, paints the chosen avatar (photo, icon or color) and shows the level medal in the sidebar box. */
(function () {
  'use strict';
  var COLORS = {
    lime: ['#d8ef85', '#20342d'], sun: ['#ffd166', '#5c3b00'], coral: ['#ff8f70', '#4a1d0e'],
    sky: ['#9bd6f5', '#10435e'], lilac: ['#cdbdf2', '#32215c'], mint: ['#a7e8c4', '#0f4a2f']
  };
  var LEVELS = [
    { min: 0, ic: '\ud83c\udf31', de: 'Neuling', en: 'Newcomer', fa: '\u062a\u0627\u0632\u0647\u200c\u06a9\u0627\u0631' },
    { min: 3, ic: '\ud83e\udded', de: 'Entdecker', en: 'Explorer', fa: '\u06a9\u0627\u0634\u0641' },
    { min: 8, ic: '\ud83d\udcd8', de: 'Lernprofi', en: 'Learner', fa: '\u06cc\u0627\u062f\u06af\u06cc\u0631\u0646\u062f\u0647' },
    { min: 15, ic: '\ud83e\udd49', de: 'Bronze', en: 'Bronze', fa: '\u0628\u0631\u0646\u0632' },
    { min: 25, ic: '\ud83e\udd48', de: 'Silber', en: 'Silver', fa: '\u0646\u0642\u0631\u0647' },
    { min: 40, ic: '\ud83e\udd47', de: 'Gold', en: 'Gold', fa: '\u0637\u0644\u0627' },
    { min: 60, ic: '\ud83d\udc8e', de: 'Diamant', en: 'Diamond', fa: '\u0627\u0644\u0645\u0627\u0633' },
    { min: 90, ic: '\ud83d\udc51', de: 'Meister', en: 'Master', fa: '\u0627\u0633\u062a\u0627\u062f' }
  ];
  window.LERNOVA_AVATARS = COLORS;
  window.LERNOVA_LEVELS = LEVELS;

  function record() {
    try { return JSON.parse(sessionStorage.getItem('lernova-profile') || 'null'); } catch (e) { return null; }
  }

  function doneCount() {
    var done = 0;
    try {
      var all = typeof readActivity === 'function' ? readActivity() : {};
      Object.keys(all || {}).forEach(function (page) {
        Object.keys(all[page] || {}).forEach(function (id) {
          if (all[page][id] && all[page][id].checked) done += 1;
        });
      });
    } catch (e) {}
    return done;
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

  function paintBadge() {
    var box = document.querySelector('.sidebar .promo-icon');
    if (!box) return;
    var done = doneCount(), idx = 0;
    for (var k = 0; k < LEVELS.length; k++) if (done >= LEVELS[k].min) idx = k;
    var lang = document.documentElement.lang;
    var name = LEVELS[idx][LEVELS[idx][lang] ? lang : 'de'];
    box.innerHTML = '<span aria-hidden="true" style="font-size:1.15rem;line-height:1">' + LEVELS[idx].ic + '</span><b style="font-size:.72rem;margin-inline-start:.35rem;white-space:nowrap">Lv ' + (idx + 1) + '</b>';
    box.style.cssText += ';width:auto;min-width:2rem;padding-inline:.55rem;display:inline-flex;align-items:center;justify-content:center;color:#3b2f10';
    box.title = 'Level ' + (idx + 1) + ' \u00b7 ' + name;
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', box.title);
  }

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
    paintBadge();
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

  document.addEventListener('fisi-lang', paintBadge);

  function start() {
    if (setup()) return;
    var mo = new MutationObserver(function () { if (setup()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 8000);
  }
  start();
})();
