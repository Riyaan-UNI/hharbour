import { useState } from "react";
import { analyzeScam } from "../lib/api.js";
import Button from "../components/Button.jsx";
import ToolPageHeading from "../components/ToolPageHeading.jsx";

const sample = "Your parcel is waiting. Pay a small redelivery fee now: hxxps://hk-post.example/claim. Reply with your bank card details to avoid return.";
export default function Shield() {
  const [text, setText] = useState(""); const [result, setResult] = useState(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); if (!text.trim()) return; setBusy(true); setError(""); setResult(null); try { setResult(await analyzeScam(text.trim())); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <section className="page figma-toolpage scam-page">
    <ToolPageHeading eyebrow="SAFETY TOOL · DEMO" title={<>Look beneath the<br className="desktop-break"/> message.</>} description="Paste suspicious text. This pattern check is educational, not a verified result." />
    <div className="scam-workspace"><form className="scam-input-card" onSubmit={submit}><label htmlFor="scam-text">Suspicious message</label><textarea id="scam-text" value={text} onChange={event => setText(event.target.value)} maxLength="8000" placeholder="Paste a message, link or offer here…"/><div className="scam-controls"><button type="button" className="sample-link" onClick={() => { setText(sample); setResult(null); setError(""); }}>Use fictional sample</button><Button disabled={busy || !text.trim()}>{busy ? "Checking…" : "X-ray this message"}<span>↗</span></Button></div><span className="field-count">{text.length} / 8,000</span></form>
      {!result && !error && <div className={`scam-result-placeholder ${busy ? "is-busy" : ""}`} aria-live="polite">{busy ? <><span className="result-pulse">◎</span><strong>Looking for patterns…</strong><div className="loading-lines"><i/><i/><i/></div></> : <><span className="result-target">◎</span><strong>Your result will appear here</strong><p>We’ll explain patterns and offer cautious<br className="desktop-break"/> next steps.</p></>}</div>}
      {error && <div className="scam-result-placeholder scam-result-error" role="alert"><span className="result-target">!</span><strong>We couldn’t check this message.</strong><p>{error}</p></div>}
      {result && <article className="scam-result-card"><div className="scam-result-top"><span className="eyebrow">YOUR MESSAGE REVIEW</span><span className={`risk ${result.riskLevel.toLowerCase()}`}>{result.riskLevel} risk</span></div><h2>{result.issue}</h2><p>{result.explanation}</p><div className="result-columns"><div><h3>Signals to notice</h3><ul>{result.warningSigns.map((item, index) => <li key={index}>{item}</li>)}</ul></div><div><h3>What you can do</h3><ul>{result.actions.map((item, index) => <li key={index}>{item}</li>)}</ul></div></div><div className="support-line"><span>NEED A SECOND OPINION?</span><strong>{result.support.name} · <a href={`tel:${result.support.phone}`}>{result.support.phone}</a></strong></div></article>}</div>
    <p className="figma-tool-note">Harbour offers general guidance, not an official determination. When unsure, contact the organisation through its official channels.</p>
  </section>;
}
