// backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { ensureSuperAdmin } = require("./utils/initAdmin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

// ===== CORS (unique) =====
const PROD_ORIGIN = process.env.FRONTEND_URL; // ex: https://chezmamier egine.vercel.app
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // health/Postman
    if (PROD_ORIGIN && origin === PROD_ORIGIN) return cb(null, true);             // prod
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return cb(null, true); // previews
    if (origin === "http://localhost:5173") return cb(null, true);                 // dev
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // préflight global

// Court-circuiter TOUTES les OPTIONS pour éviter 500 côté routeurs
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ===== Health =====
app.get("/health", (_req, res) => res.send("ok"));
app.get("/api/health", (_req, res) => res.send("ok"));

// ===== Fichiers statiques =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Helper de montage sécurisé (diagnostic) =====
function safeMount(prefix, file) {
  try {
    const router = require(file);
    app.use(prefix, router);
    console.log("Mounted OK ->", prefix, "from", file);
  } catch (e) {
    console.error("❌ Failed mounting", prefix, "from", file);
    console.error("   Error:", e && e.message);
    console.error("STACK:", e && e.stack);
    process.exit(1);
  }
}

// ===== Routes API =====
safeMount("/api/admin",        "./routes/adminRoutes");
safeMount("/api/auth",         "./routes/clientAuthRoutes");
safeMount("/api/admin/clients","./routes/clientBackRoutes");
safeMount("/api/categories",   "./routes/categoryRoutes");
safeMount("/api/plats",        "./routes/platRoutes");
safeMount("/api/commandes",    "./routes/commandeRoutes");
safeMount("/api/public",       "./routes/publicRoutes");
safeMount("/api/uploads",      "./routes/uploadRoutes");

// ===== 404 & erreurs =====
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

// ===== Boot =====
(async () => {
  await connectDB();
  await ensureSuperAdmin();
})();

app.listen(PORT, () => {
  console.log("API running on port", PORT);
});
