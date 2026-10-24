import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import {
  createPaymentOrder,
  reserveSeats,
  verifyPayment,
} from "../services/bookingService";

const BookingSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    showId,
    showInfo,
    selectedSeats = [],
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!showId || selectedSeats.length === 0) {
    return (
      <div className="cinehub-page min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-[#111111] p-8 text-center shadow-2xl shadow-black/40">
          <Ticket
            size={48}
            className="mx-auto mb-5 text-slate-600"
          />

          <h1 className="text-2xl font-bold mb-2">
            No seats selected
          </h1>

          <p className="text-slate-400 mb-6">
            Please select your seats before continuing.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-[#ff243d] hover:bg-[#df1c32] text-white font-semibold transition"
          >
            Select Seats
          </button>
        </div>
      </div>
    );
  }

  /*
   * This is only for displaying an estimated amount.
   * The backend is responsible for the actual booking amount.
   */
  const ticketPrice = selectedSeats.length * 200;
  const estimatedTotal = ticketPrice;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Load Razorpay Checkout
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay. Please check your internet connection.");
      }

      // 2. Reserve seats temporarily
      const reservationRequest = {
        showId: Number(showId),
        showSeatIds: selectedSeats.map((seat) => seat.id),
      };

      

      const reservation = await reserveSeats(reservationRequest);

      



      // 3. Create Razorpay Order
      const order = await createPaymentOrder(reservation.reservationToken);



      // 4. Razorpay Checkout options
      const options = {
        key: "rzp_test_TVFoqm7iToIFVx",

        amount: order.amount,

        currency: order.currency,

        name: "Movie Booking",

        description: `${showInfo?.movieTitle || "Movie"} Tickets`,

        order_id: order.id,

        handler: async function (response) {
          try {
           

            // Send Razorpay payment details to Spring Boot
            const verifyResponse = await verifyPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: order.bookingId,
            });

          

            // Payment verified successfully
            if (verifyResponse.success) {

              alert("Payment successful! Booking confirmed! ");

              // Navigate to booking success page
              navigate("/booking-success", {
                state: {
                  booking: {
                    bookingId: verifyResponse.bookingId,
                    status: "CONFIRMED",
                    totalAmount: reservation.totalAmount,
                  },
                  showInfo: showInfo,
                  selectedSeats: selectedSeats,
                },
              });

            } else {

              alert(
                verifyResponse.message ||
                "Payment verification failed!"
              );

            }

          } catch (error) {

           

            alert(
              error.response?.data?.message ||
              "Payment verification failed. Please contact support."
            );

          }
        },

        theme: {
          color: "#dc2626",
        },

        modal: {
          ondismiss: function () {
           
            setLoading(false);
          },
        },
      };

      // 5. Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Please log in to continue payment."
          : err.response?.data?.message ||
            "Unable to proceed to payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="cinehub-page min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#090909]/80">
        <div className="max-w-6xl mx-auto px-5 py-5">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back to seats
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 pb-16 sm:px-5 sm:py-10">

        {/* Title */}
        <div className="mb-8 border-l-2 border-brand-500 pl-5">
          <p className="text-brand-300 text-xs font-semibold tracking-[0.24em]">
            CHECKOUT
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            Booking Summary
          </h1>

          <p className="text-slate-400 mt-2">
            Review your seats and show details before booking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Movie / Show Card */}
            <section className="rounded-3xl border border-slate-800 bg-[#111111] p-4 shadow-xl shadow-black/20 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm text-red-500 font-medium mb-2">
                    MOVIE
                  </p>

                  <h2 className="text-2xl font-bold">
                    {showInfo?.movieTitle || "Movie"}
                  </h2>
                </div>

                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-red-600/10 items-center justify-center">
                  <Ticket className="text-red-500" />
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60">
                  <MapPin className="text-slate-400" size={19} />

                  <div>
                    <p className="text-xs text-slate-500">
                      THEATRE
                    </p>

                    <p className="text-sm font-medium mt-1">
                      {showInfo?.theatreName || "Theatre"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {showInfo?.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60">
                  <CalendarDays
                    className="text-slate-400"
                    size={19}
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      DATE
                    </p>

                    <p className="text-sm font-medium mt-1">
                      {showInfo?.showDate || "Selected date"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60">
                  <Clock3
                    className="text-slate-400"
                    size={19}
                  />

                  <div>
                    <p className="text-xs text-slate-500">
                      SHOW TIME
                    </p>

                    <p className="text-sm font-medium mt-1">
                      {showInfo?.showTime || "Selected time"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/60">

                  <div className="w-5 h-5 rounded border border-slate-500 flex items-center justify-center text-[10px]">
                    S
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      SCREEN
                    </p>

                    <p className="text-sm font-medium mt-1">
                      {showInfo?.screenName || "Screen"}
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* Selected Seats */}
            <section className="rounded-3xl border border-slate-800 bg-[#111111] p-4 shadow-xl shadow-black/20 sm:p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-lg font-semibold">
                    Selected Seats
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedSeats.length}{" "}
                    {selectedSeats.length === 1
                      ? "seat"
                      : "seats"}{" "}
                    selected
                  </p>
                </div>

                <button
                  onClick={() => navigate(-1)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  Change
                </button>

              </div>

              <div className="flex flex-wrap gap-3">

                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="min-w-[75px] px-4 py-3 rounded-xl bg-red-600/10 border border-red-600/30 text-center"
                  >
                    <p className="font-bold text-lg">
                      {seat.rowName}
                      {seat.seatNumber}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {seat.seatType}
                    </p>
                  </div>
                ))}

              </div>

            </section>

          </div>

          {/* RIGHT - PRICE */}
          <aside>

            <div className="rounded-3xl border border-brand-500/20 bg-[#111111] p-4 shadow-2xl shadow-black/30 sm:p-6 lg:sticky lg:top-6">

              <h2 className="text-lg font-semibold mb-6">
                Price Details
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Tickets ({selectedSeats.length})
                  </span>

                  <span>
                    ₹{ticketPrice}
                  </span>
                </div>

                

                <div className="border-t border-slate-800 pt-4">

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      ₹{estimatedTotal}
                    </span>
                  </div>

                </div>

              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Confirm */}
              <button
                onClick={handleProceedToPayment}
                disabled={loading}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#ff243d] hover:bg-[#df1c32] disabled:bg-[#78101a] disabled:text-red-200 font-semibold text-white transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Proceeding to Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={19} />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                By confirming, you agree to the booking terms
                and cancellation policy.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default BookingSummaryPage;