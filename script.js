const translations = {
  fa: {
    heroTitle: 'پورتال آموزشی صنف ۱۱',
    heroSubtitle: 'مضامین واقعی مدرسه · تمرین · فلش‌کارت · کوییز · آمادگی IHK',
    btnStart: 'شروع یادگیری',
    btnQuiz: 'کوییز',
    navHome: 'خانه',
    navFlash: 'فلش‌کارت',
    navQuiz: 'کوییز',
    sectionSubjects: 'مضامین صنف ۱۱',
    sectionTools: 'ابزار یادگیری',
    cardBGWP: 'پردازش درخواست خدمات، SLA، پشتیبانی و ارتباط با مشتری',
    cardITTec: 'سیستم‌های سایبر-فیزیکی، سنسور، ESP32، MQTT',
    cardAEuP: 'داده، SQL، API، JSON و یکپارچه‌سازی سیستم‌ها',
    cardITSys: 'شبکه، DHCP، DNS، VLAN، سرویس‌ها و امنیت',
    cardFp: 'کار عملی کارگاهی و پروژه‌های فنی',
    cardPuG: 'سیاست و جامعه · پایه WiSo برای امتحان',
    tagOpen: 'باز کردن',
    flashTitle: 'فلش‌کارت اصطلاحات',
    flashDesc: 'واژگان فنی آلمانی با کارت‌های تعاملی',
    quizTitle: 'کوییز تعاملی',
    quizDesc: 'آزمون چندگزینه‌ای با امتیاز',
    langLabel: 'زبان',
    backHome: '← بازگشت به خانه',
    footer: 'Fachinformatiker Systemintegration · Klasse 11 · 2026'
  },
  de: {
    heroTitle: 'Lernportal Klasse 11',
    heroSubtitle: 'Echte Schulfächer · Übungen · Karteikarten · Quiz · IHK-Vorbereitung',
    btnStart: 'Lernen starten',
    btnQuiz: 'Quiz',
    navHome: 'Home',
    navFlash: 'Karteikarten',
    navQuiz: 'Quiz',
    sectionSubjects: 'Fächer Klasse 11',
    sectionTools: 'Lern-Tools',
    cardBGWP: 'Serviceanfragen, SLA, Support und Kundenkommunikation',
    cardITTec: 'Cyber-physische Systeme, Sensoren, ESP32, MQTT',
    cardAEuP: 'Daten, SQL, API, JSON und Systemintegration',
    cardITSys: 'Netzwerke, DHCP, DNS, VLAN, Dienste und Sicherheit',
    cardFp: 'Praktische Werkstatt- und Projektarbeit',
    cardPuG: 'Politik und Gesellschaft · Basis für WiSo',
    tagOpen: 'Öffnen',
    flashTitle: 'Fachbegriff-Karteikarten',
    flashDesc: 'Deutsche Fachbegriffe interaktiv lernen',
    quizTitle: 'Interaktives Quiz',
    quizDesc: 'Multiple-Choice mit Punktzahl',
    langLabel: 'Sprache',
    backHome: '← Zurück zur Startseite',
    footer: 'Fachinformatiker Systemintegration · Klasse 11 · 2026'
  },
  en: {
    heroTitle: 'Class 11 Learning Portal',
    heroSubtitle: 'Real school subjects · exercises · flashcards · quiz · IHK prep',
    btnStart: 'Start learning',
    btnQuiz: 'Quiz',
    navHome: 'Home',
    navFlash: 'Flashcards',
    navQuiz: 'Quiz',
    sectionSubjects: 'Class 11 subjects',
    sectionTools: 'Learning tools',
    cardBGWP: 'Service requests, SLA, support and customer communication',
    cardITTec: 'Cyber-physical systems, sensors, ESP32, MQTT',
    cardAEuP: 'Data, SQL, API, JSON and system integration',
    cardITSys: 'Networks, DHCP, DNS, VLAN, services and security',
    cardFp: 'Hands-on workshop and project work',
    cardPuG: 'Politics & society · base for WiSo exam',
    tagOpen: 'Open',
    flashTitle: 'Terminology flashcards',
    flashDesc: 'Learn German technical terms interactively',
    quizTitle: 'Interactive quiz',
    quizDesc: 'Multiple-choice with scoring',
    langLabel: 'Language',
    backHome: '← Back to home',
    footer: 'Fachinformatiker Systemintegration · Class 11 · 2026'
  }
};

function setLang(lang) {
  const t = translations[lang];
  if (!t) return;
  try {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll('.lang-panel button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    const label = document.getElementById('langLabel');
    if (label) label.textContent = t.langLabel || 'Language';
    localStorage.setItem('fisi-lang', lang);
  } catch (e) {
    console.warn('lang switch error', e);
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('fisi-lang') || 'fa';
  setLang(saved);
});