/* bootstrap.js — FOUC-Guard. INLINE ganz oben im <head> einbauen (vor CSS):
 *   <script>/* hier den Inhalt dieser Datei *​/</script>
 * Setzt data-theme + --cust-accent + --cust-font auf <html> VOR dem ersten
 * Paint. Quelle: window.TENANT (muss davor geladen sein) ODER die
 * data-Attribute am <html> (data-theme / data-accent / data-font). Strikt
 * gehaertet: nur erlaubte Theme-/Font-Keys, nur #hex/rgb()/oklch() als Farbe. */
(function (d) {
  var T = window.TENANT || {}, h = d.documentElement, k = h.dataset,
      A = { papier: 1, stahl: 1, glas: 1, edel: 1, minimal: 1 },
      F = { fraunces: 1, playfair: 1, space: 1, inter: 1, oswald: 1 },
      t = (T.theme || k.theme || "papier").toLowerCase(),
      c = (T.accent || k.accent || "").trim(),
      f = (T.font || k.font || "").toLowerCase();
  k.theme = A[t] ? t : "papier";
  if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c) ||
      /^(?:rgb|rgba|oklch|oklab)\([0-9a-z%.,/\s+-]+\)$/i.test(c))
    h.style.setProperty("--cust-accent", c);
  if (F[f]) h.style.setProperty("--cust-font", "var(--font-" + f + ")");
})(document);
