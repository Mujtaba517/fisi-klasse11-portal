/* Renders one lesson shape for every subject. Headings come from script.js translations. */
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

function lessonPack(page) {
  return (window.LESSON_PACKS && LESSON_PACKS[page]) || null;
}

function lessonLang() {
  return document.documentElement.lang || localStorage.getItem('fisi-lang') || 'fa';
}

function lessonLabel(key) {
  var table = window.translations || {};
  var lang = lessonLang();
  var pack = table[lang] || table.de || {};
  return pack[key] || (table.de && table.de[key]) || key;
}

function escapeLesson(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

function richText(value) {
  return escapeLesson(value).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function paragraphs(value) {
  return String(value || '').split(/\n\n+/).filter(Boolean).map(function (part) {
    if (part.indexOf('\n') !== -1) return '<pre class="lesson-code">' + escapeLesson(part) + '</pre>';
    return '<p>' + richText(part) + '</p>';
  }).join('');
}

function lessonEntry(page, id) {
  var pack = lessonPack(page);
  var lang = lessonLang();
  if (!pack || !pack[lang] || !pack[lang][id]) return null;
  return pack[lang][id];
}

function lessonHtml(id) {
  var page = (location.pathname.split('/').pop() || '');
  var entry = lessonEntry(page, id);
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  return renderLessonBody(entry);
}

function renderLessonBody(entry) {
  var points = (entry.remember || []).map(function (item) {
    return '<li>' + richText(item) + '</li>';
  }).join('');
  var html = '';
  if (entry.goal && entry.goal !== entry.definition) {
    html += '<p class="lesson-kicker">' + escapeLesson(lessonLabel('lessonGoal')) + '</p>'
      + '<p class="lesson-goal">' + richText(entry.goal) + '</p>';
  }
  html += '<section class="lesson-section"><h3>' + escapeLesson(lessonLabel('lessonDefinition')) + '</h3>' + paragraphs(entry.definition) + '</section>'
    + '<section class="lesson-section"><h3>' + escapeLesson(lessonLabel('lessonExplain')) + '</h3>' + paragraphs(entry.explanation) + '</section>'
    + '<section class="lesson-section"><h3>' + escapeLesson(lessonLabel('lessonExample')) + '</h3>' + paragraphs(entry.example) + '</section>'
    + '<section class="lesson-section"><h3>' + escapeLesson(lessonLabel('lessonRemember')) + '</h3><ul>' + points + '</ul></section>';
  if (entry.summary) {
    html += '<section class="lesson-section"><h3>' + escapeLesson(lessonLabel('lessonSummary')) + '</h3><p class="lesson-summary">' + richText(entry.summary) + '</p></section>';
  }
  return html;
}

function renderLessonDocument(page, id, list) {
  var pack = lessonPack(page);
  var entry = lessonEntry(page, id);
  if (!entry) return '';
  var index = -1;
  for (var i = 0; i < list.length; i++) if (list[i].id === id) index = i;
  var prev = index > 0 ? list[index - 1] : null;
  var next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
  var subject = pack && pack.subject ? (pack.subject[lessonLang()] || pack.subject.de) : page;
  var gradeKey = pack && pack.grade === '10' ? 'grade10' : 'grade11';
  var quiz = (pack && pack.quiz) || 'quiz.html';
  var cards = (pack && pack.cards) || 'flashcards.html';
  var nav = '<nav class="lesson-nav" aria-label="' + escapeLesson(subject) + '">';
  nav += prev
    ? '<a href="#' + encodeURIComponent(prev.id) + '" data-nav="' + escapeLesson(prev.id) + '">' + escapeLesson(lessonLabel('lessonPrev')) + '</a>'
    : '<span></span>';
  nav += next
    ? '<a href="#' + encodeURIComponent(next.id) + '" data-nav="' + escapeLesson(next.id) + '">' + escapeLesson(lessonLabel('lessonNext')) + '</a>'
    : '<span></span>';
  nav += '</nav>';
  return ''
    + '<nav class="breadcrumb" aria-label="Breadcrumb">'
    + '<a href="index.html">' + escapeLesson(lessonLabel('navHome')) + '</a>'
    + ' <span aria-hidden="true">/</span> '
    + '<span>' + escapeLesson(lessonLabel(gradeKey)) + '</span>'
    + ' <span aria-hidden="true">/</span> '
    + '<button type="button" class="lesson-jump" data-nav="list">' + escapeLesson(subject) + '</button>'
    + ' <span aria-hidden="true">/</span> '
    + '<span>' + escapeLesson(entry.title || '') + '</span>'
    + '</nav>'
    + '<article class="card lesson-block"><h2>' + escapeLesson(entry.title || '') + '</h2>'
    + renderLessonBody(entry)
    + '<p class="related"><a href="' + escapeLesson(quiz) + '">' + escapeLesson(lessonLabel('lessonQuiz')) + '</a>'
    + ' · <a href="' + escapeLesson(cards) + '">' + escapeLesson(lessonLabel('lessonCards')) + '</a></p>'
    + nav
    + '</article>';
}

function bootSubjectPage(page) {
  var viewing = false;

  function entries() {
    var pack = lessonPack(page);
    var lang = lessonLang();
    if (!pack || !pack[lang]) return [];
    var order = pack.order || Object.keys(pack.de || {});
    return order.filter(function (id) { return pack[lang][id]; }).map(function (id) {
      return { id: id, title: pack[lang][id].title };
    });
  }

  function renderList() {
    var container = document.getElementById('topicList');
    if (!container) return;
    container.innerHTML = '';
    entries().forEach(function (topic) {
      var link = document.createElement('a');
      link.href = '#' + topic.id;
      link.className = 'topic-item';
      link.innerHTML = '<h3>' + escapeLesson(topic.title) + '</h3><span class="chev" aria-hidden="true"></span>';
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showTopic(topic.id);
      });
      container.appendChild(link);
    });
  }

  function bindNav(root) {
    root.querySelectorAll('[data-nav]').forEach(function (node) {
      node.addEventListener('click', function (e) {
        e.preventDefault();
        var target = node.getAttribute('data-nav');
        if (target === 'list') showList();
        else showTopic(target);
      });
    });
  }

  function showTopic(id) {
    var list = entries();
    var known = list.some(function (topic) { return topic.id === id; });
    if (!known) { showList(); return; }
    var root = document.getElementById('singleTopicContent');
    root.innerHTML = renderLessonDocument(page, id, list);
    document.getElementById('topicListView').style.display = 'none';
    document.getElementById('topicContentView').style.display = 'block';
    viewing = true;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    window.scrollTo(0, 0);
    bindNav(root);
  }

  function showList() {
    document.getElementById('topicContentView').style.display = 'none';
    document.getElementById('topicListView').style.display = 'block';
    viewing = false;
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    renderList();
  }

  function initFromHash() {
    var hash = location.hash.slice(1);
    if (hash && entries().some(function (topic) { return topic.id === hash; })) showTopic(hash);
    else renderList();
  }

  window.smartBack = function () {
    if (viewing) showList();
    else {
      var pack = lessonPack(page);
      if (pack && pack.grade) localStorage.setItem('fisi-grade', String(pack.grade));
      window.location.href = 'index.html';
    }
  };
  window.initFromHash = initFromHash;
  var previous = window.setLang;
  window.setLang = function (code) {
    if (typeof previous === 'function') previous(code);
    if (viewing && location.hash.length > 1) showTopic(location.hash.slice(1));
    else renderList();
  };
  window.addEventListener('hashchange', initFromHash);
  initFromHash();
}
