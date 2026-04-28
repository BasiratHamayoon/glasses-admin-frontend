import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchExpenses, fetchTransactions, fetchFinancialSummary, 
  fetchCashFlowReports, fetchProfitLossReports, createExpense, createTransaction,
  fetchCategoryWiseExpense, fetchMonthlyComparison, fetchShopWiseReport
} from '../actions/financeActions';

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    expenses: { items: [], summary: {}, loading: false, pagination: {} },
    transactions: { items: [], summary: {}, loading: false, pagination: {} },
    reports: { 
      cashFlow: [], profitLoss: [], summary: {}, 
      categoryExpenses: [], monthlyComparison: [], shopWise: [],
      loading: false 
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.pending, (state) => { state.expenses.loading = true; })
           .addCase(fetchExpenses.fulfilled, (state, action) => { state.expenses.loading = false; state.expenses.items = action.payload.expenses; state.expenses.summary = action.payload.summary; state.expenses.pagination = action.payload.pagination; })
           .addCase(createExpense.fulfilled, (state, action) => { state.expenses.items.unshift(action.payload); });

    builder.addCase(fetchTransactions.pending, (state) => { state.transactions.loading = true; })
           .addCase(fetchTransactions.fulfilled, (state, action) => { state.transactions.loading = false; state.transactions.items = action.payload.transactions; state.transactions.summary = action.payload.summary; state.transactions.pagination = action.payload.pagination; })
           .addCase(createTransaction.fulfilled, (state, action) => { state.transactions.items.unshift(action.payload); });

    builder.addCase(fetchFinancialSummary.pending, (state) => { state.reports.loading = true; })
           .addCase(fetchFinancialSummary.fulfilled, (state, action) => { state.reports.loading = false; state.reports.summary = action.payload; })
           .addCase(fetchCashFlowReports.fulfilled, (state, action) => { state.reports.cashFlow = action.payload.reports; })
           .addCase(fetchProfitLossReports.fulfilled, (state, action) => { state.reports.profitLoss = action.payload.reports; })
           .addCase(fetchCategoryWiseExpense.fulfilled, (state, action) => { state.reports.categoryExpenses = action.payload; })
           .addCase(fetchMonthlyComparison.fulfilled, (state, action) => { state.reports.monthlyComparison = action.payload; })
           .addCase(fetchShopWiseReport.fulfilled, (state, action) => { state.reports.shopWise = action.payload; });
  },
});
export default financeSlice.reducer;