# WERKHOF — Architektur & Bausteine

WERKHOF ist das einheitliche **Werkstatt-Betriebssystem**. Es führt zusammen, was bisher
auf KFZ Gorski verteilt war (Website + Termin-Konfigurator, Kundenportal, Werkstatt-CRM,
Werkzeug-Sharing / WERKLEIH) und baut konzeptionell auf der **XDAB-Plattform** auf.

## Designprinzipien
1. **Eine App, alle Bausteine.** Single-File-Frontend (Vanilla JS), offline-fähige PWA.
2. **Mensch im Mittelpunkt.** Jede schreibende oder sendende KI-Aktion landet in einer
   Freigabe-Queue (Human-in-the-Loop) — die KI handelt nie allein.
3. **DSGVO by design.** EU-KI-Gateway, PII-Maskierung, OpenStreetMap, self-hosted Fonts,
   Audit nur mit Metadaten, Mandanten-Isolation.
4. **Schlank statt Tool-Zoo.** Eigene Workflow-Engine statt n8n.

## Bausteine ↔ Modul ↔ v1-Status
| # | Baustein | Modul in der App | v1 |
|---|----------|------------------|----|
| 1 | Website + Terminbuchung | `Termine` (App) + Termin-Konfigurator (Website) | ✅ Demo |
| 2 | WhatsApp-Integration | `WhatsApp-Posteingang` (Split-View) | ✅ Demo* |
| 3 | Kundenportal | `Kundenportal-Ansicht` (Rollen-Switch) | ✅ Stub |
| 4 | CRM | `Kunden` (Liste + Detail-Drawer) | ✅ Demo |
| 5 | Auftragsverwaltung | `Aufträge` (Status-Workflow) | ✅ Demo |
| 6 | Werkzeug-Sharing | `Werkzeug-Sharing` + `Werkstätten`-Karte | ✅ Demo |
| 7 | Dokumentenverwaltung | `Dokumente` | ✅ Stub |
| 8 | Rechnungsentwürfe | `Rechnungen` | ✅ Demo |
| 9 | Buchhaltungsanbindung | `Buchhaltung` (Connector-Stubs + DATEV-CSV) | ✅ Stub |
| 10 | Mobile App | PWA (`manifest.json` + `sw.js`) | ✅ |
| 11 | Web-App | App-Shell | ✅ |
| 12 | KI-Assistent (Claude) | `KI-Assistent` (Chat) | ✅ Demo |
| 13 | RAG-Unternehmenswissen | `Wissen` (Keyword-Suche) | ✅ Demo** |
| 14 | Reparaturleitfäden | `Wissen` (source_type leitfaden) | ✅ Demo |
| 15 | Lieferantenanbindungen | `Lieferanten` (Launcher + CSV) | ✅ Stub |
| 16 | Autom. Nachrichten-Auswertung | `Orchestra` | ✅ Demo |
| 17 | Human-in-the-Loop-Freigaben | `Freigaben` | ✅ Demo |
| 18 | Multi-Mandanten | Tenant-Switcher (global) | ✅ Demo |
| 19 | Rollen/Rechte | Rollen-Switcher (UI-Gate) | ✅ Demo |
| 20 | DSGVO + Audit-Trail | `Einstellungen & DSGVO` | ✅ Demo |

\* Echter 2-Wege-Chat braucht die WhatsApp Business API (Meta Cloud / 360dialog → Webhook).
\** Vollausbau: pgvector-Embeddings statt clientseitiger Keyword-Suche.

## Plattform (Vollausbau, aus XDAB übernehmbar)
```
  Browser-PWA (dieses Frontend)
        │  HTTPS/JWT
        ▼
  FastAPI  ──►  Postgres (Row-Level-Security, Multi-Tenant, pgvector)
        │
        ├─►  PII-Service (Maskierung E-Mail/Telefon/IBAN vor KI)
        ├─►  LiteLLM KI-Gateway ──► AWS Bedrock-EU (Frankfurt)  [+ Claude/Ollama lokal]
        └─►  agent-core (ARQ-Worker): Trigger → PLAN → action_class(read/write/send)
                                       → awaiting_approval → Freigabe-Queue → Pub/Sub + SSE
```

### Eigene Workflow-Engine statt n8n
`agent-core` ist bereits faktisch die Trigger→Plan→Approve-Pipeline. n8n würde einen zweiten
Container, eine zweite DB, ein zweites Auth und einen zweiten Datenpfad bedeuten
(DSGVO-Risiko, Overkill für ~5 deterministische Flows). `read` = autonom, `write`/`send` =
persistenter Queue-Eintrag mit Freigabe. ARQ-`cron` deckt Zeit-Trigger ab.

## Phasen
1. **Prototyp (jetzt):** alle 20 Bausteine als UI/Demo, localStorage, ohne Backend.
2. **Backend:** FastAPI + Postgres (Kunden/Aufträge/Rechnungen/Audit), JWT-Login.
3. **WhatsApp Business API:** Provider → Webhook → echter 2-Wege-Posteingang.
4. **Orchestra/KI:** Nacht-Workflow liest Nachrichten → LiteLLM extrahiert Bedarf → Queue.
5. **Lieferanten/Claude + Buchhaltung:** echte APIs / Browser-Worker; Buchhaltungs-Connector.

## Offene Entscheidungen (für den Vollausbau)
- Buchhaltungssoftware: lexoffice / sevDesk / DATEV?
- WhatsApp Business API: Meta Cloud direkt oder 360dialog? Welche Nummer?
- Claude-Hosting: XDAB-Server (Hetzner) oder lokale GPU in der Werkstatt?
- Werkzeug-Sharing-Reichweite: nur KFZ-Gorski-Netzwerk oder offenes Mandanten-Netz?
