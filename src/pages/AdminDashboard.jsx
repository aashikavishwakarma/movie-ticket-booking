import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [movieName, setMovieName] = useState("");
  const [genre, setGenre] = useState("Action");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");

  // =========================
  // ADMIN CHECK + DATA FETCH
  // =========================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    // User login nahi hai
    if (!savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      // User admin nahi hai
      if (user.role !== "admin") {
        alert("Access denied! Admin only.");
        navigate("/", { replace: true });
        return;
      }

      // Admin confirmed
      setIsAdmin(true);

      // =========================
      // FETCH BOOKINGS
      // =========================

      fetch("http://localhost:5000/api/bookings")
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);
        })
        .catch((error) => {
          console.error("Booking Error:", error);
        });

      // =========================
      // FETCH MOVIES
      // =========================

      fetch("http://localhost:5000/api/movies")
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Movie Error:", error);
          setLoading(false);
        });

    } catch (error) {
      console.error("User Error:", error);

      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  // =========================
  // LOADING / ACCESS CHECK
  // =========================

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <h2>Checking admin access...</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  // =========================
  // STATISTICS
  // =========================

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.total || 0),
    0
  );

  const totalSeats = bookings.reduce(
    (sum, booking) =>
      sum + (booking.seats?.length || 0),
    0
  );

  const totalMovies = movies.length;

  // =========================
  // CLEAR MOVIE FORM
  // =========================

  const clearForm = () => {
    setMovieName("");
    setGenre("Action");
    setDuration("");
    setImage("");

    setEditingMovie(null);
    setShowMovieForm(false);
  };

  // =========================
  // ADD / UPDATE MOVIE
  // =========================

  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    if (
      !movieName ||
      !genre ||
      !duration ||
      !image
    ) {
      alert("Please fill all movie details.");
      return;
    }

    const movieData = {
      name: movieName,
      genre: genre,
      duration: duration,
      image: image,
    };

    try {
      let response;

      // UPDATE
      if (editingMovie) {
        response = await fetch(
          `http://localhost:5000/api/movies/${editingMovie.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(movieData),
          }
        );
      }

      // ADD
      else {
        response = await fetch(
          "http://localhost:5000/api/movies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(movieData),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Movie operation failed"
        );
      }

      // UPDATE MOVIE IN FRONTEND
      if (editingMovie) {
        setMovies((previousMovies) =>
          previousMovies.map((movie) =>
            movie.id === editingMovie.id
              ? data.movie
              : movie
          )
        );

        alert("Movie updated successfully!");
      }

      // ADD MOVIE IN FRONTEND
      else {
        setMovies((previousMovies) => [
          ...previousMovies,
          data.movie,
        ]);

        alert("Movie added successfully!");
      }

      clearForm();

    } catch (error) {
      console.error("Movie Save Error:", error);
      alert("Movie save failed.");
    }
  };

  // =========================
  // EDIT MOVIE
  // =========================

  const handleEdit = (movie) => {
    setEditingMovie(movie);

    setMovieName(movie.name);
    setGenre(movie.genre);
    setDuration(movie.duration);
    setImage(movie.image);

    setShowMovieForm(true);
  };

  // =========================
  // DELETE MOVIE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/movies/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      setMovies((previousMovies) =>
        previousMovies.filter(
          (movie) => movie.id !== id
        )
      );

      alert("Movie deleted successfully!");

    } catch (error) {
      console.error("Delete Error:", error);
      alert("Movie delete failed.");
    }
  };

  // =========================
  // ADMIN LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");

    alert("Admin logout successful!");

    navigate("/login", {
      replace: true,
    });
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header">

        <div>
          <h1>🎬 Admin Dashboard</h1>

          <p>
            MovieBook Management System
          </p>
        </div>

        <div>

          <button
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="stats-container">

        <div className="stat-card">

          <h3>
            Total Bookings
          </h3>

          <h2>
            {totalBookings}
          </h2>

        </div>

        <div className="stat-card">

          <h3>
            Total Revenue
          </h3>

          <h2>
            ₹{totalRevenue}
          </h2>

        </div>

        <div className="stat-card">

          <h3>
            Seats Booked
          </h3>

          <h2>
            {totalSeats}
          </h2>

        </div>

        <div className="stat-card">

          <h3>
            Total Movies
          </h3>

          <h2>
            {totalMovies}
          </h2>

        </div>

      </div>

      {/* =========================
          MOVIE MANAGEMENT
      ========================= */}

      <div className="movie-management">

        <div className="section-header">

          <h2>
            🎥 Movie Management
          </h2>

          <button
            className="add-movie-btn"
            onClick={() => {
              clearForm();
              setShowMovieForm(true);
            }}
          >
            + Add Movie
          </button>

        </div>

        {/* =========================
            MOVIE FORM
        ========================= */}

        {showMovieForm && (

          <form
            className="movie-form"
            onSubmit={handleMovieSubmit}
          >

            <h3>
              {editingMovie
                ? "Edit Movie"
                : "Add New Movie"}
            </h3>

            <label>
              Movie Name
            </label>

            <input
              type="text"
              placeholder="Enter movie name"
              value={movieName}
              onChange={(e) =>
                setMovieName(e.target.value)
              }
              required
            />

            <label>
              Genre
            </label>

            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
            >
              <option value="Action">
                Action
              </option>

              <option value="Comedy">
                Comedy
              </option>

              <option value="Drama">
                Drama
              </option>

              <option value="Romance">
                Romance
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Horror">
                Horror
              </option>
            </select>

            <label>
              Duration
            </label>

            <input
              type="text"
              placeholder="Example: 2h 30min"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              required
            />

            <label>
              Image URL
            </label>

            <input
              type="text"
              placeholder="Enter image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              required
            />

            <div className="form-buttons">

              <button
                type="submit"
                className="save-movie-btn"
              >
                {editingMovie
                  ? "Update Movie"
                  : "Save Movie"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Cancel
              </button>

            </div>

          </form>

        )}

        {/* =========================
            MOVIE LIST
        ========================= */}

        <div className="admin-movies">

          {movies.length === 0 ? (

            <p>
              No movies available.
            </p>

          ) : (

            movies.map((movie) => (

              <div
                className="admin-movie-card"
                key={movie.id}
              >

                <img
                  src={movie.image}
                  alt={movie.name}
                />

                <div className="admin-movie-info">

                  <h3>
                    {movie.name}
                  </h3>

                  <p>
                    <strong>
                      Genre:
                    </strong>{" "}
                    {movie.genre}
                  </p>

                  <p>
                    <strong>
                      Duration:
                    </strong>{" "}
                    {movie.duration}
                  </p>

                  <div className="movie-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(movie)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(movie.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* =========================
          RECENT BOOKINGS
      ========================= */}

      <div className="booking-table-card">

        <h2>
          Recent Bookings
        </h2>

        {bookings.length === 0 ? (

          <p className="no-bookings">
            No bookings available.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Booking ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Movie
                  </th>

                  <th>
                    Seats
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {bookings.map(
                  (booking) => (

                    <tr
                      key={booking.id}
                    >

                      <td>
                        {booking.bookingId ||
                          booking.id}
                      </td>

                      <td>
                        {booking.name}
                      </td>

                      <td>
                        {booking.movie?.name ||
                          "N/A"}
                      </td>

                      <td>
                        {booking.seats?.join(
                          ", "
                        ) || "N/A"}
                      </td>

                      <td>
                        ₹{booking.total || 0}
                      </td>

                      <td>
                        {booking.paymentStatus ||
                          "N/A"}
                      </td>

                      <td>
                        {booking.bookingDate ||
                          "N/A"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;