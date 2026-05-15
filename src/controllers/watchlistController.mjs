import Watchlist from "../models/Watchlist.mjs";
import Profile from "../models/Profile.mjs";
import Movie from "../models/Movie.mjs";

// AGREGAR A WATCHLIST
export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId, movieId } = req.body;

    // Validar perfil
    const profile = await Profile.findOne({
      _id: profileId,
      user: userId
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Validar película
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Restricción por edad (CLAVE)
    if (profile.type === "child" && movie.ageRating > 13) {
      return res.status(403).json({
        message: "This profile cannot access this content"
      });
    }

    // Evitar duplicados
    const existing = await Watchlist.findOne({
      profile: profileId,
      movie: movieId
    });

    if (existing) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    const item = new Watchlist({
      profile: profileId,
      movie: movieId
    });

    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error adding to watchlist", error });
  }
};

// VER WATCHLIST POR PERFIL
export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params;

    // Validar perfil
    const profile = await Profile.findOne({
      _id: profileId,
      user: userId
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const watchlist = await Watchlist.find({ profile: profileId })
      .populate("movie");

    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching watchlist", error });
  }
};

// ELIMINAR DE WATCHLIST
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const item = await Watchlist.findById(id).populate("profile");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verificar que el perfil pertenece al usuario
    if (item.profile.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();

    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from watchlist", error });
  }
};
