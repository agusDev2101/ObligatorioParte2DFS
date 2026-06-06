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

        <div className="container py-4">
            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-12 col-md-9">
                    <input
                        className="form-control"
                        type="text"
                        value={titulo}
                        onChange={(event) => setTitulo(event.target.value)}
                        placeholder="Buscar película por título"
                    />
                </div>
                <div className="col-12 col-md-3 d-grid">
                    <button className="nav-item-modern" type="submit" disabled={buscando}>
                        {buscando ? "Buscando..." : "Buscar"}
                    </button>
                </div>
            </form>

            {error ? <div className="alert alert-warning">{error}</div> : null}

            <div className="row g-3">
                {peliculas.map((pelicula, index) => {
                    const nombre = pelicula?.title || "Sin título";
                    const descripcion = pelicula?.overview || "Sin descripción.";

                    return (
                        <div className="col-12 col-md-6 col-lg-4" key={pelicula.id}>
                            <div className="card h-100">
                                <div className="card-body text-start">
                                    <h3 className="h5 card-title">{nombre}</h3>
                                    <p className="card-text text-secondary">{descripcion}</p>
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
