import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Armchair,
    Check,
    Clock3,
    MapPin,
    Ticket,
} from "lucide-react";
import { fetchShow, fetchShowSeats } from "../services/bookingService";


const SeatSelectionPage = () => {
    const { showId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showInfo, setShowInfo] = useState(null);

    useEffect(() => {
        loadShow();
        fetchSeats();
    }, [showId]);

    const loadShow = async () => {
        try {
            const show = await fetchShow(showId);
            setShowInfo(show);
        } catch (err) {
            console.error("Failed to load show:", err);
            setError("Unable to load show details.");
        }
    };

    const fetchSeats = async () => {
        try {
            setLoading(true);
            setError("");

            const showSeats = await fetchShowSeats(showId);
            setSeats(showSeats);
        } catch (err) {
            console.error("Failed to fetch seats:", err);
            setError("Unable to load seats. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSeat = (seat) => {
        if (seat.status !== "AVAILABLE") {
            return;
        }

        setSelectedSeats((current) => {
            const alreadySelected = current.some(
                (selected) => selected.id === seat.id
            );

            if (alreadySelected) {
                return current.filter(
                    (selected) => selected.id !== seat.id
                );
            }

            return [...current, seat];
        });
    };

    const groupedSeats = useMemo(() => {
        return seats.reduce((groups, seat) => {
            const row = seat.rowName || "A";

            if (!groups[row]) {
                groups[row] = [];
            }

            groups[row].push(seat);

            return groups;
        }, {});
    }, [seats]);

    const totalAmount = selectedSeats.length * 200;

    const handleProceed = () => {
        if (selectedSeats.length === 0) {
            return;
        }

        navigate("/booking-summary", {
            state: {
                showId: Number(showId),
                showInfo,
                selectedSeats,
            },
        });
    };

    if (loading) {
        return (
            <div className="cinehub-page min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-slate-600 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading seats...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cinehub-page min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-red-400 mb-5">{error}</p>

                    <button
                        onClick={fetchSeats}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cinehub-page min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="border-b border-slate-800 bg-[#090909]/95 shadow-lg shadow-black/20">
                <div className="max-w-7xl mx-auto px-5 py-4">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>

                </div>
            </header>

            {/* Movie / Show Information */}
            <section className="border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-5 py-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {showInfo.movieTitle}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">

                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    {showInfo.theatreName}, {showInfo.location}
                                </span>

                                <span className="flex items-center gap-1.5">
                                    <Clock3 size={16} />
                                    {showInfo.showDate} • {showInfo.showTime}
                                </span>

                                <span>
                                    {showInfo.screenName}
                                </span>

                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-slate-400">
                                Selected
                            </p>

                            <p className="text-xl font-semibold text-brand-200">
                                {selectedSeats.length}{" "}
                                {selectedSeats.length === 1 ? "Seat" : "Seats"}
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-3 py-8 pb-32 sm:px-5 sm:py-10">

                {/* Screen */}
                <div className="max-w-2xl mx-auto mb-12">

                    <div className="relative">
                        <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-brand-500/80 to-transparent shadow-md shadow-brand-500/20" />

                        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                            <span className="text-xs text-slate-500 tracking-[0.3em]">
                                SCREEN
                            </span>
                        </div>
                    </div>

                </div>

                {/* Seat Layout */}
                {Object.keys(groupedSeats).length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        No seats available for this show.
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl space-y-5 overflow-x-auto pb-2">

                            <div className="min-w-max space-y-5">
                            {Object.entries(groupedSeats).map(
                            ([rowName, rowSeats]) => (

                                <div
                                    key={rowName}
                                    className="flex items-center gap-5"
                                >

                                    {/* Row name */}
                                    <div className="w-6 text-center text-sm font-semibold text-brand-300">
                                        {rowName}
                                    </div>

                                    {/* Seats */}
                                    <div
                                        className="flex-1 grid gap-2 sm:gap-3 justify-center"
                                        style={{
                                            gridTemplateColumns: `repeat(${rowSeats.length}, 40px)`
                                        }}
                                    >

                                        {rowSeats
                                            .sort(
                                                (a, b) =>
                                                    a.seatNumber - b.seatNumber
                                            )
                                            .map((seat) => {

                                                const isSelected =
                                                    selectedSeats.some(
                                                        (selected) =>
                                                            selected.id === seat.id
                                                    );

                                                const isBooked =
                                                    seat.status === "BOOKED";

                                                const isLocked =
                                                    seat.status === "LOCKED";

                                                return (
                                                    <button
                                                        key={seat.id}
                                                        disabled={
                                                            isBooked || isLocked
                                                        }
                                                        onClick={() =>
                                                            toggleSeat(seat)
                                                        }
                                                        title={`Seat ${seat.rowName}${seat.seatNumber}`}
                                                        className={`
                              relative
                              w-10 h-10
                              sm:w-11 sm:h-11
                              rounded-lg
                              flex items-center justify-center
                              text-xs
                              font-medium
                              transition-all
                              ${isBooked
                                                                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                                                                : isLocked
                                                                    ? "bg-yellow-900/40 text-yellow-600 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-red-600 text-white scale-105 shadow-lg shadow-red-900/40"
                                                                        : "border border-slate-700 bg-[#171717] text-slate-300 hover:border-brand-500/50 hover:bg-slate-800 hover:scale-105"
                                                            }
                            `}
                                                    >
                                                        {isSelected ? (
                                                            <Check size={17} />
                                                        ) : (
                                                            <Armchair size={17} />
                                                        )}

                                                        <span className="sr-only">
                                                            {seat.rowName}
                                                            {seat.seatNumber}
                                                        </span>
                                                    </button>
                                                );
                                            })}

                                    </div>

                                </div>
                            )
                        )}

                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex justify-center flex-wrap gap-6 mt-12 text-sm text-slate-400">

                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-slate-800" />
                        Available
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-red-600" />
                        Selected
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-slate-700" />
                        Booked
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-yellow-900/50" />
                        Locked
                    </div>

                </div>

            </main>

            {/* Bottom Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-[#111111]/95 shadow-[0_-12px_36px_rgba(0,0,0,0.35)] backdrop-blur">

                <div className="max-w-7xl mx-auto px-5 py-4">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <div className="flex items-center gap-4">

                            <div className="w-11 h-11 rounded-full bg-red-600/10 flex items-center justify-center">
                                <Ticket
                                    size={21}
                                    className="text-red-500"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    {selectedSeats.length > 0
                                        ? selectedSeats
                                            .map(
                                                (seat) =>
                                                    `${seat.rowName}${seat.seatNumber}`
                                            )
                                            .join(", ")
                                        : "No seats selected"}
                                </p>

                                <p className="font-semibold">
                                    ₹{totalAmount}
                                </p>
                            </div>

                        </div>

                        <button
                            disabled={selectedSeats.length === 0}
                            onClick={handleProceed}
                            className={`
                w-full sm:w-auto
                px-8 py-3
                rounded-xl
                font-semibold
                transition
                ${selectedSeats.length > 0
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                }
              `}
                        >
                            Proceed to Book
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SeatSelectionPage;