import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./features/loadingSlice.js";
import reviewsSlice from "./features/reviewsSlice.js";
import categoriesSlice from "./features/categoriesSlice.js";
export const store = configureStore({
  reducer: {
    loadingSlice,
    reviewsSlice,
    categoriesSlice,
  },
});
