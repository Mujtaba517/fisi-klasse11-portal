/* Shared chrome: mobile navigation, list search, home search, session line. */
(function () {
  var searchCopy = {
    fa: { topics: 'جستجو در موضوعات', empty: 'موردی پیدا نشد.' },
    de: { topics: 'Themen suchen', empty: 'Keine Treffer.' },
    en: { topics: 'Search topics', empty: 'No matches.' }
  };

  function lang() {
    return document.documentElement.lang || localStorage.getItem('fisi-lang') || 'de';
  }

  function copy() {
    return searchCopy[lang()] || searchCopy.de;
  }

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  function attachListSearch(list) {
    if (!list || list.dataset.searchReady) return;
    list.dataset.searchReady = '1';
    var label = document.createElement('label');
    label.className = 'search';
    label.innerHTML = '<span class="sr-only"></span><input type="search" class="list-search" autocomplete="off">';
    list.parentNode.insertBefore(label, list);
    var input = label.querySelector('input');
    var sr = label.querySelector('.sr-only');
    var empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.hidden = true;
    list.after(empty);

    function applyCopy() {
      var t = copy();
      input.placeholder = t.topics;
      sr.textContent = t.topics;
      input.setAttribute('aria-label', t.topics);
    }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      var items = list.querySelectorAll('.topic-item, .ex-pick');
      items.forEach(function (el) {
        var show = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        el.hidden = !show;
        if (show) visible += 1;
      });
      empty.textContent = copy().empty;
      empty.hidden = !(q && items.length && visible === 0);
    }

    applyCopy();
    input.addEventListener('input', apply);
    new MutationObserver(function () { apply(); }).observe(list, { childList: true });
    document.addEventListener('fisi-lang', function () { applyCopy(); apply(); });
  }

  function initHomeSearch() {
    var input = document.getElementById('portalSearch');
    if (!input) return;
    var empty = document.getElementById('portalEmpty');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var any = false;
      document.querySelectorAll('[data-search-group]').forEach(function (group) {
        var n = 0;
        group.querySelectorAll('[data-search-item]').forEach(function (item) {
          var show = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.hidden = !show;
          if (show) n += 1;
        });
        group.hidden = q.length > 0 && n === 0;
        if (n) any = true;
      });
      if (empty) empty.hidden = !q || any;
    });
  }

  function initSession() {
    var nameEl = document.getElementById('sessionName');
    var line = document.getElementById('sessionLine');
    if (!nameEl || !line) return;
    try {
      var raw = sessionStorage.getItem('fisi-auth');
      if (!raw) return;
      var user = JSON.parse(raw);
      var name = (user.name || user.username || '').trim();
      if (!name) return;
      nameEl.textContent = name;
      line.hidden = false;
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initHomeSearch();
    initSession();
    document.querySelectorAll('#topicList, #exList').forEach(attachListSearch);
  });
})();
