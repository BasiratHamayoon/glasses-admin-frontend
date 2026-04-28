import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const cleanParams = (params) => {
  const cleaned = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value != null && (!Array.isArray(value) || value.length > 0)) {
        cleaned[key] = Array.isArray(value) && value.length === 1 ? value[0] : Array.isArray(value) ? value.join(',') : value;
      }
    });
  }
  return cleaned;
};

export const fetchStocks = createAsyncThunk('inventory/fetchStocks', async (params) => {
  const response = await api.get('/admin/stocks', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const updateStock = createAsyncThunk('inventory/updateStock', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/stocks', data);
    return response.data.data.stock;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update shop stock');
  }
});

export const fetchWebsiteStocks = createAsyncThunk('inventory/fetchWebsiteStocks', async (params) => {
  const response = await api.get('/admin/website-stocks', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const updateWebsiteStock = createAsyncThunk('inventory/updateWebsiteStock', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/website-stocks', data);
    return response.data.data.stock;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update website stock');
  }
});

export const fetchWebsiteStockSummary = createAsyncThunk('inventory/fetchWebSummary', async () => {
  const response = await api.get('/admin/website-stocks/summary', { params: { _t: Date.now() } });
  return response.data.data.summary;
});