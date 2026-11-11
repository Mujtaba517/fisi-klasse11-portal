(function () {
  if (!document.documentElement.classList.contains('lumo-home')) return;
  var T = {
    de: { label: 'Lumo, dein Lernbegleiter', hi: ['Hallo! Ich bin Lumo.', 'Weiter geht’s – Schritt für Schritt.', 'Bleib neugierig!'] },
    en: { label: 'Lumo, your learning companion', hi: ['Hi! I’m Lumo.', 'Keep going, one step at a time.', 'Stay curious!'] },
    fa: { label: 'لومو، همراه یادگیری تو', hi: ['سلام! من لومو هستم.', 'قدم به قدم جلو برو.', 'کنجکاو بمان!'] }
  };
  var n = 0;
  function lang() { var l = document.documentElement.lang; return T[l] ? l : 'de'; }
  function svg() {
    return `<svg viewBox='0 0 360 260' aria-hidden='true' focusable='false'><ellipse cx='185' cy='242' rx='95' ry='12' fill='#20342d22'/><path class='lm-spark' d='M48 70l7 17 17 7-17 7-7 17-7-17-17-7 17-7z' fill='#ffd166'/><path class='lm-spark lm-s2' d='M310 52l5 12 12 5-12 5-5 12-5-12-12-5 12-5z' fill='#ff8f70'/><g class='lm-body'><path class='lm-tail' d='M262 190q55-5 48-48' fill='none' stroke='#20342d' stroke-width='10' stroke-linecap='round'/><rect x='105' y='48' width='160' height='165' rx='62' fill='#fff4c4' stroke='#20342d' stroke-width='4'/><path d='M122 70L105 20l54 28M248 70l20-48-58 30' fill='#fff4c4' stroke='#20342d' stroke-width='4' stroke-linejoin='round'/><g class='lm-eye'><circle cx='152' cy='108' r='10' fill='#20342d'/><circle cx='155' cy='104' r='3' fill='#fff'/></g><g class='lm-eye'><circle cx='218' cy='108' r='10' fill='#20342d'/><circle cx='221' cy='104' r='3' fill='#fff'/></g><path d='M165 135q20 20 40 0' fill='none' stroke='#20342d' stroke-width='4' stroke-linecap='round'/><ellipse cx='130' cy='135' rx='14' ry='8' fill='#ffb199'/><ellipse cx='240' cy='135' rx='14' ry='8' fill='#ffb199'/><path d='M140 178l45-10 45 10v36h-90z' fill='#7a9b76' stroke='#20342d' stroke-width='3'/><g class='lm-arm'><path d='M262 170q42-8 38-52' fill='none' stroke='#20342d' stroke-width='10' stroke-linecap='round'/><circle cx='300' cy='116' r='11' fill='#fff4c4' stroke='#20342d' stroke-width='3'/></g><path d='M120 85q65-52 130 0' fill='none' stroke='#215c43' stroke-width='9' stroke-linecap='round'/></g></svg>`;
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
    btn.innerHTML = '<span class="lumo-bubble" role="status"></span>' + svg();
    var bub = btn.querySelector('.lumo-bubble');
    function text() { var t = T[lang()]; bub.textContent = t.hi[n % 3]; btn.setAttribute('aria-label', t.label); }
    btn.addEventListener('click', function () { n++; text(); bub.style.animation = 'none'; void bub.offsetWidth; bub.style.animation = ''; burst(); });
    document.addEventListener('fisi-lang', text);
    hero.appendChild(btn);
    text();
  }
  build();
})();
