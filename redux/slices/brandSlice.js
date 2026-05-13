import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchBrands = createAsyncThunk('brands/fetchAll', async () => {
  const response = await api.get('/api/v1/admin/brands');
  return response.data.data;
});

export const createBrand = createAsyncThunk('brands/create', async (data) => {
  const response = await api.post('/api/v1/admin/brands', data);
  return response.data.data.brand;
});

const brandSlice = createSlice({
  name: 'brands',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => { state.loading = true; })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.brands || action.payload;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default brandSlice.reducer;