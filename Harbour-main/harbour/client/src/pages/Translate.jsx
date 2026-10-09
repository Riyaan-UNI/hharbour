import { useState } from "react";
import { translateText } from "../lib/api.js";
import Button from "../components/Button.jsx";
import ToolPageHeading from "../components/ToolPageHeading.jsx";

export default function Translate() {
  const [text, setText] = useState(""); const [result, setResult] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); if (!text.trim()) return; setBusy(true); setError(""); setResult(""); try { setResult((await translateText(text.trim())).translation); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <section className="page figma-toolpage translate-page"><ToolPageHeading eyebrow="LANGUAGE TOOL · DEMO" title={<>Say it with<br className="desktop-break"/> confidence.</>} description="Type ‘error’ to preview the error state. Translations are fictional samples."/>
    <form onSubmit={submit}><div className="translate-workspace"><div className="translate-pane"><label htmlFor="translate-text">ENGLISH</label><textarea id="translate-text" value={text} onChange={event => setText(event.target.value)} maxLength="5000" placeholder="What would you like to say?"/><button type="button" className="sample-link" onClick={() => { setText("Where is the nearest MTR station?"); setResult(""); setError(""); }}>Try a sample phrase</button></div><button className="translate-arrow" type="submit" disabled={busy || !text.trim()} aria-label="Translate phrase">{busy ? "···" : "→"}</button><div className={`translate-pane translate-output ${result ? "has-result" : ""}`}><label>CANTONESE · 廣東話</label>{busy ? <div className="translate-skeleton"><i/><i/><i/></div> : error ? <p className="translate-state-error" role="alert">{error}</p> : result ? <p className="translated-copy">{result}</p> : <p className="translate-placeholder">Your translation will appear here.</p>}</div></div><div className="translate-submit"><span className="field-count">{text.length} / 5,000</span><Button disabled={busy || !text.trim()}>{busy ? "Translating…" : "Translate phrase"}<span>↗</span></Button></div></form>
    {result && <p className="figma-tool-note">Machine translation can miss context. For important matters, check with a fluent speaker.</p>}
  </section>;
}
