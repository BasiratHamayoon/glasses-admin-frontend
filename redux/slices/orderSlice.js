import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchPOSOrders, cancelPOSOrder, updatePOSOrderStatus,
  fetchWebsiteOrders, cancelWebsiteOrder, updateWebsiteOrderStatus,
  fetchPOSOrderById, fetchWebsiteOrderById
} from '../actions/orderActions';

const initialState = {
  pos: { items: [], loading: false, pagination: {}, error: null },
  website: { items: [], loading: false, pagination: {}, error: null },
  selectedOrder: null,
  loadingDetails: false
};

const updateItemInList = (list, updatedItem) => {
  const index = list.findIndex(o => o._id === updatedItem._id);
  if (index !== -1) list[index] = updatedItem;
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => { state.selectedOrder = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPOSOrders.pending, (state) => { state.pos.loading = true; })
      .addCase(fetchPOSOrders.fulfilled, (state, action) => {
        state.pos.loading = false;
        state.pos.items = action.payload?.orders || [];
        state.pos.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchPOSOrders.rejected, (state, action) => {
        state.pos.loading = false;
        state.pos.error = action.error.message;
      })
      .addCase(cancelPOSOrder.fulfilled, (state, action) => {
        updateItemInList(state.pos.items, action.payload.order);
      })
      .addCase(updatePOSOrderStatus.fulfilled, (state, action) => {
        updateItemInList(state.pos.items, action.payload.order || action.payload);
      });

    builder
      .addCase(fetchWebsiteOrders.pending, (state) => { state.website.loading = true; })
      .addCase(fetchWebsiteOrders.fulfilled, (state, action) => {
        state.website.loading = false;
        state.website.items = action.payload?.orders || [];
        state.website.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchWebsiteOrders.rejected, (state, action) => {
        state.website.loading = false;
        state.website.error = action.error.message;
      })
      .addCase(cancelWebsiteOrder.fulfilled, (state, action) => {
        updateItemInList(state.website.items, action.payload.order);
      })
      .addCase(updateWebsiteOrderStatus.fulfilled, (state, action) => {
        updateItemInList(state.website.items, action.payload.order || action.payload);
      });

    builder
      .addCase(fetchPOSOrderById.pending, (state) => { state.loadingDetails = true; })
      .addCase(fetchPOSOrderById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchWebsiteOrderById.pending, (state) => { state.loadingDetails = true; })
      .addCase(fetchWebsiteOrderById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedOrder = action.payload;
      });
  }
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;