import { createSlice } from "@reduxjs/toolkit";
import {
  fetchShops,
  createShop,
  updateShop,
  deleteShop,
} from "../actions/shopActions";

const shopSlice = createSlice({
  name: "shops",
  initialState: {
    shops: {
      items: [],
      loading: false,
      pagination: {},
      initialized: false,
      error: null,
    },
  },
  reducers: {
    resetShopsInitialized: (state) => {
      state.shops.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.shops.loading = true;
        state.shops.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.shops.loading = false;
        state.shops.initialized = true;
        state.shops.items =
          action.payload?.shops ||
          (Array.isArray(action.payload) ? action.payload : []);
        state.shops.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.shops.loading = false;
        state.shops.initialized = true;
        state.shops.error = action.payload;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        if (action.payload) {
          state.shops.items.unshift(action.payload);
        }
        state.shops.initialized = false;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.shops.items.findIndex(
          (s) => s._id === action.payload._id
        );
        if (idx !== -1) state.shops.items[idx] = action.payload;
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.shops.items = state.shops.items.filter(
          (s) => s._id !== action.payload
        );
        state.shops.initialized = false;
      });
  },
});

export const { resetShopsInitialized } = shopSlice.actions;
export default shopSlice.reducer;