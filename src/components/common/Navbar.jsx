import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        JobBoard
      </Link>

      <nav className="nav-links">
        <Link to="/jobs">Jobs</Link>
        <Link to="/admin">Admin</Link>
        {isAuthenticated ? (
          <button type="button" onClick={logout} className="link-button">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
