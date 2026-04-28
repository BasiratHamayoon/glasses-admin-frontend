import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchProducts, createProduct, updateProduct, 
  deleteProduct, toggleProductFlag 
} from '../actions/productActions';

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], pagination: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedProducts = action.payload?.products;
        state.items = Array.isArray(fetchedProducts) ? fetchedProducts : []; 
        state.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.items = [];
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          const index = state.items.findIndex(p => p._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
          }
        }
      })
      .addCase(toggleProductFlag.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          const index = state.items.findIndex(p => p._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;