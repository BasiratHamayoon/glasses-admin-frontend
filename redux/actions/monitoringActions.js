import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchFullMonitoring = createAsyncThunk(
  'monitoring/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const safeGet = (url) =>
        api.get(url).catch((e) => {
          console.warn(`[monitoring] ${url} failed:`, e.message);
          return { data: { data: null } };
        });

      const [dashRes, analyticsRes, closingRes] = await Promise.all([
        safeGet('/admin/monitoring/dashboard'),
        safeGet('/admin/monitoring/shop-analytics'),
        safeGet('/admin/monitoring/daily-closing-status'),
      ]);

      const dashboard = dashRes.data?.data?.dashboard
                     || dashRes.data?.data
                     || {};

      const analyticsData = analyticsRes.data?.data || {};

      const performance = analyticsData.performance?.shops
                       || (Array.isArray(analyticsData.performance)
                           ? analyticsData.performance
                           : []);

      const pendingDues = analyticsData.pendingDues || { shops: [], totalDue: 0, shopCount: 0 };

      const staffOverview = analyticsData.staffOverview?.staffByShop
                         || (Array.isArray(analyticsData.staffOverview)
                             ? analyticsData.staffOverview
                             : []);

      const closingStatus = closingRes.data?.data || { status: [], closedCount: 0, pendingCount: 0 };

      return {
        dashboard,
        performance,
        pendingDues,
        staffOverview,
        closingStatus,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllClosings = createAsyncThunk(
  'monitoring/fetchAllClosings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/monitoring/closings', { params });
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPendingClosings = createAsyncThunk(
  'monitoring/fetchPendingClosings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/monitoring/closings/pending', { params });
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchClosingDetails = createAsyncThunk(
  'monitoring/fetchClosingDetails',
  async (closingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/monitoring/closings/${closingId}`);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const approveClosing = createAsyncThunk(
  'monitoring/approveClosing',
  async ({ closingId, remarks = '' }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/monitoring/closings/${closingId}/approve`,
        { remarks }
      );
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectClosing = createAsyncThunk(
  'monitoring/rejectClosing',
  async ({ closingId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/monitoring/closings/${closingId}/reject`,
        { reason }
      );
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const adjustClosing = createAsyncThunk(
  'monitoring/adjustClosing',
  async ({ closingId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/monitoring/closings/${closingId}/adjust`,
        data
      );
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const reopenClosing = createAsyncThunk(
  'monitoring/reopenClosing',
  async ({ closingId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/monitoring/closings/${closingId}/reopen`,
        { reason }
      );
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createClosingForShop = createAsyncThunk(
  'monitoring/createClosing',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/monitoring/closings/create', data);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const bulkApproveClosings = createAsyncThunk(
  'monitoring/bulkApprove',
  async ({ closingIds, remarks = '' }, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/monitoring/closings/bulk-approve', {
        closingIds,
        remarks,
      });
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteClosing = createAsyncThunk(
  'monitoring/deleteClosing',
  async ({ closingId, reason }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/monitoring/closings/${closingId}`, {
        data: { reason },
      });
      return { closingId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);