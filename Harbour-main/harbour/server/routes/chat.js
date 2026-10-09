import { Router } from "express";
import { askAI } from "../ai/client.js";
import { chatPrompt } from "../ai/prompts.js";

const router = Router();
router.post("/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Enter a message." });
  try { res.json({ reply: await askAI(chatPrompt(message)) }); }
  catch (error) { res.status(503).json({ error: error.message || "Harbour guide is temporarily unavailable." }); }
});
export default router;
