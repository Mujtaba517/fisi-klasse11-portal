(function () {
  var aside = document.querySelector('.auth-aside');
  if (!aside || aside.querySelector('.lg-pet')) return;
  var lines = ['Hallo! Ich bin Lumo.', 'Schritt für Schritt zum Ziel.', 'Bleib neugierig!'];
  var n = 0;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'lg-pet';
  btn.setAttribute('aria-label', 'Lumo, dein Lernbegleiter');
  btn.innerHTML = '<span class="lg-bubble" role="status"></span>' + (window.LernovaCat ? window.LernovaCat.html({ preload: 'auto' }) : '');
  var bub = btn.querySelector('.lg-bubble');
  bub.textContent = lines[0];
  if (window.LernovaCat) window.LernovaCat.bind(btn);
  btn.addEventListener('click', function () {
    n++;
    bub.textContent = lines[n % lines.length];
    bub.style.animation = 'none';
    void bub.offsetWidth;
    bub.style.animation = '';
    if (window.LernovaCat) window.LernovaCat.replay(btn);
  });
  aside.appendChild(btn);
})();

/* Lernova PWA: register the service worker for this site folder.
   Relative URLs keep the scope on /fisi-klasse11-portal/ when GitHub Pages serves the repo. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  function registerLernovaSW() {
    var scriptUrl = new URL('sw.js', document.baseURI);
    var scopeUrl = new URL('./', scriptUrl);
    navigator.serviceWorker.register(scriptUrl.href, { scope: scopeUrl.href, updateViaCache: 'none' }).catch(function () {});
  }
  if (document.readyState === 'complete') registerLernovaSW();
  else window.addEventListener('load', registerLernovaSW);
})();
