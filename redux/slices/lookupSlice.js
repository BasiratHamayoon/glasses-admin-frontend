import { createSlice } from '@reduxjs/toolkit';
import {
  frameShapeActions,
  frameMaterialActions,
  frameTypeActions,
  lensTypeActions,
  lensMaterialActions,
} from '../actions/lookupActions';

const initialLookupState = {
  items: [],
  pagination: {},
  loading: false,
  error: null,
  fetched: false,
};

const buildExtraReducers = (builder, actions) => {
  builder
    .addCase(actions.fetchAll.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.fetchAll.fulfilled, (state, action) => {
      state.loading = false;
      state.fetched = true;
      state.items = Array.isArray(action.payload?.data) ? action.payload.data : [];
      state.pagination = action.payload?.pagination || {};
    })
    .addCase(actions.fetchAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.items = [];
    })
    .addCase(actions.create.fulfilled, (state, action) => {
      if (action.payload?._id) state.items.unshift(action.payload);
    })
    .addCase(actions.update.fulfilled, (state, action) => {
      if (action.payload?._id) {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    })
    .addCase(actions.remove.fulfilled, (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    })
    .addCase(actions.toggle.fulfilled, (state, action) => {
      if (action.payload?._id) {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    });
};

export const frameShapeSlice = createSlice({
  name: 'frameShapes',
  initialState: { ...initialLookupState },
  reducers: {},
  extraReducers: (builder) => buildExtraReducers(builder, frameShapeActions),
});

export const frameMaterialSlice = createSlice({
  name: 'frameMaterials',
  initialState: { ...initialLookupState },
  reducers: {},
  extraReducers: (builder) => buildExtraReducers(builder, frameMaterialActions),
});

export const frameTypeSlice = createSlice({
  name: 'frameTypes',
  initialState: { ...initialLookupState },
  reducers: {},
  extraReducers: (builder) => buildExtraReducers(builder, frameTypeActions),
});

export const lensTypeSlice = createSlice({
  name: 'lensTypes',
  initialState: { ...initialLookupState },
  reducers: {},
  extraReducers: (builder) => buildExtraReducers(builder, lensTypeActions),
});

export const lensMaterialSlice = createSlice({
  name: 'lensMaterials',
  initialState: { ...initialLookupState },
  reducers: {},
  extraReducers: (builder) => buildExtraReducers(builder, lensMaterialActions),
});