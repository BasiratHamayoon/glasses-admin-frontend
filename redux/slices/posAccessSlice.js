import { createSlice } from '@reduxjs/toolkit';
import { fetchShopUsers, assignShopUser, removeShopUser } from '../actions/posAccessActions';

const posAccessSlice = createSlice({
  name: 'posAccess',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchShopUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchShopUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeShopUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u._id !== action.payload);
      });
  },
});

export default posAccessSlice.reducer;