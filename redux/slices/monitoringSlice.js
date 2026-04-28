import { createSlice } from '@reduxjs/toolkit';
import { fetchFullMonitoring } from '../actions/monitoringActions';

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState: { 
    data: { dashboard: null, performance: [], pendingDues: null, staffOverview: [], closingStatus: null }, 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullMonitoring.pending, (state) => { state.loading = true; })
      .addCase(fetchFullMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFullMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default monitoringSlice.reducer;