import { GoogleGenerativeAI } from "@google/generative-ai";

export function parseJSON(value) {
  const cleaned = value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned);
}

export async function askAI(prompt, { json = false } = {}) {
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      return json ? parseJSON(output) : output;
    } catch (error) {
      console.warn("Gemini unavailable; trying Groq fallback.", error.message);
    }
  }
  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.2 }),
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const payload = await response.json();
    const output = payload.choices?.[0]?.message?.content ?? "";
    return json ? parseJSON(output) : output;
  }
  throw new Error("AI is not configured. Add a Gemini or Groq key in server/.env.");
}
