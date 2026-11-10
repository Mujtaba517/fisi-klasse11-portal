(() => {
  "use strict";

  const ROLE_PILL = {
    Administrator: "pill-admin",
    Lehrerin: "pill-teacher",
    Schüler: "pill-student",
    Schülerin: "pill-student",
    Gast: "pill-guest",
  };

  const AVATAR_COLORS = ["blue", "pink", "green", "purple", "red", "amber", "teal"];

  const users = [
    { id: 1, name: "Mujtaba Najafi", email: "mujtaba@schule.de", initials: "MN", role: "Administrator", status: "Online", color: "blue", lastLogin: "Heute, 10:24" },
    { id: 2, name: "Emma Schneider", email: "emma@schule.de", initials: "ES", role: "Lehrerin", status: "Offline", color: "pink", lastLogin: "Gestern, 16:12" },
    { id: 3, name: "Lukas Meier", email: "lukas@schule.de", initials: "LM", role: "Schüler", status: "Online", color: "green", lastLogin: "Heute, 09:03" },
    { id: 4, name: "Sophie Khan", email: "sophie@schule.de", initials: "SK", role: "Schülerin", status: "Offline", color: "purple", lastLogin: "12.04.2025" },
    { id: 5, name: "Ali Rahimi", email: "ali@schule.de", initials: "AR", role: "Gast", status: "Offline", color: "red", lastLogin: "10.04.2025" },
  ];

  const ROLE_INFO = [
    { name: "Administrator", desc: "Vollzugriff auf alle Funktionen" },
    { name: "Lehrer/in", desc: "Kurse erstellen und verwalten" },
    { name: "Schüler/in", desc: "Kurse besuchen und Aufgaben bearbeiten." },
    { name: "Gast", desc: "Nur Leserechte" },
  ];

  const TAB_TARGETS = {
    allgemein: "#card-allgemein",
    app: "#card-app",
    users: "#card-users",
    roles: "#card-roles",
    ki: "#card-ki",
    design: "#row-darkmode",
  };

  let editingId = null;
  let nextId = 6;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function toast(message) {
    const region = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function initialsFrom(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderUsers() {
    const q = ($("#userSearch").value || "").trim().toLowerCase();
    const tbody = $("#userTableBody");
    const rows = users.filter((u) => {
      if (!q) return true;
      return [u.name, u.email, u.role, u.status, u.lastLogin].join(" ").toLowerCase().includes(q);
    });
    tbody.innerHTML = rows
      .map(
        (u) => `
      <tr data-id="${u.id}">
        <td class="col-icon"><span class="avatar avatar-${u.color}" aria-hidden="true">${u.initials}</span></td>
        <td class="col-name">
          <span class="name">${escapeHtml(u.name)}</span>
          <span class="email">${escapeHtml(u.email)}</span>
        </td>
        <td class="col-role"><span class="pill ${ROLE_PILL[u.role] || "pill-guest"}">${escapeHtml(u.role)}</span></td>
        <td class="col-login">${escapeHtml(u.lastLogin || "")}</td>
        <td class="col-status"><span class="pill ${u.status === "Online" ? "pill-online" : "pill-offline"}">${escapeHtml(u.status)}</span></td>
        <td class="col-actions">
          <button type="button" class="row-action" data-edit="${u.id}" aria-label="${escapeHtml(u.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
          </button>
        </td>
      </tr>`
      )
      .join("");
  }

  function setTab(id) {
    $$(".tab").forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    $$(".is-highlight").forEach((el) => el.classList.remove("is-highlight"));
    const target = $(TAB_TARGETS[id] || "#card-allgemein");
    if (!target) return;
    target.classList.add("is-highlight");
    target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (id === "design") {
      const toggle = $("#toggle-dark");
      if (toggle) toggle.focus();
    }
    window.setTimeout(() => target.classList.remove("is-highlight"), 1600);
  }

  function showSettings() {
    $$(".nav-item").forEach((item) => {
      const on = item.dataset.nav === "einstellungen";
      item.classList.toggle("is-active", on);
      if (on) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    $("#view-einstellungen").hidden = false;
    $("#view-placeholder").hidden = true;
    closeSidebar();
  }

  function showPlaceholder(key, label) {
    $$(".nav-item").forEach((item) => {
      const on = item.dataset.nav === key;
      item.classList.toggle("is-active", on);
      if (on) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    $("#placeholderTitle").textContent = label;
    $("#view-einstellungen").hidden = true;
    $("#view-placeholder").hidden = false;
    closeSidebar();
  }

  function openSidebar() {
    $("#sidebar").classList.add("is-open");
    $("#backdrop").hidden = false;
    $("#menuToggle").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("is-open");
    $("#backdrop").hidden = true;
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }

  function openUserDialog(user) {
    const dialog = $("#userDialog");
    const form = $("#userForm");
    if (user) {
      editingId = user.id;
      $("#userDialogTitle").textContent = user.name;
      form.name.value = user.name;
      form.email.value = user.email;
      form.role.value = user.role;
      form.status.value = user.status;
    } else {
      editingId = null;
      $("#userDialogTitle").textContent = "Benutzer erstellen";
      form.reset();
      form.status.value = "Offline";
    }
    dialog.showModal();
    form.name.focus();
  }

  function exportData() {
    const payload = {
      platform: "Learnify",
      version: "v2.4.1",
      settings: {
        language: $("#setting-language").value,
        timezone: $("#setting-timezone").value,
        notifications: $("#toggle-notify").classList.contains("is-on"),
        darkMode: $("#toggle-dark").classList.contains("is-on"),
        updates: $("#toggle-updates").classList.contains("is-on"),
        backup: $("#toggle-backup").classList.contains("is-on"),
      },
      users,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learnify-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Export starten");
  }

  function applyGlobalSearch(value) {
    const q = value.trim().toLowerCase();
    $$("[data-search]").forEach((row) => {
      const hay = (row.dataset.search + " " + row.textContent).toLowerCase();
      row.classList.toggle("is-dim", Boolean(q) && !hay.includes(q));
    });
  }

  function openRoleDialog(role) {
    const list = $("#permList");
    const items = role ? ROLE_INFO.filter((r) => r.name === role) : ROLE_INFO;
    $("#roleDialogTitle").textContent = "Rollen verwalten";
    list.innerHTML = items
      .map(
        (r) => `<li><span><strong>${escapeHtml(r.name)}</strong> ${escapeHtml(r.desc)}</span>
        <button type="button" class="toggle is-on" role="switch" aria-checked="true" aria-label="${escapeHtml(r.name)}"></button></li>`
      )
      .join("");
    $("#roleDialog").showModal();
  }

  function applyDark(on) {
    document.documentElement.setAttribute("data-theme", on ? "dark" : "light");
  }

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".toggle");
    if (!toggle) return;
    const on = !toggle.classList.contains("is-on");
    toggle.classList.toggle("is-on", on);
    toggle.setAttribute("aria-checked", String(on));
    if (toggle.id === "toggle-dark") applyDark(on);
  });

  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const key = item.dataset.nav;
      const label = item.querySelector("span").textContent.trim();
      if (key === "einstellungen") showSettings();
      else showPlaceholder(key, label);
    });
  });

  $$(".tab").forEach((tab, index, tabs) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + dir + tabs.length) % tabs.length];
      next.focus();
      setTab(next.dataset.tab);
    });
  });

  $("#globalSearch").addEventListener("input", (e) => applyGlobalSearch(e.target.value));
  $("#userSearch").addEventListener("input", renderUsers);

  $("#exportBtn").addEventListener("click", exportData);
  $("#createUserBtn").addEventListener("click", () => openUserDialog(null));

  $("#userTableBody").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-edit]");
    if (!btn) return;
    const user = users.find((u) => String(u.id) === btn.dataset.edit);
    if (user) openUserDialog(user);
  });

  $("#userForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value;
    const status = form.status.value;
    if (!name || !email) return;
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== editingId)) return;
    if (editingId) {
      const user = users.find((u) => u.id === editingId);
      Object.assign(user, { name, email, role, status, initials: initialsFrom(name) });
    } else {
      users.push({
        id: nextId++,
        name,
        email,
        role,
        status,
        lastLogin: "",
        initials: initialsFrom(name),
        color: AVATAR_COLORS[(nextId + 2) % AVATAR_COLORS.length],
      });
    }
    $("#userDialog").close();
    renderUsers();
    toast("Benutzer erstellen");
  });

  $("#userDialogCancel").addEventListener("click", () => $("#userDialog").close());

  $$(".role-row").forEach((row) => {
    row.addEventListener("click", () => openRoleDialog(row.dataset.role));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRoleDialog(row.dataset.role);
      }
    });
  });
  $("#manageRolesBtn").addEventListener("click", () => openRoleDialog(null));
  $("#roleDialogClose").addEventListener("click", () => $("#roleDialog").close());

  $("#promoCard").addEventListener("click", () => $("#promoDialog").showModal());
  $("#promoDialogClose").addEventListener("click", () => $("#promoDialog").close());

  $("#logoutBtn").addEventListener("click", () => $("#logoutDialog").showModal());
  $("#logoutCancel").addEventListener("click", () => $("#logoutDialog").close());
  $("#logoutConfirm").addEventListener("click", () => $("#logoutDialog").close());

  $("#bellBtn").addEventListener("click", (event) => {
    event.stopPropagation();
    const panel = $("#notifPanel");
    const open = panel.hidden;
    panel.hidden = !open;
    $("#bellBtn").setAttribute("aria-expanded", String(open));
    if (open) $("#bellDot").classList.add("is-hidden");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-tools")) {
      $("#notifPanel").hidden = true;
      $("#bellBtn").setAttribute("aria-expanded", "false");
    }
  });

  $("#menuToggle").addEventListener("click", () => {
    if ($("#sidebar").classList.contains("is-open")) closeSidebar();
    else openSidebar();
  });
  $("#backdrop").addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });

  renderUsers();
})();
