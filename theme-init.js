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
    document.write(out);
  } catch (e) {}
})();
