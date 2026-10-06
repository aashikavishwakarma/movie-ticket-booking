import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      // Check user role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Backend se connection nahi ho raha.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>🎬 MovieBook</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to book your movie tickets
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

        <Link
          className="back-home"
          to="/"
        >
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;