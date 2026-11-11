/* Apply saved theme and language before first paint. */
(function () {
  try {
    var theme = localStorage.getItem('fisi-theme') || 'light';
    var lang = localStorage.getItem('fisi-lang') || 'fa';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'light' ? '#f3f5fa' : '#0f172a');
  } catch (e) {}
})();
/* Lumo look: one color system on every page; mascot and hero styles on the home page only; appearance options on every page. */
(function () {
  try {
    var root = document.documentElement;
    root.classList.add('lumo-site');
    var out = '<link rel="stylesheet" href="lumo-site.css">';
    if (/(^|\/)(index\.html)?$/.test(location.pathname)) {
      root.classList.add('lumo-home');
      out += '<link rel="stylesheet" href="lumo.css"><script src="lumo.js" defer><\/script>';
    }
    out += '<link rel="stylesheet" href="appearance.css"><script src="appearance.js"><\/script>';
    out += '<style>html.lumo-site body .sidebar a.nav-item[href="admin.html"]{display:none!important}html.lumo-site body :is(.search input,.list-search,input[type=search]):focus-visible{outline:none!important;border-color:var(--primary-strong)!important;box-shadow:0 0 0 2px var(--blue-soft)}html.lumo-site:not(#x) body .search input{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;outline:none!important}html.lumo-site:not(#x) body .search:focus-within{box-shadow:0 0 0 2px var(--blue-soft)}</style>';
    if (/settings(\.html)?$/.test(location.pathname)) out += '<script src="users-tab.js"><\/script>';
    document.write(out);
  } catch (e) {}
})();
