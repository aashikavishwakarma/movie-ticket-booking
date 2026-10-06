import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;
  const seats = location.state?.seats || [];
  const total = location.state?.total || 0;

  const name = location.state?.name || "";
  const email = location.state?.email || "";
  const phone = location.state?.phone || "";

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [processing, setProcessing] =
    useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      const bookingId =
        "MB-" + Date.now();

      const bookingData = {
        bookingId,
        name,
        email,
        phone,

        movie: {
          name: movie.name,
          genre: movie.genre,
          duration: movie.duration,
        },

        seats,
        total,
        paymentMethod,
        paymentStatus: "Paid",
      };

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Payment Successful! 🎉");

      navigate("/my-bookings");

    } catch (error) {
      console.error(error);

      alert(
        "Payment/Booking failed. Backend check karo."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!movie) {
    return (
      <div className="payment-page">

        <div className="payment-card">

          <h2>
            Payment information not found
          </h2>

          <button onClick={() => navigate("/")}>
            Go Home
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="payment-page">

      <div className="payment-card">

        <h1>Payment</h1>

        <div className="payment-summary">

          <h2>{movie.name}</h2>

          <p>
            <strong>Name:</strong>{" "}
            {name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {phone}
          </p>

          <p>
            <strong>Seats:</strong>{" "}
            {seats.join(", ")}
          </p>

          <p className="payment-total">
            <strong>Total Amount:</strong>{" "}
            ₹{total}
          </p>

        </div>

        <h3>
          Select Payment Method
        </h3>

        <div className="payment-options">

          <label>
            <input
              type="radio"
              value="UPI"
              checked={
                paymentMethod === "UPI"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            UPI
          </label>

          <label>
            <input
              type="radio"
              value="Card"
              checked={
                paymentMethod === "Card"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Debit / Credit Card
          </label>

          <label>
            <input
              type="radio"
              value="Cash"
              checked={
                paymentMethod === "Cash"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Pay at Counter
          </label>

        </div>

        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : `Pay ₹${total}`}
        </button>

      </div>

    </div>
  );
}

export default Payment;