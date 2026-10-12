import { useEffect, useRef, useState } from "react";
import {
  createMovie,
  getPendingOwnerRequests,
  approveOwnerRequest,
  rejectOwnerRequest,
  getAllMovies,
  deleteMovie,
} from "../api/adminApi.js";

const initialMovieForm = {
  title: "KGF Chapter 3",
  description: "Action movie",
  duration: "180",
  genre: "ACTION",
  language: "KANNADA",
  certificate: "UA",
  releaseDate: "2026-08-01",
  imdbRating: "8.9",
};

const genreOptions = [
  "ACTION",
  "ADVENTURE",
  "ANIMATION",
  "COMEDY",
  "CRIME",
  "DRAMA",
  "FANTASY",
  "HORROR",
  "MYSTERY",
  "ROMANCE",
  "SCI_FI",
  "THRILLER",
  "DOCUMENTARY",
];

const languageOptions = [
  "ENGLISH",
  "HINDI",
  "KANNADA",
  "TAMIL",
  "TELUGU",
  "MALAYALAM",
];

const certificateOptions = ["U", "UA", "A"];

function AdminDashboardPage() {
  const [form, setForm] = useState(initialMovieForm);
  const [posterFile, setPosterFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestInFlightRef = useRef(false);

  const [ownerRequests, setOwnerRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState(null);

  const [activeTab, setActiveTab] = useState("movie");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // CREATE MOVIE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (requestInFlightRef.current) {
      return;
    }

    if (!posterFile) {
      alert("Please select a poster image.");
      return;
    }

    requestInFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const moviePayload = {
        ...form,
        duration: Number(form.duration),
        imdbRating: Number(form.imdbRating),
      };

      const payload = new FormData();

      payload.append(
        "movie",
        new Blob([JSON.stringify(moviePayload)], {
          type: "application/json",
        })
      );

      payload.append("poster", posterFile);

      await createMovie(payload);

      alert("Movie created successfully!");

      setForm(initialMovieForm);
      setPosterFile(null);
    } catch (error) {
      console.error("Failed to create movie", error);

      alert(
        error.response?.data?.message ||
          "Failed to create movie."
      );
    } finally {
      requestInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  // =========================
  // GET ALL MOVIES
  // =========================

  const loadMovies = async () => {
    setLoadingMovies(true);

    try {
      const data = await getAllMovies();

      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load movies", error);

      alert("Failed to load movies.");
    } finally {
      setLoadingMovies(false);
    }
  };

  // =========================
  // DELETE MOVIE
  // =========================

  const handleDeleteMovie = async (movie) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${movie.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingMovieId(movie.id);

      await deleteMovie(movie.id);

      // Remove movie immediately from UI
      setMovies((currentMovies) =>
        currentMovies.filter(
          (currentMovie) => currentMovie.id !== movie.id
        )
      );

      alert(`"${movie.title}" deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete movie", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete movie. The movie may have shows or bookings associated with it."
      );
    } finally {
      setDeletingMovieId(null);
    }
  };

  // =========================
  // LOAD OWNER REQUESTS
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadRequests() {
      setLoadingRequests(true);

      try {
        const data = await getPendingOwnerRequests();

        if (mounted) {
          setOwnerRequests(
            Array.isArray(data) ? data : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load owner requests",
          error
        );
      } finally {
        if (mounted) {
          setLoadingRequests(false);
        }
      }
    }

    loadRequests();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex gap-6">

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <aside className="w-60 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Admin
          </h2>

          <p className="text-xs text-slate-400">
            Choose an action
          </p>
        </div>

        <nav className="flex flex-col gap-2">

          {/* CREATE MOVIE */}

          <button
            type="button"
            onClick={() => setActiveTab("movie")}
            className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              activeTab === "movie"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-950/60"
            }`}
          >
            Create Movie
          </button>

          {/* MANAGE MOVIES */}

          <button
            type="button"
            onClick={() => {
              setActiveTab("movies");
              loadMovies();
            }}
            className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              activeTab === "movies"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-950/60"
            }`}
          >
            Manage Movies
          </button>

          {/* OWNER REQUESTS */}

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              activeTab === "requests"
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:bg-slate-950/60"
            }`}
          >
            Owner Requests
          </button>

        </nav>
      </aside>


      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <div className="flex-1 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">

        <div>
          <h1 className="text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Manage movies and owner requests.
          </p>
        </div>


        {/* ========================= */}
        {/* CREATE MOVIE TAB */}
        {/* ========================= */}

        {activeTab === "movie" && (

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2"
          >

            {/* TITLE */}

            <label className="text-sm text-slate-300">
              Title

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* GENRE */}

            <label className="text-sm text-slate-300">
              Genre

              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >

                {genreOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>
            </label>


            {/* DESCRIPTION */}

            <label className="text-sm text-slate-300 md:col-span-2">
              Description

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* DURATION */}

            <label className="text-sm text-slate-300">
              Duration (minutes)

              <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* LANGUAGE */}

            <label className="text-sm text-slate-300">
              Language

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >

                {languageOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>
            </label>


            {/* CERTIFICATE */}

            <label className="text-sm text-slate-300">
              Certificate

              <select
                name="certificate"
                value={form.certificate}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              >

                {certificateOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>
            </label>


            {/* RELEASE DATE */}

            <label className="text-sm text-slate-300">
              Release date

              <input
                name="releaseDate"
                type="date"
                value={form.releaseDate}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* IMDB */}

            <label className="text-sm text-slate-300">
              IMDb rating

              <input
                name="imdbRating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.imdbRating}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* POSTER */}

            <label className="text-sm text-slate-300 md:col-span-2">
              Poster image

              <input
                type="file"
                accept="image/*"
                required
                onChange={(event) =>
                  setPosterFile(
                    event.target.files?.[0] ?? null
                  )
                }
                className="mt-2 w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {isSubmitting
                ? "Uploading..."
                : "Upload Movie"}
            </button>

          </form>
        )}


        {/* ========================= */}
        {/* MANAGE MOVIES TAB */}
        {/* ========================= */}

        {activeTab === "movies" && (

          <div>

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Manage Movies
                </h2>

                <p className="mt-2 text-slate-400">
                  View and permanently delete movies.
                </p>
              </div>


              <button
                type="button"
                onClick={loadMovies}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Refresh
              </button>

            </div>


            {/* LOADING */}

            {loadingMovies ? (

              <p className="mt-6 text-slate-300">
                Loading movies...
              </p>

            ) : movies.length === 0 ? (

              <p className="mt-6 text-slate-300">
                No movies found.
              </p>

            ) : (

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {movies.map((movie) => (

                  <div
                    key={movie.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
                  >

                    {/* POSTER */}

                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-72 w-full object-cover"
                    />


                    {/* MOVIE DETAILS */}

                    <div className="p-5">

                      <h3 className="text-xl font-semibold text-white">
                        {movie.title}
                      </h3>


                      <div className="mt-3 space-y-2 text-sm text-slate-400">

                        <p>
                          <span className="font-medium text-slate-300">
                            Genre:
                          </span>{" "}
                          {movie.genre}
                        </p>

                        <p>
                          <span className="font-medium text-slate-300">
                            Language:
                          </span>{" "}
                          {movie.language}
                        </p>

                        <p>
                          <span className="font-medium text-slate-300">
                            Duration:
                          </span>{" "}
                          {movie.duration} min
                        </p>

                        <p>
                          <span className="font-medium text-slate-300">
                            Certificate:
                          </span>{" "}
                          {movie.certificate}
                        </p>

                        <p>
                          <span className="font-medium text-slate-300">
                            IMDb:
                          </span>{" "}
                          ⭐ {movie.imdbRating}
                        </p>

                      </div>


                      {/* DELETE BUTTON */}

                      <button
                        type="button"
                        disabled={
                          deletingMovieId === movie.id
                        }
                        onClick={() =>
                          handleDeleteMovie(movie)
                        }
                        className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingMovieId === movie.id
                          ? "Deleting..."
                          : "🗑 Delete Movie"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        )}


        {/* ========================= */}
        {/* OWNER REQUESTS TAB */}
        {/* ========================= */}

        {activeTab === "requests" && (

          <div className="mt-2">

            <h2 className="text-2xl font-semibold text-white">
              Owner Requests
            </h2>

            <p className="mt-2 text-slate-400">
              Approve or reject theatre owner requests.
            </p>


            {loadingRequests ? (

              <p className="mt-4 text-slate-300">
                Loading requests...
              </p>

            ) : ownerRequests.length === 0 ? (

              <p className="mt-4 text-slate-300">
                No pending requests.
              </p>

            ) : (

              <ul className="mt-4 space-y-4">

                {ownerRequests.map((req) => (

                  <li
                    key={req.id}
                    className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                  >

                    <div className="max-w-[70%]">

                      <div className="text-sm text-slate-300">
                        {req.businessName ||
                          req.business ||
                          "Unknown business"}
                      </div>


                      <div className="mt-1 text-xs text-slate-400">

                        {req.name ||
                          req.email ||
                          ""}

                        {req.phone
                          ? ` • ${req.phone}`
                          : ""}

                      </div>


                      {req.address && (

                        <div className="mt-1 text-xs text-slate-400">
                          {req.address}
                        </div>

                      )}


                      {req.gstNumber && (

                        <div className="mt-1 text-xs text-slate-400">
                          GST: {req.gstNumber}
                        </div>

                      )}

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="flex gap-2">

                      {/* APPROVE */}

                      <button
                        type="button"
                        onClick={async () => {

                          try {

                            await approveOwnerRequest(
                              req.id
                            );

                            setOwnerRequests(
                              (current) =>
                                current.filter(
                                  (request) =>
                                    request.id !== req.id
                                )
                            );

                          } catch (error) {

                            console.error(
                              "Approve failed",
                              error
                            );

                            alert(
                              "Failed to approve request."
                            );
                          }

                        }}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
                      >
                        Approve
                      </button>


                      {/* REJECT */}

                      <button
                        type="button"
                        onClick={async () => {

                          try {

                            await rejectOwnerRequest(
                              req.id
                            );

                            setOwnerRequests(
                              (current) =>
                                current.filter(
                                  (request) =>
                                    request.id !== req.id
                                )
                            );

                          } catch (error) {

                            console.error(
                              "Reject failed",
                              error
                            );

                            alert(
                              "Failed to reject request."
                            );
                          }

                        }}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Reject
                      </button>

                    </div>

                  </li>

                ))}

              </ul>

            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboardPage;

