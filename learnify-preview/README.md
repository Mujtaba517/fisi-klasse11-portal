# Learnify – Einstellungen

Statische Nachbildung der Einstellungsseite. Die Desktop-Ansicht ist auf den Referenz-Viewport **1024×867** abgestimmt.

## Starten

Kein Build-Schritt, keine Pflicht-Abhängigkeiten für die Seite selbst.

```bash
# Direkt im Browser öffnen
xdg-open index.html

# oder lokaler Server
python3 -m http.server 4173
# anschließend http://127.0.0.1:4173 öffnen
```

## Schrift und Icons

- Schriftart: **Inter** (systemseitig oder Fallback Segoe UI / Roboto / Helvetica Neue / Arial).
- Alle Icons sind Inline-SVG (Heroicons/Lucide-ähnlich, Outline). Es gibt keine Original-Bildassets aus der Referenzdatei.

## Interaktionstests

```bash
npm install
npm test
```

Die Tests starten System-Chrome, prüfen Navigation, Tabs, Toggles, Suche, Benutzer erstellen, Export, Dialoge, Tastaturbedienung und stellen sicher, dass bei **1024**, **768** und **390** Pixel Breite kein horizontaler Overflow entsteht.

## Funktion ohne Backend

Einstellungen, Benutzer und Rollen bleiben nur in der aktuellen Browsersitzung. „Export starten“ erzeugt eine lokale JSON-Datei. Navigationseinträge außer „Einstellungen“ öffnen einen Platzhalter.
