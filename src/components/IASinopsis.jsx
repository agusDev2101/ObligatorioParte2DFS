import { useState } from "react";
import { generarSinopsisApi } from "../services/services.js";

const GenerarSinopsis = () => {
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

return (
    <div className="container py-5">
        {/* Formulario de Generación */}
        <form onSubmit={handleSubmit} className="row g-3 mb-5 align-items-center bg-light p-4 rounded-3 shadow-sm">
            <div className="col-12 col-md-9">
                <input
                    className="form-control form-control-lg border-2"
                    type="text"
                    value={sinopsis}
                    onChange={(e) => setSinopsis(e.target.value)}
                    placeholder="Ingresá un texto para generar la sinopsis..."
                    style={{ borderRadius: '8px' }}
                />
            </div>
            <div className="col-12 col-md-3 d-grid">
                <button 
                    className="btn btn-primary btn-lg fw-bold shadow-sm" 
                    type="submit" 
                    disabled={generando}
                    style={{ borderRadius: '8px', transition: 'all 0.2s ease' }}
                >
                    {generando ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Generando...
                        </>
                    ) : "Generar"}
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

        {/* Bloque de Resultado */}
        <div className="row g-4">
            {resultado && (
                <div className="col-12">
                    <div 
                        className="card h-100 border-0 shadow-sm rounded-3"
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
                        <div className="card-body p-4 text-start">
                            <p className="card-text text-secondary lh-lg m-0">
                                {resultado}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
};

export default GenerarSinopsis;