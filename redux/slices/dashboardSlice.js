import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardStats, fetchWeeklySales, fetchSystemStatus } from '../actions/dashboardActions';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    weeklySales: [],
    systemStatus: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeeklySales.fulfilled, (state, action) => {
        state.weeklySales = action.payload;
      })
      .addCase(fetchSystemStatus.fulfilled, (state, action) => {
        state.systemStatus = action.payload;
      });
  },
});

export default dashboardSlice.reducer;