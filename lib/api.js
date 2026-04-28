import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// URLs that should NOT trigger token refresh/redirect on 401
const authEndpoints = [
  '/auth/login',
  '/admin/auth/login', // ✅ Added Admin Login Endpoint
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/validate-shop',
];

api.interceptors.request.use(
  (config) => {
    // ✅ Look for adminToken FIRST, fallback to posAccessToken
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken') || localStorage.getItem('posAccessToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // CHECK: Is this an auth endpoint? If yes, DON'T refresh/redirect
    const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));

    if (isAuthEndpoint) {
      console.log('🔒 Auth endpoint error - not redirecting:', requestUrl);
      return Promise.reject(error);
    }

    // Handle 401 errors for OTHER endpoints (not login)
    if (error.response?.status === 401) {
      // If already retried, logout
      if (originalRequest._retry) {
        console.log('🔴 Token refresh failed - clearing auth');
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      // Try to refresh token
      originalRequest._retry = true;

      try {
        // ✅ Check for refresh tokens for both Admin and POS
        const refreshToken = typeof window !== 'undefined'
          ? (localStorage.getItem('adminRefreshToken') || localStorage.getItem('posRefreshToken'))
          : null;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        console.log('🔄 Attempting token refresh...');

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // ✅ Update tokens dynamically based on what type of user is logged in
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('adminToken')) {
            localStorage.setItem('adminToken', accessToken);
            if (newRefreshToken) localStorage.setItem('adminRefreshToken', newRefreshToken);
          } else {
            localStorage.setItem('posAccessToken', accessToken);
            if (newRefreshToken) localStorage.setItem('posRefreshToken', newRefreshToken);
          }
        }

        console.log('✅ Token refreshed successfully');

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.log('🔴 Token refresh failed:', refreshError.message);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Separate function for clearing auth
function clearAuthAndRedirect() {
  if (typeof window !== 'undefined') {
    // POS cleanup
    localStorage.removeItem('posAccessToken');
    localStorage.removeItem('posRefreshToken');
    localStorage.removeItem('posShopCode');
    localStorage.removeItem('posUser');
    localStorage.removeItem('posShop');
    localStorage.removeItem('posPermissions');
    
    // ✅ Admin cleanup added!
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');

    // Only redirect if NOT already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'; // This was what was kicking you out!
    }
  }
}

export default api;