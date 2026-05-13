import { createSlice } from '@reduxjs/toolkit';
import {
  fetchExpenses, fetchTransactions, fetchFinancialSummary,
  fetchCashFlowReports, fetchProfitLossReports,
  createExpense, createTransaction,
  fetchCategoryWiseExpense, fetchMonthlyComparison, fetchShopWiseReport,
  generateCashFlow, generateProfitLoss,
  approveExpense, rejectExpense, payExpense,
  reconcileTransaction, reverseTransaction,
} from '../actions/financeActions';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    expenses: { items: [], summary: {}, loading: false, pagination: {} },
    transactions: { items: [], summary: {}, loading: false, pagination: {} },
    reports: {
      summary: {},
      summaryLoading: false,
      summaryInitialized: false,

      cashFlow: [],
      cashFlowLoading: false,
      cashFlowInitialized: false,

      profitLoss: [],
      profitLossLoading: false,
      profitLossInitialized: false,

      categoryExpenses: [],
      categoryLoading: false,
      categoryInitialized: false,

      monthlyComparison: [],
      monthlyLoading: false,
      monthlyInitialized: false,

      shopWise: [],
      shopWiseLoading: false,
      shopWiseInitialized: false,

      loading: false,
    },
  },
  reducers: {
    invalidateSummary: (state) => {
      state.reports.summaryInitialized = false;
    },
    invalidateCashFlow: (state) => {
      state.reports.cashFlowInitialized = false;
    },
    invalidateProfitLoss: (state) => {
      state.reports.profitLossInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.expenses.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses.loading = false;
        state.expenses.items = action.payload.expenses || [];
        state.expenses.summary = action.payload.summary || {};
        state.expenses.pagination = action.payload.pagination || {};
      })
      .addCase(fetchExpenses.rejected, (state) => {
        state.expenses.loading = false;
      })

      .addCase(createExpense.fulfilled, (state, action) => {
        if (action.payload?._id) state.expenses.items.unshift(action.payload);
        state.reports.summaryInitialized = false;
      })

      .addCase(approveExpense.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.expenses.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.expenses.items[idx] = action.payload;
        state.reports.summaryInitialized = false;
      })

      .addCase(rejectExpense.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.expenses.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.expenses.items[idx] = action.payload;
      })

      .addCase(payExpense.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.expenses.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.expenses.items[idx] = action.payload;
        state.reports.summaryInitialized = false;
      })

      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.items = action.payload.transactions || [];
        state.transactions.summary = action.payload.summary || {};
        state.transactions.pagination = action.payload.pagination || {};
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.transactions.loading = false;
      })

      .addCase(createTransaction.fulfilled, (state, action) => {
        if (action.payload?._id) state.transactions.items.unshift(action.payload);
        state.reports.summaryInitialized = false;
      })

      .addCase(reconcileTransaction.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transactions.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.transactions.items[idx] = action.payload;
        state.reports.summaryInitialized = false;
      })

      .addCase(reverseTransaction.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transactions.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.transactions.items[idx] = action.payload;
        state.reports.summaryInitialized = false;
      })

      .addCase(fetchFinancialSummary.pending, (state) => {
        state.reports.summaryLoading = true;
      })
      .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
        state.reports.summaryLoading = false;
        state.reports.summaryInitialized = true;
        state.reports.summary = action.payload || {};
      })
      .addCase(fetchFinancialSummary.rejected, (state) => {
        state.reports.summaryLoading = false;
        state.reports.summaryInitialized = true;
      })

      .addCase(fetchCashFlowReports.pending, (state) => {
        state.reports.cashFlowLoading = true;
      })
      .addCase(fetchCashFlowReports.fulfilled, (state, action) => {
        state.reports.cashFlowLoading = false;
        state.reports.cashFlowInitialized = true;
        state.reports.cashFlow = action.payload.reports || [];
      })
      .addCase(fetchCashFlowReports.rejected, (state) => {
        state.reports.cashFlowLoading = false;
        state.reports.cashFlowInitialized = true;
      })

      .addCase(fetchProfitLossReports.pending, (state) => {
        state.reports.profitLossLoading = true;
      })
      .addCase(fetchProfitLossReports.fulfilled, (state, action) => {
        state.reports.profitLossLoading = false;
        state.reports.profitLossInitialized = true;
        state.reports.profitLoss = action.payload.reports || [];
      })
      .addCase(fetchProfitLossReports.rejected, (state) => {
        state.reports.profitLossLoading = false;
        state.reports.profitLossInitialized = true;
      })

      .addCase(fetchCategoryWiseExpense.pending, (state) => {
        state.reports.categoryLoading = true;
      })
      .addCase(fetchCategoryWiseExpense.fulfilled, (state, action) => {
        state.reports.categoryLoading = false;
        state.reports.categoryInitialized = true;
        state.reports.categoryExpenses = action.payload || [];
      })
      .addCase(fetchCategoryWiseExpense.rejected, (state) => {
        state.reports.categoryLoading = false;
        state.reports.categoryInitialized = true;
      })

      .addCase(fetchMonthlyComparison.pending, (state) => {
        state.reports.monthlyLoading = true;
      })
      .addCase(fetchMonthlyComparison.fulfilled, (state, action) => {
        state.reports.monthlyLoading = false;
        state.reports.monthlyInitialized = true;
        state.reports.monthlyComparison = action.payload || [];
      })
      .addCase(fetchMonthlyComparison.rejected, (state) => {
        state.reports.monthlyLoading = false;
        state.reports.monthlyInitialized = true;
      })

      .addCase(fetchShopWiseReport.pending, (state) => {
        state.reports.shopWiseLoading = true;
      })
      .addCase(fetchShopWiseReport.fulfilled, (state, action) => {
        state.reports.shopWiseLoading = false;
        state.reports.shopWiseInitialized = true;
        state.reports.shopWise = action.payload || [];
      })
      .addCase(fetchShopWiseReport.rejected, (state) => {
        state.reports.shopWiseLoading = false;
        state.reports.shopWiseInitialized = true;
      })

      .addCase(generateCashFlow.fulfilled, (state, action) => {
        if (action.payload?._id) state.reports.cashFlow.unshift(action.payload);
        state.reports.cashFlowInitialized = false;
      })

      .addCase(generateProfitLoss.fulfilled, (state, action) => {
        if (action.payload?._id) state.reports.profitLoss.unshift(action.payload);
        state.reports.profitLossInitialized = false;
      });
  },
});

export const { invalidateSummary, invalidateCashFlow, invalidateProfitLoss } =
  financeSlice.actions;
export default financeSlice.reducer;