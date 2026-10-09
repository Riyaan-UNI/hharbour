import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useProfile } from "../context/ProfileContext.jsx";
import HongKongWeather from "../components/HongKongWeather.jsx";
import Button from "../components/Button.jsx";

const tools = [
  { id: "/shield", number: "01", title: "Scam X-ray", description: "Look beneath suspicious messages.", tone: "portal-coral" },
  { id: "/checklist", number: "02", title: "Settle-in list", description: "Small steps, sorted for Hong Kong.", tone: "portal-blue" },
  { id: "/translate", number: "03", title: "Cantonese helper", description: "Say the useful thing, with context.", tone: "portal-gold" },
  { id: "/chat", number: "04", title: "Ask Harbour", description: "A calm starting point for questions.", tone: "portal-sage" },
];
const events = [
  { id: "clay", day: "18", month: "OCT", title: "Clay afternoon", place: "PMQ, Central" },
  { id: "sunset", day: "21", month: "OCT", title: "Sunset campus walk", place: "HKU MTR Exit A" },
  { id: "cafe", day: "26", month: "OCT", title: "Cantonese café", place: "Sham Shui Po" },
];
const emergency = [
  { name: "Emergency services", number: "999", detail: "Police · Fire · Ambulance", href: "tel:999" },
  { name: "Anti-Scam Helpline", number: "18222", detail: "Hong Kong Police · 24-hour consultation", href: "tel:18222" },
  { name: "Immigration enquiries", number: "2824 6111", detail: "Immigration Department", href: "tel:28246111" },
];
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function weekActivity() {
  const history = read("harbour-progress-history", {});
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - 6 + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { day: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date), steps: Number(history[key] || 0) };
  });
}

export default function Home() {
  const { profile } = useProfile(); const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false); const [savedEvents, setSavedEvents] = useState(() => read("harbour-events-saved", []));
  const [sosOpen, setSosOpen] = useState(false); const [balance] = useState(() => Number(localStorage.getItem("harbour-tide-balance") || 3));
  const [activity, setActivity] = useState(weekActivity);
  const name = profile?.name?.trim() || "friend";
  useEffect(() => { const refresh = () => setActivity(weekActivity()); window.addEventListener("harbour-progress", refresh); window.addEventListener("storage", refresh); return () => { window.removeEventListener("harbour-progress", refresh); window.removeEventListener("storage", refresh); }; }, []);
  const totalSteps = useMemo(() => activity.reduce((sum, day) => sum + day.steps, 0), [activity]);
  const toggleEvent = id => { const next = savedEvents.includes(id) ? savedEvents.filter(item => item !== id) : [...savedEvents, id]; setSavedEvents(next); localStorage.setItem("harbour-events-saved", JSON.stringify(next)); };
  const date = new Intl.DateTimeFormat("en-HK", { weekday: "long", timeZone: "Asia/Hong_Kong" }).format(new Date()).toUpperCase();

  return <div className="portal-content portal-home">
    <section className="portal-welcome"><div><span className="portal-tag">{date} · HONG KONG</span><h1>Good to see you,<br/><span>{name}.</span></h1><p>What would make today feel easier?</p></div><HongKongWeather /></section>
    <section className="tool-cards" aria-label="Harbour tools">{tools.map(tool => <button className={`portal-tool-card ${tool.tone}`} key={tool.id} onClick={() => navigate(tool.id)}><span className="tool-num">{tool.number}</span><span className="portal-round-arrow">↗</span><span className="tool-card-copy"><strong>{tool.title}</strong><small>{tool.description}</small></span></button>)}</section>

    <section className="demo-grid"><article className="sos-card portal-card"><span className="portal-tag warning">SIMULATION</span><h2>Need a friendly voice?</h2><p>Preview a fictional call with Maya, a volunteer guide. No call will be placed.</p><Button variant="secondary" onClick={() => setSosOpen(true)}>Preview Voice SOS <span>↗</span></Button></article>
      <article className="bank-card portal-card"><span className="portal-tag light-outline">TIDE BANK · DEMO</span><p>Local demo balance</p><button className="bank-reveal" onClick={() => setRevealed(!revealed)} aria-label={revealed ? "Hide demo balance" : "Reveal demo balance"}><strong>{revealed ? `HK$ ${balance.toLocaleString("en-HK")}.00` : "HK$ ••••••"}</strong><span>{revealed ? "Hide" : "Reveal"}</span></button><small>Simulation only · No monetary value</small><Link to="/tide-bank" aria-label="Open Tide Bank">Open Tide Bank ↗</Link></article></section>

    <section className="home-activity"><div className="home-activity-heading"><span className="portal-tag">YOUR ACTIVITY</span><span className="activity-total">{totalSteps} steps recorded · LAST 7 DAYS</span></div><div className="home-chart" role="img" aria-label="Your checklist activity over the last seven days"><ResponsiveContainer width="100%" height={230}><LineChart data={activity} margin={{ top: 16, right: 15, left: 5, bottom: 4 }}><CartesianGrid vertical={false} stroke="#d9e1d7" strokeDasharray="5 7"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6b8075", fontSize: 14 }}/><Tooltip cursor={{ stroke: "#9db7ad" }} contentStyle={{ border: "1px solid #d7dfd3", borderRadius: 12, background: "#fffdf7", fontSize: 13 }} formatter={value => [`${value} steps`, "Completed"]}/><Line dataKey="steps" type="monotone" stroke="#477c68" strokeWidth={4} dot={{ r: 6, fill: "#fffdf7", stroke: "#477c68", strokeWidth: 3 }} activeDot={{ r: 8 }} name="Completed"/></LineChart></ResponsiveContainer></div><div className="activity-foot"><strong>{totalSteps} check-ins recorded</strong><span>Progress stays in this browser.</span></div></section>

    <section className="community portal-community"><div className="section-heading-row"><div><span className="portal-tag">COMMUNITY · SIMULATION</span><h2>Good things nearby</h2></div><p>Sample events only. No live matching or booking.</p></div><div className="event-row">{events.map(event => { const saved = savedEvents.includes(event.id); return <article className="portal-event" key={event.id}><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-copy"><h3>{event.title}</h3><p>{event.place}</p><button onClick={() => toggleEvent(event.id)}>{saved ? "Saved sample ✓" : "Save sample ↗"}</button></div></article>; })}</div></section>

    <section className="portal-extras"><div><span className="portal-tag">A LITTLE MORE HARBOUR</span><h2>Your space, your pace.</h2><p>Track your progress, meet sample profiles, or take a break in the garden.</p></div><div className="portal-extra-links"><Link to="/dashboard"><span>↗</span><strong>Your dashboard</strong><small>Progress and profile details</small></Link><Link to="/people"><span>↗</span><strong>Find your people</strong><small>Search the sample directory</small></Link><Link to="/bunny-garden"><span>↗</span><strong>Bunny’s garden</strong><small>A happy little break</small></Link><Link to="/community"><span>↗</span><strong>Community</strong><small>See all sample events</small></Link><Link to="/voice-sos"><span>↗</span><strong>Voice SOS</strong><small>Open the support preview</small></Link></div></section>

    <section className="emergency-ripples"><div className="emergency-heading"><span className="portal-tag">HERE IF YOU NEED IT</span><h2>Useful numbers to keep close.</h2><p>Tap a number to call from your device.</p></div><div className="emergency-numbers">{emergency.map(item => <a key={item.number} href={item.href}><span>{item.name}</span><strong>{item.number}</strong><small>{item.detail}</small></a>)}</div><div className="ripple-art" aria-hidden="true"/></section>

    {sosOpen && <div className="modal-backdrop" role="presentation" onClick={() => setSosOpen(false)}><section className="portal-modal" role="dialog" aria-modal="true" aria-labelledby="sos-preview-title" onClick={event => event.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setSosOpen(false)}>×</button><span className="portal-tag">SAMPLE VOLUNTEER · DEMO</span><h2 id="sos-preview-title">Meet Maya.</h2><p>A fictional volunteer guide for this preview. No call is placed or connected.</p><div className="voice-wave" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.07}s` }}/>)}</div><Button onClick={() => { setSosOpen(false); navigate("/voice-sos"); }}>Explore Voice SOS <span>↗</span></Button></section></div>}
  </div>;
}
