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

export const fetchExpenses = createAsyncThunk(
  'finance/fetchExpenses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/expenses', { params: cleanParams(params) });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().finance.expenses.loading) return false;
      return true;
    },
  }
);

export const createExpense = createAsyncThunk(
  'finance/createExpense',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/expenses', data);
      return response.data.data.expense;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const payExpense = createAsyncThunk(
  'finance/payExpense',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/expenses/${id}/pay`, data);
      return response.data.data.expense;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approveExpense = createAsyncThunk(
  'finance/approveExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/expenses/${id}/approve`);
      return response.data.data.expense;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectExpense = createAsyncThunk(
  'finance/rejectExpense',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/expenses/${id}/reject`, data);
      return response.data.data.expense;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'finance/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/transactions', { params: cleanParams(params) });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().finance.transactions.loading) return false;
      return true;
    },
  }
);

export const createTransaction = createAsyncThunk(
  'finance/createTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/transactions', data);
      return response.data.data.transaction;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const reconcileTransaction = createAsyncThunk(
  'finance/reconcileTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/transactions/${id}/reconcile`, data);
      return response.data.data.transaction;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const reverseTransaction = createAsyncThunk(
  'finance/reverseTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/transactions/${id}/reverse`, data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchFinancialSummary = createAsyncThunk(
  'finance/fetchSummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/financial-summary', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { summaryLoading, summaryInitialized } = getState().finance.reports;
      if (summaryLoading || summaryInitialized) return false;
      return true;
    },
  }
);

export const fetchCategoryWiseExpense = createAsyncThunk(
  'finance/fetchCategoryExpense',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/category-wise-expense', {
        params: cleanParams(params),
      });
      return response.data.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { categoryLoading, categoryInitialized } = getState().finance.reports;
      if (categoryLoading || categoryInitialized) return false;
      return true;
    },
  }
);

export const fetchMonthlyComparison = createAsyncThunk(
  'finance/fetchMonthlyComparison',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/monthly-comparison', {
        params: cleanParams(params),
      });
      return response.data.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { monthlyLoading, monthlyInitialized } = getState().finance.reports;
      if (monthlyLoading || monthlyInitialized) return false;
      return true;
    },
  }
);

export const fetchShopWiseReport = createAsyncThunk(
  'finance/fetchShopWiseReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/shop-wise', {
        params: cleanParams(params),
      });
      return response.data.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { shopWiseLoading, shopWiseInitialized } = getState().finance.reports;
      if (shopWiseLoading || shopWiseInitialized) return false;
      return true;
    },
  }
);

export const fetchCashFlowReports = createAsyncThunk(
  'finance/fetchCashFlow',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/cash-flow', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { cashFlowLoading, cashFlowInitialized } = getState().finance.reports;
      if (cashFlowLoading || cashFlowInitialized) return false;
      return true;
    },
  }
);

export const generateCashFlow = createAsyncThunk(
  'finance/generateCashFlow',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/reports/cash-flow', data);
      return response.data.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProfitLossReports = createAsyncThunk(
  'finance/fetchProfitLoss',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/profit-loss', {
        params: cleanParams(params),
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { profitLossLoading, profitLossInitialized } = getState().finance.reports;
      if (profitLossLoading || profitLossInitialized) return false;
      return true;
    },
  }
);

export const generateProfitLoss = createAsyncThunk(
  'finance/generateProfitLoss',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/reports/profit-loss', data);
      return response.data.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);