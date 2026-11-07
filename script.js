const translations = {
  fa: { langLabel: 'زبان' },
  de: { langLabel: 'Sprache' },
  en: { langLabel: 'Language' }
};

function setLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  const label = document.getElementById('langLabel');
  if (label && translations[lang]) label.textContent = translations[lang].langLabel;
  localStorage.setItem('fisi-lang', lang);
  closeLangPanel();
}

function toggleLangPanel(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById('langPanel');
  if (panel) panel.classList.toggle('open');
}
function closeLangPanel() {
  const panel = document.getElementById('langPanel');
  if (panel) panel.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const menu = document.querySelector('.lang-menu');
  if (menu && !menu.contains(e.target)) closeLangPanel();
});

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fisi-theme', next);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = next === 'dark' ? '🌙 تم' : '☀️ تم';
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('fisi-lang') || 'fa';
  setLang(savedLang);

  const savedTheme = localStorage.getItem('fisi-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = savedTheme === 'dark' ? '🌙 تم' : '☀️ تم';
});