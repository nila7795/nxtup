'use strict';
/* NXTUP v12 — Prototyp.
   WICHTIG: Alle Events werden hier lokal aus Vorlagen erzeugt. Es sind Beispieldaten,
   keine echten Veranstaltungen. Der Austausch gegen echte Quellen passiert in ensureEvents(). */

const $ = id => document.getElementById(id);
const TODAY = new Date();
const DAY = 86400000;
const iso = d => new Date(d).toISOString().slice(0, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const addDays = n => iso(TODAY.getTime() + n * DAY);
const nowSlot = h => { const d = new Date(Date.now() + h * 3600000); return { date: iso(d), time: d.toTimeString().slice(0, 5) } };
const hash = s => [...String(s)].reduce((a, c) => ((a * 33) ^ c.charCodeAt(0)) >>> 0, 5381);

/* ---------- Städte ---------- */
const citySeed = [
['Karlsruhe','Deutschland',49.0069,8.4037],['Stuttgart','Deutschland',48.7758,9.1829],['Heidelberg','Deutschland',49.3988,8.6724],['Freiburg','Deutschland',47.999,7.8421],['Mannheim','Deutschland',49.4875,8.466],['Berlin','Deutschland',52.52,13.405],['Hamburg','Deutschland',53.5511,9.9937],['München','Deutschland',48.1351,11.582],['Köln','Deutschland',50.9375,6.9603],['Frankfurt','Deutschland',50.1109,8.6821],['Leipzig','Deutschland',51.3397,12.3731],['Dresden','Deutschland',51.0504,13.7373],
['Amsterdam','Niederlande',52.3676,4.9041],['Rotterdam','Niederlande',51.9244,4.4777],['Utrecht','Niederlande',52.0907,5.1214],['Paris','Frankreich',48.8566,2.3522],['Lyon','Frankreich',45.764,4.8357],['Marseille','Frankreich',43.2965,5.3698],['Nizza','Frankreich',43.7102,7.262],['Bordeaux','Frankreich',44.8378,-0.5792],['Barcelona','Spanien',41.3874,2.1686],['Madrid','Spanien',40.4168,-3.7038],['Valencia','Spanien',39.4699,-0.3763],['Sevilla','Spanien',37.3891,-5.9845],['Bilbao','Spanien',43.263,-2.935],['Ibiza','Spanien',38.9067,1.4206],
['London','Vereinigtes Königreich',51.5072,-0.1276],['Manchester','Vereinigtes Königreich',53.4808,-2.2426],['Bristol','Vereinigtes Königreich',51.4545,-2.5879],['Edinburgh','Vereinigtes Königreich',55.9533,-3.1883],['Dublin','Irland',53.3498,-6.2603],['Wien','Österreich',48.2082,16.3738],['Salzburg','Österreich',47.8095,13.055],['Graz','Österreich',47.0707,15.4395],['Zürich','Schweiz',47.3769,8.5417],['Basel','Schweiz',47.5596,7.5886],['Genf','Schweiz',46.2044,6.1432],['Bern','Schweiz',46.948,7.4474],
['Prag','Tschechien',50.0755,14.4378],['Brünn','Tschechien',49.1951,16.6068],['Budapest','Ungarn',47.4979,19.0402],['Warschau','Polen',52.2297,21.0122],['Krakau','Polen',50.0647,19.945],['Danzig','Polen',54.352,18.6466],['Kopenhagen','Dänemark',55.6761,12.5683],['Aarhus','Dänemark',56.1629,10.2039],['Stockholm','Schweden',59.3293,18.0686],['Göteborg','Schweden',57.7089,11.9746],['Oslo','Norwegen',59.9139,10.7522],['Bergen','Norwegen',60.3913,5.3221],['Helsinki','Finnland',60.1699,24.9384],['Tallinn','Estland',59.437,24.7536],['Riga','Lettland',56.9496,24.1052],['Vilnius','Litauen',54.6872,25.2797],
['Mailand','Italien',45.4642,9.19],['Rom','Italien',41.9028,12.4964],['Florenz','Italien',43.7696,11.2558],['Neapel','Italien',40.8518,14.2681],['Bologna','Italien',44.4949,11.3426],['Turin','Italien',45.0703,7.6869],['Lissabon','Portugal',38.7223,-9.1393],['Porto','Portugal',41.1579,-8.6291],['Brüssel','Belgien',50.8503,4.3517],['Antwerpen','Belgien',51.2194,4.4025],['Athen','Griechenland',37.9838,23.7275],['Thessaloniki','Griechenland',40.6401,22.9444],['Zagreb','Kroatien',45.815,15.9819],['Split','Kroatien',43.5081,16.4402],['Ljubljana','Slowenien',46.0569,14.5058],['Bratislava','Slowakei',48.1486,17.1077]
].map(x => ({ name: x[0], country: x[1], lat: x[2], lng: x[3] }));
const cities = [...citySeed];

/* ---------- Beispiel-Events ---------- */
const templates = [
['Open Air Sessions','Festival','Electronic',29,true,18],['Street Food Market','Food & Drinks','',0,true,0],['Indie Night','Konzert','Indie',22,false,16],['Night Shift','Party / Club','House',16,false,18],['Comedy Club','Comedy','',31,false,0],['City Festival','Stadtfest','Live Music',0,true,0],['Bass District','Festival','Techno',39,true,18],['Jazz Courtyard','Konzert','Jazz',18,true,0],['Family Sunday','Familie','',8,true,0],['Culture Night','Kultur','',12,false,0],['Warehouse Session','Party / Club','Hardtechno',24,false,18],['Makers Market','Markt','',0,true,0],['Rooftop Day Party','Party / Club','House',20,true,18],['Live Arena','Konzert','Pop',35,false,0]
];
const events = [];
let seq = 1;
function ensureEvents(city, count = 16) {
  if (events.some(e => e.city === city.name)) return;
  const h = hash(city.name + city.country);
  for (let i = 0; i < count; i++) {
    const t = templates[(h + i) % templates.length];
    const live = i === 0 ? nowSlot(-1) : i === 1 ? nowSlot(1) : null;
    const angle = ((h + i * 29) % 360) * Math.PI / 180;
    const r = .008 + ((h + i * 13) % 35) / 1000;
    events.push({
      id: seq++,
      name: i === 0 ? `${city.name} Live` : i === 1 ? `${city.name} Next Up` : t[0],
      type: t[1], genre: t[2], price: t[3], outdoor: t[4], age: t[5],
      // Termine liegen bewusst dicht in den nächsten drei Wochen, damit die
      // Filter "Heute" und "Dieses Wochenende" auch wirklich Treffer haben.
      date: live ? live.date : i < 4 ? addDays(i - 2) : addDays((i * 2 + (h % 7)) % 20 + 1),
      time: live ? live.time : ['10:00','12:30','16:00','18:30','20:00','22:00','23:30'][i % 7],
      city: city.name, country: city.country,
      place: [`${city.name} Center`, `${city.name} Riverside`, `${city.name} Hall`, `${city.name} Club`, `${city.name} Quarter`][i % 5],
      lat: city.lat + Math.cos(angle) * r, lng: city.lng + Math.sin(angle) * r,
      popularity: 60 + ((h + i * 7) % 40),
      sources: ['Beispieldaten']
    });
  }
}
cities.forEach(c => ensureEvents(c, c.name === 'Barcelona' ? 22 : 16));
const venues = [
  { name: 'Gotec Club', city: 'Karlsruhe', type: 'Club' },
  { name: 'Substage', city: 'Karlsruhe', type: 'Venue' },
  { name: 'Razzmatazz', city: 'Barcelona', type: 'Club' },
  { name: 'Input', city: 'Barcelona', type: 'Club' },
  { name: 'Berghain', city: 'Berlin', type: 'Club' },
  { name: 'Fabric', city: 'London', type: 'Club' },
  { name: 'Paradiso', city: 'Amsterdam', type: 'Venue' }
];


/* ---------- Echte Eventdaten ---------- */
// data/events.json wird dreimal täglich von GitHub Actions aus dem
// Veranstaltungskalender der Stadt Karlsruhe (CC0) erzeugt.
const realCities = new Set();
async function loadRealEvents() {
  let data;
  try {
    const r = await fetch('data/events.json', { cache: 'no-store' });
    if (!r.ok) throw 0;
    data = await r.json();
  } catch {
    return; // Ohne Datei bleiben die Beispieldaten stehen.
  }
  if (!data.events?.length) return;

  const cities = new Set(data.events.map(e => e.city));
  cities.forEach(c => realCities.add(c));
  // Beispieldaten der betroffenen Städte entfernen.
  for (let i = events.length - 1; i >= 0; i--) {
    if (cities.has(events[i].city)) events.splice(i, 1);
  }
  data.events.forEach(e => events.push({
    id: seq++,
    name: e.title,
    description: e.description || '',
    type: e.category,
    genre: '',
    price: e.price,
    outdoor: null,
    date: e.date,
    time: e.time,
    city: e.city,
    country: e.country,
    place: e.venue || e.city,
    lat: e.lat,
    lng: e.lng,
    popularity: 50,
    url: e.url,
    sources: [e.source]
  }));
  state.dataUpdated = data.updated;
  markRealData();
}
function markRealData() {
  const list = [...realCities].join(', ');
  $('demoBar').innerHTML = `<span><b>Echte Events für ${esc(list)}.</b> Andere Städte zeigen weiterhin Beispieldaten.</span><button id="demoBarInfo" type="button">Mehr</button>`;
  $('demoBarInfo').onclick = () => showGeneric('Woher kommen die Daten?',
    `Die Events für ${list} stammen aus dem offiziellen Veranstaltungskalender der Stadt Karlsruhe und werden mehrmals täglich automatisch abgeholt. Für alle anderen Städte zeigt NXTUP noch Beispieldaten.`);
}

/* ---------- Zustand ---------- */
const VIEW_KEY = 'nxtupViewV12', FAV_KEY = 'nxtupFavV12', THEME_KEY = 'nxtupThemeV12', CONSENT_KEY = 'nxtupConsentV12';
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} };

const state = {
  city: cities[0],
  chips: new Set(),
  space: null,          // 'outdoor' | 'indoor' | null
  view: read(VIEW_KEY, 'grid'),
  results: [],
  resultLabel: '',      // gesetzt bei Suche über mehrere Städte
  consent: { map: false },
  map: null, mapReady: false, markers: []
};
const favs = () => read(FAV_KEY, []);
const isFav = id => favs().includes(id);

/* ---------- Helfer ---------- */
const dateObj = e => new Date(`${e.date}T${e.time || '00:00'}:00`);
const isLive = e => { const s = dateObj(e).getTime(); return Date.now() >= s && Date.now() <= s + 5 * 3600000 };
const startsSoon = e => { const d = (dateObj(e) - Date.now()) / 3600000; return d > 0 && d <= 3 };
const priceLabel = e => e.price === 0 ? 'Kostenlos' : e.price ? `${e.price} €` : 'Preis beim Veranstalter';
function status(e) {
  if (!e.time) return new Date(e.date + 'T12:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' }) + ' · ganztägig';
  if (isLive(e)) return 'LIVE';
  if (startsSoon(e)) return 'STARTET BALD';
  return new Date(e.date + 'T12:00').toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
}
function weekendRange() {
  const d = new Date(), day = d.getDay(), untilFri = (5 - day + 7) % 7;
  const fri = new Date(d.getFullYear(), d.getMonth(), d.getDate() + untilFri);
  return [iso(fri), iso(new Date(fri.getTime() + 2 * DAY))];
}
const CHIP_TYPE = { nightlife: 'Party / Club', concerts: 'Konzert', festivals: 'Festival', food: 'Food & Drinks', culture: 'Kultur' };
const COVER = { 'Festival': 'c1', 'Party / Club': 'c2', 'Konzert': 'c3', 'Food & Drinks': 'c4', 'Kultur': 'c5', 'Comedy': 'c6', 'Markt': 'c4', 'Stadtfest': 'c1', 'Familie': 'c5' };

/* ---------- Ein einziges Filtersystem ---------- */
function matches(e) {
  if (e.city !== state.city.name) return false;
  const c = state.chips;
  if (c.has('today') && e.date !== iso(TODAY)) return false;
  if (c.has('weekend')) { const [a, b] = weekendRange(); if (e.date < a || e.date > b) return false }
  if (c.has('free') && e.price !== 0) return false;
  const typeChips = [...c].filter(k => CHIP_TYPE[k]);
  if (typeChips.length && !typeChips.some(k => CHIP_TYPE[k] === e.type)) return false;

  const from = $('from').value, to = $('to').value;
  if (from && e.date < from) return false;
  if (to && e.date > to) return false;
  const type = $('type').value, genre = $('genre').value;
  if (type && e.type !== type) return false;
  if (genre && e.genre !== genre) return false;
  const min = Number($('minPrice').value || 0);
  const max = $('maxPrice').value === '' ? Infinity : Number($('maxPrice').value);
  // Ist der Preis unbekannt, filtern wir ihn nicht weg.
  if (e.price !== null && e.price !== undefined && (e.price < min || e.price > max)) return false;
  if (e.outdoor !== null && e.outdoor !== undefined) {
    if (state.space === 'outdoor' && !e.outdoor) return false;
    if (state.space === 'indoor' && e.outdoor) return false;
  }
  return true;
}
function sortList(list) {
  const s = $('sort').value;
  return [...list].sort((a, b) =>
    s === 'date' ? dateObj(a) - dateObj(b) :
    s === 'price' ? a.price - b.price :
    s === 'popular' ? b.popularity - a.popularity :
    (Number(isLive(b)) - Number(isLive(a))) || b.popularity - a.popularity);
}
function applyFilters(scrollTo = false) {
  state.resultLabel = '';
  setResults(events.filter(matches));
  if (scrollTo) $('resultsTop').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function setResults(list, label = '') {
  state.results = list;
  state.resultLabel = label;
  render();
}

/* ---------- Darstellung ---------- */
function cover(e) {
  return `<div class="eventImage ${COVER[e.type] || 'c3'}">
    <span class="status">${esc(status(e))}</span>
    ${e.genre ? `<span class="eventType">${esc(e.type)}</span>` : ''}
    <span class="coverWord">${esc(e.genre || e.type)}</span>
    <button class="favBtn ${isFav(e.id) ? 'saved' : ''}" data-fav="${e.id}" type="button" aria-label="Merken">${isFav(e.id) ? '♥' : '♡'}</button>
  </div>`;
}
function card(e, list = false) {
  return `<article class="eventCard ${list ? 'listCard' : ''}" data-event="${e.id}" tabindex="0">
    ${cover(e)}
    <div class="cardBody"><h3>${esc(e.name)}</h3><p>${esc(e.place)} · ${esc(e.city)}</p>
    <div class="metaRow"><span>${e.time ? esc(e.time) + ' Uhr' : 'ganztägig'}</span><span>${esc(priceLabel(e))}</span>${e.genre ? `<span>${esc(e.genre)}</span>` : ''}</div></div>
  </article>`;
}
function emptyBox() {
  return `<div class="emptyState"><strong>Keine passenden Events</strong><p>Setz die Filter zurück oder wähle einen größeren Zeitraum.</p><button class="ghostBtn" id="emptyReset" type="button">Filter zurücksetzen</button></div>`;
}
function render() {
  const out = sortList(state.results);
  $('count').textContent = `${out.length} Event${out.length === 1 ? '' : 's'}`;
  $('context').textContent = state.resultLabel || ` in ${state.city.name}`;
  $('gridView').innerHTML = out.length ? out.map(e => card(e)).join('') : emptyBox();
  $('listView').innerHTML = out.length ? out.map(e => card(e, true)).join('') : emptyBox();
  bindCards();
  renderInspiration(out);
  if (state.mapReady) renderMarkers(out);
}
function bindCards() {
  document.querySelectorAll('[data-event]').forEach(el => {
    el.onclick = ev => { if (ev.target.closest('[data-fav]')) return; openEvent(Number(el.dataset.event)) };
    el.onkeydown = ev => { if (ev.key === 'Enter') openEvent(Number(el.dataset.event)) };
  });
  document.querySelectorAll('[data-fav]').forEach(b => b.onclick = ev => { ev.stopPropagation(); toggleFav(Number(b.dataset.fav)) });
  const er = $('emptyReset'); if (er) er.onclick = resetFilters;
}
function toggleFav(id) {
  const list = favs();
  const i = list.indexOf(id);
  if (i === -1) list.push(id); else list.splice(i, 1);
  write(FAV_KEY, list);
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
    const on = list.includes(id);
    b.classList.toggle('saved', on);
    b.textContent = on ? '♥' : '♡';
  });
}
function showFavorites() {
  const list = events.filter(e => isFav(e.id));
  if (!list.length) { showGeneric('Noch keine Favoriten', 'Tippe auf das Herz an einer Eventkarte, dann sammelst du deine Favoriten hier. Sie bleiben auf diesem Gerät gespeichert.'); return }
  setResults(list, ' · deine Favoriten');
  setView(state.view === 'map' ? 'grid' : state.view);
  $('resultsTop').scrollIntoView({ behavior: 'smooth' });
}
function renderInspiration(list) {
  const src = list.length ? list : events.filter(e => e.city === state.city.name);
  $('inspirationRail').innerHTML = src.slice(0, 3).map(e =>
    `<button class="miniInspire" data-inspire="${e.id}" type="button"><h3>${esc(e.name)}</h3><p>${esc(e.city)} · ${esc(priceLabel(e))}</p></button>`).join('');
  document.querySelectorAll('[data-inspire]').forEach(b => b.onclick = () => openEvent(Number(b.dataset.inspire)));
}

/* ---------- Eventdetails ---------- */
function detail(e) {
  return `<div class="modalInner">
    <div class="modalHero ${COVER[e.type] || 'c3'}"><span class="status">${esc(status(e))}</span><span class="coverWord">${esc(e.genre || e.type)}</span></div>
    <h1>${esc(e.name)}</h1>
    <p>${esc(e.place)} · ${esc(e.city)}, ${esc(e.country)}</p>
    <div class="detailMeta">
      <span>${esc(new Date(e.date + 'T12:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }))}</span>
      <span>${e.time ? esc(e.time) + ' Uhr' : 'ganztägig'}</span><span>${esc(priceLabel(e))}</span><span>${esc(e.genre || e.type)}</span>
    </div>
    <div class="detailActions">
      <button class="primaryAction ${isFav(e.id) ? 'saved' : ''}" data-fav="${e.id}" type="button">${isFav(e.id) ? '♥ Gemerkt' : '♡ Merken'}</button>
      ${e.url ? `<a target="_blank" rel="noopener" href="${esc(e.url)}">Zur Veranstaltung</a>` : ''}
      <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.lat + ',' + e.lng)}">Route</a>
      <button type="button" data-share="${e.id}">Teilen</button>
    </div>
    ${e.url ? '' : '<div class="demoNote">Beispiel-Event aus dem Prototyp. Dafür gibt es keine echte Veranstaltungsseite.</div>'}
    ${e.description ? `<h3>Über das Event</h3><p>${esc(e.description)}</p>` : ''}
    <h3>Quelle</h3>
    <p>${e.sources.map(esc).join(' · ')}</p>
  </div>`;
}
function wireDetail(root, e) {
  const fav = root.querySelector('[data-fav]');
  if (fav) fav.onclick = () => {
    toggleFav(e.id);
    fav.textContent = isFav(e.id) ? '♥ Gemerkt' : '♡ Merken';
    fav.classList.toggle('saved', isFav(e.id));
  };
  const sh = root.querySelector('[data-share]');
  if (sh) sh.onclick = () => shareEvent(e);
}
function openEvent(id) {
  const e = events.find(x => x.id === id);
  if (!e) return;
  if (innerWidth > 900) {
    $('eventDrawerBody').innerHTML = detail(e);
    $('eventDrawer').classList.remove('hidden');
    wireDetail($('eventDrawerBody'), e);
    return;
  }
  $('eventModalBody').innerHTML = detail(e);
  $('eventModal').showModal();
  wireDetail($('eventModalBody'), e);
}
function closeDrawer() { $('eventDrawer').classList.add('hidden') }
function showPreview(e) {
  if (innerWidth > 900) { openEvent(e.id); return }
  $('preview').classList.remove('empty');
  $('preview').innerHTML = `<button class="previewClose" type="button" aria-label="Schließen">×</button>${card(e)}
    <div class="modalInner" style="padding:8px 4px 4px"><button class="primaryBtn wide" id="previewDetails" type="button">Eventdetails öffnen</button></div>`;
  $('preview').querySelector('.previewClose').onclick = closePreview;
  $('preview').querySelector('[data-fav]').onclick = ev => { ev.stopPropagation(); toggleFav(e.id) };
  $('previewDetails').onclick = () => openEvent(e.id);
}
function closePreview() {
  $('preview').classList.add('empty');
  $('preview').innerHTML = '<div class="emptyPreview"><strong>Event auswählen</strong><p>Klicke auf einen Pin oder ein Event.</p></div>';
}
async function shareEvent(e) {
  const data = { title: e.name, text: `${e.name} in ${e.city}`, url: location.href };
  try { if (navigator.share) { await navigator.share(data); return } } catch { return }
  try { await navigator.clipboard.writeText(location.href); showGeneric('Link kopiert', 'Der Link zu NXTUP liegt jetzt in deiner Zwischenablage.') } catch {}
}

/* ---------- Stadt ---------- */
function setCity(city) {
  state.city = { ...city };
  ensureEvents(state.city);
  $('citySearch').value = city.name;
  $('cityModeTitle').textContent = city.name;
  $('cityModeSubtitle').textContent = `Alle Events in ${city.name} entdecken.`;
  fillSelects();
  applyFilters();
  if (state.mapReady) centerMap();
}
async function findCity(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return null;
  let city = cities.find(c => c.name.toLowerCase() === needle) || cities.find(c => c.name.toLowerCase().startsWith(needle));
  if (city) return city;
  if (!state.consent.map) {
    showGeneric('Ortssuche', 'Für Orte außerhalb der eingebauten Städte fragen wir OpenStreetMap. Aktiviere dafür bitte die externe Karte in den Cookie-Einstellungen.');
    return null;
  }
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q + ' Europe')}`, { headers: { 'Accept-Language': 'de' } });
    const d = await r.json();
    if (!d.length) throw 0;
    city = { name: d[0].display_name.split(',')[0], country: d[0].address?.country || '', lat: +d[0].lat, lng: +d[0].lon };
    cities.push(city);
    ensureEvents(city);
    return city;
  } catch {
    showGeneric('Ort nicht gefunden', 'Bitte prüfe die Schreibweise oder suche nach Stadt und Land.');
    return null;
  }
}
async function citySearch() {
  const c = await findCity($('citySearch').value);
  if (c) { setCity(c); $('resultsTop').scrollIntoView({ behavior: 'smooth', block: 'start' }) }
}
function resetFilters() {
  state.chips.clear();
  state.space = null;
  document.querySelectorAll('.cityFilter').forEach(b => b.classList.remove('active'));
  ['outdoorBtn', 'indoorBtn'].forEach(id => $(id).classList.remove('active'));
  ['type', 'genre', 'maxPrice', 'to'].forEach(id => $(id).value = '');
  $('minPrice').value = '0';
  $('from').value = iso(TODAY);
  applyFilters();
}

/* ---------- Ansichten ---------- */
function fillSelects() {
  const pool = events.filter(e => e.city === state.city.name);
  const types = [...new Set(pool.map(e => e.type))].sort();
  const genres = [...new Set(pool.map(e => e.genre).filter(Boolean))].sort();
  $('type').innerHTML = '<option value="">Alle</option>' + types.map(x => `<option>${esc(x)}</option>`).join('');
  $('genre').innerHTML = '<option value="">Alle</option>' + genres.map(x => `<option>${esc(x)}</option>`).join('');
  // Ohne Genres in den Daten hat das Feld keinen Zweck.
  $('genre').closest('label').classList.toggle('hidden', genres.length === 0);
}
function setView(v) {
  state.view = v;
  write(VIEW_KEY, v);
  ['map', 'grid', 'list'].forEach(x => {
    $(`${x}View`).classList.toggle('hidden', x !== v);
    $(`${x}Btn`).classList.toggle('active', x === v);
  });
  if (v === 'map') { enableMapIfAllowed(); setTimeout(() => state.map?.invalidateSize(), 120) }
}

/* ---------- Zustimmung und Karte ---------- */
function initConsent() {
  const c = read(CONSENT_KEY, null);
  if (c) { state.consent = { ...state.consent, ...c }; return }
  $('consentBanner').classList.remove('hidden');
}
function saveConsent(map) {
  state.consent = { map };
  write(CONSENT_KEY, state.consent);
  $('consentBanner').classList.add('hidden');
  if (map && state.view === 'map') enableMapIfAllowed();
}
async function enableMapIfAllowed() {
  if (!state.consent.map) { $('mapFallback').classList.remove('hidden'); return }
  if (state.mapReady) return;
  if (!window.L) { try { await loadLeaflet() } catch { showGeneric('Karte nicht verfügbar', 'Die Kartenbibliothek konnte nicht geladen werden. Prüfe deine Internetverbindung.'); return } }
  state.map = L.map('map', { zoomControl: false }).setView([state.city.lat, state.city.lng], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(state.map);
  state.mapReady = true;
  $('mapFallback').classList.add('hidden');
  renderMarkers(sortList(state.results));
}
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    const l = document.createElement('link');
    // Leaflet liegt lokal im Ordner vendor/. Kein fremdes CDN, weniger externe Aufrufe.
    l.rel = 'stylesheet'; l.href = 'vendor/leaflet.css';
    document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = 'vendor/leaflet.js';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
function renderMarkers(list) {
  if (!state.mapReady) return;
  state.markers.forEach(m => m.remove());
  state.markers = [];
  list.forEach(e => {
    const m = L.marker([e.lat, e.lng]).addTo(state.map).bindTooltip(e.name);
    m.on('click', () => showPreview(e));
    state.markers.push(m);
  });
  if (list.length) state.map.fitBounds(L.featureGroup(state.markers).getBounds().pad(.18), { maxZoom: 14 });
  else centerMap();
}
function centerMap() { state.map?.setView([state.city.lat, state.city.lng], 12) }

/* ---------- Suche ---------- */
function searchGlobal(q) {
  q = q.trim();
  if (!q) return;
  const needle = q.toLowerCase();
  const venue = venues.find(v => v.name.toLowerCase().includes(needle));
  if (venue) { showVenue(venue); return }
  const city = cities.find(c => c.name.toLowerCase().includes(needle));
  if (city) { setCity(city); $('resultsTop').scrollIntoView({ behavior: 'smooth' }); return }
  const hits = events.filter(e =>
    e.name.toLowerCase().includes(needle) || e.genre.toLowerCase().includes(needle) || e.type.toLowerCase().includes(needle));
  if (hits.length) {
    setResults(hits, ` für „${q}“ in ganz Europa`);
    setView(state.view === 'map' ? 'grid' : state.view);
    $('resultsTop').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  findCity(q).then(c => { if (c) { setCity(c); $('resultsTop').scrollIntoView({ behavior: 'smooth' }) } });
}
function showVenue(v) {
  const list = events.filter(e => e.city === v.city && (v.type === 'Club' ? e.type === 'Party / Club' : true));
  $('genericModalBody').innerHTML = `<div class="modalInner"><p class="kicker">LOCATION</p><h1>${esc(v.name)}</h1>
    <p>${esc(v.city)} · ${esc(v.type)}</p>
    <div class="demoNote">Locations sind im Prototyp Beispieldaten.</div>
    <h3>Kommende Events</h3>
    ${list.slice(0, 6).map(e => `<button class="miniInspire" data-venue-event="${e.id}" type="button"><h3>${esc(e.name)}</h3><p>${esc(e.date)} · ${esc(e.time)} · ${esc(priceLabel(e))}</p></button>`).join('')}</div>`;
  $('genericModal').showModal();
  document.querySelectorAll('[data-venue-event]').forEach(b => b.onclick = () => { $('genericModal').close(); openEvent(Number(b.dataset.venueEvent)) });
}
function showGeneric(title, text) {
  $('genericModalBody').innerHTML = `<div class="modalInner"><p class="kicker">NXTUP</p><h1>${esc(title)}</h1><p>${esc(text)}</p></div>`;
  $('genericModal').showModal();
}
function showPremium(reason = 'Plan my Weekend, dein nächster Move, Benachrichtigungen für Lieblingslocations und persönliche Empfehlungen.') {
  $('genericModalBody').innerHTML = `<div class="modalInner"><p class="kicker">NXTUP+ · VORSCHAU</p>
    <h1>Dein Europa. Deine Events.</h1>
    <p>${esc(reason)}</p>
    <div class="demoNote">Das ist eine Vorschau auf geplante Funktionen. Es gibt noch kein Abo und keine Bezahlung. Die Preise sind ein Entwurf.</div>
    <div class="priceChoice">
      <button class="priceCard" data-plan="month" type="button"><strong>1,99 €</strong><span>pro Monat</span></button>
      <button class="priceCard selected" data-plan="year" type="button"><b>Entwurf</b><strong>14,99 €</strong><span>pro Jahr</span></button>
    </div>
    <button id="notifyBtn" class="primaryBtn wide" style="margin-top:18px" type="button">Sag mir Bescheid, wenn es soweit ist</button></div>`;
  $('genericModal').showModal();
  document.querySelectorAll('.priceCard').forEach(b => b.onclick = () => {
    document.querySelectorAll('.priceCard').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
  });
  $('notifyBtn').onclick = () => showGeneric('Notiert', 'Im fertigen Produkt kannst du dich hier für den Start eintragen. Im Prototyp passiert an dieser Stelle noch nichts.');
}
function showAccount(kind) {
  showGeneric(kind === 'register' ? 'Profil erstellen' : 'Anmelden',
    'Konten sind im Prototyp noch nicht aktiv. Favoriten werden aktuell nur auf diesem Gerät gespeichert.');
}

/* ---------- Farbmodus ---------- */
function toggleTheme() {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  $('themeBtn').textContent = dark ? 'Hell' : 'Dunkel';
  write(THEME_KEY, dark ? 'dark' : 'light');
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#151012' : '#fffaf6');
}
function initTheme() {
  // Standard ist hell. Dunkel nur, wenn der Nutzer es selbst gewählt hat.
  if (read(THEME_KEY, 'light') === 'dark') document.body.classList.add('dark');
  $('themeBtn').textContent = document.body.classList.contains('dark') ? 'Hell' : 'Dunkel';
}

/* ---------- Start ---------- */
async function init() {
  $('from').value = iso(TODAY);
  initTheme();
  initConsent();
  await loadRealEvents();
  fillSelects();
  applyFilters();
  setView(state.view);

  document.querySelectorAll('.cityFilter').forEach(b => b.onclick = () => {
    const k = b.dataset.cityfilter;
    state.chips.has(k) ? state.chips.delete(k) : state.chips.add(k);
    b.classList.toggle('active', state.chips.has(k));
    applyFilters();
  });
  [['outdoorBtn', 'outdoor'], ['indoorBtn', 'indoor']].forEach(([id, val]) => $(id).onclick = () => {
    state.space = state.space === val ? null : val;
    $('outdoorBtn').classList.toggle('active', state.space === 'outdoor');
    $('indoorBtn').classList.toggle('active', state.space === 'indoor');
    applyFilters();
  });
  ['from', 'to', 'type', 'genre', 'minPrice', 'maxPrice'].forEach(id => $(id).onchange = () => applyFilters());

  $('cityShowBtn').onclick = () => applyFilters(true);
  $('cityResetBtn').onclick = resetFilters;
  $('citySearchBtn').onclick = citySearch;
  $('citySearch').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); citySearch() } };
  $('globalSearchForm').onsubmit = e => { e.preventDefault(); searchGlobal($('globalSearch').value) };
  $('sort').onchange = render;

  $('gridBtn').onclick = () => setView('grid');
  $('listBtn').onclick = () => setView('list');
  $('mapBtn').onclick = () => setView('map');
  $('enableMap').onclick = () => saveConsent(true);
  $('zoomIn').onclick = () => state.map?.zoomIn();
  $('zoomOut').onclick = () => state.map?.zoomOut();
  $('mapReset').onclick = centerMap;

  $('themeBtn').onclick = toggleTheme;
  $('loginBtn').onclick = () => showAccount('login');
  $('registerBtn').onclick = () => showAccount('register');
  $('premiumBtn').onclick = () => showPremium();
  $('savedSearchBtn').onclick = () => showPremium('Gespeicherte Suchen sind für NXTUP+ geplant: Orte, Filter und Lieblingssuchen für später sichern.');
  $('demoBarInfo').onclick = () => showGeneric('Warum Beispieldaten?',
    'NXTUP ist ein Prototyp. Die Oberfläche ist fertig, die Anbindung an echte Eventquellen kommt als nächster Schritt. Bis dahin werden die Events hier automatisch erzeugt, damit man die App realistisch bedienen kann.');

  $('discoverBtn').onclick = () => $('discover').scrollIntoView({ behavior: 'smooth' });
  $('nowBtn').onclick = () => {
    const live = events.filter(e => e.city === state.city.name && (isLive(e) || startsSoon(e)));
    const fallback = events.filter(e => e.city === state.city.name).sort((a, b) => dateObj(a) - dateObj(b)).slice(0, 6);
    setResults(live.length ? live : fallback, live.length ? ` · läuft gerade in ${state.city.name}` : ` · als nächstes in ${state.city.name}`);
    setView(state.view === 'map' ? 'grid' : state.view);
    $('resultsTop').scrollIntoView({ behavior: 'smooth' });
  };

  $('homeBtn').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  $('mobileSaved').onclick = showFavorites;
  $('mobileProfile').onclick = () => showAccount('register');
  document.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => {
    if (b.dataset.nav === 'map') { setView('map'); $('resultsTop').scrollIntoView({ behavior: 'smooth' }); return }
    $(b.dataset.nav === 'home' ? 'hero' : 'discover').scrollIntoView({ behavior: 'smooth' });
  });

  $('privacyBtn').onclick = () => showGeneric('Datenschutz',
    'NXTUP nutzt keine Werbetracker. Die Karte von OpenStreetMap und die Ortssuche werden erst nach deiner Zustimmung geladen. Favoriten und Einstellungen bleiben auf deinem Gerät. Vor einem echten Start müssen Verantwortlicher, Dienstleister und Rechtsgrundlagen ergänzt und juristisch geprüft werden.');
  $('cookieBtn').onclick = () => $('consentBanner').classList.remove('hidden');
  $('organizerBtn').onclick = () => showGeneric('Für Veranstalter',
    'Ein eigener Zugang für Veranstalter ist geplant: eigene Events einstellen, Location verwalten und Platzierungen buchen. Aktuell noch nicht verfügbar.');

  $('drawerClose').onclick = closeDrawer;
  $('necessaryConsent').onclick = () => saveConsent(false);
  $('allConsent').onclick = () => saveConsent(true);
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => $(b.dataset.close).close());

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
      closeDrawer();
      closePreview();
    }
  });
  document.addEventListener('click', e => {
    const drawer = $('eventDrawer');
    if (drawer.classList.contains('hidden')) return;
    if (drawer.contains(e.target) || e.target.closest('[data-event]') || e.target.closest('[data-inspire]')) return;
    closeDrawer();
  });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}
document.addEventListener('DOMContentLoaded', init);
