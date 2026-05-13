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

export const fetchSalaryStructures = createAsyncThunk(
  'salary/fetchStructures',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/salaries/structures', { params: cleanParams(params) });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().salary.structures.loading) return false;
      return true;
    },
  }
);

export const createSalaryStructure = createAsyncThunk(
  'salary/createStructure',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/salaries/structures', data);
      return response.data.data.structure;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSalaryStructure = createAsyncThunk(
  'salary/updateStructure',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/salaries/structures/${id}`, data);
      return response.data.data.structure;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSalaryStructure = createAsyncThunk(
  'salary/deleteStructure',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/salaries/structures/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSalariesByMonth = createAsyncThunk(
  'salary/fetchSalariesByMonth',
  async ({ month, year, params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/salaries/month/${month}/${year}`, {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().salary.salaries.loading) return false;
      return true;
    },
  }
);

export const fetchSalariesByEmployee = createAsyncThunk(
  'salary/fetchByEmployee',
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/salaries/employee/${employeeId}/history`, {
        params: { month, year },
      });
      const salaries = response.data.data.salaries || [];
      const currentMonthSalary = salaries.find(s => s.month === month && s.year === year);
      return { employeeId, salary: currentMonthSalary, allSalaries: salaries };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addSalaryPayment = createAsyncThunk(
  'salary/addPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/salaries/add-payment', data);
      return response.data.data.salary;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const processSalaryPayment = createAsyncThunk(
  'salary/processPayment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/salaries/${id}/payment`, data);
      return response.data.data.salary;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);