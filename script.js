const translations = {
  fa: {
    langLabel: 'زبان',
    themeDark: '🌙 تم',
    themeLight: '☀️ تم',
    navHome: 'خانه',
    navFlash: 'فلش‌کارت',
    navQuiz: 'کوییز',
    backHome: '← بازگشت به خانه',
    backTopics: '← بازگشت به فهرست',
    topicsTitle: 'موضوعات',
    itsSubtitle: 'شبکه‌ها را طراحی و پیاده‌سازی کنید',
    heroTitle: 'پورتال آموزشی صنف ۱۱',
    heroSubtitle: 'شبکه · سیستم‌های سایبر-فیزیکی · داده و API · پشتیبانی IT<br>با توضیحات واضح، مثال واقعی و تمرین تعاملی',
    btnStart: 'شروع یادگیری',
    btnNetwork: '🌐 شبکه و VLAN',
    sectionSubjects: 'مضامین صنف ۱۱',
    sectionTools: 'ابزارهای یادگیری',
    cardITSys: 'شبکه، VLAN، DHCP، DNS، Subnetting و امنیت',
    cardITTec: 'سیستم‌های سایبر-فیزیکی، ESP32، MQTT و IoT',
    cardAEuP: 'داده، SQL، REST API، JSON و یکپارچه‌سازی',
    cardBGWP: 'پردازش درخواست خدمات، SLA و ITIL',
    cardFp: 'کار عملی سوئیچ، روتر و DHCP',
    cardPuG: 'سیاست، جامعه و WiSo',
    tagOpen: 'مطالعه کن →',
    flashTitle: 'فلش‌کارت',
    flashDesc: 'واژگان فنی آلمانی',
    quizTitle: 'کوییز تعاملی',
    quizDesc: 'آزمون چندگزینه‌ای',
    explainTitle: 'توضیح‌گر کوتاه',
    explainDesc: 'درس‌های ۱ دقیقه‌ای',
    footer: 'Fachinformatiker Systemintegration · Klasse 11 · 2026'
  },
  de: {
    langLabel: 'Sprache',
    themeDark: '🌙 Thema',
    themeLight: '☀️ Thema',
    navHome: 'Home',
    navFlash: 'Karteikarten',
    navQuiz: 'Quiz',
    backHome: '← Zurück zur Startseite',
    backTopics: '← Zurück zur Liste',
    topicsTitle: 'Themen',
    itsSubtitle: 'Netzwerke planen und bereitstellen',
    heroTitle: 'Lernportal Klasse 11',
    heroSubtitle: 'Netzwerke · Cyber-physische Systeme · Daten und API · IT-Support<br>Mit klaren Erklärungen, realen Beispielen und interaktiven Übungen',
    btnStart: 'Lernen starten',
    btnNetwork: '🌐 Netzwerk & VLAN',
    sectionSubjects: 'Fächer Klasse 11',
    sectionTools: 'Lernwerkzeuge',
    cardITSys: 'Netzwerke, VLAN, DHCP, DNS, Subnetting und Sicherheit',
    cardITTec: 'Cyber-physische Systeme, ESP32, MQTT und IoT',
    cardAEuP: 'Daten, SQL, REST API, JSON und Integration',
    cardBGWP: 'Serviceanfragen, SLA und ITIL',
    cardFp: 'Praktische Arbeit mit Switch, Router und DHCP',
    cardPuG: 'Politik, Gesellschaft und WiSo',
    tagOpen: 'Öffnen →',
    flashTitle: 'Karteikarten',
    flashDesc: 'Deutsche Fachbegriffe',
    quizTitle: 'Interaktives Quiz',
    quizDesc: 'Multiple-Choice-Test',
    explainTitle: 'Kurzerklärer',
    explainDesc: '1-Minuten-Lektionen',
    footer: 'Fachinformatiker Systemintegration · Klasse 11 · 2026'
  },
  en: {
    langLabel: 'Language',
    themeDark: '🌙 Theme',
    themeLight: '☀️ Theme',
    navHome: 'Home',
    navFlash: 'Flashcards',
    navQuiz: 'Quiz',
    backHome: '← Back to home',
    backTopics: '← Back to list',
    topicsTitle: 'Topics',
    itsSubtitle: 'Plan and deploy networks',
    heroTitle: 'Class 11 Learning Portal',
    heroSubtitle: 'Networks · Cyber-physical systems · Data and API · IT Support<br>With clear explanations, real examples and interactive practice',
    btnStart: 'Start learning',
    btnNetwork: '🌐 Network & VLAN',
    sectionSubjects: 'Class 11 Subjects',
    sectionTools: 'Learning Tools',
    cardITSys: 'Networks, VLAN, DHCP, DNS, Subnetting and security',
    cardITTec: 'Cyber-physical systems, ESP32, MQTT and IoT',
    cardAEuP: 'Data, SQL, REST API, JSON and integration',
    cardBGWP: 'Service requests, SLA and ITIL',
    cardFp: 'Practical work with switches, routers and DHCP',
    cardPuG: 'Politics, society and WiSo',
    tagOpen: 'Open →',
    flashTitle: 'Flashcards',
    flashDesc: 'German technical terms',
    quizTitle: 'Interactive Quiz',
    quizDesc: 'Multiple-choice test',
    explainTitle: 'Short Explainers',
    explainDesc: '1-minute lessons',
    footer: 'Fachinformatiker Systemintegration · Class 11 · 2026'
  }
};

function setLang(lang) {
  const t = translations[lang];
  if (!t) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] != null) el.innerHTML = t[key];
  });
  const label = document.getElementById('langLabel');
  if (label) label.textContent = t.langLabel;
  localStorage.setItem('fisi-lang', lang);
  updateThemeButton();
  closeLangPanel();
}

function updateThemeButton() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const lang = localStorage.getItem('fisi-lang') || 'fa';
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const t = translations[lang] || translations.fa;
  btn.textContent = theme === 'dark' ? t.themeDark : t.themeLight;
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
  updateThemeButton();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('fisi-lang') || 'fa';
  setLang(savedLang);
  const savedTheme = localStorage.getItem('fisi-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton();
});