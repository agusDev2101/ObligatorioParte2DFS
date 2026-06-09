import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  agregarCategoria,
  eliminarCategoria,
  actualizarCategoria,
} from "../redux/features/categoriesSlice.js";
import {
  crearCategoriaApi,
  eliminarCategoriaApi,
  editarCategoriaApi,
} from "../services/services.js";

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoriesSlice.categories);

  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const limpiarFormulario = () => {
    setForm({ name: "", description: "" });
    setCategoriaEditando(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleEditarClick = (category) => {
    setCategoriaEditando(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!form.name.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    try {
      if (categoriaEditando) {
        const categoriaActualizada = await editarCategoriaApi(
          categoriaEditando.id,
          form,
        );

        dispatch(actualizarCategoria(categoriaActualizada));
        setMensaje("Categoría actualizada correctamente.");
      } else {
        const nuevaCategoria = await crearCategoriaApi(form);

        dispatch(agregarCategoria(nuevaCategoria));
        setMensaje("Categoría creada correctamente.");
      }

      limpiarFormulario();
    } catch (error) {
      setError(error.message || "Error al guardar categoría");
    }
  };

  const handleDelete = async (id) => {
    const confirmar = confirm("¿Seguro que querés eliminar esta categoría?");
    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarCategoriaApi(id);

      dispatch(eliminarCategoria(id));
      setMensaje("Categoría eliminada correctamente.");
    } catch (error) {
      setError(error.message || "Error al eliminar categoría");
    }
  };

  return (
    <section className="card mb-4">
      <div className="card-body">
        <h3 className="h5 mb-3">
          {categoriaEditando ? "Editar categoría" : "Gestión de categorías"}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && <div className="alert alert-success">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Acción"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Descripción</label>
              <input
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción opcional"
              />
            </div>

            <div className="col-md-2 d-flex align-items-end gap-2">
              <button className="btn btn-primary w-100" type="submit">
                {categoriaEditando ? "Guardar" : "Crear"}
              </button>

              {categoriaEditando && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        {categories.length === 0 ? (
          <p>No hay categorías cargadas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || "-"}</td>
                    <td>{category.active ? "Activa" : "Inactiva"}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        type="button"
                        onClick={() => handleEditarClick(category)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() => handleDelete(category.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
