import { createSlice } from '@reduxjs/toolkit';
import {
  fetchFullMonitoring,
  fetchAllClosings,
  fetchPendingClosings,
  fetchClosingDetails,
  approveClosing,
  rejectClosing,
  createClosingForShop,
  bulkApproveClosings,
  deleteClosing,
} from '../actions/monitoringActions';

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState: {
    data: {
      dashboard: null,
      performance: [],
      pendingDues: null,
      staffOverview: [],
      closingStatus: null,
    },
    loading: false,
    error: null,
    closings: {
      items: [],
      loading: false,
      pagination: {},
      stats: {},
    },
    pendingClosings: {
      items: [],
      loading: false,
    },
    closingDetail: {
      data: null,
      loading: false,
    },
  },
  reducers: {
    clearClosingDetail: (state) => {
      state.closingDetail.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullMonitoring.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFullMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllClosings.pending, (state) => {
        state.closings.loading = true;
        state.closings.items = [];
      })
      .addCase(fetchAllClosings.fulfilled, (state, action) => {
        state.closings.loading = false;
        const p = action.payload;
        state.closings.items = p.closings || p.data || [];
        state.closings.pagination = p.pagination || {};
        state.closings.stats = p.stats || {};
      })
      .addCase(fetchAllClosings.rejected, (state) => {
        state.closings.loading = false;
        state.closings.items = [];
      })

      .addCase(fetchPendingClosings.pending, (state) => {
        state.pendingClosings.loading = true;
      })
      .addCase(fetchPendingClosings.fulfilled, (state, action) => {
        state.pendingClosings.loading = false;
        const p = action.payload;
        state.pendingClosings.items = p.closings || p.data || [];
      })
      .addCase(fetchPendingClosings.rejected, (state) => {
        state.pendingClosings.loading = false;
      })

      .addCase(fetchClosingDetails.pending, (state) => {
        state.closingDetail.loading = true;
      })
      .addCase(fetchClosingDetails.fulfilled, (state, action) => {
        state.closingDetail.loading = false;
        state.closingDetail.data = action.payload;
      })
      .addCase(fetchClosingDetails.rejected, (state) => {
        state.closingDetail.loading = false;
      })

      .addCase(approveClosing.fulfilled, (state, action) => {
        const updated = action.payload?.closing || action.payload;
        if (!updated?._id) return;
        const idx = state.closings.items.findIndex(c => c._id === updated._id);
        if (idx !== -1) state.closings.items[idx] = updated;
        state.pendingClosings.items = state.pendingClosings.items.filter(
          c => c._id !== updated._id
        );
      })

      .addCase(rejectClosing.fulfilled, (state, action) => {
        const updated = action.payload?.closing || action.payload;
        if (!updated?._id) return;
        const idx = state.closings.items.findIndex(c => c._id === updated._id);
        if (idx !== -1) state.closings.items[idx] = updated;
        state.pendingClosings.items = state.pendingClosings.items.filter(
          c => c._id !== updated._id
        );
      })

      .addCase(createClosingForShop.fulfilled, (state, action) => {
        const closing = action.payload?.closing || action.payload;
        if (closing?._id) {
          state.closings.items.unshift(closing);
        }
      })

      .addCase(bulkApproveClosings.fulfilled, (state, action) => {
        const { approved = [] } = action.payload;
        approved.forEach(id => {
          const idx = state.closings.items.findIndex(c => c._id === id);
          if (idx !== -1) state.closings.items[idx].status = 'APPROVED';
          state.pendingClosings.items = state.pendingClosings.items.filter(
            c => c._id !== id
          );
        });
      })

      .addCase(deleteClosing.fulfilled, (state, action) => {
        const { closingId } = action.payload;
        state.closings.items = state.closings.items.filter(
          c => c._id !== closingId
        );
        state.pendingClosings.items = state.pendingClosings.items.filter(
          c => c._id !== closingId
        );
      });
  },
});

export const { clearClosingDetail } = monitoringSlice.actions;
export default monitoringSlice.reducer;