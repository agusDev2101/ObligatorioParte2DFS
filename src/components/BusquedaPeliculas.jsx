import { useState } from "react";
import { buscarPeliculasApi } from "../services/services.js";

const BusquedaPeliculas = () => {
    const [titulo, setTitulo] = useState("");
    const [peliculas, setPeliculas] = useState([]);
    const [error, setError] = useState("");
    const [buscando, setBuscando] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const termino = titulo.trim();
        if (!termino) {
            setPeliculas([]);
            setError("Ingresá un título para buscar.");
            return;
        }

        setBuscando(true);
        setError("");

        try {
            const respuesta = await buscarPeliculasApi(termino);

            setPeliculas(respuesta.slice(0, 7));
            if (respuesta.length === 0) {
                setError("No se encontraron resultados.");
            }
        } catch (err) {
            setPeliculas([]);
            setError(err?.message || "No se pudo completar la búsqueda.");
        } finally {
            setBuscando(false);
        }
    };

   return (
    <div className="container py-5">
        {/* Formulario de Búsqueda */}
        <form onSubmit={handleSubmit} className="row g-3 mb-5 align-items-center bg-light p-4 rounded-3 shadow-sm">
            <div className="col-12 col-md-9">
                <input
                    className="form-control form-control-lg border-2"
                    type="text"
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                    placeholder="Buscar película por título..."
                    style={{ borderRadius: '8px' }}
                />
            </div>
            <div className="col-12 col-md-3 d-grid">
                <button 
                    className="btn btn-primary btn-lg fw-bold shadow-sm" 
                    type="submit" 
                    disabled={buscando}
                    style={{ borderRadius: '8px', transition: 'all 0.2s ease' }}
                >
                    {buscando ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Buscando...
                        </>
                    ) : "Buscar"}
                </button>
            </div>
        </form>

        {/* Alerta de Error */}
        {error && (
            <div className="alert alert-danger d-flex align-items-center rounded-3 shadow-sm mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
            </div>
        )}

        {/* Grilla de Películas */}
        <div className="row g-4">
            {peliculas.map((pelicula) => {
                const nombre = pelicula?.title || "Sin título";
                const descripcion = pelicula?.overview || "Sin descripción disponible.";

                return (
                    <div className="col-12 col-md-6 col-lg-4" key={pelicula.id}>
                        <div 
                            className="card h-100 border-0 shadow-sm rounded-3 modern-card"
                            style={{ 
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div className="card-body p-4 text-start d-flex flex-column justify-content-between">
                                <div>
                                    <h3 className="h5 card-title fw-bold text-dark mb-3" style={{ lineHeight: '1.4' }}>
                                        {nombre}
                                    </h3>
                                    <p className="card-text text-muted small" style={{ display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);
};

export default BusquedaPeliculas;
