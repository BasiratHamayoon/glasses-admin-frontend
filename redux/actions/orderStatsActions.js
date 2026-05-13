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

export const fetchSalesSummary = createAsyncThunk(
  'orderStats/fetchSummary',
  async (params) => {
    const response = await api.get('/admin/sales/stats/summary', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchShopLeaderboard = createAsyncThunk(
  'orderStats/fetchLeaderboard',
  async (params) => {
    const response = await api.get('/admin/sales/stats/leaderboard', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchShopComparison = createAsyncThunk(
  'orderStats/fetchComparison',
  async (params) => {
    const response = await api.get('/admin/sales/stats/comparison', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchSalesGraphData = createAsyncThunk(
  'orderStats/fetchGraphData',
  async (params) => {
    const response = await api.get('/admin/sales/stats/graph', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchTopProducts = createAsyncThunk(
  'orderStats/fetchTopProducts',
  async (params) => {
    const response = await api.get('/admin/sales/stats/top-products', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchProductCrossShop = createAsyncThunk(
  'orderStats/fetchProductCrossShop',
  async (params) => {
    const response = await api.get('/admin/sales/stats/products/cross-shop', {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);

export const fetchShopDetails = createAsyncThunk(
  'orderStats/fetchShopDetails',
  async ({ shopId, ...params }) => {
    const response = await api.get(`/admin/sales/stats/${shopId}/details`, {
      params: { ...cleanParams(params), _t: Date.now() },
    });
    return response.data.data;
  }
);