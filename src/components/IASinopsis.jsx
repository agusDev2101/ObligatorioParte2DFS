import { useState, useEffect } from "react";
import { generarSinopsisApi } from "../services/services.js";
import { useNavigate } from "react-router-dom";

const GenerarSinopsis = () => {
    const navigate = useNavigate();
    const [sinopsis, setSinopsis] = useState("");
    const [error, setError] = useState("");
    const [resultado, setResultado] = useState("");
    const [generando, setGenerando] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const termino = sinopsis.trim();
        if (!termino) {
            setError("Ingresá un texto para generar la sinopsis.");
            return;
        }

        setGenerando(true);
        setError("");

        try {
            const respuesta = await generarSinopsisApi(termino);
            setResultado(respuesta);
        } catch (err) {
            setError(err?.message || "No se pudo generar la sinopsis.");
        } finally {
            setGenerando(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <div className="container py-4">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">MyApp</h1>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-12 col-md-9">
                    <input
                        className="form-control"
                        type="text"
                        value={sinopsis}
                        onChange={(e) => setSinopsis(e.target.value)}
                        placeholder="Ingresá un texto para generar la sinopsis"
                    />
                </div>

                <div className="col-12 col-md-3 d-grid">
                    <button className="btn btn-primary" type="submit" disabled={generando}>
                        {generando ? "Generando..." : "Generar Sinopsis"}
                    </button>
                </div>
            </form>

            {error && <div className="alert alert-warning">{error}</div>}

            <div className="row g-3">
                {resultado && (
                    <div className="col-12">
                        <div className="card h-100">
                            <div className="card-body text-start">
                                <p className="card-text text-secondary">{resultado}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerarSinopsis;