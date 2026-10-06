import { useLocation, useNavigate } from "react-router-dom";
import "./MovieDetails.css";

function MovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;

  const handleSelectSeats = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first to book tickets.");
      navigate("/login");
      return;
    }

    navigate("/seats", {
      state: { movie },
    });
  };

  if (!movie) {
    return (
      <div className="details-page">
        <h2>Movie not found</h2>

        <button onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">

      <div className="movie-details-card">

        <img
          src={movie.image}
          alt={movie.name}
          className="details-poster"
        />

        <div className="details-info">

          <h1>{movie.name}</h1>

          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>

          <p>
            <strong>Duration:</strong> {movie.duration}
          </p>

          <p>
            Enjoy an amazing movie experience with your
            friends and family.
          </p>

          <button
            className="continue-btn"
            onClick={handleSelectSeats}
          >
            Select Seats
          </button>

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Back to Movies
          </button>

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;