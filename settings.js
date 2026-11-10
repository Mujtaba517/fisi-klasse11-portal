// Unified settings panel. Storage keys and public functions stay stable.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    createSettingsButton();
    createSettingsPanel();
    applyGlassSettings();
    applyCustomBackground();
  });
})();

var adminPanelLoading = null;
function ensureAdminPanel() {
  if (typeof openAdminPanel === 'function') {
    openAdminPanel();
    return;
  }
  if (!adminPanelLoading) {
    adminPanelLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'admin-panel.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { adminPanelLoading = null; reject(); };
      document.body.appendChild(s);
    });
  }
  adminPanelLoading.then(function () {
    if (typeof openAdminPanel === 'function') openAdminPanel();
  });
}

var GEAR_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

function createSettingsButton() {
  var topActions = document.querySelector('.top-actions');
  if (!topActions || document.getElementById('settingsBtn')) return;
  topActions.innerHTML = '';
  var btn = document.createElement('button');
  btn.id = 'settingsBtn';
  btn.type = 'button';
  btn.className = 'settings-btn';
  btn.innerHTML = GEAR_ICON;
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-controls', 'settingsPanel');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleSettings();
  });
  topActions.appendChild(btn);
}

function createSettingsPanel() {
  if (document.getElementById('settingsPanel')) return;
  var panel = document.createElement('div');
  panel.id = 'settingsPanel';
  panel.className = 'settings-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'settingsTitle');
  panel.innerHTML = ''
    + '<div class="settings-content">'
    + '  <div class="settings-header">'
    + '    <h2 id="settingsTitle">Einstellungen</h2>'
    + '    <button type="button" onclick="closeSettings()" class="close-btn" id="settingsClose" aria-label="Schließen">✕</button>'
    + '  </div>'
    + '  <div class="settings-section">'
    + '    <p class="field-label" id="themeLabel">Erscheinungsbild</p>'
    + '    <div class="theme-switch" role="group" aria-labelledby="themeLabel">'
    + '      <button type="button" onclick="setThemeMode(\'dark\')" id="themeDark" class="theme-opt">Dunkel</button>'
    + '      <button type="button" onclick="setThemeMode(\'light\')" id="themeLight" class="theme-opt">Hell</button>'
    + '    </div>'
    + '  </div>'
    + '  <div class="settings-section">'
    + '    <p class="field-label" id="langLabel2">Sprache</p>'
    + '    <div class="lang-switch" role="group" aria-labelledby="langLabel2">'
    + '      <button type="button" onclick="changeLang(\'fa\')" data-lang="fa" class="lang-opt">فارسی</button>'
    + '      <button type="button" onclick="changeLang(\'de\')" data-lang="de" class="lang-opt">Deutsch</button>'
    + '      <button type="button" onclick="changeLang(\'en\')" data-lang="en" class="lang-opt">English</button>'
    + '    </div>'
    + '  </div>'
    + '  <div class="settings-section">'
    + '    <p class="field-label" id="glassLabel">Flächentransparenz</p>'
    + '    <div class="glass-controls">'
    + '      <div class="control-row">'
    + '        <label id="opacityLabel" for="glassOpacity">Transparenz</label>'
    + '        <input type="range" id="glassOpacity" min="0" max="80" value="0" oninput="updateGlass()">'
    + '      </div>'
    + '      <div class="control-row">'
    + '        <label id="blurLabel" for="glassBlur">Unschärfe</label>'
    + '        <input type="range" id="glassBlur" min="0" max="50" value="0" oninput="updateGlass()">'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '  <div class="settings-section">'
    + '    <p class="field-label" id="bgLabel">Hintergrundbild</p>'
    + '    <input type="file" id="bgUpload" accept="image/*" onchange="uploadBackground(event)" class="sr-only">'
    + '    <button type="button" onclick="document.getElementById(\'bgUpload\').click()" class="upload-btn" id="uploadBtn">Bild auswählen</button>'
    + '    <button type="button" onclick="removeBackground()" class="remove-btn" id="removeBtn" style="display:none">Entfernen</button>'
    + '    <p class="hint" id="bgHint">Maximal 10 MB. Das Bild bleibt nur in diesem Browser.</p>'
    + '  </div>'
    + '  <div class="settings-section" id="adminSection" hidden>'
    + '    <p class="field-label" id="adminLabel">Benutzerverwaltung</p>'
    + '    <button type="button" onclick="ensureAdminPanel()" class="admin-btn" id="adminBtn">Benutzer verwalten</button>'
    + '  </div>'
    + '  <div class="settings-section" id="logoutSection">'
    + '    <button type="button" onclick="doLogout()" class="logout-btn" id="logoutBtn">Abmelden</button>'
    + '  </div>'
    + '</div>';
  document.body.appendChild(panel);

  var auth = sessionStorage.getItem('fisi-auth');
  if (auth) {
    try {
      var user = JSON.parse(auth);
      if (user.role === 'admin') document.getElementById('adminSection').hidden = false;
    } catch (e) {}
  } else {
    var logoutSection = document.getElementById('logoutSection');
    if (logoutSection) logoutSection.hidden = true;
  }

  if (localStorage.getItem('fisi-custom-bg')) {
    document.getElementById('removeBtn').style.display = 'block';
  }

  updateThemeButtons();
  updateSettingsLang();
}

function setSettingsOpen(open) {
  var panel = document.getElementById('settingsPanel');
  var btn = document.getElementById('settingsBtn');
  if (!panel) return;
  panel.classList.toggle('open', open);
  document.body.classList.toggle('settings-open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    var close = document.getElementById('settingsClose');
    if (close) close.focus();
  } else if (btn) {
    btn.focus();
  }
}

function toggleSettings() {
  var panel = document.getElementById('settingsPanel');
  setSettingsOpen(!(panel && panel.classList.contains('open')));
}

function closeSettings() {
  setSettingsOpen(false);
}

function changeLang(lang) {
  if (typeof setLang === 'function') setLang(lang);
  localStorage.setItem('fisi-lang', lang);
  updateSettingsLang();
  document.querySelectorAll('.lang-opt').forEach(function (btn) {
    var on = btn.dataset.lang === lang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function updateSettingsLang() {
  var lang = localStorage.getItem('fisi-lang') || 'de';
  var texts = {
    fa: { title: 'تنظیمات', theme: 'ظاهر', dark: 'تاریک', light: 'روشن', lang: 'زبان', glass: 'شفافیت سطح', opacity: 'شفافیت', blur: 'محوشدگی', bg: 'پس‌زمینه', upload: 'انتخاب تصویر', remove: 'حذف', admin: 'مدیریت کاربران', adminBtn: 'مدیریت کاربران', logout: 'خروج', close: 'بستن', settings: 'تنظیمات', bgHint: 'حداکثر ۱۰ مگابایت. تصویر فقط در همین مرورگر می‌ماند.' },
    de: { title: 'Einstellungen', theme: 'Erscheinungsbild', dark: 'Dunkel', light: 'Hell', lang: 'Sprache', glass: 'Flächentransparenz', opacity: 'Transparenz', blur: 'Unschärfe', bg: 'Hintergrundbild', upload: 'Bild auswählen', remove: 'Entfernen', admin: 'Benutzerverwaltung', adminBtn: 'Benutzer verwalten', logout: 'Abmelden', close: 'Schließen', settings: 'Einstellungen', bgHint: 'Maximal 10 MB. Das Bild bleibt nur in diesem Browser.' },
    en: { title: 'Settings', theme: 'Appearance', dark: 'Dark', light: 'Light', lang: 'Language', glass: 'Surface transparency', opacity: 'Opacity', blur: 'Blur', bg: 'Background', upload: 'Choose image', remove: 'Remove', admin: 'User management', adminBtn: 'Manage users', logout: 'Log out', close: 'Close', settings: 'Settings', bgHint: 'Maximum 10 MB. The image stays only in this browser.' }
  };
  var t = texts[lang] || texts.de;
  var el = function (id) { return document.getElementById(id); };
  if (el('settingsTitle')) el('settingsTitle').textContent = t.title;
  if (el('themeLabel')) el('themeLabel').textContent = t.theme;
  if (el('themeDark')) el('themeDark').textContent = t.dark;
  if (el('themeLight')) el('themeLight').textContent = t.light;
  if (el('langLabel2')) el('langLabel2').textContent = t.lang;
  if (el('glassLabel')) el('glassLabel').textContent = t.glass;
  if (el('opacityLabel')) el('opacityLabel').textContent = t.opacity;
  if (el('blurLabel')) el('blurLabel').textContent = t.blur;
  if (el('bgLabel')) el('bgLabel').textContent = t.bg;
  if (el('bgHint')) el('bgHint').textContent = t.bgHint;
  if (el('uploadBtn')) el('uploadBtn').textContent = t.upload;
  if (el('removeBtn')) el('removeBtn').textContent = t.remove;
  if (el('adminLabel')) el('adminLabel').textContent = t.admin;
  if (el('adminBtn')) el('adminBtn').textContent = t.adminBtn;
  if (el('logoutBtn')) el('logoutBtn').textContent = t.logout;
  if (el('settingsClose')) el('settingsClose').setAttribute('aria-label', t.close);
  if (el('settingsBtn')) el('settingsBtn').setAttribute('aria-label', t.settings);
  document.querySelectorAll('.lang-opt').forEach(function (btn) {
    var on = btn.dataset.lang === lang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function setThemeMode(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fisi-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f3f5f7' : '#101418');
  updateThemeButtons();
}

function updateThemeButtons() {
  var theme = document.documentElement.getAttribute('data-theme') || 'dark';
  var dark = document.getElementById('themeDark');
  var light = document.getElementById('themeLight');
  if (dark) {
    dark.classList.toggle('active', theme === 'dark');
    dark.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  if (light) {
    light.classList.toggle('active', theme === 'light');
    light.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
}

function updateGlass() {
  var opacity = document.getElementById('glassOpacity') ? document.getElementById('glassOpacity').value : 0;
  var blur = document.getElementById('glassBlur') ? document.getElementById('glassBlur').value : 0;
  document.documentElement.style.setProperty('--glass-opacity', opacity / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  localStorage.setItem('fisi-glass-opacity', opacity);
  localStorage.setItem('fisi-glass-blur', blur);
}

function applyGlassSettings() {
  var opacity = localStorage.getItem('fisi-glass-opacity');
  var blur = localStorage.getItem('fisi-glass-blur');
  if (opacity === null) opacity = 0;
  if (blur === null) blur = 0;
  document.documentElement.style.setProperty('--glass-opacity', opacity / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  setTimeout(function () {
    var opacityInput = document.getElementById('glassOpacity');
    var blurInput = document.getElementById('glassBlur');
    if (opacityInput) opacityInput.value = opacity;
    if (blurInput) blurInput.value = blur;
  }, 100);
}

function uploadBackground(event) {
  var file = event.target.files[0];
  if (!file) return;
  var maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    var lang = localStorage.getItem('fisi-lang') || 'de';
    var msgs = { fa: 'تصویر بزرگ است (حداکثر ۱۰ مگابایت)', de: 'Bild zu groß (max 10 MB)', en: 'Image too large (max 10 MB)' };
    alert(msgs[lang] || msgs.de);
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      localStorage.setItem('fisi-custom-bg', e.target.result);
      applyCustomBackground();
      document.getElementById('removeBtn').style.display = 'block';
    } catch (err) {
      var lang = localStorage.getItem('fisi-lang') || 'de';
      var msgs = { fa: 'خطا در ذخیره. تصویر کوچک‌تر انتخاب کنید.', de: 'Speicherfehler. Bitte kleineres Bild wählen.', en: 'Storage error. Please choose a smaller image.' };
      alert(msgs[lang] || msgs.de);
    }
  };
  reader.readAsDataURL(file);
}

function applyCustomBackground() {
  var bg = localStorage.getItem('fisi-custom-bg');
  if (bg) {
    document.body.style.backgroundImage = "url('" + bg + "')";
    document.body.classList.add('has-custom-bg');
  } else {
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-custom-bg');
  }
}

function removeBackground() {
  localStorage.removeItem('fisi-custom-bg');
  document.body.style.backgroundImage = '';
  document.body.classList.remove('has-custom-bg');
  var btn = document.getElementById('removeBtn');
  if (btn) btn.style.display = 'none';
}

function doLogout() {
  sessionStorage.removeItem('fisi-auth');
  window.location.href = 'login.html';
}

document.addEventListener('click', function (e) {
  var panel = document.getElementById('settingsPanel');
  var btn = document.getElementById('settingsBtn');
  var inside = e.target.closest && e.target.closest('#settingsBtn, #settingsPanel');
  if (panel && panel.classList.contains('open') && !inside) {
    closeSettings();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var panel = document.getElementById('settingsPanel');
  if (panel && panel.classList.contains('open')) closeSettings();
});
