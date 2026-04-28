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

export const fetchSalaryStructures = createAsyncThunk('salary/fetchStructures', async (params) => {
  const response = await api.get('/admin/salaries/structures', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});

export const createSalaryStructure = createAsyncThunk('salary/createStructure', async (data) => {
  const response = await api.post('/admin/salaries/structures', data);
  return response.data.data.structure;
});

export const updateSalaryStructure = createAsyncThunk('salary/updateStructure', async ({ id, data }) => {
  const response = await api.put(`/admin/salaries/structures/${id}`, data);
  return response.data.data.structure;
});

export const deleteSalaryStructure = createAsyncThunk('salary/deleteStructure', async (id) => {
  await api.delete(`/admin/salaries/structures/${id}`);
  return id;
});

export const fetchSalariesByMonth = createAsyncThunk('salary/fetchSalariesByMonth', async ({ month, year, params }) => {
  const response = await api.get(`/admin/salaries/month/${month}/${year}`, { 
    params: { ...cleanParams(params), _t: Date.now() } 
  });
  return response.data.data;
});

export const fetchSalariesByEmployee = createAsyncThunk('salary/fetchByEmployee', async ({ employeeId, month, year }) => {
  const response = await api.get(`/admin/salaries/employee/${employeeId}/history`, {
    params: { month, year }
  });
  const salaries = response.data.data.salaries || [];
  const currentMonthSalary = salaries.find(s => s.month === month && s.year === year);
  return { employeeId, salary: currentMonthSalary, allSalaries: salaries };
});

export const addSalaryPayment = createAsyncThunk('salary/addPayment', async (data) => {
  const response = await api.post('/admin/salaries/add-payment', data);
  return response.data.data.salary;
});

export const processSalaryPayment = createAsyncThunk('salary/processPayment', async ({ id, data }) => {
  const response = await api.post(`/admin/salaries/${id}/payment`, data);
  return response.data.data.salary;
});