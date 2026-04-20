const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const next = require("next");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const analysisRoutes = require("./src/routes/analysisRoutes");
const historyRoutes = require("./src/routes/historyRoutes");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "next-client") });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 5000;

nextApp.prepare().then(async () => {
  await connectDB();

  const app = express();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, message: "MedRx API is running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/analyze", analysisRoutes);
  app.use("/api/history", historyRoutes);

  // Express 5 / path-to-regexp v8: bare "*" is invalid; delegate remaining requests to Next.
  app.use((req, res) => handle(req, res));

  const HOST = process.env.HOST || "0.0.0.0";
  app.listen(PORT, HOST, () => {
    console.log(`MedRx API + Next on http://localhost:${PORT} (LAN: http://<this-pc-ip>:${PORT})`);
  });
});
