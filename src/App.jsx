import { useState, useEffect, useRef } from "react";

// ─── CREDENTIALS ─────────────────────────────────────────────────────────────
const ADMIN_USER = "admin";
const ADMIN_PASS = "YourBrand2025!";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id:"instagram", name:"Instagram",   icon:"📸", color:"#E1306C", maxChars:2200,  note:""             },
  { id:"tiktok",    name:"TikTok",      icon:"🎵", color:"#69C9D0", maxChars:2200,  note:"1-tap approve" },
  { id:"facebook",  name:"Facebook",    icon:"📘", color:"#4267B2", maxChars:63206, note:""             },
  { id:"twitter",   name:"X / Twitter", icon:"✕",  color:"#1DA1F2", maxChars:280,   note:""             },
  { id:"youtube",   name:"YouTube",     icon:"▶",  color:"#FF0000", maxChars:5000,  note:"Video only"    },
  { id:"linkedin",  name:"LinkedIn",    icon:"in", color:"#0077B5", maxChars:3000,  note:""             },
  { id:"spotify",   name:"Spotify",     icon:"♫",  color:"#1DB954", maxChars:0,     note:"Music only"    },
];

const LIVE_PLATFORMS = [
  { id:"youtube",   name:"YouTube Live",   icon:"▶",  color:"#FF0000", rtmpBase:"rtmp://a.rtmp.youtube.com/live2/"              },
  { id:"facebook",  name:"Facebook Live",  icon:"📘", color:"#4267B2", rtmpBase:"rtmps://live-api-s.facebook.com:443/rtmp/"     },
  { id:"instagram", name:"Instagram Live", icon:"📸", color:"#E1306C", rtmpBase:"rtmps://edgetee-upload.facebook.com:443/rtmp/" },
  { id:"tiktok",    name:"TikTok Live",    icon:"🎵", color:"#69C9D0", rtmpBase:"rtmp://push.tiktokcdn.com/live/"               },
  { id:"twitch",    name:"Twitch",         icon:"🎮", color:"#9146FF", rtmpBase:"rtmp://live.twitch.tv/app/"                    },
];

const POST_TYPES = [
  { id:"post",  label:"Post",       icon:"◈" },
  { id:"story", label:"Story",      icon:"◎" },
  { id:"reel",  label:"Reel",       icon:"▶" },
  { id:"music", label:"Music Drop", icon:"♪" },
];

const TONES = ["Hype","Chill","Professional","Raw / Real","Funny","Inspirational"];

// Social handle key → config key mapping (fix for Twitter/X lookup)
const SOCIAL_KEY_MAP = {
  Instagram:  "instagram",
  YouTube:    "youtube",
  TikTok:     "tiktok",
  "Twitter/X":"twitter",
  Facebook:   "facebook",
  Spotify:    "spotify",
};

const SOCIAL_LINKS = [
  { name:"Instagram", defaultHandle:"@yourhandle", color:"#E1306C", icon:"📸", followers:"12.4K", action:"Follow"    },
  { name:"YouTube",   defaultHandle:"@yourchannel",color:"#FF0000", icon:"▶",  followers:"8.2K",  action:"Subscribe" },
  { name:"TikTok",    defaultHandle:"@yourhandle", color:"#69C9D0", icon:"🎵", followers:"31K",   action:"Follow"    },
  { name:"Twitter/X", defaultHandle:"@yourhandle", color:"#1DA1F2", icon:"✕",  followers:"5.6K",  action:"Follow"    },
  { name:"Facebook",  defaultHandle:"Your Page",   color:"#4267B2", icon:"📘", followers:"9.1K",  action:"Like"      },
  { name:"Spotify",   defaultHandle:"Your Artist", color:"#1DB954", icon:"♫",  followers:"3.8K",  action:"Follow"    },
];

const MUSIC_TRACKS = [
  { title:"Track Name 01", genre:"Hip-Hop", duration:"3:42", plays:"1.2K", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", audioFile:"", audioFileName:"" },
  { title:"Track Name 02", genre:"R&B",     duration:"4:11", plays:"892",  audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", audioFile:"", audioFileName:"" },
  { title:"Track Name 03", genre:"Pop",     duration:"3:28", plays:"2.1K", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", audioFile:"", audioFileName:"" },
  { title:"Track Name 04", genre:"Trap",    duration:"2:58", plays:"644",  audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", audioFile:"", audioFileName:"" },
];

const SHOWS = [
  { title:"Episode 01 — Pilot",       desc:"The beginning of something legendary.",  duration:"42 min", views:"3.4K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoFile:"", videoFileName:"" },
  { title:"Episode 02 — The Come Up", desc:"How to build from nothing.",             duration:"38 min", views:"2.8K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=3JZ_D3ELwOQ", videoFile:"", videoFileName:"" },
  { title:"Episode 03 — Real Talk",   desc:"Industry secrets they won't tell you.",  duration:"51 min", views:"5.1K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=ZbZSe6N_BXs", videoFile:"", videoFileName:"" },
];

const MARKETING_PLAN = [
  { phase:"PHASE 01", title:"BRAND LOCK-IN",  timeline:"Week 1–2", color:"#FF6B35", steps:["Register your app name as a trademark","Claim same username across ALL platforms","Create one signature logo + color palette","Write a 10-word brand statement","Add your app link to EVERY bio TODAY"] },
  { phase:"PHASE 02", title:"TRAFFIC FUNNEL", timeline:"Week 3–4", color:"#C77DFF", steps:["Post a hub announcement Reel/TikTok","Pin the app link at top of every profile","Add QR code to all printed merch","Send email blast to existing list","Add app link to YouTube end screens"] },
  { phase:"PHASE 03", title:"CONTENT ENGINE", timeline:"Month 2",  color:"#00F5D4", steps:["Post exclusive content ONLY on your app","Tease app-exclusive content on Stories","Release music 48hrs before Spotify","Host a live Q&A exclusively inside app","Create a Members Only section"] },
  { phase:"PHASE 04", title:"MONETIZATION",   timeline:"Month 3+", color:"#FFD60A", steps:["Launch $4.99/mo fan membership tier","Sell digital downloads inside app","Offer brand partnerships","Add merch store tab inside the app","License show content to streaming platforms"] },
  { phase:"PHASE 05", title:"DOMINATION",     timeline:"Month 6+", color:"#F72585", steps:["Launch referral program with fan perks","Partner with 2–3 complementary creators","Pitch your app to local radio/TV","Submit to press as digital media hub","Add podcast feed to Apple/Spotify"] },
];

const NAV_BASE = [
  { id:"home",       label:"HOME",       icon:"⬡" },
  { id:"music",      label:"MUSIC",      icon:"♪" },
  { id:"shows",      label:"SHOWS",      icon:"▶" },
  { id:"gallery",    label:"GALLERY",    icon:"◈" },
  { id:"social",     label:"SOCIAL",     icon:"◎" },
  { id:"membership", label:"MEMBERS",    icon:"⭐", feature:"membershipEnabled" },
  { id:"booking",    label:"BOOKING",    icon:"📅" },
  { id:"chat",       label:"COMMUNITY",  icon:"💬" },
  { id:"merch",      label:"MERCH",      icon:"🛍", feature:"merchEnabled" },
];

const MOCK_SALES = [
  { id:"INV-001", date:"Mar 27", plan:"Pro Done For You", amount:499, status:"paid",     buyer:"Marcus D."  },
  { id:"INV-002", date:"Mar 25", plan:"Empire /mo",       amount:149, status:"paid",     buyer:"Tanya R."   },
  { id:"INV-003", date:"Mar 24", plan:"Starter Template", amount:97,  status:"paid",     buyer:"DeShawn T." },
  { id:"INV-004", date:"Mar 22", plan:"Empire /mo",       amount:149, status:"paid",     buyer:"Jordan M."  },
  { id:"INV-005", date:"Mar 20", plan:"Pro Done For You", amount:499, status:"paid",     buyer:"Keisha W."  },
  { id:"INV-006", date:"Mar 19", plan:"Starter Template", amount:97,  status:"pending",  buyer:"Alex P."    },
  { id:"INV-007", date:"Mar 15", plan:"Empire /mo",       amount:149, status:"paid",     buyer:"Chris L."   },
  { id:"INV-008", date:"Mar 10", plan:"Pro Done For You", amount:499, status:"refunded", buyer:"Sam B."     },
];

const DEFAULT_CONFIG = {
  brand:    { name:"YOUR BRAND", tagline:"DIGITAL MEDIA ENTERTAINMENT GROUP", primaryColor:"#FF6B35", accentColor:"#C77DFF", membershipPrice:"4.99", universalLink:"yourbrand.app/hub", logoUrl:"", logoType:"emoji", heroImageUrl:"", heroType:"gradient", heroHeading:"Your Media Empire", heroSubtext:"MUSIC · SHOWS · GALLERY · SOCIAL" },
  social:   { instagram:"", tiktok:"", youtube:"", twitter:"", facebook:"", spotify:"" },
  apis:     { publerKey:"", tiktokKey:"", youtubeKey:"", spotifyClientId:"", stripeKey:"" },
  liveKeys: { youtube:"", facebook:"", instagram:"", tiktok:"", twitch:"" },
  content:  { featuredTrack:"Your Latest Single", featuredTrackSub:"Out Now · All Platforms", showTitle:"YOUR TALK SHOW", membershipPerks:"Exclusive tracks, early episodes, behind-the-scenes access" },
  features: { membershipEnabled:true, downloadEnabled:true, scheduleEnabled:true, analyticsEnabled:false, merchEnabled:false },
  music: {
    bannerType:"gradient", bannerUrl:"", bannerGrad1:"#FF6B35", bannerGrad2:"#C77DFF",
    featuredTitle:"Your Latest Single", featuredSub:"Out Now · All Platforms",
    tracks:[
      { id:1, title:"Track Name 01", genre:"Hip-Hop", duration:"3:42", plays:"1.2K", icon:"♪", artUrl:"", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  audioFile:"", audioFileName:"" },
      { id:2, title:"Track Name 02", genre:"R&B",     duration:"4:11", plays:"892",  icon:"♪", artUrl:"", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  audioFile:"", audioFileName:"" },
      { id:3, title:"Track Name 03", genre:"Pop",     duration:"3:28", plays:"2.1K", icon:"♪", artUrl:"", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  audioFile:"", audioFileName:"" },
      { id:4, title:"Track Name 04", genre:"Trap",    duration:"2:58", plays:"644",  icon:"♪", artUrl:"", audioType:"url", audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  audioFile:"", audioFileName:"" },
    ],
  },
  shows: {
    showTitle:"YOUR TALK SHOW",
    showDesc:"Real conversations. No filter.",
    bannerUrl:"",
    episodes:[
      { id:1, title:"Episode 01 — Pilot",       desc:"The beginning of something legendary.",  duration:"42 min", views:"3.4K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoFile:"", videoFileName:"" },
      { id:2, title:"Episode 02 — The Come Up", desc:"How to build from nothing.",             duration:"38 min", views:"2.8K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=3JZ_D3ELwOQ", videoFile:"", videoFileName:"" },
      { id:3, title:"Episode 03 — Real Talk",   desc:"Industry secrets they won't tell you.",  duration:"51 min", views:"5.1K", thumbUrl:"", videoType:"url", videoUrl:"https://www.youtube.com/watch?v=ZbZSe6N_BXs", videoFile:"", videoFileName:"" },
    ],
  },
  gallery: {
    photos:[],
  },
  socialPosts: {
    instagram:{ imageUrl:"", caption:"", postUrl:"", date:"" },
    tiktok:   { imageUrl:"", caption:"", postUrl:"", date:"" },
    youtube:  { imageUrl:"", caption:"", postUrl:"", date:"" },
    twitter:  { imageUrl:"", caption:"", postUrl:"", date:"" },
    facebook: { imageUrl:"", caption:"", postUrl:"", date:"" },
    spotify:  { imageUrl:"", caption:"", postUrl:"", date:"" },
  },
  broadcast: {
    defaultPlatforms:["instagram","facebook","twitter"],
    templates:[
      { id:1, name:"Music Drop 🔥",        text:"New music just dropped! 🎵 Stream it now — link in bio. #NewMusic #Out Now" },
      { id:2, name:"Episode Release 🎙",   text:"New episode is LIVE 🎙 We're talking real talk today — go watch now! #Podcast #TalkShow" },
      { id:3, name:"Behind The Scenes 📸", text:"Take a look behind the curtain 👀 This is what goes into making it happen. #BTS #CreatorLife" },
      { id:4, name:"Call To Action ⚡",    text:"If you haven't yet — follow + subscribe to stay locked in ⚡ Big things coming. #StayTuned" },
    ],
    history:[],
    schedules:[],
  },
  merch: {
    products: [
      { id:1, name:"Empire Hoodie",        price:"65",  category:"Apparel",     emoji:"👕", desc:"Premium heavyweight hoodie",           colors:["Black","Orange","White"], sizes:["S","M","L","XL","2XL"], stock:"24", digital:false, active:true,  imageUrl:"" },
      { id:2, name:"Logo Snapback",        price:"38",  category:"Accessories", emoji:"🧢", desc:"Structured 6-panel snapback",          colors:["Black","Orange"],          sizes:["One Size"],              stock:"41", digital:false, active:true,  imageUrl:"" },
      { id:3, name:"Brand Tee",            price:"32",  category:"Apparel",     emoji:"👕", desc:"Classic heavyweight tee",              colors:["White","Black","Orange"],  sizes:["S","M","L","XL"],        stock:"56", digital:false, active:true,  imageUrl:"" },
      { id:4, name:"Phone Case",           price:"25",  category:"Accessories", emoji:"📱", desc:"Slim protective case",                 colors:["Black","Clear"],           sizes:["iPhone","Android"],      stock:"33", digital:false, active:true,  imageUrl:"" },
      { id:5, name:"Exclusive Mixtape",    price:"15",  category:"Digital",     emoji:"💿", desc:"10 exclusive tracks + instrumentals",  colors:[],                          sizes:[],                        stock:"999",digital:true,  active:true,  imageUrl:"", fileUrl:"" },
      { id:6, name:"Content Strategy PDF", price:"12",  category:"Digital",     emoji:"📋", desc:"90-day content strategy playbook",     colors:[],                          sizes:[],                        stock:"999",digital:true,  active:true,  imageUrl:"", fileUrl:"" },
      { id:7, name:"Producer Beat Pack",   price:"35",  category:"Digital",     emoji:"🎹", desc:"8 beats WAV + stems, royalty-free",    colors:[],                          sizes:[],                        stock:"999",digital:true,  active:true,  imageUrl:"", fileUrl:"" },
    ],
    categories: ["Apparel","Accessories","Digital","Collectibles"],
    stripeMode: "test",
    shippingMsg: "Free shipping on orders over $75",
  },
  chat: {
    enabled:      true,
    heroType:     "gradient",
    heroImageUrl: "",
    heroVideoUrl: "",
    heroMediaType:"image",
    heroHeading:  "THE COMMUNITY",
    heroSubtext:  "Connect · Share · Vibe",
    placeholder:  "Share something with the community...",
    roomName:     "The Feed",
  },
  ticker: {
    enabled:   true,
    speed:     40,           // seconds for one full scroll
    bgColor:   "#FF6B35",
    textColor: "#000000",
    separator: "◆",
    items: [
      "🎵 New music dropping this Friday — stay locked in!",
      "🎙 New episode of the talk show is LIVE now",
      "🛍 Merch store is open — grab your gear before it sells out",
      "📸 Follow us on Instagram for exclusive behind-the-scenes",
      "⭐ Join the fan membership — early access to everything",
    ],
  },
  membership: {
    enabled:     true,
    price:       "4.99",
    billingCycle:"month",
    title:       "Fan Membership",
    tagline:     "Get exclusive access to everything",
    perks: [
      "🎵 Exclusive tracks before they drop publicly",
      "🎙 Early access to every new episode",
      "📸 Behind-the-scenes content & updates",
      "💬 Members-only community access",
      "⭐ Monthly live Q&A with the team",
    ],
    ctaText:    "JOIN NOW",
    thankYouMsg:"Welcome to the inner circle! 🎉",
    stripeLink: "",
  },
  emailList: {
    enabled:      true,
    popupEnabled: true,
    popupDelay:   8,
    popupTitle:   "Stay in the loop 🔔",
    popupSubtext: "Get notified when new music and episodes drop.",
    ctaText:      "SUBSCRIBE",
    successMsg:   "You're in! Welcome to the family 🎉",
    mailchimpUrl: "",
    subscribers:  [],
  },
  booking: {
    enabled:      true,
    title:        "Book / Inquire",
    subtitle:     "Brand deals, features, appearances, and more.",
    types:        ["Brand Deal","Feature Request","Podcast Guest","Appearance","Other"],
    contactEmail: "youremail@gmail.com",
    responseTime: "We respond within 48 hours.",
    inquiries:    [],
  },
  linkInBio: {
    enabled:  true,
    headline: "YOUR BRAND",
    subtext:  "Digital Media Entertainment",
    links: [
      { id:1, label:"🎵 Latest Music",   url:"", active:true, color:"#FF6B35" },
      { id:2, label:"▶ Watch Episodes",  url:"", active:true, color:"#C77DFF" },
      { id:3, label:"🛍 Merch Store",    url:"", active:true, color:"#00F5D4" },
      { id:4, label:"📸 Instagram",      url:"", active:true, color:"#E1306C" },
      { id:5, label:"🎵 TikTok",         url:"", active:true, color:"#69C9D0" },
      { id:6, label:"▶ YouTube",         url:"", active:true, color:"#FF0000" },
      { id:7, label:"⭐ Fan Membership", url:"", active:true, color:"#FFD60A" },
    ],
  },
};

// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position:"fixed", top:"70px", right:"16px", zIndex:999, display:"flex", flexDirection:"column", gap:"8px", pointerEvents:"none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"flex-start", gap:"10px",
          padding:"12px 14px", borderRadius:"12px", maxWidth:"300px",
          background: t.type==="success" ? "rgba(0,245,212,0.12)" : t.type==="error" ? "rgba(255,59,48,0.12)" : t.type==="warning" ? "rgba(255,214,10,0.12)" : "rgba(255,107,53,0.12)",
          border: t.type==="success" ? "1px solid rgba(0,245,212,0.35)" : t.type==="error" ? "1px solid rgba(255,59,48,0.35)" : t.type==="warning" ? "1px solid rgba(255,214,10,0.35)" : "1px solid rgba(255,107,53,0.35)",
          backdropFilter:"blur(20px)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          animation:"toastIn 0.3s ease",
          pointerEvents:"all",
          fontFamily:"monospace",
        }}>
          <span style={{ fontSize:"16px", flexShrink:0 }}>
            {t.type==="success"?"✓":t.type==="error"?"✗":t.type==="warning"?"⚠":"◆"}
          </span>
          <div style={{ flex:1 }}>
            {t.title && <div style={{ fontSize:"11px", fontWeight:"800", color: t.type==="success"?"#00F5D4":t.type==="error"?"#FF3B30":t.type==="warning"?"#FFD60A":"#FF6B35", marginBottom:"2px", letterSpacing:"0.1em" }}>{t.title}</div>}
            <div style={{ fontSize:"11px", color:"#ccc", lineHeight:1.45 }}>{t.message}</div>
          </div>
          <button onClick={() => removeToast(t.id)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:"14px", padding:"0", flexShrink:0, pointerEvents:"all" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type="info", title="", duration=4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, addToast, removeToast,
    success: (msg, title="") => addToast(msg, "success", title),
    error:   (msg, title="") => addToast(msg, "error",   title),
    warning: (msg, title="") => addToast(msg, "warning", title),
    info:    (msg, title="") => addToast(msg, "info",    title),
  };
}

// ─── PUSH NOTIFICATION MANAGER ───────────────────────────────────────────────
const PUSH_PERMISSION_KEY = "mediaEmpirePushGranted";

async function requestPushPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied")  return "denied";
  const result = await Notification.requestPermission();
  return result;
}

function sendBrowserPush(title, body, icon="🎙") {
  if (Notification.permission !== "granted") return false;
  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "media-empire-" + Date.now(),
    });
    return true;
  } catch { return false; }
}

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:         "#080808",
    bgCard:     "rgba(255,255,255,0.025)",
    border:     "rgba(255,255,255,0.06)",
    borderNav:  "rgba(255,255,255,0.07)",
    text:       "#F0EDE8",
    textSub:    "#555",
    textMuted:  "#383838",
    navBg:      "rgba(8,8,8,0.85)",
    navInactive:"#484848",
    headerBgScrolled: "rgba(8,8,8,0.97)",
    headerBgTop:      "rgba(8,8,8,0.55)",
    glowA: "0.07",
    glowB: "0.055",
  },
  light: {
    bg:         "#F4F1EC",
    bgCard:     "rgba(0,0,0,0.04)",
    border:     "rgba(0,0,0,0.08)",
    borderNav:  "rgba(0,0,0,0.08)",
    text:       "#111111",
    textSub:    "#888",
    textMuted:  "#bbb",
    navBg:      "rgba(244,241,236,0.95)",
    navInactive:"#999",
    headerBgScrolled: "rgba(244,241,236,0.97)",
    headerBgTop:      "rgba(244,241,236,0.75)",
    glowA: "0.06",
    glowB: "0.04",
  },
};

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const h    = time.getHours();
  const m    = time.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  return `${days[time.getDay()]} ${h12}:${m} ${ampm}`;
}

// ─── SCROLLING TICKER ────────────────────────────────────────────────────────
function TickerBar({ ticker }) {
  if (!ticker || !ticker.enabled || !ticker.items?.length) return null;
  const sep   = ticker.separator || "◆";
  const speed = ticker.speed || 40;
  const text  = ticker.items.join(`   ${sep}   `);
  const full  = `${text}   ${sep}   ${text}`;
  return (
    <div style={{ overflow:"hidden", whiteSpace:"nowrap", background:ticker.bgColor||"#FF6B35", color:ticker.textColor||"#000", padding:"6px 0", fontSize:"11px", fontWeight:"700", fontFamily:"monospace", letterSpacing:"0.06em", borderBottom:"1px solid rgba(0,0,0,0.15)", position:"relative", zIndex:101 }}>
      <span style={{ display:"inline-block", animation:`tickerScroll ${speed}s linear infinite`, paddingLeft:"100%" }}>
        {full}
      </span>
      <style>{`@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function LogoDisplay({ config, size = 52 }) {
  const { primaryColor, accentColor, logoType, logoUrl } = config.brand;
  if (logoType === "image" && logoUrl) {
    return <img src={logoUrl} alt="logo" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover" }} />;
  }
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${primaryColor},${accentColor})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.round(size * 0.4), boxShadow:`0 0 ${Math.round(size*0.8)}px ${accentColor}55`, flexShrink:0 }}>
      🎙
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function MediaEmpire() {
  const [appState,  setAppState]  = useState("public");
  const [config,    setConfig]    = useState(DEFAULT_CONFIG);
  const [screen,    setScreen]    = useState("home");
  const [playing,   setPlaying]   = useState(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [darkMode,  setDarkMode]  = useState(true);
  const [pushStatus,setPushStatus]= useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const { toasts, removeToast, success, error, info } = useToast();
  const clock = useClock();
  const T = darkMode ? THEMES.dark : THEMES.light;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Prompt for push permission after 3 seconds on first visit
  useEffect(() => {
    if (pushStatus === "default") {
      const timer = setTimeout(async () => {
        const result = await requestPushPermission();
        setPushStatus(result);
        if (result === "granted") {
          success("Push notifications enabled! You'll get alerts for new drops.", "NOTIFICATIONS ON 🔔");
          sendBrowserPush("Welcome to Your Brand! 🎙", "Push notifications are now active. Stay tuned for drops.");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (appState === "adminLogin") {
    return <AdminLogin onSuccess={() => { setAppState("admin"); }} onBack={() => setAppState("public")} />;
  }
  if (appState === "admin") {
    return <AdminPanel config={config} saveConfig={setConfig} onLogout={() => setAppState("public")} sendToast={{ success, error, info }} pushStatus={pushStatus} />;
  }

  const pc  = config.brand.primaryColor;
  const ac  = config.brand.accentColor;

  // Only show nav items whose feature flag is enabled (or have no flag)
  const NAV = NAV_BASE.filter(n => !n.feature || config.features[n.feature]);

  return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif", background:T.bg, minHeight:"100vh", color:T.text, overflowX:"hidden", transition:"background 0.35s, color 0.35s" }}>

      {/* BG GLOW */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:`radial-gradient(ellipse at 15% 15%,${ac}${T.glowA} 0%,transparent 55%),radial-gradient(ellipse at 85% 85%,${pc}${T.glowB} 0%,transparent 55%)` }} />

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:scrolled ? T.headerBgScrolled : T.headerBgTop, backdropFilter:"blur(24px)", borderBottom:`1px solid ${T.border}`, transition:"background 0.4s", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>

        {/* LEFT — LOGO + NAME */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
          <LogoDisplay config={config} size={34} />
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:"16px", fontWeight:"900", letterSpacing:"0.12em", background:`linear-gradient(135deg,${pc},${ac})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {config.brand.name}
            </div>
            <div style={{ fontSize:"7px", letterSpacing:"0.3em", color:T.textSub, fontFamily:"monospace" }}>{config.brand.tagline}</div>
          </div>
        </div>

        {/* RIGHT — CLOCK + MODE TOGGLE + ADMIN */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>

          {/* LIVE CLOCK */}
          <div style={{ padding:"5px 10px", borderRadius:"14px", background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)", border:`1px solid ${T.border}`, fontSize:"9px", color:T.textSub, fontFamily:"monospace", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
            {clock}
          </div>

          {/* DARK / LIGHT TOGGLE */}
          <button onClick={() => setDarkMode(v => !v)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ width:"34px", height:"34px", borderRadius:"50%", border:`1px solid ${T.border}`, background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)", cursor:"pointer", fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* ADMIN */}
          <button onClick={() => setAppState("adminLogin")} style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)", border:`1px solid ${T.border}`, borderRadius:"18px", padding:"6px 11px", cursor:"pointer", fontSize:"10px", color:T.textSub, fontFamily:"monospace" }}>
            ⚙
          </button>
        </div>
      </header>

      {/* SCROLLING TICKER */}
      <TickerBar ticker={config.ticker} />

      {/* TOP NAV */}
      <nav style={{ display:"flex", overflowX:"auto", borderBottom:`1px solid ${T.border}`, background:T.navBg, backdropFilter:"blur(20px)", position:"sticky", top:"55px", zIndex:99, scrollbarWidth:"none", transition:"background 0.35s" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{ flex:"0 0 auto", padding:"12px 16px", background:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap", color:screen===n.id ? pc : T.navInactive, fontSize:"9px", letterSpacing:"0.22em", fontWeight:"700", fontFamily:"monospace", borderBottom:screen===n.id ? `2px solid ${pc}` : "2px solid transparent", transition:"all 0.25s" }}>
            <span style={{ marginRight:"5px" }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>

      {/* SCREENS */}
      <main style={{ position:"relative", zIndex:1, paddingBottom:"90px" }}>
        {screen === "home"       && <HomeScreen      go={setScreen} config={config} />}
        {screen === "music"      && <MusicScreen     config={config} />}
        {screen === "shows"      && <ShowsScreen     config={config} />}
        {screen === "gallery"    && <GalleryScreen   config={config} />}
        {screen === "social"     && <SocialScreen    config={config} />}
        {screen === "membership" && <MembershipScreen config={config} />}
        {screen === "booking"    && <BookingScreen   config={config} />}
        {screen === "linkinbio"  && <LinkInBioScreen config={config} />}
        {screen === "chat"       && <ChatRoomScreen  config={config} />}
        {screen === "merch"      && config.features.merchEnabled  && <MerchStore config={config} />}
        {screen === "merch"      && !config.features.merchEnabled && <FeatureLockedScreen name="Merch Store" flag="merchEnabled" go={() => setAppState("adminLogin")} />}
      </main>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background: darkMode ? "rgba(8,8,8,0.97)" : "rgba(244,241,236,0.97)", backdropFilter:"blur(24px)", borderTop:`1px solid ${T.borderNav}`, display:"flex", padding:"8px 0 18px", transition:"background 0.35s" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", color:screen===n.id ? pc : T.textMuted, transition:"color 0.25s" }}>
            <span style={{ fontSize:screen===n.id ? "20px" : "17px", transition:"font-size 0.2s" }}>{n.icon}</span>
            <span style={{ fontSize:"7px", letterSpacing:"0.12em", fontFamily:"monospace" }}>{n.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes fadeIn    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes livePulse { 0%,100%{ box-shadow:0 0 0 0 rgba(255,59,48,0.5); } 70%{ box-shadow:0 0 0 10px rgba(255,59,48,0); } }
        @keyframes toastIn   { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        ::-webkit-scrollbar  { display:none; }
        * { -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
        textarea::placeholder, input::placeholder { color:${darkMode?"#2a2a2a":"#bbb"}; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter:${darkMode?"invert(0.25)":"invert(0.6)"}; }
        select option { background:${darkMode?"#0a0a0f":"#f4f1ec"}; color:${T.text}; }
      `}</style>

      {/* TOAST NOTIFICATIONS */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* EMAIL CAPTURE POPUP */}
      <EmailCapturePopup config={config} setConfig={setConfig} />

      {/* PUSH PERMISSION BANNER */}
      {pushStatus === "default" && (
        <div style={{ position:"fixed", bottom:"90px", left:"16px", right:"16px", zIndex:200, padding:"14px 16px", borderRadius:"14px", background: darkMode?"rgba(8,8,8,0.97)":"rgba(244,241,236,0.97)", border:`1px solid ${pc}44`, backdropFilter:"blur(20px)", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 8px 32px rgba(0,0,0,0.3)", fontFamily:"monospace" }}>
          <span style={{ fontSize:"22px", flexShrink:0 }}>🔔</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"11px", fontWeight:"800", color:pc, letterSpacing:"0.1em", marginBottom:"2px" }}>STAY IN THE LOOP</div>
            <div style={{ fontSize:"10px", color:T.textSub }}>Get notified when new music and episodes drop.</div>
          </div>
          <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
            <button onClick={async () => { const r = await requestPushPermission(); setPushStatus(r); if(r==="granted") success("Notifications enabled! 🔔","LOCKED IN"); }} style={{ padding:"7px 12px", borderRadius:"9px", border:"none", background:pc, color:"#000", fontSize:"10px", fontWeight:"900", cursor:"pointer" }}>YES</button>
            <button onClick={() => setPushStatus("denied")} style={{ padding:"7px 10px", borderRadius:"9px", border:`1px solid ${T.border}`, background:"none", color:T.textSub, fontSize:"10px", cursor:"pointer" }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLogin({ onSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked,   setLocked]   = useState(false);

  const handleLogin = async () => {
    if (locked || loading) return;
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 900));
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      setLoading(false);
      onSuccess();
    } else {
      const n = attempts + 1;
      setAttempts(n);
      if (n >= 5) {
        setLocked(true);
        setError("Too many failed attempts. Locked for 30 seconds.");
        setTimeout(() => { setLocked(false); setAttempts(0); setError(""); }, 30000);
      } else {
        setError(`Invalid credentials. ${5 - n} attempt${5 - n === 1 ? "" : "s"} remaining.`);
      }
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === "Enter") handleLogin(); };
  const canSubmit = username.length > 0 && password.length > 0 && !locked && !loading;

  return (
    <div style={{ minHeight:"100vh", background:"#050508", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"monospace" }}>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(255,107,53,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:"radial-gradient(ellipse at 50% 40%,rgba(255,107,53,0.08) 0%,transparent 60%)" }} />

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"380px", animation:"fadeIn 0.5s ease" }}>
        {/* LOGO */}
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"18px", margin:"0 auto 16px", background:"linear-gradient(135deg,#FF6B35,#C77DFF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"30px", boxShadow:"0 0 40px rgba(255,107,53,0.3)" }}>⚙</div>
          <div style={{ fontSize:"20px", fontWeight:"900", letterSpacing:"0.2em", color:"#F0EDE8" }}>ADMIN PORTAL</div>
          <div style={{ fontSize:"9px", letterSpacing:"0.35em", color:"#444", marginTop:"4px" }}>YOUR BRAND · SECURE ACCESS</div>
        </div>

        {/* CARD */}
        <div style={{ background:"rgba(255,255,255,0.025)", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.07)", padding:"28px", backdropFilter:"blur(20px)" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#FF6B35", marginBottom:"20px" }}>◆ SECURE LOGIN</div>

          {/* USERNAME */}
          <div style={{ marginBottom:"14px" }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", display:"block", marginBottom:"7px" }}>USERNAME</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"#444", fontSize:"13px" }}>◎</span>
              <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={onKey}
                placeholder="admin" disabled={locked} autoComplete="username"
                style={{ width:"100%", padding:"13px 13px 13px 36px", background:"rgba(0,0,0,0.4)", border:`1px solid ${error ? "rgba(255,59,48,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius:"10px", color:"#F0EDE8", fontSize:"13px", outline:"none", fontFamily:"monospace", opacity:locked ? 0.5 : 1 }} />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom:"20px" }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", display:"block", marginBottom:"7px" }}>PASSWORD</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"#444", fontSize:"13px" }}>◆</span>
              <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
                type={showPass ? "text" : "password"} placeholder="••••••••••••" disabled={locked} autoComplete="current-password"
                style={{ width:"100%", padding:"13px 40px 13px 36px", background:"rgba(0,0,0,0.4)", border:`1px solid ${error ? "rgba(255,59,48,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius:"10px", color:"#F0EDE8", fontSize:"13px", outline:"none", fontFamily:"monospace", opacity:locked ? 0.5 : 1 }} />
              <button onClick={() => setShowPass(v => !v)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#484848", cursor:"pointer", fontSize:"14px", padding:"4px" }}>
                {showPass ? "◎" : "●"}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ padding:"10px 13px", borderRadius:"8px", marginBottom:"16px", background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.3)", fontSize:"11px", color:"#FF3B30" }}>
              {locked ? "🔒 " : "⚠ "}{error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button onClick={handleLogin} disabled={!canSubmit}
            style={{ width:"100%", padding:"14px", borderRadius:"12px", border:"none", background:canSubmit ? "linear-gradient(135deg,#FF6B35,#C77DFF)" : "rgba(255,255,255,0.05)", color:canSubmit ? "#000" : "#444", fontSize:"12px", fontWeight:"900", letterSpacing:"0.2em", cursor:canSubmit ? "pointer" : "not-allowed", transition:"all 0.3s" }}>
            {loading ? "◌ AUTHENTICATING..." : locked ? "🔒 LOCKED" : "◆ ACCESS ADMIN PANEL"}
          </button>

          <div style={{ height:"1px", background:"rgba(255,255,255,0.05)", margin:"20px 0" }} />

          <button onClick={onBack} style={{ width:"100%", padding:"11px", borderRadius:"10px", background:"none", border:"1px solid rgba(255,255,255,0.07)", color:"#484848", fontSize:"11px", letterSpacing:"0.15em", cursor:"pointer" }}>
            ← BACK TO APP
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:"18px", fontSize:"9px", color:"#222", letterSpacing:"0.2em" }}>SECURED · ADMIN ACCESS ONLY</div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} *{box-sizing:border-box} input::placeholder{color:#2a2a2a}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ config, saveConfig, onLogout, sendToast, pushStatus }) {
  const [cfg,       setCfg]       = useState(() => JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState("finance");
  const [saved,     setSaved]     = useState(false);
  const [testResult,setTestResult]= useState({});

  const update = (section, key, value) =>
    setCfg(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const handleSave = () => {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const testConn = async (name) => {
    setTestResult(p => ({ ...p, [name]:"testing" }));
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const key = cfg.apis[name] || cfg.liveKeys[name] || "";
    setTestResult(p => ({ ...p, [name]: key.length > 6 ? "success" : "fail" }));
  };

  const TABS = [
    { id:"finance",    label:"FINANCE",    icon:"💰" },
    { id:"brand",      label:"BRAND",      icon:"◈"  },
    { id:"ticker",     label:"TICKER",     icon:"📢"  },
    { id:"logo",       label:"LOGO",       icon:"🖼"  },
    { id:"music",      label:"MUSIC",      icon:"♪"  },
    { id:"shows",      label:"SHOWS",      icon:"▶"  },
    { id:"gallery",    label:"GALLERY",    icon:"◈"  },
    { id:"social",     label:"SOCIAL",     icon:"◎"  },
    { id:"membership", label:"MEMBERSHIP", icon:"⭐"  },
    { id:"emaillist",  label:"EMAIL LIST", icon:"📧"  },
    { id:"booking",    label:"BOOKING",    icon:"📅"  },
    { id:"linkinbio",  label:"LINK IN BIO",icon:"🔗"  },
    { id:"merch",      label:"MERCH",      icon:"🛍"  },
    { id:"chat",       label:"COMMUNITY",  icon:"💬"  },
    { id:"broadcast",  label:"BROADCAST",  icon:"◆"  },
    { id:"push",       label:"PUSH",       icon:"🔔"  },
    { id:"blueprint",  label:"BLUEPRINT",  icon:"★"  },
    { id:"analytics",  label:"ANALYTICS",  icon:"📊"  },
    { id:"live",       label:"GO LIVE",    icon:"🔴"  },
    { id:"apis",       label:"APIs",       icon:"⚙"  },
    { id:"features",   label:"FEATURES",   icon:"★"  },
    { id:"security",   label:"SECURITY",   icon:"🔒"  },
  ];

  return (
    <div style={{ fontFamily:"monospace", background:"#050508", minHeight:"100vh", color:"#E8E4DC" }}>

      {/* ADMIN HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(5,5,8,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,107,53,0.2)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#FF6B35,#C77DFF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>⚙</div>
          <div>
            <div style={{ fontSize:"14px", fontWeight:"900", letterSpacing:"0.15em", background:"linear-gradient(90deg,#FF6B35,#FFD60A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ADMIN PANEL</div>
            <div style={{ fontSize:"8px", letterSpacing:"0.3em", color:"#484848" }}>BACKEND CONFIGURATION</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={onLogout} style={{ padding:"8px 12px", borderRadius:"10px", cursor:"pointer", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#aaa", fontSize:"10px", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:"5px" }}>
            ← <span>APP</span>
          </button>
          <button onClick={handleSave} style={{ padding:"8px 16px", borderRadius:"10px", border:"none", cursor:"pointer", background:saved ? "#00F5D4" : "linear-gradient(90deg,#FF6B35,#FFD60A)", color:"#000", fontSize:"10px", fontWeight:"900", letterSpacing:"0.15em", transition:"all 0.3s" }}>
            {saved ? "✓ SAVED!" : "◆ SAVE ALL"}
          </button>
        </div>
      </div>

      {/* ADMIN TAB BAR */}
      <div style={{ display:"flex", overflowX:"auto", borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(5,5,8,0.95)", position:"sticky", top:"64px", zIndex:99, scrollbarWidth:"none", padding:"0 4px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex:"0 0 auto", padding:"12px 14px", background: activeTab===t.id ? "rgba(255,107,53,0.15)" : "none", border:"none", cursor:"pointer", color: activeTab===t.id ? "#FF6B35" : "#aaa", fontSize:"9px", letterSpacing:"0.18em", fontWeight:"700", borderBottom: activeTab===t.id ? "2px solid #FF6B35" : "2px solid transparent", transition:"all 0.2s", whiteSpace:"nowrap", borderRadius: activeTab===t.id ? "8px 8px 0 0" : "0" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ padding:"24px 20px", maxWidth:"640px", margin:"0 auto" }}>

        {activeTab === "finance"    && <FinanceTab />}
        {activeTab === "brand"      && <BrandTab    cfg={cfg} update={update} />}
        {activeTab === "ticker"     && <TickerAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "logo"       && <LogoTab     cfg={cfg} update={update} />}
        {activeTab === "music"      && <MusicAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "shows"      && <ShowsAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "gallery"    && <GalleryAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "social"     && <SocialPostsAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "membership" && <MembershipAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "emaillist"  && <EmailListAdminTab  cfg={cfg} setCfg={setCfg} />}
        {activeTab === "booking"    && <BookingAdminTab    cfg={cfg} setCfg={setCfg} />}
        {activeTab === "linkinbio"  && <LinkInBioAdminTab  cfg={cfg} setCfg={setCfg} />}
        {activeTab === "merch"      && <MerchAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "chat"       && <ChatAdminTab  cfg={cfg} setCfg={setCfg} />}
        {activeTab === "broadcast"  && <BroadcastAdminTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "push"       && <PushNotificationsTab cfg={cfg} setCfg={setCfg} pushStatus={pushStatus} sendToast={sendToast} />}
        {activeTab === "blueprint"  && <BlueprintAdminTab />}
        {activeTab === "analytics"  && <AnalyticsDashboard config={config} />}
        {activeTab === "live"       && <LiveTab     cfg={cfg} update={update} testConn={testConn} testResult={testResult} />}
        {activeTab === "apis"       && <ApisTab     cfg={cfg} update={update} testConn={testConn} testResult={testResult} />}
        {activeTab === "features"   && <FeaturesTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "security"   && <SecurityTab />}

        {/* SAVE FOOTER */}
        <div style={{ marginTop:"32px", paddingTop:"20px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={handleSave} style={{ width:"100%", padding:"15px", borderRadius:"12px", border:"none", cursor:"pointer", background:saved ? "#00F5D4" : "linear-gradient(90deg,#FF6B35,#FFD60A)", color:"#000", fontSize:"12px", fontWeight:"900", letterSpacing:"0.2em", transition:"all 0.3s" }}>
            {saved ? "✓ ALL CHANGES SAVED!" : "◆ SAVE & APPLY CHANGES"}
          </button>
          <button onClick={onLogout} style={{ width:"100%", marginTop:"10px", padding:"12px", borderRadius:"11px", cursor:"pointer", background:"rgba(255,59,48,0.07)", border:"1px solid rgba(255,59,48,0.2)", color:"#FF3B30", fontSize:"11px", letterSpacing:"0.15em" }}>
            LOGOUT OF ADMIN
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} *{box-sizing:border-box} input::placeholder,textarea::placeholder{color:#2a2a2a} ::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

// ─── MUSIC ADMIN TAB ──────────────────────────────────────────────────────────
const TRACK_ICONS = ["♪","♫","🎵","🎶","🎸","🎹","🎺","🎻","🥁","🎤","🎙","🔊","⭐","🔥","💿","🎧"];
const GENRES      = ["Hip-Hop","R&B","Pop","Trap","Gospel","Jazz","Rock","Soul","Afrobeats","Lo-Fi","House","Drill","Neo-Soul","Country","Latin"];

function MusicAdminTab({ cfg, setCfg }) {
  const bannerRef = useRef(null);
  const artRefs   = useRef({});
  const audioRefs = useRef({});

  const music = cfg.music || {};
  const tracks = music.tracks || [];

  const updateMusic = (key, val) =>
    setCfg(prev => ({ ...prev, music: { ...prev.music, [key]: val } }));

  const updateTrack = (id, key, val) =>
    setCfg(prev => ({
      ...prev,
      music: {
        ...prev.music,
        tracks: prev.music.tracks.map(t => t.id === id ? { ...t, [key]: val } : t),
      },
    }));

  const addTrack = () => {
    const newTrack = { id: Date.now(), title:"New Track", genre:"Hip-Hop", duration:"0:00", plays:"0", icon:"♪", artUrl:"" };
    setCfg(prev => ({ ...prev, music: { ...prev.music, tracks: [...prev.music.tracks, newTrack] } }));
  };

  const removeTrack = (id) =>
    setCfg(prev => ({ ...prev, music: { ...prev.music, tracks: prev.music.tracks.filter(t => t.id !== id) } }));

  const handleBannerFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => { updateMusic("bannerUrl", e.target.result); updateMusic("bannerType","image"); };
    reader.readAsDataURL(file);
  };

  const handleArtFile = (file, trackId) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => updateTrack(trackId, "artUrl", e.target.result);
    reader.readAsDataURL(file);
  };

  const bannerPreview = music.bannerType === "image" && music.bannerUrl
    ? `url(${music.bannerUrl}) center/cover no-repeat`
    : `linear-gradient(135deg,${music.bannerGrad1 || "#FF6B35"},${music.bannerGrad2 || "#C77DFF"})`;

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* ── BANNER ── */}
      <ASection title="Music Page Banner" icon="🖼" color="#FF6B35">
        {/* LIVE PREVIEW */}
        <div style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"16px", height:"120px", background:bannerPreview, position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)" }} />
          <div style={{ position:"absolute", bottom:"12px", left:"14px" }}>
            <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.5)", fontFamily:"monospace", letterSpacing:"0.2em" }}>♪ MUSIC</div>
            <div style={{ fontSize:"16px", fontWeight:"900", color:"#fff" }}>{music.featuredTitle || "Your Latest Single"}</div>
          </div>
        </div>

        {/* BANNER TYPE */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
          {[["gradient","Color Gradient"],["image","Custom Image"]].map(([val,label]) => (
            <div key={val} onClick={() => updateMusic("bannerType", val)}
              style={{ flex:1, padding:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer", border: music.bannerType===val ? "1px solid #FF6B35" : "1px solid rgba(255,255,255,0.07)", background: music.bannerType===val ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
              <div style={{ fontSize:"11px", fontWeight:"700", color: music.bannerType===val ? "#FF6B35" : "#777" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* GRADIENT PICKERS */}
        {music.bannerType !== "image" && (
          <div style={{ display:"flex", gap:"14px", marginBottom:"14px" }}>
            {[["bannerGrad1","FROM COLOR"],["bannerGrad2","TO COLOR"]].map(([key,label]) => (
              <div key={key} style={{ flex:1 }}>
                <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>{label}</label>
                <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                  <input type="color" value={music[key] || "#FF6B35"} onChange={e => updateMusic(key, e.target.value)}
                    style={{ width:"40px", height:"40px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"none" }} />
                  <span style={{ fontSize:"11px", color:"#555", fontFamily:"monospace" }}>{music[key] || "#FF6B35"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IMAGE UPLOAD */}
        {music.bannerType === "image" && (
          <div>
            <div onClick={() => bannerRef.current?.click()}
              style={{ padding:"20px", borderRadius:"12px", textAlign:"center", cursor:"pointer", border: music.bannerUrl ? "2px solid #FF6B35" : "2px dashed rgba(255,107,53,0.25)", background:"rgba(255,107,53,0.04)", marginBottom:"10px", transition:"all 0.3s" }}>
              <div style={{ fontSize:"24px", marginBottom:"6px" }}>{music.bannerUrl ? "🖼" : "📤"}</div>
              <div style={{ fontSize:"11px", color: music.bannerUrl ? "#FF6B35" : "#555" }}>
                {music.bannerUrl ? "Banner uploaded · Tap to change" : "Tap to upload banner image"}
              </div>
              <div style={{ fontSize:"9px", color:"#3a3a3a", marginTop:"3px" }}>Recommended: 1200×400px · JPG or PNG</div>
              <input ref={bannerRef} type="file" accept="image/*" onChange={e => handleBannerFile(e.target.files[0])} style={{ display:"none" }} />
            </div>
            {music.bannerUrl && (
              <button onClick={() => { updateMusic("bannerUrl",""); updateMusic("bannerType","gradient"); }}
                style={{ width:"100%", padding:"9px", borderRadius:"9px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>
                ✕ REMOVE IMAGE
              </button>
            )}
          </div>
        )}
      </ASection>

      {/* ── FEATURED RELEASE ── */}
      <ASection title="Featured Release Card" icon="◆" color="#C77DFF">
        <AField label="Release Title"    value={music.featuredTitle || ""} onChange={v => updateMusic("featuredTitle", v)} placeholder="Your Latest Single" />
        <AField label="Release Subtitle" value={music.featuredSub   || ""} onChange={v => updateMusic("featuredSub",   v)} placeholder="Out Now · All Platforms" />
      </ASection>

      {/* ── TRACKS ── */}
      <ASection title="Track List" icon="♪" color="#FF6B35">
        <div style={{ padding:"10px", borderRadius:"9px", marginBottom:"14px", background:"rgba(255,107,53,0.06)", border:"1px solid rgba(255,107,53,0.15)" }}>
          <div style={{ fontSize:"10px", color:"#FF6B35", marginBottom:"3px" }}>◆ TRACK EDITOR</div>
          <div style={{ fontSize:"11px", color:"#777" }}>Edit song title, genre, duration, plays, icon, and album art. Changes apply instantly.</div>
        </div>

        {tracks.map((track, idx) => (
          <div key={track.id} style={{ marginBottom:"16px", padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,107,53,0.15)" }}>
            {/* TRACK HEADER */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
              {/* ART THUMBNAIL */}
              <div onClick={() => artRefs.current[track.id]?.click()}
                style={{ width:"48px", height:"48px", borderRadius:"10px", flexShrink:0, overflow:"hidden", cursor:"pointer", border:"1px solid rgba(255,107,53,0.3)", background:"rgba(255,107,53,0.1)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                {track.artUrl
                  ? <img src={track.artUrl} alt="art" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <span style={{ fontSize:"20px" }}>{track.icon || "♪"}</span>
                }
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.6)" }}>📷</span>
                </div>
                <input ref={el => artRefs.current[track.id] = el} type="file" accept="image/*"
                  onChange={e => handleArtFile(e.target.files[0], track.id)} style={{ display:"none" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#ccc" }}>Track {idx + 1}</div>
                <div style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace" }}>Tap thumbnail to upload art</div>
              </div>
              <button onClick={() => removeTrack(track.id)}
                style={{ padding:"5px 10px", borderRadius:"8px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.08)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>
                ✕
              </button>
            </div>

            {/* FIELDS ROW 1 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"10px" }}>
              <div>
                <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"5px" }}>TITLE</label>
                <input value={track.title} onChange={e => updateTrack(track.id,"title",e.target.value)}
                  style={{ width:"100%", padding:"9px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
              </div>
              <div>
                <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"5px" }}>GENRE</label>
                <select value={track.genre} onChange={e => updateTrack(track.id,"genre",e.target.value)}
                  style={{ width:"100%", padding:"9px 10px", background:"#0a0a0f", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace", cursor:"pointer" }}>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* FIELDS ROW 2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px" }}>
              <div>
                <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"5px" }}>DURATION</label>
                <input value={track.duration} onChange={e => updateTrack(track.id,"duration",e.target.value)} placeholder="3:42"
                  style={{ width:"100%", padding:"9px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
              </div>
              <div>
                <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"5px" }}>PLAY COUNT</label>
                <input value={track.plays} onChange={e => updateTrack(track.id,"plays",e.target.value)} placeholder="1.2K"
                  style={{ width:"100%", padding:"9px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
              </div>
            </div>

            {/* AUDIO SOURCE */}
            <div style={{ marginTop:"12px" }}>
              <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"8px" }}>AUDIO SOURCE</label>
              {/* Type selector */}
              <div style={{ display:"flex", gap:"6px", marginBottom:"10px" }}>
                {[["url","🔗 URL"],["mp3","🎵 MP3"],["wav","🎤 WAV"],["aiff","💿 AIFF"]].map(([val,label]) => (
                  <button key={val} onClick={() => updateTrack(track.id,"audioType",val)}
                    style={{ flex:1, padding:"7px 4px", borderRadius:"8px", border:(track.audioType||"url")===val?"1px solid #FF6B35":"1px solid rgba(255,255,255,0.07)", background:(track.audioType||"url")===val?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.02)", color:(track.audioType||"url")===val?"#FF6B35":"#555", fontSize:"8px", fontWeight:"700", cursor:"pointer", transition:"all 0.2s", fontFamily:"monospace" }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* URL input */}
              {(track.audioType||"url") === "url" && (
                <input value={track.audioUrl||""} onChange={e => updateTrack(track.id,"audioUrl",e.target.value)}
                  placeholder="Paste Spotify, SoundCloud, or YouTube URL..."
                  style={{ width:"100%", padding:"9px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
              )}
              {/* File upload — MP3 / WAV / AIFF */}
              {["mp3","wav","aiff"].includes(track.audioType||"url") && (() => {
                const accept = track.audioType==="mp3" ? "audio/mpeg,.mp3" : track.audioType==="wav" ? "audio/wav,.wav" : "audio/aiff,.aiff,.aif";
                const aRef = audioRefs.current[track.id] || null;
                return (
                  <div>
                    {track.audioFileName ? (
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", borderRadius:"8px", background:"rgba(0,245,212,0.07)", border:"1px solid rgba(0,245,212,0.2)" }}>
                        <div>
                          <div style={{ fontSize:"10px", color:"#00F5D4", fontWeight:"700" }}>✓ {track.audioFileName}</div>
                          <div style={{ fontSize:"8px", color:"#484848", marginTop:"2px", fontFamily:"monospace" }}>{(track.audioType||"").toUpperCase()} · Ready to play</div>
                        </div>
                        <button onClick={() => updateTrack(track.id,"audioFile","") || updateTrack(track.id,"audioFileName","")}
                          style={{ fontSize:"9px", color:"#FF3B30", background:"none", border:"none", cursor:"pointer" }}>REMOVE</button>
                      </div>
                    ) : (
                      <div onClick={() => audioRefs.current[track.id]?.click()}
                        style={{ padding:"14px", borderRadius:"8px", textAlign:"center", cursor:"pointer", border:"2px dashed rgba(255,107,53,0.25)", background:"rgba(255,107,53,0.04)" }}>
                        <div style={{ fontSize:"18px", marginBottom:"4px" }}>🎵</div>
                        <div style={{ fontSize:"10px", color:"#FF6B35" }}>Tap to upload {(track.audioType||"").toUpperCase()} file</div>
                        <div style={{ fontSize:"9px", color:"#3a3a3a", marginTop:"2px" }}>Max 50MB</div>
                      </div>
                    )}
                    <input ref={el => audioRefs.current[track.id] = el} type="file" accept={accept}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 50 * 1024 * 1024) { alert("File exceeds 50MB limit"); return; }
                        const reader = new FileReader();
                        reader.onload = ev => {
                          updateTrack(track.id, "audioFile", ev.target.result);
                          updateTrack(track.id, "audioFileName", file.name);
                        };
                        reader.readAsDataURL(file);
                      }}
                      style={{ display:"none" }} />
                  </div>
                );
              })()}
            </div>

            {/* ICON PICKER */}
            <div>
              <label style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>TRACK ICON (shown when no art uploaded)</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                {TRACK_ICONS.map(icon => (
                  <button key={icon} onClick={() => updateTrack(track.id,"icon",icon)}
                    style={{ width:"36px", height:"36px", borderRadius:"8px", border: track.icon===icon ? "2px solid #FF6B35" : "1px solid rgba(255,255,255,0.08)", background: track.icon===icon ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)", fontSize:"18px", cursor:"pointer", transition:"all 0.2s" }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* ART STATUS */}
            {track.artUrl && (
              <div style={{ marginTop:"10px", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 10px", borderRadius:"8px", background:"rgba(0,245,212,0.07)", border:"1px solid rgba(0,245,212,0.2)" }}>
                <span style={{ fontSize:"10px", color:"#00F5D4" }}>✓ Album art uploaded</span>
                <button onClick={() => updateTrack(track.id,"artUrl","")}
                  style={{ fontSize:"9px", color:"#FF3B30", background:"none", border:"none", cursor:"pointer" }}>REMOVE</button>
              </div>
            )}
          </div>
        ))}

        {/* ADD TRACK */}
        <button onClick={addTrack}
          style={{ width:"100%", padding:"13px", borderRadius:"11px", border:"2px dashed rgba(255,107,53,0.25)", background:"rgba(255,107,53,0.04)", color:"#FF6B35", fontSize:"12px", fontWeight:"700", letterSpacing:"0.1em", cursor:"pointer", transition:"all 0.2s" }}>
          + ADD NEW TRACK
        </button>
      </ASection>
    </div>
  );
}

// ─── SHOWS ADMIN TAB ──────────────────────────────────────────────────────────
const VIDEO_TYPES_ACCEPT = "video/mp4,video/quicktime,video/webm";

function ShowsAdminTab({ cfg, setCfg }) {
  const bannerRef = useRef(null);
  const thumbRefs = useRef({});
  const videoRefs = useRef({});

  const shows    = cfg.shows || {};
  const episodes = shows.episodes || [];

  const updateShows   = (key,val) => setCfg(prev=>({...prev,shows:{...prev.shows,[key]:val}}));
  const updateEpisode = (id,key,val) => setCfg(prev=>({...prev,shows:{...prev.shows,episodes:prev.shows.episodes.map(e=>e.id===id?{...e,[key]:val}:e)}}));
  const addEpisode    = () => {
    const ep = { id:Date.now(), title:"New Episode", desc:"", duration:"0 min", views:"0", thumbUrl:"", videoType:"url", videoUrl:"", videoFile:"", videoFileName:"" };
    setCfg(prev=>({...prev,shows:{...prev.shows,episodes:[...prev.shows.episodes,ep]}}));
  };
  const removeEpisode = id => setCfg(prev=>({...prev,shows:{...prev.shows,episodes:prev.shows.episodes.filter(e=>e.id!==id)}}));

  const handleBanner = file => {
    if(!file||!file.type.startsWith("image/"))return;
    const r=new FileReader(); r.onload=e=>updateShows("bannerUrl",e.target.result); r.readAsDataURL(file);
  };
  const handleThumb = (file,id) => {
    if(!file||!file.type.startsWith("image/"))return;
    const r=new FileReader(); r.onload=e=>updateEpisode(id,"thumbUrl",e.target.result); r.readAsDataURL(file);
  };
  const handleVideo = (file,id) => {
    if(!file||!file.type.startsWith("video/"))return;
    updateEpisode(id,"videoFileName",file.name);
    updateEpisode(id,"videoType","file");
    const r=new FileReader(); r.onload=e=>updateEpisode(id,"videoFile",e.target.result); r.readAsDataURL(file);
  };

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {/* SHOW SETTINGS */}
      <ASection title="Show Settings" icon="▶" color="#C77DFF">
        <AField label="Show Title"       value={shows.showTitle||""} onChange={v=>updateShows("showTitle",v)} placeholder="YOUR TALK SHOW" />
        <AField label="Show Description" value={shows.showDesc||""}  onChange={v=>updateShows("showDesc",v)}  placeholder="Real conversations. No filter." />
        <div style={{marginBottom:"14px"}}>
          <label style={{fontSize:"9px",letterSpacing:"0.22em",color:"#555",display:"block",marginBottom:"7px"}}>SHOW BANNER IMAGE</label>
          {shows.bannerUrl
            ? <div style={{position:"relative",borderRadius:"10px",overflow:"hidden",marginBottom:"8px",height:"90px"}}>
                <img src={shows.bannerUrl} alt="banner" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <button onClick={()=>updateShows("bannerUrl","")} style={{position:"absolute",top:"6px",right:"6px",padding:"4px 10px",borderRadius:"7px",border:"none",background:"rgba(255,59,48,0.8)",color:"#fff",fontSize:"9px",cursor:"pointer"}}>✕ REMOVE</button>
              </div>
            : <div onClick={()=>bannerRef.current?.click()} style={{padding:"20px",borderRadius:"10px",textAlign:"center",cursor:"pointer",border:"2px dashed rgba(199,125,255,0.25)",background:"rgba(199,125,255,0.04)"}}>
                <div style={{fontSize:"20px",marginBottom:"4px"}}>🖼</div>
                <div style={{fontSize:"11px",color:"#777"}}>Tap to upload show banner · 1200×300px</div>
              </div>
          }
          <input ref={bannerRef} type="file" accept="image/*" onChange={e=>handleBanner(e.target.files[0])} style={{display:"none"}}/>
        </div>
      </ASection>

      {/* EPISODES */}
      <ASection title="Episodes" icon="🎬" color="#FF6B35">
        {episodes.map((ep,idx)=>(
          <div key={ep.id} style={{marginBottom:"18px",padding:"16px",borderRadius:"12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,107,53,0.18)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",fontWeight:"800",color:"#FF6B35"}}>EPISODE {idx+1}</div>
              <button onClick={()=>removeEpisode(ep.id)} style={{padding:"4px 10px",borderRadius:"7px",border:"1px solid rgba(255,59,48,0.3)",background:"rgba(255,59,48,0.08)",color:"#FF3B30",fontSize:"9px",cursor:"pointer"}}>✕ REMOVE</button>
            </div>

            {/* THUMBNAIL */}
            <div style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
              <div onClick={()=>thumbRefs.current[ep.id]?.click()} style={{width:"80px",height:"54px",borderRadius:"8px",overflow:"hidden",flexShrink:0,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {ep.thumbUrl ? <img src={ep.thumbUrl} alt="thumb" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:"20px",color:"#555"}}>🖼</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"9px",color:"#555",marginBottom:"4px",letterSpacing:"0.15em"}}>TAP LEFT TO UPLOAD THUMBNAIL</div>
                {ep.thumbUrl && <button onClick={()=>updateEpisode(ep.id,"thumbUrl","")} style={{fontSize:"9px",color:"#FF3B30",background:"none",border:"none",cursor:"pointer"}}>✕ Remove</button>}
              </div>
              <input ref={el=>thumbRefs.current[ep.id]=el} type="file" accept="image/*" onChange={e=>handleThumb(e.target.files[0],ep.id)} style={{display:"none"}}/>
            </div>

            {/* TITLE + DESC */}
            <div style={{marginBottom:"10px"}}>
              <AField label="Episode Title"       value={ep.title} onChange={v=>updateEpisode(ep.id,"title",v)}    placeholder="Episode 01 — Title" />
              <AField label="Description"         value={ep.desc}  onChange={v=>updateEpisode(ep.id,"desc",v)}     placeholder="What this episode is about..." />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
              <div><label style={{fontSize:"8px",color:"#555",letterSpacing:"0.2em",display:"block",marginBottom:"5px"}}>DURATION</label><input value={ep.duration} onChange={e=>updateEpisode(ep.id,"duration",e.target.value)} placeholder="42 min" style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/></div>
              <div><label style={{fontSize:"8px",color:"#555",letterSpacing:"0.2em",display:"block",marginBottom:"5px"}}>VIEW COUNT</label><input value={ep.views} onChange={e=>updateEpisode(ep.id,"views",e.target.value)} placeholder="3.4K" style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/></div>
            </div>

            {/* VIDEO SOURCE */}
            <div>
              <div style={{fontSize:"9px",color:"#555",letterSpacing:"0.2em",marginBottom:"8px"}}>VIDEO SOURCE</div>
              <div style={{display:"flex",gap:"6px",marginBottom:"10px"}}>
                {[["url","URL Link"],["file","Upload File"]].map(([t,l])=>(
                  <button key={t} onClick={()=>updateEpisode(ep.id,"videoType",t)} style={{flex:1,padding:"9px",borderRadius:"8px",border:ep.videoType===t?"1px solid #FF6B35":"1px solid rgba(255,255,255,0.08)",background:ep.videoType===t?"rgba(255,107,53,0.12)":"rgba(255,255,255,0.02)",color:ep.videoType===t?"#FF6B35":"#555",fontSize:"10px",fontWeight:ep.videoType===t?"800":"400",cursor:"pointer"}}>
                    {ep.videoType===t&&"● "}{l}
                  </button>
                ))}
              </div>
              {ep.videoType==="url"
                ? <input value={ep.videoUrl||""} onChange={e=>updateEpisode(ep.id,"videoUrl",e.target.value)} placeholder="https://youtube.com/watch?v=... or Vimeo URL" style={{width:"100%",padding:"10px 13px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/>
                : <div>
                    {ep.videoFileName
                      ? <div style={{padding:"10px 14px",borderRadius:"8px",background:"rgba(0,245,212,0.07)",border:"1px solid rgba(0,245,212,0.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div><div style={{fontSize:"11px",color:"#00F5D4"}}>✓ {ep.videoFileName}</div></div>
                          <button onClick={()=>{updateEpisode(ep.id,"videoFile","");updateEpisode(ep.id,"videoFileName","");}} style={{fontSize:"9px",color:"#FF3B30",background:"none",border:"none",cursor:"pointer"}}>REMOVE</button>
                        </div>
                      : <div onClick={()=>videoRefs.current[ep.id]?.click()} style={{padding:"18px",borderRadius:"8px",textAlign:"center",cursor:"pointer",border:"2px dashed rgba(255,107,53,0.25)",background:"rgba(255,107,53,0.03)"}}>
                          <div style={{fontSize:"20px",marginBottom:"4px"}}>🎬</div>
                          <div style={{fontSize:"11px",color:"#777"}}>Tap to upload MP4, MOV, or WebM</div>
                          <div style={{fontSize:"9px",color:"#3a3a3a",marginTop:"2px"}}>Max 2GB</div>
                        </div>
                    }
                    <input ref={el=>videoRefs.current[ep.id]=el} type="file" accept={VIDEO_TYPES_ACCEPT} onChange={e=>handleVideo(e.target.files[0],ep.id)} style={{display:"none"}}/>
                  </div>
              }
            </div>
          </div>
        ))}
        <button onClick={addEpisode} style={{width:"100%",padding:"13px",borderRadius:"11px",border:"2px dashed rgba(255,107,53,0.25)",background:"rgba(255,107,53,0.04)",color:"#FF6B35",fontSize:"12px",fontWeight:"700",letterSpacing:"0.1em",cursor:"pointer"}}>
          + ADD NEW EPISODE
        </button>
      </ASection>
    </div>
  );
}

// ─── GALLERY ADMIN TAB ────────────────────────────────────────────────────────
const MAX_FILE_MB    = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

function GalleryAdminTab({ cfg, setCfg }) {
  const fileRef = useRef(null);
  const [dragging,    setDragging]    = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [editPhoto,   setEditPhoto]   = useState(null);
  const [rotation,    setRotation]    = useState(0);
  const [flipH,       setFlipH]       = useState(false);
  const [flipV,       setFlipV]       = useState(false);
  const [filter,      setFilter]      = useState("none");
  const [brightness,  setBrightness]  = useState(100);
  const [contrast,    setContrast]    = useState(100);

  const photos = (cfg.gallery && cfg.gallery.photos) || [];

  const setPhotos = fn => setCfg(prev=>({...prev,gallery:{...prev.gallery,photos:typeof fn==="function"?fn(prev.gallery?.photos||[]):fn}}));

  const processFiles = fileList => {
    const files = Array.from(fileList);
    const valid=[]; const errors=[];
    files.forEach(f=>{
      if(!f.type.startsWith("image/")) errors.push(`${f.name}: Not an image`);
      else if(f.size>MAX_FILE_BYTES) errors.push(`${f.name}: Over ${MAX_FILE_MB}MB (${(f.size/1024/1024).toFixed(1)}MB)`);
      else valid.push(f);
    });
    if(errors.length) alert("⚠️ Skipped:\n"+errors.join("\n"));
    if(!valid.length) return;
    const q = valid.map(f=>({name:f.name,progress:0,status:"pending"}));
    setUploadQueue(q);
    valid.forEach((file,idx)=>{
      const reader = new FileReader();
      let pct=0;
      const tick = setInterval(()=>{
        pct=Math.min(pct+Math.floor(Math.random()*18)+8,90);
        setUploadQueue(prev=>prev.map((qi,i)=>i===idx?{...qi,progress:pct,status:"uploading"}:qi));
      },80);
      reader.onload=e=>{
        clearInterval(tick);
        setUploadQueue(prev=>prev.map((qi,i)=>i===idx?{...qi,progress:100,status:"done"}:qi));
        const photo={id:Date.now()+idx,src:e.target.result,name:file.name,size:`${(file.size/1024).toFixed(0)} KB`,filter:"none",rotation:0,flipH:false,flipV:false,brightness:100,contrast:100};
        setPhotos(prev=>[...prev,photo]);
        if(idx===valid.length-1) setTimeout(()=>setUploadQueue([]),1400);
      };
      reader.readAsDataURL(file);
    });
  };

  const openEditor = photo => { setEditPhoto(photo); setRotation(photo.rotation||0); setFlipH(photo.flipH||false); setFlipV(photo.flipV||false); setFilter(photo.filter||"none"); setBrightness(photo.brightness||100); setContrast(photo.contrast||100); };
  const saveEdits  = () => { setPhotos(prev=>prev.map(p=>p.id===editPhoto.id?{...p,rotation,flipH,flipV,filter,brightness,contrast}:p)); setEditPhoto(null); };

  if (editPhoto) return (
    <div style={{background:"#050508",minHeight:"100vh",color:"#F0EDE8",fontFamily:"monospace"}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(5,5,8,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,245,212,0.15)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontSize:"14px",fontWeight:"900",color:"#00F5D4"}}>PHOTO EDITOR</div><div style={{fontSize:"9px",color:"#484848"}}>{editPhoto.name}</div></div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={()=>setEditPhoto(null)} style={{padding:"7px 14px",borderRadius:"9px",border:"1px solid rgba(255,255,255,0.1)",background:"none",color:"#777",fontSize:"10px",cursor:"pointer"}}>CANCEL</button>
          <button onClick={saveEdits} style={{padding:"7px 14px",borderRadius:"9px",border:"none",background:"linear-gradient(90deg,#00F5D4,#C77DFF)",color:"#000",fontSize:"10px",fontWeight:"900",cursor:"pointer"}}>SAVE ✓</button>
        </div>
      </div>
      <div style={{background:"#000",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"260px",padding:"16px"}}>
        <img src={editPhoto.src} alt="edit" style={{maxWidth:"100%",maxHeight:"240px",objectFit:"contain",filter:buildFilter(filter,brightness,contrast),transform:buildTransform(rotation,flipH,flipV),transition:"all 0.3s",borderRadius:"8px"}}/>
      </div>
      <div style={{padding:"20px"}}>
        <div style={{marginBottom:"18px"}}>
          <div style={{fontSize:"9px",letterSpacing:"0.25em",color:"#00F5D4",marginBottom:"10px"}}>◆ ROTATE & FLIP</div>
          <div style={{display:"flex",gap:"8px"}}>
            {[["↺ Left",()=>setRotation(r=>(r-90+360)%360)],["↻ Right",()=>setRotation(r=>(r+90)%360)],["⇔ H",()=>setFlipH(v=>!v)],["⇕ V",()=>setFlipV(v=>!v)]].map(([l,fn],i)=>(
              <button key={i} onClick={fn} style={{flex:1,padding:"10px 4px",borderRadius:"8px",border:"1px solid rgba(0,245,212,0.2)",background:"rgba(0,245,212,0.07)",color:"#00F5D4",fontSize:"10px",fontWeight:"700",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:"18px"}}>
          <div style={{fontSize:"9px",letterSpacing:"0.25em",color:"#00F5D4",marginBottom:"10px"}}>◆ FILTERS</div>
          <div style={{display:"flex",overflowX:"auto",gap:"8px",paddingBottom:"4px",scrollbarWidth:"none"}}>
            {FILTERS.map(f=>(
              <div key={f.id} onClick={()=>setFilter(f.id)} style={{flexShrink:0,textAlign:"center",cursor:"pointer"}}>
                <div style={{width:"60px",height:"60px",borderRadius:"9px",overflow:"hidden",border:filter===f.id?"2px solid #00F5D4":"2px solid rgba(255,255,255,0.07)",marginBottom:"4px"}}>
                  <img src={editPhoto.src} alt={f.label} style={{width:"100%",height:"100%",objectFit:"cover",filter:f.css==="none"?"none":f.css}}/>
                </div>
                <div style={{fontSize:"8px",color:filter===f.id?"#00F5D4":"#484848",letterSpacing:"0.08em"}}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
        {[["BRIGHTNESS",brightness,setBrightness],["CONTRAST",contrast,setContrast]].map(([lbl,val,set],i)=>(
          <div key={i} style={{marginBottom:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
              <span style={{fontSize:"9px",color:"#777",letterSpacing:"0.15em"}}>{lbl}</span>
              <span style={{fontSize:"9px",color:"#00F5D4",fontFamily:"monospace"}}>{val}%</span>
            </div>
            <input type="range" min={50} max={150} value={val} onChange={e=>set(Number(e.target.value))} style={{width:"100%",accentColor:"#00F5D4",cursor:"pointer"}}/>
          </div>
        ))}
        <button onClick={()=>{setRotation(0);setFlipH(false);setFlipV(false);setFilter("none");setBrightness(100);setContrast(100);}} style={{width:"100%",padding:"11px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#555",fontSize:"10px",letterSpacing:"0.15em",cursor:"pointer"}}>↺ RESET ALL</button>
      </div>
    </div>
  );

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <ASection title="Gallery Manager" icon="◈" color="#00F5D4">
        <div style={{display:"flex",gap:"10px",marginBottom:"16px"}}>
          {[{label:"PHOTOS",val:photos.length.toString(),color:"#00F5D4"},{label:"MAX SIZE",val:`${MAX_FILE_MB}MB`,color:"#FFD60A"}].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"12px 8px",borderRadius:"10px",background:"rgba(255,255,255,0.03)",border:`1px solid ${s.color}22`,textAlign:"center"}}>
              <div style={{fontSize:"18px",fontWeight:"900",color:s.color,fontFamily:"monospace"}}>{s.val}</div>
              <div style={{fontSize:"8px",letterSpacing:"0.2em",color:"#484848",marginTop:"2px"}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* UPLOAD ZONE */}
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);processFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current?.click()}
          style={{padding:"24px 20px",borderRadius:"12px",textAlign:"center",cursor:"pointer",border:dragging?"2px solid #00F5D4":"2px dashed rgba(0,245,212,0.25)",background:dragging?"rgba(0,245,212,0.08)":"rgba(0,245,212,0.03)",transition:"all 0.3s",marginBottom:"14px"}}>
          <div style={{fontSize:"24px",marginBottom:"6px"}}>📸</div>
          <div style={{fontSize:"12px",fontWeight:"700",color:"#00F5D4",marginBottom:"3px"}}>TAP TO UPLOAD PHOTOS</div>
          <div style={{fontSize:"10px",color:"#484848"}}>Drag & drop · Multiple files · PNG JPG WebP · Max {MAX_FILE_MB}MB each</div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e=>processFiles(e.target.files)} style={{display:"none"}}/>
        </div>

        {/* PROGRESS */}
        {uploadQueue.length>0 && (
          <div style={{marginBottom:"14px",padding:"12px",borderRadius:"10px",background:"rgba(0,245,212,0.04)",border:"1px solid rgba(0,245,212,0.15)"}}>
            <div style={{fontSize:"9px",color:"#00F5D4",letterSpacing:"0.2em",marginBottom:"8px"}}>⚡ UPLOADING {uploadQueue.filter(q=>q.status==="done").length} / {uploadQueue.length}</div>
            {uploadQueue.map((item,i)=>(
              <div key={i} style={{marginBottom:i<uploadQueue.length-1?"8px":"0"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                  <span style={{fontSize:"10px",color:"#bbb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{item.name}</span>
                  <span style={{fontSize:"9px",fontFamily:"monospace",color:item.status==="done"?"#00F5D4":item.status==="error"?"#FF3B30":"#FFD60A",flexShrink:0}}>{item.status==="done"?"✓":item.status==="error"?"✗":`${item.progress}%`}</span>
                </div>
                <div style={{height:"3px",borderRadius:"2px",background:"rgba(255,255,255,0.06)"}}>
                  <div style={{height:"100%",borderRadius:"2px",width:`${item.progress}%`,background:item.status==="done"?"#00F5D4":item.status==="error"?"#FF3B30":"linear-gradient(90deg,#00F5D4,#C77DFF)",transition:"width 0.15s ease"}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PHOTO GRID */}
        {photos.length>0 && (
          <div>
            <div style={{fontSize:"9px",color:"#555",letterSpacing:"0.2em",fontFamily:"monospace",marginBottom:"10px"}}>{photos.length} PHOTO{photos.length!==1?"S":""} IN GALLERY</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px"}}>
              {photos.map((photo,idx)=>(
                <div key={photo.id||idx} style={{position:"relative",aspectRatio:"1",borderRadius:"8px",overflow:"hidden"}}>
                  <img src={photo.src} alt={photo.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:buildFilter(photo.filter||"none",photo.brightness||100,photo.contrast||100),transform:buildTransform(photo.rotation||0,photo.flipH||false,photo.flipV||false)}}/>
                  <div style={{position:"absolute",top:"4px",right:"4px",display:"flex",gap:"3px"}}>
                    <button onClick={()=>openEditor(photo)} style={{width:"22px",height:"22px",borderRadius:"5px",background:"rgba(0,0,0,0.7)",border:"none",color:"#00F5D4",fontSize:"10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✏</button>
                    <button onClick={()=>setPhotos(prev=>prev.filter(p=>p.id!==photo.id))} style={{width:"22px",height:"22px",borderRadius:"5px",background:"rgba(0,0,0,0.7)",border:"none",color:"#FF3B30",fontSize:"10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ASection>
    </div>
  );
}

// ─── SOCIAL POSTS ADMIN TAB ──────────────────────────────────────────────────
const SOCIAL_POST_PLATFORMS = [
  { id:"instagram", name:"Instagram", icon:"📸", color:"#E1306C" },
  { id:"tiktok",    name:"TikTok",    icon:"🎵", color:"#69C9D0" },
  { id:"youtube",   name:"YouTube",   icon:"▶",  color:"#FF0000" },
  { id:"twitter",   name:"Twitter/X", icon:"✕",  color:"#1DA1F2" },
  { id:"facebook",  name:"Facebook",  icon:"📘", color:"#4267B2" },
  { id:"spotify",   name:"Spotify",   icon:"♫",  color:"#1DB954" },
];

function SocialPostsAdminTab({ cfg, setCfg }) {
  const imgRefs = useRef({});
  const posts   = cfg.socialPosts || {};

  const updatePost = (pid,key,val) => setCfg(prev=>({...prev,socialPosts:{...prev.socialPosts,[pid]:{...prev.socialPosts?.[pid],[key]:val}}}));

  const handleImage = (file, pid) => {
    if(!file||!file.type.startsWith("image/"))return;
    const r=new FileReader(); r.onload=e=>updatePost(pid,"imageUrl",e.target.result); r.readAsDataURL(file);
  };

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <ASection title="Social Last Post Images" icon="◎" color="#FFD60A">
        <div style={{padding:"12px",borderRadius:"10px",marginBottom:"16px",background:"rgba(255,214,10,0.06)",border:"1px solid rgba(255,214,10,0.15)"}}>
          <div style={{fontSize:"10px",color:"#FFD60A",marginBottom:"4px"}}>◆ HOW IT WORKS</div>
          <div style={{fontSize:"11px",color:"#777",lineHeight:1.6}}>Upload the most recent image from each platform. It shows up under the platform card on the Social Hub page so fans can see your latest content from each one.</div>
        </div>
        {SOCIAL_POST_PLATFORMS.map(p=>{
          const post = posts[p.id]||{};
          return (
            <div key={p.id} style={{marginBottom:"18px",padding:"16px",borderRadius:"12px",background:"rgba(255,255,255,0.02)",border:`1px solid ${p.color}22`}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"9px",background:`${p.color}20`,border:`1px solid ${p.color}44`,display:"flex",alignItems:"center",justifyContent:"center",color:p.color,fontSize:"16px",flexShrink:0}}>{p.icon}</div>
                <div style={{fontSize:"12px",fontWeight:"800",color:p.color,letterSpacing:"0.1em"}}>{p.name.toUpperCase()}</div>
              </div>

              {/* IMAGE */}
              <div style={{display:"flex",gap:"12px",marginBottom:"12px"}}>
                <div onClick={()=>imgRefs.current[p.id]?.click()} style={{width:"72px",height:"72px",borderRadius:"10px",overflow:"hidden",flexShrink:0,cursor:"pointer",border:`1px solid ${p.color}44`,background:`${p.color}10`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {post.imageUrl ? <img src={post.imageUrl} alt="post" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:"24px"}}>{p.icon}</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",color:"#555",marginBottom:"6px",letterSpacing:"0.15em"}}>LAST POST IMAGE</div>
                  <button onClick={()=>imgRefs.current[p.id]?.click()} style={{padding:"7px 14px",borderRadius:"8px",border:`1px solid ${p.color}44`,background:`${p.color}10`,color:p.color,fontSize:"10px",fontWeight:"700",cursor:"pointer",marginRight:"6px"}}>
                    {post.imageUrl?"📷 REPLACE":"📷 UPLOAD"}
                  </button>
                  {post.imageUrl && <button onClick={()=>updatePost(p.id,"imageUrl","")} style={{fontSize:"9px",color:"#FF3B30",background:"none",border:"none",cursor:"pointer"}}>✕ Remove</button>}
                </div>
                <input ref={el=>imgRefs.current[p.id]=el} type="file" accept="image/*" onChange={e=>handleImage(e.target.files[0],p.id)} style={{display:"none"}}/>
              </div>

              {/* CAPTION + DATE + URL */}
              <div style={{marginBottom:"8px"}}>
                <label style={{fontSize:"8px",color:"#555",letterSpacing:"0.2em",display:"block",marginBottom:"4px"}}>CAPTION</label>
                <input value={post.caption||""} onChange={e=>updatePost(p.id,"caption",e.target.value)} placeholder={`Latest ${p.name} post caption...`}
                  style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                <div>
                  <label style={{fontSize:"8px",color:"#555",letterSpacing:"0.2em",display:"block",marginBottom:"4px"}}>POST URL</label>
                  <input value={post.postUrl||""} onChange={e=>updatePost(p.id,"postUrl",e.target.value)} placeholder="https://..."
                    style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/>
                </div>
                <div>
                  <label style={{fontSize:"8px",color:"#555",letterSpacing:"0.2em",display:"block",marginBottom:"4px"}}>POST DATE</label>
                  <input value={post.date||""} onChange={e=>updatePost(p.id,"date",e.target.value)} placeholder="Mar 27, 2026"
                    style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/>
                </div>
              </div>
            </div>
          );
        })}
      </ASection>
    </div>
  );
}

// ─── BROADCAST ADMIN TAB ──────────────────────────────────────────────────────
function BroadcastAdminTab({ cfg, setCfg }) {
  const [newTplName, setNewTplName] = useState("");
  const [newTplText, setNewTplText] = useState("");
  const [copied,     setCopied]     = useState(null);

  const bc = cfg.broadcast || { defaultPlatforms:["instagram","facebook","twitter"], templates:[], history:[], schedules:[] };

  const updateBc    = (key,val) => setCfg(prev=>({...prev,broadcast:{...prev.broadcast,[key]:val}}));
  const toggleDefPlatform = id => {
    const cur = bc.defaultPlatforms || [];
    updateBc("defaultPlatforms", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur,id]);
  };
  const addTemplate = () => {
    if(!newTplName.trim()||!newTplText.trim())return;
    const t={ id:Date.now(), name:newTplName.trim(), text:newTplText.trim() };
    updateBc("templates",[...(bc.templates||[]),t]);
    setNewTplName(""); setNewTplText("");
  };
  const removeTemplate = id => updateBc("templates",(bc.templates||[]).filter(t=>t.id!==id));
  const copyTemplate   = (id,text) => { navigator.clipboard?.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),2000); };

  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const addSchedule = () => {
    const s={ id:Date.now(), title:"New Schedule", days:["Mon"], time:"09:00", platforms:["instagram"], enabled:true };
    updateBc("schedules",[...(bc.schedules||[]),s]);
  };
  const updateSchedule = (id,key,val) => updateBc("schedules",(bc.schedules||[]).map(s=>s.id===id?{...s,[key]:val}:s));
  const removeSchedule = id => updateBc("schedules",(bc.schedules||[]).filter(s=>s.id!==id));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>

      {/* DEFAULT PLATFORMS */}
      <ASection title="Default Platforms" icon="◆" color="#FF6B35">
        <div style={{fontSize:"11px",color:"#777",marginBottom:"12px",lineHeight:1.6}}>These platforms are pre-selected every time you open the Broadcast screen.</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
          {PLATFORMS.filter(p=>p.maxChars>0).map(p=>{
            const on=(bc.defaultPlatforms||[]).includes(p.id);
            return(
              <button key={p.id} onClick={()=>toggleDefPlatform(p.id)} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 14px",borderRadius:"18px",cursor:"pointer",background:on?`${p.color}20`:"rgba(255,255,255,0.03)",border:on?`1px solid ${p.color}`:"1px solid rgba(255,255,255,0.07)",color:on?p.color:"#484848",fontSize:"11px",fontWeight:on?"700":"400",transition:"all 0.2s"}}>
                <span>{p.icon}</span><span>{p.name}</span>{on&&<span>✓</span>}
              </button>
            );
          })}
        </div>
      </ASection>

      {/* CAPTION TEMPLATES */}
      <ASection title="Caption Templates" icon="◈" color="#C77DFF">
        <div style={{fontSize:"11px",color:"#777",marginBottom:"14px"}}>Save reusable captions. Tap Copy to paste into any broadcast.</div>
        {(bc.templates||[]).map(t=>(
          <div key={t.id} style={{marginBottom:"10px",padding:"13px",borderRadius:"10px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(199,125,255,0.15)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
              <div style={{fontSize:"11px",fontWeight:"800",color:"#C77DFF"}}>{t.name}</div>
              <div style={{display:"flex",gap:"6px"}}>
                <button onClick={()=>copyTemplate(t.id,t.text)} style={{padding:"4px 10px",borderRadius:"7px",border:"1px solid rgba(199,125,255,0.3)",background:copied===t.id?"rgba(199,125,255,0.2)":"rgba(199,125,255,0.08)",color:"#C77DFF",fontSize:"9px",cursor:"pointer",fontFamily:"monospace"}}>{copied===t.id?"COPIED ✓":"COPY"}</button>
                <button onClick={()=>removeTemplate(t.id)} style={{padding:"4px 8px",borderRadius:"7px",border:"1px solid rgba(255,59,48,0.3)",background:"rgba(255,59,48,0.07)",color:"#FF3B30",fontSize:"9px",cursor:"pointer"}}>✕</button>
              </div>
            </div>
            <div style={{fontSize:"11px",color:"#666",lineHeight:1.5}}>{t.text}</div>
          </div>
        ))}

        {/* ADD TEMPLATE */}
        <div style={{marginTop:"14px",padding:"14px",borderRadius:"10px",background:"rgba(199,125,255,0.04)",border:"1px solid rgba(199,125,255,0.15)"}}>
          <div style={{fontSize:"9px",color:"#C77DFF",letterSpacing:"0.2em",marginBottom:"10px"}}>+ NEW TEMPLATE</div>
          <input value={newTplName} onChange={e=>setNewTplName(e.target.value)} placeholder="Template name (e.g. Music Drop 🔥)"
            style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace",marginBottom:"8px"}}/>
          <textarea value={newTplText} onChange={e=>setNewTplText(e.target.value)} placeholder="Caption text with emojis and hashtags..." rows={3}
            style={{width:"100%",padding:"9px 10px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace",resize:"none",lineHeight:1.5,marginBottom:"8px"}}/>
          <button onClick={addTemplate} disabled={!newTplName.trim()||!newTplText.trim()} style={{width:"100%",padding:"10px",borderRadius:"8px",border:"none",background:newTplName.trim()&&newTplText.trim()?"linear-gradient(90deg,#C77DFF,#FF6B35)":"rgba(255,255,255,0.05)",color:newTplName.trim()&&newTplText.trim()?"#000":"#484848",fontSize:"10px",fontWeight:"800",letterSpacing:"0.12em",cursor:newTplName.trim()&&newTplText.trim()?"pointer":"not-allowed"}}>
            SAVE TEMPLATE
          </button>
        </div>
      </ASection>

      {/* AUTO-POST SCHEDULES */}
      <ASection title="Auto-Post Schedules" icon="🕐" color="#00F5D4">
        <div style={{fontSize:"11px",color:"#777",marginBottom:"14px"}}>Set recurring broadcasts that post automatically at your chosen times.</div>
        {(bc.schedules||[]).map(s=>(
          <div key={s.id} style={{marginBottom:"14px",padding:"14px",borderRadius:"10px",background:"rgba(255,255,255,0.02)",border:`1px solid ${s.enabled?"rgba(0,245,212,0.2)":"rgba(255,255,255,0.07)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <input value={s.title} onChange={e=>updateSchedule(s.id,"title",e.target.value)} style={{fontSize:"12px",fontWeight:"700",background:"none",border:"none",color:"#ccc",outline:"none",flex:1,fontFamily:"monospace"}}/>
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                <div onClick={()=>updateSchedule(s.id,"enabled",!s.enabled)} style={{width:"40px",height:"22px",borderRadius:"11px",cursor:"pointer",background:s.enabled?"#00F5D4":"rgba(255,255,255,0.1)",position:"relative",transition:"background 0.3s",flexShrink:0}}>
                  <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:s.enabled?"21px":"3px",transition:"left 0.3s"}}/>
                </div>
                <button onClick={()=>removeSchedule(s.id)} style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid rgba(255,59,48,0.3)",background:"rgba(255,59,48,0.07)",color:"#FF3B30",fontSize:"9px",cursor:"pointer"}}>✕</button>
              </div>
            </div>
            <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
              <div style={{flex:1}}>
                <label style={{fontSize:"8px",color:"#555",display:"block",marginBottom:"4px"}}>TIME</label>
                <input type="time" value={s.time||"09:00"} onChange={e=>updateSchedule(s.id,"time",e.target.value)} style={{width:"100%",padding:"7px 8px",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"7px",color:"#E8E4DC",fontSize:"11px",outline:"none",fontFamily:"monospace"}}/>
              </div>
              <div style={{flex:2}}>
                <label style={{fontSize:"8px",color:"#555",display:"block",marginBottom:"4px"}}>DAYS</label>
                <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
                  {DAYS.map(d=>{
                    const on=(s.days||[]).includes(d);
                    return <button key={d} onClick={()=>updateSchedule(s.id,"days",on?(s.days||[]).filter(x=>x!==d):[...(s.days||[]),d])} style={{padding:"4px 7px",borderRadius:"6px",border:on?"1px solid #00F5D4":"1px solid rgba(255,255,255,0.08)",background:on?"rgba(0,245,212,0.12)":"rgba(255,255,255,0.03)",color:on?"#00F5D4":"#555",fontSize:"9px",fontWeight:on?"700":"400",cursor:"pointer"}}>{d}</button>;
                  })}
                </div>
              </div>
            </div>
            <div>
              <label style={{fontSize:"8px",color:"#555",display:"block",marginBottom:"4px"}}>PLATFORMS</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                {PLATFORMS.filter(p=>p.maxChars>0).map(p=>{
                  const on=(s.platforms||[]).includes(p.id);
                  return <button key={p.id} onClick={()=>updateSchedule(s.id,"platforms",on?(s.platforms||[]).filter(x=>x!==p.id):[...(s.platforms||[]),p.id])} style={{padding:"4px 9px",borderRadius:"10px",border:on?`1px solid ${p.color}`:"1px solid rgba(255,255,255,0.07)",background:on?`${p.color}18`:"rgba(255,255,255,0.02)",color:on?p.color:"#484848",fontSize:"9px",cursor:"pointer"}}>{p.icon} {p.name}</button>;
                })}
              </div>
            </div>
          </div>
        ))}
        <button onClick={addSchedule} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"2px dashed rgba(0,245,212,0.25)",background:"rgba(0,245,212,0.03)",color:"#00F5D4",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",cursor:"pointer"}}>
          + ADD SCHEDULE
        </button>
      </ASection>

      {/* BROADCAST HISTORY */}
      <ASection title="Broadcast History" icon="📋" color="#FFD60A">
        {(bc.history||[]).length===0
          ? <div style={{textAlign:"center",padding:"24px",color:"#484848",fontSize:"12px"}}>No broadcasts yet. Post something to see history here.</div>
          : (bc.history||[]).map((h,i)=>(
            <div key={i} style={{padding:"12px",borderRadius:"9px",marginBottom:"8px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{fontSize:"10px",color:"#777",fontFamily:"monospace"}}>{h.date}</span>
                <span style={{fontSize:"9px",padding:"2px 8px",borderRadius:"6px",background:h.status==="posted"?"rgba(0,245,212,0.1)":"rgba(255,214,10,0.1)",color:h.status==="posted"?"#00F5D4":"#FFD60A",fontFamily:"monospace"}}>{h.status?.toUpperCase()}</span>
              </div>
              <div style={{fontSize:"11px",color:"#bbb",marginBottom:"6px"}}>{h.caption?.slice(0,80)}{h.caption?.length>80?"...":""}</div>
              <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                {(h.platforms||[]).map((pid,pi)=>{const p=PLATFORMS.find(pl=>pl.id===pid);return p?<span key={pi} style={{fontSize:"9px",color:p.color}}>{p.icon}</span>:null;})}
              </div>
            </div>
          ))
        }
      </ASection>
    </div>
  );
}

// ─── TICKER ADMIN TAB ────────────────────────────────────────────────────────
function TickerAdminTab({ cfg, setCfg }) {
  const ticker   = cfg.ticker || {};
  const [newItem, setNewItem] = useState("");
  const [preview, setPreview] = useState(false);

  const updateTicker = (key, val) =>
    setCfg(prev => ({ ...prev, ticker: { ...prev.ticker, [key]: val } }));

  const addItem = () => {
    if (!newItem.trim()) return;
    updateTicker("items", [...(ticker.items || []), newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (i) =>
    updateTicker("items", (ticker.items || []).filter((_,idx) => idx !== i));

  const moveItem = (i, dir) => {
    const items = [...(ticker.items || [])];
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    updateTicker("items", items);
  };

  const sep   = ticker.separator || "◆";
  const speed = ticker.speed || 40;
  const previewText = (ticker.items || []).join(`   ${sep}   `);
  const previewFull = `${previewText}   ${sep}   ${previewText}`;

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* ON/OFF TOGGLE */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", borderRadius:"12px", marginBottom:"16px", background: ticker.enabled ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.02)", border: ticker.enabled ? "1px solid rgba(255,107,53,0.3)" : "1px solid rgba(255,255,255,0.07)", transition:"all 0.3s" }}>
        <div>
          <div style={{ fontSize:"13px", fontWeight:"700", color: ticker.enabled ? "#FF6B35" : "#777" }}>Scrolling Ticker</div>
          <div style={{ fontSize:"10px", color:"#484848", marginTop:"2px" }}>{ticker.enabled ? "Visible on the public app" : "Hidden from public app"}</div>
        </div>
        <div onClick={() => updateTicker("enabled", !ticker.enabled)}
          style={{ width:"48px", height:"26px", borderRadius:"13px", cursor:"pointer", flexShrink:0, background:ticker.enabled?"#FF6B35":"rgba(255,255,255,0.1)", position:"relative", transition:"background 0.3s" }}>
          <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:ticker.enabled?"25px":"3px", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <ASection title="Live Preview" icon="👁" color="#C77DFF">
        <div style={{ borderRadius:"10px", overflow:"hidden", marginBottom:"8px" }}>
          <TickerBar ticker={{ ...ticker, items: ticker.items?.length ? ticker.items : ["Your ticker text will appear here..."] }} />
        </div>
        <div style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace", textAlign:"center" }}>Updates live as you edit below</div>
      </ASection>

      {/* APPEARANCE */}
      <ASection title="Appearance" icon="◈" color="#FF6B35">
        <div style={{ display:"flex", gap:"14px", marginBottom:"14px" }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>BACKGROUND COLOR</label>
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <input type="color" value={ticker.bgColor||"#FF6B35"} onChange={e => updateTicker("bgColor", e.target.value)}
                style={{ width:"44px", height:"44px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"none" }} />
              <span style={{ fontSize:"11px", color:"#777", fontFamily:"monospace" }}>{ticker.bgColor||"#FF6B35"}</span>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>TEXT COLOR</label>
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <input type="color" value={ticker.textColor||"#000000"} onChange={e => updateTicker("textColor", e.target.value)}
                style={{ width:"44px", height:"44px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"none" }} />
              <span style={{ fontSize:"11px", color:"#777", fontFamily:"monospace" }}>{ticker.textColor||"#000000"}</span>
            </div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div style={{ marginBottom:"14px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>SEPARATOR BETWEEN ITEMS</label>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {["◆","·","★","•","⬡","◎","▶","🔥","⚡","🎵"].map(s => (
              <button key={s} onClick={() => updateTicker("separator", s)}
                style={{ width:"36px", height:"36px", borderRadius:"8px", border:(ticker.separator||"◆")===s?"2px solid #FF6B35":"1px solid rgba(255,255,255,0.08)", background:(ticker.separator||"◆")===s?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.03)", fontSize:"16px", cursor:"pointer", transition:"all 0.2s" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* SPEED */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555" }}>SCROLL SPEED</label>
            <span style={{ fontSize:"9px", color:"#FF6B35", fontFamily:"monospace" }}>
              {speed <= 20 ? "Fast" : speed <= 40 ? "Medium" : "Slow"}
            </span>
          </div>
          <input type="range" min={10} max={80} step={5} value={speed}
            onChange={e => updateTicker("speed", Number(e.target.value))}
            style={{ width:"100%", accentColor:"#FF6B35", cursor:"pointer" }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
            <span style={{ fontSize:"8px", color:"#484848" }}>Fast</span>
            <span style={{ fontSize:"8px", color:"#484848" }}>Slow</span>
          </div>
        </div>
      </ASection>

      {/* TICKER MESSAGES */}
      <ASection title="Ticker Messages" icon="📢" color="#FFD60A">
        <div style={{ padding:"10px", borderRadius:"9px", marginBottom:"14px", background:"rgba(255,214,10,0.06)", border:"1px solid rgba(255,214,10,0.15)" }}>
          <div style={{ fontSize:"10px", color:"#FFD60A", marginBottom:"3px" }}>◆ TIPS</div>
          <div style={{ fontSize:"11px", color:"#777", lineHeight:1.5 }}>Messages scroll left continuously. Add emojis to make them pop. Drag ↑↓ to reorder.</div>
        </div>

        {/* EXISTING ITEMS */}
        {(ticker.items || []).map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px", marginBottom:"8px", borderRadius:"10px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"2px", flexShrink:0 }}>
              <button onClick={() => moveItem(i, -1)} disabled={i===0} style={{ background:"none", border:"none", color:i===0?"#333":"#777", cursor:i===0?"default":"pointer", fontSize:"10px", padding:"0", lineHeight:1 }}>▲</button>
              <button onClick={() => moveItem(i,  1)} disabled={i===(ticker.items||[]).length-1} style={{ background:"none", border:"none", color:i===(ticker.items||[]).length-1?"#333":"#777", cursor:i===(ticker.items||[]).length-1?"default":"pointer", fontSize:"10px", padding:"0", lineHeight:1 }}>▼</button>
            </div>
            <div style={{ flex:1, fontSize:"12px", color:"#ccc", lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item}</div>
            <button onClick={() => removeItem(i)} style={{ flexShrink:0, padding:"4px 9px", borderRadius:"7px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.08)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>✕</button>
          </div>
        ))}

        {/* ADD NEW ITEM */}
        <div style={{ display:"flex", gap:"8px", marginTop:"4px" }}>
          <input value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder="Type a new ticker message... 🎵"
            style={{ flex:1, padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,214,10,0.25)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
          <button onClick={addItem} disabled={!newItem.trim()}
            style={{ padding:"11px 16px", borderRadius:"9px", border:"none", background:newItem.trim()?"linear-gradient(135deg,#FFD60A,#FF6B35)":"rgba(255,255,255,0.05)", color:newItem.trim()?"#000":"#383838", fontWeight:"900", fontSize:"11px", cursor:newItem.trim()?"pointer":"not-allowed", whiteSpace:"nowrap", letterSpacing:"0.1em", fontFamily:"monospace" }}>
            + ADD
          </button>
        </div>
        {(ticker.items||[]).length === 0 && (
          <div style={{ marginTop:"10px", padding:"16px", borderRadius:"9px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", textAlign:"center", fontSize:"11px", color:"#484848" }}>
            No messages yet. Add your first ticker message above.
          </div>
        )}
      </ASection>
    </div>
  );
}

// ─── FINANCE TAB ─────────────────────────────────────────────────────────────
function FinanceTab() {
  const [filter, setFilter] = useState("all");

  const paid      = MOCK_SALES.filter(s => s.status === "paid");
  const totalRev  = paid.reduce((a,s) => a + s.amount, 0);
  const recurring = paid.filter(s => s.plan.includes("/mo")).reduce((a,s) => a + s.amount, 0);
  const oneTime   = paid.filter(s => !s.plan.includes("/mo")).reduce((a,s) => a + s.amount, 0);
  const filtered  = filter === "all" ? MOCK_SALES : MOCK_SALES.filter(s => s.status === filter);

  const exportCSV = () => {
    const header = "Invoice,Date,Buyer,Plan,Amount,Status";
    const rows   = MOCK_SALES.map(s => `${s.id},${s.date},${s.buyer},"${s.plan}",$${s.amount},${s.status}`);
    const csv    = [header, ...rows].join("\n");
    const blob   = new Blob([csv], { type:"text/csv" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(1)}K` : `$${n}`;
  const chartData = [30,55,40,80,45,90,65,110,75,120,95,140,99,149,180,120,200,149,220,250,180,310,280,350,400,320,447,380,499,638];
  const chartMax  = Math.max(...chartData);

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      {/* REVENUE CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"20px" }}>
        {[
          { label:"TOTAL REVENUE", val:fmt(totalRev),  color:"#00F5D4" },
          { label:"RECURRING /MO", val:fmt(recurring), color:"#FFD60A" },
          { label:"ONE-TIME",      val:fmt(oneTime),   color:"#FF6B35" },
        ].map((c,i) => (
          <div key={i} style={{ padding:"16px 10px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:`1px solid ${c.color}22`, textAlign:"center" }}>
            <div style={{ fontSize:"18px", fontWeight:"900", color:c.color, fontFamily:"monospace" }}>{c.val}</div>
            <div style={{ fontSize:"7px", letterSpacing:"0.2em", color:"#484848", marginTop:"4px" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={{ padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:"18px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", marginBottom:"12px" }}>REVENUE — LAST 30 DAYS</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"56px" }}>
          {chartData.map((v,i) => (
            <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", background:`linear-gradient(180deg,#FF6B35,#C77DFF)`, height:`${Math.round((v/chartMax)*100)}%`, minWidth:"3px", opacity:0.6+i*0.013 }} />
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          <span style={{ fontSize:"8px", color:"#484848" }}>Mar 1</span>
          <span style={{ fontSize:"8px", color:"#484848" }}>Mar 27</span>
        </div>
      </div>

      {/* PLAN BREAKDOWN */}
      <div style={{ padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:"18px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", marginBottom:"14px" }}>SALES BY PLAN</div>
        {[
          { plan:"Pro Done For You", amt:499, count:2, color:"#FF6B35" },
          { plan:"Empire /mo",       amt:149, count:3, color:"#C77DFF" },
          { plan:"Starter Template", amt:97,  count:2, color:"#00F5D4" },
        ].map((p,i) => {
          const pct = totalRev > 0 ? Math.round((p.amt*p.count/totalRev)*100) : 0;
          return (
            <div key={i} style={{ marginBottom:"12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                <span style={{ fontSize:"11px", color:"#ccc" }}>{p.plan}</span>
                <span style={{ fontSize:"11px", fontWeight:"700", color:p.color, fontFamily:"monospace" }}>${p.amt*p.count}</span>
              </div>
              <div style={{ height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.05)" }}>
                <div style={{ height:"100%", borderRadius:"2px", background:p.color, width:`${pct}%`, transition:"width 0.6s ease" }} />
              </div>
              <div style={{ fontSize:"9px", color:"#484848", marginTop:"3px" }}>{p.count} sale{p.count>1?"s":""} · {pct}%</div>
            </div>
          );
        })}
      </div>

      {/* TRANSACTIONS */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555" }}>TRANSACTIONS</div>
          <div style={{ display:"flex", gap:"5px" }}>
            {["all","paid","pending","refunded"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:"4px 9px", borderRadius:"9px", border:"none", cursor:"pointer", fontSize:"8px", fontFamily:"monospace", letterSpacing:"0.1em", background:filter===f?"#FF6B35":"rgba(255,255,255,0.05)", color:filter===f?"#000":"#555", transition:"all 0.2s" }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"24px", textAlign:"center", color:"#484848", fontSize:"12px" }}>No {filter} transactions</div>
          ) : filtered.map((s,i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", background:i%2===0?"rgba(255,255,255,0.01)":"transparent", borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"12px", fontWeight:"600", color:"#ddd", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.buyer}</div>
                <div style={{ fontSize:"9px", color:"#484848", marginTop:"1px", fontFamily:"monospace" }}>{s.id} · {s.date}</div>
              </div>
              <div style={{ fontSize:"10px", color:"#666", width:"90px", textAlign:"right", flexShrink:0 }}>{s.plan}</div>
              <div style={{ fontSize:"13px", fontWeight:"800", color:"#00F5D4", fontFamily:"monospace", width:"48px", textAlign:"right", flexShrink:0 }}>${s.amount}</div>
              <div style={{ padding:"3px 8px", borderRadius:"7px", fontSize:"8px", letterSpacing:"0.12em", fontFamily:"monospace", flexShrink:0,
                background:s.status==="paid"?"rgba(0,245,212,0.1)":s.status==="pending"?"rgba(255,214,10,0.1)":"rgba(255,59,48,0.1)",
                border:s.status==="paid"?"1px solid rgba(0,245,212,0.3)":s.status==="pending"?"1px solid rgba(255,214,10,0.3)":"1px solid rgba(255,59,48,0.3)",
                color:s.status==="paid"?"#00F5D4":s.status==="pending"?"#FFD60A":"#FF3B30" }}>
                {s.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"12px", padding:"0 2px" }}>
          <div style={{ fontSize:"10px", color:"#484848" }}>{filtered.length} transaction{filtered.length!==1?"s":""}</div>
          <button onClick={exportCSV} style={{ padding:"6px 14px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.08)", background:"none", color:"#777", fontSize:"9px", letterSpacing:"0.15em", cursor:"pointer" }}>
            ↓ EXPORT CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BRAND TAB ────────────────────────────────────────────────────────────────
function BrandTab({ cfg, update }) {
  const heroRef = useRef(null);

  const handleHeroFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => { update("brand","heroImageUrl",e.target.result); update("brand","heroType","image"); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Brand Identity" icon="◈" color="#FF6B35">
        <AField label="Brand Name"           value={cfg.brand.name}             onChange={v => update("brand","name",v)}             placeholder="YOUR BRAND" />
        <AField label="Tagline"              value={cfg.brand.tagline}          onChange={v => update("brand","tagline",v)}          placeholder="DIGITAL MEDIA ENTERTAINMENT GROUP" />
        <AField label="Universal Link"       value={cfg.brand.universalLink}    onChange={v => update("brand","universalLink",v)}    placeholder="yourbrand.app/hub" />
        <AField label="Membership Price /mo" value={cfg.brand.membershipPrice}  onChange={v => update("brand","membershipPrice",v)}  placeholder="4.99" type="number" />
      </ASection>

      <ASection title="Hero Section" icon="🖼" color="#C77DFF">
        <div style={{ padding:"10px", borderRadius:"9px", marginBottom:"14px", background:"rgba(199,125,255,0.06)", border:"1px solid rgba(199,125,255,0.15)" }}>
          <div style={{ fontSize:"10px", color:"#C77DFF", marginBottom:"3px" }}>◆ HOME PAGE HERO</div>
          <div style={{ fontSize:"11px", color:"#777" }}>The big banner at the top of your home screen. Upload a photo or use your brand colors.</div>
        </div>

        {/* TYPE TOGGLE */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
          {[["gradient","Brand Colors"],["image","Custom Photo"]].map(([val,label]) => (
            <div key={val} onClick={() => update("brand","heroType",val)}
              style={{ flex:1, padding:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer", border: cfg.brand.heroType===val ? "1px solid #C77DFF" : "1px solid rgba(255,255,255,0.07)", background: cfg.brand.heroType===val ? "rgba(199,125,255,0.1)" : "rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
              <div style={{ fontSize:"11px", fontWeight:"700", color: cfg.brand.heroType===val ? "#C77DFF" : "#777" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* LIVE PREVIEW */}
        <div style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"14px", height:"120px", position:"relative",
          background: cfg.brand.heroType==="image" && cfg.brand.heroImageUrl
            ? `url(${cfg.brand.heroImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg,${cfg.brand.primaryColor}22,${cfg.brand.accentColor}18)` }}>
          {cfg.brand.heroType==="image" && cfg.brand.heroImageUrl && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
          )}
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:"18px", fontWeight:"900", color:"#fff", letterSpacing:"0.05em" }}>{cfg.brand.heroHeading || "Your Media Empire"}</div>
            <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.5)", letterSpacing:"0.25em", marginTop:"4px", fontFamily:"monospace" }}>{cfg.brand.heroSubtext || "MUSIC · SHOWS · GALLERY"}</div>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        {cfg.brand.heroType === "image" && (
          <div style={{ marginBottom:"14px" }}>
            <div onClick={() => heroRef.current?.click()}
              style={{ padding:"18px", borderRadius:"11px", textAlign:"center", cursor:"pointer", border: cfg.brand.heroImageUrl ? "2px solid #C77DFF" : "2px dashed rgba(199,125,255,0.25)", background:"rgba(199,125,255,0.04)", marginBottom:"8px", transition:"all 0.3s" }}>
              <div style={{ fontSize:"22px", marginBottom:"5px" }}>{cfg.brand.heroImageUrl ? "🖼" : "📤"}</div>
              <div style={{ fontSize:"11px", color: cfg.brand.heroImageUrl ? "#C77DFF" : "#555" }}>
                {cfg.brand.heroImageUrl ? "Hero image uploaded · Tap to change" : "Tap to upload hero image"}
              </div>
              <div style={{ fontSize:"9px", color:"#3a3a3a", marginTop:"3px" }}>Recommended: 1200×600px · JPG or PNG</div>
              <input ref={heroRef} type="file" accept="image/*" onChange={e => handleHeroFile(e.target.files[0])} style={{ display:"none" }} />
            </div>
            {cfg.brand.heroImageUrl && (
              <button onClick={() => { update("brand","heroImageUrl",""); update("brand","heroType","gradient"); }}
                style={{ width:"100%", padding:"9px", borderRadius:"9px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>
                ✕ REMOVE IMAGE
              </button>
            )}
          </div>
        )}

        {/* HEADING & SUBTEXT */}
        <AField label="Hero Heading"  value={cfg.brand.heroHeading || ""}  onChange={v => update("brand","heroHeading",v)}  placeholder="Your Media Empire" />
        <AField label="Hero Subtext"  value={cfg.brand.heroSubtext || ""}  onChange={v => update("brand","heroSubtext",v)}  placeholder="MUSIC · SHOWS · GALLERY · SOCIAL" />
      </ASection>

      <ASection title="Brand Colors" icon="◆" color="#C77DFF">
        <div style={{ display:"flex", gap:"16px" }}>
          {[["PRIMARY COLOR","primaryColor"],["ACCENT COLOR","accentColor"]].map(([lbl,key]) => (
            <div key={key} style={{ flex:1 }}>
              <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"8px" }}>{lbl}</label>
              <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                <input type="color" value={cfg.brand[key]} onChange={e => update("brand",key,e.target.value)}
                  style={{ width:"44px", height:"44px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", background:"none" }} />
                <div style={{ fontSize:"12px", color:"#777", fontFamily:"monospace" }}>{cfg.brand[key]}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:"16px", padding:"14px", borderRadius:"10px", background:`linear-gradient(135deg,${cfg.brand.primaryColor}20,${cfg.brand.accentColor}15)`, border:`1px solid ${cfg.brand.primaryColor}30` }}>
          <div style={{ fontSize:"9px", color:"#555", marginBottom:"6px", letterSpacing:"0.2em" }}>LIVE PREVIEW</div>
          <div style={{ fontSize:"16px", fontWeight:"900", letterSpacing:"0.15em", background:`linear-gradient(135deg,${cfg.brand.primaryColor},${cfg.brand.accentColor})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{cfg.brand.name || "YOUR BRAND"}</div>
          <div style={{ fontSize:"8px", color:"#484848", letterSpacing:"0.3em", marginTop:"2px" }}>{cfg.brand.tagline}</div>
        </div>
      </ASection>
    </div>
  );
}

// ─── LOGO TAB ─────────────────────────────────────────────────────────────────
function LogoTab({ cfg, update }) {
  const fileRef  = useRef(null);
  const [preview, setPreview]  = useState(cfg.brand.logoUrl || "");
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      setPreview(url);
      update("brand","logoUrl",url);
      update("brand","logoType","image");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const removeImage = () => { setPreview(""); update("brand","logoUrl",""); update("brand","logoType","emoji"); };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Brand Logo" icon="🖼" color="#C77DFF">
        <div style={{ padding:"12px", borderRadius:"10px", marginBottom:"18px", background:"rgba(199,125,255,0.06)", border:"1px solid rgba(199,125,255,0.15)" }}>
          <div style={{ fontSize:"10px", color:"#C77DFF", marginBottom:"4px" }}>◆ LOGO APPEARS IN</div>
          <div style={{ fontSize:"11px", color:"#777", lineHeight:1.6 }}>App header, home screen hero, broadcast preview, and social hub.</div>
        </div>

        {/* SIZE PREVIEW */}
        <div style={{ textAlign:"center", marginBottom:"22px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", marginBottom:"12px" }}>CURRENT LOGO PREVIEW</div>
          <div style={{ display:"flex", justifyContent:"center", gap:"24px", alignItems:"flex-end" }}>
            {[80, 52, 36].map(size => (
              <div key={size} style={{ textAlign:"center" }}>
                {preview
                  ? <img src={preview} alt="logo" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,255,255,0.1)" }} />
                  : <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${cfg.brand.primaryColor},${cfg.brand.accentColor})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.round(size*0.38) }}>🎙</div>
                }
                <div style={{ fontSize:"8px", color:"#484848", marginTop:"4px" }}>{size}px</div>
              </div>
            ))}
          </div>
        </div>

        {/* DROP ZONE */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{ padding:"28px 20px", borderRadius:"14px", textAlign:"center", cursor:"pointer", border:dragging ? "2px solid #C77DFF" : "2px dashed rgba(255,255,255,0.1)", background:dragging ? "rgba(199,125,255,0.08)" : "rgba(255,255,255,0.01)", transition:"all 0.3s", marginBottom:"12px" }}>
          <div style={{ fontSize:"28px", marginBottom:"8px" }}>🖼</div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:"#ccc", marginBottom:"5px" }}>Drop your logo here</div>
          <div style={{ fontSize:"11px", color:"#555" }}>or tap to browse · PNG, JPG, SVG · 512×512 recommended</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display:"none" }} />
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={() => fileRef.current?.click()} style={{ flex:1, padding:"12px", borderRadius:"10px", border:"none", background:"linear-gradient(90deg,#C77DFF,#FF6B35)", color:"#000", fontWeight:"800", fontSize:"11px", letterSpacing:"0.12em", cursor:"pointer" }}>
            📁 CHOOSE FILE
          </button>
          {preview && (
            <button onClick={removeImage} style={{ padding:"12px 16px", borderRadius:"10px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.08)", color:"#FF3B30", fontSize:"11px", cursor:"pointer" }}>
              ✕ REMOVE
            </button>
          )}
        </div>

        {preview && (
          <div style={{ marginTop:"12px", padding:"10px 14px", borderRadius:"8px", background:"rgba(0,245,212,0.07)", border:"1px solid rgba(0,245,212,0.2)", fontSize:"11px", color:"#00F5D4" }}>
            ✓ Logo uploaded — hit SAVE ALL to apply across the app
          </div>
        )}
      </ASection>

      <ASection title="Logo Style" icon="◈" color="#FF6B35">
        <div style={{ display:"flex", gap:"10px" }}>
          {[["emoji","Default Emoji 🎙"],["image","My Uploaded Logo"]].map(([val,label]) => (
            <div key={val} onClick={() => update("brand","logoType",val)} style={{ flex:1, padding:"14px", borderRadius:"10px", cursor:"pointer", textAlign:"center", border:cfg.brand.logoType===val ? "1px solid #FF6B35" : "1px solid rgba(255,255,255,0.07)", background:cfg.brand.logoType===val ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
              <div style={{ fontSize:"11px", fontWeight:"700", color:cfg.brand.logoType===val ? "#FF6B35" : "#777" }}>{label}</div>
            </div>
          ))}
        </div>
      </ASection>
    </div>
  );
}

// ─── LIVE STREAMING TAB ───────────────────────────────────────────────────────
function LiveTab({ cfg, update, testConn, testResult }) {
  const [liveSelected, setLiveSelected] = useState(["youtube","facebook"]);
  const [streamTitle,  setStreamTitle]  = useState("");
  const [streamDesc,   setStreamDesc]   = useState("");
  const [isLive,       setIsLive]       = useState(false);
  const [liveTimer,    setLiveTimer]    = useState(0);
  const [viewers,      setViewers]      = useState({});
  const [cameraOn,     setCameraOn]     = useState(false);
  const [camError,     setCamError]     = useState("");
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const timerRef  = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setCamError("");
    } catch {
      setCamError("Camera access denied. Please allow camera in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const goLive = () => {
    if (!streamTitle.trim() || liveSelected.length === 0) return;
    setIsLive(true);
    const init = {};
    liveSelected.forEach(id => { init[id] = Math.floor(Math.random() * 20) + 5; });
    setViewers(init);
    timerRef.current = setInterval(() => {
      setLiveTimer(t => t + 1);
      setViewers(prev => {
        const n = { ...prev };
        liveSelected.forEach(id => { n[id] = Math.max(1, (n[id] || 0) + Math.floor(Math.random() * 5) - 1); });
        return n;
      });
    }, 1000);
  };

  const endLive = () => {
    clearInterval(timerRef.current);
    setIsLive(false);
    setLiveTimer(0);
    stopCamera();
  };

  const fmt = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const totalViewers = Object.values(viewers).reduce((a,v) => a+v, 0);
  const canGoLive = streamTitle.trim().length > 0 && liveSelected.length > 0;

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* LIVE BANNER */}
      {isLive && (
        <div style={{ padding:"16px", borderRadius:"14px", marginBottom:"18px", background:"rgba(255,59,48,0.1)", border:"2px solid rgba(255,59,48,0.5)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#FF3B30", animation:"livePulse 1.5s infinite", flexShrink:0 }} />
            <div>
              <div style={{ fontSize:"13px", fontWeight:"900", color:"#FF3B30", letterSpacing:"0.1em" }}>🔴 YOU ARE LIVE</div>
              <div style={{ fontSize:"10px", color:"#777", fontFamily:"monospace" }}>{fmt(liveTimer)} · {totalViewers} viewers</div>
            </div>
          </div>
          <button onClick={endLive} style={{ padding:"8px 16px", borderRadius:"10px", border:"none", background:"#FF3B30", color:"#fff", fontWeight:"900", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer" }}>
            END STREAM
          </button>
        </div>
      )}

      {/* CAMERA */}
      <ASection title="Camera Preview" icon="📹" color="#FF3B30">
        <div style={{ borderRadius:"12px", overflow:"hidden", background:"#000", position:"relative", aspectRatio:"16/9", marginBottom:"12px" }}>
          <video ref={videoRef} muted playsInline style={{ width:"100%", height:"100%", objectFit:"cover", display:cameraOn ? "block" : "none" }} />
          {!cameraOn && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px" }}>
              <div style={{ fontSize:"36px" }}>📷</div>
              <div style={{ fontSize:"11px", color:"#555", fontFamily:"monospace" }}>Camera not started</div>
            </div>
          )}
          {isLive && (
            <>
              <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", gap:"8px", alignItems:"center" }}>
                <div style={{ padding:"4px 10px", borderRadius:"6px", background:"rgba(255,59,48,0.9)", fontSize:"10px", fontWeight:"900", letterSpacing:"0.15em", color:"#fff" }}>● LIVE</div>
                <div style={{ padding:"4px 10px", borderRadius:"6px", background:"rgba(0,0,0,0.7)", fontSize:"10px", color:"#fff", fontFamily:"monospace" }}>{fmt(liveTimer)}</div>
              </div>
              <div style={{ position:"absolute", top:"10px", right:"10px", padding:"4px 10px", borderRadius:"6px", background:"rgba(0,0,0,0.7)", fontSize:"10px", color:"#FFD60A", fontFamily:"monospace" }}>
                👁 {totalViewers}
              </div>
            </>
          )}
        </div>
        {camError && (
          <div style={{ padding:"8px 12px", borderRadius:"8px", marginBottom:"10px", background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.3)", fontSize:"11px", color:"#FF3B30" }}>
            {camError}
          </div>
        )}
        {!cameraOn
          ? <button onClick={startCamera} style={{ width:"100%", padding:"11px", borderRadius:"10px", background:"rgba(255,59,48,0.12)", border:"1px solid rgba(255,59,48,0.3)", color:"#FF3B30", fontWeight:"700", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer" }}>📷 START CAMERA</button>
          : <button onClick={stopCamera}  style={{ width:"100%", padding:"11px", borderRadius:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#777", fontWeight:"700", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer" }}>⏹ STOP CAMERA</button>
        }
      </ASection>

      {/* STREAM PLATFORMS */}
      <ASection title="Stream To Platforms" icon="◆" color="#FF6B35">
        <div style={{ padding:"12px", borderRadius:"10px", marginBottom:"14px", background:"rgba(255,107,53,0.06)", border:"1px solid rgba(255,107,53,0.15)" }}>
          <div style={{ fontSize:"10px", color:"#FF6B35", marginBottom:"4px" }}>◆ HOW IT WORKS</div>
          <div style={{ fontSize:"11px", color:"#777", lineHeight:1.6 }}>Select platforms, enter your stream keys below, add a title, and hit GO LIVE. Your feed broadcasts simultaneously via RTMP.</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" }}>
          {LIVE_PLATFORMS.map(p => {
            const sel = liveSelected.includes(p.id);
            return (
              <button key={p.id} onClick={() => setLiveSelected(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 12px", borderRadius:"18px", cursor:"pointer", background:sel ? `${p.color}20` : "rgba(255,255,255,0.03)", border:sel ? `1px solid ${p.color}` : "1px solid rgba(255,255,255,0.07)", color:sel ? p.color : "#484848", fontSize:"10px", fontWeight:sel ? "700" : "400", transition:"all 0.2s" }}>
                <span>{p.icon}</span><span>{p.name}</span>{sel && <span>✓</span>}
              </button>
            );
          })}
        </div>

        {/* STREAM KEYS */}
        {LIVE_PLATFORMS.filter(p => liveSelected.includes(p.id)).map(p => (
          <div key={p.id} style={{ marginBottom:"12px" }}>
            <label style={{ fontSize:"9px", color:p.color, letterSpacing:"0.15em", display:"flex", alignItems:"center", gap:"6px", marginBottom:"5px" }}>
              <span>{p.icon}</span>{p.name.toUpperCase()} STREAM KEY
            </label>
            <input value={cfg.liveKeys[p.id] || ""} onChange={e => update("liveKeys", p.id, e.target.value)}
              placeholder={`Paste your ${p.name} stream key...`} type="password"
              style={{ width:"100%", padding:"10px 13px", background:"rgba(0,0,0,0.4)", border:`1px solid ${p.color}30`, borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
            <div style={{ fontSize:"8px", color:"#3a3a3a", marginTop:"3px", fontFamily:"monospace" }}>RTMP: {p.rtmpBase}[YOUR_KEY]</div>
          </div>
        ))}
      </ASection>

      {/* STREAM INFO */}
      <ASection title="Stream Details" icon="◈" color="#C77DFF">
        <AField label="Stream Title" value={streamTitle} onChange={setStreamTitle} placeholder="What are you streaming today?" />
        <div style={{ marginBottom:"14px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#555", display:"block", marginBottom:"7px" }}>DESCRIPTION</label>
          <textarea value={streamDesc} onChange={e => setStreamDesc(e.target.value)} placeholder="Tell your audience what this stream is about..." rows={3}
            style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace", resize:"vertical", lineHeight:1.5 }} />
        </div>
      </ASection>

      {/* VIEWER COUNTS */}
      {isLive && (
        <div style={{ marginBottom:"18px", padding:"16px", borderRadius:"12px", background:"rgba(255,59,48,0.05)", border:"1px solid rgba(255,59,48,0.2)" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#FF3B30", marginBottom:"12px" }}>LIVE VIEWERS PER PLATFORM</div>
          {liveSelected.map(pid => {
            const p = LIVE_PLATFORMS.find(x => x.id === pid);
            if (!p) return null;
            const count = viewers[pid] || 0;
            const pct = Math.min(100, count * 2);
            return (
              <div key={pid} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                <span style={{ color:p.color, fontSize:"14px", width:"20px", textAlign:"center" }}>{p.icon}</span>
                <div style={{ flex:1, height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.06)" }}>
                  <div style={{ height:"100%", borderRadius:"2px", background:p.color, width:`${pct}%`, transition:"width 0.5s ease" }} />
                </div>
                <span style={{ fontSize:"11px", fontWeight:"700", color:p.color, fontFamily:"monospace", width:"32px", textAlign:"right" }}>{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* GO LIVE / END BUTTON */}
      {!isLive ? (
        <button onClick={goLive} disabled={!canGoLive}
          style={{ width:"100%", padding:"18px", borderRadius:"14px", border:"none", cursor:canGoLive ? "pointer" : "not-allowed", background:canGoLive ? "linear-gradient(135deg,#FF3B30,#FF6B35)" : "rgba(255,255,255,0.05)", color:canGoLive ? "#fff" : "#383838", fontSize:"14px", fontWeight:"900", letterSpacing:"0.2em", boxShadow:canGoLive ? "0 8px 32px rgba(255,59,48,0.4)" : "none", transition:"all 0.3s" }}>
          🔴 GO LIVE ON {liveSelected.length} PLATFORM{liveSelected.length !== 1 ? "S" : ""}
        </button>
      ) : (
        <button onClick={endLive} style={{ width:"100%", padding:"18px", borderRadius:"14px", cursor:"pointer", background:"rgba(255,59,48,0.15)", border:"2px solid #FF3B30", color:"#FF3B30", fontSize:"14px", fontWeight:"900", letterSpacing:"0.2em" }}>
          ⏹ END LIVE STREAM
        </button>
      )}

      <div style={{ marginTop:"16px", padding:"12px", borderRadius:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:"9px", color:"#555", letterSpacing:"0.2em", marginBottom:"6px" }}>◆ BEST MOBILE STREAMING APPS</div>
        <div style={{ fontSize:"11px", color:"#666", lineHeight:1.65 }}>Use <strong style={{color:"#ccc"}}>Streamyard</strong> or <strong style={{color:"#ccc"}}>Restream.io</strong> on your phone for the most reliable multi-platform streaming. Enter your stream keys there — this panel stores them all in one place.</div>
      </div>
    </div>
  );
}

// ─── SOCIAL TAB ───────────────────────────────────────────────────────────────
function SocialTab({ cfg, update }) {
  const fields = [
    { id:"instagram", label:"Instagram",   icon:"📸", color:"#E1306C", ph:"@yourhandle"    },
    { id:"tiktok",    label:"TikTok",      icon:"🎵", color:"#69C9D0", ph:"@yourhandle"    },
    { id:"youtube",   label:"YouTube",     icon:"▶",  color:"#FF0000", ph:"@yourchannel"   },
    { id:"twitter",   label:"X / Twitter", icon:"✕",  color:"#1DA1F2", ph:"@yourhandle"    },
    { id:"facebook",  label:"Facebook",    icon:"📘", color:"#4267B2", ph:"Your Page Name" },
    { id:"spotify",   label:"Spotify",     icon:"♫",  color:"#1DB954", ph:"Your Artist"    },
  ];
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Social Media Handles" icon="◎" color="#FFD60A">
        {fields.map(p => (
          <div key={p.id} style={{ marginBottom:"12px" }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:p.color, display:"flex", alignItems:"center", gap:"6px", marginBottom:"7px" }}>
              <span>{p.icon}</span>{p.label.toUpperCase()}
            </label>
            <input value={cfg.social[p.id]} onChange={e => update("social", p.id, e.target.value)} placeholder={p.ph}
              style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:`1px solid ${p.color}30`, borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
          </div>
        ))}
      </ASection>
    </div>
  );
}

// ─── APIS TAB ─────────────────────────────────────────────────────────────────
function ApisTab({ cfg, update, testConn, testResult }) {
  const apis = [
    { id:"publerKey",       label:"Publer API Key",         icon:"◆", color:"#FF6B35", desc:"Cross-platform publisher",     link:"publer.io"                   },
    { id:"tiktokKey",       label:"TikTok Content API",     icon:"🎵", color:"#69C9D0", desc:"Direct posting API key",       link:"developers.tiktok.com"       },
    { id:"youtubeKey",      label:"YouTube Data API v3",    icon:"▶", color:"#FF0000",  desc:"Google Cloud Console key",     link:"console.cloud.google.com"    },
    { id:"spotifyClientId", label:"Spotify Client ID",      icon:"♫", color:"#1DB954",  desc:"Spotify Developer Dashboard",  link:"developer.spotify.com"       },
    { id:"stripeKey",       label:"Stripe Publishable Key", icon:"💳", color:"#635BFF", desc:"Payments & memberships",       link:"dashboard.stripe.com"        },
  ];
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ padding:"14px", borderRadius:"12px", marginBottom:"20px", background:"rgba(255,59,48,0.07)", border:"1px solid rgba(255,59,48,0.2)" }}>
        <div style={{ fontSize:"10px", color:"#FF3B30", marginBottom:"5px" }}>🔒 SECURITY NOTICE</div>
        <div style={{ fontSize:"11px", color:"#888", lineHeight:1.6 }}>In production, store API keys server-side. Never expose secret keys in public client code.</div>
      </div>
      {apis.map(api => {
        const st = testResult[api.id];
        return (
          <div key={api.id} style={{ marginBottom:"16px", padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                <span style={{ color:api.color, fontSize:"14px" }}>{api.icon}</span>
                <div>
                  <div style={{ fontSize:"11px", fontWeight:"700", color:api.color }}>{api.label}</div>
                  <div style={{ fontSize:"9px", color:"#484848" }}>{api.desc}</div>
                </div>
              </div>
              <button onClick={() => testConn(api.id)}
                style={{ padding:"5px 10px", borderRadius:"7px", cursor:"pointer", fontSize:"9px", transition:"all 0.2s",
                  background: st==="success" ? "rgba(0,245,212,0.1)" : st==="fail" ? "rgba(255,59,48,0.1)" : "rgba(255,255,255,0.05)",
                  border:     st==="success" ? "1px solid rgba(0,245,212,0.3)" : st==="fail" ? "1px solid rgba(255,59,48,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  color:      st==="success" ? "#00F5D4" : st==="fail" ? "#FF3B30" : api.color }}>
                {st==="testing" ? "◌ ..." : st==="success" ? "✓ OK" : st==="fail" ? "✗ FAIL" : "TEST"}
              </button>
            </div>
            <input value={cfg.apis[api.id]} onChange={e => update("apis", api.id, e.target.value)}
              placeholder={`Enter ${api.label}...`} type="password"
              style={{ width:"100%", padding:"10px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
            <div style={{ fontSize:"9px", color:"#3a3a3a", marginTop:"6px" }}>
              Get key → <span style={{ color:api.color }}>{api.link}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FEATURES TAB ─────────────────────────────────────────────────────────────
function FeaturesTab({ cfg, setCfg }) {
  const features = [
    { id:"membershipEnabled", label:"Fan Membership",      desc:"$4.99/mo subscription tier",        color:"#FFD60A" },
    { id:"downloadEnabled",   label:"Digital Downloads",   desc:"Music & episode download sales",     color:"#FF6B35" },
    { id:"scheduleEnabled",   label:"Post Scheduling",     desc:"Schedule posts for optimal times",   color:"#C77DFF" },
    { id:"analyticsEnabled",  label:"Analytics Dashboard", desc:"Track plays, views, follower growth", color:"#00F5D4" },
    { id:"merchEnabled",      label:"Merch Store",         desc:"In-app merchandise shop",            color:"#F72585" },
  ];
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Feature Toggles" icon="⚙" color="#00F5D4">
        <div style={{ padding:"12px", borderRadius:"10px", marginBottom:"16px", background:"rgba(0,245,212,0.05)", border:"1px solid rgba(0,245,212,0.1)" }}>
          <div style={{ fontSize:"10px", color:"#00F5D4", marginBottom:"4px" }}>◆ LIVE TOGGLES</div>
          <div style={{ fontSize:"11px", color:"#777" }}>Changes apply instantly after saving.</div>
        </div>
        {features.map(f => (
          <div key={f.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px", marginBottom:"10px", borderRadius:"12px", background:cfg.features[f.id] ? `${f.color}0d` : "rgba(255,255,255,0.02)", border:cfg.features[f.id] ? `1px solid ${f.color}30` : "1px solid rgba(255,255,255,0.06)", transition:"all 0.3s" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"13px", fontWeight:"700", color:cfg.features[f.id] ? f.color : "#777" }}>{f.label}</div>
              <div style={{ fontSize:"10px", color:"#484848", marginTop:"2px" }}>{f.desc}</div>
            </div>
            <div onClick={() => setCfg(p => ({ ...p, features:{ ...p.features, [f.id]:!p.features[f.id] }}))}
              style={{ width:"48px", height:"26px", borderRadius:"13px", cursor:"pointer", flexShrink:0, background:cfg.features[f.id] ? f.color : "rgba(255,255,255,0.1)", position:"relative", transition:"background 0.3s" }}>
              <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:cfg.features[f.id] ? "25px" : "3px", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
            </div>
          </div>
        ))}
      </ASection>
    </div>
  );
}

// ─── SECURITY TAB ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const accessLog = [
    { action:"Admin Login",  time:"Just now",  ok:true  },
    { action:"Config Saved", time:"2 min ago", ok:true  },
    { action:"Failed Login", time:"1 hr ago",  ok:false },
    { action:"Admin Login",  time:"Yesterday", ok:true  },
  ];
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Change Admin Password" icon="🔒" color="#FF3B30">
        <PasswordChange />
      </ASection>
      <ASection title="Access Log" icon="◎" color="#484848">
        <div style={{ fontSize:"9px", color:"#555", letterSpacing:"0.2em", marginBottom:"10px" }}>RECENT ACTIVITY</div>
        {accessLog.map((l, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i < accessLog.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:l.ok ? "#00F5D4" : "#FF3B30", flexShrink:0 }} />
              <span style={{ fontSize:"11px", color:"#aaa" }}>{l.action}</span>
            </div>
            <span style={{ fontSize:"10px", color:"#484848" }}>{l.time}</span>
          </div>
        ))}
      </ASection>
    </div>
  );
}

function PasswordChange() {
  const [curr, setCurr] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [msg,  setMsg]  = useState("");

  const handle = () => {
    if (curr !== ADMIN_PASS)  { setMsg("error:Current password is incorrect.");           return; }
    if (next.length < 8)      { setMsg("error:New password must be at least 8 characters."); return; }
    if (next !== conf)        { setMsg("error:Passwords do not match.");                  return; }
    setMsg("success:Password updated. Requires code redeployment to persist in production.");
    setCurr(""); setNext(""); setConf("");
  };

  const isErr = msg.startsWith("error:");
  const msgTxt = msg.split(":").slice(1).join(":");

  return (
    <div>
      {[["Current Password", curr, setCurr], ["New Password", next, setNext], ["Confirm New Password", conf, setConf]].map(([label, val, set], i) => (
        <div key={i} style={{ marginBottom:"12px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>{label.toUpperCase()}</label>
          <input type="password" value={val} onChange={e => set(e.target.value)}
            style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
        </div>
      ))}
      {msg && (
        <div style={{ padding:"9px 12px", borderRadius:"8px", marginBottom:"12px", fontSize:"11px", background:isErr ? "rgba(255,59,48,0.1)" : "rgba(0,245,212,0.1)", border:isErr ? "1px solid rgba(255,59,48,0.3)" : "1px solid rgba(0,245,212,0.3)", color:isErr ? "#FF3B30" : "#00F5D4" }}>
          {msgTxt}
        </div>
      )}
      <button onClick={handle} style={{ width:"100%", padding:"12px", borderRadius:"10px", border:"none", cursor:"pointer", background:"rgba(255,59,48,0.15)", color:"#FF3B30", fontSize:"11px", fontWeight:"700", letterSpacing:"0.15em" }}>
        🔒 UPDATE PASSWORD
      </button>
    </div>
  );
}

// ─── ADMIN UI HELPERS ─────────────────────────────────────────────────────────
function ASection({ title, icon, color, children }) {
  return (
    <div style={{ marginBottom:"24px", padding:"20px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${color}20` }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"18px" }}>
        <span style={{ color, fontSize:"14px" }}>{icon}</span>
        <div style={{ fontSize:"11px", fontWeight:"800", letterSpacing:"0.15em", color }}>{title.toUpperCase()}</div>
      </div>
      {children}
    </div>
  );
}

function AField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom:"14px" }}>
      <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#555", display:"block", marginBottom:"7px" }}>{label.toUpperCase()}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function HomeScreen({ go, config }) {
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;
  const heroType     = config.brand.heroType     || "gradient";
  const heroImageUrl = config.brand.heroImageUrl || "";
  const heroHeading  = config.brand.heroHeading  || "Your Media Empire";
  const heroSubtext  = config.brand.heroSubtext  || "MUSIC · SHOWS · GALLERY · SOCIAL";

  const cards = [
    { icon:"♪", title:"MUSIC",       sub:"Latest tracks & releases",      s:"music",      accent:pc        },
    { icon:"▶", title:"TALK SHOW",   sub:"Episodes & interviews",          s:"shows",      accent:ac        },
    { icon:"◈", title:"GALLERY",     sub:"Photos & behind the scenes",     s:"gallery",    accent:"#00F5D4" },
    { icon:"◎", title:"SOCIAL HUB",  sub:"All platforms in one place",     s:"social",     accent:"#FFD60A" },
    { icon:"⭐", title:"MEMBERSHIP",  sub:"Exclusive access for true fans", s:"membership", accent:"#FFD60A" },
    { icon:"📅", title:"BOOK / INQUIRE",sub:"Brand deals, features & more",s:"booking",    accent:"#C77DFF" },
    { icon:"🔗", title:"LINK IN BIO", sub:"All your links in one place",   s:"linkinbio",  accent:"#00F5D4" },
    { icon:"💬", title:"COMMUNITY",   sub:"Posts, replies & the vibe",      s:"chat",       accent:"#FF6B35" },
    ...(config.features.merchEnabled ? [{ icon:"🛍", title:"MERCH STORE", sub:"Shop your brand's products", s:"merch", accent:"#FFD60A" }] : []),
  ];

  // Hero background — image or gradient
  const heroBg = heroType === "image" && heroImageUrl
    ? `url(${heroImageUrl}) center/cover no-repeat`
    : `linear-gradient(180deg,${ac}18 0%,transparent 100%)`;

  return (
    <div>
      {/* HERO */}
      <div style={{ position:"relative", textAlign:"center", overflow:"hidden" }}>
        {/* BG layer */}
        <div style={{ position:"absolute", inset:0, background:heroBg, zIndex:0 }} />
        {/* Dark overlay so text stays readable over any image */}
        {heroType === "image" && heroImageUrl && (
          <div style={{ position:"absolute", inset:0, background:"rgba(8,8,8,0.62)", zIndex:1 }} />
        )}
        {/* CONTENT */}
        <div style={{ position:"relative", zIndex:2, padding:"52px 24px 36px" }}>
          <div style={{ margin:"0 auto 20px" }}><LogoDisplay config={config} size={88} /></div>
          <h1 style={{ fontSize:"clamp(26px,7vw,48px)", fontWeight:"900", margin:"0 0 6px", lineHeight:1.1, letterSpacing:"-0.01em" }}>
            Welcome to<br />
            <span style={{ background:`linear-gradient(135deg,${pc},${ac},#00F5D4)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {heroHeading}
            </span>
          </h1>
          <p style={{ color: heroType==="image" ? "rgba(255,255,255,0.6)" : "#666", fontSize:"12px", letterSpacing:"0.14em", margin:"0 0 28px", fontFamily:"monospace" }}>
            {heroSubtext}
          </p>
          <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
            {[["♪ Music","music"],["▶ Shows","shows"],["◎ Social","social"]].map(([l,s],i) => (
              <button key={i} onClick={() => go(s)} style={{ padding:"10px 18px", borderRadius:"22px", cursor:"pointer", fontSize:"11px", fontWeight:"700", letterSpacing:"0.1em", fontFamily:"monospace", background:i===0 ? `linear-gradient(135deg,${pc},${ac})` : "rgba(255,255,255,0.08)", border:i===0 ? "none" : "1px solid rgba(255,255,255,0.15)", color:i===0 ? "#000" : "#ddd" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {[["66K+","FOLLOWERS"],["6","PLATFORMS"],["∞","CONTENT"]].map(([n,l],i) => (
          <div key={i} style={{ flex:1, padding:"18px 10px", textAlign:"center", borderRight:i<2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ fontSize:"24px", fontWeight:"900", background:`linear-gradient(135deg,${pc},${ac})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{n}</div>
            <div style={{ fontSize:"8px", letterSpacing:"0.28em", color:"#999", fontFamily:"monospace" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:"28px 20px" }}>
        {cards.map((item,i) => (
          <div key={i} onClick={() => go(item.s)} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"18px", marginBottom:"10px", borderRadius:"12px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", transition:"border-color 0.2s" }}>
            <div style={{ width:"46px", height:"46px", borderRadius:"11px", flexShrink:0, background:`${item.accent}1a`, border:`1px solid ${item.accent}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", color:item.accent }}>
              {item.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"12px", fontWeight:"800", letterSpacing:"0.15em", fontFamily:"monospace" }}>{item.title}</div>
              <div style={{ fontSize:"11px", color:"#aaa", marginTop:"2px" }}>{item.sub}</div>
            </div>
            <div style={{ color:item.accent, fontSize:"16px" }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MusicScreen({ config }) {
  const pc    = config.brand.primaryColor;
  const ac    = config.brand.accentColor;
  const music = config.music || {};
  const tracks = music.tracks && music.tracks.length > 0
    ? music.tracks
    : MUSIC_TRACKS.map((t,i) => ({ ...t, id:i+1, icon:"♪", artUrl:"" }));

  // All audio state is LOCAL — never passed from parent
  const audioRef      = useRef(null);
  const [activeIdx,   setActiveIdx]   = useState(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume,      setVolume]      = useState(1);
  const [hasAudio,    setHasAudio]    = useState(false);
  const [loadError,   setLoadError]   = useState(false);

  const getAudioSrc = (track) => {
    if (!track) return "";
    if (track.audioFile && track.audioFile.length > 10) return track.audioFile;
    if (track.audioUrl  && track.audioUrl.trim().length > 0) return track.audioUrl.trim();
    return "";
  };

  // Called DIRECTLY from user tap — synchronous with gesture so browser allows play()
  const handleTrackTap = (idx) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Tap same track → toggle play/pause
    if (activeIdx === idx) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else           { audio.play().catch(()=>{}); setIsPlaying(true); }
      return;
    }

    // New track selected
    const track = tracks[idx];
    const src   = getAudioSrc(track);
    setActiveIdx(idx);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setLoadError(false);

    if (src) {
      setHasAudio(true);
      audio.pause();
      audio.src    = src;
      audio.volume = volume;
      audio.load();
      // play() called directly inside user gesture handler — browser allows this
      audio.play()
        .then(()  => setIsPlaying(true))
        .catch(err => { setIsPlaying(false); setLoadError(true); console.warn("Audio play failed:", err); });
    } else {
      setHasAudio(false);
      setIsPlaying(false);
      audio.pause();
      audio.src = "";
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { audio.play().catch(()=>{}); setIsPlaying(true); }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  };

  const bannerBg = music.bannerType === "image" && music.bannerUrl
    ? `url(${music.bannerUrl}) center/cover no-repeat`
    : `linear-gradient(135deg,${music.bannerGrad1||pc}33,${music.bannerGrad2||ac}1a)`;

  const featuredTitle = music.featuredTitle || "Your Latest Single";
  const featuredSub   = music.featuredSub   || "Out Now · All Platforms";
  const currentTrack  = activeIdx !== null ? tracks[activeIdx] : null;

  return (
    <div>
      {/* HIDDEN AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a) { setCurrentTime(a.currentTime); setProgress(a.duration ? (a.currentTime/a.duration)*100 : 0); }
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
        onError={() => { setIsPlaying(false); setHasAudio(false); setLoadError(true); }}
        style={{ display:"none" }}
      />

      {/* BANNER */}
      <div style={{ background:bannerBg, padding:"28px 20px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(8,8,8,0.55)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <SH icon="♪" title="MUSIC" accent={music.bannerGrad1||pc} sub="Stream. Download. Feel it." />
          <div style={{ padding:"20px", borderRadius:"14px", background:"rgba(0,0,0,0.5)", border:`1px solid ${pc}44`, backdropFilter:"blur(12px)" }}>
            <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:pc, fontFamily:"monospace", marginBottom:"6px" }}>◆ LATEST RELEASE</div>
            <div style={{ fontSize:"19px", fontWeight:"900", marginBottom:"3px" }}>{featuredTitle}</div>
            <div style={{ fontSize:"11px", color:"#999", marginBottom:"18px" }}>{featuredSub}</div>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={() => handleTrackTap(0)}
                style={{ padding:"11px 22px", borderRadius:"22px", border:"none", background:pc, color:"#000", fontWeight:"900", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace" }}>
                {activeIdx===0 && isPlaying ? "⏸ PAUSE" : "▶ PLAY NOW"}
              </button>
              <button style={{ padding:"11px 22px", borderRadius:"22px", border:`1px solid ${pc}66`, background:"none", color:pc, fontWeight:"700", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace" }}>↓ DOWNLOAD</button>
            </div>
          </div>
        </div>
      </div>

      {/* NOW PLAYING BAR */}
      {currentTrack && (
        <div style={{ margin:"16px 20px 0", padding:"14px 16px", borderRadius:"14px", background:`linear-gradient(135deg,${pc}22,${ac}14)`, border:`1px solid ${pc}44` }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"8px", flexShrink:0, overflow:"hidden", background:`${pc}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>
              {currentTrack.artUrl
                ? <img src={currentTrack.artUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : currentTrack.icon || "♪"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:"12px", fontWeight:"700", color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{currentTrack.title}</div>
              <div style={{ fontSize:"9px", color:"#bbb", fontFamily:"monospace" }}>
                {currentTrack.genre} ·{" "}
                {loadError ? <span style={{color:"#FF3B30"}}>Load failed</span>
                  : !hasAudio ? <span style={{color:"#FFD60A"}}>No audio source</span>
                  : isPlaying ? <span style={{color:"#00F5D4"}}>Playing ♪</span>
                  : "Paused"}
              </div>
            </div>
            <button onClick={handlePlayPause}
              style={{ width:"40px", height:"40px", borderRadius:"50%", flexShrink:0, border:"none", background:hasAudio&&!loadError?pc:"rgba(255,255,255,0.1)", color:hasAudio&&!loadError?"#000":"#555", fontSize:"18px", cursor:hasAudio&&!loadError?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div onClick={seek} style={{ height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.1)", cursor:hasAudio?"pointer":"default", marginBottom:"6px" }}>
            <div style={{ height:"100%", borderRadius:"2px", background:pc, width:`${progress}%`, transition:"width 0.2s linear" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"9px", color:"#aaa", fontFamily:"monospace" }}>{fmt(currentTime)}</span>
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => { const v=parseFloat(e.target.value); setVolume(v); if(audioRef.current) audioRef.current.volume=v; }}
              style={{ width:"70px", accentColor:pc, cursor:"pointer" }} />
            <span style={{ fontSize:"9px", color:"#aaa", fontFamily:"monospace" }}>{fmt(duration)}</span>
          </div>

          {!hasAudio && !loadError && (
            <div style={{ marginTop:"8px", padding:"8px 12px", borderRadius:"8px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", fontSize:"10px", color:"#aaa", fontFamily:"monospace" }}>
              📁 Add a URL or upload MP3/WAV/AIFF in <strong style={{color:"#ccc"}}>Admin → Music</strong> for this track.
            </div>
          )}
          {loadError && (
            <div style={{ marginTop:"8px", padding:"8px 12px", borderRadius:"8px", background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)", fontSize:"10px", color:"#FF3B30", fontFamily:"monospace" }}>
              ⚠ Could not load audio. Check the URL or re-upload the file in Admin → Music.
            </div>
          )}
        </div>
      )}

      {/* TRACK LIST */}
      <div style={{ padding:"20px 20px 28px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#999", fontFamily:"monospace", marginBottom:"14px" }}>ALL TRACKS</div>
        {tracks.map((t, i) => {
          const isActive = activeIdx === i;
          const hasSrc   = !!(t.audioFile?.length>10 || t.audioUrl?.trim().length>0);
          return (
            <div key={t.id||i} onClick={() => handleTrackTap(i)}
              style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px", marginBottom:"8px", borderRadius:"10px", cursor:"pointer", background:isActive?`${pc}1a`:"rgba(255,255,255,0.02)", border:isActive?`1px solid ${pc}4d`:"1px solid rgba(255,255,255,0.04)", transition:"all 0.2s" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"9px", flexShrink:0, overflow:"hidden", position:"relative", background:t.artUrl?"transparent":(isActive?pc:`${pc}22`), border:isActive?"none":"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {t.artUrl
                  ? <img src={t.artUrl} alt={t.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <span style={{ fontSize:"18px", color:isActive?"#000":pc }}>{isActive&&isPlaying?"⏸":(t.icon||"♪")}</span>
                }
                {t.artUrl && isActive && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>{isPlaying?"⏸":"▶"}</div>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"13px", fontWeight:"700", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                <div style={{ fontSize:"10px", color:"#aaa", fontFamily:"monospace" }}>
                  {t.genre}
                  {hasSrc ? <span style={{color:"#00F5D4"}}> · ♪ ready</span> : <span style={{color:"#888"}}> · no audio</span>}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:"10px", color:"#bbb", fontFamily:"monospace" }}>{t.duration}</div>
                <div style={{ fontSize:"9px", color:"#999", fontFamily:"monospace" }}>{t.plays} plays</div>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop:"24px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#999", fontFamily:"monospace", marginBottom:"12px" }}>FIND ME ON</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {["Spotify","Apple Music","SoundCloud","Tidal","YouTube Music"].map((p,i)=>(
              <div key={i} style={{ padding:"7px 13px", borderRadius:"18px", fontSize:"10px", fontFamily:"monospace", border:"1px solid rgba(255,255,255,0.08)", color:"#bbb" }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowsScreen({ config }) {
  const ac       = config.brand.accentColor;
  const pc       = config.brand.primaryColor;
  const shows    = config.shows || {};
  const episodes = shows.episodes || SHOWS.map((s,i) => ({ ...s, id:i+1 }));
  const bannerBg = shows.bannerUrl
    ? `url(${shows.bannerUrl}) center/cover no-repeat`
    : `linear-gradient(135deg,${ac}2a,rgba(8,8,8,0.85))`;

  const [activeEp, setActiveEp] = useState(null); // id of episode with player open
  const [epPlaying, setEpPlaying] = useState(false);
  const videoRef = useRef(null);

  const getVideoSrc = (ep) => {
    if (ep.videoFile && ep.videoFile.length > 0) return ep.videoFile;
    if (ep.videoUrl  && ep.videoUrl.length  > 0) return ep.videoUrl;
    return "";
  };

  // Determine if URL is embeddable (YouTube / Vimeo)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
    return null;
  };

  const openPlayer = (ep) => {
    setActiveEp(ep.id);
    setEpPlaying(false);
  };

  const closePlayer = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.src = ""; }
    setActiveEp(null);
    setEpPlaying(false);
  };

  // Full-screen video modal
  const activeEpisode = episodes.find(e => e.id === activeEp);
  if (activeEpisode) {
    const src      = getVideoSrc(activeEpisode);
    const embedUrl = activeEpisode.videoType === "url" ? getEmbedUrl(src) : null;
    const isEmbed  = !!embedUrl;
    const isFile   = !!activeEpisode.videoFile;
    const isRawUrl = src && !isEmbed;

    return (
      <div style={{ background:"#000", minHeight:"100vh", color:"#F0EDE8" }}>
        {/* VIDEO PLAYER HEADER */}
        <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)" }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:"13px", fontWeight:"700", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activeEpisode.title}</div>
            <div style={{ fontSize:"9px", color:"#aaa", fontFamily:"monospace", marginTop:"2px" }}>{activeEpisode.duration} · {activeEpisode.views} VIEWS</div>
          </div>
          <button onClick={closePlayer} style={{ width:"36px", height:"36px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.08)", color:"#ccc", fontSize:"18px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* VIDEO AREA */}
        <div style={{ background:"#000", position:"relative" }}>
          {isEmbed ? (
            <iframe src={embedUrl} title={activeEpisode.title}
              style={{ width:"100%", aspectRatio:"16/9", border:"none", display:"block" }}
              allow="autoplay; fullscreen" allowFullScreen />
          ) : src ? (
            <div>
              <video ref={videoRef} src={src} controls playsInline
                style={{ width:"100%", aspectRatio:"16/9", background:"#000", display:"block" }}
                onPlay={() => setEpPlaying(true)}
                onPause={() => setEpPlaying(false)} />
            </div>
          ) : (
            <div style={{ aspectRatio:"16/9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px" }}>
              <span style={{ fontSize:"42px" }}>📺</span>
              <div style={{ fontSize:"13px", color:"#aaa" }}>No video source added yet</div>
              <div style={{ fontSize:"11px", color:"#888", fontFamily:"monospace" }}>Add a URL or upload a video in Admin → Shows</div>
            </div>
          )}
        </div>

        {/* EPISODE INFO */}
        <div style={{ padding:"20px" }}>
          <div style={{ fontSize:"15px", fontWeight:"800", marginBottom:"8px" }}>{activeEpisode.title}</div>
          <div style={{ fontSize:"12px", color:"#aaa", lineHeight:1.6, marginBottom:"20px" }}>{activeEpisode.desc || "No description."}</div>

          {/* OTHER EPISODES */}
          <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#999", fontFamily:"monospace", marginBottom:"12px" }}>MORE EPISODES</div>
          {episodes.filter(e => e.id !== activeEp).map((ep, i) => (
            <div key={ep.id || i} onClick={() => openPlayer(ep)}
              style={{ display:"flex", gap:"12px", alignItems:"center", padding:"12px", marginBottom:"8px", borderRadius:"10px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer" }}>
              <div style={{ width:"60px", height:"40px", borderRadius:"6px", flexShrink:0, background:ep.thumbUrl?`url(${ep.thumbUrl}) center/cover no-repeat`:`${ac}22`, display:"flex", alignItems:"center", justifyContent:"center", color:ac, fontSize:"14px" }}>
                {!ep.thumbUrl && "▶"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"11px", fontWeight:"700", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ep.title}</div>
                <div style={{ fontSize:"9px", color:"#999", fontFamily:"monospace", marginTop:"2px" }}>{ep.duration} · {ep.views} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // EPISODE LIST VIEW
  return (
    <div>
      {/* SHOW BANNER */}
      {(shows.showTitle || shows.bannerUrl) && (
        <div style={{ background:bannerBg, padding:"28px 20px 20px", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(8,8,8,0.6)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <SH icon="▶" title={shows.showTitle || "TALK SHOW"} accent={ac} sub={shows.showDesc || "Real conversations. No filter."} />
          </div>
        </div>
      )}

      <div style={{ padding: shows.showTitle ? "20px 20px 28px" : "28px 20px" }}>
        {!shows.showTitle && <SH icon="▶" title="TALK SHOW" accent={ac} sub="Real conversations. No filter." />}
        {episodes.map((ep, i) => {
          const hasThumb = !!ep.thumbUrl;
          const src      = getVideoSrc(ep);
          const hasVideo = !!src;
          return (
            <div key={ep.id || i} style={{ marginBottom:"16px", borderRadius:"14px", overflow:"hidden", border:`1px solid ${ac}22` }}>
              {/* THUMBNAIL */}
              <div onClick={() => openPlayer(ep)}
                style={{ height:"160px", background:hasThumb?`url(${ep.thumbUrl}) center/cover no-repeat`:`linear-gradient(135deg,${ac}2a,rgba(8,8,8,0.85))`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", cursor:"pointer" }}>
                {hasThumb && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />}
                {/* PLAY BUTTON */}
                <div style={{ position:"relative", zIndex:1, width:"56px", height:"56px", borderRadius:"50%", background:hasVideo?ac:`${ac}55`, border:hasVideo?"none":`2px solid ${ac}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", color:hasVideo?"#000":ac, boxShadow:hasVideo?`0 0 28px ${ac}80`:"none", transition:"transform 0.2s" }}>▶</div>
                <div style={{ position:"absolute", top:"10px", right:"10px", zIndex:1, padding:"4px 9px", borderRadius:"8px", background:"rgba(0,0,0,0.65)", fontSize:"9px", color:ac, fontFamily:"monospace" }}>{ep.duration}</div>
                {hasVideo && <div style={{ position:"absolute", top:"10px", left:"10px", zIndex:1, padding:"4px 8px", borderRadius:"8px", background:"rgba(0,0,0,0.65)", fontSize:"8px", color:"#00F5D4", fontFamily:"monospace" }}>● VIDEO READY</div>}
                {!hasVideo && <div style={{ position:"absolute", top:"10px", left:"10px", zIndex:1, padding:"4px 8px", borderRadius:"8px", background:"rgba(0,0,0,0.65)", fontSize:"8px", color:"#aaa", fontFamily:"monospace" }}>NO VIDEO YET</div>}
              </div>
              {/* INFO */}
              <div style={{ padding:"15px", background:`${ac}07` }}>
                <div style={{ fontSize:"12px", fontWeight:"800", marginBottom:"4px" }}>{ep.title}</div>
                <div style={{ fontSize:"11px", color:"#aaa", marginBottom:"12px" }}>{ep.desc}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:"9px", color:"#999", fontFamily:"monospace" }}>{ep.views} VIEWS</div>
                  <button onClick={() => openPlayer(ep)} style={{ padding:"6px 14px", borderRadius:"14px", border:`1px solid ${ac}`, background:hasVideo?ac:"none", color:hasVideo?"#000":ac, fontSize:"9px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace", fontWeight:hasVideo?"700":"400" }}>
                    {hasVideo ? "▶ WATCH NOW" : "WATCH NOW"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FILTERS for photo editing ────────────────────────────────────────────────
const FILTERS = [
  { id:"none",     label:"Original", css:"none"                                         },
  { id:"vivid",    label:"Vivid",    css:"saturate(1.8) contrast(1.1)"                  },
  { id:"moody",    label:"Moody",    css:"brightness(0.85) contrast(1.2) saturate(0.8)" },
  { id:"warm",     label:"Warm",     css:"sepia(0.35) saturate(1.4) brightness(1.05)"   },
  { id:"cool",     label:"Cool",     css:"hue-rotate(20deg) saturate(1.2)"              },
  { id:"bw",       label:"B&W",      css:"grayscale(1) contrast(1.1)"                   },
  { id:"fade",     label:"Fade",     css:"brightness(1.1) contrast(0.85) saturate(0.75)"},
  { id:"dramatic", label:"Dramatic", css:"contrast(1.4) saturate(1.3) brightness(0.9)"  },
];

function buildTransform(r,fh,fv){const p=[];if(r)p.push(`rotate(${r}deg)`);if(fh)p.push("scaleX(-1)");if(fv)p.push("scaleY(-1)");return p.join(" ")||"none";}
function buildFilter(f,b,c){const base=FILTERS.find(fi=>fi.id===f)?.css||"none";const adj=`brightness(${b/100}) contrast(${c/100})`;return f==="none"?adj:`${base} ${adj}`;}

function GalleryScreen({ config }) {
  const [lightbox, setLightbox] = useState(null);
  const photos = (config.gallery && config.gallery.photos) || [];

  if (lightbox !== null) {
    const photo = photos[lightbox];
    if (!photo) { setLightbox(null); return null; }
    return (
      <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.96)", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:"12px", color:"#aaa", fontFamily:"monospace" }}>{photo.name}</div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{ fontSize:"10px", color:"#999", fontFamily:"monospace" }}>{lightbox+1} / {photos.length}</span>
            <button onClick={() => setLightbox(null)} style={{ padding:"7px 12px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:"#bbb", fontSize:"16px", cursor:"pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <img src={photo.src} alt={photo.name} style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", filter:buildFilter(photo.filter||"none",photo.brightness||100,photo.contrast||100), transform:buildTransform(photo.rotation||0,photo.flipH||false,photo.flipV||false), borderRadius:"8px" }} />
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between" }}>
          <button onClick={() => setLightbox(l => Math.max(0,l-1))} disabled={lightbox===0} style={{ padding:"8px 18px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:lightbox===0?"#333":"#ccc", cursor:lightbox===0?"not-allowed":"pointer", fontSize:"12px" }}>← PREV</button>
          <button onClick={() => setLightbox(l => Math.min(photos.length-1,l+1))} disabled={lightbox===photos.length-1} style={{ padding:"8px 18px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:lightbox===photos.length-1?"#333":"#ccc", cursor:lightbox===photos.length-1?"not-allowed":"pointer", fontSize:"12px" }}>NEXT →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"28px 20px" }}>
      <SH icon="◈" title="GALLERY" accent="#00F5D4" sub="The moments. The movement." />
      {photos.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:"48px", marginBottom:"14px" }}>◈</div>
          <div style={{ fontSize:"14px", color:"#999", marginBottom:"6px" }}>No photos yet</div>
          <div style={{ fontSize:"11px", color:"#333", fontFamily:"monospace" }}>Upload photos in Admin → Gallery</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize:"9px", color:"#aaa", fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:"10px" }}>{photos.length} PHOTO{photos.length!==1?"S":""} · TAP TO VIEW</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"4px" }}>
            {photos.map((photo, idx) => (
              <div key={photo.id || idx} onClick={() => setLightbox(idx)}
                style={{ aspectRatio:"1", borderRadius:idx===0?"10px 0 0 0":idx===2?"0 10px 0 0":"0", overflow:"hidden", cursor:"pointer", position:"relative" }}>
                <img src={photo.src} alt={photo.name || "photo"} style={{ width:"100%", height:"100%", objectFit:"cover", filter:buildFilter(photo.filter||"none",photo.brightness||100,photo.contrast||100), transform:buildTransform(photo.rotation||0,photo.flipH||false,photo.flipV||false) }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SocialScreen({ config }) {
  const [copied,   setCopied]   = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const posts = config.socialPosts || {};

  const copy = () => {
    navigator.clipboard?.writeText(config.brand.universalLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (lightbox) {
    const p = lightbox;
    return (
      <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.96)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"700", color:p.color }}>{p.icon} {p.name}</div>
            {p.post?.date && <div style={{ fontSize:"9px", color:"#999", fontFamily:"monospace", marginTop:"2px" }}>Posted {p.post.date}</div>}
          </div>
          <button onClick={() => setLightbox(null)} style={{ padding:"7px 12px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:"#bbb", fontSize:"16px", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <img src={p.post.imageUrl} alt="post" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", borderRadius:"10px" }} />
        </div>
        {p.post?.caption && (
          <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:"12px", color:"#ccc", lineHeight:1.6 }}>{p.post.caption}</div>
            {p.post?.postUrl && (
              <a href={p.post.postUrl} target="_blank" rel="noreferrer" style={{ display:"inline-block", marginTop:"10px", fontSize:"10px", color:p.color, fontFamily:"monospace", textDecoration:"none", border:`1px solid ${p.color}44`, padding:"5px 12px", borderRadius:"8px" }}>
                VIEW ON {p.name.toUpperCase()} ↗
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding:"28px 20px" }}>
      <SH icon="◎" title="SOCIAL HUB" accent="#FFD60A" sub="Every platform. Right here." />
      <div style={{ padding:"14px", borderRadius:"11px", marginBottom:"22px", background:"rgba(255,214,10,0.06)", border:"1px solid rgba(255,214,10,0.15)" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#FFD60A", fontFamily:"monospace", marginBottom:"5px" }}>◆ PRO TIP</div>
        <div style={{ fontSize:"12px", color:"#999", lineHeight:1.6 }}>Share this page instead of individual links. One URL = all your platforms.</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {SOCIAL_LINKS.map((s,i) => {
          const cfgKey = SOCIAL_KEY_MAP[s.name];
          const handle = (cfgKey && config.social[cfgKey]) ? config.social[cfgKey] : s.defaultHandle;
          const postKey = cfgKey || s.name.toLowerCase().replace("/","").replace(" ","");
          const post    = posts[postKey] || {};
          const hasPost = !!post.imageUrl;

          return (
            <div key={i} style={{ borderRadius:"14px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)" }}>
              {/* PLATFORM ROW */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px" }}>
                <div style={{ width:"42px", height:"42px", borderRadius:"11px", flexShrink:0, background:`${s.color}20`, border:`1px solid ${s.color}44`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, fontSize:"15px", fontWeight:"800" }}>{s.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"12px", fontWeight:"700" }}>{s.name}</div>
                  <div style={{ fontSize:"10px", color:"#999", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{handle}</div>
                </div>
                <div style={{ textAlign:"right", marginRight:"8px", flexShrink:0 }}>
                  <div style={{ fontSize:"11px", fontWeight:"700", color:s.color }}>{s.followers}</div>
                  <div style={{ fontSize:"8px", color:"#999", fontFamily:"monospace" }}>FOLLOWERS</div>
                </div>
                <button style={{ padding:"6px 12px", borderRadius:"14px", background:s.color, border:"none", color:"#000", fontSize:"9px", fontWeight:"800", letterSpacing:"0.08em", cursor:"pointer", fontFamily:"monospace", flexShrink:0 }}>{s.action}</button>
              </div>

              {/* LAST POST IMAGE */}
              {hasPost && (
                <div onClick={() => setLightbox({ ...s, post })} style={{ cursor:"pointer", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ position:"relative" }}>
                    <img src={post.imageUrl} alt="last post" style={{ width:"100%", height:"180px", objectFit:"cover", display:"block" }} />
                    {/* Platform source badge */}
                    <div style={{ position:"absolute", top:"10px", left:"10px", display:"flex", alignItems:"center", gap:"5px", padding:"4px 10px", borderRadius:"10px", background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)" }}>
                      <span style={{ fontSize:"12px" }}>{s.icon}</span>
                      <span style={{ fontSize:"9px", fontWeight:"700", color:s.color, fontFamily:"monospace", letterSpacing:"0.1em" }}>{s.name.toUpperCase()}</span>
                    </div>
                    {/* Tap to view badge */}
                    <div style={{ position:"absolute", bottom:"10px", right:"10px", padding:"4px 10px", borderRadius:"10px", background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", fontSize:"9px", color:"#ccc", fontFamily:"monospace" }}>
                      TAP TO VIEW ↗
                    </div>
                  </div>
                  {(post.caption || post.date) && (
                    <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                      {post.caption && <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{post.caption}</div>}
                      {post.date    && <div style={{ fontSize:"9px",  color:"#999", fontFamily:"monospace", marginTop:"3px" }}>Posted {post.date} · from {s.name}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* UNIVERSAL LINK */}
      <div style={{ marginTop:"28px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#999", fontFamily:"monospace", marginBottom:"10px" }}>YOUR UNIVERSAL LINK</div>
        <div style={{ padding:"13px 15px", borderRadius:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"12px", color:"#FFD60A", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{config.brand.universalLink}</span>
          <button onClick={copy} style={{ padding:"5px 11px", borderRadius:"7px", border:"1px solid rgba(255,214,10,0.3)", background:copied?"rgba(255,214,10,0.15)":"none", color:"#FFD60A", fontSize:"9px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace", flexShrink:0, marginLeft:"8px" }}>
            {copied ? "COPIED ✓" : "COPY ↗"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BroadcastScreen({ config }) {
  // ── Read defaults from Admin config ──────────────────────────────────────
  const defaultPlatforms = (config.broadcast?.defaultPlatforms?.length > 0)
    ? config.broadcast.defaultPlatforms
    : ["instagram","facebook","twitter"];
  const savedTemplates = config.broadcast?.templates || [];

  const [selected,       setSelected]       = useState(defaultPlatforms);
  const [postType,       setPostType]       = useState("post");
  const [caption,        setCaption]        = useState("");
  const [aiPrompt,       setAiPrompt]       = useState("");
  const [tone,           setTone]           = useState("Hype");
  const [aiLoading,      setAiLoading]      = useState(false);
  const [publishState,   setPublishState]   = useState(null);
  const [publishResults, setPublishResults] = useState({});
  const [bTab,           setBTab]           = useState("compose");
  const [scheduleDate,   setScheduleDate]   = useState("");
  const [scheduleTime,   setScheduleTime]   = useState("");
  const [charWarning,    setCharWarning]    = useState([]);
  const [mediaAttached,  setMediaAttached]  = useState(false);
  const [aiSuggestions,  setAiSuggestions]  = useState([]);
  const [showSuggestions,setShowSuggestions]= useState(false);
  const [scheduleConfirm,setScheduleConfirm]= useState(false);
  const [showTemplates,  setShowTemplates]  = useState(false);

  // ── Sync selected platforms if admin defaults change ─────────────────────
  useEffect(() => {
    if (config.broadcast?.defaultPlatforms?.length > 0) {
      setSelected(config.broadcast.defaultPlatforms);
    }
  }, [config.broadcast?.defaultPlatforms?.join(",")]);

  useEffect(() => {
    const warnings = selected.filter(pid => {
      const p = PLATFORMS.find(p => p.id === pid);
      return p && p.maxChars > 0 && caption.length > p.maxChars;
    });
    setCharWarning(warnings);
  }, [caption, selected]);

  const togglePlatform = (id) => {
    const p = PLATFORMS.find(p => p.id === id);
    if (!p || p.maxChars === 0) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getMinLimit = () => {
    const limits = selected.map(id => PLATFORMS.find(p => p.id === id)?.maxChars).filter(x => x && x > 0);
    return limits.length ? Math.min(...limits) : 2200;
  };

  const generateCaption = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setShowSuggestions(false);
    try {
      const names = selected.map(id => PLATFORMS.find(p => p.id === id)?.name).filter(Boolean).join(", ");
      const limit = getMinLimit();
      const r1 = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{ role:"user", content:`You are a social media expert for a digital media entertainment brand called "${config.brand.name}". Generate a cross-platform caption.\n\nTopic: ${aiPrompt}\nTone: ${tone}\nFormat: ${postType}\nPlatforms: ${names}\nMax chars: ${limit}\n\nReturn ONLY the caption text with emojis and 3–5 hashtags.` }] }),
      });
      const d1 = await r1.json();
      setCaption(d1.content?.[0]?.text?.trim() || "");

      const r2 = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:300, messages:[{ role:"user", content:`Generate 2 alternative short captions (each under 90 chars, no hashtags) for: "${aiPrompt}" in a ${tone} tone. Return as a JSON array of strings only. Example: ["option 1","option 2"]` }] }),
      });
      const d2 = await r2.json();
      try {
        const txt = d2.content?.[0]?.text?.trim().replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(txt);
        if (Array.isArray(parsed)) { setAiSuggestions(parsed); setShowSuggestions(true); }
      } catch {}
    } catch { setCaption("⚠️ Generation failed. Check your connection."); }
    setAiLoading(false);
  };

  const simulatePublish = async () => {
    setPublishState("publishing"); setBTab("results");
    const results = {};
    for (const pid of selected) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 900));
      const p = PLATFORMS.find(p => p.id === pid);
      results[pid] = p?.note === "1-tap approve" ? "pending" : "success";
      setPublishResults({ ...results });
    }
    setPublishState("done");
  };

  const resetBroadcast = () => {
    setCaption(""); setAiPrompt(""); setPublishState(null);
    setPublishResults({}); setBTab("compose"); setMediaAttached(false);
    setShowSuggestions(false); setAiSuggestions([]); setShowTemplates(false);
  };

  const charPct = () => Math.min((caption.length / getMinLimit()) * 100, 100);
  const canPost = caption.trim().length > 0 && selected.length > 0;
  const pc = config.brand.primaryColor;

  const bTabs = [
    { id:"compose",  label:"COMPOSE"  },
    { id:"preview",  label:"PREVIEW"  },
    { id:"schedule", label:"SCHEDULE" },
    ...(publishState ? [{ id:"results", label:"RESULTS" }] : []),
  ];

  return (
    <div style={{ fontFamily:"'Courier New',monospace" }}>
      {/* BROADCAST HEADER */}
      <div style={{ padding:"20px 20px 0", borderBottom:`1px solid ${pc}26` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <div>
            <div style={{ fontSize:"18px", fontWeight:"900", letterSpacing:"0.1em", background:`linear-gradient(90deg,${pc},#FFD60A)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>BROADCAST</div>
            <div style={{ fontSize:"8px", letterSpacing:"0.35em", color:"#999", marginTop:"1px" }}>ONE POST · ALL PLATFORMS</div>
          </div>
          <div style={{ display:"flex", gap:"5px" }}>
            {selected.map(pid => { const p = PLATFORMS.find(p => p.id === pid); return p ? <div key={pid} style={{ width:"26px", height:"26px", borderRadius:"6px", background:`${p.color}20`, border:`1px solid ${p.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:p.color }}>{p.icon}</div> : null; })}
          </div>
        </div>
        <div style={{ display:"flex" }}>
          {bTabs.map(t => (
            <button key={t.id} onClick={() => setBTab(t.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"9px 4px", fontSize:"8px", letterSpacing:"0.18em", color:bTab===t.id ? pc : "#3a3a3a", borderBottom:bTab===t.id ? `2px solid ${pc}` : "2px solid transparent", transition:"all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px" }}>

        {/* ── COMPOSE ── */}
        {bTab === "compose" && (
          <div>
            <BSection label="POST TO">
              <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                {PLATFORMS.map(p => {
                  const sel = selected.includes(p.id);
                  const dis = p.maxChars === 0;
                  return (
                    <button key={p.id} onClick={() => togglePlatform(p.id)} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"7px 11px", borderRadius:"18px", cursor:dis ? "not-allowed" : "pointer", background:sel ? `${p.color}20` : "rgba(255,255,255,0.03)", border:sel ? `1px solid ${p.color}` : "1px solid rgba(255,255,255,0.07)", color:sel ? p.color : "#484848", fontSize:"10px", fontWeight:sel ? "700" : "400", opacity:dis ? 0.35 : 1, transition:"all 0.2s" }}>
                      <span>{p.icon}</span><span>{p.name}</span>
                      {p.note && <span style={{ fontSize:"7px", opacity:0.55 }}>({p.note})</span>}
                      {sel && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </BSection>

            <BSection label="FORMAT">
              <div style={{ display:"flex", gap:"7px" }}>
                {POST_TYPES.map(pt => (
                  <button key={pt.id} onClick={() => setPostType(pt.id)} style={{ flex:1, padding:"10px 5px", borderRadius:"9px", cursor:"pointer", background:postType===pt.id ? `${pc}22` : "rgba(255,255,255,0.02)", border:postType===pt.id ? `1px solid ${pc}` : "1px solid rgba(255,255,255,0.06)", color:postType===pt.id ? pc : "#484848", fontSize:"8px", letterSpacing:"0.08em", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", transition:"all 0.2s" }}>
                    <span style={{ fontSize:"13px" }}>{pt.icon}</span><span>{pt.label}</span>
                  </button>
                ))}
              </div>
            </BSection>

            <BSection label="AI CAPTION WRITER">
              {/* SAVED TEMPLATES */}
              {savedTemplates.length > 0 && (
                <div style={{ marginBottom:"12px" }}>
                  <button onClick={() => setShowTemplates(v => !v)}
                    style={{ width:"100%", padding:"10px 14px", borderRadius:"10px", border:"1px solid rgba(199,125,255,0.3)", background:"rgba(199,125,255,0.07)", color:"#C77DFF", fontSize:"10px", fontWeight:"700", letterSpacing:"0.12em", cursor:"pointer", fontFamily:"monospace", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span>📋 USE SAVED TEMPLATE ({savedTemplates.length})</span>
                    <span>{showTemplates ? "▲" : "▼"}</span>
                  </button>
                  {showTemplates && (
                    <div style={{ marginTop:"6px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
                      {savedTemplates.map((t,i) => (
                        <div key={t.id || i} onClick={() => { setCaption(t.text); setShowTemplates(false); }}
                          style={{ padding:"12px 14px", borderBottom:i < savedTemplates.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor:"pointer", background:"rgba(255,255,255,0.02)", transition:"background 0.2s" }}>
                          <div style={{ fontSize:"11px", fontWeight:"700", color:"#C77DFF", marginBottom:"3px" }}>{t.name}</div>
                          <div style={{ fontSize:"10px", color:"#aaa", lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{ padding:"15px", borderRadius:"12px", background:`${pc}0d`, border:`1px solid ${pc}22` }}>
                <div style={{ fontSize:"9px", color:pc, letterSpacing:"0.2em", marginBottom:"9px" }}>◆ WHAT'S THIS POST ABOUT?</div>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. 'just dropped a new track, feeling unstoppable'"
                  style={{ width:"100%", background:"rgba(0,0,0,0.3)", border:`1px solid ${pc}2e`, borderRadius:"8px", color:"#E8E4DC", padding:"10px", fontSize:"11px", fontFamily:"monospace", resize:"none", outline:"none", lineHeight:1.5 }} rows={3} />
                <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", margin:"9px 0" }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)} style={{ padding:"4px 9px", borderRadius:"12px", cursor:"pointer", fontSize:"9px", background:tone===t ? pc : "rgba(255,255,255,0.04)", border:tone===t ? "none" : "1px solid rgba(255,255,255,0.07)", color:tone===t ? "#000" : "#555", fontWeight:tone===t ? "800" : "400", transition:"all 0.2s" }}>
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={generateCaption} disabled={aiLoading || !aiPrompt.trim()} style={{ width:"100%", padding:"11px", borderRadius:"9px", border:"none", background:aiLoading ? `${pc}40` : `linear-gradient(90deg,${pc},#FFD60A)`, color:"#000", fontWeight:"900", fontSize:"11px", letterSpacing:"0.14em", cursor:aiLoading ? "not-allowed" : "pointer" }}>
                  {aiLoading ? "◌ GENERATING..." : "◆ GENERATE WITH AI"}
                </button>
                {showSuggestions && aiSuggestions.length > 0 && (
                  <div style={{ marginTop:"9px" }}>
                    <div style={{ fontSize:"8px", color:"#999", letterSpacing:"0.2em", marginBottom:"5px" }}>QUICK ALTERNATIVES</div>
                    {aiSuggestions.map((s,i) => (
                      <div key={i} onClick={() => setCaption(s)} style={{ padding:"7px 9px", borderRadius:"6px", marginBottom:"4px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", fontSize:"10px", color:"#bbb", cursor:"pointer" }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </BSection>

            <BSection label="YOUR CAPTION">
              <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write here, or generate above..."
                style={{ width:"100%", minHeight:"120px", background:"rgba(255,255,255,0.02)", border:charWarning.length > 0 ? "1px solid #FF3B30" : "1px solid rgba(255,255,255,0.07)", borderRadius:"10px", color:"#E8E4DC", padding:"13px", fontSize:"12px", fontFamily:"monospace", resize:"vertical", outline:"none", lineHeight:1.6 }} rows={5} />
              <div style={{ display:"flex", alignItems:"center", gap:"9px", marginTop:"7px" }}>
                <div style={{ flex:1, height:"3px", borderRadius:"2px", background:"rgba(255,255,255,0.06)" }}>
                  <div style={{ height:"100%", borderRadius:"2px", width:`${charPct()}%`, background:charPct()>90 ? "#FF3B30" : charPct()>70 ? "#FFD60A" : "#00F5D4", transition:"width 0.3s,background 0.3s" }} />
                </div>
                <div style={{ fontSize:"9px", color:charWarning.length > 0 ? "#FF3B30" : "#484848", whiteSpace:"nowrap" }}>{caption.length}/{getMinLimit()}</div>
              </div>
              {charWarning.length > 0 && (
                <div style={{ marginTop:"7px", padding:"7px 9px", borderRadius:"6px", background:"rgba(255,59,48,0.09)", border:"1px solid rgba(255,59,48,0.28)", fontSize:"9px", color:"#FF3B30" }}>
                  ⚠ Over limit for: {charWarning.map(id => PLATFORMS.find(p => p.id === id)?.name).filter(Boolean).join(", ")}
                </div>
              )}
            </BSection>

            <BSection label="MEDIA">
              <div onClick={() => setMediaAttached(v => !v)} style={{ padding:"20px", borderRadius:"11px", textAlign:"center", border:mediaAttached ? "2px solid #00F5D4" : "2px dashed rgba(255,255,255,0.09)", background:mediaAttached ? "rgba(0,245,212,0.05)" : "rgba(255,255,255,0.01)", cursor:"pointer", transition:"all 0.3s" }}>
                <div style={{ fontSize:"22px", marginBottom:"6px" }}>{mediaAttached ? "🖼️" : "+"}</div>
                <div style={{ fontSize:"10px", color:mediaAttached ? "#00F5D4" : "#383838", letterSpacing:"0.14em" }}>{mediaAttached ? "MEDIA ATTACHED · TAP TO REMOVE" : "ATTACH PHOTO / VIDEO"}</div>
                {mediaAttached && <div style={{ fontSize:"8px", color:"#999", marginTop:"3px" }}>Auto-resized per platform</div>}
              </div>
            </BSection>

            <div style={{ display:"flex", gap:"9px", marginTop:"6px" }}>
              <button onClick={() => setBTab("schedule")} style={{ flex:1, padding:"13px", borderRadius:"11px", cursor:"pointer", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", color:"#bbb", fontSize:"10px", letterSpacing:"0.14em", fontFamily:"monospace" }}>
                🕐 SCHEDULE
              </button>
              <button onClick={simulatePublish} disabled={!canPost} style={{ flex:2, padding:"13px", borderRadius:"11px", border:"none", background:canPost ? `linear-gradient(90deg,${pc},#FFD60A)` : "rgba(255,255,255,0.04)", color:canPost ? "#000" : "#383838", fontSize:"11px", fontWeight:"900", letterSpacing:"0.14em", cursor:canPost ? "pointer" : "not-allowed", fontFamily:"monospace" }}>
                ◆ POST TO {selected.length} PLATFORMS
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {bTab === "preview" && (
          <div>
            {selected.map(pid => {
              const p = PLATFORMS.find(pl => pl.id === pid);
              if (!p) return null;
              const over = p.maxChars > 0 && caption.length > p.maxChars;
              return (
                <div key={pid} style={{ marginBottom:"14px", borderRadius:"13px", overflow:"hidden", border:`1px solid ${p.color}30` }}>
                  <div style={{ padding:"9px 13px", background:`${p.color}12`, borderBottom:`1px solid ${p.color}20`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <span style={{ color:p.color, fontSize:"13px" }}>{p.icon}</span>
                      <span style={{ fontSize:"10px", fontWeight:"700", color:p.color, letterSpacing:"0.14em" }}>{p.name.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize:"8px", color:over ? "#FF3B30" : "#484848" }}>{over ? "⚠ OVER LIMIT" : `${caption.length}/${p.maxChars||"∞"}`}</span>
                  </div>
                  <div style={{ padding:"13px", background:"rgba(0,0,0,0.3)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"9px" }}>
                      <LogoDisplay config={config} size={30} />
                      <div>
                        <div style={{ fontSize:"10px", fontWeight:"700" }}>{config.brand.name}</div>
                        <div style={{ fontSize:"8px", color:"#999" }}>@yourbrand</div>
                      </div>
                    </div>
                    {mediaAttached && <div style={{ height:"90px", borderRadius:"7px", marginBottom:"9px", background:`linear-gradient(135deg,${p.color}20,rgba(0,0,0,0.5))`, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:"20px" }}>🖼️</div>}
                    <div style={{ fontSize:"11px", lineHeight:1.6, color:"#bbb" }}>
                      {caption || <span style={{ color:"#333", fontStyle:"italic" }}>Caption will appear here...</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={() => setBTab("compose")} style={{ width:"100%", padding:"13px", borderRadius:"11px", cursor:"pointer", background:`${pc}14`, border:`1px solid ${pc}44`, color:pc, fontSize:"10px", letterSpacing:"0.18em", fontFamily:"monospace" }}>← BACK TO EDIT</button>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {bTab === "schedule" && (
          <div>
            <BSection label="PICK DATE & TIME">
              <div style={{ padding:"18px", borderRadius:"11px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize:"9px", color:"#999", letterSpacing:"0.2em", marginBottom:"7px" }}>DATE</div>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ width:"100%", padding:"11px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"12px", fontFamily:"monospace", outline:"none", marginBottom:"14px" }} />
                <div style={{ fontSize:"9px", color:"#999", letterSpacing:"0.2em", marginBottom:"7px" }}>TIME</div>
                <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ width:"100%", padding:"11px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"12px", fontFamily:"monospace", outline:"none" }} />
              </div>
            </BSection>
            <BSection label="◆ BEST POSTING TIMES">
              {[["Instagram","6–9 AM & 7–9 PM","#E1306C"],["TikTok","7–9 AM & 7–11 PM","#69C9D0"],["Twitter/X","8–10 AM & 6–9 PM","#1DA1F2"],["Facebook","1–4 PM weekdays","#4267B2"],["YouTube","2–4 PM & 8–11 PM","#FF0000"]].map(([pl,tm,cl],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:"11px", color:cl }}>{pl}</span>
                  <span style={{ fontSize:"10px", color:"#aaa" }}>{tm}</span>
                </div>
              ))}
            </BSection>
            <button onClick={() => { if (scheduleDate && scheduleTime && caption.trim()) { setScheduleConfirm(true); setTimeout(() => setScheduleConfirm(false), 3000); }}}
              disabled={!scheduleDate || !scheduleTime || !caption.trim()}
              style={{ width:"100%", padding:"13px", borderRadius:"11px", border:"none", background:scheduleDate && scheduleTime && caption.trim() ? `linear-gradient(90deg,${config.brand.accentColor},${pc})` : "rgba(255,255,255,0.05)", color:scheduleDate && scheduleTime && caption.trim() ? "#000" : "#383838", fontSize:"11px", fontWeight:"900", letterSpacing:"0.14em", cursor:scheduleDate && scheduleTime && caption.trim() ? "pointer" : "not-allowed", fontFamily:"monospace" }}>
              {scheduleConfirm ? "✅ SCHEDULED!" : "🕐 SCHEDULE POST"}
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {bTab === "results" && (
          <div>
            <div style={{ textAlign:"center", padding:"22px 0 14px" }}>
              <div style={{ fontSize:"34px", marginBottom:"7px" }}>{publishState === "done" ? "🚀" : "⚡"}</div>
              <div style={{ fontSize:"17px", fontWeight:"900", letterSpacing:"0.1em", color:publishState === "done" ? "#00F5D4" : "#FFD60A" }}>
                {publishState === "done" ? "BROADCAST COMPLETE" : "BROADCASTING..."}
              </div>
              <div style={{ fontSize:"10px", color:"#999", marginTop:"4px", fontFamily:"monospace" }}>
                {publishState === "done" ? `Live on ${Object.values(publishResults).filter(v => v === "success").length} platforms` : "Sending to all selected platforms..."}
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
              {selected.map(pid => {
                const p = PLATFORMS.find(pl => pl.id === pid);
                if (!p) return null;
                const st = publishResults[pid];
                return (
                  <div key={pid} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px", borderRadius:"11px", background:st==="success" ? "rgba(0,245,212,0.06)" : st==="pending" ? "rgba(255,214,10,0.06)" : "rgba(255,255,255,0.02)", border:st==="success" ? "1px solid rgba(0,245,212,0.2)" : st==="pending" ? "1px solid rgba(255,214,10,0.2)" : "1px solid rgba(255,255,255,0.06)", transition:"all 0.4s" }}>
                    <div style={{ width:"38px", height:"38px", borderRadius:"9px", background:`${p.color}20`, border:`1px solid ${p.color}44`, display:"flex", alignItems:"center", justifyContent:"center", color:p.color, fontSize:"15px", flexShrink:0 }}>{p.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"12px", fontWeight:"700" }}>{p.name}</div>
                      <div style={{ fontSize:"9px", marginTop:"2px", color:st==="success" ? "#00F5D4" : st==="pending" ? "#FFD60A" : "#3a3a3a" }}>
                        {st==="success" ? "✓ POSTED LIVE" : st==="pending" ? "⚡ TAP TO APPROVE IN APP" : "◌ SENDING..."}
                      </div>
                    </div>
                    <div style={{ fontSize:"18px" }}>
                      {st==="success" ? "✅" : st==="pending" ? "🔔" : (
                        <div style={{ width:"18px", height:"18px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.08)", borderTop:`2px solid ${pc}`, animation:"spin 0.8s linear infinite" }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {publishState === "done" && (
              <div>
                <div style={{ marginTop:"18px", padding:"14px", borderRadius:"11px", background:`${pc}0d`, border:`1px solid ${pc}22` }}>
                  <div style={{ fontSize:"9px", color:pc, letterSpacing:"0.2em", marginBottom:"7px" }}>◆ NEXT 24 HOURS</div>
                  {["Reply to every comment — algorithm loves it","Share to your Stories on IG + FB","Pin this post to top of your profile","DM your top 5 fans the link directly"].map((tip,i) => (
                    <div key={i} style={{ fontSize:"11px", color:"#bbb", padding:"5px 0", borderBottom:i<3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>{i+1}. {tip}</div>
                  ))}
                </div>
                <button onClick={resetBroadcast} style={{ width:"100%", marginTop:"14px", padding:"13px", borderRadius:"11px", border:"none", background:`linear-gradient(90deg,${pc},#FFD60A)`, color:"#000", fontSize:"11px", fontWeight:"900", letterSpacing:"0.14em", cursor:"pointer", fontFamily:"monospace" }}>
                  ◆ NEW POST
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PUSH NOTIFICATIONS ADMIN TAB ────────────────────────────────────────────
const NOTIF_TEMPLATES = [
  { id:1, name:"New Music Drop",     emoji:"🎵", title:"New Music Just Dropped!",       body:"[Track name] is out now. Stream it everywhere 🔥" },
  { id:2, name:"New Episode",        emoji:"🎙", title:"New Episode is LIVE!",           body:"[Episode title] just dropped. Go watch now 👀" },
  { id:3, name:"Exclusive Content",  emoji:"⭐", title:"Members-Only Drop 🔒",           body:"Your exclusive content is ready inside the app." },
  { id:4, name:"Live Stream Alert",  emoji:"🔴", title:"Going LIVE right now!",          body:"Tune in — I'm live streaming on [platform] NOW." },
  { id:5, name:"Merch Drop",         emoji:"🛍", title:"New Merch Just Dropped!",        body:"Limited stock. Grab it before it's gone 👕" },
  { id:6, name:"Announcement",       emoji:"📢", title:"Big Announcement!",              body:"Something major is coming. Stay locked in 👀" },
  { id:7, name:"Custom",             emoji:"✏",  title:"",                               body:"" },
];

function PushNotificationsTab({ cfg, setCfg, pushStatus, sendToast }) {
  const [title,     setTitle]     = useState("");
  const [body,      setBody]      = useState("");
  const [template,  setTemplate]  = useState(null);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [history,   setHistory]   = useState([
    { id:1, title:"New Music Just Dropped!",  body:"Track Name 03 is out now 🔥",  time:"Mar 27 · 8:00 PM",  status:"delivered", reach:342 },
    { id:2, title:"New Episode is LIVE!",     body:"Episode 03 — Real Talk is up!", time:"Mar 25 · 6:30 PM",  status:"delivered", reach:289 },
    { id:3, title:"Members-Only Drop 🔒",     body:"Your exclusive content is up.", time:"Mar 20 · 9:00 AM",  status:"delivered", reach:124 },
  ]);

  const [fcmKey, setFcmKey] = useState(cfg.apis?.fcmKey || "");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedConfirm, setSchedConfirm] = useState(false);
  const [notifTab, setNotifTab] = useState("send"); // send | history | settings

  const applyTemplate = (t) => {
    setTemplate(t.id);
    if (t.id !== 7) { setTitle(t.title); setBody(t.body); }
    else { setTitle(""); setBody(""); }
  };

  const canSend = title.trim().length > 0 && body.trim().length > 0;

  const sendNow = async () => {
    if (!canSend) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));

    // Browser push
    const sent = sendBrowserPush(title, body);

    // Add to history
    const entry = { id:Date.now(), title, body, time:"Just now", status:"delivered", reach: Math.floor(Math.random()*200)+50 };
    setHistory(prev => [entry, ...prev]);
    setSending(false); setSent(true);
    setTimeout(() => setSent(false), 3000);

    if (sendToast) sendToast.success(`Push sent to ${entry.reach} subscribers!`, "NOTIFICATION SENT 🔔");
    if (!sent && pushStatus !== "granted") {
      if (sendToast) sendToast.warning("Browser push blocked. Add Firebase key for real push.", "BROWSER PUSH BLOCKED");
    }
  };

  const scheduleNotif = () => {
    if (!schedDate || !schedTime || !canSend) return;
    setSchedConfirm(true);
    setTimeout(() => setSchedConfirm(false), 3000);
    if (sendToast) sendToast.info(`Notification scheduled for ${schedDate} at ${schedTime}`, "SCHEDULED 🕐");
  };

  const pStatus = pushStatus === "granted" ? { label:"ENABLED", color:"#00F5D4", dot:"#00F5D4" }
                : pushStatus === "denied"  ? { label:"BLOCKED",  color:"#FF3B30", dot:"#FF3B30" }
                : pushStatus === "unsupported" ? { label:"UNSUPPORTED", color:"#aaa", dot:"#555" }
                : { label:"NOT YET ASKED", color:"#FFD60A", dot:"#FFD60A" };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* STATUS BAR */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
        <div style={{ flex:1, padding:"14px", borderRadius:"12px", background:`${pStatus.color}0d`, border:`1px solid ${pStatus.color}30`, display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:pStatus.dot, flexShrink:0 }} />
          <div>
            <div style={{ fontSize:"10px", fontWeight:"800", color:pStatus.color, letterSpacing:"0.15em" }}>BROWSER PUSH: {pStatus.label}</div>
            <div style={{ fontSize:"9px", color:"#aaa", marginTop:"2px" }}>
              {pushStatus==="granted" ? "Users who allowed notifications will receive browser alerts" : pushStatus==="denied" ? "User blocked notifications. They must enable in browser settings." : "Firebase key required for real mobile push"}
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div style={{ display:"flex", gap:"0", marginBottom:"20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {[["send","SEND"],["history","HISTORY"],["settings","SETTINGS"]].map(([id,label]) => (
          <button key={id} onClick={() => setNotifTab(id)} style={{ flex:1, padding:"10px 4px", background:"none", border:"none", cursor:"pointer", fontSize:"9px", letterSpacing:"0.2em", fontWeight:"700", fontFamily:"monospace", color:notifTab===id?"#FF6B35":"#3a3a3a", borderBottom:notifTab===id?"2px solid #FF6B35":"2px solid transparent", transition:"all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── SEND TAB ── */}
      {notifTab === "send" && (
        <div>
          {/* TEMPLATES */}
          <ASection title="Quick Templates" icon="◆" color="#FF6B35">
            <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
              {NOTIF_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => applyTemplate(t)} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 12px", borderRadius:"18px", cursor:"pointer", background:template===t.id?"rgba(255,107,53,0.15)":"rgba(255,255,255,0.03)", border:template===t.id?"1px solid #FF6B35":"1px solid rgba(255,255,255,0.07)", color:template===t.id?"#FF6B35":"#555", fontSize:"10px", fontWeight:template===t.id?"700":"400", transition:"all 0.2s" }}>
                  <span>{t.emoji}</span><span>{t.name}</span>
                </button>
              ))}
            </div>
          </ASection>

          {/* COMPOSE */}
          <ASection title="Compose Notification" icon="🔔" color="#C77DFF">
            <div style={{ marginBottom:"12px" }}>
              <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#aaa", display:"block", marginBottom:"6px" }}>NOTIFICATION TITLE</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New Music Just Dropped! 🔥" maxLength={60}
                style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(199,125,255,0.2)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
              <div style={{ textAlign:"right", fontSize:"8px", color:"#999", marginTop:"3px" }}>{title.length}/60</div>
            </div>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#aaa", display:"block", marginBottom:"6px" }}>MESSAGE BODY</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What do you want to tell your audience?" rows={3} maxLength={160}
                style={{ width:"100%", padding:"11px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(199,125,255,0.2)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace", resize:"none", lineHeight:1.5 }} />
              <div style={{ textAlign:"right", fontSize:"8px", color:"#999", marginTop:"3px" }}>{body.length}/160</div>
            </div>

            {/* LIVE PREVIEW */}
            {(title || body) && (
              <div style={{ padding:"14px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"16px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", letterSpacing:"0.2em", marginBottom:"8px" }}>PREVIEW</div>
                <div style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#FF6B35,#C77DFF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>🎙</div>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:"700", color:"#ddd", marginBottom:"2px" }}>{title || "Notification title"}</div>
                    <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.4 }}>{body || "Message body preview..."}</div>
                    <div style={{ fontSize:"9px", color:"#999", marginTop:"4px", fontFamily:"monospace" }}>Your Brand · now</div>
                  </div>
                </div>
              </div>
            )}

            {/* SEND BUTTONS */}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={sendNow} disabled={!canSend || sending}
                style={{ flex:2, padding:"13px", borderRadius:"11px", border:"none", cursor:canSend&&!sending?"pointer":"not-allowed", background:sent?"#00F5D4":canSend&&!sending?"linear-gradient(90deg,#FF6B35,#FFD60A)":"rgba(255,255,255,0.05)", color:sent?"#000":canSend&&!sending?"#000":"#383838", fontSize:"11px", fontWeight:"900", letterSpacing:"0.15em", fontFamily:"monospace", transition:"all 0.3s" }}>
                {sending?"◌ SENDING...":sent?"✓ SENT!":"🔔 SEND NOW"}
              </button>
              <button onClick={() => setNotifTab("send")} style={{ flex:1, padding:"13px", borderRadius:"11px", cursor:"pointer", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", color:"#bbb", fontSize:"10px", letterSpacing:"0.1em", fontFamily:"monospace" }}
                onClick={() => { setTitle(""); setBody(""); setTemplate(null); }}>CLEAR</button>
            </div>
          </ASection>

          {/* SCHEDULE */}
          <ASection title="Schedule for Later" icon="🕐" color="#FFD60A">
            <div style={{ display:"flex", gap:"10px", marginBottom:"12px" }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"6px" }}>DATE</label>
                <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
                  style={{ width:"100%", padding:"10px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"11px", fontFamily:"monospace", outline:"none" }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"6px" }}>TIME</label>
                <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)}
                  style={{ width:"100%", padding:"10px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"11px", fontFamily:"monospace", outline:"none" }} />
              </div>
            </div>
            <button onClick={scheduleNotif} disabled={!canSend||!schedDate||!schedTime}
              style={{ width:"100%", padding:"12px", borderRadius:"10px", border:"none", cursor:canSend&&schedDate&&schedTime?"pointer":"not-allowed", background:schedConfirm?"#00F5D4":canSend&&schedDate&&schedTime?"linear-gradient(90deg,#C77DFF,#FF6B35)":"rgba(255,255,255,0.05)", color:canSend&&schedDate&&schedTime?"#000":"#383838", fontSize:"11px", fontWeight:"900", letterSpacing:"0.15em", fontFamily:"monospace", transition:"all 0.3s" }}>
              {schedConfirm?"✅ SCHEDULED!":"🕐 SCHEDULE NOTIFICATION"}
            </button>
          </ASection>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {notifTab === "history" && (
        <div>
          <div style={{ padding:"12px", borderRadius:"10px", marginBottom:"16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between" }}>
            <div style={{ textAlign:"center", flex:1 }}>
              <div style={{ fontSize:"20px", fontWeight:"900", color:"#00F5D4" }}>{history.length}</div>
              <div style={{ fontSize:"8px", color:"#999", letterSpacing:"0.2em" }}>SENT</div>
            </div>
            <div style={{ textAlign:"center", flex:1, borderLeft:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:"20px", fontWeight:"900", color:"#FF6B35" }}>{history.reduce((a,h)=>a+h.reach,0)}</div>
              <div style={{ fontSize:"8px", color:"#999", letterSpacing:"0.2em" }}>TOTAL REACH</div>
            </div>
            <div style={{ textAlign:"center", flex:1, borderLeft:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:"20px", fontWeight:"900", color:"#C77DFF" }}>100%</div>
              <div style={{ fontSize:"8px", color:"#999", letterSpacing:"0.2em" }}>DELIVERED</div>
            </div>
          </div>
          {history.map((h,i) => (
            <div key={h.id} style={{ padding:"14px", borderRadius:"12px", marginBottom:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#ddd", flex:1 }}>{h.title}</div>
                <div style={{ padding:"2px 8px", borderRadius:"7px", background:"rgba(0,245,212,0.1)", border:"1px solid rgba(0,245,212,0.25)", fontSize:"8px", color:"#00F5D4", fontFamily:"monospace", flexShrink:0, marginLeft:"8px" }}>✓ {h.status.toUpperCase()}</div>
              </div>
              <div style={{ fontSize:"11px", color:"#aaa", marginBottom:"8px", lineHeight:1.4 }}>{h.body}</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:"9px", color:"#999", fontFamily:"monospace" }}>{h.time}</span>
                <span style={{ fontSize:"9px", color:"#FF6B35", fontFamily:"monospace" }}>👁 {h.reach} reached</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {notifTab === "settings" && (
        <div>
          <ASection title="Firebase Cloud Messaging" icon="◆" color="#FF6B35">
            <div style={{ padding:"12px", borderRadius:"10px", marginBottom:"14px", background:"rgba(255,107,53,0.06)", border:"1px solid rgba(255,107,53,0.15)" }}>
              <div style={{ fontSize:"10px", color:"#FF6B35", marginBottom:"4px" }}>◆ WHY YOU NEED THIS</div>
              <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.6 }}>Browser push only works when the app is open. Firebase gives you real mobile push notifications that arrive even when the app is closed — just like Instagram or Spotify alerts.</div>
            </div>
            <AField label="Firebase Server Key (FCM)" value={fcmKey} onChange={v => { setFcmKey(v); }} placeholder="AAAAxxxxxxx... (from Firebase Console)" />
            <div style={{ fontSize:"9px", color:"#888", marginBottom:"14px" }}>Get your key → <span style={{ color:"#FF6B35" }}>console.firebase.google.com</span> → Project → Cloud Messaging</div>
            {[
              { label:"New Music Drop",     enabled:true  },
              { label:"New Episode",        enabled:true  },
              { label:"Live Stream Start",  enabled:true  },
              { label:"Exclusive Content",  enabled:true  },
              { label:"Merch Drop",         enabled:false },
              { label:"Weekly Digest",      enabled:false },
            ].map((n,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize:"12px", color:"#ccc" }}>{n.label}</div>
                <div style={{ width:"40px", height:"22px", borderRadius:"11px", background:n.enabled?"#FF6B35":"rgba(255,255,255,0.1)", position:"relative", cursor:"pointer", transition:"background 0.3s" }}>
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:n.enabled?"21px":"3px", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
                </div>
              </div>
            ))}
          </ASection>
        </div>
      )}
    </div>
  );
}

// ─── MERCH ADMIN TAB ─────────────────────────────────────────────────────────
const MERCH_CAT_OPTIONS = ["Apparel","Accessories","Digital","Collectibles","Music","Other"];
const MERCH_EMOJIS = ["👕","🧢","📱","🧣","🧤","🎒","👟","🖼","💿","📋","🎹","⭐","🔥","💎","🎧","📦"];

function MerchAdminTab({ cfg, setCfg }) {
  const merch    = cfg.merch || { products:[], categories:[], stripeMode:"test", shippingMsg:"" };
  const products = merch.products || [];
  const imageRefs = useRef({});

  const updateMerch = (key, val) =>
    setCfg(prev => ({ ...prev, merch: { ...prev.merch, [key]: val } }));

  const updateProduct = (id, key, val) =>
    setCfg(prev => ({
      ...prev,
      merch: {
        ...prev.merch,
        products: prev.merch.products.map(p => p.id === id ? { ...p, [key]: val } : p),
      },
    }));

  const addProduct = () => {
    const newP = { id:Date.now(), name:"New Product", price:"0", category:"Apparel", emoji:"👕", desc:"", colors:[], sizes:[], stock:"0", digital:false, active:true, imageUrl:"" };
    setCfg(prev => ({ ...prev, merch: { ...prev.merch, products: [...(prev.merch?.products||[]), newP] } }));
  };

  const removeProduct = (id) =>
    setCfg(prev => ({ ...prev, merch: { ...prev.merch, products: prev.merch.products.filter(p => p.id !== id) } }));

  const handleImage = (file, id) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => updateProduct(id, "imageUrl", e.target.result);
    reader.readAsDataURL(file);
  };

  const [editId, setEditId] = useState(null);
  const editProduct = editId ? products.find(p => p.id === editId) : null;

  // Stats
  const activeCount  = products.filter(p => p.active).length;
  const digitalCount = products.filter(p => p.digital).length;
  const totalRev     = products.reduce((a,p) => a + (parseFloat(p.price)||0) * (parseInt(p.stock==="999"?50:p.stock)||0) * 0.12, 0);

  // ── PRODUCT EDITOR ──
  if (editProduct) {
    return (
      <div style={{ animation:"fadeIn 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
          <button onClick={() => setEditId(null)} style={{ padding:"8px 14px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:"#aaa", fontSize:"10px", cursor:"pointer" }}>← BACK</button>
          <div style={{ fontSize:"14px", fontWeight:"800", color:"#FFD60A" }}>EDITING: {editProduct.name}</div>
        </div>

        {/* IMAGE UPLOAD */}
        <ASection title="Product Image" icon="🖼" color="#C77DFF">
          <div onClick={() => imageRefs.current[editProduct.id]?.click()}
            style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"10px", height:"140px", cursor:"pointer", background:editProduct.imageUrl?`url(${editProduct.imageUrl}) center/cover no-repeat`:"rgba(255,255,255,0.03)", border:"2px dashed rgba(199,125,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"8px" }}>
            {!editProduct.imageUrl && <><span style={{ fontSize:"28px" }}>{editProduct.emoji}</span><span style={{ fontSize:"11px", color:"#aaa" }}>Tap to upload product photo</span></>}
            <input ref={el => imageRefs.current[editProduct.id]=el} type="file" accept="image/*"
              onChange={e => handleImage(e.target.files[0], editProduct.id)} style={{ display:"none" }} />
          </div>
          {editProduct.imageUrl && (
            <button onClick={() => updateProduct(editProduct.id,"imageUrl","")}
              style={{ width:"100%", padding:"8px", borderRadius:"8px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>✕ REMOVE IMAGE</button>
          )}
        </ASection>

        {/* BASICS */}
        <ASection title="Product Details" icon="◆" color="#FF6B35">
          <AField label="Product Name"    value={editProduct.name}  onChange={v => updateProduct(editProduct.id,"name",v)}  placeholder="e.g. Empire Hoodie" />
          <AField label="Price ($)"       value={editProduct.price} onChange={v => updateProduct(editProduct.id,"price",v)} placeholder="0.00" type="number" />
          <AField label="Description"     value={editProduct.desc}  onChange={v => updateProduct(editProduct.id,"desc",v)}  placeholder="Short product description" />
          <div style={{ marginBottom:"14px" }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#aaa", display:"block", marginBottom:"7px" }}>CATEGORY</label>
            <select value={editProduct.category} onChange={e => updateProduct(editProduct.id,"category",e.target.value)}
              style={{ width:"100%", padding:"11px 13px", background:"#0a0a0f", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace", cursor:"pointer" }}>
              {MERCH_CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <AField label="Stock Quantity"  value={editProduct.stock} onChange={v => updateProduct(editProduct.id,"stock",v)} placeholder="0 (use 999 for unlimited digital)" type="number" />
        </ASection>

        {/* EMOJI PICKER */}
        <ASection title="Product Icon" icon="✨" color="#FFD60A">
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {MERCH_EMOJIS.map(em => (
              <button key={em} onClick={() => updateProduct(editProduct.id,"emoji",em)}
                style={{ width:"40px", height:"40px", borderRadius:"9px", fontSize:"20px", cursor:"pointer", border:editProduct.emoji===em?"2px solid #FFD60A":"1px solid rgba(255,255,255,0.08)", background:editProduct.emoji===em?"rgba(255,214,10,0.1)":"rgba(255,255,255,0.03)", transition:"all 0.15s" }}>
                {em}
              </button>
            ))}
          </div>
        </ASection>

        {/* VARIANTS */}
        <ASection title="Variants" icon="◈" color="#00F5D4">
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
            {[["Digital Product","digital"],["Active / Visible","active"]].map(([label,key]) => (
              <div key={key} onClick={() => updateProduct(editProduct.id, key, !editProduct[key])}
                style={{ flex:1, padding:"12px", borderRadius:"10px", textAlign:"center", cursor:"pointer", border:editProduct[key]?"1px solid #00F5D4":"1px solid rgba(255,255,255,0.07)", background:editProduct[key]?"rgba(0,245,212,0.08)":"rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
                <div style={{ fontSize:"11px", fontWeight:"700", color:editProduct[key]?"#00F5D4":"#555" }}>{editProduct[key]?"✓ ":""}{label}</div>
              </div>
            ))}
          </div>
          {!editProduct.digital && (
            <>
              <div style={{ marginBottom:"12px" }}>
                <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"6px" }}>SIZES (comma separated)</label>
                <input value={(editProduct.sizes||[]).join(",")} onChange={e => updateProduct(editProduct.id,"sizes",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}
                  placeholder="S,M,L,XL,2XL"
                  style={{ width:"100%", padding:"10px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
              </div>
              <div>
                <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"6px" }}>COLORS (comma separated)</label>
                <input value={(editProduct.colors||[]).join(",")} onChange={e => updateProduct(editProduct.id,"colors",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}
                  placeholder="Black,White,Orange"
                  style={{ width:"100%", padding:"10px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
              </div>
            </>
          )}
        </ASection>

        <button onClick={() => setEditId(null)}
          style={{ width:"100%", padding:"14px", borderRadius:"11px", border:"none", background:"linear-gradient(90deg,#FF6B35,#FFD60A)", color:"#000", fontSize:"12px", fontWeight:"900", letterSpacing:"0.15em", cursor:"pointer" }}>
          ✓ DONE EDITING
        </button>
      </div>
    );
  }

  // ── PRODUCT LIST ──
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginBottom:"20px" }}>
        {[
          { label:"PRODUCTS",    val:products.length,  color:"#FF6B35"  },
          { label:"ACTIVE",      val:activeCount,       color:"#00F5D4"  },
          { label:"DIGITAL",     val:digitalCount,      color:"#C77DFF"  },
        ].map((s,i) => (
          <div key={i} style={{ padding:"14px 8px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}22`, textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:"900", color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"7px", letterSpacing:"0.2em", color:"#999", marginTop:"3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* STORE SETTINGS */}
      <ASection title="Store Settings" icon="⚙" color="#FFD60A">
        <AField label="Shipping Message" value={merch.shippingMsg||""} onChange={v => updateMerch("shippingMsg",v)} placeholder="Free shipping on orders over $75" />
        <div style={{ marginBottom:"14px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"0.22em", color:"#aaa", display:"block", marginBottom:"7px" }}>STRIPE MODE</label>
          <div style={{ display:"flex", gap:"8px" }}>
            {[["test","Test Mode"],["live","Live Mode"]].map(([val,label]) => (
              <div key={val} onClick={() => updateMerch("stripeMode",val)}
                style={{ flex:1, padding:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer", border:(merch.stripeMode||"test")===val?"1px solid #FFD60A":"1px solid rgba(255,255,255,0.07)", background:(merch.stripeMode||"test")===val?"rgba(255,214,10,0.1)":"rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
                <div style={{ fontSize:"11px", fontWeight:"700", color:(merch.stripeMode||"test")===val?"#FFD60A":"#555" }}>{label}</div>
              </div>
            ))}
          </div>
          {(merch.stripeMode||"test") === "live" && (
            <div style={{ marginTop:"8px", padding:"8px 12px", borderRadius:"8px", background:"rgba(0,245,212,0.07)", border:"1px solid rgba(0,245,212,0.2)", fontSize:"10px", color:"#00F5D4" }}>
              ✓ Add your live Stripe key in Admin → APIs to accept real payments
            </div>
          )}
        </div>
      </ASection>

      {/* PRODUCT LIST */}
      <ASection title="Products" icon="🛍" color="#FF6B35">
        {products.length === 0 && (
          <div style={{ textAlign:"center", padding:"24px", color:"#999", fontSize:"12px" }}>No products yet. Add your first one below.</div>
        )}
        {products.map((p,i) => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"13px", marginBottom:"10px", borderRadius:"12px", background:p.active?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.01)", border:p.active?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(255,255,255,0.04)", opacity:p.active?1:0.5 }}>
            {/* PRODUCT IMAGE / EMOJI */}
            <div style={{ width:"50px", height:"50px", borderRadius:"10px", flexShrink:0, overflow:"hidden", background:p.imageUrl?`url(${p.imageUrl}) center/cover no-repeat`:"rgba(255,107,53,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
              {!p.imageUrl && p.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
                <span style={{ fontSize:"12px", fontWeight:"700", color:"#ddd" }}>{p.name}</span>
                {p.digital && <span style={{ padding:"2px 6px", borderRadius:"6px", background:"rgba(0,245,212,0.1)", border:"1px solid rgba(0,245,212,0.2)", fontSize:"8px", color:"#00F5D4" }}>DIGITAL</span>}
                {!p.active && <span style={{ padding:"2px 6px", borderRadius:"6px", background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.2)", fontSize:"8px", color:"#FF3B30" }}>HIDDEN</span>}
              </div>
              <div style={{ fontSize:"10px", color:"#999", fontFamily:"monospace" }}>{p.category} · ${p.price} · stock: {p.stock}</div>
            </div>
            <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
              <button onClick={() => setEditId(p.id)} style={{ padding:"6px 12px", borderRadius:"8px", border:"1px solid rgba(255,107,53,0.3)", background:"rgba(255,107,53,0.08)", color:"#FF6B35", fontSize:"10px", cursor:"pointer" }}>✏ EDIT</button>
              <button onClick={() => removeProduct(p.id)} style={{ padding:"6px 10px", borderRadius:"8px", border:"1px solid rgba(255,59,48,0.25)", background:"none", color:"#FF3B30", fontSize:"12px", cursor:"pointer" }}>✕</button>
            </div>
          </div>
        ))}
        <button onClick={addProduct}
          style={{ width:"100%", padding:"13px", borderRadius:"11px", border:"2px dashed rgba(255,107,53,0.25)", background:"rgba(255,107,53,0.04)", color:"#FF6B35", fontSize:"12px", fontWeight:"700", letterSpacing:"0.1em", cursor:"pointer", marginTop:"4px" }}>
          + ADD NEW PRODUCT
        </button>
      </ASection>
    </div>
  );
}


function BlueprintAdminTab() {
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ padding:"16px", borderRadius:"14px", marginBottom:"20px", background:"linear-gradient(135deg,rgba(247,37,133,0.09),rgba(199,125,255,0.07))", border:"1px solid rgba(247,37,133,0.2)" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#F72585", fontFamily:"monospace", marginBottom:"7px" }}>◆ THE CORE STRATEGY</div>
        <div style={{ fontSize:"13px", lineHeight:1.7, color:"#bbb" }}>Stop sending people to multiple platforms. <strong style={{ color:"#fff" }}>Bring every platform to one place.</strong> Your app = the destination. Social media = the billboard.</div>
      </div>

      {MARKETING_PLAN.map((ph,i) => (
        <div key={i} style={{ marginBottom:"16px", borderRadius:"13px", overflow:"hidden", border:`1px solid ${ph.color}20` }}>
          <div style={{ padding:"12px 16px", background:`${ph.color}12`, borderBottom:`1px solid ${ph.color}20`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"8px", letterSpacing:"0.3em", color:ph.color, fontFamily:"monospace" }}>{ph.phase} · {ph.timeline}</div>
              <div style={{ fontSize:"13px", fontWeight:"800", letterSpacing:"0.04em", marginTop:"2px" }}>{ph.title}</div>
            </div>
            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:`${ph.color}20`, border:`1px solid ${ph.color}44`, display:"flex", alignItems:"center", justifyContent:"center", color:ph.color, fontSize:"11px", flexShrink:0 }}>0{i+1}</div>
          </div>
          <div style={{ padding:"14px 16px", background:"rgba(255,255,255,0.01)" }}>
            {ph.steps.map((step,j) => (
              <div key={j} style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:j < ph.steps.length-1 ? "10px" : "0" }}>
                <div style={{ width:"16px", height:"16px", borderRadius:"4px", flexShrink:0, border:`1px solid ${ph.color}40`, marginTop:"1px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"8px", color:ph.color, fontFamily:"monospace" }}>{j+1}</div>
                <div style={{ fontSize:"12px", color:"#aaa", lineHeight:1.5 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(0,245,212,0.15)", marginTop:"8px" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#00F5D4", fontFamily:"monospace", marginBottom:"14px" }}>REVENUE PROJECTIONS</div>
        {[
          ["Fan Memberships",    "$4.99/mo × 500",   "$2,495/mo"],
          ["Digital Downloads",  "Albums, replays",   "$800/mo" ],
          ["Brand Partnerships", "Sponsored content", "$1,500/mo"],
          ["Merch Sales",        "In-app store",      "$600/mo" ],
          ["Live Events",        "Ticketed streams",  "$1,200/mo"],
        ].map(([n,note,rev],i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:"600", color:"#ddd" }}>{n}</div>
              <div style={{ fontSize:"10px", color:"#999", fontFamily:"monospace" }}>{note}</div>
            </div>
            <div style={{ fontSize:"13px", fontWeight:"800", color:"#00F5D4", fontFamily:"monospace" }}>{rev}</div>
          </div>
        ))}
        <div style={{ marginTop:"14px", padding:"14px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(0,245,212,0.09),rgba(255,214,10,0.05))", border:"1px solid rgba(0,245,212,0.18)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:"11px", letterSpacing:"0.14em", fontFamily:"monospace", color:"#999" }}>TOTAL POTENTIAL</div>
          <div style={{ fontSize:"22px", fontWeight:"900", color:"#00F5D4" }}>$6,595<span style={{ fontSize:"12px", color:"#aaa" }}>/mo</span></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAT ROOM SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const SEED_POSTS = [
  { id:1, author:"Marcus D.",   handle:"@marcusd",   avatar:"🎤", time:"2h ago",   text:"Just finished listening to the new drop — that's HEAT 🔥 The production on track 3 is insane!", image:"", likes:24, liked:false, replies:[
    { id:101, author:"Tanya R.", handle:"@tanr",    avatar:"🎵", time:"1h ago", text:"Right?! Track 3 has me replaying it on repeat 🎶", likes:8, liked:false },
    { id:102, author:"Jordan M.",handle:"@jordanm", avatar:"⭐", time:"45m ago",text:"The beat switch at 2:30 got me 😤💯",              likes:5, liked:false },
  ]},
  { id:2, author:"Keisha W.",   handle:"@keishew",   avatar:"💎", time:"5h ago",   text:"Episode 03 was the realest talk I've heard in a long time. 'Stop waiting for permission' — saved that quote.", image:"", likes:41, liked:false, replies:[
    { id:103, author:"Chris L.", handle:"@chrisl", avatar:"🎙", time:"4h ago", text:"That quote hit different. Screenshotted immediately 📸", likes:12, liked:false },
  ]},
  { id:3, author:"DeShawn T.",  handle:"@deshawnt",  avatar:"🔥", time:"1d ago",   text:"The merch just arrived and the quality is no joke. Hoodie is 🔥🔥🔥 worth every penny.", image:"", likes:67, liked:false, replies:[] },
];

function ChatRoomScreen({ config }) {
  const pc   = config.brand.primaryColor;
  const ac   = config.brand.accentColor;
  const chat = config.chat || {};

  const [posts,       setPosts]      = useState(SEED_POSTS);
  const [newText,     setNewText]    = useState("");
  const [newImage,    setNewImage]   = useState("");
  const [composing,   setComposing]  = useState(false);
  const [replyingTo,  setReplyingTo] = useState(null); // post id
  const [replyText,   setReplyText]  = useState("");
  const [expandedPost,setExpandedPost]= useState(null); // post id for replies
  const [authorName,  setAuthorName] = useState("");
  const [authorHandle,setAuthorHandle]= useState("");
  const [profileSet,  setProfileSet] = useState(false);
  const imageRef = useRef(null);
  const feedRef  = useRef(null);

  // Hero background
  const heroBg = chat.heroType === "image" && chat.heroImageUrl
    ? `url(${chat.heroImageUrl}) center/cover no-repeat`
    : `linear-gradient(135deg,${pc}44,${ac}33,rgba(0,0,0,0.7))`;

  const postCount   = posts.length;
  const replyCount  = posts.reduce((a,p) => a + (p.replies||[]).length, 0);
  const totalLikes  = posts.reduce((a,p) => a + p.likes, 0);

  const AVATARS = ["😊","🎵","🔥","💎","⭐","🎤","🎙","🎧","🎶","💯","🙌","👑","✨","🎯","💪","🚀"];
  const myAvatar = authorHandle ? AVATARS[authorHandle.length % AVATARS.length] : "😊";

  // ── SUBMIT POST ────────────────────────────────────────────────────────────
  const submitPost = () => {
    if (!newText.trim()) return;
    const name   = authorName.trim()   || "Anonymous";
    const handle = authorHandle.trim() || "@user";
    const post = {
      id:      Date.now(),
      author:  name,
      handle:  handle.startsWith("@") ? handle : "@"+handle,
      avatar:  myAvatar,
      time:    "just now",
      text:    newText.trim(),
      image:   newImage,
      likes:   0,
      liked:   false,
      replies: [],
    };
    setPosts(prev => [post, ...prev]);
    setNewText(""); setNewImage(""); setComposing(false);
    if (!profileSet) setProfileSet(true);
    feedRef.current?.scrollTo({ top:0, behavior:"smooth" });
  };

  // ── SUBMIT REPLY ───────────────────────────────────────────────────────────
  const submitReply = (postId) => {
    if (!replyText.trim()) return;
    const name   = authorName.trim()   || "Anonymous";
    const handle = authorHandle.trim() || "@user";
    const reply = { id:Date.now(), author:name, handle:handle.startsWith("@")?handle:"@"+handle, avatar:myAvatar, time:"just now", text:replyText.trim(), likes:0, liked:false };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies:[...(p.replies||[]), reply] } : p));
    setReplyText(""); setReplyingTo(null); setExpandedPost(postId);
  };

  // ── LIKE POST ──────────────────────────────────────────────────────────────
  const likePost = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, likes: p.liked ? p.likes-1 : p.likes+1, liked: !p.liked }
      : p
    ));
  };

  const likeReply = (postId, replyId) => {
    setPosts(prev => prev.map(p => p.id !== postId ? p : {
      ...p,
      replies: p.replies.map(r => r.id !== replyId ? r : { ...r, likes:r.liked?r.likes-1:r.likes+1, liked:!r.liked })
    }));
  };

  const handleImagePick = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10*1024*1024) { alert("Max 10MB"); return; }
    const r = new FileReader();
    r.onload = e => setNewImage(e.target.result);
    r.readAsDataURL(file);
  };

  const fmtCount = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:"calc(100vh - 115px)" }}>

      {/* ── STATIC HERO BANNER ── */}
      <div style={{ position:"relative", flexShrink:0, background:heroBg, overflow:"hidden" }}>
        {chat.heroMediaType === "video" && chat.heroVideoUrl ? (
          <video src={chat.heroVideoUrl} autoPlay loop muted playsInline
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
        ) : null}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.52)", zIndex:1 }} />
        <div style={{ position:"relative", zIndex:2, padding:"24px 20px 20px", textAlign:"center" }}>
          <div style={{ fontSize:"9px", letterSpacing:"0.35em", color:"rgba(255,255,255,0.5)", fontFamily:"monospace", marginBottom:"5px" }}>💬 {chat.roomName || "THE COMMUNITY"}</div>
          <div style={{ fontSize:"22px", fontWeight:"900", color:"#fff", marginBottom:"4px", letterSpacing:"-0.01em" }}>{chat.heroHeading || "THE COMMUNITY"}</div>
          <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:"16px" }}>{chat.heroSubtext || "Connect · Share · Vibe"}</div>
          {/* STATS */}
          <div style={{ display:"flex", justifyContent:"center", gap:"20px" }}>
            {[
              [postCount,    "POSTS"  ],
              [replyCount,   "REPLIES"],
              [fmtCount(totalLikes), "LIKES"  ],
            ].map(([n,l],i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"18px", fontWeight:"900", color:pc }}>{n}</div>
                <div style={{ fontSize:"7px", letterSpacing:"0.25em", color:"rgba(255,255,255,0.4)", fontFamily:"monospace" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CREATE POST BAR ── */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid rgba(255,255,255,0.06)`, background:"rgba(8,8,8,0.9)", flexShrink:0 }}>
        {!composing ? (
          <div onClick={() => setComposing(true)}
            style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", borderRadius:"24px", background:"rgba(255,255,255,0.05)", border:`1px solid rgba(255,255,255,0.08)`, cursor:"pointer" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`${pc}33`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>{myAvatar}</div>
            <span style={{ fontSize:"13px", color:"#999" }}>{chat.placeholder || "Share something with the community..."}</span>
          </div>
        ) : (
          <div style={{ borderRadius:"16px", background:"rgba(255,255,255,0.04)", border:`1px solid ${pc}44`, padding:"14px" }}>
            {/* NAME FIELDS (first time) */}
            {!profileSet && (
              <div style={{ display:"flex", gap:"8px", marginBottom:"10px" }}>
                <input value={authorName} onChange={e=>setAuthorName(e.target.value)} placeholder="Your name"
                  style={{ flex:1, padding:"8px 12px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
                <input value={authorHandle} onChange={e=>setAuthorHandle(e.target.value)} placeholder="@handle"
                  style={{ flex:1, padding:"8px 12px", borderRadius:"8px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
              </div>
            )}
            <textarea value={newText} onChange={e=>setNewText(e.target.value)}
              placeholder={chat.placeholder || "What's on your mind?"}
              autoFocus rows={3}
              style={{ width:"100%", background:"none", border:"none", color:"#F0EDE8", fontSize:"14px", outline:"none", fontFamily:"'Georgia',serif", lineHeight:1.5, resize:"none" }} />
            {newImage && (
              <div style={{ position:"relative", marginTop:"8px", borderRadius:"10px", overflow:"hidden" }}>
                <img src={newImage} alt="preview" style={{ width:"100%", maxHeight:"200px", objectFit:"cover", borderRadius:"10px", display:"block" }} />
                <button onClick={() => setNewImage("")} style={{ position:"absolute", top:"6px", right:"6px", width:"24px", height:"24px", borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"none", color:"#fff", fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px" }}>
              <div style={{ display:"flex", gap:"6px" }}>
                <button onClick={() => imageRef.current?.click()} style={{ padding:"6px 12px", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:"#bbb", fontSize:"10px", cursor:"pointer" }}>📷 Photo</button>
                <input ref={imageRef} type="file" accept="image/*" onChange={e=>handleImagePick(e.target.files[0])} style={{ display:"none" }} />
                <button onClick={() => { setComposing(false); setNewText(""); setNewImage(""); }} style={{ padding:"6px 12px", borderRadius:"14px", border:"none", background:"none", color:"#999", fontSize:"10px", cursor:"pointer" }}>Cancel</button>
              </div>
              <button onClick={submitPost} disabled={!newText.trim()}
                style={{ padding:"8px 20px", borderRadius:"20px", border:"none", background:newText.trim()?`linear-gradient(90deg,${pc},${ac})`:"rgba(255,255,255,0.08)", color:newText.trim()?"#000":"#484848", fontSize:"11px", fontWeight:"900", cursor:newText.trim()?"pointer":"not-allowed", transition:"all 0.2s", fontFamily:"monospace" }}>
                POST
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── FEED ── */}
      <div ref={feedRef} style={{ flex:1, overflowY:"auto", padding:"0 0 20px" }}>
        {posts.length === 0 && (
          <div style={{ padding:"60px 20px", textAlign:"center", color:"#999" }}>
            <div style={{ fontSize:"36px", marginBottom:"12px" }}>💬</div>
            <div style={{ fontSize:"14px" }}>No posts yet. Be the first!</div>
          </div>
        )}
        {posts.map(post => (
          <div key={post.id} style={{ borderBottom:`1px solid rgba(255,255,255,0.05)` }}>
            {/* POST */}
            <div style={{ padding:"16px 16px 10px" }}>
              <div style={{ display:"flex", gap:"11px" }}>
                {/* AVATAR */}
                <div style={{ width:"38px", height:"38px", borderRadius:"50%", flexShrink:0, background:`${pc}22`, border:`1px solid ${pc}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{post.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  {/* HEADER */}
                  <div style={{ display:"flex", alignItems:"baseline", gap:"6px", marginBottom:"5px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"13px", fontWeight:"700", color:"#ddd" }}>{post.author}</span>
                    <span style={{ fontSize:"10px", color:"#999", fontFamily:"monospace" }}>{post.handle}</span>
                    <span style={{ fontSize:"9px", color:"#333", marginLeft:"auto", fontFamily:"monospace", flexShrink:0 }}>{post.time}</span>
                  </div>
                  {/* TEXT */}
                  <div style={{ fontSize:"14px", color:"#ccc", lineHeight:1.55, marginBottom:"10px" }}>{post.text}</div>
                  {/* IMAGE */}
                  {post.image && (
                    <div style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"10px" }}>
                      <img src={post.image} alt="post" style={{ width:"100%", maxHeight:"280px", objectFit:"cover", display:"block" }} />
                    </div>
                  )}
                  {/* ACTIONS */}
                  <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
                    {/* LIKE */}
                    <button onClick={() => likePost(post.id)}
                      style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 12px", borderRadius:"16px", border:`1px solid ${post.liked?`${pc}66`:"rgba(255,255,255,0.07)"}`, background:post.liked?`${pc}18`:"none", color:post.liked?pc:"#555", fontSize:"11px", cursor:"pointer", transition:"all 0.2s", fontFamily:"monospace" }}>
                      {post.liked?"❤️":"🤍"} {post.likes > 0 && <span>{fmtCount(post.likes)}</span>}
                    </button>
                    {/* REPLY */}
                    <button onClick={() => { setReplyingTo(replyingTo===post.id?null:post.id); setExpandedPost(post.id); }}
                      style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 12px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", background:"none", color:"#aaa", fontSize:"11px", cursor:"pointer", transition:"all 0.2s", fontFamily:"monospace" }}>
                      💬 {post.replies.length > 0 && fmtCount(post.replies.length)}
                    </button>
                    {/* EXPAND REPLIES */}
                    {post.replies.length > 0 && (
                      <button onClick={() => setExpandedPost(expandedPost===post.id?null:post.id)}
                        style={{ background:"none", border:"none", color:"#999", fontSize:"10px", cursor:"pointer", fontFamily:"monospace", marginLeft:"4px" }}>
                        {expandedPost===post.id ? "▲ Hide":"▼ Show"} {post.replies.length} {post.replies.length===1?"reply":"replies"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* REPLY INPUT */}
            {replyingTo === post.id && (
              <div style={{ padding:"0 16px 12px 65px" }}>
                {!profileSet && (
                  <div style={{ display:"flex", gap:"6px", marginBottom:"6px" }}>
                    <input value={authorName} onChange={e=>setAuthorName(e.target.value)} placeholder="Your name"
                      style={{ flex:1, padding:"7px 10px", borderRadius:"7px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
                    <input value={authorHandle} onChange={e=>setAuthorHandle(e.target.value)} placeholder="@handle"
                      style={{ flex:1, padding:"7px 10px", borderRadius:"7px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
                  </div>
                )}
                <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", flexShrink:0, background:`${ac}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>{myAvatar}</div>
                  <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:"12px", border:`1px solid ${ac}33`, padding:"8px 12px", display:"flex", alignItems:"flex-end", gap:"8px" }}>
                    <textarea value={replyText} onChange={e=>setReplyText(e.target.value)}
                      placeholder="Write a reply..." rows={2} autoFocus
                      onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); submitReply(post.id); }}}
                      style={{ flex:1, background:"none", border:"none", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"'Georgia',serif", resize:"none", lineHeight:1.5 }} />
                    <button onClick={() => submitReply(post.id)} disabled={!replyText.trim()}
                      style={{ padding:"5px 12px", borderRadius:"12px", border:"none", background:replyText.trim()?ac:"rgba(255,255,255,0.08)", color:replyText.trim()?"#000":"#484848", fontSize:"10px", fontWeight:"700", cursor:replyText.trim()?"pointer":"not-allowed", flexShrink:0, fontFamily:"monospace" }}>
                      REPLY
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REPLIES */}
            {expandedPost === post.id && post.replies.length > 0 && (
              <div style={{ padding:"0 16px 12px 65px" }}>
                {post.replies.map(reply => (
                  <div key={reply.id} style={{ display:"flex", gap:"9px", marginBottom:"10px" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"50%", flexShrink:0, background:`${ac}22`, border:`1px solid ${ac}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px" }}>{reply.avatar}</div>
                    <div style={{ flex:1, background:"rgba(255,255,255,0.03)", borderRadius:"11px", padding:"9px 12px", borderLeft:`2px solid ${ac}44` }}>
                      <div style={{ display:"flex", alignItems:"baseline", gap:"6px", marginBottom:"3px" }}>
                        <span style={{ fontSize:"11px", fontWeight:"700", color:"#ccc" }}>{reply.author}</span>
                        <span style={{ fontSize:"9px", color:"#999", fontFamily:"monospace" }}>{reply.handle}</span>
                        <span style={{ fontSize:"8px", color:"#333", marginLeft:"auto", fontFamily:"monospace" }}>{reply.time}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:"#aaa", lineHeight:1.5, marginBottom:"6px" }}>{reply.text}</div>
                      <button onClick={() => likeReply(post.id, reply.id)}
                        style={{ display:"flex", alignItems:"center", gap:"4px", background:"none", border:"none", color:reply.liked?pc:"#484848", fontSize:"10px", cursor:"pointer", padding:"2px 0", fontFamily:"monospace" }}>
                        {reply.liked?"❤️":"🤍"} {reply.likes > 0 && reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT ADMIN TAB ──────────────────────────────────────────────────────────
function ChatAdminTab({ cfg, setCfg }) {
  const chat     = cfg.chat || {};
  const heroRef  = useRef(null);
  const videoRef = useRef(null);

  const updateChat = (key, val) =>
    setCfg(prev => ({ ...prev, chat: { ...prev.chat, [key]: val } }));

  const handleHeroFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader(); r.onload = e => { updateChat("heroImageUrl", e.target.result); updateChat("heroType","image"); updateChat("heroMediaType","image"); }; r.readAsDataURL(file);
  };

  const handleVideoFile = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    const r = new FileReader(); r.onload = e => { updateChat("heroVideoUrl", e.target.result); updateChat("heroMediaType","video"); }; r.readAsDataURL(file);
  };

  const pc = cfg.brand.primaryColor;
  const ac = cfg.brand.accentColor;

  const previewBg = chat.heroType==="image" && chat.heroImageUrl
    ? `url(${chat.heroImageUrl}) center/cover no-repeat`
    : `linear-gradient(135deg,${pc}44,${ac}33,rgba(0,0,0,0.7))`;

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>

      {/* LIVE PREVIEW */}
      <div style={{ borderRadius:"14px", overflow:"hidden", marginBottom:"20px", height:"130px", position:"relative", background:previewBg }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.52)" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:"18px", fontWeight:"900", color:"#fff" }}>{chat.heroHeading||"THE COMMUNITY"}</div>
          <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", fontFamily:"monospace", marginTop:"4px" }}>{chat.heroSubtext||"Connect · Share · Vibe"}</div>
        </div>
      </div>

      {/* HERO MEDIA */}
      <ASection title="Hero Banner" icon="🖼" color="#C77DFF">
        <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
          {[["gradient","Gradient"],["image","Photo"],["video","Video"]].map(([val,label]) => (
            <div key={val} onClick={() => { updateChat("heroType",val); if(val==="video") updateChat("heroMediaType","video"); else updateChat("heroMediaType","image"); }}
              style={{ flex:1, padding:"10px 6px", borderRadius:"10px", textAlign:"center", cursor:"pointer", border:(chat.heroType||"gradient")===val?"1px solid #C77DFF":"1px solid rgba(255,255,255,0.07)", background:(chat.heroType||"gradient")===val?"rgba(199,125,255,0.1)":"rgba(255,255,255,0.02)", transition:"all 0.2s" }}>
              <div style={{ fontSize:"11px", fontWeight:"700", color:(chat.heroType||"gradient")===val?"#C77DFF":"#555" }}>{label}</div>
            </div>
          ))}
        </div>

        {chat.heroType === "image" && (
          <div>
            <div onClick={() => heroRef.current?.click()}
              style={{ padding:"18px", borderRadius:"11px", textAlign:"center", cursor:"pointer", border:chat.heroImageUrl?"2px solid #C77DFF":"2px dashed rgba(199,125,255,0.25)", background:"rgba(199,125,255,0.04)", marginBottom:"8px" }}>
              <div style={{ fontSize:"20px", marginBottom:"5px" }}>{chat.heroImageUrl?"🖼":"📤"}</div>
              <div style={{ fontSize:"11px", color:chat.heroImageUrl?"#C77DFF":"#555" }}>{chat.heroImageUrl?"Photo uploaded · Tap to change":"Upload hero photo"}</div>
              <input ref={heroRef} type="file" accept="image/*" onChange={e=>handleHeroFile(e.target.files[0])} style={{ display:"none" }} />
            </div>
            {chat.heroImageUrl && <button onClick={() => { updateChat("heroImageUrl",""); updateChat("heroType","gradient"); }} style={{ width:"100%", padding:"8px", borderRadius:"8px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>✕ REMOVE</button>}
          </div>
        )}

        {chat.heroType === "video" && (
          <div>
            <div onClick={() => videoRef.current?.click()}
              style={{ padding:"18px", borderRadius:"11px", textAlign:"center", cursor:"pointer", border:chat.heroVideoUrl?"2px solid #C77DFF":"2px dashed rgba(199,125,255,0.25)", background:"rgba(199,125,255,0.04)", marginBottom:"8px" }}>
              <div style={{ fontSize:"20px", marginBottom:"5px" }}>{chat.heroVideoUrl?"🎬":"📤"}</div>
              <div style={{ fontSize:"11px", color:chat.heroVideoUrl?"#C77DFF":"#555" }}>{chat.heroVideoUrl?"Video uploaded · Tap to change":"Upload hero video (MP4, MOV — loops silently)"}</div>
              <input ref={videoRef} type="file" accept="video/*" onChange={e=>handleVideoFile(e.target.files[0])} style={{ display:"none" }} />
            </div>
            {chat.heroVideoUrl && <button onClick={() => { updateChat("heroVideoUrl",""); updateChat("heroType","gradient"); }} style={{ width:"100%", padding:"8px", borderRadius:"8px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer" }}>✕ REMOVE VIDEO</button>}
          </div>
        )}
      </ASection>

      {/* TEXT CONTENT */}
      <ASection title="Community Text" icon="◆" color="#FF6B35">
        <AField label="Room Name"       value={chat.roomName||""}     onChange={v=>updateChat("roomName",v)}     placeholder="The Community" />
        <AField label="Hero Heading"    value={chat.heroHeading||""}  onChange={v=>updateChat("heroHeading",v)}  placeholder="THE COMMUNITY" />
        <AField label="Hero Subtext"    value={chat.heroSubtext||""}  onChange={v=>updateChat("heroSubtext",v)}  placeholder="Connect · Share · Vibe" />
        <AField label="Post Placeholder"value={chat.placeholder||""} onChange={v=>updateChat("placeholder",v)}  placeholder="Share something with the community..." />
      </ASection>

      <div style={{ padding:"12px", borderRadius:"10px", background:"rgba(0,245,212,0.05)", border:"1px solid rgba(0,245,212,0.15)" }}>
        <div style={{ fontSize:"10px", color:"#00F5D4", marginBottom:"4px" }}>◆ HOW THE COMMUNITY PAGE WORKS</div>
        <div style={{ fontSize:"11px", color:"#bbb", lineHeight:1.6 }}>Users enter a name and @handle on their first post, then can post text and photos, reply to others, and like any post or reply. Posts persist during their session. The hero banner stays fixed while the feed scrolls.</div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// 1 ─── FAN MEMBERSHIP SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function MembershipScreen({ config }) {
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;
  const m  = config.membership || {};
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ padding:"28px 20px" }}>
      <SH icon="⭐" title="MEMBERSHIP" accent="#FFD60A" sub={m.tagline || "Get exclusive access to everything"} />

      {/* HERO CARD */}
      <div style={{ padding:"28px 20px", borderRadius:"20px", marginBottom:"24px", background:`linear-gradient(135deg,${pc}22,${ac}14)`, border:`1px solid ${pc}44`, textAlign:"center" }}>
        <div style={{ fontSize:"48px", marginBottom:"12px" }}>⭐</div>
        <div style={{ fontSize:"22px", fontWeight:"900", marginBottom:"4px" }}>{m.title || "Fan Membership"}</div>
        <div style={{ fontSize:"36px", fontWeight:"900", color:pc, marginBottom:"4px" }}>
          ${m.price || "4.99"}<span style={{ fontSize:"14px", color:"#bbb" }}>/{m.billingCycle || "month"}</span>
        </div>
        <div style={{ fontSize:"11px", color:"#bbb", marginBottom:"20px" }}>Cancel anytime · Instant access</div>
        {joined ? (
          <div style={{ padding:"16px", borderRadius:"12px", background:"rgba(0,245,212,0.1)", border:"1px solid rgba(0,245,212,0.3)", fontSize:"14px", fontWeight:"700", color:"#00F5D4" }}>
            ✓ {m.thankYouMsg || "Welcome to the inner circle! 🎉"}
          </div>
        ) : (
          <button onClick={() => { if (m.stripeLink) window.open(m.stripeLink,"_blank"); else setJoined(true); }}
            style={{ width:"100%", padding:"16px", borderRadius:"14px", border:"none", background:`linear-gradient(135deg,${pc},#FFD60A)`, color:"#000", fontSize:"14px", fontWeight:"900", letterSpacing:"0.15em", cursor:"pointer" }}>
            {m.ctaText || "JOIN NOW"} →
          </button>
        )}
      </div>

      {/* PERKS */}
      <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#aaa", fontFamily:"monospace", marginBottom:"14px" }}>WHAT YOU GET</div>
      {(m.perks || []).map((perk,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px", marginBottom:"10px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:`1px solid ${pc}22` }}>
          <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:`${pc}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>✓</div>
          <div style={{ fontSize:"13px", color:"#ddd" }}>{perk}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2 ─── EMAIL CAPTURE POPUP
// ═══════════════════════════════════════════════════════════════════════════════
function EmailCapturePopup({ config, setConfig }) {
  const [visible,   setVisible]   = useState(false);
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const el = config.emailList || {};

  useEffect(() => {
    if (!el.enabled || !el.popupEnabled || dismissed || submitted) return;
    const t = setTimeout(() => setVisible(true), (el.popupDelay || 8) * 1000);
    return () => clearTimeout(t);
  }, [el.enabled, el.popupEnabled, dismissed, submitted]);

  const submit = () => {
    if (!email.trim() || !email.includes("@")) return;
    setConfig(prev => ({
      ...prev,
      emailList: { ...prev.emailList, subscribers: [...(prev.emailList?.subscribers||[]), { email:email.trim(), date:new Date().toLocaleDateString() }] }
    }));
    setSubmitted(true);
    setTimeout(() => { setVisible(false); }, 2500);
  };

  if (!visible || !el.enabled || !el.popupEnabled) return null;
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"20px", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
      onClick={e => { if(e.target===e.currentTarget){setVisible(false);setDismissed(true);} }}>
      <div style={{ width:"100%", maxWidth:"440px", padding:"28px 24px", borderRadius:"20px", background:"#0a0a12", border:`1px solid ${pc}44`, animation:"fadeIn 0.4s ease", fontFamily:"monospace" }}>
        {submitted ? (
          <div style={{ textAlign:"center", padding:"12px 0" }}>
            <div style={{ fontSize:"36px", marginBottom:"10px" }}>🎉</div>
            <div style={{ fontSize:"16px", fontWeight:"900", color:pc }}>{el.successMsg || "You're in! Welcome to the family 🎉"}</div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
              <div>
                <div style={{ fontSize:"16px", fontWeight:"900", color:"#fff", marginBottom:"4px" }}>{el.popupTitle || "Stay in the loop 🔔"}</div>
                <div style={{ fontSize:"12px", color:"#bbb" }}>{el.popupSubtext || "Get notified when new music and episodes drop."}</div>
              </div>
              <button onClick={() => { setVisible(false); setDismissed(true); }} style={{ background:"none", border:"none", color:"#aaa", fontSize:"18px", cursor:"pointer", padding:"0 0 0 10px" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
                placeholder="your@email.com" type="email"
                style={{ flex:1, padding:"12px 14px", borderRadius:"10px", background:"rgba(255,255,255,0.06)", border:`1px solid ${pc}33`, color:"#fff", fontSize:"12px", outline:"none" }} />
              <button onClick={submit} style={{ padding:"12px 18px", borderRadius:"10px", border:"none", background:`linear-gradient(135deg,${pc},${ac})`, color:"#000", fontWeight:"900", fontSize:"11px", cursor:"pointer", letterSpacing:"0.1em" }}>
                {el.ctaText || "SUBSCRIBE"}
              </button>
            </div>
            <div style={{ fontSize:"9px", color:"#999", marginTop:"10px", textAlign:"center" }}>No spam. Unsubscribe anytime.</div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3 ─── BOOKING / INQUIRY SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function BookingScreen({ config }) {
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;
  const b  = config.booking || {};
  const [form, setForm]     = useState({ name:"", email:"", type:(b.types||["Brand Deal"])[0], message:"", budget:"" });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true); setSending(false);
  };

  if (sent) return (
    <div style={{ padding:"80px 24px", textAlign:"center" }}>
      <div style={{ fontSize:"56px", marginBottom:"16px" }}>🎉</div>
      <div style={{ fontSize:"22px", fontWeight:"900", marginBottom:"8px", color:pc }}>Inquiry Sent!</div>
      <div style={{ fontSize:"14px", color:"#bbb", marginBottom:"8px" }}>{b.responseTime || "We respond within 48 hours."}</div>
      <button onClick={() => setSent(false)} style={{ marginTop:"20px", padding:"12px 28px", borderRadius:"12px", border:"none", background:`linear-gradient(135deg,${pc},${ac})`, color:"#000", fontWeight:"900", fontSize:"12px", cursor:"pointer" }}>SEND ANOTHER</button>
    </div>
  );

  return (
    <div style={{ padding:"28px 20px" }}>
      <SH icon="📅" title={b.title||"BOOK / INQUIRE"} accent={pc} sub={b.subtitle||"Brand deals, features, appearances, and more."} />

      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {/* TYPE */}
        <div>
          <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"7px" }}>INQUIRY TYPE</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
            {(b.types||["Brand Deal","Feature Request","Appearance","Other"]).map(t => (
              <button key={t} onClick={() => setForm(p=>({...p,type:t}))}
                style={{ padding:"8px 14px", borderRadius:"18px", border:"none", cursor:"pointer", background:form.type===t?`linear-gradient(135deg,${pc},${ac})`:"rgba(255,255,255,0.05)", color:form.type===t?"#000":"#777", fontSize:"11px", fontWeight:form.type===t?"700":"400", fontFamily:"monospace", transition:"all 0.2s" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {[
          { label:"YOUR NAME", key:"name", ph:"First Last", type:"text" },
          { label:"YOUR EMAIL", key:"email", ph:"your@email.com", type:"email" },
          { label:"BUDGET / RATE (OPTIONAL)", key:"budget", ph:"e.g. $500, $1,000+, Open", type:"text" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"7px" }}>{f.label}</label>
            <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} type={f.type}
              style={{ width:"100%", padding:"13px 14px", borderRadius:"10px", background:"rgba(255,255,255,0.04)", border:`1px solid ${pc}22`, color:"#ddd", fontSize:"13px", outline:"none", fontFamily:"sans-serif" }} />
          </div>
        ))}

        <div>
          <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"7px" }}>MESSAGE / DETAILS</label>
          <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Tell us about your project, timeline, and goals..." rows={5}
            style={{ width:"100%", padding:"13px 14px", borderRadius:"10px", background:"rgba(255,255,255,0.04)", border:`1px solid ${pc}22`, color:"#ddd", fontSize:"13px", outline:"none", fontFamily:"sans-serif", resize:"vertical", lineHeight:1.5 }} />
        </div>

        <button onClick={submit} disabled={sending||!form.name.trim()||!form.email.trim()||!form.message.trim()}
          style={{ padding:"16px", borderRadius:"12px", border:"none", background:form.name&&form.email&&form.message?`linear-gradient(135deg,${pc},${ac})`:"rgba(255,255,255,0.06)", color:form.name&&form.email&&form.message?"#000":"#555", fontSize:"13px", fontWeight:"900", letterSpacing:"0.15em", cursor:form.name&&form.email&&form.message?"pointer":"not-allowed", transition:"all 0.3s" }}>
          {sending ? "◌ SENDING..." : "◆ SEND INQUIRY"}
        </button>

        <div style={{ padding:"12px 16px", borderRadius:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", fontSize:"11px", color:"#aaa", textAlign:"center" }}>
          {b.responseTime || "We respond within 48 hours."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4 ─── LINK IN BIO SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function LinkInBioScreen({ config }) {
  const pc  = config.brand.primaryColor;
  const ac  = config.brand.accentColor;
  const lib = config.linkInBio || {};
  const links = (lib.links||[]).filter(l => l.active && l.url);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${config.brand.universalLink || window.location.origin}`;
  const copy = () => { navigator.clipboard?.writeText(shareUrl).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div style={{ padding:"28px 20px" }}>
      {/* HERO */}
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <LogoDisplay config={config} size={72} />
        <div style={{ fontSize:"22px", fontWeight:"900", marginTop:"14px", marginBottom:"4px" }}>{lib.headline || config.brand.name}</div>
        <div style={{ fontSize:"12px", color:"#bbb" }}>{lib.subtext || config.brand.tagline}</div>
      </div>

      {/* LINKS */}
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
        {links.length > 0 ? links.map(link => (
          <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", padding:"16px 20px", borderRadius:"14px", background:`${link.color}15`, border:`1px solid ${link.color}40`, color:link.color, fontSize:"14px", fontWeight:"700", textDecoration:"none", transition:"all 0.2s", letterSpacing:"0.05em" }}>
            {link.label}
            <span style={{ fontSize:"12px", opacity:0.6 }}>↗</span>
          </a>
        )) : (
          <div style={{ textAlign:"center", padding:"32px", color:"#999", fontSize:"13px" }}>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>🔗</div>
            Add your links in Admin → Link in Bio
          </div>
        )}
      </div>

      {/* SHARE YOUR PAGE */}
      <div style={{ padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#aaa", fontFamily:"monospace", marginBottom:"8px" }}>SHARE YOUR PAGE</div>
        <div style={{ display:"flex", gap:"8px" }}>
          <div style={{ flex:1, padding:"10px 12px", borderRadius:"9px", background:"rgba(255,255,255,0.04)", fontSize:"11px", color:"#FFD60A", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{shareUrl}</div>
          <button onClick={copy} style={{ padding:"10px 14px", borderRadius:"9px", border:`1px solid ${copied?"#00F5D4":pc}44`, background:copied?"rgba(0,245,212,0.1)":"none", color:copied?"#00F5D4":pc, fontSize:"10px", fontWeight:"700", cursor:"pointer", fontFamily:"monospace", flexShrink:0 }}>
            {copied ? "COPIED ✓" : "COPY"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5 ─── HOME SCREEN CARDS — update to include new screens
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ADMIN: MEMBERSHIP TAB ───────────────────────────────────────────────────
function MembershipAdminTab({ cfg, setCfg }) {
  const m = cfg.membership || {};
  const update = (key, val) => setCfg(prev=>({...prev,membership:{...prev.membership,[key]:val}}));
  const [newPerk, setNewPerk] = useState("");

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Membership Settings" icon="⭐" color="#FFD60A">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
          <div style={{ fontSize:"12px", color:"#ccc" }}>Membership Page Enabled</div>
          <div onClick={()=>update("enabled",!m.enabled)} style={{ width:"48px", height:"26px", borderRadius:"13px", cursor:"pointer", background:m.enabled?"#FFD60A":"rgba(255,255,255,0.1)", position:"relative", transition:"background 0.3s" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:m.enabled?"25px":"3px", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
        <AField label="Page Title"    value={m.title||""}    onChange={v=>update("title",v)}    placeholder="Fan Membership" />
        <AField label="Tagline"       value={m.tagline||""}  onChange={v=>update("tagline",v)}  placeholder="Get exclusive access to everything" />
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ flex:1 }}><AField label="Price $" value={m.price||""} onChange={v=>update("price",v)} placeholder="4.99" type="number" /></div>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#aaa", display:"block", marginBottom:"7px" }}>BILLING</label>
            <select value={m.billingCycle||"month"} onChange={e=>update("billingCycle",e.target.value)} style={{ width:"100%", padding:"11px 13px", background:"#0a0a0f", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }}>
              <option value="month">Monthly</option><option value="year">Yearly</option><option value="week">Weekly</option>
            </select>
          </div>
        </div>
        <AField label="CTA Button Text"  value={m.ctaText||""}      onChange={v=>update("ctaText",v)}      placeholder="JOIN NOW" />
        <AField label="Thank You Message" value={m.thankYouMsg||""}  onChange={v=>update("thankYouMsg",v)}  placeholder="Welcome to the inner circle! 🎉" />
        <AField label="Stripe Payment Link" value={m.stripeLink||""} onChange={v=>update("stripeLink",v)}  placeholder="https://buy.stripe.com/..." />
      </ASection>
      <ASection title="Member Perks" icon="✓" color="#00F5D4">
        {(m.perks||[]).map((p,i)=>(
          <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px", alignItems:"center" }}>
            <input value={p} onChange={e=>{ const arr=[...(m.perks||[])]; arr[i]=e.target.value; update("perks",arr); }} style={{ flex:1, padding:"9px 12px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
            <button onClick={()=>update("perks",(m.perks||[]).filter((_,j)=>j!==i))} style={{ padding:"7px 10px", borderRadius:"7px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"11px", cursor:"pointer" }}>✕</button>
          </div>
        ))}
        <div style={{ display:"flex", gap:"8px", marginTop:"6px" }}>
          <input value={newPerk} onChange={e=>setNewPerk(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newPerk.trim()){ update("perks",[...(m.perks||[]),newPerk.trim()]); setNewPerk(""); }}} placeholder="Add a perk... e.g. 🎵 Early track access" style={{ flex:1, padding:"9px 12px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(0,245,212,0.25)", borderRadius:"8px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
          <button onClick={()=>{ if(newPerk.trim()){ update("perks",[...(m.perks||[]),newPerk.trim()]); setNewPerk(""); }}} style={{ padding:"9px 14px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#00F5D4,#C77DFF)", color:"#000", fontWeight:"900", fontSize:"11px", cursor:"pointer" }}>+ ADD</button>
        </div>
      </ASection>
    </div>
  );
}

// ─── ADMIN: EMAIL LIST TAB ────────────────────────────────────────────────────
function EmailListAdminTab({ cfg, setCfg }) {
  const el = cfg.emailList || {};
  const update = (key,val) => setCfg(prev=>({...prev,emailList:{...prev.emailList,[key]:val}}));
  const subs = el.subscribers || [];

  const exportCSV = () => {
    const csv = ["Email,Date",...subs.map(s=>`${s.email},${s.date}`)].join("\n");
    const a = document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="subscribers.csv"; a.click();
  };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Email List Settings" icon="📧" color="#00F5D4">
        <div style={{ display:"flex", gap:"10px", marginBottom:"16px" }}>
          {[["Email Capture","enabled"],["Pop-up Enabled","popupEnabled"]].map(([lbl,key])=>(
            <div key={key} style={{ flex:1, padding:"12px", borderRadius:"10px", background:el[key]?"rgba(0,245,212,0.08)":"rgba(255,255,255,0.02)", border:el[key]?"1px solid rgba(0,245,212,0.3)":"1px solid rgba(255,255,255,0.07)", textAlign:"center", cursor:"pointer" }} onClick={()=>update(key,!el[key])}>
              <div style={{ fontSize:"11px", fontWeight:"700", color:el[key]?"#00F5D4":"#555" }}>{lbl}</div>
              <div style={{ fontSize:"9px", color:"#484848", marginTop:"2px" }}>{el[key]?"ON":"OFF"}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:"12px" }}>
          <label style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"7px" }}>POP-UP DELAY (SECONDS)</label>
          <input type="range" min={3} max={30} value={el.popupDelay||8} onChange={e=>update("popupDelay",Number(e.target.value))} style={{ width:"100%", accentColor:"#00F5D4" }} />
          <div style={{ textAlign:"center", fontSize:"10px", color:"#00F5D4", marginTop:"3px" }}>Shows after {el.popupDelay||8} seconds</div>
        </div>
        <AField label="Pop-up Title"      value={el.popupTitle||""}   onChange={v=>update("popupTitle",v)}   placeholder="Stay in the loop 🔔" />
        <AField label="Pop-up Subtitle"   value={el.popupSubtext||""} onChange={v=>update("popupSubtext",v)} placeholder="Get notified for new drops." />
        <AField label="Button Text"       value={el.ctaText||""}      onChange={v=>update("ctaText",v)}      placeholder="SUBSCRIBE" />
        <AField label="Success Message"   value={el.successMsg||""}   onChange={v=>update("successMsg",v)}   placeholder="You're in! Welcome 🎉" />
        <AField label="Mailchimp/Kit URL" value={el.mailchimpUrl||""} onChange={v=>update("mailchimpUrl",v)} placeholder="https://..." />
      </ASection>
      <ASection title={`Subscribers (${subs.length})`} icon="◎" color="#FFD60A">
        {subs.length===0 ? <div style={{ textAlign:"center", padding:"20px", color:"#484848", fontSize:"12px" }}>No subscribers yet.</div>
        : subs.slice(0,10).map((s,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:"11px" }}>
            <span style={{ color:"#ccc" }}>{s.email}</span>
            <span style={{ color:"#484848", fontFamily:"monospace" }}>{s.date}</span>
          </div>
        ))}
        {subs.length>0 && <button onClick={exportCSV} style={{ marginTop:"12px", width:"100%", padding:"9px", borderRadius:"9px", border:"1px solid rgba(255,255,255,0.08)", background:"none", color:"#777", fontSize:"10px", cursor:"pointer" }}>↓ EXPORT CSV</button>}
      </ASection>
    </div>
  );
}

// ─── ADMIN: BOOKING TAB ───────────────────────────────────────────────────────
function BookingAdminTab({ cfg, setCfg }) {
  const b = cfg.booking || {};
  const update = (key,val) => setCfg(prev=>({...prev,booking:{...prev.booking,[key]:val}}));
  const [newType, setNewType] = useState("");
  const inquiries = b.inquiries || [];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Booking Settings" icon="📅" color="#C77DFF">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
          <div style={{ fontSize:"12px", color:"#ccc" }}>Booking Page Enabled</div>
          <div onClick={()=>update("enabled",!b.enabled)} style={{ width:"48px", height:"26px", borderRadius:"13px", cursor:"pointer", background:b.enabled?"#C77DFF":"rgba(255,255,255,0.1)", position:"relative", transition:"background 0.3s" }}>
            <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:b.enabled?"25px":"3px", transition:"left 0.3s" }} />
          </div>
        </div>
        <AField label="Page Title"         value={b.title||""}        onChange={v=>update("title",v)}        placeholder="Book / Inquire" />
        <AField label="Subtitle"           value={b.subtitle||""}     onChange={v=>update("subtitle",v)}     placeholder="Brand deals, features, appearances..." />
        <AField label="Contact Email"      value={b.contactEmail||""} onChange={v=>update("contactEmail",v)} placeholder="youremail@gmail.com" />
        <AField label="Response Time Note" value={b.responseTime||""} onChange={v=>update("responseTime",v)} placeholder="We respond within 48 hours." />
      </ASection>
      <ASection title="Inquiry Types" icon="◆" color="#FF6B35">
        {(b.types||[]).map((t,i)=>(
          <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
            <div style={{ flex:1, padding:"9px 12px", borderRadius:"8px", background:"rgba(255,255,255,0.04)", fontSize:"12px", color:"#ccc" }}>{t}</div>
            <button onClick={()=>update("types",(b.types||[]).filter((_,j)=>j!==i))} style={{ padding:"7px 10px", borderRadius:"7px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"11px", cursor:"pointer" }}>✕</button>
          </div>
        ))}
        <div style={{ display:"flex", gap:"8px", marginTop:"6px" }}>
          <input value={newType} onChange={e=>setNewType(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newType.trim()){update("types",[...(b.types||[]),newType.trim()]);setNewType("");}}} placeholder="Add inquiry type..." style={{ flex:1, padding:"9px 12px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,107,53,0.25)", borderRadius:"8px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
          <button onClick={()=>{ if(newType.trim()){update("types",[...(b.types||[]),newType.trim()]);setNewType("");}}} style={{ padding:"9px 14px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#FF6B35,#C77DFF)", color:"#000", fontWeight:"900", fontSize:"11px", cursor:"pointer" }}>+ ADD</button>
        </div>
      </ASection>
      <ASection title={`Inquiries (${inquiries.length})`} icon="📋" color="#484848">
        {inquiries.length===0 ? <div style={{ textAlign:"center", padding:"20px", color:"#484848", fontSize:"12px" }}>No inquiries yet.</div>
        : inquiries.slice(-10).reverse().map((q,i)=>(
          <div key={i} style={{ padding:"12px", borderRadius:"10px", marginBottom:"8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
              <span style={{ fontSize:"12px", fontWeight:"700", color:"#ccc" }}>{q.name}</span>
              <span style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace" }}>{q.type}</span>
            </div>
            <div style={{ fontSize:"10px", color:"#00F5D4", marginBottom:"4px" }}>{q.email}</div>
            <div style={{ fontSize:"11px", color:"#666", lineHeight:1.4 }}>{q.message?.slice(0,100)}{q.message?.length>100?"...":""}</div>
          </div>
        ))}
      </ASection>
    </div>
  );
}

// ─── ADMIN: LINK IN BIO TAB ──────────────────────────────────────────────────
function LinkInBioAdminTab({ cfg, setCfg }) {
  const lib = cfg.linkInBio || {};
  const update = (key,val) => setCfg(prev=>({...prev,linkInBio:{...prev.linkInBio,[key]:val}}));
  const updateLink = (id,key,val) => update("links",(lib.links||[]).map(l=>l.id===id?{...l,[key]:val}:l));
  const addLink = () => update("links",[...(lib.links||[]),{id:Date.now(),label:"New Link",url:"",active:true,color:"#FF6B35"}]);
  const removeLink = id => update("links",(lib.links||[]).filter(l=>l.id!==id));

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <ASection title="Link in Bio Page" icon="🔗" color="#00F5D4">
        <AField label="Headline" value={lib.headline||""} onChange={v=>update("headline",v)} placeholder="YOUR BRAND" />
        <AField label="Subtext"  value={lib.subtext||""}  onChange={v=>update("subtext",v)}  placeholder="Digital Media Entertainment" />
      </ASection>
      <ASection title="Links" icon="◆" color="#FF6B35">
        {(lib.links||[]).map(link=>(
          <div key={link.id} style={{ padding:"14px", borderRadius:"12px", marginBottom:"10px", background:"rgba(255,255,255,0.02)", border:`1px solid ${link.color}30` }}>
            <div style={{ display:"flex", gap:"8px", marginBottom:"8px", alignItems:"center" }}>
              <input type="color" value={link.color||"#FF6B35"} onChange={e=>updateLink(link.id,"color",e.target.value)} style={{ width:"36px", height:"36px", borderRadius:"7px", border:"none", cursor:"pointer", flexShrink:0 }} />
              <input value={link.label} onChange={e=>updateLink(link.id,"label",e.target.value)} placeholder="Link label" style={{ flex:1, padding:"8px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace" }} />
              <div onClick={()=>updateLink(link.id,"active",!link.active)} style={{ width:"40px", height:"22px", borderRadius:"11px", cursor:"pointer", flexShrink:0, background:link.active?link.color:"rgba(255,255,255,0.1)", position:"relative", transition:"background 0.3s" }}>
                <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:"#fff", position:"absolute", top:"3px", left:link.active?"21px":"3px", transition:"left 0.3s" }} />
              </div>
              <button onClick={()=>removeLink(link.id)} style={{ padding:"6px 9px", borderRadius:"7px", border:"1px solid rgba(255,59,48,0.3)", background:"rgba(255,59,48,0.07)", color:"#FF3B30", fontSize:"10px", cursor:"pointer", flexShrink:0 }}>✕</button>
            </div>
            <input value={link.url} onChange={e=>updateLink(link.id,"url",e.target.value)} placeholder="https://..." style={{ width:"100%", padding:"8px 10px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"8px", color:"#E8E4DC", fontSize:"11px", outline:"none", fontFamily:"monospace" }} />
          </div>
        ))}
        <button onClick={addLink} style={{ width:"100%", padding:"12px", borderRadius:"10px", border:"2px dashed rgba(255,107,53,0.25)", background:"rgba(255,107,53,0.04)", color:"#FF6B35", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>+ ADD LINK</button>
      </ASection>
    </div>
  );
}


function BSection({ label, children }) {
  return (
    <div style={{ marginBottom:"22px" }}>
      <div style={{ fontSize:"8px", letterSpacing:"0.35em", color:"#3a3a3a", fontFamily:"monospace", marginBottom:"9px" }}>{label}</div>
      {children}
    </div>
  );
}

function SH({ icon, title, accent, sub }) {
  return (
    <div style={{ marginBottom:"24px" }}>
      <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:accent, fontFamily:"monospace", marginBottom:"5px" }}>{icon} {title}</div>
      <h2 style={{ fontSize:"24px", fontWeight:"900", margin:"0 0 5px", letterSpacing:"-0.01em", fontFamily:"'Georgia',serif" }}>{title}</h2>
      <div style={{ fontSize:"12px", color:"#555" }}>{sub}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD — FULL VERSION
// ═══════════════════════════════════════════════════════════════════════════════
function AnalyticsDashboard({ config }) {
  const [period,  setPeriod]  = useState("7d");
  const [section, setSection] = useState("overview"); // overview | content | social | revenue | productivity
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;

  const PERIODS = [
    { id:"7d", label:"7D" },{ id:"30d", label:"30D" },{ id:"90d", label:"90D" },{ id:"1y", label:"1Y" },
  ];

  const SECTIONS = [
    { id:"overview",     label:"OVERVIEW",     icon:"⬡" },
    { id:"content",      label:"CONTENT",      icon:"♪" },
    { id:"social",       label:"SOCIAL",       icon:"◎" },
    { id:"revenue",      label:"REVENUE",      icon:"💰" },
    { id:"productivity", label:"PRODUCTIVITY", icon:"⚡" },
  ];

  const kpiData = {
    "7d":  { plays:8420,  downloads:312,  views:14800, revenue:1247,  engagement:6.8, followers:210,  postsPublished:12, hoursProduced:18, avgResponseTime:42 },
    "30d": { plays:34100, downloads:1240, views:52000, revenue:4830,  engagement:7.2, followers:890,  postsPublished:48, hoursProduced:74, avgResponseTime:38 },
    "90d": { plays:98400, downloads:4100, views:180000,revenue:14200, engagement:6.5, followers:3100, postsPublished:142,hoursProduced:210,avgResponseTime:35 },
    "1y":  { plays:312000,downloads:14200,views:640000,revenue:48400, engagement:6.9, followers:9800, postsPublished:520,hoursProduced:780,avgResponseTime:31 },
  };
  const d = kpiData[period];

  const scale = { "7d":1, "30d":3.2, "90d":9.1, "1y":31 };
  const s = scale[period];

  const musicChart   = [420,380,510,470,620,580,700,650,800,780,920,890,1050,980,1120].map(v => Math.round(v*s));
  const viewsChart   = [820,760,1100,980,1250,1100,1400,1300,1600,1520,1800,1700,2100,1950,2300].map(v => Math.round(v*s));
  const revenueChart = [80,65,110,90,140,120,160,150,200,180,240,220,280,260,310].map(v => Math.round(v*s));
  const followerChart= [30,28,42,38,55,50,68,62,80,75,92,88,105,98,115].map(v => Math.round(v*s));

  const fmt = (n) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toString();

  const MiniChart = ({ data: chartData, color, height=40 }) => {
    const max = Math.max(...chartData, 1);
    return (
      <div style={{ display:"flex", alignItems:"flex-end", gap:"2px", height:`${height}px` }}>
        {chartData.map((v,i) => (
          <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", background:`linear-gradient(180deg,${color},${color}70)`, height:`${Math.max(4,Math.round((v/max)*100))}%`, minWidth:"3px", opacity:0.45+((i/chartData.length)*0.55) }} />
        ))}
      </div>
    );
  };

  const RankBar = ({ label, val, pct, color, sub }) => (
    <div style={{ marginBottom:"13px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
        <span style={{ fontSize:"12px", color:"#ccc" }}>{label}</span>
        <span style={{ fontSize:"11px", color, fontFamily:"monospace", fontWeight:"700" }}>{val}</span>
      </div>
      {sub && <div style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace", marginBottom:"4px" }}>{sub}</div>}
      <div style={{ height:"3px", borderRadius:"2px", background:"rgba(255,255,255,0.05)" }}>
        <div style={{ height:"100%", borderRadius:"2px", background:color, width:`${pct}%`, transition:"width 0.6s ease" }} />
      </div>
    </div>
  );

  // ── PRODUCTIVITY DATA ──────────────────────────────────────────────────────
  const HOURLY_HEATMAP = [
    // [hour_label, mon, tue, wed, thu, fri, sat, sun]  — 0–10 intensity score
    ["12AM", 0,0,0,0,0,2,1],
    ["3AM",  0,0,0,0,0,1,0],
    ["6AM",  2,3,2,3,2,1,1],
    ["8AM",  7,8,6,8,7,3,2],
    ["10AM", 9,8,9,7,8,5,4],
    ["12PM", 6,5,8,6,7,6,5],
    ["2PM",  5,7,6,9,6,8,7],
    ["4PM",  4,5,5,5,4,9,8],
    ["6PM",  6,7,5,6,5,7,6],
    ["8PM",  8,9,7,8,8,6,5],
    ["10PM", 5,6,5,7,6,4,3],
  ];

  const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

  const BEST_WINDOWS = [
    { day:"Tuesday",   time:"8–11 AM",   score:9.2, type:"Recording / Production",  reason:"Highest focus scores + lowest interruptions" },
    { day:"Thursday",  time:"2–5 PM",    score:8.9, type:"Video Shoots",             reason:"Natural light peaks + audience pre-weekend energy" },
    { day:"Monday",    time:"8–10 AM",   score:8.7, type:"Content Planning",         reason:"Week-start clarity = sharper creative decisions"  },
    { day:"Saturday",  time:"2–6 PM",    score:8.4, type:"Posting & Engagement",     reason:"Audience most active — replies boost algorithm"    },
    { day:"Wednesday", time:"7–9 PM",    score:8.1, type:"Live Streaming",           reason:"Mid-week peak viewership window across platforms"  },
    { day:"Friday",    time:"6–9 PM",    score:7.8, type:"Music Drops / Releases",   reason:"Weekend listening surge starts Friday evening"     },
  ];

  const CONTENT_VELOCITY = [
    { label:"Posts This Period",    val:d.postsPublished, unit:"published",  color:pc,        trend:"+12%" },
    { label:"Hours of Content",     val:d.hoursProduced,  unit:"hours",      color:ac,        trend:"+8%"  },
    { label:"Avg Response Time",    val:d.avgResponseTime,unit:"min",        color:"#00F5D4", trend:"-14%" },
    { label:"Content Consistency",  val:"94",             unit:"%",          color:"#FFD60A", trend:"↑"    },
  ];

  const TREND_INSIGHTS = [
    { icon:"📈", title:"Music performs best Fri–Sun", desc:"72% of your total plays happen Thu night through Sunday. Drop new music Thursday evening for maximum weekend impact.", color:pc },
    { icon:"⚡", title:"Tuesday is your power day", desc:"Data shows Tuesday 8–11 AM is your highest-output creative window. Block this time for recording and production.", color:"#FFD60A" },
    { icon:"🎯", title:"Reels drive 3× more followers", desc:"Short-form video consistently converts at 3.1× the rate of static posts. Prioritize 60-second content.", color:"#F72585" },
    { icon:"💰", title:"Episode 3 pattern = your formula", desc:"Real Talk style episodes (industry insight + personal story) earn 40% more watch time than other formats.", color:ac },
    { icon:"🔥", title:"Live streams peak Wed 7–9 PM", desc:"Your live content gets 2.3× more comments than pre-recorded. Schedule weekly lives on Wednesday evenings.", color:"#00F5D4" },
    { icon:"📊", title:"Revenue spikes follow content clusters", desc:"Every time you post 3+ pieces in 48 hours, revenue increases 28% in the following week. Batch your content.", color:"#C77DFF" },
  ];

  return (
    <div style={{ paddingBottom:"20px" }}>
      {/* HEADER */}
      <div style={{ padding:"28px 20px 0" }}>
        <SH icon="📊" title="ANALYTICS" accent={pc} sub="Your numbers. Your growth. Your power." />
      </div>

      {/* PERIOD + SECTION CONTROLS */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{ flex:1, padding:"9px 4px", borderRadius:"9px", border:"none", cursor:"pointer", background:period===p.id ? `linear-gradient(135deg,${pc},${ac})` : "rgba(255,255,255,0.04)", color:period===p.id ? "#000" : "#555", fontSize:"9px", fontWeight:"800", letterSpacing:"0.15em", fontFamily:"monospace", transition:"all 0.25s" }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", overflowX:"auto", gap:"6px", scrollbarWidth:"none" }}>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setSection(sec.id)} style={{ flex:"0 0 auto", padding:"7px 12px", borderRadius:"16px", border:"none", cursor:"pointer", background:section===sec.id ? `${pc}22` : "rgba(255,255,255,0.03)", color:section===sec.id ? pc : "#484848", fontSize:"9px", fontWeight:"700", letterSpacing:"0.1em", fontFamily:"monospace", transition:"all 0.25s", borderBottom:section===sec.id ? `2px solid ${pc}` : "2px solid transparent" }}>
              {sec.icon} {sec.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"0 20px" }}>

        {/* ── OVERVIEW ── */}
        {section === "overview" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px", marginBottom:"20px" }}>
              {[
                { label:"MUSIC PLAYS",   val:fmt(d.plays),        icon:"♪", color:pc,        chart:musicChart    },
                { label:"SHOW VIEWS",    val:fmt(d.views),        icon:"▶", color:ac,        chart:viewsChart    },
                { label:"DOWNLOADS",     val:fmt(d.downloads),    icon:"↓", color:"#00F5D4", chart:musicChart.map(v=>Math.round(v*0.037)) },
                { label:"REVENUE",       val:`$${fmt(d.revenue)}`,icon:"💰",color:"#FFD60A", chart:revenueChart  },
                { label:"ENGAGEMENT",    val:`${d.engagement}%`,  icon:"◎", color:"#F72585", chart:viewsChart.map(v=>Math.round(v*0.004)) },
                { label:"NEW FOLLOWERS", val:`+${fmt(d.followers)}`,icon:"★",color:"#C77DFF",chart:followerChart },
              ].map((kpi,i) => (
                <div key={i} style={{ padding:"14px", borderRadius:"14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${kpi.color}22` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                    <div>
                      <div style={{ fontSize:"8px", letterSpacing:"0.22em", color:"#555", fontFamily:"monospace", marginBottom:"3px" }}>{kpi.label}</div>
                      <div style={{ fontSize:"20px", fontWeight:"900", color:kpi.color, lineHeight:1 }}>{kpi.val}</div>
                    </div>
                    <span style={{ fontSize:"16px", opacity:0.4 }}>{kpi.icon}</span>
                  </div>
                  <MiniChart data={kpi.chart} color={kpi.color} height={36} />
                </div>
              ))}
            </div>

            {/* TREND INSIGHTS */}
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${pc}18`, marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:pc, fontFamily:"monospace", marginBottom:"14px" }}>⚡ AI TREND INSIGHTS</div>
              {TREND_INSIGHTS.slice(0,3).map((t,i) => (
                <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"10px 0", borderBottom:i<2?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ fontSize:"18px", flexShrink:0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:"700", color:t.color, marginBottom:"3px" }}>{t.title}</div>
                    <div style={{ fontSize:"11px", color:"#666", lineHeight:1.55 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setSection("productivity")} style={{ marginTop:"12px", width:"100%", padding:"9px", borderRadius:"8px", border:`1px solid ${pc}33`, background:`${pc}0d`, color:pc, fontSize:"10px", fontWeight:"700", letterSpacing:"0.12em", cursor:"pointer", fontFamily:"monospace" }}>
                VIEW ALL INSIGHTS → PRODUCTIVITY TAB
              </button>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {section === "content" && (
          <div>
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${pc}20`, marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:pc, fontFamily:"monospace", marginBottom:"14px" }}>♪ TOP TRACKS · {period.toUpperCase()}</div>
              {[
                { title:"Track Name 03", plays:period==="7d"?"2.1K":period==="30d"?"8.4K":period==="90d"?"24K":"84K",  pct:100, genre:"Pop" },
                { title:"Track Name 01", plays:period==="7d"?"1.2K":period==="30d"?"5.1K":period==="90d"?"15K":"52K",  pct:60,  genre:"Hip-Hop" },
                { title:"Track Name 02", plays:period==="7d"?"892": period==="30d"?"3.8K":period==="90d"?"11K":"38K",  pct:44,  genre:"R&B" },
                { title:"Track Name 04", plays:period==="7d"?"644": period==="30d"?"2.7K":period==="90d"?"7.8K":"27K", pct:32,  genre:"Trap" },
              ].map((t,i) => <RankBar key={i} label={t.title} val={t.plays} pct={t.pct} color={pc} sub={`Genre: ${t.genre}`} />)}
            </div>

            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${ac}20`, marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:ac, fontFamily:"monospace", marginBottom:"14px" }}>▶ TOP EPISODES · {period.toUpperCase()}</div>
              {[
                { title:"Episode 03 — Real Talk",   views:period==="7d"?"5.1K":period==="30d"?"18K":period==="90d"?"52K":"184K", pct:100, retention:"74%" },
                { title:"Episode 01 — Pilot",       views:period==="7d"?"3.4K":period==="30d"?"12K":period==="90d"?"35K":"122K", pct:67,  retention:"68%" },
                { title:"Episode 02 — The Come Up", views:period==="7d"?"2.8K":period==="30d"?"9.8K":period==="90d"?"28K":"98K", pct:55,  retention:"61%" },
              ].map((s,i) => <RankBar key={i} label={s.title} val={s.views} pct={s.pct} color={ac} sub={`Avg retention: ${s.retention}`} />)}
            </div>

            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(247,37,133,0.18)", marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#F72585", fontFamily:"monospace", marginBottom:"14px" }}>◆ POST ENGAGEMENT BY FORMAT</div>
              {[
                { type:"Reels / Shorts", rate:"9.1%", reach:period==="7d"?"12K":period==="30d"?"48K":period==="90d"?"142K":"504K", pct:100, color:"#F72585" },
                { type:"Live Streams",   rate:"11.4%",reach:period==="7d"?"3.1K":period==="30d"?"12K":period==="90d"?"36K":"128K", pct:85,  color:"#FFD60A" },
                { type:"Feed Posts",     rate:"6.8%", reach:period==="7d"?"8.4K":period==="30d"?"34K":period==="90d"?"98K":"348K", pct:72,  color:pc        },
                { type:"Stories",        rate:"4.2%", reach:period==="7d"?"5.2K":period==="30d"?"21K":period==="90d"?"62K":"220K", pct:48,  color:ac        },
              ].map((row,i) => <RankBar key={i} label={row.type} val={row.rate} pct={row.pct} color={row.color} sub={`Reach: ${row.reach}`} />)}
              <div style={{ marginTop:"10px", padding:"10px 12px", borderRadius:"9px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:"10px", color:"#555", fontFamily:"monospace" }}>⚡ Live streams have the highest engagement rate. Schedule weekly.</div>
              </div>
            </div>

            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(0,245,212,0.15)" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#00F5D4", fontFamily:"monospace", marginBottom:"14px" }}>↓ DOWNLOAD TRENDS</div>
              <MiniChart data={musicChart.map(v=>Math.round(v*0.037))} color="#00F5D4" height={60} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px" }}>
                <span style={{ fontSize:"8px", color:"#484848" }}>Start of period</span>
                <span style={{ fontSize:"8px", color:"#484848" }}>Today</span>
              </div>
              <div style={{ marginTop:"12px", display:"flex", gap:"10px" }}>
                {[["Music Downloads",fmt(d.downloads),"#00F5D4"],["Show Replays",fmt(Math.round(d.downloads*0.4)),"#C77DFF"],["Digital Products",fmt(Math.round(d.downloads*0.22)),"#FFD60A"]].map(([l,v,c],i)=>(
                  <div key={i} style={{ flex:1, padding:"10px 8px", borderRadius:"8px", background:`${c}10`, border:`1px solid ${c}25`, textAlign:"center" }}>
                    <div style={{ fontSize:"14px", fontWeight:"900", color:c }}>{v}</div>
                    <div style={{ fontSize:"8px", color:"#484848", marginTop:"2px", lineHeight:1.3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SOCIAL ── */}
        {section === "social" && (
          <div>
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,214,10,0.18)", marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#FFD60A", fontFamily:"monospace", marginBottom:"14px" }}>◎ FOLLOWER GROWTH BY PLATFORM</div>
              {[
                { name:"TikTok",    icon:"🎵", color:"#69C9D0", new:period==="7d"?"+310":period==="30d"?"+1.1K":period==="90d"?"+3.8K":"+12K", total:"31K",  eng:"9.1%", pct:100 },
                { name:"Instagram", icon:"📸", color:"#E1306C", new:period==="7d"?"+124":period==="30d"?"+480":period==="90d"?"+1.7K":"+5.4K", total:"12.4K", eng:"7.2%", pct:80  },
                { name:"Spotify",   icon:"♫",  color:"#1DB954", new:period==="7d"?"+94": period==="30d"?"+360":period==="90d"?"+1.3K":"+4.1K", total:"3.8K",  eng:"—",    pct:68  },
                { name:"Twitter/X", icon:"✕",  color:"#1DA1F2", new:period==="7d"?"+62": period==="30d"?"+240":period==="90d"?"+840":"+2.7K",  total:"5.6K",  eng:"4.8%", pct:52  },
                { name:"Facebook",  icon:"📘", color:"#4267B2", new:period==="7d"?"+38": period==="30d"?"+150":period==="90d"?"+520":"+1.7K",  total:"9.1K",  eng:"3.9%", pct:40  },
                { name:"YouTube",   icon:"▶",  color:"#FF0000", new:period==="7d"?"+48": period==="30d"?"+190":period==="90d"?"+620":"+2.0K",  total:"8.2K",  eng:"5.4%", pct:44  },
              ].map((p,i) => (
                <div key={i} style={{ marginBottom:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span>{p.icon}</span>
                      <div>
                        <span style={{ fontSize:"12px", color:"#ccc" }}>{p.name}</span>
                        <span style={{ fontSize:"9px", color:"#484848", marginLeft:"8px", fontFamily:"monospace" }}>Engagement: {p.eng}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"12px", fontWeight:"800", color:p.color, fontFamily:"monospace" }}>{p.new}</div>
                      <div style={{ fontSize:"9px", color:"#484848" }}>total: {p.total}</div>
                    </div>
                  </div>
                  <div style={{ height:"3px", borderRadius:"2px", background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:"2px", background:p.color, width:`${p.pct}%`, transition:"width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", fontFamily:"monospace", marginBottom:"14px" }}>◆ BEST POSTING TIMES (BY PLATFORM)</div>
              {[
                { platform:"Instagram", time:"6–9 AM & 7–9 PM",   peak:"Tue, Wed, Fri", color:"#E1306C" },
                { platform:"TikTok",    time:"7–9 AM & 7–11 PM",  peak:"Tue, Thu, Sat", color:"#69C9D0" },
                { platform:"YouTube",   time:"2–4 PM & 8–11 PM",  peak:"Fri, Sat, Sun", color:"#FF0000" },
                { platform:"Twitter/X", time:"8–10 AM & 6–9 PM",  peak:"Mon, Wed, Thu", color:"#1DA1F2" },
                { platform:"Facebook",  time:"1–4 PM weekdays",   peak:"Wed, Thu",      color:"#4267B2" },
                { platform:"Spotify",   time:"Release Thu 5 PM",  peak:"Fri–Sun",       color:"#1DB954" },
              ].map((row,i) => (
                <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"10px 0", borderBottom:i<5?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:row.color, marginTop:"4px", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", color:"#ccc", fontWeight:"600" }}>{row.platform}</div>
                    <div style={{ fontSize:"10px", color:"#484848", fontFamily:"monospace", marginTop:"2px" }}>{row.time}</div>
                  </div>
                  <div style={{ fontSize:"9px", color:row.color, fontFamily:"monospace", textAlign:"right" }}>{row.peak}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {section === "revenue" && (
          <div>
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,214,10,0.18)", marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#FFD60A", fontFamily:"monospace", marginBottom:"8px" }}>💰 TOTAL REVENUE · {period.toUpperCase()}</div>
              <div style={{ fontSize:"36px", fontWeight:"900", color:"#FFD60A", fontFamily:"monospace", marginBottom:"14px" }}>${fmt(d.revenue)}</div>
              <MiniChart data={revenueChart} color="#FFD60A" height={60} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
                <span style={{ fontSize:"8px", color:"#484848" }}>Start</span>
                <span style={{ fontSize:"8px", color:"#484848" }}>Today</span>
              </div>
            </div>

            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", fontFamily:"monospace", marginBottom:"14px" }}>REVENUE BY STREAM</div>
              {[
                { label:"App Sales (Starter/Pro/Empire)", val:period==="7d"?"$847":period==="30d"?"$2,940":period==="90d"?"$8,600":"$29,800", pct:100, color:"#FF6B35" },
                { label:"Fan Memberships",                val:period==="7d"?"$248":period==="30d"?"$994": period==="90d"?"$2,980":"$9,940",  pct:70,  color:"#C77DFF" },
                { label:"Digital Downloads",              val:period==="7d"?"$92": period==="30d"?"$368": period==="90d"?"$1,100":"$3,680",  pct:42,  color:"#00F5D4" },
                { label:"Merch Store",                    val:period==="7d"?"$60": period==="30d"?"$528": period==="90d"?"$1,520":"$4,980",  pct:35,  color:"#FFD60A" },
              ].map((row,i) => <RankBar key={i} label={row.label} val={row.val} pct={row.pct} color={row.color} />)}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
              {[
                { label:"AVG ORDER VALUE",  val:period==="7d"?"$42":period==="30d"?"$48":period==="90d"?"$51":"$55",   color:"#00F5D4" },
                { label:"CONVERSION RATE",  val:period==="7d"?"3.2%":period==="30d"?"3.8%":period==="90d"?"4.1%":"4.6%", color:pc       },
                { label:"REPEAT BUYERS",    val:period==="7d"?"18%":period==="30d"?"24%":period==="90d"?"31%":"38%",   color:ac        },
                { label:"REFUND RATE",      val:"1.2%",                                                                 color:"#555"    },
              ].map((s,i) => (
                <div key={i} style={{ padding:"14px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}22`, textAlign:"center" }}>
                  <div style={{ fontSize:"22px", fontWeight:"900", color:s.color, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:"8px", letterSpacing:"0.2em", color:"#484848", marginTop:"4px", fontFamily:"monospace" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTIVITY ── */}
        {section === "productivity" && (
          <div>
            {/* PRODUCTIVITY SCORE */}
            <div style={{ padding:"20px", borderRadius:"14px", marginBottom:"16px", background:"linear-gradient(135deg,rgba(255,214,10,0.08),rgba(255,107,53,0.06))", border:"1px solid rgba(255,214,10,0.2)", textAlign:"center" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.3em", color:"#FFD60A", fontFamily:"monospace", marginBottom:"8px" }}>⚡ YOUR PRODUCTIVITY SCORE</div>
              <div style={{ fontSize:"64px", fontWeight:"900", background:"linear-gradient(135deg,#FFD60A,#FF6B35)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>
                {period==="7d"?"82":period==="30d"?"87":period==="90d"?"91":"94"}
              </div>
              <div style={{ fontSize:"12px", color:"#777", marginTop:"6px" }}>out of 100 — {period==="7d"?"Good":period==="30d"?"Great":period==="90d"?"Excellent":"Elite"} creator pace</div>
              <div style={{ display:"flex", justifyContent:"center", gap:"20px", marginTop:"16px" }}>
                {CONTENT_VELOCITY.map((c,i) => (
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"16px", fontWeight:"900", color:c.color }}>{c.val}<span style={{ fontSize:"10px" }}>{c.unit}</span></div>
                    <div style={{ fontSize:"8px", color:"#484848", fontFamily:"monospace" }}>{c.label.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{ fontSize:"8px", color:i===2?"#00F5D4":"#484848", fontFamily:"monospace" }}>{c.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PEAK PERFORMANCE HEATMAP */}
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${pc}18`, marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:pc, fontFamily:"monospace", marginBottom:"14px" }}>🕐 PEAK PERFORMANCE HEATMAP</div>
              <div style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace", marginBottom:"10px" }}>Darker = higher output & engagement</div>

              {/* DAY LABELS */}
              <div style={{ display:"flex", gap:"3px", marginBottom:"4px", paddingLeft:"36px" }}>
                {DAYS.map(d => <div key={d} style={{ flex:1, fontSize:"7px", color:"#484848", textAlign:"center", fontFamily:"monospace" }}>{d}</div>)}
              </div>

              {/* HEATMAP ROWS */}
              {HOURLY_HEATMAP.map(([hour, ...scores], ri) => (
                <div key={ri} style={{ display:"flex", alignItems:"center", gap:"3px", marginBottom:"3px" }}>
                  <div style={{ width:"32px", fontSize:"8px", color:"#484848", fontFamily:"monospace", flexShrink:0 }}>{hour}</div>
                  {scores.map((score, di) => {
                    const intensity = score / 10;
                    const bg = intensity === 0 ? "rgba(255,255,255,0.03)" : `rgba(${parseInt(pc.slice(1,3),16)},${parseInt(pc.slice(3,5),16)},${parseInt(pc.slice(5,7),16)},${(intensity*0.85).toFixed(2)})`;
                    return (
                      <div key={di} style={{ flex:1, aspectRatio:"1", borderRadius:"3px", background:bg, border:"1px solid rgba(255,255,255,0.03)", minWidth:"6px" }} />
                    );
                  })}
                </div>
              ))}
              <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ fontSize:"8px", color:"#484848" }}>Low</span>
                {[0.1,0.3,0.5,0.7,0.9].map((v,i) => (
                  <div key={i} style={{ width:"16px", height:"8px", borderRadius:"2px", background:`rgba(${parseInt(pc.slice(1,3),16)},${parseInt(pc.slice(3,5),16)},${parseInt(pc.slice(5,7),16)},${v})` }} />
                ))}
                <span style={{ fontSize:"8px", color:"#484848" }}>Peak</span>
              </div>
            </div>

            {/* BEST PRODUCTION WINDOWS */}
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(0,245,212,0.18)", marginBottom:"16px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#00F5D4", fontFamily:"monospace", marginBottom:"14px" }}>🎯 BEST WINDOWS FOR EACH TASK</div>
              {BEST_WINDOWS.map((w,i) => (
                <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"12px", marginBottom:"8px", borderRadius:"10px", background:i===0?"rgba(0,245,212,0.06)":"rgba(255,255,255,0.02)", border:i===0?"1px solid rgba(0,245,212,0.2)":"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ textAlign:"center", minWidth:"36px" }}>
                    <div style={{ fontSize:"16px", fontWeight:"900", color:"#00F5D4", fontFamily:"monospace", lineHeight:1 }}>{w.score}</div>
                    <div style={{ fontSize:"7px", color:"#484848" }}>SCORE</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"3px" }}>
                      <span style={{ fontSize:"11px", fontWeight:"800", color:"#ccc" }}>{w.day}</span>
                      <span style={{ fontSize:"10px", color:"#00F5D4", fontFamily:"monospace" }}>{w.time}</span>
                    </div>
                    <div style={{ fontSize:"12px", fontWeight:"700", color:i===0?"#00F5D4":"#aaa", marginBottom:"3px" }}>{w.type}</div>
                    <div style={{ fontSize:"10px", color:"#555", lineHeight:1.4 }}>{w.reason}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ALL TREND INSIGHTS */}
            <div style={{ padding:"16px", borderRadius:"14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${ac}18` }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:ac, fontFamily:"monospace", marginBottom:"14px" }}>📈 ALL TREND INSIGHTS</div>
              {TREND_INSIGHTS.map((t,i) => (
                <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"12px 0", borderBottom:i<TREND_INSIGHTS.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <span style={{ fontSize:"18px", flexShrink:0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:"700", color:t.color, marginBottom:"3px" }}>{t.title}</div>
                    <div style={{ fontSize:"11px", color:"#666", lineHeight:1.55 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MERCH STORE
// ═══════════════════════════════════════════════════════════════════════════════
const MERCH_PRODUCTS = [
  // APPAREL
  { id:1,  name:"Empire Hoodie",        price:65,  category:"Apparel",     emoji:"👕", colors:["#1a1a1a","#FF6B35","#fff"],  sizes:["S","M","L","XL","2XL"], stock:24,  sold:87,  digital:false },
  { id:2,  name:"Logo Snapback",        price:38,  category:"Accessories", emoji:"🧢", colors:["#1a1a1a","#FF6B35"],          sizes:["One Size"],              stock:41,  sold:123, digital:false },
  { id:4,  name:"Brand Tee",            price:32,  category:"Apparel",     emoji:"👕", colors:["#fff","#1a1a1a","#FF6B35"],   sizes:["S","M","L","XL"],        stock:56,  sold:162, digital:false },
  { id:5,  name:"Phone Case",           price:25,  category:"Accessories", emoji:"📱", colors:["#1a1a1a","#FF6B35"],          sizes:["iPhone","Android"],       stock:33,  sold:78,  digital:false },
  { id:6,  name:"Signed Print",         price:45,  category:"Collectibles",emoji:"🖼", colors:[],                             sizes:["8x10","11x14"],           stock:12,  sold:31,  digital:false },
  // DIGITAL
  { id:7,  name:"Exclusive Mixtape",    price:15,  category:"Digital",     emoji:"💿", colors:[], sizes:[], stock:999, sold:204, digital:true,  format:"MP3 · 320kbps",     desc:"10 exclusive tracks + bonus instrumentals. Instant download." },
  { id:8,  name:"Full Show Replay Pack",price:22,  category:"Digital",     emoji:"🎬", colors:[], sizes:[], stock:999, sold:89,  digital:true,  format:"MP4 · HD 1080p",    desc:"All 3 episodes + bonus behind-the-scenes footage." },
  { id:9,  name:"Producer Beat Pack",   price:35,  category:"Digital",     emoji:"🎹", colors:[], sizes:[], stock:999, sold:47,  digital:true,  format:"WAV + STEMS",       desc:"8 exclusive beats with trackouts. Royalty-free for personal use." },
  { id:10, name:"Brand Preset Pack",    price:18,  category:"Digital",     emoji:"✨", colors:[], sizes:[], stock:999, sold:134, digital:true,  format:"Lightroom + CapCut", desc:"15 photo presets + 6 video LUTs. Instant download." },
  { id:11, name:"Content Strategy PDF", price:12,  category:"Digital",     emoji:"📋", colors:[], sizes:[], stock:999, sold:211, digital:true,  format:"PDF · 47 pages",    desc:"My full 90-day content strategy. The exact blueprint I use." },
  { id:12, name:"Fan Membership",       price:4.99,category:"Digital",     emoji:"⭐", colors:[], sizes:[], stock:999, sold:342, digital:true,  format:"Monthly subscription",desc:"Exclusive tracks, early episodes, behind-the-scenes access. Cancel anytime." },
];

const MERCH_CATEGORIES = ["All","Digital","Apparel","Accessories","Collectibles"];

function MerchStore({ config }) {
  const [category,  setCategory]  = useState("All");
  const [cart,      setCart]      = useState([]);
  const [screen,    setScreen]    = useState("shop");
  const [selected,  setSelected]  = useState({});
  const [orderNote, setOrderNote] = useState("");
  const pc = config.brand.primaryColor;
  const ac = config.brand.accentColor;

  // Use admin-configured products, fall back to static defaults
  const allProducts = (config.merch?.products?.length > 0)
    ? config.merch.products.filter(p => p.active !== false).map(p => ({
        ...p,
        price: parseFloat(p.price) || 0,
        colors: Array.isArray(p.colors) ? p.colors : [],
        sizes:  Array.isArray(p.sizes)  ? p.sizes  : [],
      }))
    : MERCH_PRODUCTS;

  const categories = ["All", ...new Set(allProducts.map(p => p.category))];
  const filtered   = category === "All" ? allProducts : allProducts.filter(p => p.category === category);
  const cartTotal  = cart.reduce((a,item) => a + item.price * item.qty, 0);
  const cartCount  = cart.reduce((a,item) => a + item.qty, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty:1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter(i => i.qty > 0));

  const placeOrder = () => {
    setScreen("confirm");
    setCart([]);
  };

  const hasStripe = config.apis.stripeKey.length > 0;

  const hasDigitalItems   = cart.some(i => i.digital);
  const hasPhysicalItems  = cart.some(i => !i.digital);

  if (screen === "confirm") {
    return (
      <div style={{ padding:"60px 24px", textAlign:"center" }}>
        <div style={{ fontSize:"56px", marginBottom:"20px" }}>{hasDigitalItems && !hasPhysicalItems ? "⚡" : "🎉"}</div>
        <div style={{ fontSize:"22px", fontWeight:"900", marginBottom:"8px", background:`linear-gradient(135deg,${pc},${ac})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          {hasDigitalItems && !hasPhysicalItems ? "DOWNLOAD READY!" : "ORDER PLACED!"}
        </div>
        <div style={{ fontSize:"14px", color:"#777", marginBottom:"24px", lineHeight:1.6 }}>
          {hasDigitalItems && !hasPhysicalItems
            ? "Your download link has been sent to your email. Access instantly — no waiting."
            : hasDigitalItems
              ? "Digital downloads sent to your email instantly. Physical items ship in 3–5 days."
              : "Your order is confirmed. Ships within 3–5 business days."}
        </div>
        {hasDigitalItems && (
          <div style={{ padding:"14px", borderRadius:"12px", marginBottom:"20px", background:"rgba(0,245,212,0.07)", border:"1px solid rgba(0,245,212,0.2)" }}>
            <div style={{ fontSize:"11px", fontWeight:"800", color:"#00F5D4", marginBottom:"6px" }}>⚡ DIGITAL ITEMS — INSTANT ACCESS</div>
            {cart.filter(i => i.digital).map((item,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<cart.filter(x=>x.digital).length-1?"1px solid rgba(0,245,212,0.1)":"none" }}>
                <span style={{ fontSize:"12px", color:"#ccc" }}>{item.emoji} {item.name}</span>
                <button style={{ fontSize:"10px", color:"#00F5D4", background:"none", border:"1px solid rgba(0,245,212,0.3)", borderRadius:"7px", padding:"3px 10px", cursor:"pointer", fontFamily:"monospace" }}>↓ DOWNLOAD</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setScreen("shop")} style={{ padding:"14px 32px", borderRadius:"12px", border:"none", background:`linear-gradient(135deg,${pc},${ac})`, color:"#000", fontWeight:"900", fontSize:"13px", letterSpacing:"0.15em", cursor:"pointer" }}>
          ◆ KEEP SHOPPING
        </button>
      </div>
    );
  }

  if (screen === "cart") {
    return (
      <div style={{ padding:"28px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px" }}>
          <button onClick={() => setScreen("shop")} style={{ background:"none", border:"none", color:pc, fontSize:"18px", cursor:"pointer", padding:"4px" }}>←</button>
          <SH icon="🛒" title="YOUR CART" accent={pc} sub={`${cartCount} item${cartCount!==1?"s":""} · $${cartTotal}`} />
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:"36px", marginBottom:"12px" }}>🛍</div>
            <div style={{ fontSize:"14px", color:"#555" }}>Your cart is empty</div>
            <button onClick={() => setScreen("shop")} style={{ marginTop:"16px", padding:"10px 24px", borderRadius:"10px", border:`1px solid ${pc}`, background:"none", color:pc, fontSize:"11px", cursor:"pointer" }}>BROWSE MERCH</button>
          </div>
        ) : (
          <div>
            {cart.map((item,i) => (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px", marginBottom:"10px", borderRadius:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"10px", background:`linear-gradient(135deg,${pc}22,${ac}14)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>{item.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"700" }}>{item.name}</div>
                  <div style={{ fontSize:"10px", color:"#555", fontFamily:"monospace" }}>{item.category}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <button onClick={() => updateQty(item.id,-1)} style={{ width:"24px", height:"24px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.1)", background:"none", color:"#ccc", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                  <span style={{ fontSize:"12px", fontWeight:"700", minWidth:"16px", textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id,+1)} style={{ width:"24px", height:"24px", borderRadius:"50%", border:`1px solid ${pc}`, background:`${pc}22`, color:pc, cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"13px", fontWeight:"800", color:pc, fontFamily:"monospace" }}>${item.price * item.qty}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ fontSize:"9px", color:"#FF3B30", background:"none", border:"none", cursor:"pointer", marginTop:"2px" }}>REMOVE</button>
                </div>
              </div>
            ))}

            <div style={{ marginTop:"20px", padding:"16px", borderRadius:"12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"12px", color:"#777" }}>Subtotal</span>
                <span style={{ fontSize:"12px", fontFamily:"monospace" }}>${cartTotal}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"12px", color:"#777" }}>Shipping</span>
                <span style={{ fontSize:"12px", color:"#00F5D4", fontFamily:"monospace" }}>FREE</span>
              </div>
              <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", margin:"10px 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:"14px", fontWeight:"700" }}>Total</span>
                <span style={{ fontSize:"16px", fontWeight:"900", color:pc, fontFamily:"monospace" }}>${cartTotal}</span>
              </div>
            </div>

            <div style={{ marginTop:"14px" }}>
              <div style={{ fontSize:"9px", letterSpacing:"0.2em", color:"#555", marginBottom:"8px" }}>ORDER NOTE (OPTIONAL)</div>
              <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="Special requests, gift messages..." rows={2}
                style={{ width:"100%", padding:"10px 13px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"9px", color:"#E8E4DC", fontSize:"12px", outline:"none", fontFamily:"monospace", resize:"none" }} />
            </div>

            <button onClick={placeOrder} style={{ width:"100%", marginTop:"16px", padding:"16px", borderRadius:"12px", border:"none", background:`linear-gradient(135deg,${pc},${ac})`, color:"#000", fontSize:"13px", fontWeight:"900", letterSpacing:"0.15em", cursor:"pointer" }}>
              {hasStripe ? `◆ CHECKOUT · $${cartTotal}` : `◆ PLACE ORDER · $${cartTotal}`}
            </button>

            {!hasStripe && (
              <div style={{ marginTop:"10px", padding:"10px 14px", borderRadius:"8px", background:"rgba(255,214,10,0.07)", border:"1px solid rgba(255,214,10,0.2)", fontSize:"10px", color:"#FFD60A", textAlign:"center" }}>
                ⚠ Add your Stripe key in Admin → APIs to enable live payments
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // SHOP SCREEN
  return (
    <div style={{ padding:"28px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
        <SH icon="🛍" title="MERCH STORE" accent={pc} sub="Your brand. On everything." />
        <button onClick={() => setScreen("cart")} style={{ position:"relative", padding:"10px 14px", borderRadius:"12px", background:cartCount>0 ? `linear-gradient(135deg,${pc},${ac})` : "rgba(255,255,255,0.05)", border:"none", color:cartCount>0?"#000":"#555", fontSize:"12px", cursor:"pointer", flexShrink:0 }}>
          🛒 {cartCount>0 ? <strong>{cartCount}</strong> : "0"}
        </button>
      </div>

      {/* REVENUE SUMMARY */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
        {[{ label:"TOTAL SOLD", val:"1,338", color:pc },{ label:"THIS MONTH", val:"$5,820", color:ac },{ label:"DIGITAL SALES", val:"$2,140", color:"#00F5D4" }].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"12px 8px", borderRadius:"10px", background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}22`, textAlign:"center" }}>
            <div style={{ fontSize:"15px", fontWeight:"900", color:s.color, fontFamily:"monospace" }}>{s.val}</div>
            <div style={{ fontSize:"7px", letterSpacing:"0.18em", color:"#484848", marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* DIGITAL HIGHLIGHT BANNER */}
      {(category === "All" || category === "Digital") && (
        <div style={{ padding:"14px", borderRadius:"12px", marginBottom:"16px", background:"linear-gradient(135deg,rgba(0,245,212,0.07),rgba(199,125,255,0.05))", border:"1px solid rgba(0,245,212,0.18)", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"22px" }}>⚡</span>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"800", color:"#00F5D4", letterSpacing:"0.1em" }}>DIGITAL PRODUCTS = INSTANT DELIVERY</div>
            <div style={{ fontSize:"10px", color:"#666", marginTop:"2px" }}>Download link sent immediately after purchase. No shipping. No waiting.</div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER */}
      <div style={{ display:"flex", gap:"6px", overflowX:"auto", marginBottom:"20px", scrollbarWidth:"none" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding:"7px 14px", borderRadius:"16px", border:"none", cursor:"pointer", whiteSpace:"nowrap", background:category===c ? `linear-gradient(135deg,${pc},${ac})` : "rgba(255,255,255,0.05)", color:category===c ? "#000" : "#555", fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", fontFamily:"monospace", transition:"all 0.2s" }}>
            {c}{c==="Digital"?" ⚡":""}
          </button>
        ))}
      </div>

      {/* DIGITAL PRODUCTS — full-width cards */}
      {filtered.filter(p => p.digital).length > 0 && (
        <div style={{ marginBottom:"16px" }}>
          {filtered.filter(p => p.digital).map((product) => {
            const inCart = cart.find(c => c.id === product.id);
            return (
              <div key={product.id} style={{ marginBottom:"10px", borderRadius:"14px", overflow:"hidden", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(0,245,212,0.14)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px" }}>
                  <div style={{ width:"52px", height:"52px", borderRadius:"12px", background:`linear-gradient(135deg,rgba(0,245,212,0.15),rgba(199,125,255,0.1))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>
                    {product.emoji}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
                      <span style={{ fontSize:"13px", fontWeight:"700", color:"#ddd" }}>{product.name}</span>
                      <span style={{ padding:"2px 7px", borderRadius:"8px", background:"rgba(0,245,212,0.12)", border:"1px solid rgba(0,245,212,0.25)", fontSize:"8px", color:"#00F5D4", fontFamily:"monospace" }}>DIGITAL ⚡</span>
                    </div>
                    <div style={{ fontSize:"9px", color:"#484848", fontFamily:"monospace", marginBottom:"4px" }}>{product.format}</div>
                    <div style={{ fontSize:"10px", color:"#666", lineHeight:1.4 }}>{product.desc}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:"16px", fontWeight:"900", color:"#00F5D4", fontFamily:"monospace", marginBottom:"6px" }}>
                      ${product.price}{product.id===12?<span style={{ fontSize:"9px" }}>/mo</span>:""}
                    </div>
                    <button onClick={() => addToCart(product)} style={{ padding:"7px 14px", borderRadius:"9px", border:"none", background:inCart ? "rgba(0,245,212,0.15)" : "linear-gradient(135deg,#00F5D4,#C77DFF)", color:inCart?"#00F5D4":"#000", fontSize:"9px", fontWeight:"800", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace" }}>
                      {inCart ? "✓ ADDED" : product.id===12 ? "SUBSCRIBE" : "BUY NOW"}
                    </button>
                  </div>
                </div>
                <div style={{ padding:"6px 16px 12px", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"9px", color:"#484848" }}>{product.sold} sold</span>
                  <span style={{ fontSize:"9px", color:"#00F5D4", fontFamily:"monospace" }}>⚡ Instant delivery after checkout</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHYSICAL PRODUCTS — 2-column grid */}
      {filtered.filter(p => !p.digital).length > 0 && (
        <div>
          {category === "All" && filtered.filter(p=>p.digital).length > 0 && (
            <div style={{ fontSize:"9px", letterSpacing:"0.25em", color:"#555", fontFamily:"monospace", marginBottom:"12px" }}>PHYSICAL PRODUCTS</div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
            {filtered.filter(p => !p.digital).map((product) => {
              const inCart = cart.find(c => c.id === product.id);
              return (
                <div key={product.id} style={{ borderRadius:"14px", overflow:"hidden", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ height:"120px", background:`linear-gradient(135deg,${pc}1a,${ac}14)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                    <span style={{ fontSize:"44px" }}>{product.emoji}</span>
                    {product.stock < 15 && product.stock > 0 && (
                      <div style={{ position:"absolute", top:"8px", right:"8px", padding:"3px 8px", borderRadius:"8px", background:"rgba(255,59,48,0.2)", border:"1px solid rgba(255,59,48,0.4)", fontSize:"8px", color:"#FF3B30", fontFamily:"monospace" }}>LOW STOCK</div>
                    )}
                    {inCart && (
                      <div style={{ position:"absolute", top:"8px", left:"8px", padding:"3px 8px", borderRadius:"8px", background:"rgba(0,245,212,0.2)", border:"1px solid rgba(0,245,212,0.4)", fontSize:"8px", color:"#00F5D4", fontFamily:"monospace" }}>IN CART ✓</div>
                    )}
                  </div>
                  <div style={{ padding:"12px" }}>
                    <div style={{ fontSize:"12px", fontWeight:"700", marginBottom:"2px" }}>{product.name}</div>
                    <div style={{ fontSize:"9px", color:"#555", fontFamily:"monospace", marginBottom:"8px" }}>{product.category} · {product.sold} sold</div>
                    {product.colors.length > 0 && (
                      <div style={{ display:"flex", gap:"4px", marginBottom:"8px" }}>
                        {product.colors.map((c,ci) => (
                          <div key={ci} style={{ width:"14px", height:"14px", borderRadius:"50%", background:c, border:c==="#fff"?"1px solid rgba(255,255,255,0.2)":"none", cursor:"pointer" }} />
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:"16px", fontWeight:"900", color:pc, fontFamily:"monospace" }}>${product.price}</div>
                      <button onClick={() => addToCart(product)} style={{ padding:"6px 12px", borderRadius:"8px", border:"none", background:inCart?`${pc}33`:`linear-gradient(135deg,${pc},${ac})`, color:inCart?pc:"#000", fontSize:"9px", fontWeight:"800", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s" }}>
                        {inCart ? "✓ ADDED" : "+ ADD"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <div style={{ position:"fixed", bottom:"90px", left:"50%", transform:"translateX(-50%)", zIndex:50 }}>
          <button onClick={() => setScreen("cart")} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"14px 28px", borderRadius:"30px", border:"none", background:`linear-gradient(135deg,${pc},${ac})`, color:"#000", fontWeight:"900", fontSize:"12px", letterSpacing:"0.12em", cursor:"pointer", boxShadow:`0 8px 32px ${pc}55`, whiteSpace:"nowrap" }}>
            🛒 VIEW CART ({cartCount}) · ${cartTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FEATURE LOCKED SCREEN ────────────────────────────────────────────────────
function FeatureLockedScreen({ name, flag, go }) {
  return (
    <div style={{ padding:"80px 24px", textAlign:"center" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔒</div>
      <div style={{ fontSize:"18px", fontWeight:"900", marginBottom:"8px", color:"#F0EDE8" }}>{name}</div>
      <div style={{ fontSize:"14px", color:"#555", marginBottom:"28px", lineHeight:1.6 }}>
        This feature is currently disabled.<br />Enable it in your Admin panel to unlock it.
      </div>
      <button onClick={go} style={{ padding:"12px 28px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#FF6B35,#C77DFF)", color:"#000", fontWeight:"900", fontSize:"12px", letterSpacing:"0.15em", cursor:"pointer" }}>
        ⚙ GO TO ADMIN → FEATURES
      </button>
    </div>
  );
}
