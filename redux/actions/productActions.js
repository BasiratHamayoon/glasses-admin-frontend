import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const cleanParams = (params) => {
  const cleaned = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value != null && (!Array.isArray(value) || value.length > 0)) {
        if (key === 'status' && Array.isArray(value)) {
          cleaned[key] = value.join(',');
          cleaned['statusOperator'] = 'OR';
        } else {
          cleaned[key] = Array.isArray(value) && value.length === 1
            ? value[0]
            : Array.isArray(value)
            ? value.join(',')
            : value;
        }
      }
    });
  }
  return cleaned;
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/products', {
        params: cleanParams(params),
        headers: { 'Cache-Control': 'no-cache' },
      });
      return {
        products:
          response.data?.data?.products ||
          response.data?.products ||
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
      const { loading } = getState().products;
      if (loading) return false;
      return true;
    },
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/products', data);
      return (
        response.data?.data?.product ||
        response.data?.product ||
        response.data?.data ||
        response.data
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/products/${id}`, data);
      return (
        response.data?.data?.product ||
        response.data?.product ||
        response.data?.data ||
        response.data
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleProductFlag = createAsyncThunk(
  'products/toggleFlag',
  async ({ id, field }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/products/${id}/toggle`, { field });
      return (
        response.data?.data?.product ||
        response.data?.product ||
        response.data?.data ||
        response.data
      );
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);