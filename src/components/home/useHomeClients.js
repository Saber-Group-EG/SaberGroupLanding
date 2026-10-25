import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, selectClients } from '../../store/slices/clientsSlice';

export const useHomeClients = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const loading = useSelector((state) => state.clients.loading);
  const error = useSelector((state) => state.clients.error);

  // Cached data renders instantly; getClients' thunk condition refetches at
  // most once per page load.
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  return { clients, loading, error };
};
