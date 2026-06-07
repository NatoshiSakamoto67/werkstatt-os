/* ==========================================================================
   tenant.js  —  WHITE-LABEL-KONFIG (eine Datei pro Werkstatt-Kunde).
   Wird VOR dem App-Skript geladen. Zum Umbranden eines Mandanten NUR hier ändern,
   nichts im App-Code. So wird WERKHOF pro Werkstatt verkaufbar.
   ========================================================================== */
window.TENANT_CONFIG = {
  brand: {
    name:    "WERKHOF",                                  // Produkt-/Werkstattname im Header
    tag:     "Das Betriebssystem für die Werkstatt",     // Untertitel
    wa:      "491701234567",                             // WhatsApp-Business-Nummer E.164 OHNE '+'  (PLATZHALTER!)
    waReady: false                                       // erst auf true, wenn echte Nummer hinterlegt ist
  },
  accent:  "#146DAB",   // Primärfarbe (KFZ-Gorski-Blau) -> --cust-accent (DS leitet Palette ab)
  accent2: "#FBAF3A",   // Sekundärfarbe (Orange)       -> --ds-accent-2

  // --- Theme & Schrift (gemeinsamer DS-Kontrakt) ----------------------------
  // theme: einer von "papier" | "stahl" | "glas" | "edel" | "minimal".
  //        Wird am <html> als data-theme gesetzt (KEIN CSS-Link-Swap).
  //        Leer/unbekannt -> "papier" (= :root-Default der werkstatt.theme.css).
  theme:   "papier",
  // font:  optionaler Headline-Schrift-Override aus der Font-Registry:
  //        "fraunces" | "playfair" | "space" | "inter" | "oswald".
  //        Leer = Theme-Standard (--ds-font-display). Setzt --cust-font.
  font:    "",
  // Mandanten (Multi-Tenant). Der erste ist der Standard-/Pilot-Mandant.
  tenants: [
    { id: "gorski", name: "KFZ Gorski", mark: "G", ort: "Braunschweig" },
    { id: "astek",  name: "KFZ ASTEK",  mark: "A", ort: "Wolfsburg" }
  ]
};
