# WERKHOF — Das Betriebssystem für die Werkstatt

Einheitliches Werkstatt-OS (Prototyp). Bündelt Aufträge, WhatsApp, KI-Assistent **Hermes**,
Werkzeug-Sharing, Rechnungen, Buchhaltung, Wissens­basis und mehr in **einer** App.
Pilot: **KFZ Gorski**, Braunschweig. White-Label-fähig (Multi-Mandant).

> Status: **Prototyp mit Demo-Daten** (alles im Browser, localStorage, nichts wird gesendet).
> Baut konzeptionell auf der XDAB-Plattform + der WERKLEIH-Werkzeug-Sharing-App auf.

## Live ansehen
- **Landingpage:** `index.html` (Repo-Root)
- **App-Demo (Handy + Desktop):** [`app/index.html`](app/index.html)

Auf GitHub Pages: Landing unter der Root-URL, App unter `…/app/`.

## Struktur
```
werkstatt-os/
├─ index.html            # Landingpage (Marketing, GitHub-Pages-Einstieg)
├─ app/
│  ├─ index.html         # WERKHOF-App (Single-File, ~20 Module)
│  ├─ manifest.json      # PWA-Manifest
│  ├─ sw.js              # Service Worker (Shell cache-first, DSGVO: keine API/Tiles cachen)
│  ├─ assets/logo.svg    # 1:1-Vektor-Logo KFZ Gorski
│  └─ fonts/             # Hanken Grotesk + Bebas Neue (self-hosted, DSGVO)
├─ docs/ARCHITEKTUR.md   # Bausteine ↔ Plattform-Mapping, v1/später
├─ robots.txt           # noindex
└─ verify.mjs           # JS-Syntax-Check aller Inline-Skripte (node verify.mjs)
```

## Die 20 Bausteine (in der App enthalten)
**Werkstatt:** Dashboard · Kunden (CRM) · Auftragsverwaltung · Terminbuchung ·
WhatsApp-Posteingang · Orchestra (KI, Human-in-the-Loop) · Freigaben-Queue
**Teile & Werkzeug:** Werkzeug-Sharing zwischen Werkstätten · Werkzeug-Bestand ·
Fahrzeug-Kompatibilität · Werkstatt-Karte (OSM) · Lieferantenanbindung
**Büro:** Rechnungsentwürfe · Dokumentenverwaltung · Buchhaltungsanbindung ·
Wissen & Reparaturleitfäden (RAG) · Automatisierung (eigene Workflow-Engine)
**System:** KI-Assistent Hermes · Mobile-/Web-App (PWA) · Multi-Mandanten ·
Rollen & Rechte · DSGVO-Konzept · Audit-Trail

## Entscheidungen
- **Workflow-Automation:** eigene schlanke Engine (Trigger → Plan → Freigabe-Queue über
  ARQ-Cron + agent-core) statt **n8n** — weniger Container, ein Datenpfad, DSGVO-sauberer.
- **Karten:** Leaflet + OpenStreetMap (lokal/EU), kein Google.
- **KI:** LiteLLM → AWS Bedrock-EU (Frankfurt); Hermes/Ollama optional auf lokaler GPU.
- **Mensch im Mittelpunkt:** jede schreibende/sendende KI-Aktion braucht eine Freigabe.

## Technik
Reines HTML/CSS/Vanilla-JS, kein Build. Single-File-App, offline-fähig (PWA).
CI: Blau `#146DAB` (primär) + Gelb-Orange `#FBAF3A` (sekundär), heller + dunkler Modus.

## Verifizieren
```bash
node verify.mjs        # prüft alle Inline-Skripte mit new Function()
```

## Nächste Schritte (echtes Backend, „später")
Termin-/Slot-Backend · WhatsApp Cloud API (Meta/360dialog) · Buchhaltungs-OAuth ·
echtes pgvector-RAG · SSE-Live-Queue gegen agent-core · PII-Maskierung · JWT-Auth.

---
*Demo-Daten sind fiktiv. `noindex` gesetzt. Nicht für Suchmaschinen.*
