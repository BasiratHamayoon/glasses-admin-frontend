import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSalesSummary,
  fetchShopLeaderboard,
  fetchShopComparison,
  fetchSalesGraphData,
  fetchTopProducts,
  fetchProductCrossShop,
  fetchShopDetails,
} from '../actions/orderStatsActions';

const initialState = {
  summary: {
    data: null,
    loading: false,
    error: null,
  },
  leaderboard: {
    data: null,
    loading: false,
    error: null,
  },
  comparison: {
    data: null,
    loading: false,
    error: null,
  },
  graphData: {
    data: null,
    loading: false,
    error: null,
  },
  topProducts: {
    data: null,
    loading: false,
    error: null,
  },
  productCrossShop: {
    data: null,
    loading: false,
    error: null,
  },
  shopDetails: {
    data: null,
    loading: false,
    error: null,
  },
};

const orderStatsSlice = createSlice({
  name: 'orderStats',
  initialState,
  reducers: {
    clearShopDetails: (state) => {
      state.shopDetails.data = null;
      state.shopDetails.error = null;
    },
    clearAllStats: (state) => {
      state.summary.data = null;
      state.leaderboard.data = null;
      state.comparison.data = null;
      state.graphData.data = null;
      state.topProducts.data = null;
      state.productCrossShop.data = null;
      state.shopDetails.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSalesSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchSalesSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.error.message;
      })

      .addCase(fetchShopLeaderboard.pending, (state) => {
        state.leaderboard.loading = true;
        state.leaderboard.error = null;
      })
      .addCase(fetchShopLeaderboard.fulfilled, (state, action) => {
        state.leaderboard.loading = false;
        state.leaderboard.data = action.payload;
      })
      .addCase(fetchShopLeaderboard.rejected, (state, action) => {
        state.leaderboard.loading = false;
        state.leaderboard.error = action.error.message;
      })

      .addCase(fetchShopComparison.pending, (state) => {
        state.comparison.loading = true;
        state.comparison.error = null;
      })
      .addCase(fetchShopComparison.fulfilled, (state, action) => {
        state.comparison.loading = false;
        state.comparison.data = action.payload;
      })
      .addCase(fetchShopComparison.rejected, (state, action) => {
        state.comparison.loading = false;
        state.comparison.error = action.error.message;
      })

      .addCase(fetchSalesGraphData.pending, (state) => {
        state.graphData.loading = true;
        state.graphData.error = null;
      })
      .addCase(fetchSalesGraphData.fulfilled, (state, action) => {
        state.graphData.loading = false;
        state.graphData.data = action.payload;
      })
      .addCase(fetchSalesGraphData.rejected, (state, action) => {
        state.graphData.loading = false;
        state.graphData.error = action.error.message;
      })

      .addCase(fetchTopProducts.pending, (state) => {
        state.topProducts.loading = true;
        state.topProducts.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts.loading = false;
        state.topProducts.data = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProducts.loading = false;
        state.topProducts.error = action.error.message;
      })

      .addCase(fetchProductCrossShop.pending, (state) => {
        state.productCrossShop.loading = true;
        state.productCrossShop.error = null;
      })
      .addCase(fetchProductCrossShop.fulfilled, (state, action) => {
        state.productCrossShop.loading = false;
        state.productCrossShop.data = action.payload;
      })
      .addCase(fetchProductCrossShop.rejected, (state, action) => {
        state.productCrossShop.loading = false;
        state.productCrossShop.error = action.error.message;
      })

      .addCase(fetchShopDetails.pending, (state) => {
        state.shopDetails.loading = true;
        state.shopDetails.error = null;
      })
      .addCase(fetchShopDetails.fulfilled, (state, action) => {
        state.shopDetails.loading = false;
        state.shopDetails.data = action.payload;
      })
      .addCase(fetchShopDetails.rejected, (state, action) => {
        state.shopDetails.loading = false;
        state.shopDetails.error = action.error.message;
      });
  },
});

export const { clearShopDetails, clearAllStats } = orderStatsSlice.actions;
export default orderStatsSlice.reducer;