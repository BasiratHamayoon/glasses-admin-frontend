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

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params) => {
  const config = { 
    params: { ...cleanParams(params), _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' }
  };
  const response = await api.get('/admin/products', config);
  
  return {
    products: response.data?.data?.products || response.data?.products || response.data?.data || [],
    pagination: response.data?.data?.pagination || response.data?.pagination || {}
  };
});

export const createProduct = createAsyncThunk('products/create', async (data) => {
  const response = await api.post('/admin/products', data);
  return response.data?.data?.product || response.data?.product || response.data?.data || response.data;
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }) => {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data?.data?.product || response.data?.product || response.data?.data || response.data;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await api.delete(`/admin/products/${id}`);
  return id;
});

export const toggleProductFlag = createAsyncThunk('products/toggleFlag', async ({ id, field }) => {
  const response = await api.patch(`/admin/products/${id}/toggle`, { field });
  return response.data?.data?.product || response.data?.product || response.data?.data || response.data;
});