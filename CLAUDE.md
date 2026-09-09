# NXTUP — Projektgedächtnis

## Was ist das
Event-Discovery-PWA für Europa. Nutzer sucht eine Stadt, filtert nach Zeitraum,
Kategorie, Genre und Preis und sieht Events als Kacheln, Liste oder auf einer Karte.
Ziel ist später: echte Events aus vielen Quellen automatisch zusammenführen.

**Aktueller Stand: Prototyp mit Beispieldaten.** Es gibt keine Datenbank, kein Backend,
keine echten Events. Die Oberfläche ist vollständig bedienbar.

## Tech Stack
- Reines HTML, CSS und JavaScript. Kein Framework, kein Build-Schritt.
- Leaflet 1.9.4 für die Karte, liegt lokal unter `vendor/`.
- Kartenkacheln von OpenStreetMap, erst nach Zustimmung.
- Ortssuche über Nominatim (OpenStreetMap), erst nach Zustimmung.
- Service Worker für Offline-Nutzung, Manifest für die Installation als App.
- Hosting: GitHub Pages.

## Projektstruktur
```
index.html              Aufbau der Seite
app.js                  Gesamte Logik (Daten, Filter, Ansichten, Karte)
style.css               Design, heller Standard, Dunkelmodus über body.dark
sw.js                   Service Worker, speichert nur eigene Dateien
manifest.webmanifest    App-Installation
impressum.html          Rechtliches
apple-touch-icon.png    iPhone-Icon
icons/                  Icons für Android und PWA
vendor/                 Leaflet lokal
```

## Wichtige Entscheidungen
- **Ein einziges Filtersystem.** Vorher gab es zwei getrennte (City Mode und Entdecken),
  die sich gegenseitig gelöscht haben. Jetzt schreiben alle Filter in `state`, und
  `matches(e)` ist die einzige Stelle, die entscheidet, ob ein Event angezeigt wird.
- **`state.results` statt Funktionsketten.** Vorher wurde `currentResults` bei jedem
  Rendern neu definiert, wodurch die Trefferliste bei jedem Sortieren geschrumpft ist.
- **Heller Standard.** Dunkelmodus nur, wenn der Nutzer ihn selbst wählt. Gespeichert
  unter `nxtupThemeV12`.
- **Keine toten Buttons.** Entfernt wurden: Sprachumschalter DE/EN (hat nichts übersetzt),
  Split-Ansicht (identisch mit Karte), "Stadt ändern", "Tickets & Infos" (Link ins Leere),
  Radius-Auswahl (ohne Wirkung).
- **Favoriten funktionieren lokal** über localStorage, kein Konto nötig. Vorher war das
  Herz nur eine Werbefläche für Premium.
- **Outdoor und Indoor schließen sich gegenseitig aus.** Vorher konnte man beide
  aktivieren, was immer null Treffer ergab.
- **Demo wird offen benannt.** Balken oben, Hinweis in jeder Eventdetailansicht, Hinweis
  im Fußbereich. NXTUP+ ist als Vorschau gekennzeichnet, es gibt keinen Bezahlvorgang.
- **Leaflet lokal statt CDN.** Weniger externe Aufrufe, sauberer beim Datenschutz.

## Beispieldaten
`ensureEvents(city)` erzeugt pro Stadt 16 Events aus 14 Vorlagen. Die Termine liegen
bewusst dicht in den nächsten drei Wochen, damit "Heute" und "Dieses Wochenende"
auch Treffer haben. Pro Stadt sind Event 1 immer LIVE und Event 2 startet bald.

**Das ist die Stelle, die beim Anschluss echter Daten ersetzt wird.**

## Offene Aufgaben
1. Echte Eventquellen anbinden. Größter Brocken, siehe unten.
2. Backend und Konten, sobald Favoriten geräteübergreifend gelten sollen.
3. Veranstalter-Zugang: eigene Events einstellen, Location verwalten, Platzierung buchen.
4. Datenschutzerklärung juristisch fertigstellen. Aktuell steht dort ein Platzhalter.
5. Geschäftsmodell festlegen, bevor Preise irgendwo echt sichtbar werden.

## Bekannte Grenzen
- Facebook hat seit 2018 keine öffentliche Events-API mehr. Automatisches Auslesen
  verstößt gegen die Nutzungsbedingungen.
- Realistische Quellen sind Ticketmaster Discovery API, Eventbrite, Bandsintown,
  städtische Open-Data-Kalender und ICS-Feeds von Locations.
- Nominatim hat ein Nutzungslimit und ist nicht für hohe Lasten gedacht.
