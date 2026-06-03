import { configureStore } from '@reduxjs/toolkit'
import usuariosSlice from "./features/usuariosSlice.js";
import loadingSlice from "./features/loadingSlice.js";
export const store = configureStore({
    reducer: {
        usuariosSlice, loadingSlice
    }
})