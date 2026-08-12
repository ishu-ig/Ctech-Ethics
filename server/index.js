const express = require("express")
const cors = require("cors")
const path = require('path')
require("dotenv").config()

require("./db_connect")

const Router = require("./routes/index")
const app = express()

var whitelist = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:4000',
    'http://localhost:5000',
    'https://my-portfolio-x6zy.onrender.com',
    'https://my-portfolioadmin.vercel.app'
]

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error: You are not authorized to access this API'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/public", express.static("public"))

// Define API routes first
app.use("/api", Router)

// Serve React frontend static files
app.use(express.static(path.join(__dirname, "admin/build")))

// ✅ FIXED: The catch-all route must be "*" so React Router can handle the client-side routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "admin/build", "index.html"))
})

let port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`)
})