import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState,
    reducers: {
        cargaInicialUsuarios: (state, action) => {
            return action.payload;
        },
        agregarUsuarioRedux: (state, action) => {
            const usuario = action.payload;
            state.push(usuario);
        },

        eliminarUsuarioRedux: (state, action) => {
            const id = action.payload;
            const index = state.findIndex((u) => u.id === id);
            const encontro = index !== -1;
            if (encontro) {
                state.splice(index, 1);
            }
        },
    },
});
export const {
    cargaInicialUsuarios,
    agregarUsuarioRedux,
    eliminarUsuarioRedux,
} = usuariosSlice.actions;
export default usuariosSlice.reducer;