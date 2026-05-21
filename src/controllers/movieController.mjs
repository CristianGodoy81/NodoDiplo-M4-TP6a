import Movie from "../models/Movie.mjs";
import Profile from "../models/Profile.mjs";
import axios from "axios";

export const getTrailer = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const apiKey = process.env.TMDB_API_KEY;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos?api_key=${apiKey}`
    );

    const videos = response.data.results;

    const trailer = videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    if (!trailer) {
      return res.json({ trailer: null });
    }

    const url = `https://www.youtube.com/watch?v=${trailer.key}`;

    res.json({ trailer: url });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trailer", error });
  }
};

// IMPORTAR PELÍCULAS DESDE TMDB
export const importMovies = async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;

    // 1. Obtener géneros
    const genreRes = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    );

    const genreMap = {};
    genreRes.data.genres.forEach((g) => {
      genreMap[g.id] = g.name;
    });

    // 2. Obtener películas
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );

    const movies = movieRes.data.results;

    // 3. Transformar datos
    const formattedMovies = movies.map((m) => ({
      title: m.title,
      synopsis: m.overview,
      category: m.genre_ids.map((id) => genreMap[id]),// array de géneros
      ageRating: m.adult ? 18 : 13,// lógica de edad
      image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      tmdbId: m.id,
      rating: m.vote_average
    }));

    // 4. Evitar duplicados
    const existing = await Movie.find({
      tmdbId: { $in: formattedMovies.map((m) => m.tmdbId) }
    });

    const existingIds = existing.map((m) => m.tmdbId);

    const newMovies = formattedMovies.filter(
      (m) => !existingIds.includes(m.tmdbId)
    );

    await Movie.insertMany(newMovies);

    res.json({
      message: "Movies imported",
      added: newMovies.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error importing movies", error });
  }
};

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
      filters.category = { $in: [category] };
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
