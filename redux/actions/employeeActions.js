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

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (params) => {
  const response = await api.get('/admin/employees', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const createEmployee = createAsyncThunk('employees/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/employees', data);
    return response.data.data.employee;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
  }
});

export const createEmployeeWithUser = createAsyncThunk('employees/createWithUser', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/employees/with-user', data);
    return response.data.data.employee;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create employee account');
  }
});

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/employees/${id}`, data);
    return response.data.data.employee;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
  }
});

export const updateEmployeeStatus = createAsyncThunk('employees/updateStatus', async ({ id, status }) => {
  const response = await api.patch(`/admin/employees/${id}/status`, { status });
  return response.data.data.employee;
});

export const deleteEmployee = createAsyncThunk('employees/delete', async (id) => {
  await api.delete(`/admin/employees/${id}`);
  return id;
});

export const fetchShifts = createAsyncThunk('shifts/fetchAll', async (params) => {
  const response = await api.get('/admin/shifts', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const createShift = createAsyncThunk('shifts/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/shifts', data);
    return response.data.data.shift;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create shift');
  }
});

export const updateShift = createAsyncThunk('shifts/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/shifts/${id}`, data);
    return response.data.data.shift;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update shift');
  }
});

export const toggleShiftStatus = createAsyncThunk('shifts/toggle', async (id) => {
  const response = await api.patch(`/admin/shifts/${id}/toggle`);
  return response.data.data.shift;
});

export const deleteShift = createAsyncThunk('shifts/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/shifts/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete shift');
  }
});