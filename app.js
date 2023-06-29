import express from "express"
import fs from "fs"
//import { dirname } from "path"
//import { fileURLToPath } from "url"
import movieRoutes from "./routes/movieRoutes.js"
import userRoutes from "./routes/userRoutes.js"

import { errorHandler, notFound } from "./middleware/errorMiddleware.js"

const app = express()

app.use(express.json())

const data = JSON.parse(fs.readFileSync("./data/sample-data.json"))

app.get("/", (req, res) => {
  res.send("Api is running...")
})

//const __dirname = dirname(fileURLToPath(import.meta.url))

//console.log(__dirname)

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/movies", movieRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
