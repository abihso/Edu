import env from "dotenv"
env.config()
import express from "express"
import { connect } from "./config/db.js"
import studentRoutes from "./routes/student.route.js"
import teacherRoutes from "./routes/teacher.route.js"
import adminRoutes from "./routes/admin.route .js"
import { Student } from "./models/student.model.js"
import generaRoutes from "./routes/general.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"



connect()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({ 
    origin : " http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/students",studentRoutes) 
app.use("/api/teacher",teacherRoutes) 
app.use("/api/admin",adminRoutes) 
app.use("/api/general",generaRoutes) 
// app.get("/",(req,res) => {
//     return res.json({ 
//         message : "data"
//     })
// })

app.get("/api/logout",(req,res) => {
    res.cookie("token",{
        maxAge : 0
    })
    return res.sendStatus(200)
})
const __dirname = path.resolve()

  
  app.use("/assets", express.static(path.join(__dirname, "dist/assets"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
        }
    }
}));


app.get("*", (req, res) => {
    const requestPath = req.originalUrl;

    // If it's requesting a JS file, prevent serving index.html
    if (requestPath.endsWith(".js") || requestPath.startsWith("/assets")) {
        return res.status(404).send("Not Found");
    }

    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})