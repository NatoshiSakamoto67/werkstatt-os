# WERKHOF — Das Betriebssystem für die Werkstatt

White-Label-Werkstatt-OS (Prototyp). Bündelt Aufträge, WhatsApp, KI-Assistent **Hermes**,
Werkzeug-Sharing, Rechnungen, Buchhaltung, Wissens­basis und ein **Kundenportal** in einer App.
Pilot/Erstkunde: **KFZ Gorski**, Braunschweig. Pro Werkstatt umbrandbar (Multi-Tenant).

> Repo: `github.com/NatoshiSakamoto67/werkhof` (umbenannt von `werkstatt-os`, lokaler Ordner heißt weiter `werkstatt-os`).
> Status: **Prototyp mit Demo-Daten** (Browser/localStorage, nichts wird gesendet). `noindex` überall.

## Live
- **Landing:** https://natoshisakamoto67.github.io/werkhof/
- **App (Werkstatt-OS):** https://natoshisakamoto67.github.io/werkhof/app/
- **Kundenportal:** https://natoshisakamoto67.github.io/werkhof/app/kundenportal.html
- **Onboarding (neue Werkstatt):** https://natoshisakamoto67.github.io/werkhof/onboarding.html
- **Impressum / Datenschutz:** …/werkhof/impressum.html · …/werkhof/datenschutz.html

## Struktur
```
werkhof/
├─ index.html              # Landingpage (Marketing)
├─ onboarding.html         # White-Label-Generator: erzeugt app/tenant.js (mit Kontrast-/E.164-Check)
├─ impressum.html          # Rechtsseiten-Vorlagen (ausfüllbar, vor Go-Live anwaltlich prüfen)
├─ datenschutz.html
├─ app/
│  ├─ index.html           # WERKHOF-App (Single-File, ~20 Module)
│  ├─ tenant.js            # ►► WHITE-LABEL-KONFIG: Markenname/Farben/WhatsApp/Mandanten ◄◄
│  ├─ kundenportal.html    # Kundenportal (klickbares Dashboard)
│  ├─ werkleih/            # eingebettete Werkzeug-Sharing-App (recolored)
│  ├─ manifest.json · sw.js (network-first) · icons/ · assets/logo.svg · fonts/
├─ docs/ARCHITEKTUR.md · docs/compliance.md   # Architektur + DSGVO-Entwürfe (AVV/VVT/TOM/Opt-in)
├─ robots.txt · .nojekyll
└─ verify.mjs              # JS-Syntax-Check:  node verify.mjs ./app/index.html
```

## White-Label — neue Werkstatt in 2 Minuten
1. `onboarding.html` öffnen → Name, Tagline, WhatsApp-Nummer, CI-Farben eingeben (Live-Vorschau + Kontrast-/Nummern-Prüfung).
2. **tenant.js herunterladen** und als `app/tenant.js` beim Kunden ablegen.
Fertig — Header-Name, Akzentfarben (`--accent`/`--accent-2`) und Mandanten kommen aus dieser einen Datei. Kein Code, kein Build.

## Entscheidungen
- **Workflow-Automation:** eigene schlanke Engine (Trigger → Plan → Freigabe-Queue), kein n8n.
- **Karten:** Leaflet + OpenStreetMap (EU), kein Google. **KI:** LiteLLM → AWS Bedrock-EU (Frankfurt).
- **Mensch im Mittelpunkt:** jede schreibende/sendende KI-Aktion braucht eine Freigabe.
- **PWA:** network-first Service Worker (`werkhof-v3`) → Updates sofort sichtbar; Fallback-URL `…?v=N`.

## Produktiv-Go-Live (Roadmap, Kurzfassung)
Vor Echtbetrieb mit echten Kundendaten: EU-Server (IONOS/Postgres+RLS+echte Auth statt localStorage/PIN),
echte Firmendaten in Impressum/`tenant.js`, AVV-Kette + Rechtstexte anwaltlich prüfen, WhatsApp via 360dialog (EU).
Details: `docs/compliance.md` + `docs/GO-LIVE-CHECKLISTE.md`.

## Verifizieren
```bash
node verify.mjs ./app/index.html        # prüft Inline-Skripte
node verify.mjs ./app/werkleih/index.html
```

---
*Demo-Daten sind fiktiv. Nicht für Suchmaschinen (noindex).*
