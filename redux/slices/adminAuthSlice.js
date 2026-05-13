import { createSlice } from '@reduxjs/toolkit';
import { adminLogin, adminLogout, fetchProfile, updateProfile } from '../actions/adminAuthActions';

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
  isLoading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(adminLogin.pending, (state) => { state.isLoading = true; state.error = null; })
           .addCase(adminLogin.fulfilled, (state, action) => {
             state.isLoading = false;
             state.user = action.payload.user;
             state.token = action.payload.token;
           })
           .addCase(adminLogin.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // FETCH PROFILE
    builder.addCase(fetchProfile.pending, (state) => { state.isLoading = true; })
           .addCase(fetchProfile.fulfilled, (state, action) => {
             state.isLoading = false;
             state.user = action.payload; // Securely populate profile
           })
           // 🚨 CRITICAL FIX: If profile fetch fails (invalid token), purge Redux state!
           .addCase(fetchProfile.rejected, (state) => {
             state.isLoading = false;
             state.user = null;
             state.token = null;
             if (typeof window !== 'undefined') localStorage.removeItem('adminToken');
           });

    // UPDATE PROFILE
    builder.addCase(updateProfile.pending, (state) => { state.isLoading = true; })
           .addCase(updateProfile.fulfilled, (state, action) => {
             state.isLoading = false;
             state.user = action.payload;
           })
           .addCase(updateProfile.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });

    // LOGOUT
    builder.addCase(adminLogout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });
  },
});

export const { clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;