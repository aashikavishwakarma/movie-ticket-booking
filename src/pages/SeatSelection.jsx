import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SeatSelection.css";

function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const seats = [
    "A1", "A2", "A3", "A4", "A5", "A6",
    "B1", "B2", "B3", "B4", "B5", "B6",
    "C1", "C2", "C3", "C4", "C5", "C6",
    "D1", "D2", "D3", "D4", "D5", "D6",
    "E1", "E2", "E3", "E4", "E5", "E6"
  ];

  const pricePerSeat = 150;

  // Backend se already booked seats lana
  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((response) => response.json())
      .then((data) => {

        const seatsForMovie = data
          .filter(
            (booking) =>
              booking.movie?.name === movie?.name
          )
          .flatMap((booking) => booking.seats || []);

        setBookedSeats(seatsForMovie);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [movie]);

  const handleSeatClick = (seat) => {

    // Already booked seat
    if (bookedSeats.includes(seat)) {
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter(
          (item) => item !== seat
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat
      ]);
    }
  };

  const totalPrice =
    selectedSeats.length * pricePerSeat;

  if (!movie) {
    return (
      <div className="seat-page">
        <h2>Movie not found</h2>

        <button onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="seat-page">

      <h1>Select Your Seats</h1>

      <h2>{movie.name}</h2>

      <div className="screen">
        SCREEN
      </div>

      {loading ? (
        <p>Loading seats...</p>
      ) : (
        <>
          <div className="seat-container">

            {seats.map((seat) => {

              const isBooked =
                bookedSeats.includes(seat);

              const isSelected =
                selectedSeats.includes(seat);

              let seatClass = "seat";

              if (isBooked) {
                seatClass += " booked";
              } else if (isSelected) {
                seatClass += " selected";
              }

              return (
                <button
                  key={seat}
                  className={seatClass}
                  disabled={isBooked}
                  onClick={() =>
                    handleSeatClick(seat)
                  }
                >
                  {seat}
                </button>
              );
            })}

          </div>

          {/* Seat Legend */}
          <div className="seat-legend">

            <div>
              <span className="legend-box available"></span>
              Available
            </div>

            <div>
              <span className="legend-box selected-box"></span>
              Selected
            </div>

            <div>
              <span className="legend-box booked-box"></span>
              Booked
            </div>

          </div>

          {/* Booking Summary */}
          <div className="booking-summary">

            <h3>Booking Summary</h3>

            <p>
              Selected Seats:{" "}
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </p>

            <p>
              Price per Seat: ₹{pricePerSeat}
            </p>

            <h2>
              Total: ₹{totalPrice}
            </h2>

            <button
              className="confirm-btn"
              disabled={selectedSeats.length === 0}
              onClick={() =>
                navigate("/booking", {
                  state: {
                    movie,
                    seats: selectedSeats,
                    total: totalPrice
                  }
                })
              }
            >
              Confirm Seats
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default SeatSelection;