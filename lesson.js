/* Reveal model answers inside lessons. Does not grade free text. */
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.reveal-btn');
    if (!btn) return;
    var ans = btn.parentElement.querySelector('.answer');
    if (!ans) return;
    var open = ans.hasAttribute('hidden');
    if (open) ans.removeAttribute('hidden');
    else ans.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

function lessonHtml(id) {
  var page = (location.pathname.split('/').pop() || '');
  var lang = document.documentElement.lang || localStorage.getItem('fisi-lang') || 'fa';
  var pack = window.LESSON_PACKS && LESSON_PACKS[page];
  if (!pack || !pack[lang]) return null;
  return pack[lang][id] || null;
}
