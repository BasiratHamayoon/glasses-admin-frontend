import { createSlice } from '@reduxjs/toolkit';
import {
  fetchStocks, updateStock, deleteStock, addStockToMultipleShops,
  fetchWebsiteStocks, updateWebsiteStock, deleteWebsiteStock, fetchWebsiteStockSummary,
  fetchInventoryProducts, fetchInventoryShops,
  fetchStockByProductAndShop, fetchStockHistory, fetchStockValuation,
  fetchAdjustments, createAdjustment, quickAdjust,
  approveAdjustment, applyAdjustment, rejectAdjustment,
  fetchTransfers, createTransfer, approveTransfer,
  rejectTransfer, shipTransfer, receiveTransfer, cancelTransfer,
} from '../actions/inventoryActions';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    stocks: { items: [], loading: false, pagination: {} },
    stockValuation: { data: null, loading: false, initialized: false },
    websiteStocks: {
      items: [],
      summary: null,
      loading: false,
      pagination: {},
      summaryLoading: false,
      summaryInitialized: false,
    },
    inventoryProducts: { items: [], loading: false, initialized: false },
    inventoryShops: { items: [], loading: false, initialized: false },
    stockDetail: { data: null, loading: false },
    stockHistory: { data: [], loading: false },
    adjustments: { items: [], loading: false, pagination: {}, summary: null },
    transfers: { items: [], loading: false, pagination: {}, pendingCount: {} },
  },
  reducers: {
    clearStockDetail: (state) => { state.stockDetail.data = null; },
    clearStockHistory: (state) => { state.stockHistory.data = []; },
    resetStockValuation: (state) => { state.stockValuation.initialized = false; },
    resetWebsiteSummary: (state) => { state.websiteStocks.summaryInitialized = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryProducts.pending, (state) => {
        state.inventoryProducts.loading = true;
      })
      .addCase(fetchInventoryProducts.fulfilled, (state, action) => {
        state.inventoryProducts.loading = false;
        state.inventoryProducts.initialized = true;
        state.inventoryProducts.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInventoryProducts.rejected, (state) => {
        state.inventoryProducts.loading = false;
        state.inventoryProducts.initialized = true;
      })

      .addCase(fetchInventoryShops.pending, (state) => {
        state.inventoryShops.loading = true;
      })
      .addCase(fetchInventoryShops.fulfilled, (state, action) => {
        state.inventoryShops.loading = false;
        state.inventoryShops.initialized = true;
        state.inventoryShops.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInventoryShops.rejected, (state) => {
        state.inventoryShops.loading = false;
        state.inventoryShops.initialized = true;
      })

      .addCase(fetchStocks.pending, (state) => { state.stocks.loading = true; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks.loading = false;
        const p = action.payload;
        state.stocks.items = Array.isArray(p) ? p : p.stocks || p.data || [];
        state.stocks.pagination = p.pagination || {};
      })
      .addCase(fetchStocks.rejected, (state) => { state.stocks.loading = false; })

      .addCase(fetchStockValuation.pending, (state) => { state.stockValuation.loading = true; })
      .addCase(fetchStockValuation.fulfilled, (state, action) => {
        state.stockValuation.loading = false;
        state.stockValuation.initialized = true;
        state.stockValuation.data = action.payload;
      })
      .addCase(fetchStockValuation.rejected, (state) => {
        state.stockValuation.loading = false;
        state.stockValuation.initialized = true;
      })

      .addCase(fetchStockByProductAndShop.pending, (state) => { state.stockDetail.loading = true; })
      .addCase(fetchStockByProductAndShop.fulfilled, (state, action) => {
        state.stockDetail.loading = false;
        state.stockDetail.data = action.payload;
      })
      .addCase(fetchStockByProductAndShop.rejected, (state) => { state.stockDetail.loading = false; })

      .addCase(fetchStockHistory.pending, (state) => { state.stockHistory.loading = true; })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.stockHistory.loading = false;
        state.stockHistory.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStockHistory.rejected, (state) => { state.stockHistory.loading = false; })

      .addCase(updateStock.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.stocks.items.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.stocks.items[idx] = action.payload;
        else state.stocks.items.unshift(action.payload);
      })

      .addCase(deleteStock.fulfilled, (state, action) => {
        state.stocks.items = state.stocks.items.filter(s => s._id !== action.payload);
      })

      .addCase(addStockToMultipleShops.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          action.payload.forEach(ns => {
            const idx = state.stocks.items.findIndex(s => s._id === ns._id);
            if (idx !== -1) state.stocks.items[idx] = ns;
            else state.stocks.items.unshift(ns);
          });
        }
      })

      .addCase(fetchWebsiteStocks.pending, (state) => { state.websiteStocks.loading = true; })
      .addCase(fetchWebsiteStocks.fulfilled, (state, action) => {
        state.websiteStocks.loading = false;
        const p = action.payload;
        state.websiteStocks.items = Array.isArray(p) ? p : p.stocks || p.data || [];
        state.websiteStocks.pagination = p.pagination || {};
      })
      .addCase(fetchWebsiteStocks.rejected, (state) => { state.websiteStocks.loading = false; })

      .addCase(updateWebsiteStock.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.websiteStocks.items.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.websiteStocks.items[idx] = action.payload;
        else state.websiteStocks.items.unshift(action.payload);
      })

      .addCase(deleteWebsiteStock.fulfilled, (state, action) => {
        state.websiteStocks.items = state.websiteStocks.items.filter(s => s._id !== action.payload);
      })

      .addCase(fetchWebsiteStockSummary.pending, (state) => {
        state.websiteStocks.summaryLoading = true;
      })
      .addCase(fetchWebsiteStockSummary.fulfilled, (state, action) => {
        state.websiteStocks.summaryLoading = false;
        state.websiteStocks.summaryInitialized = true;
        state.websiteStocks.summary = action.payload;
      })
      .addCase(fetchWebsiteStockSummary.rejected, (state) => {
        state.websiteStocks.summaryLoading = false;
        state.websiteStocks.summaryInitialized = true;
      })

      .addCase(fetchAdjustments.pending, (state) => { state.adjustments.loading = true; })
      .addCase(fetchAdjustments.fulfilled, (state, action) => {
        state.adjustments.loading = false;
        const p = action.payload;
        state.adjustments.items = Array.isArray(p) ? p : p.adjustments || p.data || [];
        state.adjustments.pagination = p.pagination || {};
      })
      .addCase(fetchAdjustments.rejected, (state) => { state.adjustments.loading = false; })

      .addCase(createAdjustment.fulfilled, (state, action) => {
        if (action.payload?._id) state.adjustments.items.unshift(action.payload);
      })

      .addCase(quickAdjust.fulfilled, (state, action) => {
        if (action.payload?._id) state.adjustments.items.unshift(action.payload);
      })

      .addCase(approveAdjustment.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.adjustments.items.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.adjustments.items[idx] = action.payload;
      })

      .addCase(applyAdjustment.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.adjustments.items.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.adjustments.items[idx] = action.payload;
      })

      .addCase(rejectAdjustment.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.adjustments.items.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.adjustments.items[idx] = action.payload;
      })

      .addCase(fetchTransfers.pending, (state) => { state.transfers.loading = true; })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.transfers.loading = false;
        const p = action.payload;
        state.transfers.items = Array.isArray(p) ? p : p.transfers || p.data || [];
        state.transfers.pagination = p.pagination || {};
      })
      .addCase(fetchTransfers.rejected, (state) => { state.transfers.loading = false; })

      .addCase(createTransfer.fulfilled, (state, action) => {
        if (action.payload?._id) state.transfers.items.unshift(action.payload);
      })

      .addCase(approveTransfer.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transfers.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.transfers.items[idx] = action.payload;
      })

      .addCase(rejectTransfer.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transfers.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.transfers.items[idx] = action.payload;
      })

      .addCase(shipTransfer.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transfers.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.transfers.items[idx] = action.payload;
      })

      .addCase(receiveTransfer.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transfers.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.transfers.items[idx] = action.payload;
      })

      .addCase(cancelTransfer.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.transfers.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.transfers.items[idx] = action.payload;
      });
  },
});

export const { clearStockDetail, clearStockHistory, resetStockValuation, resetWebsiteSummary } = inventorySlice.actions;
export default inventorySlice.reducer;