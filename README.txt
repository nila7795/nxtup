NXTUP — Drop-ready Prototype
============================

Dateien gemeinsam auf einen Webserver/Static Host laden.
Wichtig: Service Worker und Geolocation funktionieren zuverlässig nur über HTTPS bzw. localhost.

Enthalten:
- Europaweite Demo-Städte + Demo-Events
- Karte/Kacheln/Liste/Split-View
- Zoom +/-, Standort, Reset, Vollbild, "Kartenausschnitt suchen"
- Filter + Sortierung + kompakte Darstellung
- Favoriten & Suchverlauf lokal (nur nach Einwilligung)
- Datenschutz-/Consent-Center
- Externe Karten/Medien werden erst nach Einwilligung geladen
- PWA-Grundlage

Vor öffentlicher Nutzung:
1) Impressum und Datenschutzangaben mit echten Verantwortlichen ergänzen.
2) Rechtliche Prüfung für DSGVO/TDDDG/ePrivacy und Bild-/Quellenrechte durchführen.
3) Für Produktion Karten-/Geocoding-Provider mit Vertrag/Datenschutzkonzept auswählen; OSMF-Public-Services sind nicht für beliebige kommerzielle Skalierung garantiert.
4) Eventquellen nur über erlaubte APIs/Feeds/Lizenzen anbinden. Bilder nur mit Nutzungsrecht übernehmen; idealerweise serverseitig auf eigenem Host speichern.
5) Echte Event-Ingestion braucht später Backend/DB. Der Prototyp bleibt statisch.

MAPIN-INSPIRIERTE NXTUP-ERWEITERUNGEN
- City Mode mit Trending/Heute/Wochenende/Kostenlos/Nightlife/Food/Kultur
- LIVE / Startet-in Status auf Eventkarten
- Social Proof + NXTUP Confidence-Anzeige
- Teilen und Reminder-Vorbereitung
- Get-the-vibe Bereich in Eventdetails
- Surprise Me
- Plan My Weekend
- Pins/Heatmap Umschalter (Heatmap UI vorbereitet; produktiv mit echter Karten-Heat-Layer-Library verbinden)
- Fokus bleibt Event Discovery statt People-/Dating-/Chat-Netzwerk
