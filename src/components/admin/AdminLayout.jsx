import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <section>{children}</section>;
}
