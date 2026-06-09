# WERKHOF — DSGVO-Compliance-Paket (ENTWÜRFE)

> ⚠️ **Status: ENTWÜRFE / Vorlagen.** Diese Dokumente sind kaufmännisch vorformuliert, ersetzen aber **keine Rechtsberatung**. Vor dem ersten Echtbetrieb mit Kundendaten müssen sie **einmalig durch Anwalt/Datenschutzbeauftragten** geprüft werden. Danach pro Werkstatt-Kunde nur noch `[Platzhalter]` füllen — kein neuer Review.
>
> Rollen in dieser Kette: **Werkstatt** (z. B. KFZ Gorski) = *Verantwortlicher* · **du/WERKHOF** = *Auftragsverarbeiter* der Werkstatt · **360dialog & Meta** = *Unter-Auftragsverarbeiter* (WhatsApp) · **IONOS / AWS-Bedrock-EU** = *Unter-Auftragsverarbeiter* (Hosting/KI).

---

## 1. Auftragsverarbeitungsvertrag (AVV) — Muster (Art. 28 DSGVO)

**Zwischen** der Werkstatt <span>[Firmenname, Anschrift]</span> („Verantwortlicher")
**und** <span>[Dein Firmenname als WERKHOF-Betreiber, Anschrift]</span> („Auftragsverarbeiter").

**§1 Gegenstand & Dauer** — Betrieb der WERKHOF-Software (Werkstatt-Verwaltung, Kundenportal, KI-Assistent, optional WhatsApp). Laufzeit = Laufzeit des Hauptvertrags.

**§2 Art, Zweck, Datenkategorien, Betroffene**
- Zweck: Auftrags-/Kunden-/Rechnungsverwaltung, Terminierung, Kommunikation.
- Datenkategorien: Stammdaten (Name, Anschrift, Kontakt), Fahrzeugdaten, Auftrags-/Rechnungsdaten, Kommunikationsinhalte.
- Betroffene: Kunden der Werkstatt, ggf. Mitarbeiter.

**§3 Pflichten des Auftragsverarbeiters** — Verarbeitung nur auf dokumentierte Weisung; Vertraulichkeit aller Mitarbeiter (Art. 28 Abs. 3 b, 29, 32 Abs. 4); TOMs nach §4/Anlage; Unterstützung bei Betroffenenrechten & Art. 32–36; Löschung/Rückgabe nach Vertragsende (Wahl des Verantwortlichen); Nachweis-/Auditrechte.

**§4 TOMs** — siehe Abschnitt 3 dieses Pakets (Anlage).

**§5 Unter-Auftragsverarbeiter** — allgemeine Genehmigung mit Informations-/Widerspruchsrecht; aktuelle Liste:

| Unterauftragnehmer | Leistung | Ort | Grundlage |
|---|---|---|---|
| IONOS SE | Server-Hosting | Deutschland (FFM/Berlin) | AVV Art. 28 |
| AWS (Bedrock) | KI-Inferenz | EU (Frankfurt) | AVV + EU-Region |
| 360dialog GmbH | WhatsApp-BSP | EU (GCP Europe) | AVV Art. 28 |
| Meta Platforms Ireland | WhatsApp-Plattform | IE/USA | DPF Art. 45 / SCC Art. 46 |

**§6 Drittland** — Übermittlungen nur auf Grundlage DPF/SCC (s. §5). **§7 Betroffenenrechte** — unverzügliche Weiterleitung/Unterstützung. **§8 Meldepflichten** — Datenpanne unverzüglich (Art. 33/34). **§9 Haftung/Beendigung** — nach DSGVO/BGB.

---

## 2. Verzeichnis von Verarbeitungstätigkeiten (VVT, Art. 30) — je Mandant

| Verarbeitung | Zweck | Betroffene | Datenkategorien | Empfänger | Drittland | Löschfrist | Rechtsgrundlage |
|---|---|---|---|---|---|---|---|
| Kundenstammdaten/CRM | Auftragsabwicklung | Kunden | Name, Anschrift, Kontakt, Fahrzeug | IONOS | nein | Zweckfortfall + Aufbewahrung | Art. 6 I b |
| Rechnungsstellung | Abrechnung | Kunden | Rechnungs-/Leistungsdaten | IONOS, Steuerberater | nein | **10 Jahre (§147 AO, §14b UStG)** | Art. 6 I b/c |
| Kundenportal | Self-Service | Kunden | Login-/Sitzungsdaten | IONOS | nein | Kontodauer | Art. 6 I b |
| Service-Erinnerung (TÜV/HU) | Kundenbindung/Service | Kunden | Kontakt, Fahrzeug, Fälligkeit | IONOS, 360dialog/Meta | (WA: ja) | bis Widerspruch | Art. 6 I b/f |
| WhatsApp-Kommunikation | Kontakt | Kunden | Tel., Nachrichtinhalt | 360dialog, Meta | ja (DPF/SCC) | bis Erledigung | Art. 6 I b |
| KI-Assistent (Claude) | Effizienz | Kunden (pseudonym.) | maskierte Vorgangsdaten | AWS-Bedrock-EU | nein (EU) | keine Speicherung b. Provider | Art. 6 I f |

> Hinweis: PII (Name/Tel/IBAN) wird vor KI-Aufrufen pseudonymisiert/tokenisiert (PII-Service).

---

## 3. Technische & organisatorische Maßnahmen (TOM, Art. 32)

- **Zutritt:** Server in zertifiziertem DE-Rechenzentrum (IONOS, ISO 27001).
- **Zugang:** SSH nur per Key, kein Passwort; fail2ban; ufw (nur 80/443); 2FA für Admin-Konten; getrennte Tenant-Accounts.
- **Zugriff:** Rollen-/Rechte-System (Meister/Mitarbeiter/Nur-Lesen/Kunde); **Row-Level-Security mit tenant_id** auf allen Tabellen + automatisierter Cross-Tenant-Negativtest; Least-Privilege.
- **Übertragung:** TLS 1.2+/HSTS überall; keine unverschlüsselten Kanäle; KI nur EU-Gateway; PII-Maskierung.
- **Eingabe/Nachvollziehbarkeit:** Audit-Log (nur Metadaten, keine Inhalte) je schreibender Aktion.
- **Verfügbarkeit:** verschlüsselte Backups (3-2-1, restic, Off-Site), monatlicher Restore-Test; unattended-security-updates; Monitoring (Uptime-Kuma).
- **Trennung:** Mandantentrennung in DB; Demo-/Prod-Trennung.
- **Auftragskontrolle:** AVV mit allen Unterauftragnehmern.
- **Datenminimierung & Pseudonymisierung:** nur erforderliche Felder; Tokenisierung vor KI.

---

## 4. Lösch- & Auskunftskonzept (Art. 15–20)

- **Auskunft (Art. 15):** auf Antrag Kopie aller zu einer Person gespeicherten Daten als strukturierter Export (CSV/PDF) binnen 1 Monat. Self-Service-Export im Kundenportal vorgesehen.
- **Berichtigung (Art. 16):** Korrektur über CRM/Portal.
- **Löschung (Art. 17):** Löschung auf Antrag, **soweit keine gesetzliche Aufbewahrung entgegensteht** (Rechnungen 10 J. → bis dahin Einschränkung der Verarbeitung statt Löschung, Art. 18).
- **Übertragbarkeit (Art. 20):** maschinenlesbarer Export (JSON/CSV).
- **Fristen-Automatik:** Job markiert Datensätze nach Ablauf der Aufbewahrung zur Löschung; Protokollierung der Löschläufe (Metadaten).
- **Prozess:** Anträge an <span>[datenschutz@kfz-gorski.de]</span>; Identitätsprüfung; Bearbeitung dokumentiert.

---

## 5. WhatsApp — Opt-in & Template-Texte (UWG §7 / Art. 6 DSGVO)

**Grundsatz:** *Servicenachrichten* (Terminbestätigung/-erinnerung, TÜV-Fälligkeit) im Rahmen der Vertragsabwicklung = **Utility-Templates** (kein Werbe-Opt-in nötig, aber 24-h-Fenster/Template-Regeln beachten). *Werbung/Angebote* = **Marketing-Template**, nur mit **separater, dokumentierter Einwilligung** + jederzeit widerrufbar.

**Opt-in-Text (z. B. auf Auftragsformular/Portal):**
> „Ich möchte Service-Erinnerungen (z. B. zur HU/TÜV-Fälligkeit und zu Terminen) sowie Angebote der <span>[KFZ Gorski]</span> per WhatsApp an meine Nummer erhalten. Diese Einwilligung kann ich jederzeit formlos (z. B. mit „STOPP") widerrufen. Es gilt die Datenschutzerklärung."

**Template-Entwürfe (vor Versand bei Meta zur Genehmigung einreichen; Kategorie beachten):**
- *Utility — Terminbestätigung:* „Hallo {{1}}, Ihr Termin bei <span>[KFZ Gorski]</span> am {{2}} um {{3}} Uhr ist bestätigt. Antworten Sie auf diese Nachricht für Änderungen."
- *Utility — TÜV/HU-Erinnerung:* „Hallo {{1}}, die HU/TÜV Ihres Fahrzeugs {{2}} ist im {{3}} fällig. Sollen wir einen Termin einplanen? Einfach antworten."
- *Utility — Fahrzeug fertig:* „Hallo {{1}}, Ihr Fahrzeug {{2}} ist fertig. Die Rechnung liegt in Ihrem Kundenportal."
- *Marketing (nur mit Opt-in):* „Hallo {{1}}, jetzt {{2}} % auf Klimaservice bei <span>[KFZ Gorski]</span>. Antworten Sie „STOPP" zum Abbestellen."

---

## Nächste Schritte
1. `[Platzhalter]` mit echten Firmendaten füllen (siehe Server-/Daten-Bedarf).
2. Einmalige anwaltliche/DSB-Prüfung dieses Pakets + der Hoster-/AVV-Kette.
3. Vor WhatsApp-Live: 360dialog-AVV abschließen, Templates bei Meta genehmigen lassen.
4. Im Echtbetrieb: localStorage → EU-Server-Backend (Postgres + RLS + echte Auth).
