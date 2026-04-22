import { useState, useEffect, useRef } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
var SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
var SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
var supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Helper — only calls Supabase if client is configured
function sb(fn) { if(supabase) return fn(supabase); return Promise.resolve(null); }
function fmt(n){ return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,","); }
function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function genId(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
function mkPrice(r){ var m=RMAP[r]; return Math.floor(rand(m.pMin,m.pMax)*(1+(Math.random()-0.5)*0.3)); }
var TC={
  // NFL — all 32 teams
  Chiefs:["#E31837","#FFB81C"],Cowboys:["#003594","#869397"],Eagles:["#004C54","#A5ACAF"],
  "49ers":["#AA0000","#B3995D"],Ravens:["#241773","#9E7C0C"],Bills:["#00338D","#C60C30"],
  Dolphins:["#008E97","#FC4C02"],Bengals:["#FB4F14","#000"],Lions:["#0076B6","#B0B7BC"],
  Packers:["#203731","#FFB612"],Bears:["#0B162A","#C83803"],Vikings:["#4F2683","#FFC62F"],
  Giants:["#0B2265","#A71930"],Jets:["#125740","#000"],Patriots:["#002244","#C60C30"],
  Steelers:["#FFB612","#101820"],Broncos:["#FB4F14","#002244"],Raiders:["#000","#A5ACAF"],
  Chargers:["#0080C6","#FFC20E"],Seahawks:["#002244","#69BE28"],
  Titans:["#0C2340","#4B92DB"],Colts:["#002C5F","#A2AAAD"],Jaguars:["#006778","#D7A22A"],
  Texans:["#03202F","#A71930"],Browns:["#311D00","#FF3C00"],Panthers:["#0085CA","#101820"],
  Saints:["#D3BC8D","#101820"],Buccaneers:["#D50A0A","#FF7900"],Falcons:["#A71930","#000"],
  Rams:["#003594","#FFA300"],Cardinals:["#97233F","#FFB612"],Washington:["#773141","#FFB612"],
  // NBA — all 30 teams
  Lakers:["#552583","#FDB927"],Celtics:["#007A33","#BA9653"],Warriors:["#1D428A","#FFC72C"],
  Bucks:["#00471B","#EEE1C6"],Nuggets:["#0E2240","#FEC524"],Heat:["#98002E","#F9A01B"],
  Suns:["#1D1160","#E56020"],Clippers:["#C8102E","#1D428A"],"76ers":["#006BB6","#ED174C"],
  Nets:["#000","#FFF"],Bulls:["#CE1141","#000"],Knicks:["#006BB6","#F58426"],
  Mavericks:["#00538C","#002F6C"],Grizzlies:["#5D76A9","#12173F"],Pelicans:["#0C2340","#C8102E"],
  Hawks:["#E03A3E","#C1D32F"],Raptors:["#CE1141","#000"],Blazers:["#E03A3E","#000"],
  Jazz:["#002B5C","#00471B"],Spurs:["#C4CED4","#000"],
  Timberwolves:["#0C2340","#236192"],Thunder:["#007AC1","#EF3B24"],Kings:["#5A2D81","#63727A"],
  Pacers:["#002D62","#FDBB30"],Hornets:["#1D1160","#00788C"],Wizards:["#002B5C","#E31837"],
  Pistons:["#C8102E","#1D428A"],Magic:["#0077C0","#000"],Cavaliers:["#860038","#FDBB30"],
  // MLB — all 30 teams
  Yankees:["#003087","#FFF"],Dodgers:["#005A9C","#EF3E42"],"Red Sox":["#BD3039","#0C2340"],
  Cubs:["#0E3386","#CC3433"],Cardinals:["#C41E3A","#0C2340"],
  Braves:["#CE1141","#13274F"],Astros:["#002D62","#EB6E1F"],Mets:["#002D72","#FF5910"],
  Phillies:["#E81828","#002D72"],"Blue Jays":["#134A8E","#1D2D5C"],Brewers:["#FFC52F","#12284B"],
  Padres:["#2F241D","#FFC425"],Mariners:["#0C2C56","#005C5C"],Rangers:["#003278","#C0111F"],
  Tigers:["#0C2340","#FA4616"],Twins:["#002B5C","#D31145"],"White Sox":["#27251F","#C4CED4"],
  Royals:["#004687","#BD9B60"],Orioles:["#DF4601","#000"],Rays:["#092C5C","#8FBCE6"],
  Guardians:["#00385D","#E31937"],Angels:["#BA0021","#003263"],Athletics:["#003831","#EFB21E"],
  Pirates:["#27251F","#FDB827"],Rockies:["#33006F","#C4CED4"],Diamondbacks:["#A71930","#E3D4AD"],
  Reds:["#C6011F","#000"],Marlins:["#00A3E0","#FF6600"],Nationals:["#AB0003","#14225A"],
  "SF Giants":["#FD5A1E","#27251F"],
  // MLS — all 29 active teams
  "LA Galaxy":["#00245D","#FFD700"],LAFC:["#C39E6D","#000"],"Atlanta United":["#80000A","#221F1F"],
  "Seattle Sounders":["#5D9741","#004C97"],"Portland Timbers":["#004812","#EBBA00"],
  "NYC FC":["#6CACE4","#003DA5"],"Inter Miami":["#F7B5CD","#231F20"],"Red Bulls":["#ED1F24","#23286B"],
  "Chicago Fire":["#9D2235","#6CADDF"],"Columbus Crew":["#FEDA00","#000"],
  "Toronto FC":["#B81137","#313F6A"],Montreal:["#003DA5","#CF0A2C"],
  Revolution:["#CE0E2D","#0A2240"],"DC United":["#000","#EF3E42"],
  "Orlando City":["#612B9B","#FDE192"],"FC Dallas":["#BF0D3E","#000"],
  "Houston Dynamo":["#F6871F","#002B5C"],"Colorado Rapids":["#960A2C","#9DC2EA"],
  "Real Salt Lake":["#B30838","#013A81"],"Minnesota United":["#8CD2F4","#231F20"],
  "Sporting KC":["#93B2D4","#002F65"],Vancouver:["#009BC8","#96D3E6"],
  "San Jose":["#0D4C86","#C8E7F5"],"Philadelphia Union":["#071B2C","#B19B69"],
  Nashville:["#EDF05B","#002F65"],"FC Cincinnati":["#F05323","#263B80"],
  "Austin FC":["#00B140","#000"],"Charlotte FC":["#1A85C8","#0D1117"],
  "St. Louis City":["#C8102E","#003087"],
  // College — top 30 programs
  Alabama:["#9E1B32","#828A8F"],"Ohio State":["#BB0000","#aabbdd"],Georgia:["#BA0C2F","#000"],
  Michigan:["#00274C","#FFCB05"],LSU:["#461D7C","#FDD023"],Clemson:["#F56600","#522D80"],
  Oklahoma:["#841617","#FDF9D8"],"Notre Dame":["#0C2340","#AE9142"],USC:["#9D2235","#FFCC00"],
  Texas:["#BF5700","#000"],"Penn State":["#041E42","#FFF"],Florida:["#0021A5","#FA4616"],
  Tennessee:["#FF8200","#58595B"],Oregon:["#154733","#FEE123"],Auburn:["#0C2340","#E87722"],
  Miami:["#F47321","#005030"],Nebraska:["#E41C38","#000"],Iowa:["#FFCD00","#000"],
  Wisconsin:["#C5050C","#0479A8"],Arkansas:["#9D2235","#000"],
  "Texas A&M":["#500000","#867141"],"Ole Miss":["#CE1126","#14213D"],
  "North Carolina":["#7BAFD4","#13294B"],Duke:["#003087","#aabbdd"],
  "Florida State":["#782F40","#CEB888"],Kentucky:["#0033A0","#FFF"],
  "South Carolina":["#73000A","#000"],"Mississippi State":["#660000","#aabbdd"],
  "Oklahoma State":["#FF7300","#000"],"Baylor":["#003015","#FFB81C"],
};
function getColors(t){ return TC[t]||["#8899bb","#556"]; }
function teamCode(t){
  var CODES={
    // NFL
    "Chiefs":"KC","Eagles":"PHI","Cowboys":"DAL","49ers":"SF","Ravens":"BAL",
    "Bills":"BUF","Dolphins":"MIA","Bengals":"CIN","Lions":"DET","Packers":"GB",
    "Bears":"CHI","Vikings":"MIN","Giants":"NYG","Jets":"NYJ","Patriots":"NE",
    "Steelers":"PIT","Broncos":"DEN","Raiders":"LV","Chargers":"LAC","Seahawks":"SEA",
    "Titans":"TEN","Colts":"IND","Jaguars":"JAX","Texans":"HOU","Browns":"CLE",
    "Panthers":"CAR","Saints":"NO","Buccaneers":"TB","Falcons":"ATL","Rams":"LAR",
    "Cardinals":"ARI","Washington":"WAS",
    // NBA
    "Lakers":"LAL","Celtics":"BOS","Warriors":"GSW","Bucks":"MIL","Nuggets":"DEN",
    "Heat":"MIA","Suns":"PHX","Clippers":"LAC","76ers":"PHI","Nets":"BKN",
    "Bulls":"CHI","Knicks":"NYK","Mavericks":"DAL","Grizzlies":"MEM","Pelicans":"NOP",
    "Hawks":"ATL","Raptors":"TOR","Blazers":"POR","Jazz":"UTA","Spurs":"SAS",
    "Timberwolves":"MIN","Thunder":"OKC","Kings":"SAC","Pacers":"IND",
    "Hornets":"CHA","Wizards":"WAS","Pistons":"DET","Magic":"ORL","Cavaliers":"CLE",
    // MLB
    "Yankees":"NYY","Dodgers":"LAD","Red Sox":"BOS","Cubs":"CHC","Giants":"SF",
    "Cardinals":"STL","Braves":"ATL","Astros":"HOU","Mets":"NYM","Phillies":"PHI",
    "Blue Jays":"TOR","Brewers":"MIL","Padres":"SD","Mariners":"SEA","Rangers":"TEX",
    "Tigers":"DET","Twins":"MIN","White Sox":"CWS","Royals":"KC","Orioles":"BAL",
    "Rays":"TB","Guardians":"CLE","Angels":"LAA","Athletics":"OAK",
    "Pirates":"PIT","Rockies":"COL","Diamondbacks":"ARI","Reds":"CIN",
    "Marlins":"MIA","Nationals":"WSH",
    // MLS
    "LA Galaxy":"LAG","LAFC":"LAFC","Atlanta United":"ATL","Seattle Sounders":"SEA",
    "Portland Timbers":"POR","NYC FC":"NYC","Inter Miami":"MIA","Red Bulls":"RBNY",
    "Chicago Fire":"CHI","Columbus Crew":"CLB","Toronto FC":"TOR","Revolution":"NE",
    "DC United":"DC","Orlando City":"ORL","FC Dallas":"DAL","Houston Dynamo":"HOU",
    "Colorado Rapids":"COL","Real Salt Lake":"RSL","Minnesota United":"MIN",
    "Sporting KC":"SKC","Vancouver":"VAN","San Jose":"SJ","Philadelphia Union":"PHI",
    "Nashville":"NSH","FC Cincinnati":"CIN","Austin FC":"ATX","Charlotte FC":"CLT",
    "Montreal":"MTL","St. Louis City":"STL",
    // College
    "Alabama":"ALA","Ohio State":"OSU","Georgia":"UGA","Michigan":"MICH","LSU":"LSU",
    "Clemson":"CLE","Oklahoma":"OU","Notre Dame":"ND","USC":"USC","Texas":"TEX",
    "Penn State":"PSU","Florida":"UF","Tennessee":"TENN","Oregon":"ORE",
    "Auburn":"AUB","Miami":"UM","Nebraska":"NEB","Iowa":"IOWA","Wisconsin":"WIS",
    "Arkansas":"ARK",
  };
  if(CODES[t]) return CODES[t];
  var w=t.split(" ");
  return (w.length===1?t.slice(0,3):w.map(function(x){return x[0];}).join("").slice(0,4)).toUpperCase();
}
var ALL_TEAMS={
  NFL:["Chiefs","Eagles","Cowboys","49ers","Ravens","Bills","Dolphins","Bengals","Lions","Packers","Bears","Vikings","Giants","Jets","Patriots","Steelers","Broncos","Raiders","Chargers","Seahawks","Titans","Colts","Jaguars","Texans","Browns","Panthers","Saints","Buccaneers","Falcons","Rams","Cardinals","Washington"],
  NBA:["Lakers","Celtics","Warriors","Bucks","Nuggets","Heat","Suns","Clippers","76ers","Nets","Bulls","Knicks","Mavericks","Grizzlies","Pelicans","Hawks","Raptors","Blazers","Jazz","Spurs","Timberwolves","Thunder","Kings","Pacers","Hornets","Wizards","Pistons","Magic","Cavaliers"],
  MLB:["Yankees","Dodgers","Red Sox","Cubs","Cardinals","Braves","Astros","Mets","Phillies","Blue Jays","Brewers","Padres","Mariners","Rangers","Tigers","Twins","White Sox","Royals","Orioles","Rays","Guardians","Angels","Athletics","Pirates","Rockies","Diamondbacks","Reds","Marlins","Nationals","SF Giants"],
  MLS:["LA Galaxy","LAFC","Atlanta United","Seattle Sounders","Portland Timbers","NYC FC","Inter Miami","Red Bulls","Chicago Fire","Columbus Crew","Toronto FC","Montreal","Revolution","DC United","Orlando City","FC Dallas","Houston Dynamo","Colorado Rapids","Real Salt Lake","Minnesota United","Sporting KC","Vancouver","San Jose","Philadelphia Union","Nashville","FC Cincinnati","Austin FC","Charlotte FC","St. Louis City"],
  College:["Alabama","Ohio State","Georgia","Michigan","LSU","Clemson","Oklahoma","Notre Dame","USC","Texas","Penn State","Florida","Tennessee","Oregon","Auburn","Miami","Nebraska","Iowa","Wisconsin","Arkansas","Texas A&M","Ole Miss","North Carolina","Duke","Florida State","Kentucky","South Carolina","Mississippi State","Oklahoma State","Baylor"],
};
var DIVISIONS={
  // NFL
  "NFC East":{sport:"NFL",teams:["Cowboys","Giants","Eagles","Washington"]},
  "NFC North":{sport:"NFL",teams:["Bears","Lions","Packers","Vikings"]},
  "NFC South":{sport:"NFL",teams:["Falcons","Panthers","Saints","Buccaneers"]},
  "NFC West":{sport:"NFL",teams:["Cardinals","Rams","49ers","Seahawks"]},
  "AFC East":{sport:"NFL",teams:["Bills","Dolphins","Patriots","Jets"]},
  "AFC North":{sport:"NFL",teams:["Ravens","Browns","Steelers","Bengals"]},
  "AFC South":{sport:"NFL",teams:["Texans","Colts","Jaguars","Titans"]},
  "AFC West":{sport:"NFL",teams:["Chiefs","Raiders","Chargers","Broncos"]},
  // NBA
  "NBA Atlantic":{sport:"NBA",teams:["Celtics","Nets","Knicks","76ers","Raptors"]},
  "NBA Central":{sport:"NBA",teams:["Bulls","Cavaliers","Pistons","Pacers","Bucks"]},
  "NBA Southeast":{sport:"NBA",teams:["Hawks","Hornets","Heat","Magic","Wizards"]},
  "NBA Northwest":{sport:"NBA",teams:["Nuggets","Timberwolves","Thunder","Blazers","Jazz"]},
  "NBA Pacific":{sport:"NBA",teams:["Warriors","Clippers","Lakers","Suns","Kings"]},
  "NBA Southwest":{sport:"NBA",teams:["Mavericks","Rockets","Grizzlies","Pelicans","Spurs"]},
  // MLB
  "AL East":{sport:"MLB",teams:["Orioles","Red Sox","Yankees","Rays","Blue Jays"]},
  "AL Central":{sport:"MLB",teams:["White Sox","Guardians","Tigers","Royals","Twins"]},
  "AL West":{sport:"MLB",teams:["Astros","Angels","Athletics","Mariners","Rangers"]},
  "NL East":{sport:"MLB",teams:["Braves","Marlins","Mets","Phillies","Nationals"]},
  "NL Central":{sport:"MLB",teams:["Cubs","Reds","Brewers","Pirates","Cardinals"]},
  "NL West":{sport:"MLB",teams:["Diamondbacks","Rockies","Dodgers","Padres","SF Giants"]},
  // MLS
  "MLS Eastern":{sport:"MLS",teams:["Atlanta United","Charlotte FC","Chicago Fire","FC Cincinnati","Columbus Crew","DC United","Inter Miami","CF Montréal","Nashville","NYC FC","Revolution","Orlando City","Philadelphia Union","Red Bulls","Toronto FC"]},
  "MLS Western":{sport:"MLS",teams:["Austin FC","Colorado Rapids","FC Dallas","Houston Dynamo","LA Galaxy","LAFC","Minnesota United","Portland Timbers","Real Salt Lake","San Jose","Seattle Sounders","Sporting KC","St. Louis City","Vancouver"]},
  // College
  "College SEC":{sport:"College",teams:["Alabama","Auburn","Georgia","LSU","Tennessee","Florida","Arkansas","Mississippi State","Ole Miss","South Carolina","Texas A&M","Kentucky"]},
  "College Big Ten":{sport:"College",teams:["Michigan","Ohio State","Penn State","Iowa","Wisconsin","Nebraska"]},
  "College Big 12":{sport:"College",teams:["Texas","Oklahoma","Baylor","Oklahoma State","Texas A&M"]},
  "College ACC":{sport:"College",teams:["Clemson","Miami","Florida State","North Carolina","Duke"]},
  "College Pac":{sport:"College",teams:["USC","Oregon","Washington"]},
  "College Ind":{sport:"College",teams:["Notre Dame","Army","BYU"]},
};
var PACK_TYPES=[
  // ── SINGLE-SPORT PACKS ──────────────────────────────────────────────────────
  {id:"nfl",    name:"NFL Field Pass",     subtitle:"4 NFL cards only",          cost:350,  cards:4,  sport:"NFL",     rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"nba",    name:"NBA Court Pass",     subtitle:"4 NBA cards only",          cost:350,  cards:4,  sport:"NBA",     rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"mlb",    name:"MLB Diamond Pass",   subtitle:"4 MLB cards only",          cost:350,  cards:4,  sport:"MLB",     rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"mls",    name:"MLS Pitch Pass",     subtitle:"4 MLS cards only",          cost:250,  cards:4,  sport:"MLS",     rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"college",name:"College Fanatics",   subtitle:"4 College cards only",      cost:250,  cards:4,  sport:"College", rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  // ── MULTI-SPORT PACKS ──────────────────────────────────────────────────────
  {id:"basic",  name:"Basic Pack",         subtitle:"5 cards, no floor",         cost:750,  cards:5,  sport:null,      rates:{Base:75,Rare:18,Elite:5,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"standard",name:"Standard Pro Case", subtitle:"5 cards across all sports", cost:1000, cards:5,  sport:null,      rates:{Base:70,Rare:20,Elite:7,Legacy:2.5,Legendary:0.4,Dynasty:0.1}, guarantee:null,     badge:null,        bundle:null},
  {id:"playoff", name:"Playoff Overdrive", subtitle:"5 cards · today's playoff teams only", cost:3000, cards:5, sport:null, rates:{Base:45,Rare:28,Elite:18,Legacy:6,Legendary:2.5,Dynasty:0.5}, guarantee:null, badge:"PLAYOFF",  bundle:null, playoffOnly:true},
  {id:"motorcity",name:"Motor City Box",   subtitle:"3 cards · 50% Pistons · 3.0× Live Boost", cost:4000, cards:3, sport:null, rates:{Base:40,Rare:28,Elite:20,Legacy:8,Legendary:3,Dynasty:1}, guarantee:null, badge:"LIVE 3.0×",bundle:null, motorCity:true},
  {id:"jumbo",   name:"Division Jumbo",    subtitle:"10 cards, better odds",     cost:3500, cards:10, sport:null,      rates:{Base:55,Rare:22,Elite:15,Legacy:5,Legendary:2.5,Dynasty:0.5},  guarantee:null,     badge:"BEST VALUE", bundle:null},
  {id:"sovereign",name:"Sovereign Vault",  subtitle:"5 Elite+ cards · Guaranteed Grade 9+", cost:50000, cards:5, sport:null, rates:{Elite:45,Legacy:30,Legendary:20,Dynasty:5}, guarantee:"Elite", badge:"SOVEREIGN", bundle:null, sovereign:true},
  // ── 4 NEW SPECIAL PACKS ────────────────────────────────────────────────────
  {id:"rivalrybox",name:"Rivalry Box",     subtitle:"12 cards · 2 rival division matchups", cost:7500, cards:12, sport:null, rates:{Base:40,Rare:25,Elite:20,Legacy:9,Legendary:5,Dynasty:1}, guarantee:"Elite", badge:"RIVALRY",   bundle:null, rivalryBox:true},
  {id:"rookierush",name:"Rookie Rush",     subtitle:"8 cards · Base+Rare only · huge volume", cost:1200, cards:8, sport:null, rates:{Base:62,Rare:38}, guarantee:null, badge:"ROOKIE",    bundle:null},
  {id:"allstar",   name:"Emmett Special",  subtitle:"6 NBA cards · Guaranteed Legacy+ · all NBA", cost:50000, cards:6, sport:"NBA",  rates:{Legacy:55,Legendary:35,Dynasty:10}, guarantee:"Legacy", badge:"EMMETT",  bundle:null, allStar:true},
  {id:"blackbox",  name:"Black Box",       subtitle:"3 mystery cards · unknown rarity until revealed", cost:2500, cards:3, sport:null, rates:{Base:20,Rare:25,Elite:25,Legacy:18,Legendary:9,Dynasty:3}, guarantee:null, badge:"MYSTERY",   bundle:null, blackBox:true},
  // ── BUNDLE BOXES ───────────────────────────────────────────────────────────
  {id:"blaster", name:"Blaster Box",       subtitle:"3 single-sport packs · 12 cards", cost:1200, cards:12, sport:null, rates:{Base:72,Rare:20,Elite:6,Legacy:1.5,Legendary:0.4,Dynasty:0.1}, guarantee:null, badge:"BUNDLE",     bundle:{type:"blaster",count:3,base:"single"}},
  {id:"megabox", name:"Mega Box",          subtitle:"6 Standard Pro Cases · 30 cards", cost:6000, cards:30, sport:null, rates:{Base:70,Rare:20,Elite:7,Legacy:2.5,Legendary:0.4,Dynasty:0.1}, guarantee:null, badge:"MEGA",       bundle:{type:"mega",count:6,base:"standard"}},
  {id:"hobbybox",name:"Hobby Box",         subtitle:"6 Division Jumbos · 60 cards",    cost:18000,cards:60, sport:null, rates:{Base:55,Rare:22,Elite:15,Legacy:5,Legendary:2.5,Dynasty:0.5},  guarantee:"Legacy", badge:"HOBBY BOX", bundle:{type:"hobby",count:6,base:"jumbo"}},
];

// ── COLLECTION CAP ───────────────────────────────────────────────────────────
var COLLECTION_CAP = 500; // hard limit — trims lowest rarity first when exceeded
function trimToLimit(cards) {
  if(cards.length <= COLLECTION_CAP) return cards;
  // Sort by rarity value (keep best cards) — Radioactive=0 (best), Base=6 (worst)
  var sorted = cards.slice().sort(function(a,b){
    return ORDER.indexOf(a.rarity) - ORDER.indexOf(b.rarity);
  });
  return sorted.slice(0, COLLECTION_CAP);
}
var RADIOACTIVE_MAX = 10;
var RADIOACTIVE_DAILY = 400; // highest yield in the game
var RADIOACTIVE_WIN   = 2500;
// Track claimed serials in Supabase. Locally we cache the count.
var _radioactiveCount = null; // null = not yet loaded

// ── PLAYOFF PACK TEAMS (April 19 matchups) ──────────────────────────────────
var PLAYOFF_TEAMS = ["Celtics","76ers","Thunder","Suns","Pistons","Magic","Avalanche","Kings"];

// ── MOTOR CITY LIVE BOOST — expires 6:30 PM ET ──────────────────────────────
function isMotorCityBoostActive() {
  var now = new Date();
  var etH = (now.getUTCHours()-4+24)%24;
  var etM = now.getUTCMinutes();
  // Active until 6:30 PM ET
  return etH < 18 || (etH===18 && etM < 30);
}

// ── WEB AUDIO ENGINE — procedural sounds, no external deps ──────────────────
var _audioCtx = null;
function getAudioCtx() {
  if(!_audioCtx) { try { _audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){} }
  return _audioCtx;
}
function playPackRip() {
  // Obsidian Rip: descending noise burst with metallic tail
  var ctx = getAudioCtx(); if(!ctx) return;
  var buf = ctx.createBuffer(1, ctx.sampleRate*0.35, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for(var i=0;i<data.length;i++){
    var t=i/ctx.sampleRate;
    data[i]=(Math.random()*2-1)*Math.exp(-t*9)*(1+Math.sin(t*800-t*t*3000)*0.3);
  }
  var src=ctx.createBufferSource(); src.buffer=buf;
  var gain=ctx.createGain(); gain.gain.setValueAtTime(0.55,ctx.currentTime);
  var filter=ctx.createBiquadFilter(); filter.type="bandpass"; filter.frequency.value=1200; filter.Q.value=0.8;
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start();
}
function playSovereignBoom() {
  // Deep cinematic bass-drop: sub rumble + high shimmer
  var ctx = getAudioCtx(); if(!ctx) return;
  // Sub bass
  var osc=ctx.createOscillator(); osc.type="sine";
  osc.frequency.setValueAtTime(80,ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30,ctx.currentTime+0.8);
  var bassGain=ctx.createGain();
  bassGain.gain.setValueAtTime(0,ctx.currentTime);
  bassGain.gain.linearRampToValueAtTime(0.9,ctx.currentTime+0.04);
  bassGain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.4);
  osc.connect(bassGain); bassGain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+1.5);
  // Gold shimmer overtone
  var osc2=ctx.createOscillator(); osc2.type="triangle";
  osc2.frequency.setValueAtTime(440,ctx.currentTime+0.1);
  osc2.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.6);
  var shimGain=ctx.createGain();
  shimGain.gain.setValueAtTime(0,ctx.currentTime+0.1);
  shimGain.gain.linearRampToValueAtTime(0.4,ctx.currentTime+0.25);
  shimGain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.2);
  osc2.connect(shimGain); shimGain.connect(ctx.destination); osc2.start(ctx.currentTime+0.1); osc2.stop(ctx.currentTime+1.5);
  // Noise burst
  var nbuf=ctx.createBuffer(1,ctx.sampleRate*0.5,ctx.sampleRate);
  var nd=nbuf.getChannelData(0);
  for(var i=0;i<nd.length;i++){var t=i/ctx.sampleRate;nd[i]=(Math.random()*2-1)*Math.exp(-t*6)*0.3;}
  var nsrc=ctx.createBufferSource(); nsrc.buffer=nbuf;
  var nf=ctx.createBiquadFilter(); nf.type="highpass"; nf.frequency.value=2000;
  var ng=ctx.createGain(); ng.gain.setValueAtTime(0.5,ctx.currentTime);
  nsrc.connect(nf); nf.connect(ng); ng.connect(ctx.destination); nsrc.start();
}
function playRevealShimmer() {
  // High-end metallic shimmer for Grade 10
  var ctx = getAudioCtx(); if(!ctx) return;
  [880,1320,1760,2200].forEach(function(freq,i){
    var osc=ctx.createOscillator(); osc.type="sine";
    osc.frequency.setValueAtTime(freq,ctx.currentTime+i*0.06);
    var g=ctx.createGain();
    g.gain.setValueAtTime(0,ctx.currentTime+i*0.06);
    g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+i*0.06+0.04);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.06+0.5);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(ctx.currentTime+i*0.06); osc.stop(ctx.currentTime+i*0.06+0.6);
  });
}
var RMAP={
  Base:       {daily:25,  win:100,  pMin:150,   pMax:500},
  Rare:       {daily:37,  win:175,  pMin:600,   pMax:1200},
  Elite:      {daily:62,  win:325,  pMin:2500,  pMax:3500},
  Legacy:     {daily:200, win:0,    pMin:8000,  pMax:12000},
  Legendary:  {daily:125, win:625,  pMin:25000, pMax:45000},
  Dynasty:    {daily:250, win:1500, pMin:100000,pMax:180000},
  Radioactive:{daily:400, win:2500, pMin:500000,pMax:999999},
};
var ORDER=["Radioactive","Dynasty","Legendary","Legacy","Elite","Rare","Base"];
var SPORT_COLORS={NFL:"#4488ff",NBA:"#ff6622",MLB:"#44cc88",MLS:"#ff4466",College:"#ffaa22"};
var RCOLORS={Base:"#aab",Rare:"#60a5fa",Elite:"#34d399",Legacy:"#f5c518",Legendary:"#f87171",Dynasty:"#e879f9",Radioactive:"#00ff44"};
function pickRarity(rates){
  var tot=Object.values(rates).reduce(function(a,b){return a+b;},0);
  var r=Math.random()*tot,cum=0;
  var keys=Object.keys(rates);
  for(var i=0;i<keys.length;i++){cum+=rates[keys[i]];if(r<cum)return keys[i];}
  return "Base";
}
function genCard(rates,forceMin,forceSport){
  var sk=forceSport?[forceSport]:Object.keys(ALL_TEAMS);
  var sport=sk[Math.floor(Math.random()*sk.length)];
  var arr=ALL_TEAMS[sport];
  var team=arr[Math.floor(Math.random()*arr.length)];
  var rarity=pickRarity(rates);
  if(forceMin){
    var o=ORDER.slice().reverse();
    if(o.indexOf(rarity)<o.indexOf(forceMin))rarity=forceMin;
  }
  // Radioactive: never rolls from genCard directly — only via tryRollRadioactive
  if(rarity==="Radioactive") rarity="Dynasty";
  var rm=RMAP[rarity];
  return {id:genId(),sport:sport,team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52};
}
// Radioactive roll: 4× harder than Dynasty (~0.025% effective)
// Checks global Supabase counter. Returns a Radioactive card or null.
function tryRollRadioactive(existingCount) {
  // Dynasty rate is ~0.1% in most packs; Radioactive is 4× harder = ~0.025%
  if(Math.random() > 0.00025) return null;
  // World limit enforced
  if(existingCount >= RADIOACTIVE_MAX) return null;
  var serial = existingCount + 1;
  var sk=Object.keys(ALL_TEAMS);
  var sport=sk[Math.floor(Math.random()*sk.length)];
  var arr=ALL_TEAMS[sport];
  var team=arr[Math.floor(Math.random()*arr.length)];
  return {
    id:genId(),sport:sport,team:team,rarity:"Radioactive",
    daily:RADIOACTIVE_DAILY,win:RADIOACTIVE_WIN,
    mp:RADIOACTIVE_DAILY*365+RADIOACTIVE_WIN*52,
    serialNumber:serial,
  };
}
function buildPack(pt,pity){
  // ── SOVEREIGN VAULT ──────────────────────────────────────────────────────────
  if(pt.sovereign){
    var cards=[];
    var eliteFloor=["Elite","Legacy","Legendary","Dynasty","Radioactive"];
    for(var si=0;si<pt.cards;si++){
      var card=genCard(pt.rates,null,null);
      for(var ri=0;ri<5&&!eliteFloor.includes(card.rarity);ri++) card=genCard(pt.rates,null,null);
      if(!eliteFloor.includes(card.rarity)) card=genCard({Elite:100},null,null);
      cards.push(card);
    }
    return cards;
  }
  // ── ALL-STAR WEEKEND: guaranteed Legacy+ NBA only ─────────────────────────────
  if(pt.allStar){
    var cards=[];
    for(var ai=0;ai<pt.cards;ai++){
      var rarity=pickRarity(pt.rates);
      var rm=RMAP[rarity];
      var team=ALL_TEAMS.NBA[Math.floor(Math.random()*ALL_TEAMS.NBA.length)];
      cards.push({id:genId(),sport:"NBA",team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52});
    }
    return cards;
  }
  // ── RIVALRY BOX: pulls from two random rival divisions ───────────────────────
  if(pt.rivalryBox){
    var cards=[];
    var divKeys=Object.keys(DIVISIONS);
    var div1=DIVISIONS[divKeys[Math.floor(Math.random()*divKeys.length)]];
    // Pick a rival division from same sport
    var sameSport=divKeys.filter(function(k){return DIVISIONS[k].sport===div1.sport&&k!==divKeys.find(function(d){return DIVISIONS[d]===div1;});});
    var div2Key=sameSport[Math.floor(Math.random()*sameSport.length)];
    var div2=DIVISIONS[div2Key]||div1;
    for(var ri2=0;ri2<pt.cards;ri2++){
      var div=ri2%2===0?div1:div2;
      var team=div.teams[Math.floor(Math.random()*div.teams.length)];
      var rarity=pickRarity(pt.rates);
      var rm=RMAP[rarity];
      cards.push({id:genId(),sport:div.sport,team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52});
    }
    return cards;
  }
  // ── PLAYOFF OVERDRIVE ─────────────────────────────────────────────────────────
  if(pt.playoffOnly){
    var cards=[];
    for(var pi=0;pi<pt.cards;pi++){
      var team=PLAYOFF_TEAMS[Math.floor(Math.random()*PLAYOFF_TEAMS.length)];
      var sport=["Avalanche"].includes(team)?"MLB":["Kings","Celtics","76ers","Thunder","Suns","Pistons","Magic"].includes(team)?"NBA":"NBA";
      var rarity=pickRarity(pt.rates);
      var rm=RMAP[rarity];
      cards.push({id:genId(),sport:sport,team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52});
    }
    return cards;
  }
  // ── MOTOR CITY BOX ────────────────────────────────────────────────────────────
  if(pt.motorCity){
    var cards=[];
    for(var mi=0;mi<pt.cards;mi++){
      var isPistons=Math.random()<0.5;
      var team=isPistons?"Pistons":ALL_TEAMS.NBA[Math.floor(Math.random()*ALL_TEAMS.NBA.length)];
      var rarity=pickRarity(pt.rates);
      var rm=RMAP[rarity];
      cards.push({id:genId(),sport:"NBA",team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52});
    }
    return cards;
  }
  // ── BUNDLE BOXES ──────────────────────────────────────────────────────────────
  if(pt.bundle){
    var cards=[];
    if(pt.bundle.type==="blaster"){
      var sports=["NFL","NBA","MLB","MLS","College"];
      for(var b=0;b<3;b++){
        var sp=sports[rand(0,sports.length-1)];
        for(var i=0;i<4;i++) cards.push(genCard(pt.rates,null,sp));
      }
    } else if(pt.bundle.type==="mega"){
      var stdPt=PACK_TYPES.find(function(p){return p.id==="standard";});
      for(var b2=0;b2<6;b2++){
        buildPack(stdPt,false).forEach(function(c){cards.push(c);});
      }
    } else if(pt.bundle.type==="hobby"){
      var jmbPt=PACK_TYPES.find(function(p){return p.id==="jumbo";});
      for(var b3=0;b3<6;b3++){
        buildPack(jmbPt,false).forEach(function(c){cards.push(c);});
      }
      var hasLeg=cards.some(function(c){return ORDER.indexOf(c.rarity)<=ORDER.indexOf("Legacy");});
      if(!hasLeg) cards[cards.length-1]=genCard(pt.rates,"Legacy",null);
    }
    return cards;
  }
  // ── REGULAR PACKS (basic, standard, jumbo, rookie rush, black box) ─────────────
  var rates=pity&&pt.id==="standard"?Object.assign({},pt.rates,{Elite:pt.rates.Elite+50}):pt.rates;
  var cards=[];
  for(var i=0;i<pt.cards;i++){
    var force=(pt.guarantee&&i===pt.cards-1&&!cards.some(function(c){return ORDER.indexOf(c.rarity)<=ORDER.indexOf(pt.guarantee);}))?pt.guarantee:null;
    cards.push(genCard(rates,force,pt.sport||null));
  }
  return cards;
}
function genListing(){
  var card=genCard({Rare:30,Elite:30,Legacy:20,Legendary:15,Dynasty:5},null,null);
  var sellers=["KingCollector","GrailHunter99","DynastyKing","WaxWizard","SlabMaster","VaultKeeper"];
  return {id:genId(),card:card,price:mkPrice(card.rarity),seller:sellers[rand(0,sellers.length-1)],trend:Math.random()>0.45?"up":"down",trendPct:rand(1,18),listedAt:Date.now()};
}
var STREAK_REWARDS=[
  {day:1,label:"200 Coins",coins:200,pack:null,icon:"🪙"},
  {day:2,label:"400 Coins",coins:400,pack:null,icon:"🪙"},
  {day:3,label:"Standard Pack",coins:0,pack:"standard",icon:"📦"},
  {day:4,label:"800 Coins",coins:800,pack:null,icon:"💰"},
  {day:5,label:"1500 Coins",coins:1500,pack:null,icon:"💎"},
  {day:6,label:"Division Jumbo",coins:0,pack:"jumbo",icon:"🎯"},
  {day:7,label:"Dynasty Chest",coins:5000,pack:"elite",icon:"👑",isDynasty:true},
];
function loadStreak(){
  try{return JSON.parse(localStorage.getItem("cd_streak")||"{}");}catch(e){return {};}
}
function saveStreak(data){
  try{localStorage.setItem("cd_streak",JSON.stringify(data));}catch(e){}
}
function loadProfile(){
  try{
    var p=JSON.parse(localStorage.getItem("cd_profile")||"{}");
    if(!p.joinDate) p.joinDate=new Date().toISOString();
    if(!p.username) p.username="Dynasty Rookie";
    if(!p.avatarColor) p.avatarColor="#f5c518";
    if(!p.avatarInitials) p.avatarInitials="ME";
    if(!p.bio) p.bio="Building my dynasty one pack at a time.";
    if(!p.pinnedIds) p.pinnedIds=[];
    if(!p.packsOpened) p.packsOpened=0;
    return p;
  }catch(e){
    return {joinDate:new Date().toISOString(),username:"Dynasty Rookie",avatarColor:"#f5c518",avatarInitials:"ME",bio:"Building my dynasty one pack at a time.",pinnedIds:[],packsOpened:0};
  }
}
function saveProfile(data){
  try{localStorage.setItem("cd_profile",JSON.stringify(data));}catch(e){}
}
function makeCard(sport,team,rarity){
  var rm=RMAP[rarity];
  return {id:genId(),sport:sport,team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52,likes:rand(0,48)};
}
// SOCIAL_PLAYERS is now loaded from Supabase — this is just a fallback empty array
var SOCIAL_PLAYERS=[];
var NOISE='url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")';
var CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800&family=Barlow:wght@400;500;600;700&family=Oswald:wght@600;700&family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@700&family=Roboto+Mono:wght@500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f0ede8;color:#111;font-family:'Barlow',sans-serif;font-size:15px;line-height:1.5}
  input,textarea,button{font-family:inherit}
  @keyframes holoShine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmerSweep{0%,40%{background-position:-200% center}70%,100%{background-position:300% center}}
  @keyframes goldPulse{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.4),0 20px 50px rgba(0,0,0,0.85)}50%{box-shadow:0 0 40px rgba(245,197,24,0.7),0 20px 50px rgba(0,0,0,0.85)}}
  @keyframes dynastyShine{0%{transform:translateX(-150%) rotate(35deg)}100%{transform:translateX(350%) rotate(35deg)}}
  @keyframes packFloat{0%,100%{transform:translateY(0) rotate(-0.5deg)}50%{transform:translateY(-12px) rotate(0.5deg)}}
  @keyframes holoSweep{0%{opacity:0;transform:translateX(-100%) skewX(-15deg)}40%{opacity:1}60%{opacity:1}100%{opacity:0;transform:translateX(300%) skewX(-15deg)}}
  @keyframes packShake{0%,100%{transform:translate(0,0) rotate(0)}15%{transform:translate(-7px,3px) rotate(-4deg)}30%{transform:translate(7px,-3px) rotate(4deg)}50%{transform:translate(-9px,4px) rotate(-5deg)}70%{transform:translate(9px,-4px) rotate(5deg)}}
  @keyframes particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
  @keyframes popIn{0%{transform:scale(0.85) translateY(20px);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes notifSlide{0%{transform:translateX(110%);opacity:0}10%{transform:translateX(0);opacity:1}80%{transform:translateX(0);opacity:1}100%{transform:translateX(110%);opacity:0}}
  @keyframes seamGlow{0%,100%{opacity:0}50%{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes textReveal{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes goldVein{0%,100%{opacity:0.2}50%{opacity:0.4}}
  @keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(245,197,24,0.4))}50%{filter:drop-shadow(0 0 50px rgba(245,197,24,0.75))}}
  @keyframes balShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes genesisPulse{0%,100%{box-shadow:0 0 30px 6px rgba(255,255,255,0.1)}50%{box-shadow:0 0 60px 14px rgba(255,255,255,0.22)}}
  @keyframes claimPulse{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.3)}50%{box-shadow:0 0 50px rgba(245,197,24,0.65)}}
  @keyframes screenJolt{0%,100%{transform:translate(0,0)}15%{transform:translate(0,10px)}30%{transform:translate(0,-6px)}50%{transform:translate(0,4px)}100%{transform:translate(0,0)}}
  @keyframes glitchFX{0%{filter:invert(0) hue-rotate(0deg)}20%{filter:invert(1) hue-rotate(90deg)}40%{filter:invert(0) hue-rotate(180deg)}100%{filter:invert(0)}}
  @keyframes radialWave{0%{width:10px;height:10px;opacity:0.9}100%{width:600px;height:600px;opacity:0}}
  @keyframes dynastyRain{0%{transform:translateY(-10px);opacity:1}100%{transform:translateY(110vh);opacity:0}}
  @keyframes inkBleed{0%{transform:translate(-50%,-50%) scale(0);opacity:0.8}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
  @keyframes hapticShake{0%,100%{transform:translate(0,0)}20%{transform:translate(-5px,0)}40%{transform:translate(5px,0)}60%{transform:translate(-3px,0)}80%{transform:translate(3px,0)}}
  @keyframes rareShimmer{0%,100%{box-shadow:0 0 10px rgba(96,165,250,0.35),0 20px 50px rgba(0,0,0,0.85)}50%{box-shadow:0 0 22px rgba(96,165,250,0.65),0 20px 50px rgba(0,0,0,0.85)}}
  @keyframes oracleTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes liveNeonPulse{0%,100%{opacity:0.7}50%{opacity:1}}
  @keyframes redZoneShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-2px)}30%{transform:translateX(2px)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}75%{transform:translateX(-1px)}90%{transform:translateX(1px)}}
  @keyframes highlightFlash{0%,100%{outline:0px solid transparent}30%{outline:3px solid #00ff50}70%{outline:3px solid #00ff50}}
  @keyframes liveBorderFlash{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes avatarGlow{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.5),0 0 60px rgba(245,197,24,0.2)}50%{box-shadow:0 0 40px rgba(245,197,24,0.85),0 0 90px rgba(245,197,24,0.4)}}
  @keyframes badgeUnlock{0%{transform:scale(0.6) rotate(-12deg);opacity:0}70%{transform:scale(1.18) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes spotlightPulse{0%,100%{opacity:0.45}50%{opacity:0.75}}
  @keyframes bentoSlide{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes showcaseFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes editModalIn{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes ringDraw{from{stroke-dashoffset:var(--full)}to{stroke-dashoffset:var(--offset)}}
  @keyframes nebulaBreath{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:0.85;transform:scale(1.05)}}
  @keyframes pulsarRed{0%{box-shadow:0 0 0 0 rgba(232,22,30,0.55)}100%{box-shadow:0 0 0 14px rgba(232,22,30,0)}}
  @keyframes twinkle{0%,100%{opacity:0.1}50%{opacity:0.9}}
  @keyframes emberRise{0%{transform:translateY(0) scale(1);opacity:0.85}100%{transform:translateY(-52px) scale(0.2);opacity:0}}
  @keyframes cosmicRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  @keyframes iconFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.1)}}
  @keyframes crownFloat{0%,100%{transform:translateY(0) scale(1) rotate(-5deg)}50%{transform:translateY(-2px) scale(1.12) rotate(5deg)}}
  @keyframes goldSmokeFade{0%{opacity:0}15%{opacity:1}70%{opacity:0.8}100%{opacity:0}}
  @keyframes goldParticleRise{0%{opacity:0;transform:translate(-50%,-50%) scale(0.2)}20%{opacity:0.9}100%{opacity:0;transform:translate(-50%,-200%) scale(1.8)}}
  @keyframes goldFlash{0%{opacity:1}100%{opacity:0}}
  @keyframes slimePulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.03)}}
  .bento-card{animation:bentoSlide 0.45s ease-out both}
  .badge-unlocked{animation:badgeUnlock 0.55s cubic-bezier(0.3,1.4,0.5,1) both}
  .showcase-card-anim{animation:showcaseFloat 4s ease-in-out infinite}
  .holo-text{background:linear-gradient(90deg,#f5c518,#ff80ff,#00eeff,#f5c518);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:holoShine 3s linear infinite}
  .shimmer-text{background:linear-gradient(90deg,#f5c518,#fff8c0,#f5c518);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:balShimmer 2.5s linear infinite}
  .gold-logo{background:linear-gradient(180deg,#fff8e1 0%,#f5c518 30%,#b8860b 60%,#f5c518 82%,#fff8e1 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:logoGlow 3s ease-in-out infinite;font-family:'Oswald',sans-serif}
  .bal-shimmer{background:linear-gradient(90deg,#f5c518 20%,#fff8c0 40%,#f5c518 60%,#fde68a 80%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:balShimmer 3s linear infinite}
  .pack-float{animation:packFloat 3s ease-in-out infinite}
  .pack-shake{animation:packShake 0.13s ease-in-out infinite}
  .seam-glow{animation:seamGlow 0.4s ease-in-out 4}
  .popup-anim{animation:popIn 0.3s cubic-bezier(0.3,1.3,0.5,1) forwards}
  .slide-up{animation:slideUp 0.4s ease-out forwards}
  .fade-in{animation:fadeIn 0.8s ease-out forwards}
  .notif{animation:notifSlide 4s ease-in-out forwards}
  .live-dot{width:8px;height:8px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite}
  .tab-btn{padding:9px 13px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;background:none;border:none;border-bottom:3px solid transparent;color:#888;white-space:nowrap;transition:color .15s,border-color .15s;flex-shrink:0}
  .tab-btn.on{color:#e8161e;border-bottom-color:#e8161e}
  .tab-btn:hover{color:#111}
  .tab-bar::-webkit-scrollbar{display:none}
  .inv-wrap{position:relative}
  .inv-wrap:hover .list-ov{opacity:1}
  .list-ov{position:absolute;inset:0;border-radius:14px;background:rgba(0,0,0,0.78);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;cursor:pointer;z-index:20}
  .mrow{background:rgba(10,10,22,0.8);border:1px solid #2a2a4a;border-radius:14px;padding:14px;transition:border-color .2s,transform .15s}
  .mrow:hover{border-color:#3a3a6a;transform:translateY(-1px)}
  .set-bar{background:#e8e8e8;border-radius:999px;height:5px;overflow:hidden;flex:1}
  .set-bar-fill{height:100%;border-radius:999px;transition:width 0.8s}
  .haptic{animation:hapticShake 0.35s ease-in-out}
  .redZone{animation:redZoneShake 0.15s ease-in-out infinite}
  .screen-jolt{animation:screenJolt 0.5s ease-out}
  /* Global readable text helpers */
  .text-muted{color:#8899bb}
  .text-dim{color:#6677aa}
  @keyframes holoShine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmerSweep{0%,40%{background-position:-200% center}70%,100%{background-position:300% center}}
  @keyframes goldPulse{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.4),0 20px 50px rgba(0,0,0,0.85)}50%{box-shadow:0 0 40px rgba(245,197,24,0.7),0 20px 50px rgba(0,0,0,0.85)}}
  @keyframes dynastyShine{0%{transform:translateX(-150%) rotate(35deg)}100%{transform:translateX(350%) rotate(35deg)}}
  @keyframes packFloat{0%,100%{transform:translateY(0) rotate(-0.5deg)}50%{transform:translateY(-12px) rotate(0.5deg)}}
  @keyframes holoSweep{0%{opacity:0;transform:translateX(-100%) skewX(-15deg)}40%{opacity:1}60%{opacity:1}100%{opacity:0;transform:translateX(300%) skewX(-15deg)}}
  @keyframes packShake{0%,100%{transform:translate(0,0) rotate(0)}15%{transform:translate(-7px,3px) rotate(-4deg)}30%{transform:translate(7px,-3px) rotate(4deg)}50%{transform:translate(-9px,4px) rotate(-5deg)}70%{transform:translate(9px,-4px) rotate(5deg)}}
  @keyframes particle{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
  @keyframes popIn{0%{transform:scale(0.85) translateY(20px);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes notifSlide{0%{transform:translateX(110%);opacity:0}10%{transform:translateX(0);opacity:1}80%{transform:translateX(0);opacity:1}100%{transform:translateX(110%);opacity:0}}
  @keyframes seamGlow{0%,100%{opacity:0}50%{opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes textReveal{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes goldVein{0%,100%{opacity:0.2}50%{opacity:0.4}}
  @keyframes logoGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(245,197,24,0.4))}50%{filter:drop-shadow(0 0 50px rgba(245,197,24,0.75))}}
  @keyframes balShimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes genesisPulse{0%,100%{box-shadow:0 0 30px 6px rgba(255,255,255,0.1)}50%{box-shadow:0 0 60px 14px rgba(255,255,255,0.22)}}
  @keyframes claimPulse{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.3)}50%{box-shadow:0 0 50px rgba(245,197,24,0.65)}}
  @keyframes screenJolt{0%,100%{transform:translate(0,0)}15%{transform:translate(0,10px)}30%{transform:translate(0,-6px)}50%{transform:translate(0,4px)}100%{transform:translate(0,0)}}
  @keyframes glitchFX{0%{filter:invert(0) hue-rotate(0deg)}20%{filter:invert(1) hue-rotate(90deg)}40%{filter:invert(0) hue-rotate(180deg)}100%{filter:invert(0)}}
  @keyframes radialWave{0%{width:10px;height:10px;opacity:0.9}100%{width:600px;height:600px;opacity:0}}
  @keyframes dynastyRain{0%{transform:translateY(-10px);opacity:1}100%{transform:translateY(110vh);opacity:0}}
  @keyframes inkBleed{0%{transform:translate(-50%,-50%) scale(0);opacity:0.8}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
  @keyframes hapticShake{0%,100%{transform:translate(0,0)}20%{transform:translate(-5px,0)}40%{transform:translate(5px,0)}60%{transform:translate(-3px,0)}80%{transform:translate(3px,0)}}
  @keyframes rareShimmer{0%,100%{box-shadow:0 0 10px rgba(96,165,250,0.35),0 20px 50px rgba(0,0,0,0.85)}50%{box-shadow:0 0 22px rgba(96,165,250,0.65),0 20px 50px rgba(0,0,0,0.85)}}
  @keyframes oracleTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes liveNeonPulse{0%,100%{opacity:0.7}50%{opacity:1}}
  @keyframes redZoneShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-2px)}30%{transform:translateX(2px)}45%{transform:translateX(-2px)}60%{transform:translateX(2px)}75%{transform:translateX(-1px)}90%{transform:translateX(1px)}}
  @keyframes highlightFlash{0%,100%{outline:0px solid transparent}30%{outline:3px solid #00ff50}70%{outline:3px solid #00ff50}}
  @keyframes liveBorderFlash{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes avatarGlow{0%,100%{box-shadow:0 0 20px rgba(245,197,24,0.5),0 0 60px rgba(245,197,24,0.2)}50%{box-shadow:0 0 40px rgba(245,197,24,0.85),0 0 90px rgba(245,197,24,0.4)}}
  @keyframes badgeUnlock{0%{transform:scale(0.6) rotate(-12deg);opacity:0}70%{transform:scale(1.18) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes spotlightPulse{0%,100%{opacity:0.45}50%{opacity:0.75}}
  @keyframes bentoSlide{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes showcaseFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes editModalIn{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes ringDraw{from{stroke-dashoffset:var(--full)}to{stroke-dashoffset:var(--offset)}}
  .bento-card{animation:bentoSlide 0.45s ease-out both}
  .badge-unlocked{animation:badgeUnlock 0.55s cubic-bezier(0.3,1.4,0.5,1) both}
  .showcase-card-anim{animation:showcaseFloat 4s ease-in-out infinite}
  .holo-text{background:linear-gradient(90deg,#f5c518,#ff80ff,#00eeff,#f5c518);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:holoShine 3s linear infinite}
  .shimmer-text{background:linear-gradient(90deg,#f5c518,#fff8c0,#f5c518);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:balShimmer 2.5s linear infinite}
  .gold-logo{background:linear-gradient(180deg,#fff8e1 0%,#f5c518 30%,#b8860b 60%,#f5c518 82%,#fff8e1 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:logoGlow 3s ease-in-out infinite;font-family:'Oswald',sans-serif}
  .bal-shimmer{color:#e8161e;font-weight:900}
  .pack-float{animation:packFloat 3s ease-in-out infinite}
  .pack-shake{animation:packShake 0.13s ease-in-out infinite}
  .seam-glow{animation:seamGlow 0.4s ease-in-out 4}
  .popup-anim{animation:popIn 0.3s cubic-bezier(0.3,1.3,0.5,1) forwards}
  .slide-up{animation:slideUp 0.4s ease-out forwards}
  .fade-in{animation:fadeIn 0.8s ease-out forwards}
  .notif{animation:notifSlide 4s ease-in-out forwards}
  .live-dot{width:8px;height:8px;border-radius:50%;background:#22cc55;animation:pulse 1.5s ease-in-out infinite}
  /* ── GRADING LAB ──────────────────────────────────────────────────────────── */
  @keyframes envelopeFlap{0%{transform:rotateX(0deg)}100%{transform:rotateX(-160deg)}}
  @keyframes cardSlideOut{0%{transform:translateY(40px) scale(0.9);opacity:0}60%{opacity:1}100%{transform:translateY(-20px) scale(1);opacity:1}}
  @keyframes lightLeak{0%{opacity:0;transform:scaleX(0)}30%{opacity:1}70%{opacity:1}100%{opacity:0;transform:scaleX(1.2)}}
  @keyframes sealPulse{0%,100%{box-shadow:0 0 12px #cc0000,0 0 28px #880000}50%{box-shadow:0 0 24px #ff2200,0 0 50px #cc0000}}
  @keyframes sealCrack{0%{transform:scale(1) rotate(0deg)}30%{transform:scale(1.15) rotate(-3deg)}60%{transform:scale(0.85) rotate(5deg)}100%{transform:scale(0) rotate(15deg);opacity:0}}
  @keyframes slabReveal{0%{transform:translateY(60px) scale(0.85);opacity:0;filter:blur(8px)}100%{transform:translateY(0) scale(1);opacity:1;filter:blur(0)}}
  @keyframes lightSweep{0%{left:-60%}100%{left:120%}}
  @keyframes gemPulse{0%,100%{text-shadow:0 0 20px #ffd700,0 0 40px #ffd700;letter-spacing:0.3em}50%{text-shadow:0 0 40px #ffffff,0 0 80px #ffd700;letter-spacing:0.35em}}
  @keyframes shakeScreen{0%,100%{transform:translate(0,0)}10%{transform:translate(-8px,4px)}20%{transform:translate(8px,-4px)}30%{transform:translate(-6px,6px)}40%{transform:translate(6px,-2px)}50%{transform:translate(-4px,4px)}60%{transform:translate(4px,-4px)}70%{transform:translate(-2px,2px)}80%{transform:translate(2px,-2px)}90%{transform:translate(0,0)}}
  @keyframes gradeCountUp{from{opacity:0;transform:scale(2)}to{opacity:1;transform:scale(1)}}
  .acrylic-slab{position:relative;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.04));backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.18);box-shadow:inset 0 1px 0 rgba(255,255,255,0.25),inset 0 -1px 0 rgba(0,0,0,0.3),0 24px 60px rgba(0,0,0,0.8),0 0 0 3px rgba(255,255,255,0.06);overflow:hidden}
  .acrylic-slab::before{content:'';position:absolute;top:-10%;left:-60%;width:40%;height:120%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);transform:skewX(-15deg);animation:lightSweep 5s ease-in-out infinite;pointer-events:none;z-index:30}
  .slab-gem{animation:gemPulse 1.5s ease-in-out infinite}
  .slab-reveal{animation:slabReveal 0.7s cubic-bezier(0.2,1.1,0.4,1) forwards}
  .screen-shake{animation:shakeScreen 0.4s ease-out}
  /* ── TOPPS DESIGN SYSTEM ───────────────────────────────────────────────── */
  .topps-screen{min-height:100vh;background:#f0ede8;color:#111;font-family:'Barlow',sans-serif}
  .topps-ticker{background:#e8161e;overflow:hidden;white-space:nowrap;height:30px;display:flex;align-items:center;width:100%}
  .topps-ticker-inner{display:inline-flex;gap:0;animation:oracleTicker 28s linear infinite;will-change:transform}
  .topps-ticker-item{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#fff;padding:0 20px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;flex-shrink:0}
  .topps-ticker-item::after{content:'◆';font-size:6px;opacity:0.5;margin-left:8px}
  .topps-header{background:#fff;border-bottom:3px solid #e8161e;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:100;gap:12px;overflow:hidden}
  .topps-logo-main{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;color:#111;line-height:1;white-space:nowrap;flex-shrink:0}
  .topps-logo-main em{color:#e8161e;font-style:normal}
  .topps-logo-sub{font-size:8px;letter-spacing:0.22em;color:#bbb;text-transform:uppercase;font-weight:600;font-family:'Barlow',sans-serif;white-space:nowrap}
  .topps-nav-links{display:flex;gap:16px;overflow:hidden}
  @media(max-width:600px){.topps-nav-links{display:none}}
  .topps-nav-link{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#444;cursor:pointer;padding:4px 0;border-bottom:2px solid transparent;transition:all 0.15s;background:none;border-left:none;border-right:none;border-top:none;white-space:nowrap;flex-shrink:0}
  .topps-nav-link:hover{color:#e8161e;border-bottom-color:#e8161e}
  .topps-nav-link.on{color:#e8161e;border-bottom-color:#e8161e}
  .topps-hero{background:#111;position:relative;overflow:hidden;padding:36px 20px 40px}
  .topps-hero-stripes{position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.012) 60px,rgba(255,255,255,0.012) 61px);pointer-events:none}
  .topps-section{background:#f0ede8;padding:28px 20px}
  .topps-section-dark{background:#111;padding:28px 20px}
  .topps-section-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:#111;display:flex;align-items:center;gap:10px;margin-bottom:18px}
  .topps-section-title::after{content:'';display:block;width:36px;height:3px;background:#e8161e}
  .topps-btn-primary{background:#e8161e;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;padding:13px 36px;border:none;cursor:pointer;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));transition:background 0.15s}
  .topps-btn-primary:hover{background:#c01018}
  .topps-btn-primary:disabled{background:#ccc;cursor:not-allowed;clip-path:none}
  .topps-btn-secondary{background:transparent;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:11px 28px;border:1.5px solid rgba(255,255,255,0.3);cursor:pointer;transition:border-color 0.15s}
  .topps-btn-secondary:hover{border-color:#fff}
  .topps-btn-outline{background:transparent;color:#e8161e;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:11px 28px;border:1.5px solid #e8161e;cursor:pointer;transition:all 0.15s;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))}
  .topps-btn-outline:hover{background:#e8161e;color:#fff}
  .topps-input{width:100%;background:#fff;border:1.5px solid #ccc;padding:11px 14px;color:#111;font-size:14px;font-family:'Barlow',sans-serif;font-weight:500;outline:none;transition:border-color 0.2s;border-radius:0}
  .topps-input:focus{border-color:#e8161e}
  .topps-input::placeholder{color:#aaa}
  .topps-label{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#555;margin-bottom:5px;display:block}
  .topps-card{background:#fff;border:1px solid #ddd;overflow:hidden;cursor:pointer;transition:transform 0.12s,box-shadow 0.12s;position:relative}
  .topps-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.12)}
  .topps-product-card{background:#fff;border:1px solid #e0ddd8;overflow:hidden;cursor:pointer;transition:transform 0.12s,box-shadow 0.12s;position:relative}
  .topps-product-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
  .topps-rarity-pill{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border:1.5px solid;cursor:pointer;transition:all 0.12s}
  .topps-eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.4em;color:#e8161e;text-transform:uppercase;display:flex;align-items:center;gap:8px}
  .topps-eyebrow::before{content:'';width:24px;height:2px;background:#e8161e;flex-shrink:0}
  .topps-feature-box{background:rgba(255,255,255,0.04);border-left:3px solid #e8161e;padding:14px 16px}
  .topps-divider{height:1px;background:#e8e8e8;margin:16px 0}
  .topps-tag{background:#e8161e;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;padding:3px 8px;clip-path:polygon(0 0,100% 0,calc(100% - 4px) 100%,0 100%)}
  .topps-serial{font-family:'Roboto Mono',monospace;font-size:10px;font-weight:700;color:rgba(255,255,255,0.8);background:rgba(0,0,0,0.5);padding:2px 6px;letter-spacing:0.05em}
  @keyframes toppsReveal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .topps-reveal{animation:toppsReveal 0.4s ease-out both}
  .envelope-flap{transform-origin:top center;animation:envelopeFlap 0.55s cubic-bezier(0.4,0,0.2,1) forwards}
  .card-slide-out{animation:cardSlideOut 0.65s cubic-bezier(0.2,1.2,0.4,1) 0.3s forwards;opacity:0}
  .light-leak{animation:lightLeak 0.5s ease-out forwards}
  .seal-crack{animation:sealCrack 0.4s cubic-bezier(0.4,0,1,1) forwards}
  .grade-pop{animation:gradeCountUp 0.5s cubic-bezier(0.3,1.4,0.5,1) forwards}
`;
function TeamEmblem(props) {
  var team=props.team; var size=props.size||80;
  var col=getColors(team); var c1=col[0]; var c2=col[1];
  var code=teamCode(team);
  var uid="em"+team.replace(/[^a-zA-Z]/g,"");
  // Font size scales down for longer codes
  var fs=code.length<=2?24:code.length===3?20:code.length===4?16:13;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id={uid+"g"} cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor={c1} stopOpacity="1"/>
          <stop offset="60%" stopColor={c1} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0.7"/>
        </radialGradient>
        <radialGradient id={uid+"sh"} cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <filter id={uid+"dr"}><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={c1} floodOpacity="0.7"/></filter>
        <filter id={uid+"txt"}><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.9)" floodOpacity="1"/></filter>
      </defs>
      {/* Shield body */}
      <path d="M40,3 L74,16 L74,44 Q74,68 40,77 Q6,68 6,44 L6,16 Z" fill={"url(#"+uid+"g)"} filter={"url(#"+uid+"dr)"}/>
      {/* Inner highlight */}
      <path d="M40,3 L74,16 L74,44 Q74,68 40,77 Q6,68 6,44 L6,16 Z" fill={"url(#"+uid+"sh)"} opacity="0.6"/>
      {/* Stroke */}
      <path d="M40,3 L74,16 L74,44 Q74,68 40,77 Q6,68 6,44 L6,16 Z" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.8"/>
      {/* Inner stroke */}
      <path d="M40,8 L69,19 L69,44 Q69,65 40,73 Q11,65 11,44 L11,19 Z" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8"/>
      {/* Team code */}
      <text x="40" y="48" textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={fs} fill="rgba(255,255,255,0.97)" filter={"url(#"+uid+"txt)"} letterSpacing="1.5">{code}</text>
    </svg>
  );
}

// CD monogram badge — replaces the old single "D"
// ── RARITY CONFIG ─────────────────────────────────────────────────────────────
var RARITY_CFG={
  Base:{
    stripe:"#6b7280",stripeTxt:"#fff",
    photoTop:"#141820",photoBot:"#0c1018",
    abbvFn:function(c1){return "rgba("+hexToRgb(c1)+",0.55)";},
    abbvShadow:"none",
    plateBdr:"#777",nameCol:"#222",rarCol:"#777",
    tagBg:"#6b7280",tagTxt:"#fff",
    shadow:"none",
    overlays:null,icon:null,serial:null,
    photoExtra:function(W,H){return null;},
  },
  Rare:{
    stripe:"#1144cc",stripeTxt:"#fff",
    photoTop:"#081440",photoBot:"#040c28",
    abbvFn:function(){return "rgba(80,140,255,0.72)";},
    abbvShadow:"0 0 22px rgba(50,120,255,0.55)",
    plateBdr:"#2255cc",nameCol:"#111",rarCol:"#1a44cc",
    tagBg:"#1144cc",tagTxt:"#fff",
    shadow:"0 0 18px rgba(40,100,230,0.45)",
    icon:null,serial:null,
  },
  Elite:{
    stripe:"#22aa55",stripeTxt:"#fff",
    photoTop:"#040e08",photoBot:"#020a04",
    abbvFn:function(){return "rgba(60,220,120,0.78)";},
    abbvShadow:"0 0 18px rgba(34,200,100,0.7),0 0 40px rgba(0,180,80,0.3)",
    plateBdr:"#22aa55",nameCol:"#111",rarCol:"#22aa55",
    tagBg:"linear-gradient(90deg,#22aa55,#0aee77)",tagTxt:"#fff",
    shadow:"0 0 22px rgba(34,170,85,0.5)",
    icon:"⚡",serial:null,
  },
  Legacy:{
    stripe:"#c8a800",stripeTxt:"#fff",
    photoTop:"#1a0c00",photoBot:"#0a0500",
    abbvFn:function(){return "rgba(255,210,40,0.9)";},
    abbvShadow:"0 0 14px rgba(255,200,0,0.85),0 0 38px rgba(220,160,0,0.45),0 0 65px rgba(180,100,0,0.2)",
    plateBdr:"#c8a800",nameCol:"#111",rarCol:"#b8900a",
    tagBg:"linear-gradient(90deg,#c8a800,#ffe566,#c8a800)",tagTxt:"#000",
    shadow:"0 0 28px rgba(200,168,0,0.62),0 0 60px rgba(200,168,0,0.18)",
    icon:"🔥",serial:"/500",
  },
  Legendary:{
    stripe:"#e8161e",stripeTxt:"#fff",
    photoTop:"#0e0202",photoBot:"#060000",
    abbvFn:function(){return "rgba(255,80,50,0.92)";},
    abbvShadow:"0 0 14px rgba(255,40,20,0.95),0 0 40px rgba(232,22,30,0.65),0 0 80px rgba(180,0,0,0.3)",
    plateBdr:"#e8161e",nameCol:"#111",rarCol:"#cc0010",
    tagBg:"linear-gradient(90deg,#cc0010,#ff3322)",tagTxt:"#fff",
    shadow:"0 0 32px rgba(232,22,30,0.7),0 0 70px rgba(232,22,30,0.25)",
    icon:"★",serial:"/100",
  },
  Dynasty:{
    stripe:"#9933ff",stripeTxt:"#fff",
    photoTop:"#0a001e",photoBot:"#020008",
    abbvFn:function(){return "rgba(200,120,255,0.95)";},
    abbvShadow:"0 0 14px rgba(180,80,255,1),0 0 35px rgba(153,51,255,0.75),0 0 70px rgba(232,22,30,0.35)",
    plateBdr:"transparent",nameCol:"#fff",rarCol:"#cc88ff",
    tagBg:"linear-gradient(90deg,#9933ff,#cc0030)",tagTxt:"#fff",
    shadow:"0 0 40px rgba(140,50,255,0.75),0 0 80px rgba(232,22,30,0.35)",
    icon:"👑",serial:"/10",
  },
  Radioactive:{
    stripe:"#00ff44",stripeTxt:"#001a0a",
    photoTop:"#000e04",photoBot:"#000601",
    abbvFn:function(){return "rgba(0,255,68,0.92)";},
    abbvShadow:"0 0 16px rgba(0,255,60,1),0 0 40px rgba(0,220,50,0.75),0 0 80px rgba(0,180,40,0.4)",
    plateBdr:"transparent",nameCol:"#00ff44",rarCol:"#00cc33",
    tagBg:"linear-gradient(90deg,#003d12,#00ff44,#003d12)",tagTxt:"#001a0a",
    shadow:"0 0 20px rgba(0,255,60,0.8),0 0 50px rgba(0,200,40,0.45),0 0 90px rgba(0,160,30,0.25)",
    icon:"☢",serial:"/10",
  },
};
// helper for Base team-color abbv
function hexToRgb(hex){
  if(!hex||hex[0]!=="#") return "180,190,210";
  var r=parseInt(hex.slice(1,3),16)||180;
  var g=parseInt(hex.slice(3,5),16)||190;
  var b=parseInt(hex.slice(5,7),16)||210;
  return r+","+g+","+b;
}

function PremiumCard(props) {
  var card=props.card; var isWinner=props.isWinner||false;
  var W=170; var H=240;
  var cfg=RARITY_CFG[card.rarity]||RARITY_CFG.Base;
  var col=getColors(card.team); var c1=col[0];
  var code=teamCode(card.team);
  var isDyn=card.rarity==="Dynasty";
  var isLeg=card.rarity==="Legendary";
  var isLegacy=card.rarity==="Legacy";
  var isElite=card.rarity==="Elite";
  var isRare=card.rarity==="Rare";
  var isBase=card.rarity==="Base";
  var isRad=card.rarity==="Radioactive";
  var abbvColor=isBase?cfg.abbvFn(c1):cfg.abbvFn();
  var stripeStyle=isDyn
    ?"linear-gradient(180deg,#aa44ff,#6600cc,#e8161e,#9933ff)"
    :isLeg?"linear-gradient(180deg,#ff2222,#8a0010,#ff1818)"
    :isLegacy?"linear-gradient(180deg,#f5c518,#8a6c00,#f5c518)"
    :isRad?"linear-gradient(180deg,#00ff44,#006622,#00ff44)"
    :cfg.stripe;

  return (
    <div style={{width:W,height:H,position:"relative",flexShrink:0,borderRadius:4,overflow:"visible",
      boxShadow:cfg.shadow+",0 8px 24px rgba(0,0,0,0.35)"}}>

      {/* Radioactive slimy outer halo */}
      {isRad&&<div style={{position:"absolute",inset:-10,borderRadius:10,
        background:"radial-gradient(ellipse at 50% 50%,rgba(0,255,60,0.28) 0%,rgba(0,200,40,0.12) 45%,transparent 70%)",
        animation:"slimePulse 2.4s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>}
      {isRad&&<div style={{position:"absolute",inset:-5,borderRadius:8,
        border:"1.5px solid rgba(0,255,60,0.5)",
        boxShadow:"0 0 16px rgba(0,255,60,0.4),inset 0 0 8px rgba(0,255,60,0.06)",
        animation:"slimePulse 2.4s ease-in-out infinite 0.3s",pointerEvents:"none",zIndex:0}}/>}

      {/* Card body wrapper with clip */}
      <div style={{width:W,height:H,position:"relative",borderRadius:4,overflow:"hidden",zIndex:2,
        border:isDyn?"2px solid transparent":isRad?"2px solid rgba(0,255,60,0.6)":"1px solid rgba(0,0,0,0.15)"}}>

        {/* Dynasty animated rainbow border */}
        {isDyn&&<div style={{position:"absolute",inset:-2,background:"linear-gradient(135deg,#9933ff,#e8161e,#ff6600,#9933ff)",borderRadius:6,zIndex:0,animation:"dynastyShine 3s linear infinite"}}/>}
        {isDyn&&<div style={{position:"absolute",inset:0,background:cfg.photoBot,borderRadius:4,zIndex:1}}/>}

        {/* LEFT STRIPE */}
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:20,background:stripeStyle,zIndex:6,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
            letterSpacing:"0.2em",textTransform:"uppercase",color:cfg.stripeTxt,
            writingMode:"vertical-rl",transform:"rotate(180deg)",whiteSpace:"nowrap",userSelect:"none"}}>{card.team.toUpperCase()}</span>
        </div>

        {/* PHOTO AREA */}
        <div style={{position:"absolute",left:20,top:0,right:0,bottom:38,
          background:"linear-gradient(160deg,"+cfg.photoTop+","+cfg.photoBot+")",overflow:"hidden",zIndex:2}}>

          {isBase&&<div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,0.015) 18px,rgba(255,255,255,0.015) 19px),repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(255,255,255,0.015) 18px,rgba(255,255,255,0.015) 19px)",zIndex:1}}/>}

          {isRare&&<svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.14,zIndex:1}} viewBox="0 0 150 202" preserveAspectRatio="none">
            <path d="M10,82 Q30,58 52,86 Q72,112 96,72" stroke="#4488ff" strokeWidth="1.5" fill="none"/>
            <path d="M5,104 Q35,72 58,102 Q82,124 112,92" stroke="#6699ff" strokeWidth="1" fill="none"/>
            <path d="M18,52 Q44,28 65,56 Q85,76 108,52" stroke="#3377ee" strokeWidth="1" fill="none"/>
          </svg>}
          {isRare&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:2}}>
            <div style={{position:"absolute",width:"35%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(100,160,255,0.14),transparent)",animation:"shimmerSweep 3.5s ease-in-out infinite"}}/>
          </div>}

          {isElite&&<div style={{position:"absolute",left:0,right:0,top:"8%",height:"50%",background:"linear-gradient(180deg,transparent,rgba(0,230,120,0.18),rgba(0,180,220,0.12),transparent)",animation:"nebulaBreath 4s ease-in-out infinite",zIndex:1}}/>}
          {isElite&&<div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(55deg,transparent,transparent 9px,rgba(34,200,100,0.06) 9px,rgba(34,200,100,0.06) 10px)",zIndex:1}}/>}
          {isElite&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:2}}>
            <div style={{position:"absolute",width:"30%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(60,220,120,0.14),transparent)",animation:"shimmerSweep 3s ease-in-out infinite 0.5s"}}/>
          </div>}
          {isElite&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"20%",background:"linear-gradient(0deg,rgba(0,255,120,0.18) 0%,transparent 100%)",zIndex:3}}/>}

          {isLegacy&&<svg style={{position:"absolute",left:"50%",top:"42%",transform:"translate(-50%,-50%)",width:180,height:180,opacity:0.1,zIndex:1}} viewBox="0 0 180 180">
            <g transform="translate(90,90)">
              {[0,45,90,135,22.5,67.5,112.5,157.5].map(function(a,i){return <line key={i} x1="0" y1="-85" x2="0" y2="85" stroke="#ffcc00" strokeWidth={i<4?1:0.6} transform={"rotate("+a+")"}/>;})}
            </g>
          </svg>}
          {isLegacy&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 78% 62% at 60% 40%,rgba(255,200,0,0.36) 0%,rgba(220,120,0,0.2) 40%,transparent 90%)",zIndex:1}}/>}
          {isLegacy&&<div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(72deg,transparent,transparent 11px,rgba(255,200,0,0.055) 11px,rgba(255,200,0,0.055) 12px)",zIndex:1}}/>}
          {isLegacy&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:2}}>
            <div style={{position:"absolute",width:"50%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(255,220,80,0.18),rgba(255,255,200,0.1),rgba(255,220,80,0.14),transparent)",animation:"shimmerSweep 2.5s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"22%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(255,255,180,0.09),transparent)",animation:"shimmerSweep 2.5s ease-in-out infinite 1.25s"}}/>
          </div>}

          {isLeg&&<div style={{position:"absolute",inset:0,zIndex:1}}>
            {[[15,24,2,2.1],[28,62,1,1.7],[11,76,2,2.5],[42,14,1,1.9],[21,46,2,2.3],[55,78,1,2.0],[65,35,1,2.6]].map(function(s,i){
              return <div key={i} style={{position:"absolute",width:s[2],height:s[2],background:"#fff",borderRadius:"50%",top:s[0]+"%",left:s[1]+"%",animation:"twinkle "+s[3]+"s ease-in-out infinite "+(i*0.4)+"s",opacity:0.6}}/>;
            })}
          </div>}
          {isLeg&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 88% 70% at 58% 40%,rgba(255,60,20,0.48) 0%,rgba(200,10,10,0.25) 35%,rgba(60,0,0,0.1) 65%,transparent 80%)",zIndex:2}}/>}
          {isLeg&&<div style={{position:"absolute",left:"55%",top:"40%",transform:"translate(-50%,-50%)",width:80,height:80,border:"1px solid rgba(255,70,40,0.3)",borderRadius:"50%",animation:"pulsarRed 2.2s ease-out infinite",zIndex:3}}/>}
          {isLeg&&<div style={{position:"absolute",left:"55%",top:"40%",transform:"translate(-50%,-50%)",width:120,height:120,border:"1px solid rgba(255,60,30,0.15)",borderRadius:"50%",animation:"pulsarRed 2.2s ease-out infinite 0.7s",zIndex:3}}/>}
          {isLeg&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:4}}>
            <div style={{position:"absolute",width:"40%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(255,80,40,0.14),transparent)",animation:"shimmerSweep 2.2s ease-in-out infinite"}}/>
          </div>}
          {isLeg&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(0deg,rgba(232,22,30,0.35) 0%,transparent 100%)",zIndex:4}}/>}
          {isLeg&&[22,42,62].map(function(lx,i){return <div key={i} style={{position:"absolute",bottom:"25%",left:lx+"%",width:3+i%2,height:3+i%2,background:["#ff6040","#ff4020","#ff7050"][i],borderRadius:"50%",animation:"emberRise "+(1.6+i*0.25)+"s ease-out infinite "+(i*0.55)+"s",boxShadow:"0 0 4px #ff4020",zIndex:6}}/>;})}

          {isDyn&&<div style={{position:"absolute",inset:0,background:"conic-gradient(from 0deg at 55% 42%,rgba(153,51,255,0.22) 0deg,transparent 60deg,rgba(232,22,30,0.14) 120deg,transparent 180deg,rgba(153,51,255,0.18) 240deg,transparent 300deg,rgba(80,20,180,0.1) 360deg)",animation:"cosmicRing 25s linear infinite",zIndex:1}}/>}
          {isDyn&&<div style={{position:"absolute",left:"-20%",top:"-20%",width:"80%",height:"80%",background:"radial-gradient(ellipse at 60% 60%,rgba(153,51,255,0.28) 0%,rgba(80,20,180,0.12) 50%,transparent 70%)",animation:"nebulaBreath 5s ease-in-out infinite",zIndex:2}}/>}
          {isDyn&&<div style={{position:"absolute",right:"-10%",top:"20%",width:"70%",height:"60%",background:"radial-gradient(ellipse at 40% 40%,rgba(232,22,30,0.18) 0%,rgba(120,10,40,0.08) 50%,transparent 70%)",animation:"nebulaBreath 4s ease-in-out infinite 1.5s",zIndex:2}}/>}
          {isDyn&&<div style={{position:"absolute",inset:0,zIndex:3}}>
            {[[8,18,1,2.2],[15,55,2,1.8],[25,30,1,2.5],[18,80,2,1.6],[36,68,1,2.1],[12,40,2,3.0],[45,22,1,1.9],[56,76,1,2.4]].map(function(s,i){
              return <div key={i} style={{position:"absolute",width:s[2],height:s[2],background:["#fff","#cc99ff","#fff","#ffbbcc","#aabbff","#fff","#fff","#aaffee"][i],borderRadius:"50%",top:s[0]+"%",left:s[1]+"%",animation:"twinkle "+s[3]+"s ease-in-out infinite "+(i*0.35)+"s",boxShadow:i%2===0?"0 0 2px #fff":"0 0 3px rgba(200,150,255,0.8)"}}/>;
            })}
          </div>}
          {isDyn&&<div style={{position:"absolute",left:"52%",top:"42%",transform:"translate(-50%,-50%)",width:44,height:44,borderRadius:"50%",background:"radial-gradient(ellipse at 50% 50%,rgba(0,0,0,1) 35%,rgba(100,20,200,0.4) 65%,transparent 80%)",zIndex:6}}/>}
          {isDyn&&<div style={{position:"absolute",left:"52%",top:"42%",transform:"translate(-50%,-50%)",width:80,height:20,borderRadius:"50%",border:"1.5px solid rgba(200,120,255,0.38)",boxShadow:"0 0 8px rgba(180,80,255,0.3)",zIndex:5}}/>}
          {isDyn&&<div style={{position:"absolute",left:"52%",top:"42%",transform:"translate(-50%,-50%)",width:100,height:25,borderRadius:"50%",border:"1px solid rgba(255,80,40,0.2)",zIndex:4}}/>}
          {isDyn&&<div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(153,51,255,0.04) 3px,rgba(153,51,255,0.04) 4px)",zIndex:7,pointerEvents:"none"}}/>}
          {isDyn&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:8}}>
            <div style={{position:"absolute",width:"30%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(180,80,255,0.14),rgba(255,255,255,0.05),transparent)",animation:"shimmerSweep 2.5s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"18%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(255,80,80,0.08),transparent)",animation:"shimmerSweep 2.5s ease-in-out infinite 1.25s"}}/>
          </div>}
          {isDyn&&[20,36,52,66,82].map(function(lx,i){return <div key={i} style={{position:"absolute",bottom:"25%",left:lx+"%",width:3+i%2,height:3+i%2,background:["#cc66ff","#ff4460","#9933ff","#ffaa44","#ff3366"][i],borderRadius:"50%",animation:"emberRise "+(1.5+i*0.2)+"s ease-out infinite "+(i*0.4)+"s",boxShadow:"0 0 "+(5+i)+"px "+["#aa44ff","#ff2244","#8822ee","#ff8800","#ee1144"][i],zIndex:9}}/>;})}

          {/* ── RADIOACTIVE VISUAL ── */}
          {isRad&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 85% 70% at 58% 40%,rgba(0,255,60,0.32) 0%,rgba(0,180,40,0.16) 40%,rgba(0,80,20,0.08) 65%,transparent 85%)",zIndex:1}}/>}
          {/* Toxic grid lines */}
          {isRad&&<div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(0,255,60,0.04) 22px,rgba(0,255,60,0.04) 23px),repeating-linear-gradient(90deg,transparent,transparent 22px,rgba(0,255,60,0.04) 22px,rgba(0,255,60,0.04) 23px)",zIndex:1}}/>}
          {/* Radioactive symbol watermark */}
          {isRad&&<svg style={{position:"absolute",left:"50%",top:"42%",transform:"translate(-50%,-50%)",width:100,height:100,opacity:0.09,zIndex:2}} viewBox="-50 -50 100 100">
            <circle cx="0" cy="0" r="48" fill="none" stroke="#00ff44" strokeWidth="2"/>
            <circle cx="0" cy="0" r="14" fill="#00ff44"/>
            {[0,120,240].map(function(angle,i){
              var rad=angle*Math.PI/180;
              var rad2=(angle+60)*Math.PI/180;
              return <path key={i} d={"M"+(Math.cos(rad)*16)+","+(Math.sin(rad)*16)+" L"+(Math.cos(rad)*46)+","+(Math.sin(rad)*46)+" A46,46 0 0,1 "+(Math.cos(rad2)*46)+","+(Math.sin(rad2)*46)+" L"+(Math.cos(rad2)*16)+","+(Math.sin(rad2)*16)+" Z"} fill="#00ff44"/>;
            })}
          </svg>}
          {/* Toxic slime drips from top */}
          {isRad&&<svg style={{position:"absolute",top:0,left:0,right:0,width:"100%",height:30,opacity:0.35,zIndex:3}} viewBox="0 0 150 30" preserveAspectRatio="none">
            <path d="M0,0 Q18,0 20,14 Q22,26 24,28 Q26,30 28,26 Q30,22 31,8 Q40,0 55,0 Q65,0 67,18 Q69,28 71,30 Q73,28 75,14 Q77,4 90,0 Q105,0 107,20 Q109,28 111,30 Q113,28 115,16 Q117,4 130,0 L150,0 L150,0 L0,0 Z" fill="#00ff44"/>
          </svg>}
          {/* Toxic pulse rings */}
          {isRad&&<div style={{position:"absolute",left:"52%",top:"40%",transform:"translate(-50%,-50%)",width:70,height:70,border:"1px solid rgba(0,255,60,0.35)",borderRadius:"50%",animation:"pulsarRed 2.4s ease-out infinite",zIndex:3}}/>}
          {isRad&&<div style={{position:"absolute",left:"52%",top:"40%",transform:"translate(-50%,-50%)",width:110,height:110,border:"1px solid rgba(0,255,60,0.18)",borderRadius:"50%",animation:"pulsarRed 2.4s ease-out infinite 0.8s",zIndex:3}}/>}
          {/* Shimmer sweep */}
          {isRad&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:4}}>
            <div style={{position:"absolute",width:"35%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(0,255,60,0.18),rgba(180,255,200,0.08),transparent)",animation:"shimmerSweep 2.8s ease-in-out infinite"}}/>
          </div>}
          {/* Green particle drips */}
          {isRad&&[18,36,54,72,88].map(function(lx,i){return <div key={i} style={{position:"absolute",bottom:"20%",left:lx+"%",width:2+i%2,height:2+i%2,background:"#00ff44",borderRadius:"50%",animation:"emberRise "+(1.4+i*0.2)+"s ease-out infinite "+(i*0.35)+"s",boxShadow:"0 0 6px rgba(0,255,60,0.9)",zIndex:6}}/>;})}
          {/* Bottom glow */}
          {isRad&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:"linear-gradient(0deg,rgba(0,255,60,0.3) 0%,transparent 100%)",zIndex:4}}/>}

          {/* Team color radial — all tiers */}
          {!isRad&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 70% at 60% 40%,"+c1+"44 0%,transparent 70%)",pointerEvents:"none",zIndex:isDyn?1:4}}/>}

          {/* ABBREVIATION */}
          <div style={{position:"absolute",left:0,right:0,top:"50%",transform:"translateY(-50%)",
            textAlign:"center",zIndex:isDyn?9:isRad?8:5,paddingLeft:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:code.length<=2?82:code.length<=3?62:code.length<=4?48:38,
              fontWeight:900,letterSpacing:code.length<=2?"0.04em":"0.02em",
              color:abbvColor,lineHeight:1,userSelect:"none",
              textShadow:cfg.abbvShadow}}>{code}</span>
          </div>

          {/* Tier icon */}
          {cfg.icon&&<div style={{position:"absolute",top:18,right:6,zIndex:12,fontSize:14,lineHeight:1,
            animation:isDyn?"crownFloat 2.2s ease-in-out infinite":isRad?"slimePulse 2s ease-in-out infinite":"iconFloat 2s ease-in-out infinite",
            filter:isDyn?"drop-shadow(0 0 6px rgba(255,200,0,0.95)) drop-shadow(0 0 12px rgba(255,150,0,0.6))"
              :isRad?"drop-shadow(0 0 8px rgba(0,255,60,1)) drop-shadow(0 0 16px rgba(0,200,40,0.8))"
              :isLeg?"drop-shadow(0 0 5px rgba(255,100,60,0.95))"
              :isLegacy?"drop-shadow(0 0 4px rgba(255,180,0,0.8))"
              :isElite?"drop-shadow(0 0 5px rgba(34,200,100,0.9))"
              :"none"}}>{cfg.icon}</div>}

          {/* Serial number — shown for Legacy+ including Radioactive */}
          {cfg.serial&&<div style={{position:"absolute",bottom:6,left:22,zIndex:11,
            fontFamily:"'Roboto Mono',monospace",fontSize:isRad?8:7,fontWeight:700,
            color:isRad?"rgba(0,255,60,0.9)":isDyn?"rgba(200,140,255,0.6)":isLeg?"rgba(255,100,80,0.55)":"rgba(255,210,60,0.55)",
            letterSpacing:"0.06em",
            textShadow:isRad?"0 0 8px rgba(0,255,60,0.8)":"none"}}>
            {isRad?"#"+(card.serialNumber||"?")+" / 10":("#"+cfg.serial)}
          </div>}

          {/* Rarity tag — top right */}
          <div style={{position:"absolute",top:0,right:0,zIndex:12,background:cfg.tagBg,padding:"3px 7px",maxWidth:isRad?75:60,overflow:"hidden"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:isRad?7.5:9,fontWeight:900,
              letterSpacing:"0.04em",textTransform:"uppercase",color:cfg.tagTxt,whiteSpace:"nowrap"}}>
              {card.rarity.toUpperCase()}
            </span>
          </div>

          {/* Grade badge */}
          {card.graded&&card.grade&&(
            <div style={{position:"absolute",top:0,left:20,zIndex:12,background:"linear-gradient(135deg,#c8a800,#f5c518)",padding:"3px 7px"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:900,letterSpacing:"0.08em",color:"#000"}}>PSA {card.grade}</span>
            </div>
          )}

          {/* CD 2025 watermark */}
          <div style={{position:"absolute",bottom:5,right:6,zIndex:7,fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:7,fontWeight:700,letterSpacing:"0.1em",
            color:isRad?"rgba(0,255,60,0.25)":isDyn?"rgba(180,120,255,0.3)":"rgba(255,255,255,0.25)",userSelect:"none"}}>CD 2025</div>

          {/* Winner badge */}
          {isWinner&&<div style={{position:"absolute",top:20,left:4,zIndex:13,background:"#22aa44",padding:"2px 6px"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,color:"#fff",letterSpacing:"0.08em"}}>WIN</span>
          </div>}
        </div>

        {/* NAME PLATE */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:38,
          background:isDyn?"#0a0020":isRad?"#000e04":"#fff",
          borderTop:isRad?"3px solid #00ff44":isDyn?"3px solid transparent":"2px solid "+cfg.plateBdr,
          borderImage:isDyn?"linear-gradient(90deg,#9933ff,#e8161e,#ffaa00) 1":"none",
          boxShadow:isRad?"0 -2px 12px rgba(0,255,60,0.3)":"none",
          zIndex:6,display:"flex",flexDirection:"column",justifyContent:"center",
          paddingLeft:24,paddingRight:8,paddingTop:2,paddingBottom:2}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:card.team.length>10?10:card.team.length>7?12:14,
            fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",
            lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
            color:isRad?"#00ff44":isDyn?undefined:cfg.nameCol,
            background:isDyn?"linear-gradient(90deg,#cc88ff,#ff6699)":undefined,
            WebkitBackgroundClip:isDyn?"text":undefined,
            WebkitTextFillColor:isDyn?"transparent":undefined,
            textShadow:isRad?"0 0 8px rgba(0,255,60,0.6)":"none"}}>{card.team.toUpperCase()}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:700,
              letterSpacing:"0.04em",textTransform:"uppercase",
              color:isRad?"rgba(0,200,40,0.8)":isDyn?undefined:cfg.rarCol,
              background:isDyn?"linear-gradient(90deg,#9933ff,#e8161e)":undefined,
              WebkitBackgroundClip:isDyn?"text":undefined,
              WebkitTextFillColor:isDyn?"transparent":undefined}}>
              {card.sport} · {isRad?"RADIOACTIVE":""+card.rarity.toUpperCase()}
            </span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,fontWeight:700,
              color:isRad?"#00ff44":isDyn?"#cc88ff":"#c8a800",
              textShadow:isRad?"0 0 6px rgba(0,255,60,0.7)":"none"}}>{fmt(card.daily)}🪙</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// Card back — Topps-style foil back
function CardBack(props) {
  var W=props.width||170; var H=props.height||240; var autoFlip=props.autoFlip||false;
  return (
    <div style={{width:W,height:H,borderRadius:4,overflow:"hidden",position:"relative",
      background:"linear-gradient(145deg,#0a0e18,#111828,#0a0e18)",
      border:"1px solid rgba(255,255,255,0.08)"}}>
      {/* Background pattern */}
      <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:0.12}} viewBox={"0 0 "+W+" "+H}>
        {Array.from({length:Math.ceil(H/12)},function(_,row){
          return Array.from({length:Math.ceil(W/12)},function(_,col){
            return <rect key={row+"-"+col} x={col*12+2} y={row*12+2} width={7} height={7} rx={1} fill="rgba(255,255,255,0.5)"/>;
          });
        })}
      </svg>
      {/* Center logo area */}
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:6,zIndex:2}}>
        <div style={{background:"rgba(232,22,30,0.9)",padding:"6px 16px",marginBottom:4}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,
            letterSpacing:"0.06em",color:"#fff",textTransform:"uppercase"}}>CARD <em style={{color:"#f5c518",fontStyle:"normal"}}>DYNASTY</em></span>
        </div>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
          letterSpacing:"0.4em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Official Collector Edition</span>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
          color:"rgba(255,255,255,0.2)",letterSpacing:"0.2em",textTransform:"uppercase",marginTop:4}}>2025 Series 1</span>
        {!autoFlip&&<div style={{marginTop:12,background:"rgba(232,22,30,0.15)",border:"1px solid rgba(232,22,30,0.4)",padding:"5px 16px"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,
            letterSpacing:"0.25em",color:"#e8161e",textTransform:"uppercase"}}>Tap to Reveal</span>
        </div>}
      </div>
      {/* Corner marks */}
      {[[4,4],[W-4,4],[4,H-4],[W-4,H-4]].map(function(pt,i){
        var sx=i%2===0?1:-1; var sy=i<2?1:-1;
        return <svg key={i} width={14} height={14} style={{position:"absolute",left:pt[0]-7,top:pt[1]-7,zIndex:3}}>
          <polyline points={"0,8 0,0 8,0"} fill="none" stroke="rgba(232,22,30,0.5)" strokeWidth="1.5"
            transform={"scale("+sx+","+sy+") translate("+(sx<0?-14:0)+","+(sy<0?-14:0)+")"}/>
        </svg>;
      })}
    </div>
  );
}

function FlipCard(props) {
  var card=props.card; var autoFlip=props.autoFlip||false; var winners=props.winners||null;
  var onFlip=props.onFlip||null; var compact=props.compact||false;
  var flippedState=useState(false); var flipped=flippedState[0]; var setFlipped=flippedState[1];
  var sfxState=useState(null); var sfx=sfxState[0]; var setSfx=sfxState[1];
  var isWin=winners&&winners.has(card.team);
  var W=compact?120:170; var H=compact?168:240;
  var SFX={Rare:"RARE!",Elite:"ELITE!",Legacy:"LEGACY!",Legendary:"LEGENDARY!",Dynasty:"DYNASTY!"};
  var cfg=RARITY_CFG[card.rarity]||RARITY_CFG.Base;
  useEffect(function(){if(autoFlip)setTimeout(function(){doFlip();},120);},[autoFlip]);
  function doFlip(){
    if(flipped)return;
    setFlipped(true);
    var s=SFX[card.rarity];
    if(s){setSfx(s);setTimeout(function(){setSfx(null);},900);}
    if(onFlip)onFlip(card);
  }
  return (
    <div style={{width:W,height:H,perspective:900,flexShrink:0,position:"relative"}}>
      {sfx&&<div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",
        zIndex:30,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,
        color:cfg.rarCol,background:"#fff",border:"1px solid "+cfg.rarCol,
        padding:"2px 10px",whiteSpace:"nowrap",
        animation:"popIn 0.8s ease-out forwards",pointerEvents:"none",
        letterSpacing:"0.1em",textTransform:"uppercase"}}>{sfx}</div>}
      <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",
        transition:"transform 0.55s cubic-bezier(0.3,1.2,0.5,1)",
        transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
        <div onClick={doFlip} style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
          WebkitBackfaceVisibility:"hidden",cursor:!flipped?"pointer":"default"}}>
          <CardBack width={W} height={H} autoFlip={autoFlip}/>
        </div>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
          WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)"}}>
          <PremiumCard card={card} isWinner={isWin}/>
        </div>
      </div>
    </div>
  );
}

function MiniCard(props) {
  var card=props.card;
  var cfg=RARITY_CFG[card.rarity]||RARITY_CFG.Base;
  var code=teamCode(card.team);
  return (
    <div style={{width:52,height:72,borderRadius:2,overflow:"hidden",flexShrink:0,position:"relative",
      border:"1px solid rgba(0,0,0,0.12)",boxShadow:cfg.shadow}}>
      {/* Left stripe */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:8,background:cfg.stripe,zIndex:3}}/>
      {/* Photo */}
      <div style={{position:"absolute",left:8,top:0,right:0,bottom:20,
        background:"linear-gradient(160deg,"+cfg.photoTop+","+cfg.photoBot+")",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:code.length<=2?28:code.length<=3?22:16,fontWeight:900,
          color:cfg.abbvCol,letterSpacing:"0.02em",userSelect:"none"}}>{code}</span>
      </div>
      {/* Rarity tag */}
      <div style={{position:"absolute",top:0,right:0,background:cfg.tagBg,padding:"1px 4px",zIndex:4}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:5,fontWeight:900,
          color:cfg.tagTxt,letterSpacing:"0.04em",textTransform:"uppercase"}}>{card.rarity.slice(0,3).toUpperCase()}</span>
      </div>
      {/* Name plate */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:20,
        background:"#fff",borderTop:"1.5px solid "+cfg.plateBdr,zIndex:3,
        display:"flex",flexDirection:"column",justifyContent:"center",paddingLeft:10,paddingRight:3}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:7,fontWeight:900,
          letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",lineHeight:1,
          overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{card.team.toUpperCase()}</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:6,fontWeight:700,
          letterSpacing:"0.04em",color:cfg.rarCol,textTransform:"uppercase"}}>{card.sport}</div>
      </div>
    </div>
  );
}
function ParticleBurst(props) {
  var active=props.active;
  var pts=useRef(Array.from({length:22},function(_,i){return {id:i,tx:rand(-120,120),ty:rand(-140,-20),size:rand(4,9),color:["#f5c518","#fbbf24","#fde68a","#b8860b"][rand(0,3)],delay:rand(0,300),dur:rand(500,900)};})).current;
  if(!active)return null;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"visible",zIndex:20}}>
      {pts.map(function(p){
        return <div key={p.id} style={{position:"absolute",left:"50%",top:"40%",width:p.size,height:p.size,borderRadius:2,background:p.color,"--tx":p.tx+"px","--ty":p.ty+"px",animation:"particle "+p.dur+"ms ease-out "+p.delay+"ms forwards",opacity:0}}/>;
      })}
    </div>
  );
}
function BoosterPack(props) {
  var packId=props.packId; var size=props.size||120; var shaking=props.shaking||false;
  var floating=props.floating!==undefined?props.floating:true; var onClick=props.onClick;
  // 3D box configs — all measurements fixed, no percentage-based font sizes
  // Front face W×H. Depth = right/top face depth. Text positions verified against bounds.
  var pd={
    genesis:{W:90,H:121,dep:14,fTop:"#cc0010",fBot:"#550008",rSide:"#3a0006",tFace:"#cc0010",hd:"#cc0010",hdIsGold:false,
      topLbl:"GENESIS PACK",hdFs:9,mainLbl:"GENESIS",subLbl:"STARTER",cntLbl:"5 CARDS · MULTI-SPORT",
      dots:["#6688ff","#22aa55","rgba(255,255,255,0.15)","rgba(255,255,255,0.08)"],badge:null,stars:false,isHobby:false},
    nfl:{W:90,H:121,dep:14,fTop:"#1a4acc",fBot:"#060e30",rSide:"#040c20",tFace:"#2255ee",hd:"#1a44cc",hdIsGold:false,
      topLbl:"NFL · FIELD PASS",hdFs:9,mainLbl:"NFL",subLbl:"FIELD PASS",cntLbl:"4 CARDS · NFL ONLY",
      dots:["#6688ff","rgba(255,255,255,0.15)","rgba(255,255,255,0.1)","rgba(255,255,255,0.07)"],badge:null,stars:false,isHobby:false},
    nba:{W:90,H:121,dep:14,fTop:"#cc0018",fBot:"#2e0005",rSide:"#1a0003",tFace:"#cc0018",hd:"#cc0018",hdIsGold:false,
      topLbl:"NBA · COURT PASS",hdFs:9,mainLbl:"NBA",subLbl:"COURT PASS",cntLbl:"4 CARDS · NBA ONLY",
      dots:["#ff4455","rgba(255,255,255,0.15)","rgba(255,255,255,0.1)","rgba(255,255,255,0.07)"],badge:null,stars:false,isHobby:false},
    mlb:{W:90,H:121,dep:14,fTop:"#1040aa",fBot:"#020a1e",rSide:"#010614",tFace:"#1040aa",hd:"#1040aa",hdIsGold:false,
      topLbl:"MLB · DIAMOND PASS",hdFs:9,mainLbl:"MLB",subLbl:"DIAMOND",cntLbl:"4 CARDS · MLB ONLY",
      dots:["#4488ff","rgba(255,255,255,0.15)","rgba(255,255,255,0.1)","rgba(255,255,255,0.07)"],badge:null,stars:false,isHobby:false},
    mls:{W:90,H:121,dep:14,fTop:"#187730",fBot:"#031808",rSide:"#021008",tFace:"#187730",hd:"#187730",hdIsGold:false,
      topLbl:"MLS · PITCH PASS",hdFs:9,mainLbl:"MLS",subLbl:"PITCH PASS",cntLbl:"4 CARDS · MLS ONLY",
      dots:["#22cc55","rgba(255,255,255,0.15)","rgba(255,255,255,0.1)","rgba(255,255,255,0.07)"],badge:null,stars:false,isHobby:false},
    college:{W:90,H:121,dep:14,fTop:"#cc5500",fBot:"#0a0400",rSide:"#060200",tFace:"#cc5500",hd:"#cc5500",hdIsGold:false,
      topLbl:"COLLEGE FANATICS",hdFs:9,mainLbl:"NCAAF",subLbl:"FANATICS",cntLbl:"4 CARDS · COLLEGE",
      dots:["#ffaa55","rgba(255,255,255,0.15)","rgba(255,255,255,0.1)","rgba(255,255,255,0.07)"],badge:null,stars:false,isHobby:false},
    standard:{W:104,H:139,dep:16,fTop:"#1a3388",fBot:"#040c20",rSide:"#020814",tFace:"#1a3388",hd:"#1a3388",hdIsGold:false,
      topLbl:"STANDARD · PRO CASE",hdFs:10,mainLbl:"STANDARD",subLbl:"PRO CASE",cntLbl:"5 CARDS · RARE+",
      dots:["#6688ff","#22aa55","rgba(200,168,0,0.7)","rgba(255,255,255,0.14)","rgba(255,255,255,0.08)"],badge:null,stars:false,isHobby:false},
    jumbo:{W:122,H:160,dep:18,fTop:"#7733cc",fBot:"#080220",rSide:"#040114",tFace:"#7733cc",hd:"#7733cc",hdIsGold:false,
      topLbl:"DIVISION JUMBO",hdFs:11,mainLbl:"DIVISION",subLbl:"JUMBO",cntLbl:"10 CARDS · ELITE+",
      dots:["#6688ff","#22aa55","#c8a800","#e8161e","rgba(255,255,255,0.15)","rgba(255,255,255,0.08)"],badge:null,stars:false,isHobby:false},
    blaster:{W:130,H:152,dep:20,fTop:"#7733cc",fBot:"#150833",rSide:"#0c0422",tFace:"#7733cc",hd:"#7733cc",hdIsGold:false,
      topLbl:"BLASTER BOX · 12 CARDS",hdFs:11,mainLbl:"BLASTER",subLbl:"BOX",cntLbl:"12 CARDS · BUNDLE",
      dots:["#6688ff","#22aa55","#c8a800","#e8161e","rgba(255,255,255,0.14)","rgba(255,255,255,0.08)"],badge:"BUNDLE",stars:false,isHobby:false},
    megabox:{W:154,H:172,dep:24,fTop:"#0066bb",fBot:"#001022",rSide:"#000c18",tFace:"#0066bb",hd:"#0066bb",hdIsGold:false,
      topLbl:"MEGA BOX · 30 CARDS",hdFs:13,mainLbl:"MEGA",subLbl:"BOX",cntLbl:"30 CARDS · MEGA VALUE",
      dots:["#6688ff","#22aa55","#c8a800","#e8161e","#7733cc","rgba(255,255,255,0.15)"],badge:"MEGA VALUE",stars:true,isHobby:false},
    hobbybox:{W:184,H:189,dep:28,fTop:"#ff4422",fBot:"#0a0200",rSide:"#060100",tFace:"#bb2200",hd:"gold",hdIsGold:true,
      topLbl:"HOBBY BOX · 60 CARDS",hdFs:16,mainLbl:"HOBBY",subLbl:"BOX",cntLbl:"60 CARDS",
      dots:["#6688ff","#22aa55","#c8a800","#e8161e","#7733cc","rgba(255,255,255,0.62)"],badge:"LEGACY GTD",stars:true,isHobby:true},
  };
  var d=pd[packId]||pd.standard;
  var W=d.W; var H=d.H; var dep=d.dep;
  // Scale factor: render at native size, scale SVG to match size prop
  var scale=size/(W*1.0);
  var vbW=W+dep+12; var vbH=H+dep+8;
  var svgW=Math.round(vbW*scale); var svgH=Math.round(vbH*scale);
  // Front face position inside viewBox
  var fx=8; var fy=dep+4;
  var cx=fx+W/2; // horizontal center of front face
  // 3D faces
  var t1x=fx; var t1y=fy;
  var t2x=fx+W; var t2y=fy;
  var t3x=fx+W+dep; var t3y=4;
  var t4x=fx+dep; var t4y=4;
  var r1x=fx+W; var r1y=fy;
  var r2x=fx+W+dep; var r2y=4;
  var r3x=fx+W+dep; var r3y=4+H;
  var r4x=fx+W; var r4y=fy+H;
  // Dots: evenly spaced, verified inside front face [fx+13 .. fx+W-8]
  var nDots=d.dots.length;
  var dotSpacing=Math.min(13,(W-24)/(nDots-1||1));
  var dotCX=cx; var dotY=fy+H-12;
  var dot0X=dotCX-(nDots-1)*dotSpacing/2;
  var hdH=d.isHobby?28:22;
  var panelX=fx+14; var panelY=fy+hdH+5;
  var panelW=W-16; var panelH=H-hdH-30;
  // Clamp all text font sizes so text width < container
  // Barlow Condensed: chars × fs × 0.52 = approx width
  function fitFs(text,maxW,requested){return Math.min(requested,Math.floor(maxW/(text.length*0.52)));}
  var mainFs=fitFs(d.mainLbl,panelW-8,12);
  var subFs=fitFs(d.cntLbl,panelW-8,8);
  var cdFs=Math.min(Math.round(panelH*0.4),Math.floor(panelW*0.48));
  var topLblFs=fitFs(d.topLbl,W-4,7);
  var hdFs=fitFs("CARD DYNASTY",W-16,d.hdFs);
  var badgeW=Math.min(panelW-4,70); var badgeH=14;
  var badgeFs=d.badge?fitFs(d.badge,badgeW-6,9):9;
  return (
    <div onClick={onClick} className={shaking?"pack-shake":floating?"pack-float":""}
      style={{cursor:onClick?"pointer":"default",position:"relative",width:svgW,height:svgH,flexShrink:0}}>
      <svg width={svgW} height={svgH} viewBox={"0 0 "+vbW+" "+vbH}
        style={{display:"block",overflow:"visible",filter:"drop-shadow(0 4px 14px rgba(0,0,0,0.45))"}}>
        <defs>
          {d.isHobby&&<linearGradient id={"hbgold_"+packId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a5200"/><stop offset="35%" stopColor="#f5c518"/>
            <stop offset="65%" stopColor="#ffe566"/><stop offset="100%" stopColor="#7a5200"/>
          </linearGradient>}
          {d.isHobby&&<linearGradient id={"hbstripe_"+packId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ee4400"/><stop offset="50%" stopColor="#bb2200"/><stop offset="100%" stopColor="#ee4400"/>
          </linearGradient>}
          <linearGradient id={"front_"+packId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.fTop}/><stop offset="100%" stopColor={d.fBot}/>
          </linearGradient>
          <clipPath id={"fc_"+packId}><rect x={fx} y={fy} width={W} height={H}/></clipPath>
        </defs>
        {/* ground shadow */}
        <ellipse cx={cx} cy={fy+H+dep*0.55} rx={W*0.44} ry={dep*0.32} fill="rgba(0,0,0,0.16)"/>
        {/* RIGHT face */}
        <path d={"M"+r1x+","+r1y+" L"+r2x+","+r2y+" L"+r3x+","+r3y+" L"+r4x+","+r4y+" Z"} fill={d.rSide}/>
        <line x1={r2x} y1={r2y} x2={r3x} y2={r3y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        {/* TOP face */}
        <path d={"M"+t1x+","+t1y+" L"+t2x+","+t2y+" L"+t3x+","+t3y+" L"+t4x+","+t4y+" Z"} fill={d.tFace}/>
        <line x1={t4x} y1={t4y} x2={t3x} y2={t3y} stroke="rgba(255,255,255,0.22)" strokeWidth="0.7"/>
        {/* top face label — font clamped, centered in top face */}
        <text x={(t4x+t3x)/2} y={(t4y+t3y)/2+0.5} textAnchor="middle" dominantBaseline="middle"
          fontSize={topLblFs} fontWeight="700" fill="rgba(255,255,255,0.85)" letterSpacing="0.7">{d.topLbl}</text>
        {/* FRONT face */}
        <rect x={fx} y={fy} width={W} height={H} fill={"url(#front_"+packId+")"}/>
        {/* Star field motif — Mega/Hobby */}
        {d.stars&&[[0.18,0.14,1],[0.5,0.07,0.8],[0.78,0.17,0.6],[0.32,0.27,0.5],[0.88,0.09,0.7],[0.12,0.34,0.4],[0.62,0.36,0.6]].map(function(s,i){
          return <circle key={i} cx={fx+s[0]*W} cy={fy+s[1]*H} r={s[2]} fill="white" opacity={s[2]*0.45} clipPath={"url(#fc_"+packId+")"}/>;
        })}
        {/* Hobby nebula */}
        {d.isHobby&&<>
          <circle cx={fx+W*0.36} cy={fy+H*0.46} r={W*0.26} fill="rgba(255,40,0,0.05)" clipPath={"url(#fc_"+packId+")"}/>
          <circle cx={fx+W*0.68} cy={fy+H*0.53} r={W*0.20} fill="rgba(200,20,0,0.04)" clipPath={"url(#fc_"+packId+")"}/>
        </>}
        {/* HEADER BAND */}
        <rect x={fx} y={fy} width={W} height={hdH}
          fill={d.isHobby?"url(#hbgold_"+packId+")":d.hd} clipPath={"url(#fc_"+packId+")"}/>
        <line x1={fx} y1={fy+hdH} x2={fx+W} y2={fy+hdH}
          stroke={d.isHobby?"rgba(255,220,100,0.4)":"rgba(255,255,255,0.22)"} strokeWidth="0.8"/>
        <text x={cx} y={fy+hdH/2} textAnchor="middle" dominantBaseline="middle"
          fontSize={hdFs} fontWeight="900" fill={d.isHobby?"#1a0600":"white"} letterSpacing="1.5">CARD DYNASTY</text>
        {/* LEFT STRIPE */}
        <rect x={fx} y={fy+hdH} width={11} height={H-hdH}
          fill={d.isHobby?"url(#hbstripe_"+packId+")":d.hd} opacity="0.65" clipPath={"url(#fc_"+packId+")"}/>
        <rect x={fx} y={fy+hdH} width={3} height={H-hdH}
          fill={d.isHobby?"#ff5522":"rgba(255,255,255,0.18)"} opacity="0.45" clipPath={"url(#fc_"+packId+")"}/>
        {/* INNER PANEL */}
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx="1" fill="rgba(0,0,0,0.42)" clipPath={"url(#fc_"+packId+")"}/>
        <text x={panelX+panelW/2} y={panelY+panelH*0.3} textAnchor="middle" dominantBaseline="middle"
          fontSize={mainFs} fontWeight="900" fill="rgba(255,255,255,0.58)" letterSpacing="1.5">{d.mainLbl}</text>
        <text x={panelX+panelW/2} y={panelY+panelH*0.65} textAnchor="middle" dominantBaseline="middle"
          fontSize={cdFs} fontWeight="900" fill="white">CD</text>
        <text x={panelX+panelW/2} y={panelY+panelH*0.88} textAnchor="middle" dominantBaseline="middle"
          fontSize={subFs} fontWeight="700" fill="rgba(255,255,255,0.4)" letterSpacing="0.8">{d.cntLbl}</text>
        {/* BADGE */}
        {d.badge&&<>
          <rect x={cx-badgeW/2} y={fy+H-badgeH-14} width={badgeW} height={badgeH}
            fill={d.isHobby?"url(#hbgold_"+packId+")":"rgba(153,51,255,0.9)"} clipPath={"url(#fc_"+packId+")"}/>
          <text x={cx} y={fy+H-14-badgeH/2} textAnchor="middle" dominantBaseline="middle"
            fontSize={badgeFs} fontWeight="900" fill={d.isHobby?"#1a0600":"white"} letterSpacing="0.8">{d.badge}</text>
        </>}
        {/* RARITY DOTS — all verified inside [fx+13 .. fx+W-8] */}
        {d.dots.map(function(fill,i){
          return <circle key={i} cx={dot0X+i*dotSpacing} cy={dotY} r="3.5" fill={fill} clipPath={"url(#fc_"+packId+")"}/>;
        })}
        {/* front border + edge highlights */}
        <rect x={fx} y={fy} width={W} height={H} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8"/>
        <line x1={fx} y1={fy} x2={fx} y2={fy+H} stroke="rgba(255,255,255,0.2)" strokeWidth="1.3"/>
        <line x1={fx} y1={fy} x2={fx+W} y2={fy} stroke="rgba(255,255,255,0.16)" strokeWidth="0.8"/>
      </svg>
    </div>
  );
}

// ── GRADING LAB ────────────────────────────────────────────────────────────────
var GRADE_TIERS=[
  {grade:10,label:"GEM MINT",chance:0.05,multiplier:3,color:"#FFD700",glow:"rgba(255,215,0,0.9)",tier:"gem"},
  {grade:9, label:"MINT",    chance:0.15,multiplier:2,color:"#e8f4ff",glow:"rgba(200,230,255,0.8)",tier:"mint"},
  {grade:8, label:"NEAR MINT",chance:0.30,multiplier:1.5,color:"#34d399",glow:"rgba(52,211,153,0.7)",tier:"good"},
  {grade:7, label:"EX-MT",   chance:0.18,multiplier:1,color:"#93c5fd",glow:null,tier:"base"},
  {grade:6, label:"EX",      chance:0.13,multiplier:1,color:"#a78bfa",glow:null,tier:"base"},
  {grade:5, label:"VG-EX",   chance:0.08,multiplier:1,color:"#aabbdd",glow:null,tier:"base"},
  {grade:4, label:"VG",      chance:0.05,multiplier:1,color:"#8899bb",glow:null,tier:"base"},
  {grade:3, label:"GOOD",    chance:0.03,multiplier:1,color:"#8899bb",glow:null,tier:"base"},
  {grade:2, label:"FAIR",    chance:0.02,multiplier:1,color:"#8899bb",glow:null,tier:"base"},
  {grade:1, label:"POOR",    chance:0.01,multiplier:1,color:"#666",glow:null,tier:"base"},
];
function rollGrade(){
  var r=Math.random();
  var cum=0;
  for(var i=0;i<GRADE_TIERS.length;i++){
    cum+=GRADE_TIERS[i].chance;
    if(r<cum) return GRADE_TIERS[i];
  }
  return GRADE_TIERS[GRADE_TIERS.length-1];
}
// Vanilla confetti — no external library needed
function burstConfetti(colors){
  var canvas=document.createElement("canvas");
  canvas.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  var ctx=canvas.getContext("2d");
  var pieces=Array.from({length:120},function(){
    return {x:Math.random()*canvas.width,y:-20,vx:(Math.random()-0.5)*8,vy:Math.random()*6+3,
      rot:Math.random()*360,vr:(Math.random()-0.5)*12,w:rand(6,14),h:rand(4,8),
      color:colors[Math.floor(Math.random()*colors.length)],opacity:1};
  });
  var frame=0;
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(function(p){
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; p.rot+=p.vr; p.opacity-=0.008;
      if(p.opacity<=0) return;
      ctx.save(); ctx.globalAlpha=p.opacity;
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    frame++;
    if(frame<160&&pieces.some(function(p){return p.opacity>0;})){
      requestAnimationFrame(tick);
    } else {
      document.body.removeChild(canvas);
    }
  }
  requestAnimationFrame(tick);
}

function AcrylicSlab(props){
  var card=props.card; var gradeTier=props.gradeTier; var compact=props.compact||false;
  var col=getColors(card.team)[0];
  var isGem=gradeTier.tier==="gem"; var isMint=gradeTier.tier==="mint"; var isGood=gradeTier.tier==="good";
  var labelBg=isGem?"linear-gradient(90deg,#7a5500,#ffd700,#b8860b)":isMint?"linear-gradient(90deg,#1a3a6a,#4488cc,#1a3a6a)":isGood?"linear-gradient(90deg,#0a3020,#22aa66,#0a3020)":"linear-gradient(90deg,#1a1a2e,#2a2a4a,#1a1a2e)";
  var labelColor=isGem?"#000":"#fff";
  var outerGlow=isGem?"0 0 40px rgba(255,215,0,0.5),0 0 80px rgba(255,215,0,0.2)":isMint?"0 0 30px rgba(200,230,255,0.3)":isGood?"0 0 20px rgba(52,211,153,0.25)":"none";
  var W=compact?140:178; var H=compact?198:250;
  return (
    <div className={"acrylic-slab"+(compact?"":" slab-reveal")} style={{width:W,padding:"0 0 10px",boxShadow:outerGlow+",inset 0 1px 0 rgba(255,255,255,0.25),0 24px 60px rgba(0,0,0,0.8)"}}>
      {/* Label bar */}
      <div style={{background:labelBg,padding:"6px 10px 5px",borderRadius:"17px 17px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:compact?9:11,fontWeight:900,color:labelColor,letterSpacing:"0.15em",textTransform:"uppercase"}}>CD Authentic</span>
          {(isGem||isMint)&&<span style={{fontSize:compact?7:9,color:isGem?"#7a5500":"rgba(255,255,255,0.6)",fontWeight:700}}>★</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span className={isGem?"slab-gem":""} style={{fontFamily:"'Oswald',sans-serif",fontSize:compact?10:13,fontWeight:900,color:gradeTier.color,letterSpacing:"0.1em",textTransform:"uppercase"}}>{gradeTier.label}</span>
          <div className={"grade-pop"} style={{background:isGem?"#000":labelColor==="#000"?"#000":"rgba(0,0,0,0.6)",borderRadius:999,minWidth:compact?20:26,height:compact?20:26,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid "+gradeTier.color}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:compact?10:13,color:gradeTier.color}}>{gradeTier.grade}</span>
          </div>
        </div>
      </div>
      {/* Card inside slab */}
      <div style={{padding:"6px 8px 4px",position:"relative"}}>
        <div style={{borderRadius:10,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.6)"}}>
          <PremiumCard card={card} isWinner={false}/>
        </div>
        {/* Multiplier badge */}
        {gradeTier.multiplier>1&&(
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:isGem?"linear-gradient(90deg,#7a5500,#ffd700)":isMint?"linear-gradient(90deg,#1a3a6a,#4488cc)":"linear-gradient(90deg,#0a3020,#22aa66)",borderRadius:999,padding:"3px 12px",whiteSpace:"nowrap",zIndex:5,boxShadow:"0 2px 12px rgba(0,0,0,0.7)"}}>
            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:compact?9:11,fontWeight:900,color:isGem?"#000":"#fff",letterSpacing:"0.1em"}}>⚡ {gradeTier.multiplier}× YIELD</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GradingLab(props){
  var inventory=props.inventory; var balance=props.balance; var userId=props.userId;
  var onGrade=props.onGrade; // (card, gradeTier) => void
  var onBack=props.onBack;
  var phaseState=useState("selection"); var phase=phaseState[0]; var setPhase=phaseState[1];
  var selectedState=useState(null); var selected=selectedState[0]; var setSelected=selectedState[1];
  var resultState=useState(null); var result=resultState[0]; var setResult=resultState[1];
  var sealBrokenState=useState(false); var sealBroken=sealBrokenState[0]; var setSealBroken=sealBrokenState[1];
  var lightLeakState=useState(false); var lightLeak=lightLeakState[0]; var setLightLeak=lightLeakState[1];
  var shakeState=useState(false); var shakeActive=shakeState[0]; var setShakeActive=shakeState[1];
  var errState=useState(""); var err=errState[0]; var setErr=errState[1];
  var COST=500;
  var eligible=inventory.filter(function(c){return !c.graded;});

  function submitCard(){
    if(!selected||balance<COST){setErr(balance<COST?"Not enough coins (need 500)":"Select a card first");return;}
    setErr("");
    setPhase("sealing");
    setTimeout(function(){setPhase("ready");},900);
  }

  function breakSeal(){
    if(sealBroken) return;
    setSealBroken(true);
    setPhase("revealing");
    setLightLeak(true);
    setTimeout(function(){setLightLeak(false);},600);
    var tier=rollGrade();
    setTimeout(function(){
      setResult(tier);
      setPhase("result");
      onGrade(selected,tier);
      if(tier.tier==="gem"||tier.tier==="mint"){
        setTimeout(function(){burstConfetti(["#FFD700","#FFFFFF","#FFF8C0","#FFE066"]);},200);
        if(tier.tier==="gem"){
          setShakeActive(true);
          setTimeout(function(){setShakeActive(false);},450);
        }
      }
    },850);
  }

  function reset(){
    setPhase("selection");setSelected(null);setResult(null);setSealBroken(false);setLightLeak(false);setShakeActive(false);setErr("");
  }

  // ── SELECTION PHASE ──────────────────────────────────────────────────────
  if(phase==="selection"){
    return (
      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:999,padding:"7px 16px",color:"#8899bb",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>← Back</button>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",color:"#fff"}}>Grading Lab</div>
            <div style={{fontSize:13,color:"#8899bb",marginTop:2}}>Submit a card for professional grading · 500 coins</div>
          </div>
        </div>
        {/* Cost / info banner */}
        <div style={{background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:14,padding:"14px 18px",marginBottom:24,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
          {GRADE_TIERS.slice(0,3).map(function(t){
            return <div key={t.grade} style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:t.color,boxShadow:"0 0 8px "+t.color}}/>
              <span style={{fontFamily:"'Oswald',sans-serif",fontSize:13,color:t.color,fontWeight:700}}>Grade {t.grade}</span>
              <span style={{fontSize:12,color:"#8899bb"}}>{t.label} · <span style={{color:"#34d399"}}>+{((t.multiplier-1)*100).toFixed(0)}% yield</span> · {(t.chance*100).toFixed(0)}% chance</span>
            </div>;
          })}
        </div>
        {eligible.length===0
          ?<div style={{textAlign:"center",padding:60,color:"#8899bb"}}><div style={{fontSize:32,marginBottom:12}}>🔬</div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,textTransform:"uppercase"}}>No eligible cards</div><div style={{fontSize:13,marginTop:6}}>All cards already graded</div></div>
          :<div>
            <div style={{fontSize:13,color:"#8899bb",marginBottom:12,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.12em"}}>Choose a card to submit</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(178px,1fr))",gap:16,marginBottom:24}}>
              {eligible.map(function(c){
                var sel=selected&&selected.id===c.id;
                return <div key={c.id} onClick={function(){setSelected(c);setErr("");}} style={{position:"relative",cursor:"pointer",borderRadius:16,border:"2px solid "+(sel?"#FFD700":"transparent"),boxShadow:sel?"0 0 24px rgba(255,215,0,0.4)":"none",transition:"all 0.18s",transform:sel?"scale(1.03)":"scale(1)"}}>
                  {sel&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",zIndex:10,background:"#FFD700",color:"#000",fontSize:11,fontWeight:900,padding:"2px 10px",borderRadius:999,fontFamily:"'Oswald',sans-serif",whiteSpace:"nowrap"}}>Selected ✓</div>}
                  <PremiumCard card={c}/>
                </div>;
              })}
            </div>
            {err&&<div style={{textAlign:"center",color:"#f87171",fontSize:13,marginBottom:10,fontWeight:700}}>{err}</div>}
            <button onClick={submitCard} disabled={!selected||balance<COST} style={{width:"100%",padding:"14px",borderRadius:999,border:"none",fontSize:15,fontWeight:900,cursor:selected&&balance>=COST?"pointer":"not-allowed",background:selected&&balance>=COST?"linear-gradient(135deg,#4a0010,#cc0022,#880011)":"rgba(255,255,255,0.05)",color:selected&&balance>=COST?"#fff":"#8899bb",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.12em",opacity:selected&&balance>=COST?1:0.5}}>
              Submit for Grading · 500 Coins
            </button>
          </div>}
      </div>
    );
  }

  // ── SEALING / READY / REVEALING / RESULT PHASES ─────────────────────────
  return (
    <div className={shakeActive?"screen-shake":""} style={{minHeight:"70vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",position:"relative"}}>
      {/* Light leak overlay */}
      {lightLeak&&<div className="light-leak" style={{position:"fixed",inset:0,zIndex:200,background:"linear-gradient(90deg,transparent 0%,rgba(255,240,180,0.85) 40%,rgba(255,255,255,0.95) 50%,rgba(255,240,180,0.85) 60%,transparent 100%)",pointerEvents:"none"}}/>}

      {/* GEM MINT hype text */}
      {phase==="result"&&result&&result.tier==="gem"&&(
        <div style={{position:"fixed",top:"15%",left:0,right:0,textAlign:"center",zIndex:150,pointerEvents:"none"}}>
          <div className="slab-gem" style={{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:900,color:"#FFD700",letterSpacing:"0.3em",textTransform:"uppercase"}}>GEM MINT 💎</div>
        </div>
      )}

      {/* Phase label */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:700,color:"#8899bb",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:6}}>
          {phase==="sealing"?"Sealing Your Card":phase==="ready"?"Break the Seal to Reveal":phase==="revealing"?"Processing...":"Graded Result"}
        </div>
        {phase==="ready"&&<div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Click the wax seal to open the envelope</div>}
      </div>

      {/* ENVELOPE — shown during sealing / ready / revealing */}
      {(phase==="sealing"||phase==="ready"||phase==="revealing")&&(
        <div style={{position:"relative",width:220,height:280,marginBottom:32}}>
          {/* Envelope body */}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#0a0a12,#111118,#0a0a12)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 20px 60px rgba(0,0,0,0.9),0 0 0 1px rgba(255,255,255,0.04)",overflow:"hidden"}}>
            {/* Glossy sheen */}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 50%,rgba(255,255,255,0.02) 100%)"}}/>
            {/* V-fold lines */}
            <svg width="220" height="280" style={{position:"absolute",inset:0,pointerEvents:"none"}} viewBox="0 0 220 280">
              <line x1="0" y1="0" x2="110" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <line x1="220" y1="0" x2="110" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <line x1="0" y1="280" x2="110" y2="170" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              <line x1="220" y1="280" x2="110" y2="170" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </svg>
            {/* Embossed CD watermark */}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Oswald',sans-serif",fontSize:48,fontWeight:900,color:"rgba(255,255,255,0.03)",letterSpacing:4,userSelect:"none",pointerEvents:"none"}}>CD</div>
          </div>
          {/* Flap — animates open on reveal */}
          <div className={sealBroken?"envelope-flap":""} style={{position:"absolute",top:0,left:0,right:0,height:"45%",background:"linear-gradient(160deg,#0c0c16,#13131f)",borderRadius:"12px 12px 0 0",transformOrigin:"top center",zIndex:5,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"110px solid transparent",borderRight:"110px solid transparent",borderTop:"60px solid #0a0a12"}}/>
          </div>
          {/* Wax seal — the interaction point */}
          {!sealBroken&&phase==="ready"&&(
            <div onClick={breakSeal} className="sealPulse" style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",zIndex:20,cursor:"pointer",width:58,height:58,borderRadius:"50%",background:"radial-gradient(circle at 35% 30%,#ff3300,#880000)",boxShadow:"0 0 16px #cc0000,0 0 32px #660000,inset 0 2px 4px rgba(255,100,50,0.4)",animation:"sealPulse 1.5s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(255,80,40,0.6)"}}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <path d="M14,2 L17,10 L26,10 L19,16 L22,24 L14,18 L6,24 L9,16 L2,10 L11,10 Z" fill="rgba(255,200,150,0.8)" stroke="rgba(255,150,80,0.5)" strokeWidth="0.5"/>
              </svg>
            </div>
          )}
          {/* Broken seal shards */}
          {sealBroken&&(
            <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",zIndex:20,pointerEvents:"none"}}>
              {[0,60,120,180,240,300].map(function(deg){
                return <div key={deg} style={{position:"absolute",width:8,height:8,background:"#cc0000",borderRadius:2,animation:"particle 0.5s ease-out "+deg+"ms forwards","--tx":(Math.cos(deg*Math.PI/180)*40)+"px","--ty":(Math.sin(deg*Math.PI/180)*40)+"px",opacity:0}}/>;
              })}
            </div>
          )}
        </div>
      )}

      {/* RESULT — acrylic slab reveal */}
      {phase==="result"&&selected&&result&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <AcrylicSlab card={selected} gradeTier={result}/>
          <div style={{textAlign:"center"}}>
            {result.multiplier>1
              ?<div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,color:"#34d399",fontWeight:700,marginBottom:4}}>Your {selected.team} card now earns <span style={{color:result.color}}>{result.multiplier}× daily yield</span></div>
              :<div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,color:"#8899bb",marginBottom:4}}>Standard grade — no yield change</div>}
            <div style={{fontSize:13,color:"#555",marginBottom:16}}>500 coins deducted</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={reset} style={{padding:"11px 24px",borderRadius:999,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",color:"#8899bb",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Grade Another</button>
              <button onClick={onBack} style={{padding:"11px 24px",borderRadius:999,border:"none",background:"linear-gradient(135deg,#7a5500,#f5c518)",color:"#000",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Back to Vault</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HowToPlayModal(props) {
  var onClose=props.onClose;
  var steps=[
    {
      icon:"📦",
      color:"#f5c518",
      title:"Open Packs, Build Your Collection",
      body:"Spend coins in the Shop to open booster packs. Each pack contains sports cards across NFL, NBA, MLB, MLS, and College. Rarer cards — Elite, Legacy, Legendary, Dynasty — earn significantly more coins per day.",
    },
    {
      icon:"🪙",
      color:"#34d399",
      title:"Every Card Earns Daily Coins",
      body:"Your collection generates passive income automatically. Check back each day and hit Game Day to collect your earnings. The more cards you own, and the rarer they are, the more coins you earn.",
    },
    {
      icon:"🔴",
      color:"#f87171",
      title:"Live Scores Boost Your Cards",
      body:"When a real game is happening, cards for that team glow and earn 1.5× their normal yield. Open the Live tab to see real-time scores for NBA, MLB, and MLS games happening right now.",
    },
    {
      icon:"📈",
      color:"#a78bfa",
      title:"Trade on the Exchange",
      body:"List cards you don't need on the Exchange and earn coins when they sell. Buy rare cards from other collectors to strengthen your dynasty. The goal: build the highest-yielding collection on the leaderboard.",
    },
  ];
  var stepState=useState(0); var step=stepState[0]; var setStep=stepState[1];
  var isLast=step===steps.length-1;
  var s=steps[step];
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",border:"1px solid #e0ddd8",maxWidth:440,width:"100%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
        <div style={{background:"#e8161e",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff"}}>CARD <span style={{color:"rgba(255,255,255,0.8)"}}>DYNASTY</span></div>
          <div style={{display:"flex",gap:4}}>
            {steps.map(function(_,i){return <div key={i} style={{width:i===step?20:6,height:6,background:i<=step?"#fff":"rgba(255,255,255,0.3)",transition:"all 0.25s"}}/>;}) }
          </div>
        </div>
        <div style={{padding:"24px 24px"}}>
          <div key={step} className="popup-anim" style={{textAlign:"center",marginBottom:24,minHeight:140}}>
            <div style={{fontSize:40,marginBottom:12}}>{s.icon}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",marginBottom:8}}>{s.title}</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#555",lineHeight:1.65,maxWidth:360,margin:"0 auto"}}>{s.body}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {step>0&&(
              <button onClick={function(){setStep(function(s){return s-1;});}}
                style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"12px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>← Back</button>
            )}
            <button onClick={isLast?onClose:function(){setStep(function(s){return s+1;});}}
              className={isLast?"topps-btn-primary":""} 
              style={isLast?{flex:2,fontSize:14,padding:"12px",clipPath:"none",borderRadius:0}:{flex:2,background:"#111",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,padding:"12px",border:"none",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {isLast?"Let's Go! →":"Next →"}
            </button>
          </div>
          {!isLast&&<button onClick={onClose} style={{width:"100%",marginTop:8,background:"none",border:"none",fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#aaa",cursor:"pointer",textDecoration:"underline"}}>Skip intro</button>}
        </div>
      </div>
    </div>
  );
}

function DailyLoginModal(props) {
  var onClaim=props.onClaim; var onClose=props.onClose; var streakData=props.streakData;
  var currentStreak=streakData.currentStreak||1;
  var dayIdx=Math.min(currentStreak,7)-1;
  var reward=STREAK_REWARDS[dayIdx];
  var claimedState=useState(false); var claimed=claimedState[0]; var setClaimed=claimedState[1];
  var partState=useState(false); var particles=partState[0]; var setParticles=partState[1];
  var goldPts=Array.from({length:40},function(_,i){return {id:i,tx:rand(-200,200),ty:rand(-300,-50),size:rand(6,14),color:["#f5c518","#fbbf24","#fde68a","#ffe066"][rand(0,3)],delay:rand(0,400),dur:rand(700,1300)};});
  // Detect if today's reward has already been claimed
  var today=new Date().toDateString();
  var alreadyClaimedToday=(streakData.claimedDays||[]).includes(today);
  // Compute midnight countdown
  var now=new Date();
  var midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  var msLeft=midnight-now;
  var hLeft=Math.floor(msLeft/3600000);
  var mLeft=Math.floor((msLeft%3600000)/60000);
  var timeUntilReset=hLeft+"h "+mLeft+"m";
  function claim(){
    setClaimed(true); setParticles(true);
    setTimeout(function(){setParticles(false);},2000);
    setTimeout(function(){onClaim(reward);},600);
  }

  // ── ALREADY CLAIMED STATE ─────────────────────────────────────────────────
  if(alreadyClaimedToday){
    var nextDayIdx=Math.min(currentStreak,6);
    var nextReward=STREAK_REWARDS[nextDayIdx];
    return (
      <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)"}}>
        <div style={{background:"#fff",border:"1px solid #e0ddd8",maxWidth:360,width:"94%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
          <div style={{background:"#22aa44",padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",marginBottom:4}}>Already Collected</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff"}}>Come Back Tomorrow</div>
          </div>
          <div style={{padding:"20px 24px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
              <span style={{fontSize:16}}>🔥</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#333"}}>{currentStreak} Day Streak</span>
            </div>
            <div style={{border:"1px solid #e0ddd8",padding:"14px 16px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888",marginBottom:6}}>Next reward in</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:24,fontWeight:700,color:"#22aa44",marginBottom:10}}>{timeUntilReset}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <div style={{fontSize:22}}>{nextReward.icon}</div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>Day {nextDayIdx+1} — {nextReward.label}</div>
                  <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>Keep your streak alive!</div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="topps-btn-primary" style={{width:"100%",fontSize:14,padding:"13px",clipPath:"none",borderRadius:0}}>Back to Collection</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)"}}>
      {particles&&(
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:2100,overflow:"hidden"}}>
          {goldPts.map(function(p){return <div key={p.id} style={{position:"absolute",left:"50%",top:"50%",width:p.size,height:p.size,borderRadius:p.id%3===0?"50%":2,background:p.color,"--tx":p.tx+"px","--ty":p.ty+"px",animation:"particle "+p.dur+"ms ease-out "+p.delay+"ms forwards",opacity:0}}/>;})}
        </div>
      )}
      <div style={{background:"#fff",border:"1px solid #e0ddd8",maxWidth:400,width:"94%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
        <div style={{background:"#e8161e",padding:"16px 20px",textAlign:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:4}}>Daily Streak</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff",marginBottom:4}}>Welcome Back</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{fontSize:14}}>🔥</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{currentStreak} Day Streak</span>
          </div>
        </div>
        <div style={{padding:"20px 20px"}}>
          {/* Day grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:16}}>
            {STREAK_REWARDS.map(function(r,i){
              var isClaimed=i<dayIdx; var isCurrent=i===dayIdx; var isFuture=i>dayIdx;
              return (
                <div key={r.day} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:r.isDynasty?16:13,background:isClaimed?"#e8f5ec":isCurrent?"#fff0f0":"#f5f3f0",border:isClaimed?"1px solid #c8e8d0":isCurrent?"2px solid #e8161e":"1px solid #e0ddd8",opacity:isFuture?0.5:1}}>
                    {isClaimed?"✓":r.icon}
                  </div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,color:isCurrent?"#e8161e":isClaimed?"#22aa44":"#aaa",textTransform:"uppercase",letterSpacing:"0.04em"}}>D{r.day}</div>
                </div>
              );
            })}
          </div>
          {/* Today's reward */}
          <div style={{border:"1px solid #e8161e",padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,background:"#fff8f8"}}>
            <div style={{fontSize:28,flexShrink:0}}>{reward.icon}</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>Day {Math.min(currentStreak,7)} — {reward.label}</div>
              {reward.isDynasty&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>+ Guaranteed Elite Card</div>}
            </div>
          </div>
          {!claimed?(
            <button onClick={claim} className="topps-btn-primary" style={{width:"100%",fontSize:15,padding:"14px",clipPath:"none",borderRadius:0}}>
              Claim Day {Math.min(currentStreak,7)} Reward
            </button>
          ):(
            <button onClick={onClose} style={{width:"100%",background:"#22aa44",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",padding:"14px",border:"none",cursor:"pointer"}}>
              Claimed! Enter Collection →
            </button>
          )}
          {!claimed&&<button onClick={onClose} style={{width:"100%",marginTop:8,background:"none",border:"none",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa",cursor:"pointer",textDecoration:"underline"}}>Skip for now</button>}
        </div>
      </div>
    </div>
  );
}
function Notifications(props) {
  var notifs=props.notifs;
  return (
    <div style={{position:"fixed",top:80,right:12,zIndex:999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {notifs.map(function(n){
        var bg=n.type==="sale"?"#22aa44":n.type==="buy"?"#7733cc":"#e8161e";
        return (
          <div key={n.id} className="notif" style={{background:"#fff",borderLeft:"4px solid "+bg,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",padding:"10px 14px",maxWidth:260}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:bg,marginBottom:2}}>{n.title}</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555"}}>{n.msg}</div>
          </div>
        );
      })}
    </div>
  );
}
function QuickBuyModal(props) {
  var listing=props.listing; var balance=props.balance; var onConfirm=props.onConfirm; var onClose=props.onClose;
  var canAfford=balance>=listing.price;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",border:"1px solid #e0ddd8",maxWidth:320,width:"92%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
        <div style={{background:"#e8161e",padding:"12px 16px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff"}}>Confirm Purchase</div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
            <MiniCard card={listing.card}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",marginBottom:2}}>{listing.card.team}</div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888",marginBottom:8}}>{listing.card.sport} · {listing.seller}</div>
              <div style={{display:"flex",gap:6}}>
                <div style={{background:"#fffbeb",border:"1px solid #f5e0a0",padding:"4px 8px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Daily</div>
                  <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:"#c8a800"}}>{listing.card.daily}</div>
                </div>
                <div style={{background:"#fff0f0",border:"1px solid #f5c0c0",padding:"4px 8px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase"}}>Win</div>
                  <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:"#e8161e"}}>{listing.card.win}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{border:"1px solid #e8e8e8",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",borderBottom:"1px solid #f0f0f0"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#888",letterSpacing:"0.06em",textTransform:"uppercase"}}>Price</span>
              <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,color:"#111"}}>{fmt(listing.price)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#888",letterSpacing:"0.06em",textTransform:"uppercase"}}>Your Balance</span>
              <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:canAfford?"#22aa44":"#e8161e"}}>{fmt(balance)}</span>
            </div>
          </div>
          {!canAfford&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#e8161e",fontWeight:600,marginBottom:10,textAlign:"center"}}>Insufficient coins</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={canAfford?onConfirm:undefined} disabled={!canAfford} className="topps-btn-primary" style={{flex:2,fontSize:14,padding:"11px",clipPath:"none",borderRadius:0,opacity:canAfford?1:0.5}}>Buy Now</button>
            <button onClick={onClose} style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"11px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ListModal(props) {
  var card=props.card; var onConfirm=props.onConfirm; var onClose=props.onClose;
  var suggested=mkPrice(card.rarity);
  var priceState=useState(suggested); var price=priceState[0]; var setPrice=priceState[1];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",border:"1px solid #e0ddd8",maxWidth:300,width:"92%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
        <div style={{background:"#22aa44",padding:"12px 16px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff"}}>List for Sale</div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
            <MiniCard card={card}/>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>{card.team}</div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>{card.sport} · {card.rarity}</div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label className="topps-label">Your Price</label>
            <input type="number" value={price} onChange={function(e){setPrice(Math.max(1,parseInt(e.target.value)||0));}} className="topps-input" style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700}}/>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginTop:4}}>Suggested: {fmt(suggested)} coins</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={function(){onConfirm(price);}} style={{flex:2,background:"#22aa44",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,padding:"11px",border:"none",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))"}}>List for {fmt(price)}</button>
            <button onClick={onClose} style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"11px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE SETUP STEP ────────────────────────────────────────────────────────
// Step 2 of onboarding: username + favourite sport & team
function ProfileSetupStep(props) {
  var onComplete=props.onComplete;
  var usernameState=useState(""); var username=usernameState[0]; var setUsername=usernameState[1];
  var sportState=useState(""); var favSport=sportState[0]; var setFavSport=sportState[1];
  var teamState=useState(""); var favTeam=teamState[0]; var setFavTeam=teamState[1];
  var errState=useState(""); var err=errState[0]; var setErr=errState[1];

  var teamsForSport=favSport?ALL_TEAMS[favSport]||[]:[];

  function handleContinue() {
    if(!username.trim()){setErr("Please choose a username.");return;}
    if(username.trim().length<3){setErr("Username must be at least 3 characters.");return;}
    setErr("");
    onComplete({username:username.trim(),favSport:favSport,favTeam:favTeam});
  }

  return (
    <div style={{display:"flex",gap:40,maxWidth:860,width:"100%",alignItems:"flex-start",flexWrap:"wrap"}}>
      {/* Left info panel */}
      <div style={{flex:"1 1 260px",minWidth:240}} className="topps-reveal">
        <div className="topps-eyebrow" style={{marginBottom:12}}>Step 2 of 3</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(26px,5vw,38px)",fontWeight:900,letterSpacing:"0.02em",textTransform:"uppercase",color:"#111",lineHeight:0.95,marginBottom:16}}>
          Set Up Your<br/><em style={{color:"#e8161e",fontStyle:"normal"}}>Dynasty</em>
        </div>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#666",lineHeight:1.6,marginBottom:20}}>
          Your name becomes your identity on the leaderboard. Your favourite team gets guaranteed cards in your genesis pack.
        </div>
        {/* Step tracker */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{n:1,label:"Create Account",done:true},{n:2,label:"Build Your Dynasty",done:false,active:true},{n:3,label:"Open Genesis Pack",done:false}].map(function(s){
            return <div key={s.n} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:24,height:24,background:s.done?"#111":s.active?"#e8161e":"#ddd",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:900,color:s.done||s.active?"#fff":"#888"}}>{s.done?"✓":s.n}</span>
              </div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:s.active?"#e8161e":s.done?"#111":"#aaa"}}>{s.label}</span>
            </div>;
          })}
        </div>
      </div>

      {/* Right form */}
      <div style={{flex:"1 1 340px",minWidth:300,background:"#fff",border:"1px solid #e0ddd8",padding:"32px 28px"}} className="topps-reveal">
        <div style={{borderBottom:"3px solid #e8161e",paddingBottom:14,marginBottom:22}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>Your Collector Profile</div>
        </div>

        {/* Username */}
        <div style={{marginBottom:20}}>
          <label className="topps-label">Dynasty Name *</label>
          <div style={{position:"relative"}}>
            <input className="topps-input" value={username} onChange={function(e){setUsername(e.target.value);setErr("");}}
              placeholder="e.g. GrailHunter99" maxLength={20}
              style={{paddingRight:52,borderColor:username.length>=3?"#e8161e":"#ccc"}}/>
            <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,color:"#aaa"}}>{username.length}/20</span>
          </div>
        </div>

        {/* Sport pills */}
        <div style={{marginBottom:20}}>
          <label className="topps-label">Favourite Sport <span style={{fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:11,color:"#aaa"}}>(optional)</span></label>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {Object.keys(ALL_TEAMS).map(function(s){
              var active=favSport===s;
              var sc={NFL:"#1144cc",NBA:"#cc1133",MLB:"#1155bb",MLS:"#116611",College:"#cc5500"}[s]||"#888";
              return <button key={s} onClick={function(){setFavSport(active?"":s);setFavTeam("");}}
                style={{padding:"6px 14px",border:"1.5px solid "+(active?sc:sc+"55"),background:active?sc:"transparent",color:active?"#fff":sc,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.12s"}}>
                {s}
              </button>;
            })}
          </div>
        </div>

        {/* Team pills */}
        {favSport&&teamsForSport.length>0&&(
          <div style={{marginBottom:20}}>
            <label className="topps-label">Favourite Team</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:150,overflowY:"auto",paddingRight:4,paddingBottom:2}}>
              {teamsForSport.map(function(team){
                var active=favTeam===team;
                var col=getColors(team)[0];
                return <button key={team} onClick={function(){setFavTeam(active?"":team);}}
                  style={{padding:"5px 12px",border:"1.5px solid "+(active?col:col+"44"),background:active?col+"18":"transparent",color:active?"#111":"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:active?700:600,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.12s",display:"flex",alignItems:"center",gap:4}}>
                  {active&&<span style={{fontSize:10,color:col}}>✓</span>}{team}
                </button>;
              })}
            </div>
          </div>
        )}

        {err&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#e8161e",marginBottom:12,fontWeight:600}}>{err}</div>}

        <button onClick={handleContinue} className="topps-btn-primary" style={{width:"100%",fontSize:15,padding:"14px",clipPath:"none",borderRadius:0,marginBottom:10}}>
          Open My Genesis Pack →
        </button>
        <button onClick={function(){onComplete(null);}} style={{width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa",padding:"8px 0",textDecoration:"underline"}}>
          Skip — use defaults
        </button>
      </div>
    </div>
  );
}

// ── AUTH FORM ─────────────────────────────────────────────────────────────────
// Handles signup (post-genesis) and login modes.
// Google SSO uses standard OAuth2 redirect — swap GOOGLE_CLIENT_ID for your real
// client ID from console.cloud.google.com when connecting a backend.
var GOOGLE_CLIENT_ID=process.env.REACT_APP_GOOGLE_CLIENT_ID||"YOUR_GOOGLE_CLIENT_ID";

function AuthForm(props) {
  var mode=props.mode; var onComplete=props.onComplete; var cards=props.cards||[]; var onBack=props.onBack;
  var emailState=useState(""); var email=emailState[0]; var setEmail=emailState[1];
  var passState=useState(""); var pass=passState[0]; var setPass=passState[1];
  var nameState=useState(""); var name=nameState[0]; var setName=nameState[1];
  var errState=useState(""); var err=errState[0]; var setErr=errState[1];
  var loadState=useState(false); var loading=loadState[0]; var setLoading=loadState[1];
  var isSignup=mode==="signup";

  function handleGoogle() {
    if(!supabase){
      // No Supabase yet — use raw OAuth popup as fallback
      var redirectUri=window.location.origin+"/auth/callback";
      var params=["client_id="+GOOGLE_CLIENT_ID,"redirect_uri="+encodeURIComponent(redirectUri),"response_type=token","scope="+encodeURIComponent("openid email profile"),"prompt=select_account"].join("&");
      var googleUrl="https://accounts.google.com/o/oauth2/v2/auth?"+params;
      var w=500; var h=600;
      var left=Math.round(window.screenX+(window.outerWidth-w)/2);
      var top=Math.round(window.screenY+(window.outerHeight-h)/2);
      var popup=window.open(googleUrl,"google_oauth","width="+w+",height="+h+",left="+left+",top="+top+",toolbar=no,menubar=no");
      if(!popup){window.location.href=googleUrl;return;}
      setLoading(true);
      var timer=setInterval(function(){
        try{
          if(popup.closed){clearInterval(timer);setLoading(false);return;}
          var href=popup.location.href;
          if(href&&href.indexOf(window.location.origin)===0){
            var hash=popup.location.hash||popup.location.search;
            popup.close();clearInterval(timer);setLoading(false);
            if(hash&&(hash.indexOf("access_token")>=0||hash.indexOf("code=")>=0)){onComplete(cards,500);}
            else{setErr("Google sign-in was cancelled.");}
          }
        }catch(e){}
      },500);
      setTimeout(function(){clearInterval(timer);if(popup&&!popup.closed)popup.close();setLoading(false);},180000);
      return;
    }
    // Supabase handles the full OAuth flow — one line
    setLoading(true);
    sb(function(db){
      return db.auth.signInWithOAuth({
        provider:"google",
        options:{
          redirectTo:window.location.origin,
          queryParams:{access_type:"online",prompt:"select_account"},
        },
      });
    }).then(function(res){
      setLoading(false);
      if(res&&res.error) setErr(res.error.message||"Google sign-in failed.");
    });
  }

  function handleSubmit() {
    if(!email.trim()){setErr("Please enter your email.");return;}
    if(pass.length<6){setErr("Password must be at least 6 characters.");return;}
    if(isSignup&&!name.trim()){setErr("Please enter your name.");return;}
    setErr("");setLoading(true);
    if(!supabase){
      // No Supabase — prototype mode, just proceed
      setTimeout(function(){setLoading(false);onComplete(cards,500);},900);
      return;
    }
    if(isSignup){
      sb(function(db){
        return db.auth.signUp({email:email,password:pass,options:{data:{name:name}}});
      }).then(function(res){
        setLoading(false);
        if(res&&res.error){setErr(res.error.message||"Sign up failed.");return;}
        // Proceed immediately — no email confirmation required
        // (Make sure "Enable email confirmations" is OFF in Supabase Auth settings)
        onComplete(cards,500);
      });
    } else {
      sb(function(db){
        return db.auth.signInWithPassword({email:email,password:pass});
      }).then(function(res){
        setLoading(false);
        if(res&&res.error){setErr(res.error.message||"Sign in failed.");return;}
        onComplete(cards,500);
      });
    }
  }

  return (
    <div>
      {/* Google SSO */}
      <button onClick={handleGoogle} disabled={loading}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"#fff",color:"#1a1a1a",fontWeight:700,fontSize:14,padding:"12px 16px",border:"1.5px solid #ddd",cursor:loading?"not-allowed":"pointer",marginBottom:14,opacity:loading?0.7:1,fontFamily:"'Barlow',sans-serif",transition:"border-color 0.15s"}}>
        <svg width={18} height={18} viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {loading?"Connecting...":"Continue with Google"}
      </button>
      {/* Divider */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{flex:1,height:1,background:"#e8e8e8"}}/>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#aaa",letterSpacing:"0.2em",textTransform:"uppercase"}}>OR</span>
        <div style={{flex:1,height:1,background:"#e8e8e8"}}/>
      </div>
      {/* Inputs */}
      {isSignup&&<div style={{marginBottom:10}}>
        <label className="topps-label">Full Name</label>
        <input className="topps-input" value={name} onChange={function(e){setName(e.target.value);setErr("");}} placeholder="Your name"/>
      </div>}
      <div style={{marginBottom:10}}>
        <label className="topps-label">Email Address</label>
        <input className="topps-input" type="email" value={email} onChange={function(e){setEmail(e.target.value);setErr("");}} placeholder="you@example.com"/>
      </div>
      <div style={{marginBottom:err?10:16}}>
        <label className="topps-label">Password</label>
        <input className="topps-input" type="password" value={pass} onChange={function(e){setPass(e.target.value);setErr("");}} placeholder="Min. 6 characters"/>
      </div>
      {err&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#e8161e",fontWeight:600,marginBottom:12,padding:"8px 12px",background:"#fff0f0",border:"1px solid #f5c0c0"}}>{err}</div>}
      <button onClick={handleSubmit} disabled={loading} className="topps-btn-primary"
        style={{width:"100%",fontSize:15,padding:"14px",clipPath:"none",borderRadius:0,opacity:loading?0.7:1,marginBottom:12}}>
        {loading?"Please wait...":(isSignup?"Create Account":"Sign In")}
      </button>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center"}}>
        {isSignup&&<button onClick={function(){onComplete(cards,500);}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa",textDecoration:"underline",padding:0}}>Skip for now — continue as guest</button>}
        {onBack&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa",textDecoration:"underline",padding:0}}>← Back</button>}
      </div>
    </div>
  );
}

function Onboarding(props) {
  var onComplete=props.onComplete;
  var onSavePrefs=props.onSavePrefs||function(){};
  var isNewUser=props.isNewUser||false;
  var phaseState=useState("landing"); var phase=phaseState[0]; var setPhase=phaseState[1];
  useEffect(function(){if(isNewUser) setPhase("profile_setup");},[isNewUser]);
  var glowingState=useState(false); var setGlowing=glowingState[1];
  var cardsState=useState([]); var cards=cardsState[0]; var setCards=cardsState[1];
  var flippedState=useState([]); var flippedIds=flippedState[0]; var setFlippedIds=flippedState[1];
  var celebState=useState(false); var celebrate=celebState[0]; var setCelebrate=celebState[1];
  var partState=useState(false); var particles=partState[0]; var setParticles=partState[1];

  function claim(){
    var starterRates={Base:60,Rare:25,Elite:10,Legacy:3,Legendary:1.5,Dynasty:0.5};
    var starterSports=["NFL","NBA","MLB","MLS","College"];
    var generated=starterSports.map(function(sport){return genCard(starterRates,null,sport);});
    setPhase("shaking"); setGlowing(true);
    setTimeout(function(){
      setParticles(true);
      setTimeout(function(){setParticles(false);},1200);
      setCards(generated);
      setPhase("reveal");
    },1600);
  }
  function handleFlip(c){setFlippedIds(function(p){return p.concat([c.id]);});}
  var allFlipped=flippedIds.length===5&&cards.length===5;
  useEffect(function(){if(allFlipped)setTimeout(function(){setCelebrate(true);},600);},[allFlipped]);

  // Ticker items
  var tickerItems=["2025 Series 1 Now Available","5 Sports · 150+ Teams","Dynasty Cards Numbered to 10","Free Starter Pack with Registration","Live Score Boosts · Earn Daily Coins","Exchange Open Now","2025 Series 1 Now Available","5 Sports · 150+ Teams","Dynasty Cards Numbered to 10","Free Starter Pack with Registration","Live Score Boosts · Earn Daily Coins","Exchange Open Now"];

  var toppsHeader=(
    <div style={{display:"flex",flexDirection:"column"}}>
      {/* Ticker */}
      <div className="topps-ticker">
        <div className="topps-ticker-inner">
          {tickerItems.map(function(t,i){return <span key={i} className="topps-ticker-item">{t}</span>;})}
        </div>
      </div>
      {/* Header — single row, no wrapping */}
      <div className="topps-header">
        {/* Logo — always visible, single line */}
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",flexShrink:0}}>
          <div className="topps-logo-main">CARD <em>DYNASTY</em></div>
          <div className="topps-logo-sub">Official Collector · 2025</div>
        </div>
        {/* Nav links — hidden on mobile */}
        <div className="topps-nav-links">
          {["Shop","Exchange","Collection","Live","Rankings"].map(function(n){
            return <button key={n} className="topps-nav-link">{n}</button>;
          })}
        </div>
        {/* Sign In — always visible */}
        <button onClick={function(){setPhase("login");}} className="topps-btn-outline"
          style={{padding:"6px 16px",fontSize:12,flexShrink:0,whiteSpace:"nowrap"}}>Sign In</button>
      </div>
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────────────────────
  if(phase==="landing") return (
    <div className="topps-screen">
      {toppsHeader}
      {/* Hero */}
      <div className="topps-hero">
        <div className="topps-hero-stripes"/>
        <div style={{maxWidth:920,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:32,flexWrap:"wrap",position:"relative",zIndex:2}}>
          <div style={{flex:1,minWidth:240}} className="topps-reveal">
            <div className="topps-eyebrow" style={{marginBottom:12}}>2025 Season · Free to Play</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(44px,8vw,72px)",fontWeight:900,letterSpacing:"0.02em",lineHeight:0.92,textTransform:"uppercase",color:"#fff",marginBottom:16}}>
              Build Your<br/><em style={{color:"#f5c518",fontStyle:"normal"}}>Dynasty.</em>
            </div>
            <div style={{fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.65,marginBottom:28,maxWidth:380,fontFamily:"'Barlow',sans-serif"}}>
              Collect official cards across NFL, NBA, MLB, MLS &amp; College. Every card earns real daily coins. Live scores boost your collection in real time.
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:28}}>
              <button onClick={function(){setPhase("signup");}} className="topps-btn-primary" style={{fontSize:16,padding:"14px 40px"}}>
                Claim Free Starter Pack
              </button>
              <button onClick={function(){setPhase("login");}} className="topps-btn-secondary">
                Sign In
              </button>
            </div>
            <div style={{display:"flex",gap:32}}>
              {[["150+","Teams"],["6","Rarities"],["Live","Scores"],["Free","To Play"]].map(function(s){
                return <div key={s[0]}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#fff",lineHeight:1,letterSpacing:"0.02em"}}>{s[0]}</div>
                  <div style={{fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase",fontWeight:600,marginTop:2}}>{s[1]}</div>
                </div>;
              })}
            </div>
          </div>

          {/* Hero cards — showcasing all key rarity tiers */}
          <div style={{display:"flex",gap:10,alignItems:"flex-end",flexShrink:0,perspective:1200}}>
            {[
              {team:"Celtics",sport:"NBA",rarity:"Base",col:"#1a6b3a",code:"BOS",rotate:-6,shift:28,scale:0.82},
              {team:"Chiefs",sport:"NFL",rarity:"Rare",col:"#8a0010",code:"KC",rotate:-2,shift:12,scale:0.9},
              {team:"Lakers",sport:"NBA",rarity:"Dynasty",col:"#4a0080",code:"LAL",rotate:0,shift:0,scale:1.08,featured:true},
              {team:"Patriots",sport:"NFL",rarity:"Legendary",col:"#002244",code:"NE",rotate:2,shift:12,scale:0.9},
              {team:"Yankees",sport:"MLB",rarity:"Legacy",col:"#003087",code:"NYY",rotate:6,shift:28,scale:0.82},
            ].map(function(c){
              var cfg=RARITY_CFG[c.rarity]||RARITY_CFG.Base;
              var baseW=154; var baseH=218;
              var W=Math.round(baseW*c.scale); var H=Math.round(baseH*c.scale);
              var isDyn=c.rarity==="Dynasty";
              var isLeg=c.rarity==="Legendary";
              var isLegacy=c.rarity==="Legacy";
              var stripeStyle=isDyn?"linear-gradient(180deg,#aa44ff,#6600cc,#e8161e,#9933ff)":isLeg?"linear-gradient(180deg,#ff2222,#8a0010,#ff1818)":isLegacy?"linear-gradient(180deg,#f5c518,#8a6c00,#f5c518)":cfg.stripe;
              var abbvCol=c.rarity==="Base"?("rgba("+hexToRgb(c.col)+",0.55)"):cfg.abbvFn();
              return (
                <div key={c.team} style={{width:W,height:H,position:"relative",borderRadius:4,overflow:"hidden",
                  flexShrink:0,cursor:"pointer",
                  boxShadow:cfg.shadow+",0 12px 32px rgba(0,0,0,0.7)",
                  transform:"rotate("+c.rotate+"deg) translateY("+c.shift+"px)",
                  transition:"transform 0.2s",
                  border:isDyn?"2px solid transparent":"1px solid rgba(0,0,0,0.2)"}}>
                  {isDyn&&<div style={{position:"absolute",inset:-2,background:"linear-gradient(135deg,#9933ff,#e8161e,#ff6600,#9933ff)",borderRadius:6,zIndex:0,animation:"dynastyShine 3s linear infinite"}}/>}
                  {isDyn&&<div style={{position:"absolute",inset:0,background:"#050010",borderRadius:4,zIndex:1}}/>}
                  {/* Stripe */}
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:Math.round(W*0.12),background:stripeStyle,zIndex:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:Math.round(W*0.048),fontWeight:900,letterSpacing:"0.18em",textTransform:"uppercase",color:"#fff",writingMode:"vertical-rl",transform:"rotate(180deg)",whiteSpace:"nowrap",opacity:0.9}}>{c.team.toUpperCase()}</span>
                  </div>
                  {/* Photo area */}
                  <div style={{position:"absolute",left:Math.round(W*0.12),top:0,right:0,bottom:Math.round(H*0.16),
                    background:"linear-gradient(160deg,"+cfg.photoTop+","+cfg.photoBot+")",overflow:"hidden",zIndex:2}}>
                    {/* Rarity overlays — abbreviated for landing */}
                    {c.rarity==="Rare"&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:2}}><div style={{position:"absolute",width:"35%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(100,160,255,0.14),transparent)",animation:"shimmerSweep 3.5s ease-in-out infinite"}}/></div>}
                    {isLegacy&&<div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:2}}><div style={{position:"absolute",width:"50%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(255,220,80,0.18),rgba(255,255,200,0.1),rgba(255,220,80,0.14),transparent)",animation:"shimmerSweep 2.5s ease-in-out infinite"}}/></div>}
                    {isLeg&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 88% 70% at 58% 40%,rgba(255,60,20,0.45) 0%,rgba(200,10,10,0.2) 40%,transparent 80%)",zIndex:2}}/>}
                    {isLeg&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(0deg,rgba(232,22,30,0.35),transparent)",zIndex:3}}/>}
                    {isDyn&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 120% 120% at 50% 50%,#0a001e 0%,#020008 70%,#000 100%)",zIndex:1}}/>}
                    {isDyn&&<div style={{position:"absolute",inset:0,background:"conic-gradient(from 0deg at 55% 42%,rgba(153,51,255,0.2) 0deg,transparent 60deg,rgba(232,22,30,0.12) 120deg,transparent 180deg,rgba(153,51,255,0.15) 240deg,transparent 300deg)",animation:"cosmicRing 25s linear infinite",zIndex:2}}/>}
                    {isDyn&&[8,15,25,18,36,12,45,56].map(function(top,i){var lefts=[18,55,30,80,68,40,22,76];return <div key={i} style={{position:"absolute",width:i%2+1,height:i%2+1,background:"#fff",borderRadius:"50%",top:top+"%",left:lefts[i]+"%",animation:"twinkle "+(1.8+i*0.25)+"s ease-in-out infinite "+(i*0.35)+"s",opacity:0.7}}/>;}) }
                    {isDyn&&<div style={{position:"absolute",left:"52%",top:"42%",transform:"translate(-50%,-50%)",width:Math.round(W*0.22),height:Math.round(W*0.22),borderRadius:"50%",background:"radial-gradient(ellipse at 50% 50%,rgba(0,0,0,1) 35%,rgba(100,20,200,0.4) 65%,transparent 80%)",zIndex:6}}/>}
                    {isDyn&&<div style={{position:"absolute",left:"52%",top:"42%",transform:"translate(-50%,-50%)",width:Math.round(W*0.42),height:Math.round(W*0.1),borderRadius:"50%",border:"1.5px solid rgba(200,120,255,0.38)",zIndex:5}}/>}
                    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 70% at 60% 40%,"+c.col+"44 0%,transparent 70%)",zIndex:4}}/>
                    {/* Abbreviation */}
                    <div style={{position:"absolute",left:0,right:0,top:"50%",transform:"translateY(-50%)",textAlign:"center",zIndex:isDyn?9:5}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",
                        fontSize:c.code.length<=2?Math.round(W*0.42):c.code.length<=3?Math.round(W*0.32):Math.round(W*0.24),
                        fontWeight:900,color:abbvCol,lineHeight:1,userSelect:"none",textShadow:cfg.abbvShadow}}>{c.code}</span>
                    </div>
                    {/* Tier icon */}
                    {cfg.icon&&<div style={{position:"absolute",top:Math.round(H*0.09),right:Math.round(W*0.04),zIndex:12,fontSize:Math.round(W*0.08),lineHeight:1,
                      animation:isDyn?"crownFloat 2.2s ease-in-out infinite":"iconFloat 2s ease-in-out infinite",
                      filter:isDyn?"drop-shadow(0 0 6px rgba(255,200,0,0.95))":isLeg?"drop-shadow(0 0 5px rgba(255,100,60,0.9))":"drop-shadow(0 0 4px rgba(255,180,0,0.8))"}}>{cfg.icon}</div>}
                    {/* Serial */}
                    {cfg.serial&&<div style={{position:"absolute",bottom:5,left:Math.round(W*0.14),zIndex:9,fontFamily:"'Roboto Mono',monospace",fontSize:Math.round(W*0.04),fontWeight:700,color:isDyn?"rgba(200,140,255,0.6)":isLeg?"rgba(255,100,80,0.55)":"rgba(255,210,60,0.55)",letterSpacing:"0.05em"}}>{"#"+cfg.serial}</div>}
                    {/* Rarity tag */}
                    <div style={{position:"absolute",top:0,right:0,zIndex:12,background:cfg.tagBg,padding:"2px 6px"}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:Math.round(W*0.052),fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:cfg.tagTxt}}>{c.rarity.toUpperCase()}</span>
                    </div>
                    {c.featured&&<div style={{position:"absolute",bottom:4,right:5,zIndex:8,fontFamily:"'Barlow Condensed',sans-serif",fontSize:Math.round(W*0.04),fontWeight:700,letterSpacing:"0.1em",color:isDyn?"rgba(180,120,255,0.3)":"rgba(255,255,255,0.25)"}}>CD 2025</div>}
                  </div>
                  {/* Name plate */}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:Math.round(H*0.16),
                    background:isDyn?"#0a0020":"#fff",
                    borderTop:isDyn?"2px solid transparent":"2px solid "+cfg.plateBdr,
                    borderImage:isDyn?"linear-gradient(90deg,#9933ff,#e8161e,#ffaa00) 1":"none",
                    zIndex:6,display:"flex",flexDirection:"column",justifyContent:"center",
                    paddingLeft:Math.round(W*0.14),paddingRight:6}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:c.team.length>8?Math.round(W*0.072):Math.round(W*0.085),
                      fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:1,
                      background:isDyn?"linear-gradient(90deg,#cc88ff,#ff6699)":undefined,
                      WebkitBackgroundClip:isDyn?"text":undefined,
                      WebkitTextFillColor:isDyn?"transparent":undefined,
                      color:isDyn?undefined:cfg.nameCol,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                      {c.team.toUpperCase()}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:2}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:Math.round(W*0.052),fontWeight:700,
                        letterSpacing:"0.05em",textTransform:"uppercase",
                        background:isDyn?"linear-gradient(90deg,#9933ff,#e8161e)":undefined,
                        WebkitBackgroundClip:isDyn?"text":undefined,
                        WebkitTextFillColor:isDyn?"transparent":undefined,
                        color:isDyn?undefined:cfg.rarCol}}>{c.sport} · {c.rarity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div style={{background:"#fff",borderBottom:"1px solid #e8e8e8"}}>
        <div style={{maxWidth:920,margin:"0 auto",display:"flex",flexWrap:"wrap"}}>
          {[
            {icon:"📦",title:"Open Packs",desc:"NFL, NBA, MLB, MLS & College cards from foil packs"},
            {icon:"🪙",title:"Earn Daily Coins",desc:"Every card generates passive income every day"},
            {icon:"🔴",title:"Live Score Boosts",desc:"Cards earn 1.5× when your team plays in real time"},
            {icon:"📈",title:"Trade & Rank",desc:"List on the Exchange, complete sets, climb the board"},
          ].map(function(f,i){
            return (
              <div key={i} style={{flex:"1 1 200px",padding:"20px 24px",borderRight:i<3?"1px solid #eee":"none",display:"flex",gap:14,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{f.icon}</span>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111",marginBottom:3}}>{f.title}</div>
                  <div style={{fontSize:13,color:"#777",lineHeight:1.5,fontFamily:"'Barlow',sans-serif"}}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rarity ladder */}
      <div style={{background:"#f0ede8",padding:"20px",borderBottom:"1px solid #e0ddd8"}}>
        <div style={{maxWidth:920,margin:"0 auto",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginRight:8}}>Rarity Scale:</span>
          {[{r:"Base",c:"#aaa"},{r:"Rare",c:"#4488ff"},{r:"Elite",c:"#22bb66"},{r:"Legacy",c:"#c8a800"},{r:"Legendary",c:"#e8161e"},{r:"Dynasty",c:"#8822cc"}].map(function(item){
            return <span key={item.r} className="topps-rarity-pill" style={{borderColor:item.c,color:item.c,background:item.c+"11"}}>{item.r}</span>;
          })}
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:"#aaa",marginLeft:"auto",letterSpacing:"0.1em",textTransform:"uppercase"}}>Dynasty cards numbered /10</span>
        </div>
      </div>

      {/* CTA footer band */}
      <div style={{background:"#e8161e",padding:"28px 20px",textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#fff",marginBottom:14}}>
          Your free starter pack is waiting.
        </div>
        <button onClick={function(){setPhase("signup");}} style={{background:"#fff",color:"#e8161e",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,letterSpacing:"0.14em",textTransform:"uppercase",padding:"14px 48px",border:"none",cursor:"pointer",clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))"}}>
          Get Started — It's Free
        </button>
      </div>
    </div>
  );

  // ── SIGNUP ─────────────────────────────────────────────────────────────────
  if(phase==="signup") return (
    <div className="topps-screen">
      {toppsHeader}
      <div style={{background:"#f0ede8",minHeight:"calc(100vh - 88px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{display:"flex",gap:40,maxWidth:920,width:"100%",alignItems:"flex-start",flexWrap:"wrap"}}>
          {/* Left — what you get */}
          <div style={{flex:"1 1 300px",minWidth:280}} className="topps-reveal">
            <div className="topps-eyebrow" style={{marginBottom:16,color:"#e8161e"}}>What you get</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:900,letterSpacing:"0.02em",textTransform:"uppercase",color:"#111",lineHeight:0.95,marginBottom:20}}>Your Free<br/><em style={{color:"#e8161e",fontStyle:"normal"}}>Genesis Pack</em></div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {[
                {icon:"🃏",text:"5 cards across all 5 sports"},
                {icon:"🪙",text:"500 bonus coins to start"},
                {icon:"📊",text:"Instant daily yield from day one"},
                {icon:"🔴",text:"Live score boosts on real games"},
              ].map(function(f,i){
                return <div key={i} className="topps-feature-box" style={{display:"flex",gap:12,alignItems:"center"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{f.icon}</span>
                  <span style={{fontFamily:"'Barlow',sans-serif",fontSize:14,fontWeight:600,color:"#333"}}>{f.text}</span>
                </div>;
              })}
            </div>
            {/* Mini card preview */}
            <div style={{background:"#111",padding:20,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              {["NFL","NBA","MLB","MLS","CFB"].map(function(s){
                var colors={NFL:"#1144cc",NBA:"#cc1133",MLB:"#1155bb",MLS:"#116611",CFB:"#cc5500"};
                return <div key={s} style={{width:56,height:80,background:colors[s],position:"relative",borderRadius:2,overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.5)"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:8,background:"rgba(0,0,0,0.4)"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:20,background:"#fff",borderTop:"1.5px solid #333",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,color:"#111",letterSpacing:"0.06em"}}>{s}</span>
                  </div>
                  <div style={{position:"absolute",top:2,right:2,background:"#e8161e",padding:"1px 4px"}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:5,fontWeight:900,color:"#fff",letterSpacing:"0.04em"}}>FREE</span>
                  </div>
                </div>;
              })}
            </div>
          </div>

          {/* Right — auth form */}
          <div style={{flex:"1 1 340px",minWidth:300,background:"#fff",border:"1px solid #e0ddd8",padding:"32px 28px"}} className="topps-reveal">
            <div style={{borderBottom:"3px solid #e8161e",paddingBottom:16,marginBottom:24}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",marginBottom:4}}>Create Account</div>
              <div style={{fontSize:13,color:"#888",fontFamily:"'Barlow',sans-serif"}}>Save your collection and progress across devices</div>
            </div>
            <AuthForm mode="signup" onComplete={function(){setPhase("profile_setup");}} cards={[]} onBack={function(){setPhase("landing");}}/>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if(phase==="login") return (
    <div className="topps-screen">
      {toppsHeader}
      <div style={{background:"#f0ede8",minHeight:"calc(100vh - 88px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"36px 32px",maxWidth:400,width:"100%"}} className="topps-reveal">
          <div style={{borderBottom:"3px solid #e8161e",paddingBottom:16,marginBottom:24}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",marginBottom:4}}>Welcome Back</div>
            <div style={{fontSize:13,color:"#888",fontFamily:"'Barlow',sans-serif"}}>Sign in to your Card Dynasty account</div>
          </div>
          <AuthForm mode="login" onComplete={onComplete} cards={cards} onBack={function(){setPhase("landing");}}/>
        </div>
      </div>
    </div>
  );

  // ── SHAKING ────────────────────────────────────────────────────────────────
  if(phase==="shaking") return (
    <div className="topps-screen" style={{minHeight:"100vh",background:"#111",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.35em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Opening your genesis pack...</div>
      <div style={{position:"relative"}}>
        <ParticleBurst active={particles}/>
        <BoosterPack packId="genesis" size={140} shaking={true} floating={false}/>
      </div>
      <div style={{width:200,height:3,background:"#222",overflow:"hidden"}}>
        <div style={{height:"100%",background:"#e8161e",animation:"shimmerSweep 1.5s ease-in-out infinite",backgroundSize:"200% 100%",backgroundImage:"linear-gradient(90deg,#e8161e 0%,#ff6060 50%,#e8161e 100%)"}}/>
      </div>
    </div>
  );

  // ── REVEAL ─────────────────────────────────────────────────────────────────
  if(phase==="reveal"&&!celebrate) return (
    <div className="topps-screen" style={{minHeight:"100vh",background:"#111",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 16px 80px"}}>
      {/* Header */}
      <div style={{width:"100%",maxWidth:800,marginBottom:32,display:"flex",alignItems:"center",gap:16}}>
        <div style={{flex:1}}>
          <div className="topps-eyebrow" style={{marginBottom:8}}>Genesis Pack</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(24px,5vw,38px)",fontWeight:900,letterSpacing:"0.02em",textTransform:"uppercase",color:"#fff",lineHeight:1}}>
            {allFlipped?"Your Dynasty Begins!":"Reveal Your Cards"}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",padding:"10px 20px",textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1}}>{flippedIds.length}<span style={{color:"#888"}}>/5</span></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#666",marginTop:3}}>Revealed</div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{width:"100%",maxWidth:800,height:4,background:"#222",marginBottom:32,overflow:"hidden"}}>
        <div style={{height:"100%",background:"#e8161e",width:(flippedIds.length/5*100)+"%",transition:"width 0.3s"}}/>
      </div>
      {/* Cards */}
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:16,width:"100%",maxWidth:900}}>
        {cards.map(function(c){
          return <div key={c.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <FlipCard card={c} onFlip={handleFlip}/>
            {flippedIds.includes(c.id)&&(
              <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",padding:"4px 12px",display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:RCOLORS[c.rarity]||"#aaa"}}>{c.rarity}</span>
                <span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>·</span>
                <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,color:"#f5c518"}}>{fmt(c.daily)}/d</span>
              </div>
            )}
            {!flippedIds.includes(c.id)&&(
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Click to reveal</div>
            )}
          </div>;
        })}
      </div>
    </div>
  );

  // ── CELEBRATE ──────────────────────────────────────────────────────────────
  if(celebrate) return (
    <div className="topps-screen" style={{minHeight:"100vh",background:"#111",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",maxWidth:420,width:"100%",textAlign:"center"}} className="topps-reveal">
        {/* Red top bar */}
        <div style={{background:"#e8161e",padding:"20px 28px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:6}}>Collection Started</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff",lineHeight:1}}>Your Dynasty<br/>Has Begun!</div>
        </div>
        <div style={{padding:"28px 32px"}}>
          {/* Stats */}
          <div style={{display:"flex",gap:0,border:"1px solid #e8e8e8",marginBottom:24}}>
            <div style={{flex:1,padding:"16px 12px",borderRight:"1px solid #e8e8e8",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#111",letterSpacing:"0.02em",lineHeight:1}}>5</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginTop:4}}>Cards</div>
            </div>
            <div style={{flex:1,padding:"16px 12px",borderRight:"1px solid #e8e8e8",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#e8161e",letterSpacing:"0.02em",lineHeight:1}}>{fmt(cards.reduce(function(s,c){return s+c.daily;},0))}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginTop:4}}>Coins/Day</div>
            </div>
            <div style={{flex:1,padding:"16px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:"#c8a800",letterSpacing:"0.02em",lineHeight:1}}>500</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginTop:4}}>Bonus Coins</div>
            </div>
          </div>
          {/* Top pull */}
          {cards.length>0&&(function(){
            var best=cards.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);})[0];
            return <div style={{background:"#f8f5f0",border:"1px solid #e0ddd8",padding:"12px 16px",marginBottom:20,display:"flex",gap:12,alignItems:"center",textAlign:"left"}}>
              <div style={{flexShrink:0}}><MiniCard card={best}/></div>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginBottom:3}}>Top Pull</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>{best.team}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:RCOLORS[best.rarity]||"#888"}}>{best.rarity} · {best.sport}</div>
              </div>
            </div>;
          })()}
          <button onClick={function(){onComplete(cards,500);}} className="topps-btn-primary" style={{width:"100%",fontSize:16,padding:"15px",clipPath:"none",borderRadius:0}}>
            Enter Your Vault →
          </button>
          <div style={{marginTop:12,fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa"}}>500 coins added to your account</div>
        </div>
      </div>
    </div>
  );

  // ── PROFILE SETUP ─────────────────────────────────────────────────────────
  if(phase==="profile_setup") return (
    <div className="topps-screen">
      {toppsHeader}
      <div style={{background:"#f0ede8",minHeight:"calc(100vh - 88px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 20px"}}>
        <ProfileSetupStep onComplete={function(prefs){
          if(prefs) onSavePrefs(prefs);
          claim();
        }}/>
      </div>
    </div>
  );

  return null;
}
function Shop(props) {
  var balance=props.balance; var onBuy=props.onBuy; var pityCount=props.pityCount;
  var motorCityBoost = isMotorCityBoostActive();
  var sportBg={NFL:"linear-gradient(145deg,#0a1628,#162040)",NBA:"linear-gradient(145deg,#1a0608,#2a0c10)",MLB:"linear-gradient(145deg,#08102a,#101840)",MLS:"linear-gradient(145deg,#051408,#0a2010)",College:"linear-gradient(145deg,#1a0c00,#281800)"};
  var sportAccent={NFL:"#3366cc",NBA:"#cc2233",MLB:"#2255bb",MLS:"#228833",College:"#cc6600"};
  var bundleBg={blaster:"linear-gradient(145deg,#12081e,#1e1030)",megabox:"linear-gradient(145deg,#061420,#0c2030)",hobbybox:"linear-gradient(145deg,#1e0800,#2e1000)"};
  // Radioactive world counter
  var radCountState=useState(_radioactiveCount||0); var radClaimed=radCountState[0]; var setRadClaimed=radCountState[1];
  useEffect(function(){
    if(typeof supabase!=="undefined"&&supabase){
      supabase.from("radioactive_cards").select("serial_number",{count:"exact"}).then(function(res){
        var n=(res&&res.count)||0;
        _radioactiveCount=n;
        setRadClaimed(n);
      });
    }
  },[]);
  var radRemaining=RADIOACTIVE_MAX-radClaimed;
  var singleSport=PACK_TYPES.filter(function(p){return p.sport;});
  var atCap=props.cardCount>COLLECTION_CAP;
  var nearCap=props.cardCount>=COLLECTION_CAP*0.9;
  var special=PACK_TYPES.filter(function(p){return !p.sport&&!p.bundle&&(p.playoffOnly||p.motorCity||p.sovereign||p.id==="basic");});
  var multiSport=PACK_TYPES.filter(function(p){return !p.sport&&!p.bundle&&!p.playoffOnly&&!p.motorCity&&!p.sovereign&&p.id!=="basic"&&!p.rivalryBox&&!p.allStar&&!p.blackBox&&p.id!=="rookierush";});
  var newSpecial=PACK_TYPES.filter(function(p){return p.rivalryBox||p.allStar||p.blackBox||p.id==="rookierush";});
  var bundles=PACK_TYPES.filter(function(p){return p.bundle;});

  function PackCard(p){
    var pt=p.pt; var canAfford=balance>=pt.cost;
    var isBundle=!!pt.bundle; var isSingle=!!pt.sport;
    var isSov=!!pt.sovereign; var isMotor=!!pt.motorCity; var isPlayoff=!!pt.playoffOnly;
    var imgBg=isSingle?(sportBg[pt.sport]||"linear-gradient(145deg,#111,#222)"):isBundle?(bundleBg[pt.id]||"linear-gradient(145deg,#111,#222)")
      :isSov?"linear-gradient(145deg,#0a0800,#1a1000)"
      :isMotor?"linear-gradient(145deg,#08001a,#120030)"
      :isPlayoff?"linear-gradient(145deg,#001a0a,#003018)"
      :"linear-gradient(145deg,#0a1628,#162040)";
    var acc=isSingle?(sportAccent[pt.sport]||"#3366cc"):isBundle?(pt.id==="megabox"?"#0088cc":pt.id==="hobbybox"?"#cc3300":"#6633cc")
      :isSov?"#f5c518":isMotor?"#cc44ff":isPlayoff?"#22cc88":"#4466cc";
    var badgeBg=pt.badge==="SOVEREIGN"?"linear-gradient(90deg,#7a5200,#f5c518,#7a5200)"
      :pt.badge==="LIVE 3.0×"?(motorCityBoost?"#22aa44":"#888")
      :pt.badge==="PLAYOFF"?"#e8161e"
      :pt.badge==="BEST VALUE"?"#e8161e":pt.badge==="BUNDLE"?"#7733cc":pt.badge==="MEGA"?"#0088cc":pt.badge==="HOBBY BOX"?"#333":"#e8161e";
    return (
      <div className="topps-product-card" style={{flex:"1 1 175px",minWidth:170,maxWidth:isSov?280:220,display:"flex",flexDirection:"column",
        boxShadow:isSov?"0 0 24px rgba(245,197,24,0.25)":undefined}}>
        {/* Image area */}
        <div style={{height:isSov?160:130,background:imgBg,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          {pt.badge&&<div style={{position:"absolute",top:0,left:0,background:badgeBg,color:isSov?"#000":"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",padding:"3px 8px",clipPath:"polygon(0 0,100% 0,calc(100% - 4px) 100%,0 100%)"}}>{pt.badge}</div>}
          {isSingle&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:acc}}/>}
          {/* Motor City expired notice */}
          {isMotor&&!motorCityBoost&&<div style={{position:"absolute",top:0,right:0,background:"#888",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:"0.06em"}}>BOOST EXPIRED</div>}
          {isMotor&&motorCityBoost&&<div style={{position:"absolute",top:0,right:0,background:"#22aa44",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:"0.06em",animation:"pulse 1s ease-in-out infinite"}}>🔴 LIVE 3.0×</div>}
          {isSov&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(245,197,24,0.15),transparent 70%)",animation:"goldSmokeFade 3s ease-in-out infinite alternate"}}/>}
          <BoosterPack packId={pt.id} size={80} floating={true}/>
          {/* Odds dots */}
          <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",gap:4,justifyContent:"center"}}>
            {Object.keys(pt.rates).filter(function(k){return pt.rates[k]>0;}).slice(0,5).map(function(r){
              return <span key={r} style={{width:6,height:6,borderRadius:"50%",background:RCOLORS[r]||"#aaa",display:"inline-block",opacity:0.8}}/>;
            })}
          </div>
        </div>
        {/* Info area */}
        <div style={{padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",gap:6,background:"#fff",borderTop:"1px solid #e8e8e8"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",color:isSov?"#c8a800":"#111"}}>{pt.name}</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>{pt.subtitle}</div>
          {isMotor&&motorCityBoost&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#22aa44",letterSpacing:"0.06em",textTransform:"uppercase"}}>⚡ 3.0× Live Boost · Expires 6:30 PM ET</div>}
          {isPlayoff&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#e8161e",letterSpacing:"0.06em",textTransform:"uppercase"}}>🏀 April 19 Playoff Teams Only</div>}
          {isSov&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#c8a800",letterSpacing:"0.06em",textTransform:"uppercase"}}>⚡ Elite Floor · Grade 9+ Guaranteed</div>}
          {/* Odds */}
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:2}}>
            {Object.keys(pt.rates).filter(function(k){return pt.rates[k]>0&&pt.rates[k]>=1;}).map(function(r){
              return <span key={r} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,padding:"1px 5px",border:"1px solid "+(RCOLORS[r]||"#aaa")+"55",color:RCOLORS[r]||"#aaa",letterSpacing:"0.04em",textTransform:"uppercase"}}>{r} {pt.rates[r]}%</span>;
            })}
          </div>
          {pt.guarantee&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#22aa44",letterSpacing:"0.08em",textTransform:"uppercase"}}>✓ {pt.guarantee} Guaranteed</div>}
          <button onClick={function(){onBuy(pt);}} disabled={!canAfford}
            style={{marginTop:"auto",width:"100%",padding:"9px",
              background:!canAfford?"#e0ddd8":isSov?"linear-gradient(90deg,#7a5200,#c8a800,#f5c518,#c8a800,#7a5200)":"#e8161e",
              backgroundSize:isSov?"200% auto":undefined,
              animation:isSov&&canAfford?"balShimmer 3s linear infinite":undefined,
              color:!canAfford?"#aaa":isSov?"#000":"#fff",
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",border:"none",cursor:canAfford?"pointer":"not-allowed",
              clipPath:canAfford?"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))":"none"}}>
            <span style={{fontFamily:"'Roboto Mono',monospace"}}>{fmt(pt.cost)}</span> coins · {pt.cards} cards
          </button>
        </div>
      </div>
    );
  }

  function SectionHead(p){
    return <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
      {p.label}
      <div style={{flex:1,height:1,background:"#e0ddd8"}}/>
    </div>;
  }

  return (
    <div style={{background:"#f0ede8",padding:"24px 20px 80px",maxWidth:960,margin:"0 auto"}}>
      {/* Oracle Alert — Motor City live game */}
      {motorCityBoost&&<div style={{background:"linear-gradient(90deg,rgba(0,100,255,0.1),rgba(200,68,255,0.08))",border:"1px solid rgba(200,68,255,0.35)",borderLeft:"3px solid #cc44ff",padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#e8161e",animation:"pulse 1s ease-in-out infinite",flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,letterSpacing:"0.12em",textTransform:"uppercase",color:"#cc44ff"}}>🏀 Oracle Alert · Pistons @ Magic in ~2 hours</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(0,0,0,0.6)",marginTop:1}}>Load up on Detroit cards now for the <strong>3.0× Return Bonus</strong>. Motor City Box expires at 6:30 PM ET.</div>
        </div>
        <button onClick={function(){onBuy(PACK_TYPES.find(function(p){return p.motorCity;})||PACK_TYPES[0]);}}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 14px",border:"none",cursor:"pointer",background:"#cc44ff",color:"#fff",flexShrink:0}}>Buy Motor City →</button>
      </div>}
      <div style={{marginBottom:24}}>
        <div className="topps-section-title">Wax Wall</div>
        {pityCount>0&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#e8161e",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4}}>Pity {pityCount}/10 — Elite+ due soon</div>}
      </div>

      {/* ── COLLECTION CAP WARNING ── */}
      {nearCap&&<div style={{
        background:atCap?"linear-gradient(90deg,rgba(232,22,30,0.12),rgba(200,10,10,0.08))":"linear-gradient(90deg,rgba(245,197,24,0.1),rgba(200,140,0,0.06))",
        border:"1px solid "+(atCap?"rgba(232,22,30,0.4)":"rgba(245,197,24,0.35)"),
        borderLeft:"3px solid "+(atCap?"#e8161e":"#f5c518"),
        padding:"10px 14px",marginBottom:14,
        display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:18,flexShrink:0}}>{atCap?"🚫":"⚠️"}</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,
            letterSpacing:"0.1em",textTransform:"uppercase",
            color:atCap?"#e8161e":"#c8a800"}}>
            {atCap?"Collection Full — "+COLLECTION_CAP+"/"+COLLECTION_CAP+" cards":"Approaching Limit — "+props.cardCount+"/"+COLLECTION_CAP+" cards"}
          </div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(0,0,0,0.5)",marginTop:1}}>
            {atCap?"Sell cards on the Exchange or grade them in the Slab Lab before opening more packs."
              :"You're almost at the "+COLLECTION_CAP+" card limit. Consider selling Base/Rare cards on the Exchange."}
          </div>
        </div>
      </div>}

      {/* ── RADIOACTIVE CHASE BANNER ── */}
      <div style={{background:"linear-gradient(135deg,#000e04,#001a08,#000e04)",
        border:"1px solid rgba(0,255,60,0.3)",marginBottom:20,overflow:"hidden",position:"relative"}}>
        {/* Animated green pulse border */}
        <div style={{position:"absolute",inset:0,border:"1px solid rgba(0,255,60,0.15)",animation:"slimePulse 2.4s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",position:"relative",zIndex:2}}>
          {/* Icon + glow */}
          <div style={{fontSize:32,filter:"drop-shadow(0 0 10px rgba(0,255,60,0.9))",flexShrink:0,animation:"slimePulse 2s ease-in-out infinite"}}>☢️</div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                letterSpacing:"0.08em",textTransform:"uppercase",
                color:"#00ff44",textShadow:"0 0 10px rgba(0,255,60,0.7)"}}>Radioactive</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
                letterSpacing:"0.15em",textTransform:"uppercase",
                background:"rgba(0,255,60,0.15)",border:"1px solid rgba(0,255,60,0.4)",
                color:"#00ff44",padding:"1px 8px"}}>CHASE CARD</span>
              <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,
                color:"rgba(0,255,60,0.6)"}}>
                {radRemaining>0?radClaimed+" / "+RADIOACTIVE_MAX+" found":"ALL "+RADIOACTIVE_MAX+" CLAIMED"}
              </span>
            </div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
              color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>
              Only <strong style={{color:"#00ff44"}}>{RADIOACTIVE_MAX} exist in the world</strong>. Every pack you open has a <strong style={{color:"#00ff44"}}>~1 in 4,000</strong> chance of pulling one — across all pack types. Highest yield in the game: <strong style={{color:"#00ff44"}}>{RADIOACTIVE_DAILY}/day</strong>.
            </div>
          </div>
          {/* World counter visual */}
          <div style={{flexShrink:0,textAlign:"center",minWidth:70}}>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:28,fontWeight:700,
              color:radRemaining>0?"#00ff44":"rgba(0,255,60,0.3)",lineHeight:1,
              textShadow:radRemaining>0?"0 0 16px rgba(0,255,60,0.8)":"none"}}>
              {radRemaining}
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
              letterSpacing:"0.2em",textTransform:"uppercase",
              color:"rgba(0,255,60,0.5)",marginTop:2}}>
              {radRemaining===1?"card left":"cards left"}
            </div>
            {/* Pip indicators */}
            <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:6,flexWrap:"wrap",maxWidth:80}}>
              {Array.from({length:RADIOACTIVE_MAX}).map(function(_,i){
                var found=i<radClaimed;
                return <div key={i} style={{width:7,height:7,borderRadius:"50%",
                  background:found?"rgba(0,255,60,0.2)":"#00ff44",
                  border:"1px solid rgba(0,255,60,0.4)",
                  boxShadow:found?"none":"0 0 5px rgba(0,255,60,0.8)",
                  transition:"all 0.3s"}}/>;
              })}
            </div>
          </div>
        </div>
        {/* Slime drip bottom */}
        <div style={{height:3,background:"linear-gradient(90deg,transparent,rgba(0,255,60,0.5),rgba(0,200,40,0.8),rgba(0,255,60,0.5),transparent)"}}/>
      </div>
      <div style={{marginBottom:28}}>
        <SectionHead label="Single-Sport Passes · 4 Cards"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{singleSport.map(function(pt){return <PackCard key={pt.id} pt={pt}/>;})}</div>
      </div>
      <div style={{marginBottom:28}}>
        <SectionHead label="Special Editions · April 19"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{special.map(function(pt){return <PackCard key={pt.id} pt={pt}/>;})}</div>
      </div>
      <div style={{marginBottom:28}}>
        <SectionHead label="Premium Collections"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{newSpecial.map(function(pt){return <PackCard key={pt.id} pt={pt}/>;})}</div>
      </div>
      <div style={{marginBottom:28}}>
        <SectionHead label="Multi-Sport Packs"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{multiSport.map(function(pt){return <PackCard key={pt.id} pt={pt}/>;})}</div>
      </div>
      <div style={{marginBottom:32}}>
        <SectionHead label="Collector Boxes · Best Value"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{bundles.map(function(pt){return <PackCard key={pt.id} pt={pt}/>;})}</div>
      </div>
      {/* Whale Feed */}
      <div>
        <SectionHead label="⚡ Whale Feed · Sovereign Pulls"/>
        <WhaleFeed/>
      </div>
    </div>
  );
}
function GoldenSmoke(props) {
  var active=props.active;
  if(!active) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:2500,pointerEvents:"none",overflow:"hidden"}}>
      {/* Deep gold radial bloom */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(245,197,24,0.55) 0%,rgba(200,130,0,0.3) 30%,rgba(139,80,0,0.15) 55%,transparent 75%)",animation:"goldSmokeFade 2.2s ease-out forwards"}}/>
      {/* Smoke particles */}
      {[[-20,30],[10,15],[35,25],[-35,20],[0,10],[20,35],[-10,28],[30,12]].map(function(pos,i){
        return <div key={i} style={{position:"absolute",left:(50+pos[0])+"%",top:(40+pos[1])+"%",
          width:rand(60,140),height:rand(60,140),
          borderRadius:"50%",
          background:"radial-gradient(ellipse,rgba(245,197,24,"+(0.2+i*0.03)+"),transparent 70%)",
          animation:"goldParticleRise "+(1.2+i*0.15)+"s ease-out "+(i*0.08)+"s forwards",
          transform:"translate(-50%,-50%)",opacity:0}}/>;
      })}
      {/* Screen vignette flash */}
      <div style={{position:"absolute",inset:0,background:"rgba(245,197,24,0.12)",animation:"goldFlash 0.4s ease-out forwards"}}/>
    </div>
  );
}

function OpeningScreen(props) {
  var pack=props.pack; var cards=props.cards; var onDone=props.onDone; var winners=props.winners;
  var isSovereign=pack&&pack.id==="sovereign";
  var shakingState=useState(true); var shaking=shakingState[0]; var setShaking=shakingState[1];
  var showCardsState=useState(false); var showCards=showCardsState[0]; var setShowCards=showCardsState[1];
  var glowingState=useState(false); var setGlowing=glowingState[1];
  var partState=useState(false); var particles=partState[0]; var setParticles=partState[1];
  var flippedState=useState([]); var flippedIds=flippedState[0]; var setFlippedIds=flippedState[1];
  var summaryState=useState(false); var showSummary=summaryState[0]; var setShowSummary=summaryState[1];
  var goldState=useState(false); var showGold=goldState[0]; var setShowGold=goldState[1];
  var screenShakeState=useState(false); var screenShake=screenShakeState[0]; var setScreenShake=screenShakeState[1];
  useEffect(function(){
    setGlowing(true);
    // Play rip sound immediately
    if(isSovereign){
      playSovereignBoom();
      setShowGold(true); setTimeout(function(){setShowGold(false);},2400);
      setScreenShake(true); setTimeout(function(){setScreenShake(false);},600);
    } else {
      playPackRip();
    }
    var t=setTimeout(function(){setParticles(true);setTimeout(function(){setParticles(false);},1200);setShaking(false);setTimeout(function(){setShowCards(true);},300);},1500);
    return function(){clearTimeout(t);};
  },[]);
  function handleFlip(c){
    setFlippedIds(function(p){return p.concat([c.id]);});
  }
  var allFlipped=flippedIds.length===cards.length&&cards.length>0;
  useEffect(function(){if(allFlipped)setTimeout(function(){setShowSummary(true);},700);},[allFlipped]);
  var fc=flippedIds.map(function(id){return cards.find(function(c){return c.id===id;});}).filter(Boolean);
  var totalDaily=fc.reduce(function(s,c){return s+c.daily;},0);
  var totalWin=fc.reduce(function(s,c){return s+c.win;},0);
  var rarCounts=cards.reduce(function(a,c){a[c.rarity]=(a[c.rarity]||0)+1;return a;},{});
  return (
    <div style={{minHeight:"calc(100vh - 110px)",display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 16px",gap:24,background:isSovereign?"#0a0800":"#111",animation:screenShake?"packShake 0.5s ease":"none"}}>
      <GoldenSmoke active={showGold}/>
      {!showCards&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.4em",color:isSovereign?"rgba(245,197,24,0.7)":"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>Opening {pack.name}</div>
          {isSovereign&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(245,197,24,0.55)",textAlign:"center"}}>⚡ Sovereign Protocol Active · Elite Floor Enforced</div>}
          <div style={{position:"relative"}}><ParticleBurst active={particles}/><BoosterPack packId={pack.id} size={140} shaking={shaking} floating={!shaking}/></div>
          {shaking&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.3em",color:isSovereign?"rgba(245,197,24,0.6)":"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>{isSovereign?"Sovereign Vault Opening...":"Ripping Pack..."}</div>}
          <div style={{width:180,height:3,background:"#222",overflow:"hidden"}}>
            <div style={{height:"100%",background:isSovereign?"#f5c518":"#e8161e",animation:"shimmerSweep 1.5s ease-in-out infinite",backgroundSize:"200% 100%",backgroundImage:isSovereign?"linear-gradient(90deg,#c8a800 0%,#f5e060 50%,#c8a800 100%)":"linear-gradient(90deg,#e8161e 0%,#ff6060 50%,#e8161e 100%)"}}/>
          </div>
        </div>
      )}
      {showCards&&!showSummary&&(
        <div className="slide-up" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%"}}>
          <div style={{width:"100%",maxWidth:760,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
            <div>
              <div className="topps-eyebrow" style={{marginBottom:4}}>Pack Opening</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,letterSpacing:"0.02em",textTransform:"uppercase",color:"#fff"}}>
                {allFlipped?"All Revealed!":"Click Each Card"}
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",padding:"8px 16px",textAlign:"center"}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:700,color:"#fff",lineHeight:1}}>{flippedIds.length}<span style={{color:"#666"}}>/{cards.length}</span></div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:"#666",textTransform:"uppercase",marginTop:2}}>Revealed</div>
            </div>
          </div>
          <div style={{width:"100%",maxWidth:760,height:3,background:"#222",marginBottom:8}}>
            <div style={{height:"100%",background:isSovereign?"#f5c518":"#e8161e",width:(flippedIds.length/cards.length*100)+"%",transition:"width 0.3s"}}/>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12,maxWidth:760}}>
            {cards.map(function(c){return <FlipCard key={c.id} card={c} winners={winners} onFlip={handleFlip}/>;}) }
          </div>
        </div>
      )}
      {showSummary&&(
        <div style={{background:"#fff",maxWidth:380,width:"100%",border:"1px solid "+(isSovereign?"rgba(245,197,24,0.4)":"#e0ddd8"),boxShadow:isSovereign?"0 0 40px rgba(245,197,24,0.2),0 16px 48px rgba(0,0,0,0.3)":"0 16px 48px rgba(0,0,0,0.3)"}}>
          <div style={{background:isSovereign?"linear-gradient(90deg,#7a5200,#c8a800,#f5c518,#c8a800,#7a5200)":"#e8161e",padding:"16px 20px"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:isSovereign?"#000":"#fff"}}>{isSovereign?"⚡ Sovereign Pull":"Pack Summary"}</div>
          </div>
          <div style={{padding:"20px"}}>
            <div style={{display:"flex",gap:0,border:"1px solid #e8e8e8",marginBottom:16}}>
              {[["Cards",cards.length,"#111"],["Yield/Day","+"+fmt(totalDaily),"#22aa44"],["Win Pool","+"+fmt(totalWin),"#e8161e"]].map(function(s,i){
                return <div key={i} style={{flex:1,padding:"12px 8px",textAlign:"center",borderRight:i<2?"1px solid #e8e8e8":"none"}}>
                  <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:18,fontWeight:700,color:s[2],lineHeight:1}}>{s[1]}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa",marginTop:3}}>{s[0]}</div>
                </div>;
              })}
            </div>
            {isSovereign&&<div style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.3)",padding:"8px 12px",marginBottom:12,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#c8a800",letterSpacing:"0.08em",textTransform:"uppercase"}}>⚡ Eligible for guaranteed Grade 9+ in Slab Lab</div>}
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
              {Object.keys(rarCounts).map(function(r){return <span key={r} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,padding:"3px 8px",border:"1px solid "+(RCOLORS[r]||"#aaa")+"66",color:RCOLORS[r]||"#aaa",letterSpacing:"0.06em",textTransform:"uppercase"}}>{r} ×{rarCounts[r]}</span>;})}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={onDone} className="topps-btn-primary" style={{flex:2,fontSize:14,padding:"12px",clipPath:"none",borderRadius:0,background:isSovereign?"#c8a800":undefined}}>Add to Collection</button>
              <button style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"12px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function SetTracker(props) {
  var inventory=props.inventory;
  var filterState=useState("All"); var filter=filterState[0]; var setFilter=filterState[1];
  var base=inventory.reduce(function(s,c){return s+c.daily;},0);
  var ownedByDiv={};
  Object.keys(DIVISIONS).forEach(function(div){
    var info=DIVISIONS[div];
    var owned=new Set(inventory.filter(function(c){return c.sport===info.sport;}).map(function(c){return c.team;}));
    var count=info.teams.filter(function(t){return owned.has(t);}).length;
    ownedByDiv[div]={count:count,total:info.teams.length,complete:count===info.teams.length,sport:info.sport,teams:info.teams,owned:owned};
  });
  var done=Object.values(ownedByDiv).filter(function(d){return d.complete;}).length;
  var bonus=Math.floor(base*0.25*done);
  var total=base+bonus;
  var sports=["All","NFL","NBA","MLB","MLS","College"];
  var divs=Object.keys(ownedByDiv).filter(function(k){return filter==="All"||ownedByDiv[k].sport===filter;});
  var sportAccents={NFL:"#1144cc",NBA:"#cc1133",MLB:"#1155bb",MLS:"#228833",College:"#cc6600"};
  return (
    <div style={{paddingBottom:40}}>
      {/* Yield summary */}
      <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"16px 20px",marginBottom:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:6}}>Total Daily Passive Income</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:8}}>
          <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:32,fontWeight:700,color:"#111",lineHeight:1}}>{fmt(total)}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#888",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>coins/day</div>
        </div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555"}}>Base: <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#111"}}>{fmt(base)}</span></span>
          {bonus>0&&<span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555"}}>Set Bonus: <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#22aa44"}}>+{fmt(bonus)}</span></span>}
          {done>0&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#22aa44",letterSpacing:"0.06em",textTransform:"uppercase"}}>{done} set{done>1?"s":""} complete!</span>}
        </div>
      </div>
      {/* Sport filter */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {sports.map(function(s){
          var acc=sportAccents[s]||"#e8161e"; var active=filter===s;
          return <button key={s} onClick={function(){setFilter(s);}}
            style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"5px 14px",border:"1.5px solid "+(active?acc:acc+"55"),background:active?acc:"transparent",color:active?"#fff":(s==="All"?"#666":acc),cursor:"pointer",transition:"all 0.12s"}}>{s}</button>;
        })}
      </div>
      {/* Division cards */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {divs.map(function(name){
          var d=ownedByDiv[name];
          var pct=Math.round((d.count/d.total)*100);
          var acc=sportAccents[d.sport]||"#e8161e";
          return (
            <div key={name} style={{background:"#fff",border:"1px solid "+(d.complete?"#22cc55":"#e0ddd8"),borderLeft:"3px solid "+(d.complete?"#22cc55":acc),padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>{name}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#888",marginLeft:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>{d.sport}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {d.complete&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,background:"#e8f5ec",color:"#22aa44",border:"1px solid #c8e8d0",padding:"2px 8px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Complete ✓</span>}
                  <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:"#555"}}>{d.count}/{d.total}</span>
                </div>
              </div>
              <div className="set-bar" style={{marginBottom:6}}>
                <div className="set-bar-fill" style={{width:pct+"%",background:d.complete?"#22cc55":acc}}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {d.teams.slice(0,12).map(function(t){
                  var own=d.owned.has(t);
                  return <span key={t} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,padding:"2px 6px",letterSpacing:"0.04em",textTransform:"uppercase",background:own?acc+"18":"transparent",color:own?acc:"#ccc",border:"1px solid "+(own?acc+"44":"#e8e8e8")}}>{t}</span>;
                })}
                {d.teams.length>12&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"#aaa"}}>+{d.teams.length-12} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// CHANGE 4: Accept shakeTeams prop; apply haptic class + team-color flash to card rows
function Marketplace(props) {
  var balance=props.balance; var onBuy=props.onBuy; var listings=props.listings;
  var myListings=props.myListings; var grailFeed=props.grailFeed; var onRefresh=props.onRefresh; var lastRefresh=props.lastRefresh;
  var shakeTeams=props.shakeTeams||{};
  var buyModalState=useState(null); var buyModal=buyModalState[0]; var setBuyModal=buyModalState[1];
  var filterState=useState("All"); var filter=filterState[0]; var setFilter=filterState[1];
  var filtered=filter==="All"?listings:listings.filter(function(l){return l.card.rarity===filter;});
  var countdown=Math.max(0,60-Math.floor((Date.now()-lastRefresh)/1000));
  return (
    <div style={{maxWidth:880,margin:"0 auto",padding:"20px 16px 80px"}}>
      {buyModal&&<QuickBuyModal listing={buyModal} balance={balance} onConfirm={function(){onBuy(buyModal);setBuyModal(null);}} onClose={function(){setBuyModal(null);}}/>}
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <div className="topps-section-title">Card Exchange</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Live P2P market · Rotates every 60s</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#e8f5ec",border:"1px solid #c8e8d0",padding:"5px 10px"}}>
            <div className="live-dot"/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#22aa44",letterSpacing:"0.08em",textTransform:"uppercase"}}>Live</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:"#888"}}>{countdown}s</span>
          </div>
          <button onClick={onRefresh} className="topps-btn-outline" style={{padding:"5px 14px",fontSize:13}}>Refresh</button>
        </div>
      </div>
      {/* Grail feed */}
      {grailFeed.length>0&&(
        <div style={{background:"#fff",border:"1px solid #e0ddd8",borderLeft:"3px solid #e8161e",padding:"10px 14px",marginBottom:16,overflowX:"auto"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:6}}>Recent Big Sales</div>
          <div style={{display:"flex",gap:20,minWidth:"max-content",flexWrap:"nowrap"}}>
            {grailFeed.map(function(g,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555",whiteSpace:"nowrap"}}><span style={{color:RCOLORS[g.card.rarity]||"#aaa",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",fontSize:11}}>{g.card.rarity}</span><span>{g.msg}</span></div>;})}
          </div>
        </div>
      )}
      {/* Rarity filter */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["All","Rare","Elite","Legacy","Legendary","Dynasty"].map(function(f){
          var col=RCOLORS[f]||"#888"; var active=filter===f;
          return <span key={f} onClick={function(){setFilter(f);}}
            className="topps-rarity-pill" style={{borderColor:active?col:"#ddd",color:active?col:"#888",background:active?col+"11":"transparent",cursor:"pointer"}}>{f}</span>;
        })}
      </div>
      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        {/* Listings */}
        <div style={{flex:1}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(function(listing){
              var ac=RCOLORS[listing.card.rarity]||"#aaa";
              var canAfford=balance>=listing.price;
              var isShaking=shakeTeams[listing.card.team];
              var liveCol=getColors(listing.card.team)[0];
              return (
                <div key={listing.id} className={"mrow"+(isShaking?" haptic":"")}
                  style={{borderLeft:"3px solid "+(isShaking?liveCol:ac+"88"),boxShadow:isShaking?"0 0 12px "+liveCol+"33":"none",transition:"box-shadow 0.2s"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <MiniCard card={listing.card}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>{listing.card.team}</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,padding:"1px 6px",border:"1px solid "+ac+"55",color:ac,letterSpacing:"0.08em",textTransform:"uppercase"}}>{listing.card.rarity}</span>
                        {isShaking&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#22aa44",letterSpacing:"0.08em",textTransform:"uppercase",animation:"pulse 0.5s ease-in-out infinite"}}>⚡ LIVE</span>}
                      </div>
                      <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888",marginBottom:4}}>{listing.seller} · {listing.card.sport}</div>
                      <div style={{display:"flex",gap:12}}>
                        <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:"#c8a800",fontWeight:700}}>{fmt(listing.card.daily)}/d</span>
                        <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:"#e8161e",fontWeight:700}}>+{fmt(listing.card.win)} win</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:listing.trend==="up"?"#22aa44":"#e8161e",marginBottom:3,letterSpacing:"0.06em"}}>{listing.trend==="up"?"▲":"▼"} {listing.trendPct}%</div>
                      <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:18,fontWeight:700,color:"#111",marginBottom:6}}>{fmt(listing.price)}</div>
                      <button onClick={function(){setBuyModal(listing);}}
                        style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,padding:"5px 14px",border:"none",background:canAfford?"#e8161e":"#e0ddd8",color:canAfford?"#fff":"#aaa",cursor:canAfford?"pointer":"not-allowed",letterSpacing:"0.1em",textTransform:"uppercase",clipPath:canAfford?"polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))":"none"}}>
                        {canAfford?"Buy Now":"No Funds"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* My listings sidebar */}
        {myListings.length>0&&(
          <div style={{width:200,flexShrink:0}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginBottom:8}}>My Listings</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {myListings.map(function(l){
                var pct=Math.min(100,Math.floor(((Date.now()-l.listedAt)/(l.duration*1000))*100));
                return (
                  <div key={l.id} style={{background:"#fff",border:"1px solid #e0ddd8",padding:10}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><MiniCard card={l.card}/><div style={{flex:1,minWidth:0}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,textTransform:"uppercase",color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.card.team}</div><div style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:"#e8161e",fontWeight:700}}>{fmt(l.price)}</div></div></div>
                    <div style={{background:"#e0ddd8",height:3,overflow:"hidden"}}><div style={{height:"100%",background:"#22aa44",width:pct+"%",transition:"width 1s linear"}}/></div>
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,color:"#aaa",marginTop:3,textAlign:"right"}}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// CHANGE 5: Accept shakeTeams prop; apply haptic to FlipCard wrappers
function PublicVault(props) {
  var player=props.player; var myInventory=props.myInventory; var onBack=props.onBack;
  var shakeTeams=props.shakeTeams||{};
  var likedState=useState({}); var liked=likedState[0]; var setLiked=likedState[1];
  var setsState=useState(false); var showSets=setsState[0]; var setShowSets=setsState[1];
  var sorted=player.inventory.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);});
  var featured=sorted.slice(0,5);
  var divsForPlayer={};
  Object.keys(DIVISIONS).forEach(function(div){
    var info=DIVISIONS[div];
    var owned=new Set(player.inventory.filter(function(c){return c.sport===info.sport;}).map(function(c){return c.team;}));
    var count=info.teams.filter(function(t){return owned.has(t);}).length;
    divsForPlayer[div]={count:count,total:info.teams.length,complete:count===info.teams.length,sport:info.sport,teams:info.teams,owned:owned};
  });
  function toggleLike(id){setLiked(function(prev){var n=Object.assign({},prev);n[id]=!n[id];return n;});}
  return (
    <div style={{minHeight:"100vh",background:"#f0ede8",paddingBottom:40}}>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"3px solid #e8161e",padding:"12px 20px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} className="topps-btn-outline" style={{padding:"6px 16px",fontSize:13}}>← Back</button>
        <div style={{width:36,height:36,background:player.color||"#e8161e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:"#fff"}}>{player.avatar}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>{player.name}</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>{player.bio}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,color:"#c8a800"}}>{fmt(player.yield)}/day</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase"}}>{player.inventory.length} cards</div>
        </div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px"}}>
        {/* Featured */}
        <div style={{marginBottom:24}}>
          <div className="topps-section-title">Featured Cards</div>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            {featured.map(function(c){
              var isShaking=shakeTeams[c.team];
              return <div key={c.id} className={isShaking?"haptic":""} style={{flexShrink:0}}>
                <FlipCard card={c} autoFlip={true}/>
              </div>;
            })}
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"flex",gap:0,border:"1px solid #e0ddd8",background:"#fff",marginBottom:20}}>
          {[["Cards",player.inventory.length,"#111"],["Yield/Day",fmt(player.yield)+"/d","#c8a800"],["Top Rarity",(sorted[0]&&sorted[0].rarity)||"—",RCOLORS[(sorted[0]&&sorted[0].rarity)||"Base"]||"#888"]].map(function(s,i){
            return <div key={i} style={{flex:1,padding:"16px 12px",textAlign:"center",borderRight:i<2?"1px solid #e8e8e8":"none"}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,color:s[2],lineHeight:1}}>{s[1]}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa",marginTop:4}}>{s[0]}</div>
            </div>;
          })}
        </div>
        {/* Full collection */}
        <div style={{marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="topps-section-title" style={{marginBottom:0}}>Collection</div>
          <button onClick={function(){setShowSets(!showSets);}} className="topps-btn-outline" style={{padding:"5px 14px",fontSize:12}}>{showSets?"Cards":"Set Progress"}</button>
        </div>
        {!showSets&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:12}}>
          {sorted.map(function(c,i){
            var isShaking=shakeTeams[c.team];
            return <div key={c.id+i} className={"inv-wrap"+(isShaking?" haptic":"")}>
              <FlipCard card={c} autoFlip={true}/>
              <div className="list-ov">
                <button onClick={function(){toggleLike(c.id);}} style={{background:liked[c.id]?"#e8161e":"rgba(0,0,0,0.7)",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,padding:"7px 16px",border:"none",cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>{liked[c.id]?"❤️ Liked":"♡ Like"}</button>
              </div>
            </div>;
          })}
        </div>}
        {showSets&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
          {Object.keys(divsForPlayer).map(function(div){
            var d=divsForPlayer[div];
            var pct=Math.round(d.count/d.total*100);
            var acc={NFL:"#1144cc",NBA:"#cc1133",MLB:"#1155bb",MLS:"#228833",College:"#cc6600"}[d.sport]||"#e8161e";
            return <div key={div} style={{background:"#fff",border:"1px solid #e0ddd8",borderLeft:"3px solid "+(d.complete?"#22cc55":acc),padding:"10px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111"}}>{div}</span>
                <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#555"}}>{d.count}/{d.total}</span>
              </div>
              <div className="set-bar"><div className="set-bar-fill" style={{width:pct+"%",background:d.complete?"#22cc55":acc}}/></div>
            </div>;
          })}
        </div>}
      </div>
    </div>
  );
}
function PlayerRow(props) {
  var player=props.player; var followed=props.followed; var onFollow=props.onFollow; var onView=props.onView;
  var isFollowing=followed.includes(player.name)||followed.includes(player.id);
  var sortedInv=(player.inventory||[]).slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);});
  var topRarity=sortedInv[0]?sortedInv[0].rarity:"Base";
  var ac=RCOLORS[topRarity]||"#aaa";
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#fff",border:"1px solid "+(isFollowing?"#e8161e":"#e0ddd8"),borderLeft:"3px solid "+(isFollowing?"#e8161e":ac)}}>
      <div style={{width:38,height:38,background:player.color||"#e8161e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:"#fff"}}>{player.avatar}</span>
      </div>
      <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={onView}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:"#111",textTransform:"uppercase",letterSpacing:"0.04em"}}>{player.name}</span>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,padding:"1px 5px",border:"1px solid "+ac+"55",color:ac,letterSpacing:"0.08em",textTransform:"uppercase"}}>{topRarity}</span>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#c8a800"}}>{fmt(player.yield)}/d</span>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>{(player.inventory||[]).length} cards</span>
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={onView} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,padding:"5px 12px",border:"1px solid #e0ddd8",background:"#f0ede8",color:"#555",cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>View</button>
        <button onClick={function(){onFollow(player.name);}}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,padding:"5px 12px",border:"none",background:isFollowing?"#111":"#e8161e",color:"#fff",cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>
          {isFollowing?"Following":"+ Follow"}
        </button>
      </div>
    </div>
  );
}
// ── WHALE FEED — global Sovereign pull activity log ──────────────────────────
function WhaleFeed(props) {
  var feedState=useState([]); var feed=feedState[0]; var setFeed=feedState[1];
  var loadingState=useState(true); var loading=loadingState[0]; var setLoading=loadingState[1];
  useEffect(function(){
    if(!supabase){setLoading(false);return;}
    supabase.from("activity_log")
      .select("*").eq("event_type","sovereign_pull")
      .order("created_at",{ascending:false}).limit(20)
      .then(function(res){
        if(res.data) setFeed(res.data);
        setLoading(false);
      });
  },[]);
  if(loading) return <div style={{padding:"20px 0",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa",textAlign:"center"}}>Loading Whale Feed...</div>;
  if(!feed.length) return <div style={{padding:"16px 0",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#aaa",textAlign:"center"}}>No Sovereign pulls yet. Be the first whale.</div>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {feed.map(function(entry,i){
        var rarColor=RCOLORS[entry.top_card_rarity]||"#aaa";
        var ts=entry.created_at?new Date(entry.created_at):null;
        var timeAgo=ts?Math.round((Date.now()-ts.getTime())/60000)+"m ago":"";
        return (
          <div key={entry.id||i} style={{background:"#fff",border:"1px solid rgba(245,197,24,0.2)",borderLeft:"3px solid #f5c518",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:entry.avatar_color||"#f5c518",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>{(entry.avatar_initials||"??").slice(0,2).toUpperCase()}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>{entry.username||"Collector"}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,background:"rgba(245,197,24,0.15)",border:"1px solid rgba(245,197,24,0.4)",color:"#c8a800",padding:"1px 6px",letterSpacing:"0.06em",textTransform:"uppercase"}}>⚡ SOVEREIGN</span>
              </div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666",marginTop:1}}>
                Opened <span style={{fontWeight:600,color:"#111"}}>{entry.pack_name||"Sovereign Vault"}</span>
                {entry.top_card_rarity&&<span> · Top pull: <span style={{color:rarColor,fontWeight:700}}>{entry.top_card_rarity}</span>{entry.top_card_team&&<span style={{color:"#888"}}> {entry.top_card_team}</span>}</span>}
              </div>
            </div>
            <div style={{flexShrink:0,textAlign:"right"}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,color:"#c8a800"}}>−{fmt(entry.coins_spent||50000)}🪙</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:"#bbb",letterSpacing:"0.08em",textTransform:"uppercase"}}>{timeAgo}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Social(props) {
  var inventory=props.inventory; var initialVault=props.initialVault||null; var onClearVault=props.onClearVault; var shakeTeams=props.shakeTeams||{};
  var searchState=useState(""); var search=searchState[0]; var setSearch=searchState[1];
  var followedState=useState(function(){try{return JSON.parse(localStorage.getItem("cd_followed")||"[]");}catch(e){return [];}});
  var followed=followedState[0]; var setFollowed=followedState[1];
  var viewingState=useState(initialVault); var viewing=viewingState[0]; var setViewing=viewingState[1];
  var playersState=useState([]); var players=playersState[0]; var setPlayers=playersState[1];
  var loadingState=useState(true); var loading=loadingState[0]; var setLoading=loadingState[1];
  useEffect(function(){if(initialVault)setViewing(initialVault);},[initialVault]);
  useEffect(function(){
    if(!supabase){setLoading(false);return;}
    supabase.from("profiles").select("*").limit(50).then(function(res){
      if(res.error||!res.data){setLoading(false);return;}
      var profileRows=res.data;
      if(!profileRows.length){setLoading(false);return;}
      var ids=profileRows.map(function(p){return p.id;});
      supabase.from("user_cards").select("*").in("user_id",ids).then(function(cardRes){
        var cardRows=cardRes.data||[];
        var parsed=profileRows.map(function(p){
          var pCards=cardRows.filter(function(c){return c.user_id===p.id;}).map(function(c){return {id:c.card_id||genId(),sport:c.sport,team:c.team,rarity:c.rarity,daily:c.daily||0,win:c.win||0,mp:c.mp||0,likes:0};});
          var yld=pCards.reduce(function(s,c){return s+c.daily;},0);
          return {id:p.id,name:p.username||"Collector",avatar:(p.avatar_initials||"??").slice(0,2).toUpperCase(),color:p.avatar_color||"#f5c518",favTeam:p.fav_team||"",bio:p.bio||"",yield:yld,coins:p.coins||0,inventory:pCards};
        }).filter(function(p){return p.inventory.length>0||p.coins>0;});
        setPlayers(parsed);
        setLoading(false);
      });
    });
  },[]);
  function toggleFollow(name){
    var next=followed.includes(name)?followed.filter(function(n){return n!==name;}):[].concat(followed,[name]);
    setFollowed(next);
    try{localStorage.setItem("cd_followed",JSON.stringify(next));}catch(e){}
  }
  if(viewing){
    var vPlayer=players.find(function(p){return p.name===viewing||p.id===viewing;});
    if(vPlayer) return <PublicVault player={vPlayer} myInventory={inventory} shakeTeams={shakeTeams} onBack={function(){setViewing(null);if(onClearVault)onClearVault();}}/>;
    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"40vh"}}><div style={{color:"#8899bb",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.15em"}}>Loading Vault...</div></div>;
  }
  var filtered=players.filter(function(p){return p.name.toLowerCase().includes(search.toLowerCase());});
  var following=players.filter(function(p){return followed.includes(p.name)||followed.includes(p.id);});
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 60px"}}>
      <div style={{marginBottom:20}}>
        <div className="topps-section-title">Collectors</div>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Discover collectors · Follow rivals · Browse vaults</div>
      </div>
      <div style={{position:"relative",marginBottom:16}}>
        <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search collectors..."
          className="topps-input" style={{paddingLeft:36}}/>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#aaa",pointerEvents:"none"}}>🔍</div>
      </div>
      {loading&&<div style={{textAlign:"center",padding:40,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa"}}>Loading...</div>}
      {!loading&&players.length===0&&<div style={{textAlign:"center",padding:60,background:"#fff",border:"1px solid #e0ddd8"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111",marginBottom:6}}>No collectors yet</div>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Invite friends — their vaults will appear here</div>
      </div>}
      {!loading&&following.length>0&&!search&&<div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#e8161e",marginBottom:10}}>Following ({following.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>{following.map(function(p){return <PlayerRow key={p.id||p.name} player={p} followed={followed} onFollow={toggleFollow} onView={function(){setViewing(p.name);}}/>;})}</div>
      </div>}
      {!loading&&filtered.length>0&&<div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:10}}>{search?"Results":"All Collectors"} ({filtered.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>{filtered.map(function(p){return <PlayerRow key={p.id||p.name} player={p} followed={followed} onFollow={toggleFollow} onView={function(){setViewing(p.name);}}/>;})}</div>
      </div>}
    </div>
  );
}
function Leaderboard(props) {
  var inventory=props.inventory; var balance=props.balance; var onViewVault=props.onViewVault; var profile=props.profile;
  var modeState=useState("yield"); var mode=modeState[0]; var setMode=modeState[1];
  var hovState=useState(null); var hovered=hovState[0]; var setHovered=hovState[1];
  var playersState=useState([]); var players=playersState[0]; var setPlayers=playersState[1];
  var loadingState=useState(true); var loading=loadingState[0]; var setLoading=loadingState[1];
  var userYield=inventory.reduce(function(s,c){return s+c.daily;},0);
  var userPower=inventory.length*10+inventory.filter(function(c){return ["Legacy","Legendary","Dynasty"].includes(c.rarity);}).length*50;
  var userInitials=(profile&&profile.avatarInitials)||"ME";
  var userColor=(profile&&profile.avatarColor)||"#f5c518";
  var userName=(profile&&profile.username)||"You";
  var userPlayer={id:"__me",name:userName,avatar:userInitials,color:userColor,favTeam:(profile&&profile.favTeam)||"",yield:userYield,power:userPower,coins:balance||0,isUser:true};
  useEffect(function(){
    if(!supabase){setLoading(false);return;}
    // Fetch profiles + coins as source of truth — users exist even if user_cards is empty
    supabase.from("profiles").select("id,username,avatar_color,avatar_initials,fav_team,coins").limit(50).then(function(res){
      if(res.error||!res.data){setLoading(false);return;}
      var ids=res.data.map(function(p){return p.id;});
      if(!ids.length){setLoading(false);return;}
      supabase.from("user_cards").select("user_id,daily,rarity").in("user_id",ids).then(function(cardRes){
        var cardRows=cardRes.data||[];
        var parsed=res.data.map(function(p){
          var pCards=cardRows.filter(function(c){return c.user_id===p.id;});
          var yld=pCards.reduce(function(s,c){return s+(c.daily||0);},0);
          var pwr=pCards.length*10+pCards.filter(function(c){return ["Legacy","Legendary","Dynasty"].includes(c.rarity);}).length*50;
          // Use coins as tiebreaker / fallback so users with no cards still appear
          return {id:p.id,name:p.username||"Collector",avatar:(p.avatar_initials||"??").slice(0,2).toUpperCase(),color:p.avatar_color||"#f5c518",favTeam:p.fav_team||"",yield:yld,power:pwr,coins:p.coins||0,cardCount:pCards.length};
        }).filter(function(p){
          // Include anyone with cards OR coins > 0 — excludes empty ghost accounts
          return p.cardCount>0 || p.coins>0;
        });
        setPlayers(parsed);
        setLoading(false);
      });
    });
  },[]);
  var allPlayers=players.filter(function(p){return p.id!=="__me";}).concat([userPlayer]).sort(function(a,b){
    return mode==="yield"?b.yield-a.yield:mode==="coins"?b.coins-a.coins:b.power-a.power;
  });
  var userRank=allPlayers.findIndex(function(p){return p.isUser;})+1;
  var top3=allPlayers.slice(0,3); var rest=allPlayers.slice(3);
  var podiumOrder=[top3[1],top3[0],top3[2]].filter(Boolean);
  var podiumColors=["#b0b8c8","#f5c518","#cd7f32"]; var podiumHeights=[80,110,65]; var podiumRanks=[2,1,3];
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 120px"}}>
      <div style={{marginBottom:20}}>
        <div className="topps-section-title">Rankings</div>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Live leaderboard · Real players</div>
      </div>
      {/* Mode toggle */}
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {[["yield","🪙 Highest Yield"],["coins","💰 Most Coins"],["power","⚡ Collection Power"]].map(function(pair){
          var active=mode===pair[0];
          return <button key={pair[0]} onClick={function(){setMode(pair[0]);}}
            style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"7px 18px",border:"1.5px solid "+(active?"#e8161e":"#ddd"),background:active?"#e8161e":"transparent",color:active?"#fff":"#888",cursor:"pointer"}}>
            {pair[1]}
          </button>;
        })}
      </div>
      {loading&&<div style={{textAlign:"center",padding:40,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa"}}>Loading Rankings...</div>}
      {!loading&&allPlayers.length<2&&<div style={{textAlign:"center",padding:60,background:"#fff",border:"1px solid #e0ddd8"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111",marginBottom:6}}>You're First!</div>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Invite friends to compete</div>
      </div>}
      {/* Podium */}
      {!loading&&allPlayers.length>=2&&(
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:8,marginBottom:24}}>
          {podiumOrder.map(function(player,pi){
            var rank=podiumRanks[pi]; var h=podiumHeights[pi]; var col=podiumColors[pi]; var isFirst=rank===1;
            var val=mode==="yield"?fmt(player.yield)+"/d":mode==="coins"?fmt(player.coins)+"🪙":fmt(player.power)+" pts";
            return <div key={player.id||player.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              {isFirst&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:900,color:"#e8161e",letterSpacing:"0.2em",textTransform:"uppercase",background:"rgba(232,22,30,0.08)",border:"1px solid rgba(232,22,30,0.2)",padding:"2px 10px",marginBottom:2}}>Dynasty King</div>}
              <div style={{width:isFirst?44:36,height:isFirst?44:36,background:player.color||"#e8161e",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isFirst?"0 4px 16px rgba(232,22,30,0.3)":"none"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:isFirst?14:12,color:"#fff"}}>{player.avatar}</span>
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:player.isUser?"#e8161e":"#333",letterSpacing:"0.04em",textTransform:"uppercase",maxWidth:80,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{player.name}</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,color:"#888",fontWeight:700}}>{val}</div>
              <div style={{width:isFirst?80:65,height:h,background:isFirst?"#111":"#e0ddd8",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:isFirst?28:22,color:isFirst?"#fff":"#bbb"}}>#{rank}</span>
              </div>
            </div>;
          })}
        </div>
      )}
      {/* Rest of list */}
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {rest.map(function(player,i){
          var rank=i+4; var isUser=player.isUser;
          var val=mode==="yield"?fmt(player.yield)+"/day":mode==="coins"?fmt(player.coins)+"🪙":fmt(player.power)+" pts";
          var valLabel=mode==="yield"?"yield":mode==="coins"?"coins":"power";
          return <div key={player.id||player.name}
            onMouseEnter={function(){setHovered(rank);}} onMouseLeave={function(){setHovered(null);}}
            style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#fff",border:"1px solid "+(isUser?"#e8161e":"#e0ddd8"),borderLeft:"3px solid "+(isUser?"#e8161e":"transparent"),transition:"all 0.12s",cursor:"pointer"}}
            onClick={function(){if(!isUser&&onViewVault)onViewVault(player.name);}}>
            <div style={{width:28,textAlign:"center",fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,color:isUser?"#e8161e":"#aaa",flexShrink:0}}>#{rank}</div>
            <div style={{width:32,height:32,background:player.color||"#e8161e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>{player.avatar}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,letterSpacing:"0.04em",textTransform:"uppercase",color:isUser?"#e8161e":"#111"}}>{player.name}</span>
                {isUser&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:900,background:"#e8161e",color:"#fff",padding:"1px 6px",letterSpacing:"0.06em",textTransform:"uppercase"}}>You</span>}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,color:isUser?"#e8161e":"#333"}}>{val}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#aaa"}}>{valLabel}</div>
            </div>
          </div>;
        })}
      </div>
      {/* My standing footer */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"#fff",borderTop:"3px solid #e8161e",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:userColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>{userInitials}</span>
          </div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#888",letterSpacing:"0.15em",textTransform:"uppercase"}}>Your Standing</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#e8161e",letterSpacing:"0.04em",textTransform:"uppercase"}}>Rank #{userRank} of {allPlayers.length}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:"#c8a800"}}>
            {mode==="yield"?fmt(userYield)+"/day":mode==="coins"?fmt(balance||0)+"🪙":fmt(userPower)+" pts"}
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#aaa"}}>
            {mode==="yield"?"daily yield":mode==="coins"?"coins":"power"}
          </div>
        </div>
      </div>
    </div>
  );
}
// Scrolling live score ticker — sits above everything, clickable scores highlight cards
function OracleBar(props) {
  var liveGames=props.liveGames; var onClickTeam=props.onClickTeam;
  var live=liveGames.filter(function(g){return g.status==="live";});
  if(live.length===0) return null;
  var si={NFL:"🏈",NBA:"🏀",MLB:"⚾",MLS:"⚽",College:"🏈"};
  function TickerItem(p) {
    var g=p.game;
    var leader=g.homeScore>g.awayScore?g.home:g.awayScore>g.homeScore?g.away:null;
    return (
      <span style={{display:"inline-flex",alignItems:"center",gap:6,marginRight:32,flexShrink:0}}>
        <span style={{fontSize:11,opacity:0.7}}>{si[g.sport]}</span>
        <span onClick={function(){if(onClickTeam)onClickTeam(g.away);}}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:leader===g.away?"#f5c518":"rgba(255,255,255,0.9)",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>{g.away}</span>
        <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,fontSize:13,color:leader===g.away?"#f5c518":"#fff"}}>{g.awayScore}</span>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700}}>–</span>
        <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,fontSize:13,color:leader===g.home?"#f5c518":"#fff"}}>{g.homeScore}</span>
        <span onClick={function(){if(onClickTeam)onClickTeam(g.home);}}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:leader===g.home?"#f5c518":"rgba(255,255,255,0.9)",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>{g.home}</span>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:"0.06em"}}>
          {g.sport==="MLB"?"Inn":(g.sport==="MLS"?"H":"Q")}{g.quarter} {g.timeLeft}
        </span>
        <span style={{color:"rgba(255,255,255,0.2)",fontSize:12,marginLeft:4}}>◆</span>
      </span>
    );
  }
  var items=live.concat(live);
  var dur=Math.max(18,live.length*6);
  return (
    <div style={{background:"#e8161e",height:28,overflow:"hidden",display:"flex",alignItems:"center",position:"sticky",top:0,zIndex:200}}>
      <div style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"0 10px",borderRight:"1px solid rgba(255,255,255,0.2)",height:"100%",background:"rgba(0,0,0,0.25)"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#fff",animation:"pulse 1s ease-in-out infinite"}}/>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:"#fff",letterSpacing:"0.22em"}}>LIVE</span>
      </div>
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <div style={{display:"inline-flex",alignItems:"center",whiteSpace:"nowrap",animation:"oracleTicker "+dur+"s linear infinite",paddingLeft:16}}>
          {items.map(function(g,i){return <TickerItem key={g.id+"_"+i} game={g}/>;}) }
        </div>
      </div>
    </div>
  );
}
var BIG_PLAY_TYPES2={NFL:["TOUCHDOWN! 🏈","FIELD GOAL! 🏈","INTERCEPTION! 🏈"],NBA:["SLAM DUNK! 🏀","3-POINTER! 🏀","BUZZER BEATER! 🏀"],MLB:["HOME RUN! ⚾","GRAND SLAM! ⚾","STRIKE OUT! ⚾"],MLS:["GOAL! ⚽","HAT TRICK! ⚽"],College:["TOUCHDOWN! 🏈","PICK SIX! 🏈"]};
// ESPN uses full city+name ("Dallas Cowboys"), cards use short names ("Cowboys").
var ESPN_NAME_MAP={
  "Kansas City Chiefs":"Chiefs","Philadelphia Eagles":"Eagles","Dallas Cowboys":"Cowboys",
  "San Francisco 49ers":"49ers","Baltimore Ravens":"Ravens","Buffalo Bills":"Bills",
  "Miami Dolphins":"Dolphins","Cincinnati Bengals":"Bengals","Detroit Lions":"Lions",
  "Green Bay Packers":"Packers","Chicago Bears":"Bears","Minnesota Vikings":"Vikings",
  "New York Giants":"Giants","New York Jets":"Jets","New England Patriots":"Patriots",
  "Pittsburgh Steelers":"Steelers","Denver Broncos":"Broncos","Las Vegas Raiders":"Raiders",
  "Los Angeles Chargers":"Chargers","Seattle Seahawks":"Seahawks","Tennessee Titans":"Titans",
  "Indianapolis Colts":"Colts","Jacksonville Jaguars":"Jaguars","Houston Texans":"Texans",
  "Cleveland Browns":"Browns","Carolina Panthers":"Panthers","New Orleans Saints":"Saints",
  "Tampa Bay Buccaneers":"Buccaneers","Atlanta Falcons":"Falcons","Los Angeles Rams":"Rams",
  "Arizona Cardinals":"Cardinals","Washington Commanders":"Washington",
  "Los Angeles Lakers":"Lakers","Boston Celtics":"Celtics","Golden State Warriors":"Warriors",
  "Milwaukee Bucks":"Bucks","Denver Nuggets":"Nuggets","Miami Heat":"Heat",
  "Phoenix Suns":"Suns","Los Angeles Clippers":"Clippers","Philadelphia 76ers":"76ers",
  "Brooklyn Nets":"Nets","Chicago Bulls":"Bulls","New York Knicks":"Knicks",
  "Dallas Mavericks":"Mavericks","Memphis Grizzlies":"Grizzlies","New Orleans Pelicans":"Pelicans",
  "Atlanta Hawks":"Hawks","Toronto Raptors":"Raptors","Portland Trail Blazers":"Blazers",
  "Utah Jazz":"Jazz","San Antonio Spurs":"Spurs","Minnesota Timberwolves":"Timberwolves",
  "Oklahoma City Thunder":"Thunder","Sacramento Kings":"Kings","Indiana Pacers":"Pacers",
  "Charlotte Hornets":"Hornets","Washington Wizards":"Wizards","Detroit Pistons":"Pistons",
  "Orlando Magic":"Magic","Cleveland Cavaliers":"Cavaliers",
  "New York Yankees":"Yankees","Los Angeles Dodgers":"Dodgers","Boston Red Sox":"Red Sox",
  "Chicago Cubs":"Cubs","San Francisco Giants":"Giants","St. Louis Cardinals":"Cardinals",
  "Atlanta Braves":"Braves","Houston Astros":"Astros","New York Mets":"Mets",
  "Philadelphia Phillies":"Phillies","Toronto Blue Jays":"Blue Jays","Milwaukee Brewers":"Brewers",
  "San Diego Padres":"Padres","Seattle Mariners":"Mariners","Texas Rangers":"Rangers",
  "Detroit Tigers":"Tigers","Minnesota Twins":"Twins","Chicago White Sox":"White Sox",
  "Kansas City Royals":"Royals","Baltimore Orioles":"Orioles","Tampa Bay Rays":"Rays",
  "Cleveland Guardians":"Guardians","Los Angeles Angels":"Angels","Oakland Athletics":"Athletics",
  "Pittsburgh Pirates":"Pirates","Colorado Rockies":"Rockies","Arizona Diamondbacks":"Diamondbacks",
  "Cincinnati Reds":"Reds","Miami Marlins":"Marlins","Washington Nationals":"Nationals",
  "LA Galaxy":"LA Galaxy","Los Angeles Galaxy":"LA Galaxy","Los Angeles FC":"LAFC","LAFC":"LAFC",
  "Atlanta United FC":"Atlanta United","Atlanta United":"Atlanta United",
  "Seattle Sounders FC":"Seattle Sounders","Seattle Sounders":"Seattle Sounders",
  "Portland Timbers":"Portland Timbers",
  "New York City FC":"NYC FC","NYCFC":"NYC FC","NYC FC":"NYC FC",
  "Inter Miami CF":"Inter Miami","Inter Miami":"Inter Miami",
  "New York Red Bulls":"Red Bulls","Red Bulls":"Red Bulls",
  "Chicago Fire FC":"Chicago Fire","Chicago Fire":"Chicago Fire",
  "Columbus Crew":"Columbus Crew",
  "Toronto FC":"Toronto FC","Toronto":"Toronto FC",
  "CF Montréal":"Montreal","CF Montreal":"Montreal","Montreal":"Montreal",
  "New England Revolution":"Revolution","Revolution":"Revolution",
  "D.C. United":"DC United","DC United":"DC United",
  "Orlando City SC":"Orlando City","Orlando City":"Orlando City",
  "FC Dallas":"FC Dallas","Dallas":"FC Dallas",
  "Houston Dynamo FC":"Houston Dynamo","Houston Dynamo":"Houston Dynamo",
  "Colorado Rapids":"Colorado Rapids",
  "Real Salt Lake":"Real Salt Lake",
  "Minnesota United FC":"Minnesota United","Minnesota United":"Minnesota United",
  "Sporting Kansas City":"Sporting KC","Sporting KC":"Sporting KC",
  "Vancouver Whitecaps FC":"Vancouver","Vancouver Whitecaps":"Vancouver","Vancouver":"Vancouver",
  "San Jose Earthquakes":"San Jose","San Jose":"San Jose",
  "Philadelphia Union":"Philadelphia Union",
  "Nashville SC":"Nashville","Nashville":"Nashville",
  "FC Cincinnati":"FC Cincinnati","Cincinnati":"FC Cincinnati",
  "Austin FC":"Austin FC","Austin":"Austin FC",
  "St. Louis City SC":"St. Louis City","St Louis City":"St. Louis City",
  "Charlotte FC":"Charlotte FC","Charlotte":"Charlotte FC",
  "St. Louis City":"St. Louis City","Portland":"Portland Timbers",
  "Alabama Crimson Tide":"Alabama","Ohio State Buckeyes":"Ohio State","Georgia Bulldogs":"Georgia",
  "Michigan Wolverines":"Michigan","LSU Tigers":"LSU","Clemson Tigers":"Clemson",
  "Oklahoma Sooners":"Oklahoma","Notre Dame Fighting Irish":"Notre Dame",
  "USC Trojans":"USC","Texas Longhorns":"Texas","Penn State Nittany Lions":"Penn State",
  "Florida Gators":"Florida","Tennessee Volunteers":"Tennessee","Oregon Ducks":"Oregon",
  "Auburn Tigers":"Auburn","Miami Hurricanes":"Miami","Nebraska Cornhuskers":"Nebraska",
  "Iowa Hawkeyes":"Iowa","Wisconsin Badgers":"Wisconsin","Arkansas Razorbacks":"Arkansas",
};
var ESPN_ABBR_MAP={
  "NFL:KC":"Chiefs","NFL:PHI":"Eagles","NFL:DAL":"Cowboys","NFL:SF":"49ers",
  "NFL:BAL":"Ravens","NFL:BUF":"Bills","NFL:MIA":"Dolphins","NFL:CIN":"Bengals",
  "NFL:DET":"Lions","NFL:GB":"Packers","NFL:CHI":"Bears","NFL:MIN":"Vikings",
  "NFL:NYG":"Giants","NFL:NYJ":"Jets","NFL:NE":"Patriots","NFL:PIT":"Steelers",
  "NFL:DEN":"Broncos","NFL:LV":"Raiders","NFL:LAC":"Chargers","NFL:SEA":"Seahawks",
  "NFL:TEN":"Titans","NFL:IND":"Colts","NFL:JAX":"Jaguars","NFL:HOU":"Texans",
  "NFL:CLE":"Browns","NFL:CAR":"Panthers","NFL:NO":"Saints","NFL:TB":"Buccaneers",
  "NFL:ATL":"Falcons","NFL:LAR":"Rams","NFL:ARI":"Cardinals","NFL:WSH":"Washington",
  "NBA:LAL":"Lakers","NBA:BOS":"Celtics","NBA:GSW":"Warriors","NBA:MIL":"Bucks",
  "NBA:DEN":"Nuggets","NBA:MIA":"Heat","NBA:PHX":"Suns","NBA:LAC":"Clippers",
  "NBA:PHI":"76ers","NBA:BKN":"Nets","NBA:CHI":"Bulls","NBA:NYK":"Knicks",
  "NBA:DAL":"Mavericks","NBA:MEM":"Grizzlies","NBA:NOP":"Pelicans","NBA:ATL":"Hawks",
  "NBA:TOR":"Raptors","NBA:POR":"Blazers","NBA:UTA":"Jazz","NBA:SAS":"Spurs",
  "NBA:MIN":"Timberwolves","NBA:OKC":"Thunder","NBA:SAC":"Kings","NBA:IND":"Pacers",
  "NBA:CHA":"Hornets","NBA:WAS":"Wizards","NBA:DET":"Pistons","NBA:ORL":"Magic","NBA:CLE":"Cavaliers",
  "MLB:NYY":"Yankees","MLB:LAD":"Dodgers","MLB:BOS":"Red Sox","MLB:CHC":"Cubs",
  "MLB:SF":"Giants","MLB:STL":"Cardinals","MLB:ATL":"Braves","MLB:HOU":"Astros",
  "MLB:NYM":"Mets","MLB:PHI":"Phillies","MLB:TOR":"Blue Jays","MLB:MIL":"Brewers",
  "MLB:SD":"Padres","MLB:SEA":"Mariners","MLB:TEX":"Rangers","MLB:DET":"Tigers",
  "MLB:MIN":"Twins","MLB:CWS":"White Sox","MLB:KC":"Royals","MLB:BAL":"Orioles",
  "MLB:TB":"Rays","MLB:CLE":"Guardians","MLB:LAA":"Angels","MLB:OAK":"Athletics",
  "MLB:PIT":"Pirates","MLB:COL":"Rockies","MLB:ARI":"Diamondbacks","MLB:CIN":"Reds",
  "MLB:MIA":"Marlins","MLB:WSH":"Nationals",
  "MLS:LA":"LA Galaxy","MLS:LAFC":"LAFC","MLS:ATL":"Atlanta United",
  "MLS:SEA":"Seattle Sounders","MLS:POR":"Portland Timbers","MLS:NYC":"NYC FC",
  "MLS:MIA":"Inter Miami","MLS:RBNY":"Red Bulls","MLS:CHI":"Chicago Fire","MLS:CLB":"Columbus Crew",
  "MLS:TOR":"Toronto FC","MLS:MTL":"Montreal","MLS:NE":"Revolution","MLS:DC":"DC United",
  "MLS:ORL":"Orlando City","MLS:DAL":"FC Dallas","MLS:HOU":"Houston Dynamo",
  "MLS:COL":"Colorado Rapids","MLS:RSL":"Real Salt Lake","MLS:MIN":"Minnesota United",
  "MLS:SKC":"Sporting KC","MLS:VAN":"Vancouver","MLS:SJ":"San Jose",
  "MLS:PHI":"Philadelphia Union","MLS:NSH":"Nashville","MLS:CIN":"FC Cincinnati",
  "MLS:ATX":"Austin FC","MLS:STL":"St. Louis City","MLS:CLT":"Charlotte FC",
};
function resolveTeamName(displayName, abbr, sport) {
  if(ESPN_NAME_MAP[displayName]) return ESPN_NAME_MAP[displayName];
  if(sport&&abbr&&ESPN_ABBR_MAP[sport+":"+abbr]) return ESPN_ABBR_MAP[sport+":"+abbr];
  var words=displayName.split(" ");
  var last=words[words.length-1];
  var known=Object.values(ESPN_NAME_MAP);
  if(known.indexOf(last)>=0) return last;
  if(words.length>=2){var twoWord=words.slice(-2).join(" ");if(known.indexOf(twoWord)>=0) return twoWord;}
  return last||displayName;
}
// Tries multiple name candidates in order — used for soccer where ESPN returns inconsistent fields
function resolveTeamNameMulti(names, abbr, sport) {
  for(var i=0;i<names.length;i++){
    var n=names[i];
    if(!n) continue;
    if(ESPN_NAME_MAP[n]) return ESPN_NAME_MAP[n];
    if(sport&&abbr&&ESPN_ABBR_MAP[sport+":"+abbr]) return ESPN_ABBR_MAP[sport+":"+abbr];
    // Check if this name IS already one of our card names directly
    var cardNames=Object.values(ESPN_NAME_MAP);
    if(cardNames.indexOf(n)>=0) return n;
    // Try last word
    var words=n.split(" "); var last=words[words.length-1];
    if(cardNames.indexOf(last)>=0) return last;
    // Try last two words
    if(words.length>=2){var tw=words.slice(-2).join(" ");if(cardNames.indexOf(tw)>=0) return tw;}
  }
  // Last resort: return the longest non-empty candidate
  var best=names.filter(Boolean).sort(function(a,b){return b.length-a.length;})[0]||"";
  return best;
}
// active is computed from the real current month so the app self-corrects
// Month ranges are inclusive. JS months are 0-indexed (0=Jan, 11=Dec).
var _m=new Date().getMonth(); // 0-11
var _d=new Date().getDate();
function inMonths(months){ return months.indexOf(_m)>=0; }
var _draftDate=new Date(new Date().getFullYear(),3,23); // April 23
var _draftDays=Math.max(0,Math.ceil((_draftDate-new Date())/(1000*60*60*24)));
var _draftLabel=_draftDays===0?"DRAFT DAY 🏈":_draftDays===1?"Draft Tomorrow":("Draft in "+_draftDays+" days");
var _isFinalFour=_m===3&&_d>=4&&_d<=7;
var SEASON_CALENDAR={
  NFL:{
    // Draft Apr (3) — shown as special event, not "active" for games
    active: inMonths([8,9,10,11,0,1]),
    isDraft: inMonths([3])&&_d>=1&&_d<=30,
    reason: inMonths([8,9,10,11,0,1])?"Regular Season / Playoffs":inMonths([3])?"NFL Draft Season":"Offseason",
    note: inMonths([3])?_draftLabel:"Returns September",
    espnUrl:"https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    color:"#4488ff",
    icon:"🏈",
  },
  NBA:{
    active: inMonths([9,10,11,0,1,2,3,4,5]),
    reason: inMonths([3,4,5])?"Playoffs":"Regular Season",
    note: inMonths([3])?"Playoffs start mid-April":inMonths([4,5])?"Playoffs active":"Active",
    espnUrl:"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    color:"#ff6622",
    icon:"🏀",
  },
  MLB:{
    active: inMonths([3,4,5,6,7,8,9]),
    reason: inMonths([9])?"Playoffs / World Series":inMonths([3])?"Opening Month":"Regular Season",
    note: inMonths([3])?"Opening Month — early standings":"Active",
    espnUrl:"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    color:"#44cc88",
    icon:"⚾",
  },
  MLS:{
    active: inMonths([1,2,3,4,5,6,7,8,9,10]),
    reason: inMonths([10])?"Playoffs":"Regular Season",
    note:"Active",
    espnUrl:"https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard",
    color:"#ff4466",
    icon:"⚽",
  },
  College:{
    // Final Four in April gets a 2x multiplier event but no live games
    active: inMonths([8,9,10,11,0]),
    isFinalFour: _isFinalFour,
    reason: inMonths([11,0])?"Bowl Season / Playoffs":inMonths([8,9,10])?"Regular Season":_isFinalFour?"🏀 Final Four Weekend":"Spring Practice",
    note: _isFinalFour?"2x Championship Multiplier active!":inMonths([8,9,10,11,0])?"Active":"Football returns September",
    espnUrl:"https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
    color:"#ffaa22",
    icon:"🏈",
  },
};
var ESPN_ENDPOINTS=Object.keys(SEASON_CALENDAR)
  .filter(function(sport){return SEASON_CALENDAR[sport].active;})
  .map(function(sport){return {sport:sport,url:SEASON_CALENDAR[sport].espnUrl};});
function parseESPNEvent(event, sport) {
  var comp=event.competitions&&event.competitions[0];
  if(!comp) return null;
  var competitors=comp.competitors||[];
  var home=competitors.find(function(c){return c.homeAway==="home";})||competitors[0]||{};
  var away=competitors.find(function(c){return c.homeAway==="away";})||competitors[1]||{};
  if(!home.team||!away.team) return null;
  // For soccer ESPN returns name fields differently — try multiple fields in order
  var homeNames=[home.team.displayName||"",home.team.shortDisplayName||"",home.team.name||"",home.team.nickname||""];
  var awayNames=[away.team.displayName||"",away.team.shortDisplayName||"",away.team.name||"",away.team.nickname||""];
  var homeName=resolveTeamNameMulti(homeNames,home.team.abbreviation||"",sport);
  var awayName=resolveTeamNameMulti(awayNames,away.team.abbreviation||"",sport);
  var st=event.status||{};
  var stType=st.type||{};
  var state=stType.state||"pre";
  var status=state==="in"?"live":state==="post"?"final":"pre";
  var period=st.period||0;
  var clock=st.displayClock||"0:00";
  var kickoffMins=status==="pre"?rand(5,120):0;
  return {
    id:event.id||genId(),
    sport:sport,
    home:homeName,
    away:awayName,
    homeScore:parseInt(home.score||"0",10)||0,
    awayScore:parseInt(away.score||"0",10)||0,
    status:status,
    quarter:period,
    timeLeft:clock,
    kickoffMins:kickoffMins,
    homeDisplay:home.team.shortDisplayName||homeName,
    awayDisplay:away.team.shortDisplayName||awayName,
  };
}
function genSlate(){
  var activeSpecs={
    NBA:ALL_TEAMS.NBA,
    MLB:ALL_TEAMS.MLB,
    MLS:ALL_TEAMS.MLS,
  };
  var games=[];
  Object.keys(activeSpecs).forEach(function(sport){
    var teams=activeSpecs[sport].slice().sort(function(){return Math.random()-0.5;});
    var count=sport==="MLS"?3:4;
    var maxScore=sport==="NBA"?130:sport==="MLB"?10:4;
    var minScore=sport==="NBA"?80:0;
    for(var i=0;i<count;i++){
      var live=Math.random()<0.4;
      var hs=live?rand(minScore,maxScore):0;
      var as=live?rand(minScore,maxScore):0;
      var qtr=sport==="NBA"?rand(1,4):sport==="MLB"?rand(1,9):rand(1,2);
      games.push({
        id:genId(),sport:sport,
        home:teams[(i*2)%teams.length],
        away:teams[(i*2+1)%teams.length],
        homeScore:hs,awayScore:as,
        status:live?"live":"pre",
        kickoffMins:live?0:rand(10,90),
        quarter:live?qtr:0,
        timeLeft:live?(sport==="NBA"?rand(0,11)+":"+String(rand(0,59)).padStart(2,"0"):sport==="MLB"?"Top "+rand(1,9):""+rand(0,44)+"'"):"",
      });
    }
  });
  return games;
}
function useLiveOracle(onBigPlay, onGameEnd) {
  var gs=useState([]); var liveGames=gs[0]; var setLiveGames=gs[1];
  var fs=useState(false); var forced=fs[0]; var setForced=fs[1];
  var loadingState=useState(true); var loading=loadingState[0]; var setLoading=loadingState[1];
  var espnOkState=useState(false); var espnOk=espnOkState[0]; var setEspnOk=espnOkState[1];
  var bigPlayRef=useRef(onBigPlay);
  var gameEndRef=useRef(onGameEnd);
  var prevLiveRef=useRef({}); // track previous scores to detect big plays & game endings
  useEffect(function(){ bigPlayRef.current=onBigPlay; });
  useEffect(function(){ gameEndRef.current=onGameEnd; });
  var liveTeams=new Set();
  var preTeams={};
  var redZoneTeams=new Set();
  liveGames.forEach(function(g){
    if(g.status==="live"){
      liveTeams.add(g.home);
      liveTeams.add(g.away);
      var diff=Math.abs(g.homeScore-g.awayScore);
      var isRZ=false;
      if(g.sport==="NFL"||g.sport==="College") isRZ=g.quarter>=4&&diff<=4;
      else if(g.sport==="NBA") isRZ=g.quarter>=4&&diff<=5;
      else if(g.sport==="MLB") isRZ=g.quarter>=8&&diff<=1;
      else if(g.sport==="MLS") isRZ=diff<=1; // any 1-goal game is tense in soccer
      if(isRZ){redZoneTeams.add(g.home);redZoneTeams.add(g.away);}
    }
    if(g.status==="pre"){preTeams[g.home]=g.kickoffMins;preTeams[g.away]=g.kickoffMins;}
  });
  function fetchESPN() {
    var promises=ESPN_ENDPOINTS.map(function(ep){
      // Call our Vercel serverless proxy instead of ESPN directly
      // This avoids CORS — ESPN blocks direct browser requests
      var proxyUrl="/api/scores?sport="+ep.sport;
      return fetch(proxyUrl)
        .then(function(r){return r.ok?r.json():Promise.reject(r.status);})
        .then(function(data){
          var events=data.events||[];
          return events.map(function(e){return parseESPNEvent(e,ep.sport);}).filter(Boolean);
        })
        .catch(function(err){
          console.warn("Score fetch failed for "+ep.sport+":",err);
          return [];
        });
    });
    Promise.all(promises).then(function(results){
      var allGames=results.reduce(function(acc,arr){return acc.concat(arr);},[]);
      if(allGames.length===0){
        setLiveGames(function(prev){return prev.length===0?genSlate():prev;});
        setLoading(false);
        return;
      }
      setEspnOk(true);
      setLiveGames(function(prev){
        var prevMap={};
        prev.forEach(function(g){prevMap[g.id]=g;});
        allGames.forEach(function(g){
          var old=prevMap[g.id];
          if(!old) return;
          if(g.status==="live"&&old.status==="live"){
            var hDiff=g.homeScore-old.homeScore;
            var aDiff=g.awayScore-old.awayScore;
            if(hDiff>0&&bigPlayRef.current){
              var plays=BIG_PLAY_TYPES2[g.sport]||BIG_PLAY_TYPES2.NFL;
              bigPlayRef.current(g.home,plays[rand(0,plays.length-1)],g.sport);
            }
            if(aDiff>0&&bigPlayRef.current){
              var plays2=BIG_PLAY_TYPES2[g.sport]||BIG_PLAY_TYPES2.NFL;
              bigPlayRef.current(g.away,plays2[rand(0,plays2.length-1)],g.sport);
            }
          }
          if(g.status==="final"&&old.status==="live"&&gameEndRef.current){
            var winner=g.homeScore>=g.awayScore?g.home:g.away;
            gameEndRef.current(winner,g.homeScore,g.awayScore,g);
          }
        });
        return allGames;
      });
      setLoading(false);
    });
  }
  useEffect(function(){
    fetchESPN();
    var poll=setInterval(fetchESPN, 30000);
    return function(){clearInterval(poll);};
  },[]);
  // Adds score variation to keep the UI alive between ESPN polls
  useEffect(function(){
    var interval=setInterval(function(){
      if(espnOk) return; // ESPN is working — don't simulate over it
      setLiveGames(function(prev){
        if(prev.length===0) return prev;
        return prev.map(function(g){
          if(g.status!=="live") return g;
          var u=Object.assign({},g);
          if(Math.random()<0.35){
            var home=Math.random()<0.5;
            var pts=g.sport==="NBA"?rand(1,3):g.sport==="MLB"?1:rand(3,7);
            if(home) u.homeScore=g.homeScore+pts; else u.awayScore=g.awayScore+pts;
            var team=home?g.home:g.away;
            var plays=BIG_PLAY_TYPES2[g.sport]||BIG_PLAY_TYPES2.NFL;
            if(bigPlayRef.current) bigPlayRef.current(team,plays[rand(0,plays.length-1)],g.sport);
          }
          if(Math.random()<0.05){
            u.status="final";
            var winner=u.homeScore>=u.awayScore?u.home:u.away;
            if(gameEndRef.current) gameEndRef.current(winner,u.homeScore,u.awayScore,g);
          }
          return u;
        });
      });
    },15000);
    return function(){clearInterval(interval);};
  },[espnOk]);
  function forceStartAll(){
    setLiveGames(function(prev){
      return prev
        .filter(function(g){return SEASON_CALENDAR[g.sport]&&SEASON_CALENDAR[g.sport].active;})
        .map(function(g){
          var lo=g.sport==="NBA"?85:g.sport==="MLB"?0:g.sport==="MLS"?0:0;
          var hi=g.sport==="NBA"?128:g.sport==="MLB"?9:g.sport==="MLS"?4:21;
          var qtr=g.sport==="NBA"?rand(1,4):g.sport==="MLB"?rand(1,9):rand(1,2);
          var clock=g.sport==="NBA"?(rand(0,11)+":"+String(rand(0,59)).padStart(2,"0")):g.sport==="MLB"?"":rand(0,14)+":"+String(rand(0,59)).padStart(2,"0");
          return Object.assign({},g,{status:"live",homeScore:rand(lo,hi),awayScore:rand(lo,hi),quarter:qtr,timeLeft:clock});
        });
    });
    setForced(true);
  }
  function devModeActivate(){
    setLiveGames(function(prev){
      var src=prev.length?prev:genSlate();
      var candidates=src.filter(function(g){
        return g.status!=="live"&&SEASON_CALENDAR[g.sport]&&SEASON_CALENDAR[g.sport].active;
      });
      var shuffled=candidates.slice().sort(function(){return Math.random()-0.5;});
      var pick=new Set(shuffled.slice(0,3).map(function(g){return g.id;}));
      return src.map(function(g){
        if(!pick.has(g.id)) return g;
        var lo=g.sport==="NBA"?85:0; var hi=g.sport==="NBA"?118:g.sport==="MLB"?8:3;
        var base=rand(lo,hi);
        var diff=Math.random()<0.5?rand(0,4):rand(5,hi-lo);
        return Object.assign({},g,{
          status:"live",homeScore:base,awayScore:Math.max(lo,base-diff),
          quarter:g.sport==="MLB"?rand(7,9):4,
          timeLeft:g.sport==="NBA"?(rand(0,7)+":"+String(rand(0,59)).padStart(2,"0")):g.sport==="MLB"?"":rand(0,7)+":"+String(rand(0,59)).padStart(2,"0"),
        });
      });
    });
  }
  function resetGames(){
    setEspnOk(false);
    setLiveGames(genSlate());
    setForced(false);
    setLoading(true);
    setTimeout(fetchESPN,100);
  }
  return {
    liveGames:liveGames,liveTeams:liveTeams,preTeams:preTeams,
    redZoneTeams:redZoneTeams,forced:forced,loading:loading,espnOk:espnOk,
    forceStartAll:forceStartAll,devModeActivate:devModeActivate,resetGames:resetGames,
  };
}
function LiveGamesTab(props){
  var liveGames=props.liveGames; var inventory=props.inventory; var forceStartAll=props.forceStartAll; var resetGames=props.resetGames; var forced=props.forced;
  var redZoneTeams=props.redZoneTeams||new Set();
  var espnOk=props.espnOk||false; var loading=props.loading||false;
  var myTeams=new Set(inventory.map(function(c){return c.team;}));
  var si={NFL:"🏈",NBA:"🏀",MLB:"⚾",MLS:"⚽",College:"🏈"};
  var sc2={NFL:"#4488ff",NBA:"#ff6622",MLB:"#44cc88"};
  var by={live:[],pre:[],final:[]};
  liveGames.forEach(function(g){if(by[g.status])by[g.status].push(g);});
  // Returns the right period label per sport: Q for NFL/NBA, Inn for MLB, H for MLS/soccer
  function periodLabel(sport, period) {
    if(!period) return "";
    if(sport==="MLB") return "Inn "+period;
    if(sport==="MLS") return "H"+period;
    if(sport==="College") return "Q"+period;
    return "Q"+period; // NFL, NBA default
  }

  // Red Zone: critical late-game moment. Only meaningful for NFL and NBA.
  // MLB = 1-run game in the 8th/9th. MLS = 1-goal game in 80th+ min. Otherwise off.
  function isRedZoneGame(g) {
    if(g.status!=="live") return false;
    var diff=Math.abs(g.homeScore-g.awayScore);
    if(g.sport==="NFL") return g.quarter>=4&&diff<=4;
    if(g.sport==="NBA") return g.quarter>=4&&diff<=5;
    if(g.sport==="MLB") return g.quarter>=8&&diff<=1;
    if(g.sport==="MLS") {
      // timeLeft for soccer comes back as mm:00 — check if past 75 min
      var mins=parseInt(g.timeLeft)||0;
      return mins>=75&&diff<=1;
    }
    if(g.sport==="College") return g.quarter>=4&&diff<=7;
    return false;
  }

  function GCard(p){
    var g=p.game; var isLive=g.status==="live"; var isFinal=g.status==="final";
    var hOwned=myTeams.has(g.home); var aOwned=myTeams.has(g.away);
    var hWin=isFinal&&g.homeScore>g.awayScore; var aWin=isFinal&&g.awayScore>g.homeScore;
    var hCol=getColors(g.home)[0]; var aCol=getColors(g.away)[0];
    var sportAcc={NFL:"#1144cc",NBA:"#cc1133",MLB:"#1155bb",MLS:"#228833",College:"#cc6600"}[g.sport]||"#e8161e";
    return (
      <div style={{background:"#fff",border:"1px solid #e0ddd8",borderTop:"3px solid "+(isLive?"#22cc55":isFinal?"#aaa":sportAcc),position:"relative",overflow:"hidden",padding:"12px 14px"}}>
        {isLive&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"#22cc55",animation:"shimmerSweep 2s ease-in-out infinite"}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:sportAcc,textTransform:"uppercase",letterSpacing:"0.1em"}}>{si[g.sport]} {g.sport}</span>
          {isLive&&<div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#22cc55",animation:"pulse 1s ease-in-out infinite"}}/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#22aa44",letterSpacing:"0.06em",textTransform:"uppercase"}}>LIVE {periodLabel(g.sport,g.quarter)} {g.timeLeft}</span>
          </div>}
          {g.status==="pre"&&<span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,color:"#888"}}>in {g.kickoffMins}m</span>}
          {isFinal&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em"}}>Final</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:3}}>
              <div style={{width:8,height:8,background:aCol,flexShrink:0}}/>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:aWin?"#e8161e":aOwned?"#22aa44":"#333",textTransform:"uppercase",letterSpacing:"0.04em"}}>{g.away}</span>
              {aOwned&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:800,background:"#22aa44",color:"#fff",padding:"1px 4px",letterSpacing:"0.06em"}}>OWNED</span>}
            </div>
            {(isLive||isFinal)&&<div style={{fontFamily:"'Roboto Mono',monospace",fontSize:26,fontWeight:700,color:aWin?"#e8161e":"#111"}}>{g.awayScore}</div>}
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:"#ccc",fontWeight:700,flexShrink:0}}>VS</div>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:3}}>
              {hOwned&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:800,background:"#22aa44",color:"#fff",padding:"1px 4px",letterSpacing:"0.06em"}}>OWNED</span>}
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:hWin?"#e8161e":hOwned?"#22aa44":"#333",textTransform:"uppercase",letterSpacing:"0.04em"}}>{g.home}</span>
              <div style={{width:8,height:8,background:hCol,flexShrink:0}}/>
            </div>
            {(isLive||isFinal)&&<div style={{fontFamily:"'Roboto Mono',monospace",fontSize:26,fontWeight:700,color:hWin?"#e8161e":"#111"}}>{g.homeScore}</div>}
          </div>
        </div>
        {isLive&&(hOwned||aOwned)&&<div style={{marginTop:8,background:"#fffbeb",border:"1px solid #f5e0a0",padding:"4px 10px",textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#c8a800",letterSpacing:"0.08em",textTransform:"uppercase"}}>YOUR CARD IS LIVE — 1.5× YIELD</div>}
        {isLive&&(redZoneTeams.has(g.home)||redZoneTeams.has(g.away))&&isRedZoneGame(g)&&<div style={{marginTop:4,background:"#fff0f0",border:"1px solid #f5c0c0",padding:"4px 10px",textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,color:"#e8161e",letterSpacing:"0.08em",textTransform:"uppercase",animation:"pulse 0.8s ease-in-out infinite"}}>🔴 {g.sport==="MLB"?"LATE GAME — CLUTCH MOMENT":g.sport==="MLS"?"FINAL MINUTES":"RED ZONE — CRITICAL MOMENT"}</div>}
        {isFinal&&((hWin&&hOwned)||(aWin&&aOwned))&&<div style={{marginTop:8,background:"#e8f5ec",border:"1px solid #c8e8d0",padding:"4px 10px",textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,color:"#22aa44",letterSpacing:"0.08em",textTransform:"uppercase"}}>VICTORY! WIN BONUS COLLECTED</div>}
      </div>
    );
  }
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"16px 16px 40px"}}>
      {/* Status bar */}
      <div style={{background:"#fff",border:"1px solid #e0ddd8",borderLeft:"3px solid #22cc55",padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:9,height:9,borderRadius:"50%",background:loading?"#f5c518":"#22cc55",animation:"pulse 1s ease-in-out infinite"}}/>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,color:"#22aa44",letterSpacing:"0.15em",textTransform:"uppercase"}}>Live Oracle</span>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>{by.live.length} live · {by.pre.length} upcoming · {by.final.length} final</span>
          {espnOk?(
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,padding:"2px 7px",background:"rgba(232,22,30,0.08)",color:"#e8161e",border:"1px solid rgba(232,22,30,0.2)",letterSpacing:"0.1em",textTransform:"uppercase"}}>ESPN LIVE</span>
          ):(
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,padding:"2px 7px",background:"#f0ede8",color:"#aaa",border:"1px solid #ddd",letterSpacing:"0.1em",textTransform:"uppercase"}}>{loading?"Connecting...":"Simulated"}</span>
          )}
        </div>
        {!forced
          ?<button onClick={forceStartAll} className="topps-btn-primary" style={{padding:"6px 16px",fontSize:13}}>Force Start All</button>
          :<button onClick={resetGames} style={{background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,padding:"6px 14px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Reset</button>
        }
      </div>
      {/* Mini ticker */}
      <div style={{background:"#111",padding:"7px 14px",marginBottom:16,overflowX:"auto",display:"flex",gap:0,whiteSpace:"nowrap"}}>
        {liveGames.map(function(g,i){
          var col=g.status==="live"?"#22cc55":g.status==="final"?"#888":"#c8a800";
          return <span key={i} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:col,marginRight:24,letterSpacing:"0.06em",textTransform:"uppercase"}}>{si[g.sport]} {g.away} {g.status==="live"?g.awayScore:""} {g.status!=="pre"?"-":""} {g.status==="live"?g.homeScore:""} {g.home} {g.status==="pre"?"| "+g.kickoffMins+"m":g.status==="live"?"| "+(g.sport==="MLB"?"Inn":(g.sport==="MLS"?"H":"Q"))+g.quarter+" "+g.timeLeft:"| FT"}</span>;
        })}
      </div>
      {by.live.length>0&&<div style={{marginBottom:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#22aa44",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#22cc55",animation:"pulse 1s ease-in-out infinite"}}/>Live Now
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.live.map(function(g){return <GCard key={g.id} game={g}/>;})}</div>
      </div>}
      {/* Offseason sports */}
      {Object.keys(SEASON_CALENDAR).some(function(s){return !SEASON_CALENDAR[s].active;})&&(
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#888",marginBottom:8}}>Offseason</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {Object.keys(SEASON_CALENDAR).filter(function(s){return !SEASON_CALENDAR[s].active;}).map(function(sport){
              var cal=SEASON_CALENDAR[sport];
              var isSpecial=cal.isDraft||cal.isFinalFour;
              var specialColor=cal.isDraft?"#1144cc":cal.isFinalFour?"#c8a800":"#888";
              return (
                <div key={sport} style={{background:"#fff",border:"1px solid "+(isSpecial?specialColor+"44":"#e0ddd8"),borderLeft:"3px solid "+(isSpecial?specialColor:"#ddd"),padding:"10px 14px",display:"flex",alignItems:"center",gap:10,minWidth:180,flex:"1 1 180px"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{cal.icon||"🏅"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:isSpecial?specialColor:"#555",textTransform:"uppercase",letterSpacing:"0.06em"}}>{sport}</div>
                    <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginTop:1}}>{cal.reason}</div>
                    {isSpecial&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:specialColor,marginTop:2,letterSpacing:"0.06em",textTransform:"uppercase"}}>{cal.note}</div>}
                  </div>
                  {isSpecial&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,padding:"3px 8px",background:specialColor+"11",color:specialColor,border:"1px solid "+specialColor+"33",letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,whiteSpace:"nowrap"}}>{cal.isDraft?"📅 Draft":cal.isFinalFour?"🏆 Final Four":""}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {by.pre.length>0&&<div style={{marginBottom:16}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#c8a800",marginBottom:8}}>Upcoming</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.pre.map(function(g){return <GCard key={g.id} game={g}/>;})}</div>
      </div>}
      {by.final.length>0&&<div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:"#aaa",marginBottom:8}}>Final</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.final.map(function(g){return <GCard key={g.id} game={g}/>;})}</div>
      </div>}
    </div>
  );
}
// ── DYNASTY PATH — Season Pass System ────────────────────────────────────────
var DYNASTY_TRACK=[
  {level:1,  xpReq:1000,  icon:"🪙", label:"200 Coins",          type:"coins", value:200,   color:"#c8a800"},
  {level:2,  xpReq:2000,  icon:"🃏", label:"Rare Pack",           type:"pack",  value:"standard", color:"#1144cc"},
  {level:3,  xpReq:3000,  icon:"🪙", label:"500 Coins",          type:"coins", value:500,   color:"#c8a800"},
  {level:4,  xpReq:4000,  icon:"⚡", label:"Elite Badge",         type:"badge", value:"elite_s1", color:"#22aa55"},
  {level:5,  xpReq:5000,  icon:"🔬", label:"Free Grading",        type:"grade", value:1,     color:"#7733cc"},
  {level:6,  xpReq:6000,  icon:"🪙", label:"1,000 Coins",        type:"coins", value:1000,  color:"#c8a800"},
  {level:7,  xpReq:7000,  icon:"📦", label:"Division Jumbo Pack", type:"pack",  value:"jumbo", color:"#7733cc"},
  {level:8,  xpReq:8000,  icon:"🏆", label:"Prestige Badge",      type:"badge", value:"prestige_s1", color:"#e8161e"},
  {level:9,  xpReq:9000,  icon:"🪙", label:"2,000 Coins",        type:"coins", value:2000,  color:"#c8a800"},
  {level:10, xpReq:10000, icon:"🌟", label:"Legendary Pack",      type:"pack",  value:"jumbo", color:"#e8161e"},
  {level:11, xpReq:11000, icon:"🪙", label:"1,500 Coins",        type:"coins", value:1500,  color:"#c8a800"},
  {level:12, xpReq:12000, icon:"🔬", label:"2× Free Grading",     type:"grade", value:2,     color:"#7733cc"},
  {level:13, xpReq:13000, icon:"🪙", label:"3,000 Coins",        type:"coins", value:3000,  color:"#c8a800"},
  {level:14, xpReq:14000, icon:"💎", label:"Dynasty Badge",       type:"badge", value:"dynasty_s1", color:"#9933ff"},
  {level:15, xpReq:15000, icon:"📦", label:"Blaster Box",         type:"pack",  value:"blaster", color:"#7733cc"},
  {level:16, xpReq:16000, icon:"🪙", label:"2,500 Coins",        type:"coins", value:2500,  color:"#c8a800"},
  {level:17, xpReq:17000, icon:"🔬", label:"3× Free Grading",     type:"grade", value:3,     color:"#7733cc"},
  {level:18, xpReq:18000, icon:"🪙", label:"5,000 Coins",        type:"coins", value:5000,  color:"#c8a800"},
  {level:19, xpReq:19000, icon:"⚡", label:"Obsidian Badge",      type:"badge", value:"obsidian_s1", color:"#9933ff"},
  {level:20, xpReq:20000, icon:"📦", label:"Mega Box",            type:"pack",  value:"megabox", color:"#0088cc"},
  {level:21, xpReq:21000, icon:"🪙", label:"4,000 Coins",        type:"coins", value:4000,  color:"#c8a800"},
  {level:22, xpReq:22000, icon:"🔬", label:"5× Free Grading",     type:"grade", value:5,     color:"#7733cc"},
  {level:23, xpReq:23000, icon:"🪙", label:"7,500 Coins",        type:"coins", value:7500,  color:"#c8a800"},
  {level:24, xpReq:24000, icon:"👑", label:"King Badge",          type:"badge", value:"king_s1", color:"#e8161e"},
  {level:25, xpReq:25000, icon:"📦", label:"Hobby Box",           type:"pack",  value:"hobbybox", color:"#cc3300"},
  {level:26, xpReq:26000, icon:"🪙", label:"10,000 Coins",       type:"coins", value:10000, color:"#c8a800"},
  {level:27, xpReq:27000, icon:"🔬", label:"10× Free Grading",    type:"grade", value:10,    color:"#7733cc"},
  {level:28, xpReq:28000, icon:"🪙", label:"15,000 Coins",       type:"coins", value:15000, color:"#c8a800"},
  {level:29, xpReq:29000, icon:"✨", label:"Immortal Badge",      type:"badge", value:"immortal_s1", color:"#9933ff"},
  {level:30, xpReq:30000, icon:"🏆", label:"Dynasty Title",       type:"pack",  value:"hobbybox", color:"#f5c518", final:true},
];
function xpToLevel(xp){ return Math.min(30,Math.floor((xp||0)/1000)); }
function levelXpProgress(xp){ return Math.min(999,(xp||0)%1000); }

function LevelUpModal(props) {
  var reward=props.reward; var onClose=props.onClose;
  var mountedState=useState(false); var mounted=mountedState[0]; var setMounted=mountedState[1];
  useEffect(function(){var t=setTimeout(function(){setMounted(true);},30);return function(){clearTimeout(t);};},[]);
  if(!reward) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,0.75)"}} onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{background:"#0a0018",border:"2px solid #9933ff",maxWidth:320,width:"92%",
          boxShadow:"0 0 60px rgba(153,51,255,0.5),0 0 120px rgba(153,51,255,0.2)",
          transform:mounted?"scale(1) translateY(0)":"scale(0.85) translateY(30px)",
          opacity:mounted?1:0,transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s ease",
          overflow:"hidden"}}>
        {/* Top band */}
        <div style={{background:"linear-gradient(135deg,#5511aa,#9933ff,#5511aa)",padding:"20px 20px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.12),transparent 70%)"}}/>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.5em",
            textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:6,position:"relative"}}>Dynasty Path</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,letterSpacing:"0.04em",
            textTransform:"uppercase",color:"#fff",lineHeight:1,position:"relative"}}>Level Up!</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,
            color:"rgba(255,255,255,0.7)",marginTop:4,position:"relative"}}>Level {reward.level} Unlocked</div>
        </div>
        {/* Reward */}
        <div style={{padding:"24px 24px 20px",textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:12,
            filter:"drop-shadow(0 0 20px "+reward.color+"cc)",
            animation:"crownFloat 2s ease-in-out infinite",display:"inline-block"}}>{reward.icon}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
            letterSpacing:"0.3em",textTransform:"uppercase",color:"#555",marginBottom:4}}>Reward Unlocked</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,
            letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff",marginBottom:20}}>{reward.label}</div>
          <button onClick={onClose}
            style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,
              letterSpacing:"0.15em",textTransform:"uppercase",padding:"13px 0",
              border:"none",cursor:"pointer",background:"linear-gradient(90deg,#5511aa,#9933ff,#5511aa)",
              color:"#fff",width:"100%"}}>
            View on Profile →
          </button>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#444",marginTop:10}}>
            Tap your reward node to collect it
          </div>
        </div>
      </div>
    </div>
  );
}

function DynastyPath(props) {
  var xp=props.xp||0;
  var claimedLevels=props.claimedLevels||[];
  var onClaim=props.onClaim;
  var currentLevel=xpToLevel(xp);
  var progressPct=levelXpProgress(xp)/10;
  var trackRef=useRef(null);
  useEffect(function(){
    if(!trackRef.current) return;
    var nodeW=92; var gap=10;
    var targetScroll=Math.max(0,(currentLevel-2))*(nodeW+gap);
    trackRef.current.scrollLeft=targetScroll;
  },[currentLevel]);

  return (
    <div style={{marginBottom:32}}>
      {/* Section header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,
            letterSpacing:"0.06em",textTransform:"uppercase",
            background:"linear-gradient(90deg,#7733cc,#cc66ff)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dynasty Path</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginTop:1}}>Season 1 · 30 Levels</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:18,fontWeight:700,
              color:"#9933ff",lineHeight:1}}>{fmt(xp)} <span style={{fontSize:12,color:"#aaa"}}>XP</span></div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
              letterSpacing:"0.1em",textTransform:"uppercase",color:"#aaa"}}>Level {currentLevel}</div>
          </div>
          <div style={{width:44,height:44,borderRadius:"50%",
            background:"linear-gradient(135deg,#5511aa,#9933ff)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 16px rgba(153,51,255,0.55)",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#fff"}}>{currentLevel}</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div style={{background:"#1a0030",height:6,overflow:"hidden",marginBottom:6,position:"relative"}}>
        <div style={{height:"100%",width:progressPct+"%",
          background:"linear-gradient(90deg,#5511aa,#cc66ff,#5511aa)",
          backgroundSize:"200% 100%",animation:"balShimmer 2.5s linear infinite",
          boxShadow:"0 0 8px rgba(153,51,255,0.8)",transition:"width 1.2s ease-out"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",
        fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
        letterSpacing:"0.1em",textTransform:"uppercase",color:"#888",marginBottom:16}}>
        <span>{fmt(levelXpProgress(xp))} / 1,000 XP</span>
        {currentLevel>=30
          ?<span style={{color:"#f5c518"}}>✦ MAX LEVEL</span>
          :<span>→ Level {currentLevel+1}</span>}
      </div>

      {/* Scrollable node track */}
      <div ref={trackRef} style={{overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",
        paddingBottom:8,cursor:"grab"}}>
        <div style={{display:"flex",gap:10,width:"max-content",paddingLeft:4,paddingRight:20,alignItems:"flex-start"}}>
          {DYNASTY_TRACK.map(function(node,idx){
            var isUnlocked=currentLevel>=node.level;
            var isClaimed=claimedLevels.includes(node.level);
            var isAvailable=isUnlocked&&!isClaimed;
            var isFinal=node.final;
            return (
              <div key={node.level} style={{display:"flex",flexDirection:"column",alignItems:"center",
                gap:5,width:80,flexShrink:0,position:"relative"}}>
                {/* Connector line to next */}
                {idx<DYNASTY_TRACK.length-1&&<div style={{
                  position:"absolute",top:27,left:"calc(50% + 28px)",
                  width:22,height:2,
                  background:isUnlocked?"linear-gradient(90deg,"+node.color+",rgba(153,51,255,0.3))":"#222",
                  zIndex:0}}/>}
                {/* Pulse ring */}
                {isAvailable&&<div style={{position:"absolute",top:-4,width:64,height:64,borderRadius:"50%",
                  border:"2px solid "+node.color,opacity:0.5,
                  animation:"pulsarRed 1.6s ease-out infinite"}}/>}
                {/* Node circle */}
                <div onClick={isAvailable?function(){onClaim(node);}:undefined}
                  style={{width:56,height:56,borderRadius:"50%",
                    background:isClaimed
                      ?"linear-gradient(135deg,#1a1200,#2a1e00)"
                      :isUnlocked
                      ?"linear-gradient(135deg,#1a0030,#2d0055)"
                      :"linear-gradient(135deg,#181818,#222)",
                    border:"2px solid "+(isClaimed?"#f5c518":isUnlocked?node.color:"#2a2a2a"),
                    boxShadow:isAvailable?"0 0 16px "+node.color+"66,0 0 32px "+node.color+"22"
                      :isClaimed?"0 0 8px rgba(245,197,24,0.3)":"none",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    cursor:isAvailable?"pointer":"default",
                    transition:"box-shadow 0.2s,transform 0.1s",
                    transform:isAvailable?"scale(1.04)":"scale(1)",
                    filter:isUnlocked?"none":"grayscale(0.7) brightness(0.45)",
                    position:"relative",zIndex:1,flexShrink:0}}>
                  {isClaimed
                    ?<span style={{fontSize:22,filter:"drop-shadow(0 0 6px rgba(245,197,24,0.9))"}}>✓</span>
                    :<span style={{fontSize:isUnlocked?20:15,opacity:isUnlocked?0.95:0.35}}>{node.icon}</span>}
                  {/* Level badge chip */}
                  <div style={{position:"absolute",bottom:-3,right:-3,width:19,height:19,
                    borderRadius:"50%",
                    background:isClaimed?"#f5c518":isUnlocked?node.color:"#333",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    border:"1.5px solid #f0ede8",zIndex:2}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
                      color:isClaimed?"#000":"#fff",lineHeight:1}}>{node.level}</span>
                  </div>
                </div>
                {/* Reward label */}
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8.5,fontWeight:700,
                  letterSpacing:"0.04em",textTransform:"uppercase",
                  color:isClaimed?"#f5c518":isAvailable?node.color:"#444",
                  textAlign:"center",lineHeight:1.25,maxWidth:78,minHeight:20,
                  overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{node.label}</div>
                {/* CTA */}
                {isAvailable&&(
                  <button onClick={function(){onClaim(node);}}
                    style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
                      letterSpacing:"0.06em",textTransform:"uppercase",
                      padding:"4px 8px",border:"none",cursor:"pointer",
                      background:"linear-gradient(90deg,#5511aa,#9933ff)",
                      color:"#fff",whiteSpace:"nowrap",
                      animation:"crownFloat 2s ease-in-out infinite"}}>Claim</button>
                )}
                {isClaimed&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:700,
                  color:"rgba(245,197,24,0.7)",letterSpacing:"0.06em",textTransform:"uppercase"}}>✓ Done</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── CONTEXT TIP BANNER ────────────────────────────────────────────────────────
// Lightweight dismissible hint shown at top of each tab
function ContextTip(props) {
  var id=props.id; var icon=props.icon||"💡"; var tip=props.tip; var color=props.color||"#1144cc";
  var dismissedState=useState(function(){try{return JSON.parse(localStorage.getItem("cd_tips")||"[]");}catch(e){return [];}});
  var dismissed=dismissedState[0]; var setDismissed=dismissedState[1];
  if(dismissed.includes(id)) return null;
  function dismiss(){
    var next=dismissed.concat([id]);
    setDismissed(next);
    try{localStorage.setItem("cd_tips",JSON.stringify(next));}catch(e){}
  }
  return (
    <div style={{background:color+"11",border:"1px solid "+color+"33",borderLeft:"3px solid "+color,
      padding:"10px 14px",margin:"0 0 16px 0",display:"flex",alignItems:"flex-start",gap:10,position:"relative"}}>
      <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{icon}</span>
      <div style={{flex:1}}>
        <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#444",lineHeight:1.5}}>{tip}</div>
      </div>
      <button onClick={dismiss} style={{background:"none",border:"none",cursor:"pointer",
        fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"#bbb",padding:"0 0 0 8px",
        flexShrink:0,lineHeight:1}}>✕</button>
    </div>
  );
}

// ── SEASON PASS PAGE ──────────────────────────────────────────────────────────
var XP_SOURCES=[
  {icon:"📦",action:"Open a Pack",xp:"100 XP per card",color:"#1144cc",tip:"Opening a 10-card Jumbo pack gives you 1,000 XP — enough for a full level."},
  {icon:"⚡",action:"Game Day",xp:"200 + 10/winner XP",color:"#e8161e",tip:"Run Game Day every day. Having more cards = more winners = more XP."},
  {icon:"🔬",action:"Grade a Card",xp:"300 XP",color:"#7733cc",tip:"Grading also boosts your card's daily yield. Double win."},
  {icon:"🔥",action:"Daily Streak",xp:"150 XP",color:"#ff6600",tip:"Claim your streak every day without missing one to maximize XP gains."},
  {icon:"🏪",action:"Buy from Exchange",xp:"50 XP",color:"#22aa55",tip:"Every marketplace purchase earns XP. Great way to fill rarity gaps."},
  {icon:"📋",action:"List a Card",xp:"25 XP",color:"#888",tip:"Even listing cards you don't sell earns you a small XP bump."},
];

function SeasonPassPage(props) {
  var xp=props.xp||0;
  var claimedLevels=props.claimedLevels||[];
  var onClaim=props.onClaim||function(){};
  var currentLevel=xpToLevel(xp);
  var progressPct=levelXpProgress(xp)/10;
  var nextReward=DYNASTY_TRACK.find(function(n){return !claimedLevels.includes(n.level)&&currentLevel>=n.level;});
  var nextUnlock=DYNASTY_TRACK.find(function(n){return currentLevel<n.level;});
  var totalClaimed=claimedLevels.length;
  var xpToNextLevel=1000-levelXpProgress(xp);
  var trackRef=useRef(null);
  useEffect(function(){
    if(!trackRef.current) return;
    var nodeW=100; var gap=12;
    trackRef.current.scrollLeft=Math.max(0,(currentLevel-3))*(nodeW+gap);
  },[currentLevel]);

  return (
    <div style={{background:"#f0ede8",minHeight:"100vh",paddingBottom:80}}>
      {/* Dark hero header */}
      <div style={{background:"linear-gradient(160deg,#06001a,#0e0028,#14003a)",padding:"28px 20px 24px",position:"relative",overflow:"hidden"}}>
        {/* Background nebula */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(153,51,255,0.18),transparent 60%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 30%,rgba(232,22,30,0.1),transparent 55%)",pointerEvents:"none"}}/>
        {/* Stars */}
        {[[8,12],[22,45],[15,70],[5,85],[30,25],[28,60],[10,90]].map(function(s,i){
          return <div key={i} style={{position:"absolute",width:i%2+1,height:i%2+1,background:"#fff",borderRadius:"50%",top:s[0]+"%",left:s[1]+"%",opacity:0.4,animation:"twinkle "+(2+i*0.3)+"s ease-in-out infinite "+(i*0.4)+"s"}}/>;
        })}
        <div style={{maxWidth:680,margin:"0 auto",position:"relative"}}>
          {/* Title */}
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.4em",
            textTransform:"uppercase",color:"rgba(200,150,255,0.7)",marginBottom:6}}>Season 1 · 2025</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,
            letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:0.95,marginBottom:4,
            background:"linear-gradient(90deg,#cc88ff,#fff,#ff88aa)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dynasty Path</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20}}>
            Earn XP through daily actions. Level up to claim exclusive rewards.
          </div>
          {/* Stats row */}
          <div style={{display:"flex",gap:0,flexWrap:"wrap"}}>
            {[
              {label:"Level",val:currentLevel,max:"/30",color:"#cc88ff"},
              {label:"Total XP",val:fmt(xp),max:"",color:"#f5c518"},
              {label:"Rewards Claimed",val:totalClaimed,max:"/30",color:"#22cc88"},
              {label:"XP to Next Level",val:fmt(xpToNextLevel),max:" xp",color:"#ff8866"},
            ].map(function(s,i){
              return (
                <div key={i} style={{flex:"1 1 100px",padding:"12px 16px",
                  borderRight:i<3?"1px solid rgba(255,255,255,0.08)":"none",
                  borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:20,fontWeight:700,
                    color:s.color,lineHeight:1}}>{s.val}<span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>{s.max}</span></div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
                    letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginTop:3}}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>

        {/* XP progress + next reward callout */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"16px 18px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
              letterSpacing:"0.1em",textTransform:"uppercase",color:"#888"}}>
              Level {currentLevel} → {currentLevel<30?"Level "+(currentLevel+1):"Max Level"}
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:"#7733cc"}}>
              {fmt(levelXpProgress(xp))} / 1,000 XP
            </div>
          </div>
          <div style={{background:"#f0ede8",height:10,overflow:"hidden",borderRadius:2,marginBottom:10}}>
            <div style={{height:"100%",width:progressPct+"%",
              background:"linear-gradient(90deg,#5511aa,#cc66ff,#5511aa)",
              backgroundSize:"200% 100%",animation:"balShimmer 2.5s linear infinite",
              transition:"width 1.2s ease-out",borderRadius:2,
              boxShadow:"0 0 8px rgba(153,51,255,0.6)"}}/>
          </div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>
            {xpToNextLevel} XP needed to reach level {currentLevel+1}
            {currentLevel<30&&nextUnlock&&<span style={{color:"#7733cc",fontWeight:600}}> — unlocks {nextUnlock.label}</span>}
          </div>
        </div>

        {/* Unclaimed rewards alert */}
        {nextReward&&(
          <div style={{background:"linear-gradient(90deg,#1a0030,#2a0050)",border:"1px solid #9933ff",
            padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",
            justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:26,animation:"crownFloat 2s ease-in-out infinite",
                filter:"drop-shadow(0 0 8px "+nextReward.color+")"}}>{nextReward.icon}</span>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                  letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(200,150,255,0.7)",marginBottom:2}}>Level {nextReward.level} Reward Ready</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                  textTransform:"uppercase",color:"#fff"}}>{nextReward.label}</div>
              </div>
            </div>
            <button onClick={function(){onClaim(nextReward);}}
              style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,
                letterSpacing:"0.12em",textTransform:"uppercase",padding:"10px 20px",
                border:"none",cursor:"pointer",background:"linear-gradient(90deg,#5511aa,#9933ff)",
                color:"#fff",whiteSpace:"nowrap",animation:"pulsarRed 1.8s ease-out infinite"}}>
              Claim Now →
            </button>
          </div>
        )}

        {/* How to earn XP */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"18px 18px 14px",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,
            letterSpacing:"0.08em",textTransform:"uppercase",color:"#111",marginBottom:4}}>How to Earn XP</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginBottom:14}}>
            Every action you take in Card Dynasty earns XP. Here's the full breakdown:
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {XP_SOURCES.map(function(s,i){
              return (
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,
                  padding:"12px 0",borderBottom:i<XP_SOURCES.length-1?"1px solid #f0ede8":"none"}}>
                  <div style={{width:40,height:40,background:s.color+"11",border:"1px solid "+s.color+"33",
                    borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0,fontSize:18}}>{s.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,
                        letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>{s.action}</div>
                      <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,
                        color:s.color,background:s.color+"11",padding:"2px 8px",
                        border:"1px solid "+s.color+"33"}}>+{s.xp}</div>
                    </div>
                    <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginTop:3,lineHeight:1.5}}>{s.tip}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full reward track */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"18px 18px 14px",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,
            letterSpacing:"0.08em",textTransform:"uppercase",color:"#111",marginBottom:4}}>All 30 Rewards</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888",marginBottom:16}}>
            Tap any available reward to claim it. Claimed rewards are yours forever.
          </div>
          {/* Horizontal scrolling track */}
          <div ref={trackRef} style={{overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",
            paddingBottom:8,marginBottom:12}}>
            <div style={{display:"flex",gap:12,width:"max-content",paddingLeft:2,paddingRight:20,alignItems:"flex-start"}}>
              {DYNASTY_TRACK.map(function(node,idx){
                var isUnlocked=currentLevel>=node.level;
                var isClaimed=claimedLevels.includes(node.level);
                var isAvailable=isUnlocked&&!isClaimed;
                return (
                  <div key={node.level} style={{display:"flex",flexDirection:"column",alignItems:"center",
                    gap:5,width:88,flexShrink:0,position:"relative"}}>
                    {idx<DYNASTY_TRACK.length-1&&<div style={{
                      position:"absolute",top:27,left:"calc(50% + 28px)",width:24,height:2,
                      background:isUnlocked?"linear-gradient(90deg,"+node.color+",rgba(153,51,255,0.25))":"#e0ddd8",
                      zIndex:0}}/>}
                    {isAvailable&&<div style={{position:"absolute",top:-4,width:64,height:64,
                      borderRadius:"50%",border:"2px solid "+node.color,opacity:0.45,
                      animation:"pulsarRed 1.6s ease-out infinite"}}/>}
                    <div onClick={isAvailable?function(){onClaim(node);}:undefined}
                      style={{width:56,height:56,borderRadius:"50%",
                        background:isClaimed?"linear-gradient(135deg,#1a1200,#2a1e00)"
                          :isUnlocked?"linear-gradient(135deg,#1a0030,#2d0055)"
                          :"linear-gradient(135deg,#f8f6f4,#ede9e4)",
                        border:"2px solid "+(isClaimed?"#f5c518":isUnlocked?node.color:"#ddd"),
                        boxShadow:isAvailable?"0 0 14px "+node.color+"55":"none",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        cursor:isAvailable?"pointer":"default",
                        transform:isAvailable?"scale(1.06)":"scale(1)",
                        filter:isUnlocked?"none":"grayscale(0.6) brightness(0.7)",
                        position:"relative",zIndex:1,flexShrink:0,transition:"transform 0.15s"}}>
                      {isClaimed
                        ?<span style={{fontSize:22,filter:"drop-shadow(0 0 6px rgba(245,197,24,0.9))"}}>✓</span>
                        :<span style={{fontSize:isUnlocked?20:15,opacity:isUnlocked?0.95:0.4}}>{node.icon}</span>}
                      <div style={{position:"absolute",bottom:-3,right:-3,width:19,height:19,
                        borderRadius:"50%",background:isClaimed?"#f5c518":isUnlocked?node.color:"#bbb",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        border:"1.5px solid #f0ede8",zIndex:2}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
                          color:isClaimed?"#000":"#fff"}}>{node.level}</span>
                      </div>
                    </div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:700,
                      letterSpacing:"0.04em",textTransform:"uppercase",textAlign:"center",lineHeight:1.25,
                      color:isClaimed?"#c8a800":isAvailable?node.color:"#888",
                      overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",
                      maxWidth:84,minHeight:18}}>{node.label}</div>
                    {isAvailable&&<button onClick={function(){onClaim(node);}}
                      style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
                        padding:"3px 8px",border:"none",cursor:"pointer",
                        background:"linear-gradient(90deg,#5511aa,#9933ff)",color:"#fff",
                        letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Claim</button>}
                    {isClaimed&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,
                      color:"rgba(200,160,0,0.7)",fontWeight:700,textTransform:"uppercase"}}>✓ Done</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reward list — full detail */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"18px 18px 8px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,
            letterSpacing:"0.08em",textTransform:"uppercase",color:"#111",marginBottom:14}}>Reward Checklist</div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {DYNASTY_TRACK.map(function(node){
              var isUnlocked=currentLevel>=node.level;
              var isClaimed=claimedLevels.includes(node.level);
              var isAvailable=isUnlocked&&!isClaimed;
              return (
                <div key={node.level} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"10px 0",borderBottom:"1px solid #f5f3f0",
                  opacity:isUnlocked?1:0.45}}>
                  {/* Status icon */}
                  <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                    background:isClaimed?"#f5c518":isAvailable?node.color+"22":"#f0ede8",
                    border:"2px solid "+(isClaimed?"#f5c518":isAvailable?node.color:"#ddd"),
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>
                    {isClaimed?"✓":node.icon}
                  </div>
                  {/* Level badge */}
                  <div style={{width:32,flexShrink:0,textAlign:"center"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
                      color:"#aaa",letterSpacing:"0.08em"}}>LV</div>
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,
                      color:isUnlocked?"#111":"#bbb"}}>{node.level}</div>
                  </div>
                  {/* Label */}
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,
                      letterSpacing:"0.04em",textTransform:"uppercase",
                      color:isClaimed?"#c8a800":isUnlocked?"#111":"#aaa"}}>{node.label}</div>
                    <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#aaa",marginTop:1}}>
                      {node.xpReq.toLocaleString()} XP required
                    </div>
                  </div>
                  {/* Status / claim */}
                  {isClaimed&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
                    color:"#22aa44",background:"#e8f5ec",border:"1px solid #c8e8d0",
                    padding:"2px 8px",letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0}}>Claimed</span>}
                  {isAvailable&&<button onClick={function(){onClaim(node);}}
                    style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:900,
                      padding:"5px 12px",border:"none",cursor:"pointer",
                      background:"linear-gradient(90deg,#5511aa,#9933ff)",color:"#fff",
                      letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,
                      animation:"crownFloat 2s ease-in-out infinite"}}>Claim →</button>}
                  {!isUnlocked&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
                    color:"#ccc",letterSpacing:"0.06em",textTransform:"uppercase",flexShrink:0}}>🔒 Locked</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HIGH / LOW MINI-GAME ──────────────────────────────────────────────────────
var HIGHLO_WAGER = 50;
var HIGHLO_RATES = {Base:38,Rare:28,Elite:16,Legacy:9,Legendary:6,Dynasty:3};
var HIGHLO_LIVE_GAMES = ["Rangers vs. Lightning","Stars vs. Sabres"];
var HIGHLO_BONUS_START = 19;
var HIGHLO_BONUS_END   = 22;
var HIGHLO_MULTIPLIERS = [2, 2, 1.75, 1.5, 1.5, 1.25, 1.25, 1.25];
// Narrow jitter — just enough to prevent memorisation, not enough to feel random
var HIGHLO_JITTER = {Base:8, Rare:10, Elite:14, Legacy:20, Legendary:25, Dynasty:30};

function isGameNightBonus() {
  var now = new Date();
  var etH = (now.getUTCHours() - 4 + 24) % 24;
  return etH >= HIGHLO_BONUS_START && etH < HIGHLO_BONUS_END;
}

// Draw a card with jitter applied so yield is never a predictable fixed number
function drawHighLoCard() {
  var card = genCard(HIGHLO_RATES, null, null);
  var jitter = HIGHLO_JITTER[card.rarity] || 20;
  // Add random offset: base ± jitter, always positive
  card.daily = Math.max(1, card.daily + Math.floor((Math.random() * 2 - 1) * jitter));
  return card;
}

// Pot multiplier for current streak index (0-based)
function getMultiplier(streak) {
  return HIGHLO_MULTIPLIERS[Math.min(streak, HIGHLO_MULTIPLIERS.length - 1)];
}

// Apply multiplier to pot, round to nearest 5
function applyMultiplier(pot, streak) {
  return Math.round(pot * getMultiplier(streak) / 5) * 5;
}

function HighLoCard(props) {
  // Renders a single playing card in casino style
  var card = props.card; var revealed = props.revealed; var size = props.size||"full";
  var cfg = RARITY_CFG[card.rarity] || RARITY_CFG.Base;
  var col = getColors(card.team); var c1 = col[0];
  var code = teamCode(card.team);
  var isDyn = card.rarity === "Dynasty";
  var isLeg = card.rarity === "Legendary";
  var isLegacy = card.rarity === "Legacy";
  var abbvColor = card.rarity==="Base" ? ("rgba("+hexToRgb(c1)+",0.55)") : cfg.abbvFn();
  var stripeStyle = isDyn?"linear-gradient(180deg,#aa44ff,#6600cc,#e8161e,#9933ff)"
    :isLeg?"linear-gradient(180deg,#ff2222,#8a0010,#ff1818)"
    :isLegacy?"linear-gradient(180deg,#f5c518,#8a6c00,#f5c518)"
    :cfg.stripe;
  var W = size==="small" ? 110 : 148; var H = size==="small" ? 156 : 210;
  if (!revealed) {
    // Back face
    return (
      <div style={{width:W,height:H,borderRadius:6,overflow:"hidden",
        background:"linear-gradient(145deg,#0e0014,#18002a)",
        border:"1.5px solid rgba(153,51,255,0.3)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.7)",flexShrink:0,position:"relative"}}>
        <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:0.12}} viewBox={"0 0 "+W+" "+H}>
          {Array.from({length:Math.ceil(H/14)},function(_,row){
            return Array.from({length:Math.ceil(W/14)},function(_,col){
              return <rect key={row+"-"+col} x={col*14+3} y={row*14+3} width={7} height={7} rx={1.5} fill="rgba(200,100,255,0.6)"/>;
            });
          })}
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",gap:6,zIndex:2}}>
          <div style={{background:"rgba(153,51,255,0.85)",padding:"5px 14px"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,
              letterSpacing:"0.08em",color:"#fff"}}>CARD <em style={{color:"#f5c518",fontStyle:"normal"}}>DYNASTY</em></span>
          </div>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
            color:"rgba(255,255,255,0.25)",letterSpacing:"0.3em",textTransform:"uppercase"}}>?</span>
        </div>
        {[[5,5],[W-5,5],[5,H-5],[W-5,H-5]].map(function(pt,i){
          var sx=i%2===0?1:-1; var sy=i<2?1:-1;
          return <svg key={i} width={12} height={12} style={{position:"absolute",left:pt[0]-6,top:pt[1]-6,zIndex:3}}>
            <polyline points="0,7 0,0 7,0" fill="none" stroke="rgba(153,51,255,0.5)" strokeWidth="1.5"
              transform={"scale("+sx+","+sy+") translate("+(sx<0?-12:0)+","+(sy<0?-12:0)+")"}/>
          </svg>;
        })}
      </div>
    );
  }
  // Front face
  return (
    <div style={{width:W,height:H,position:"relative",flexShrink:0,borderRadius:6,overflow:"hidden",
      boxShadow:cfg.shadow+",0 8px 24px rgba(0,0,0,0.6)",
      border:isDyn?"2px solid transparent":"1.5px solid rgba(0,0,0,0.2)"}}>
      {isDyn&&<div style={{position:"absolute",inset:-2,background:"linear-gradient(135deg,#9933ff,#e8161e,#ff6600,#9933ff)",borderRadius:8,zIndex:0,animation:"dynastyShine 3s linear infinite"}}/>}
      {isDyn&&<div style={{position:"absolute",inset:0,background:cfg.photoBot,borderRadius:6,zIndex:1}}/>}
      {/* Stripe */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:18,background:stripeStyle,zIndex:6,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:7,fontWeight:900,
          letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.9)",
          writingMode:"vertical-rl",transform:"rotate(180deg)",whiteSpace:"nowrap"}}>{card.team.toUpperCase()}</span>
      </div>
      {/* Photo area */}
      <div style={{position:"absolute",left:18,top:0,right:0,bottom:34,
        background:"linear-gradient(160deg,"+cfg.photoTop+","+cfg.photoBot+")",overflow:"hidden",zIndex:2}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 70% at 60% 40%,"+c1+"44 0%,transparent 70%)",zIndex:3}}/>
        {isDyn&&<div style={{position:"absolute",inset:0,background:"conic-gradient(from 0deg at 55% 42%,rgba(153,51,255,0.18) 0deg,transparent 60deg,rgba(232,22,30,0.1) 120deg,transparent 180deg)",animation:"cosmicRing 25s linear infinite",zIndex:2}}/>}
        {(isLeg||isDyn)&&[22,42,62].map(function(lx,i){return <div key={i} style={{position:"absolute",bottom:"25%",left:lx+"%",width:3,height:3,background:isDyn?"#cc66ff":"#ff6040",borderRadius:"50%",animation:"emberRise "+(1.6+i*0.25)+"s ease-out infinite "+(i*0.5)+"s",zIndex:8}}/>;}) }
        <div style={{position:"absolute",left:0,right:0,top:"50%",transform:"translateY(-50%)",
          textAlign:"center",zIndex:5,paddingLeft:4}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:code.length<=2?W*0.42:code.length<=3?W*0.32:W*0.24,
            fontWeight:900,color:abbvColor,lineHeight:1,userSelect:"none",
            textShadow:cfg.abbvShadow}}>{code}</span>
        </div>
        <div style={{position:"absolute",top:0,right:0,zIndex:12,background:cfg.tagBg,padding:"2px 6px"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:900,
            letterSpacing:"0.06em",textTransform:"uppercase",color:cfg.tagTxt}}>{card.rarity.toUpperCase()}</span>
        </div>
      </div>
      {/* Name plate */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:34,
        background:isDyn?"#0a0020":"#fff",borderTop:"2px solid "+cfg.plateBdr,
        zIndex:6,display:"flex",flexDirection:"column",justifyContent:"center",
        paddingLeft:22,paddingRight:6}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",
          fontSize:card.team.length>9?10:card.team.length>6?12:14,
          fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",
          color:isDyn?"#cc88ff":cfg.nameCol,lineHeight:1,
          overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{card.team.toUpperCase()}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,fontWeight:700,
            letterSpacing:"0.05em",color:isDyn?"#9933ff":cfg.rarCol,textTransform:"uppercase"}}>{card.sport}</span>
          <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,fontWeight:700,
            color:"#c8a800"}}>{fmt(card.daily)}/d</span>
        </div>
      </div>
    </div>
  );
}

function HighLoGame(props) {
  var balance=props.balance; var onBalanceChange=props.onBalanceChange;
  var userId=props.userId; var onAddXp=props.onAddXp; var onNotif=props.onNotif;
  var dbSave=props.dbSave;

  var phaseState=useState("idle"); var phase=phaseState[0]; var setPhase=phaseState[1];
  var cardAState=useState(null); var cardA=cardAState[0]; var setCardA=cardAState[1];
  var cardBState=useState(null); var cardB=cardBState[0]; var setCardB=cardBState[1];
  var streakState=useState(0); var streak=streakState[0]; var setStreak=streakState[1];
  var potState=useState(0); var pot=potState[0]; var setPot=potState[1];
  var resultState=useState(null); var result=resultState[0]; var setResult=resultState[1];
  var flipState=useState(false); var flipped=flipState[0]; var setFlipped=flipState[1];
  var mountedState=useState(false); var mounted=mountedState[0]; var setMounted=mountedState[1];
  var shakeState=useState(false); var shaking=shakeState[0]; var setShaking=shakeState[1];

  useEffect(function(){setTimeout(function(){setMounted(true);},60);},[]);

  var bonus = isGameNightBonus();
  var highStakes = pot >= 500;
  var canAfford = balance >= HIGHLO_WAGER;
  var nextMult = getMultiplier(streak);

  function startGame() {
    if (!canAfford) return;
    var a = drawHighLoCard();
    setCardA(a); setCardB(null); setFlipped(false);
    setStreak(0); setPot(HIGHLO_WAGER); setResult(null);
    onBalanceChange(balance - HIGHLO_WAGER);
    if (userId) dbSave(userId, {coins: balance - HIGHLO_WAGER});
    setPhase("guessing");
    if (onNotif) onNotif("High / Low", "−"+HIGHLO_WAGER+" coins wagered. Good luck!", "info");
  }

  function guess(dir) {
    var b = drawHighLoCard();
    setCardB(b); setFlipped(false);
    setPhase("revealing");
    setTimeout(function() { setFlipped(true); }, 350);
    setTimeout(function() { resolveGuess(dir, cardA, b); }, 1100);
  }

  function resolveGuess(dir, a, b) {
    var correct = dir==="higher" ? b.daily > a.daily : b.daily < a.daily;
    if (correct) {
      var newStreak = streak + 1;
      var newPot = applyMultiplier(pot, streak);
      setStreak(newStreak); setPot(newPot);
      setResult({correct:true, dir, aYield:a.daily, bYield:b.daily,
        mult:getMultiplier(streak), newPot:newPot});
      setCardA(b); setCardB(null); setFlipped(false);
      if (onAddXp) onAddXp(10);
      setPhase("guessing");
    } else {
      var isTie = b.daily === a.daily;
      setResult({correct:false, dir, aYield:a.daily, bYield:b.daily, tie:isTie});
      setShaking(true);
      setTimeout(function(){setShaking(false);},600);
      setPhase("lost");
    }
  }

  function cashOut() {
    var finalPot = bonus ? Math.round(pot * 2 / 5) * 5 : pot;
    onBalanceChange(balance + finalPot);
    if (userId) dbSave(userId, {coins: balance + finalPot});
    if (onAddXp) onAddXp(streak * 5);
    if (onNotif) onNotif("Cashed Out! 💰", "+"+fmt(finalPot)+" coins"+(bonus?" (2× Bonus!)":"")+" · Streak: ×"+streak, "sale");
    setPhase("cashedout");
  }

  function reset() {
    setPhase("idle"); setCardA(null); setCardB(null);
    setStreak(0); setPot(0); setResult(null); setFlipped(false);
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background:"linear-gradient(160deg,#080010,#0e001a,#060018)",
      minHeight:480, position:"relative", overflow:"hidden",
      transform:mounted?"translateY(0)":"translateY(16px)",
      opacity:mounted?1:0, transition:"all 0.4s ease",
      animation:shaking?"packShake 0.5s ease":"none",
    }}>
      {/* Obsidian felt texture overlay */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(200,170,255,0.03) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
      {/* Gold corner trim lines */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#f5c518,#c8a800,transparent)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#f5c518,#c8a800,transparent)"}}/>
      <div style={{position:"absolute",top:0,bottom:0,left:0,width:2,background:"linear-gradient(180deg,transparent,#f5c518,transparent)"}}/>
      <div style={{position:"absolute",top:0,bottom:0,right:0,width:2,background:"linear-gradient(180deg,transparent,#f5c518,transparent)"}}/>

      <div style={{position:"relative",zIndex:2,padding:"20px 16px 28px",maxWidth:520,margin:"0 auto"}}>

        {/* ── HEADER ── */}
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
            letterSpacing:"0.5em",textTransform:"uppercase",
            color:"rgba(200,160,255,0.55)",marginBottom:4}}>Card Dynasty Casino</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,
            letterSpacing:"0.06em",textTransform:"uppercase",lineHeight:1,
            background:"linear-gradient(90deg,#c8a800,#f5e060,#f5c518,#c8a800)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            backgroundSize:"200% auto",animation:"balShimmer 3s linear infinite"}}>High / Low</div>
        </div>

        {/* ── GAME NIGHT BONUS BANNER ── */}
        {bonus&&<div style={{
          background:"linear-gradient(90deg,rgba(232,22,30,0.15),rgba(245,197,24,0.12),rgba(232,22,30,0.15))",
          border:"1px solid rgba(245,197,24,0.35)",padding:"8px 14px",marginBottom:12,
          display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#e8161e",
            animation:"pulse 1s ease-in-out infinite",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:900,
              letterSpacing:"0.18em",textTransform:"uppercase",color:"#f5c518"}}>🏒 Game Night Bonus Active</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:1}}>
              {HIGHLO_LIVE_GAMES.join(" · ")} — All payouts doubled tonight
            </div>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
            color:"#f5c518",letterSpacing:"0.06em"}}>2×</div>
        </div>}

        {/* ── STATS BAR ── */}
        <div style={{display:"flex",gap:0,marginBottom:16,border:"1px solid rgba(245,197,24,0.18)",overflow:"hidden"}}>
          {[
            {label:"Wager",val:fmt(HIGHLO_WAGER)+"🪙",color:"#888"},
            {label:"Pot",val:fmt(bonus&&phase!=="idle"?Math.round(pot*2/5)*5:pot)+"🪙",color:highStakes?"#f5c518":"#fff"},
            {label:"Next ×",val:nextMult+"×",color:nextMult>=2?"#22cc88":nextMult>=1.5?"#f5c518":"#ff8844"},
            {label:"Streak",val:"×"+streak,color:streak>=3?"#f5c518":streak>=1?"#ff8844":"#555"},
          ].map(function(s,i){
            return <div key={i} style={{flex:1,padding:"8px 6px",textAlign:"center",
              borderRight:i<3?"1px solid rgba(245,197,24,0.15)":"none",
              background:highStakes&&s.label==="Pot"?"rgba(245,197,24,0.06)":"transparent",
              boxShadow:highStakes&&s.label==="Pot"?"inset 0 0 20px rgba(245,197,24,0.08)":"none"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:7,fontWeight:700,
                letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:2}}>{s.label}</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:13,fontWeight:700,color:s.color,
                textShadow:highStakes&&s.label==="Pot"?"0 0 12px rgba(245,197,24,0.8)":"none",
                animation:streak>=3&&s.label==="Streak"?"goldPulse 1s ease-in-out infinite":"none"}}>{s.val}</div>
            </div>;
          })}
        </div>

        {phase==="idle"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:44,marginBottom:10,animation:"showcaseFloat 3s ease-in-out infinite"}}>🃏</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,
              color:"rgba(255,255,255,0.6)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>
              High / Low
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              padding:"12px 16px",marginBottom:16,textAlign:"left",maxWidth:340,margin:"0 auto 16px"}}>
              {[
                {icon:"🎯",text:"Guess if next card's yield is higher or lower"},
                {icon:"📈",text:"Pot multiplier slows as streak grows (2× → 1.25×)"},
                {icon:"⚠️",text:"Ties count as a loss — no free re-roll"},
                {icon:"💰",text:"Max payout ~800 coins at streak ×8"},
              ].map(function(r,i){
                return <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",
                  padding:"5px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{r.icon}</span>
                  <span style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
                    color:"rgba(255,255,255,0.45)",lineHeight:1.4}}>{r.text}</span>
                </div>;
              })}
            </div>
            <button onClick={startGame} disabled={!canAfford}
              style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                letterSpacing:"0.14em",textTransform:"uppercase",padding:"14px 40px",
                border:"none",cursor:canAfford?"pointer":"not-allowed",
                background:canAfford?"linear-gradient(90deg,#7733cc,#9933ff,#7733cc)":"#222",
                color:canAfford?"#fff":"#555",
                backgroundSize:"200% auto",animation:canAfford?"balShimmer 3s linear infinite":"none",
                boxShadow:canAfford?"0 0 24px rgba(153,51,255,0.45)":"none"}}>
              {canAfford?"Play — "+HIGHLO_WAGER+" Coins":"Need "+HIGHLO_WAGER+" Coins"}
            </button>
            {bonus&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
              color:"#f5c518",marginTop:10,fontWeight:600}}>🏒 Tonight: all payouts 2× (Game Night Bonus)</div>}
            {!canAfford&&<div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
              color:"rgba(255,255,255,0.3)",marginTop:8}}>Visit the Shop to earn more coins.</div>}
          </div>
        )}

        {/* ── GUESSING / REVEALING ── */}
        {(phase==="guessing"||phase==="revealing")&&cardA&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            {/* Last result feedback */}
            {result&&result.correct&&(
              <div style={{background:"rgba(34,170,68,0.15)",border:"1px solid rgba(34,170,68,0.4)",
                padding:"6px 16px",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>✅</span>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
                  letterSpacing:"0.1em",textTransform:"uppercase",color:"#22cc55"}}>
                  Correct! {result.aYield}
                  <span style={{color:"#fff",margin:"0 4px"}}>{result.dir==="higher"?"<":">"}</span>
                  {result.bYield} /d
                  <span style={{color:"rgba(255,255,255,0.4)",marginLeft:4}}>× {result.mult} → </span>
                  <span style={{color:"#f5c518"}}>{fmt(result.newPot)}🪙</span>
                  <span style={{color:"rgba(200,150,255,0.7)",marginLeft:6}}>+10 XP</span>
                </div>
              </div>
            )}

            {/* Cards arena */}
            <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
              {/* Card A — always visible */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
                  letterSpacing:"0.25em",textTransform:"uppercase",
                  color:"rgba(255,255,255,0.35)"}}>Current Card</div>
                <HighLoCard card={cardA} revealed={true} size="full"/>
                <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,
                  color:"#f5c518",letterSpacing:"0.04em"}}>{fmt(cardA.daily)}/d</div>
              </div>

              {/* VS / arrow */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,
                  color:"rgba(255,255,255,0.15)",letterSpacing:"0.1em"}}>VS</div>
                <div style={{fontSize:28,animation:"showcaseFloat 2s ease-in-out infinite",opacity:0.6}}>⚡</div>
              </div>

              {/* Card B — flip reveal */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
                  letterSpacing:"0.25em",textTransform:"uppercase",
                  color:"rgba(255,255,255,0.35)"}}>Next Card</div>
                <div style={{perspective:800}}>
                  <div style={{
                    transformStyle:"preserve-3d",
                    transition:"transform 0.55s cubic-bezier(0.3,1.2,0.5,1)",
                    transform:flipped&&cardB?"rotateY(180deg)":"rotateY(0deg)"}}>
                    <div style={{backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden"}}>
                      <HighLoCard card={cardB||cardA} revealed={false} size="full"/>
                    </div>
                    <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
                      WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)"}}>
                      {cardB&&<HighLoCard card={cardB} revealed={true} size="full"/>}
                    </div>
                  </div>
                </div>
                <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,
                  color:flipped&&cardB?"#f5c518":"rgba(255,255,255,0.2)",letterSpacing:"0.04em"}}>
                  {flipped&&cardB?fmt(cardB.daily)+"/d":"?"}
                </div>
              </div>
            </div>

            {/* Streak indicator */}
            {streak>0&&<div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)"}}>Streak</span>
              <div style={{display:"flex",gap:4}}>
                {Array.from({length:Math.min(streak,8)}).map(function(_,i){
                  return <div key={i} style={{width:streak>=6?14:12,height:streak>=6?14:12,
                    borderRadius:"50%",background:"#f5c518",
                    boxShadow:"0 0 "+(4+i*2)+"px rgba(245,197,24,"+(0.4+i*0.08)+")",
                    animation:"goldPulse "+(1.2-i*0.05)+"s ease-in-out infinite "+(i*0.1)+"s"}}/>;
                })}
                {streak>8&&<span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,
                  fontWeight:700,color:"#f5c518"}}>+{streak-8}</span>}
              </div>
            </div>}

            {/* Guess buttons — only active during guessing phase */}
            {phase==="guessing"&&<div style={{display:"flex",gap:12,marginTop:4,flexWrap:"wrap",justifyContent:"center"}}>
              <button onClick={function(){guess("higher");}}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                  letterSpacing:"0.14em",textTransform:"uppercase",padding:"13px 28px",
                  border:highStakes?"2px solid #f5c518":"2px solid rgba(255,255,255,0.08)",
                  cursor:"pointer",background:"linear-gradient(135deg,#0a3020,#0e4828)",color:"#22cc55",
                  boxShadow:highStakes?"0 0 20px rgba(245,197,24,0.4),0 0 40px rgba(34,200,80,0.2)":"0 0 12px rgba(34,180,80,0.15)",
                  transition:"all 0.15s"}}>
                ↑ Higher
              </button>
              <button onClick={cashOut} disabled={streak===0}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,
                  letterSpacing:"0.1em",textTransform:"uppercase",padding:"13px 20px",
                  border:"1px solid rgba(245,197,24,0.25)",cursor:streak>0?"pointer":"not-allowed",
                  background:"rgba(245,197,24,0.08)",color:streak>0?"#f5c518":"#444",
                  transition:"all 0.15s"}}>
                💰 Cash Out<br/>
                <span style={{fontSize:11,opacity:0.8}}>{fmt(bonus?pot*2:pot)} coins{bonus?" (2×)":""}</span>
              </button>
              <button onClick={function(){guess("lower");}}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                  letterSpacing:"0.14em",textTransform:"uppercase",padding:"13px 28px",
                  border:highStakes?"2px solid #f5c518":"2px solid rgba(255,255,255,0.08)",
                  cursor:"pointer",background:"linear-gradient(135deg,#2a0808,#3a0c0c)",color:"#ff5544",
                  boxShadow:highStakes?"0 0 20px rgba(245,197,24,0.4),0 0 40px rgba(232,22,30,0.2)":"0 0 12px rgba(232,22,30,0.15)",
                  transition:"all 0.15s"}}>
                ↓ Lower
              </button>
            </div>}
            {phase==="revealing"&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:14,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",
              color:"rgba(255,255,255,0.4)",animation:"pulse 0.6s ease-in-out infinite"}}>Revealing...</div>}
          </div>
        )}

        {/* ── LOST ── */}
        {phase==="lost"&&result&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:8,animation:"packShake 0.5s ease"}}>❌</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,
              letterSpacing:"0.06em",textTransform:"uppercase",color:"#e8161e",marginBottom:6}}>Wrong Guess</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,
              color:"rgba(255,255,255,0.45)",marginBottom:4}}>
              {result.tie
                ?"Tied at "+fmt(result.bYield)+"/d — ties count as a loss"
                :<span>You guessed <strong style={{color:"#fff"}}>{result.dir}</strong> — card had <strong style={{color:"#f5c518"}}>{fmt(result.bYield)}/d</strong> (card A was <strong style={{color:"rgba(255,255,255,0.6)"}}>{fmt(result.aYield)}/d</strong>)</span>}
            </div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,
              color:"rgba(255,255,255,0.3)",marginBottom:20}}>
              Streak ×{streak} · {fmt(pot)} coins lost
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={startGame} disabled={!canAfford}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,
                  letterSpacing:"0.12em",textTransform:"uppercase",padding:"12px 28px",
                  border:"none",cursor:canAfford?"pointer":"not-allowed",
                  background:canAfford?"linear-gradient(90deg,#7733cc,#9933ff)":"#222",
                  color:canAfford?"#fff":"#555",boxShadow:canAfford?"0 0 16px rgba(153,51,255,0.4)":"none"}}>
                Try Again — {HIGHLO_WAGER}🪙
              </button>
              <button onClick={reset}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                  letterSpacing:"0.1em",textTransform:"uppercase",padding:"12px 20px",
                  border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer",
                  background:"transparent",color:"rgba(255,255,255,0.4)"}}>Back</button>
            </div>
          </div>
        )}

        {/* ── CASHED OUT ── */}
        {phase==="cashedout"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52,marginBottom:8,animation:"crownFloat 2s ease-in-out infinite"}}>💰</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
              letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(200,160,255,0.55)",marginBottom:4}}>Cashed Out</div>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:36,fontWeight:700,
              color:"#f5c518",marginBottom:4,
              textShadow:"0 0 20px rgba(245,197,24,0.6)",
              animation:"goldPulse 1.5s ease-in-out infinite"}}>+{fmt(bonus?pot:pot)}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
              letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:6}}>coins earned</div>
            {bonus&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
              color:"#f5c518",letterSpacing:"0.12em",textTransform:"uppercase",
              background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.25)",
              padding:"4px 14px",display:"inline-block",marginBottom:10}}>🏒 2× Game Night Bonus Included</div>}
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
              color:"rgba(255,255,255,0.3)",marginBottom:20}}>
              Streak ×{streak} · {streak*5} bonus XP earned
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={startGame} disabled={!canAfford}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,
                  letterSpacing:"0.12em",textTransform:"uppercase",padding:"12px 28px",
                  border:"none",cursor:canAfford?"pointer":"not-allowed",
                  background:canAfford?"linear-gradient(90deg,#7733cc,#9933ff)":"#222",
                  color:canAfford?"#fff":"#555",boxShadow:canAfford?"0 0 16px rgba(153,51,255,0.4)":"none"}}>
                Play Again — {HIGHLO_WAGER}🪙
              </button>
              <button onClick={reset}
                style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                  letterSpacing:"0.1em",textTransform:"uppercase",padding:"12px 20px",
                  border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer",
                  background:"transparent",color:"rgba(255,255,255,0.4)"}}>Exit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── REFERRAL HUB ─────────────────────────────────────────────────────────────
var REFERRAL_APP_URL = "https://card-dynasty.vercel.app";
var REFERRAL_MILESTONES = [
  {count:1, label:"First Recruit",    reward:"500 Coins + 100 XP",    icon:"🎯"},
  {count:3, label:"Obsidian Founder", reward:"Exclusive Card Skin",    icon:"💎"},
  {count:5, label:"Dynasty Builder",  reward:"Legendary Pack + 1K XP", icon:"👑"},
  {count:10,label:"The Godfather",    reward:"2,500 Coins + Hobby Box", icon:"🏆"},
];

// Deterministic code from userId or username — DYNASTY + last 3 chars of id uppercase
function makeReferralCode(userId, username) {
  if (userId) {
    var clean = userId.replace(/[^a-zA-Z0-9]/g,"").toUpperCase();
    return "DYNASTY-" + clean.slice(-4);
  }
  if (username && username.length >= 2) {
    return "DYNASTY-" + username.replace(/[^A-Z0-9]/gi,"").toUpperCase().slice(0,4).padEnd(4,"0");
  }
  return "DYNASTY-XXXX";
}

function ReferralHub(props) {
  var userId = props.userId;
  var username = props.username || "";
  var referralCount = props.referralCount || 0;
  var onClose = props.onClose;
  var onCopyNotif = props.onCopyNotif || function(){};

  var code = makeReferralCode(userId, username);
  var shareUrl = REFERRAL_APP_URL + "?ref=" + code;
  var shareMsg = "I'm building my sports card vault on Card Dynasty. Use my code " + code + " to get 1,000 bonus coins before the NBA Play-In tips off tonight! 🏀 " + shareUrl;

  var copiedState = useState(false); var copied = copiedState[0]; var setCopied = copiedState[1];
  var mountedState = useState(false); var mounted = mountedState[0]; var setMounted = mountedState[1];
  useEffect(function(){var t=setTimeout(function(){setMounted(true);},40);return function(){clearTimeout(t);};},[]);

  var nextMilestone = REFERRAL_MILESTONES.find(function(m){return referralCount < m.count;}) || REFERRAL_MILESTONES[REFERRAL_MILESTONES.length-1];
  var prevMilestoneCount = (function(){
    var idx = REFERRAL_MILESTONES.indexOf(nextMilestone);
    return idx > 0 ? REFERRAL_MILESTONES[idx-1].count : 0;
  })();
  var milestonePct = nextMilestone
    ? Math.min(100, Math.round(((referralCount - prevMilestoneCount) / (nextMilestone.count - prevMilestoneCount)) * 100))
    : 100;

  function copyCode() {
    try { navigator.clipboard.writeText(code); } catch(e) {}
    setCopied(true);
    onCopyNotif("Code Copied!", code + " is on your clipboard", "sale");
    setTimeout(function(){setCopied(false);}, 2200);
  }

  function shareLink() {
    if (navigator.share) {
      navigator.share({ title:"Card Dynasty", text:shareMsg, url:shareUrl })
        .catch(function(){});
    } else {
      // Fallback: copy full message
      try { navigator.clipboard.writeText(shareMsg); } catch(e) {}
      onCopyNotif("Link Copied!", "Share message copied to clipboard", "sale");
    }
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:3100,display:"flex",alignItems:"center",
      justifyContent:"center",padding:"16px",background:"rgba(0,0,0,0.78)"}}
      onClick={onClose}>
      <div onClick={function(e){e.stopPropagation();}}
        style={{
          width:"100%",maxWidth:420,
          background:"linear-gradient(160deg,#080010,#0e001c,#0a0016)",
          border:"1px solid rgba(245,197,24,0.3)",
          boxShadow:"0 0 60px rgba(245,197,24,0.12),0 0 120px rgba(153,51,255,0.1),0 24px 80px rgba(0,0,0,0.7)",
          overflow:"hidden",
          transform:mounted?"scale(1) translateY(0)":"scale(0.92) translateY(20px)",
          opacity:mounted?1:0,
          transition:"transform 0.32s cubic-bezier(0.34,1.56,0.64,1),opacity 0.22s ease",
        }}>

        {/* Gold top border */}
        <div style={{height:2,background:"linear-gradient(90deg,transparent,#c8a800,#f5e060,#c8a800,transparent)"}}/>

        {/* Header */}
        <div style={{padding:"20px 22px 16px",borderBottom:"1px solid rgba(245,197,24,0.1)",
          display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
              letterSpacing:"0.5em",textTransform:"uppercase",
              color:"rgba(200,160,80,0.6)",marginBottom:5}}>Card Dynasty</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,
              letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:1,
              background:"linear-gradient(90deg,#c8a800,#f5e060,#f5c518,#c8a800)",
              backgroundSize:"200% auto",animation:"balShimmer 3s linear infinite",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Recruit a Friend</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,
              color:"rgba(255,255,255,0.4)",marginTop:5}}>
              You get 500 coins + 100 XP. They get 1,000 coins + a Genesis Pack.
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",
            color:"rgba(255,255,255,0.4)",cursor:"pointer",width:28,height:28,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,flexShrink:0}}>✕</button>
        </div>

        <div style={{padding:"18px 22px 22px"}}>

          {/* Referral code display */}
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
              letterSpacing:"0.35em",textTransform:"uppercase",
              color:"rgba(200,160,80,0.55)",marginBottom:8}}>Your Referral Code</div>
            <div style={{background:"#000",border:"1px solid rgba(245,197,24,0.35)",
              padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",
              gap:12,cursor:"pointer",position:"relative",overflow:"hidden"}}
              onClick={copyCode}>
              {/* Scanline shimmer */}
              <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(245,197,24,0.03) 3px,rgba(245,197,24,0.03) 4px)",pointerEvents:"none"}}/>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,
                letterSpacing:"0.12em",color:"#f5c518",
                textShadow:"0 0 12px rgba(245,197,24,0.7),0 0 24px rgba(245,197,24,0.3)",
                userSelect:"all",position:"relative"}}>{code}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                letterSpacing:"0.1em",textTransform:"uppercase",
                color:copied?"#22cc55":"rgba(245,197,24,0.6)",
                position:"relative",flexShrink:0,transition:"color 0.2s"}}>
                {copied?"✓ Copied":"Tap to Copy"}
              </div>
            </div>
          </div>

          {/* Progress toward next milestone */}
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
                letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(200,160,80,0.55)"}}>Referral Progress</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,
                color:"#f5c518"}}>{referralCount} / {nextMilestone.count}</div>
            </div>
            {/* Bar */}
            <div style={{background:"rgba(255,255,255,0.06)",height:8,overflow:"hidden",marginBottom:10,position:"relative"}}>
              <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 21px)"}}/>
              <div style={{height:"100%",width:milestonePct+"%",
                background:"linear-gradient(90deg,#7a5200,#f5c518,#ffe566,#c8a800)",
                backgroundSize:"200% auto",animation:"balShimmer 2.5s linear infinite",
                transition:"width 1.2s ease-out",
                boxShadow:"0 0 8px rgba(245,197,24,0.6)"}}/>
            </div>
            {/* Next milestone callout */}
            <div style={{background:"rgba(245,197,24,0.06)",border:"1px solid rgba(245,197,24,0.15)",
              padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20,animation:"crownFloat 2s ease-in-out infinite",flexShrink:0}}>{nextMilestone.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:900,
                  letterSpacing:"0.06em",textTransform:"uppercase",color:"#f5c518",marginBottom:1}}>{nextMilestone.label}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"rgba(255,255,255,0.4)"}}>
                  {nextMilestone.count - referralCount === 1
                    ? "1 more friend"
                    : (nextMilestone.count - referralCount)+" more friends"} to unlock: <span style={{color:"rgba(255,255,255,0.65)"}}>{nextMilestone.reward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* All milestones strip */}
          <div style={{display:"flex",gap:0,marginBottom:18,border:"1px solid rgba(245,197,24,0.1)",overflow:"hidden"}}>
            {REFERRAL_MILESTONES.map(function(m,i){
              var done = referralCount >= m.count;
              return (
                <div key={i} style={{flex:1,padding:"8px 4px",textAlign:"center",
                  borderRight:i<REFERRAL_MILESTONES.length-1?"1px solid rgba(245,197,24,0.08)":"none",
                  background:done?"rgba(245,197,24,0.07)":"transparent"}}>
                  <div style={{fontSize:14,marginBottom:2,filter:done?"none":"grayscale(1) opacity(0.3)"}}>{m.icon}</div>
                  <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:10,fontWeight:700,
                    color:done?"#f5c518":"rgba(255,255,255,0.2)"}}>{m.count}</div>
                  {done&&<div style={{width:6,height:6,borderRadius:"50%",background:"#f5c518",
                    margin:"2px auto 0",boxShadow:"0 0 4px rgba(245,197,24,0.8)"}}/>}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <button onClick={shareLink}
              style={{flex:2,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,
                letterSpacing:"0.14em",textTransform:"uppercase",padding:"13px 0",
                border:"none",cursor:"pointer",
                background:"linear-gradient(90deg,#7a5200,#c8a800,#f5c518,#c8a800,#7a5200)",
                backgroundSize:"200% auto",animation:"balShimmer 3s linear infinite",
                color:"#000",
                boxShadow:"0 0 20px rgba(245,197,24,0.35),0 0 40px rgba(245,197,24,0.12)"}}>
              📤 Share Link
            </button>
            <button onClick={copyCode}
              style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,
                letterSpacing:"0.1em",textTransform:"uppercase",padding:"13px 0",
                border:"1px solid rgba(245,197,24,0.3)",cursor:"pointer",
                background:"rgba(245,197,24,0.06)",color:copied?"#22cc55":"rgba(245,197,24,0.7)",
                transition:"color 0.2s"}}>
              {copied?"✓ Copied":"Copy Code"}
            </button>
          </div>

          {/* Reward breakdown */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",
            padding:"12px 14px"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
              letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:10}}>How It Works</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[
                {who:"You (Referrer)",reward:"500 🪙 + 100 XP per sign-up",color:"#f5c518",icon:"👤"},
                {who:"Your Friend",reward:"1,000 🪙 + Genesis Pack (5 cards)",color:"#22cc88",icon:"🧑"},
                {who:"At 3 Referrals",reward:"Obsidian Founder skin unlocked",color:"#cc88ff",icon:"💎"},
              ].map(function(r,i){
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14,flexShrink:0}}>{r.icon}</span>
                    <div style={{flex:1}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                        letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)"}}>{r.who}: </span>
                      <span style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:r.color}}>{r.reward}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gold bottom border */}
        <div style={{height:2,background:"linear-gradient(90deg,transparent,#c8a800,#f5e060,#c8a800,transparent)"}}/>
      </div>
    </div>
  );
}

// ── PLAYOFF PREDICTOR ────────────────────────────────────────────────────────
var PREDICTION_DATE = "April 19, 2025";
var PREDICTION_REWARD_XP = 2000;
var PREDICTION_REWARD_COINS = 500;

var MATCHUPS = [
  {
    id:"cel_phi",
    time:"1:00 PM ET",
    sport:"NBA",
    series:"NBA Playoffs · First Round",
    home:"Celtics",   homeCode:"BOS", homeColor:"#007A33", homeRecord:"3-0",
    away:"76ers",     awayCode:"PHI", awayColor:"#006BB6", awayRecord:"0-3",
    seed:[1,8],
  },
  {
    id:"okc_phx",
    time:"3:30 PM ET",
    sport:"NBA",
    series:"NBA Playoffs · First Round",
    home:"Thunder",   homeCode:"OKC", homeColor:"#007AC1", homeRecord:"2-1",
    away:"Suns",      awayCode:"PHX", awayColor:"#E56020", awayRecord:"1-2",
    seed:[1,8],
  },
  {
    id:"det_orl",
    time:"6:30 PM ET",
    sport:"NBA",
    series:"NBA Playoffs · First Round",
    home:"Pistons",   homeCode:"DET", homeColor:"#C8102E", homeRecord:"1-2",
    away:"Magic",     awayCode:"ORL", awayColor:"#0077C0", awayRecord:"2-1",
    seed:[5,4],
  },
  {
    id:"sas_por",
    time:"9:00 PM ET",
    sport:"NBA",
    series:"NBA Playoffs · First Round",
    home:"Spurs",     homeCode:"SAS", homeColor:"#C4CED4", homeRecord:"0-3",
    away:"Blazers",   awayCode:"POR", awayColor:"#E03A3E", awayRecord:"3-0",
    seed:[8,1],
  },
];

// Deterministic-ish seeded community picks so the bar feels live
// Real % would come from Supabase; we seed plausible numbers here as baseline
var COMMUNITY_SEED = {
  cel_phi:  {Celtics:82, "76ers":18},
  okc_phx:  {Thunder:71, Suns:29},
  det_orl:  {Pistons:48, Magic:52},
  sas_por:  {Spurs:22,   Blazers:78},
};

function PlayoffPredictor(props) {
  var userId        = props.userId;
  var balance       = props.balance;
  var onAddXp       = props.onAddXp || function(){};
  var onBalChange   = props.onBalChange || function(){};
  var onNotif       = props.onNotif || function(){};
  var dbSave        = props.dbSave || function(){};

  // predictions: {matchup_id: teamName}
  var predsState  = useState(function(){
    try{ return JSON.parse(localStorage.getItem("cd_predictions_apr19")||"{}"); }catch(e){return {};}
  });
  var preds = predsState[0]; var setPreds = predsState[1];

  // results: {matchup_id: teamName} — null until "Reveal" (demo mode)
  var resultsState = useState(null); var results = resultsState[0]; var setResults = resultsState[1];
  var claimedState = useState(function(){
    try{ return JSON.parse(localStorage.getItem("cd_pred_claimed_apr19")||"[]"); }catch(e){return [];}
  });
  var claimed = claimedState[0]; var setClaimed = claimedState[1];

  // community votes — loaded from Supabase predictions table, seeded locally as fallback
  var communityState = useState(COMMUNITY_SEED);
  var community = communityState[0]; var setCommunity = communityState[1];

  var mountedState = useState(false); var setMounted = mountedState[1];
  useEffect(function(){
    var t = setTimeout(function(){setMounted(true);},40);
    // Load community picks from Supabase if available
    if(window.supabase_client || (typeof supabase !== "undefined" && supabase)){
      var db = (typeof supabase !== "undefined" && supabase);
      if(db){
        db.from("predictions")
          .select("matchup_id,pick")
          .eq("date","2025-04-19")
          .then(function(res){
            if(!res||!res.data||!res.data.length) return;
            var tally = {};
            res.data.forEach(function(r){
              if(!tally[r.matchup_id]) tally[r.matchup_id] = {};
              tally[r.matchup_id][r.pick] = (tally[r.matchup_id][r.pick]||0)+1;
            });
            // Convert counts to percentages
            var pcts = {};
            Object.keys(tally).forEach(function(mid){
              var total = Object.values(tally[mid]).reduce(function(a,b){return a+b;},0);
              pcts[mid] = {};
              Object.keys(tally[mid]).forEach(function(team){
                pcts[mid][team] = Math.round(tally[mid][team]/total*100);
              });
            });
            setCommunity(Object.assign({},COMMUNITY_SEED,pcts));
          }).catch(function(){});
      }
    }
    return function(){clearTimeout(t);};
  },[]);

  function savePredLocal(newPreds){
    try{ localStorage.setItem("cd_predictions_apr19", JSON.stringify(newPreds)); }catch(e){}
  }

  function pickTeam(matchupId, team){
    if(results) return; // locked after reveal
    var newPreds = Object.assign({},preds);
    newPreds[matchupId] = newPreds[matchupId]===team ? undefined : team;
    if(!newPreds[matchupId]) delete newPreds[matchupId];
    setPreds(newPreds);
    savePredLocal(newPreds);
    // Persist to Supabase predictions table
    if(userId && typeof supabase !== "undefined" && supabase){
      supabase.from("predictions")
        .upsert({user_id:userId, matchup_id:matchupId, pick:team, date:"2025-04-19"},
          {onConflict:"user_id,matchup_id"})
        .then(function(){})
        .catch(function(){});
    }
    // Nudge community pct locally for immediate feedback
    setCommunity(function(prev){
      var updated = Object.assign({},prev);
      var m = MATCHUPS.find(function(x){return x.id===matchupId;});
      if(!m) return prev;
      var cur = Object.assign({},prev[matchupId]||{});
      var other = team===m.home ? m.away : m.home;
      cur[team]   = Math.min(99,Math.max(1,(cur[team]||50)+2));
      cur[other]  = 100 - cur[team];
      updated[matchupId] = cur;
      return updated;
    });
  }

  // DEMO: "simulate" results — cycle through plausible outcomes
  var DEMO_RESULTS = {
    cel_phi:"Celtics", okc_phx:"Thunder", det_orl:"Magic", sas_por:"Blazers"
  };
  function revealResults(){
    setResults(DEMO_RESULTS);
  }

  function claimReward(matchupId){
    if(claimed.includes(matchupId)) return;
    var winner = results&&results[matchupId];
    if(!winner) return;
    var myPick = preds[matchupId];
    if(myPick !== winner) return;
    var newClaimed = claimed.concat([matchupId]);
    setClaimed(newClaimed);
    try{localStorage.setItem("cd_pred_claimed_apr19",JSON.stringify(newClaimed));}catch(e){}
    onAddXp(PREDICTION_REWARD_XP);
    onBalChange(balance + PREDICTION_REWARD_COINS);
    if(userId) dbSave(userId,{coins: balance + PREDICTION_REWARD_COINS});
    onNotif("Correct Prediction! 🎯","+"+PREDICTION_REWARD_COINS+"🪙 and +"+PREDICTION_REWARD_XP+" XP","sale");
  }

  var predCount = Object.keys(preds).length;
  var allPicked = predCount === MATCHUPS.length;

  return (
    <div style={{background:"#f0ede8",minHeight:"100vh",paddingBottom:80}}>

      {/* Hero header */}
      <div style={{background:"linear-gradient(160deg,#060818,#0a0e20,#0c1028)",
        padding:"22px 20px 20px",position:"relative",overflow:"hidden"}}>
        {/* Stars */}
        {[[6,10],[18,55],[8,80],[28,30],[24,70],[14,92],[30,48]].map(function(s,i){
          return <div key={i} style={{position:"absolute",width:i%2+1,height:i%2+1,
            background:"#fff",borderRadius:"50%",top:s[0]+"%",left:s[1]+"%",
            opacity:0.35,animation:"twinkle "+(2+i*0.3)+"s ease-in-out infinite "+(i*0.4)+"s"}}/>;
        })}
        <div style={{maxWidth:680,margin:"0 auto",position:"relative"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,
            letterSpacing:"0.45em",textTransform:"uppercase",
            color:"rgba(100,150,255,0.65)",marginBottom:5}}>Card Dynasty · Predictions</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,
            letterSpacing:"0.03em",textTransform:"uppercase",lineHeight:0.95,color:"#fff",
            marginBottom:6}}>Playoff<br/><em style={{color:"#f5c518",fontStyle:"normal"}}>Predictor</em></div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,
            color:"rgba(255,255,255,0.45)",marginBottom:16,lineHeight:1.5}}>
            Pick tonight's winners. Get it right: <span style={{color:"#f5c518",fontWeight:700}}>+{PREDICTION_REWARD_COINS.toLocaleString()} coins</span> and <span style={{color:"#cc88ff",fontWeight:700}}>+{PREDICTION_REWARD_XP.toLocaleString()} XP</span> per game.
          </div>
          {/* Progress chips */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",gap:4}}>
              {MATCHUPS.map(function(m,i){
                var picked = !!preds[m.id];
                return <div key={i} style={{width:10,height:10,borderRadius:"50%",
                  background:picked?"#f5c518":"rgba(255,255,255,0.12)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  boxShadow:picked?"0 0 6px rgba(245,197,24,0.7)":"none",
                  transition:"all 0.2s"}}/>;
              })}
            </div>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
              letterSpacing:"0.15em",textTransform:"uppercase",
              color:allPicked?"#f5c518":"rgba(255,255,255,0.35)"}}>
              {predCount}/{MATCHUPS.length} picked{allPicked?" · All in!":""}
            </span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
              color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {PREDICTION_DATE}
            </span>
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"16px 16px 20px"}}>

        {/* Results revealed banner */}
        {results&&<div style={{background:"linear-gradient(90deg,rgba(34,170,68,0.15),rgba(34,200,80,0.08))",
          border:"1px solid rgba(34,170,68,0.35)",padding:"12px 16px",marginBottom:16,
          display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:20}}>📋</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,
              letterSpacing:"0.12em",textTransform:"uppercase",color:"#22cc55"}}>Results In — Check Your Picks!</div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:1}}>
              Correct picks earn {PREDICTION_REWARD_COINS} coins + {PREDICTION_REWARD_XP} XP. Tap Claim on your winners.
            </div>
          </div>
        </div>}

        {/* Matchup cards */}
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
          {MATCHUPS.map(function(m){
            var myPick   = preds[m.id];
            var winner   = results && results[m.id];
            var isCorrect= myPick && winner && myPick === winner;
            var isWrong  = myPick && winner && myPick !== winner;
            var alrClaimed = claimed.includes(m.id);
            var comm     = community[m.id] || {};
            var homePct  = comm[m.home] || 50;
            var awayPct  = comm[m.away] || 50;
            // How many (simulated) total voters — add 10 community base
            var totalVoters = 10 + (myPick ? 1 : 0);

            return (
              <div key={m.id} style={{background:"#fff",border:"1px solid #e0ddd8",
                borderTop:"3px solid "+(isCorrect?"#22aa55":isWrong?"#e8161e":myPick?"#4488ff":"#e0ddd8"),
                overflow:"hidden",
                boxShadow:isCorrect?"0 0 16px rgba(34,170,68,0.12)":isWrong?"0 0 16px rgba(232,22,30,0.08)":"none",
                transition:"border-color 0.2s,box-shadow 0.2s"}}>

                {/* Game info strip */}
                <div style={{background:"#f8f6f2",borderBottom:"1px solid #ede9e4",
                  padding:"8px 14px",display:"flex",alignItems:"center",
                  justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:"#e8161e",
                      animation:"pulse 1s ease-in-out infinite"}}/>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                      letterSpacing:"0.12em",textTransform:"uppercase",color:"#888"}}>{m.series}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,
                      color:"#333"}}>{m.time}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
                      fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",
                      color:"#aaa"}}>{totalVoters} picking</span>
                  </div>
                </div>

                {/* Team buttons */}
                <div style={{display:"flex",padding:"14px 14px 10px",gap:8,alignItems:"stretch"}}>
                  {[
                    {team:m.home, code:m.homeCode, color:m.homeColor, record:m.homeRecord},
                    {team:m.away, code:m.awayCode, color:m.awayColor, record:m.awayRecord},
                  ].map(function(t){
                    var isPicked  = myPick === t.team;
                    var isWinner  = winner === t.team;
                    var isLoser   = winner && winner !== t.team;
                    var pct = t.team===m.home ? homePct : awayPct;
                    return (
                      <button key={t.team}
                        onClick={function(){pickTeam(m.id, t.team);}}
                        disabled={!!results}
                        style={{
                          flex:1,padding:"12px 10px",border:"none",cursor:results?"default":"pointer",
                          background:isWinner?"linear-gradient(135deg,rgba(34,170,68,0.12),rgba(34,200,80,0.06))"
                            :isLoser?"rgba(0,0,0,0.03)"
                            :isPicked?(t.color+"18"):"#faf8f5",
                          borderRadius:2,
                          outline:"2.5px solid "+(isWinner?"#22aa55":isLoser?"#eee":isPicked?t.color:"#e8e4e0"),
                          transition:"all 0.18s",
                          transform:isPicked&&!results?"scale(1.01)":"scale(1)",
                          opacity:isLoser?0.5:1,
                          position:"relative",overflow:"hidden",
                        }}>
                        {/* Winner/loser badge */}
                        {isWinner&&<div style={{position:"absolute",top:0,right:0,
                          background:"#22aa55",padding:"2px 7px"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                            fontWeight:900,color:"#fff",letterSpacing:"0.1em"}}>WIN</span>
                        </div>}
                        {isLoser&&<div style={{position:"absolute",top:0,right:0,
                          background:"#e0ddd8",padding:"2px 7px"}}>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                            fontWeight:900,color:"#aaa",letterSpacing:"0.1em"}}>LOSS</span>
                        </div>}
                        {/* Team code big */}
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,
                          letterSpacing:"0.04em",color:isPicked?t.color:"#ccc",lineHeight:1,
                          marginBottom:3,transition:"color 0.15s"}}>{t.code}</div>
                        {/* Team name */}
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                          letterSpacing:"0.06em",textTransform:"uppercase",
                          color:isPicked?"#111":"#888",marginBottom:1}}>{t.team}</div>
                        {/* Record */}
                        <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:10,
                          color:"#aaa",marginBottom:8}}>{t.record}</div>
                        {/* Your pick badge */}
                        {isPicked&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                          fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",
                          background:t.color,color:"#fff",padding:"2px 8px",
                          display:"inline-block",marginBottom:2}}>
                          {isCorrect?"✓ Correct":isWrong?"✗ Wrong":"Your Pick"}
                        </div>}
                      </button>
                    );
                  })}
                </div>

                {/* Community bar */}
                <div style={{padding:"0 14px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
                      letterSpacing:"0.2em",textTransform:"uppercase",color:"#bbb"}}>Community</span>
                    <div style={{flex:1,height:1,background:"#ede9e4"}}/>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                      color:"#ccc",letterSpacing:"0.1em"}}>{totalVoters} votes</span>
                  </div>
                  <div style={{display:"flex",height:24,overflow:"hidden",borderRadius:2,
                    border:"1px solid #ede9e4"}}>
                    {/* Home team bar */}
                    <div style={{width:homePct+"%",background:m.homeColor,
                      display:"flex",alignItems:"center",justifyContent:homePct>18?"center":"flex-end",
                      paddingRight:homePct<=18?4:0,
                      transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)",
                      position:"relative",overflow:"hidden",flexShrink:0}}>
                      {/* Subtle shimmer */}
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(255,255,255,0) 40%,rgba(255,255,255,0.15) 60%,rgba(255,255,255,0) 80%)",animation:"shimmerSweep 2.5s ease-in-out infinite"}}/>
                      {homePct>12&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:900,
                        color:"rgba(255,255,255,0.9)",letterSpacing:"0.06em",position:"relative",
                        textShadow:"0 1px 3px rgba(0,0,0,0.4)"}}>{homePct}%</span>}
                    </div>
                    {/* Away team bar */}
                    <div style={{flex:1,background:m.awayColor,
                      display:"flex",alignItems:"center",justifyContent:awayPct>18?"center":"flex-start",
                      paddingLeft:awayPct<=18?4:0,
                      position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(255,255,255,0) 40%,rgba(255,255,255,0.15) 60%,rgba(255,255,255,0) 80%)",animation:"shimmerSweep 2.5s ease-in-out infinite 0.5s"}}/>
                      {awayPct>12&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:900,
                        color:"rgba(255,255,255,0.9)",letterSpacing:"0.06em",position:"relative",
                        textShadow:"0 1px 3px rgba(0,0,0,0.4)"}}>{awayPct}%</span>}
                    </div>
                  </div>
                  {/* Labels below bar */}
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                      fontWeight:700,color:m.homeColor,letterSpacing:"0.04em"}}>{m.homeCode} {homePct}%</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,
                      fontWeight:700,color:m.awayColor,letterSpacing:"0.04em"}}>{awayPct}% {m.awayCode}</span>
                  </div>
                </div>

                {/* Claim reward row */}
                {results&&myPick&&(
                  <div style={{borderTop:"1px solid #ede9e4",padding:"10px 14px",
                    background:isCorrect?"rgba(34,170,68,0.04)":"rgba(0,0,0,0.01)",
                    display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                    {isCorrect?(
                      <>
                        <div>
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
                            color:"#22aa55",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                            🎯 Correct! +{PREDICTION_REWARD_COINS}🪙 +{PREDICTION_REWARD_XP} XP
                          </span>
                        </div>
                        {!alrClaimed
                          ?<button onClick={function(){claimReward(m.id);}}
                            style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:900,
                              letterSpacing:"0.1em",textTransform:"uppercase",padding:"7px 18px",
                              border:"none",cursor:"pointer",background:"#22aa55",color:"#fff",
                              animation:"claimPulse 1.5s ease-in-out infinite",flexShrink:0}}>
                            Claim →
                          </button>
                          :<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                            color:"#22aa55",letterSpacing:"0.06em",textTransform:"uppercase",
                            background:"#e8f5ec",border:"1px solid #c8e8d0",padding:"4px 10px"}}>
                            ✓ Claimed
                          </span>
                        }
                      </>
                    ):(
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
                        color:"#aaa",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                        ✗ Wrong pick — better luck next game
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reward info card */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",borderTop:"3px solid #7733cc",
          padding:"16px 18px",marginBottom:14}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,
            letterSpacing:"0.08em",textTransform:"uppercase",color:"#111",marginBottom:10}}>Reward Per Correct Pick</div>
          <div style={{display:"flex",gap:0,overflow:"hidden",border:"1px solid #ede9e4"}}>
            {[
              {label:"Coins",val:"+"+PREDICTION_REWARD_COINS,color:"#c8a800",icon:"🪙"},
              {label:"Season XP",val:"+"+PREDICTION_REWARD_XP,color:"#7733cc",icon:"⚡"},
              {label:"Max (4/4)",val:"+"+(PREDICTION_REWARD_COINS*4)+"🪙",color:"#22aa55",icon:"🏆"},
            ].map(function(s,i){
              return <div key={i} style={{flex:1,padding:"10px 8px",textAlign:"center",
                borderRight:i<2?"1px solid #ede9e4":"none"}}>
                <div style={{fontSize:16,marginBottom:3}}>{s.icon}</div>
                <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:14,fontWeight:700,
                  color:s.color,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,
                  letterSpacing:"0.12em",textTransform:"uppercase",color:"#bbb",marginTop:2}}>{s.label}</div>
              </div>;
            })}
          </div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#aaa",marginTop:10,lineHeight:1.5}}>
            Results are revealed after game time. XP counts toward your Dynasty Path level.
          </div>
        </div>

        {/* Dev / demo reveal button — shows in dev, hidden in prod you can remove */}
        {!results&&<button onClick={revealResults}
          style={{width:"100%",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
            letterSpacing:"0.12em",textTransform:"uppercase",padding:"10px",
            border:"1px dashed #ccc",cursor:"pointer",background:"transparent",color:"#bbb"}}>
          ◈ Demo: Reveal Results
        </button>}
      </div>
    </div>
  );
}

function RingProgress(props) {
  var pct=props.pct; var size=props.size||80; var stroke=props.stroke||7; var color=props.color||"#f5c518";
  var r=(size-stroke*2)/2; var circ=2*Math.PI*r;
  var offset=circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}    strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:"stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)"}} />
    </svg>
  );
}
var AVATAR_COLORS=["#f5c518","#E31837","#003594","#552583","#007A33","#002244","#00338D","#004C54","#241773","#008E97"];
function ProfileView(props) {
  var inventory=props.inventory; var balance=props.balance; var streakData=props.streakData;
  var profile=props.profile; var packsOpened=props.packsOpened||0;
  var onSaveProfile=props.onSaveProfile; var onBack=props.onBack;
  var liveTeams=props.liveTeams||new Set();
  var xp=props.xp||0;
  var claimedLevels=props.claimedLevels||[];
  var onClaimPathReward=props.onClaimPathReward||function(){};
  var userId=props.userId||null;
  var referralCount=props.referralCount||0;
  var onRecruit=props.onRecruit||function(){};
  var onLogout=props.onLogout||function(){};
  var editState=useState(false); var showEdit=editState[0]; var setShowEdit=editState[1];
  var editNameState=useState(profile.username); var editName=editNameState[0]; var setEditName=editNameState[1];
  var editBioState=useState(profile.bio); var editBio=editBioState[0]; var setEditBio=editBioState[1];
  var editColorState=useState(profile.avatarColor); var editColor=editColorState[0]; var setEditColor=editColorState[1];
  var editInitialsState=useState(profile.avatarInitials); var editInitials=editInitialsState[0]; var setEditInitials=editInitialsState[1];
  var savedState=useState(false); var justSaved=savedState[0]; var setJustSaved=savedState[1];
  var pickingState=useState(false); var pickingSlot=pickingState[0]; var setPickingSlot=pickingState[1];
  var netWorth=inventory.reduce(function(s,c){return s+c.mp;},0);
  var collectionPct=Math.min(100,Math.round((inventory.length/COLLECTION_CAP)*100));
  var sortedInv=inventory.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);});
  var rarestCard=sortedInv[0]||null;
  var joinDate=new Date(profile.joinDate||Date.now());
  var joinLabel=joinDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  var dailyYield=inventory.reduce(function(s,c){return s+c.daily;},0);
  var legendaryCount=inventory.filter(function(c){return c.rarity==="Legendary"||c.rarity==="Dynasty";}).length;
  var completedSets=Object.keys(DIVISIONS).filter(function(div){var info=DIVISIONS[div];var owned=new Set(inventory.filter(function(c){return c.sport===info.sport;}).map(function(c){return c.team;}));return info.teams.filter(function(t){return owned.has(t);}).length===info.teams.length;}).length;
  var allYields=[dailyYield]; // real comparison will come from leaderboard data
  allYields.sort(function(a,b){return b-a;});
  var myRank=1; // shown as #1 until leaderboard loads with real data
  var isTop100=myRank<=3;
  var pinnedCards=profile.pinnedIds.map(function(id){return inventory.find(function(c){return c.id===id;});}).filter(Boolean);
  while(pinnedCards.length<3) pinnedCards.push(null);
  var gradedCount=inventory.filter(function(c){return c.graded;}).length;
  var gemCount=inventory.filter(function(c){return c.grade===10;}).length;
  var BADGES=[
    // ── COLLECTION ─────────────────────────────────────────────────────────
    {id:"first_blood",    icon:"🃏", label:"First Card",     desc:"Open your first pack",              reward:100,  unlocked:packsOpened>=1,                                                               progress:packsOpened>=1?100:0},
    {id:"pack_addict",   icon:"📦", label:"Pack Addict",    desc:"Open 25 packs",                     reward:500,  unlocked:packsOpened>=25,                                                              progress:Math.min(100,Math.round(packsOpened/25*100))},
    {id:"pack_hoarder",  icon:"🗃️", label:"Pack Hoarder",   desc:"Open 100 packs",                    reward:2000, unlocked:packsOpened>=100,                                                             progress:Math.min(100,Math.round(packsOpened/100*100))},
    {id:"division_master",icon:"🏆",label:"Division Master","desc":"Complete any full division set",  reward:1000, unlocked:completedSets>=1,                                                             progress:completedSets>0?100:0},
    {id:"whale",         icon:"🐋", label:"Whale",          desc:"Hold 1,000,000 coins",              reward:5000, unlocked:balance>=1000000,                                                             progress:Math.min(100,Math.round(balance/10000))},
    // ── RARITY PULLS ───────────────────────────────────────────────────────
    {id:"first_rare",    icon:"🔵", label:"Blue Chip",      desc:"Pull your first Rare card",         reward:150,  unlocked:inventory.some(function(c){return c.rarity==="Rare";}),                      progress:inventory.some(function(c){return c.rarity==="Rare";})?100:0},
    {id:"first_elite",   icon:"💚", label:"Elite Status",   desc:"Pull your first Elite card",        reward:300,  unlocked:inventory.some(function(c){return c.rarity==="Elite";}),                     progress:inventory.some(function(c){return c.rarity==="Elite";})?100:0},
    {id:"first_legacy",  icon:"🟡", label:"Legacy Pull",    desc:"Pull your first Legacy card",       reward:750,  unlocked:inventory.some(function(c){return c.rarity==="Legacy";}),                    progress:inventory.some(function(c){return c.rarity==="Legacy";})?100:0},
    {id:"first_legendary",icon:"👑",label:"Legendary Pull", desc:"Pull your first Legendary card",    reward:1500, unlocked:inventory.some(function(c){return c.rarity==="Legendary";}),                 progress:inventory.some(function(c){return c.rarity==="Legendary";})?100:0},
    {id:"dynasty_puller",icon:"✨", label:"Dynasty Puller", desc:"Pull a Dynasty card",               reward:5000, unlocked:inventory.some(function(c){return c.rarity==="Dynasty";}),                   progress:inventory.some(function(c){return c.rarity==="Dynasty";})?100:0},
    {id:"the_closer",    icon:"🔟", label:"The Closer",     desc:"Own 10 Legendary+ cards",           reward:3000, unlocked:legendaryCount>=10,                                                           progress:Math.min(100,Math.round(legendaryCount*10))},
    // ── GRADING LAB ────────────────────────────────────────────────────────
    {id:"first_slab",    icon:"🔬", label:"First Slab",     desc:"Grade your first card",             reward:200,  unlocked:gradedCount>=1,                                                               progress:gradedCount>=1?100:0},
    {id:"gem_hunter",    icon:"💎", label:"Gem Hunter",     desc:"Grade a card to Gem Mint (10)",     reward:2500, unlocked:gemCount>=1,                                                                  progress:gemCount>=1?100:0},
    {id:"slab_master",   icon:"🏅", label:"Slab Master",    desc:"Have 10 graded cards",              reward:1000, unlocked:gradedCount>=10,                                                              progress:Math.min(100,Math.round(gradedCount*10))},
    // ── LIVE ORACLE ────────────────────────────────────────────────────────
    {id:"live_buzz",     icon:"⚡", label:"Live Wire",      desc:"Own a card during a live game",     reward:250,  unlocked:inventory.some(function(c){return liveTeams&&liveTeams.has&&liveTeams.has(c.team);}), progress:inventory.some(function(c){return liveTeams&&liveTeams.has&&liveTeams.has(c.team);})?100:0},
    {id:"yield_king",    icon:"💰", label:"Yield King",     desc:"Earn 1,000 coins/day passively",    reward:1000, unlocked:dailyYield>=1000,                                                             progress:Math.min(100,Math.round(dailyYield/10))},
  ];
  function handleSave() {
    var updated=Object.assign({},profile,{username:editName,bio:editBio,avatarColor:editColor,avatarInitials:editInitials.toUpperCase().slice(0,2)});
    onSaveProfile(updated);
    setJustSaved(true);
    setTimeout(function(){setJustSaved(false);setShowEdit(false);},1200);
  }
  function pinCard(card) {
    var newIds=profile.pinnedIds.slice();
    if(pickingSlot!==false&&pickingSlot<3) newIds[pickingSlot]=card.id;
    else newIds=newIds.filter(function(id){return id!==card.id;}).concat([card.id]).slice(-3);
    onSaveProfile(Object.assign({},profile,{pinnedIds:newIds.filter(function(id){return inventory.find(function(c){return c.id===id;});})}));
    setPickingSlot(false);
  }
  function unpin(i) {var ids=profile.pinnedIds.slice();ids.splice(i,1);onSaveProfile(Object.assign({},profile,{pinnedIds:ids}));}
  return (
    <div style={{minHeight:"100vh",background:"#f0ede8",paddingBottom:60}}>
      {/* Edit Profile Modal */}
      {showEdit&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#fff",border:"1px solid #e0ddd8",padding:"28px 26px",maxWidth:380,width:"100%",boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
            <div style={{borderBottom:"3px solid #e8161e",paddingBottom:12,marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111"}}>Edit Profile</div>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{width:64,height:64,background:editColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#fff"}}>{(editInitials||"ME").slice(0,2).toUpperCase()}</span>
              </div>
            </div>
            <div style={{marginBottom:12}}><label className="topps-label">Initials</label><input className="topps-input" maxLength={2} value={editInitials} onChange={function(e){setEditInitials(e.target.value.toUpperCase().slice(0,2));}}/></div>
            <div style={{marginBottom:12}}><label className="topps-label">Username</label><input className="topps-input" value={editName} onChange={function(e){setEditName(e.target.value);}}/></div>
            <div style={{marginBottom:12}}><label className="topps-label">Bio</label><textarea className="topps-input" value={editBio} onChange={function(e){setEditBio(e.target.value);}} rows={2} style={{resize:"none"}}/></div>
            <div style={{marginBottom:20}}>
              <label className="topps-label">Avatar Color</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {AVATAR_COLORS.map(function(col){return <button key={col} onClick={function(){setEditColor(col);}} style={{width:28,height:28,background:col,border:editColor===col?"3px solid #111":"2px solid transparent",cursor:"pointer",flexShrink:0}}/>;}) }
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleSave} className="topps-btn-primary" style={{flex:2,fontSize:14,padding:"12px",clipPath:"none",borderRadius:0}}>{justSaved?"Saved!":"Save Changes"}</button>
              <button onClick={function(){setShowEdit(false);}} style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"12px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Card picker overlay */}
      {pickingSlot!==false&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.7)",display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px",overflowY:"auto"}} onClick={function(){setPickingSlot(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:720}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16,textAlign:"center"}}>Pick Card for Slot {pickingSlot+1}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:14}}>
              {sortedInv.map(function(c){return <div key={c.id} onClick={function(){pinCard(c);}} style={{cursor:"pointer"}}><FlipCard card={c} autoFlip={true}/></div>;})}
            </div>
          </div>
        </div>
      )}
      {/* Profile header */}
      <div style={{background:"#fff",borderBottom:"3px solid #e8161e",padding:"12px 16px",display:"flex",alignItems:"center",gap:8,position:"sticky",top:82,zIndex:40,flexWrap:"wrap"}}>
        <button onClick={onBack} className="topps-btn-outline" style={{padding:"6px 14px",fontSize:13}}>← Back</button>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111",flex:1}}>My Profile</div>
        <button onClick={function(){setShowEdit(true);setEditName(profile.username);setEditBio(profile.bio);setEditColor(profile.avatarColor);setEditInitials(profile.avatarInitials);}}
          className="topps-btn-outline" style={{padding:"6px 14px",fontSize:13}}>Edit</button>
        <button onClick={onRecruit}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:900,
            letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 14px",
            border:"none",cursor:"pointer",flexShrink:0,
            background:"linear-gradient(90deg,#7a5200,#c8a800,#f5c518,#c8a800,#7a5200)",
            backgroundSize:"200% auto",animation:"balShimmer 3s linear infinite",
            color:"#000",boxShadow:"0 0 12px rgba(245,197,24,0.45)"}}>👥 Recruit</button>
        <button onClick={onLogout}
          style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
            letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 14px",
            border:"1px solid #e0ddd8",cursor:"pointer",flexShrink:0,
            background:"#f0ede8",color:"#888"}}>Sign Out</button>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 16px"}}>
        {/* Identity card */}
        <div style={{background:"#fff",border:"1px solid #e0ddd8",marginBottom:20,display:"flex",gap:0,overflow:"hidden"}}>
          <div style={{width:8,background:"#e8161e",flexShrink:0}}/>
          <div style={{padding:"20px 20px",flex:1}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
              <div style={{width:64,height:64,background:profile.avatarColor||"#e8161e",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:"#fff"}}>{profile.avatarInitials}</span>
              </div>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",lineHeight:1,marginBottom:4}}>{profile.username}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#666",lineHeight:1.5,marginBottom:8}}>{profile.bio}</div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>Streak: <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#e8161e"}}>{streakData.currentStreak||0}d</span></span>
                  <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>Since <span style={{fontWeight:600,color:"#333"}}>{joinLabel}</span></span>
                  <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#888"}}>Packs: <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#333"}}>{packsOpened}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral recruiting callout */}
        <div onClick={onRecruit} style={{
          background:"linear-gradient(135deg,#0a0800,#150e00,#0a0800)",
          border:"1px solid rgba(245,197,24,0.3)",
          marginBottom:20,padding:"14px 18px",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",
          boxShadow:"0 0 24px rgba(245,197,24,0.08)",
          position:"relative",overflow:"hidden"}}>
          {/* Gold shimmer sweep */}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,transparent 40%,rgba(245,197,24,0.04) 50%,transparent 60%)",pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28,animation:"crownFloat 2s ease-in-out infinite",filter:"drop-shadow(0 0 8px rgba(245,197,24,0.6))"}}>👥</span>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,
                letterSpacing:"0.06em",textTransform:"uppercase",
                background:"linear-gradient(90deg,#c8a800,#f5c518)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                Recruit a Friend
              </div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:1}}>
                {referralCount} referred · You earn 500🪙 + 100 XP each
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {/* Mini milestone dots */}
            {REFERRAL_MILESTONES.slice(0,3).map(function(m,i){
              var done = referralCount >= m.count;
              return <div key={i} style={{width:10,height:10,borderRadius:"50%",
                background:done?"#f5c518":"rgba(245,197,24,0.15)",
                border:"1px solid rgba(245,197,24,0.3)",
                boxShadow:done?"0 0 6px rgba(245,197,24,0.7)":"none"}}/>;
            })}
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,
              letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(245,197,24,0.6)",marginLeft:4}}>Open →</span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:8,marginBottom:20}}>
          {[
            {label:"Net Worth",val:fmt(netWorth),sub:"coin value",color:"#c8a800"},
            {label:"Daily Yield",val:fmt(dailyYield),sub:"coins/day",color:"#22aa44"},
            {label:"Legendaries",val:legendaryCount,sub:"owned",color:"#7733cc"},
            {label:"Packs Opened",val:packsOpened,sub:"total",color:"#e8161e"},
          ].map(function(s,i){
            return <div key={i} style={{background:"#fff",border:"1px solid #e0ddd8",borderTop:"3px solid "+s.color,padding:"14px 14px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginBottom:6}}>{s.label}</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:22,fontWeight:700,color:s.color,lineHeight:1,marginBottom:2}}>{s.val}</div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#aaa"}}>{s.sub}</div>
            </div>;
          })}
          {/* Collection progress */}
          <div style={{background:"#fff",border:"1px solid #e0ddd8",borderTop:"3px solid #1155bb",padding:"14px 14px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{position:"relative",flexShrink:0}}>
              <RingProgress pct={collectionPct} size={52} stroke={4} color="#1155bb"/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,color:"#1155bb"}}>{collectionPct}%</span>
              </div>
            </div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginBottom:3}}>Collection</div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:16,fontWeight:700,color:"#1155bb"}}>{inventory.length}<span style={{fontSize:12,color:"#aaa"}}>/{COLLECTION_CAP}</span></div>
            </div>
          </div>
          {rarestCard&&<div style={{background:"#fff",border:"1px solid "+(RCOLORS[rarestCard.rarity]||"#ddd")+"66",borderTop:"3px solid "+(RCOLORS[rarestCard.rarity]||"#ddd"),padding:"14px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{flexShrink:0}}><MiniCard card={rarestCard}/></div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#888",marginBottom:3}}>Rarest Pull</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:RCOLORS[rarestCard.rarity]||"#333"}}>{rarestCard.rarity}</div>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#888"}}>{rarestCard.team}</div>
            </div>
          </div>}
        </div>

        {/* Showcase Shelf */}
        <div style={{marginBottom:24}}>
          <div className="topps-section-title">Showcase Shelf</div>
          <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center",background:"#111",padding:"24px 20px"}}>
            {pinnedCards.map(function(card,i){
              return <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                {card?(
                  <div style={{position:"relative",animation:"showcaseFloat 4s ease-in-out infinite",animationDelay:(i*0.6)+"s"}}>
                    {card.graded&&card.grade
                      ?<AcrylicSlab card={card} gradeTier={GRADE_TIERS.find(function(t){return t.grade===card.grade;})||GRADE_TIERS[GRADE_TIERS.length-1]} compact={false}/>
                      :<div style={{transform:"scale(1.05)",transformOrigin:"top center"}}><FlipCard card={card} autoFlip={true}/></div>}
                    <button onClick={function(){unpin(i);}} style={{position:"absolute",top:-8,right:-8,width:20,height:20,background:"#e8161e",border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,zIndex:30}}>✕</button>
                  </div>
                ):(
                  <button onClick={function(){setPickingSlot(i);}} style={{width:160,height:220,border:"2px dashed rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{fontSize:28,opacity:0.3,color:"#fff"}}>+</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Pin Card</span>
                  </button>
                )}
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)"}}>Slot {i+1}</div>
              </div>;
            })}
          </div>
        </div>

        {/* Dynasty Path */}
        <div style={{marginBottom:24,background:"#0a0018",padding:"20px 20px 16px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(153,51,255,0.08),transparent 70%)",pointerEvents:"none"}}/>
          <DynastyPath xp={xp} claimedLevels={claimedLevels} onClaim={onClaimPathReward}/>
        </div>

        {/* Achievements */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div className="topps-section-title" style={{marginBottom:0}}>Achievements</div>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.1em",color:"#888",textTransform:"uppercase"}}>{BADGES.filter(function(b){return b.unlocked;}).length} / {BADGES.length}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
            {BADGES.map(function(badge){
              return <div key={badge.id} style={{background:badge.unlocked?"#fff":"#f5f3f0",border:"1px solid "+(badge.unlocked?"#e8161e":"#e0ddd8"),borderTop:"3px solid "+(badge.unlocked?"#e8161e":"#e0ddd8"),padding:"14px 12px",opacity:badge.unlocked?1:0.55,position:"relative"}}>
                <div style={{fontSize:22,marginBottom:6,filter:badge.unlocked?"none":"grayscale(1) opacity(0.4)"}}>{badge.icon}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:badge.unlocked?"#111":"#aaa",marginBottom:2}}>{badge.label}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:badge.unlocked?"#666":"#bbb",marginBottom:6}}>{badge.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}>
                  <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:11,fontWeight:700,color:badge.unlocked?"#22aa44":"#aaa"}}>+{fmt(badge.reward)} coins</span>
                  {badge.unlocked&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,background:"#e8f5ec",color:"#22aa44",border:"1px solid #c8e8d0",padding:"1px 6px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Claimed</span>}
                </div>
                <div style={{background:"#e8e8e8",height:3,overflow:"hidden"}}>
                  <div style={{height:"100%",background:badge.unlocked?"#e8161e":"#ddd",width:badge.progress+"%",transition:"width 1s ease-out"}}/>
                </div>
                {badge.unlocked&&<div style={{position:"absolute",top:8,right:8,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,color:"#22aa44"}}>✓</div>}
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var onboardedState=useState(false); var onboarded=onboardedState[0]; var setOnboarded=onboardedState[1];
  var balanceState=useState(0); var balance=balanceState[0]; var setBalance=balanceState[1];
  var tabState=useState("shop"); var tab=tabState[0]; var setTab=tabState[1];
  var invSubTabState=useState("cards"); var invSubTab=invSubTabState[0]; var setInvSubTab=invSubTabState[1];
  var inventoryState=useState([]); var inventory=inventoryState[0]; var setInventory=inventoryState[1];
  var openingState=useState(null); var opening=openingState[0]; var setOpening=openingState[1];
  var winnersState=useState(null); var winners=winnersState[0]; var setWinners=winnersState[1];
  var gdResultState=useState(null); var gdResult=gdResultState[0]; var setGdResult=gdResultState[1];
  var showGDState=useState(false); var showGD=showGDState[0]; var setShowGD=showGDState[1];
  var lastGameDayState=useState(function(){try{return localStorage.getItem("cd_lastgameday")||null;}catch(e){return null;}});
  var lastGameDay=lastGameDayState[0]; var setLastGameDay=lastGameDayState[1];
  var pityState=useState(0); var pity=pityState[0]; var setPity=pityState[1];
  var profileState=useState(function(){return loadProfile();}); var profile=profileState[0]; var setProfile=profileState[1];
  var packsState=useState(function(){var p=loadProfile();return p.packsOpened||0;}); var packsOpened=packsState[0]; var setPacksOpened=packsState[1];
  var userIdState=useState(null); var userId=userIdState[0]; var setUserId=userIdState[1];
  var authReadyState=useState(!supabase); var authReady=authReadyState[0]; var setAuthReady=authReadyState[1];
  var isNewUserState=useState(false); var isNewUser=isNewUserState[0]; var setIsNewUser=isNewUserState[1];
  // Guard: true once dbLoadUser has resolved — prevents premature writes before DB data arrives
  var dbLoadedState=useState(!supabase); var dbLoaded=dbLoadedState[0]; var setDbLoaded=dbLoadedState[1];
  var xpState=useState(0); var xp=xpState[0]; var setXp=xpState[1];
  var claimedLevelsState=useState([]); var claimedLevels=claimedLevelsState[0]; var setClaimedLevels=claimedLevelsState[1];
  var levelUpRewardState=useState(null); var levelUpReward=levelUpRewardState[0]; var setLevelUpReward=levelUpRewardState[1];
  var prevLevelRef=useRef(0);
  var referralCountState=useState(0); var referralCount=referralCountState[0]; var setReferralCount=referralCountState[1];
  var showReferralState=useState(false); var showReferral=showReferralState[0]; var setShowReferral=showReferralState[1];

  // ── SUPABASE DATA HELPERS ─────────────────────────────────────────────────
  function dbSaveProfile(uid, data) {
    if(!supabase||!uid) return;
    supabase.from("profiles").upsert(Object.assign({id:uid},data),{onConflict:"id"})
      .then(function(res){
        if(res.error) console.error("dbSaveProfile error:",res.error);
        else console.log("[CardDynasty] Profile saved for user",uid);
      });
  }

  function dbSaveCards(uid, cards) {
    if(!supabase||!uid) return;
    if(!cards||!cards.length){
      // Only wipe if explicitly passing empty — and only after confirming user exists
      supabase.from("profiles").select("id").eq("id",uid).maybeSingle().then(function(r){
        if(r&&r.data) supabase.from("user_cards").delete().eq("user_id",uid).then(function(){});
      });
      return;
    }
    // Safe upsert — never deletes first. Uses card_id as conflict key.
    // This means cards can only grow or update, never silently vanish.
    var rows=cards.map(function(c){
      return {user_id:uid,sport:c.sport,team:c.team,rarity:c.rarity,daily:c.daily||0,win:c.win||0,mp:c.mp||0,card_id:c.id||genId(),is_slabbed:c.graded||false,grade:c.grade||null,yield_multiplier:c.gradeMultiplier||null};
    });
    // Upsert in batches of 50 to stay under Supabase payload limits
    var batchSize=50;
    function upsertBatch(i){
      if(i>=rows.length) return;
      var batch=rows.slice(i,i+batchSize);
      supabase.from("user_cards").upsert(batch,{onConflict:"card_id"}).then(function(res){
        if(res.error) console.error("[CardDynasty] dbSaveCards upsert error:",res.error);
        else upsertBatch(i+batchSize);
      });
    }
    upsertBatch(0);
  }

  // One-time compensation: grant replacement cards to accounts that lost
  // their collection due to the old delete+insert bug.
  // Triggered when: 0 cards in DB + coins > 1,000,000 + compensation_granted IS NOT set.
  // Marked permanently in profiles.compensation_granted to prevent double-grant.
  var COMPENSATION_USERS = ["ClutchRiley_"];
  function grantCompensation(uid, username, coins) {
    if(!supabase||!uid) return;
    // Check flag first — never grant twice
    supabase.from("profiles").select("compensation_granted").eq("id",uid).maybeSingle()
      .then(function(res){
        if(res.data&&res.data.compensation_granted) return; // already done
        // Build ~150,000 coin value of cards, no Dynasty
        // 3 Legendary (~35k each = 105k) + 4 Legacy (~10k each = 40k) + 1 Elite (~3k) ≈ 148k
        var compRates = {Legendary:50,Legacy:30,Elite:15,Rare:5};
        var compCards = [
          genCard({Legendary:100},null,null),
          genCard({Legendary:100},null,null),
          genCard({Legendary:100},null,null),
          genCard({Legacy:100},null,null),
          genCard({Legacy:100},null,null),
          genCard({Legacy:100},null,null),
          genCard({Legacy:100},null,null),
          genCard({Elite:100},null,null),
        ];
        // Save cards via upsert
        var rows = compCards.map(function(c){
          return {user_id:uid,sport:c.sport,team:c.team,rarity:c.rarity,
            daily:c.daily||0,win:c.win||0,mp:c.mp||0,card_id:c.id||genId(),
            is_slabbed:false,grade:null,yield_multiplier:null};
        });
        supabase.from("user_cards").upsert(rows,{onConflict:"card_id"})
          .then(function(insRes){
            if(insRes.error){console.error("[CardDynasty] compensation insert error:",insRes.error);return;}
            // Mark compensation as granted so it never runs again
            supabase.from("profiles").update({compensation_granted:true}).eq("id",uid).then(function(){});
            // Update local state so cards appear immediately
            setInventory(compCards);
            setOnboarded(true);
            setIsNewUser(false);
            console.log("[CardDynasty] Compensation cards granted to",username);
          });
      });
  }

  function dbLoadUser(uid) {
    sb(function(db){
      return Promise.all([
        db.from("profiles").select("*").eq("id",uid).maybeSingle(),
        db.from("user_cards").select("*").eq("user_id",uid),
      ]).then(function(results){
        var profileRes=results[0]; var cardsRes=results[1];
        if(profileRes&&profileRes.data){
          var p=profileRes.data;
          var prof={username:p.username||"",avatarColor:p.avatar_color||"#f5c518",avatarInitials:p.avatar_initials||"ME",bio:p.bio||"",favSport:p.fav_sport||"",favTeam:p.fav_team||"",joinDate:p.created_at||new Date().toISOString(),pinnedIds:p.pinned_ids||[],packsOpened:p.packs_opened||0};
          setProfile(prof); saveProfile(prof);
          setBalance(p.coins||0);
          setPacksOpened(p.packs_opened||0);
          if(p.xp!=null){ setXp(p.xp||0); prevLevelRef.current=xpToLevel(p.xp||0); }
          if(p.claimed_levels){ try{setClaimedLevels(JSON.parse(p.claimed_levels)||[]);}catch(e){} }
          if(p.referral_count!=null){ setReferralCount(p.referral_count||0); }

          // ── COMPENSATION CHECK ─────────────────────────────────────────────
          var hasCards=cardsRes&&cardsRes.data&&cardsRes.data.length>0;
          var isEligible = !hasCards
            && (p.coins||0) >= 1000000
            && COMPENSATION_USERS.includes(p.username)
            && !p.compensation_granted;
          if(isEligible){
            grantCompensation(uid, p.username, p.coins||0);
            setDbLoaded(true);
            return; // grantCompensation sets inventory + onboarded
          }
        }
        var hasCards=cardsRes&&cardsRes.data&&cardsRes.data.length>0;
        if(hasCards){
          var rawCards=cardsRes.data.map(function(r){return {id:r.card_id||genId(),sport:r.sport,team:r.team,rarity:r.rarity,daily:r.daily,win:r.win,mp:r.mp,graded:r.is_slabbed||false,grade:r.grade||null,gradeMultiplier:r.yield_multiplier||null,gradeTier:r.grade>=10?"gem":r.grade>=9?"mint":r.grade>=8?"good":"base"};});
          var cards=trimToLimit(rawCards);
          var trimmed=rawCards.length-cards.length;
          setInventory(cards);
          setOnboarded(true);
          setIsNewUser(false);
          // If over cap, save the trimmed collection back to DB immediately
          if(trimmed>0){
            dbSaveCards(uid,cards);
            console.log("[CardDynasty] Auto-trimmed "+trimmed+" cards for user "+uid+" (was "+rawCards.length+", now "+cards.length+")");
          }
        } else {
          setIsNewUser(true);
          setOnboarded(false);
        }
        setDbLoaded(true);
      }).catch(function(e){
        console.error("dbLoadUser error:",e);
        setAuthReady(true);
      });
    });
  }

  // ── AUTH STATE ─────────────────────────────────────────────────────────────
  useEffect(function(){
    if(!supabase){setAuthReady(true);return;}

    // Register onAuthStateChange FIRST so it catches the token on OAuth redirect
    var sub=supabase.auth.onAuthStateChange(function(event,session){
      if((event==="SIGNED_IN"||event==="TOKEN_REFRESHED")&&session&&session.user){
        setUserId(session.user.id);
        dbLoadUser(session.user.id);
        setAuthReady(true);
        // Clean up the hash fragment from the URL without triggering a reload
        if(window.location.hash&&window.location.hash.indexOf("access_token")>=0){
          window.history.replaceState(null,"",window.location.pathname);
        }
      }
      if(event==="INITIAL_SESSION"){
        if(session&&session.user){
          setUserId(session.user.id);
          dbLoadUser(session.user.id);
        }
        setAuthReady(true);
      }
      if(event==="SIGNED_OUT"){
        setUserId(null);
        setOnboarded(false);
        setIsNewUser(false);
        setInventory([]);
        setBalance(0);
        setAuthReady(true);
      }
    });

    // Safety net — if onAuthStateChange never fires, unblock the app after 3s
    var fallback=setTimeout(function(){setAuthReady(true);},3000);

    return function(){
      clearTimeout(fallback);
      if(sub&&sub.data&&sub.data.subscription) sub.data.subscription.unsubscribe();
    };
  },[]);

  function saveProfileAndState(updated) {
    setProfile(updated);
    saveProfile(updated);
    var uid=userId;
    if(!uid&&supabase){
      supabase.auth.getSession().then(function(res){
        var session=res&&res.data&&res.data.session;
        var freshUid=session&&session.user&&session.user.id;
        if(freshUid){setUserId(freshUid);dbSaveProfile(freshUid,{username:updated.username,avatar_color:updated.avatarColor,avatar_initials:updated.avatarInitials,bio:updated.bio,fav_sport:updated.favSport,fav_team:updated.favTeam,pinned_ids:updated.pinnedIds,packs_opened:updated.packsOpened});}
      });
    } else if(uid){
      dbSaveProfile(uid,{username:updated.username,avatar_color:updated.avatarColor,avatar_initials:updated.avatarInitials,bio:updated.bio,fav_sport:updated.favSport,fav_team:updated.favTeam,pinned_ids:updated.pinnedIds,packs_opened:updated.packsOpened});
    }
  }

  function addXp(amount) {
    setXp(function(prev){
      var next=prev+(amount||0);
      var prevLv=xpToLevel(prev);
      var nextLv=xpToLevel(next);
      if(nextLv>prevLv&&nextLv<=30){
        var reward=DYNASTY_TRACK.find(function(n){return n.level===nextLv;});
        if(reward) setLevelUpReward(reward);
      }
      if(userId) dbSaveProfile(userId,{xp:next});
      return next;
    });
  }

  function handleLogout() {
    if (supabase) {
      supabase.auth.signOut().then(function() {
        // onAuthStateChange SIGNED_OUT will handle state reset
      });
    } else {
      setUserId(null);
      setOnboarded(false);
      setIsNewUser(false);
      setInventory([]);
      setBalance(0);
      setXp(0);
      setClaimedLevels([]);
      setTab("shop");
    }
  }

  function handleClaimPathReward(node) {
    var already=claimedLevels.includes(node.level);
    if(already) return;
    var newClaimed=claimedLevels.concat([node.level]);
    setClaimedLevels(newClaimed);
    if(userId) dbSaveProfile(userId,{claimed_levels:JSON.stringify(newClaimed)});
    if(node.type==="coins"){
      setBalance(function(b){ var nb=b+node.value; if(userId) dbSaveProfile(userId,{coins:nb}); return nb; });
      pushNotif("Dynasty Path","+"+(node.value)+" coins claimed!","sale");
    } else if(node.type==="pack"){
      pushNotif("Dynasty Path","Free "+node.label+" added to inventory!","sale");
    } else if(node.type==="grade"){
      pushNotif("Dynasty Path",node.value+"× free grading voucher earned!","sale");
    } else if(node.type==="badge"){
      pushNotif("Dynasty Path",node.label+" badge unlocked!","sale");
    }
    setLevelUpReward(null);
  }
  var listingsState=useState([]); var listings=listingsState[0]; var setListings=listingsState[1];
  var myListingsState=useState([]); var myListings=myListingsState[0]; var setMyListings=myListingsState[1];
  var grailFeedState=useState([]); var grailFeed=grailFeedState[0]; var setGrailFeed=grailFeedState[1];
  var lastRefreshState=useState(Date.now()); var lastRefresh=lastRefreshState[0]; var setLastRefresh=lastRefreshState[1];
  var listModalState=useState(null); var listModal=listModalState[0]; var setListModal=listModalState[1];
  var notifsState=useState([]); var notifs=notifsState[0]; var setNotifs=notifsState[1];
  var socialVaultState=useState(null); var socialVault=socialVaultState[0]; var setSocialVault=socialVaultState[1];
  var loginModalState=useState(false); var showLoginModal=loginModalState[0]; var setShowLoginModal=loginModalState[1];
  var howToPlayState=useState(false); var showHowToPlay=howToPlayState[0]; var setShowHowToPlay=howToPlayState[1];
  var streakDataState=useState(function(){var s=loadStreak();return {currentStreak:s.currentStreak||1,lastLoginDate:s.lastLoginDate||null,claimedDays:s.claimedDays||[]};});
  var streakData=streakDataState[0]; var setStreakData=streakDataState[1];
  var shakeTeamsState=useState({}); var shakeTeams=shakeTeamsState[0]; var setShakeTeams=shakeTeamsState[1];
  var inventoryRef=useRef(inventory);
  var claimedBadgesState=useState(function(){try{return JSON.parse(localStorage.getItem("cd_badges")||"[]");}catch(e){return [];}});
  var claimedBadges=claimedBadgesState[0]; var setClaimedBadges=claimedBadgesState[1];
  var globalRankState=useState(null); var globalRank=globalRankState[0]; var setGlobalRank=globalRankState[1];
  // Load real global rank from Supabase — uses both user_cards yield and profiles.coins as fallback
  useEffect(function(){
    if(!supabase||!userId) return;
    var myYield=inventory.reduce(function(s,c){return s+c.daily;},0);
    Promise.all([
      supabase.from("user_cards").select("user_id,daily"),
      supabase.from("profiles").select("id,coins"),
    ]).then(function(results){
      var cardRes=results[0]; var profRes=results[1];
      var userYields={};
      if(cardRes.data) cardRes.data.forEach(function(r){userYields[r.user_id]=(userYields[r.user_id]||0)+(r.daily||0);});
      // Include all profiles — use daily yield if available, coins/100 as tiebreaker for users with no cards
      if(profRes.data) profRes.data.forEach(function(p){
        if(userYields[p.id]===undefined && (p.coins||0)>0){
          userYields[p.id]=(p.coins||0)/100;
        }
      });
      var yields=Object.values(userYields).sort(function(a,b){return b-a;});
      var rank=yields.findIndex(function(y){return y<=myYield;})+1;
      setGlobalRank(rank||yields.length+1);
    });
  },[userId,inventory.length]);
  var pendingPrefsRef=useRef(null);
  useEffect(function(){ inventoryRef.current=inventory; }, [inventory]);
  var showOnboarding=(!onboarded&&inventory.length===0)||isNewUser;
  function triggerShake(team) {
    setShakeTeams(function(prev){
      var n=Object.assign({},prev);
      n[team]=Date.now();
      return n;
    });
    setTimeout(function(){
      setShakeTeams(function(prev){
        var n=Object.assign({},prev);
        delete n[team];
        return n;
      });
    }, 650);
  }
  function handleBigPlay(team, play) {
    var inv=inventoryRef.current;
    var owned=inv.some(function(c){ return c.team===team; });
    if(!owned) return;
    pushNotif(play, team+" just scored!", "sale");
    triggerShake(team);
  }
  function handleGameEnd(winner, homeScore, awayScore, game) {
    var inv=inventoryRef.current;
    var winCard=inv.find(function(c){ return c.team===winner; });
    if(!winCard) return;
    var multiplier=1;
    if(oracle.liveTeams.has(winner)) multiplier=1.5;
    var bonus=Math.round(winCard.win*multiplier);
    setBalance(function(b){ return b+bonus; });
    var label=multiplier>1?" (1.5x LIVE BONUS)":"";
    pushNotif("VICTORY! 🏆", winner+" won! +"+fmt(bonus)+" coins"+label, "sale");
    triggerShake(winner);
  }
  var oracle=useLiveOracle(handleBigPlay, handleGameEnd);
  var liveTeams=oracle.liveTeams;
  var preTeams=oracle.preTeams;
  var redZoneTeams=oracle.redZoneTeams;
  var highlightState=useState(null); var highlightedTeam=highlightState[0]; var setHighlightedTeam=highlightState[1];
  function handleOracleClick(team) {
    setHighlightedTeam(team);
    setTab("inventory");
    setInvSubTab("cards");
    setTimeout(function(){setHighlightedTeam(null);}, 2200);
  }
  useEffect(function(){
    var s=loadStreak();
    var today=new Date().toDateString();
    // Only show daily login modal for returning users who have played before
    // New users (lastLoginDate===null) just completed onboarding — skip it
    if(s.lastLoginDate&&s.lastLoginDate!==today){
      setTimeout(function(){setShowLoginModal(true);},800);
    }
  },[]);
  function pushNotif(title,msg,type){
    var t=type||"info";
    var id=genId();
    setNotifs(function(p){return p.slice(-2).concat([{id:id,title:title,msg:msg,type:t}]);});
    setTimeout(function(){setNotifs(function(p){return p.filter(function(n){return n.id!==id;});});},4200);
  }
  // Achievement unlock detection — fires whenever inventory, balance, or packs change
  useEffect(function(){
    if(!onboarded) return;
    var gradedCount=inventory.filter(function(c){return c.graded;}).length;
    var gemCount=inventory.filter(function(c){return c.grade===10;}).length;
    var legendaryCount=inventory.filter(function(c){return c.rarity==="Legendary"||c.rarity==="Dynasty";}).length;
    var dailyYield=inventory.reduce(function(s,c){return s+c.daily;},0);
    var completedSets=Object.keys(DIVISIONS).filter(function(div){var info=DIVISIONS[div];var owned=new Set(inventory.filter(function(c){return c.sport===info.sport;}).map(function(c){return c.team;}));return info.teams.every(function(t){return owned.has(t);});}).length;
    var checks=[
      {id:"first_blood",    reward:100,  met:packsOpened>=1},
      {id:"pack_addict",   reward:500,  met:packsOpened>=25},
      {id:"pack_hoarder",  reward:2000, met:packsOpened>=100},
      {id:"division_master",reward:1000,met:completedSets>=1},
      {id:"whale",         reward:5000, met:balance>=1000000},
      {id:"first_rare",    reward:150,  met:inventory.some(function(c){return c.rarity==="Rare";})},
      {id:"first_elite",   reward:300,  met:inventory.some(function(c){return c.rarity==="Elite";})},
      {id:"first_legacy",  reward:750,  met:inventory.some(function(c){return c.rarity==="Legacy";})},
      {id:"first_legendary",reward:1500,met:inventory.some(function(c){return c.rarity==="Legendary";})},
      {id:"dynasty_puller",reward:5000, met:inventory.some(function(c){return c.rarity==="Dynasty";})},
      {id:"the_closer",    reward:3000, met:legendaryCount>=10},
      {id:"first_slab",    reward:200,  met:gradedCount>=1},
      {id:"gem_hunter",    reward:2500, met:gemCount>=1},
      {id:"slab_master",   reward:1000, met:gradedCount>=10},
      {id:"live_buzz",     reward:250,  met:inventory.some(function(c){return liveTeams&&liveTeams.has&&liveTeams.has(c.team);})},
      {id:"yield_king",    reward:1000, met:dailyYield>=1000},
    ];
    var newlyUnlocked=checks.filter(function(c){return c.met&&!claimedBadges.includes(c.id);});
    if(!newlyUnlocked.length) return;
    var totalReward=newlyUnlocked.reduce(function(s,c){return s+c.reward;},0);
    var newClaimed=claimedBadges.concat(newlyUnlocked.map(function(c){return c.id;}));
    setClaimedBadges(newClaimed);
    try{localStorage.setItem("cd_badges",JSON.stringify(newClaimed));}catch(e){}
    setBalance(function(prev){
      var newBal=prev+totalReward;
      if(userId) dbSaveProfile(userId,{coins:newBal});
      return newBal;
    });
    newlyUnlocked.forEach(function(badge){
      pushNotif("Achievement Unlocked!",badge.id.replace(/_/g," ").replace(/\b\w/g,function(l){return l.toUpperCase();})+" · +"+fmt(badge.reward)+" coins","sale");
    });
  },[inventory.length,packsOpened,onboarded]);

  function handleGradeCard(card,gradeTier){
    // Deduct cost and update card with grade data
    var newBal=balance-500;
    setBalance(function(b){return b-500;});
    // Update the card in inventory — mark as graded, apply multiplier
    var newInv=inventory.map(function(c){
      if(c.id!==card.id) return c;
      return Object.assign({},c,{
        graded:true,
        grade:gradeTier.grade,
        gradeLabel:gradeTier.label,
        gradeTier:gradeTier.tier,
        gradeMultiplier:gradeTier.multiplier,
        daily:Math.round(c.daily*gradeTier.multiplier),
        win:Math.round(c.win*gradeTier.multiplier),
        mp:Math.round(c.mp*gradeTier.multiplier),
      });
    });
    setInventory(function(){return newInv;});
    var uid=userId;
    if(supabase&&uid){
      dbSaveProfile(uid,{coins:newBal});
      dbSaveCards(uid,newInv);
    }
    var msg=gradeTier.multiplier>1?"Grade "+gradeTier.grade+" — "+gradeTier.multiplier+"× yield boost applied!":"Grade "+gradeTier.grade+" — "+gradeTier.label;
    pushNotif("Card Graded!",msg,gradeTier.tier==="gem"?"sale":"info");
    if(gradeTier.grade===10) playRevealShimmer();
    addXp(300);
  }
  function completeOnboarding(cards,coins){
    // Check for ?ref= referral code in URL
    var refCode = null;
    try {
      var urlParams = new URLSearchParams(window.location.search);
      refCode = urlParams.get("ref");
      // Clean it from the URL
      if (refCode) window.history.replaceState(null,"",window.location.pathname);
    } catch(e) {}

    var bonusCoins = refCode ? 1000 : 0;
    var finalCoins = coins + bonusCoins;
    var genesisCards = cards; // 5 cards already included in starter pack
    setInventory(genesisCards);
    setBalance(finalCoins);
    setOnboarded(true);
    setIsNewUser(false);
    setTab("shop");
    if (refCode) {
      pushNotif("Referral Bonus! 🎁", "+1,000 bonus coins from referral code "+refCode, "sale");
    }
    setTimeout(function(){setShowHowToPlay(true);},600);
    var prefs=pendingPrefsRef.current||loadProfile();
    var profileData={
      coins:finalCoins,
      packs_opened:0,
      username:prefs.username||"Dynasty Rookie",
      avatar_color:prefs.avatarColor||"#f5c518",
      avatar_initials:prefs.avatarInitials||"ME",
      fav_sport:prefs.favSport||"",
      fav_team:prefs.favTeam||"",
      referred_by:refCode||null,
    };
    var uid=userId;
    function saveAndRewardReferrer(freshUid) {
      dbSaveProfile(freshUid, profileData);
      dbSaveCards(freshUid, genesisCards);
      // If referred, look up the referrer and credit them
      if (refCode && supabase) {
        supabase.from("profiles").select("id,coins,xp,referral_count").filter("id","neq",freshUid)
          .then(function(res) {
            if (!res.data) return;
            // Find referrer whose makeReferralCode matches refCode
            var referrer = res.data.find(function(p) {
              return makeReferralCode(p.id, "") === refCode;
            });
            if (!referrer) return;
            // Guard: make sure this new user hasn't already credited this referrer
            supabase.from("profiles").select("referred_by").eq("id",freshUid).maybeSingle()
              .then(function(check) {
                var alreadyUsed = check&&check.data&&check.data.referred_by;
                if (alreadyUsed) return;
                var newRefCoins = (referrer.coins||0) + 500;
                var newRefXp = (referrer.xp||0) + 100;
                var newRefCount = (referrer.referral_count||0) + 1;
                supabase.from("profiles").update({
                  coins: newRefCoins, xp: newRefXp, referral_count: newRefCount
                }).eq("id", referrer.id).then(function(){});
              });
          });
      }
    }
    if(!uid&&supabase){
      supabase.auth.getSession().then(function(res){
        var session=res&&res.data&&res.data.session;
        var freshUid=session&&session.user&&session.user.id;
        if(freshUid){ setUserId(freshUid); saveAndRewardReferrer(freshUid); }
      });
    } else if(uid){
      saveAndRewardReferrer(uid);
    }
    pendingPrefsRef.current=null;
  }

  function handleClaim(reward){
    var today=new Date().toDateString();
    // Guard: if already claimed today, don't reset streak
    if(streakData.claimedDays&&streakData.claimedDays.includes(today)) return;
    var yesterday=new Date(Date.now()-86400000).toDateString();
    var wasYesterday=streakData.lastLoginDate===yesterday;
    var newStreak=wasYesterday||!streakData.lastLoginDate?streakData.currentStreak+1:1;
    var capped=Math.min(newStreak,7);
    var next={currentStreak:newStreak>7?1:capped,lastLoginDate:today,claimedDays:(streakData.claimedDays||[]).concat([today])};
    setStreakData(next);
    saveStreak(next);
    var newBalance=balance;
    if(reward.coins>0){newBalance=balance+reward.coins;setBalance(function(b){return b+reward.coins;});}
    var newCards=inventory.slice();
    if(reward.pack==="standard"){var c1=buildPack(PACK_TYPES[0],false);setInventory(function(inv){newCards=c1.concat(inv);return newCards;});pushNotif("Daily Pack!","Standard Pro Case added","info");}
    if(reward.pack==="jumbo"){var c2=buildPack(PACK_TYPES[1],false);setInventory(function(inv){newCards=c2.concat(inv);return newCards;});pushNotif("Daily Pack!","Division Jumbo added","info");}
    if(reward.pack==="elite"){var ec=genCard({Elite:60,Legacy:25,Legendary:14,Dynasty:1},null,null);setInventory(function(inv){newCards=[ec].concat(inv);return newCards;});pushNotif("Elite Pull!","Guaranteed Elite+ card added","sale");}
    if(reward.coins>0)pushNotif("Streak Bonus!","+"+fmt(reward.coins)+" coins claimed","sale");
    addXp(150);
    if(userId){
      dbSaveProfile(userId,{coins:newBalance});
      if(newCards!==inventory) dbSaveCards(userId,newCards);
    }
  }

  // ── MARKETPLACE ────────────────────────────────────────────────────────────
  function loadMarketListings() {
    if(!supabase) return;
    supabase.from("marketplace_listings").select("*").order("created_at",{ascending:false}).limit(20)
      .then(function(res){
        if(res.error){console.error("loadMarketListings error:",res.error);return;}
        var rows=res.data||[];
        var parsed=rows.map(function(r){
          var card=null;
          try{card=typeof r.card_data==="string"?JSON.parse(r.card_data):r.card_data;}catch(e){card=null;}
          if(!card) return null;
          return {id:r.id,card:card,price:r.price,seller:r.seller_name||"Collector",trend:Math.random()>0.5?"up":"down",trendPct:rand(1,18),listedAt:new Date(r.created_at).getTime(),sellerId:r.seller_id};
        }).filter(Boolean);
        setListings(parsed);
        setLastRefresh(Date.now());
        // Update grail feed with top rarity listings
        var grails=parsed.filter(function(l){return ["Legacy","Legendary","Dynasty"].includes(l.card.rarity);}).slice(0,3)
          .map(function(l){return {card:l.card,msg:l.seller+" listed a "+l.card.rarity+" "+l.card.team+" for "+fmt(l.price)+" coins"};});
        if(grails.length) setGrailFeed(grails);
      });
  }

  function buyFromMarket(listing){
    if(balance<listing.price) return;
    if(!supabase){
      // No backend — local only fallback
      var newBal=balance-listing.price;
      setBalance(function(b){return b-listing.price;});
      var newInv=[listing.card].concat(inventory);
      setInventory(function(){return newInv;});
      setListings(function(p){return p.filter(function(l){return l.id!==listing.id;});});
      pushNotif("Purchased!","You bought "+listing.card.team+" "+listing.card.rarity+" for "+fmt(listing.price)+" coins","buy");
      return;
    }
    var newBal=balance-listing.price;
    setBalance(function(b){return b-listing.price;});
    var newInv=[listing.card].concat(inventory);
    setInventory(function(){return newInv;});
    setListings(function(p){return p.filter(function(l){return l.id!==listing.id;});});
    pushNotif("Purchased!","You bought "+listing.card.team+" "+listing.card.rarity+" for "+fmt(listing.price)+" coins","buy");
    addXp(50);
    if(["Legacy","Legendary","Dynasty"].includes(listing.card.rarity))
      setGrailFeed(function(p){return [{card:listing.card,msg:"You sniped a "+listing.card.rarity+" "+listing.card.team+" for "+fmt(listing.price)+" coins"}].concat(p).slice(0,3);});
    // Remove the listing from DB and credit the seller
    supabase.from("marketplace_listings").delete().eq("id",listing.id)
      .then(function(){
        // Credit seller — update their coins
        if(listing.sellerId){
          supabase.from("profiles").select("coins").eq("id",listing.sellerId).maybeSingle()
            .then(function(res){
              var sellerCoins=(res&&res.data&&res.data.coins)||0;
              supabase.from("profiles").update({coins:sellerCoins+listing.price}).eq("id",listing.sellerId);
            });
        }
        // Save buyer's new inventory and balance
        var uid=userId;
        if(uid){dbSaveCards(uid,newInv);dbSaveProfile(uid,{coins:newBal});}
      });
  }

  function listCard(card,price){
    var newInv=inventory.filter(function(c){return c.id!==card.id;});
    setInventory(function(){return newInv;});
    setListModal(null);
    pushNotif("Listed!",card.team+" "+card.rarity+" listed for "+fmt(price)+" coins","info");
    addXp(25);
    var uid=userId;
    var sellerName=(profile&&profile.username)||"Collector";
    if(supabase&&uid){
      // Save to marketplace_listings table
      var cardData=JSON.stringify({id:card.id,sport:card.sport,team:card.team,rarity:card.rarity,daily:card.daily,win:card.win,mp:card.mp});
      supabase.from("marketplace_listings").insert({seller_id:uid,seller_name:sellerName,card_data:cardData,price:price,created_at:new Date().toISOString()})
        .then(function(res){
          if(res.error){console.error("listCard error:",res.error);}
          else{
            loadMarketListings(); // Refresh listings for everyone
            // Track as my listing for sold notification
            setMyListings(function(p){return p.concat([{id:res.data&&res.data[0]&&res.data[0].id,card:card,price:price,listedAt:Date.now()}]);});
          }
        });
      dbSaveCards(uid,newInv);
    } else {
      // No backend fallback
      setMyListings(function(p){return p.concat([{id:genId(),card:card,price:price,listedAt:Date.now(),seller:sellerName}]);});
      dbSaveCards(uid||"",newInv);
    }
  }

  function rotateMkt(){
    loadMarketListings();
  }

  // Load marketplace on mount and every 60s
  useEffect(function(){
    loadMarketListings();
    var t=setInterval(loadMarketListings,60000);
    return function(){clearInterval(t);};
  },[]);

  function buyPack(pt){
    if(balance<pt.cost)return;
    if(inventory.length>COLLECTION_CAP){
      pushNotif("Collection Full","Sell or grade cards before opening more packs. Limit: "+COLLECTION_CAP,"info");
      return;
    }
    var newBal=balance-pt.cost;
    setBalance(function(b){return b-pt.cost;});
    var pa=pt.id==="standard"&&pity>=10;
    var cards=buildPack(pt,pa);
    // ── Try Radioactive roll on every pack open ────────────────────────────────
    function finishBuy(radCard){
      if(radCard){
        // Insert one slot replacing the lowest rarity card
        var lowest=cards.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);})[cards.length-1];
        var idx=cards.indexOf(lowest);
        if(idx>=0) cards[idx]=radCard; else cards.push(radCard);
        // Log to Supabase radioactive_cards table
        if(supabase&&userId){
          supabase.from("radioactive_cards").insert({
            serial_number:radCard.serialNumber,
            card_id:radCard.id,
            user_id:userId,
            team:radCard.team,
            sport:radCard.sport,
          }).then(function(){});
        }
        pushNotif("☢️ RADIOACTIVE PULL!","#"+radCard.serialNumber+" / 10 worldwide - you found one!","sale");
      }
      var hasElite=cards.some(function(c){return ["Elite","Legacy","Legendary","Dynasty","Radioactive"].includes(c.rarity);});
      if(pt.id==="standard")setPity(hasElite?0:function(p){return p+1;});
      setOpening({pack:pt,cards:cards});
      setTab("opening");
      var nextPacks=packsOpened+1;
      setPacksOpened(nextPacks);
      saveProfile(Object.assign({},loadProfile(),{packsOpened:nextPacks}));
      if(userId) dbSaveProfile(userId,{coins:newBal,packs_opened:nextPacks});
      if(pt.sovereign&&supabase&&userId){
        var topCard=cards.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);})[0];
        supabase.from("activity_log").insert({
          user_id:userId,username:profile.username||"Collector",
          avatar_initials:profile.avatarInitials||"??",avatar_color:profile.avatarColor||"#f5c518",
          event_type:"sovereign_pull",pack_id:pt.id,pack_name:pt.name,
          top_card_rarity:topCard?topCard.rarity:null,top_card_team:topCard?topCard.team:null,
          coins_spent:pt.cost,created_at:new Date().toISOString(),
        }).then(function(){});
      }
    }
    // Check global Radioactive count from Supabase
    if(supabase){
      supabase.from("radioactive_cards").select("serial_number",{count:"exact"}).then(function(res){
        var count=(res&&res.count)||(_radioactiveCount||0);
        _radioactiveCount=count;
        var radCard=tryRollRadioactive(count);
        finishBuy(radCard);
      }).catch(function(){finishBuy(null);});
    } else {
      finishBuy(tryRollRadioactive(_radioactiveCount||0));
    }
  }

  function finishOpening(){
    var combined=opening?opening.cards.concat(inventory):inventory;
    var newInv=trimToLimit(combined);
    var trimmed=combined.length-newInv.length;
    if(opening) setInventory(function(){return newInv;});
    setOpening(null);setTab("inventory");setInvSubTab("cards");
    if(opening) addXp((opening.cards||[]).length*100);
    if(trimmed>0) pushNotif("Collection Cap",""+trimmed+" low-rarity cards removed — collection limit is "+COLLECTION_CAP,"info");
    if(!dbLoaded) return;
    var uid=userId;
    if(!uid&&supabase){
      supabase.auth.getSession().then(function(res){
        var session=res&&res.data&&res.data.session;
        var freshUid=session&&session.user&&session.user.id;
        if(freshUid){setUserId(freshUid);dbSaveCards(freshUid,newInv);}
      });
    } else if(uid){
      dbSaveCards(uid,newInv);
    }
  }

  function simGameDay(){
    if(inventory.length===0) return;
    var today=new Date().toDateString();
    if(lastGameDay===today) return; // already collected today
    var all=Object.values(ALL_TEAMS).reduce(function(a,b){return a.concat(b);},[]);
    var shuffled=all.slice().sort(function(){return Math.random()-0.5;});
    var w=new Set(shuffled.slice(0,Math.floor(shuffled.length*0.5)));
    var baseTotal=inventory.reduce(function(s,c){return s+c.daily;},0);
    var winTotal=inventory.filter(function(c){return w.has(c.team);}).reduce(function(s,c){
      var mult=liveTeams.has(c.team)?1.5:1;
      if(c.sport==="College"&&SEASON_CALENDAR.College.isFinalFour) mult=mult*2;
      return s+Math.round(c.win*mult);
    },0);
    setWinners(w);
    setGdResult({winners:w,baseTotal:baseTotal,winTotal:winTotal,grandTotal:baseTotal+winTotal,hasLiveBonus:inventory.some(function(c){return w.has(c.team)&&liveTeams.has(c.team);})});
    setShowGD(true);
    // XP: 200 for game day + 10 per winner card
    addXp(200+inventory.filter(function(c){return w.has(c.team);}).length*10);
  }
  var sorted=inventory.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);});
  var counts={};inventory.forEach(function(c){counts[c.rarity]=(counts[c.rarity]||0)+1;});
  var coreTabs=[{id:"live",label:"🔴 Live"},{id:"shop",label:"Shop"},{id:"market",label:"Exchange"},{id:"inventory",label:"Cards ("+inventory.length+")"},{id:"grading",label:"⬡ Slab Lab"},{id:"predict",label:"🎯 Predict"},{id:"highlo",label:"🃏 High/Low"},{id:"path",label:"👑 Season Pass"},{id:"social",label:"Social"},{id:"rankings",label:"Rankings"},{id:"profile",label:"Profile"}];
  if(tab==="opening")coreTabs.splice(2,0,{id:"opening",label:"Opening..."});
  if(!authReady) return (
    <div style={{background:"#fff",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:16}}>CARD <em style={{color:"#e8161e",fontStyle:"normal"}}>DYNASTY</em></div>
        <div style={{width:32,height:32,border:"3px solid #e0ddd8",borderTop:"3px solid #e8161e",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
      </div>
    </div>
  );

  if(showOnboarding) return (
    <div style={{background:"#f0ede8",minHeight:"100vh"}}>
      <style>{CSS}</style>
      <Onboarding onComplete={completeOnboarding} isNewUser={isNewUser} userId={userId} onSavePrefs={function(prefs){
        if(!prefs) return;
        var updated=loadProfile();
        if(prefs.username) updated.username=prefs.username;
        if(prefs.favSport) updated.favSport=prefs.favSport;
        if(prefs.favTeam) updated.favTeam=prefs.favTeam;
        if(prefs.username) updated.avatarInitials=prefs.username.slice(0,2).toUpperCase();
        saveProfileAndState(updated);
        // Also store prefs in a ref so completeOnboarding can merge them
        pendingPrefsRef.current=updated;
      }}/>
    </div>
  );
  return (
    <div style={{background:"#f0ede8",minHeight:"100vh",color:"#111",fontFamily:"'Barlow',sans-serif"}}>
      <style>{CSS}</style>
      <Notifications notifs={notifs}/>
      {levelUpReward&&<LevelUpModal reward={levelUpReward} onClose={function(){setLevelUpReward(null);}}/>}
      {showReferral&&<ReferralHub userId={userId} username={profile.username} referralCount={referralCount} onClose={function(){setShowReferral(false);}} onCopyNotif={function(t,m,type){pushNotif(t,m,type);}}/>}
      {showLoginModal&&<DailyLoginModal streakData={streakData} onClaim={handleClaim} onClose={function(){setShowLoginModal(false);}}/>}
      {listModal&&<ListModal card={listModal} onConfirm={function(p){listCard(listModal,p);}} onClose={function(){setListModal(null);}}/>}
      {/* ── ORACLE TICKER ── */}
      <OracleBar liveGames={oracle.liveGames} onClickTeam={handleOracleClick}/>
      {/* ── APP HEADER — two-row mobile-first layout ── */}
      <div style={{background:"#fff",borderBottom:"3px solid #e8161e",position:"sticky",top:0,zIndex:50}}>
        {/* Row 1: Logo + live badge + coins + avatar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",height:48}}>
          {/* Logo */}
          <div style={{display:"flex",flexDirection:"column",lineHeight:1,flexShrink:0}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#111",lineHeight:1}}>CARD <em style={{color:"#e8161e",fontStyle:"normal"}}>DYNASTY</em></div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:8,letterSpacing:"0.22em",color:"#bbb",textTransform:"uppercase",marginTop:1}}>Official Collector</div>
          </div>
          {/* Right cluster: live pill + coins + avatar */}
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            {liveTeams.size>0&&<span onClick={function(){setTab("live");}}
              style={{display:"flex",alignItems:"center",gap:4,background:"#e8f5ec",border:"1px solid #22cc55",padding:"3px 8px",cursor:"pointer",flexShrink:0}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#22cc55",animation:"pulse 1s ease-in-out infinite"}}/>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,color:"#22aa44",letterSpacing:"0.06em"}}>{liveTeams.size} LIVE</span>
            </span>}
            {/* Coins */}
            <div style={{background:"#111",padding:"4px 10px",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              <div style={{width:7,height:7,background:"#f5c518",clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",flexShrink:0}}/>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:"#f5c518",letterSpacing:"0.04em"}}>{fmt(balance)}</span>
            </div>
            {/* Avatar */}
            <button onClick={function(){setTab("profile");}} title="My Profile"
              style={{width:30,height:30,background:profile.avatarColor||"#e8161e",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,padding:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>{profile.avatarInitials}</span>
            </button>
          </div>
        </div>
        {/* Row 2: Stats + Game Day */}
        <div style={{display:"flex",alignItems:"center",borderTop:"1px solid #f0ede8",padding:"0 12px",height:34,gap:0,overflowX:"auto"}}>
          {/* Streak */}
          <button onClick={function(){setShowLoginModal(true);}}
            style={{display:"flex",alignItems:"center",gap:3,padding:"0 10px 0 0",background:"none",border:"none",borderRight:"1px solid #e8e8e8",cursor:"pointer",height:"100%",flexShrink:0}}>
            <span style={{fontSize:12}}>🔥</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#e8161e"}}>{streakData.currentStreak}d</span>
          </button>
          {/* Rank */}
          <div onClick={function(){setTab("rankings");}}
            style={{display:"flex",alignItems:"center",gap:3,padding:"0 10px",borderRight:"1px solid #e8e8e8",cursor:"pointer",height:"100%",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em"}}>RANK</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#111"}}>{"#"+(globalRank||"—")}</span>
          </div>
          {/* Yield */}
          <div onClick={function(){setTab("inventory");}}
            style={{display:"flex",alignItems:"center",gap:3,padding:"0 10px",borderRight:"1px solid #e8e8e8",cursor:"pointer",height:"100%",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em"}}>YIELD</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#22aa44"}}>{fmt(inventory.reduce(function(s,c){return s+c.daily;},0))}/d</span>
          </div>
          {/* Power */}
          <div onClick={function(){setTab("profile");}}
            style={{display:"flex",alignItems:"center",gap:3,padding:"0 10px",borderRight:"1px solid #e8e8e8",cursor:"pointer",height:"100%",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em"}}>PWR</span>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:12,fontWeight:700,color:"#7733cc"}}>{inventory.length*10+inventory.filter(function(c){return ["Legacy","Legendary","Dynasty"].includes(c.rarity);}).length*50}</span>
          </div>
          {pity>=7&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"#e8161e",fontWeight:700,padding:"0 10px",borderRight:"1px solid #e8e8e8",height:"100%",display:"flex",alignItems:"center",flexShrink:0,letterSpacing:"0.06em"}}>PITY {pity}/10</div>}
          {/* XP bar — clickable, goes to season pass */}
          <div onClick={function(){setTab("path");}} style={{display:"flex",alignItems:"center",gap:5,padding:"0 10px",borderRight:"1px solid #e8e8e8",cursor:"pointer",height:"100%",flexShrink:0}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,color:"#7733cc",textTransform:"uppercase",letterSpacing:"0.06em"}}>LV{xpToLevel(xp)}</span>
            <div style={{width:44,height:5,background:"#e8e8e8",overflow:"hidden",borderRadius:2}}>
              <div style={{height:"100%",width:(levelXpProgress(xp)/10)+"%",background:"linear-gradient(90deg,#7733cc,#cc66ff)",transition:"width 0.8s ease-out",borderRadius:2}}/>
            </div>
            <span style={{fontSize:10}}>👑</span>
          </div>
          {/* Game Day — pushed to right */}
          <div style={{marginLeft:"auto",flexShrink:0}}>
            <button onClick={simGameDay} disabled={!inventory.length||lastGameDay===new Date().toDateString()}
              style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",padding:"5px 12px",border:"none",height:34,cursor:(!inventory.length||lastGameDay===new Date().toDateString())?"not-allowed":"pointer",background:(!inventory.length||lastGameDay===new Date().toDateString())?"#eee":"#e8161e",color:(!inventory.length||lastGameDay===new Date().toDateString())?"#aaa":"#fff",whiteSpace:"nowrap"}}>
              {lastGameDay===new Date().toDateString()?"✓ Done":"⚡ Game Day"}
            </button>
          </div>
        </div>
      </div>
      {/* Game day active banner */}
      {winners&&gdResult&&(
        <div style={{background:"#e8f5ec",borderBottom:"1px solid #c8e8d0",padding:"7px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"#22aa44"}}>Game Day Active</span>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555"}}>{winners.size} winners · Win bonuses: <span style={{color:"#22aa44",fontWeight:700}}>+{fmt(gdResult.winTotal)}</span></span>
          {gdResult.hasLiveBonus&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#22aa44",background:"#c8f0d4",border:"1px solid #22cc55",padding:"2px 8px",letterSpacing:"0.08em"}}>⚡ 1.5× Live Bonus</span>}
          <button onClick={function(){setShowGD(true);}} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#e8161e",background:"none",border:"1px solid rgba(232,22,30,0.3)",padding:"2px 10px",cursor:"pointer",marginLeft:"auto",letterSpacing:"0.08em",textTransform:"uppercase"}}>View Summary</button>
        </div>
      )}
      {/* Game day modal */}
      {showGD&&gdResult&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={function(){setShowGD(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{background:"#fff",maxWidth:320,width:"90%",border:"1px solid #e0ddd8",boxShadow:"0 16px 48px rgba(0,0,0,0.2)"}}>
            <div style={{background:"#e8161e",padding:"16px 20px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,letterSpacing:"0.04em",textTransform:"uppercase",color:"#fff"}}>Game Day Results</div>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:32,fontWeight:700,color:"#111",marginBottom:16,letterSpacing:"-0.02em"}}>+{fmt(gdResult.grandTotal)} <span style={{fontSize:16,color:"#888"}}>coins</span></div>
              <div style={{border:"1px solid #e8e8e8",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#555",letterSpacing:"0.06em",textTransform:"uppercase"}}>Base Daily</span>
                  <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#111"}}>+{fmt(gdResult.baseTotal)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px"}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#555",letterSpacing:"0.06em",textTransform:"uppercase"}}>Win Bonuses</span>
                  <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700,color:"#22aa44"}}>+{fmt(gdResult.winTotal)}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={function(){
                  var newBal=balance+gdResult.grandTotal;
                  setBalance(function(b){return b+gdResult.grandTotal;});
                  var today=new Date().toDateString();
                  setLastGameDay(today);
                  try{localStorage.setItem("cd_lastgameday",today);}catch(e){}
                  setShowGD(false);setWinners(null);setGdResult(null);
                  if(userId)dbSaveProfile(userId,{coins:newBal});
                }} className="topps-btn-primary" style={{flex:2,fontSize:14,padding:"12px",clipPath:"none",borderRadius:0}}>Collect</button>
                <button onClick={function(){setShowGD(false);}} style={{flex:1,background:"#f0ede8",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,padding:"12px",border:"1px solid #ddd",cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── TAB BAR ── */}
      <div style={{background:"#fff",borderBottom:"1px solid #e0ddd8",display:"flex",overflowX:"auto",position:"sticky",top:82,zIndex:40,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
        {coreTabs.map(function(t){
          return <button key={t.id} className={"tab-btn"+(tab===t.id?" on":"")} onClick={function(){setTab(t.id);}}>{t.label}</button>;
        })}
      </div>
      <div>
        {tab==="live"&&<div>
          <div style={{padding:"12px 16px 0",maxWidth:760,margin:"0 auto"}}>
            <ContextTip id="live_tip" icon="🔴" color="#e8161e" tip="When your team plays live, your cards earn 1.5× yield automatically. Check this tab during game time — Red Zone events give even bigger boosts."/>
          </div>
          <LiveGamesTab liveGames={oracle.liveGames} inventory={inventory} forceStartAll={oracle.forceStartAll} resetGames={oracle.resetGames} forced={oracle.forced} redZoneTeams={redZoneTeams} espnOk={oracle.espnOk} loading={oracle.loading}/>
        </div>}
        {tab==="shop"&&<div>
          <div style={{padding:"12px 20px 0",maxWidth:960,margin:"0 auto"}}>
            <ContextTip id="shop_tip" icon="📦" color="#1144cc" tip={"Each pack you open earns 100 XP per card. A Hobby Box (60 cards) = 6,000 XP instantly. You're Level "+xpToLevel(xp)+" — need "+(1000-levelXpProgress(xp))+" more XP to reach Level "+(xpToLevel(xp)+1)+". Higher rarity packs also mean better long-term daily yield."}/>
          </div>
          <Shop balance={balance} onBuy={buyPack} pityCount={pity} cardCount={inventory.length}/>
        </div>}
        {tab==="opening"&&opening&&<OpeningScreen pack={opening.pack} cards={opening.cards} onDone={finishOpening} winners={winners}/>}
        {tab==="market"&&<div>
          <div style={{padding:"12px 20px 0",maxWidth:900,margin:"0 auto"}}>
            <ContextTip id="market_tip" icon="🏪" color="#22aa55" tip="Every buy on the Exchange earns +50 XP. Listing a card earns +25 XP even if it doesn't sell. Buying higher-rarity cards improves your daily yield and Power score."/>
          </div>
          <Marketplace balance={balance} onBuy={buyFromMarket} listings={listings} myListings={myListings} grailFeed={grailFeed} onRefresh={rotateMkt} lastRefresh={lastRefresh} shakeTeams={shakeTeams}/>
        </div>}
        {tab==="grading"&&<div>
          <div style={{padding:"12px 20px 0",maxWidth:760,margin:"0 auto"}}>
            <ContextTip id="grade_tip" icon="🔬" color="#7733cc" tip="Grading a card earns +300 XP and permanently boosts its daily yield. A Gem Mint (10) gives 3× yield. Grade your highest-rarity cards first for the biggest return on investment."/>
          </div>
          <GradingLab inventory={inventory} balance={balance} userId={userId} onGrade={handleGradeCard} onBack={function(){setTab("inventory");}}/>
        </div>}
        {tab==="predict"&&<PlayoffPredictor
          userId={userId}
          balance={balance}
          onAddXp={addXp}
          onBalChange={setBalance}
          onNotif={function(t,m,type){pushNotif(t,m,type);}}
          dbSave={dbSaveProfile}/>}
        {tab==="highlo"&&<div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{padding:"12px 16px 0"}}>
            <ContextTip id="highlo_tip" icon="🃏" color="#7733cc" tip={"Bet "+HIGHLO_WAGER+" coins per round. Guess if the next card's daily yield is higher or lower. Every correct guess doubles the pot. Cash out before you miss!"+( isGameNightBonus()?" 🏒 Game Night Bonus is LIVE — payouts doubled tonight!":"")}/>
          </div>
          <HighLoGame balance={balance} onBalanceChange={setBalance}
            userId={userId} onAddXp={addXp}
            onNotif={function(t,m,type){pushNotif(t,m,type);}}
            dbSave={dbSaveProfile}/>
        </div>}
        {tab==="path"&&<SeasonPassPage xp={xp} claimedLevels={claimedLevels} onClaim={handleClaimPathReward}/>}
        {tab==="social"&&<div>
          <div style={{padding:"12px 20px 0",maxWidth:760,margin:"0 auto"}}>
            <ContextTip id="social_tip" icon="👥" color="#888" tip="Browse other collectors' vaults to see what Dynasty and Legendary cards look like. Public vaults also show up on the leaderboard — build yours on the Profile tab."/>
          </div>
          <Social inventory={inventory} initialVault={socialVault} onClearVault={function(){setSocialVault(null);}} shakeTeams={shakeTeams}/>
        </div>}
        {tab==="rankings"&&<div>
          <div style={{padding:"12px 20px 0",maxWidth:760,margin:"0 auto"}}>
            <ContextTip id="rank_tip" icon="📈" color="#c8a800" tip="Your rank is based on total daily yield from all your cards. Grading cards and pulling higher rarities from packs are the fastest ways to climb. Check the Dynasty Path — some rewards directly boost your yield."/>
          </div>
          <Leaderboard inventory={inventory} balance={balance} profile={profile} onViewVault={function(name){setSocialVault(name);setTab("social");}}/>
        </div>}
        {tab==="profile"&&<ProfileView inventory={inventory} balance={balance} streakData={streakData} profile={profile} packsOpened={packsOpened} liveTeams={liveTeams} onSaveProfile={saveProfileAndState} onBack={function(){setTab("inventory");}} xp={xp} claimedLevels={claimedLevels} onClaimPathReward={handleClaimPathReward} userId={userId} referralCount={referralCount} onRecruit={function(){setShowReferral(true);}} onLogout={handleLogout}/>}
        {tab==="inventory"&&(
          <div style={{padding:"16px 20px 80px",maxWidth:760,margin:"0 auto"}}>
            {/* Sub-tabs */}
            <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:"2px solid #e0ddd8"}}>
              {["cards","sets"].map(function(s){
                var active=invSubTab===s;
                return <button key={s} onClick={function(){setInvSubTab(s);}}
                  style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"8px 20px",background:"none",border:"none",borderBottom:"3px solid "+(active?"#e8161e":"transparent"),color:active?"#e8161e":"#888",cursor:"pointer",marginBottom:-2}}>
                  {s==="cards"?"My Cards":"Set Progress"}
                </button>;
              })}
            </div>
            {invSubTab==="cards"&&(
              inventory.length===0
                ?<div style={{textAlign:"center",padding:60,background:"#fff",border:"1px solid #e0ddd8"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase",color:"#111",marginBottom:6}}>No Cards Yet</div>
                  <div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#888"}}>Open a pack to start your collection</div>
                </div>
                :<div>
                  {/* Rarity filter chips */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                    {ORDER.filter(function(r){return counts[r];}).map(function(r){
                      return <span key={r} className="topps-rarity-pill" style={{borderColor:RCOLORS[r]||"#aaa",color:RCOLORS[r]||"#aaa",background:(RCOLORS[r]||"#aaa")+"11"}}>
                        {r} <span style={{fontFamily:"'Roboto Mono',monospace",fontWeight:700}}>×{counts[r]}</span>
                      </span>;
                    })}
                    {winners&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,padding:"4px 12px",border:"1px solid #c8e8d0",background:"#e8f5ec",color:"#22aa44",letterSpacing:"0.08em",textTransform:"uppercase"}}>Winners: {inventory.filter(function(c){return winners.has(c.team);}).length}</span>}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:16}}>
                    {sorted.map(function(c,i){
                      var isLiveCard=liveTeams.has(c.team);
                      var isRedZone=redZoneTeams.has(c.team);
                      var isShaking=shakeTeams[c.team];
                      var isHighlighted=highlightedTeam===c.team;
                      var isOffseason=SEASON_CALENDAR[c.sport]&&!SEASON_CALENDAR[c.sport].active;
                      var liveCol=getColors(c.team)[0];
                      var liveFilter=isRedZone
                        ?"drop-shadow(0 0 8px "+liveCol+") drop-shadow(0 0 16px "+liveCol+"cc)"
                        :isLiveCard?"drop-shadow(0 0 6px "+liveCol+"dd)":"none";
                      var offseasonBadge=null;
                      if(isOffseason&&!isLiveCard){
                        var _cal=SEASON_CALENDAR[c.sport];
                        var _isDraft=_cal&&_cal.isDraft; var _isFinalFour=_cal&&_cal.isFinalFour;
                        var _olabel=_isDraft?_draftLabel:_isFinalFour?"🏆 FINAL FOUR":_cal?_cal.note:"Offseason";
                        var _obg=_isDraft?"#e8f0ff":_isFinalFour?"#fffbeb":"#f5f5f5";
                        var _ocol=_isDraft?"#1144cc":_isFinalFour?"#c8a800":"#888";
                        var _obdr=_isDraft?"1px solid #c8d8ff":_isFinalFour?"1px solid #f5e0a0":"1px solid #e0e0e0";
                        offseasonBadge=<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:_obg,color:_ocol,fontSize:10,fontWeight:700,padding:"2px 8px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",whiteSpace:"nowrap",border:_obdr,textTransform:"uppercase"}}>{_olabel}</div>;
                      }
                      return (
                        <div key={c.id+i} className={"inv-wrap"+(isRedZone?" redZone":isShaking?" haptic":"")}
                          style={{position:"relative",filter:liveFilter,animation:isHighlighted?"highlightFlash 2s ease-out forwards":"none",outline:isHighlighted?"3px solid #22cc55":"none",transition:"filter 0.3s",opacity:isOffseason?0.75:1}}>
                          {isLiveCard&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:isRedZone?"#e8161e":"#22cc55",color:"#fff",fontSize:10,fontWeight:800,padding:"2px 8px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.1em",whiteSpace:"nowrap",textTransform:"uppercase"}}>{isRedZone?(c.sport==="MLB"?"🔴 CLUTCH":c.sport==="MLS"?"🔴 FINAL MINS":"🔴 RED ZONE"):"LIVE · 1.5×"}</div>}
                          {offseasonBadge}
                          {preTeams[c.team]&&!isLiveCard&&!isOffseason&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:"#c8a800",color:"#fff",fontSize:10,fontWeight:800,padding:"2px 8px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.1em",whiteSpace:"nowrap",textTransform:"uppercase"}}>IN {preTeams[c.team]}m</div>}
                          {c.graded&&c.grade
                            ?<AcrylicSlab card={c} gradeTier={GRADE_TIERS.find(function(t){return t.grade===c.grade;})||GRADE_TIERS[GRADE_TIERS.length-1]} compact={true}/>
                            :<FlipCard card={c} autoFlip={true} winners={winners}/>}
                          <div className="list-ov" onClick={function(){c.graded?setTab("grading"):setListModal(c);}}>
                            {c.graded
                              ?<button style={{background:"#e8161e",color:"#fff",fontWeight:800,fontSize:12,padding:"8px 14px",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Graded ✓</button>
                              :<button style={{background:"#22aa44",color:"#fff",fontWeight:800,fontSize:13,padding:"8px 16px",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>List for Sale</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            )}
            {invSubTab==="sets"&&<SetTracker inventory={inventory}/>}
          </div>
        )}
      </div>
    </div>
  );
}
