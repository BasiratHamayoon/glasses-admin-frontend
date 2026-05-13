import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const makeLookupActions = (sliceName, endpoint) => ({
  fetchAll: createAsyncThunk(
    `${sliceName}/fetchAll`,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.get(endpoint, { params });
        return {
          data: response.data?.data?.data || response.data?.data || [],
          pagination: response.data?.data?.pagination || response.data?.pagination || {},
        };
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  create: createAsyncThunk(
    `${sliceName}/create`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await api.post(endpoint, data);
        return response.data?.data || response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  update: createAsyncThunk(
    `${sliceName}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.put(`${endpoint}/${id}`, data);
        return response.data?.data || response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  remove: createAsyncThunk(
    `${sliceName}/remove`,
    async (id, { rejectWithValue }) => {
      try {
        await api.delete(`${endpoint}/${id}`);
        return id;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  toggle: createAsyncThunk(
    `${sliceName}/toggle`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.patch(`${endpoint}/${id}/toggle`);
        return response.data?.data || response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  reorder: createAsyncThunk(
    `${sliceName}/reorder`,
    async (items, { rejectWithValue }) => {
      try {
        const response = await api.patch(`${endpoint}/reorder`, { items });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
  bulkCreate: createAsyncThunk(
    `${sliceName}/bulkCreate`,
    async (items, { rejectWithValue }) => {
      try {
        const response = await api.post(`${endpoint}/bulk`, { items });
        return response.data?.data || response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  ),
});

export const frameShapeActions = makeLookupActions('frameShapes', '/admin/frame-shapes');
export const frameMaterialActions = makeLookupActions('frameMaterials', '/admin/frame-materials');
export const frameTypeActions = makeLookupActions('frameTypes', '/admin/frame-types');
export const lensTypeActions = makeLookupActions('lensTypes', '/admin/lens-types');
export const lensMaterialActions = makeLookupActions('lensMaterials', '/admin/lens-materials');