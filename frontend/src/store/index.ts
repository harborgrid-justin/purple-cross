import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import patientsReducer from './slices/patientsSlice';
import clientsReducer from './slices/clientsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import medicalRecordsReducer from './slices/medicalRecordsSlice';
import prescriptionsReducer from './slices/prescriptionsSlice';
import inventoryReducer from './slices/inventorySlice';
import invoicesReducer from './slices/invoicesSlice';
import labTestsReducer from './slices/labTestsSlice';
import staffReducer from './slices/staffSlice';
import communicationsReducer from './slices/communicationsSlice';
import documentsReducer from './slices/documentsSlice';
import analyticsReducer from './slices/analyticsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    patients: patientsReducer,
    clients: clientsReducer,
    appointments: appointmentsReducer,
    medicalRecords: medicalRecordsReducer,
    prescriptions: prescriptionsReducer,
    inventory: inventoryReducer,
    invoices: invoicesReducer,
    labTests: labTestsReducer,
    staff: staffReducer,
    communications: communicationsReducer,
    documents: documentsReducer,
    analytics: analyticsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for date serialization
        ignoredActions: ['patients/setFilters', 'appointments/setFilters'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export pre-typed hooks for use throughout the application
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
