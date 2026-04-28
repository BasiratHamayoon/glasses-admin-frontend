import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCategories, fetchCategoryTree, createCategory, 
  updateCategory, deleteCategory 
} from '../actions/categoryActions';

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], tree: [], pagination: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedCats = action.payload?.categories;
        state.items = Array.isArray(fetchedCats) ? fetchedCats : [];
        state.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.items = [];
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.tree = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) state.items.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          const index = state.items.findIndex(c => c._id === action.payload._id);
          if (index !== -1) state.items[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;