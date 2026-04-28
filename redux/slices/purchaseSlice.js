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
    // All purchases list
    purchases: {
      items: [],
      loading: false,
      error: null,
      pagination: {},
    },
    // Pending edit requests
    pendingRequests: {
      items: [],
      loading: false,
      error: null,
      pagination: {},
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // ── Fetch All Purchases ──
    builder
      .addCase(fetchAllPurchases.pending, (state) => {
        state.purchases.loading = true;
        state.purchases.error = null;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases.loading = false;
        state.purchases.items = action.payload.purchases;
        state.purchases.pagination = action.payload.pagination;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.purchases.loading = false;
        state.purchases.error = action.payload;
      });

    // ── Fetch Pending Edit Requests ──
    builder
      .addCase(fetchPendingEditRequests.pending, (state) => {
        state.pendingRequests.loading = true;
        state.pendingRequests.error = null;
      })
      .addCase(fetchPendingEditRequests.fulfilled, (state, action) => {
        state.pendingRequests.loading = false;
        state.pendingRequests.items = action.payload.requests;
        state.pendingRequests.pagination = action.payload.pagination;
      })
      .addCase(fetchPendingEditRequests.rejected, (state, action) => {
        state.pendingRequests.loading = false;
        state.pendingRequests.error = action.payload;
      });

    // ── Approve Edit Request ──
    builder.addCase(approveEditRequest.fulfilled, (state, action) => {
      // Remove from pending list after approval
      state.pendingRequests.items = state.pendingRequests.items.filter(
        (item) => item._id !== action.payload._id
      );
    });

    // ── Reject Edit Request ──
    builder.addCase(rejectEditRequest.fulfilled, (state, action) => {
      // Remove from pending list after rejection
      state.pendingRequests.items = state.pendingRequests.items.filter(
        (item) => item._id !== action.payload._id
      );
    });
  },
});

export default purchaseSlice.reducer;