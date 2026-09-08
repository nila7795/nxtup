'use strict';

const APP_DATE = new Date();
const DAY = 86400000;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toISO = d => new Date(d).toISOString().slice(0,10);
const futureDate = days => toISO(new Date(APP_DATE.getTime()+days*DAY));
const slotFromNow = hours => {const d=new Date(APP_DATE.getTime()+hours*3600000);return {date:toISO(d),time:d.toTimeString().slice(0,5)}};
const cityHash = s => [...String(s)].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261);


const cities = [
  {name:'Karlsruhe',country:'Deutschland',lat:49.0069,lng:8.4037},
  {name:'Stuttgart',country:'Deutschland',lat:48.7758,lng:9.1829},
  {name:'Frankfurt',country:'Deutschland',lat:50.1109,lng:8.6821},
  {name:'Berlin',country:'Deutschland',lat:52.52,lng:13.405},
  {name:'Hamburg',country:'Deutschland',lat:53.5511,lng:9.9937},
  {name:'München',country:'Deutschland',lat:48.1351,lng:11.582},
  {name:'Köln',country:'Deutschland',lat:50.9375,lng:6.9603},
  {name:'Amsterdam',country:'Niederlande',lat:52.3676,lng:4.9041},
  {name:'Paris',country:'Frankreich',lat:48.8566,lng:2.3522},
  {name:'Barcelona',country:'Spanien',lat:41.3874,lng:2.1686},
  {name:'Madrid',country:'Spanien',lat:40.4168,lng:-3.7038},
  {name:'London',country:'Vereinigtes Königreich',lat:51.5072,lng:-0.1276},
  {name:'Wien',country:'Österreich',lat:48.2082,lng:16.3738},
  {name:'Prag',country:'Tschechien',lat:50.0755,lng:14.4378},
  {name:'Mailand',country:'Italien',lat:45.4642,lng:9.19},
  {name:'Ibiza',country:'Spanien',lat:38.9067,lng:1.4206},
  {name:'Rom',country:'Italien',lat:41.9028,lng:12.4964},
  {name:'Lissabon',country:'Portugal',lat:38.7223,lng:-9.1393},
  {name:'Porto',country:'Portugal',lat:41.1579,lng:-8.6291},
  {name:'Brüssel',country:'Belgien',lat:50.8503,lng:4.3517},
  {name:'Kopenhagen',country:'Dänemark',lat:55.6761,lng:12.5683},
  {name:'Stockholm',country:'Schweden',lat:59.3293,lng:18.0686},
  {name:'Oslo',country:'Norwegen',lat:59.9139,lng:10.7522},
  {name:'Helsinki',country:'Finnland',lat:60.1699,lng:24.9384},
  {name:'Warschau',country:'Polen',lat:52.2297,lng:21.0122},
  {name:'Budapest',country:'Ungarn',lat:47.4979,lng:19.0402},
  {name:'Dublin',country:'Irland',lat:53.3498,lng:-6.2603},
  {name:'Zürich',country:'Schweiz',lat:47.3769,lng:8.5417},
  {name:'Genf',country:'Schweiz',lat:46.2044,lng:6.1432},
  {name:'Athen',country:'Griechenland',lat:37.9838,lng:23.7275},
  {name:'Zagreb',country:'Kroatien',lat:45.815,lng:15.9819},
  {name:'Ljubljana',country:'Slowenien',lat:46.0569,lng:14.5058},
  {name:'Bratislava',country:'Slowakei',lat:48.1486,lng:17.1077},
  {name:'Tallinn',country:'Estland',lat:59.437,lng:24.7536},
  {name:'Riga',country:'Lettland',lat:56.9496,lng:24.1052},
  {name:'Vilnius',country:'Litauen',lat:54.6872,lng:25.2797},
  {name:'Lyon',country:'Frankreich',lat:45.764,lng:4.8357},
  {name:'Marseille',country:'Frankreich',lat:43.2965,lng:5.3698},
  {name:'Nizza',country:'Frankreich',lat:43.7102,lng:7.262},
  {name:'Valencia',country:'Spanien',lat:39.4699,lng:-0.3763},
  {name:'Sevilla',country:'Spanien',lat:37.3891,lng:-5.9845},
  {name:'Neapel',country:'Italien',lat:40.8518,lng:14.2681},
  {name:'Florenz',country:'Italien',lat:43.7696,lng:11.2558},
  {name:'Venedig',country:'Italien',lat:45.4408,lng:12.3155}
];

const eventTemplates = [
  ['City Pulse Open Air','Festival','Electronic','⚡',29,true,18],
  ['Street Food Fiesta','Food & Drink','', '🍔',0,true,0],
  ['Indie After Dark','Konzert','Indie','🎸',22,false,16],
  ['Night Shift','Party / Club','House','🎧',16,false,18],
  ['Laugh Local','Comedy','', '🎭',31,false,0],
  ['Summer Streets','Stadtfest','Live Music','🎉',0,true,0],
  ['Bass District','Festival','Techno','🔊',39,true,18],
  ['Jazz Courtyard','Konzert','Jazz','🎷',18,true,0],
  ['Family Sunday','Familie & Kinder','', '☀️',8,true,0],
  ['Design & Culture Night','Theater & Kultur','', '✦',12,false,0],
  ['Hardtechno Warehouse','Party / Club','Hardtechno','⚡',24,false,18],
  ['Local Makers Market','Markt','', '◌',0,true,0]
];

const palette = [
  ['#6f4cff','#d64793','#ff9b55'],['#ffbd43','#ff7450','#e74382'],['#1fc5a8','#3973d5','#7250d5'],['#20202a','#7238ff','#ff3f8e']
];

const cityEventCounts = {Karlsruhe:12,Stuttgart:8,Frankfurt:8,Berlin:10,Hamburg:7,München:8,Köln:8,Amsterdam:8,Paris:9,Barcelona:9,Madrid:7,London:9,Wien:8,Prag:7,Mailand:8,Ibiza:7};
let eventId=1;
const events=[];
for (const city of cities){
  const n=cityEventCounts[city.name]||6;
  for(let i=0;i<n;i++){
    const t=eventTemplates[(i+cities.indexOf(city))%eventTemplates.length];
    const p=palette[(i+cities.indexOf(city))%palette.length];
    const offset=(i*2 + cities.indexOf(city))%58 + 1;
    const latShift=((i%4)-1.5)*.018;
    const lngShift=(((i*7)%5)-2)*.022;
    events.push({
      id:eventId++,name:i===0?`${city.name} Next Up`:t[0],type:t[1],genre:t[2],parentGenre:['Techno','Hardtechno','House'].includes(t[2])?'Electronic':t[2],icon:t[3],price:t[4],outdoor:t[5],age:t[6],
      date:(i===0?slotFromNow(-1).date:i===1?slotFromNow(1).date:futureDate(offset)),time:(i===0?slotFromNow(-1).time:i===1?slotFromNow(1).time:['11:00','14:00','18:30','20:00','23:00'][i%5]),city:city.name,country:city.country,
      place:[`${city.name} City Center`,`${city.name} Kulturquartier`,`${city.name} Riverside`,`${city.name} Arena`][i%4],
      lat:city.lat+latShift,lng:city.lng+lngShift,popularity:98-((i*7)%54),added:futureDate(-((i*3)%21)),
      art:p,imageUrl:'',imageCredit:'',ticketUrl:'#',websiteUrl:'#',instagramUrl:'#',facebookUrl:'#',
      sources:['Veranstalter','Ticketshop',i%2?'Instagram':'Stadt-/Eventkalender']
    });
  }
}


function ensureCityEvents(city){
  if(events.some(e=>e.city.toLowerCase()===city.name.toLowerCase()))return;
  const seed=cityHash(city.name+'|'+city.country), count=10;
  for(let i=0;i<count;i++){
    const t=eventTemplates[(seed+i)%eventTemplates.length], p=palette[(seed+i)%palette.length];
    const a=((seed+i*17)%360)*Math.PI/180, r=.012+((seed+i*23)%45)/1000;
    const live=i===0?slotFromNow(-1):i===1?slotFromNow(1):null;
    events.push({id:eventId++,name:i===0?`${city.name} Live Pulse`:i===1?`${city.name} Next Up`:t[0],type:t[1],genre:t[2],parentGenre:['Techno','Hardtechno','House'].includes(t[2])?'Electronic':t[2],icon:t[3],price:t[4],outdoor:t[5],age:t[6],date:live?live.date:futureDate((i*3+seed)%48+2),time:live?live.time:['11:00','14:00','18:30','20:00','23:00'][i%5],city:city.name,country:city.country,place:[`${city.name} Center`,`${city.name} Riverside`,`${city.name} Culture District`,`${city.name} Arena`][i%4],lat:city.lat+Math.cos(a)*r,lng:city.lng+Math.sin(a)*r,popularity:94-((i*5)%45),added:futureDate(-((i*2)%14)),art:p,imageUrl:'',imageCredit:'',ticketUrl:'#',websiteUrl:'#',instagramUrl:'#',facebookUrl:'#',sources:['Veranstalter','Ticketshop',i%2?'Instagram':'Lokaler Eventkalender']});
  }
}

const state={
  city:{...cities[0]}, view:'map', dense:false, recommendations:true, bounds:null, userLocation:null,
  consent:{personalization:false,map:false,media:false}, map:null, mapReady:false, mapLoading:null, mapMarkers:[], language:'de', heatmap:false
};

const consentKey='nxtupConsentV1';
const favoritesKey='nxtupFavoritesV1';
const searchesKey='nxtupSavedSearchesV1';
const historyKey='nxtupSearchHistoryV1';
const themeKey='nxtupThemeV1';
const langKey='nxtupLangV1';

function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function writeJSON(key,value){localStorage.setItem(key,JSON.stringify(value))}
function favorites(){return state.consent.personalization?readJSON(favoritesKey,[]):[]}
function isFavorite(id){return favorites().includes(id)}

function initConsent(){
  const saved=readJSON(consentKey,null);
  if(saved){state.consent={...state.consent,...saved};applyConsent();}
  else $('consentBanner').classList.remove('hidden');
}
function saveConsent(next){
  state.consent={...state.consent,...next};writeJSON(consentKey,state.consent);$('consentBanner').classList.add('hidden');$('consentModal').close();applyConsent();render();
}
function applyConsent(){
  $('consentPersonalization').checked=state.consent.personalization;$('consentMap').checked=state.consent.map;$('consentMedia').checked=state.consent.media;
  if(state.consent.personalization){const t=localStorage.getItem(themeKey);if(t==='dark')document.body.classList.add('dark');const l=localStorage.getItem(langKey);if(l)state.language=l;}
  if(state.consent.map && state.view==='map') ensureMap();
}
function openConsent(){
  $('consentPersonalization').checked=state.consent.personalization;$('consentMap').checked=state.consent.map;$('consentMedia').checked=state.consent.media;$('consentModal').showModal();
}

function distanceKm(a,b){
  const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
  const q=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(q));
}
function eventDistance(e){const origin=state.userLocation||state.city;return distanceKm(origin,e)}
function selectedRadius(){const r=$('radius').value;return r==='city'||r==='map'?r:Number(r)}
function dateRange(mode){
  const now=new Date();now.setHours(0,0,0,0);const day=now.getDay();
  if(mode==='today')return[toISO(now),toISO(now)];
  if(mode==='tomorrow'){const d=new Date(now.getTime()+DAY);return[toISO(d),toISO(d)]}
  if(mode==='weekend'){const untilSat=(6-day+7)%7, sat=new Date(now.getTime()+untilSat*DAY),sun=new Date(sat.getTime()+DAY);return[toISO(sat),toISO(sun)]}
  if(mode==='nextweekend'){const untilSat=(6-day+7)%7+7,sat=new Date(now.getTime()+untilSat*DAY),sun=new Date(sat.getTime()+DAY);return[toISO(sat),toISO(sun)]}
  if(mode==='month'){const end=new Date(now.getFullYear(),now.getMonth()+1,0);return[toISO(now),toISO(end)]}
  return['',''];
}
function withinBounds(e){
  if(!state.bounds)return true;const b=state.bounds;return e.lat>=b.south&&e.lat<=b.north&&e.lng>=b.west&&e.lng<=b.east;
}
function filtered(){
  const r=selectedRadius();
  return events.filter(e=>{
    const genre=$('genre').value;
    const geoOk=r==='map'?withinBounds(e):r==='city'?e.city===state.city.name:eventDistance(e)<=r;
    const genreOk=!genre||e.genre===genre||e.parentGenre===genre;
    return geoOk&&(!$('type').value||e.type===$('type').value)&&genreOk&&(!$('from').value||e.date>=$('from').value)&&(!$('to').value||e.date<=$('to').value)&&(!$('free').checked||e.price===0)&&(!$('outdoor').checked||e.outdoor)&&(!$('indoor').checked||!e.outdoor)&&(!$('maxPrice').value||e.price<=Number($('maxPrice').value))&&(!$('startTime').value||e.time>=$('startTime').value)&&(!$('age').value||e.age<=Number($('age').value));
  });
}
function sorted(es){
  const v=$('sort').value, arr=[...es];
  if(v==='distance')arr.sort((a,b)=>eventDistance(a)-eventDistance(b));
  else if(v==='date')arr.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  else if(v==='price')arr.sort((a,b)=>a.price-b.price);
  else if(v==='popular')arr.sort((a,b)=>b.popularity-a.popularity);
  else if(v==='new')arr.sort((a,b)=>b.added.localeCompare(a.added));
  else arr.sort((a,b)=>(b.popularity-eventDistance(b))-(a.popularity-eventDistance(a)));
  return arr;
}
function dateLabel(e){return new Date(e.date+'T12:00').toLocaleDateString(state.language==='en'?'en-GB':'de-DE',{weekday:'short',day:'2-digit',month:'short'})}
function priceLabel(e){if(!e.price)return state.language==='en'?'Free':'Kostenlos';return `${e.price.toLocaleString(state.language==='en'?'en-GB':'de-DE')} €`}
function sourceImage(e){
  if(!e.imageUrl)return '';
  if(/^https?:/i.test(e.imageUrl)&&!state.consent.media)return '';
  return `<img src="${esc(e.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`;
}
function art(e){const [a,b,c]=e.art;return `<div class="eventArt" style="--art1:${a};--art2:${b};--art3:${c}">${sourceImage(e)}<div class="shade"></div><span class="eventBadge">${esc(e.icon)} ${esc(e.type)}</span></div>`}
function meta(e,compact=false){
  const km=eventDistance(e);return `<div class="meta"><span class="pill">📅 ${esc(dateLabel(e))} · ${esc(e.time)}</span><span class="pill">📍 ${km<1?'&lt;1':km.toFixed(0)} km</span><span class="pill">${esc(priceLabel(e))}</span>${compact?'':`<span class="pill">${e.outdoor?'☀️ Outdoor':'🏠 Indoor'}</span>`}</div>`;
}
function eventStatus(e){
  const start=new Date(`${e.date}T${e.time}:00`), now=new Date(), diff=start-now;
  if(diff<=0&&diff>-4*3600000)return '● LIVE NOW';
  if(diff>0&&diff<3600000)return `STARTET IN ${Math.max(1,Math.round(diff/60000))} MIN.`;
  if(e.date===toISO(now))return `HEUTE · ${e.time}`;
  return `${dateLabel(e)} · ${e.time}`;
}
function interestCount(e){return Math.max(18,Math.round(e.popularity*4.1))}
function confidence(e){return Math.min(99,84+e.sources.length*5)}
window.shareEvent=async function(id){const e=events.find(x=>x.id===id);if(!e)return;const data={title:e.name,text:`${e.name} · ${e.city} · ${dateLabel(e)} ${e.time}`,url:location.href.split('#')[0]+`#event-${id}`};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);showGeneric('Link kopiert','Der Eventlink wurde in die Zwischenablage kopiert.')}}catch{}}
window.remindEvent=function(id){if(!state.consent.personalization){openConsent();return}const r=readJSON('nxtupRemindersV1',[]);if(!r.includes(id)){r.push(id);writeJSON('nxtupRemindersV1',r)}showGeneric('Erinnerung vorgemerkt','Im Prototyp ist die Erinnerung lokal vorgemerkt. Mit Backend/PWA-Push kann NXTUP später 1 Tag, 3 Stunden oder 1 Stunde vorher benachrichtigen.')}
function card(e,where='grid'){
  const fav=isFavorite(e.id);return `<article class="eventCard ${state.dense?'compact':''}" data-id="${e.id}"><button class="saveBtn ${fav?'saved':''}" type="button" aria-label="${fav?'Aus Merkliste entfernen':'Event speichern'}" onclick="toggleFavorite(${e.id},event)">${fav?'♥':'♡'}</button><div class="statusBadge">${esc(eventStatus(e))}</div>${art(e)}<div class="cardBody"><h3>${esc(e.name)}</h3><p>${esc(e.place)} · ${esc(e.city)}</p>${meta(e,where==='split')}<p>${esc(e.genre||e.type)}${e.age?` · ${e.age}+`:''}</p><div class="eventSocial"><span>🔥 ${interestCount(e)} interessiert</span><span>·</span><span>✓ ${confidence(e)}% verifiziert</span></div><div class="cardActions"><button class="detailsBtn" type="button" onclick="openEvent(${e.id})">Details</button><button class="ctaSmall" type="button" onclick="openEvent(${e.id})">Ansehen →</button></div></div></article>`;
}
function detail(e){
  const maps=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(e.lat)}&mlon=${encodeURIComponent(e.lng)}#map=16/${encodeURIComponent(e.lat)}/${encodeURIComponent(e.lng)}`;
  return `<div class="modalContent">${art(e)}<h1>${esc(e.name)}</h1>${meta(e)}<p><strong>${esc(e.place)}, ${esc(e.city)}</strong></p><p>${esc(e.genre||e.type)} · ${e.age?`ab ${e.age}`:'für alle Altersgruppen'} · ${e.outdoor?'Outdoor':'Indoor'}</p><div class="detailQuickActions"><button onclick="toggleFavorite(${e.id},event)">♡ Merken</button><button onclick="shareEvent(${e.id})">↗ Teilen</button><button onclick="remindEvent(${e.id})">🔔 Erinnern</button></div><div class="vibeBox"><strong>👀 Get the vibe</strong><span>Eventbilder, Veranstalter-Medien und erlaubte Social-Quellen werden hier gebündelt.</span></div><p>Dieser Eintrag zeigt die spätere NXTUP-Struktur. Echte Beschreibungen, Bilder und Quellen werden nur aus erlaubten Feeds/APIs bzw. mit geklärten Nutzungsrechten übernommen.</p><span class="confidence">✓ ${confidence(e)}% verifiziert · ${e.sources.length} Quellen abgeglichen</span><a class="primaryLink" href="${maps}" target="_blank" rel="noopener noreferrer">ROUTE / KARTE ÖFFNEN</a><div class="sourceLinks"><a href="#" onclick="return false">🎟 Tickets</a><a href="#" onclick="return false">◎ Instagram</a><a href="#" onclick="return false">f Facebook</a><a href="#" onclick="return false">🌐 Website</a></div><small class="muted">${e.sources.length} Quellen: ${e.sources.map(esc).join(' · ')}</small></div>`;
}

function renderActiveFilters(){
  const items=[];if($('type').value)items.push($('type').value);if($('genre').value)items.push($('genre').value);if($('from').value)items.push(`ab ${$('from').value}`);if($('to').value)items.push(`bis ${$('to').value}`);if($('free').checked)items.push('kostenlos');if($('outdoor').checked)items.push('Outdoor');if($('indoor').checked)items.push('Indoor');if($('maxPrice').value)items.push(`≤ ${$('maxPrice').value} €`);if($('startTime').value)items.push(`ab ${$('startTime').value}`);
  $('activeFilters').innerHTML=items.map(x=>`<span class="activeFilter">${esc(x)}</span>`).join('');
}
function renderRecommendations(es){
  if(!state.recommendations){$('recommendations').classList.add('hidden');return}$('recommendations').classList.remove('hidden');
  const weekend=dateRange('weekend'), free=es.filter(e=>!e.price).length, popular=es.filter(e=>e.popularity>80).length, nearby=es.filter(e=>eventDistance(e)<=10).length, weekendCount=es.filter(e=>e.date>=weekend[0]&&e.date<=weekend[1]).length;
  const recs=[['🔥','Trending',`${popular} beliebte Events`],['📍','In deiner Nähe',`${nearby} Events unter 10 km`],['🎉','Dieses Wochenende',`${weekendCount} Ideen`],['🆓','Kostenlos',`${free} ohne Eintritt`],['✨','Neu entdeckt',`${es.filter(e=>e.added>=futureDate(-7)).length} neue Einträge`]];
  $('recommendationRail').innerHTML=recs.map(r=>`<article class="recCard"><span>${r[0]}</span><strong>${r[1]}</strong><small>${r[2]}</small></article>`).join('');
}
function render(){
  const es=sorted(filtered());$('count').textContent=`${es.length} Event${es.length===1?'':'s'}`;$('heroCount').textContent=es.length;$('context').textContent=` rund um ${state.city.name}`;$('heroLocation').textContent=`${state.city.name.toUpperCase()} · ${$('radius').value==='city'?'STADT':$('radius').value==='map'?'KARTENAUSSCHNITT':$('radius').value+' KM'}`;
  $('cityModeTitle').textContent=state.city.name;$('cityModeCount').textContent=es.length;$('gridView').innerHTML=es.map(e=>card(e,'grid')).join('')||emptyResults();$('listView').innerHTML=es.map(e=>card(e,'list')).join('')||emptyResults();$('splitList').innerHTML=es.map(e=>card(e,'split')).join('')||emptyResults();
  renderActiveFilters();renderRecommendations(es);if(state.mapReady)renderMapMarkers(es);
}
function emptyResults(){return `<div class="emptyState"><span>⌕</span><strong>Nichts Passendes gefunden.</strong><p>Vergrößere den Radius oder entferne einen Filter.</p></div>`}

function setView(view){
  state.view=view;['mapView','gridView','listView','splitView'].forEach(id=>$(id).classList.add('hidden'));['mapBtn','gridBtn','listBtn','splitBtn'].forEach(id=>$(id).classList.remove('active'));
  const id={map:'mapView',grid:'gridView',list:'listView',split:'splitView'}[view],btn={map:'mapBtn',grid:'gridBtn',list:'listBtn',split:'splitBtn'}[view];$(id).classList.remove('hidden');$(btn).classList.add('active');
  if(view==='map'){if(state.consent.map)ensureMap();else $('mapFallback').classList.remove('hidden')}
  if(state.mapReady)setTimeout(()=>state.map.invalidateSize(),50);
}

async function ensureMap(){
  if(state.mapReady)return state.map;
  if(state.mapLoading)return state.mapLoading;
  state.mapLoading=(async()=>{
    $('mapFallback').classList.remove('hidden');$('mapFallback').querySelector('h2').textContent='Karte wird geladen …';
    try{
      await loadLeaflet();
      if(!window.L)throw new Error('Leaflet nicht geladen');
      if(state.mapReady)return state.map;
      $('mapFallback').classList.add('hidden');
      state.map=L.map('map',{zoomControl:false,attributionControl:true,dragging:true,scrollWheelZoom:true,touchZoom:true,doubleClickZoom:true,boxZoom:true,keyboard:true,worldCopyJump:true}).setView([state.city.lat,state.city.lng],12);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(state.map);
      state.map.on('moveend zoomend',()=>{const b=state.map.getBounds();state.bounds={south:b.getSouth(),north:b.getNorth(),west:b.getWest(),east:b.getEast()};if($('radius').value==='map')render();else renderMapMarkers(sorted(filtered()));});
      state.mapReady=true;render();return state.map;
    }catch(err){$('mapFallback').classList.remove('hidden');$('mapFallback').querySelector('h2').textContent='Karte konnte nicht geladen werden';$('mapFallback').querySelector('p').textContent='Die Kachel- und Listenansicht funktioniert weiterhin. Prüfe Internetverbindung oder Datenschutzeinstellung.';console.error(err);return null}
    finally{state.mapLoading=null}
  })();
  return state.mapLoading;
}
function loadLeaflet(){
  if(window.L)return Promise.resolve();
  if(document.querySelector('script[data-leaflet]'))return new Promise((res,rej)=>{const s=document.querySelector('script[data-leaflet]');s.addEventListener('load',res,{once:true});s.addEventListener('error',rej,{once:true})});
  const css=document.createElement('link');css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';css.dataset.leaflet='1';document.head.appendChild(css);
  return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';s.dataset.leaflet='1';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
}
function renderMapMarkers(es){
  if(!state.mapReady)return;state.mapMarkers.forEach(m=>m.remove());state.mapMarkers=[];
  const z=state.map.getZoom(), grid=z<8?2:z<10?.7:z<12?.2:z<14?.06:.00001, groups=new Map();
  for(const e of es){const k=`${Math.round(e.lat/grid)}:${Math.round(e.lng/grid)}`;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(e)}
  groups.forEach(g=>{
    const lat=g.reduce((s,e)=>s+e.lat,0)/g.length,lng=g.reduce((s,e)=>s+e.lng,0)/g.length;
    const html=g.length>1?`<div class="clusterBubble">${g.length}</div>`:`<div class="markerBubble">${g[0].icon}</div>`;
    const m=L.marker([lat,lng],{icon:L.divIcon({html,className:'nxtupMarker',iconSize:[48,48],iconAnchor:[24,24]})}).addTo(state.map);
    m.on('click',()=>g.length>1?state.map.setView([lat,lng],Math.min(18,z+2)):preview(g[0].id));state.mapMarkers.push(m);
  });
}
function centerMap(){if(state.mapReady)state.map.setView([state.city.lat,state.city.lng],12)}

async function chooseCity(query){
  const q=query.trim();if(!q)return;
  const local=cities.find(c=>c.name.toLowerCase()===q.toLowerCase()||`${c.name}, ${c.country}`.toLowerCase()===q.toLowerCase());
  if(local){state.city={...local};ensureCityEvents(state.city);$('place').value=local.name;if(state.consent.map){await ensureMap();state.map?.setView([local.lat,local.lng],12)}recordSearch(local.name);render();return}
  if(!state.consent.map){showGeneric('Externe Ortssuche','Für unbekannte Städte benötigt NXTUP den externen Geocoding-Dienst. Aktiviere dafür „Externe Karte“ in den Datenschutzeinstellungen. Die vorbereiteten Demo-Städte funktionieren ohne externen Dienst.',`<button class="ctaSmall" onclick="openConsent()">Einstellungen öffnen</button>`);return}
  try{
    const cache=readJSON('nxtupGeoCacheV1',{});let result=cache[q.toLowerCase()];
    if(!result){
      const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`;const r=await fetch(url,{headers:{'Accept-Language':state.language==='en'?'en':'de'}});const data=await r.json();if(!data.length)throw new Error('not found');result={name:data[0].display_name.split(',')[0],country:data[0].address?.country||'',lat:Number(data[0].lat),lng:Number(data[0].lon)};cache[q.toLowerCase()]=result;writeJSON('nxtupGeoCacheV1',cache);
    }
    state.city=result;ensureCityEvents(result);$('place').value=result.name;await ensureMap();if(state.mapReady)state.map.setView([result.lat,result.lng],12);recordSearch(result.name);render();
  }catch{showGeneric('Ort nicht gefunden','Versuche eine Stadt, einen Ort oder eine PLZ. Für den Prototyp sind mehrere europäische Städte direkt vorbereitet.');}
}
function recordSearch(q){if(!state.consent.personalization)return;const h=readJSON(historyKey,[]).filter(x=>x!==q);h.unshift(q);writeJSON(historyKey,h.slice(0,8))}

window.preview=function(id){const e=events.find(x=>x.id===id);if(!e)return;$('preview').classList.remove('empty');$('preview').innerHTML=`<button id="closePreviewDynamic" class="closePanel" type="button" aria-label="Vorschau schließen">×</button>${card(e,'preview')}`;$('closePreviewDynamic').onclick=closePreview;};
function closePreview(){$('preview').classList.add('empty');$('preview').innerHTML=`<button id="closePreview" class="closePanel" type="button" aria-label="Vorschau schließen">×</button><div class="emptyState"><span>↗</span><strong>Pick your next move.</strong><p>Wähle einen Pin oder ein Event aus.</p></div>`;$('closePreview').onclick=closePreview}
window.openEvent=function(id){const e=events.find(x=>x.id===id);if(!e)return;$('modalBody').innerHTML=detail(e);$('eventModal').showModal();history.pushState({nxtupModal:true},'','#event-'+id)};
window.toggleFavorite=function(id,ev){ev?.stopPropagation();if(!state.consent.personalization){openConsent();return}let f=favorites();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];writeJSON(favoritesKey,f);render();};
window.openConsent=openConsent;
function showGeneric(title,text,extra=''){$('genericBody').innerHTML=`<div class="modalContent"><p class="kicker">NXTUP</p><h1>${esc(title)}</h1><p>${text}</p>${extra}</div>`;$('genericModal').showModal()}

function saveSearch(){
  if(!state.consent.personalization){openConsent();return}
  const data={name:`${state.city.name} · ${$('genre').value||$('type').value||'Alle Events'}`,city:state.city,type:$('type').value,genre:$('genre').value,radius:$('radius').value,from:$('from').value,to:$('to').value,free:$('free').checked,outdoor:$('outdoor').checked,indoor:$('indoor').checked,maxPrice:$('maxPrice').value,startTime:$('startTime').value};const s=readJSON(searchesKey,[]);s.unshift(data);writeJSON(searchesKey,s.slice(0,10));showGeneric('Suche gespeichert','Diese Suche ist nur lokal auf diesem Gerät gespeichert. Sobald später Accounts kommen, kann sie geräteübergreifend synchronisiert werden.');
}
function showSavedSearches(){
  if(!state.consent.personalization){openConsent();return}const s=readJSON(searchesKey,[]);if(!s.length){showGeneric('Noch keine gespeicherten Suchen','Stelle deine Filter ein und wähle „Suche speichern“.');return}
  $('genericBody').innerHTML=`<div class="modalContent"><p class="kicker">GESPEICHERT</p><h1>Deine Suchen</h1>${s.map((x,i)=>`<button class="detailsBtn" style="width:100%;margin:6px 0;text-align:left" onclick="loadSearch(${i})">${esc(x.name)}</button>`).join('')}</div>`;$('genericModal').showModal();
}
window.loadSearch=function(i){const x=readJSON(searchesKey,[])[i];if(!x)return;state.city=x.city;$('place').value=x.city.name;['type','genre','radius','from','to','maxPrice','startTime'].forEach(k=>$(k).value=x[k]??'');['free','outdoor','indoor'].forEach(k=>$(k).checked=!!x[k]);$('genericModal').close();centerMap();render()};
function showFavorites(){
  if(!state.consent.personalization){openConsent();return}const ids=favorites(),es=events.filter(e=>ids.includes(e.id));$('genericBody').innerHTML=`<div class="modalContent"><p class="kicker">MERKLISTE</p><h1>Gespeicherte Events</h1><div class="eventGrid" style="padding:0;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${es.map(e=>card(e)).join('')||emptyResults()}</div></div>`;$('genericModal').showModal();
}
function showPrivacy(){
  $('genericBody').innerHTML=`<div class="modalContent"><p class="kicker">DATENSCHUTZ</p><h1>Datenschutz im Prototyp</h1><p><strong>Privacy by Default:</strong> NXTUP verwendet in diesem Prototyp keine Analytics- oder Werbetracker.</p><p><strong>Lokale Personalisierung:</strong> Nur nach Einwilligung werden Favoriten, Suchverlauf, gespeicherte Suchen, Sprache und Darstellung in deinem Browser gespeichert.</p><p><strong>Externe Karte:</strong> Nur nach Einwilligung werden Leaflet-Dateien von jsDelivr sowie Kartenkacheln und bei manueller Ortssuche Geocoding-Daten von OpenStreetMap/Nominatim abgerufen. Dabei können IP-Adresse, Browserdaten und die angefragte Region an externe Anbieter übertragen werden.</p><p><strong>Externe Eventbilder:</strong> Externe Bild-URLs werden nur nach Einwilligung geladen. Für die spätere Produktivversion sollten lizenzierte Bilder möglichst auf der eigenen Infrastruktur gehostet werden.</p><p><strong>Standort:</strong> Der Browser fragt separat nach deiner Erlaubnis. Der Standort wird im Prototyp nicht an NXTUP-Server gespeichert.</p><p><strong>Verantwortlicher:</strong> [Vor Veröffentlichung Name/Firma, Anschrift und Kontakt ergänzen.]</p><p class="muted">Dieser Text ist eine technische Vorlage und keine Rechtsberatung. Vor kommerzieller Veröffentlichung ist eine rechtliche Prüfung erforderlich.</p><button class="ctaSmall" onclick="openConsent()">Datenschutzeinstellungen</button></div>`;$('genericModal').showModal();
}
function organizerDemo(){showGeneric('Für Veranstalter','Später können Veranstalter ein automatisch gefundenes Event beanspruchen, Quellen verknüpfen, Bilder/Details ergänzen und Änderungen oder Absagen melden. Im Prototyp bleibt der Bereich bewusst ohne Backend.',`<button class="ctaSmall" onclick="showGeneric('Event beanspruchen','Demo: In der Produktivversion startet hier die Verifizierung des Veranstalters.')">Event beanspruchen</button>`)}
window.showGeneric=showGeneric;

function setQuickDate(mode,btn){document.querySelectorAll('[data-date]').forEach(b=>b.classList.remove('active'));btn?.classList.add('active');const [a,b]=dateRange(mode);$('from').value=a;$('to').value=b;render()}
function resetFilters(){['type','genre','to','maxPrice','startTime','age'].forEach(id=>$(id).value='');['free','outdoor','indoor'].forEach(id=>$(id).checked=false);$('radius').value='50';$('from').value=toISO(APP_DATE);document.querySelectorAll('[data-date]').forEach(b=>b.classList.remove('active'));state.bounds=null;render()}

function setupSelects(){
  [...new Set(events.map(e=>e.type))].sort().forEach(v=>$('type').add(new Option(v,v)));
  const genres=['Electronic','Techno','Hardtechno','House','Indie','Jazz','Live Music'];genres.forEach(v=>$('genre').add(new Option(v,v)));
  cities.forEach(c=>{const o=document.createElement('option');o.value=c.name;o.label=`${c.name}, ${c.country}`;$('citySuggestions').appendChild(o)});
}
function updateTheme(){document.body.classList.toggle('dark');if(state.consent.personalization)localStorage.setItem(themeKey,document.body.classList.contains('dark')?'dark':'light');if(state.mapReady)setTimeout(()=>state.map.invalidateSize(),30)}
function toggleLanguage(){state.language=state.language==='de'?'en':'de';$('language').textContent=state.language.toUpperCase();if(state.consent.personalization)localStorage.setItem(langKey,state.language);$('place').placeholder=state.language==='en'?'City, place or postcode in Europe':'Stadt, Ort oder PLZ in Europa';render()}

function applyCityFilter(kind){
  resetFilters();
  if(kind==='today')setQuickDate('today');
  if(kind==='weekend')setQuickDate('weekend');
  if(kind==='free')$('free').checked=true;
  if(kind==='nightlife')$('type').value='Party / Club';
  if(kind==='food')$('type').value='Food & Drink';
  if(kind==='culture')$('type').value='Theater & Kultur';
  if(kind==='trending')$('sort').value='popular';
  render();document.querySelector('.toolbar').scrollIntoView({behavior:'smooth'});
}
function surpriseMe(){const es=sorted(filtered());if(!es.length){showGeneric('Heute kein Match','Lockere einen Filter oder vergrößere den Radius.');return}const pool=es.slice(0,Math.min(8,es.length)),e=pool[Math.floor(Math.random()*pool.length)];openEvent(e.id)}
function weekendPlan(){const [a,b]=dateRange('weekend'),es=events.filter(e=>eventDistance(e)<=50&&e.date>=a&&e.date<=b).sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time));const picks=[];for(const e of es){if(!picks.some(x=>x.date===e.date))picks.push(e);if(picks.length===3)break}const html=picks.length?picks.map(e=>`<button class="detailsBtn" style="display:block;width:100%;text-align:left;margin:8px 0" onclick="openEvent(${e.id})">${esc(dateLabel(e))} · ${esc(e.time)} — ${esc(e.name)}</button>`).join(''):'<p>Für dieses Wochenende gibt es mit den Demo-Daten noch keinen passenden Plan.</p>';showGeneric(`Dein Wochenende in ${state.city.name}`,'Drei einfache Ideen, die du direkt öffnen und merken kannst.',html)}
function toggleHeatmap(on){state.heatmap=on;$('heatMode').classList.toggle('active',on);$('pinsMode').classList.toggle('active',!on);$('heatLegend').classList.toggle('hidden',!on);if(state.mapReady)renderMapMarkers(sorted(filtered()))}

function openQuickDiscover(){
  $('genericBody').innerHTML=`<div class="modalContent"><p class="kicker">QUICK DISCOVER</p><h1>Find what’s next.</h1><p>Wie möchtest du gerade entdecken?</p><div class="quickDiscoverGrid"><button onclick="openLiveSearch()"><span>⚡</span>Was geht jetzt?</button><button onclick="surpriseMe()"><span>🎲</span>Überrasch mich</button><button onclick="quickWeekend()"><span>🎉</span>Dieses Wochenende</button><button onclick="quickNearby()"><span>📍</span>In meiner Nähe</button><button onclick="quickCity()"><span>🌍</span>Andere Stadt entdecken</button><button onclick="quickMap()"><span>🗺</span>Auf der Karte suchen</button></div></div>`;
  $('genericModal').showModal();
}
window.openQuickDiscover=openQuickDiscover;
function liveEvents(){const now=new Date(), until=new Date(now.getTime()+6*3600000);return sorted(events.filter(e=>{const d=new Date(`${e.date}T${e.time}:00`);return eventDistance(e)<=50&&d>=new Date(now.getTime()-4*3600000)&&d<=until}))}
function renderLiveResults(mode='list'){
  const es=liveEvents();const target=$('liveResults');if(!target)return;
  if(mode==='map'){target.innerHTML=`<div class="liveMapHint"><strong>🗺 Live-Karte</strong><p>${es.length} laufende oder bald startende Events rund um ${esc(state.city.name)}. Öffne die Hauptkarte, um sie frei zu verschieben und zu zoomen.</p><button class="ctaSmall" id="liveOpenMap">Karte öffnen →</button></div>`;$('liveOpenMap').onclick=()=>{$('genericModal').close();setView('map');document.querySelector('.toolbar').scrollIntoView({behavior:'smooth'});if(state.consent.map)ensureMap();};return}
  target.innerHTML=es.length?es.map(e=>`<button class="liveResult" type="button" onclick="openEvent(${e.id})"><span class="liveResultIcon">${esc(e.icon)}</span><span><strong>${esc(e.name)}</strong><small>${esc(eventStatus(e))} · ${esc(e.place)} · ${eventDistance(e).toFixed(1)} km</small></span><b>→</b></button>`).join(''):`<div class="liveMapHint">Gerade nichts Passendes in 50 km. Suche einen anderen Ort oder nutze die Karte.</div>`;
}
window.openLiveSearch=function(){
  $('genericBody').innerHTML=`<div class="liveSearch"><div class="liveSearchHead"><div><p class="kicker">LIVE NOW</p><h1>Was geht jetzt?</h1><p>Ort eingeben oder deinen Standort verwenden.</p></div><span class="statusBadge">● LIVE</span></div><form id="liveCityForm" class="liveLocationRow"><input id="liveCityInput" value="${esc(state.city.name)}" placeholder="Stadt, Ort oder PLZ in Europa"><button class="ctaSmall" type="submit">Suchen</button><button id="liveLocate" class="ghostBtn" type="button">◎ Standort</button></form><div class="liveTabs"><button id="liveListTab" class="active" type="button">Liste</button><button id="liveMapTab" type="button">Karte</button></div><div id="liveResults" class="liveResults"></div></div>`;
  $('genericModal').showModal();renderLiveResults('list');
  $('liveCityForm').onsubmit=async e=>{e.preventDefault();await chooseCity($('liveCityInput').value);$('liveCityInput').value=state.city.name;renderLiveResults('list')};
  $('liveLocate').onclick=()=>locateUser(true);
  $('liveListTab').onclick=()=>{$('liveListTab').classList.add('active');$('liveMapTab').classList.remove('active');renderLiveResults('list')};
  $('liveMapTab').onclick=()=>{$('liveMapTab').classList.add('active');$('liveListTab').classList.remove('active');renderLiveResults('map')};
};
function quickWeekend(){$('genericModal').close();setQuickDate('weekend');document.querySelector('.toolbar').scrollIntoView({behavior:'smooth'})}window.quickWeekend=quickWeekend;
function quickNearby(){$('genericModal').close();locateUser(false)}window.quickNearby=quickNearby;
function quickCity(){$('genericModal').close();$('place').focus();window.scrollTo({top:0,behavior:'smooth'})}window.quickCity=quickCity;
function quickMap(){$('genericModal').close();setView('map');document.querySelector('.toolbar').scrollIntoView({behavior:'smooth'});if(state.consent.map)ensureMap()}window.quickMap=quickMap;
function showAccount(){showGeneric('NXTUP Account','Im Prototyp ist noch keine Datenbank verbunden. Später kannst du hier ein Profil erstellen, dich anmelden und Favoriten, Suchanfragen, Erinnerungen und gefolgte Locations geräteübergreifend synchronisieren.',`<div class="quickDiscoverGrid"><button onclick="showGeneric('Profil erstellen','Demo: Registrierung wird mit der Backend-Stufe aktiviert.')"><span>＋</span>Profil erstellen</button><button onclick="showGeneric('Anmelden','Demo: Login wird mit der Backend-Stufe aktiviert.')"><span>→</span>Anmelden</button></div>`)}
function locateUser(fromLive=false){if(!navigator.geolocation){showGeneric('Standort nicht verfügbar','Dein Browser unterstützt die Standortfunktion nicht.');return}navigator.geolocation.getCurrentPosition(async pos=>{state.userLocation={lat:pos.coords.latitude,lng:pos.coords.longitude};state.city={name:'In deiner Nähe',country:'',lat:pos.coords.latitude,lng:pos.coords.longitude};ensureCityEvents(state.city);$('place').value='Mein Standort';if(state.consent.map){await ensureMap();state.map?.setView([state.userLocation.lat,state.userLocation.lng],13)}render();if(fromLive&&$('genericModal').open){const inp=$('liveCityInput');if(inp)inp.value='Mein Standort';renderLiveResults('list')}},()=>showGeneric('Standort nicht freigegeben','Du kannst NXTUP vollständig über die freie Stadtsuche verwenden.'))}

function bind(){
  ['type','genre','radius','from','to','free','outdoor','indoor','maxPrice','startTime','age','sort'].forEach(id=>$(id).addEventListener('input',render));
  $('citySearch').addEventListener('submit',e=>{e.preventDefault();chooseCity($('place').value)});
  document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>setQuickDate(b.dataset.date,b));
  $('more').onclick=()=>$('morePanel').classList.remove('hidden');$('closeFilters').onclick=()=>$('morePanel').classList.add('hidden');$('applyFilters').onclick=()=>{$('morePanel').classList.add('hidden');render()};$('reset').onclick=resetFilters;
  $('mapBtn').onclick=()=>setView('map');$('gridBtn').onclick=()=>setView('grid');$('listBtn').onclick=()=>setView('list');$('splitBtn').onclick=()=>setView('split');$('densityBtn').onclick=()=>{state.dense=!state.dense;document.body.classList.toggle('dense',state.dense);$('densityBtn').setAttribute('aria-pressed',String(state.dense));$('densityBtn').textContent=state.dense?'Groß':'Kompakt'};
  $('theme').onclick=updateTheme;$('language').onclick=toggleLanguage;
  $('now').onclick=openLiveSearch;$('heroDiscover').onclick=openQuickDiscover;$('accountBtn').onclick=showAccount;
  $('toggleRecommendations').onclick=()=>{state.recommendations=!state.recommendations;$('toggleRecommendations').textContent=state.recommendations?'Empfehlungen ausblenden':'Empfehlungen anzeigen';render()};
  $('enableMap').onclick=()=>saveConsent({map:true});
  $('zoomIn').onclick=()=>state.mapReady&&state.map.zoomIn();$('zoomOut').onclick=()=>state.mapReady&&state.map.zoomOut();$('resetMap').onclick=centerMap;$('fullscreenMap').onclick=()=>{const el=$('map').parentElement;if(!document.fullscreenElement)el.requestFullscreen?.();else document.exitFullscreen?.()};$('searchMapArea').onclick=()=>{if(!state.mapReady)return;const b=state.map.getBounds();state.bounds={south:b.getSouth(),north:b.getNorth(),west:b.getWest(),east:b.getEast()};$('radius').value='map';render()};
  $('locate').onclick=()=>locateUser(false);$('mapLocate').onclick=()=>locateUser(false);
  $('closePreview').onclick=closePreview;$('closeModal').onclick=()=>{if($('eventModal').open)$('eventModal').close()};$('closeGeneric').onclick=()=>$('genericModal').close();$('closeConsent').onclick=()=>$('consentModal').close();
  [$('eventModal'),$('genericModal'),$('consentModal')].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
  window.addEventListener('popstate',()=>{if($('eventModal').open)$('eventModal').close()});
  let y0=null;$('preview').addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});$('preview').addEventListener('touchend',e=>{if(y0!==null&&e.changedTouches[0].clientY-y0>80)closePreview();y0=null},{passive:true});
  $('saveSearchBtn').onclick=saveSearch;$('savedSearchesBtn').onclick=showSavedSearches;$('saved').onclick=showFavorites;$('profile').onclick=showAccount;$('navSearch').onclick=()=>document.querySelector('.discoveryShell').scrollIntoView({behavior:'smooth'});
  $('cityMapBtn').onclick=()=>setView('map');document.querySelectorAll('[data-cityfilter]').forEach(b=>b.onclick=()=>applyCityFilter(b.dataset.cityfilter));$('surpriseBtn').onclick=surpriseMe;$('weekendPlanBtn').onclick=weekendPlan;$('navNow').onclick=()=>$('now').click();$('pinsMode').onclick=()=>toggleHeatmap(false);$('heatMode').onclick=()=>toggleHeatmap(true);
  $('privacyLink').onclick=showPrivacy;$('privacyBtnTop').onclick=openConsent;$('cookieLink').onclick=openConsent;$('organizerBtn').onclick=organizerDemo;
  $('consentSettings').onclick=openConsent;$('consentNecessary').onclick=()=>saveConsent({personalization:false,map:false,media:false});$('consentAll').onclick=()=>saveConsent({personalization:true,map:true,media:true});$('saveConsent').onclick=()=>saveConsent({personalization:$('consentPersonalization').checked,map:$('consentMap').checked,media:$('consentMedia').checked});$('acceptAllModal').onclick=()=>saveConsent({personalization:true,map:true,media:true});
}

function init(){
  setupSelects();$('from').value=toISO(APP_DATE);$('year').textContent=APP_DATE.getFullYear();bind();initConsent();$('language').textContent=state.language.toUpperCase();render();setView('map');
  if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
}
init();
