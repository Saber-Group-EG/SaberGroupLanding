import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCast,
  selectCastMembers,
  selectCastLoading,
  selectCastError,
} from '../../store/slices/castSlice';

export const useCastMembers = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectCastMembers);
  const loading = useSelector(selectCastLoading);
  const error = useSelector(selectCastError);

  // getCast's condition guard skips the fetch when members exist or a request
  // is already in flight, so a plain dispatch is safe here.
  useEffect(() => {
    dispatch(getCast());
  }, [dispatch]);

  return { members, loading, error };
};
