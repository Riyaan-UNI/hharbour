import { BrowserRouter, NavLink, Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProfileProvider, useProfile } from "./context/ProfileContext.jsx";
import Welcome from "./pages/Welcome.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Home from "./pages/Home.jsx";
import Shield from "./pages/Shield.jsx";
import Translate from "./pages/Translate.jsx";
import Checklist from "./pages/Checklist.jsx";
import Chat from "./pages/Chat.jsx";
import Community from "./pages/Community.jsx";
import VoiceSOS from "./pages/VoiceSOS.jsx";
import TideBank from "./pages/TideBank.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import People from "./pages/People.jsx";
import BunnyGarden from "./pages/BunnyGarden.jsx";
const LandInScene = lazy(() => import("./components/LandInScene.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

function ArrivalTransition({ onDone }) {
  const [closing, setClosing] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finish = useCallback(() => setClosing(true), []);
  useEffect(() => { const timer = window.setTimeout(finish, 5600); return () => window.clearTimeout(timer); }, [finish]);
  useEffect(() => { if (!closing) return undefined; const timer = window.setTimeout(() => onDoneRef.current(), 850); return () => window.clearTimeout(timer); }, [closing]);
  return <div className={`voyage ${closing ? "closing" : ""}`} onClick={finish} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") finish(); }} role="button" tabIndex={0} aria-label="Skip the arrival animation and continue">
    <div className="portal-circle"/><div className="voyage-black"/>
    <div className="voyage-world"><Suspense fallback={<div className="landin-loading"/>}><LandInScene mode="arrival"/></Suspense></div>
    <p>Click anywhere to skip</p>
  </div>;
}
function Shell() {
  const { profile } = useProfile(); const navigate = useNavigate(); const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const previousPath = useRef(pathname);
  const [arriving, setArriving] = useState(false);
  useLayoutEffect(() => {
    const fromLanding = previousPath.current === "/";
    previousPath.current = pathname;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setArriving(fromLanding && !reduced && ["/login", "/onboarding"].includes(pathname));
  }, [pathname]);
  const entryPage = ["/", "/login", "/onboarding"].includes(pathname);
  const links = [["Home", "/home"], ["Scam X-ray", "/shield"], ["Settle-in list", "/checklist"], ["Cantonese helper", "/translate"], ["Ask Harbour", "/chat"]];
  const moreLinks = [["Dashboard", "/dashboard"], ["Find people", "/people"], ["Bunny garden", "/bunny-garden"], ["Community", "/community"], ["Tide Bank", "/tide-bank"], ["Voice SOS", "/voice-sos"]];
  const currentTitle = ["/home", "/dashboard"].includes(pathname) ? "My Harbour" : links.find(([, path]) => path === pathname)?.[0] || ({ "/profile": "Your profile", "/people": "Find people", "/bunny-garden": "Bunny’s garden", "/community": "Community", "/voice-sos": "Voice SOS", "/tide-bank": "Tide Bank" }[pathname]) || (pathname.startsWith("/profile/") ? "Community profile" : "Harbour");
  if (entryPage) return <div className="app-shell entry-shell"><main className="entry-area"><Routes><Route path="/" element={<Welcome />} /><Route path="/login" element={<Login />} /><Route path="/onboarding" element={<Onboarding />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></main>{arriving && <ArrivalTransition onDone={() => setArriving(false)}/>}</div>;
  return <div className="portal-shell"><aside className={`portal-nav ${menuOpen ? "open" : ""}`}><button className="brand" onClick={() => navigate("/home")}><span className="brand-mark"><img src="/harbour-mark.svg" alt=""/></span><span>Harbour</span></button><nav aria-label="Harbour navigation"><div className="nav-group-label">YOUR HARBOUR</div>{links.map(([label, path], index) => <NavLink end key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><span>{index === 0 ? "⌂" : `0${index}`}</span>{label}</NavLink>)}<div className="nav-group-label nav-more-label">MORE TO EXPLORE</div>{moreLinks.map(([label, path], index) => <NavLink end key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><span>{["↗", "◎", "◌", "✳", "≈", "♡"][index]}</span>{label}</NavLink>)}<NavLink end to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><span>◉</span>Your profile</NavLink></nav><button className="back-site" onClick={() => { setMenuOpen(false); navigate("/"); }}>← Public site</button></aside>{menuOpen && <button className="portal-nav-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)}/>}<main className="portal-main"><header className="portal-top"><button className="portal-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button><span>{currentTitle}</span><button className="profile-chip" onClick={() => navigate("/dashboard")} aria-label={`Open ${profile?.name || "your"} dashboard`}>{profile?.photo ? <img src={profile.photo} alt=""/> : <span>{profile?.name?.[0]?.toUpperCase() || "S"}</span>}<strong>{profile?.name || "Your profile"}</strong></button></header><Routes><Route path="/home" element={<Home />} /><Route path="/dashboard" element={<Suspense fallback={<section className="page dashboard-skeleton" aria-label="Loading dashboard"><i/><i/><i/><b/><b/></section>}><Dashboard /></Suspense>} /><Route path="/profile" element={<Profile />} /><Route path="/profile/:userId" element={<Profile />} /><Route path="/people" element={<People />} /><Route path="/bunny-garden" element={<BunnyGarden />} /><Route path="/shield" element={<Shield />} /><Route path="/translate" element={<Translate />} /><Route path="/checklist" element={<Checklist />} /><Route path="/chat" element={<Chat />} /><Route path="/community" element={<Community />} /><Route path="/voice-sos" element={<VoiceSOS />} /><Route path="/tide-bank" element={<TideBank />} /><Route path="*" element={<Navigate to="/home" replace />} /></Routes></main></div>;
}
export default function App() { return <ProfileProvider><BrowserRouter><Shell /></BrowserRouter></ProfileProvider>; }
