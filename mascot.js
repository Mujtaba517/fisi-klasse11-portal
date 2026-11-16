/* Cat mascot: transparent VP9 loop, with an animated WebP fallback where WebM alpha is missing. */
(function (global) {
  var W = 414;
  var H = 480;
  var POSTER = 'assets/mascot/cat.webp';
  var WEBM = 'assets/mascot/cat-loop.webm';
  var WEBP = 'assets/mascot/cat-loop.webp';

  function reduced() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  /* Safari and every iOS browser can play WebM but drop the alpha plane, which paints a white box. */
  function webmAlphaOk() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return false;
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return false;
    var safari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Android/i.test(ua);
    return !safari;
  }

  function still(lazy) {
    return '<img class="cat-mascot-still" src="' + POSTER + '" width="' + W + '" height="' + H + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>';
  }

  function html(opts) {
    opts = opts || {};
    var lazy = !!opts.lazy;
    var box = '<span class="cat-mascot';
    if (reduced()) {
      return box + ' is-still">' + still(lazy) + '</span>';
    }
    if (!webmAlphaOk()) {
      return box + ' is-fallback">' +
        '<img class="cat-mascot-fallback" src="' + WEBP + '" width="' + W + '" height="' + H + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>' +
        still(lazy) + '</span>';
    }
    var preload = lazy ? 'none' : (opts.preload || 'auto');
    return box + '">' +
      '<video class="cat-mascot-video" width="' + W + '" height="' + H + '" autoplay loop muted playsinline poster="' + POSTER + '" preload="' + preload + '" disablepictureinpicture aria-hidden="true">' +
        '<source src="' + WEBM + '" type="video/webm" media="(prefers-reduced-motion: no-preference)">' +
      '</video>' +
      '<img class="cat-mascot-fallback" width="' + W + '" height="' + H + '" alt="" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>' +
      still(lazy) + '</span>';
  }

  function bind(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll ? scope.querySelectorAll('.cat-mascot-video') : [];
    Array.prototype.forEach.call(nodes, function (v) {
      if (v.dataset.catBound) return;
      v.dataset.catBound = '1';
      v.addEventListener('error', function () {
        var box = v.closest('.cat-mascot');
        if (!box) return;
        box.classList.add('is-fallback');
        var img = box.querySelector('.cat-mascot-fallback');
        if (img && !img.getAttribute('src')) img.src = WEBP;
      });
    });
  }

  function replay(root) {
    if (reduced()) return;
    var scope = root && root.querySelector ? root : document;
    var v = scope.querySelector('.cat-mascot-video');
    if (!v || v.hidden) return;
    try {
      v.currentTime = 0;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  global.LernovaCat = { html: html, bind: bind, replay: replay, width: W, height: H };
})(window);
