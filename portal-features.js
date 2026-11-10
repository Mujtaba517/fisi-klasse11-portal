(function () {
  var LESSONS = [
    ['aeup.html#welt', 'Datenarten'], ['aeup.html#er', 'ER-Modell'], ['aeup.html#rel', 'Relationales Modell'],
    ['it-systeme.html#osi', 'OSI-Modell'], ['it-systeme.html#ip', 'IP'], ['it-systeme.html#vlan', 'VLAN'],
    ['bgwp.html#itsm', 'IT-Servicemanagement'], ['k10-fuit.html#osi', 'OSI als Landkarte'], ['k10-aeup.html#sprache', 'Hochsprachen']
  ];
  function on(key) { return localStorage.getItem(key) === '1'; }
  function notifyOn() { return localStorage.getItem('fisi-notify') !== '0'; }
  function activity() { try { return JSON.parse(localStorage.getItem('fisi-activity') || '{}'); } catch (e) { return {}; } }
  function opened(href) {
    var page = href.split('#')[0];
    var id = href.split('#')[1] || '';
    return !!(activity()[page] && activity()[page][id] && activity()[page][id].opened);
  }
  function unfinished() { return LESSONS.filter(function (row) { return !opened(row[0]); }); }

  var bell = document.getElementById('bellBtn');
  var panel = document.getElementById('notifPanel');
  if (bell && panel && notifyOn()) {
    fetch('changelog.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (items) {
      var seen = {};
      try { seen = JSON.parse(localStorage.getItem('fisi-seen-notes') || '{}'); } catch (e) {}
      var lang = localStorage.getItem('fisi-lang') || 'de';
      var unread = items.filter(function (item) { return !seen[item.id]; });
      if (unread.length) {
        var dot = document.createElement('span');
        dot.className = 'bell-dot';
        bell.appendChild(dot);
      }
      panel.innerHTML = '<strong>Benachrichtigungen</strong>' + (items.length ? items.map(function (item) {
        return '<p>' + (item[lang] || item.de) + '</p>';
      }).join('') : '<p>Keine Einträge.</p>') + '<p class="row-desc">Nur in diesem Browser. Quelle: changelog.json.</p>';
      bell.addEventListener('click', function () {
        items.forEach(function (item) { seen[item.id] = 1; });
        localStorage.setItem('fisi-seen-notes', JSON.stringify(seen));
        var dot = bell.querySelector('.bell-dot');
        if (dot) dot.remove();
      });
    }).catch(function () {});
  }

  var file = location.pathname.split('/').pop() || 'index.html';
  if (on('fisi-ki-reco') && (file === 'index.html' || file === '')) {
    var next = unfinished().slice(0, 3);
    var host = document.getElementById('main');
    if (host && next.length && !document.getElementById('nextCard')) {
      var card = document.createElement('section');
      card.id = 'nextCard';
      card.className = 'settings-card';
      card.innerHTML = '<h2>Als Nächstes</h2><p class="card-sub">Aus Lektionen, die in diesem Browser noch nicht geöffnet sind. Kein externer Dienst.</p><ul>' + next.map(function (row) { return '<li><a href="' + row[0] + '">' + row[1] + '</a></li>'; }).join('') + '</ul>';
      var header = host.querySelector('.page-header');
      if (header) header.after(card); else host.prepend(card);
    }
  }

  if (on('fisi-ki-assist')) {
    var stage = document.getElementById('main');
    if (stage && !document.getElementById('lernhilfe')) {
      var help = document.createElement('form');
      help.id = 'lernhilfe';
      help.className = 'settings-card';
      help.innerHTML = '<h2>Lernhilfe</h2><p class="card-sub">Sucht im gerade sichtbaren Lektionstext. Kein externer KI-Dienst.</p><input type="search" id="lernhilfeQ" placeholder="Begriff aus der Lektion"><p id="lernhilfeA"></p>';
      stage.appendChild(help);
      help.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = document.getElementById('lernhilfeQ').value.trim().toLowerCase();
        var text = (document.querySelector('.step-stage') || stage).innerText;
        var lines = text.split(/\n/).map(function (line) { return line.trim(); }).filter(Boolean);
        var hit = lines.filter(function (line) { return q && line.toLowerCase().indexOf(q) !== -1; }).slice(0, 3);
        document.getElementById('lernhilfeA').textContent = hit.length ? hit.join(' ') : 'Im sichtbaren Schritt steht dazu nichts.';
      });
    }
  }

  if (on('fisi-ki-analyze') && /progress\.html$/.test(location.pathname)) {
    var log = [];
    try { log = JSON.parse(localStorage.getItem('fisi-quiz-log') || '[]'); } catch (e) {}
    var box = document.createElement('section');
    box.className = 'settings-card';
    if (!log.length) box.innerHTML = '<h2>Aus deinen Quiz-Antworten</h2><p>Noch keine gespeicherten Antworten in diesem Browser.</p>';
    else {
      var by = {};
      log.forEach(function (row) {
        var key = row.subject || 'quiz';
        by[key] = by[key] || { ok: 0, n: 0 };
        by[key].n += 1;
        if (row.ok) by[key].ok += 1;
      });
      box.innerHTML = '<h2>Aus deinen Quiz-Antworten</h2><p class="card-sub">Nur dieser Browser. Kein externer Dienst.</p><ul>' + Object.keys(by).map(function (key) {
        return '<li>' + key + ': ' + by[key].ok + ' von ' + by[key].n + ' richtig</li>';
      }).join('') + '</ul>';
    }
    document.getElementById('main').appendChild(box);
  }

  if (/calendar\.html$/.test(location.pathname)) {
    var list = document.getElementById('planList');
    if (list && !on('fisi-ki-plans')) list.innerHTML = '<li>Automatische Lernpläne sind aus. Einschalten unter Einstellungen, KI &amp; Lernen.</li>';
    else if (list) {
      var plan = unfinished();
      list.innerHTML = plan.length ? plan.slice(0, 7).map(function (row, i) {
        return '<li>Tag ' + (i + 1) + ': <a href="' + row[0] + '">' + row[1] + '</a></li>';
      }).join('') : '<li>Keine offenen Lektionen in der kurzen Liste.</li>';
    }
  }
})();
