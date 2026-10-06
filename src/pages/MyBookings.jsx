import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first to view your bookings.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    fetch("http://localhost:5000/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        const userBookings = data.filter(
          (booking) =>
            booking.email?.toLowerCase() ===
            user.email?.toLowerCase()
        );

        setBookings(userBookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Booking Error:", error);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="my-bookings-page">
        <h2>Loading bookings...</h2>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      <div className="my-bookings-header">
        <h1>🎟️ My Bookings</h1>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No bookings found</h2>

          <p>
            You have not booked any movie tickets yet.
          </p>

          <button onClick={() => navigate("/")}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="booking-container">

          {bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking.id}
            >

              <div className="booking-card-header">
                <h2>
                  {booking.movie?.name || "Movie"}
                </h2>

                <span>
                  {booking.paymentStatus || "Paid"}
                </span>
              </div>

              <div className="booking-details">

                <p>
                  <strong>Booking ID:</strong>{" "}
                  {booking.bookingId || booking.id}
                </p>

                <p>
                  <strong>Name:</strong>{" "}
                  {booking.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.email}
                </p>

                <p>
                  <strong>Seats:</strong>{" "}
                  {booking.seats?.join(", ")}
                </p>

                <p>
                  <strong>Total Amount:</strong>{" "}
                  ₹{booking.total}
                </p>

                <p>
                  <strong>Booking Date:</strong>{" "}
                  {booking.bookingDate}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyBookings;