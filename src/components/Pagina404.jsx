import { useNavigate } from "react-router-dom";

const Pagina404 = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="not-found-code">404</p>
        <h1>Página no encontrada</h1>
        <p className="not-found-text">
          La ruta que buscas no existe o fue movida.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </main>
  );
};

export default Pagina404;
