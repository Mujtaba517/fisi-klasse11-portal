/* Grade catalog. Klasse 11 keeps the existing page URLs.
   Klasse 10 is an empty scaffold: no invented subjects or lessons. */
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
    status: 'empty',
    home: 'klasse-10.html',
    lessonDir: 'lessons/grade-10/',
    subjects: []
  }
};

function selectedGrade() {
  var saved = localStorage.getItem('fisi-grade');
  return saved === '10' ? '10' : '11';
}

function applyGrade(grade) {
  var next = grade === '10' ? '10' : '11';
  localStorage.setItem('fisi-grade', next);
  var panel11 = document.getElementById('grade11Panel');
  var panel10 = document.getElementById('grade10Panel');
  if (panel11) panel11.hidden = next !== '11';
  if (panel10) panel10.hidden = next !== '10';
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

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('grade11Panel') || document.getElementById('grade10Panel')) {
    applyGrade(selectedGrade());
  }
});
