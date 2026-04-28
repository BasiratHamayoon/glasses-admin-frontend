import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchFullMonitoring = createAsyncThunk(
  'monitoring/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const config = { 
        params: { _t: new Date().getTime() }, 
        headers: { 'Cache-Control': 'no-cache' } 
      };
      
      const safeGet = (url) => api.get(url, config).catch(() => ({ data: { data: null } }));

      const [dashRes, perfRes, duesRes, staffRes, closingRes] = await Promise.all([
        safeGet('/admin/monitoring/dashboard'),
        safeGet('/admin/monitoring/performance'),
        safeGet('/admin/monitoring/pending-dues'),
        safeGet('/admin/monitoring/staff-overview'),
        safeGet('/admin/monitoring/daily-closing-status')
      ]);

      return {
        dashboard: dashRes.data?.data?.dashboard || dashRes.data?.data || {},
        performance: Array.isArray(perfRes.data?.data) ? perfRes.data.data : (perfRes.data?.data?.performance || []),
        pendingDues: duesRes.data?.data?.wallets ? duesRes.data.data : (duesRes.data?.data || {}),
        staffOverview: Array.isArray(staffRes.data?.data) ? staffRes.data.data : (staffRes.data?.data?.staffByShop || []),
        closingStatus: closingRes.data?.data?.status ? closingRes.data.data : (closingRes.data?.data || {})
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);