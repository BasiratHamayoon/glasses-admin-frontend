import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const cleanParams = (params) => {
  const cleaned = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value != null && (!Array.isArray(value) || value.length > 0)) {
        cleaned[key] = Array.isArray(value) && value.length === 1 
          ? value[0] 
          : Array.isArray(value) 
          ? value.join(',') 
          : value;
      }
    });
  }
  return cleaned;
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/categories', {
        params: cleanParams(params),
        headers: { 'Cache-Control': 'no-cache' },
      });
      return {
        categories:
          response.data?.data?.categories ||
          response.data?.categories ||
          response.data?.data ||
          [],
        pagination:
          response.data?.data?.pagination ||
          response.data?.pagination ||
          {},
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().categories;
      if (loading) return false;
      return true;
    },
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'categories/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/categories/tree');
      return (
        response.data?.data?.categories ||
        response.data?.data ||
        []
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/categories', data);
      return (
        response.data?.data?.category ||
        response.data?.category ||
        response.data
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/categories/${id}`, data);
      return (
        response.data?.data?.category ||
        response.data?.category ||
        response.data
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);