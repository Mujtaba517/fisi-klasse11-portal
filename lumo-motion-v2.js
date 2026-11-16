/* Plays the cat loop. Speech and move buttons stay in learning-app.js; a move restarts the loop. */
(function () {
  'use strict';
  function video() {
    return document.querySelector('#lumoHello .cat-mascot-video');
  }
  function mount() {
    if (window.LernovaCat) window.LernovaCat.bind(document.getElementById('lumoHello') || document);
    var v = video();
    if (!v) return;
    var play = v.play();
    if (play && play.catch) play.catch(function () {});
  }
  window.LumoMotion = {
    mount: mount,
    play: function () {
      if (window.LernovaCat) window.LernovaCat.replay(document.getElementById('lumoHello') || document);
    },
    destroy: function () {
      var v = video();
      if (v) v.pause();
    }
  };
})();
