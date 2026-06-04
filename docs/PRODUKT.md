# WERKHOF — Produkt & Vertrieb (intern)

**Was:** Ein white-label Werkstatt-Betriebssystem. Eine App für die Werkstatt (Aufträge, Kunden,
WhatsApp, KI-Assistent, Werkzeug-Sharing, Buchhaltung) **plus** ein Kundenportal für deren Kunden.
DSGVO-konform, EU-gehostet, pro Werkstatt umgebrandet.

**Für wen:** Kfz-Meisterbetriebe & freie Werkstätten (1–15 Mitarbeiter), die Zettel/Excel/WhatsApp-Chaos
ersetzen wollen, ohne ein teures DMS einzuführen.

**Alleinstellung:**
- **Ein** System statt Flickenteppich; WhatsApp als Hauptkanal (wo Kunden eh sind).
- **KI „Hermes"** bereitet Teile, Rechnungen, Erinnerungen vor — **Mensch gibt frei** (kein Blindflug).
- **Werkzeug-Sharing** zwischen Werkstätten (teures Spezialwerkzeug teilen statt doppelt kaufen).
- **DSGVO/EU**: kein US-Cloud-Lock-in, kein Google, KI über EU-Gateway, PII-Maskierung.
- **Eigenes Kundenportal** pro Werkstatt (Rechnungen/Termine/TÜV) — Kundenbindung.

## Tiers (Vorschlag, netto/Monat + einmalig Setup)
| Tier | Preis | Für wen | Enthalten |
|---|---|---|---|
| **Basis** | ~79 € + Setup | Einzelwerkstatt | App + Kundenportal, CRM, Aufträge, Rechnungen, wa.me-Anbindung, KI-Assistent (read), Hosting EU |
| **Pro** | ~149 € + Setup | aktive Werkstatt | + WhatsApp 2-Wege (360dialog), Orchestra-Automationen (TÜV/Termin-Erinnerung), Buchhaltungs-Export, RAG-Wissen |
| **Netzwerk** | ~249 € + Setup | Verbund/Mehrere | + Werkzeug-Sharing-Netzwerk, Mehr-Standort, Prioritäts-Support |

> Preise sind Startannahmen — nach Pilot (Gorski) kalibrieren. Setup deckt Onboarding (tenant.js,
> Logo, echte Daten, Schulung 1 h) ab.

## Onboarding (Low-Touch, der Verkaufsmotor)
1. `onboarding.html` → CI/Name/Nummer eingeben → `tenant.js` generiert (Kontrast-Check inkl.).
2. Logo + PWA-Icons einsetzen, Impressum/Datenschutz mit Kundendaten füllen.
3. Auf den EU-Server deployen (eine Subdomain je Werkstatt).
**Ziel: < 1 h pro Neukunde, danach selbsterklärend (In-App-Hilfe + Hermes).**

## Betriebsmodell (so wenig Wartung wie möglich)
- Eine Codebasis, viele Mandanten (tenant.js + Postgres-RLS).
- „Push once → deploy all" mit `verify.mjs` + Smoke-Test als Gate.
- Automatische Backups/Updates/Monitoring; Support primär per In-App-Hilfe.

## Abgrenzung
- **WERKHOF** = das Produkt (verkaufbar). **KFZ Gorski** = Pilot/Referenzkunde (Instanz/Mandant).
- Vertriebsbeilage: Muster-AVV + Datenschutz-Infos (`docs/compliance.md`).

## Status / Reifegrad
Prototyp komplett (alle Module als Demo, white-label, Kundenportal, Onboarding-Generator).
Vor Verkauf mit echten Daten: EU-Server-Backend + echte Auth + Rechts-Review (siehe `GO-LIVE-CHECKLISTE.md`).
