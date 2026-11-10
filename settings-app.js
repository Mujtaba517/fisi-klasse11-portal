(function () {
  if (document.readyState === 'complete') start();
  else document.addEventListener('DOMContentLoaded', start);
  function start() {
  var ROLES = {
    admin: { label: 'Administrator', pill: 'pill-admin', can: 'Konten auf diesem Gerät anlegen, Rolle ändern und löschen. Fortschritt sehen.' },
    teacher: { label: 'Lehrer/in', pill: 'pill-teacher', can: 'Die Konten und den lokal gespeicherten Fortschritt nur lesen.' },
    student: { label: 'Schüler/in', pill: 'pill-student', can: 'Lektionen, Videos und Quiz nutzen. Fortschritt bleibt in diesem Browser.' },
    guest: { label: 'Gast', pill: 'pill-guest', can: 'Lektionen nur lesen. Fortschritt und Quiz-Auswertung werden nicht gespeichert.' }
  };

  function user() {
    try { return JSON.parse(sessionStorage.getItem('fisi-auth') || '{}'); }
    catch (e) { return {}; }
  }
  function users() {
    try { return JSON.parse(localStorage.getItem('fisi-users') || '[]'); }
    catch (e) { return []; }
  }
  function saveUsers(list) { localStorage.setItem('fisi-users', JSON.stringify(list)); }
  function pref(key, fallback) {
    var v = localStorage.getItem(key);
    return v == null ? fallback : v === '1';
  }
  function setPref(key, on) { localStorage.setItem(key, on ? '1' : '0'); }
  function zone() { return localStorage.getItem('fisi-tz') || 'Europe/Berlin'; }
  function when(ts) {
    if (!ts) return '–';
    try { return new Intl.DateTimeFormat('de-DE', { timeZone: zone(), dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts)); }
    catch (e) { return '–'; }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; });
  }
  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }
  function wireToggle(id, key, fallback) {
    var btn = document.getElementById(id);
    if (!btn) return;
    var on = pref(key, fallback);
    function paint() { btn.classList.toggle('is-on', on); btn.setAttribute('aria-checked', on ? 'true' : 'false'); }
    paint();
    btn.addEventListener('click', function () { on = !on; setPref(key, on); paint(); if (id === 'toggle-backup') document.getElementById('importLabel').hidden = !on; });
    return function () { return on; };
  }

  document.getElementById('setting-version').value = window.LERNOVA_VERSION || 'v2.5.0';
  var lang = document.getElementById('setting-language');
  lang.value = localStorage.getItem('fisi-lang') || 'de';
  lang.addEventListener('change', function () { if (typeof changeLang === 'function') changeLang(lang.value); });
  var tz = document.getElementById('setting-timezone');
  tz.value = zone();
  tz.addEventListener('change', function () { localStorage.setItem('fisi-tz', tz.value); renderUsers(); });
  var dark = document.getElementById('toggle-dark');
  function syncDark() {
    var on = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark';
    dark.classList.toggle('is-on', on);
    dark.setAttribute('aria-checked', on ? 'true' : 'false');
  }
  syncDark();
  dark.addEventListener('click', function () {
    if (typeof setThemeMode === 'function') setThemeMode(dark.classList.contains('is-on') ? 'light' : 'dark');
    syncDark();
  });
  wireToggle('toggle-notify', 'fisi-notify', true);
  wireToggle('toggle-updates', 'fisi-updates', false);
  wireToggle('toggle-backup', 'fisi-backup', false);
  wireToggle('toggle-ki', 'fisi-ki-assist', false);
  wireToggle('toggle-plans', 'fisi-ki-plans', false);
  wireToggle('toggle-reco', 'fisi-ki-reco', false);
  wireToggle('toggle-progress', 'fisi-ki-analyze', false);
  document.getElementById('importLabel').hidden = !pref('fisi-backup', false);

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (other) { other.classList.toggle('is-active', other === tab); });
      var card = document.getElementById(tab.getAttribute('data-tab'));
      if (!card) return;
      card.scrollIntoView({ block: 'start' });
      card.classList.add('is-highlight');
      setTimeout(function () { card.classList.remove('is-highlight'); }, 1600);
    });
  });
  var shellSearch = document.getElementById('shellSearch');
  if (shellSearch) shellSearch.addEventListener('input', function () {
    var q = shellSearch.value.trim().toLowerCase();
    document.querySelectorAll('#settingsPage [data-search]').forEach(function (row) {
      row.hidden = !!(q && (row.getAttribute('data-search') + ' ' + row.textContent).toLowerCase().indexOf(q) === -1);
    });
    document.querySelectorAll('#settingsPage .card').forEach(function (card) {
      var rows = card.querySelectorAll('[data-search]');
      if (!rows.length) return;
      card.hidden = q && Array.prototype.every.call(rows, function (row) { return row.hidden; });
    });
  });

  function snapshot() {
    return {
      version: window.LERNOVA_VERSION || 'v2.5.0',
      exportedAt: new Date().toISOString(),
      note: 'Datei-Backup nur für diesen Browser. Keine Cloud.',
      activity: localStorage.getItem('fisi-activity'),
      quiz: localStorage.getItem('fisi-quiz-log'),
      lang: localStorage.getItem('fisi-lang'),
      theme: localStorage.getItem('fisi-theme'),
      tz: localStorage.getItem('fisi-tz'),
      prefs: {
        notify: localStorage.getItem('fisi-notify'),
        updates: localStorage.getItem('fisi-updates'),
        backup: localStorage.getItem('fisi-backup'),
        assist: localStorage.getItem('fisi-ki-assist'),
        plans: localStorage.getItem('fisi-ki-plans'),
        reco: localStorage.getItem('fisi-ki-reco'),
        analyze: localStorage.getItem('fisi-ki-analyze')
      }
    };
  }
  document.getElementById('exportBtn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lernova-backup.json';
    a.click();
  });
  document.getElementById('importFile').addEventListener('change', function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    file.text().then(function (text) {
      var data = JSON.parse(text);
      if (data.activity) localStorage.setItem('fisi-activity', data.activity);
      if (data.quiz) localStorage.setItem('fisi-quiz-log', data.quiz);
      ['lang', 'theme', 'tz'].forEach(function (key) { if (data[key]) localStorage.setItem('fisi-' + (key === 'tz' ? 'tz' : key), data[key]); });
      location.reload();
    }).catch(function () { alert('Die Datei ist kein Lernova-Backup.'); });
  });

  if (pref('fisi-updates', false)) {
    fetch('version.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (data) {
      if (data.version && data.version !== (window.LERNOVA_VERSION || 'v2.5.0')) {
        var banner = document.getElementById('updateBanner');
        banner.hidden = false;
        document.getElementById('reloadVersion').addEventListener('click', function () { location.reload(); });
      }
    }).catch(function () {});
  }

  var me = user();
  var canEdit = me.role === 'admin';
  var canSee = me.role === 'admin' || me.role === 'teacher';
  if (!canSee) {
    document.getElementById('userTableBody').innerHTML = '';
    document.getElementById('userNote').hidden = false;
    document.getElementById('userNote').textContent = 'Nur Administratoren verwalten Konten. Auf diesem Gerät gibt es keine weitere Benutzerliste für dein Konto.';
    document.getElementById('createUserBtn').hidden = true;
  } else if (!canEdit) {
    document.getElementById('createUserBtn').hidden = true;
    document.getElementById('userNote').hidden = false;
    document.getElementById('userNote').textContent = 'Lehrer/in: die Liste ist nur lesbar und bleibt auf diesem Gerät.';
  }
  document.getElementById('manageRolesBtn').hidden = !canEdit;

  function renderUsers() {
    if (!canSee) return;
    var q = (document.getElementById('userSearch').value || '').toLowerCase();
    var rows = users().filter(function (row) {
      var name = ((row.firstName || '') + ' ' + (row.lastName || '') + ' ' + (row.username || '') + ' ' + (row.email || '')).toLowerCase();
      return !q || name.indexOf(q) !== -1;
    });
    document.getElementById('userTableBody').innerHTML = rows.map(function (row) {
      var role = ROLES[row.role] || ROLES.student;
      var name = ((row.firstName || '') + ' ' + (row.lastName || '')).trim() || row.username || '–';
      var online = me.username && row.username === me.username;
      var actions = canEdit ? '<button type="button" data-role="' + esc(row.username) + '">Rolle</button> <button type="button" data-del="' + esc(row.username) + '">Löschen</button>' : '–';
      return '<tr><td><strong>' + esc(name) + '</strong><div class="email">' + esc(row.email || row.username || '') + '</div></td><td><span class="pill ' + role.pill + '">' + esc(role.label) + '</span></td><td><bdi dir="ltr">' + esc(when(row.lastLogin)) + '</bdi></td><td>' + (online ? '<span class="status on">Online</span>' : '<span class="status">Offline</span>') + '</td><td>' + actions + '</td></tr>';
    }).join('') || '<tr><td colspan="5">Noch kein Konto in diesem Browser.</td></tr>';
  }
  document.getElementById('userSearch').addEventListener('input', renderUsers);
  document.getElementById('userTableBody').addEventListener('click', function (e) {
    var roleBtn = e.target.closest('[data-role]');
    var delBtn = e.target.closest('[data-del]');
    var list = users();
    if (roleBtn) {
      var name = roleBtn.getAttribute('data-role');
      var order = ['student', 'teacher', 'guest', 'admin'];
      list.forEach(function (row) {
        if (row.username === name) row.role = order[(order.indexOf(row.role) + 1) % order.length];
      });
      saveUsers(list);
      renderUsers();
    }
    if (delBtn) {
      var victim = delBtn.getAttribute('data-del');
      if (victim === me.username) return;
      saveUsers(list.filter(function (row) { return row.username !== victim; }));
      renderUsers();
    }
  });
  renderUsers();

  var dialog = document.getElementById('userDialog');
  document.getElementById('createUserBtn').addEventListener('click', function () { if (dialog.showModal) dialog.showModal(); });
  document.getElementById('userDialogCancel').addEventListener('click', function () { dialog.close(); });
  document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!canEdit) return;
    var data = new FormData(e.target);
    sha256(String(data.get('password'))).then(function (hash) {
      var list = users();
      var username = String(data.get('username')).trim();
      if (list.some(function (row) { return row.username === username; })) { alert('Dieser Benutzername ist schon da.'); return; }
      var full = String(data.get('name')).trim().split(/\s+/);
      list.push({ username: username, passwordHash: hash, firstName: full[0] || '', lastName: full.slice(1).join(' '), email: '', role: data.get('role'), approved: true, registeredAt: new Date().toISOString() });
      saveUsers(list);
      e.target.reset();
      dialog.close();
      renderUsers();
    });
  });

  document.getElementById('roleList').innerHTML = Object.keys(ROLES).map(function (key) {
    return '<li><button type="button" class="role-row" data-role-info="' + key + '"><span class="role-name">' + esc(ROLES[key].label) + '</span><span class="role-desc">' + esc(ROLES[key].can) + '</span></button></li>';
  }).join('');
  var roleDialog = document.getElementById('roleDialog');
  function openRole(key) {
    document.getElementById('permList').innerHTML = '<li><span>' + esc(ROLES[key].label) + '</span><span>' + esc(ROLES[key].can) + '</span></li>';
    if (roleDialog.showModal) roleDialog.showModal();
  }
  document.getElementById('roleList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-role-info]');
    if (btn) openRole(btn.getAttribute('data-role-info'));
  });
  document.getElementById('manageRolesBtn').addEventListener('click', function () {
    document.getElementById('permList').innerHTML = Object.keys(ROLES).map(function (key) {
      return '<li><span>' + esc(ROLES[key].label) + '</span><span>' + esc(ROLES[key].can) + '</span></li>';
    }).join('');
    if (roleDialog.showModal) roleDialog.showModal();
  });
  document.getElementById('roleDialogClose').addEventListener('click', function () { roleDialog.close(); });

  var opacity = document.getElementById('glassOpacity');
  var blur = document.getElementById('glassBlur');
  opacity.value = localStorage.getItem('fisi-glass-opacity') || 0;
  blur.value = localStorage.getItem('fisi-glass-blur') || 0;
  opacity.addEventListener('input', function () { if (typeof updateGlass === 'function') updateGlass(); });
  blur.addEventListener('input', function () { if (typeof updateGlass === 'function') updateGlass(); });
  var upload = document.getElementById('bgUpload');
  var nameEl = document.getElementById('bgName');
  document.getElementById('pickImage').addEventListener('click', function () { upload.click(); });
  if (localStorage.getItem('fisi-custom-bg')) {
    nameEl.textContent = 'Gespeichertes Bild';
    document.getElementById('removeBtn').hidden = false;
  }
  upload.addEventListener('change', function (event) {
    var file = event.target.files && event.target.files[0];
    if (file) nameEl.textContent = file.name;
    if (typeof uploadBackground === 'function') uploadBackground(event);
  });
  document.getElementById('removeBtn').addEventListener('click', function () {
    if (typeof removeBackground === 'function') removeBackground();
    this.hidden = true;
    nameEl.textContent = 'Kein Bild gewählt';
  });
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target) target.scrollIntoView();
  }
  }
})();
