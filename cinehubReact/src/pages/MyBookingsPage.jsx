import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Ticket,
  Film,
  ChevronRight,
} from "lucide-react";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:8080/api/v1/bookings/my-bookings",
          {
            withCredentials: true,
          }
        );

        console.log("My bookings:", response.data);

        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "PAYMENT_PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";

      case "CANCELLED":
      case "PAYMENT_FAILED":
      case "EXPIRED":
        return "bg-slate-700/50 text-slate-400 border-slate-600";

      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-brand-400" />

          <p className="text-sm text-slate-400">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
            <Ticket className="h-6 w-6 text-slate-400" />
          </div>

          <h1 className="text-xl font-semibold text-white">
            Unable to load bookings
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10">
            <Ticket className="h-5 w-5 text-brand-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              View and manage your movie tickets.
            </p>
          </div>
        </div>

        {bookings.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {bookings.length}{" "}
            {bookings.length === 1 ? "booking" : "bookings"} found
          </p>
        )}

      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
            <Film className="h-7 w-7 text-slate-400" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-white">
            No bookings yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            Your movie bookings will appear here once you book your tickets.
          </p>

          <button
            onClick={() => navigate("/movies")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Browse Movies
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>
      ) : (

        /* Booking List */
        <div className="space-y-4">

          {bookings.map((booking) => (

            <div
              key={booking.bookingId}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 transition hover:border-slate-700 hover:bg-slate-900"
            >

              <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

                {/* Movie Information */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {booking.movieTitle}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Booking #{booking.bookingReference}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status.replaceAll("_", " ")}
                    </span>

                  </div>

                  {/* Date and Time */}
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" />

                      <span>{booking.showDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />

                      <span>
                        {booking.startTime?.substring(0, 5)}
                      </span>
                    </div>

                  </div>

                  {/* Seats */}
                  <div className="mt-5">

                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Seats
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {booking.seats?.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-sm font-medium text-slate-200"
                        >
                          {seat}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>

                {/* Price */}
                <div className="border-t border-slate-800 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Total Paid
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    ₹{booking.totalAmount}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;