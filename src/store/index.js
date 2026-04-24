import { configureStore } from '@reduxjs/toolkit';
import configReducer from './slices/configSlice';
import jobsReducer from './slices/jobsSlice';
import cvReducer from './slices/cvSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    jobs: jobsReducer,
    cv: cvReducer,
  },
});

export default store;
