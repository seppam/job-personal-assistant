import { configureStore } from '@reduxjs/toolkit';
import configReducer from './slices/configSlice';
import jobsReducer from './slices/jobsSlice';
import cvReducer from './slices/cvSlice';
import profileReducer from './slices/profileSlice';

import { isDemo, demoState } from '../demo/demo';

export const store = configureStore({
  reducer: {
    config: configReducer,
    jobs: jobsReducer,
    cv: cvReducer,
    profile: profileReducer,
  },
  ...(isDemo ? { preloadedState: demoState } : {}),
});

export default store;
