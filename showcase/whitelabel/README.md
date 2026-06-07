# White-Label-Engine

Eine universelle, build-freie CI-Engine (Vanilla JS/CSS, keine externen CDNs).
Ein Kunde wird vollstaendig ueber **eine** `tenant.js` eingekleidet — Farbe,
Schrift, Theme, Name, Logo und WhatsApp. Dieselbe `whitelabel.js` laeuft
unveraendert in allen drei Produkten (Landing, Kundenportal, Werkhof).

## Einbau in EIN Produkt — drei Tags

Reihenfolge ist entscheidend (`tenant.js` zuerst, `whitelabel.js` direkt danach,
Darstellungs-/Produkt-Skript zuletzt):

```html
<!-- 1) Kunden-Konfig: liefert window.TENANT -->
<script src="tenant.js"></script>

<!-- 2) Engine: liest window.TENANT, setzt CI/Theme/Font/Mode VOR dem Paint.
        Bewusst OHNE defer/async, damit es vor dem ersten Render laeuft. -->
<script src="whitelabel/whitelabel.js"></script>

<!-- 3) Produkt-Render danach -->
<script src="assets/template.js" defer></script>
```

Fuer Produkte mit umschaltbaren Design-Paketen (nur die Landing) zusaetzlich im
`<head>`, **vor** `</head>` und **nach** den Produkt-Styles:

```html
<link rel="stylesheet" href="whitelabel/fonts.css">
<link id="ds-theme" rel="stylesheet" href="assets/ds/themes/papier.css">
<style id="ds-font-override"></style>   <!-- von whitelabel.js gefuellt -->
```

Kundenportal und Werkhof haben ein **festes** Layout: kein `<link id="ds-theme">`,
kein `fonts.css`-Theme-Swap. `whitelabel.js` ueberspringt diese Schritte still
und setzt dort nur CI-Farbe, Name/Logo und WhatsApp.

## Anti-FOUC (Single-File-Produkte)

`whitelabel.js` setzt die `:root`-Variablen synchron, bevor das Produkt rendert.
Fuer den Darstellungsmodus (`dark`/`bw`) zusaetzlich ein **blockierendes**
Inline-Bootstrap als allererstes im `<head>` jedes Single-File-Produkts, damit
schon der erste Frame korrekt ist:

```html
<script>
try {
  var m = localStorage.getItem("xdab_mode");
  if (m === "dark") document.documentElement.classList.add("dark");
  if (m === "bw")   document.documentElement.classList.add("bw");
} catch (e) {}
</script>
```

## Theme, Schrift und Akzent waehlen

1. **Visuell auswaehlen:** `design-system/themes/index.html` (Picker) oeffnen,
   Design-Paket + CI-Farbe (`--cust-accent`) + Headline-Schrift live testen.
2. Die abgelesenen Werte in `tenant.js` eintragen:
   - `theme`: `papier` | `stahl` | `glas` | `edel` | `minimal`
   - `font` : `""` (Theme-Standard) | `fraunces` | `playfair` | `space` | `inter` | `oswald`
   - `accent` / `accent2`: die CI-Hexwerte
3. Deployen. Kein Eingriff in `whitelabel.js`, Produkt-CSS oder Produkt-JS.

Ein neuer Kunde = neue `tenant.js` daneben legen. Mehr nicht.

## Was die Engine setzt

**CSS-Variablen auf `:root`** (alle Generationen der drei Produkte bedient):

| Variable | Quelle |
|---|---|
| `--cust-accent`, `--accent`, `--blau` | `TENANT.accent` |
| `--cust-accent2`, `--accent-2`, `--orange` | `TENANT.accent2` |
| `--accent-deep`, `--blau-deep`, `--orange-deep` | abgeleitet (`color-mix`) oder `TENANT.accentDeep` |
| `--cust-accent-hover`, `--cust-accent-soft`, `--cust-accent-glow` | abgeleitet aus dem Akzent |
| `--on-accent` | `contrast-color()` mit `#fff`-Fallback (lesbarer Button-Text) |
| `--cust-font` | `var(--font-<TENANT.font>)` |

Aus EINER Kundenfarbe entsteht so automatisch eine vollstaendige, lesbare
Akzent-Skala — kein manuelles Nachjustieren pro Kunde.

**DOM-Slots** (per Attribut markieren, Engine fuellt sie):

```html
<span data-tenant="name"></span>      <!-- Werkstattname -->
<span data-tenant="claim"></span>     <!-- Untertitel/Claim -->
<span data-tenant="logo"></span>      <!-- <img> aus logoUrl ODER Initialen-Mark -->
<a    data-tenant="telefon"></a>      <!-- Text + tel:-href -->
<a    data-tenant="email"></a>        <!-- Text + mailto:-href -->
<a    data-tenant="maps"></a>         <!-- href aus mapsUrl -->
<span data-tenant="address"></span>   <!-- Strasse, PLZ Ort -->
<a    data-tenant="whatsapp" data-wa-text="Hallo, ...">WhatsApp</a>
```

Alte Landing-Attribute (`data-brand-name`, `data-brand-claim`, `data-brand-logo`,
`data-wa`, `data-maps-link`, `data-tel`) werden weiterhin bedient.

## WhatsApp-Deeplinks + Demo-Guard

`whitelabel.js` baut `https://wa.me/<E.164>?text=...` aus `TENANT.whatsapp`.
Solange `whatsappReady !== true` oder keine Nummer hinterlegt ist, zeigt ein
Klick einen Demo-Hinweis (Toast) statt einer Platzhalternummer. Vor Go-Live also
echte E.164-Nummer setzen **und** `whatsappReady: true`.

## Oeffentliche API (`window.XDAB`)

Damit Produkt-Code keine eigene CI-/WA-Logik dupliziert:

```js
XDAB.brand        // { name, tag, whatsapp, whatsappReady }
XDAB.accent       // CI-Primaerfarbe
XDAB.accent2      // CI-Sekundaerfarbe
XDAB.waURL(text)  // fertiger wa.me-Deeplink
XDAB.waGuard(text)// Klick-Handler mit Demo-Guard
XDAB.setMode(m)   // "light" | "dark" | "bw" — setzt Klasse + Storage (xdab_mode)
XDAB.initials(s)  // Initialen-Mark aus einem Namen
XDAB.toast(msg)   // dezenter Hinweis-Toast
XDAB.refresh()    // CI nach Laufzeit-Aenderung von window.TENANT neu anwenden
```

Der Darstellungsmodus nutzt ueber alle Produkte den gemeinsamen Storage-Key
`xdab_mode`. Ein gespeicherter User-Toggle gewinnt immer ueber `TENANT.mode`.

## DSGVO / Datenschutz

- **Alles self-hosted.** Schriften (`whitelabel/fonts.css` -> `../fonts/*.woff2`)
  und Theme-CSS liegen lokal. Kein Google-Fonts, kein externes CDN, kein
  Drittanbieter-Roundtrip — also keine ungewollte IP-Uebermittlung an Dritte.
- Die Engine macht **keine** externen Requests. `localStorage` wird nur fuer den
  Darstellungsmodus (`xdab_mode`) genutzt — kein Tracking, keine Cookies.
- WhatsApp-Links sind reine `wa.me`-Deeplinks (erst beim Klick durch den
  Nutzer). Vor dem Klick verlaesst nichts die Seite.

## Dateien

| Datei | Zweck |
|---|---|
| `whitelabel/whitelabel.js` | Engine — liest `window.TENANT`, setzt CI/Theme/Font/Mode, DOM-Branding, WhatsApp |
| `whitelabel/tenant.schema.js` | Dokumentierte `window.TENANT`-Vorlage (alle Felder) |
| `whitelabel/fonts.css` | Self-hosted `@font-face` + `--font-*`-Registry |
| `whitelabel/README.md` | Diese Anleitung |
