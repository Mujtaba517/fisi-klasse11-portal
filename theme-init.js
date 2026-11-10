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
