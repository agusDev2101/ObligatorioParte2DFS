import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp <= currentTime) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      setCheckingAuth(false);
      const timeUntilExpire = (decoded.exp - currentTime) * 1000;
      const timeout = setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }, timeUntilExpire);

      return () => clearTimeout(timeout);
    } catch {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };
  if (checkingAuth) {
    return <h1>Cargando...</h1>;
  }

  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">MyApp</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <nav className="mb-4">
        <Link className="btn btn-link" to="/">
          Home
        </Link>
        <Link className="btn btn-link" to="/tareas">
          Tareas
        </Link>
        <Link className="btn btn-link" to="/tareas/nueva">
          Nueva tarea
        </Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
