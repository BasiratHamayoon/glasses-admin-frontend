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

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (params) => {
  const config = { 
    params: { ...cleanParams(params), _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' }
  };
  const response = await api.get('/admin/customers', config);
  
  return {
    customers: response.data?.data?.customers || response.data?.customers || [],
    pagination: response.data?.data?.pagination || response.data?.pagination || {}
  };
});

export const getCustomerById = createAsyncThunk('customers/getById', async (id) => {
  const response = await api.get(`/admin/customers/${id}`, { params: { _t: Date.now() } });
  return response.data.data; 
});

export const createCustomer = createAsyncThunk('customers/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/customers', data);
    return response.data.data.customer;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
  }
});

export const updateCustomer = createAsyncThunk('customers/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/customers/${id}`, data);
    return response.data.data.customer;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
  }
});

export const fetchCustomerStats = createAsyncThunk('customers/fetchStats', async () => {
  const response = await api.get('/admin/customers/stats', { params: { _t: Date.now() } });
  return response.data.data.stats;
});

export const fetchPrescriptions = createAsyncThunk('customers/fetchPrescriptions', async (params) => {
  const response = await api.get('/admin/prescriptions', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const createPrescription = createAsyncThunk('customers/createPrescription', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/prescriptions', data);
    return response.data.data.prescription;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create prescription');
  }
});

export const fetchOverdueCredits = createAsyncThunk('customers/fetchOverdueCredits', async () => {
  const response = await api.get('/admin/credits/overdue', { params: { _t: Date.now() } });
  return response.data.data.credits;
});

export const updateCreditLimit = createAsyncThunk('customers/updateCreditLimit', async ({ customerId, creditLimit }) => {
  const response = await api.patch(`/admin/credits/${customerId}/limit`, { creditLimit });
  return response.data.data.customer;
});