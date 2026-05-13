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

export const fetchInventoryProducts = createAsyncThunk(
  'inventory/fetchInventoryProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/products', {
        params: { limit: 500, status: 'ACTIVE' },
      });
      return response.data?.data?.products || response.data?.products || response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { initialized, loading } = getState().inventory.inventoryProducts;
      if (initialized || loading) return false;
      return true;
    },
  }
);

export const fetchInventoryShops = createAsyncThunk(
  'inventory/fetchInventoryShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/shops', { params: { limit: 100 } });
      return response.data?.data?.shops || response.data?.shops || response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { initialized, loading } = getState().inventory.inventoryShops;
      if (initialized || loading) return false;
      return true;
    },
  }
);

export const fetchStocks = createAsyncThunk(
  'inventory/fetchStocks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stocks', { params: cleanParams(params) });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().inventory.stocks.loading) return false;
      return true;
    },
  }
);

export const fetchStockValuation = createAsyncThunk(
  'inventory/fetchStockValuation',
  async (shopId = null, { rejectWithValue }) => {
    try {
      const params = shopId ? { shopId } : {};
      const response = await api.get('/admin/stocks/valuation', { params });
      return response.data?.data?.valuation || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading, initialized } = getState().inventory.stockValuation;
      if (loading || initialized) return false;
      return true;
    },
  }
);

export const fetchStockByProductAndShop = createAsyncThunk(
  'inventory/fetchStockByProductAndShop',
  async ({ productId, shopId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/stocks/product/${productId}/shop/${shopId}`);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStockHistory = createAsyncThunk(
  'inventory/fetchStockHistory',
  async ({ productId, shopId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/stocks/history/${productId}/${shopId}`);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/stocks', data);
      return response.data.data.stock;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shop stock');
    }
  }
);

export const deleteStock = createAsyncThunk(
  'inventory/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/stocks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stock');
    }
  }
);

export const addStockToMultipleShops = createAsyncThunk(
  'inventory/addToMultipleShops',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/stocks/multi-shop', data);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add stock to multiple shops');
    }
  }
);

export const fetchWebsiteStocks = createAsyncThunk(
  'inventory/fetchWebsiteStocks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/website-stocks', { params: cleanParams(params) });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().inventory.websiteStocks.loading) return false;
      return true;
    },
  }
);

export const updateWebsiteStock = createAsyncThunk(
  'inventory/updateWebsiteStock',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/website-stocks', data);
      return response.data.data.stock;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update website stock');
    }
  }
);

export const deleteWebsiteStock = createAsyncThunk(
  'inventory/deleteWebsiteStock',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/website-stocks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete website stock');
    }
  }
);

export const fetchWebsiteStockSummary = createAsyncThunk(
  'inventory/fetchWebSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/website-stocks/summary');
      return response.data.data.summary;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { summaryLoading, summaryInitialized } = getState().inventory.websiteStocks;
      if (summaryLoading || summaryInitialized) return false;
      return true;
    },
  }
);

export const fetchAdjustments = createAsyncThunk(
  'inventory/fetchAdjustments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/adjustments', { params: cleanParams(params) });
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().inventory.adjustments.loading) return false;
      return true;
    },
  }
);

export const createAdjustment = createAsyncThunk(
  'inventory/createAdjustment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/adjustments', data);
      return response.data?.data?.adjustment || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const quickAdjust = createAsyncThunk(
  'inventory/quickAdjust',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/adjustments/quick-adjust', data);
      return response.data?.data?.adjustment || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approveAdjustment = createAsyncThunk(
  'inventory/approveAdjustment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/adjustments/${id}/approve`, data);
      return response.data?.data?.adjustment || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const applyAdjustment = createAsyncThunk(
  'inventory/applyAdjustment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/adjustments/${id}/apply`);
      return response.data?.data?.adjustment || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectAdjustment = createAsyncThunk(
  'inventory/rejectAdjustment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/adjustments/${id}/reject`, data);
      return response.data?.data?.adjustment || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchTransfers = createAsyncThunk(
  'inventory/fetchTransfers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/transfers', { params: cleanParams(params) });
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().inventory.transfers.loading) return false;
      return true;
    },
  }
);

export const createTransfer = createAsyncThunk(
  'inventory/createTransfer',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/transfers', data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approveTransfer = createAsyncThunk(
  'inventory/approveTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transfers/${id}/approve`, data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectTransfer = createAsyncThunk(
  'inventory/rejectTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transfers/${id}/reject`, data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const shipTransfer = createAsyncThunk(
  'inventory/shipTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transfers/${id}/ship`, data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const receiveTransfer = createAsyncThunk(
  'inventory/receiveTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transfers/${id}/receive`, data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const cancelTransfer = createAsyncThunk(
  'inventory/cancelTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transfers/${id}/cancel`, data);
      return response.data?.data?.transfer || response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);