import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { getProjects, selectClients } from '../../store/slices/projectsSlice';

export const useHomeProjects = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const clients = useSelector(selectClients);
  const loading = useSelector((state) => state.projects.loading);
  const error = useSelector((state) => state.projects.error);

  // getProjects has no condition guard, so the "already fetched / in flight"
  // check has to live here to avoid duplicate requests. State is read fresh
  // from the store because useProjectStories dispatches the same thunk in the
  // same commit, which makes this hook's own values stale by then.
  useEffect(() => {
    const projects = store.getState().projects;
    if (projects.rawProjects.length === 0 && !projects.loading && !projects.error) {
      dispatch(getProjects());
    }
  }, [dispatch, store]);

  return { clients, loading, error };
};
