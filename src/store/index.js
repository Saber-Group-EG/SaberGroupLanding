import { configureStore } from '@reduxjs/toolkit';
import jobPositionsReducer from './slices/jobPositionsSlice';
import projectsReducer from './slices/projectsSlice';
import castReducer from './slices/castSlice';
import storyGroupsReducer from './slices/storyGroupsSlice';

export const store = configureStore({
  reducer: {
    jobPositions: jobPositionsReducer,
    projects: projectsReducer,
    cast: castReducer,
    storyGroups: storyGroupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
