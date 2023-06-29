import asyncHandler from "express-async-handler"
import Movie from "../models/movieModel.js"

export const top5Cheap = (req, res, next) => {
  req.query.sort = "price"
  req.query.limit = "5"
  req.query.fields = "name,price"
  next()
}

export const createMovie = asyncHandler(async (req, res) => {
  const newMovie = await Movie.create(req.body)
  res.status(201).json({
    status: "success",
    data: {
      movie: newMovie,
    },
  })
})

export const getAllMovies = asyncHandler(async (req, res) => {
  //filtering
  const queryStr = req.query
  const excludedFields = ["limit", "sort", "page", "fields"]
  const queryObj = { ...queryStr }
  excludedFields.forEach(query => delete queryObj[query])

  let queryStringified = JSON.stringify(queryObj)

  queryStringified = queryStringified.replace(
    /\b(lte|lt|gte|gt)\b/g,
    match => `$${match}`
  )

  let query = Movie.find(JSON.parse(queryStringified))

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  }

  //limit
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ")
    query = query.select(fields)
  } else {
    query = query.select("-__v")
  }

  //paginate
  const page = req.query.page || 1
  const limit = req.query.limit || 100
  const skip = (page - 1) * limit

  query = query.skip(skip).limit(limit)

  const movies = await query
  res.status(200).json({
    stauus: "success",
    results: movies.length,
    movies,
  })
})

export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!movie) {
    res.status(404)
    throw new Error("No movie found with that ID")
  }

  res.status(200).json({
    status: "success",
    movie,
  })
})

export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)

  if (!movie) {
    res.status(404)
    throw new Error("No movie found with that ID")
  }

  res.status(204).json({
    status: "success",
  })
})

export const getMovieStats = asyncHandler(async (req, res) => {
  const movieStats = await Movie.aggregate([
    {
      $match: { price: { $gte: 9 } },
    },
    {
      $group: {
        _id: "$worstToBest",
        numMovies: { $sum: 1 },
        avgRating: { $avg: "$average_rating" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ])
  res.status(200).json({
    status: "success",
    results: movieStats.length,
    movieStats,
  })
})

export const getActorMovies = asyncHandler(async (req, res) => {
  const actorMovies = await Movie.aggregate([
    {
      $unwind: "$actors",
    },
    {
      $group: {
        _id: "$actors",
        numMovies: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    {
      $addFields: { actors: "$_id" },
    },
    {
      $sort: {
        numMovies: -1,
      },
    },
    {
      $project: { _id: 0 },
    },
  ])
  res.status(200).json({
    status: "success",
    results: actorMovies.length,
    actorMovies,
  })
})
