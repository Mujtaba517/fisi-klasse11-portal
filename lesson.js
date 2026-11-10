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

var QUIZ_PARTS = window.QUIZ_PARTS || {};
var QUIZ_SRC = {
  'it-systeme.html': 'quiz/it-systeme.js',
  'it-technik.html': 'quiz/it-technik.js',
  'aeup.html': 'quiz/aeup.js',
  'bgwp.html': 'quiz/bgwp.js',
  'fachpraxis.html': 'quiz/fachpraxis.js',
  'pug.html': 'quiz/pug.js',
  'englisch.html': 'quiz/englisch.js',
  'k10-fuit.html': 'quiz/k10-fuit.js',
  'k10-ittechnik.html': 'quiz/k10-ittechnik.js',
  'k10-aeup.html': 'quiz/k10-aeup.js',
  'k10-bgwp.html': 'quiz/k10-bgwp.js',
  'k10-englisch.html': 'quiz/k10-englisch.js',
  'k10-projekt.html': 'quiz/k10-projekt.js',
  'k10-pug.html': 'quiz/k10-pug.js'
};

function richText(value) {
  return escapeLesson(value)
    .replace(/`([^`]+)`/g, '<code dir="ltr" class="bdi-ltr">$1</code>')
    .replace(/\b((?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?)\b/g, '<bdi dir="ltr">$1</bdi>');
}

function paragraphs(value) {
  return String(value || '').split(/\n\n+/).filter(Boolean).map(function (part) {
    if (part.indexOf('\n') !== -1) return '<pre class="lesson-code" dir="ltr">' + escapeLesson(part) + '</pre>';
    return '<p>' + richText(part) + '</p>';
  }).join('');
}

function osiFigure() {
  var rows = [
    ['7', 'Anwendung'],
    ['4', 'TCP / UDP'],
    ['3', 'IP'],
    ['2', 'Switch'],
    ['1', 'Kabel']
  ];
  var bands = rows.map(function (row, i) {
    var y = 8 + i * 28;
    return '<rect x="8" y="' + y + '" width="180" height="24" rx="6" fill="currentColor" opacity="' + (0.18 + i * 0.08) + '"></rect>'
      + '<text x="18" y="' + (y + 16) + '" fill="currentColor" font-size="12" font-family="Inter, Vazirmatn, sans-serif">' + row[0] + ' · ' + row[1] + '</text>';
  }).join('');
  return '<figure class="osi-figure"><svg viewBox="0 0 196 156" role="img" aria-label="OSI">' + bands + '</svg></figure>';
}

var OSI_TRANSCRIPT = [
  'Wie gelangen Daten von deinem Computer\nzu einem Webserver?',
  'Das OSI-Modell erklärt die\nNetzwerkkommunikation in sieben Schichten.',
  'Stellt Netzwerkdienste für\nAnwendungen bereit, zum Beispiel HTTP.',
  'Beschreibt Datenformate, Kompression\nund Verschlüsselung.',
  'Organisiert Kommunikationssitzungen.',
  'Verbindet Anwendungen über Ports;',
  'TCP überträgt Daten zuverlässig\nund geordnet.',
  'Leitet IP-Pakete über verschiedene\nNetzwerke zum Ziel.',
  'Überträgt Frames im lokalen Netzwerk,',
  'bei Ethernet mithilfe von MAC-Adressen.',
  'Überträgt Bits als elektrische,\noptische oder Funksignale.',
  'Beim Senden wird die HTTP-Anfrage\nSchritt für Schritt verpackt:',
  'TCP macht daraus ein Segment,',
  'IP ein Paket, Ethernet einen Frame.',
  'Auf dem Kabel werden daraus Signale.',
  'Der Empfänger packt die Daten\nin umgekehrter Reihenfolge wieder aus.',
  'Das OSI-Modell ist ein Referenzmodell:',
  'Es hilft, Netzwerke zu verstehen\nund Fehler systematisch zu suchen.',
  'Reale Internetprotokolle passen nicht\nimmer exakt in diese sieben Schichten.'
];

function osiVideo() {
  var transcript = OSI_TRANSCRIPT.map(function (cue) {
    return '<p>' + escapeLesson(cue).replace(/\n/g, '<br>') + '</p>';
  }).join('');
  return '<figure class="lesson-video">'
    + '<figcaption><h3>' + escapeLesson(lessonLabel('videoOsiTitle')) + '</h3>'
    + '<p>' + escapeLesson(lessonLabel('videoOsiNote')) + '</p></figcaption>'
    + '<div class="lesson-video-frame" dir="ltr">'
    + '<video controls preload="none" playsinline poster="assets/video/osi-modell.webp" width="1920" height="1080">'
    + '<source src="assets/video/osi-modell.mp4" type="video/mp4">'
    + '<track kind="captions" src="assets/video/osi-modell.de.vtt" srclang="de" label="Deutsch">'
    + '</video></div>'
    + '<details class="lesson-transcript"><summary>' + escapeLesson(lessonLabel('videoTranscript')) + ' · ' + escapeLesson(lessonLabel('videoTranscriptLang')) + '</summary>'
    + '<div lang="de" dir="ltr">' + transcript + '</div></details>'
    + '</figure>';
}

function termList(terms) {
  return '<dl class="term-list">' + (terms || []).map(function (item) {
    return '<dt>' + richText(item.t) + '</dt><dd>' + richText(item.d) + '</dd>';
  }).join('') + '</dl>';
}

function tableHtml(table) {
  if (!table) return '';
  var head = (table.headers || []).map(function (cell) { return '<th>' + richText(cell) + '</th>'; }).join('');
  var body = (table.rows || []).map(function (row) {
    return '<tr>' + row.map(function (cell) { return '<td>' + richText(cell) + '</td>'; }).join('') + '</tr>';
  }).join('');
  return '<table class="term-table"><caption>' + richText(table.caption || '') + '</caption><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>';
}

var VIDEO_SUBJECTS = {
  'aeup.html': 'aeup',
  'bgwp.html': 'bgwp',
  'fachpraxis.html': 'fachpraxis',
  'it-systeme.html': 'it-systeme',
  'it-technik.html': 'it-technik',
  'pug.html': 'pug',
  'k10-aeup.html': 'k10-aeup',
  'k10-bgwp.html': 'k10-bgwp',
  'k10-fuit.html': 'k10-fuit',
  'k10-ittechnik.html': 'k10-ittechnik',
  'k10-projekt.html': 'k10-projekt',
  'k10-pug.html': 'k10-pug'
};

function srtHtml(text) {
  return String(text || '').replace(/\r\n/g, '\n').trim().split(/\n\n+/).map(function (block) {
    var lines = block.split('\n');
    if (lines.length < 3) return '';
    return '<p>' + escapeLesson(lines.slice(2).join('\n')).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

function lessonVideo(page, id) {
  if (page === 'it-systeme.html' && id === 'osi') return osiVideo();
  var subject = VIDEO_SUBJECTS[page];
  if (!subject) return '';
  var base = 'assets/video/' + subject + '/' + id;
  return '<figure class="lesson-video">'
    + '<figcaption><h3>' + escapeLesson(lessonLabel('videoLessonTitle')) + '</h3>'
    + '<p>' + escapeLesson(lessonLabel('videoLessonNote')) + '</p></figcaption>'
    + '<div class="lesson-video-frame" dir="ltr">'
    + '<video controls preload="none" playsinline poster="' + base + '.webp" width="1920" height="1080">'
    + '<source src="' + base + '.mp4" type="video/mp4">'
    + '<track kind="subtitles" src="' + base + '.vtt" srclang="de" label="Deutsch" default>'
    + '</video></div>'
    + '<details class="lesson-transcript"><summary>' + escapeLesson(lessonLabel('videoTranscript')) + ' · ' + escapeLesson(lessonLabel('videoTranscriptLang')) + '</summary>'
    + '<div lang="de" dir="ltr" data-transcript="' + base + '.srt"></div></details>'
    + '</figure>';
}

function holdReducedMotion(stage) {
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  stage.querySelectorAll('video').forEach(function (video) {
    video.autoplay = false;
    video.pause();
  });
}

document.addEventListener('toggle', function (e) {
  var details = e.target;
  if (!details.classList || !details.classList.contains('lesson-transcript') || !details.open) return;
  var box = details.querySelector('[data-transcript]');
  if (!box || box.getAttribute('data-loaded')) return;
  box.setAttribute('data-loaded', '1');
  fetch(box.getAttribute('data-transcript')).then(function (res) {
    if (!res.ok) throw new Error('transcript');
    return res.text();
  }).then(function (text) {
    box.innerHTML = srtHtml(text);
  }).catch(function () {
    box.textContent = lessonLabel('videoTranscriptMissing');
  });
}, true);

function lessonSteps(entry, page, id) {
  if (entry.full) {
    return [
      { key: 'objTitle', html: paragraphs(entry.goal) + lessonVideo(page, id) },
      { key: 'priorTitle', html: paragraphs(entry.prior) },
      { key: 'whyTitle', html: paragraphs(entry.why) },
      { key: 'termsTitle', html: termList(entry.terms) },
      { key: 'stepsTitle', html: '<ol class="plain-steps">' + (entry.steps || []).map(function (step) { return '<li>' + richText(step) + '</li>'; }).join('') + '</ol>' },
      { key: 'exampleTitle', html: paragraphs(entry.example) + '<div id="erPlayer"></div>' + (window.lernovaErStatic ? lernovaErStatic() : '') },
      { key: 'tableTitle', html: tableHtml(entry.table) },
      { key: 'mistakeTitle', html: '<ul>' + (entry.mistakes || []).map(function (item) { return '<li>' + richText(item) + '</li>'; }).join('') + '</ul>' },
      { key: 'lessonSummary', html: '<p>' + richText(entry.summary) + '</p><p class="source-note"><strong>' + escapeLesson(lessonLabel('sourcesTitle')) + '</strong> <bdi dir="ltr">' + escapeLesson(entry.sources || '') + '</bdi></p><p class="source-note"><a href="' + escapeLesson((lessonPack(page) && lessonPack(page).quiz) || 'quiz.html') + '">' + escapeLesson(lessonLabel('openQuiz')) + '</a> · <a href="' + escapeLesson((lessonPack(page) && lessonPack(page).cards) || 'flashcards.html') + '">' + escapeLesson(lessonLabel('openCards')) + '</a></p>' },
      { key: 'pathPractice', html: '<div id="practiceMount"><div class="skeleton"></div><div class="skeleton"></div></div>' }
    ];
  }
  var steps = [
    { key: 'lessonDefinition', html: paragraphs(entry.definition) + lessonVideo(page, id) },
    { key: 'lessonExplain', html: paragraphs(entry.explanation) + (id === 'osi' ? osiFigure() : '') },
    { key: 'lessonExample', html: paragraphs(entry.example) },
    { key: 'lessonRemember', html: '<ul>' + (entry.remember || []).map(function (item) { return '<li>' + richText(item) + '</li>'; }).join('') + '</ul>' },
    { key: 'pathPractice', html: '<div id="practiceMount"><div class="skeleton"></div><div class="skeleton"></div></div>' }
  ];
  return steps;
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

function quizKeyFor(page) {
  var src = QUIZ_SRC[page] || '';
  return src.replace(/^quiz\//, '').replace(/\.js$/, '');
}

function loadQuiz(page) {
  window.QUIZ_PARTS = window.QUIZ_PARTS || QUIZ_PARTS;
  var src = QUIZ_SRC[page];
  if (!src) return Promise.resolve([]);
  var key = quizKeyFor(page);
  if (window.QUIZ_PARTS[key]) return Promise.resolve(window.QUIZ_PARTS[key]);
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = function () { resolve(window.QUIZ_PARTS[key] || []); };
    script.onerror = function () { reject(new Error(src)); };
    document.body.appendChild(script);
  });
}

function txField(obj) {
  if (!obj) return '';
  var lang = lessonLang();
  return obj[lang] || obj.de || obj.en || '';
}

function mountPractice(page, topicId, mount) {
  loadQuiz(page).then(function (list) {
    var pool = (list || []).filter(function (q) { return q.topic === topicId && q.type === 'single'; });
    if (!pool.length) pool = (list || []).filter(function (q) { return q.topic === topicId; });
    var preferred = pool.filter(function (q) { return q.id === 'aeup-er-card-side'; });
    var fresh = pool.filter(function (q) { return !q.legacy; });
    var question = preferred[0] || fresh[0] || pool[0];
    if (!question) {
      mount.innerHTML = '<p>' + escapeLesson(lessonLabel('noPractice')) + '</p>';
      return;
    }
    var picked = null;
    var attempted = false;
    function choiceText(key) {
      var choices = txField(question.choices);
      if (!Array.isArray(choices)) return key;
      var found = choices.filter(function (c) { return c.key === key; })[0];
      return found ? found.text : key;
    }
    function draw() {
      var choices = txField(question.choices);
      var buttons = (Array.isArray(choices) ? choices : []).map(function (c) {
        var on = picked === c.key ? ' aria-pressed="true"' : ' aria-pressed="false"';
        return '<button type="button" data-choice="' + escapeLesson(c.key) + '"' + on + '><bdi dir="ltr">' + escapeLesson(c.text) + '</bdi></button>';
      }).join('');
      mount.innerHTML = '<p>' + richText(txField(question.q)) + '</p>'
        + '<div class="practice-options">' + buttons + '</div>'
        + '<div class="practice-actions"><button type="button" class="btn btn-primary" data-check>' + escapeLesson(lessonLabel('checkAnswer')) + '</button></div>'
        + '<div class="practice-feedback" hidden></div>';
      mount.querySelectorAll('[data-choice]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          picked = btn.getAttribute('data-choice');
          mount.querySelectorAll('[data-choice]').forEach(function (other) {
            other.setAttribute('aria-pressed', other === btn ? 'true' : 'false');
          });
        });
      });
      mount.querySelector('[data-check]').addEventListener('click', grade);
    }
    function grade() {
      if (!picked) return;
      attempted = true;
      var right = (question.answer || [])[0];
      var ok = picked === right;
      var box = mount.querySelector('.practice-feedback');
      box.hidden = false;
      var explain = richText(txField(question.explain));
      box.innerHTML = '';
      box.classList.remove('is-right', 'is-wrong');
      box.classList.add(ok ? 'is-right' : 'is-wrong');
      if (window.lernovaGuide) lernovaGuide(box, ok ? 'celebrate' : 'encourage');
      if (ok) {
        box.insertAdjacentHTML('beforeend', '<p><strong>' + escapeLesson(lessonLabel('practiceRight')) + '</strong> ' + explain + '</p>');
        if (typeof recordActivity === 'function') recordActivity(page, topicId, { title: topicId, checked: true });
      } else {
        box.insertAdjacentHTML('beforeend', '<p><strong>' + escapeLesson(lessonLabel('practiceWrong')) + '</strong> ' + explain + '</p>'
          + '<div class="practice-actions"><button type="button" class="btn btn-soft" data-retry>' + escapeLesson(lessonLabel('tryAgain')) + '</button>'
          + '<button type="button" class="btn btn-primary" data-reveal>' + escapeLesson(lessonLabel('showAnswer')) + '</button></div>');
        box.querySelector('[data-retry]').addEventListener('click', function () {
          picked = null;
          draw();
        });
        box.querySelector('[data-reveal]').addEventListener('click', function () {
          if (!attempted) return;
          var note = document.createElement('p');
          note.innerHTML = '<strong>' + escapeLesson(lessonLabel('answerLabel')) + '</strong> <bdi dir="ltr">' + escapeLesson(choiceText(right)) + '</bdi>';
          box.appendChild(note);
        });
      }
    }
    draw();
  }).catch(function () {
    mount.innerHTML = '<p>' + escapeLesson(lessonLabel('noPractice')) + '</p>';
  });
}

var stepMemory = {};

function mountSteps(root, page, id, entry) {
  var steps = lessonSteps(entry, page, id);
  var remembered = stepMemory[id];
  var index = root.getAttribute('data-open-practice') === '1'
    ? steps.length - 1
    : (typeof remembered === 'number' ? Math.min(remembered, steps.length - 1) : 0);
  var rail = root.querySelector('.step-rail');
  var stage = root.querySelector('.step-stage');
  function show(next) {
    index = next;
    stepMemory[id] = next;
    rail.querySelectorAll('button').forEach(function (btn, i) {
      btn.setAttribute('aria-current', i === index ? 'step' : 'false');
    });
    var step = steps[index];
    stage.innerHTML = '<p class="step-kicker"><bdi dir="ltr">' + (index + 1) + '</bdi> ' + escapeLesson(lessonLabel('stepOf')) + ' <bdi dir="ltr">' + steps.length + '</bdi></p>'
      + '<h2>' + escapeLesson(lessonLabel(step.key)) + '</h2>'
      + step.html
      + '<div class="step-actions">'
      + (index > 0 ? '<button type="button" class="btn btn-soft" data-step-prev>' + escapeLesson(lessonLabel('prevStep')) + '</button>' : '')
      + (index < steps.length - 1 ? '<button type="button" class="btn btn-primary" data-step-next>' + escapeLesson(lessonLabel('nextStep')) + '</button>' : '')
      + '</div>';
    var prev = stage.querySelector('[data-step-prev]');
    var nextBtn = stage.querySelector('[data-step-next]');
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });
    var practice = stage.querySelector('#practiceMount');
    if (practice) mountPractice(page, id, practice);
    var player = stage.querySelector('#erPlayer');
    if (player && window.lernovaErPlayer) lernovaErPlayer(player, entry.anim || []);
    if (window.lernovaGuide && (index === 0 || step.key === 'lessonSummary')) {
      lernovaGuide(stage, step.key === 'lessonSummary' ? 'celebrate' : 'explain');
    }
    holdReducedMotion(stage);
  }
  rail.innerHTML = steps.map(function (step, i) {
    return '<li><button type="button" data-step="' + i + '">' + escapeLesson(lessonLabel(step.key)) + '</button></li>';
  }).join('');
  rail.querySelectorAll('button').forEach(function (btn) {
    btn.addEventListener('click', function () { show(Number(btn.getAttribute('data-step'))); });
  });
  show(index);
}

function renderLessonDocument(page, id, list, openPractice) {
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
  var banner = page === 'it-systeme.html'
    ? '<p class="placeholder-banner">' + escapeLesson(lessonLabel('placeholderBanner')) + '</p>'
    : '';
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
    + banner
    + '<div class="step-layout" data-open-practice="' + (openPractice ? '1' : '0') + '">'
    + '<ol class="step-rail"></ol><div class="step-stage"></div></div>'
    + '<p class="related"><a href="' + escapeLesson(quiz) + '">' + escapeLesson(lessonLabel('lessonQuiz')) + '</a>'
    + ' · <a href="' + escapeLesson(cards) + '">' + escapeLesson(lessonLabel('lessonCards')) + '</a></p>'
    + nav;
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

  function renderOverview(container, overview) {
    var list = document.createElement('ol');
    list.className = 'path-list';
    var lang = lessonLang();
    overview.forEach(function (item, index) {
      var lesson = item.id ? lessonEntry(page, item.id) : null;
      var title = lesson ? lesson.title : ((item.title && (item.title[lang] || item.title.de)) || '');
      var teach = item.teaches ? (item.teaches[lang] || item.teaches.de || '') : (lesson ? String(lesson.definition || '').split('. ')[0] : '');
      var ready = item.status === 'available' && !!lesson;
      var row = document.createElement('li');
      row.className = 'path-step' + (ready ? '' : ' is-prep');
      var actions = ready
        ? '<a href="#' + encodeURIComponent(item.id) + '" data-open="' + escapeLesson(item.id) + '">' + escapeLesson(lessonLabel('pathOpen')) + '</a><a href="#' + encodeURIComponent(item.id) + '" data-practice="' + escapeLesson(item.id) + '">' + escapeLesson(lessonLabel('pathPractice')) + '</a>'
        : '';
      row.innerHTML = '<span class="path-index"><bdi dir="ltr">' + (index + 1) + '</bdi></span><div><h3>' + escapeLesson(title) + '</h3><p class="path-teach">' + richText(teach) + '</p><div class="path-meta"><span class="path-pages"><bdi dir="ltr">' + escapeLesson(item.pages || '') + '</bdi></span><span class="path-status">' + escapeLesson(lessonLabel(ready ? 'statusAvailable' : 'statusPrep')) + '</span>' + actions + '</div></div>';
      list.appendChild(row);
    });
    container.replaceChildren(list);
    container.querySelectorAll('[data-open]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showTopic(link.getAttribute('data-open'), false);
      });
    });
    container.querySelectorAll('[data-practice]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showTopic(link.getAttribute('data-practice'), true);
      });
    });
  }

  function renderList() {
    var container = document.getElementById('topicList');
    if (!container) return;
    var pack = lessonPack(page);
    if (pack && pack.overview) {
      renderOverview(container, pack.overview);
      return;
    }
    var list = document.createElement('ol');
    list.className = 'path-list';
    entries().forEach(function (topic, index) {
      var entry = lessonEntry(page, topic.id) || {};
      var teach = String(entry.definition || '').split('. ')[0];
      var ready = !!(entry.definition && entry.explanation);
      var item = document.createElement('li');
      item.className = 'path-step';
      item.innerHTML = '<span class="path-index"><bdi dir="ltr">' + (index + 1) + '</bdi></span><div><h3>' + escapeLesson(topic.title) + '</h3><p class="path-teach">' + richText(teach) + '</p><div class="path-meta"><span class="path-status">' + escapeLesson(lessonLabel(ready ? 'statusAvailable' : 'statusPrep')) + '</span><a href="#' + encodeURIComponent(topic.id) + '" data-open="' + escapeLesson(topic.id) + '">' + escapeLesson(lessonLabel('pathOpen')) + '</a><a href="#' + encodeURIComponent(topic.id) + '" data-practice="' + escapeLesson(topic.id) + '">' + escapeLesson(lessonLabel('pathPractice')) + '</a></div></div>';
      list.appendChild(item);
    });
    container.replaceChildren(list);
    container.querySelectorAll('[data-open]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showTopic(link.getAttribute('data-open'), false);
      });
    });
    container.querySelectorAll('[data-practice]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showTopic(link.getAttribute('data-practice'), true);
      });
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

  function showTopic(id, openPractice) {
    var list = entries();
    var known = null;
    list.forEach(function (topic) { if (topic.id === id) known = topic; });
    if (!known) { showList(); return; }
    var entry = lessonEntry(page, id);
    var root = document.getElementById('singleTopicContent');
    root.innerHTML = renderLessonDocument(page, id, list, openPractice);
    var layout = root.querySelector('.step-layout');
    if (layout && entry) mountSteps(layout, page, id, entry);
    document.getElementById('topicListView').style.display = 'none';
    document.getElementById('topicContentView').style.display = 'block';
    viewing = true;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    window.scrollTo(0, 0);
    bindNav(root);
    if (typeof recordActivity === 'function') recordActivity(page, id, { title: known.title });
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
