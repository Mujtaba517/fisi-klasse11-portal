/* Subject quiz. Choice order is shuffled; grading uses stable choice keys. */
(function () {
  const ui = {
    fa: {
      pick: 'آزمون را انتخاب کن',
      subject: 'مضمون',
      topic: 'موضوع',
      level: 'سطح',
      allTopics: 'همه موضوع‌ها',
      allLevels: 'همه سطح‌ها',
      mixed: 'مرور ترکیبی این مسیر',
      legacy: 'آزمون اولیه ۱۲سؤالی',
      count: 'تعداد سؤال',
      available: 'سؤال موجود',
      start: 'شروع',
      empty: 'با این فیلتر سؤالی نیست.',
      progress: 'پیشرفت',
      submit: 'ثبت',
      next: 'بعدی',
      back: 'بازگشت به انتخاب',
      correct: 'درست',
      wrong: 'نادرست',
      self: 'خودارزیابی، بدون نمره خودکار',
      summary: 'نتیجه',
      graded: 'نمره سؤال‌های قابل تصحیح',
      review: 'مرور پاسخ‌های غلط',
      retry: 'دوباره با ترتیب تازه',
      again: 'انتخاب دیگر',
      why: 'چرا',
      worked: 'راه‌حل',
      orderHint: 'به ترتیب درست انتخاب کن.',
      undo: 'برگردان',
      shortHint: 'پاسخ را بنویس. نمره خودکار ندارد؛ بعد از ثبت، پاسخ راهنما را ببین.',
      your: 'پاسخ تو',
      model: 'پاسخ راهنما',
      basic: 'پایه',
      applied: 'کاربردی',
      transfer: 'انتقال',
      single: 'تک‌گزینه‌ای',
      multi: 'چندگزینه‌ای',
      order: 'مرتب‌سازی',
      short: 'پاسخ کوتاه',
      note: 'این‌ها سؤال رسمی IHK نیستند. عدد کنار هر مضمون، تعداد سؤال همان پرونده است و صنف ۱۰ را هم شامل می‌شود اگر انتخاب شده باشد. بانک هنوز ناقص است و به ۵۰ سؤال در هر مضمون نرسیده. سال ۱۲ و AP2 این‌جا نیستند.',
      of: 'از'
    },
    de: {
      pick: 'Quiz auswählen',
      subject: 'Fach',
      topic: 'Thema',
      level: 'Niveau',
      allTopics: 'Alle Themen',
      allLevels: 'Alle Niveaus',
      mixed: 'Gemischte Wiederholung dieses Wegs',
      legacy: 'Ursprüngliches 12-Fragen-Quiz',
      count: 'Fragenanzahl',
      available: 'Fragen verfügbar',
      start: 'Starten',
      empty: 'Keine Fragen für diesen Filter.',
      progress: 'Fortschritt',
      submit: 'Antwort prüfen',
      next: 'Weiter',
      back: 'Zurück zur Auswahl',
      correct: 'Richtig',
      wrong: 'Falsch',
      self: 'Selbstkontrolle, keine automatische Note',
      summary: 'Ergebnis',
      graded: 'Punkte bei automatisch prüfbaren Fragen',
      review: 'Falsche Antworten ansehen',
      retry: 'Nochmal, neu gemischt',
      again: 'Andere Auswahl',
      why: 'Erklärung',
      worked: 'Rechenweg',
      orderHint: 'Tippe die Schritte in der richtigen Reihenfolge.',
      undo: 'Zurücknehmen',
      shortHint: 'Formuliere eine Antwort. Sie wird nicht automatisch benotet; danach siehst du eine Musterorientierung.',
      your: 'Deine Antwort',
      model: 'Orientierung',
      basic: 'Grundlage',
      applied: 'Anwenden',
      transfer: 'Übertragen',
      single: 'Einfachauswahl',
      multi: 'Mehrfachauswahl',
      order: 'Reihenfolge',
      short: 'Kurzantwort',
      note: 'Keine offiziellen IHK-Aufgaben. Die Zahl am Fach ist die Anzahl in dieser Datei. Die gemischte Auswahl zählt auch die vorhandenen Klasse-10-Fächer mit. Der Bestand ist unvollständig und erreicht nicht 50 Fragen je Fach. Jahrgangsstufe 12 und AP2 fehlen.',
      of: 'von'
    },
    en: {
      pick: 'Choose a quiz',
      subject: 'Subject',
      topic: 'Topic',
      level: 'Level',
      allTopics: 'All topics',
      allLevels: 'All levels',
      mixed: 'Mixed review of this pathway',
      legacy: 'Original 12-question quiz',
      count: 'Number of questions',
      available: 'questions available',
      start: 'Start',
      empty: 'No questions for this filter.',
      progress: 'Progress',
      submit: 'Check answer',
      next: 'Next',
      back: 'Back to setup',
      correct: 'Correct',
      wrong: 'Incorrect',
      self: 'Self-check, not auto-scored',
      summary: 'Result',
      graded: 'Score on auto-graded questions',
      review: 'Review incorrect answers',
      retry: 'Retry with a new shuffle',
      again: 'Choose again',
      why: 'Explanation',
      worked: 'Worked solution',
      orderHint: 'Select the steps in the correct order.',
      undo: 'Undo',
      shortHint: 'Write an answer. It is not auto-graded; a model orientation appears after you check.',
      your: 'Your answer',
      model: 'Orientation',
      basic: 'Foundation',
      applied: 'Apply',
      transfer: 'Transfer',
      single: 'Single choice',
      multi: 'Multiple answers',
      order: 'Ordering',
      short: 'Short answer',
      note: 'Not official IHK questions. The number next to a subject is the count in that file. Mixed review also includes the Klasse 10 subjects that exist. The bank is incomplete and does not reach 50 questions per subject. Year 12 and AP2 are not here.',
      of: 'of'
    }
  };

  function lang() {
    return document.documentElement.lang || localStorage.getItem('fisi-lang') || 'fa';
  }
  function t() { return ui[lang()] || ui.de; }
  function tx(obj) { return (obj && (obj[lang()] || obj.de)) || ''; }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  let mode = 'pick';
  let session = null;
  let index = 0;
  let answers = [];

  function subjects() { return window.QUIZ_SUBJECTS || []; }

  function subjectById(id) { return subjects().find(s => s.id === id); }

  function countAvailable(filters) {
    const counts = window.QUIZ_COUNTS || {};
    const level = filters.level && filters.level !== 'all' ? filters.level : 'all';
    if (filters.set === 'legacy') {
      const legacy = counts.legacy || {};
      return legacy[level] || 0;
    }
    const ids = filters.subject && filters.subject !== 'mixed'
      ? [filters.subject]
      : subjects().map(s => s.id);
    let n = 0;
    ids.forEach(id => {
      const pack = (counts.subjects || {})[id];
      if (!pack) return;
      if (filters.topic && filters.topic !== 'all') {
        const topic = (pack.topics || {})[filters.topic];
        n += topic ? (topic[level] || 0) : 0;
      } else {
        n += (pack.all && pack.all[level]) || 0;
      }
    });
    return n;
  }

  const scriptLoads = {};
  function loadScript(src) {
    if (scriptLoads[src]) return scriptLoads[src];
    scriptLoads[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(src));
      document.body.appendChild(s);
    });
    return scriptLoads[src];
  }

  function filesFor(filters) {
    const files = window.QUIZ_FILES || {};
    if (filters.set === 'legacy') return files.legacy ? [files.legacy] : [];
    if (filters.subject && filters.subject !== 'mixed') return files[filters.subject] ? [files[filters.subject]] : [];
    return subjects().map(s => files[s.id]).filter(Boolean);
  }

  function ensureQuestions(filters) {
    return Promise.all(filesFor(filters).map(loadScript)).then(() => {
      const parts = window.QUIZ_PARTS || {};
      let list = [];
      if (filters.set === 'legacy') list = parts.legacy || [];
      else if (filters.subject && filters.subject !== 'mixed') list = parts[filters.subject] || [];
      else subjects().forEach(s => { list = list.concat(parts[s.id] || []); });
      return list.filter(q => {
        if (filters.topic && filters.topic !== 'all' && q.topic !== filters.topic) return false;
        if (filters.level && filters.level !== 'all' && q.difficulty !== filters.level) return false;
        return true;
      });
    });
  }

  function renderPick() {
    const root = document.getElementById('quizRoot');
    if (!root) return;
    const L = t();
    const preset = new URLSearchParams(location.search).get('subject');
    const selSubject = (root.querySelector('#qSubject') || {}).value || preset || 'mixed';
    const subject = subjectById(selSubject);
    const topics = subject ? subject.topics : [];
    let currentTopic = (root.querySelector('#qTopic') || {}).value || 'all';
    if (subject && currentTopic !== 'all' && !topics.some(tp => tp.id === currentTopic)) currentTopic = 'all';
    const currentLevel = (root.querySelector('#qLevel') || {}).value || 'all';
    const filters = { subject: selSubject, topic: currentTopic, level: currentLevel, set: selSubject === 'legacy' ? 'legacy' : '' };
    const available = countAvailable(filters);
    const topicOptions = ['<option value="all">' + L.allTopics + '</option>'].concat(topics.map(tp => {
      const on = tp.id === currentTopic ? ' selected' : '';
      return '<option value="' + tp.id + '"' + on + '>' + tx(tp.label) + '</option>';
    })).join('');
    const levels = ['all', 'basic', 'applied', 'transfer'].map(lv => {
      const label = lv === 'all' ? L.allLevels : L[lv];
      return '<option value="' + lv + '"' + (lv === currentLevel ? ' selected' : '') + '>' + label + '</option>';
    }).join('');
    const subjectOptions = ['<option value="mixed">' + L.mixed + '</option>', '<option value="legacy">' + L.legacy + '</option>']
      .concat(subjects().map(s => '<option value="' + s.id + '"' + (s.id === selSubject ? ' selected' : '') + '>' + tx(s.label) + '</option>')).join('');
    root.innerHTML = ''
      + '<form id="quizSetup" class="card">'
      + '<h2>' + L.pick + '</h2>'
      + '<p class="source-note">' + L.note + '</p>'
      + '<div class="form-group"><label for="qSubject">' + L.subject + '</label><select id="qSubject">' + subjectOptions + '</select></div>'
      + '<div class="form-group"><label for="qTopic">' + L.topic + '</label><select id="qTopic">' + topicOptions + '</select></div>'
      + '<div class="form-group"><label for="qLevel">' + L.level + '</label><select id="qLevel">' + levels + '</select></div>'
      + '<div class="form-group"><label for="qCount">' + L.count + '</label><select id="qCount">'
      + [5, 10, 20, available].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map(n => '<option value="' + n + '"' + (n === Math.min(10, available) ? ' selected' : '') + '>' + n + '</option>').join('')
      + '</select></div>'
      + '<p><strong id="qAvailable">' + available + '</strong> ' + L.available + '</p>'
      + '<p id="qEmpty" class="search-empty"' + (available ? ' hidden' : '') + '>' + L.empty + '</p>'
      + '<button class="btn btn-primary" type="submit"' + (available ? '' : ' disabled') + '>' + L.start + '</button>'
      + '</form>';
    root.querySelector('#qSubject').addEventListener('change', renderPick);
    root.querySelector('#qTopic').addEventListener('change', renderPick);
    root.querySelector('#qLevel').addEventListener('change', renderPick);
    root.querySelector('#quizSetup').addEventListener('submit', function (e) {
      e.preventDefault();
      const count = Number(root.querySelector('#qCount').value);
      const button = e.target.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      ensureQuestions(filters).then(list => {
        const items = shuffle(list).slice(0, count).map(prepare);
        if (!items.length) {
          if (button) button.disabled = false;
          return;
        }
        session = { items: items, filters: filters };
        answers = items.map(() => null);
        index = 0;
        mode = 'run';
        renderRun();
      }).catch(() => {
        if (button) button.disabled = false;
      });
    });
  }

  function prepare(q) {
    const choices = (q.choices && q.choices[lang()]) || (q.choices && q.choices.de) || [];
    return {
      src: q,
      choices: q.type === 'short' ? [] : shuffle(choices.map(c => ({ key: c.key, text: c.text }))),
      picked: q.type === 'multi' || q.type === 'order' ? [] : null,
      text: ''
    };
  }

  function renderRun() {
    const root = document.getElementById('quizRoot');
    const L = t();
    const item = session.items[index];
    const q = item.src;
    const total = session.items.length;
    const stem = tx(q.q);
    let body = '';
    if (q.type === 'single' || q.type === 'multi') {
      body = '<div class="quiz-options">' + item.choices.map(c => {
        const pressed = q.type === 'multi' ? item.picked.indexOf(c.key) !== -1 : item.picked === c.key;
        return '<button type="button" class="quiz-option' + (pressed ? ' selected' : '') + '" data-key="' + c.key + '" aria-pressed="' + (pressed ? 'true' : 'false') + '">' + c.text + '</button>';
      }).join('') + '</div>';
    } else if (q.type === 'order') {
      const chosen = item.picked.map(key => item.choices.find(c => c.key === key));
      body = '<p>' + L.orderHint + '</p><ol class="order-list">' + chosen.map(c => '<li>' + c.text + '</li>').join('') + '</ol>'
        + '<div class="quiz-options">' + item.choices.filter(c => item.picked.indexOf(c.key) === -1).map(c => {
          return '<button type="button" class="quiz-option" data-key="' + c.key + '">' + c.text + '</button>';
        }).join('') + '</div>'
        + '<button type="button" class="btn btn-soft" id="qUndo">' + L.undo + '</button>';
    } else {
      body = '<p>' + L.shortHint + '</p><label class="form-group" for="qShort">' + L.your + '</label><textarea id="qShort" rows="4">' + escapeHtml(item.text) + '</textarea>';
    }
    root.innerHTML = ''
      + '<div class="quiz-meta"><span id="progressText">' + (index + 1) + ' ' + L.of + ' ' + total + '</span><span>' + L[q.type] + ' · ' + L[q.difficulty] + '</span></div>'
      + '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + index + '" aria-labelledby="progressText"><div class="quiz-progress-bar" id="progressBar" style="width:' + (index / total * 100) + '%"></div></div>'
      + '<article class="quiz-card"><h2 class="quiz-question">' + stem + '</h2>' + body + '</article>'
      + '<div class="quiz-actions"><button type="button" class="btn btn-soft" id="qBack">' + L.back + '</button><button type="button" class="btn btn-primary" id="qCheck">' + L.submit + '</button></div>'
      + '<div id="qFeedback" class="card" hidden></div>';
    root.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-key');
        if (q.type === 'single') item.picked = key;
        else if (q.type === 'multi') {
          const at = item.picked.indexOf(key);
          if (at === -1) item.picked.push(key);
          else item.picked.splice(at, 1);
        } else if (q.type === 'order') item.picked.push(key);
        renderRun();
      });
    });
    const undo = root.querySelector('#qUndo');
    if (undo) undo.addEventListener('click', function () { item.picked.pop(); renderRun(); });
    root.querySelector('#qBack').addEventListener('click', function () { mode = 'pick'; renderPick(); });
    root.querySelector('#qCheck').addEventListener('click', function () { gradeCurrent(); });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    return a.every(x => b.indexOf(x) !== -1);
  }

  function gradeCurrent() {
    const L = t();
    const item = session.items[index];
    const q = item.src;
    const box = document.getElementById('qFeedback');
    let ok = false;
    let self = false;
    if (q.type === 'short') {
      item.text = document.getElementById('qShort').value.trim();
      self = true;
      answers[index] = { ok: null, self: true, text: item.text };
    } else if (q.type === 'single') {
      ok = item.picked === q.answer[0];
      answers[index] = { ok: ok, picked: item.picked };
    } else if (q.type === 'multi') {
      ok = sameSet(item.picked, q.answer);
      answers[index] = { ok: ok, picked: item.picked.slice() };
    } else if (q.type === 'order') {
      ok = item.picked.length === q.answer.length && item.picked.every((k, i) => k === q.answer[i]);
      answers[index] = { ok: ok, picked: item.picked.slice() };
    }
    const title = self ? L.self : (ok ? L.correct : L.wrong);
    let html = '<h2>' + title + '</h2><p><strong>' + L.why + '</strong> ' + tx(q.explain) + '</p>';
    if (q.worked) html += '<p><strong>' + L.worked + '</strong> ' + tx(q.worked) + '</p>';
    if (self) html += '<p><strong>' + L.model + '</strong> ' + tx(q.guidance) + '</p>';
    if (!self && !ok) html += correctText(item);
    box.hidden = false;
    box.innerHTML = html + '<div class="quiz-actions"><button type="button" class="btn btn-primary" id="qNext">' + (index + 1 === session.items.length ? L.summary : L.next) + '</button></div>';
    document.getElementById('qCheck').disabled = true;
    box.querySelector('#qNext').addEventListener('click', function () {
      if (index + 1 === session.items.length) { mode = 'review'; renderReview(); }
      else { index += 1; renderRun(); }
    });
  }

  function correctText(item) {
    const q = item.src;
    const map = {};
    (q.choices.de || []).forEach(c => { map[c.key] = c; });
    const langChoices = {};
    ((q.choices && q.choices[lang()]) || []).forEach(c => { langChoices[c.key] = c.text; });
    if (q.type === 'order') {
      return '<p>' + q.answer.map(k => langChoices[k] || k).join(' → ') + '</p>';
    }
    const keys = q.answer;
    return '<p>' + keys.map(k => langChoices[k] || k).join(' · ') + '</p>';
  }

  function renderReview() {
    const root = document.getElementById('quizRoot');
    const L = t();
    const graded = answers.filter(a => a && a.ok !== null);
    const right = graded.filter(a => a.ok).length;
    const wrongItems = session.items.map((item, i) => ({ item: item, ans: answers[i], i: i })).filter(x => x.ans && x.ans.ok === false);
    const percent = graded.length ? Math.round(right / graded.length * 100) : 0;
    let review = '';
    if (!wrongItems.length) review = '<p>' + L.correct + '</p>';
    else {
      review = '<h2>' + L.review + '</h2>' + wrongItems.map(x => {
        return '<article class="card"><h3>' + tx(x.item.src.q) + '</h3><p>' + tx(x.item.src.explain) + '</p>' + (x.item.src.worked ? '<p>' + tx(x.item.src.worked) + '</p>' : '') + '</article>';
      }).join('');
    }
    root.innerHTML = ''
      + '<section class="quiz-score"><h2>' + L.summary + '</h2><strong>' + right + ' / ' + graded.length + '</strong><p>' + percent + '% · ' + L.graded + '</p></section>'
      + review
      + '<div class="quiz-actions"><button type="button" class="btn btn-primary" id="qRetry">' + L.retry + '</button><button type="button" class="btn btn-soft" id="qAgain">' + L.again + '</button></div>';
    root.querySelector('#qRetry').addEventListener('click', function () {
      session.items = shuffle(session.items.map(item => item.src)).map(prepare);
      answers = session.items.map(() => null);
      index = 0;
      mode = 'run';
      renderRun();
    });
    root.querySelector('#qAgain').addEventListener('click', function () { mode = 'pick'; renderPick(); });
  }

  function boot() {
    if (mode === 'run') renderRun();
    else if (mode === 'review') renderReview();
    else renderPick();
  }

  if (document.getElementById('quizRoot')) boot();
  else document.addEventListener('DOMContentLoaded', boot);
  document.addEventListener('fisi-lang', function () {
    if (mode === 'pick') renderPick();
  });
  const previous = window.setLang;
  window.setLang = function (code) {
    if (typeof previous === 'function') previous(code);
    if (mode === 'pick') renderPick();
  };
})();
