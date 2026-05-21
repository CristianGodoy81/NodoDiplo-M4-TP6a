import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    synopsis: {
      type: String,
      required: true
    },
    category: [
      {
        type: String
      }
    ],
    ageRating: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    tmdbId: {
      type: Number,
      unique: true
    },
    rating: {
      type: Number
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
