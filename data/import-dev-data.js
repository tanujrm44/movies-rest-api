import fs from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"
import connectDB from "../config/db.js"
import Movie from "../models/movieModel.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

connectDB()

const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/movie-sample-data.json`, "utf-8")
)

const importData = async () => {
  try {
    await Movie.create(movies)
    console.log("Data imported Successfully")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

const destroyData = async () => {
  try {
    await Movie.deleteMany()
    console.log("Data destroyed Successfully")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

if (process.argv[2] === "--import") {
  importData()
} else if (process.argv[2] === "--destroy") {
  destroyData()
}
