import { useState } from "react";
import { sendChat } from "../lib/api.js";
import Button from "../components/Button.jsx";
import ToolPageHeading from "../components/ToolPageHeading.jsx";

const suggestions = ["How do I use the MTR?", "Where can I get a SIM card?", "What is an Octopus card?"];
export default function Chat() {
  const [message, setMessage] = useState(""); const [reply, setReply] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); if (!message.trim()) return; setBusy(true); setError(""); setReply(""); try { setReply((await sendChat(message.trim())).reply); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <section className="page figma-toolpage ask-page"><ToolPageHeading narrow eyebrow="GUIDANCE · DEMO" title={<>No question<br/>is too small.</>} description="Ask about everyday student life. Type ‘error’ to preview a fallback state."/>
    <div className="ask-suggestions">{suggestions.map(item => <button type="button" key={item} onClick={() => { setMessage(item); setError(""); }}>{item}<span>↗</span></button>)}</div>
    <form className="ask-form-card" onSubmit={submit}><label htmlFor="chat-message">Your question</label><div className="ask-input-row"><textarea id="chat-message" value={message} onChange={event => setMessage(event.target.value)} maxLength="3000" placeholder="Ask Harbour anything about settling in…"/><Button disabled={busy || !message.trim()}>{busy ? "Thinking…" : "Ask Harbour"}<span>↗</span></Button></div><span className="field-count">{message.length} / 3,000</span></form>
    {busy && <article className="ask-reply-card ask-loading" aria-label="Harbour is preparing an answer"><span className="eyebrow">HARBOUR IS THINKING</span><i/><i/><i/></article>}{error && <article className="ask-reply-card ask-error" role="alert"><span className="eyebrow">A SMALL PAUSE</span><p>{error}</p></article>}{reply && <article className="ask-reply-card"><span className="eyebrow">HARBOUR SAYS</span><p>{reply}</p><small>General information only. Check official sources for important decisions.</small></article>}
  </section>;
}
