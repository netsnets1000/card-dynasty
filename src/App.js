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
  Chiefs:["#E31837","#FFB81C"],Cowboys:["#003594","#869397"],Eagles:["#004C54","#A5ACAF"],
  "49ers":["#AA0000","#B3995D"],Ravens:["#241773","#9E7C0C"],Bills:["#00338D","#C60C30"],
  Dolphins:["#008E97","#FC4C02"],Bengals:["#FB4F14","#000"],Lions:["#0076B6","#B0B7BC"],
  Packers:["#203731","#FFB612"],Bears:["#0B162A","#C83803"],Vikings:["#4F2683","#FFC62F"],
  Giants:["#0B2265","#A71930"],Jets:["#125740","#000"],Patriots:["#002244","#C60C30"],
  Steelers:["#FFB612","#101820"],Broncos:["#FB4F14","#002244"],Raiders:["#000","#A5ACAF"],
  Chargers:["#0080C6","#FFC20E"],Seahawks:["#002244","#69BE28"],
  Lakers:["#552583","#FDB927"],Celtics:["#007A33","#BA9653"],Warriors:["#1D428A","#FFC72C"],
  Bucks:["#00471B","#EEE1C6"],Nuggets:["#0E2240","#FEC524"],Heat:["#98002E","#F9A01B"],
  Suns:["#1D1160","#E56020"],Clippers:["#C8102E","#1D428A"],"76ers":["#006BB6","#ED174C"],
  Nets:["#000","#FFF"],Bulls:["#CE1141","#000"],Knicks:["#006BB6","#F58426"],
  Mavericks:["#00538C","#002F6C"],Grizzlies:["#5D76A9","#12173F"],Pelicans:["#0C2340","#C8102E"],
  Hawks:["#E03A3E","#C1D32F"],Raptors:["#CE1141","#000"],Blazers:["#E03A3E","#000"],
  Jazz:["#002B5C","#00471B"],Spurs:["#C4CED4","#000"],
  Yankees:["#003087","#FFF"],Dodgers:["#005A9C","#EF3E42"],"Red Sox":["#BD3039","#0C2340"],
  Cubs:["#0E3386","#CC3433"],Giants:["#FD5A1E","#27251F"],Cardinals:["#C41E3A","#0C2340"],
  Braves:["#CE1141","#13274F"],Astros:["#002D62","#EB6E1F"],Mets:["#002D72","#FF5910"],
  Phillies:["#E81828","#002D72"],"Blue Jays":["#134A8E","#1D2D5C"],Brewers:["#FFC52F","#12284B"],
  Padres:["#2F241D","#FFC425"],Mariners:["#0C2C56","#005C5C"],Rangers:["#003278","#C0111F"],
  Tigers:["#0C2340","#FA4616"],Twins:["#002B5C","#D31145"],"White Sox":["#27251F","#C4CED4"],
  Royals:["#004687","#BD9B60"],Orioles:["#DF4601","#000"],
  "LA Galaxy":["#00245D","#FFD700"],LAFC:["#C39E6D","#000"],"Atlanta United":["#80000A","#221F1F"],
  "Seattle Sounders":["#5D9741","#004C97"],"Portland Timbers":["#004812","#EBBA00"],
  "NYC FC":["#6CACE4","#003DA5"],"Inter Miami":["#F7B5CD","#231F20"],"Red Bulls":["#ED1F24","#23286B"],
  "Chicago Fire":["#9D2235","#6CADDF"],"Columbus Crew":["#FEDA00","#000"],
  Alabama:["#9E1B32","#828A8F"],"Ohio State":["#BB0000","#666"],Georgia:["#BA0C2F","#000"],
  Michigan:["#00274C","#FFCB05"],LSU:["#461D7C","#FDD023"],Clemson:["#F56600","#522D80"],
  Oklahoma:["#841617","#FDF9D8"],"Notre Dame":["#0C2340","#AE9142"],USC:["#9D2235","#FFCC00"],
  Texas:["#BF5700","#000"],"Penn State":["#041E42","#FFF"],Florida:["#0021A5","#FA4616"],
  Tennessee:["#FF8200","#58595B"],Oregon:["#154733","#FEE123"],Auburn:["#0C2340","#E87722"],
  Miami:["#F47321","#005030"],Nebraska:["#E41C38","#000"],Iowa:["#FFCD00","#000"],
  Wisconsin:["#C5050C","#0479A8"],Arkansas:["#9D2235","#000"],
};
function getColors(t){ return TC[t]||["#334","#556"]; }
function teamCode(t){
  var w=t.split(" ");
  return (w.length===1?t.slice(0,3):w.map(function(x){return x[0];}).join("").slice(0,4)).toUpperCase();
}
var ALL_TEAMS={
  NFL:["Chiefs","Eagles","Cowboys","49ers","Ravens","Bills","Dolphins","Bengals","Lions","Packers","Bears","Vikings","Giants","Jets","Patriots","Steelers","Broncos","Raiders","Chargers","Seahawks"],
  NBA:["Lakers","Celtics","Warriors","Bucks","Nuggets","Heat","Suns","Clippers","76ers","Nets","Bulls","Knicks","Mavericks","Grizzlies","Pelicans","Hawks","Raptors","Blazers","Jazz","Spurs"],
  MLB:["Yankees","Dodgers","Red Sox","Cubs","Giants","Cardinals","Braves","Astros","Mets","Phillies","Blue Jays","Brewers","Padres","Mariners","Rangers","Tigers","Twins","White Sox","Royals","Orioles"],
  MLS:["LA Galaxy","LAFC","Atlanta United","Seattle Sounders","Portland Timbers","NYC FC","Inter Miami","Red Bulls","Chicago Fire","Columbus Crew"],
  College:["Alabama","Ohio State","Georgia","Michigan","LSU","Clemson","Oklahoma","Notre Dame","USC","Texas","Penn State","Florida","Tennessee","Oregon","Auburn","Miami","Nebraska","Iowa","Wisconsin","Arkansas"],
};
var DIVISIONS={
  "NFC East":{sport:"NFL",teams:["Cowboys","Giants","Eagles","Washington"]},
  "AFC North":{sport:"NFL",teams:["Ravens","Browns","Steelers","Bengals"]},
  "NBA Atlantic":{sport:"NBA",teams:["Celtics","Nets","Knicks","76ers","Raptors"]},
  "NBA Pacific":{sport:"NBA",teams:["Warriors","Clippers","Lakers","Suns","Kings"]},
  "AL East":{sport:"MLB",teams:["Orioles","Red Sox","Yankees","Rays","Blue Jays"]},
  "NL West":{sport:"MLB",teams:["Diamondbacks","Rockies","Dodgers","Padres","Giants"]},
  "College SEC":{sport:"College",teams:["Alabama","Auburn","Georgia","LSU","Tennessee","Florida","Arkansas"]},
};
var PACK_TYPES=[
  {id:"standard",name:"Standard Pro Case",subtitle:"The classic experience",cost:500,cards:5,rates:{Base:70,Rare:20,Elite:7,Legacy:2.5,Legendary:0.4,Dynasty:0.1},guarantee:null,badge:null},
  {id:"jumbo",name:"Division Jumbo",subtitle:"10 cards more shots",cost:1500,cards:10,rates:{Base:55,Rare:22,Elite:15,Legacy:5,Legendary:2.5,Dynasty:0.5},guarantee:null,badge:"BEST VALUE"},
  {id:"obsidian",name:"Obsidian Black Box",subtitle:"3 cards Legacy guaranteed",cost:5000,cards:3,rates:{Base:0,Rare:20,Elite:35,Legacy:25,Legendary:15,Dynasty:5},guarantee:"Legacy",badge:"PREMIUM"},
];
var RMAP={
  Base:     {daily:25, win:100, pMin:150,  pMax:500},
  Rare:     {daily:37, win:175, pMin:600,  pMax:1200},
  Elite:    {daily:62, win:325, pMin:2500, pMax:3500},
  Legacy:   {daily:200,win:0,   pMin:8000, pMax:12000},
  Legendary:{daily:125,win:625, pMin:25000,pMax:45000},
  Dynasty:  {daily:250,win:1500,pMin:100000,pMax:180000},
};
var ORDER=["Dynasty","Legendary","Legacy","Elite","Rare","Base"];
var SPORT_COLORS={NFL:"#4488ff",NBA:"#ff6622",MLB:"#44cc88",MLS:"#ff4466",College:"#ffaa22"};
var RCOLORS={Base:"#aab",Rare:"#60a5fa",Elite:"#34d399",Legacy:"#f5c518",Legendary:"#f5c518",Dynasty:"#e879f9"};
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
  var rm=RMAP[rarity];
  return {id:genId(),sport:sport,team:team,rarity:rarity,daily:rm.daily,win:rm.win,mp:rm.daily*365+rm.win*52};
}
function buildPack(pt,pity){
  var rates=pity&&pt.id==="standard"?Object.assign({},pt.rates,{Elite:pt.rates.Elite+50}):pt.rates;
  var cards=[];
  for(var i=0;i<pt.cards;i++){
    var force=(pt.guarantee&&i===pt.cards-1&&!cards.some(function(c){return ORDER.indexOf(c.rarity)<=ORDER.indexOf(pt.guarantee);}))?pt.guarantee:null;
    cards.push(genCard(rates,force,null));
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
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#07070f;color:#fff;font-family:'Inter',system-ui,sans-serif}
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
  .bal-shimmer{background:linear-gradient(90deg,#f5c518 20%,#fff8c0 40%,#f5c518 60%,#fde68a 80%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:balShimmer 3s linear infinite}
  .pack-float{animation:packFloat 3s ease-in-out infinite}
  .pack-shake{animation:packShake 0.13s ease-in-out infinite}
  .seam-glow{animation:seamGlow 0.4s ease-in-out 4}
  .popup-anim{animation:popIn 0.3s cubic-bezier(0.3,1.3,0.5,1) forwards}
  .slide-up{animation:slideUp 0.4s ease-out forwards}
  .fade-in{animation:fadeIn 0.8s ease-out forwards}
  .notif{animation:notifSlide 4s ease-in-out forwards}
  .live-dot{width:7px;height:7px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite}
  .tab-btn{padding:10px 14px;font-size:11px;font-weight:700;cursor:pointer;background:none;border:none;border-bottom:2px solid transparent;color:#444;white-space:nowrap;transition:color .2s}
  .tab-btn.on{color:#f5c518;border-bottom-color:#f5c518}
  .inv-wrap{position:relative}
  .inv-wrap:hover .list-ov{opacity:1}
  .list-ov{position:absolute;inset:0;border-radius:14px;background:rgba(0,0,0,0.78);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;cursor:pointer;z-index:20}
  .mrow{background:rgba(10,10,22,0.8);border:1px solid #1e1e3a;border-radius:14px;padding:14px;transition:border-color .2s,transform .15s}
  .mrow:hover{border-color:#2e2e5a;transform:translateY(-1px)}
  .set-bar{background:#0e0e1e;border-radius:999px;height:5px;overflow:hidden;flex:1}
  .set-bar-fill{height:100%;border-radius:999px;transition:width 0.8s}
  .haptic{animation:hapticShake 0.35s ease-in-out}
  .redZone{animation:redZoneShake 0.15s ease-in-out infinite}
  .screen-jolt{animation:screenJolt 0.5s ease-out}
`;
function TeamEmblem(props) {
  var team=props.team; var size=props.size||72;
  var col=getColors(team); var c1=col[0]; var c2=col[1];
  var code=teamCode(team);
  var uid="em"+team.replace(/\s/g,"");
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <radialGradient id={uid} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={c1} stopOpacity="1"/>
          <stop offset="55%" stopColor={c1} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0.6"/>
        </radialGradient>
        <filter id={"f"+uid}><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={c1} floodOpacity="0.8"/></filter>
      </defs>
      <path d="M40,4 L72,17 L72,44 Q72,66 40,76 Q8,66 8,44 L8,17 Z" fill={"url(#"+uid+")"} stroke={c2} strokeWidth="1.5" opacity="0.95"/>
      <path d="M40,9 L67,20 L67,44 Q67,63 40,71 Q13,63 13,44 L13,20 Z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
      <text x="40" y="47" textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={code.length>3?16:20} fill="rgba(255,255,255,0.93)" filter={"url(#f"+uid+")"} letterSpacing="1">{code}</text>
    </svg>
  );
}
function DShield(props) {
  var rarity=props.rarity;
  var premium=rarity==="Dynasty"||rarity==="Legendary"||rarity==="Legacy";
  return (
    <div style={{position:"absolute",top:9,right:9,zIndex:20,filter:"drop-shadow(0 0 "+(premium?8:4)+"px rgba(120,60,255,"+(premium?0.9:0.5)+"))"}}>
      <svg width={30} height={34} viewBox="0 0 30 34">
        <defs>
          <linearGradient id="dsg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={premium?"#8855ff":"#5533bb"}/>
            <stop offset="100%" stopColor={premium?"#3311aa":"#221166"}/>
          </linearGradient>
        </defs>
        <path d="M15,1.5 L28,7 L28,19 Q28,30 15,33 Q2,30 2,19 L2,7 Z" fill="url(#dsg)" stroke="rgba(180,140,255,0.7)" strokeWidth="1"/>
        <text x="15" y="21" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Georgia,serif">D</text>
      </svg>
    </div>
  );
}
function CrownBadge() {
  return (
    <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.65)",border:"1px solid rgba(180,140,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={22} height={22} viewBox="0 0 24 24">
        <path d="M4,17 L4,11 L8,14 L12,7 L16,14 L20,11 L20,17 Z" fill="rgba(220,175,0,0.9)" stroke="rgba(255,220,50,0.7)" strokeWidth="0.5"/>
        <path d="M5,19 L19,19" stroke="rgba(200,160,0,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
function SportBadge(props) {
  var sport=props.sport; var dark=props.dark||false;
  var color=dark?"#556":"rgba(255,255,255,0.75)";
  var icon=null;
  if(sport==="NFL") icon=<><ellipse cx="12" cy="12" rx="8" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="0.9"/><line x1="12" y1="6.5" x2="12" y2="17.5" stroke="currentColor" strokeWidth="0.9"/></>;
  else if(sport==="NBA") icon=<><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><line x1="12" y1="3.5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="0.9"/><path d="M3.5,12 Q7.5,7.5 12,12 Q16.5,16.5 20.5,12" fill="none" stroke="currentColor" strokeWidth="0.9"/></>;
  else if(sport==="MLB") icon=<><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5,6 Q12,10 12,12 Q12,14 5.5,18" fill="none" stroke="currentColor" strokeWidth="0.9"/><path d="M18.5,6 Q12,10 12,12 Q12,14 18.5,18" fill="none" stroke="currentColor" strokeWidth="0.9"/></>;
  else icon=<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4"/>;
  return (
    <div style={{width:30,height:30,borderRadius:"50%",background:dark?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)",border:"1px solid "+(dark?"rgba(0,0,0,0.18)":"rgba(255,255,255,0.18)"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={22} height={22} viewBox="0 0 24 24" color={color}>{icon}</svg>
    </div>
  );
}
function PremiumCard(props) {
  var card=props.card; var isWinner=props.isWinner||false;
  var col=getColors(card.team); var c1=col[0];
  var mouseState=useState({x:0.5,y:0.5}); var mouse=mouseState[0]; var setMouse=mouseState[1];
  var cardRef=useRef(null);
  var W=148,H=212;
  var isBase=card.rarity==="Base"; var isRare=card.rarity==="Rare";
  var isElite=card.rarity==="Elite"; var isLegacy=card.rarity==="Legacy";
  var isLeg=card.rarity==="Legendary"; var isDyn=card.rarity==="Dynasty";
  var isLight=isBase; // Only Base gets the light silver treatment now
  var isPremium=isLeg||isDyn; var isGold=isLegacy||isPremium;
  var cardBg=isBase
    ?"linear-gradient(160deg,#e8ecf0,#f5f7fa,#dde2e8)"
    :isRare
    ?"linear-gradient(160deg,#050d1f,#091830,#050d1f)"
    :isElite
    ?"linear-gradient(160deg,#061810,#0d2818,#061810)"
    :isLegacy
    ?"linear-gradient(160deg,#120d00,#221800,#120d00)"
    :"linear-gradient(160deg,#070415,#10082a,#070415)";
  var bshadow=isPremium
    ?"0 0 28px rgba(245,197,24,0.55), 0 20px 50px rgba(0,0,0,0.85)"
    :isLegacy
    ?"0 0 18px rgba(200,155,0,0.35), 0 20px 50px rgba(0,0,0,0.85)"
    :isElite
    ?"0 0 14px rgba(40,180,100,0.3), 0 20px 50px rgba(0,0,0,0.85)"
    :isRare
    ?"0 0 16px rgba(96,165,250,0.45), 0 20px 50px rgba(0,0,0,0.85)"
    :"0 20px 50px rgba(0,0,0,0.45)";
  var bcolor=isPremium
    ?"#f5c518"
    :isLegacy
    ?"rgba(200,155,0,0.8)"
    :isElite
    ?"rgba(40,180,100,0.7)"
    :isRare
    ?"rgba(96,165,250,0.75)"
    :"rgba(170,180,195,0.5)";
  var nameColor=isBase?"#111":isRare?"#93c5fd":isPremium?"#f5c518":isLegacy?"#fde68a":isElite?"#90f0c0":"#fff";
  var statColor=isBase?"#334":isRare?"#60a5fa":isPremium?"#f5c518":isLegacy?"#fde68a":isElite?"#34d399":"#aac";
  var plateBg=isBase
    ?"linear-gradient(90deg,#cdd3db,#dde3ea,#cdd3db)"
    :isRare
    ?"linear-gradient(90deg,#06112a,#0a1e3d,#06112a)"
    :isPremium
    ?"rgba(15,10,0,0.92)"
    :isLegacy
    ?"rgba(12,8,0,0.92)"
    :"rgba(0,0,0,0.82)";
  function onMouseMove(e) {
    if(!cardRef.current) return;
    var r=cardRef.current.getBoundingClientRect();
    setMouse({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});
  }
  function onMouseLeave(){ setMouse({x:0.5,y:0.5}); }
  var bw=isPremium?"2px":isRare?"1.5px":"1.5px";
  return (
    <div ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{width:W,height:H,position:"relative",borderRadius:12,flexShrink:0,overflow:"hidden",border:bw+" solid "+bcolor,boxShadow:bshadow,animation:isPremium?"goldPulse 2.5s ease-in-out infinite":isRare?"rareShimmer 3s ease-in-out infinite":"none"}}>
      <div style={{position:"absolute",inset:0,background:cardBg}}/>
      {/* Team color radial — same for all */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 75% 55% at "+(mouse.x*100)+"% "+(mouse.y*100)+"%, "+c1+"30 0%, transparent 70%)",transition:"background 0.15s"}}/>
      {/* Rare: blue prismatic overlay */}
      {isRare&&<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(30,60,160,0.35),rgba(60,130,255,0.2),rgba(120,80,255,0.25),rgba(30,60,160,0.3))",mixBlendMode:"screen"}}/>}
      {/* Rare: diagonal blue shimmer sweep */}
      {isRare&&<div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 20%,rgba(96,165,250,0.18) 50%,transparent 80%)",backgroundSize:"200% 100%",animation:"shimmerSweep 2.8s ease-in-out infinite",mixBlendMode:"screen",pointerEvents:"none"}}/>}
      {isPremium&&<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,120,0,0.22),rgba(160,0,255,0.18),rgba(0,180,255,0.12),rgba(255,180,0,0.18))",mixBlendMode:"screen"}}/>}
      {isLegacy&&<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,180,0,0.1),rgba(80,40,0,0.08),rgba(255,180,0,0.1))",mixBlendMode:"screen"}}/>}
      <div style={{position:"absolute",inset:0,backgroundImage:NOISE,backgroundSize:"180px",opacity:isBase?0.3:0.55,mixBlendMode:"overlay",pointerEvents:"none"}}/>
      {isGold&&<div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.22) 50%,transparent 80%)",backgroundSize:"200% 100%",animation:"shimmerSweep 3s ease-in-out infinite",mixBlendMode:"screen",pointerEvents:"none"}}/>}
      {isDyn&&<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}><div style={{position:"absolute",width:"40%",height:"300%",top:"-100%",left:"-5%",background:"linear-gradient(90deg,transparent,rgba(245,197,24,0.12),transparent)",animation:"dynastyShine 3s ease-in-out infinite"}}/></div>}
      <div style={{position:"absolute",inset:0,borderRadius:11,background:"radial-gradient(ellipse 60% 50% at "+(mouse.x*100)+"% "+(mouse.y*100)+"%, rgba(255,255,255,0.07) 0%, transparent 70%)",pointerEvents:"none",zIndex:6,transition:"background 0.15s"}}/>
      {/* Rare: SVG blue corner accent lines */}
      {isRare&&(
        <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,zIndex:8,pointerEvents:"none"}}>
          <defs>
            <linearGradient id="rbrg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          {/* Inner border */}
          <rect x="4" y="4" width={W-8} height={H-8} rx="9" fill="none" stroke="url(#rbrg)" strokeWidth="1.5"/>
          {/* Corner accents — L-shaped ticks like Prizm Rookie cards */}
          <polyline points="4,22 4,4 22,4" fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.9"/>
          <polyline points={W-22+",4 "+W-4+",4 "+(W-4)+",22"} fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.9"/>
          <polyline points={"4,"+(H-22)+" 4,"+(H-4)+" 22,"+(H-4)} fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.9"/>
          <polyline points={(W-22)+","+(H-4)+" "+(W-4)+","+(H-4)+" "+(W-4)+","+(H-22)} fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.9"/>
        </svg>
      )}
      {isGold&&(
        <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,zIndex:8,pointerEvents:"none"}}>
          <defs>
            <linearGradient id="brg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isPremium?"#f5c518":"#cc9000"} stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#fff8c0" stopOpacity="0.8"/>
              <stop offset="100%" stopColor={isPremium?"#f5c518":"#cc9000"} stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <rect x="4" y="4" width={W-8} height={H-8} rx="9" fill="none" stroke="url(#brg)" strokeWidth="2"/>
          <circle cx="14" cy="14" r="3" fill={isPremium?"#f5c518":"#cc9000"} opacity="0.9"/>
          <circle cx={W-14} cy="14" r="3" fill={isPremium?"#f5c518":"#cc9000"} opacity="0.9"/>
          <circle cx="14" cy={H-14} r="3" fill={isPremium?"#f5c518":"#cc9000"} opacity="0.9"/>
          <circle cx={W-14} cy={H-14} r="3" fill={isPremium?"#f5c518":"#cc9000"} opacity="0.9"/>
        </svg>
      )}
      <DShield rarity={card.rarity}/>
      <div style={{position:"absolute",left:7,top:"50%",transform:"translateY(-50%) rotate(-90deg)",transformOrigin:"center",whiteSpace:"nowrap",zIndex:9,pointerEvents:"none"}}>
        <span style={{fontSize:7,letterSpacing:"0.25em",color:isBase?"rgba(0,0,0,0.12)":"rgba(255,255,255,0.1)",fontWeight:400,textTransform:"uppercase"}}>Card Dynasty</span>
      </div>
      <div style={{position:"absolute",left:"50%",top:"43%",transform:"translate(-50%,-50%)",zIndex:2,opacity:0.1,pointerEvents:"none"}}>
        <TeamEmblem team={card.team} size={Math.round(W*0.62)}/>
      </div>
      <div style={{position:"absolute",left:"50%",top:"40%",transform:"translate(-50%,-50%)",zIndex:10,filter:isPremium?"drop-shadow(0 0 16px "+c1+"dd) drop-shadow(0 0 32px "+c1+"88)":isRare?"drop-shadow(0 0 8px "+c1+"cc)":"none"}}>
        <TeamEmblem team={card.team} size={Math.round(W*0.5)}/>
      </div>
      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:11,display:"flex",alignItems:"center",gap:5,padding:"7px 12px 5px",background:isBase?"rgba(200,208,218,0.8)":isRare?"rgba(4,10,30,0.85)":"rgba(0,0,0,0.6)"}}>
        <span style={{fontSize:10}}>🪙</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:statColor}}>{card.daily}</span>
        <span style={{color:"rgba(255,255,255,0.3)",fontSize:8,margin:"0 2px"}}>·</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:statColor}}>{card.win}</span>
        <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>win</span>
        {isWinner&&<span style={{marginLeft:"auto",fontSize:7,fontWeight:900,background:"#34d399",color:"#000",padding:"1px 7px",borderRadius:999}}>WIN</span>}
      </div>
      <div style={{position:"absolute",bottom:52,right:8,zIndex:15}}>
        <div style={{background:isPremium?"linear-gradient(135deg,#f5c518,#b8860b,#ffe066)":isLegacy?"linear-gradient(135deg,#cc9000,#8a6000,#f5c518)":isRare?"linear-gradient(135deg,#1e3a7a,#2563eb,#3b82f6)":isBase?"linear-gradient(135deg,#b0b8c8,#8090a0)":"linear-gradient(135deg,#222,#111)",borderRadius:6,padding:"3px 8px",border:isPremium?"1px solid rgba(255,255,255,0.35)":isRare?"1px solid rgba(96,165,250,0.5)":isBase?"1px solid rgba(0,0,0,0.15)":"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:6,color:isPremium?"rgba(0,0,0,0.6)":isRare?"rgba(147,197,253,0.8)":"rgba(255,255,255,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",lineHeight:1,fontWeight:700,textAlign:"center"}}>MAX POT</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:isPremium?"#000":isRare?"#93c5fd":isBase?"#223":"#eee",lineHeight:1.2,textAlign:"center"}}>{fmt(card.mp)}</div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:11}}>
        <div style={{height:1,background:isGold?"linear-gradient(90deg,transparent,rgba(245,197,24,0.5),transparent)":isRare?"linear-gradient(90deg,transparent,rgba(96,165,250,0.4),transparent)":"linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)"}}/>
        <div style={{background:plateBg,padding:"7px 10px 9px",display:"flex",alignItems:"center",gap:7}}>
          {isGold?<CrownBadge/>:<SportBadge sport={card.sport} dark={isBase}/>}
          <div style={{flex:1,minWidth:0,textAlign:"center"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:11,color:nameColor,letterSpacing:"0.1em",textTransform:"uppercase",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{card.team}</div>
          </div>
          <SportBadge sport={card.sport} dark={isBase}/>
        </div>
      </div>
    </div>
  );
}
// Renders a genuine sports-card back: color border, diagonal pattern, holographic
function CardBack(props) {
  var W=props.width||148; var H=props.height||212; var autoFlip=props.autoFlip||false;
  var uid="cb"+W+"x"+H;
  var serial="#"+String(Math.floor(W*H*7+314)).padStart(6,"0");
  var r1=(W*0.64-14)/2; var circ1=2*Math.PI*r1;
  return (
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{display:"block",borderRadius:12}}>
      <defs>
        <linearGradient id={uid+"b"} x1="15%" y1="0%" x2="85%" y2="100%"><stop offset="0%" stopColor="#06031a"/><stop offset="45%" stopColor="#09052a"/><stop offset="100%" stopColor="#04021a"/></linearGradient>
        <linearGradient id={uid+"g"} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6a4400"/><stop offset="50%" stopColor="#f5c518"/><stop offset="100%" stopColor="#b8860b"/></linearGradient>
        <linearGradient id={uid+"h"} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff0066" stopOpacity="0.5"/><stop offset="25%" stopColor="#ff8800" stopOpacity="0.35"/><stop offset="50%" stopColor="#00e5ff" stopOpacity="0.45"/><stop offset="75%" stopColor="#aa00ff" stopOpacity="0.4"/><stop offset="100%" stopColor="#ff0066" stopOpacity="0.45"/></linearGradient>
        <pattern id={uid+"d"} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)"><rect width="10" height="10" fill="#070520"/><line x1="0" y1="5" x2="10" y2="5" stroke="#0d0835" strokeWidth="3.5"/></pattern>
        <radialGradient id={uid+"gw"} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#2a1580" stopOpacity="0.65"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></radialGradient>
        <radialGradient id={uid+"vg"} cx="50%" cy="50%" r="70%"><stop offset="55%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(0,0,0,0.75)"/></radialGradient>
        <clipPath id={uid+"cl"}><rect x="0" y="0" width={W} height={H} rx="11"/></clipPath>
      </defs>
      <g clipPath={"url(#"+uid+"cl)"}>
        <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"b)"}/>
        <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"d)"} opacity="1"/>
        <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"gw)"}/>
        <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"h)"} opacity="0.55" style={{animation:"holoShine 4s ease-in-out infinite"}}/>
        <line x1={W*0.08} y1={H*0.02} x2={W*0.55} y2={H*0.98} stroke="rgba(255,255,255,0.07)" strokeWidth={W*0.18}/>
        <rect x="3" y="3" width={W-6} height={H-6} rx="9" fill="none" stroke={"url(#"+uid+"g)"} strokeWidth="2.5"/>
        <rect x="7" y="7" width={W-14} height={Math.round(H*0.1)} rx="6" fill="rgba(0,0,0,0.82)"/>
        <rect x="7" y={7+Math.round(H*0.1)-1} width={W-14} height="1.5" fill={"url(#"+uid+"g)"} opacity="0.8"/>
        <text x={W/2} y={7+Math.round(H*0.1)*0.52} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={Math.round(W*0.11)} fill="#f5c518" letterSpacing="3" style={{filter:"drop-shadow(0 0 6px rgba(245,197,24,0.8))"}}>CARD DYNASTY</text>
        <path d={"M"+(W/2)+","+(H*0.185)+" L"+(W*0.815)+","+(H*0.275)+" L"+(W*0.815)+","+(H*0.515)+" Q"+(W*0.815)+","+(H*0.695)+" "+(W/2)+","+(H*0.775)+" Q"+(W*0.185)+","+(H*0.695)+" "+(W*0.185)+","+(H*0.515)+" L"+(W*0.185)+","+(H*0.275)+" Z"} fill="rgba(255,255,255,0.03)" stroke={"url(#"+uid+"g)"} strokeWidth="1.2" strokeOpacity="0.45"/>
        <text x={W/2} y={H*0.495} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={Math.round(W*0.52)} fill="rgba(180,140,255,0.07)">D</text>
        <text x={W/2} y={H*0.655} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize={Math.round(W*0.072)} fill="rgba(245,197,24,0.3)" letterSpacing="3">DYNASTY</text>
        {[{cx:W*0.14,cy:H*0.14},{cx:W*0.86,cy:H*0.14},{cx:W*0.14,cy:H*0.86},{cx:W*0.86,cy:H*0.86}].map(function(pt,i){var s=Math.round(W*0.038);return <rect key={i} x={pt.cx-s} y={pt.cy-s} width={s*2} height={s*2} transform={"rotate(45,"+pt.cx+","+pt.cy+")"} fill="rgba(245,197,24,0.12)" stroke={"url(#"+uid+"g)"} strokeWidth="1" strokeOpacity="0.6"/>;}) }
        <rect x={W*0.1} y={H*0.795} width={W*0.8} height={H*0.085} rx="4" fill="rgba(0,0,0,0.7)" stroke="rgba(245,197,24,0.2)" strokeWidth="0.75"/>
        {[{x:W*0.22,v:"PWR"},{x:W*0.5,v:"SPD"},{x:W*0.78,v:"RTG"}].map(function(s,i){return <g key={i}><text x={s.x} y={H*0.828} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fontSize={Math.round(W*0.06)} fill="rgba(200,200,255,0.5)">{s.v}</text><text x={s.x} y={H*0.855} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fontSize={Math.round(W*0.075)} fill="#f5c518">{["99","88","95"][i]}</text></g>;})}
        <line x1={W*0.37} y1={H*0.802} x2={W*0.37} y2={H*0.872} stroke="rgba(245,197,24,0.2)" strokeWidth="0.75"/>
        <line x1={W*0.63} y1={H*0.802} x2={W*0.63} y2={H*0.872} stroke="rgba(245,197,24,0.2)" strokeWidth="0.75"/>
        <rect x="7" y={H-7-Math.round(H*0.075)} width={W-14} height={Math.round(H*0.075)} rx="6" fill="rgba(0,0,0,0.82)"/>
        <rect x="7" y={H-7-Math.round(H*0.075)} width={W-14} height="1.5" fill={"url(#"+uid+"g)"} opacity="0.8"/>
        <text x={W*0.22} y={H-7-Math.round(H*0.075)*0.48} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fontSize={Math.round(W*0.055)} fill="rgba(245,197,24,0.65)">{serial}</text>
        <text x={W*0.75} y={H-7-Math.round(H*0.075)*0.48} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize={Math.round(W*0.075)} fill="rgba(245,197,24,0.65)" letterSpacing="1">2025</text>
        {!autoFlip&&<g><rect x={W*0.18} y={H*0.89} width={W*0.64} height={H*0.072} rx="999" fill="rgba(245,197,24,0.1)" stroke="rgba(245,197,24,0.35)" strokeWidth="0.75"/><text x={W/2} y={H*0.926} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize={Math.round(W*0.072)} fill="rgba(245,197,24,0.8)" letterSpacing="1.5">TAP TO REVEAL</text></g>}
        <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"vg)"}/>
        <rect x="1.5" y="1.5" width={W-3} height={H-3} rx="11" fill="none" stroke="rgba(245,197,24,0.5)" strokeWidth="1.5"/>
      </g>
    </svg>
  );
}

function FlipCard(props) {
  var card=props.card; var autoFlip=props.autoFlip||false; var winners=props.winners||null;
  var onFlip=props.onFlip||null; var compact=props.compact||false;
  var flippedState=useState(false); var flipped=flippedState[0]; var setFlipped=flippedState[1];
  var sfxState=useState(null); var sfx=sfxState[0]; var setSfx=sfxState[1];
  var isWin=winners&&winners.has(card.team);
  var W=compact?116:148; var H=compact?165:212;
  var SFX={Rare:"SHINK!",Elite:"CRACK!",Legacy:"BLAZE!",Legendary:"FIRE!",Dynasty:"BOOM!"};
  var ac=RCOLORS[card.rarity]||"#aaa";
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
      {sfx&&<div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",zIndex:30,fontSize:13,fontWeight:900,color:ac,textShadow:"0 0 14px "+ac,whiteSpace:"nowrap",animation:"popIn 0.8s ease-out forwards",pointerEvents:"none"}}>{sfx}</div>}
      <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transition:"transform 0.65s cubic-bezier(0.3,1.4,0.5,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
        {/* CARD BACK — universal foil sports card back, no team info */}
        <div onClick={doFlip} style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",cursor:!flipped?"pointer":"default",borderRadius:12,overflow:"hidden"}}>
          <CardBack width={W} height={H} autoFlip={autoFlip}/>
        </div>
        {/* CARD FRONT — premium card face, shows after flip */}
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",borderRadius:12}}>
          <PremiumCard card={card} isWinner={isWin}/>
        </div>
      </div>
    </div>
  );
}
function MiniCard(props) {
  var card=props.card;
  var col=getColors(card.team); var c1=col[0];
  var isBase=card.rarity==="Base";
  var isRare=card.rarity==="Rare";
  var isGold=card.rarity==="Legendary"||card.rarity==="Dynasty"||card.rarity==="Legacy";
  var bc=isGold?"rgba(245,197,24,0.7)":isRare?"rgba(96,165,250,0.7)":isBase?"rgba(150,160,175,0.5)":"rgba(100,120,200,0.4)";
  var bg=isBase?"linear-gradient(160deg,#e8ecf0,#f5f7fa)":isRare?"linear-gradient(160deg,#050d1f,#091830)":isGold?"linear-gradient(160deg,#120d00,#221800)":"linear-gradient(160deg,#070415,#10082a)";
  var nameCol=isBase?"#111":isRare?"#93c5fd":isGold?"#f5c518":"#ccd";
  var rarCol=isBase?"#556":isRare?"#60a5fa":isGold?"#aa8800":"#778";
  return (
    <div style={{width:56,height:76,borderRadius:8,overflow:"hidden",flexShrink:0,position:"relative",border:"1.5px solid "+bc,boxShadow:isGold?"0 0 10px rgba(245,197,24,0.3)":isRare?"0 0 8px rgba(96,165,250,0.3)":"none"}}>
      <div style={{position:"absolute",inset:0,background:bg}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 80% 15%,"+c1+"30 0%,transparent 70%)"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,zIndex:5}}>
        <TeamEmblem team={card.team} size={34}/>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:6,fontWeight:700,color:nameCol,textTransform:"uppercase",textAlign:"center",padding:"0 3px",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",maxWidth:"90%"}}>{card.team}</div>
        <div style={{fontSize:6,color:rarCol}}>{card.rarity.slice(0,3).toUpperCase()}</div>
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
  var packId=props.packId; var size=props.size||130; var shaking=props.shaking||false;
  var floating=props.floating!==undefined?props.floating:true; var onClick=props.onClick;
  var W=size; var H=Math.round(size*1.75); var uid="pk_"+packId+"_"+size;
  var cfgs={
    genesis:{bg:"#1a1200",acc:"#f5c518",b2:"#3d2e00",lbl:"GENESIS",sub:"STARTER PACK",cards:"5",rar:"MULTI-SPORT",rc:"#f5c518"},
    standard:{bg:"#04102a",acc:"#5599ff",b2:"#0d3090",lbl:"STANDARD",sub:"PRO CASE",cards:"5",rar:"RARE+",rc:"#88ccff"},
    jumbo:{bg:"#0a0420",acc:"#cc77ff",b2:"#300e80",lbl:"JUMBO",sub:"DIVISION",cards:"10",rar:"ELITE+",rc:"#f5c518"},
    obsidian:{bg:"#020204",acc:"#dd88ff",b2:"#0c0620",lbl:"OBSIDIAN",sub:"BLACK BOX",cards:"3",rar:"LEGACY+",rc:"#e879f9"},
  };
  var c=cfgs[packId]||cfgs.standard;
  var crimpH=Math.round(H*0.09); var artH=H-crimpH*2;
  return (
    <div onClick={onClick} className={shaking?"pack-shake":floating?"pack-float":""} style={{cursor:onClick?"pointer":"default",position:"relative",width:W,height:H,filter:"drop-shadow(0 8px 24px "+c.acc+"88) drop-shadow(0 2px 4px rgba(0,0,0,0.9))"}}>
      <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{display:"block",borderRadius:4,overflow:"hidden"}}>
        <defs>
          <linearGradient id={uid+"b"} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c.bg}/><stop offset="100%" stopColor={c.b2}/></linearGradient>
          <linearGradient id={uid+"f"} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c.bg}/><stop offset="30%" stopColor={c.acc} stopOpacity="0.7"/><stop offset="55%" stopColor={c.acc} stopOpacity="0.9"/><stop offset="100%" stopColor={c.bg}/></linearGradient>
          <linearGradient id={uid+"g"} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6a4400"/><stop offset="50%" stopColor="#f5c518"/><stop offset="100%" stopColor="#b8860b"/></linearGradient>
          <linearGradient id={uid+"c"} x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={c.acc} stopOpacity="0.6"/><stop offset="100%" stopColor={c.acc} stopOpacity="0.3"/></linearGradient>
          <pattern id={uid+"s"} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)"><rect width="10" height="10" fill={c.b2}/><line x1="0" y1="5" x2="10" y2="5" stroke={c.bg} strokeWidth="3.5"/></pattern>
          <radialGradient id={uid+"sp"} cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor={c.acc} stopOpacity="0.2"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></radialGradient>
          <clipPath id={uid+"cl"}><rect x="0" y="0" width={W} height={H} rx="3"/></clipPath>
        </defs>
        <g clipPath={"url(#"+uid+"cl)"}>
          <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"b)"}/>
          <rect x="0" y={crimpH} width={W} height={artH} fill={"url(#"+uid+"s)"} opacity="0.35"/>
          <rect x="0" y={crimpH} width={W} height={artH} fill={"url(#"+uid+"f)"} opacity="0.6" style={{animation:"shimmerSweep 3.5s ease-in-out infinite"}}/>
          <rect x="0" y="0" width={W} height={H} fill={"url(#"+uid+"sp)"}/>
          <rect x="0" y="0" width={W} height={crimpH} fill={"url(#"+uid+"c)"}/>
          {[0.15,0.5,0.85].map(function(f,i){return <line key={i} x1="0" y1={crimpH*f} x2={W} y2={crimpH*f} stroke={c.acc} strokeWidth="0.7" opacity="0.5"/>;}) }
          <rect x="0" y="0" width={W} height="2" fill={c.acc} opacity="0.6"/>
          <rect x="0" y={H-crimpH} width={W} height={crimpH} fill={"url(#"+uid+"c)"}/>
          {[0.15,0.5,0.85].map(function(f,i){return <line key={i} x1="0" y1={H-crimpH+crimpH*f} x2={W} y2={H-crimpH+crimpH*f} stroke={c.acc} strokeWidth="0.7" opacity="0.5"/>;}) }
          <rect x="0" y={H-2} width={W} height="2" fill={c.acc} opacity="0.6"/>
          <rect x="4" y={crimpH+5} width={W-8} height={Math.round(H*0.07)} rx="2" fill="rgba(0,0,0,0.7)"/>
          <rect x="4" y={crimpH+5} width={W-8} height="1.5" fill={c.acc} opacity="0.8"/>
          <text x={W/2} y={crimpH+5+Math.round(H*0.07)*0.6} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize={Math.round(W*0.1)} fill="#ffffff" letterSpacing="3" style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.9))"}}>{c.sub}</text>
          <rect x={Math.round(W*0.08)} y={crimpH+Math.round(H*0.13)} width={Math.round(W*0.84)} height={Math.round(H*0.38)} rx="6" fill="rgba(0,0,0,0.55)" stroke={c.acc} strokeWidth="0.8" strokeOpacity="0.4"/>
          <text x={W/2} y={crimpH+Math.round(H*0.27)} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={Math.round(W*0.23)} fill="#ffffff" letterSpacing="2" style={{filter:"drop-shadow(0 0 8px "+c.acc+") drop-shadow(0 2px 4px rgba(0,0,0,1))"}} >CD</text>
          <line x1={Math.round(W*0.2)} y1={crimpH+Math.round(H*0.345)} x2={Math.round(W*0.8)} y2={crimpH+Math.round(H*0.345)} stroke={c.acc} strokeWidth="1" opacity="0.7"/>
          <text x={W/2} y={crimpH+Math.round(H*0.385)} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="600" fontSize={Math.round(W*0.078)} fill="#ffffff" letterSpacing="3" style={{filter:"drop-shadow(0 1px 4px rgba(0,0,0,1))"}}>CARD DYNASTY</text>
          <rect x="4" y={crimpH+Math.round(H*0.558)} width={W-8} height="1.5" fill={"url(#"+uid+"g)"} opacity="1"/>
          <rect x="4" y={crimpH+Math.round(H*0.561)} width={W-8} height={Math.round(H*0.108)} rx="2" fill="rgba(0,0,0,0.88)"/>
          <rect x="4" y={crimpH+Math.round(H*0.669)} width={W-8} height="1.5" fill={"url(#"+uid+"g)"} opacity="1"/>
          <text x={W/2} y={crimpH+Math.round(H*0.615)} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={Math.round(W*0.16)} fill="#ffffff" letterSpacing="1" style={{filter:"drop-shadow(0 2px 6px rgba(0,0,0,1)) drop-shadow(0 0 12px "+c.acc+")"}}>{c.lbl}</text>
          <rect x={Math.round(W*0.06)} y={crimpH+Math.round(H*0.72)} width={Math.round(W*0.40)} height={Math.round(H*0.072)} rx="3" fill="rgba(0,0,0,0.75)" stroke={c.acc} strokeWidth="1" strokeOpacity="0.7"/>
          <text x={Math.round(W*0.26)} y={crimpH+Math.round(H*0.757)} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fontSize={Math.round(W*0.082)} fill="#ffffff" style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,1))"}}>{c.cards} CARDS</text>
          <rect x={Math.round(W*0.54)} y={crimpH+Math.round(H*0.72)} width={Math.round(W*0.40)} height={Math.round(H*0.072)} rx="3" fill="rgba(0,0,0,0.75)" stroke={c.rc} strokeWidth="1" strokeOpacity="0.8"/>
          <text x={Math.round(W*0.74)} y={crimpH+Math.round(H*0.757)} textAnchor="middle" dominantBaseline="middle" fontFamily="'Oswald',sans-serif" fontWeight="900" fontSize={Math.round(W*0.082)} fill={c.rc} style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,1))"}}>{c.rar}</text>
          <text x={W/2} y={crimpH+Math.round(H*0.9)} textAnchor="middle" dominantBaseline="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700" fontSize={Math.round(W*0.06)} fill="#ffffff" opacity="0.5">2025 SEASON EDITION</text>
          <line x1={W-12} y1={crimpH} x2={W} y2={crimpH+12} stroke={c.acc} strokeWidth="1" opacity="0.7"/>
          <rect x="0.5" y="0.5" width={W-1} height={H-1} rx="3" fill="none" stroke={c.acc} strokeWidth="1" opacity="0.4"/>
        </g>
      </svg>
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
  function claim(){
    setClaimed(true); setParticles(true);
    setTimeout(function(){setParticles(false);},2000);
    setTimeout(function(){onClaim(reward);},600);
  }
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)"}}>
      {particles&&(
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:2100,overflow:"hidden"}}>
          {goldPts.map(function(p){return <div key={p.id} style={{position:"absolute",left:"50%",top:"50%",width:p.size,height:p.size,borderRadius:p.id%3===0?"50%":2,background:p.color,"--tx":p.tx+"px","--ty":p.ty+"px",animation:"particle "+p.dur+"ms ease-out "+p.delay+"ms forwards",opacity:0}}/>;})}
        </div>
      )}
      <div className="popup-anim" style={{background:"linear-gradient(160deg,rgba(10,8,2,0.97),rgba(20,15,0,0.98))",border:"1px solid rgba(245,197,24,0.35)",borderRadius:24,padding:"28px 24px",maxWidth:420,width:"94%",boxShadow:"0 0 80px rgba(245,197,24,0.15)"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:11,color:"rgba(245,197,24,0.6)",letterSpacing:"0.3em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:4}}>Daily Ritual</div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Welcome Back</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{fontSize:16}}>🔥</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#fb923c"}}>{currentStreak} Day Streak</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:24}}>
          {STREAK_REWARDS.map(function(r,i){
            var isClaimed=i<dayIdx; var isCurrent=i===dayIdx; var isFuture=i>dayIdx;
            return (
              <div key={r.day} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:"100%",aspectRatio:"1",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:r.isDynasty?18:14,background:isClaimed?"rgba(52,211,153,0.12)":isCurrent?"rgba(245,197,24,0.1)":"rgba(255,255,255,0.03)",border:isClaimed?"1px solid rgba(52,211,153,0.4)":isCurrent?"1px solid rgba(245,197,24,0.5)":"1px solid rgba(255,255,255,0.08)",boxShadow:isCurrent?"0 0 16px rgba(245,197,24,0.4)":"none",animation:isCurrent?"goldPulse 2s ease-in-out infinite":"none",opacity:isFuture?0.45:1,position:"relative"}}>
         {isClaimed?"✅":r.icon}
                </div>
                <div style={{fontSize:6,fontWeight:700,color:isCurrent?"#f5c518":isClaimed?"#34d399":"#333",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif"}}>D{r.day}</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"rgba(245,197,24,0.06)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:14,padding:"14px 18px",marginBottom:20,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:4}}>{reward.icon}</div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:"#f5c518",textTransform:"uppercase",letterSpacing:"0.1em"}}>{reward.label}</div>
          {reward.isDynasty&&<div style={{fontSize:10,color:"rgba(245,197,24,0.6)"}}>+ Guaranteed Elite Card</div>}
        </div>
        {!claimed?(
          <button onClick={claim} style={{width:"100%",background:"linear-gradient(135deg,#8a6200,#f5c518,#b8860b)",color:"#000",fontWeight:900,fontSize:15,padding:"15px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.15em",textTransform:"uppercase"}}>
            Claim Day {Math.min(currentStreak,7)} Reward
          </button>
        ):(
          <button onClick={onClose} style={{width:"100%",background:"linear-gradient(135deg,#004422,#00aa55)",color:"#fff",fontWeight:900,fontSize:14,padding:"14px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase"}}>
            Claimed! Enter The Vault
          </button>
        )}
        {!claimed&&<button onClick={onClose} style={{width:"100%",marginTop:10,background:"none",border:"none",color:"#333",fontSize:11,cursor:"pointer",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Skip for now</button>}
      </div>
    </div>
  );
}
function Notifications(props) {
  var notifs=props.notifs;
  return (
    <div style={{position:"fixed",top:64,right:12,zIndex:999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {notifs.map(function(n){
        return (
          <div key={n.id} className="notif" style={{backdropFilter:"blur(12px)",background:n.type==="sale"?"rgba(5,30,15,0.9)":n.type==="buy"?"rgba(15,5,30,0.9)":"rgba(20,16,5,0.9)",border:"1px solid "+(n.type==="sale"?"#34d399":n.type==="buy"?"#c4b5fd":"#f5c518"),borderRadius:12,padding:"10px 14px",maxWidth:250}}>
            <div style={{fontSize:11,fontWeight:700,color:n.type==="sale"?"#34d399":n.type==="buy"?"#c4b5fd":"#fbbf24",marginBottom:2}}>{n.title}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)"}}>{n.msg}</div>
          </div>
        );
      })}
    </div>
  );
}
function QuickBuyModal(props) {
  var listing=props.listing; var balance=props.balance; var onConfirm=props.onConfirm; var onClose=props.onClose;
  var canAfford=balance>=listing.price;
  var isGold=["Legendary","Dynasty","Legacy"].includes(listing.card.rarity);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className="popup-anim" onClick={function(e){e.stopPropagation();}} style={{background:"rgba(8,8,18,0.96)",backdropFilter:"blur(20px)",border:"1px solid "+(isGold?"rgba(245,197,24,0.4)":"rgba(100,100,200,0.3)"),borderRadius:20,padding:24,maxWidth:340,width:"92%"}}>
        <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",marginBottom:14,textAlign:"center",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Quick Buy Confirmation</div>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
          <MiniCard card={listing.card}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:"#fff",marginBottom:4,textTransform:"uppercase"}}>{listing.card.team}</div>
            <div style={{fontSize:10,color:"#555",marginBottom:10}}>{listing.card.sport} - {listing.seller}</div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:6,textAlign:"center",border:"1px solid rgba(251,191,36,0.2)"}}>
                <div style={{fontSize:8,color:"#666"}}>Daily</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#fbbf24"}}>{listing.card.daily}</div>
              </div>
              <div style={{flex:1,background:"rgba(0,0,0,0.5)",borderRadius:8,padding:6,textAlign:"center",border:"1px solid rgba(251,146,60,0.2)"}}>
                <div style={{fontSize:8,color:"#666"}}>Win</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#fb923c"}}>{listing.card.win}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{background:"rgba(0,0,0,0.4)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#555"}}>Price</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#f5c518"}}>{fmt(listing.price)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#555"}}>Balance</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:canAfford?"#34d399":"#f87171"}}>{fmt(balance)}</span></div>
          {!canAfford&&<div style={{fontSize:10,color:"#f87171",marginTop:6,textAlign:"center"}}>Insufficient coins</div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={canAfford?onConfirm:undefined} disabled={!canAfford} style={{flex:2,background:canAfford?"linear-gradient(90deg,#4a0080,#9d4edd)":"#111",color:canAfford?"#fff":"#333",fontWeight:900,fontSize:12,padding:10,borderRadius:999,border:"none",cursor:canAfford?"pointer":"not-allowed",opacity:canAfford?1:0.5,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Confirm</button>
          <button onClick={onClose} style={{flex:1,background:"rgba(255,255,255,0.04)",color:"#555",fontWeight:700,fontSize:12,padding:10,borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Cancel</button>
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
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className="popup-anim" onClick={function(e){e.stopPropagation();}} style={{background:"rgba(8,8,18,0.96)",backdropFilter:"blur(20px)",border:"1px solid rgba(100,100,200,0.3)",borderRadius:20,padding:24,maxWidth:300,width:"92%"}}>
        <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",marginBottom:14,textAlign:"center",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>List For Sale</div>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}><MiniCard card={card}/><div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:700,color:"#fff",textTransform:"uppercase"}}>{card.team}</div><div style={{fontSize:10,color:"#555"}}>{card.sport} - {card.rarity}</div></div></div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#555",marginBottom:6,letterSpacing:"0.1em",textTransform:"uppercase"}}>Your Price</div>
          <input type="number" value={price} onChange={function(e){setPrice(Math.max(1,parseInt(e.target.value)||0));}} style={{width:"100%",background:"rgba(0,0,0,0.5)",border:"1px solid #1e1e2e",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:14,fontWeight:700,outline:"none",fontFamily:"'JetBrains Mono',monospace"}}/>
          <div style={{fontSize:9,color:"#333",marginTop:4}}>Suggested: {fmt(suggested)} coins</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={function(){onConfirm(price);}} style={{flex:2,background:"linear-gradient(90deg,#004422,#00aa55)",color:"#fff",fontWeight:900,fontSize:12,padding:10,borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>List For {fmt(price)}</button>
          <button onClick={onClose} style={{flex:1,background:"rgba(255,255,255,0.04)",color:"#555",fontWeight:700,fontSize:12,padding:10,borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Cancel</button>
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
    <div className="popup-anim" style={{background:"rgba(6,4,16,0.98)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:24,padding:"32px 28px",maxWidth:460,width:"94%",zIndex:1,backdropFilter:"blur(20px)"}}>
      {/* Progress indicator */}
      <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:24}}>
        {["Account","Your Dynasty","Get Cards"].map(function(step,i){
          var done=i<1; var active=i===1;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:done?"#34d399":active?"#f5c518":"rgba(255,255,255,0.08)",border:"1.5px solid "+(done?"#34d399":active?"#f5c518":"rgba(255,255,255,0.12)"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:9,fontWeight:900,color:done?"#000":active?"#000":"#444",fontFamily:"'Oswald',sans-serif"}}>{done?"✓":i+1}</span>
              </div>
              <span style={{fontSize:9,color:active?"#f5c518":done?"#34d399":"#333",fontFamily:"'Oswald',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{step}</span>
              {i<2&&<div style={{width:20,height:1,background:"rgba(255,255,255,0.08)"}}/>}
            </div>
          );
        })}
      </div>

      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:28,marginBottom:8}}>⚡</div>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Build Your Dynasty</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.6,maxWidth:340,margin:"0 auto"}}>Choose a name that strikes fear into rival collectors. Pick your sport and team to get matched cards in your Genesis pack.</div>
      </div>

      {/* Username */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:6}}>Your Dynasty Name</div>
        <div style={{position:"relative"}}>
          <input
            value={username}
            onChange={function(e){setUsername(e.target.value);setErr("");}}
            placeholder="e.g. GrailHunter99, DynastyKing..."
            maxLength={20}
            style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid "+(username.length>=3?"rgba(245,197,24,0.4)":"rgba(255,255,255,0.1)"),borderRadius:12,padding:"12px 44px 12px 14px",color:"#fff",fontSize:14,fontWeight:700,outline:"none",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.05em",transition:"border-color 0.2s"}}
          />
          <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'JetBrains Mono',monospace"}}>{username.length}/20</span>
        </div>
      </div>

      {/* Favourite sport pills */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:8}}>Favourite Sport <span style={{color:"rgba(255,255,255,0.2)",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}>(optional)</span></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.keys(ALL_TEAMS).map(function(s){
            var active=favSport===s;
            var sc=SPORT_COLORS[s]||"#888";
            return (
              <button key={s} onClick={function(){setFavSport(active?"":s);setFavTeam("");}}
                style={{padding:"7px 16px",borderRadius:999,border:"1.5px solid "+(active?sc:sc+"44"),background:active?sc+"22":"transparent",color:active?sc:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.15s"}}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Favourite team — only shown after sport is picked */}
      {favSport&&teamsForSport.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:8}}>Favourite Team</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",maxHeight:140,overflowY:"auto",paddingRight:4}}>
            {teamsForSport.map(function(team){
              var active=favTeam===team;
              var col=getColors(team)[0];
              return (
                <button key={team} onClick={function(){setFavTeam(active?"":team);}}
                  style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid "+(active?col:col+"33"),background:active?col+"22":"rgba(0,0,0,0.3)",color:active?"#fff":"rgba(255,255,255,0.45)",fontSize:10,fontWeight:active?700:400,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.05em",transition:"all 0.15s",display:"flex",alignItems:"center",gap:5}}>
                  {active&&<span style={{fontSize:8}}>✓</span>}
                  {team}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {err&&<div style={{fontSize:11,color:"#f87171",marginBottom:10,textAlign:"center"}}>{err}</div>}

      <button onClick={handleContinue}
        style={{width:"100%",background:"linear-gradient(135deg,#7a5500,#f5c518,#b8860b)",color:"#000",fontWeight:900,fontSize:14,padding:"14px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>
        Open My Genesis Pack →
      </button>
      <div style={{textAlign:"center"}}>
        <button onClick={function(){onComplete(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"rgba(255,255,255,0.25)",fontFamily:"'Inter',sans-serif",padding:0}}>Skip — use defaults</button>
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
        // signUp returns session immediately if email confirmation is off in Supabase
        if(res&&res.data&&res.data.session){onComplete(cards,500);}
        else{setErr("Check your email for a confirmation link, then log in.");}
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
      <button onClick={handleGoogle} disabled={loading}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"#fff",color:"#1a1a1a",fontWeight:700,fontSize:13,padding:"12px 16px",borderRadius:12,border:"none",cursor:loading?"not-allowed":"pointer",marginBottom:14,opacity:loading?0.7:1,fontFamily:"'Inter',sans-serif"}}>
        <svg width={18} height={18} viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {loading?"Connecting...":"Continue with Google"}
      </button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
        <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em"}}>OR</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
      </div>
      {isSignup&&<div style={{marginBottom:10}}><input value={name} onChange={function(e){setName(e.target.value);setErr("");}} placeholder="Your name" style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif"}}/></div>}
      <div style={{marginBottom:10}}><input type="email" value={email} onChange={function(e){setEmail(e.target.value);setErr("");}} placeholder="Email address" style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif"}}/></div>
      <div style={{marginBottom:err?8:14}}><input type="password" value={pass} onChange={function(e){setPass(e.target.value);setErr("");}} placeholder="Password" style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Inter',sans-serif"}}/></div>
      {err&&<div style={{fontSize:11,color:"#f87171",marginBottom:10,textAlign:"center"}}>{err}</div>}
      <button onClick={handleSubmit} disabled={loading}
        style={{width:"100%",background:loading?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#7a5500,#f5c518,#b8860b)",color:loading?"#555":"#000",fontWeight:900,fontSize:13,padding:"13px",borderRadius:999,border:"none",cursor:loading?"not-allowed":"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>
        {loading?"Please wait...":(isSignup?"Create Account & Enter Vault":"Sign In")}
      </button>
      <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
        {isSignup&&<button onClick={function(){onComplete(cards,500);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'Inter',sans-serif",padding:0}}>Skip for now — continue as guest</button>}
        {onBack&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'Inter',sans-serif",padding:0}}>← Back</button>}
      </div>
    </div>
  );
}

function Onboarding(props) {
  var onComplete=props.onComplete;
  var onSavePrefs=props.onSavePrefs||function(){};
  var isNewUser=props.isNewUser||false;
  var phaseState=useState("landing"); var phase=phaseState[0]; var setPhase=phaseState[1];

  // When auth completes and isNewUser becomes true, jump to profile_setup
  // (useState initial value only runs once, so we need useEffect to react to prop changes)
  useEffect(function(){
    if(isNewUser) setPhase("profile_setup");
  },[isNewUser]);
  var glowingState=useState(false); var glowing=glowingState[0]; var setGlowing=glowingState[1];
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
  return (
    <div style={{minHeight:"100vh",background:"#04040a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,animation:"goldVein 4s ease-in-out infinite"}} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="vb"><feGaussianBlur stdDeviation="3"/></filter>
          <linearGradient id="vg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f5c518" stopOpacity="0"/><stop offset="50%" stopColor="#f5c518" stopOpacity="0.5"/><stop offset="100%" stopColor="#b8860b" stopOpacity="0"/></linearGradient>
        </defs>
        <path d="M-50,300 Q150,80 300,200 T600,150 T900,300" stroke="url(#vg1)" strokeWidth="1.5" fill="none" filter="url(#vb)"/>
        <path d="M-50,400 Q200,500 400,350 T750,420 T950,300" stroke="url(#vg1)" strokeWidth="1" fill="none" filter="url(#vb)" opacity="0.6"/>
      </svg>
      {phase==="landing"&&(
        <div className="fade-in" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:26,zIndex:1,maxWidth:560,width:"100%",textAlign:"center"}}>
          <div>
            <div className="gold-logo" style={{fontSize:"clamp(38px,9vw,66px)",fontWeight:900,lineHeight:1,letterSpacing:4}}>CARD DYNASTY</div>
            <div style={{width:130,height:1,background:"linear-gradient(90deg,transparent,#f5c518,transparent)",margin:"8px auto"}}/>
            <div style={{fontSize:9,color:"rgba(245,197,24,0.38)",letterSpacing:8,fontWeight:600,textTransform:"uppercase"}}>Collect - Trade - Dominate</div>
          </div>
          <div style={{animation:"textReveal 0.8s 0.3s ease-out both"}}>
            <div style={{fontSize:"clamp(18px,4.5vw,28px)",fontWeight:900,color:"#fff",lineHeight:1.25,marginBottom:10,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>A New Era of Collecting Begins.</div>
            <div style={{fontSize:"clamp(12px,2.5vw,14px)",color:"rgba(255,255,255,0.4)",lineHeight:1.75,maxWidth:420,margin:"0 auto"}}>The vault is open. Build your empire, command your collection, and dominate the game.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <div style={{animation:"genesisPulse 2.5s ease-in-out infinite",borderRadius:4,display:"inline-block"}}>
              <BoosterPack packId="genesis" size={130} floating={false}/>
            </div>
            <button onClick={function(){setPhase("signup");}} style={{background:"linear-gradient(135deg,#7a5500,#f5c518,#a07000)",color:"#000",fontWeight:900,fontSize:13,padding:"14px 38px",borderRadius:999,border:"none",cursor:"pointer",letterSpacing:"0.1em",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",animation:"claimPulse 2s ease-in-out infinite"}}>
              Claim Your Starter Pack (Free)
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Already have an account?</span>
              <button onClick={function(){setPhase("login");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:"#f5c518",fontFamily:"'Oswald',sans-serif",textDecoration:"underline",textUnderlineOffset:3,letterSpacing:"0.05em",textTransform:"uppercase",padding:0}}>Log In</button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["NFL","NBA","MLB","MLS","College"].map(function(s){
              return <span key={s} style={{fontSize:9,fontWeight:700,padding:"4px 14px",borderRadius:999,border:"1px solid "+(SPORT_COLORS[s]||"#888")+"55",color:SPORT_COLORS[s]||"#888",background:(SPORT_COLORS[s]||"#888")+"11"}}>{s}</span>;
            })}
          </div>
        </div>
      )}

      {/* ── STEP 1: SIGN UP — shown before pack is opened ── */}
      {phase==="signup"&&(
        <div className="popup-anim" style={{background:"rgba(6,4,16,0.98)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:24,padding:"32px 28px",maxWidth:480,width:"94%",zIndex:1,backdropFilter:"blur(20px)"}}>
          {/* Game explainer */}
          <div style={{textAlign:"center",marginBottom:22}}>
            <div className="gold-logo" style={{fontSize:20,fontWeight:900,letterSpacing:3,marginBottom:10}}>CARD DYNASTY</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16,textAlign:"left"}}>
              {[
                {icon:"📦",title:"Collect Cards",desc:"Pull NFL, NBA, MLB, MLS & College cards from foil packs"},
                {icon:"🪙",title:"Earn Daily Coins",desc:"Every card generates passive income — the rarer the card, the more it earns"},
                {icon:"🔴",title:"Live Game Boosts",desc:"Cards glow and earn 1.5× when your team is playing in real time"},
                {icon:"📈",title:"Trade & Dominate",desc:"List cards on the Exchange, complete sets, and climb the leaderboard"},
              ].map(function(f,i){
                return (
                  <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 10px"}}>
                    <div style={{fontSize:20,marginBottom:6}}>{f.icon}</div>
                    <div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#f5c518",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{f.title}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.5}}>{f.desc}</div>
                  </div>
                );
              })}
            </div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Create Your Account</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Save your collection and progress across devices</div>
          </div>
          <AuthForm mode="signup" onComplete={function(){setPhase("profile_setup");}} cards={[]} onBack={function(){setPhase("landing");}}/>
        </div>
      )}

      {/* ── STEP 2: PROFILE SETUP — username + fav sport & team ── */}
      {phase==="profile_setup"&&(
        <ProfileSetupStep onComplete={function(prefs){
          if(prefs) onSavePrefs(prefs);
          claim();
        }}/>
      )}

      {/* ── LOG IN (side branch from landing) ── */}
      {phase==="login"&&(
        <div className="popup-anim" style={{background:"rgba(8,6,18,0.98)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:24,padding:"36px 32px",maxWidth:400,width:"92%",zIndex:1,backdropFilter:"blur(20px)"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div className="gold-logo" style={{fontSize:22,fontWeight:900,letterSpacing:3,marginBottom:6}}>CARD DYNASTY</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"0.1em"}}>Welcome Back</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:4}}>Sign in to your vault</div>
          </div>
          <AuthForm mode="login" onComplete={onComplete} cards={cards} onBack={function(){setPhase("landing");}}/>
        </div>
      )}

      {phase==="shaking"&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,zIndex:1,position:"relative"}}>
          <div style={{position:"relative"}}>
            <ParticleBurst active={particles}/>
            <BoosterPack packId="genesis" size={130} shaking={true} floating={false}/>
          </div>
        </div>
      )}
      {phase==="reveal"&&!celebrate&&(
        <div className="slide-up" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,zIndex:1,width:"100%"}}>
          <div style={{fontSize:11,color:"#f5c518",letterSpacing:"0.15em",fontWeight:700,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>{allFlipped?"Your Dynasty Begins!":"Click Each Card — "+flippedIds.length+"/5"}</div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12}}>{cards.map(function(c){return <FlipCard key={c.id} card={c} onFlip={handleFlip}/>;})}</div>
        </div>
      )}
      {celebrate&&(
        <div className="popup-anim" style={{background:"rgba(8,6,2,0.97)",borderRadius:24,padding:"32px 36px",maxWidth:400,width:"92%",textAlign:"center",boxShadow:"0 0 0 1.5px #f5c518aa,0 0 60px rgba(245,197,24,0.35)",zIndex:1}}>
          <div style={{fontSize:38,marginBottom:8}}>👑</div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:900,color:"#fff",marginBottom:6,textTransform:"uppercase"}}>Your Dynasty Has Started!</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:"#f5c518",marginBottom:18}}>🪙 +500 Coins</div>
          <button onClick={function(){onComplete(cards,500);}} style={{width:"100%",background:"linear-gradient(135deg,#7a5500,#f5c518,#a07000)",color:"#000",fontWeight:900,fontSize:14,padding:"14px",borderRadius:999,border:"none",cursor:"pointer",letterSpacing:"0.15em",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>
            Enter The Vault
          </button>
        </div>
      )}
    </div>
  );
}
function Shop(props) {
  var balance=props.balance; var onBuy=props.onBuy; var pityCount=props.pityCount;
  return (
    <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:700,letterSpacing:"0.15em",marginBottom:6,textTransform:"uppercase"}}>Wax Wall</div>
        {pityCount>0&&<div style={{fontSize:11,color:"#fb923c",marginTop:8}}>Pity: {pityCount}/10 Standard packs without Elite+</div>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:20,justifyContent:"center"}}>
        {PACK_TYPES.map(function(pt){
          var canAfford=balance>=pt.cost;
          return (
            <div key={pt.id} style={{flex:"1 1 220px",minWidth:210,maxWidth:265,background:"rgba(8,8,18,0.85)",backdropFilter:"blur(12px)",borderRadius:20,padding:22,border:"1px solid #1a1a2e",position:"relative",overflow:"hidden"}}>
              {pt.badge&&<div style={{position:"absolute",top:14,right:14,fontSize:8,fontWeight:900,padding:"3px 9px",borderRadius:999,background:pt.id==="obsidian"?"#9d4edd":"#f5c518",color:pt.id==="obsidian"?"#fff":"#000",letterSpacing:1,fontFamily:"'Oswald',sans-serif"}}>{pt.badge}</div>}
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><BoosterPack packId={pt.id} size={100} floating={true}/></div>
              <div style={{textAlign:"center",marginBottom:10}}>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:700,color:"#fff",textTransform:"uppercase"}}>{pt.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:3}}>{pt.subtitle}</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginBottom:10}}>
                {Object.keys(pt.rates).filter(function(k){return pt.rates[k]>0;}).map(function(r){
         return <span key={r} style={{fontSize:7,fontWeight:700,padding:"2px 6px",borderRadius:999,background:"rgba(0,0,0,0.5)",color:RCOLORS[r]||"#aaa",border:"1px solid "+(RCOLORS[r]||"#aaa")+"33",textTransform:"uppercase"}}>{r} {pt.rates[r]}%</span>;
                })}
              </div>
              {pt.guarantee&&<div style={{textAlign:"center",fontSize:9,color:"#34d399",fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>+ {pt.guarantee} guaranteed</div>}
              <button onClick={function(){onBuy(pt);}} disabled={!canAfford} style={{width:"100%",padding:10,borderRadius:999,border:"none",fontSize:12,fontWeight:900,cursor:canAfford?"pointer":"not-allowed",background:canAfford?(pt.id==="obsidian"?"linear-gradient(90deg,#4a0080,#9d4edd)":pt.id==="jumbo"?"linear-gradient(90deg,#2a0060,#11998e)":"linear-gradient(90deg,#0a2a60,#3a80ff)"):"rgba(255,255,255,0.05)",color:canAfford?"#fff":"#333",opacity:canAfford?1:0.5,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>
                {fmt(pt.cost)} Coins - {pt.cards} Cards
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function OpeningScreen(props) {
  var pack=props.pack; var cards=props.cards; var onDone=props.onDone; var winners=props.winners;
  var shakingState=useState(true); var shaking=shakingState[0]; var setShaking=shakingState[1];
  var showCardsState=useState(false); var showCards=showCardsState[0]; var setShowCards=showCardsState[1];
  var glowingState=useState(false); var setGlowing=glowingState[1];
  var partState=useState(false); var particles=partState[0]; var setParticles=partState[1];
  var flippedState=useState([]); var flippedIds=flippedState[0]; var setFlippedIds=flippedState[1];
  var summaryState=useState(false); var showSummary=summaryState[0]; var setShowSummary=summaryState[1];
  useEffect(function(){
    setGlowing(true);
    var t=setTimeout(function(){setParticles(true);setTimeout(function(){setParticles(false);},1200);setShaking(false);setTimeout(function(){setShowCards(true);},300);},1500);
    return function(){clearTimeout(t);};
  },[]);
  function handleFlip(c){setFlippedIds(function(p){return p.concat([c.id]);});}
  var allFlipped=flippedIds.length===cards.length&&cards.length>0;
  useEffect(function(){if(allFlipped)setTimeout(function(){setShowSummary(true);},700);},[allFlipped]);
  var fc=flippedIds.map(function(id){return cards.find(function(c){return c.id===id;});}).filter(Boolean);
  var totalDaily=fc.reduce(function(s,c){return s+c.daily;},0);
  var totalWin=fc.reduce(function(s,c){return s+c.win;},0);
  var rarCounts=cards.reduce(function(a,c){a[c.rarity]=(a[c.rarity]||0)+1;return a;},{});
  return (
    <div style={{minHeight:"calc(100vh - 110px)",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 16px",gap:24}}>
      {!showCards&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
          <div style={{position:"relative"}}><ParticleBurst active={particles}/><BoosterPack packId={pack.id} size={140} shaking={shaking} floating={!shaking}/></div>
          {shaking&&<div style={{fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Ripping Pack...</div>}
        </div>
      )}
      {showCards&&!showSummary&&(
        <div className="slide-up" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%"}}>
          <div style={{fontSize:11,color:"#f5c518",letterSpacing:"0.15em",fontWeight:700,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>{allFlipped?"All Revealed!":"Click Each Card - "+flippedIds.length+"/"+cards.length}</div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:12,maxWidth:760}}>{cards.map(function(c){return <FlipCard key={c.id} card={c} winners={winners} onFlip={handleFlip}/>;})}</div>
        </div>
      )}
      {showSummary&&(
        <div className="popup-anim" style={{background:"rgba(8,8,16,0.96)",backdropFilter:"blur(20px)",borderRadius:20,padding:"24px 28px",maxWidth:360,width:"100%",boxShadow:"0 0 0 1px rgba(245,197,24,0.35)"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:24,marginBottom:4}}>📊</div>
            <div style={{fontSize:10,color:"#555",letterSpacing:"0.2em",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Pack Summary</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#555"}}>Cards</span><span style={{fontWeight:700,color:"#fff"}}>{cards.length}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#555"}}>Daily Yield</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#fbbf24"}}>+{fmt(totalDaily)}/day</span></div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #1a1a2e"}}><span style={{fontSize:12,color:"#555"}}>Win Pool</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#fb923c"}}>+{fmt(totalWin)}/win</span></div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14,justifyContent:"center"}}>
            {Object.keys(rarCounts).map(function(r){return <span key={r} style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:999,background:"rgba(0,0,0,0.5)",color:RCOLORS[r]||"#aaa",border:"1px solid "+(RCOLORS[r]||"#aaa")+"33",textTransform:"uppercase"}}>{r} x{rarCounts[r]}</span>;})}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onDone} style={{flex:2,background:"linear-gradient(90deg,#7a5500,#f5c518)",color:"#000",fontWeight:900,fontSize:12,padding:10,borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Add To Inventory</button>
            <button style={{flex:1,background:"rgba(255,255,255,0.04)",color:"#555",fontWeight:700,fontSize:11,padding:10,borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Share</button>
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
  return (
    <div>
      <div style={{background:"rgba(8,8,16,0.9)",border:"1px solid rgba(245,197,24,0.15)",borderRadius:16,padding:16,marginBottom:16}}>
        <div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",marginBottom:4,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Total Daily Passive Income</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:30,fontWeight:700,color:"#f5c518",lineHeight:1}}>{fmt(total)}</div><div style={{fontSize:11,color:"#555",marginBottom:3}}>coins/day</div></div>
        <div style={{display:"flex",gap:12,marginTop:6,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"#555"}}>Base: <span style={{color:"#fbbf24",fontWeight:700}}>{fmt(base)}</span></span>
          {bonus>0&&<span style={{fontSize:11,color:"#555"}}>Bonus: <span style={{color:"#34d399",fontWeight:700}}>+{fmt(bonus)}</span></span>}
          {done>0&&<span style={{fontSize:11,color:"#34d399",fontWeight:700}}>{done} set{done>1?"s":""} complete!</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {sports.map(function(s){return <button key={s} onClick={function(){setFilter(s);}} style={{fontSize:10,fontWeight:700,padding:"4px 12px",borderRadius:999,border:"1px solid",background:filter===s?(SPORT_COLORS[s]||"#f5c518"):"rgba(0,0,0,0.5)",color:filter===s?"#000":"#444",borderColor:filter===s?(SPORT_COLORS[s]||"#f5c518"):"#1e1e2e",cursor:"pointer"}}>{s}</button>;})}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {divs.map(function(name){
          var d=ownedByDiv[name];
          var pct=Math.round((d.count/d.total)*100);
          var sc=SPORT_COLORS[d.sport]||"#f5c518";
          return (
            <div key={name} style={{background:"rgba(8,8,16,0.8)",border:d.complete?"1px solid rgba(52,211,153,0.4)":"1px solid #1a1a2e",borderRadius:12,padding:"10px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
         <span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:999,background:sc+"1a",color:sc,border:"1px solid "+sc+"44",textTransform:"uppercase"}}>{d.sport}</span>
         <span style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:600,color:"#ccc"}}>{name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
         <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#444"}}>{d.count}/{d.total}</span>
         {d.complete&&<span style={{fontSize:8,fontWeight:900,padding:"2px 8px",borderRadius:999,background:"#34d399",color:"#000",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Complete!</span>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div className="set-bar"><div className="set-bar-fill" style={{width:pct+"%",background:d.complete?"linear-gradient(90deg,#34d399,#059669)":"linear-gradient(90deg,"+sc+"88,"+sc+")"}}/></div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:d.complete?"#34d399":"#444",fontWeight:700,minWidth:28}}>{pct}%</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {d.teams.map(function(team){
         var has=d.owned.has(team);
         return <span key={team} style={{fontSize:8,padding:"2px 8px",borderRadius:5,fontWeight:has?700:400,background:has?sc+"22":"rgba(0,0,0,0.3)",color:has?sc:"#2a2a3a",border:"1px solid "+(has?sc+"55":"#1a1a2e")}}>{has?"+ ":""}{team}</span>;
                })}
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
    <div style={{maxWidth:820,margin:"0 auto",padding:16}}>
      {buyModal&&<QuickBuyModal listing={buyModal} balance={balance} onConfirm={function(){onBuy(buyModal);setBuyModal(null);}} onClose={function(){setBuyModal(null);}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:700,letterSpacing:"0.1em",marginBottom:2,textTransform:"uppercase"}}>Obsidian Exchange</div><div style={{fontSize:11,color:"#444"}}>Live P2P market - rotates every 60s</div></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div className="live-dot"/><span style={{fontSize:10,color:"#34d399",fontWeight:700}}>LIVE</span><span style={{fontSize:10,color:"#2a2a2a"}}>{countdown}s</span></div>
          <button onClick={onRefresh} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #1e1e2e",color:"#555",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:999,cursor:"pointer"}}>Refresh</button>
        </div>
      </div>
      {grailFeed.length>0&&(
        <div style={{background:"rgba(6,6,14,0.9)",border:"1px solid #1a1a2e",borderRadius:12,padding:"10px 14px",marginBottom:14,overflowX:"auto"}}>
          <div style={{fontSize:8,color:"#333",letterSpacing:"0.2em",marginBottom:6,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Last Big Sales</div>
          <div style={{display:"flex",gap:16,minWidth:"max-content"}}>
            {grailFeed.map(function(g,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#555",whiteSpace:"nowrap"}}><span style={{color:RCOLORS[g.card.rarity]||"#aaa",fontWeight:700}}>•</span><span>{g.msg}</span></div>;})}
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {["All","Rare","Elite","Legacy","Legendary","Dynasty"].map(function(f){
              return <button key={f} onClick={function(){setFilter(f);}} style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:999,border:"1px solid",background:filter===f?"rgba(30,30,60,0.9)":"transparent",color:filter===f?(RCOLORS[f]||"#fff"):"#444",borderColor:filter===f?(RCOLORS[f]||"#5555aa"):"#1e1e2e",cursor:"pointer",textTransform:"uppercase"}}>{f}</button>;
            })}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(function(listing){
              var ac=RCOLORS[listing.card.rarity]||"#aaa";
              var canAfford=balance>=listing.price;
              var isShaking=shakeTeams[listing.card.team];
              var liveCol=getColors(listing.card.team)[0];
              return (
                <div key={listing.id} className={"mrow"+(isShaking?" haptic":"")}
         style={{borderColor:isShaking?liveCol+"88":"#1e1e3a",boxShadow:isShaking?"0 0 18px "+liveCol+"55":"none",transition:"border-color 0.2s,box-shadow 0.2s"}}>
         <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <MiniCard card={listing.card}/>
          <div style={{flex:1,minWidth:0}}>
           <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <span style={{fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:700,color:"#ddd",textTransform:"uppercase"}}>{listing.card.team}</span>
            <span style={{fontSize:8,padding:"1px 6px",borderRadius:999,background:"rgba(0,0,0,0.5)",color:ac,fontWeight:700,border:"1px solid "+ac+"33",textTransform:"uppercase"}}>{listing.card.rarity}</span>
            {isShaking&&<span style={{fontSize:8,fontWeight:900,color:"#00ff50",fontFamily:"'Oswald',sans-serif",animation:"pulse 0.5s ease-in-out infinite"}}>LIVE ⚡</span>}
           </div>
           <div style={{fontSize:10,color:"#333",marginBottom:4}}>{listing.seller} - {listing.card.sport}</div>
           <div style={{display:"flex",gap:10}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#fbbf24"}}>🪙 {listing.card.daily}/d</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#fb923c"}}>🔥 {listing.card.win}</span>
           </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
           <div style={{fontSize:9,fontWeight:700,color:listing.trend==="up"?"#34d399":"#f87171",marginBottom:3}}>{listing.trend==="up"?"▲":"▼"} {listing.trendPct}%</div>
           <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:"#f5c518",marginBottom:6}}>{fmt(listing.price)}</div>
           <button onClick={function(){setBuyModal(listing);}} style={{fontSize:10,fontWeight:900,padding:"5px 14px",borderRadius:999,border:"none",background:canAfford?"linear-gradient(90deg,#4a0080,#9d4edd)":"rgba(255,255,255,0.04)",color:canAfford?"#fff":"#333",cursor:canAfford?"pointer":"not-allowed",opacity:canAfford?1:0.6,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>
            {canAfford?"Quick Buy":"No Funds"}
           </button>
          </div>
         </div>
                </div>
              );
            })}
          </div>
        </div>
        {myListings.length>0&&(
          <div style={{width:200,flexShrink:0}}>
            <div style={{fontSize:9,color:"#444",letterSpacing:"0.2em",marginBottom:8,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>My Listings</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {myListings.map(function(l){
                var pct=Math.min(100,Math.floor(((Date.now()-l.listedAt)/(l.duration*1000))*100));
                return (
         <div key={l.id} style={{background:"rgba(6,6,14,0.9)",border:"1px solid rgba(100,100,180,0.2)",borderRadius:10,padding:10}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><MiniCard card={l.card}/><div style={{flex:1}}><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#ccc",textTransform:"uppercase"}}>{l.card.team}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#f5c518",fontWeight:700}}>{fmt(l.price)}</div></div></div>
          <div style={{background:"#0a0a14",borderRadius:999,height:3,overflow:"hidden"}}><div style={{height:"100%",background:"linear-gradient(90deg,#006633,#34d399)",width:pct+"%",transition:"width 1s linear",borderRadius:999}}/></div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#333",marginTop:3,textAlign:"right"}}>{pct}%</div>
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
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020818,#040e20,#020818)",paddingBottom:40}}>
      <div style={{background:"rgba(2,8,24,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(68,136,255,0.2)",padding:"12px 20px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:999,padding:"6px 14px",color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Back</button>
        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,"+player.color+"cc,"+player.color+"55)",border:"2px solid "+player.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>{player.avatar}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"0.1em",textTransform:"uppercase"}}>{player.name}'s Vault</div>
          <div style={{fontSize:10,color:"#4488ff"}}>{player.bio}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#fbbf24"}}>🪙 {fmt(player.yield)}/day</div>
          <div style={{fontSize:9,color:"#555",textTransform:"uppercase"}}>{player.inventory.length} cards</div>
        </div>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:700,color:"#4488ff",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Featured Five</div>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            {featured.map(function(c){
              var isShaking=shakeTeams[c.team];
              var liveCol=getColors(c.team)[0];
              return (
                <div key={c.id} style={{position:"relative",flexShrink:0}} className={isShaking?"haptic":""}>
         {isShaking&&<div style={{position:"absolute",inset:-4,borderRadius:16,boxShadow:"0 0 20px 6px "+liveCol+"88",pointerEvents:"none",zIndex:25,animation:"liveBorderFlash 0.4s ease-in-out infinite"}}/>}
         <FlipCard card={c} autoFlip={true}/>
         <button onClick={function(){toggleLike(c.id);}} style={{position:"absolute",bottom:56,right:6,zIndex:20,background:liked[c.id]?"rgba(239,68,68,0.2)":"rgba(0,0,0,0.6)",border:liked[c.id]?"1px solid rgba(239,68,68,0.6)":"1px solid rgba(255,255,255,0.15)",borderRadius:999,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:700,color:liked[c.id]?"#f87171":"#888"}}>
          {liked[c.id]?"❤️":"🤍"} {(c.likes||0)+(liked[c.id]?1:0)}
         </button>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={function(){setShowSets(function(s){return !s;});}} style={{width:"100%",background:"rgba(68,136,255,0.08)",border:"1px solid rgba(68,136,255,0.25)",borderRadius:10,padding:"10px 16px",color:"#4488ff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",marginBottom:16,textAlign:"left"}}>
          {showSets?"▼":"▶"} View Set Progress
        </button>
        {showSets&&(
          <div style={{marginBottom:20,display:"flex",flexDirection:"column",gap:6}}>
            {Object.keys(divsForPlayer).map(function(div){
              var d=divsForPlayer[div];
              var pct=Math.round((d.count/d.total)*100);
              var sc=SPORT_COLORS[d.sport]||"#f5c518";
              return (
                <div key={div} style={{background:"rgba(4,8,24,0.8)",border:d.complete?"1px solid rgba(52,211,153,0.3)":"1px solid #0e1830",borderRadius:10,padding:"8px 12px"}}>
         <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
           <span style={{fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:999,background:sc+"1a",color:sc,border:"1px solid "+sc+"33",textTransform:"uppercase"}}>{d.sport}</span>
           <span style={{fontFamily:"'Oswald',sans-serif",fontSize:11,color:"#aac"}}>{div}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
           <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#444"}}>{d.count}/{d.total}</span>
           {d.complete&&<span style={{fontSize:7,fontWeight:900,background:"#34d399",color:"#000",padding:"1px 6px",borderRadius:999}}>DONE</span>}
          </div>
         </div>
         <div style={{background:"#0a0e1a",borderRadius:999,height:4,overflow:"hidden",marginBottom:5}}>
          <div style={{height:"100%",width:pct+"%",background:d.complete?"linear-gradient(90deg,#34d399,#059669)":"linear-gradient(90deg,"+sc+"88,"+sc+")",borderRadius:999,transition:"width 0.8s"}}/>
         </div>
         <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
          {d.teams.map(function(team){
           var has=d.owned.has(team);
           var iMine=myInventory.some(function(c){return c.team===team;});
           return <span key={team} style={{fontSize:7,padding:"1px 6px",borderRadius:4,background:has?sc+"22":"rgba(0,0,0,0.3)",color:has?sc:iMine?"#f5c51866":"#1e2a3a",border:"1px solid "+(has?sc+"44":iMine?"rgba(245,197,24,0.2)":"#0e1830"),fontWeight:has?700:400}}>{has?"+ ":iMine?"🪙 ":""}{team}</span>;
          })}
         </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:700,color:"#4488ff",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Full Collection</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:16}}>
          {sorted.map(function(c,i){
            var isShaking=shakeTeams[c.team];
            var liveCol=getColors(c.team)[0];
            return (
              <div key={c.id+i} style={{position:"relative"}} className={isShaking?"haptic":""}>
                {isShaking&&<div style={{position:"absolute",inset:-4,borderRadius:16,boxShadow:"0 0 20px 6px "+liveCol+"88",pointerEvents:"none",zIndex:25,animation:"liveBorderFlash 0.4s ease-in-out infinite"}}/>}
                <FlipCard card={c} autoFlip={true}/>
                <button onClick={function(){toggleLike(c.id);}} style={{position:"absolute",bottom:56,right:6,zIndex:20,background:liked[c.id]?"rgba(239,68,68,0.2)":"rgba(0,0,0,0.6)",border:liked[c.id]?"1px solid rgba(239,68,68,0.5)":"1px solid rgba(255,255,255,0.12)",borderRadius:999,padding:"3px 7px",cursor:"pointer",fontSize:9,fontWeight:700,color:liked[c.id]?"#f87171":"#666"}}>
         {liked[c.id]?"❤️":"🤍"} {(c.likes||0)+(liked[c.id]?1:0)}
                </button>
              </div>
            );
          })}
        </div>
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
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:"rgba(10,10,20,0.9)",border:isFollowing?"1px solid rgba(245,197,24,0.2)":"1px solid #1a1a2e"}}>
      <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,"+player.color+"cc,"+player.color+"55)",border:"2px solid "+player.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>{player.avatar}</span>
      </div>
      <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={onView}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
          <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,color:"#ddd",textTransform:"uppercase"}}>{player.name}</span>
          <span style={{fontSize:7,fontWeight:700,padding:"1px 5px",borderRadius:999,background:ac+"22",color:ac,border:"1px solid "+ac+"44",textTransform:"uppercase"}}>{topRarity}</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#fbbf24"}}>🪙 {fmt(player.yield)}/day</span>
          <span style={{fontSize:9,color:"#555"}}>{(player.inventory||[]).length} cards</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
        <button onClick={function(){onFollow(player.name);}} style={{padding:"5px 14px",borderRadius:999,border:isFollowing?"1px solid #f5c518":"1px solid rgba(255,255,255,0.15)",background:isFollowing?"linear-gradient(135deg,#f5c518,#b8860b)":"rgba(255,255,255,0.04)",color:isFollowing?"#000":"#888",fontSize:10,fontWeight:900,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>{isFollowing?"Following":"+ Follow"}</button>
        <button onClick={onView} style={{padding:"4px 12px",borderRadius:999,border:"1px solid rgba(68,136,255,0.3)",background:"rgba(68,136,255,0.06)",color:"#4488ff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>View Vault</button>
      </div>
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
          return {id:p.id,name:p.username||"Collector",avatar:(p.avatar_initials||"??").slice(0,2).toUpperCase(),color:p.avatar_color||"#f5c518",favTeam:p.fav_team||"",bio:p.bio||"",yield:yld,inventory:pCards};
        }).filter(function(p){return p.inventory.length>0;});
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
    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"40vh"}}><div style={{color:"#444",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.15em"}}>Loading Vault...</div></div>;
  }
  var filtered=players.filter(function(p){return p.name.toLowerCase().includes(search.toLowerCase());});
  var following=players.filter(function(p){return followed.includes(p.name)||followed.includes(p.id);});
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 40px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Social</div>
        <div style={{fontSize:11,color:"#444"}}>Discover collectors · Follow rivals · Raid vaults</div>
      </div>
      <div style={{position:"relative",marginBottom:20}}>
        <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search players..." style={{width:"100%",background:"rgba(8,8,18,0.9)",border:"1px solid #1e1e2e",borderRadius:12,padding:"11px 14px 11px 36px",color:"#fff",fontSize:13,outline:"none"}}/>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#444",pointerEvents:"none"}}>🔍</div>
      </div>
      {loading&&<div style={{textAlign:"center",padding:40,color:"#333",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>Loading Players...</div>}
      {!loading&&players.length===0&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:12}}>👥</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#444",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>No other collectors yet</div><div style={{fontSize:11,color:"#333"}}>Invite friends — their vaults will appear here</div></div>}
      {!loading&&following.length>0&&!search&&<div style={{marginBottom:20}}><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#f5c518",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Following ({following.length})</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{following.map(function(p){return <PlayerRow key={p.id||p.name} player={p} followed={followed} onFollow={toggleFollow} onView={function(){setViewing(p.name);}}/>;})}</div></div>}
      {!loading&&filtered.length>0&&<div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>{search?"Results":"All Collectors"} ({filtered.length})</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{filtered.map(function(p){return <PlayerRow key={p.id||p.name} player={p} followed={followed} onFollow={toggleFollow} onView={function(){setViewing(p.name);}}/>;})}</div></div>}
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
  var userPlayer={id:"__me",name:userName,avatar:userInitials,color:userColor,favTeam:(profile&&profile.favTeam)||"",yield:userYield,power:userPower,isUser:true};
  useEffect(function(){
    if(!supabase){setLoading(false);return;}
    supabase.from("profiles").select("id,username,avatar_color,avatar_initials,fav_team").limit(50).then(function(res){
      if(res.error||!res.data){setLoading(false);return;}
      var ids=res.data.map(function(p){return p.id;});
      if(!ids.length){setLoading(false);return;}
      supabase.from("user_cards").select("user_id,daily,rarity").in("user_id",ids).then(function(cardRes){
        var cardRows=cardRes.data||[];
        var parsed=res.data.map(function(p){
          var pCards=cardRows.filter(function(c){return c.user_id===p.id;});
          var yld=pCards.reduce(function(s,c){return s+(c.daily||0);},0);
          var pwr=pCards.length*10+pCards.filter(function(c){return ["Legacy","Legendary","Dynasty"].includes(c.rarity);}).length*50;
          return {id:p.id,name:p.username||"Collector",avatar:(p.avatar_initials||"??").slice(0,2).toUpperCase(),color:p.avatar_color||"#f5c518",favTeam:p.fav_team||"",yield:yld,power:pwr,cardCount:pCards.length};
        }).filter(function(p){return p.cardCount>0;});
        setPlayers(parsed);
        setLoading(false);
      });
    });
  },[]);
  var allPlayers=players.filter(function(p){return p.id!=="__me";}).concat([userPlayer]).sort(function(a,b){return mode==="yield"?b.yield-a.yield:b.power-a.power;});
  var userRank=allPlayers.findIndex(function(p){return p.isUser;})+1;
  var top3=allPlayers.slice(0,3); var rest=allPlayers.slice(3);
  var podiumOrder=[top3[1],top3[0],top3[2]].filter(Boolean);
  var podiumColors=["#b0b8c8","#f5c518","#cd7f32"]; var podiumHeights=[80,110,65]; var podiumRanks=[2,1,3];
  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"16px 16px 80px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Rankings</div>
        <div style={{fontSize:11,color:"#444"}}>Live leaderboard · Real players</div>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
        <div style={{display:"flex",background:"rgba(0,0,0,0.5)",border:"1px solid #1e1e2e",borderRadius:999,padding:3,gap:2}}>
          {[["yield","🪙 Highest Yield"],["power","⚡ Collection Power"]].map(function(pair){
            return <button key={pair[0]} onClick={function(){setMode(pair[0]);}} style={{padding:"7px 18px",borderRadius:999,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",background:mode===pair[0]?"linear-gradient(135deg,#f5c518,#b8860b)":"transparent",color:mode===pair[0]?"#000":"#555"}}>{pair[1]}</button>;
          })}
        </div>
      </div>
      {loading&&<div style={{textAlign:"center",padding:40,color:"#333",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em"}}>Loading Rankings...</div>}
      {!loading&&allPlayers.length<2&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:12}}>🏆</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#444",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>You're the first!</div><div style={{fontSize:11,color:"#333"}}>Invite friends to compete</div></div>}
      {!loading&&allPlayers.length>=2&&<div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:12,marginBottom:28}}>
        {podiumOrder.map(function(player,pi){
          var rank=podiumRanks[pi]; var h=podiumHeights[pi]; var col=podiumColors[pi]; var isFirst=rank===1;
          var val=mode==="yield"?fmt(player.yield)+"/d":fmt(player.power)+" pts";
          return <div key={player.id||player.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            {isFirst&&<div style={{fontFamily:"'Oswald',sans-serif",fontSize:8,fontWeight:900,color:"#f5c518",letterSpacing:"0.15em",textTransform:"uppercase",background:"rgba(245,197,24,0.1)",border:"1px solid rgba(245,197,24,0.3)",borderRadius:999,padding:"2px 10px",marginBottom:2}}>Dynasty King</div>}
            {isFirst&&<div style={{fontSize:20}}>👑</div>}
            <div style={{width:isFirst?52:40,height:isFirst?52:40,borderRadius:"50%",background:"linear-gradient(135deg,"+player.color+"cc,"+player.color+"66)",border:"2px solid "+player.color,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 10px "+player.color+"55"}}><span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:isFirst?14:11,color:"#fff"}}>{player.avatar}</span></div>
            <div style={{fontSize:9,fontWeight:700,color:player.isUser?"#f5c518":"#ccc",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",maxWidth:80,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{player.name}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:col,fontWeight:700}}>{val}</div>
            <div style={{width:isFirst?90:75,height:h,borderRadius:"8px 8px 0 0",background:"linear-gradient(180deg,"+col+"33,"+col+"11)",border:"1px solid "+col+"55",borderBottom:"none",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8}}><span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:isFirst?28:22,color:col+"88"}}>#{rank}</span></div>
          </div>;
        })}
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {rest.map(function(player,i){
          var rank=i+4; var isUser=player.isUser; var isHov=hovered===rank;
          var hc=getColors(player.favTeam||"")[0]||"#888";
          var val=mode==="yield"?fmt(player.yield)+"/day":fmt(player.power)+" pts";
          return <div key={player.id||player.name} onMouseEnter={function(){setHovered(rank);}} onMouseLeave={function(){setHovered(null);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:isHov?hc+"18":isUser?"rgba(245,197,24,0.06)":i%2===0?"rgba(12,12,22,0.9)":"rgba(8,8,18,0.9)",border:isUser?"1px solid rgba(245,197,24,0.3)":isHov?"1px solid "+hc+"44":"1px solid transparent",transition:"all 0.15s"}}>
            <div style={{width:28,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:isUser?"#f5c518":"#444",flexShrink:0}}>#{rank}</div>
            <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,"+player.color+"cc,"+player.color+"55)",border:"2px solid "+player.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:11,color:"#fff"}}>{player.avatar}</span></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span onClick={function(){if(!isUser&&onViewVault)onViewVault(player.name);}} style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,color:isUser?"#f5c518":"#ddd",textTransform:"uppercase",cursor:!isUser?"pointer":"default"}}>{player.name}</span>
                {isUser&&<span style={{fontSize:7,fontWeight:900,background:"#f5c518",color:"#000",padding:"1px 6px",borderRadius:999,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>You</span>}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:isUser?"#f5c518":"#ccd"}}>{val}</div>
              <div style={{fontSize:8,color:"#444",textTransform:"uppercase"}}>{mode==="yield"?"yield":"power"}</div>
            </div>
          </div>;
        })}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(4,4,10,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(245,197,24,0.25)",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,"+userColor+","+userColor+"88)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:11,color:"#000"}}>{userInitials}</span></div>
          <div><div style={{fontSize:9,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Oswald',sans-serif"}}>Your Standing</div><div style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:13,color:"#f5c518"}}>Rank #{userRank} of {allPlayers.length}</div></div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#fbbf24"}}>🪙 {fmt(userYield)}/day</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#666"}}>⚡ {fmt(userPower)} pts</div>
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
      <span style={{display:"inline-flex",alignItems:"center",gap:6,marginRight:48,flexShrink:0}}>
        <span style={{fontSize:9,opacity:0.6}}>{si[g.sport]}</span>
        <span
          onClick={function(){if(onClickTeam)onClickTeam(g.away);}}
          style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:10,
            color:leader===g.away?"#f5c518":"#ccc",
            cursor:"pointer",letterSpacing:"0.05em",textTransform:"uppercase",
            transition:"color 0.15s"}}
        >{g.away}</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:11,
          color:leader===g.away?"#f5c518":"#fff"}}>{g.awayScore}</span>
        <span style={{color:"#333",fontSize:9,fontWeight:700}}>–</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:11,
          color:leader===g.home?"#f5c518":"#fff"}}>{g.homeScore}</span>
        <span
          onClick={function(){if(onClickTeam)onClickTeam(g.home);}}
          style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:10,
            color:leader===g.home?"#f5c518":"#ccc",
            cursor:"pointer",letterSpacing:"0.05em",textTransform:"uppercase"}}
        >{g.home}</span>
        <span style={{fontFamily:"'Oswald',sans-serif",fontSize:8,color:"#00ff50",fontWeight:700}}>
          {g.sport==="MLB"?"Inn":(g.sport==="MLS"?"H":"Q")}{g.quarter} {g.timeLeft}
        </span>
        <span style={{color:"#1a1a2e",fontSize:12,marginLeft:8}}>·</span>
      </span>
    );
  }
  var items=live.concat(live);
  var dur=Math.max(18, live.length*6);
  return (
    <div style={{
      position:"sticky",top:0,zIndex:200,
      background:"rgba(0,0,0,0.97)",
      borderBottom:"1px solid rgba(0,255,80,0.3)",
      height:26,overflow:"hidden",
      display:"flex",alignItems:"center",
    }}>
      {/* Left label */}
      <div style={{
        flexShrink:0,display:"flex",alignItems:"center",gap:5,
        padding:"0 10px",borderRight:"1px solid rgba(0,255,80,0.2)",
        height:"100%",background:"rgba(0,20,0,0.9)",
      }}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#00ff50",
          animation:"pulse 1s ease-in-out infinite",boxShadow:"0 0 6px #00ff50"}}/>
        <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:9,
          color:"#00ff50",letterSpacing:"0.2em"}}>ORACLE</span>
      </div>
      {/* Scrolling strip */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <div style={{
          display:"inline-flex",alignItems:"center",
          whiteSpace:"nowrap",
          animation:"oracleTicker "+dur+"s linear infinite",
          paddingLeft:20,
        }}>
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
    NBA:["Lakers","Celtics","Warriors","Bucks","Nuggets","Heat","Suns","Clippers","76ers","Nets","Bulls","Knicks","Mavericks","Grizzlies","Pelicans","Hawks","Raptors","Blazers","Jazz","Spurs"],
    MLB:["Yankees","Dodgers","Red Sox","Cubs","Giants","Cardinals","Braves","Astros","Mets","Phillies","Blue Jays","Brewers","Padres","Mariners","Rangers","Tigers","Twins","White Sox","Royals","Orioles"],
    MLS:["LA Galaxy","LAFC","Atlanta United","Seattle Sounders","Portland Timbers","NYC FC","Inter Miami","Red Bulls","Chicago Fire","Columbus Crew"],
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
    return (
      <div style={{background:isLive?"rgba(0,20,0,0.9)":"rgba(8,8,18,0.9)",border:"1px solid "+(isLive?"rgba(0,255,80,0.3)":isFinal?"rgba(80,80,80,0.3)":"rgba(255,255,255,0.08)"),borderRadius:14,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
        {isLive&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#00ff50,transparent)",animation:"shimmerSweep 2s ease-in-out infinite"}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:9,fontWeight:700,color:sc2[g.sport]||"#aaa",textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Oswald',sans-serif"}}>{si[g.sport]} {g.sport}</span>
          {isLive&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:"#00ff50",animation:"pulse 1s ease-in-out infinite"}}/><span style={{fontSize:10,fontWeight:900,color:"#00ff50",fontFamily:"'Oswald',sans-serif"}}>LIVE {periodLabel(g.sport,g.quarter)} {g.timeLeft}</span></div>}
          {g.status==="pre"&&<span style={{fontSize:9,color:"#555",fontFamily:"'JetBrains Mono',monospace"}}>in {g.kickoffMins}m</span>}
          {isFinal&&<span style={{fontSize:9,color:"#555",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Final</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:3}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:aCol}}/>
              <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,color:aWin?"#f5c518":aOwned?"#34d399":"#ccc",textTransform:"uppercase"}}>{g.away}</span>
              {aOwned&&<span style={{fontSize:7,background:"#34d399",color:"#000",padding:"1px 5px",borderRadius:999,fontWeight:900}}>OWNED</span>}
            </div>
            {(isLive||isFinal)&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:aWin?"#f5c518":"#fff"}}>{g.awayScore}</div>}
          </div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,color:"#333",fontWeight:700,flexShrink:0}}>VS</div>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:3}}>
              {hOwned&&<span style={{fontSize:7,background:"#34d399",color:"#000",padding:"1px 5px",borderRadius:999,fontWeight:900}}>OWNED</span>}
              <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:12,color:hWin?"#f5c518":hOwned?"#34d399":"#ccc",textTransform:"uppercase"}}>{g.home}</span>
              <div style={{width:9,height:9,borderRadius:"50%",background:hCol}}/>
            </div>
            {(isLive||isFinal)&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:hWin?"#f5c518":"#fff"}}>{g.homeScore}</div>}
          </div>
        </div>
        {isLive&&(hOwned||aOwned)&&<div style={{marginTop:8,background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:8,padding:"4px 10px",textAlign:"center",fontSize:9,color:"#f5c518",fontFamily:"'Oswald',sans-serif",fontWeight:700}}>YOUR CARD IS LIVE - 1.5x YIELD</div>}
        {isLive&&(redZoneTeams.has(g.home)||redZoneTeams.has(g.away))&&isRedZoneGame(g)&&<div style={{marginTop:4,background:"rgba(255,48,48,0.1)",border:"1px solid rgba(255,48,48,0.4)",borderRadius:8,padding:"4px 10px",textAlign:"center",fontSize:9,color:"#ff6060",fontFamily:"'Oswald',sans-serif",fontWeight:900,animation:"pulse 0.8s ease-in-out infinite"}}>🔴 {g.sport==="MLB"?"LATE GAME — CLUTCH MOMENT":g.sport==="MLS"?"FINAL MINUTES":"RED ZONE — CRITICAL MOMENT"}</div>}
        {isFinal&&((hWin&&hOwned)||(aWin&&aOwned))&&<div style={{marginTop:8,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:8,padding:"4px 10px",textAlign:"center",fontSize:9,color:"#34d399",fontFamily:"'Oswald',sans-serif",fontWeight:900}}>VICTORY! WIN BONUS COLLECTED</div>}
      </div>
    );
  }
  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"16px 16px 40px"}}>
      <div style={{background:"rgba(0,0,0,0.95)",border:"1px solid rgba(0,255,80,0.2)",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:loading?"#f5c518":"#00ff50",animation:"pulse 1s ease-in-out infinite",boxShadow:"0 0 8px "+(loading?"#f5c518":"#00ff50")}}/>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:900,color:"#00ff50",letterSpacing:"0.2em"}}>LIVE ORACLE</span>
          <span style={{fontFamily:"'Oswald',sans-serif",fontSize:10,color:"#444"}}>{by.live.length} LIVE · {by.pre.length} UPCOMING · {by.final.length} FINAL</span>
          {espnOk?(
            <span style={{fontSize:8,fontWeight:900,padding:"2px 7px",borderRadius:999,background:"rgba(255,80,0,0.12)",color:"#ff6022",border:"1px solid rgba(255,80,0,0.3)",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em"}}>ESPN LIVE</span>
          ):(
            <span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:999,background:"rgba(255,255,255,0.04)",color:"#333",border:"1px solid #1a1a2e",fontFamily:"'Oswald',sans-serif"}}>{loading?"CONNECTING...":"SIMULATED"}</span>
          )}
        </div>
        {!forced
          ?<button onClick={forceStartAll} style={{background:"linear-gradient(90deg,#003d1a,#00aa55)",color:"#fff",fontWeight:900,fontSize:11,padding:"6px 16px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Force Start All</button>
          :<button onClick={resetGames} style={{background:"rgba(255,255,255,0.06)",color:"#666",fontWeight:700,fontSize:11,padding:"6px 14px",borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Reset</button>
        }
      </div>
      <div style={{background:"#000",border:"1px solid rgba(0,255,80,0.12)",borderRadius:8,padding:"8px 14px",marginBottom:16,overflowX:"auto"}}>
        <div style={{display:"flex",gap:0,whiteSpace:"nowrap"}}>
          {liveGames.map(function(g,i){
            var col=g.status==="live"?"#00ff50":g.status==="final"?"#555":"#f5c518";
            return <span key={i} style={{fontSize:10,color:col,fontFamily:"'Oswald',sans-serif",fontWeight:700,marginRight:32}}>{si[g.sport]} {g.away} {g.status==="live"?g.awayScore:""} {g.status!=="pre"?"-":""} {g.status==="live"?g.homeScore:""} {g.home} {g.status==="pre"?"| "+g.kickoffMins+"m":g.status==="live"?"| "+(g.sport==="MLB"?"Inn":(g.sport==="MLS"?"H":"Q"))+g.quarter+" "+g.timeLeft:"| FT"}</span>;
          })}
        </div>
      </div>
      {by.live.length>0&&<div style={{marginBottom:16}}><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#00ff50",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:"50%",background:"#00ff50",animation:"pulse 1s ease-in-out infinite"}}/>Live Now</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.live.map(function(g){return <GCard key={g.id} game={g}/>;})}</div></div>}
      {/* Offseason sports — show status cards for inactive leagues */}
      {Object.keys(SEASON_CALENDAR).some(function(s){return !SEASON_CALENDAR[s].active;})&&(
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#333",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>Offseason</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {Object.keys(SEASON_CALENDAR).filter(function(s){return !SEASON_CALENDAR[s].active;}).map(function(sport){
              var cal=SEASON_CALENDAR[sport];
              var isSpecial=cal.isDraft||cal.isFinalFour;
              var specialColor=cal.isDraft?"#4488ff":cal.isFinalFour?"#ffaa22":"#333";
              return (
                <div key={sport} style={{background:isSpecial?"rgba(8,12,30,0.95)":"rgba(8,8,18,0.7)",border:"1px solid "+(isSpecial?specialColor+"44":"rgba(255,255,255,0.06)"),borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,minWidth:200,position:"relative",overflow:"hidden"}}>
         {isSpecial&&<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,"+specialColor+"08,transparent)",pointerEvents:"none"}}/>}
         <span style={{fontSize:20,flexShrink:0}}>{cal.icon||"🏅"}</span>
         <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:700,color:isSpecial?specialColor:(cal.color||"#aaa"),textTransform:"uppercase",letterSpacing:"0.08em"}}>{sport}</div>
          <div style={{fontSize:10,color:isSpecial?"#888":"#444",marginTop:1}}>{cal.reason}</div>
          {isSpecial&&<div style={{fontSize:9,fontWeight:700,color:specialColor,marginTop:3,letterSpacing:"0.05em"}}>{cal.note}</div>}
         </div>
         <div style={{flexShrink:0,textAlign:"right"}}>
          {isSpecial?(
           <div style={{fontSize:9,fontWeight:900,padding:"4px 10px",borderRadius:999,background:specialColor+"18",color:specialColor,border:"1px solid "+specialColor+"44",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",whiteSpace:"nowrap"}}>{cal.isDraft?"📅 DRAFT":cal.isFinalFour?"🏆 FINAL FOUR":""}</div>
          ):(
           <div style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:999,background:"rgba(255,255,255,0.04)",color:"#2a2a2a",border:"1px solid #1a1a2e",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif"}}>No Games</div>
          )}
          {!isSpecial&&<div style={{fontSize:8,color:"#222",marginTop:3,textAlign:"right"}}>{cal.note}</div>}
         </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {by.pre.length>0&&<div style={{marginBottom:16}}><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#f5c518",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>Upcoming</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.pre.map(function(g){return <GCard key={g.id} game={g}/>;})}</div></div>}
      {by.final.length>0&&<div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:11,fontWeight:700,color:"#444",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:8}}>Final</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{by.final.map(function(g){return <GCard key={g.id} game={g}/>;})}</div></div>}
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
  var editState=useState(false); var showEdit=editState[0]; var setShowEdit=editState[1];
  var editNameState=useState(profile.username); var editName=editNameState[0]; var setEditName=editNameState[1];
  var editBioState=useState(profile.bio); var editBio=editBioState[0]; var setEditBio=editBioState[1];
  var editColorState=useState(profile.avatarColor); var editColor=editColorState[0]; var setEditColor=editColorState[1];
  var editInitialsState=useState(profile.avatarInitials); var editInitials=editInitialsState[0]; var setEditInitials=editInitialsState[1];
  var savedState=useState(false); var justSaved=savedState[0]; var setJustSaved=savedState[1];
  var pickingState=useState(false); var pickingSlot=pickingState[0]; var setPickingSlot=pickingState[1];
  var netWorth=inventory.reduce(function(s,c){return s+c.mp;},0);
  var collectionPct=Math.min(100,Math.round((inventory.length/90)*100));
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
  var BADGES=[
    {id:"pack_addict",icon:"\u{1F4E6}",label:"Pack Addict",desc:"Open 100 packs",unlocked:packsOpened>=100,progress:Math.min(100,packsOpened)},
    {id:"whale",icon:"\u{1F40B}",label:"Whale",desc:"Hold 1M coins",unlocked:balance>=1000000,progress:Math.min(100,Math.round(balance/10000))},
    {id:"division_master",icon:"\u{1F3C6}",label:"Division Master",desc:"Complete a full set",unlocked:completedSets>=1,progress:completedSets>0?100:0},
    {id:"the_closer",icon:"\u{1F451}",label:"The Closer",desc:"Own 10 Legendary+ cards",unlocked:legendaryCount>=10,progress:Math.min(100,Math.round(legendaryCount*10))},
    {id:"dynasty_puller",icon:"\u2728",label:"Dynasty Puller",desc:"Pull a Dynasty card",unlocked:inventory.some(function(c){return c.rarity==="Dynasty";}),progress:inventory.some(function(c){return c.rarity==="Dynasty";})?100:0},
    {id:"first_blood",icon:"\u{1F9F8}",label:"First Blood",desc:"Open your first pack",unlocked:packsOpened>=1,progress:packsOpened>=1?100:0},
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
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#04020e,#07070f)",paddingBottom:60,color:"#fff"}}>
      {showEdit&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"rgba(10,8,22,0.97)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:24,padding:"28px 26px",maxWidth:380,width:"100%",animation:"editModalIn 0.3s ease-out both"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:700,color:"#fff",textTransform:"uppercase",marginBottom:20}}>Edit Profile</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,"+editColor+"cc,"+editColor+"55)",border:"3px solid "+editColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:22,color:"#fff"}}>{(editInitials||"ME").slice(0,2).toUpperCase()}</span>
              </div>
            </div>
            <div style={{marginBottom:12}}><div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontFamily:"'Oswald',sans-serif"}}>Initials</div><input maxLength={2} value={editInitials} onChange={function(e){setEditInitials(e.target.value.toUpperCase().slice(0,2));}} style={{width:"100%",background:"rgba(0,0,0,0.5)",border:"1px solid #1e1e2e",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:14,fontWeight:700,outline:"none",fontFamily:"'Oswald',sans-serif"}}/></div>
            <div style={{marginBottom:12}}><div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontFamily:"'Oswald',sans-serif"}}>Username</div><input value={editName} onChange={function(e){setEditName(e.target.value);}} style={{width:"100%",background:"rgba(0,0,0,0.5)",border:"1px solid #1e1e2e",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:14,fontWeight:700,outline:"none"}}/></div>
            <div style={{marginBottom:12}}><div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontFamily:"'Oswald',sans-serif"}}>Bio</div><textarea value={editBio} onChange={function(e){setEditBio(e.target.value);}} rows={2} style={{width:"100%",background:"rgba(0,0,0,0.5)",border:"1px solid #1e1e2e",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none"}}/></div>
            <div style={{marginBottom:22}}><div style={{fontSize:10,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8,fontFamily:"'Oswald',sans-serif"}}>Avatar Color</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{AVATAR_COLORS.map(function(col){return <button key={col} onClick={function(){setEditColor(col);}} style={{width:28,height:28,borderRadius:"50%",background:col,border:editColor===col?"3px solid #fff":"2px solid rgba(255,255,255,0.15)",cursor:"pointer",flexShrink:0}}/>;})}</div></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleSave} style={{flex:2,background:justSaved?"linear-gradient(90deg,#004422,#00aa55)":"linear-gradient(135deg,#7a5500,#f5c518,#b8860b)",color:"#000",fontWeight:900,fontSize:13,padding:"12px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>{justSaved?"Saved!":"Save Changes"}</button>
              <button onClick={function(){setShowEdit(false);}} style={{flex:1,background:"rgba(255,255,255,0.04)",color:"#555",fontWeight:700,fontSize:12,padding:"12px",borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {pickingSlot!==false&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px",overflowY:"auto"}} onClick={function(){setPickingSlot(false);}}>
          <div onClick={function(e){e.stopPropagation();}} style={{width:"100%",maxWidth:720}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:"#f5c518",textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>Pick Card for Slot {pickingSlot+1}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:14}}>
              {sortedInv.map(function(c){return <div key={c.id} onClick={function(){pinCard(c);}} style={{cursor:"pointer"}}><FlipCard card={c} autoFlip={true}/></div>;})}
            </div>
          </div>
        </div>
      )}
      <div style={{background:"rgba(4,2,14,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(245,197,24,0.12)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:999,padding:"7px 16px",color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Back</button>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:17,fontWeight:700,color:"#fff",letterSpacing:"0.12em",textTransform:"uppercase",flex:1}}>My Dynasty ID</div>
        <button onClick={function(){setShowEdit(true);setEditName(profile.username);setEditBio(profile.bio);setEditColor(profile.avatarColor);setEditInitials(profile.avatarInitials);}} style={{background:"rgba(245,197,24,0.08)",border:"1px solid rgba(245,197,24,0.25)",borderRadius:999,padding:"7px 16px",color:"#f5c518",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Edit Profile</button>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:20,marginBottom:28,flexWrap:"wrap"}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:88,height:88,borderRadius:"50%",background:"linear-gradient(135deg,"+profile.avatarColor+"dd,"+profile.avatarColor+"66)",border:"3px solid "+profile.avatarColor,display:"flex",alignItems:"center",justifyContent:"center",animation:isTop100?"avatarGlow 2.5s ease-in-out infinite":"none",boxShadow:"0 0 "+(isTop100?"24":"12")+"px "+profile.avatarColor+(isTop100?"88":"44")}}>
              <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:28,color:"#fff"}}>{profile.avatarInitials}</span>
            </div>
            {isTop100&&<div style={{position:"absolute",top:-6,right:-6,width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#f5c518,#b8860b)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #07070f"}}><span style={{fontSize:12}}>crown</span></div>}
          </div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:900,color:"#fff",textTransform:"uppercase",lineHeight:1,marginBottom:6}}>{profile.username}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:8,maxWidth:340}}>{profile.bio}</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:"#555"}}>Streak: <span style={{color:"#fb923c",fontWeight:700}}>{streakData.currentStreak||0}d</span></span>
              <span style={{fontSize:10,color:"#555"}}>Since <span style={{color:"#888",fontWeight:700}}>{joinLabel}</span></span>
              <span style={{fontSize:10,color:"#555"}}>Packs: <span style={{color:"#60a5fa",fontWeight:700}}>{packsOpened}</span></span>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(154px,1fr))",gap:12,marginBottom:28}}>
          {[{label:"Net Worth",val:fmt(netWorth),sub:"coin card value",color:"#f5c518",border:"rgba(245,197,24,0.2)",bg:"rgba(10,8,2,0.9)"},{label:"Daily Yield",val:fmt(dailyYield),sub:"coins per day",color:"#34d399",border:"rgba(52,211,153,0.18)",bg:"rgba(2,12,8,0.9)"},{label:"Legendaries",val:legendaryCount,sub:"owned",color:"#e879f9",border:"rgba(232,121,249,0.18)",bg:"rgba(10,2,18,0.9)"},{label:"Rank",val:"#"+myRank,sub:"leaderboard",color:"#fb923c",border:"rgba(251,146,60,0.18)",bg:"rgba(16,8,2,0.9)"}].map(function(s,i){
            return <div key={i} style={{background:s.bg,border:"1px solid "+s.border,borderRadius:16,padding:"16px 14px"}}><div style={{fontSize:9,color:"#555",letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:8}}>{s.label}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:s.color,lineHeight:1,marginBottom:2}}>{s.val}</div><div style={{fontSize:9,color:"#444"}}>{s.sub}</div></div>;
          })}
          <div style={{background:"rgba(6,8,22,0.9)",border:"1px solid rgba(96,165,250,0.18)",borderRadius:16,padding:"16px 14px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative",flexShrink:0}}><RingProgress pct={collectionPct} size={60} stroke={5} color="#60a5fa"/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#60a5fa"}}>{collectionPct}%</span></div></div>
            <div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:4}}>Collection</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:"#93c5fd"}}>{inventory.length}<span style={{fontSize:10,color:"#444"}}>/90</span></div></div>
          </div>
          {rarestCard&&<div style={{background:"rgba(8,4,20,0.9)",border:"1px solid "+(RCOLORS[rarestCard.rarity]||"#aaa")+"33",borderRadius:16,padding:"16px 14px",display:"flex",alignItems:"center",gap:10}}><div style={{flexShrink:0}}><MiniCard card={rarestCard}/></div><div><div style={{fontSize:9,color:"#555",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Oswald',sans-serif",marginBottom:4}}>Rarest Pull</div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:700,color:RCOLORS[rarestCard.rarity]||"#fff",textTransform:"uppercase"}}>{rarestCard.rarity}</div><div style={{fontSize:10,color:"#444"}}>{rarestCard.team}</div></div></div>}
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:700,color:"#fff",textTransform:"uppercase",marginBottom:14}}>Showcase Shelf</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
            {pinnedCards.map(function(card,i){
              return <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                {card?(
                  <div style={{position:"relative",animation:"showcaseFloat 4s ease-in-out infinite",animationDelay:(i*0.6)+"s"}}>
                    <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:200,height:200,background:"radial-gradient(ellipse,"+getColors(card.team)[0]+"55 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
                    <div style={{transform:"scale(1.2)",transformOrigin:"top center",zIndex:1,position:"relative"}}><FlipCard card={card} autoFlip={true}/></div>
                    <button onClick={function(){unpin(i);}} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.85)",border:"1px solid rgba(255,255,255,0.15)",color:"#555",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:30}}>x</button>
                  </div>
                ):(
                  <button onClick={function(){setPickingSlot(i);}} style={{width:148,height:212,borderRadius:12,border:"2px dashed rgba(245,197,24,0.2)",background:"rgba(245,197,24,0.03)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{fontSize:28,opacity:0.4}}>+</span>
                    <span style={{fontSize:10,color:"rgba(245,197,24,0.4)",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Pin Card</span>
                  </button>
                )}
                <div style={{fontSize:9,color:"#333",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase",marginTop:card?24:0}}>Slot {i+1}</div>
              </div>;
            })}
          </div>
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:700,color:"#fff",textTransform:"uppercase",marginBottom:4}}>Achievements</div>
          <div style={{fontSize:10,color:"#444",marginBottom:14}}>{BADGES.filter(function(b){return b.unlocked;}).length} / {BADGES.length} unlocked</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
            {BADGES.map(function(badge,i){
              return <div key={badge.id} style={{background:badge.unlocked?"rgba(12,10,2,0.95)":"rgba(8,8,16,0.7)",border:"1px solid "+(badge.unlocked?"rgba(245,197,24,0.35)":"rgba(255,255,255,0.05)"),borderRadius:14,padding:"14px 12px",opacity:badge.unlocked?1:0.45,position:"relative",overflow:"hidden"}}>
                <div style={{fontSize:24,marginBottom:8,filter:badge.unlocked?"drop-shadow(0 0 8px rgba(245,197,24,0.6))":"grayscale(1) opacity(0.4)"}}>{badge.icon}</div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:12,fontWeight:700,color:badge.unlocked?"#f5c518":"#333",textTransform:"uppercase",marginBottom:2}}>{badge.label}</div>
                <div style={{fontSize:9,color:badge.unlocked?"#888":"#2a2a2a",marginBottom:8}}>{badge.desc}</div>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:999,height:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:999,background:badge.unlocked?"linear-gradient(90deg,#f5c518,#ffe066)":"rgba(255,255,255,0.1)",width:badge.progress+"%",transition:"width 1s ease-out"}}/></div>
                {badge.unlocked&&<div style={{position:"absolute",top:8,right:10,fontSize:9,fontWeight:900,color:"#34d399",fontFamily:"'Oswald',sans-serif"}}>done</div>}
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
  var pityState=useState(0); var pity=pityState[0]; var setPity=pityState[1];
  var profileState=useState(function(){return loadProfile();}); var profile=profileState[0]; var setProfile=profileState[1];
  var packsState=useState(function(){var p=loadProfile();return p.packsOpened||0;}); var packsOpened=packsState[0]; var setPacksOpened=packsState[1];
  var userIdState=useState(null); var userId=userIdState[0]; var setUserId=userIdState[1];
  var authReadyState=useState(!supabase); var authReady=authReadyState[0]; var setAuthReady=authReadyState[1];
  var isNewUserState=useState(false); var isNewUser=isNewUserState[0]; var setIsNewUser=isNewUserState[1];

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
    // Delete all existing cards for this user first, then insert fresh
    supabase.from("user_cards").delete().eq("user_id",uid)
      .then(function(delRes){
        if(delRes.error){console.error("dbSaveCards delete error:",delRes.error);return;}
        if(!cards||!cards.length) return;
        var rows=cards.map(function(c){
          return {user_id:uid,sport:c.sport,team:c.team,rarity:c.rarity,daily:c.daily||0,win:c.win||0,mp:c.mp||0,card_id:c.id||genId()};
        });
        supabase.from("user_cards").insert(rows)
          .then(function(insRes){
            if(insRes.error) console.error("dbSaveCards insert error:",insRes.error);
            else console.log("[CardDynasty] Saved",rows.length,"cards for user",uid);
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
        }
        var hasCards=cardsRes&&cardsRes.data&&cardsRes.data.length>0;
        if(hasCards){
          // Returning user — restore cards and go straight to vault
          var cards=cardsRes.data.map(function(r){return {id:r.card_id||genId(),sport:r.sport,team:r.team,rarity:r.rarity,daily:r.daily,win:r.win,mp:r.mp};});
          setInventory(cards);
          setOnboarded(true);
          setIsNewUser(false);
        } else {
          // New user — no cards yet, route to profile setup then pack opening
          setIsNewUser(true);
          setOnboarded(false);
        }
      }).catch(function(e){
        console.error("dbLoadUser error:",e);
        // On any DB error, treat as new user so they can still onboard
        setIsNewUser(true);
        setOnboarded(false);
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
  var listingsState=useState([]); var listings=listingsState[0]; var setListings=listingsState[1];
  var myListingsState=useState([]); var myListings=myListingsState[0]; var setMyListings=myListingsState[1];
  var grailFeedState=useState([]); var grailFeed=grailFeedState[0]; var setGrailFeed=grailFeedState[1];
  var lastRefreshState=useState(Date.now()); var lastRefresh=lastRefreshState[0]; var setLastRefresh=lastRefreshState[1];
  var listModalState=useState(null); var listModal=listModalState[0]; var setListModal=listModalState[1];
  var notifsState=useState([]); var notifs=notifsState[0]; var setNotifs=notifsState[1];
  var socialVaultState=useState(null); var socialVault=socialVaultState[0]; var setSocialVault=socialVaultState[1];
  var loginModalState=useState(false); var showLoginModal=loginModalState[0]; var setShowLoginModal=loginModalState[1];
  var streakDataState=useState(function(){var s=loadStreak();return {currentStreak:s.currentStreak||1,lastLoginDate:s.lastLoginDate||null,claimedDays:s.claimedDays||[]};});
  var streakData=streakDataState[0]; var setStreakData=streakDataState[1];
  var shakeTeamsState=useState({}); var shakeTeams=shakeTeamsState[0]; var setShakeTeams=shakeTeamsState[1];
  var inventoryRef=useRef(inventory);
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
    if(s.lastLoginDate!==today){setTimeout(function(){setShowLoginModal(true);},800);}
  },[]);
  function pushNotif(title,msg,type){
    var t=type||"info";
    var id=genId();
    setNotifs(function(p){return p.slice(-2).concat([{id:id,title:title,msg:msg,type:t}]);});
    setTimeout(function(){setNotifs(function(p){return p.filter(function(n){return n.id!==id;});});},4200);
  }
  function completeOnboarding(cards,coins){
    setInventory(cards);
    setBalance(coins);
    setOnboarded(true);
    setIsNewUser(false);
    setTab("shop");
    // Get userId from state OR directly from Supabase session
    // (userId state may still be null if onAuthStateChange hasn't updated it yet)
    var uid=userId;
    if(!uid&&supabase){
      supabase.auth.getSession().then(function(res){
        var session=res&&res.data&&res.data.session;
        var freshUid=session&&session.user&&session.user.id;
        if(freshUid){
          setUserId(freshUid);
          dbSaveCards(freshUid,cards);
          dbSaveProfile(freshUid,{coins:coins,packs_opened:0});
        }
      });
    } else if(uid){
      dbSaveCards(uid,cards);
      dbSaveProfile(uid,{coins:coins,packs_opened:0});
    }
  }

  function handleClaim(reward){
    var today=new Date().toDateString();
    var yesterday=new Date(Date.now()-86400000).toDateString();
    var wasYesterday=streakData.lastLoginDate===yesterday;
    var newStreak=wasYesterday||!streakData.lastLoginDate?streakData.currentStreak+1:1;
    var capped=Math.min(newStreak,7);
    var next={currentStreak:newStreak>7?1:capped,lastLoginDate:today,claimedDays:streakData.claimedDays.concat([today])};
    setStreakData(next);
    saveStreak(next);
    var newBalance=balance;
    if(reward.coins>0){newBalance=balance+reward.coins;setBalance(function(b){return b+reward.coins;});}
    var newCards=inventory.slice();
    if(reward.pack==="standard"){var c1=buildPack(PACK_TYPES[0],false);setInventory(function(inv){newCards=c1.concat(inv);return newCards;});pushNotif("Daily Pack!","Standard Pro Case added","info");}
    if(reward.pack==="jumbo"){var c2=buildPack(PACK_TYPES[1],false);setInventory(function(inv){newCards=c2.concat(inv);return newCards;});pushNotif("Daily Pack!","Division Jumbo added","info");}
    if(reward.pack==="elite"){var ec=genCard({Elite:60,Legacy:25,Legendary:14,Dynasty:1},null,null);setInventory(function(inv){newCards=[ec].concat(inv);return newCards;});pushNotif("Elite Pull!","Guaranteed Elite+ card added","sale");}
    if(reward.coins>0)pushNotif("Streak Bonus!","+"+fmt(reward.coins)+" coins claimed","sale");
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
    var newBal=balance-pt.cost;
    setBalance(function(b){return b-pt.cost;});
    var pa=pt.id==="standard"&&pity>=10;
    var cards=buildPack(pt,pa);
    var hasElite=cards.some(function(c){return ["Elite","Legacy","Legendary","Dynasty"].includes(c.rarity);});
    if(pt.id==="standard")setPity(hasElite?0:function(p){return p+1;});
    setOpening({pack:pt,cards:cards});
    setTab("opening");
    var nextPacks=packsOpened+1;
    setPacksOpened(nextPacks);
    saveProfile(Object.assign({},loadProfile(),{packsOpened:nextPacks}));
    if(userId) dbSaveProfile(userId,{coins:newBal,packs_opened:nextPacks});
  }

  function finishOpening(){
    var newInv=opening?opening.cards.concat(inventory):inventory;
    if(opening) setInventory(function(){return newInv;});
    setOpening(null);setTab("inventory");setInvSubTab("cards");
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

  function simulateNextDay(){
    var yesterday=new Date().toDateString();
    var newStreak=streakData.currentStreak>=7?1:streakData.currentStreak+1;
    var next=Object.assign({},streakData,{lastLoginDate:yesterday,currentStreak:newStreak});
    setStreakData(next);saveStreak(next);
    setShowLoginModal(true);
    pushNotif("Day Simulated","Streak advanced to Day "+newStreak,"info");
  }

  function simGameDay(){
    if(inventory.length===0)return;
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
  }
  var sorted=inventory.slice().sort(function(a,b){return ORDER.indexOf(a.rarity)-ORDER.indexOf(b.rarity);});
  var counts={};inventory.forEach(function(c){counts[c.rarity]=(counts[c.rarity]||0)+1;});
  var coreTabs=[{id:"live",label:"🔴 Live"},{id:"shop",label:"Shop"},{id:"market",label:"Exchange"},{id:"inventory",label:"Inv ("+inventory.length+")"},{id:"social",label:"Social"},{id:"rankings",label:"Rankings"},{id:"profile",label:"Profile"}];
  if(tab==="opening")coreTabs.splice(2,0,{id:"opening",label:"Opening..."});
  if(!authReady) return (
    <div style={{background:"#07070f",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <div className="gold-logo" style={{fontSize:28,fontWeight:900,letterSpacing:3,marginBottom:16}}>CARD DYNASTY</div>
        <div style={{width:32,height:32,border:"3px solid rgba(245,197,24,0.2)",borderTop:"3px solid #f5c518",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto"}}/>
      </div>
    </div>
  );

  if(showOnboarding) return (
    <div style={{background:"#04040a",minHeight:"100vh"}}>
      <style>{CSS}</style>
      <Onboarding onComplete={completeOnboarding} isNewUser={isNewUser} userId={userId} onSavePrefs={function(prefs){
        if(!prefs) return;
        var updated=loadProfile();
        if(prefs.username) updated.username=prefs.username;
        if(prefs.favSport) updated.favSport=prefs.favSport;
        if(prefs.favTeam) updated.favTeam=prefs.favTeam;
        if(prefs.username) updated.avatarInitials=prefs.username.slice(0,2).toUpperCase();
        saveProfileAndState(updated);
      }}/>
    </div>
  );
  return (
    <div style={{background:"#07070f",minHeight:"100vh",color:"#fff",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <Notifications notifs={notifs}/>
      {showLoginModal&&<DailyLoginModal streakData={streakData} onClaim={handleClaim} onClose={function(){setShowLoginModal(false);}}/>}
      {listModal&&<ListModal card={listModal} onConfirm={function(p){listCard(listModal,p);}} onClose={function(){setListModal(null);}}/>}
      {/* ── ORACLE BAR — persistent live score ticker ── */}
      <OracleBar liveGames={oracle.liveGames} onClickTeam={handleOracleClick}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid #0e0e1e",background:"rgba(4,4,10,0.96)",backdropFilter:"blur(12px)",flexWrap:"wrap",gap:8,position:"sticky",top:0,zIndex:50}}>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>
          <span className="bal-shimmer">Card</span><span style={{color:"#fff"}}> Dynasty</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {pity>=7&&<span style={{fontSize:9,color:"#fb923c",fontWeight:700,background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:999,padding:"3px 8px"}}>Pity {pity}/10</span>}
          {liveTeams.size>0&&<span onClick={function(){setTab("live");}} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,255,80,0.08)",border:"1px solid rgba(0,255,80,0.25)",borderRadius:999,padding:"4px 10px",cursor:"pointer"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#00ff50",animation:"pulse 1s ease-in-out infinite"}}/><span style={{fontSize:10,fontWeight:700,color:"#00ff50",fontFamily:"'Oswald',sans-serif"}}>{liveTeams.size} LIVE</span></span>}
          <button onClick={function(){setShowLoginModal(true);}} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.25)",borderRadius:999,padding:"5px 10px",cursor:"pointer"}}>
            <span>🔥</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:"#fb923c"}}>{streakData.currentStreak}d</span>
          </button>
          <button onClick={simulateNextDay} style={{background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:999,padding:"5px 10px",color:"#fb923c",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            Next Day
          </button>
          <button onClick={simGameDay} style={{background:inventory.length?"linear-gradient(90deg,#003d1a,#00884a)":"rgba(255,255,255,0.04)",color:inventory.length?"#fff":"#333",fontWeight:900,fontSize:11,padding:"6px 14px",borderRadius:999,border:"none",cursor:inventory.length?"pointer":"not-allowed"}}>Game Day</button>
          {winners&&<button onClick={function(){setWinners(null);setGdResult(null);}} style={{background:"rgba(255,255,255,0.04)",color:"#444",fontSize:10,fontWeight:700,padding:"6px 10px",borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer"}}>Clear</button>}
          <div style={{background:"rgba(245,197,24,0.06)",border:"1px solid rgba(245,197,24,0.15)",borderRadius:999,padding:"6px 14px",fontWeight:900,fontSize:14}}>
            <span className="bal-shimmer">{fmt(balance)}</span><span style={{color:"#333",fontSize:10,marginLeft:4}}>coins</span>
          </div>
          {/* Avatar — taps to profile */}
          <button onClick={function(){setTab("profile");}} title="My Profile"
            style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,"+profile.avatarColor+"cc,"+profile.avatarColor+"55)",border:"2px solid "+profile.avatarColor,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,boxShadow:"0 0 10px "+profile.avatarColor+"44",padding:0}}>
            <span style={{fontFamily:"'Oswald',sans-serif",fontWeight:900,fontSize:11,color:"#fff"}}>{profile.avatarInitials}</span>
          </button>
        </div>
      </div>
      {winners&&gdResult&&(
        <div style={{background:"rgba(0,20,10,0.9)",borderBottom:"1px solid rgba(52,211,153,0.2)",padding:"7px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#34d399",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Game Day Active</span>
          <span style={{fontSize:10,color:"#333"}}>{winners.size} winners</span>
          <span style={{fontSize:10,color:"#444"}}>Win bonuses: <span style={{color:"#34d399",fontWeight:700}}>+{fmt(gdResult.winTotal)}</span></span>
          {gdResult.hasLiveBonus&&<span style={{fontSize:9,fontWeight:700,color:"#00ff50",background:"rgba(0,255,80,0.08)",border:"1px solid rgba(0,255,80,0.2)",borderRadius:999,padding:"2px 8px"}}>⚡ 1.5x Live Active</span>}
          <button onClick={function(){setShowGD(true);}} style={{fontSize:9,fontWeight:700,color:"#f5c518",background:"none",border:"1px solid rgba(245,197,24,0.2)",borderRadius:999,padding:"2px 10px",cursor:"pointer"}}>Summary</button>
        </div>
      )}
      {showGD&&gdResult&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}} onClick={function(){setShowGD(false);}}>
          <div className="popup-anim" onClick={function(e){e.stopPropagation();}} style={{background:"rgba(8,6,2,0.97)",borderRadius:20,padding:"28px 32px",maxWidth:300,width:"90%",textAlign:"center",boxShadow:"0 0 0 1px rgba(245,197,24,0.4),0 0 60px rgba(245,197,24,0.25)"}}>
            <div style={{fontSize:28,marginBottom:8}}>🏆</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:"#f5c518",marginBottom:14}}>+{fmt(gdResult.grandTotal)}</div>
            <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"10px 12px",marginBottom:14,textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:"#444"}}>Base Daily</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#fbbf24"}}>+{fmt(gdResult.baseTotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:7,borderTop:"1px solid #1a1a2e",marginBottom:gdResult.hasLiveBonus?5:0}}><span style={{fontSize:11,color:"#444"}}>Win Bonuses</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#34d399"}}>+{fmt(gdResult.winTotal)}</span></div>
              {gdResult.hasLiveBonus&&<div style={{fontSize:9,color:"#00ff50",textAlign:"right",fontWeight:700}}>⚡ Includes 1.5x live multiplier</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){var newBal=balance+gdResult.grandTotal;setBalance(function(b){return b+gdResult.grandTotal;});setShowGD(false);if(userId)dbSaveProfile(userId,{coins:newBal});}} style={{flex:1,background:"linear-gradient(90deg,#7a5500,#f5c518)",color:"#000",fontWeight:900,padding:10,borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>Collect</button>
              <button onClick={function(){setShowGD(false);}} style={{flex:1,background:"rgba(255,255,255,0.04)",color:"#444",fontWeight:700,padding:10,borderRadius:999,border:"1px solid #1e1e2e",cursor:"pointer",fontSize:12}}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",borderBottom:"1px solid #0e0e1e",background:"rgba(4,4,10,0.96)",overflowX:"auto"}}>
        {coreTabs.map(function(t){
          return <button key={t.id} className={"tab-btn"+(tab===t.id?" on":"")} onClick={function(){setTab(t.id);}}>{t.label}</button>;
        })}
      </div>
      <div>
        {tab==="live"&&<LiveGamesTab liveGames={oracle.liveGames} inventory={inventory} forceStartAll={oracle.forceStartAll} resetGames={oracle.resetGames} forced={oracle.forced} redZoneTeams={redZoneTeams} espnOk={oracle.espnOk} loading={oracle.loading}/>}
        {tab==="shop"&&<Shop balance={balance} onBuy={buyPack} pityCount={pity}/>}
        {tab==="opening"&&opening&&<OpeningScreen pack={opening.pack} cards={opening.cards} onDone={finishOpening} winners={winners}/>}
        {/* CHANGE 7: Pass shakeTeams to Marketplace */}
        {tab==="market"&&<Marketplace balance={balance} onBuy={buyFromMarket} listings={listings} myListings={myListings} grailFeed={grailFeed} onRefresh={rotateMkt} lastRefresh={lastRefresh} shakeTeams={shakeTeams}/>}
        {/* CHANGE 8: Pass shakeTeams to Social (threads to PublicVault) */}
        {tab==="social"&&<Social inventory={inventory} initialVault={socialVault} onClearVault={function(){setSocialVault(null);}} shakeTeams={shakeTeams}/>}
        {tab==="rankings"&&<Leaderboard inventory={inventory} balance={balance} profile={profile} onViewVault={function(name){setSocialVault(name);setTab("social");}}/>}
        {tab==="profile"&&<ProfileView inventory={inventory} balance={balance} streakData={streakData} profile={profile} packsOpened={packsOpened} onSaveProfile={saveProfileAndState} onBack={function(){setTab("inventory");}}/>}
        {tab==="inventory"&&(
          <div style={{padding:16,maxWidth:720,margin:"0 auto"}}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["cards","sets"].map(function(s){
                return <button key={s} onClick={function(){setInvSubTab(s);}} style={{padding:"7px 18px",borderRadius:999,border:"1px solid",fontSize:12,fontWeight:700,cursor:"pointer",background:invSubTab===s?"#f5c518":"rgba(0,0,0,0.5)",color:invSubTab===s?"#000":"#444",borderColor:invSubTab===s?"#f5c518":"#1e1e2e",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>{s==="cards"?"My Cards":"Set Progress"}</button>;
              })}
            </div>
            {invSubTab==="cards"&&(
              inventory.length===0
                ?<div style={{textAlign:"center",padding:60,color:"#222",fontWeight:700,fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>No Cards Yet</div>
                :<div>
         <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {ORDER.filter(function(r){return counts[r];}).map(function(r){
           return <span key={r} style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:"1px solid "+(RCOLORS[r]||"#aaa")+"44",background:"rgba(0,0,0,0.5)",color:RCOLORS[r]||"#aaa",textTransform:"uppercase"}}>{r} <span style={{color:"#f5c518"}}>x{counts[r]}</span></span>;
          })}
          {winners&&<span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,border:"1px solid rgba(52,211,153,0.3)",background:"rgba(52,211,153,0.06)",color:"#34d399"}}>Winners: {inventory.filter(function(c){return winners.has(c.team);}).length}</span>}
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
            ?"drop-shadow(0 0 8px "+liveCol+") drop-shadow(0 0 16px "+liveCol+"cc) drop-shadow(0 0 32px "+liveCol+"88)"
            :isLiveCard
            ?"drop-shadow(0 0 6px "+liveCol+"dd) drop-shadow(0 0 18px "+liveCol+"88)"
            :"none";
           var offseasonBadge=null;
           if(isOffseason&&!isLiveCard){
            var _cal=SEASON_CALENDAR[c.sport];
            var _isDraft=_cal&&_cal.isDraft;
            var _isFinalFour=_cal&&_cal.isFinalFour;
            var _olabel=_isDraft?_draftLabel:_isFinalFour?"🏆 FINAL FOUR":_cal?_cal.note:"Offseason";
            var _obg=_isDraft?"rgba(20,30,80,0.96)":_isFinalFour?"rgba(30,20,0,0.96)":"rgba(20,20,30,0.95)";
            var _ocol=_isDraft?"#4488ff":_isFinalFour?"#ffaa22":"#333";
            var _obdr=_isDraft?"1px solid rgba(68,136,255,0.3)":_isFinalFour?"1px solid rgba(255,170,34,0.3)":"1px solid #1a1a2e";
            offseasonBadge=<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:_obg,color:_ocol,fontSize:8,fontWeight:700,padding:"2px 8px",borderRadius:999,fontFamily:"'Oswald',sans-serif",letterSpacing:"0.08em",whiteSpace:"nowrap",border:_obdr}}>{_olabel}</div>;
           }
           return (
            <div key={c.id+i}
             className={"inv-wrap"+(isRedZone?" redZone":isShaking?" haptic":"")}
             style={{
              position:"relative",
              filter:liveFilter,
              animation:isHighlighted?"highlightFlash 2s ease-out forwards":"none",
              borderRadius:14,
              outline:isHighlighted?"3px solid #00ff50":"none",
              transition:"filter 0.3s",
              opacity:isOffseason?0.72:1,
             }}>
             {isLiveCard&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:isRedZone?"#ff3030":"#00ff50",color:"#000",fontSize:8,fontWeight:900,padding:"2px 8px",borderRadius:999,fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em",whiteSpace:"nowrap",filter:isRedZone?"drop-shadow(0 0 6px #ff3030)":"drop-shadow(0 0 6px #00ff50)"}}>{isRedZone?(c.sport==="MLB"?"🔴 CLUTCH":c.sport==="MLS"?"🔴 FINAL MINS":"🔴 RED ZONE"):"LIVE · 1.5x"}</div>}
             {offseasonBadge}
             {preTeams[c.team]&&!isLiveCard&&!isOffseason&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",zIndex:30,background:"#f5c518",color:"#000",fontSize:8,fontWeight:900,padding:"2px 8px",borderRadius:999,fontFamily:"'Oswald',sans-serif",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>IN {preTeams[c.team]}m</div>}
             <FlipCard card={c} autoFlip={true} winners={winners}/>
             <div className="list-ov" onClick={function(){setListModal(c);}}>
              <button style={{background:"linear-gradient(90deg,#004422,#00aa55)",color:"#fff",fontWeight:900,fontSize:11,padding:"8px 16px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Oswald',sans-serif",textTransform:"uppercase"}}>List For Sale</button>
             </div>
            </div>
           );
          })}
         </div>
                </div>
            )}
            {invSubTab==="sets"&&<SetTracker inventory={inventory}/>}
            <div style={{marginTop:32,paddingTop:16,borderTop:"1px solid #0e0e1e",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:9,color:"#222",textTransform:"uppercase",letterSpacing:"0.1em"}}>Dev Tools</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={simulateNextDay} style={{background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:999,padding:"6px 16px",color:"#fb923c",fontSize:10,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>
         Simulate Next Day
                </button>
                <button onClick={oracle.devModeActivate} style={{background:"rgba(0,255,80,0.06)",border:"1px solid rgba(0,255,80,0.2)",borderRadius:999,padding:"6px 16px",color:"#00ff50",fontSize:10,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>
         ⚡ Dev: Live 3 Teams
                </button>
                <button onClick={oracle.resetGames} style={{background:"rgba(255,255,255,0.03)",border:"1px solid #1e1e2e",borderRadius:999,padding:"6px 16px",color:"#333",fontSize:10,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>
         Reset Oracle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
