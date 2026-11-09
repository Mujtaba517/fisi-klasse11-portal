/* Original Lernova guide and diagrams. Inline SVG, no assets. */
(function () {
  var COPY = {
    de: { play: 'Abspielen', pause: 'Pause', back: 'Schritt zurück', forward: 'Schritt vor', replay: 'Von vorn', static: 'Fertiges Diagramm, alle Teile sichtbar', group: 'ER-Diagramm Schritt für Schritt' },
    en: { play: 'Play', pause: 'Pause', back: 'Step back', forward: 'Step forward', replay: 'Replay', static: 'Finished diagram, every part visible', group: 'ER diagram, step by step' },
    fa: { play: 'پخش', pause: 'مکث', back: 'گام قبل', forward: 'گام بعد', replay: 'از نو', static: 'نمودار تمام‌شده، همه بخش‌ها پیدا هستند', group: 'نمودار ER گام‌به‌گام' }
  };

  function lang() {
    return document.documentElement.lang || localStorage.getItem('fisi-lang') || 'fa';
  }
  function copy() {
    return COPY[lang()] || COPY.de;
  }

  function face(pose) {
    if (pose === 'celebrate') return 'M20 29 Q26 35 32 29';
    if (pose === 'encourage') return 'M20 30 Q26 33 32 30';
    if (pose === 'explain') return 'M20 29 Q26 33 32 29';
    return 'M20 29 Q26 34 32 29';
  }
  function arms(pose) {
    if (pose === 'celebrate') return '<path d="M18 42 L8 30 M46 42 L56 30" />';
    if (pose === 'explain') return '<path d="M18 44 L12 54 M46 42 L58 34" /><circle cx="58" cy="34" r="1.6" fill="currentColor" />';
    if (pose === 'encourage') return '<path d="M18 44 L14 54 M44 44 L40 36" />';
    return '<path d="M18 44 L10 40 M46 44 L54 40" />';
  }

  function guideSvg(pose) {
    return '<svg class="guide-svg" viewBox="0 0 64 72" aria-hidden="true">'
      + '<path fill="currentColor" opacity="0.12" d="M8 66c6-8 14-10 24-10s18 2 24 10" />'
      + '<path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M22 46h20a8 8 0 0 1 8 8v8H14v-8a8 8 0 0 1 8-8z" />'
      + arms(pose)
      + '<circle cx="32" cy="24" r="12" fill="var(--card)" stroke="currentColor" stroke-width="1.75" />'
      + '<path fill="currentColor" opacity="0.2" d="M20 20c1-6 6-10 12-10 7 0 12 4 13 10" />'
      + '<circle cx="27" cy="24" r="1.2" fill="currentColor" /><circle cx="37" cy="24" r="1.2" fill="currentColor" />'
      + '<path d="' + face(pose) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />'
      + '<rect x="26" y="48" width="12" height="9" rx="1.5" fill="var(--card)" stroke="currentColor" stroke-width="1.4" />'
      + '</svg>';
  }

  window.lernovaGuide = function (host, pose) {
    if (!host) return;
    var el = host.querySelector(':scope > .guide');
    if (!el) {
      el = document.createElement('div');
      host.insertBefore(el, host.firstChild);
    }
    el.className = 'guide guide-' + (pose || 'welcome');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = guideSvg(pose || 'welcome');
  };

  var ART = {
    'it-systeme.html': '<svg viewBox="0 0 64 48"><circle cx="12" cy="24" r="5"/><circle cx="34" cy="12" r="5"/><circle cx="50" cy="34" r="5"/><path d="M17 22 L29 14 M17 26 L45 32"/></svg>',
    'it-technik.html': '<svg viewBox="0 0 64 48"><rect x="18" y="12" width="28" height="24" rx="3"/><path d="M24 12 V6 M32 12 V6 M40 12 V6 M24 36 V42 M32 36 V42 M40 36 V42 M18 18 H12 M18 24 H12 M18 30 H12 M46 18 H52 M46 24 H52 M46 30 H52"/></svg>',
    'aeup.html': '<svg viewBox="0 0 64 48"><rect x="6" y="16" width="22" height="14" rx="2"/><ellipse cx="46" cy="14" rx="12" ry="7"/><path d="M28 23 H34 L40 28 L46 23"/></svg>',
    'bgwp.html': '<svg viewBox="0 0 64 48"><path d="M12 14h28a4 4 0 0 1 4 4v4a6 6 0 0 0 0 8v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-4a6 6 0 0 0 0-8v-4a4 4 0 0 1 4-4z"/><path d="M20 22h16M20 28h10"/></svg>',
    'fachpraxis.html': '<svg viewBox="0 0 64 48"><rect x="8" y="16" width="16" height="16" rx="2"/><path d="M24 24 H40 M40 18 V30 M46 18 V30 M52 18 V30"/></svg>',
    'pug.html': '<svg viewBox="0 0 64 48"><path d="M8 40 V22 L20 12 L32 22 V40 M32 40 V18 L44 10 L56 18 V40"/><path d="M14 40 V30 H20 V40 M38 40 V28 H46 V40"/></svg>',
    'englisch.html': '<svg viewBox="0 0 64 48"><path d="M10 10h28a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H22l-8 8v-8h-4a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z"/><path d="M18 20h16M18 26h10"/></svg>',
    'k10-fuit.html': '<svg viewBox="0 0 64 48"><rect x="6" y="16" width="14" height="16" rx="2"/><rect x="44" y="16" width="14" height="16" rx="2"/><path d="M20 24 H44"/><circle cx="32" cy="24" r="3"/></svg>',
    'k10-ittechnik.html': '<svg viewBox="0 0 64 48"><rect x="10" y="10" width="44" height="28" rx="3"/><rect x="16" y="16" width="14" height="10"/><circle cx="42" cy="28" r="4"/></svg>',
    'k10-aeup.html': '<svg viewBox="0 0 64 48"><path d="M24 12 L12 24 L24 36 M40 12 L52 24 L40 36 M28 38 L36 10"/></svg>',
    'k10-bgwp.html': '<svg viewBox="0 0 64 48"><path d="M18 16a14 14 0 0 1 22 4 M46 32a14 14 0 0 1-22-4"/><path d="M40 12 L44 20 L36 20 M20 36 L16 28 L24 28"/></svg>',
    'k10-englisch.html': '<svg viewBox="0 0 64 48"><path d="M12 34 L20 12 H26 L34 34 M16 26 H30"/><path d="M40 14 H54 M40 24 H52 M40 34 H48"/></svg>',
    'k10-projekt.html': '<svg viewBox="0 0 64 48"><path d="M10 36 H54"/><path d="M16 36 V22 M32 36 V16 M48 36 V26"/><path d="M16 22 H24 V16 H16z"/></svg>',
    'k10-pug.html': '<svg viewBox="0 0 64 48"><rect x="16" y="8" width="28" height="32" rx="2"/><path d="M22 16 H38 M22 22 H38 M22 28 H32"/></svg>'
  };

  function decorate() {
    var hero = document.querySelector('.studio-hero');
    if (hero && !hero.querySelector('.hero-guide')) {
      var wrap = document.createElement('div');
      wrap.className = 'hero-guide';
      hero.appendChild(wrap);
      lernovaGuide(wrap, 'welcome');
    }
    document.querySelectorAll('a.card-link[href]').forEach(function (card) {
      var href = (card.getAttribute('href') || '').split('#')[0];
      var art = ART[href];
      if (!art || card.querySelector('.subject-art')) return;
      var fig = document.createElement('div');
      fig.className = 'subject-art';
      fig.setAttribute('aria-hidden', 'true');
      fig.innerHTML = art;
      var ico = card.querySelector('.ico');
      if (ico) ico.replaceWith(fig);
      else card.insertBefore(fig, card.firstChild);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();

  function erSvg(live) {
    var mark = live ? '' : ' data-on="1"';
    function part(n, body) {
      return '<g data-er="' + n + '"' + (live ? '' : mark) + '>' + body + '</g>';
    }
    return '<svg class="er-svg" dir="ltr" viewBox="0 0 420 230" role="img">'
      + part(1, '<rect x="28" y="88" width="118" height="42" rx="6"/><text x="87" y="114">Abteilung</text><rect x="274" y="88" width="118" height="42" rx="6"/><text x="333" y="114">Mitarbeiter</text>')
      + part(2, '<ellipse cx="70" cy="42" rx="46" ry="18"/><text x="70" y="46">AbteilungsNr</text><ellipse cx="150" cy="42" rx="34" ry="18"/><text x="150" y="46">Name</text><ellipse cx="300" cy="42" rx="42" ry="18"/><text x="300" y="46">PersonalNr</text><ellipse cx="378" cy="42" rx="34" ry="18"/><text x="378" y="46">Name</text><path d="M70 60 V88 M150 60 V88 M300 60 V88 M378 60 V88"/>')
      + part(3, '<path class="er-key" d="M42 54 H98 M270 54 H330"/>')
      + part(4, '<path d="M146 109 H196 M224 109 H274"/><path d="M210 86 L234 109 L210 132 L186 109 Z"/><text x="210" y="113">hat</text>')
      + part(5, '<text class="er-card" x="166" y="104">1</text><text class="er-card" x="256" y="104">n</text>')
      + '</svg>';
  }

  window.lernovaErStatic = function (caption) {
    var label = caption || copy().static;
    return '<figure class="er-static"><figcaption>' + label + '</figcaption>' + erSvg(false) + '</figure>';
  };

  window.lernovaErPlayer = function (host, captions) {
    var steps = captions && captions.length ? captions : ['', '', '', '', ''];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var at = reduce ? steps.length - 1 : 0;
    var timer = null;
    var c = copy();
    host.innerHTML = '<div class="er-player" data-at="0">' + erSvg(true)
      + '<p class="er-caption"></p>'
      + '<div class="er-controls" role="group" aria-label="' + c.group + '">'
      + '<button type="button" data-act="back" aria-label="' + c.back + '">' + c.back + '</button>'
      + '<button type="button" data-act="play" aria-label="' + c.play + '" aria-pressed="false">' + c.play + '</button>'
      + '<button type="button" data-act="forward" aria-label="' + c.forward + '">' + c.forward + '</button>'
      + '<button type="button" data-act="replay" aria-label="' + c.replay + '">' + c.replay + '</button>'
      + '</div></div>';
    var root = host.querySelector('.er-player');
    var cap = host.querySelector('.er-caption');
    var playBtn = host.querySelector('[data-act="play"]');
    function paint() {
      root.setAttribute('data-at', String(at));
      root.querySelectorAll('[data-er]').forEach(function (node) {
        var n = Number(node.getAttribute('data-er'));
        if (n <= at + 1) node.setAttribute('data-on', '1');
        else node.removeAttribute('data-on');
      });
      cap.innerHTML = String(steps[at] || '').replace(/[&<>]/g, function (ch) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch];
      }).replace(/`([^`]+)`/g, '<bdi dir="ltr">$1</bdi>');
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.textContent = c.play;
      playBtn.setAttribute('aria-label', c.play);
    }
    function go(next) {
      at = Math.max(0, Math.min(steps.length - 1, next));
      paint();
    }
    host.querySelector('[data-act="back"]').addEventListener('click', function () { stop(); go(at - 1); });
    host.querySelector('[data-act="forward"]').addEventListener('click', function () { stop(); go(at + 1); });
    host.querySelector('[data-act="replay"]').addEventListener('click', function () {
      stop();
      if (reduce) { go(steps.length - 1); return; }
      go(0);
      play();
    });
    function play() {
      if (reduce) { go(steps.length - 1); return; }
      if (timer) { stop(); return; }
      if (at >= steps.length - 1) go(0);
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.textContent = c.pause;
      playBtn.setAttribute('aria-label', c.pause);
      timer = setInterval(function () {
        if (at >= steps.length - 1) { stop(); return; }
        go(at + 1);
      }, 1600);
    }
    playBtn.addEventListener('click', play);
    paint();
  };
})();
