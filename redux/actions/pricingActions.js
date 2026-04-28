import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchPricingRules = createAsyncThunk('pricing/fetchAll', async () => {
  // Using offers based on your backend routes file
  const response = await api.get('/admin/offers'); 
  return response.data.data.offers || response.data.data;
});