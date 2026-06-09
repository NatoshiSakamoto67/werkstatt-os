# WERKHOF — Go-Live-Checkliste

Reihenfolge vom Prototyp zum Echtbetrieb mit echten Kundendaten. ☐ = offen, ✅ = erledigt.

## 0. Vor jedem Echtbetrieb (harte DSGVO-Blocker)
- ☐ **Impressum** (`impressum.html`) mit echten Firmendaten gefüllt (Name+Rechtsform, Anschrift, Tel, USt-IdNr/§19, Handwerkskammer).
- ☐ **Datenschutzerklärung** (`datenschutz.html`) gefüllt + Hoster-Angabe auf den real ausliefernden Server gesetzt.
- ☐ **Echte WhatsApp-/Telefonnummer** in `app/tenant.js` (`waReady:true`) — kein toter Link mehr.
- ☐ **Rechtstexte + AVV-Kette** (`docs/compliance.md`) **einmalig anwaltlich/DSB geprüft**.
- ☐ `noindex` entfernt **erst**, wenn alles oben steht (sonst öffentlich auffindbar mit Platzhaltern).

## 1. White-Label / Mandant einrichten
- ☐ `onboarding.html` ausgefüllt → `app/tenant.js` generiert (Name, CI-Farben, WhatsApp).
- ☐ Logo der Werkstatt eingesetzt (`app/assets/logo.svg` + PWA-Icons `app/icons/`).
- ☐ Kontrast-Check grün (Onboarding warnt automatisch).

## 2. EU-Server (Produktiv-Datenhaltung)
- ☐ IONOS VPS in **Deutschland** (Frankfurt/Berlin), Ubuntu 24.04, Daily-Backup.
- ☐ Server gehärtet: SSH-Key only, ufw (80/443), fail2ban, unattended-upgrades, Docker.
- ☐ Stack ausgerollt: nginx(TLS/HSTS) → FastAPI(api+agent-core) → Postgres(pgvector, **RLS+tenant_id**) → Redis → LiteLLM → PII.
- ☐ Domain + TLS (Let's Encrypt), Wildcard `*.werkhof.de`.
- ☐ **Echte Authentifizierung** (Magic-Link/OTP) statt Demo-PIN; Daten in Postgres statt localStorage.
- ☐ Verschlüsselte Backups (3-2-1, Off-Site) + monatlicher Restore-Test; Monitoring (Uptime-Kuma).
- ☐ Cross-Tenant-Negativtest grün (eine Werkstatt sieht NIE Daten einer anderen).

## 3. WhatsApp 2-Wege (optional, Pro)
- ☐ 360dialog-Account (EU) + dedizierte WABA-Nummer (nicht in normaler WA-App aktiv).
- ☐ AVV mit 360dialog; Meta-Business-Verifizierung.
- ☐ Utility-Templates (Termin/TÜV) genehmigt; Marketing nur mit Opt-in.
- ☐ Webhook (EU) mit Signaturprüfung + Mandanten-Routing.

## 4. Sicherheits-/Datenschutz-Pflichten
- ☐ Verarbeitungsverzeichnis (Art. 30) je Mandant ausgefüllt.
- ☐ TOMs dokumentiert (Art. 32) — siehe `docs/compliance.md`.
- ☐ Lösch-/Auskunftsprozess produktiv (Self-Service-Export im Portal).
- ☐ Datenpannen-Meldeweg (Art. 33/34) definiert.

## 5. Betrieb (Low-Touch)
- ☐ „Push once → deploy all"-Deploy mit `verify.mjs` als Gate.
- ☐ In-App-Hilfe (Wissen + Claude) aktiv → minimiert Support.
- ☐ Preis-/Vertragsmodell + Muster-AVV als Vertriebsbeilage.

---
**Faustregel:** Solange Abschnitt 0 + 2 nicht vollständig grün sind → **kein** Echtbetrieb mit echten Personendaten, nur Demo (noindex, localStorage).
