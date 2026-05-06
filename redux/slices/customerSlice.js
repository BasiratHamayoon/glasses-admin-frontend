import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  fetchCustomerStats,
  fetchPrescriptions,
  createPrescription,
  fetchOverdueCredits,
} from '../actions/customerActions';

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: { items: [], loading: false, pagination: {} },
    prescriptions: { items: [], loading: false, pagination: {} },
    overdueCredits: { items: [], loading: false },
    stats: null,
    statsLoading: false,
    statsInitialized: false,
  },
  reducers: {
    invalidateStats: (state) => {
      state.statsInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customers.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers.loading = false;
        state.customers.items = action.payload?.customers || [];
        state.customers.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.customers.loading = false;
      })

      .addCase(createCustomer.fulfilled, (state, action) => {
        const newCustomer = action.payload?.customer || action.payload;
        if (newCustomer?._id) {
          state.customers.items.unshift(newCustomer);
        }
        state.statsInitialized = false;
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        const updated = action.payload?.customer || action.payload;
        if (updated?._id) {
          const idx = state.customers.items.findIndex(
            (c) => c._id === updated._id
          );
          if (idx !== -1) state.customers.items[idx] = updated;
        }
      })

      .addCase(fetchCustomerStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.statsInitialized = true;
        state.stats = action.payload?.stats || action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state) => {
        state.statsLoading = false;
        state.statsInitialized = true;
      })

      .addCase(fetchPrescriptions.pending, (state) => {
        state.prescriptions.loading = true;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.prescriptions.loading = false;
        const p = action.payload;
        if (Array.isArray(p)) state.prescriptions.items = p;
        else if (p && Array.isArray(p.prescriptions))
          state.prescriptions.items = p.prescriptions;
        else if (p && Array.isArray(p.data))
          state.prescriptions.items = p.data;
        else state.prescriptions.items = [];
        state.prescriptions.pagination = p?.pagination || {};
      })
      .addCase(fetchPrescriptions.rejected, (state) => {
        state.prescriptions.loading = false;
      })

      .addCase(createPrescription.fulfilled, (state, action) => {
        const newRx = action.payload?.prescription || action.payload;
        if (newRx?._id) {
          state.prescriptions.items.unshift(newRx);
        }
      })

      .addCase(fetchOverdueCredits.pending, (state) => {
        state.overdueCredits.loading = true;
      })
      .addCase(fetchOverdueCredits.fulfilled, (state, action) => {
        state.overdueCredits.loading = false;
        const p = action.payload;
        if (Array.isArray(p)) state.overdueCredits.items = p;
        else if (p && Array.isArray(p.credits))
          state.overdueCredits.items = p.credits;
        else if (p && Array.isArray(p.data))
          state.overdueCredits.items = p.data;
        else state.overdueCredits.items = [];
      })
      .addCase(fetchOverdueCredits.rejected, (state) => {
        state.overdueCredits.loading = false;
      });
  },
});

export const { invalidateStats } = customerSlice.actions;
export default customerSlice.reducer;