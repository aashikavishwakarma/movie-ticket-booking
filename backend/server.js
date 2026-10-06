const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const moviesFile = path.join(__dirname, "movies.json");
const bookingsFile = path.join(__dirname, "bookings.json");
const usersFile = path.join(__dirname, "users.json");

function readJSON(file) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "[]");
    }

    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    console.error("JSON Read Error:", error);
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Home / Test
app.get("/", (req, res) => {
  res.send("Movie Ticket Booking Backend is running!");
});

// ==================== MOVIES ====================

// Get all movies
app.get("/api/movies", (req, res) => {
  const movies = readJSON(moviesFile);
  res.json(movies);
});

// Add movie
app.post("/api/movies", (req, res) => {
  const movies = readJSON(moviesFile);

  const newMovie = {
    id: Date.now(),
    name: req.body.name,
    genre: req.body.genre,
    duration: req.body.duration,
    image: req.body.image,
  };

  movies.push(newMovie);
  writeJSON(moviesFile, movies);

  res.status(201).json({
    message: "Movie added successfully!",
    movie: newMovie,
  });
});

// Update movie
app.put("/api/movies/:id", (req, res) => {
  const movies = readJSON(moviesFile);

  const id = Number(req.params.id);

  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  movies[index] = {
    ...movies[index],
    ...req.body,
    id: id,
  };

  writeJSON(moviesFile, movies);

  res.json({
    message: "Movie updated successfully!",
    movie: movies[index],
  });
});

// Delete movie
app.delete("/api/movies/:id", (req, res) => {
  const movies = readJSON(moviesFile);

  const id = Number(req.params.id);

  const newMovies = movies.filter((movie) => movie.id !== id);

  if (movies.length === newMovies.length) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  writeJSON(moviesFile, newMovies);

  res.json({
    message: "Movie deleted successfully!",
  });
});

// ==================== BOOKINGS ====================

// Get all bookings
app.get("/api/bookings", (req, res) => {
  const bookings = readJSON(bookingsFile);
  res.json(bookings);
});

// Create booking
app.post("/api/bookings", (req, res) => {
  const bookings = readJSON(bookingsFile);

  const newBooking = {
    id: Date.now(),
    bookingId: "MB" + Date.now(),
    ...req.body,
  };

  bookings.push(newBooking);

  writeJSON(bookingsFile, bookings);

  res.status(201).json({
    message: "Booking successful!",
    booking: newBooking,
  });
});

// ==================== SIGNUP ====================

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  const users = readJSON(usersFile);

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(400).json({
      message: "Email already registered!",
    });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: "user",
  };

  users.push(newUser);

  writeJSON(usersFile, users);

  res.status(201).json({
    message: "Signup successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// ==================== LOGIN ====================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const users = readJSON(usersFile);

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.json({
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==================== SERVER ====================

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});