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
  accent:  "#146DAB",   // Primärfarbe (KFZ-Gorski-Blau)
  accent2: "#FBAF3A",   // Sekundärfarbe (Orange)
  // Mandanten (Multi-Tenant). Der erste ist der Standard-/Pilot-Mandant.
  tenants: [
    { id: "gorski", name: "KFZ Gorski", mark: "G", ort: "Braunschweig" },
    { id: "astek",  name: "KFZ ASTEK",  mark: "A", ort: "Wolfsburg" }
  ]
};
