import apiClient from "./apiClient.js";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ;
const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${apiOrigin}${value}`;
  return value;
}

function normalizeMovie(movie) {
  if (!movie || typeof movie !== "object") return movie;

  const genre = movie.genre || movie.category || movie.movieGenre || "Genre";
  const year =
    movie.releaseYear || movie.year || movie.releaseDate?.slice(0, 4) || "";
  const rating = movie.imdbRating ?? movie.rating ?? movie.averageRating ?? 0;
  const title = movie.title || movie.name || "Untitled movie";
  const subtitle =
    movie.description || movie.summary || `${genre} · ${year || "Upcoming"}`;

  return {
    id: movie.id ?? movie.movieId,
    title,
    subtitle,
    rating: Number(rating) || 0,
    genre,
    year: year ? String(year) : "",
    image: resolveImageUrl(
      movie.posterUrl ||
        movie.poster ||
        movie.imageUrl ||
        movie.image ||
        movie.posterPath ||
        movie.poster_path,
    ),
    tags: Array.isArray(movie.tags) ? movie.tags : [genre].filter(Boolean),
    description: movie.description || "",
    raw: movie,
  };
}

export async function fetchMovies(params = {}) {

    const response = await apiClient.get('/public/movies', {
        params
    });

    const payload = response.data;

    return {
        movies: payload.content.map(normalizeMovie),

        page: payload.page,
        size: payload.size,
        totalElements: payload.totalElements,
        totalPages: payload.totalPages,
        first: payload.first,
        last: payload.last
    };
}

export async function fetchMovieById(id) {
  const response = await apiClient.get(`/public/movies/${id}`);
  return normalizeMovie(response.data);
}

function normalizeShow(show) {
  if (!show || typeof show !== "object") return show;

  const theatre = show.theatre || show.theater || {};
  const screen = show.screen || {};
  const status = (show.status || "SCHEDULED").toString().toUpperCase();

  return {
    id: show.id ?? show.showId,
    movieId: show.movieId ?? show.movie?.id,
    theatreName: theatre.name || show.theatreName || "Theatre",
    theatreAddress: theatre.address || show.theatreAddress || "",
    theatreCity: theatre.city || show.theatreCity || "",
    screenName: screen.name || show.screenName || "Screen",
    screenType: screen.type || show.screenType || "",
    showDate: show.showDate || show.date || "",
    startTime: show.startTime || "",
    endTime: show.endTime || "",
    status,
    price: show.price ?? show.ticketPrice ?? null,
    raw: show,
  };
}

const AVAILABLE_STATUSES = ["SCHEDULED", "AVAILABLE"];

export async function fetchMovieShows(movieId, params = {}) {
  const response = await apiClient.get(`/public/shows/movies/${movieId}`, {
    params,
  });
  const payload = response.data;
  const shows = Array.isArray(payload)
    ? payload
    : (payload?.content ?? payload?.items ?? []);
  return shows
    .map(normalizeShow)
    .filter((show) => AVAILABLE_STATUSES.includes(show.status));
}
