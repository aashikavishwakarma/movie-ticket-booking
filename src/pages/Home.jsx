import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);

    alert("Logout successful!");

    navigate("/");
  };

  const filteredMovies = movies.filter((movie) => {
    const matchSearch = movie.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchGenre =
      genre === "All" || movie.genre === genre;

    return matchSearch && matchGenre;
  });

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <h2>🎬 MovieBook</h2>

        <div className="nav-links">

          <Link to="/">Home</Link>

          <a
            href="#movies"
            onClick={(e) => {
              e.preventDefault();

              document.getElementById("movies").scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Movies
          </a>

          <Link to="/my-bookings">
            My Bookings
          </Link>

          {/* ================= USER LOGIN ================= */}

          {user ? (
            <>
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Hi, {user.name}
              </span>

              {/* ================= ADMIN BUTTON ================= */}

              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                >
                  Admin Dashboard
                </button>
              )}

              {/* ================= LOGOUT ================= */}

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}

        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}

      <section className="hero">

        <h1>Book Your Movie Tickets</h1>

        <p>
          Choose your favourite movie and book your seats easily.
        </p>

        <button
          className="explore-btn"
          onClick={() =>
            document.getElementById("movies").scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Explore Movies
        </button>

      </section>

      {/* ================= MOVIES SECTION ================= */}

      <section
        className="movies-section"
        id="movies"
      >

        <h2>Now Showing</h2>

        {/* ================= FILTERS ================= */}

        <div className="movie-filters">

          <input
            type="text"
            placeholder="🔍 Search movie..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={genre}
            onChange={(e) =>
              setGenre(e.target.value)
            }
          >
            <option value="All">
              All Genres
            </option>

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

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <p className="no-movies">
            Loading movies...
          </p>
        ) : (

          <div className="movie-container">

            {filteredMovies.length > 0 ? (

              filteredMovies.map((movie) => (

                <div
                  className="movie-card"
                  key={movie.id}
                >

                  <img
                    src={movie.image}
                    alt={movie.name}
                  />

                  <div className="movie-info">

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

                    <button
                      className="book-btn"
                      onClick={() =>
                        navigate(
                          "/movie-details",
                          {
                            state: {
                              movie,
                            },
                          }
                        )
                      }
                    >
                      Book Now
                    </button>

                  </div>

                </div>

              ))

            ) : (

              <p className="no-movies">
                No movies found.
              </p>

            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Home;