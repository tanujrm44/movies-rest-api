import mongoose from "mongoose"

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Movie must have a name"],
      unique: true,
      trim: true,
    },
    actors: [String],
    duration: {
      type: Number,
      required: [true, "Movie must have a duration"],
    },
    average_rating: {
      type: Number,
      default: 8,
      min: [1, "Rating must be above 1.0"],
      max: [10, "Rating must be below 10.0"],
    },
    worstToBest: {
      type: String,
      required: [true, "A movie must have a rating"],
      enum: {
        values: ["worst", "satisfactory", "ok", "good", "best"],
        message: "Rating is either: worst, satisfactory, ok, good or best",
      },
    },
    num_ratings: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A movie must have a price"],
    },
    release_date: Date,
    summary: {
      type: String,
      trim: true,
      required: [true, "A movie must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

movieSchema.virtual("durationHours").get(function () {
  return this.duration / 60
})

const Movie = mongoose.model("movie", movieSchema)

export default Movie
