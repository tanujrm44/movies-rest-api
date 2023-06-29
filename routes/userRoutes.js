import express from "express"
import {
  createUser,
  getAllUsers,
  loginUser,
} from "../controllers/userController.js"
import { adminOnly, protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, adminOnly, getAllUsers).post(createUser)
router.route("/login").post(loginUser)

export default router
