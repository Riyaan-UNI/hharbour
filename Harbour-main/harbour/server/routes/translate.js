import { Router } from "express";
import { translateToCantonese } from "../ai/baidu.js";

const router = Router();
router.post("/translate", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) return res.status(400).json({ error: "Enter text to translate." });
  if (text.length > 5000) return res.status(400).json({ error: "Please keep the text under 5,000 characters." });
  try { res.json({ translation: await translateToCantonese(text) }); }
  catch (error) { res.status(503).json({ error: error.message || "Translation is temporarily unavailable." }); }
});
export default router;
