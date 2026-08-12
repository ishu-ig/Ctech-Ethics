const express = require('express')
const cors = require("cors");
require('dotenv').config()
const app = express()
require('./db_connect')

const Router = require("./routes/index")


const whitelist = [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:8000",
];

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS Error"));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api", Router)

// Serve React frontend
app.use("", express.static(path.join(__dirname, "admin/build")))
app.get("/{*path}", (req, res) => {                  // ✅ FIXED: was "*"
    res.sendFile(path.join(__dirname, "admin/build", "index.html"))
})

let port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`)
})