// Admin panel — opened from settings. Keeps the localStorage user list.
function getUsers() {
  var stored = localStorage.getItem('fisi-users');
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem('fisi-users', JSON.stringify(users));
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

async function sha256(text) {
  var encoder = new TextEncoder();
  var data = encoder.encode(text);
  var hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

function openAdminPanel() {
  var settingsPanel = document.getElementById('settingsPanel');
  if (settingsPanel) settingsPanel.classList.remove('open');
  var settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');

  var modal = document.getElementById('adminModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'modal-backdrop';
    modal.hidden = true;
    modal.innerHTML = ''
      + '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="adminTitle">'
      + '  <div class="modal-header">'
      + '    <h2 id="adminTitle">Benutzerverwaltung</h2>'
      + '    <button type="button" class="close-btn" onclick="closeAdminPanel()" aria-label="Schließen">✕</button>'
      + '  </div>'
      + '  <div id="adminContent"></div>'
      + '</div>';
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAdminPanel();
    });
    document.body.appendChild(modal);
  }
  modal.hidden = false;
  renderAdminPanel();
  var close = modal.querySelector('.close-btn');
  if (close) close.focus();
}

function closeAdminPanel() {
  var modal = document.getElementById('adminModal');
  if (modal) modal.hidden = true;
  var btn = document.getElementById('settingsBtn');
  if (btn) btn.focus();
}

function renderAdminPanel() {
  var users = getUsers();
  var pending = users.filter(function (u) { return !u.approved && u.role !== 'admin'; });
  var approved = users.filter(function (u) { return u.approved && u.role !== 'admin'; });
  var html = '';

  html += '<h3 class="count">Ausstehende Freigaben (' + pending.length + ')</h3>';
  if (pending.length === 0) {
    html += '<p class="search-empty">Keine ausstehenden Anfragen</p>';
  } else {
    html += '<div class="stack">';
    pending.forEach(function (u) {
      var idx = users.findIndex(function (x) { return x.username === u.username; });
      html += '<div class="user-row"><div class="info"><strong>' + esc(u.firstName) + ' ' + esc(u.lastName) + '</strong>'
        + '<span class="user-meta">Benutzer: ' + esc(u.username) + ' · E-Mail: ' + esc(u.email) + ' · Schülernr: ' + esc(u.studentId) + '</span></div>'
        + '<div class="row-actions"><button type="button" class="btn-success" onclick="approveUser(' + idx + ')">Freigeben</button>'
        + '<button type="button" class="btn-danger" onclick="rejectUser(' + idx + ')">Ablehnen</button></div></div>';
    });
    html += '</div>';
  }

  html += '<h3 class="count">Freigegebene Benutzer (' + approved.length + ')</h3>';
  if (approved.length === 0) {
    html += '<p class="search-empty">Noch keine freigegebenen Benutzer</p>';
  } else {
    html += '<div class="stack">';
    approved.forEach(function (u) {
      var idx = users.findIndex(function (x) { return x.username === u.username; });
      html += '<div class="user-row"><div class="info"><strong>' + esc(u.firstName) + ' ' + esc(u.lastName) + '</strong>'
        + '<span class="user-meta">' + esc(u.username) + '</span></div>'
        + '<button type="button" class="btn-revoke" onclick="revokeUser(' + idx + ')">Sperren</button></div>';
    });
    html += '</div>';
  }

  html += '<h3 class="count">Admin-Passwort ändern</h3>'
    + '<div class="form-row">'
    + '<div class="form-group"><label for="newAdminPass">Neues Passwort</label>'
    + '<input type="password" id="newAdminPass" autocomplete="new-password" minlength="6"></div></div>'
    + '<button type="button" class="btn btn-primary" onclick="changeAdminPassword()">Ändern</button>'
    + '<p id="adminStatus" class="form-status" role="status" hidden></p>';

  document.getElementById('adminContent').innerHTML = html;
}

function setAdminStatus(message, type) {
  var el = document.getElementById('adminStatus');
  if (!el) return;
  el.hidden = !message;
  el.className = 'form-status ' + (type || '');
  el.textContent = message || '';
}

function approveUser(idx) {
  var users = getUsers();
  users[idx].approved = true;
  saveUsers(users);
  renderAdminPanel();
}

function rejectUser(idx) {
  if (!confirm('Benutzer wirklich ablehnen und löschen?')) return;
  var users = getUsers();
  users.splice(idx, 1);
  saveUsers(users);
  renderAdminPanel();
}

function revokeUser(idx) {
  if (!confirm('Zugang wirklich sperren?')) return;
  var users = getUsers();
  users[idx].approved = false;
  saveUsers(users);
  renderAdminPanel();
}

async function changeAdminPassword() {
  var field = document.getElementById('newAdminPass');
  var newPass = field ? field.value : '';
  if (newPass.length < 6) {
    setAdminStatus('Passwort muss mindestens 6 Zeichen haben', 'err');
    return;
  }
  var users = getUsers();
  var admin = users.find(function (u) { return u.username === 'admin'; });
  if (admin) {
    admin.passwordHash = await sha256(newPass);
    saveUsers(users);
    field.value = '';
    setAdminStatus('Passwort geändert.', 'ok');
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var modal = document.getElementById('adminModal');
  if (modal && !modal.hidden) closeAdminPanel();
});
