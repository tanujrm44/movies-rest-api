import mongoose from "mongoose"
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [30, "Your name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      minLength: 8,
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: "Passwords do not match",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified) return next()

  //const salt = bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, 10)

  this.passwordConfirm = undefined
  next()
})

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("user", userSchema)

export default User
