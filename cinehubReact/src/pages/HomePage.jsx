import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "../components/Button.jsx";
import { SearchInput } from "../components/SearchInput.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { MovieCard } from "../components/MovieCard.jsx";

import { fetchMovies } from "../services/movieService.js";

function HomePage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPages = 4;

  useEffect(() => {
    let isMounted = true;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const movies = await fetchMovies();

        if (isMounted) {
          setFeaturedMovies(movies.slice(0, 3));
        }
      } catch (err) {
        console.error("Unable to load movies:", err);

        if (isMounted) {
          setError("We couldn't load the movies right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredMovie = featuredMovies[0];

  return (
    <main className="space-y-16 pb-10">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-[#111318]">

        {/* subtle background glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="grid min-h-[520px] lg:grid-cols-[1.15fr_0.85fr]">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"
          >

            <div className="mb-6 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-px w-8 bg-brand-400" />
              YOUR NEXT MOVIE NIGHT
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

              Find a movie.
              <br />

              <span className="text-brand-400">
                Pick a seat.
              </span>

              <br />

              Enjoy the show.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Find movies playing near you, check showtimes and book your
              favourite seats without the usual hassle.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="w-full sm:max-w-md">
                <SearchInput
                  placeholder="Search for a movie..."
                />
              </div>

              <Link to="/movies">
                <Button>
                  Browse Movies
                </Button>
              </Link>

            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">

              <span>🎬 New releases</span>
              <span>🎟 Easy booking</span>
              <span>💺 Pick your seat</span>

            </div>

          </motion.div>


          {/* RIGHT - NOW SHOWING */}

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[400px] overflow-hidden bg-slate-950"
          >

            {featuredMovie?.image ? (
              <img
                src={featuredMovie.image}
                alt={featuredMovie.title}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-950 to-black" />
            )}

            {/* image overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">

              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">

                <span className="h-2 w-2 rounded-full bg-brand-400" />

                Now Showing

              </div>

              <h2 className="text-3xl font-bold text-white sm:text-4xl">

                {featuredMovie?.title || "Loading..."}

              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">

                {featuredMovie?.subtitle ||
                  featuredMovie?.genre ||
                  "Check today's available shows."}

              </p>

              {featuredMovie && (
                <button
                  onClick={() =>
                    navigate(`/movies/${featuredMovie.id}`)
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-brand-400"
                >
                  View Showtimes
                  <span>→</span>
                </button>
              )}

            </div>

          </motion.div>

        </div>
      </section>


      {/* =====================================================
          QUICK LINKS
      ====================================================== */}

      <section className="grid gap-4 sm:grid-cols-3">

        <div className="border-l-2 border-brand-400 bg-slate-900/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Looking for something?
          </p>

          <Link
            to="/movies"
            className="mt-2 block text-lg font-semibold text-white hover:text-brand-400"
          >
            Browse all movies →
          </Link>
        </div>

        <div className="border-l-2 border-slate-700 bg-slate-900/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Planning tonight?
          </p>

          <Link
            to="/movies"
            className="mt-2 block text-lg font-semibold text-white hover:text-brand-400"
          >
            Check today's shows →
          </Link>
        </div>

        <div className="border-l-2 border-slate-700 bg-slate-900/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Need a recommendation?
          </p>

          <Link
            to="/movies"
            className="mt-2 block text-lg font-semibold text-white hover:text-brand-400"
          >
            See what's popular →
          </Link>
        </div>

      </section>


      {/* =====================================================
          FEATURED MOVIES
      ====================================================== */}

      <section>

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>

            <p className="mb-2 text-sm font-semibold text-brand-400">
              ON THE BIG SCREEN
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white">
              Movies worth watching
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-500">
              A few picks from what's currently available on CineHub.
            </p>

          </div>

          <Link
            to="/movies"
            className="hidden text-sm font-semibold text-slate-400 transition hover:text-white sm:block"
          >
            View all →
          </Link>

        </div>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {loading ? (

            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[380px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50"
              />
            ))

          ) : error ? (

            <div className="col-span-full border border-red-900/50 bg-red-950/20 p-8 text-center">

              <p className="text-slate-300">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-semibold text-brand-400 hover:text-brand-300"
              >
                Try again →
              </button>

            </div>

          ) : featuredMovies.length === 0 ? (

            <div className="col-span-full border border-slate-800 bg-slate-900/50 p-10 text-center">

              <p className="text-lg font-semibold text-white">
                No movies available right now.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Check back later for new releases.
              </p>

            </div>

          ) : (

            featuredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                onAction={() => {
                  console.log(
                    "Clicked featured movie:",
                    movie.id
                  );

                  navigate(`/movies/${movie.id}`);
                }}
              />
            ))

          )}

        </div>


        {/* PAGINATION */}

        <div className="mt-10 flex justify-center">

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="border-y border-slate-800 py-12">

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-semibold text-brand-400">
              READY FOR THE MOVIE?
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Your next cinema trip starts here.
            </h2>

          </div>

          <Link to="/movies">

            <button className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand-400 hover:bg-brand-400/10">
              Find a movie →
            </button>

          </Link>

        </div>

      </section>

    </main>
  );
}

export default HomePage;