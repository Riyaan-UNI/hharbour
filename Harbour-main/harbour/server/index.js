import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scamRouter from "./routes/scam.js";
import translateRouter from "./routes/translate.js";
import chatRouter from "./routes/chat.js";
import dataRouter from "./routes/data.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/scam", scamRouter);
app.use("/api", translateRouter);
app.use("/api", chatRouter);
app.use("/api", dataRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
