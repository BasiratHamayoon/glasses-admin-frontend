import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const cleanParams = (params) => {
  const cleaned = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== '' &&
        value != null &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        cleaned[key] =
          Array.isArray(value) && value.length === 1
            ? value[0]
            : Array.isArray(value)
            ? value.join(',')
            : value;
      }
    });
  }
  return cleaned;
};

export const fetchPOSOrders = createAsyncThunk(
  'orders/fetchPOS',
  async (params) => {
    const response = await api.get('/admin/admin-orders/pos', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchPOSOrderById = createAsyncThunk(
  'orders/fetchPOSById',
  async (id) => {
    const response = await api.get(`/admin/admin-orders/pos/${id}`);
    return response.data.data;
  }
);

export const cancelPOSOrder = createAsyncThunk(
  'orders/cancelPOS',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/admin-orders/pos/${id}/cancel`,
        { reason }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel POS order'
      );
    }
  }
);

export const updatePOSOrderStatus = createAsyncThunk(
  'orders/updatePOSStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/orders/${id}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update POS order status'
      );
    }
  }
);

export const fetchWebsiteOrders = createAsyncThunk(
  'orders/fetchWebsite',
  async (params) => {
    const response = await api.get('/admin/admin-orders/website', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchWebsiteOrderById = createAsyncThunk(
  'orders/fetchWebsiteById',
  async (id) => {
    const response = await api.get(`/admin/admin-orders/website/${id}`);
    return response.data.data;
  }
);

export const cancelWebsiteOrder = createAsyncThunk(
  'orders/cancelWebsite',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/admin-orders/website/${id}/cancel`,
        { reason }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel Website order'
      );
    }
  }
);

export const updateWebsiteOrderStatus = createAsyncThunk(
  'orders/updateWebsiteStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/orders/${id}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update Website order status'
      );
    }
  }
);

export const approveCancellation = createAsyncThunk(
  'orders/approveCancellation',
  async ({ id, orderType }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/orders/${id}/approve-cancellation`
      );
      return { order: response.data.data?.order, orderType };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve cancellation'
      );
    }
  }
);

export const rejectCancellation = createAsyncThunk(
  'orders/rejectCancellation',
  async ({ id, reason, orderType }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/admin/orders/${id}/reject-cancellation`,
        { reason }
      );
      return { order: response.data.data?.order, orderType };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject cancellation'
      );
    }
  }
);

export const permanentlyDeleteOrder = createAsyncThunk(
  'orders/permanentlyDelete',
  async ({ id, orderType }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/orders/${id}/permanent`);
      return { result: response.data.data, orderId: id, orderType };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to permanently delete order'
      );
    }
  }
);