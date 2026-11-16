# FISI Klasse 11 Portal

پورتال آموزشی چندزبانه برای **Fachinformatiker Systemintegration – صنف ۱۱ / Jahrgangsstufe 11**

## زبان‌ها
- فارسی
- Deutsch
- English

## Lernfelder پوشش‌داده‌شده
1. **LF 6** – Serviceanfragen bearbeiten
2. **LF 7** – Cyber-physische Systeme ergänzen
3. **LF 8** – Daten systemübergreifend bereitstellen
4. **LF 9** – Netzwerke und Dienste bereitstellen

## نحوه استفاده
نام پلتفرم Lernova است. صفحه ورود `login.html` است. بعد از ورود، `index.html` صنف ۱۱ و صنف ۱۰ را نشان می‌دهد. صنف ۱۰ از بخش‌های خوانای مواد کلاس است، نه رونوشت اسکن‌ها.
روی GitHub Pages هم همین مسیر است. حساب پیش‌فرض مدیر فقط برای استفاده کلاسی در خود مرورگر ساخته می‌شود.

## ساختار فایل‌ها
- `index.html` → صفحه اصلی
- `styles.css` → استایل مدرن و ریسپانسیو
- `script.js` → سیستم تغییر زبان + تمام ترجمه‌ها

---

ساخته شده برای دانش‌آموزان Systemintegration  
**Mujtaba Najafi – 2026**

Login: Lumo-Design, nur Deutsch.

## Lernova learning dashboard (November 2026)

`index.html` now serves the reviewed dashboard with classes 10–12, 99 DE/FA lessons, 701 study cards and the animated Lumo mascot. `learning-app.js` uses the existing Supabase login, account/profile and settings pages. Its local learning state is scoped to the signed-in account; existing checked lessons are imported from `fisi-activity`. Language and theme use the existing preference keys.

All 71 existing videos and their captions remain unchanged. `learning-media.js` maps them into the matching lessons with native controls and `preload="none"`. The Resources page links the full video library, previous quizzes, English content, materials and progress; the previous home is retained as `materials.html`. No previous lesson pages or media files were removed. The service worker cache version is bumped for installed PWA updates.

Validation: `node scripts/check-learning.cjs` checks all 99 lessons in both languages and the card banks. The new source modules are buildless and served by GitHub Pages.
