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

export const fetchExpenses = createAsyncThunk('finance/fetchExpenses', async (params) => {
  const response = await api.get('/admin/expenses', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});
export const createExpense = createAsyncThunk('finance/createExpense', async (data) => {
  const response = await api.post('/admin/expenses', data);
  return response.data.data.expense;
});
export const payExpense = createAsyncThunk('finance/payExpense', async ({ id, data }) => {
  const response = await api.patch(`/admin/expenses/${id}/pay`, data);
  return response.data.data.expense;
});
export const approveExpense = createAsyncThunk('finance/approveExpense', async (id) => {
  const response = await api.patch(`/admin/expenses/${id}/approve`);
  return response.data.data.expense;
});
export const rejectExpense = createAsyncThunk('finance/rejectExpense', async ({ id, data }) => {
  const response = await api.patch(`/admin/expenses/${id}/reject`, data);
  return response.data.data.expense;
});

export const fetchTransactions = createAsyncThunk('finance/fetchTransactions', async (params) => {
  const response = await api.get('/admin/transactions', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});
export const createTransaction = createAsyncThunk('finance/createTransaction', async (data) => {
  const response = await api.post('/admin/transactions', data);
  return response.data.data.transaction;
});
export const reconcileTransaction = createAsyncThunk('finance/reconcileTransaction', async ({ id, data }) => {
  const response = await api.patch(`/admin/transactions/${id}/reconcile`, data);
  return response.data.data.transaction;
});
export const reverseTransaction = createAsyncThunk('finance/reverseTransaction', async ({ id, data }) => {
  const response = await api.post(`/admin/transactions/${id}/reverse`, data);
  return response.data.data;
});

export const fetchFinancialSummary = createAsyncThunk('finance/fetchSummary', async (params) => {
  const response = await api.get('/admin/reports/financial-summary', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});
export const fetchCategoryWiseExpense = createAsyncThunk('finance/fetchCategoryExpense', async (params) => {
  const response = await api.get('/admin/reports/category-wise-expense', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data.report;
});
export const fetchMonthlyComparison = createAsyncThunk('finance/fetchMonthlyComparison', async (params) => {
  const response = await api.get('/admin/reports/monthly-comparison', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data.report;
});
export const fetchShopWiseReport = createAsyncThunk('finance/fetchShopWiseReport', async (params) => {
  const response = await api.get('/admin/reports/shop-wise', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data.report;
});

export const fetchCashFlowReports = createAsyncThunk('finance/fetchCashFlow', async (params) => {
  const response = await api.get('/admin/reports/cash-flow', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});
export const generateCashFlow = createAsyncThunk('finance/generateCashFlow', async (data) => {
  const response = await api.post('/admin/reports/cash-flow', data);
  return response.data.data.report;
});
export const fetchProfitLossReports = createAsyncThunk('finance/fetchProfitLoss', async (params) => {
  const response = await api.get('/admin/reports/profit-loss', { params: { ...cleanParams(params), _t: Date.now() } });
  return response.data.data;
});
export const generateProfitLoss = createAsyncThunk('finance/generateProfitLoss', async (data) => {
  const response = await api.post('/admin/reports/profit-loss', data);
  return response.data.data.report;
});