import { useNavigate } from "react-router-dom";
import Login from "../components/admin/Login";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleSubmit = async (email, password) => {
    const admin = await login(email, password);
    if (admin) {
      navigate("/admin");
    }
  };

  return <Login onSubmit={handleSubmit} loading={loading} error={error} />;
}
