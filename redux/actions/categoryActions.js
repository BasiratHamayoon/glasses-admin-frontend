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

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (params) => {
  const response = await api.get('/admin/categories', { 
    params: { ...cleanParams(params), _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' }
  });
  return {
    categories: response.data?.data?.categories || response.data?.categories || response.data?.data || [],
    pagination: response.data?.data?.pagination || response.data?.pagination || {}
  };
});

export const fetchCategoryTree = createAsyncThunk('categories/fetchTree', async () => {
  const response = await api.get('/admin/categories/tree', { 
    params: { _t: Date.now() } 
  });
  return response.data?.data?.categories || response.data?.data || [];
});

export const createCategory = createAsyncThunk('categories/create', async (data) => {
  const response = await api.post('/admin/categories', data);
  return response.data?.data?.category || response.data?.category || response.data;
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data?.data?.category || response.data?.category || response.data;
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await api.delete(`/admin/categories/${id}`);
  return id;
});