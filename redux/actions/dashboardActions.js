import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const config = { params: { _t: Date.now() }, headers: { 'Cache-Control': 'no-cache' } };
      const response = await api.get('/admin/dashboard', config);
      return response.data.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchWeeklySales = createAsyncThunk(
  'dashboard/fetchWeeklySales',
  async (_, { rejectWithValue }) => {
    try {
      const config = { params: { _t: Date.now() }, headers: { 'Cache-Control': 'no-cache' } };
      const response = await api.get('/admin/dashboard/weekly-sales', config);
      return response.data.data.weeklySales;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly sales');
    }
  }
);

export const fetchSystemStatus = createAsyncThunk(
  'dashboard/fetchSystemStatus',
  async (_, { rejectWithValue }) => {
    try {
      const config = { params: { _t: Date.now() }, headers: { 'Cache-Control': 'no-cache' } };
      const response = await api.get('/admin/dashboard/system-status', config);
      return response.data.data.systemStatus;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system status');
    }
  }
);