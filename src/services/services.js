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
        const customError = {
            message:
                error.response?.data?.message ||
                error.message ||
                "Error desconocido",
            status:
                error.response?.status || 500,
            data:
                error.response?.data || null,
            originalError: error,
        };
        return Promise.reject(customError);
    }
);


export const obtenerTareasPaginadasApi = async (
    page = 1,
    limit = 10,
    signal
) => {
    const response = await api.get(
        `/todos?page=${page}&limit=${limit}`,
        { signal }
    );
    return response?.data?.todos || [];
};


export const obtenerTareasApi = async (signal) => {
    const response = await api.get("/todos", {
        signal,
    });
    console.log('response.data', response.data);
    return response?.data?.todos || [];
};

export const agregarTareaApi = async (tarea, signal) => {
    const response = await api.post(
        "/todos",
        tarea,
        { signal }
    );
    console.log("response.data", response.data);
    return response.data;


};

export const eliminarTareaApi = async (id, signal) => {
    const response = await api.delete(
        `/todos/${id}`,
        {
            signal,
        }
    );
    console.log('response.data', response.data);
    return response.data;
};


export const editarTareaApi = async (id, data, signal) => {
    const response = await api.patch(
        `/todos/${id}`,
        data,
        {
            signal,
        }
    );
    console.log("response.data", response.data);
    return response.data;
};

//obtener usuarios de la api de ayuda
export const obtenerUsuariosApi = async () => {
    return fetch(`${URL_TYPICODE}/users`)
        .then(response => response.json())
        .then(json => {
            console.log('json', json);
            return json
        })
}

export const LoginApi = async (email, password) => {
    try {
        const response = await axios.post(
            `${URL_BASE}/auth/login`,
            {
                email,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('json', response.data);
        return response.data?.data?.token || response.data?.token;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const RegisterApi = async (username, email, password, role = "reviewer") => {
  try {
    const response = await axios.post(
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
      }
    );

    return response.data?.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};