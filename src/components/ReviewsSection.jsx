import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  obtenerReviewsApi,
  obtenerCategoriasApi,
  crearReviewApi,
  eliminarReviewApi,
  cambiarPlanApi,
  editarReviewApi,
} from "../services/services.js";

import {
  cargarReviews,
  agregarReview,
  eliminarReview,
  actualizarReview,
} from "../redux/features/reviewsSlice.js";

import { cargarCategorias } from "../redux/features/categoriesSlice.js";

import CategoriesSection from "./CategoriesSection.jsx";
import GraficoReviews from "./GraficoReviews.jsx";
import FiltrosReviews from "./FiltrosReviews.jsx";
import PanelPlan from "./PanelPlan.jsx";

import { jwtDecode } from "jwt-decode";

const ReviewsSection = () => {
  const reviews = useSelector((state) => state.reviewsSlice.reviews);
  const categories = useSelector((state) => state.categoriesSlice.categories);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [creando, setCreando] = useState(false);
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [plan, setPlan] = useState("plus");
  const [actualizandoPlan, setActualizandoPlan] = useState(false);
  const [reviewEditando, setReviewEditando] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);

  const [form, setForm] = useState({
    movieTitle: "",
    rating: "",
    comment: "",
    categoryId: "",
    image: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const cargarDatos = async () => {
      try {
        const [reviewsData, categoriesData] = await Promise.all([
          obtenerReviewsApi(controller.signal),
          obtenerCategoriasApi(controller.signal),
        ]);

        const usuarioId = obtenerUsuarioLogueadoId();

        const reviewsDelUsuario = reviewsData.filter(
          (review) => review.userId?._id === usuarioId,
        );

        setRolUsuario(obtenerRolUsuario());
        setPlan(obtenerPlanUsuario());
        dispatch(cargarReviews(reviewsDelUsuario));
        dispatch(cargarCategorias(categoriesData));
      } catch (error) {
        const requestCanceled =
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED" ||
          error.message?.toLowerCase() === "canceled" ||
          error.originalError?.name === "CanceledError" ||
          error.originalError?.code === "ERR_CANCELED";

        if (!requestCanceled) {
          setError(error.message || "Error al cargar datos");
        }
      }
    };

    cargarDatos();

    return () => controller.abort();
  }, [dispatch]);

  const obtenerUsuarioLogueadoId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded.id || decoded._id || decoded.userId;
  };

  const obtenerRolUsuario = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded.role;
  };

  const obtenerPlanUsuario = () => {
    const token = localStorage.getItem("token");
    if (!token) return "plus";

    const decoded = jwtDecode(token);

    console.log("TOKEN DECODIFICADO:", decoded);

    return decoded.plan || "plus";
  };

  const obtenerNombreCategoria = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  const reviewsFiltradas = reviews.filter((review) => {
    const coincideTitulo = review.movieTitle
      .toLowerCase()
      .includes(filtroTitulo.toLowerCase());

    const coincideCategoria =
      filtroCategoria === "" || review.categoryId === filtroCategoria;

    return coincideTitulo && coincideCategoria;
  });

  const reviewsPorCategoria = categories.map((category) => {
    const cantidad = reviews.filter(
      (review) => review.categoryId === category.id,
    ).length;

    return {
      name: category.name,
      cantidad,
    };
  });

  const handleDelete = async (id) => {
    const confirmar = confirm("¿Seguro que querés eliminar esta reseña?");
    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");

      await eliminarReviewApi(id);

      dispatch(eliminarReview(id));
      setMensaje("Reseña eliminada correctamente.");
    } catch (error) {
      setError(error.message || "Error al eliminar");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const limpiarFormulario = () => {
    setForm({
      movieTitle: "",
      rating: "",
      comment: "",
      categoryId: "",
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!form.movieTitle || !form.rating || !form.comment || !form.categoryId) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    try {
      setCreando(true);

      if (reviewEditando) {
        const reviewActualizada = await editarReviewApi(
          reviewEditando.id,
          form,
        );

        dispatch(actualizarReview(reviewActualizada));

        setReviewEditando(null);
        limpiarFormulario();
        setMensaje("Reseña actualizada correctamente.");
      } else {
        const nuevaReview = await crearReviewApi(form);

        dispatch(agregarReview(nuevaReview));
        limpiarFormulario();
        setMensaje("Reseña creada correctamente.");
      }
    } catch (error) {
      setError(error.message || "Error al guardar la reseña");
    } finally {
      setCreando(false);
    }
  };

  const handleCambiarPlan = async () => {
    try {
      setError("");
      setMensaje("");
      setActualizandoPlan(true);

      const usuarioActualizado = await cambiarPlanApi();

      setPlan(usuarioActualizado?.plan || "premium");
      setMensaje("Plan actualizado a premium correctamente.");
    } catch (error) {
      setError(error.message || "Error al cambiar de plan");
    } finally {
      setActualizandoPlan(false);
    }
  };

  const handleEditarClick = (review) => {
    setReviewEditando(review);

    setForm({
      movieTitle: review.movieTitle || "",
      rating: review.rating || "",
      comment: review.comment || "",
      categoryId: review.categoryId || "",
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section>
      <h2 className="mb-3">Reseñas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">
            {reviewEditando ? "Editar reseña" : "Agregar nueva reseña"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Película</label>
                <input
                  type="text"
                  name="movieTitle"
                  className="form-control"
                  value={form.movieTitle}
                  onChange={handleChange}
                  placeholder="Ej: Interestellar"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Rating</label>
                <select
                  name="rating"
                  className="form-select"
                  value={form.rating}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="1">1/5</option>
                  <option value="2">2/5</option>
                  <option value="3">3/5</option>
                  <option value="4">4/5</option>
                  <option value="5">5/5</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Categoría</label>
                <select
                  name="categoryId"
                  className="form-select"
                  value={form.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Comentario</label>
                <textarea
                  name="comment"
                  className="form-control"
                  value={form.comment}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Escribí tu reseña..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={creando}
                >
                  {creando
                    ? "Guardando..."
                    : reviewEditando
                      ? "Guardar cambios"
                      : "Crear reseña"}
                </button>

                {reviewEditando && (
                  <button
                    className="btn btn-outline-secondary ms-2"
                    type="button"
                    onClick={() => {
                      setReviewEditando(null);
                      limpiarFormulario();
                    }}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <GraficoReviews reviewsPorCategoria={reviewsPorCategoria} />

      <FiltrosReviews
        filtroTitulo={filtroTitulo}
        setFiltroTitulo={setFiltroTitulo}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        categories={categories}
      />

      <PanelPlan
        plan={plan}
        reviewsCantidad={reviews.length}
        actualizandoPlan={actualizandoPlan}
        handleCambiarPlan={handleCambiarPlan}
      />

      {rolUsuario === "admin" && <CategoriesSection />}

      {reviewsFiltradas.length === 0 ? (
        <p>No hay reseñas cargadas.</p>
      ) : (
        <div className="row g-3">
          {reviewsFiltradas.map((review) => (
            <div className="col-md-4" key={review.id}>
              <div className="card h-100">
                {review.imageUrl && (
                  <img
                    src={review.imageUrl}
                    className="card-img-top"
                    alt={review.movieTitle}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">{review.movieTitle}</h5>
                  <p className="card-text">
                    {review.comment || "Sin comentario"}
                  </p>

                  <p className="mb-1">
                    <strong>Rating:</strong> {review.rating}/5
                  </p>

                  <p className="mb-1">
                    <strong>Categoría:</strong>{" "}
                    {obtenerNombreCategoria(review.categoryId)}
                  </p>

                  <p className="text-muted mb-0">
                    Usuario: {review.userId?.username || "Desconocido"}
                  </p>
                </div>

                <button
                  className="btn btn-outline-primary btn-sm mt-2 me-2"
                  onClick={() => handleEditarClick(review)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDelete(review.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
