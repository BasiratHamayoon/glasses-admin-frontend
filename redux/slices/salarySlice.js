import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSalaryStructures,
  createSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,
  fetchSalariesByMonth,
  fetchSalariesByEmployee,
  addSalaryPayment,
  processSalaryPayment,
} from '../actions/salaryActions';

const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    structures: { items: [], loading: false, pagination: {} },
    salaries: { items: [], totals: {}, loading: false, pagination: {} },
    employeeSalaries: { salary: null, allSalaries: [], loading: false },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryStructures.pending, (state) => {
        state.structures.loading = true;
      })
      .addCase(fetchSalaryStructures.fulfilled, (state, action) => {
        state.structures.loading = false;
        state.structures.items = action.payload.structures || [];
        state.structures.pagination = action.payload.pagination || {};
      })
      .addCase(fetchSalaryStructures.rejected, (state) => {
        state.structures.loading = false;
      })

      .addCase(createSalaryStructure.fulfilled, (state, action) => {
        if (action.payload?._id) state.structures.items.unshift(action.payload);
      })

      .addCase(updateSalaryStructure.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const idx = state.structures.items.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.structures.items[idx] = action.payload;
      })

      .addCase(deleteSalaryStructure.fulfilled, (state, action) => {
        state.structures.items = state.structures.items.filter(s => s._id !== action.payload);
      })

      .addCase(fetchSalariesByMonth.pending, (state) => {
        state.salaries.loading = true;
      })
      .addCase(fetchSalariesByMonth.fulfilled, (state, action) => {
        state.salaries.loading = false;
        state.salaries.items = action.payload.salaries || [];
        state.salaries.totals = action.payload.totals || {};
        state.salaries.pagination = action.payload.pagination || {};
      })
      .addCase(fetchSalariesByMonth.rejected, (state) => {
        state.salaries.loading = false;
      })

      .addCase(fetchSalariesByEmployee.pending, (state) => {
        state.employeeSalaries.loading = true;
      })
      .addCase(fetchSalariesByEmployee.fulfilled, (state, action) => {
        state.employeeSalaries.loading = false;
        state.employeeSalaries.salary = action.payload.salary || null;
        state.employeeSalaries.allSalaries = action.payload.allSalaries || [];
      })
      .addCase(fetchSalariesByEmployee.rejected, (state) => {
        state.employeeSalaries.loading = false;
      })

      .addCase(addSalaryPayment.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        state.employeeSalaries.salary = action.payload;
        const idx = state.salaries.items.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.salaries.items[idx] = action.payload;
        else state.salaries.items.unshift(action.payload);
      })

      .addCase(processSalaryPayment.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        if (state.employeeSalaries.salary?._id === action.payload._id) {
          state.employeeSalaries.salary = action.payload;
        }
        const idx = state.salaries.items.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.salaries.items[idx] = action.payload;
      });
  },
});

export default salarySlice.reducer;