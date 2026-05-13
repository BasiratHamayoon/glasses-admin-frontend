import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllPurchases,
  fetchPendingEditRequests,
  approveEditRequest,
  rejectEditRequest,
  approvePurchase,
  rejectPurchase,
} from '../actions/purchaseActions';

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState: {
    purchases: {
      items:      [],
      loading:    false,
      error:      null,
      pagination: {},
      stats:      {},
    },
    pendingRequests: {
      items:      [],
      loading:    false,
      error:      null,
      pagination: {},
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ── Fetch all purchases ─────────────────────────────────────────────────
      .addCase(fetchAllPurchases.pending, (state) => {
        state.purchases.loading = true;
        state.purchases.error   = null;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.purchases.loading    = false;
        state.purchases.items      = action.payload.purchases  || [];
        state.purchases.pagination = action.payload.pagination || {};
        state.purchases.stats      = action.payload.stats      || {};
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.purchases.loading = false;
        state.purchases.error   = action.payload;
      })

      // ── Fetch pending edit requests ─────────────────────────────────────────
      .addCase(fetchPendingEditRequests.pending, (state) => {
        state.pendingRequests.loading = true;
        state.pendingRequests.error   = null;
      })
      .addCase(fetchPendingEditRequests.fulfilled, (state, action) => {
        state.pendingRequests.loading    = false;
        state.pendingRequests.items      = action.payload.requests  || [];
        state.pendingRequests.pagination = action.payload.pagination || {};
      })
      .addCase(fetchPendingEditRequests.rejected, (state, action) => {
        state.pendingRequests.loading = false;
        state.pendingRequests.error   = action.payload;
      })

      // ── Approve edit request ────────────────────────────────────────────────
      .addCase(approveEditRequest.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        // Remove from pending list
        state.pendingRequests.items = state.pendingRequests.items.filter(
          (item) => item._id !== action.payload._id
        );
        // Update in purchases list if present
        const idx = state.purchases.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (idx !== -1) state.purchases.items[idx] = action.payload;
      })

      // ── Reject edit request ─────────────────────────────────────────────────
      .addCase(rejectEditRequest.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        // Remove from pending list
        state.pendingRequests.items = state.pendingRequests.items.filter(
          (item) => item._id !== action.payload._id
        );
        // Update in purchases list if present
        const idx = state.purchases.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (idx !== -1) state.purchases.items[idx] = action.payload;
      })

      // ── ✅ Approve purchase ─────────────────────────────────────────────────
      .addCase(approvePurchase.pending, (state) => {
        // optional: could set a specific loading flag
      })
      .addCase(approvePurchase.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        // Update in purchases list
        const idx = state.purchases.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (idx !== -1) {
          state.purchases.items[idx] = action.payload;
        }
        // Update stats
        if (state.purchases.stats) {
          state.purchases.stats.pendingCount  = Math.max(0, (state.purchases.stats.pendingCount  || 0) - 1);
          state.purchases.stats.approvedCount = (state.purchases.stats.approvedCount || 0) + 1;
        }
      })
      .addCase(approvePurchase.rejected, (state, action) => {
        state.purchases.error = action.payload;
      })

      // ── ✅ Reject purchase ──────────────────────────────────────────────────
      .addCase(rejectPurchase.pending, (state) => {
        // optional: could set a specific loading flag
      })
      .addCase(rejectPurchase.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        // Update in purchases list
        const idx = state.purchases.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (idx !== -1) {
          state.purchases.items[idx] = action.payload;
        }
        // Update stats
        if (state.purchases.stats) {
          state.purchases.stats.pendingCount  = Math.max(0, (state.purchases.stats.pendingCount  || 0) - 1);
          state.purchases.stats.rejectedCount = (state.purchases.stats.rejectedCount || 0) + 1;
        }
      })
      .addCase(rejectPurchase.rejected, (state, action) => {
        state.purchases.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;