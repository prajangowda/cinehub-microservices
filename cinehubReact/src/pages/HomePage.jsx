import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Pagination } from "../components/Pagination.jsx";
import useAuth from "../hooks/useAuth.js";

import { fetchMovies } from "../services/movieService.js";


function HomePage() {

  const navigate = useNavigate();
  const { isAdmin, isOwner } = useAuth();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [featuredMovies, setFeaturedMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // LOAD MOVIES
  // ============================================================

  useEffect(() => {

    let isMounted = true;

    const loadMovies = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await fetchMovies({
          page,
          size: 6
        });

        if (isMounted) {

          setFeaturedMovies(data.movies ?? []);
          setTotalPages(data.totalPages ?? 0);

        }

      } catch (err) {

        console.error("Unable to load movies:", err);

        if (isMounted) {

          setError(
            "We couldn't load the movies right now."
          );

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

  }, [page]);


  const featuredMovie = featuredMovies[0];

  return (
    <div className="pb-12">


      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative isolate overflow-hidden bg-[#080808]">
        {featuredMovie?.image && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${featuredMovie.image}")` }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/25" />

        <div className="relative mx-auto grid min-h-[540px] w-full max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:min-h-[620px] lg:grid-cols-[1fr_0.78fr] lg:gap-4 lg:px-12 lg:py-14">


          {/* ====================================================
              HERO CONTENT
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-center p-4 sm:p-12 lg:p-16"
          >

            <div className="max-w-xl space-y-7">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#f12b3b]" />

                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6571]">
                  {featuredMovie ? "Featured film" : "Welcome to CineHub"}
                </span>

              </div>


              <div>

                <h1 className="max-w-2xl text-4xl font-bold uppercase leading-[1.04] tracking-wide text-white sm:text-5xl lg:text-6xl">
                  {featuredMovie?.title || "A better night at the movies"}
                </h1>

              </div>


              <div className="flex flex-wrap items-center gap-2">
                {[featuredMovie?.year, featuredMovie?.genre, featuredMovie?.raw?.certificate]
                  .filter(Boolean)
                  .map((detail, index) => (
                    <span
                      key={`${detail}-${index}`}
                      className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                        index === 0
                          ? "bg-[#e7a51b] text-[#101820]"
                          : index === 1
                            ? "bg-[#1685a0] text-white"
                            : "bg-[#bd4d32] text-white"
                      }`}
                    >
                      {detail}
                    </span>
                  ))}
                {featuredMovie?.rating > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    ★ {featuredMovie.rating.toFixed(1)}/10
                  </span>
                )}
              </div>

              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                {featuredMovie?.description ||
                  "Discover what is showing, find your next favourite, and book your seats with CineHub."}
              </p>

              {/* Actions */}

              <div className="flex flex-wrap items-center gap-3">

                <Link
                  to={featuredMovie ? `/movies/${featuredMovie.id}` : "/movies"}
                  className="inline-flex items-center justify-center bg-[#f12b3b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d91d2c]"
                >
                  {featuredMovie ? "Explore film" : "Explore movies"}
                </Link>


                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 border border-[#536579] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white hover:bg-white/[0.06]"
                >

                  View all movies

                  <span aria-hidden="true">
                    →
                  </span>

                </Link>

              </div>

            </div>

          </motion.div>


          {/* ====================================================
              FEATURED MOVIE
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative flex min-h-[320px] items-center justify-center lg:min-h-[480px] lg:justify-end lg:pr-14"
          >

            {loading ? (

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#f12b3b]" />

              </div>

            ) : featuredMovie ? (

              <>

                {featuredMovie.image && (
                  <img
                    src={featuredMovie.image}
                    alt={featuredMovie.title}
                    className="relative z-10 h-[280px] max-h-[65vh] w-auto max-w-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.8)] sm:h-[440px] lg:h-[500px]"
                  />
                )}


              </>

            ) : (

              <div className="absolute inset-0 flex items-center justify-center">

                <p className="text-sm text-slate-500">
                  No featured movie available.
                </p>

              </div>

            )}

          </motion.div>

        </div>

      </section>

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 pt-10 sm:px-6">

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (

        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.04] px-5 py-4 text-sm text-red-300">

          {error}

        </div>

      )}


      {/* ========================================================
          MOVIES
      ======================================================== */}

      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#2b2b2b] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6571]">
              CineHub picks
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Now showing
            </h2>
          </div>
          <Link
            to="/movies"
            className="text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            All movies <span className="ml-1 text-[#f12b3b]">→</span>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-color:#454545_transparent] [scrollbar-width:thin]">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] w-56 shrink-0 animate-pulse bg-[#1b1b1b] sm:w-64"
                />
              ))
            : featuredMovies.slice(0, 6).map((movie, index) => (
                <motion.button
                  key={movie.id}
                  type="button"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="group relative aspect-[2/3] w-56 shrink-0 overflow-hidden bg-[#1b1b1b] text-left sm:w-64"
                  aria-label={`View ${movie.title}`}
                >
                  {movie.image ? (
                    <img
                      src={movie.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-slate-400">
                      {movie.title}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent p-3 pt-12">
                    <h3 className="line-clamp-2 pr-16 text-sm font-semibold text-white">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">
                      {movie.genre}{movie.year ? ` · ${movie.year}` : ""}
                    </p>
                  </div>
                  {movie.rating > 0 && (
                    <span
                      aria-label={`Rating ${movie.rating.toFixed(1)} out of 10`}
                      className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white"
                    >
                      <span className="mr-1 text-[#f5c451]" aria-hidden="true">★</span>
                      {movie.rating.toFixed(1)}
                    </span>
                  )}
                </motion.button>
              ))}
        </div>


        {/* ======================================================
            PAGINATION
        ====================================================== */}

        {totalPages > 1 && (

          <div className="flex items-center justify-center pt-4">

            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onChange={(newPage) => {

                setPage(newPage - 1);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });

              }}
            />

          </div>

        )}

      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border border-[#292929] bg-[#111111] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6571]">
            Plan your next outing
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
            Find a movie. Pick a seat. Enjoy the show.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Browse the latest releases and discover shows playing near you.
          </p>
          <Link
            to="/movies"
            className="mt-5 inline-flex items-center gap-2 bg-[#f12b3b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d91d2c]"
          >
            Browse movies
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {!isOwner && !isAdmin && (
          <div className="flex flex-col items-start justify-between gap-5 border border-[#292929] bg-[#111111] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6571]">
                Partner with CineHub
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                List your Theatre
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Reach more moviegoers by listing your theatre with us.
              </p>
            </div>
            <Link
              to="/owner/request"
              className="shrink-0 bg-[#f12b3b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#d91d2c]"
            >
              Register Theatre
            </Link>
          </div>
        )}
      </section>
      </div>
    </div>

  );

}


export default HomePage;