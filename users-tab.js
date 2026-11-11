/* Settings: adds a "Benutzer" tab (admins only) next to Design. This moves the user management from admin.html into Settings.
   Same logic as admin.html: password gate, add, delete, copy code for users.js. Nothing is saved on a server. */
(function () {
  'use strict';
  var TXT = {
    de: { tab: 'Benutzer', title: 'Benutzerverwaltung', gateSub: 'Diese Seite verwaltet die Liste in users.js. Die Anmeldung der Lernenden l\u00e4uft \u00fcber login.html.', passLabel: 'Admin-Passwort', enter: 'Zugang', wrong: 'Falsches Passwort', addTitle: 'Neuen Benutzer hinzuf\u00fcgen', addSub: 'Benutzer anlegen, l\u00f6schen und den Code f\u00fcr users.js kopieren.', uname: 'Benutzername', pass: 'Passwort', name: 'Name (optional)', add: 'Hinzuf\u00fcgen', listTitle: 'Benutzerliste', none: 'Keine Benutzer', del: 'L\u00f6schen', copy: 'Code f\u00fcr users.js kopieren', need: 'Benutzername und Passwort erforderlich', exists: 'Benutzername existiert bereits', added: 'Benutzer hinzugef\u00fcgt. Exportiere den Code, damit er in users.js bleibt.', adminDel: 'Admin kann nicht gel\u00f6scht werden', confirmDel: 'Benutzer wirklich l\u00f6schen?', copied: 'Code kopiert. F\u00fcge ihn in users.js ein.', manual: 'Code angezeigt. Kopiere ihn manuell.' },
    en: { tab: 'Users', title: 'User management', gateSub: 'This page manages the list in users.js. Learners sign in through login.html.', passLabel: 'Admin password', enter: 'Enter', wrong: 'Wrong password', addTitle: 'Add a new user', addSub: 'Create and delete users and copy the code for users.js.', uname: 'Username', pass: 'Password', name: 'Name (optional)', add: 'Add', listTitle: 'User list', none: 'No users', del: 'Delete', copy: 'Copy code for users.js', need: 'Username and password are required', exists: 'This username already exists', added: 'User added. Export the code so it stays in users.js.', adminDel: 'The admin cannot be deleted', confirmDel: 'Really delete this user?', copied: 'Code copied. Paste it into users.js.', manual: 'Code shown. Copy it by hand.' },
    fa: { tab: '\u06a9\u0627\u0631\u0628\u0631\u0627\u0646', title: '\u0645\u062f\u06cc\u0631\u06cc\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646', gateSub: '\u0627\u06cc\u0646 \u0628\u062e\u0634 \u0641\u0647\u0631\u0633\u062a \u062f\u0631 users.js \u0631\u0627 \u0645\u062f\u06cc\u0631\u06cc\u062a \u0645\u06cc\u200c\u06a9\u0646\u062f. \u0648\u0631\u0648\u062f \u0647\u0646\u0631\u062c\u0648\u06cc\u0627\u0646 \u0627\u0632 login.html \u0627\u0646\u062c\u0627\u0645 \u0645\u06cc\u200c\u0634\u0648\u062f.', passLabel: '\u0631\u0645\u0632 \u0645\u062f\u06cc\u0631', enter: '\u0648\u0631\u0648\u062f', wrong: '\u0631\u0645\u0632 \u0646\u0627\u062f\u0631\u0633\u062a \u0627\u0633\u062a', addTitle: '\u0627\u0641\u0632\u0648\u062f\u0646 \u06a9\u0627\u0631\u0628\u0631 \u062a\u0627\u0632\u0647', addSub: '\u06a9\u0627\u0631\u0628\u0631 \u0628\u0633\u0627\u0632\u060c \u062d\u0630\u0641 \u06a9\u0646 \u0648 \u06a9\u062f users.js \u0631\u0627 \u06a9\u067e\u06cc \u06a9\u0646.', uname: '\u0646\u0627\u0645 \u06a9\u0627\u0631\u0628\u0631\u06cc', pass: '\u0631\u0645\u0632', name: '\u0646\u0627\u0645 (\u0627\u062e\u062a\u06cc\u0627\u0631\u06cc)', add: '\u0627\u0641\u0632\u0648\u062f\u0646', listTitle: '\u0641\u0647\u0631\u0633\u062a \u06a9\u0627\u0631\u0628\u0631\u0627\u0646', none: '\u06a9\u0627\u0631\u0628\u0631\u06cc \u0646\u06cc\u0633\u062a', del: '\u062d\u0630\u0641', copy: '\u06a9\u067e\u06cc \u06a9\u062f users.js', need: '\u0646\u0627\u0645 \u06a9\u0627\u0631\u0628\u0631\u06cc \u0648 \u0631\u0645\u0632 \u0644\u0627\u0632\u0645 \u0627\u0633\u062a', exists: '\u0627\u06cc\u0646 \u0646\u0627\u0645 \u06a9\u0627\u0631\u0628\u0631\u06cc \u0642\u0628\u0644\u0627\u064b \u0647\u0633\u062a', added: '\u06a9\u0627\u0631\u0628\u0631 \u0627\u0636\u0627\u0641\u0647 \u0634\u062f. \u06a9\u062f \u0631\u0627 \u06a9\u067e\u06cc \u06a9\u0646 \u062a\u0627 \u062f\u0631 users.js \u0628\u0645\u0627\u0646\u062f.', adminDel: '\u0645\u062f\u06cc\u0631 \u062d\u0630\u0641 \u0646\u0645\u06cc\u200c\u0634\u0648\u062f', confirmDel: '\u0627\u06cc\u0646 \u06a9\u0627\u0631\u0628\u0631 \u062d\u0630\u0641 \u0634\u0648\u062f\u061f', copied: '\u06a9\u062f \u06a9\u067e\u06cc \u0634\u062f. \u062f\u0631 users.js \u0628\u06af\u0630\u0627\u0631.', manual: '\u06a9\u062f \u0646\u0645\u0627\u06cc\u0634 \u062f\u0627\u062f\u0647 \u0634\u062f. \u062e\u0648\u062f\u062a \u06a9\u067e\u06cc \u06a9\u0646.' }
  };
  var users = null, unlocked = false, panel = null, tab = null, status = null, exported = '';

  function lang() { var l = document.documentElement.lang; return TXT[l] ? l : (TXT[localStorage.getItem('fisi-lang')] ? localStorage.getItem('fisi-lang') : 'de'); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
  }
  function isAdmin() {
    try { var u = JSON.parse(sessionStorage.getItem('fisi-auth') || 'null'); return !!u && u.role === 'admin'; } catch (e) { return false; }
  }
  function withUsers(cb) {
    if (typeof USERS !== 'undefined') { cb(); return; }
    var s = document.createElement('script');
    s.src = 'users.js';
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }
  function loadList() {
    if (users) return;
    users = typeof USERS !== 'undefined' ? USERS.slice() : [];
  }
  function setStatus(key, type) { status = key ? { key: key, type: type || '' } : null; paintStatus(); }
  function paintStatus() {
    var el = document.getElementById('utStatus');
    if (!el) return;
    var t = TXT[lang()];
    el.hidden = !status;
    el.className = 'form-status ' + (status ? status.type : '');
    el.textContent = status ? t[status.key] : '';
  }
  function render() {
    if (!panel) return;
    var t = TXT[lang()];
    if (!unlocked) {
      panel.innerHTML = '<section class="settings-card"><h2>' + t.title + '</h2><p class="card-sub">' + t.gateSub + '</p>'
        + '<form id="utGate"><div class="form-group"><label for="utPass">' + t.passLabel + '</label><input type="password" id="utPass" autocomplete="current-password"></div>'
        + '<button type="submit" class="btn btn-primary">' + t.enter + '</button></form>'
        + '<p id="utErr" class="form-status err" role="alert" hidden>' + t.wrong + '</p></section>';
      return;
    }
    loadList();
    var rows = users.length ? users.map(function (u, i) {
      return '<div class="user-item"><div class="info"><span class="name">' + esc(u.username) + '</span><span class="role">' + esc(u.name || '') + ' \u00b7 ' + esc(u.role || 'student') + '</span></div>'
        + '<button type="button" class="btn-del" data-ut="del" data-i="' + i + '" aria-label="' + t.del + '">\u2715</button></div>';
    }).join('') : '<p class="search-empty">' + t.none + '</p>';
    panel.innerHTML = '<section class="settings-card"><h2>' + t.addTitle + '</h2><p class="card-sub">' + t.addSub + '</p>'
      + '<div class="form-inline">'
      + '<div class="form-group"><label for="utUser">' + t.uname + '</label><input type="text" id="utUser" autocomplete="off"></div>'
      + '<div class="form-group"><label for="utNewPass">' + t.pass + '</label><input type="text" id="utNewPass" autocomplete="off"></div>'
      + '<div class="form-group"><label for="utName">' + t.name + '</label><input type="text" id="utName" autocomplete="name"></div>'
      + '<button type="button" class="btn-add" data-ut="add">' + t.add + '</button></div>'
      + '<p id="utStatus" class="form-status" role="status" hidden></p></section>'
      + '<section class="settings-card"><h2>' + t.listTitle + '</h2><div class="user-list">' + rows + '</div>'
      + '<button type="button" class="btn btn-soft btn-export" data-ut="export">' + t.copy + '</button>'
      + '<div class="export-box" id="utExport"' + (exported ? '' : ' hidden') + '>' + esc(exported) + '</div></section>';
    paintStatus();
  }
  function onClick(e) {
    var el = e.target.closest('[data-ut]');
    if (!el || !panel.contains(el)) return;
    var t = TXT[lang()], act = el.dataset.ut;
    if (act === 'add') {
      var un = document.getElementById('utUser').value.trim();
      var pw = document.getElementById('utNewPass').value;
      var nm = document.getElementById('utName').value.trim();
      if (!un || !pw) { setStatus('need', 'err'); return; }
      if (users.find(function (u) { return u.username === un; })) { setStatus('exists', 'err'); return; }
      users.push({ username: un, password: pw, name: nm, role: 'student' });
      status = { key: 'added', type: 'ok' };
      render();
    } else if (act === 'del') {
      var i = Number(el.dataset.i);
      if (users[i] && users[i].role === 'admin') { setStatus('adminDel', 'err'); return; }
      if (window.confirm(t.confirmDel)) { users.splice(i, 1); status = null; render(); }
    } else if (act === 'export') {
      exported = 'const USERS = ' + JSON.stringify(users, null, 2) + ';\n\nconst ADMIN_PASSWORD = "' + ADMIN_PASSWORD + '";';
      render();
      var ok = function () { setStatus('copied', 'ok'); }, fail = function () { setStatus('manual', 'err'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(exported).then(ok, fail); else fail();
    }
  }
  function onSubmit(e) {
    if (e.target.id !== 'utGate') return;
    e.preventDefault();
    var pass = document.getElementById('utPass').value;
    if (typeof ADMIN_PASSWORD !== 'undefined' && pass === ADMIN_PASSWORD) { unlocked = true; status = null; render(); }
    else document.getElementById('utErr').hidden = false;
  }
  function showTab() {
    document.querySelectorAll('.tab').forEach(function (o) {
      var on = o === tab;
      o.classList.toggle('is-active', on);
      o.setAttribute('aria-selected', on ? 'true' : 'false');
      o.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.tab-panel').forEach(function (p) { p.hidden = p.id !== 'panel-users'; });
    withUsers(render);
  }
  function build() {
    var page = document.getElementById('settingsPage');
    var bar = page && page.querySelector('.tabbar');
    if (!bar || document.getElementById('tab-users') || !isAdmin()) return;
    tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.id = 'tab-users';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'panel-users');
    tab.setAttribute('data-tab', 'users');
    tab.tabIndex = -1;
    tab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg><span data-i18n="navUsers">' + TXT[lang()].tab + '</span>';
    bar.appendChild(tab);
    panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = 'panel-users';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-users');
    panel.hidden = true;
    page.appendChild(panel);
    tab.addEventListener('click', showTab);
    panel.addEventListener('click', onClick);
    panel.addEventListener('submit', onSubmit);
    if (location.hash === '#users') showTab();
  }
  document.addEventListener('DOMContentLoaded', build);
  document.addEventListener('fisi-lang', function () { if (panel && !panel.hidden) render(); });
})();
