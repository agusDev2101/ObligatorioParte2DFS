import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    cargarReviews: (state, action) => {
      state.reviews = action.payload;
    },
    agregarReview: (state, action) => {
      state.reviews.unshift(action.payload);
    },
    eliminarReview: (state, action) => {
      state.reviews = state.reviews.filter(
        (review) =>
          review.id !== action.payload && review._id !== action.payload,
      );
    },
    actualizarReview: (state, action) => {
      const reviewActualizada = action.payload;
      state.reviews = state.reviews.map((review) =>
        review.id === reviewActualizada.id ? reviewActualizada : review,
      );
    },
  },
});

export const {
  cargarReviews,
  agregarReview,
  eliminarReview,
  actualizarReview,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
