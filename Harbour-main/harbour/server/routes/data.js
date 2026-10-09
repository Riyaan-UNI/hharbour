import { Router } from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const router = Router();
const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
async function readData(name) { return JSON.parse(await readFile(path.join(dataDir, name), "utf8")); }
router.get("/checklist", async (req, res) => {
  try {
    const country = String(req.query.country || "").toUpperCase();
    const rows = await readData("checklist.json");
    res.json(rows.filter((item) => !item.countries?.length || item.countries.includes(country)));
  } catch { res.status(500).json({ error: "Checklist data could not be loaded." }); }
});
router.get("/scams/recent", async (_req, res) => { try { res.json(await readData("scams.json")); } catch { res.status(500).json({ error: "Scam data could not be loaded." }); } });
router.get("/services", async (_req, res) => { try { res.json(await readData("services.json")); } catch { res.status(500).json({ error: "Service data could not be loaded." }); } });
export default router;
