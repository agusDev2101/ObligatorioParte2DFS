import { useEffect, useState } from "react";
import {
  obtenerReviewsApi,
  obtenerCategoriasApi,
  crearReviewApi,
  eliminarReviewApi,
} from "../services/services.js";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [creando, setCreando] = useState(false);

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

      setReviews(reviewsData);
      setCategories(categoriesData);
    } catch (error) {
      if (error.name !== "CanceledError") {
        setError(error.message || "Error al cargar datos");
      }
    }
  };

  cargarDatos();

  return () => controller.abort();
}, []);


  const obtenerNombreCategoria = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };


  const handleDelete = async (id) => {
  const confirmar = confirm("¿Seguro que querés eliminar esta reseña?");
  if (!confirmar) return;

  try {
    setError("");
    setMensaje("");

    await eliminarReviewApi(id);

    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== id && review._id !== id)
    );

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
      const nuevaReview = await crearReviewApi(form);

      setReviews([nuevaReview, ...reviews]);
      limpiarFormulario();
      setMensaje("Reseña creada correctamente.");
    } catch (error) {
      setError(error.message || "Error al crear la reseña");
    } finally {
      setCreando(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3">Reseñas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Agregar nueva reseña</h3>

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
                  {creando ? "Creando..." : "Crear reseña"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p>No hay reseñas cargadas.</p>
      ) : (
        <div className="row g-3">
          {reviews.map((review) => (
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