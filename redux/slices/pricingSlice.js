import { createSlice } from '@reduxjs/toolkit';
import { fetchPricingRules } from '../actions/pricingActions';

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingRules.pending, (state) => { state.loading = true; })
      .addCase(fetchPricingRules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPricingRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default pricingSlice.reducer;