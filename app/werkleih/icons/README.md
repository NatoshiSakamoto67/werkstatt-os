# `frontend/app/icons/` — Favicons & App-Icons

> Hier liegen Favicon und App-Icons der WERKLEIH-UI. Aktuell **Platzhalter** — vor Produktion durch das **echte WERKLEIH-Logo** ersetzen.

Die UI bindet die Icons über **relative Pfade** ein (z. B. `icons/favicon-32.png`), damit auch die Offline-Vorschau per `file://` funktioniert. Quellen-Pillen im Chat nutzen davon unabhängig das Favicon der jeweiligen Fremd-Domain (ARCHITEKTUR §9).

---

## Benötigte Dateien (Platzhalter → echtes Logo)

| Datei (hier ablegen) | Größe | Zweck |
|---|---|---|
| `favicon-16.png` | 16×16 | Browser-Tab (klein) |
| `favicon-32.png` | 32×32 | Browser-Tab / Lesezeichen |
| `apple-touch-icon.png` | 180×180 | iOS-Homescreen |
| `icon-192.png` | 192×192 | PWA / Android-Homescreen |
| `icon-512.png` | 512×512 | PWA-Splash / Store |
| `maskable-512.png` | 512×512 | PWA „maskable" (Safe-Zone-Padding) |

> Optional zusätzlich `favicon.ico` (Multi-Size 16/32/48) für ältere Browser.

---

## Aktueller Zustand: Platzhalter

- Bis das finale Logo vorliegt, dienen die Dateien hier als **Slots**. Fehlt eine Icon-Datei, zeigt der Browser ein generisches Tab-Icon — die UI bricht **nicht**.
- Als provisorischer Platzhalter passt die **Brand-Mark `W`** (aus `const BRAND = { …, mark:'W' }`, ARCHITEKTUR §0/§12) auf Clay-Hintergrund (`--accent` `#CC785C`).

## Ersetzen durch das echte WERKLEIH-Logo

1. Finales WERKLEIH-Logo als quadratische Master-Grafik (mind. 512×512, transparenter Hintergrund) bereitstellen.
2. Alle oben gelisteten Größen daraus exportieren (gleiche Dateinamen beibehalten → kein HTML-Umbau nötig).
3. Für `maskable-512.png` ausreichend Safe-Zone-Rand lassen (Logo zentriert, ~80 % der Fläche).
4. Beim **Rebrand** wird nur die Bild-Grafik getauscht; Name/Tagline/Mark bleiben die eine `BRAND`-Konstante, die Farbe das eine `--accent`-Token (README → „Brand-Rename").

> Hinweis: PWA-Manifest (falls aktiviert) referenziert `icon-192.png` / `icon-512.png` / `maskable-512.png` — Dateinamen daher stabil halten.

<!-- WERKLEIH icons · Platzhalter, durch echtes Logo ersetzen · ARCHITEKTUR §9 · Stand 2026-06-03 -->
