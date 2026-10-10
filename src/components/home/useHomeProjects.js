import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, selectClients } from '../../store/slices/projectsSlice';

export const useHomeProjects = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const loading = useSelector((state) => state.projects.loading);
  const error = useSelector((state) => state.projects.error);

  // Cached data renders instantly; getProjects' thunk condition refetches at
  // most once per page load and dedupes against useProjectStories.
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return { clients, loading, error };
};
