NXTUP v8 — iOS PWA Prototype

INSTALLATION AUF IPHONE / IPAD
1. Die Dateien müssen über HTTPS ausgeliefert werden. Ein Doppelklick auf index.html als file:// reicht für Service Worker/PWA nicht aus.
2. NXTUP in Safari öffnen.
3. Safari Teilen öffnen.
4. „Zum Home-Bildschirm“ wählen.
5. NXTUP startet danach im Standalone-Modus mit eigenem Home-Screen-Icon.

ENTHALTEN
- apple-touch-icon.png (180x180)
- PWA-Icons 192x192 und 512x512
- manifest.webmanifest mit standalone/scope/start_url
- Service Worker nxtup-v8 mit Cache-Update
- iOS Safe-Area CSS
- apple-mobile-web-app Metadaten

UX v7
- Datenschutz/Cookie-Einstellungen nur im Footer (Consent-Banner beim Erstbesuch bleibt notwendig sichtbar)
- keine Emojis in der Oberfläche
- Inspiration ist eine einzige Funktion; kein separates Surprise-Me
- deutlicher „Events anzeigen“-Button unter „Was passt zu dir?“
- Filter führen nach Klick direkt zur Kachelansicht mit Ergebnissen
- Premium: Inspiration, Dein nächster Move und Plan my Weekend
- Basic: Eventsuche, Filter, Karte, Favoriten/Locations im lokalen Demo-Modus

HINWEIS
Dies ist ein Frontend-Prototyp ohne Backend. Echte Registrierung, Zahlungen, Push, Synchronisierung und produktive Event-Datenquellen benötigen Backend/Auth/Payment und eine rechtliche Prüfung.
