// Unified Settings Panel
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    createSettingsButton();
    createSettingsPanel();
    applyGlassSettings();
  });
})();

function createSettingsButton() {
  const topActions = document.querySelector('.top-actions');
  if (!topActions) return;
  
  // Remove old buttons
  const oldTheme = document.getElementById('themeBtn');
  const oldLang = document.querySelector('.lang-menu');
  if (oldTheme) oldTheme.remove();
  if (oldLang) oldLang.remove();
  
  // Add single settings button
  const btn = document.createElement('button');
  btn.className = 'settings-btn';
  btn.innerHTML = '⚙️';
  btn.title = 'Einstellungen';
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
        <h3>Einstellungen</h3>
        <button onclick="toggleSettings()" class="close-btn">✕</button>
      </div>
      
      <div class="settings-section">
        <label>🌙 Erscheinungsbild</label>
        <div class="theme-switch">
          <button onclick="setThemeMode('dark')" id="themeDark" class="theme-opt">Dunkel</button>
          <button onclick="setThemeMode('light')" id="themeLight" class="theme-opt">Hell</button>
        </div>
      </div>
      
      <div class="settings-section">
        <label>🌍 Sprache</label>
        <div class="lang-switch">
          <button onclick="setLang('fa')" data-lang="fa" class="lang-opt">فارسی</button>
          <button onclick="setLang('de')" data-lang="de" class="lang-opt">Deutsch</button>
          <button onclick="setLang('en')" data-lang="en" class="lang-opt">English</button>
        </div>
      </div>
      
      <div class="settings-section">
        <label>✨ Glaseffekt</label>
        <div class="glass-controls">
          <div class="control-row">
            <span>Transparenz</span>
            <input type="range" id="glassOpacity" min="0" max="100" value="15" oninput="updateGlass()">
          </div>
          <div class="control-row">
            <span>Unschärfe</span>
            <input type="range" id="glassBlur" min="0" max="40" value="20" oninput="updateGlass()">
          </div>
        </div>
      </div>
      
      <div class="settings-section" id="adminSection" style="display:none">
        <label>👤 Benutzerverwaltung</label>
        <button onclick="openAdminPanel()" class="admin-btn">Benutzer verwalten</button>
      </div>
      
      <div class="settings-section">
        <button onclick="doLogout()" class="logout-btn">Abmelden</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  
  // Show admin section if admin
  const auth = sessionStorage.getItem('fisi-auth');
  if (auth) {
    const user = JSON.parse(auth);
    if (user.role === 'admin') {
      document.getElementById('adminSection').style.display = 'block';
    }
  }
  
  updateThemeButtons();
}

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('open');
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
  const opacity = document.getElementById('glassOpacity')?.value || 15;
  const blur = document.getElementById('glassBlur')?.value || 20;
  
  document.documentElement.style.setProperty('--glass-opacity', (100 - opacity) / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  
  localStorage.setItem('fisi-glass-opacity', opacity);
  localStorage.setItem('fisi-glass-blur', blur);
}

function applyGlassSettings() {
  const opacity = localStorage.getItem('fisi-glass-opacity') || 15;
  const blur = localStorage.getItem('fisi-glass-blur') || 20;
  
  document.documentElement.style.setProperty('--glass-opacity', (100 - opacity) / 100);
  document.documentElement.style.setProperty('--glass-blur', blur + 'px');
  
  const opacityInput = document.getElementById('glassOpacity');
  const blurInput = document.getElementById('glassBlur');
  if (opacityInput) opacityInput.value = opacity;
  if (blurInput) blurInput.value = blur;
}

function doLogout() {
  sessionStorage.removeItem('fisi-auth');
  window.location.href = 'login.html';
}

// Close panel when clicking outside
document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  const btn = document.querySelector('.settings-btn');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
    panel.classList.remove('open');
  }
});