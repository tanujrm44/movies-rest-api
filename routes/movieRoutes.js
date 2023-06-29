import express from "express"
import {
  createMovie,
  deleteMovie,
  getActorMovies,
  getAllMovies,
  getMovieStats,
  top5Cheap,
  updateMovie,
} from "../controllers/movieController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getAllMovies).post(createMovie)
router.route("/top-5-cheap").get(top5Cheap, getAllMovies)

router.route("/movie-stats").get(getMovieStats)
router.route("/actor-movies").get(getActorMovies)

router.route("/:id").patch(updateMovie).delete(deleteMovie)

export default router
