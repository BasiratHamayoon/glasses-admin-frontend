import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCustomers, createCustomer, updateCustomer, fetchCustomerStats,
  fetchPrescriptions, createPrescription, fetchOverdueCredits 
} from '../actions/customerActions';

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: { items: [], loading: false, pagination: {} },
    prescriptions: { items: [], loading: false, pagination: {} },
    overdueCredits: { items: [], loading: false },
    stats: null
  },
  reducers: {},
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
      .addCase(createCustomer.fulfilled, (state, action) => { 
        const newCustomer = action.payload?.customer || action.payload?.data?.customer || action.payload;
        if (newCustomer && newCustomer._id) {
          state.customers.items = [newCustomer, ...state.customers.items];
        } 
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const updatedCustomer = action.payload?.customer || action.payload?.data?.customer || action.payload;
        if (updatedCustomer && updatedCustomer._id) {
          const i = state.customers.items.findIndex(c => c._id === updatedCustomer._id);
          if (i !== -1) {
            state.customers.items[i] = updatedCustomer;
          }
        }
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => { 
        state.stats = action.payload?.stats || action.payload?.data?.stats || action.payload; 
      });

    builder
      .addCase(fetchPrescriptions.pending, (state) => { 
        state.prescriptions.loading = true; 
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.prescriptions.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) state.prescriptions.items = payload;
        else if (payload && Array.isArray(payload.prescriptions)) state.prescriptions.items = payload.prescriptions;
        else if (payload && Array.isArray(payload.data)) state.prescriptions.items = payload.data;
        else state.prescriptions.items = [];
        state.prescriptions.pagination = payload?.pagination || {};
      })
      .addCase(createPrescription.fulfilled, (state, action) => { 
        const newRx = action.payload?.prescription || action.payload?.data?.prescription || action.payload;
        if (newRx && newRx._id) {
          state.prescriptions.items = [newRx, ...state.prescriptions.items];
        }
      });

    builder
      .addCase(fetchOverdueCredits.pending, (state) => { 
        state.overdueCredits.loading = true; 
      })
      .addCase(fetchOverdueCredits.fulfilled, (state, action) => {
        state.overdueCredits.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) state.overdueCredits.items = payload;
        else if (payload && Array.isArray(payload.credits)) state.overdueCredits.items = payload.credits;
        else if (payload && Array.isArray(payload.data)) state.overdueCredits.items = payload.data;
        else state.overdueCredits.items = [];
      });
  },
});

export default customerSlice.reducer;