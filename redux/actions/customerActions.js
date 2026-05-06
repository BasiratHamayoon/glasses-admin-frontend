import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const cleanParams = (params) => {
  const cleaned = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value != null && (!Array.isArray(value) || value.length > 0)) {
        
        if (Array.isArray(value)) {
          // Uses '|' (OR operator) instead of ',' when multiple items exist in the filter
          cleaned[key] = value.length === 1 ? value[0] : value.join('|');
        } else if (typeof value === 'string') {
          // Replaces '&' with '|' (OR operator) if it exists in string values
          cleaned[key] = value.replace(/&/g, '|');
        } else {
          cleaned[key] = value;
        }

      }
    });
  }
  return cleaned;
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/customers', {
        params: cleanParams(params),
        headers: { 'Cache-Control': 'no-cache' },
      });
      return {
        customers: response.data?.data?.customers || response.data?.customers || [],
        pagination: response.data?.data?.pagination || response.data?.pagination || {},
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().customers.customers.loading) return false;
      return true;
    },
  }
);

export const getCustomerById = createAsyncThunk(
  'customers/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/customers/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/customers', data);
      return response.data.data.customer;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/customers/${id}`, data);
      return response.data.data.customer;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  'customers/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/customers/stats');
      return response.data.data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { statsLoading, statsInitialized } = getState().customers;
      if (statsLoading || statsInitialized) return false;
      return true;
    },
  }
);

export const fetchPrescriptions = createAsyncThunk(
  'customers/fetchPrescriptions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/prescriptions', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createPrescription = createAsyncThunk(
  'customers/createPrescription',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/prescriptions', data);
      return response.data.data.prescription;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create prescription'
      );
    }
  }
);

export const fetchOverdueCredits = createAsyncThunk(
  'customers/fetchOverdueCredits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/credits/overdue');
      return response.data.data.credits;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCreditLimit = createAsyncThunk(
  'customers/updateCreditLimit',
  async ({ customerId, creditLimit }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/credits/${customerId}/limit`, {
        creditLimit,
      });
      return response.data.data.customer;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);