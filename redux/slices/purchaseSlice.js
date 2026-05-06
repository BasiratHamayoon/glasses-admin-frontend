import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllPurchases,
  fetchPendingEditRequests,
  approveEditRequest,
  rejectEditRequest,
} from '../actions/purchaseActions';

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState: {
    purchases: {
      items: [],
      loading: false,
      error: null,
      pagination: {},
    },
    pendingRequests: {
      items: [],
      loading: false,
      error: null,
      pagination: {},
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.purchases.loading = true;
        state.purchases.error = null;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases.loading = false;
        state.purchases.items = action.payload.purchases || [];
        state.purchases.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.purchases.loading = false;
        state.purchases.error = action.payload;
      })

      .addCase(fetchPendingEditRequests.pending, (state) => {
        state.pendingRequests.loading = true;
        state.pendingRequests.error = null;
      })
      .addCase(fetchPendingEditRequests.fulfilled, (state, action) => {
        state.pendingRequests.loading = false;
        state.pendingRequests.items = action.payload.requests || [];
        state.pendingRequests.pagination = action.payload.pagination || {};
      })
      .addCase(fetchPendingEditRequests.rejected, (state, action) => {
        state.pendingRequests.loading = false;
        state.pendingRequests.error = action.payload;
      })

      .addCase(approveEditRequest.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        state.pendingRequests.items = state.pendingRequests.items.filter(
          (item) => item._id !== action.payload._id
        );
      })

      .addCase(rejectEditRequest.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        state.pendingRequests.items = state.pendingRequests.items.filter(
          (item) => item._id !== action.payload._id
        );
      });
  },
});

export default purchaseSlice.reducer;