import { useState } from "react";

export default function Login({ onSubmit, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(email, password);
    } catch {
      // Error state is handled by AuthContext and rendered via props.
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      {error ? <p className="error-text">{error}</p> : null}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Enter admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
