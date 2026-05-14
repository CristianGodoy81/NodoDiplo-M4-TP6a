import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    }
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;