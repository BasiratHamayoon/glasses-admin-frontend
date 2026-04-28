import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/auth/login', credentials);
      localStorage.setItem('adminToken', response.data.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 🔥 NEW: Fetch Profile
export const fetchProfile = createAsyncThunk(
  'adminAuth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/auth/profile');
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// 🔥 NEW: Update Profile
export const updateProfile = createAsyncThunk(
  'adminAuth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/auth/profile', data);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// 🔥 NEW: Change Password
export const changePassword = createAsyncThunk(
  'adminAuth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/auth/change-password', data);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
  localStorage.removeItem('adminToken');
  return null;
});