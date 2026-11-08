// Admin panel — shown only inside settings
function getUsers() {
  const stored = localStorage.getItem('fisi-users');
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem('fisi-users', JSON.stringify(users));
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function openAdminPanel() {
  // Close settings first
  const settingsPanel = document.getElementById('settingsPanel');
  if (settingsPanel) settingsPanel.classList.remove('open');
  
  // Create or show admin modal
  let modal = document.getElementById('adminModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;overflow:auto;padding:2rem';
    modal.innerHTML = `
      <div style="max-width:800px;margin:0 auto;background:var(--card,#1e293b);border-radius:20px;padding:1.5rem;color:var(--text,#f1f5f9);border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <h2 style="margin:0">Benutzerverwaltung</h2>
          <button onclick="closeAdminPanel()" style="background:none;border:none;color:inherit;font-size:1.5rem;cursor:pointer">✕</button>
        </div>
        <div id="adminContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'block';
  renderAdminPanel();
}

function closeAdminPanel() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.style.display = 'none';
}

function renderAdminPanel() {
  const users = getUsers();
  const pending = users.filter(u => !u.approved && u.role !== 'admin');
  const approved = users.filter(u => u.approved && u.role !== 'admin');

  let html = '';

  html += '<h3 style="margin-bottom:1rem;color:#fbbf24">Ausstehende Freigaben (' + pending.length + ')</h3>';
  if (pending.length === 0) {
    html += '<p style="color:var(--muted,#94a3b8);margin-bottom:1.5rem">Keine ausstehenden Anfragen</p>';
  } else {
    pending.forEach((u) => {
      const idx = users.findIndex(x => x.username === u.username);
      html += `
        <div style="background:var(--bg-soft,#0f172a);border:1px solid var(--border,#334155);border-radius:12px;padding:1rem;margin-bottom:.8rem">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem">
            <div>
              <strong>${u.firstName} ${u.lastName}</strong>
              <div style="font-size:.85rem;color:var(--muted,#94a3b8);margin-top:.3rem">
                Benutzer: ${u.username} · E-Mail: ${u.email} · Schülernr: ${u.studentId}
              </div>
            </div>
            <div style="display:flex;gap:.5rem">
              <button onclick="approveUser(${idx})" style="padding:.5rem 1rem;background:#22c55e;border:none;border-radius:8px;color:#fff;cursor:pointer;font-weight:600">Freigeben</button>
              <button onclick="rejectUser(${idx})" style="padding:.5rem 1rem;background:#ef4444;border:none;border-radius:8px;color:#fff;cursor:pointer;font-weight:600">Ablehnen</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  html += '<h3 style="margin:1.5rem 0 1rem">Freigegebene Benutzer (' + approved.length + ')</h3>';
  if (approved.length === 0) {
    html += '<p style="color:var(--muted,#94a3b8)">Noch keine freigegebenen Benutzer</p>';
  } else {
    approved.forEach(u => {
      const idx = users.findIndex(x => x.username === u.username);
      html += `
        <div style="background:var(--bg-soft,#0f172a);border:1px solid var(--border,#334155);border-radius:12px;padding:.8rem 1rem;margin-bottom:.6rem;display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${u.firstName} ${u.lastName}</strong>
            <span style="color:var(--muted,#94a3b8);font-size:.85rem;margin-left:.5rem">${u.username}</span>
          </div>
          <button onclick="revokeUser(${idx})" style="padding:.4rem .8rem;background:transparent;border:1px solid #ef4444;border-radius:8px;color:#ef4444;cursor:pointer;font-size:.85rem">Sperren</button>
        </div>
      `;
    });
  }

  html += `
    <h3 style="margin:1.5rem 0 1rem">Admin-Passwort ändern</h3>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <input type="password" id="newAdminPass" placeholder="Neues Passwort" style="padding:.6rem .8rem;background:var(--bg-soft,#0f172a);border:1px solid var(--border,#334155);border-radius:8px;color:inherit;font-family:inherit">
      <button onclick="changeAdminPassword()" style="padding:.6rem 1rem;background:#38bdf8;border:none;border-radius:8px;color:#0f172a;cursor:pointer;font-weight:600">Ändern</button>
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function approveUser(idx) {
  const users = getUsers();
  users[idx].approved = true;
  saveUsers(users);
  renderAdminPanel();
}

function rejectUser(idx) {
  if (!confirm('Benutzer wirklich ablehnen und löschen?')) return;
  const users = getUsers();
  users.splice(idx, 1);
  saveUsers(users);
  renderAdminPanel();
}

function revokeUser(idx) {
  if (!confirm('Zugang wirklich sperren?')) return;
  const users = getUsers();
  users[idx].approved = false;
  saveUsers(users);
  renderAdminPanel();
}

async function changeAdminPassword() {
  const newPass = document.getElementById('newAdminPass').value;
  if (newPass.length < 6) {
    alert('Passwort muss mindestens 6 Zeichen haben');
    return;
  }
  const users = getUsers();
  const admin = users.find(u => u.username === 'admin');
  if (admin) {
    admin.passwordHash = await sha256(newPass);
    saveUsers(users);
    alert('Passwort geändert!');
    document.getElementById('newAdminPass').value = '';
  }
}