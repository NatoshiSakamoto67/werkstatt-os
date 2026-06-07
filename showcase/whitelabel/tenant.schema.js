/* =============================================================================
 *  tenant.schema.js — DOKUMENTIERTES Beispiel + Referenz fuer window.TENANT.
 * -----------------------------------------------------------------------------
 *  EINE flache, deklarative Konfig, die in JEDEM Produkt VOR whitelabel.js
 *  geladen wird. whitelabel.js liest NUR dieses Objekt (plus Alt-Formen zur
 *  Abwaertskompatibilitaet) und kleidet das gesamte Produkt damit ein.
 *
 *  Diese Datei dient als Vorlage. Pro Kunde wird sie kopiert, ausgefuellt und
 *  als tenant.js neben das jeweilige Produkt gelegt. KEIN Build noetig.
 *
 *  EINBINDUNG (immer in dieser Reihenfolge):
 *    <script src="tenant.js"></script>            <!-- diese Konfig          -->
 *    <script src="whitelabel/whitelabel.js"></script>  <!-- liest window.TENANT -->
 *    <script src="...produkt..." defer></script>  <!-- erst danach rendern    -->
 *
 *  Pflichtfelder fuer einen sauberen Auftritt: name, accent, accent2, whatsapp.
 *  Alles andere ist optional und faellt defensiv auf sinnvolle Defaults zurueck.
 * ========================================================================== */
window.TENANT = {
  /* --- IDENTITAET ---------------------------------------------------------- */
  id:        "gorski",                 // slug, datei-/url-sicher (a-z0-9-)
  name:      "KFZ Gorski",             // Werkstattname (Header, <title>, WA-Texte)
  claim:     "Ihre Meisterwerkstatt in Cremlingen", // Untertitel/Claim (alias: tag)
  logo:      "assets/logo.svg",        // optional; leer => Initialen-Mark aus name
  branche:   "kfz",

  /* --- CI / FARBEN --------------------------------------------------------- */
  // accent  = Primaer/Aktion -> --cust-accent, --accent, --blau
  // accent2 = Sekundaer/Akzent -> --cust-accent2, --accent-2, --orange
  accent:    "#146DAB",
  accent2:   "#FBAF3A",
  // Optional. Sonst leitet whitelabel.js accentDeep via color-mix(... black) ab.
  // Bei SEHR hellen CI-Toenen hier manuell setzen, damit WCAG 4.5:1 haelt.
  accentDeep: "#0E5183",

  /* --- DESIGN-PAKET (nur die Landing nutzt umschaltbare Themes) ------------- */
  theme:     "papier",                 // papier | stahl | glas | edel | minimal
  font:      "fraunces",               // "" = Theme-Standard | fraunces | playfair | space | inter | oswald
  mode:      "auto",                   // auto | light | dark | bw (User-Toggle bleibt erhalten)

  // Pfad zum Themes-Ordner relativ zur Produkt-HTML. Default "assets/ds/themes/".
  // Wird nur ausgewertet, wenn das Produkt ein <link id="ds-theme"> hat.
  themeBase: "assets/ds/themes/",

  /* --- KONTAKT ------------------------------------------------------------- */
  telefon:   "+49 1511 8553899",
  whatsapp:  "4915118553899",          // E.164 OHNE + und OHNE fuehrende 0
  whatsappReady: true,                 // false => wa.me-Klick zeigt Demo-Hinweis
  email:     "kontakt@kfz-gorski.de",
  unfallEmail: "schaden@kfz-gorski.de",

  adresse:   { strasse: "Schapener Strasse 1", plz: "38162", ort: "Cremlingen", land: "DE" },
  geo:       { lat: 52.27404, lng: 10.61901 },
  mapsUrl:   "https://www.google.com/maps/dir/?api=1&destination=Schapener+Strasse+1,+38162+Cremlingen",

  /* --- OEFFNUNGSZEITEN (Landing / Portal) ---------------------------------- */
  // day: 0=So ... 6=Sa. geschlossen:true statt von/bis fuer Ruhetage.
  oeffnungszeiten: [
    { day: 1, von: "08:00", bis: "18:00" },
    { day: 2, von: "08:00", bis: "18:00" },
    { day: 3, von: "08:00", bis: "18:00" },
    { day: 4, von: "08:00", bis: "18:00" },
    { day: 5, von: "08:00", bis: "16:00" },
    { day: 6, geschlossen: true },
    { day: 0, geschlossen: true }
  ],

  /* --- INHALTE (Landing nutzt sie; Portal/Werkhof ignorieren still) -------- */
  leistungen: [
    { id: "inspektion", titel: "Inspektion & Wartung", dauer: "ca. 2 Std.", preis: "ab 129 EUR" },
    { id: "hu-au",      titel: "HU/AU (TUEV)",          dauer: "ca. 1 Std.", preis: "ab 119 EUR" }
  ],
  faq:     [ { q: "Brauche ich einen Termin?", a: "Bevorzugt ja, kurzfristig oft moeglich." } ],
  reviews: { googleUrl: "", score: 4.9, count: 137, items: [ { name: "Sandra K.", text: "Top Service!" } ] },
  team:    [ { name: "Marco Gorski", rolle: "Inhaber & Kfz-Meister", foto: "", tag: "Ihr Meister" } ],
  about:   { heading: "Handwerk mit Handschlag", body: [ "Seit ueber 15 Jahren ..." ], signatur: "Marco Gorski", pills: [ "Meisterbetrieb" ] },

  /* --- WERKHOF Multi-Mandant (nur interne Plattform) ----------------------- */
  tenants: [ { id: "gorski", name: "KFZ Gorski", mark: "G", ort: "Cremlingen" } ],

  /* --- KONFIGURATOR / ENDPUNKTE -------------------------------------------- */
  booking:   { leadDays: 7, requireService: true, useApiAvailability: false },
  endpunkte: { mode: "whatsapp", fahrzeugschein: "", unfall: "", termin: "" },

  /* --- RECHTLICHES --------------------------------------------------------- */
  datenschutzHref: "datenschutz.html",
  impressumHref:   "impressum.html"
};

/* -----------------------------------------------------------------------------
 *  KOMPATIBILITAET (von whitelabel.js automatisch normalisiert; nicht noetig
 *  in neuen tenant.js, nur fuer Altbestand dokumentiert):
 *    - window.TENANT_CONFIG (werkhof-Altname) wird als Fallback gemerged.
 *    - Landing-alt: T.farbeBlau -> accent, T.farbeOrange -> accent2.
 *    - brand.{name,tag,wa,waReady} -> name/claim/whatsapp/whatsappReady.
 *    - T.tag wird als Alias fuer claim akzeptiert (und umgekehrt).
 *    - T.logo wird als Alias fuer logoUrl akzeptiert.
 * --------------------------------------------------------------------------- */
