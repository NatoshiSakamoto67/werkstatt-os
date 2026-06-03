# `frontend/app/vendor/` — lokale Browser-Libs (kein CDN)

> Hier liegen **alle** vom Frontend genutzten Drittanbieter-Bibliotheken **lokal**.
> **Warum kein CDN?** DSGVO: Ein `<script src="https://cdn…">` lädt im Browser des Nutzers von einem (oft US-)Server und überträgt dabei dessen IP-Adresse an einen Dritten — eine Drittland-Übermittlung, die wir vermeiden. Lokal eingebundene Libs erzeugen **keine** Drittanfrage. Siehe `docs/DSGVO.md`.

Die UI (`frontend/app/index.html`) bindet diese Dateien über **relative Pfade** ein (z. B. `vendor/leaflet/leaflet.js`), damit auch die **Offline-Vorschau per `file://`** funktioniert.

> **Hinweis:** Diese `.js`/`.css`/Icon-Dateien sind **Platzhalter-Slots** — die echten Lib-Dateien werden hier abgelegt (Download von den unten genannten Quellen). Versionen pinnen, nicht „latest".

---

## Pflicht — Karte (Leaflet)

Die Werkstätten-Karte (ARCHITEKTUR §9) nutzt **Leaflet** mit OSM-Tiles.

| Datei (hier ablegen) | Version | Quelle / Hinweis |
|---|---|---|
| `leaflet/leaflet.js` | **1.9.4** | `leafletjs.com` Release-ZIP (`leaflet.js`, UMD/minified) |
| `leaflet/leaflet.css` | **1.9.4** | gleiches ZIP (`leaflet.css`) |
| `leaflet/images/marker-icon.png` | **1.9.4** | Marker-Icon — **wird sonst per CDN nachgeladen!** |
| `leaflet/images/marker-icon-2x.png` | **1.9.4** | Retina-Marker |
| `leaflet/images/marker-shadow.png` | **1.9.4** | Marker-Schatten |

> **Wichtig:** Leaflet lädt Marker-Icons standardmäßig relativ zur `leaflet.css`. Liegen die drei `images/`-PNGs **nicht** lokal, versucht Leaflet sie nachzuladen → genau das wollen wir DSGVO-seitig nicht. Daher die `images/` zwingend mitkopieren (oder `L.Icon.Default.imagePath` / eine eigene `L.icon(...)` in der UI auf `vendor/leaflet/images/` setzen).

**Tiles:** Die Kartenkacheln kommen zur Laufzeit von OSM (Demo) bzw. **MapTiler-EU/self-host** (Prod) — siehe `docs/DSGVO.md` (Karten-DSGVO-Hinweis). Tiles sind **kein** Vendor-File hier, sondern eine URL-Konfig in der UI.

---

## Pflicht — PDF-Export (jsPDF)

Der Export von Antworten/Werkzeuglisten als PDF (ARCHITEKTUR §9, „Export") nutzt **jsPDF**.

| Datei (hier ablegen) | Version | Quelle / Hinweis |
|---|---|---|
| `jspdf-2.5.1.umd.min.js` | **2.5.1** | `github.com/parallax/jsPDF` Release (UMD, minified) — Global `window.jspdf.jsPDF` |

> Vor dem Export greift der **Sanitizer** der UI (Emoji/Ampel → `[OK]/[Achtung]/[Kritisch]`), damit das PDF sauber bleibt (ARCHITEKTUR §9).

---

## Optional — weitere Export-Formate

Nur ablegen, wenn die entsprechende Funktion in der UI aktiv genutzt wird (sonst weglassen — weniger Code, kleinere Angriffsfläche).

| Datei (hier ablegen) | Version | Zweck |
|---|---|---|
| `jszip.min.js` | **3.10.1** | ZIP-Erzeugung (z. B. gebündelter Export / `.docx`-Aufbau). Quelle: `github.com/Stuk/jszip` |
| `pptxgen.bundle.js` | **3.12.0** | PowerPoint-Export (PptxGenJS), falls Präsentations-Export gewünscht. Quelle: `github.com/gitbrent/PptxGenJS` |

> Word/MD/Text-Export laufen i. d. R. ohne externe Lib (Blob/`Intl`), PDF über jsPDF; `jszip`/`pptxgen` nur bei Bedarf.

---

## Regeln

- **Versionen pinnen** (Dateiname enthält Version, wo möglich) — keine `@latest`-CDN-Verweise im HTML.
- **Niemals** ein `https://cdn…`-`<script>`/`<link>` in `index.html` einschleusen (bricht DSGVO + Offline-Vorschau).
- Lizenzen beachten: Leaflet (BSD-2), jsPDF (MIT), JSZip (MIT/GPL dual), PptxGenJS (MIT). Lizenztexte ggf. hier mit ablegen.
- Diese Binärdateien werden **nicht** zwingend committet — sie können wie die Fonts beim Deploy auf den EU-VPS gelegt werden (Konsistenz mit `frontend/app/fonts/`). Falls sie committet werden, dann mit gepinnter Version.

<!-- WERKLEIH vendor · lokale Libs statt CDN (DSGVO) · ARCHITEKTUR §9 · Stand 2026-06-03 -->
