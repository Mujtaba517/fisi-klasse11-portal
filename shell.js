/* Shared chrome: mobile navigation, list search, home search, session line. */
(function () {
  var searchCopy = {
    fa: { topics: 'جستجو در موضوعات', empty: 'موردی پیدا نشد.' },
    de: { topics: 'Themen suchen', empty: 'Keine Treffer.' },
    en: { topics: 'Search topics', empty: 'No matches.' }
  };

  function lang() {
    return document.documentElement.lang || localStorage.getItem('fisi-lang') || 'de';
  }

  function copy() {
    return searchCopy[lang()] || searchCopy.de;
  }

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  function attachListSearch(list) {
    if (!list || list.dataset.searchReady) return;
    list.dataset.searchReady = '1';
    var label = document.createElement('label');
    label.className = 'search';
    label.innerHTML = '<span class="sr-only"></span><input type="search" class="list-search" autocomplete="off">';
    list.parentNode.insertBefore(label, list);
    var input = label.querySelector('input');
    var sr = label.querySelector('.sr-only');
    var empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.hidden = true;
    list.after(empty);

    function applyCopy() {
      var t = copy();
      input.placeholder = t.topics;
      sr.textContent = t.topics;
      input.setAttribute('aria-label', t.topics);
    }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      var items = list.querySelectorAll('.topic-item, .ex-pick');
      items.forEach(function (el) {
        var show = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        el.hidden = !show;
        if (show) visible += 1;
      });
      empty.textContent = copy().empty;
      empty.hidden = !(q && items.length && visible === 0);
    }

    applyCopy();
    input.addEventListener('input', apply);
    new MutationObserver(function () { apply(); }).observe(list, { childList: true });
    document.addEventListener('fisi-lang', function () { applyCopy(); apply(); });
  }

  function initHomeSearch() {
    var input = document.getElementById('portalSearch');
    if (!input) return;
    var empty = document.getElementById('portalEmpty');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var any = false;
      document.querySelectorAll('[data-search-group]').forEach(function (group) {
        var n = 0;
        group.querySelectorAll('[data-search-item]').forEach(function (item) {
          var show = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.hidden = !show;
          if (show) n += 1;
        });
        group.hidden = q.length > 0 && n === 0;
        if (n) any = true;
      });
      if (empty) empty.hidden = !q || any;
    });
  }

  function initSession() {
    var nameEl = document.getElementById('sessionName');
    var line = document.getElementById('sessionLine');
    if (!nameEl || !line) return;
    try {
      var raw = sessionStorage.getItem('fisi-auth');
      if (!raw) return;
      var user = JSON.parse(raw);
      var name = (user.name || user.username || '').trim();
      if (!name) return;
      nameEl.textContent = name;
      line.hidden = false;
    } catch (e) {}
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function currentUser() {
    try { return JSON.parse(sessionStorage.getItem('fisi-auth') || 'null'); }
    catch (e) { return null; }
  }

  function pageFile() {
    return (location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
  }

  function sectionFor(file) {
    if (file === 'index.html') return 'dashboard';
    if (file === 'quiz.html' || file === 'flashcards.html' || file === 'explainers.html') return 'aufgaben';
    if (file === 'calendar.html') return 'calendar';
    if (file === 'progress.html') return 'stats';
    if (file === 'settings.html') return 'settings';
    if (file === 'admin.html') return 'users';
    return 'courses';
  }

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '·';
    return parts.slice(0, 2).map(function (part) { return part.charAt(0); }).join('').toUpperCase();
  }

  function icon(name) {
    var paths = {
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      task: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><path d="m9 14 2 2 4-4"/>',
      chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
      cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
      out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
      crown: '<path d="M5 16 3 6l5.5 3L12 4l3.5 5L21 6l-2 10H5z"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || '') + '</svg>';
  }

  function navItem(href, key, section, current, ic) {
    var active = section === current ? ' is-active' : '';
    var currentAttr = section === current ? ' aria-current="page"' : '';
    return '<a class="nav-item' + active + '" href="' + href + '"' + currentAttr + '>' + icon(ic) + '<span data-i18n="' + key + '">' + key + '</span></a>';
  }

  function mountShell() {
    var main = document.getElementById('main');
    if (!main || document.body.classList.contains('has-shell')) return;
    var file = pageFile();
    var section = sectionFor(file);
    var user = currentUser() || {};
    var name = (user.name || user.username || '').trim();
    var roleKey = user.role === 'admin' ? 'roleAdmin' : user.role === 'teacher' ? 'roleTeacher' : user.role === 'guest' ? 'roleGuest' : user.role === 'student' ? 'roleStudent' : 'roleSignedIn';
    var users = (user.role === 'admin' || user.role === 'teacher') ? navItem('settings.html#card-users', 'navUsers', 'users', section, 'user') : '';
    var appLink = user.role === 'admin' ? navItem('settings.html#card-app', 'navApp', 'app', section, 'box') : '';
    var sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.setAttribute('aria-label', 'Lernova');
    sidebar.innerHTML = ''
      + '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path d="M4 13.2 16 7l12 6.2-12 6.3L4 13.2Z" fill="#1a5fd6"/><path d="M8.2 15.4v5.1c0 .4.3 1.2 1.4 2 1.2.8 3.4 1.7 6.4 1.7s5.2-.9 6.4-1.7c1.1-.8 1.4-1.6 1.4-2v-5.1" fill="none" stroke="#1a5fd6" stroke-width="1.8" stroke-linecap="round"/><path d="M26.4 14.6V21" fill="none" stroke="#1a5fd6" stroke-width="1.8" stroke-linecap="round"/></svg></span>'
      + '<span class="brand-text"><span class="brand-name">Lernova</span><span class="brand-tagline" data-i18n="tagline">Lernen. Weiter. Du.</span></span></a>'
      + '<nav class="sidenav">'
      + navItem('index.html', 'navDashboard', 'dashboard', section, 'home')
      + navItem('index.html#subjects', 'navCourses', 'courses', section, 'book')
      + navItem('quiz.html', 'navTasks', 'aufgaben', section, 'task')
      + navItem('calendar.html', 'navCalendar', 'calendar', section, 'cal')
      + navItem('progress.html', 'navStats', 'stats', section, 'chart')
      + '<div class="nav-divider" role="separator"></div>'
      + users
      + appLink
      + navItem('settings.html', 'navSettings', 'settings', section, 'gear')
      + '</nav>'
      + '<aside class="promo"><span class="promo-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 16 3 6l5.5 3L12 4l3.5 5L21 6l-2 10H5zm0 0h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2z" fill="#7c3aed"/></svg></span>'
      + '<span class="promo-title" data-i18n="promoTitle">Wissen schafft Möglichkeiten.</span>'
      + '<span class="promo-body" data-i18n="promoBody">Heute lernen.<br>Morgen mehr erreichen.</span></aside>'
      + '<div class="profile"><span class="avatar" aria-hidden="true">' + esc(initials(name)) + '</span>'
      + '<span class="profile-meta"><span class="profile-name">' + esc(name || 'Lernova') + '</span>'
      + '<span class="profile-role" data-i18n="' + roleKey + '">' + roleKey + '</span></span>'
      + '<button type="button" class="icon-btn" id="shellLogout" data-i18n-aria="logoutLabel" aria-label="Abmelden">' + icon('out') + '</button></div>';
    var wrap = document.createElement('div');
    wrap.className = 'panel-wrap';
    var app = document.createElement('div');
    app.className = 'app';
    main.parentNode.insertBefore(app, main);
    app.appendChild(sidebar);
    app.appendChild(wrap);
    wrap.appendChild(main);
    main.classList.add('panel');
    var oldTitle = document.querySelector('.page-head h1, .studio-hero h1, h1');
    var header = document.createElement('header');
    header.className = 'page-header';
    var titleKey = section === 'dashboard' ? 'navDashboard' : section === 'aufgaben' ? 'navTasks' : section === 'stats' ? 'navStats' : section === 'settings' ? 'navSettings' : section === 'users' ? 'navUsers' : '';
    var subKey = section === 'dashboard' ? 'homeLead' : section === 'aufgaben' ? 'tasksLead' : section === 'stats' ? 'statsLead' : section === 'settings' ? 'settingsPageLead' : section === 'users' ? 'usersLead' : 'coursesLead';
    var titleHtml = titleKey
      ? '<h1 data-i18n="' + titleKey + '">' + titleKey + '</h1>'
      : '<h1>' + esc(oldTitle ? oldTitle.textContent.trim() : document.title) + '</h1>';
    header.innerHTML = ''
      + '<button type="button" class="icon-btn shell-menu" aria-expanded="false" aria-controls="sidebar"><span class="sr-only" data-i18n="navMenu">Menü</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>'
      + '<div class="page-heading">' + titleHtml + '<p class="subtitle" data-i18n="' + subKey + '"></p></div>'
      + '<div class="header-tools"><label class="search search-global">' + icon('search')
      + '<input type="search" id="shellSearch" data-i18n-placeholder="shellSearch" autocomplete="off"></label>'
      + '<button type="button" class="icon-btn bell-btn" id="bellBtn" aria-expanded="false" aria-controls="notifPanel" data-i18n-aria="bellLabel">' + icon('bell') + '</button>'
      + '<div class="notif-panel" id="notifPanel" hidden role="region"><p data-i18n="bellEmpty"></p></div></div>';
    main.insertBefore(header, main.firstChild);
    document.querySelectorAll('.page-head').forEach(function (head) {
      header.after(head);
    });
    if (oldTitle && oldTitle !== header.querySelector('h1')) oldTitle.hidden = true;
    var oldLede = main.querySelector('.studio-hero .lede');
    if (oldLede) oldLede.hidden = true;
    var foot = document.createElement('p');
    foot.className = 'app-footer';
    foot.setAttribute('data-i18n', 'footer');
    wrap.appendChild(foot);
    document.body.classList.add('has-shell');
    var menu = header.querySelector('.shell-menu');
    var logout = document.getElementById('shellLogout');
    var bell = document.getElementById('bellBtn');
    var panel = document.getElementById('notifPanel');
    var search = document.getElementById('shellSearch');
    menu.addEventListener('click', function () {
      var open = !sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        sidebar.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
    if (logout) logout.addEventListener('click', function () {
      sessionStorage.removeItem('fisi-auth');
      location.href = 'login.html';
    });
    if (bell) bell.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      bell.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (search) search.addEventListener('input', function () {
      var home = document.getElementById('portalSearch');
      if (home) {
        home.value = search.value;
        home.dispatchEvent(new Event('input'));
      }
      var q = search.value.trim().toLowerCase();
      main.querySelectorAll('.card-link, .path-step, .topic-item, .ex-pick').forEach(function (item) {
        item.hidden = !!(q && item.textContent.toLowerCase().indexOf(q) === -1);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        sidebar.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      }
    });
    if (file === 'settings.html') {
      document.body.classList.add('page-settings');
      if (search) search.setAttribute('data-i18n-placeholder', 'settingsSearch');
    }
    if (typeof setLang === 'function') setLang(lang());
    var feat = document.createElement('script');
    feat.src = 'portal-features.js';
    document.body.appendChild(feat);
  }

  document.addEventListener('DOMContentLoaded', function () {
    mountShell();
    initNav();
    initHomeSearch();
    initSession();
    document.querySelectorAll('#topicList, #exList').forEach(attachListSearch);
  });
})();
