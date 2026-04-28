import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import pricingReducer from './slices/pricingSlice';
import shopReducer from './slices/shopSlice';
import posAccessReducer from './slices/posAccessSlice';
import monitoringReducer from './slices/monitoringSlice';
import inventoryReducer from './slices/inventorySlice';
import employeeReducer from './slices/employeeSlice';
import financeReducer from './slices/financeSlice';
import salaryReducer from './slices/salarySlice';
import customerReducer from './slices/customerSlice';
import dashboardReducer from './slices/dashboardSlice';
import orderReducer from './slices/orderSlice';
import purchaseReducer from './slices/purchaseSlice'; // ← NEW

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    products: productReducer,
    categories: categoryReducer,
    pricing: pricingReducer,
    shops: shopReducer,
    posAccess: posAccessReducer,
    monitoring: monitoringReducer,
    inventory: inventoryReducer,
    employees: employeeReducer,
    finance: financeReducer,
    salary: salaryReducer,
    customers: customerReducer,
    dashboard: dashboardReducer,
    orders: orderReducer,
    purchases: purchaseReducer,
  },
});