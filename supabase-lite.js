/* Small Supabase client without a library: sign up, sign in, profile, progress sync. Uses fetch only. */
(function () {
  'use strict';
  var cfg = window.LERNOVA_SUPABASE || {};
  var SKEY = 'lernova-sb-session';
  var ACT = 'fisi-activity';
  var SYNC_AT = 'lernova-sync-at';
  var SYNC_USER = 'lernova-sync-user';

  function nowSec() { return Math.floor(Date.now() / 1000); }
  function getSession() { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } }
  function setSession(s) { try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch (e) {} }
  function normalize(d, fallbackUser) {
    if (!d || !d.access_token) return null;
    var u = d.user || fallbackUser || null;
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: d.expires_at || (nowSec() + (d.expires_in || 3600)),
      user: u ? { id: u.id, email: u.email } : null
    };
  }

  async function request(url, opts) {
    var res = await fetch(url, opts);
    var text = await res.text();
    var data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) {}
    if (!res.ok) {
      var err = new Error((data && (data.msg || data.message || data.error_description || data.error)) || ('HTTP ' + res.status));
      err.status = res.status;
      err.code = data && (data.error_code || data.code);
      throw err;
    }
    return data;
  }

  function authCall(path, method, body, bearer) {
    var h = { apikey: cfg.key, 'Content-Type': 'application/json' };
    if (bearer) h.Authorization = 'Bearer ' + bearer;
    return request(cfg.url + '/auth/v1' + path, { method: method, headers: h, body: body == null ? undefined : JSON.stringify(body) });
  }

  var refreshing = null;
  function refresh() {
    var s = getSession();
    if (!s || !s.refresh_token) return Promise.resolve(null);
    if (!refreshing) {
      refreshing = authCall('/token?grant_type=refresh_token', 'POST', { refresh_token: s.refresh_token })
        .then(function (d) {
          var n = normalize(d, s.user);
          if (n) setSession(n);
          return n;
        })
        .catch(function (e) {
          if (e.status === 400 || e.status === 401 || e.status === 403) setSession(null);
          return null;
        })
        .then(function (r) { refreshing = null; return r; });
    }
    return refreshing;
  }

  async function accessToken() {
    var s = getSession();
    if (!s) return null;
    if (s.expires_at - nowSec() < 60) s = await refresh();
    return s ? s.access_token : null;
  }

  async function rest(method, path, body, extra) {
    var t = await accessToken();
    if (!t) throw new Error('not_signed_in');
    var h = { apikey: cfg.key, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return request(cfg.url + '/rest/v1/' + path, { method: method, headers: h, body: body == null ? undefined : JSON.stringify(body) });
  }

  function mapProfile(p, email) {
    return {
      id: p.id, username: p.username,
      firstName: p.first_name || '', lastName: p.last_name || '', studentId: p.student_id || '',
      email: email || '', role: p.role || 'student', approved: !!p.approved,
      avatar: p.avatar_color || 'lime', avatarIcon: p.avatar_icon || '', photo: p.avatar_url || '',
      registeredAt: p.created_at || ''
    };
  }

  function setAuth(rec) {
    try {
      sessionStorage.setItem('fisi-auth', JSON.stringify({
        username: rec.username,
        name: ((rec.firstName || '') + ' ' + (rec.lastName || '')).trim() || rec.username,
        role: rec.role, id: rec.id, approved: rec.approved
      }));
      sessionStorage.setItem('lernova-profile', JSON.stringify(rec));
    } catch (e) {}
  }

  function cachedRec() {
    try { return JSON.parse(sessionStorage.getItem('lernova-profile') || 'null'); } catch (e) { return null; }
  }

  async function fetchProfileRec() {
    var s = getSession();
    if (!s || !s.user) return null;
    var rows = await rest('GET', 'profiles?id=eq.' + encodeURIComponent(s.user.id) + '&select=*');
    return rows && rows[0] ? mapProfile(rows[0], s.user.email) : null;
  }

  async function establish() {
    var rec = await fetchProfileRec();
    if (rec) setAuth(rec);
    return rec;
  }

  async function signIn(email, password) {
    var d = await authCall('/token?grant_type=password', 'POST', { email: email, password: password });
    var s = normalize(d);
    if (!s) throw new Error('no_session');
    setSession(s);
    return s;
  }

  async function signUp(email, password, meta, redirectTo) {
    var q = redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : '';
    var d = await authCall('/signup' + q, 'POST', { email: email, password: password, data: meta || {} });
    return { needsConfirm: !(d && d.access_token) };
  }

  function recover(email, redirectTo) {
    var q = redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : '';
    return authCall('/recover' + q, 'POST', { email: email });
  }

  function setPasswordWithToken(token, password) {
    return authCall('/user', 'PUT', { password: password }, token);
  }

  async function changePassword(current, next) {
    var s = getSession();
    if (!s || !s.user) throw new Error('not_signed_in');
    try {
      await authCall('/token?grant_type=password', 'POST', { email: s.user.email, password: current });
    } catch (e) {
      if (e.status === 400 || e.status === 401) throw new Error('wrong_password');
      throw e;
    }
    var t = await accessToken();
    if (!t) throw new Error('not_signed_in');
    await authCall('/user', 'PUT', { password: next }, t);
  }

  async function updateProfile(patch) {
    var s = getSession();
    if (!s || !s.user) throw new Error('not_signed_in');
    var body = {};
    if ('firstName' in patch) body.first_name = patch.firstName;
    if ('lastName' in patch) body.last_name = patch.lastName;
    if ('studentId' in patch) body.student_id = patch.studentId;
    if ('avatar' in patch) body.avatar_color = patch.avatar;
    if ('avatarIcon' in patch) body.avatar_icon = patch.avatarIcon;
    if ('photo' in patch) body.avatar_url = patch.photo;
    var rows = await rest('PATCH', 'profiles?id=eq.' + encodeURIComponent(s.user.id) + '&select=*', body, { Prefer: 'return=representation' });
    if (!rows || !rows[0]) throw new Error('not_saved');
    var rec = mapProfile(rows[0], s.user.email);
    setAuth(rec);
    return rec;
  }

  function signOutLocal() {
    var s = getSession();
    if (s && s.access_token) {
      try {
        fetch(cfg.url + '/auth/v1/logout', { method: 'POST', keepalive: true, headers: { apikey: cfg.key, Authorization: 'Bearer ' + s.access_token } });
      } catch (e) {}
    }
    setSession(null);
    try { sessionStorage.removeItem('fisi-auth'); sessionStorage.removeItem('lernova-profile'); } catch (e) {}
  }

  async function restore() {
    var s = getSession();
    if (!s) return false;
    try {
      if (s.expires_at - nowSec() < 60) { s = await refresh(); if (!s) return false; }
      var rec = await establish();
      if (!rec) return false;
      if (!rec.approved && rec.role !== 'admin') { signOutLocal(); return false; }
      return true;
    } catch (e) { return false; }
  }

  /* Progress sync: local activity (fisi-activity) <-> table progress. */
  function readAct() { try { return JSON.parse(localStorage.getItem(ACT)) || {}; } catch (e) { return {}; } }
  function rowFor(uid, page, id, l) {
    return { user_id: uid, page: page, topic_id: id, title: String(l.title || id).slice(0, 200), checked: !!l.checked, updated_at: new Date(l.updated).toISOString() };
  }
  function upsert(rows) {
    return rest('POST', 'progress?on_conflict=user_id,page,topic_id', rows, { Prefer: 'resolution=merge-duplicates,return=minimal' });
  }

  async function syncProgress() {
    var s = getSession();
    if (!s || !s.user) return;
    var uid = s.user.id;
    var prev = localStorage.getItem(SYNC_USER);
    if (prev && prev !== uid) { localStorage.removeItem(ACT); localStorage.removeItem(SYNC_AT); }
    localStorage.setItem(SYNC_USER, uid);
    var started = Date.now();
    var rows = await rest('GET', 'progress?select=page,topic_id,title,checked,updated_at');
    var all = readAct();
    var changed = false;
    var remote = {};
    (rows || []).forEach(function (r) {
      var ts = Date.parse(r.updated_at) || 0;
      remote[r.page + '|' + r.topic_id] = ts;
      var loc = (all[r.page] || {})[r.topic_id];
      if (!loc || (loc.updated || 0) < ts) {
        if (!all[r.page]) all[r.page] = {};
        var merged = {};
        if (loc) Object.keys(loc).forEach(function (k) { merged[k] = loc[k]; });
        merged.title = r.title || r.topic_id;
        merged.checked = !!r.checked;
        merged.opened = true;
        merged.updated = ts;
        all[r.page][r.topic_id] = merged;
        changed = true;
      }
    });
    if (changed) localStorage.setItem(ACT, JSON.stringify(all));
    var out = [];
    Object.keys(all).forEach(function (page) {
      Object.keys(all[page] || {}).forEach(function (id) {
        var l = all[page][id];
        if (!l || !l.updated) return;
        var rt = remote[page + '|' + id];
        if (rt == null || l.updated > rt) out.push(rowFor(uid, page, id, l));
      });
    });
    if (out.length) await upsert(out);
    localStorage.setItem(SYNC_AT, String(started));
  }

  async function pushNewer() {
    var s = getSession();
    if (!s || !s.user) return;
    var since = Number(localStorage.getItem(SYNC_AT) || 0);
    var started = Date.now();
    var all = readAct();
    var out = [];
    Object.keys(all).forEach(function (page) {
      Object.keys(all[page] || {}).forEach(function (id) {
        var l = all[page][id];
        if (l && l.updated && l.updated > since) out.push(rowFor(s.user.id, page, id, l));
      });
    });
    if (out.length) await upsert(out);
    localStorage.setItem(SYNC_AT, String(started));
  }

  var timer = null;
  function schedulePush() {
    clearTimeout(timer);
    timer = setTimeout(function () { pushNewer().catch(function () {}); }, 1500);
  }

  function hook() {
    if (typeof window.recordActivity === 'function' && !window.recordActivity._sb) {
      var orig = window.recordActivity;
      var wrapped = function () {
        var r = orig.apply(this, arguments);
        schedulePush();
        return r;
      };
      wrapped._sb = 1;
      window.recordActivity = wrapped;
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('#shellLogout,#logoutBtn,#pfLogout') : null;
    if (t) signOutLocal();
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    if (/login\.html$/.test(location.pathname)) return;
    if (!getSession() || !sessionStorage.getItem('fisi-auth')) return;
    hook();
    syncProgress().catch(function () {});
  });

  window.LernovaSB = {
    getSession: getSession, signIn: signIn, signUp: signUp, recover: recover,
    setPasswordWithToken: setPasswordWithToken, changePassword: changePassword,
    updateProfile: updateProfile, fetchProfileRec: fetchProfileRec, cachedRec: cachedRec,
    establish: establish, restore: restore, signOutLocal: signOutLocal, syncProgress: syncProgress
  };
})();
