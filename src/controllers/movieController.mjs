import Movie from "../models/Movie.mjs";
import Profile from "../models/Profile.mjs";

// GET MOVIES (con filtros + restricción por perfil)
export const getMovies = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileId, category, name } = req.query;

    // 1. Validar profileId
    if (!profileId) {
      return res.status(400).json({ message: "profileId is required" });
    }

    // 2. Buscar perfil y verificar pertenencia
    const profile = await Profile.findOne({
      _id: profileId,
      user: userId
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 3. Construir filtros
    const filters = {};

    // filtro por categoría
    if (category) {
      filters.category = category;
    }

    // filtro por nombre (búsqueda parcial)
    if (name) {
      filters.title = { $regex: name, $options: "i" };
    }

    // 4. Filtro por edad (CLAVE)
    if (profile.type === "child") {
      filters.ageRating = { $lte: 13 };
    }

    // 5. Buscar películas
    const movies = await Movie.find(filters);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies", error });
  }
};

// CREATE MOVIE (para cargar catálogo manual)
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error creating movie", error });
  }
};

// UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: "Error updating movie", error });
  }
};

// DELETE MOVIE
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie", error });
  }
};