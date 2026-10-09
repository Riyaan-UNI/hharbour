async function request(path, options) { const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again."); return data; }
const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
const get = (path) => request(path);
export const analyzeScam = (text) => post("/api/scam/analyze", { text });
export const translateText = (text) => post("/api/translate", { text });
export const sendChat = (message) => post("/api/chat", { message });
export const getChecklist = (country) => get(`/api/checklist?country=${encodeURIComponent(country || "")}`);
export const getRecentScams = () => get("/api/scams/recent");
export const getServices = () => get("/api/services");
