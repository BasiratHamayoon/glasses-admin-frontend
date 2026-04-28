import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchStocks, updateStock, 
  fetchWebsiteStocks, updateWebsiteStock, fetchWebsiteStockSummary 
} from '../actions/inventoryActions';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    stocks: { items: [], loading: false, pagination: {} },
    websiteStocks: { items: [], summary: null, loading: false, pagination: {} },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStocks.pending, (state) => { state.stocks.loading = true; })
           .addCase(fetchStocks.fulfilled, (state, action) => { 
             state.stocks.loading = false; 
             const payload = action.payload;
             state.stocks.items = Array.isArray(payload) ? payload : payload.stocks || payload.data || [];
             state.stocks.pagination = payload.pagination || {}; 
           })
           .addCase(updateStock.fulfilled, (state, action) => {
             const index = state.stocks.items.findIndex(s => s._id === action.payload._id);
             if (index !== -1) state.stocks.items[index] = action.payload;
             else state.stocks.items.unshift(action.payload);
           });
    
    builder.addCase(fetchWebsiteStocks.pending, (state) => { state.websiteStocks.loading = true; })
           .addCase(fetchWebsiteStocks.fulfilled, (state, action) => { 
             state.websiteStocks.loading = false; 
             const payload = action.payload;
             state.websiteStocks.items = Array.isArray(payload) ? payload : payload.stocks || payload.data || [];
             state.websiteStocks.pagination = payload.pagination || {}; 
           })
           .addCase(updateWebsiteStock.fulfilled, (state, action) => {
             const index = state.websiteStocks.items.findIndex(s => s._id === action.payload._id);
             if (index !== -1) state.websiteStocks.items[index] = action.payload;
             else state.websiteStocks.items.unshift(action.payload);
           })
           .addCase(fetchWebsiteStockSummary.fulfilled, (state, action) => {
             state.websiteStocks.summary = action.payload;
           });
  },
});
export default inventorySlice.reducer;