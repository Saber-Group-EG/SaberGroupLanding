import { configureStore } from '@reduxjs/toolkit';
import jobPositionsReducer from './slices/jobPositionsSlice';
import projectsReducer from './slices/projectsSlice';
import castReducer from './slices/castSlice';

export const store = configureStore({
  reducer: {
    jobPositions: jobPositionsReducer,
    projects: projectsReducer,
    cast: castReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
