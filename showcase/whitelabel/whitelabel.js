/* =============================================================================
 *  whitelabel.js — Universelle White-Label-Engine (Vanilla, kein Build, kein CDN)
 * -----------------------------------------------------------------------------
 *  EINE Datei, identisch in Landing / Kundenportal / Werkhof. Liest das
 *  gemeinsame, flache window.TENANT (siehe tenant.schema.js) und wendet die CI
 *  VOR dem ersten Paint an:
 *
 *    1) Akzent-Skala (--cust-accent + abgeleitete Hover/Soft/Deep/on-accent)
 *       und alle Alt-Aliase (--accent, --blau, --orange, ...), damit JEDE
 *       CSS-Generation der drei Produkte bedient wird.
 *    2) Headline-Schrift-Override (Font-Registry fraunces|playfair|space|
 *       inter|oswald -> self-hosted Stacks) via injizierter <style>.
 *    3) Optionales Theme-CSS per <link> (nur die Landing nutzt das; Pfad ueber
 *       TENANT.themeBase konfigurierbar).
 *    4) Markenname/Logo in [data-tenant="name"] / [data-tenant="logo"].
 *    5) WhatsApp-Deeplinks (data-wa / [data-tenant="whatsapp"]) inkl.
 *       Demo-Guard, solange whatsappReady !== true.
 *    6) Telefon-, Maps- und Adress-Slots.
 *
 *  NORMALISIERUNG: akzeptiert window.TENANT_CONFIG (werkhof-Altname) und die
 *  alten Landing-Felder (farbeBlau/farbeOrange, brand.{name,tag,wa,waReady}),
 *  damit Altbestand ohne Massen-Rename weiterlaeuft.
 *
 *  FOUC: Dieses Skript MUSS synchron (ohne defer/async) und NACH tenant.js,
 *  aber VOR dem rendernden Produkt-Skript geladen werden. Die :root-Variablen
 *  werden sofort auf document.documentElement gesetzt; DOM-abhaengige Schritte
 *  (Name/Logo/Links) laufen bei DOMContentLoaded nach.
 *
 *  DSGVO: keinerlei Netzwerkzugriff nach aussen. Schriften kommen aus
 *  ../fonts/, Themes aus TENANT.themeBase (lokal). Kein Google-Fonts, kein CDN.
 * ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
   *  Konstanten — keine Magic-Strings im Code verstreut.
   * ------------------------------------------------------------------------- */
  var STORAGE_MODE_KEY = "xdab_mode";          // gemeinsamer Modus-Key aller Produkte
  var DEFAULT_ACCENT   = "#146DAB";            // CI-Blau (KFZ-Gorski-Default)
  var DEFAULT_ACCENT2  = "#FBAF3A";            // CI-Orange
  var DEFAULT_THEME    = "papier";
  var DEFAULT_THEMEBASE = "assets/ds/themes/"; // Landing-Annahme; ueberschreibbar
  var THEME_LINK_ID    = "ds-theme";           // <link id="ds-theme">
  var FONT_STYLE_ID    = "ds-font-override";    // <style id="ds-font-override">
  var ACCENT_STYLE_ID  = "xdab-accent-vars";   // injizierte Akzent-Skala

  // Erlaubte Theme-Slugs (Allowlist gegen Pfad-Injection beim href-Bau).
  var ALLOWED_THEMES = ["papier", "stahl", "glas", "edel", "minimal"];

  // Erlaubte Font-Keys -> CSS-Variable aus der Registry (fonts.css).
  var ALLOWED_FONTS = {
    fraunces: "--font-fraunces",
    playfair: "--font-playfair",
    space:    "--font-space",
    inter:    "--font-inter",
    oswald:   "--font-oswald"
  };

  // Headline-Selektoren, auf die der Font-Override wirkt. Deckt die
  // Klassen-Generationen aller drei Produkte + Preview ab. Body bleibt unberuehrt.
  var FONT_TARGET_SELECTORS = [
    "h1", "h2", "h3",
    ".overline", ".brand", ".statement blockquote",
    ".stat .num", ".stat-num",
    ".pv-title", ".pv-brand", ".pv-eyebrow", ".pv-section-title",
    ".pv-stat-num", ".pv-card-t"
  ].join(",");

  /* ---------------------------------------------------------------------------
   *  Kleine, defensive Helfer.
   * ------------------------------------------------------------------------- */
  var root = document.documentElement;

  function isObj(v) { return v && typeof v === "object"; }
  function isStr(v) { return typeof v === "string" && v.length > 0; }

  // Liefert den ersten nicht-leeren Wert (string|number) aus der Argumentliste.
  function firstOf() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return "";
  }

  // Boolean-Default: true, ausser explizit false. (whatsappReady etc.)
  function boolDefault(v, fallback) {
    if (v === undefined || v === null) return fallback;
    return !!v;
  }

  // Validiert grob ein Farb-Token (Hex/rgb/oklch/named). Defensiv: leere oder
  // offensichtlich unsinnige Werte werden verworfen, damit nichts kaputt geht.
  function safeColor(v, fallback) {
    if (!isStr(v)) return fallback;
    var t = v.trim();
    // grobe Plausibilitaet: keine schliessende Klammer ohne oeffnende etc.
    if (/[<>{};]/.test(t)) return fallback;
    return t;
  }

  function setVar(name, value) {
    if (value === undefined || value === null || value === "") return;
    try { root.style.setProperty(name, String(value)); } catch (e) { /* noop */ }
  }

  function readStorage(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStorage(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* private mode */ }
  }

  /* ---------------------------------------------------------------------------
   *  1) TENANT einlesen + normalisieren (Brueckenschicht fuer Altbestand).
   * ------------------------------------------------------------------------- */
  function readTenant() {
    var T  = isObj(window.TENANT) ? window.TENANT : {};
    var TC = isObj(window.TENANT_CONFIG) ? window.TENANT_CONFIG : {}; // werkhof-Altname
    var brand = isObj(TC.brand) ? TC.brand : {};

    // accent / accent2: kanonisch -> Landing-alt -> werkhof-alt -> Default.
    var accent  = safeColor(firstOf(T.accent,  T.farbeBlau,   TC.accent),  DEFAULT_ACCENT);
    var accent2 = safeColor(firstOf(T.accent2, T.farbeOrange, TC.accent2), DEFAULT_ACCENT2);
    var accentDeep = safeColor(firstOf(T.accentDeep, TC.accentDeep), "");

    return {
      id:       firstOf(T.id, TC.id, "tenant"),
      name:     firstOf(T.name, brand.name, ""),
      tag:      firstOf(T.tag, T.claim, brand.tag, ""),
      logoUrl:  firstOf(T.logoUrl, T.logo, TC.logoUrl, ""),

      accent:   accent,
      accent2:  accent2,
      accentDeep: accentDeep,

      theme:    firstOf(T.theme, DEFAULT_THEME),
      font:     firstOf(T.font, ""),
      mode:     firstOf(T.mode, "auto"),
      themeBase: firstOf(T.themeBase, DEFAULT_THEMEBASE),

      telefon:  firstOf(T.telefon, brand.telefon, ""),
      whatsapp: String(firstOf(T.whatsapp, brand.wa, "")).replace(/[^0-9]/g, ""),
      whatsappReady: boolDefault(firstOf(T.whatsappReady, brand.waReady), true),
      email:    firstOf(T.email, ""),
      mapsUrl:  firstOf(T.mapsUrl, ""),
      adresse:  isObj(T.adresse) ? T.adresse : {}
    };
  }

  /* ---------------------------------------------------------------------------
   *  2) Akzent-Skala. Aus EINER Kundenfarbe eine vollstaendige, lesbare Palette
   *     ableiten (color-mix), damit jeder Ton ohne Handarbeit funktioniert.
   *     Plus: ALLE Alt-Aliase, damit jede CSS-Generation bedient wird.
   * ------------------------------------------------------------------------- */
  function applyAccent(t) {
    var a  = t.accent;
    var a2 = t.accent2;

    // Kanonisch + Theme-Hook (Themes lesen --cust-accent).
    setVar("--cust-accent", a);
    setVar("--cust-accent2", a2);

    // Vereinheitlichte Namen.
    setVar("--accent", a);
    setVar("--accent-2", a2);

    // Legacy-Aliase der drei Produkte (Landing: --blau/--orange; Portal dito).
    setVar("--blau", a);
    setVar("--orange", a2);

    // Abgeleitete Tiefen fuer Lesbarkeit/3D-Schatten. accentDeep darf vom
    // Tenant gesetzt sein (sehr helle CI-Toene -> WCAG manuell sichern).
    var deep = t.accentDeep || "color-mix(in oklab, " + a + " 78%, black)";
    setVar("--accent-deep", deep);
    setVar("--blau-deep", deep);
    setVar("--orange-deep", "color-mix(in oklab, " + a2 + " 78%, black)");

    /* Vollstaendige Akzent-Skala (Hover/Soft/on-accent). color-mix per @supports
     * im injizierten Block, mit Fallback fuer alte Engines. on-accent waehlt
     * Schwarz/Weiss anhand der Helligkeit — heute manuelle Nachjustage gespart. */
    var css =
      ":root{" +
      "--cust-accent-hover:" + a + ";" +
      "--cust-accent-soft:"  + a + ";" +
      "--on-accent:#fff;" +
      "}" +
      "@supports (color: color-mix(in oklch, red, blue)){:root{" +
      "--cust-accent-hover:color-mix(in oklch, var(--cust-accent), black 12%);" +
      "--cust-accent-soft:color-mix(in oklch, var(--cust-accent), white 80%);" +
      "--cust-accent-glow:color-mix(in oklab, var(--cust-accent) 35%, transparent);" +
      "}}" +
      // on-accent via contrast-color, sobald verfuegbar (sonst bleibt #fff).
      "@supports (color: contrast-color(black)){:root{" +
      "--on-accent:contrast-color(var(--cust-accent));" +
      "}}";

    injectStyle(ACCENT_STYLE_ID, css);
  }

  /* ---------------------------------------------------------------------------
   *  3) Headline-Schrift-Override aus der Font-Registry (fonts.css).
   *     Leer = Theme-Standard. Setzt zusaetzlich --cust-font fuer Themes, die
   *     die Variable direkt lesen.
   * ------------------------------------------------------------------------- */
  function applyFont(t) {
    var key = String(t.font || "").toLowerCase();
    if (!key || !ALLOWED_FONTS.hasOwnProperty(key)) {
      injectStyle(FONT_STYLE_ID, ""); // zuruecksetzen auf Theme-Standard
      return;
    }
    var stack = "var(" + ALLOWED_FONTS[key] + ")";
    setVar("--cust-font", stack);
    injectStyle(
      FONT_STYLE_ID,
      FONT_TARGET_SELECTORS + "{font-family:" + stack + " !important}"
    );
  }

  /* ---------------------------------------------------------------------------
   *  4) Optionales Theme-CSS per <link>. Nur die Landing nutzt das; Portal/
   *     Werkhof haben kein <link id="ds-theme"> -> Schritt wird still ueber-
   *     sprungen. Slug gegen Allowlist gehaertet (kein Pfad aus User-Daten).
   * ------------------------------------------------------------------------- */
  function applyTheme(t) {
    var link = document.getElementById(THEME_LINK_ID);
    if (!link) return; // Produkt ohne umschaltbare Themes
    var slug = String(t.theme || DEFAULT_THEME).toLowerCase();
    if (ALLOWED_THEMES.indexOf(slug) === -1) slug = DEFAULT_THEME;

    var base = t.themeBase || DEFAULT_THEMEBASE;
    if (base.charAt(base.length - 1) !== "/") base += "/";
    var href = base + slug + ".css";

    // Nur tauschen, wenn sich der Pfad aendert (spart Roundtrip + FOUC-Frame).
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }

  /* ---------------------------------------------------------------------------
   *  5) Darstellungsmodus. Gemeinsamer Storage-Key ueber alle Produkte.
   *     User-Override im Storage gewinnt immer ueber TENANT.mode.
   * ------------------------------------------------------------------------- */
  function applyMode(t) {
    var stored = readStorage(STORAGE_MODE_KEY);
    var mode = stored || (t.mode === "auto" ? "" : t.mode);
    setMode(mode); // ""|light => keine Klasse; dark/bw => Klasse setzen
  }

  // Geteilte Hilfe: setzt html.dark / html.bw und persistiert die Wahl.
  function setMode(mode) {
    root.classList.remove("dark", "bw");
    if (mode === "dark") root.classList.add("dark");
    if (mode === "bw")   root.classList.add("bw");
    if (mode === "dark" || mode === "bw" || mode === "light") {
      writeStorage(STORAGE_MODE_KEY, mode);
    }
  }

  /* ---------------------------------------------------------------------------
   *  6) WhatsApp-Deeplink-Bau + Demo-Guard.
   * ------------------------------------------------------------------------- */
  function buildWaUrl(t, text) {
    var nr = t.whatsapp;
    var msg = text ? ("?text=" + encodeURIComponent(text)) : "";
    return "https://wa.me/" + nr + msg;
  }

  // Liefert einen Klick-Handler. Solange whatsappReady=false ODER keine Nummer
  // vorliegt, zeigt der Klick einen Demo-Hinweis statt einer Platzhalternummer.
  function makeWaHandler(t, text) {
    return function (ev) {
      if (!t.whatsappReady || !t.whatsapp) {
        if (ev) ev.preventDefault();
        toast("Demo-Modus: WhatsApp ist fuer diesen Auftritt noch nicht freigeschaltet.");
        return false;
      }
      // Ready -> echtes Ziel oeffnen (href ggf. schon gesetzt).
      return true;
    };
  }

  // Minimaler, abhaengigkeitsfreier Toast (kein Layout-Shift, compositor-only).
  function toast(message) {
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.textContent = message;
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(8px);" +
      "max-width:90vw;padding:.7rem 1rem;border-radius:10px;z-index:99999;" +
      "background:#111;color:#fff;font:500 14px/1.4 system-ui,sans-serif;" +
      "box-shadow:0 8px 30px rgba(0,0,0,.35);opacity:0;" +
      "transition:opacity .2s ease, transform .2s ease;pointer-events:none;";
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(8px)";
      setTimeout(function () { el.remove(); }, 220);
    }, 3200);
  }

  /* ---------------------------------------------------------------------------
   *  Style-Injection (idempotent: aktualisiert vorhandenen Knoten).
   * ------------------------------------------------------------------------- */
  function injectStyle(id, cssText) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      // In <head> wenn vorhanden, sonst an documentElement (laeuft vor <body>).
      (document.head || root).appendChild(el);
    }
    el.textContent = cssText;
  }

  /* ---------------------------------------------------------------------------
   *  DOM-Branding: Name, Logo, Telefon, Maps, WhatsApp-Links.
   *  data-tenant="name|logo|claim|telefon|email|maps|whatsapp|address".
   * ------------------------------------------------------------------------- */
  function applyBrand(t) {
    // Titel/og:title nur ergaenzen, wenn Name vorhanden.
    if (isStr(t.name)) {
      setText('[data-tenant="name"]', t.name);
      setText('[data-tenant="claim"]', t.tag);
      // Markenname auch in alte data-brand-name-Slots der Landing schreiben.
      setText('[data-brand-name]', t.name);
      setText('[data-brand-claim]', t.tag);
    }

    applyLogo(t);
    setText('[data-tenant="telefon"]', t.telefon);
    setHref('[data-tenant="telefon"]', t.telefon ? "tel:" + t.telefon.replace(/\s/g, "") : "");
    setText('[data-tenant="email"]', t.email);
    setHref('[data-tenant="email"]', t.email ? "mailto:" + t.email : "");
    setHref('[data-tenant="maps"], [data-maps-link]', t.mapsUrl);
    setHref('[data-tenant="telefon-link"], [data-tel]', t.telefon ? "tel:" + t.telefon.replace(/\s/g, "") : "");

    applyWaLinks(t);
    applyAddress(t);
  }

  function applyLogo(t) {
    var slots = document.querySelectorAll('[data-tenant="logo"], [data-brand-logo]');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (isStr(t.logoUrl)) {
        // Echtes Logo: <img>. Defensiv alt aus Name.
        var img = document.createElement("img");
        img.src = t.logoUrl;
        img.alt = t.name || "Logo";
        img.decoding = "async";
        slot.innerHTML = "";
        slot.appendChild(img);
      } else if (isStr(t.name)) {
        // Fallback: Initialen-Mark aus dem Namen — Go-Live ohne fertiges Logo.
        slot.textContent = initials(t.name);
        slot.setAttribute("data-mark", "initials");
      }
    }
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function applyWaLinks(t) {
    // [data-wa] (Landing-Alt) UND [data-tenant="whatsapp"]; optionaler Text in
    // data-wa-text. href wird gesetzt; Guard faengt nicht-ready ab.
    var links = document.querySelectorAll('[data-wa], [data-tenant="whatsapp"]');
    for (var i = 0; i < links.length; i++) {
      var el = links[i];
      var text = el.getAttribute("data-wa-text") ||
                 (t.name ? "Hallo " + t.name + ", " : "");
      if (t.whatsappReady && t.whatsapp) {
        el.setAttribute("href", buildWaUrl(t, text));
      } else {
        el.setAttribute("href", "#");
      }
      el.addEventListener("click", makeWaHandler(t, text));
    }
  }

  function applyAddress(t) {
    var a = t.adresse || {};
    var line = [a.strasse, [a.plz, a.ort].filter(Boolean).join(" ")]
      .filter(Boolean).join(", ");
    if (line) setText('[data-tenant="address"]', line);
  }

  function setText(sel, value) {
    if (!isStr(value)) return;
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
  }
  function setHref(sel, value) {
    if (!isStr(value)) return;
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) nodes[i].setAttribute("href", value);
  }

  /* ---------------------------------------------------------------------------
   *  Bootstrap. Pre-Paint-Teil (Variablen/Theme/Font/Mode) sofort; DOM-Teil
   *  (Branding) bei DOMContentLoaded.
   * ------------------------------------------------------------------------- */
  var tenant = readTenant();

  // --- Pre-Paint (synchron) ---
  applyAccent(tenant);
  applyFont(tenant);
  applyTheme(tenant);
  applyMode(tenant);

  // --- DOM-abhaengig ---
  function onReady() { applyBrand(tenant); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  /* ---------------------------------------------------------------------------
   *  Oeffentliche API. Alle drei Produkte lesen hieraus statt eigene CI-/WA-
   *  Logik zu duplizieren (werkhof: window.XDAB).
   * ------------------------------------------------------------------------- */
  window.XDAB = {
    tenant:  tenant,
    brand:   { name: tenant.name, tag: tenant.tag, whatsapp: tenant.whatsapp, whatsappReady: tenant.whatsappReady },
    accent:  tenant.accent,
    accent2: tenant.accent2,
    waURL:   function (text) { return buildWaUrl(tenant, text); },
    waGuard: function (text) { return makeWaHandler(tenant, text); },
    setMode: setMode,
    mode:    readStorage(STORAGE_MODE_KEY) || tenant.mode,
    initials: initials,
    toast:   toast,
    // Erneut anwenden, falls ein Produkt TENANT zur Laufzeit aendert (Preview).
    refresh: function () {
      tenant = readTenant();
      applyAccent(tenant); applyFont(tenant); applyTheme(tenant);
      applyBrand(tenant);
      window.XDAB.tenant = tenant;
      window.XDAB.accent = tenant.accent;
      window.XDAB.accent2 = tenant.accent2;
    }
  };
})();
