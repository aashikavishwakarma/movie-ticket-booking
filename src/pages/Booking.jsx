import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Booking.css";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;
  const seats = location.state?.seats || [];
  const total = location.state?.total || 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!movie) {
    return (
      <div className="booking-page">
        <div className="booking-card">
          <h2>Booking information not found</h2>

          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleContinueToPayment = (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert("Please fill all details");
      return;
    }

    navigate("/payment", {
      state: {
        movie,
        seats,
        total,
        name,
        email,
        phone,
      },
    });
  };

  return (
    <div className="booking-page">

      <div className="booking-card">

        <h1>Booking Details</h1>

        <div className="movie-summary">

          <h2>{movie.name}</h2>

          <p>
            <strong>Genre:</strong>{" "}
            {movie.genre}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {movie.duration}
          </p>

          <p>
            <strong>Selected Seats:</strong>{" "}
            {seats.join(", ")}
          </p>

          <p className="total-price">
            Total Amount: ₹{total}
          </p>

        </div>

        <form onSubmit={handleContinueToPayment}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <button
            type="submit"
            className="confirm-booking-btn"
          >
            Continue to Payment
          </button>

        </form>

      </div>

    </div>
  );
}

export default Booking;