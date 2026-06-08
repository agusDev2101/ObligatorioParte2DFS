import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    cargarCategorias: (state, action) => {
      state.categories = action.payload;
    },
    agregarCategoria: (state, action) => {
      state.categories.push(action.payload);
    },
    eliminarCategoria: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
    actualizarCategoria: (state, action) => {
      const categoriaActualizada = action.payload;

      state.categories = state.categories.map((category) =>
        category.id === categoriaActualizada.id
          ? categoriaActualizada
          : category,
      );
    },
  },
});

export const {
  cargarCategorias,
  agregarCategoria,
  eliminarCategoria,
  actualizarCategoria,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
