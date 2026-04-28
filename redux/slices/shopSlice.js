import { createSlice } from '@reduxjs/toolkit';
import { fetchShops, createShop, updateShop, deleteShop } from '../actions/shopActions';

const shopSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: { items: [], loading: false, pagination: {} }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => { state.shops.loading = true; })
      .addCase(fetchShops.fulfilled, (state, action) => { 
        state.shops.loading = false; 
        state.shops.items = action.payload.shops || action.payload || []; 
        state.shops.pagination = action.payload.pagination || {}; 
      })
      .addCase(createShop.fulfilled, (state, action) => { 
        state.shops.items.unshift(action.payload); 
      })
      .addCase(updateShop.fulfilled, (state, action) => { 
        const i = state.shops.items.findIndex(s => s._id === action.payload._id); 
        if (i !== -1) state.shops.items[i] = action.payload; 
      })
      .addCase(deleteShop.fulfilled, (state, action) => { 
        state.shops.items = state.shops.items.filter(s => s._id !== action.payload); 
      });
  },
});

export default shopSlice.reducer;