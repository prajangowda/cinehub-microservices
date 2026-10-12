import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, showInfo, selectedSeats } = location.state || {};

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Booking information not found
          </h1>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-4xl text-green-400">✓</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Booking Confirmed!
          </h1>

          <p className="text-slate-400 mt-2">
            Your movie tickets have been booked successfully.
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* Booking Reference */}
          <div className="p-6 border-b border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Booking Reference
            </p>

            <p className="text-2xl font-bold text-red-500 mt-1 tracking-wider">
              {booking.bookingReference}
            </p>
          </div>

          {/* Movie / Show Information */}
          <div className="p-6 space-y-5">

            <div>
              <p className="text-sm text-slate-400">
                Movie
              </p>

              <p className="text-lg font-semibold mt-1">
                {showInfo?.movie?.title ||
                  showInfo?.movieTitle ||
                  "Movie"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <p className="text-sm text-slate-400">
                  Date
                </p>

                <p className="font-medium mt-1">
                  {showInfo?.showDate || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Time
                </p>

                <p className="font-medium mt-1">
                  {showInfo?.startTime || "—"}
                </p>
              </div>

            </div>

            {/* Seats */}
            
            <div>
              <p className="text-sm text-slate-400">
                Seats
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSeats?.map((seat, index) => (
                  <span
                    key={seat.id || index}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30"
                  >
                    {seat.rowName}{seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-slate-400">
                Status
              </span>

              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                {booking.status}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-lg text-slate-300">
                Total Amount
              </span>

              <span className="text-2xl font-bold">
                ₹{booking.totalAmount}
              </span>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold transition"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold transition"
          >
            Back to Home
          </button>

        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;