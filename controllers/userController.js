import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import { createSendToken } from "../middleware/authMiddleware.js"

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already Exists")
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  })

  createSendToken(newUser, 201, res)
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    createSendToken(user, 200, res)
  } else {
    res.status(401)
    throw new Error("Invalid User Credentials")
  }
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  if (users) {
    res.status(200).json({ users })
  } else {
    res.status(400)
    throw new Error("Could not fetch Users")
  }
})
