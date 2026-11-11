/* Lernova appearance: color themes, window color, glass, backgrounds, text size, corners, font and motion.
   Everything stays in this browser (localStorage key lumo-appearance). */
(function () {
  'use strict';
  var KEY = 'lumo-appearance';
  var IMG = 'fisi-custom-bg';
  var root = document.documentElement;
  var DEF = { mode: 'manual', palette: 'green', window: '', transp: null, blur: null, bgType: 'none', bgPreset: 'aurora', bgColor: '#e9f5ee', fit: 'cover', dim: 0, size: 100, radius: 'normal', font: 'default', calm: false, contrast: false };
  var VARS = ['bg', 'bg-soft', 'surface', 'card-hover', 'text', 'muted', 'primary', 'primary-strong', 'primary-hover', 'on-primary', 'blue-soft', 'border', 'border-strong'];
  var PAL = {
    ocean: { l: ['#eef5f8', '#e6f0f4', '#fbfeff', '#f1f8fb', '#16323f', '#4a6572', '#1d6f8f', '#1d6f8f', '#155670', '#ffffff', 'rgba(110,190,220,.25)', '#d5e5ec', '#bcd3de'], d: ['#0f1f29', '#0c1922', '#17303d', '#1d3b4b', '#eaf4f8', '#b4cbd6', '#8fd0e8', '#7fd6f5', '#5cc3e8', '#0c2a38', 'rgba(127,214,245,.15)', '#2b4b5c', '#3d6379'] },
    sunset: { l: ['#fbf1ea', '#f6e8de', '#fffaf6', '#fdf1e8', '#3a2418', '#7a5a48', '#c2512b', '#c2512b', '#9d3f1e', '#ffffff', 'rgba(255,170,120,.28)', '#f0dccd', '#e2c5b2'], d: ['#261712', '#1f130f', '#34211a', '#402a21', '#fbeee6', '#dcc0b0', '#ffb08a', '#ffa073', '#ff8c57', '#3a1a0c', 'rgba(255,160,115,.16)', '#5a3b2e', '#70483a'] },
    lavender: { l: ['#f3f0fa', '#ece7f7', '#fcfbff', '#f4f0fc', '#2a2145', '#62587f', '#6a4bc4', '#6a4bc4', '#523aa0', '#ffffff', 'rgba(180,160,240,.26)', '#e0d9f2', '#cbc0e6'], d: ['#1a1530', '#151128', '#251e45', '#2f2757', '#f1edfc', '#c4bce0', '#c0aaff', '#b79cff', '#a183fb', '#20174a', 'rgba(183,156,255,.16)', '#43396e', '#574a8a'] },
    rose: { l: ['#fbeff3', '#f6e6ec', '#fffafc', '#fdf0f5', '#3b1a28', '#7c5566', '#c2185b', '#c2185b', '#9c1049', '#ffffff', 'rgba(250,150,185,.26)', '#f2d6e0', '#e4bccb'], d: ['#2a1520', '#22101a', '#3a1e2d', '#472639', '#fdeef4', '#e2bccb', '#ff9ec0', '#ff8db5', '#ff72a3', '#4a0f28', 'rgba(255,141,181,.16)', '#5f3348', '#774560'] },
    graphite: { l: ['#eff0f2', '#e6e8ec', '#ffffff', '#f4f5f7', '#1c1f26', '#565c68', '#2f3748', '#2f3748', '#1c2230', '#ffffff', 'rgba(120,130,150,.18)', '#dcdee3', '#c3c7cf'], d: ['#14161b', '#0f1115', '#1e2128', '#272b34', '#eef0f4', '#b6bcc8', '#c4cad8', '#e2e6f0', '#cfd5e4', '#14161b', 'rgba(226,230,240,.12)', '#363b47', '#4a5160'] }
  };
  var ORDER = ['green', 'ocean', 'sunset', 'lavender', 'rose', 'graphite'];
  var SW = { green: ['#215c43', '#f4f1e4'], ocean: ['#1d6f8f', '#eef5f8'], sunset: ['#c2512b', '#fbf1ea'], lavender: ['#6a4bc4', '#f3f0fa'], rose: ['#c2185b', '#fbeff3'], graphite: ['#2f3748', '#eff0f2'] };
  var PRESETS = {
    aurora: { i: 'linear-gradient(135deg,#1e3a34 0%,#2f6f5e 40%,#7ac7a0 100%)', c: '' },
    dusk: { i: 'linear-gradient(160deg,#2a1b3d 0%,#6b3a6e 45%,#f2a36b 100%)', c: '' },
    ocean: { i: 'linear-gradient(160deg,#0b2a3d 0%,#1d6f8f 55%,#9fe0f0 100%)', c: '' },
    meadow: { i: 'linear-gradient(135deg,#f6f0c8 0%,#cfe8a9 55%,#8fcf9c 100%)', c: '' },
    paper: { i: 'linear-gradient(135deg,#f7f3e8 0%,#efe7d2 100%)', c: '' },
    peach: { i: 'linear-gradient(135deg,#ffe3d1 0%,#ffc8c8 55%,#e7c6ff 100%)', c: '' },
    mesh: { i: 'radial-gradient(at 20% 20%,#bfe6c8 0,transparent 50%),radial-gradient(at 80% 10%,#ffe29a 0,transparent 45%),radial-gradient(at 70% 80%,#f7b6a3 0,transparent 50%)', c: '#f4f1e4' }
  };
  var PRESET_ORDER = ['aurora', 'dusk', 'ocean', 'meadow', 'paper', 'peach', 'mesh'];
  var WINDOWS = ['', '#ffffff', '#fff8e7', '#e9f5ee', '#e8f1fb', '#fdeee8', '#f0eafb', '#1b1f24'];
  var TXT = {
    de: { mode: 'Darstellung', auto: 'Automatisch', light: 'Hell', dark: 'Dunkel', colors: 'Farben', colorsSub: 'Farbthema und Fensterfarbe. Gilt für alle Seiten.', pal: 'Farbthema', win: 'Fensterfarbe', winDef: 'Standard des Themas', winCustom: 'Eigene Farbe', n: { green: 'Lumo Grün', ocean: 'Ozean', sunset: 'Abendrot', lavender: 'Lavendel', rose: 'Rose', graphite: 'Graphit' }, glass: 'Glas-Effekt', glassSub: 'Fenster und Menü werden durchsichtig und weich gezeichnet, damit der Hintergrund durchscheint.', transp: 'Transparenz', blur: 'Unschärfe', bg: 'Hintergrund', bgSub: 'Eigenes Bild, fertiger Verlauf oder eine Farbe. Bleibt nur in diesem Browser.', none: 'Kein', color: 'Farbe', upload: 'Bild wählen', remove: 'Bild entfernen', yours: 'Dein Bild', fit: 'Bildgröße', cover: 'Füllen', contain: 'Einpassen', tile: 'Kacheln', dim: 'Abdunkeln', p: { aurora: 'Polarlicht', dusk: 'Dämmerung', ocean: 'Meer', meadow: 'Wiese', paper: 'Papier', peach: 'Pfirsich', mesh: 'Farbnebel' }, text: 'Text und Form', textSub: 'Schriftgröße, Ecken und Schrift.', size: 'Schriftgröße', radius: 'Ecken', sharp: 'Eckig', normal: 'Normal', round: 'Rund', font: 'Schrift', fDef: 'Standard', fSys: 'System', fSerif: 'Serif', access: 'Bedienung', calm: 'Weniger Bewegung', calmHint: 'Schaltet Animationen und Übergänge aus.', contrast: 'Hoher Kontrast', contrastHint: 'Text und Rahmen werden kräftiger.', reset: 'Alles zurücksetzen', ask: 'Alle Darstellungs-Einstellungen zurücksetzen?', big: 'Bild zu groß (max 10 MB).', err: 'Speichern nicht möglich. Bitte ein kleineres Bild wählen.' },
    en: { mode: 'Appearance', auto: 'Automatic', light: 'Light', dark: 'Dark', colors: 'Colors', colorsSub: 'Color theme and window color. Applies to every page.', pal: 'Color theme', win: 'Window color', winDef: 'Theme default', winCustom: 'Custom color', n: { green: 'Lumo Green', ocean: 'Ocean', sunset: 'Sunset', lavender: 'Lavender', rose: 'Rose', graphite: 'Graphite' }, glass: 'Glass effect', glassSub: 'Window and menu become see-through and softly blurred so the background shines through.', transp: 'Transparency', blur: 'Blur', bg: 'Background', bgSub: 'Your own image, a ready-made gradient or a color. Stays only in this browser.', none: 'None', color: 'Color', upload: 'Choose image', remove: 'Remove image', yours: 'Your image', fit: 'Image size', cover: 'Fill', contain: 'Fit', tile: 'Tile', dim: 'Darken', p: { aurora: 'Aurora', dusk: 'Dusk', ocean: 'Sea', meadow: 'Meadow', paper: 'Paper', peach: 'Peach', mesh: 'Color haze' }, text: 'Text and shape', textSub: 'Text size, corners and font.', size: 'Text size', radius: 'Corners', sharp: 'Sharp', normal: 'Normal', round: 'Round', font: 'Font', fDef: 'Default', fSys: 'System', fSerif: 'Serif', access: 'Accessibility', calm: 'Reduce motion', calmHint: 'Turns off animations and transitions.', contrast: 'High contrast', contrastHint: 'Text and borders become stronger.', reset: 'Reset everything', ask: 'Reset all appearance settings?', big: 'Image too large (max 10 MB).', err: 'Could not save. Please choose a smaller image.' },
    fa: { mode: 'حالت نمایش', auto: 'خودکار', light: 'روشن', dark: 'تیره', colors: 'رنگ‌ها', colorsSub: 'تم رنگی و رنگ پنجره. برای همه صفحه‌ها.', pal: 'تم رنگی', win: 'رنگ پنجره', winDef: 'پیش‌فرض تم', winCustom: 'رنگ دلخواه', n: { green: 'سبز لومو', ocean: 'اقیانوس', sunset: 'غروب', lavender: 'اسطوخودوس', rose: 'گل‌سرخی', graphite: 'گرافیت' }, glass: 'جلوه شیشه‌ای', glassSub: 'پنجره و منو کمی شفاف و محو می‌شوند تا پس‌زمینه دیده شود.', transp: 'شفافیت', blur: 'محوشدگی', bg: 'پس‌زمینه', bgSub: 'تصویر خودت، یک طرح آماده یا رنگ ساده. فقط در همین مرورگر می‌ماند.', none: 'بدون', color: 'رنگ', upload: 'انتخاب تصویر', remove: 'حذف تصویر', yours: 'تصویر تو', fit: 'اندازه تصویر', cover: 'پر کردن', contain: 'کامل', tile: 'تکرار', dim: 'تیره‌کردن', p: { aurora: 'شفق', dusk: 'گرگ‌ومیش', ocean: 'دریا', meadow: 'چمنزار', paper: 'کاغذ', peach: 'هلویی', mesh: 'مه رنگی' }, text: 'متن و شکل', textSub: 'اندازه نوشته، گوشه‌ها و قلم.', size: 'اندازه نوشته', radius: 'گوشه‌ها', sharp: 'تیز', normal: 'معمولی', round: 'گرد', font: 'قلم', fDef: 'استاندارد', fSys: 'سیستم', fSerif: 'سریف', access: 'دسترسی‌پذیری', calm: 'کاهش حرکت', calmHint: 'انیمیشن‌ها و جابه‌جایی‌ها خاموش می‌شوند.', contrast: 'کنتراست بالا', contrastHint: 'متن‌ها و کادرها پررنگ‌تر می‌شوند.', reset: 'بازگرداندن همه به پیش‌فرض', ask: 'همه تنظیمات ظاهر پاک شوند؟', big: 'تصویر خیلی بزرگ است (حداکثر ۱۰ مگابایت).', err: 'ذخیره نشد. تصویر کوچک‌تری انتخاب کن.' }
  };

  function hasImage() { try { return !!localStorage.getItem(IMG); } catch (e) { return false; } }
  function load() {
    var raw = null, s = {};
    try { raw = localStorage.getItem(KEY); s = JSON.parse(raw) || {}; } catch (e) { s = {}; }
    var o = {};
    Object.keys(DEF).forEach(function (k) { o[k] = s[k] === undefined ? DEF[k] : s[k]; });
    if (raw === null) {
      if (hasImage()) o.bgType = 'image';
      var ot = Number(localStorage.getItem('fisi-glass-opacity')), ob = Number(localStorage.getItem('fisi-glass-blur'));
      if (ot > 0) o.transp = ot;
      if (ob > 0) o.blur = ob;
    }
    return o;
  }
  var p = load();
  var seenImg = '';
  try { seenImg = localStorage.getItem(IMG) || ''; } catch (e) {}
  var lastTheme = root.getAttribute('data-theme') || 'light';
  var styleEl = document.createElement('style');
  styleEl.id = 'lumo-appearance-style';
  document.head.appendChild(styleEl);

  function save() { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 1;
    var n = parseInt(m[1], 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function mk(a) {
    var s = '';
    VARS.forEach(function (k, i) { s += '--' + k + ':' + a[i] + ';'; });
    return s + '--card:' + a[2] + ';--accent:' + a[7] + ';--code-bg:' + a[1] + ';--code-text:' + a[7] + ';';
  }
  function palCss() {
    var d = PAL[p.palette];
    return d ? 'html.lumo-site.lm-pal[data-theme=light]{' + mk(d.l) + '}html.lumo-site.lm-pal[data-theme=dark]{' + mk(d.d) + '}' : '';
  }
  function winCss() {
    var c = p.window;
    if (!c || !/^#[0-9a-f]{6}$/i.test(c)) return '';
    var dk = lum(c) < 0.4;
    var t = dk ? '#f4f6f8' : '#1b2430', m = dk ? '#c5ccd6' : '#4b5563', b = dk ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.13)';
    var css = 'html.lm-win body .panel{--surface:' + c + ';--card:' + c + ';--card-hover:' + c + ';--text:' + t + ';--muted:' + m + ';--border:' + b + ';--border-strong:' + b + ';--code-bg:' + (dk ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.05)') + ';--code-text:' + t + '}';
    return css;
  }
  function glass() {
    var has = (p.bgType === 'image' && hasImage()) || p.bgType === 'preset' || p.bgType === 'color';
    var t = p.transp === null ? (has ? 30 : 0) : p.transp;
    var b = p.blur === null ? (has ? 10 : 0) : p.blur;
    return [t, b];
  }
  function setTheme(t) {
    lastTheme = t;
    if (root.getAttribute('data-theme') !== t) root.setAttribute('data-theme', t);
    try { localStorage.setItem('fisi-theme', t); } catch (e) {}
  }
  function applyMode() {
    if (p.mode !== 'auto' || !window.matchMedia) return;
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function applyBackground() {
    var b = document.body;
    if (!b) return;
    var img = '', col = '', has = false, st = b.style;
    if (p.bgType === 'image' && hasImage()) { img = 'url("' + localStorage.getItem(IMG) + '")'; has = true; }
    else if (p.bgType === 'preset' && PRESETS[p.bgPreset]) { img = PRESETS[p.bgPreset].i; col = PRESETS[p.bgPreset].c; has = true; }
    else if (p.bgType === 'color' && p.bgColor) { col = p.bgColor; has = true; }
    root.classList.toggle('lm-has-bg', has);
    ['background-image', 'background-size', 'background-repeat', 'background-position', 'background-attachment', 'background-color'].forEach(function (k) { st.removeProperty(k); });
    if (!has) return;
    if (img) {
      var d = p.dim / 100;
      if (d > 0) img = 'linear-gradient(rgba(8,16,12,' + d + '),rgba(8,16,12,' + d + ')),' + img;
      st.setProperty('background-image', img, 'important');
      st.setProperty('background-size', p.fit === 'tile' ? 'auto' : (p.fit === 'contain' ? 'contain' : 'cover'), 'important');
      st.setProperty('background-repeat', p.fit === 'tile' ? 'repeat' : 'no-repeat', 'important');
      st.setProperty('background-position', 'center', 'important');
      st.setProperty('background-attachment', 'fixed', 'important');
    } else {
      st.setProperty('background-image', 'none', 'important');
    }
    if (col) st.setProperty('background-color', col, 'important');
  }
  function applyAll() {
    root.classList.toggle('lm-pal', !!PAL[p.palette]);
    root.classList.toggle('lm-win', !!p.window);
    root.classList.toggle('lm-calm', !!p.calm);
    root.classList.toggle('lm-contrast', !!p.contrast);
    root.classList.toggle('lm-r-sharp', p.radius === 'sharp');
    root.classList.toggle('lm-r-round', p.radius === 'round');
    root.classList.toggle('lm-font-system', p.font === 'system');
    root.classList.toggle('lm-font-serif', p.font === 'serif');
    root.style.fontSize = Number(p.size) === 100 ? '' : Number(p.size) + '%';
    styleEl.textContent = palCss() + winCss() + (p.contrast ? 'html.lm-contrast body .panel{--muted:var(--text)}' : '');
    var g = glass();
    root.classList.toggle('lm-glass', g[0] > 0 || g[1] > 0);
    root.style.setProperty('--lm-a', (100 - g[0]) + '%');
    root.style.setProperty('--lm-blur', g[1] + 'px');
    root.style.setProperty('--glass-opacity', g[0] / 100);
    root.style.setProperty('--glass-blur', g[1] + 'px');
    try { localStorage.setItem('fisi-glass-opacity', g[0]); localStorage.setItem('fisi-glass-blur', g[1]); } catch (e) {}
    applyBackground();
  }
  function commit() { save(); applyAll(); sync(); }
  function set(k, v) {
    if (k === 'mode') {
      if (v === 'auto') { p.mode = 'auto'; applyMode(); }
      else { p.mode = 'manual'; setTheme(v); }
    } else {
      p[k] = v;
    }
    commit();
  }

  function lang() { return TXT[root.lang] ? root.lang : (TXT[localStorage.getItem('fisi-lang')] ? localStorage.getItem('fisi-lang') : 'de'); }
  var host = null;
  function seg(key, opts) {
    return '<div class="lm-seg" role="group">' + opts.map(function (o) {
      return '<button type="button" class="lm-opt" data-set="' + key + '" data-val="' + o[0] + '" aria-pressed="false">' + o[1] + '</button>';
    }).join('') + '</div>';
  }
  function block(label, body) { return '<div class="lm-block"><span class="row-label">' + label + '</span>' + body + '</div>'; }
  function card(title, sub, body) { return '<section class="settings-card"><h2>' + title + '</h2><p class="card-sub">' + sub + '</p>' + body + '</section>'; }
  function range(id, label, max) {
    return '<div class="lm-range"><label for="lmR_' + id + '">' + label + '</label><input type="range" id="lmR_' + id + '" data-range="' + id + '" min="0" max="' + max + '" step="1"><output class="lm-out" data-out="' + id + '"></output></div>';
  }
  function toggle(key, label, hint) {
    return '<div class="setting-row setting-row-stack"><div class="row-main"><span class="row-label">' + label + '</span><button type="button" class="toggle" role="switch" aria-checked="false" aria-label="' + label + '" data-toggle="' + key + '"></button></div><p class="row-desc">' + hint + '</p></div>';
  }
  function build() {
    host = document.getElementById('panel-design');
    if (!host) return;
    var t = TXT[lang()];
    var chips = ORDER.map(function (id) {
      return '<button type="button" class="lm-chip" data-set="palette" data-val="' + id + '" aria-pressed="false"><span class="lm-sw" style="--c1:' + SW[id][0] + ';--c2:' + SW[id][1] + '"></span><span>' + t.n[id] + '</span></button>';
    }).join('');
    var wins = WINDOWS.map(function (c) {
      return '<button type="button" class="lm-win-sw' + (c ? '' : ' is-default') + '" data-set="window" data-val="' + c + '" aria-pressed="false" aria-label="' + (c || t.winDef) + '" title="' + (c || t.winDef) + '" style="--c:' + (c || 'transparent') + '"></button>';
    }).join('');
    var tiles = '<button type="button" class="lm-tile" data-bg="none" aria-pressed="false"><span>' + t.none + '</span></button>'
      + '<button type="button" class="lm-tile" data-bg="image" id="lmImgTile" aria-pressed="false" hidden><span>' + t.yours + '</span></button>'
      + PRESET_ORDER.map(function (id) {
        return '<button type="button" class="lm-tile" data-bg="' + id + '" aria-pressed="false" style="background-image:' + PRESETS[id].i + ';background-color:' + (PRESETS[id].c || 'transparent') + '"><span>' + t.p[id] + '</span></button>';
      }).join('')
      + '<label class="lm-tile lm-tile-color" data-bg-color="1"><input type="color" id="lmBgColor" class="lm-color" value="' + p.bgColor + '"><span>' + t.color + '</span></label>';
    host.innerHTML = [
      card(t.colors, t.colorsSub,
        block(t.mode, seg('mode', [['auto', t.auto], ['light', t.light], ['dark', t.dark]]))
        + block(t.pal, '<div class="lm-grid">' + chips + '</div>')
        + block(t.win, '<div class="lm-wins">' + wins + '<label class="lm-custom"><input type="color" id="lmWinColor" class="lm-color" value="#fff8e7"><span>' + t.winCustom + '</span></label></div>')),
      card(t.glass, t.glassSub, range('transp', t.transp, 80) + range('blur', t.blur, 40)),
      card(t.bg, t.bgSub,
        '<div class="lm-grid lm-tiles">' + tiles + '</div>'
        + '<div class="lm-actions"><button type="button" class="btn btn-primary" data-act="upload">' + t.upload + '</button><button type="button" class="btn btn-soft" data-act="remove" id="lmRemove" hidden>' + t.remove + '</button></div>'
        + '<input type="file" id="lmUpload" accept="image/*" class="sr-only">'
        + '<div class="lm-bgopts">' + block(t.fit, seg('fit', [['cover', t.cover], ['contain', t.contain], ['tile', t.tile]])) + range('dim', t.dim, 70) + '</div>'),
      card(t.text, t.textSub,
        block(t.size, seg('size', [['90', 'S'], ['100', 'M'], ['112', 'L'], ['125', 'XL']]))
        + block(t.radius, seg('radius', [['sharp', t.sharp], ['normal', t.normal], ['round', t.round]]))
        + block(t.font, seg('font', [['default', t.fDef], ['system', t.fSys], ['serif', t.fSerif]]))),
      card(t.access, '', toggle('calm', t.calm, t.calmHint) + toggle('contrast', t.contrast, t.contrastHint)),
      '<div class="lm-actions lm-reset"><button type="button" class="btn btn-soft" data-act="reset">' + t.reset + '</button></div>'
    ].join('');
    thumb();
    sync();
  }
  function thumb() {
    var tile = document.getElementById('lmImgTile');
    if (!tile) return;
    var has = hasImage();
    tile.hidden = !has;
    var rm = document.getElementById('lmRemove');
    if (rm) rm.hidden = !has;
    if (has) tile.style.backgroundImage = 'url("' + localStorage.getItem(IMG) + '")';
  }
  function cur(k) {
    if (k === 'mode') return p.mode === 'auto' ? 'auto' : (root.getAttribute('data-theme') || 'light');
    return String(p[k]);
  }
  function sync() {
    if (!host) return;
    host.querySelectorAll('[data-set]').forEach(function (el) { el.setAttribute('aria-pressed', cur(el.dataset.set) === el.dataset.val ? 'true' : 'false'); });
    host.querySelectorAll('[data-bg]').forEach(function (el) {
      var v = el.dataset.bg;
      var on = (v === 'none' && p.bgType === 'none') || (v === 'image' && p.bgType === 'image') || (p.bgType === 'preset' && p.bgPreset === v);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var colorTile = host.querySelector('[data-bg-color]');
    if (colorTile) colorTile.classList.toggle('is-on', p.bgType === 'color');
    var g = glass();
    var vals = { transp: g[0], blur: g[1], dim: p.dim };
    host.querySelectorAll('[data-range]').forEach(function (el) {
      var k = el.dataset.range;
      if (document.activeElement !== el) el.value = vals[k];
      var out = host.querySelector('[data-out="' + k + '"]');
      if (out) out.textContent = vals[k] + (k === 'blur' ? 'px' : '%');
    });
    host.querySelectorAll('[data-toggle]').forEach(function (el) {
      var on = !!p[el.dataset.toggle];
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    var opts = host.querySelector('.lm-bgopts');
    if (opts) opts.hidden = !(p.bgType === 'image' || p.bgType === 'preset');
    if (/^#[0-9a-f]{6}$/i.test(p.window || '')) { var wc = document.getElementById('lmWinColor'); if (wc) wc.value = p.window; }
  }
  function store(file, cb) {
    var tries = [[1920, 0.82], [1280, 0.7], [800, 0.6]], i = 0;
    var rd = new FileReader();
    rd.onerror = function () { cb(false); };
    rd.onload = function () {
      var img = new Image();
      img.onerror = function () { cb(false); };
      img.onload = function () {
        (function next() {
          if (i >= tries.length) return cb(false);
          var m = tries[i][0], q = tries[i][1];
          i += 1;
          var s = Math.min(1, m / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(img.width * s));
          c.height = Math.max(1, Math.round(img.height * s));
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          var out;
          try { out = c.toDataURL('image/jpeg', q); } catch (e) { return cb(false); }
          try { localStorage.setItem(IMG, out); cb(true); } catch (e2) { next(); }
        })();
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  function bindUI() {
    host = document.getElementById('panel-design');
    if (!host || host.dataset.lmReady) return;
    host.dataset.lmReady = '1';
    host.addEventListener('click', function (e) {
      var el = e.target.closest('[data-set],[data-bg],[data-toggle],[data-act]');
      if (!el || !host.contains(el)) return;
      var t = TXT[lang()];
      if (el.dataset.set) {
        var v = el.dataset.set === 'size' ? Number(el.dataset.val) : el.dataset.val;
        set(el.dataset.set, v);
      } else if (el.dataset.bg) {
        var b = el.dataset.bg;
        if (b === 'none' || b === 'image') p.bgType = b; else { p.bgType = 'preset'; p.bgPreset = b; }
        commit();
      } else if (el.dataset.toggle) {
        set(el.dataset.toggle, !p[el.dataset.toggle]);
      } else if (el.dataset.act === 'upload') {
        document.getElementById('lmUpload').click();
      } else if (el.dataset.act === 'remove') {
        try { localStorage.removeItem(IMG); } catch (e1) {}
        seenImg = '';
        if (p.bgType === 'image') p.bgType = 'none';
        commit();
        thumb();
      } else if (el.dataset.act === 'reset') {
        if (!window.confirm(t.ask)) return;
        try { localStorage.removeItem(KEY); localStorage.removeItem(IMG); localStorage.removeItem('fisi-glass-opacity'); localStorage.removeItem('fisi-glass-blur'); } catch (e2) {}
        seenImg = '';
        p = load();
        commit();
        thumb();
      }
    });
    host.addEventListener('input', function (e) {
      var el = e.target;
      if (el.dataset && el.dataset.range) {
        var k = el.dataset.range, n = Number(el.value);
        if (k === 'transp') p.transp = n; else if (k === 'blur') p.blur = n; else p.dim = n;
        commit();
      } else if (el.id === 'lmWinColor') {
        p.window = el.value;
        commit();
      } else if (el.id === 'lmBgColor') {
        p.bgColor = el.value;
        p.bgType = 'color';
        commit();
      }
    });
    host.addEventListener('change', function (e) {
      var el = e.target;
      if (el.id !== 'lmUpload') return;
      var f = el.files && el.files[0];
      var t = TXT[lang()];
      if (!f) return;
      if (f.size > 10 * 1024 * 1024) { window.alert(t.big); el.value = ''; return; }
      store(f, function (ok) {
        if (ok) {
          seenImg = localStorage.getItem(IMG) || '';
          p.bgType = 'image';
          commit();
          thumb();
        } else {
          window.alert(t.err);
        }
        el.value = '';
      });
    });
  }

  applyMode();
  applyAll();
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onMq = function () { if (p.mode === 'auto') { applyMode(); sync(); } };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }
  new MutationObserver(function () {
    var now = root.getAttribute('data-theme');
    if (now !== lastTheme) {
      lastTheme = now;
      if (p.mode === 'auto') { p.mode = 'manual'; save(); }
      sync();
    }
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  document.addEventListener('DOMContentLoaded', function () {
    applyAll();
    bindUI();
    build();
    setTimeout(function () {
      window.applyCustomBackground = function () {
        var now = '';
        try { now = localStorage.getItem(IMG) || ''; } catch (e) {}
        if (now && now !== seenImg) { seenImg = now; p.bgType = 'image'; save(); }
        applyAll();
      };
      window.removeBackground = function () {
        try { localStorage.removeItem(IMG); } catch (e) {}
        seenImg = '';
        if (p.bgType === 'image') { p.bgType = 'none'; save(); }
        applyAll();
      };
      applyAll();
    }, 0);
  });
  document.addEventListener('fisi-lang', function () { build(); });
})();
