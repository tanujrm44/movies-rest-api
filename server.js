import dotenv from "dotenv"
import app from "./app.js"
import colors from "colors"
import connectDB from "./config/db.js"

dotenv.config()

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
