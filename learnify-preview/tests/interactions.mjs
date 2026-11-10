#!/usr/bin/env node
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const shots = path.join(root, "screenshots");
mkdirSync(shots, { recursive: true });

function findChrome() {
  return process.env.CHROME_PATH || "/usr/bin/google-chrome";
}

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error("Server did not start: " + url);
}

const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
  cwd: root,
  stdio: "ignore",
});

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? " — " + detail : ""}`);
}

try {
  await waitForServer("http://127.0.0.1:4173/index.html");

  let puppeteer;
  try {
    const require = createRequire(import.meta.url);
    puppeteer = require("puppeteer-core");
  } catch {
    console.log("Installing puppeteer-core…");
    await new Promise((resolve, reject) => {
      const npm = spawn("npm", ["install", "--no-fund", "--no-audit", "puppeteer-core@23"], {
        cwd: root,
        stdio: "inherit",
      });
      npm.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("npm install failed"))));
    });
    const require = createRequire(import.meta.url);
    puppeteer = require("puppeteer-core");
  }

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  const page = await browser.newPage();

  async function noHorizontalScroll() {
    return page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      return {
        clientWidth: doc.clientWidth,
        scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
        overflow: Math.max(doc.scrollWidth, body.scrollWidth) > doc.clientWidth + 1,
      };
    });
  }

  await page.setViewport({ width: 1024, height: 867, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "networkidle0" });
  await page.waitForSelector("h1");

  const title = await page.$eval("h1", (el) => el.textContent.trim());
  record("H1 is Einstellungen", title === "Einstellungen", title);

  const activeNav = await page.$eval(".nav-item.is-active span", (el) => el.textContent.trim());
  record("Active nav is Einstellungen", activeNav === "Einstellungen", activeNav);

  const tabs = await page.$$eval(".tab", (els) => els.map((el) => el.textContent.replace(/\s+/g, " ").trim()));
  record("Six tabs in order", tabs.join("|") === "Allgemein|App-Verwaltung|Benutzerverwaltung|Rollen & Rechte|KI & Lernen|Design", tabs.join("|"));

  const activeTab = await page.$eval(".tab.is-active", (el) => el.textContent.replace(/\s+/g, " ").trim());
  record("Active tab is Allgemein", activeTab.includes("Allgemein"), activeTab);

  const userCount = await page.$$eval("#userTableBody tr", (rows) => rows.length);
  record("Five users rendered", userCount === 5, String(userCount));

  const firstUser = await page.$eval("#userTableBody tr:first-child", (el) => el.innerText);
  record("First user is Mujtaba Najafi", firstUser.includes("Mujtaba Najafi") && firstUser.includes("mujtaba@schule.de"), firstUser.replace(/\s+/g, " "));

  await page.click("#tab-app");
  record("App-Verwaltung tab highlights card", await page.$eval("#card-app", (el) => el.classList.contains("is-highlight")));

  await page.click("#tab-design");
  record("Design tab highlights Dark Mode row", await page.$eval("#row-darkmode", (el) => el.classList.contains("is-highlight")));
  record("Design tab focuses Dark Mode toggle", await page.evaluate(() => document.activeElement && document.activeElement.id === "toggle-dark"));

  await page.click("#tab-allgemein");
  record("Allgemein tab highlights Allgemeine Einstellungen", await page.$eval("#card-allgemein", (el) => el.classList.contains("is-highlight")));

  const before = await page.$eval("#toggle-dark", (el) => el.getAttribute("aria-checked"));
  await page.click("#toggle-dark");
  const after = await page.$eval("#toggle-dark", (el) => el.getAttribute("aria-checked"));
  const theme = await page.$eval("html", (el) => el.getAttribute("data-theme"));
  record("Dark Mode toggle applies theme", before === "false" && after === "true" && theme === "dark", `${before} → ${after}, theme=${theme}`);
  await page.click("#toggle-dark");

  const lang = await page.$eval("#setting-language", (el) => el.options[el.selectedIndex].text);
  record("Language select is Deutsch", lang === "Deutsch", lang);
  const tz = await page.$eval("#setting-timezone", (el) => el.options[el.selectedIndex].text);
  record("Timezone is (GMT+01:00) Berlin", tz === "(GMT+01:00) Berlin", tz);

  await page.click("#bellBtn");
  record("Bell opens notification panel", !(await page.$eval("#notifPanel", (el) => el.hidden)));
  record("Opening bell hides red dot", await page.$eval("#bellDot", (el) => el.classList.contains("is-hidden")));

  await page.click("#createUserBtn");
  await page.waitForSelector("#userDialog[open]");
  await page.type('#userForm input[name="name"]', "Nora Beck");
  await page.type('#userForm input[name="email"]', "nora@schule.de");
  await page.select('#userForm select[name="role"]', "Lehrerin");
  await page.click('#userForm button[value="save"]');
  await page.waitForFunction(() => document.querySelectorAll("#userTableBody tr").length === 6);
  record("Create user adds a table row", (await page.$$eval("#userTableBody tr", (rows) => rows.length)) === 6);

  await page.click("#userSearch", { clickCount: 3 });
  await page.type("#userSearch", "Emma");
  const filtered = await page.$$eval("#userTableBody tr", (rows) => rows.length);
  record("User search filters table", filtered === 1, String(filtered));
  await page.click("#userSearch", { clickCount: 3 });
  await page.keyboard.press("Backspace");

  await page.evaluate(() => document.querySelectorAll(".toast").forEach((n) => n.remove()));
  await page.click("#manageRolesBtn");
  await page.waitForSelector("#roleDialog[open]", { timeout: 4000 });
  record("Rollen verwalten opens dialog", await page.$eval("#roleDialog", (el) => el.open));
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("#roleDialog").open);
  record("Escape closes role dialog", true);

  const downloadDir = path.join(root, "screenshots");
  const cdp = await page.createCDPSession();
  await cdp.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: downloadDir });
  await page.click("#exportBtn");
  await page.waitForFunction(() => document.querySelector("#toasts .toast"));
  record("Export shows toast", true);

  await page.focus("#toggle-notify");
  await page.keyboard.press("Space");
  const notifyOff = await page.$eval("#toggle-notify", (el) => el.getAttribute("aria-checked"));
  record("Keyboard Space toggles switch", notifyOff === "false", notifyOff);

  await page.click('a.nav-item[data-nav="kurse"]');
  record("Kurse nav shows Kurse heading", (await page.$eval("#placeholderTitle", (el) => el.textContent.trim())) === "Kurse");
  await page.click('a.nav-item[data-nav="einstellungen"]');
  record("Einstellungen nav returns", !(await page.$eval("#view-einstellungen", (el) => el.hidden)));

  const headers = await page.$$eval(".user-table thead th", (els) => els.map((el) => el.textContent.trim()));
  record("Table has Letzte Anmeldung and Aktionen", headers.includes("Letzte Anmeldung") && headers.includes("Aktionen"), headers.join("|"));

  await page.setViewport({ width: 1024, height: 867, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 200));
  const overflow1024 = await noHorizontalScroll();
  record("No horizontal scroll at 1024", !overflow1024.overflow, JSON.stringify(overflow1024));
  await page.screenshot({ path: path.join(shots, "desktop-1024x867.png"), fullPage: false });

  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 200));
  const overflow768 = await noHorizontalScroll();
  record("No horizontal scroll at 768", !overflow768.overflow, JSON.stringify(overflow768));
  await page.screenshot({ path: path.join(shots, "tablet-768.png"), fullPage: true });
  const hamburger768 = await page.$eval(".menu-toggle", (el) => getComputedStyle(el).display !== "none");
  record("Hamburger visible at 768", hamburger768);

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 200));
  const overflow390 = await noHorizontalScroll();
  record("No horizontal scroll at 390", !overflow390.overflow, JSON.stringify(overflow390));
  await page.screenshot({ path: path.join(shots, "mobile-390.png"), fullPage: true });
  await page.click("#menuToggle");
  record("Mobile menu opens sidebar", await page.$eval("#sidebar", (el) => el.classList.contains("is-open")));

  await browser.close();
} catch (err) {
  record("Runner error", false, err.stack || String(err));
} finally {
  server.killed || server.kill("SIGTERM");
}

const failed = results.filter((r) => !r.ok);
writeFileSync(path.join(root, "tests/results.json"), JSON.stringify({ results, failed: failed.length }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
