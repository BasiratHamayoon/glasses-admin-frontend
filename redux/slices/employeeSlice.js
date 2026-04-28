import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchEmployees, 
  createEmployee, 
  createEmployeeWithUser, 
  updateEmployee, 
  updateEmployeeStatus, 
  deleteEmployee,
  fetchShifts, 
  createShift, 
  updateShift, 
  toggleShiftStatus, 
  deleteShift 
} from '../actions/employeeActions';

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { 
    items: [], 
    loading: false, 
    pagination: {},
    error: null,
    shifts: { 
      items: [], 
      loading: false, 
      pagination: {},
      error: null
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => { 
        state.loading = false; 
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.items = payload;
        } else if (payload && Array.isArray(payload.employees)) {
          state.items = payload.employees;
        } else if (payload && Array.isArray(payload.data)) {
          state.items = payload.data;
        } else {
          state.items = [];
        }
        state.pagination = payload?.pagination || {}; 
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch employees';
      })
      .addCase(createEmployee.fulfilled, (state, action) => { 
        state.items.unshift(action.payload); 
      })
      .addCase(createEmployeeWithUser.fulfilled, (state, action) => { 
        state.items.unshift(action.payload.employee || action.payload); 
      })
      .addCase(updateEmployee.fulfilled, (state, action) => { 
        const index = state.items.findIndex(e => e._id === action.payload._id); 
        if (index !== -1) {
          state.items[index] = action.payload; 
        }
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => { 
        const index = state.items.findIndex(e => e._id === action.payload._id); 
        if (index !== -1) {
          state.items[index] = action.payload; 
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => { 
        state.items = state.items.filter(e => e._id !== action.payload); 
      });

    builder
      .addCase(fetchShifts.pending, (state) => { 
        state.shifts.loading = true; 
        state.shifts.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => { 
        state.shifts.loading = false; 
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.shifts.items = payload;
        } else if (payload && Array.isArray(payload.shifts)) {
          state.shifts.items = payload.shifts;
        } else if (payload && Array.isArray(payload.data)) {
          state.shifts.items = payload.data;
        } else {
          state.shifts.items = [];
        }
        state.shifts.pagination = payload?.pagination || {}; 
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.shifts.loading = false;
        state.shifts.error = action.error?.message || 'Failed to fetch shifts';
      })
      .addCase(createShift.fulfilled, (state, action) => { 
        state.shifts.items.unshift(action.payload); 
      })
      .addCase(updateShift.fulfilled, (state, action) => { 
        const index = state.shifts.items.findIndex(s => s._id === action.payload._id); 
        if (index !== -1) {
          state.shifts.items[index] = action.payload; 
        }
      })
      .addCase(toggleShiftStatus.fulfilled, (state, action) => { 
        const index = state.shifts.items.findIndex(s => s._id === action.payload._id); 
        if (index !== -1) {
          state.shifts.items[index] = action.payload; 
        }
      })
      .addCase(deleteShift.fulfilled, (state, action) => { 
        state.shifts.items = state.shifts.items.filter(s => s._id !== action.payload); 
      });
  },
});

export default employeeSlice.reducer;