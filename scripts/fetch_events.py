#!/usr/bin/env python3
"""
Holt den Veranstaltungskalender der Stadt Karlsruhe und schreibt ihn nach data/events.json.

Quelle: https://kalender.karlsruhe.de/db/termine/rss
Lizenz: Creative Commons CC Zero (CC0), Stadt Karlsruhe.

Der Feed zeigt nur etwa eine Woche im Voraus. Deshalb sammeln wir:
bereits bekannte Events bleiben erhalten, neue kommen dazu, vergangene fliegen raus.
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from html import unescape

FEED = "https://kalender.karlsruhe.de/db/termine/rss"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVENTS_FILE = os.path.join(ROOT, "data", "events.json")
VENUES_FILE = os.path.join(ROOT, "data", "venues.json")

# Kontaktangabe ist bei Nominatim Pflicht.
UA = "NXTUP/0.1 (Prototyp Event-App Karlsruhe; https://github.com/nila7795/nxtup)"

KARLSRUHE = (49.0069, 8.4037)
BERLIN_TZ = timezone(timedelta(hours=2))  # Sommerzeit; siehe local_time()

# ---------------------------------------------------------------- Kategorien

# Rubrik aus der URL -> unsere Kategorie. Grobe Vorsortierung.
URL_CATEGORY = {
    "musik": "Konzert",
    "theater": "Kultur",
    "ausstellungen": "Kultur",
    "literatur": "Kultur",
    "architektur": "Kultur",
    "stadtleben": "Stadtfest",
    "sportveranstaltung": "Sport",
    "messen_und_kongresse": "Messe",
    "wirtschaft": "Vortrag",
}

# Stichwörter im Titel schlagen die Rubrik. Reihenfolge zählt: erster Treffer gewinnt.
KEYWORD_CATEGORY = [
    (r"(\brave\w*|\btechno\w*|\bclubnacht|\bhausparty|\bparty\b|\bpartys\b|\bdisco\w*|\btanzab|\bdj\b)", "Party / Club"),
    (r"\b(festival|fest\b|kirchweih|kerwe|stadtfest|straßenfest|oktoberfest)\b", "Stadtfest"),
    (r"(\w*flohmarkt\b|\bmarkt\b|\bmärkte\b|\bkruschtl\w*|\bbasar\b)", "Markt"),
    (r"\b(comedy|kabarett|stand.?up)\b", "Comedy"),
    (r"\b(konzert|live|orgel|jazz|chor|sinfonie|band|klavierabend|akustik)\b", "Konzert"),
    (r"\b(kinder|familie|vorlese|ab \d+ jahren|für kinder)\b", "Familie"),
    (r"\b(kulinarisch|genuss|wein|bier|food|brunch|dinner)\b", "Food & Drinks"),
    (r"\b(führung|ausstellung|vernissage|lesung|theater|museum)\b", "Kultur"),
    (r"\b(vortrag|workshop|seminar|sprechstunde|beratung|infoabend)\b", "Vortrag"),
    (r"\b(lauf|turnier|wandern|radtour|yoga|sport)\b", "Sport"),
]

# Bestimmte Orte sind eindeutig. Der Ort schlägt alles andere.
VENUE_CATEGORY = [
    (r"substage|gotec|stadtmitte|die stadtmitte|alte hackerei", "Party / Club"),
    (r"tollhaus|jubez|kohi", "Konzert"),
    (r"badisches staatstheater|sandkorn|kammertheater|badisch bühn|marotte", "Kultur"),
    (r"zkm|kunsthalle|naturkundemuseum|museum|stadtbibliothek|landesbibliothek", "Kultur"),
    (r"messe karlsruhe|messegelände|gartenhalle", "Messe"),
]

FREE_HINTS = re.compile(r"(kostenfrei|kostenlos|eintritt frei|freier eintritt|gratis)", re.I)
TIME_TOKEN = re.compile(r"^\d{1,2}([.:]\d{2})?(\s*bis\s*\d{1,2}([.:]\d{2})?)?\s*Uhr$", re.I)


def log(msg):
    print(msg, flush=True)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def local_time(pubdate):
    """
    Der Feed liefert eine falsche Zeitzone (+0018 statt +0200).
    Wir ignorieren den Versatz komplett und lesen die Uhrzeit als deutsche Ortszeit.
    """
    m = re.match(r"\w{3}, (\d{2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2})", pubdate.strip())
    if not m:
        return None
    months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
              "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12}
    day, mon, year, hh, mm, ss = m.groups()
    if mon not in months:
        return None
    return datetime(int(year), months[mon], int(day), int(hh), int(mm))


def split_bold(content_encoded):
    """
    content:encoded sieht so aus:
      <b>20  bis  22 Uhr - Kulturzentrum Tollhaus - </b><br/>Beschreibung<br/><a>Weiter</a>
    Der fette Teil enthält Uhrzeit und Ort. Beides ist optional.
    Rückgabe: (zeitangabe, ort)
    """
    m = re.search(r"<b>(.*?)</b>", content_encoded, re.S)
    if not m:
        return "", ""
    inner = unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
    inner = re.sub(r"\s*-\s*$", "", inner)
    if not inner:
        return "", ""
    parts = [p.strip() for p in inner.split(" - ") if p.strip()]
    if parts and TIME_TOKEN.match(parts[0]):
        return parts[0], " - ".join(parts[1:])
    return "", " - ".join(parts)


def clean_text(html):
    text = re.sub(r"<[^>]+>", " ", html)
    text = unescape(text).replace("\r", " ")
    return re.sub(r"\s+", " ", text).strip()


def categorise(title, venue, url):
    haystack = f"{title} {venue}".lower()
    for pattern, cat in VENUE_CATEGORY:
        if re.search(pattern, venue, re.I):
            # Ort gibt die Richtung vor, Party-Stichwörter dürfen aber noch umschalten.
            if cat == "Konzert" and re.search(r"\b(party|rave\w*|tanzab|disco)", haystack):
                return "Party / Club"
            if cat == "Kultur" and re.search(r"\b(kinder|vorlese|familie|ab \d+ jahren)", haystack):
                return "Familie"
            return cat
    for pattern, cat in KEYWORD_CATEGORY:
        if re.search(pattern, haystack):
            return cat
    slug = url.split("/db/termine/")[-1].split("/")[0] if "/db/termine/" in url else ""
    return URL_CATEGORY.get(slug, "Kultur")


def load_json(path, fallback):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return fallback


def geocode(venue, cache):
    """
    Ortsname -> Koordinaten, über Nominatim. Ergebnisse werden in data/venues.json
    zwischengespeichert, damit jeder Ort nur ein einziges Mal abgefragt wird.
    """
    key = venue.lower().strip()
    if not key:
        return None
    if key in cache:
        return cache[key]
    query = f"{venue}, Karlsruhe, Deutschland"
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"format": "jsonv2", "limit": 1, "q": query})
    try:
        time.sleep(1.1)  # Nominatim erlaubt höchstens eine Anfrage pro Sekunde.
        data = json.loads(fetch(url))
        if data:
            cache[key] = [round(float(data[0]["lat"]), 6), round(float(data[0]["lon"]), 6)]
        else:
            cache[key] = None
    except Exception as e:
        log(f"  Geokodierung fehlgeschlagen für {venue}: {e}")
        cache[key] = None
    return cache[key]


def parse_feed(xml_bytes):
    root = ET.fromstring(xml_bytes)
    ns = {"content": "http://purl.org/rss/1.0/modules/content/"}
    out = []
    for item in root.findall("./channel/item"):
        guid = (item.findtext("guid") or "").strip()
        title = unescape((item.findtext("title") or "").strip())
        link = (item.findtext("link") or "").strip()
        pub = item.findtext("pubDate") or ""
        content = item.findtext("content:encoded", default="", namespaces=ns)
        description = item.findtext("description") or ""

        start = local_time(pub)
        if not start or not guid or not title:
            continue

        time_label, venue = split_bold(content)
        body = clean_text(re.sub(r"<b>.*?</b>", "", content, flags=re.S))
        body = re.sub(r"\s*Weiter\s*$", "", body).strip()
        if not body:
            body = clean_text(description)

        all_day = start.hour == 0 and start.minute == 0
        haystack = f"{title} {body} {time_label}"

        out.append({
            "id": "ka-" + re.sub(r"\D", "", guid),
            "source": "Stadt Karlsruhe",
            "title": title,
            "description": body[:400],
            "date": start.strftime("%Y-%m-%d"),
            "time": None if all_day else start.strftime("%H:%M"),
            "timeLabel": time_label,
            "venue": venue,
            "city": "Karlsruhe",
            "country": "Deutschland",
            "category": categorise(title, venue, link),
            "price": 0 if FREE_HINTS.search(haystack) else None,
            "url": link,
        })
    return out


def main():
    log("Hole den Karlsruher Veranstaltungskalender ...")
    try:
        xml_bytes = fetch(FEED)
    except Exception as e:
        log(f"Feed nicht erreichbar: {e}")
        return 1

    fresh = parse_feed(xml_bytes)
    log(f"{len(fresh)} Einträge im Feed gefunden.")
    if not fresh:
        log("Keine Einträge geparst. Abbruch, damit nichts überschrieben wird.")
        return 1

    venues = load_json(VENUES_FILE, {})
    known = {e["id"]: e for e in load_json(EVENTS_FILE, {}).get("events", [])}

    new_count = 0
    for ev in fresh:
        coords = geocode(ev["venue"], venues) if ev["venue"] else None
        ev["lat"], ev["lng"] = coords if coords else KARLSRUHE
        ev["geoExact"] = coords is not None
        if ev["id"] not in known:
            new_count += 1
        known[ev["id"]] = ev

    # Alles vor gestern fliegt raus.
    cutoff = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    events = sorted((e for e in known.values() if e["date"] >= cutoff),
                    key=lambda e: (e["date"], e["time"] or "00:00"))

    os.makedirs(os.path.dirname(EVENTS_FILE), exist_ok=True)
    with open(EVENTS_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "updated": datetime.now(BERLIN_TZ).isoformat(timespec="seconds"),
            "source": "Veranstaltungskalender der Stadt Karlsruhe (CC0)",
            "sourceUrl": FEED,
            "count": len(events),
            "events": events,
        }, f, ensure_ascii=False, indent=1)
    with open(VENUES_FILE, "w", encoding="utf-8") as f:
        json.dump(venues, f, ensure_ascii=False, indent=1, sort_keys=True)

    exact = sum(1 for e in events if e["geoExact"])
    log(f"Gespeichert: {len(events)} Events ({new_count} neu), davon {exact} mit genauer Position.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
