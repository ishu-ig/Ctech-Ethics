const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
require("./db_connect");

const Router = require("./routes/index");

const app = express();

const whitelist = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:4000",
    "http://localhost:5000",
    "https://my-portfolio-x6zy.onrender.com",
    "https://my-portfolioadmin.vercel.app",
    "https://ctech-ethics.onrender.com"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(
                new Error("CORS Error: You are not authorized to access this API")
            );
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", Router);

// Admin build is INSIDE server/admin/build
const adminBuildPath = path.join(__dirname, "admin", "build");

app.use(express.static(adminBuildPath));

// Express 5 React Router fallback
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(adminBuildPath, "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});