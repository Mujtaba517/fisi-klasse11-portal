(function () {
  if (!document.documentElement.classList.contains('lumo-home')) return;
  var T = {
    de: { label: 'Lumo, dein Lernbegleiter', hi: ['Hallo! Ich bin Lumo.', 'Weiter geht’s – Schritt für Schritt.', 'Bleib neugierig!'] },
    en: { label: 'Lumo, your learning companion', hi: ['Hi! I’m Lumo.', 'Keep going, one step at a time.', 'Stay curious!'] },
    fa: { label: 'لومو، همراه یادگیری تو', hi: ['سلام! من لومو هستم.', 'قدم به قدم جلو برو.', 'کنجکاو بمان!'] }
  };
  var n = 0;
  function lang() { var l = document.documentElement.lang; return T[l] ? l : 'de'; }
  function figure() {
    return window.LernovaCat ? window.LernovaCat.html({ preload: 'auto' }) : '';
  }
  function burst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = ['#ffd166', '#ff8f70', '#9bd6f5', '#d8ef85', '#215c43'];
    for (var i = 0; i < 14; i++) {
      var e = document.createElement('i');
      e.className = 'lm-confetti';
      e.style.left = Math.random() * 100 + 'vw';
      e.style.background = c[i % 5];
      e.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(e);
      setTimeout(function (x) { x.remove(); }, 2500, e);
    }
  }
  function build() {
    var hero = document.querySelector('.studio-hero');
    if (!hero || hero.querySelector('.lumo-pet')) return;
    var h1 = hero.querySelector('h1');
    if (h1) {
      var p = document.createElement('p');
      p.className = 'lumo-headline';
      p.setAttribute('data-i18n', 'homeHeading');
      p.textContent = h1.textContent;
      hero.insertBefore(p, h1.nextSibling);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lumo-pet';
    btn.innerHTML = '<span class="lumo-bubble" role="status"></span>' + figure();
    if (window.LernovaCat) window.LernovaCat.bind(btn);
    var bub = btn.querySelector('.lumo-bubble');
    function text() { var t = T[lang()]; bub.textContent = t.hi[n % 3]; btn.setAttribute('aria-label', t.label); }
    btn.addEventListener('click', function () { n++; text(); bub.style.animation = 'none'; void bub.offsetWidth; bub.style.animation = ''; if (window.LernovaCat) window.LernovaCat.replay(btn); burst(); });
    document.addEventListener('fisi-lang', text);
    hero.appendChild(btn);
    text();
  }
  build();
})();
