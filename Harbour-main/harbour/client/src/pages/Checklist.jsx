import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext.jsx";
import { getChecklist } from "../lib/api.js";
import ToolPageHeading from "../components/ToolPageHeading.jsx";

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
function createId() { return globalThis.crypto?.randomUUID?.() || `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export default function Checklist() {
  const { profile } = useProfile();
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(() => read("harbour-checklist", {}));
  const [customLists, setCustomLists] = useState(() => read("harbour-custom-lists", []));
  const [newListTitle, setNewListTitle] = useState("");
  const [newItems, setNewItems] = useState({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const celebrationTimer = useRef(null);

  useEffect(() => {
    let current = true;
    setLoaded(false);
    getChecklist(profile?.country || "").then(result => { if (current) { setItems(result); setError(""); } }).catch(error => { if (current) setError(error.message); }).finally(() => { if (current) setLoaded(true); });
    return () => { current = false; };
  }, [profile?.country]);
  useEffect(() => () => window.clearTimeout(celebrationTimer.current), []);

  const coreTasks = useMemo(() => items.flatMap(item => item.steps.map((step, index) => ({ id: `${item.id}-${index}`, text: step }))), [items]);
  const allTasks = [...coreTasks, ...customLists.flatMap(list => list.items.map(item => ({ id: item.id, text: item.text })))];
  const count = allTasks.filter(task => done[task.id]).length;
  const progress = allTasks.length ? count / allTasks.length * 100 : 0;

  function toggle(id) {
    const wasDone = !!done[id];
    const next = { ...done, [id]: !wasDone };
    setDone(next);
    localStorage.setItem("harbour-checklist", JSON.stringify(next));
    const nextCount = count + (wasDone ? -1 : 1);
    try {
      const history = read("harbour-progress-history", {});
      history[new Date().toISOString().slice(0, 10)] = nextCount;
      localStorage.setItem("harbour-progress-history", JSON.stringify(history));
      window.dispatchEvent(new Event("harbour-progress"));
    } catch { /* Keep checklist interaction available if browser storage is full. */ }
    if (!wasDone && allTasks.length > 0 && nextCount === allTasks.length) {
      setCelebrate(true);
      window.clearTimeout(celebrationTimer.current);
      celebrationTimer.current = window.setTimeout(() => setCelebrate(false), 5200);
    }
  }

  function addList(event) {
    event.preventDefault();
    const title = newListTitle.trim();
    if (!title) return;
    const next = [...customLists, { id: createId(), title, items: [] }];
    setCustomLists(next);
    localStorage.setItem("harbour-custom-lists", JSON.stringify(next));
    setNewListTitle("");
  }
  function addItem(event, listId) {
    event.preventDefault();
    const text = (newItems[listId] || "").trim();
    if (!text) return;
    const next = customLists.map(list => list.id === listId ? { ...list, items: [...list.items, { id: createId(), text }] } : list);
    setCustomLists(next);
    localStorage.setItem("harbour-custom-lists", JSON.stringify(next));
    setNewItems({ ...newItems, [listId]: "" });
  }
  function removeList(listId) {
    const removed = customLists.find(list => list.id === listId);
    const next = customLists.filter(list => list.id !== listId);
    const nextDone = { ...done };
    removed?.items.forEach(item => delete nextDone[item.id]);
    setCustomLists(next);
    setDone(nextDone);
    localStorage.setItem("harbour-custom-lists", JSON.stringify(next));
    localStorage.setItem("harbour-checklist", JSON.stringify(nextDone));
  }

  return <section className="page checklist-page figma-toolpage">
    <ToolPageHeading eyebrow="YOUR PROGRESS" title="Small steps count." description="A practical list that saves automatically on this device."/>
    <div className="figma-progress-card"><div><strong>{count} of {allTasks.length}</strong><span>settling-in tasks complete</span></div><div className="progress-track"><i style={{ width: `${progress}%` }}/></div></div>
    {error && <p className="error-box">{error}</p>}
    {!loaded && <div className="checklist-skeleton" aria-label="Loading checklist"><i/><i/><i/></div>}
    {loaded && !error && !items.length && <p className="loading-note">We couldn’t load the Harbour starter list. Your personal lists are still available below.</p>}
    <div className="figma-checklist-grid">{[items.flatMap(item => item.steps.map((step, stepIndex) => ({ id: `${item.id}-${stepIndex}`, text: step }))).slice(0, 3), items.flatMap(item => item.steps.map((step, stepIndex) => ({ id: `${item.id}-${stepIndex}`, text: step }))).slice(3)].map((group, groupIndex) => <article className="figma-checklist-card" key={groupIndex}><span className="portal-tag">{groupIndex === 0 ? "FIRST 48 HOURS" : "THIS WEEK"}</span>{group.map(task => <label className={`figma-task-row ${done[task.id] ? "checked" : ""}`} key={task.id}><input type="checkbox" checked={!!done[task.id]} onChange={() => toggle(task.id)}/><span className="figma-checkbox"/><span>{task.text}</span><small>{groupIndex === 0 ? "About 10 min" : "When ready"}</small></label>)}</article>)}</div>
    <section className="custom-todos"><div className="custom-todos-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Your own lists</h2><p>Add errands, appointments, or anything you want to remember.</p></div><span className="custom-list-count">{customLists.length} {customLists.length === 1 ? "LIST" : "LISTS"}</span></div>
      <form className="add-list-form" onSubmit={addList}><label className="sr-only" htmlFor="new-list-title">New list name</label><input id="new-list-title" value={newListTitle} onChange={event => setNewListTitle(event.target.value)} placeholder="Name a new list…" maxLength="48"/><button className="button" type="submit" disabled={!newListTitle.trim()}>Create list <span>+</span></button></form>
      {customLists.length === 0 ? <div className="empty-custom-lists"><span>+</span><p>Your personal lists will appear here. Start with a small plan for this week.</p></div> : <div className="custom-list-grid">{customLists.map(list => <article className="custom-list-card" key={list.id}><header><div><span className="eyebrow">YOUR LIST</span><h3>{list.title}</h3></div><button className="remove-list" onClick={() => removeList(list.id)} aria-label={`Remove ${list.title}`}>×</button></header>{list.items.length ? <div className="custom-list-items">{list.items.map(item => <label className={`task ${done[item.id] ? "checked" : ""}`} key={item.id}><input type="checkbox" checked={!!done[item.id]} onChange={() => toggle(item.id)}/><span className="fake-check"/>{item.text}</label>)}</div> : <p className="custom-list-empty">Add the first step to your list.</p>}<form className="add-item-form" onSubmit={event => addItem(event, list.id)}><label className="sr-only" htmlFor={`new-item-${list.id}`}>Add a task to {list.title}</label><input id={`new-item-${list.id}`} value={newItems[list.id] || ""} onChange={event => setNewItems({ ...newItems, [list.id]: event.target.value })} placeholder="Add a task…" maxLength="120"/><button type="submit" disabled={!(newItems[list.id] || "").trim()} aria-label="Add task">+</button></form></article>)}</div>}
    </section>
    {celebrate && <div className="celebration-toast" role="status" aria-live="polite"><span className="celebration-spark">✳</span><strong>You did it. Every step is checked off.</strong><small>Take a breath and enjoy the progress.</small><div className="celebration-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--confetti-index": index, "--confetti-x": `${(index * 41 + 13) % 100}%` }}/>)}</div></div>}
  </section>;
}
