// Unified Settings Panel
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    createSettingsButton();
    createSettingsPanel();
    applyGlassSettings();
    applyCustomBackground();
  });
})();

function createSettingsButton() {
  const topActions = document.querySelector('.top-actions');
  if (!topActions) return;
  
  topActions.innerHTML = '';
  
  const btn = document.createElement('button');
  btn.className = 'settings-btn';
  btn.innerHTML = '⚙️';
  btn.title = 'Settings';
  btn.onclick = toggleSettings;
  topActions.appendChild(btn);
}

function createSettingsPanel() {
  const panel = document.createElement('div');
  panel.id = 'settingsPanel';
  panel.className = 'settings-panel';
  panel.innerHTML = `
    <div class="settings-content">
      <div class="settings-header">
        <h3 id="settingsTitle">Einstellungen</h3>
        <button onclick="toggleSettings()" class="close-btn">✕</button>
      </div>
      
      <div class="settings-section">
        <label id="themeLabel">🌙 Erscheinungsbild</label>
        <div class="theme-switch">
          <button onclick="setThemeMode('dark')" id="themeDark" class="theme-opt">Dunkel</button>
          <button onclick="setThemeMode('light')" id="themeLight" class="theme-opt">Hell</button>
        </div>
      </div>
      
      <div class="settings-section">
        <label id="langLabel2">🌍 Sprache</label>
        <div class="lang-switch">
          <button onclick="changeLang('fa')" data-lang="fa" class="lang-opt">فارسی</button>
          <button onclick="changeLang('de')" data-lang="de" class="lang-opt">Deutsch</button>
          <button onclick="changeLang('en')" data-lang="en" class="lang-opt">English</button>
        </div>
      </div>
      
      <div class="settings-section">
        <label id="glassLabel">✨ Glaseffekt</label>
        <div class="glass-controls">
          <div class="control-row">
            <span id="opacityLabel">Transparenz</span>
            <input type="range" id="glassOpacity" min="0" max="80" value="30" oninput="updateGlass()">
          </div>
          <div class="control-row">
            <span id="blurLabel">Unschärfe</span>
            <input type="range" id="glassBlur" min="0" max="50" value="25" oninput="updateGlass()">
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <label id="bgLabel">🖼️ Hintergrundbild</label>
        <input type="file" id="bgUpload" accept="image/*" onchange="uploadBackground(event)" style="display:none">
        <button onclick="document.getElementById('bgUpload').click()" class="upload-btn" id="uploadBtn">Bild auswählen</button>
        <button onclick="removeBackground()" class="remove-btn" id="removeBtn" style="display:none">Entfernen</button>
        <p style="font-size:.75rem;color:var(--muted);margin-top:.5rem">Max 10 MB</p>
      </div>
      
      <div class="settings-section" id="adminSection" style="display:none">
        <label id="adminLabel">👤 Benutzerverwaltung</label>
        <button onclick="openAdminPanel()" class="admin-btn" id="adminBtn">Benutzer verwalten</button>
      </div>
      
      <div class="settings-section">
        <button onclick="doLogout()" class="logout-btn" id="logoutBtn">Abmelden</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  
  const auth = sessionStorage.getItem('fisi-auth');
  if (auth) {
    const user = JSON.parse(auth);
    if (user.role === 'admin') {
      document.getElementById('adminSection').style.display = 'block';
    }
  }
  
  if (localStorage.getItem('fisi-custom-bg')) {
    document.getElementById('removeBtn').style.display = 'block';
  }
  
  updateThemeButtons();
  updateSettingsLang();
}

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('open');
}

function changeLang(lang) {
  if (typeof setLang === 'function') {
    setLang(lang);
  }
  localStorage.setItem('fisi-lang', lang);
  updateSettingsLang();
  
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function updateSettingsLang() {
  const lang = localStorage.getItem('fisi-lang') || 'de';
  const texts = {
    fa: { title: 'تنظیمات', theme: '🌙 ظاهر', dark: 'تاریک', light: 'روشن', lang: '🌍 زبان', glass: '✨ افکت شیشه‌ای', opacity: 'شفافیت', blur: 'محوشدگی', bg: '🖼️ پس‌زمینه', upload: 'انتخاب تصویر', remove: 'حذف', admin: '👤 مدیریت کاربران', adminBtn: 'مدیریت کاربران', logout: 'خروج' },
    de: { title: 'Einstellungen', theme: '🌙 Erscheinungsbild', dark: 'Dunkel', light: 'Hell', lang: '🌍 Sprache', glass: '✨ Glaseffekt', opacity: 'Transparenz', blur: 'Unschärfe', bg: '🖼️ Hintergrundbild', upload: 'Bild auswählen', remove: 'Entfernen', admin: '👤 Benutzerverwaltung', adminBtn: 'Benutzer verwalten', logout: 'Abmelden' },
    en: { title: 'Settings', theme: '🌙 Appearance', dark: 'Dark', light: 'Light', lang: '🌍 Language', glass: '✨ Glass Effect', opacity: 'Opacity', blur: 'Blur', bg: '🖼️ Background', upload: 'Choose Image', remove: 'Remove', admin: '👤 User Management', adminBtn: 'Manage Users', logout: 'Logout' }
  };
  const t = texts[lang] || texts.de;
  
  const el = (id) => document.getElementById(id);
  if (el('settingsTitle')) el('settingsTitle').textContent = t.title;
  if (el('themeLabel')) el('themeLabel').textContent = t.theme;
  if (el('themeDark')) el('themeDark').textContent = t.dark;
  if (el('themeLight')) el('themeLight').textContent = t.light;
  if (el('langLabel2')) el('langLabel2').textContent = t.lang;
  if (el('glassLabel')) el('glassLabel').textContent = t.glass;
  if (el('opacityLabel')) el('opacityLabel').textContent = t.opacity;
  if (el('blurLabel')) el('blurLabel').textContent = t.blur;
  if (el('bgLabel')) el('bgLabel').textContent = t.bg;
  if (el('uploadBtn')) el('uploadBtn').textContent = t.upload;
  if (el('removeBtn')) el('removeBtn').textContent = t.remove;
  if (el('adminLabel')) el('adminLabel').textContent = t.admin;
  if (el('adminBtn')) el('adminBtn').textContent = t.adminBtn;
  if (el('logoutBtn')) el('logoutBtn').textContent = t.logout;
  
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setThemeMode(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fisi-theme', theme);
  updateThemeButtons();
}

function updateThemeButtons() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.getElementById('themeDark')?.classList.toggle('active', theme === 'dark');
  document.getElementById('themeLight')?.classList.toggle('active', theme === 'light');
}

function updateGlass() {
  const opacity = document.getElementById('glassOpacity')?.value || 30;
  const blur = document.getElementById('glassBlur')?.value || 25;
  
  document.documentElement.style.setProperty('--glass-opacity', opacity / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  
  localStorage.setItem('fisi-glass-opacity', opacity);
  localStorage.setItem('fisi-glass-blur', blur);
}

function applyGlassSettings() {
  const opacity = localStorage.getItem('fisi-glass-opacity') || 30;
  const blur = localStorage.getItem('fisi-glass-blur') || 25;
  
  document.documentElement.style.setProperty('--glass-opacity', opacity / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  
  setTimeout(() => {
    const opacityInput = document.getElementById('glassOpacity');
    const blurInput = document.getElementById('glassBlur');
    if (opacityInput) opacityInput.value = opacity;
    if (blurInput) blurInput.value = blur;
  }, 100);
}

function uploadBackground(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const lang = localStorage.getItem('fisi-lang') || 'de';
    const msgs = { fa: 'تصویر بزرگ است (حداکثر ۱۰ مگابایت)', de: 'Bild zu groß (max 10 MB)', en: 'Image too large (max 10 MB)' };
    alert(msgs[lang] || msgs.de);
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      localStorage.setItem('fisi-custom-bg', e.target.result);
      applyCustomBackground();
      document.getElementById('removeBtn').style.display = 'block';
    } catch (err) {
      const lang = localStorage.getItem('fisi-lang') || 'de';
      const msgs = { fa: 'خطا در ذخیره. تصویر کوچک‌تر انتخاب کنید.', de: 'Speicherfehler. Bitte kleineres Bild wählen.', en: 'Storage error. Please choose a smaller image.' };
      alert(msgs[lang] || msgs.de);
    }
  };
  reader.readAsDataURL(file);
}

function applyCustomBackground() {
  const bg = localStorage.getItem('fisi-custom-bg');
  if (bg) {
    document.body.style.backgroundImage = `url('${bg}')`;
  }
}

function removeBackground() {
  localStorage.removeItem('fisi-custom-bg');
  document.body.style.backgroundImage = '';
  document.getElementById('removeBtn').style.display = 'none';
}

function doLogout() {
  sessionStorage.removeItem('fisi-auth');
  window.location.href = 'login.html';
}

document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  const btn = document.querySelector('.settings-btn');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
    panel.classList.remove('open');
  }
});