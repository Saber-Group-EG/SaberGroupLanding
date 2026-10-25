import { configureStore } from '@reduxjs/toolkit';
import jobPositionsReducer from './slices/jobPositionsSlice';
import projectsReducer from './slices/projectsSlice';
import castReducer from './slices/castSlice';
import storyGroupsReducer from './slices/storyGroupsSlice';
import clientsReducer from './slices/clientsSlice';

export const store = configureStore({
  reducer: {
    jobPositions: jobPositionsReducer,
    projects: projectsReducer,
    cast: castReducer,
    storyGroups: storyGroupsReducer,
    clients: clientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
