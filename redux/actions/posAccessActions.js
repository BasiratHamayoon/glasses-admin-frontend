import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Assuming your backend route is set up like this
export const fetchShopUsers = createAsyncThunk('posAccess/fetchByShop', async (shopId) => {
  const response = await api.get(`/admin/shops/${shopId}/users`, { params: { _t: new Date().getTime() }});
  return response.data.data.users || response.data.data;
});

export const assignShopUser = createAsyncThunk('posAccess/assign', async (data) => {
  const response = await api.post('/admin/shops/users', data);
  return response.data.data;
});

export const removeShopUser = createAsyncThunk('posAccess/remove', async (id) => {
  await api.delete(`/admin/shops/users/${id}`);
  return id;
});