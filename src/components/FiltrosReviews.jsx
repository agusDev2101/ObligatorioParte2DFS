const FiltrosReviews = ({
  filtroTitulo,
  setFiltroTitulo,
  filtroCategoria,
  setFiltroCategoria,
  categories,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="h5 mb-3">Filtros</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Buscar por película</label>
            <input
              type="text"
              className="form-control"
              value={filtroTitulo}
              onChange={(e) => setFiltroTitulo(e.target.value)}
              placeholder="Ej: John Wick"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Filtrar por categoría</label>
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              type="button"
              onClick={() => {
                setFiltroTitulo("");
                setFiltroCategoria("");
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltrosReviews;
