import axios from "axios";
const URL_TYPICODE = import.meta.env.VITE_TYPICODE_URL;
const URL_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      const publicPaths = ["/login", "/register"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }

    const customError = {
      message:
        error.response?.data?.message || error.message || "Error desconocido",
      status: status || 500,
      data: error.response?.data || null,
      originalError: error,
    };
    return Promise.reject(customError);
  },
);

export const LoginApi = async (email, password) => {
  try {
    const response = await axios.post(
      `${URL_BASE}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data?.data?.token || response.data?.token;
  } catch (error) {
    throw error;
  }
};

export const RegisterApi = async (
  username,
  email,
  password,
  role = "reviewer",
) => {
  try {
    const response = await api.post(
      `${URL_BASE}/auth/register`,
      {
        username,
        email,
        password,
        role,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const buscarPeliculasApi = async (text) => {
    const response = await api.get(
        `/movies/search?query=${encodeURIComponent(text)}`
    );

    const data = response.data;

    if (Array.isArray(data)) return data;
    return data?.results || data?.movies || data?.data || [];
};

export const generarSinopsisApi = async (text) => {
  try {
    const response = await api.post(
            `/ia/transform`,
      {
        text
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data?.data ?? response.data;
    return typeof data === "string" ? data : data?.text || data?.sinopsis || "";
  } catch (error) {
    throw error;
  }
}
//obtener reviews de la api y categorias de la api

export const obtenerReviewsApi = async (signal) => {
  const response = await api.get("/reviews", { signal });
  return response.data?.reviews || [];
};

export const crearReviewApi = async (review, signal) => {
  const formData = new FormData();

  formData.append("movieTitle", review.movieTitle);
  formData.append("rating", review.rating);
  formData.append("comment", review.comment);
  formData.append("categoryId", review.categoryId);

  if (review.image) {
    formData.append("image", review.image);
  }

  const response = await api.post("/reviews", formData, {
    signal,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.review;
};

export const eliminarReviewApi = async (id, signal) => {
  const response = await api.delete(`/reviews/${id}`, { signal });
  return response.data;
};

export const editarReviewApi = async (id, review, signal) => {
  const formData = new FormData();

  if (review.movieTitle) formData.append("movieTitle", review.movieTitle);
  if (review.rating) formData.append("rating", review.rating);
  if (review.comment) formData.append("comment", review.comment);
  if (review.categoryId) formData.append("categoryId", review.categoryId);
  if (review.image) formData.append("image", review.image);

  const response = await api.patch(`/reviews/${id}`, formData, {
    signal,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.review;
};

export const obtenerCategoriasApi = async (signal) => {
  const response = await api.get("/categories", { signal });
  return response.data?.categories || [];
};

export const cambiarPlanApi = async (signal) => {
  const response = await api.patch(
    "/users/plan",
    { plan: "premium" },
    { signal },
  );

  return response.data?.data;
};

export const crearCategoriaApi = async (category, signal) => {
  const response = await api.post("/categories", category, { signal });
  return response.data?.category;
};

export const eliminarCategoriaApi = async (id, signal) => {
  const response = await api.delete(`/categories/${id}`, { signal });
  return response.data;
};

export const editarCategoriaApi = async (id, category, signal) => {
  const response = await api.patch(`/categories/${id}`, category, { signal });
  return response.data?.category;
};
