/* Grade catalog. Klasse 11 keeps the existing page URLs.
   Klasse 10 uses the reviewed lessons from the readable class materials.
   Klasse 12 is an empty placeholder for now (no subjects yet). */
var GRADE_CATALOG = {
  '11': {
    id: '11',
    status: 'ready',
    home: 'index.html',
    lessonDir: 'lessons/',
    subjects: [
      'it-systeme.html',
      'it-technik.html',
      'aeup.html',
      'bgwp.html',
      'fachpraxis.html',
      'pug.html',
      'englisch.html'
    ]
  },
  '10': {
    id: '10',
    status: 'ready',
    home: 'klasse-10.html',
    lessonDir: 'lessons/grade-10/',
    subjects: [
      'k10-fuit.html',
      'k10-ittechnik.html',
      'k10-aeup.html',
      'k10-bgwp.html',
      'k10-englisch.html',
      'k10-projekt.html',
      'k10-pug.html'
    ]
  }
};

/* Texts for the Klasse 12 placeholder. script.js is loaded before this file. */
(function () {
  if (typeof translations === 'undefined') return;
  var extra = {
    de: { grade12: 'Klasse 12', pathway12: 'Jahrgangsstufe 12 · drittes Ausbildungsjahr', grade12Title: 'Klasse 12', grade12EmptyTitle: 'Dieser Bereich ist noch leer', grade12Empty: 'Für Klasse 12 gibt es noch keine Fächer und Lektionen. Sie kommen später dazu.' },
    en: { grade12: 'Year 12', pathway12: 'Year 12 · third training year', grade12Title: 'Year 12', grade12EmptyTitle: 'This section is still empty', grade12Empty: 'There are no subjects or lessons for year 12 yet. They will be added later.' },
    fa: { grade12: 'کلاس ۱۲', pathway12: 'پایه ۱۲ · سال سوم آموزش', grade12Title: 'کلاس ۱۲', grade12EmptyTitle: 'این بخش هنوز خالی است', grade12Empty: 'برای کلاس ۱۲ هنوز مضمون و درسی نیست. بعداً اضافه می‌شود.' }
  };
  Object.keys(extra).forEach(function (lang) {
    if (!translations[lang]) return;
    Object.keys(extra[lang]).forEach(function (key) { translations[lang][key] = extra[lang][key]; });
  });
})();

function selectedGrade() {
  var saved = localStorage.getItem('fisi-grade');
  return saved === '10' ? '10' : '11';
}

/* Klasse 12 is only shown on this page. It is not saved as the chosen grade,
   so other pages keep working with Klasse 10 or 11 until Klasse 12 has content. */
function applyGrade(grade) {
  var next = grade === '10' ? '10' : (grade === '12' ? '12' : '11');
  if (next !== '12') localStorage.setItem('fisi-grade', next);
  var panel11 = document.getElementById('grade11Panel');
  var panel10 = document.getElementById('grade10Panel');
  var panel12 = document.getElementById('grade12Panel');
  if (panel11) panel11.hidden = next !== '11';
  if (panel10) panel10.hidden = next !== '10';
  if (panel12) panel12.hidden = next !== '12';
  document.querySelectorAll('[data-grade]').forEach(function (btn) {
    var on = btn.getAttribute('data-grade') === next;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

document.addEventListener('click', function (e) {
  var btn = e.target.closest && e.target.closest('[data-grade]');
  if (!btn) return;
  applyGrade(btn.getAttribute('data-grade'));
});

function renderContinue() {
  var card = document.getElementById('continueCard');
  if (!card || typeof latestActivity !== 'function') return;
  var latest = latestActivity();
  card.replaceChildren();
  if (!latest) {
    card.hidden = true;
    return;
  }
  var lang = document.documentElement.lang || 'fa';
  var t = (window.translations && translations[lang]) || translations.de;
  var title = document.createElement('h2');
  title.textContent = t.continueTitle || 'Continue';
  var line = document.createElement('p');
  line.textContent = latest.title;
  var link = document.createElement('a');
  link.className = 'btn btn-primary';
  link.href = latest.page + '#' + latest.id;
  link.textContent = t.continueOpen || 'Open';
  card.hidden = false;
  card.append(title, line, link);
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('grade11Panel') || document.getElementById('grade10Panel')) {
    applyGrade(selectedGrade());
  }
  renderContinue();
});
document.addEventListener('fisi-lang', renderContinue);
