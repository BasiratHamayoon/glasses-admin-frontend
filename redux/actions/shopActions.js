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

export const fetchShops = createAsyncThunk('shops/fetchAll', async (params) => {
  const response = await api.get('/admin/shops', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const getShopById = createAsyncThunk('shops/getById', async (id) => {
  const response = await api.get(`/admin/shops/${id}`, { params: { _t: Date.now() } });
  return response.data.data; 
});

export const createShop = createAsyncThunk('shops/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/shops', data);
    return response.data.data.shop;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create shop');
  }
});

export const updateShop = createAsyncThunk('shops/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/shops/${id}`, data);
    return response.data.data.shop;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update shop');
  }
});

export const deleteShop = createAsyncThunk('shops/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/shops/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete shop');
  }
});