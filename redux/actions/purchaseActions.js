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

export const fetchAllPurchases = createAsyncThunk(
  'purchases/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/purchases/all', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch purchases');
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().purchases.purchases.loading) return false;
      return true;
    },
  }
);

export const fetchPendingEditRequests = createAsyncThunk(
  'purchases/fetchPendingRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/purchases/pending-requests', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch pending requests');
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().purchases.pendingRequests.loading) return false;
      return true;
    },
  }
);

export const approveEditRequest = createAsyncThunk(
  'purchases/approveEdit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/purchases/${id}/approve-edit`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to approve edit request');
    }
  }
);

export const rejectEditRequest = createAsyncThunk(
  'purchases/rejectEdit',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/purchases/${id}/reject-edit`, { rejectionReason });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to reject edit request');
    }
  }
);