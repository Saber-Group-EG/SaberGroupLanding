import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchCompanySubCategories } from '../api/generalApi';
import { formatLocationName } from './useLocations';

/**
 * Company subcategories (services, products, plans) from the public CRM
 * endpoint. Deleted records are filtered out and names are localized.
 *
 * Pass enabled=false to defer fetching until the UI is actually shown.
 */
export default function useSubCategories(isArabic, enabled = true) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!enabled || loadedRef.current) return;
    loadedRef.current = true;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchCompanySubCategories();
        const data = res.data?.data || [];
        if (cancelled) return;
        setItems(data.filter((item) => item?.deleted !== true));
        setError(false);
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
        if (!cancelled) {
          setItems([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const subCategories = useMemo(
    () =>
      items
        .map((item) => ({
          _id: item._id,
          name: formatLocationName(item, isArabic),
          slug: item.slug || '',
          categoryId: item.category?._id || '',
          categoryName: item.category
            ? formatLocationName(item.category, isArabic)
            : '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name, isArabic ? 'ar' : 'en')),
    [items, isArabic],
  );

  return { subCategories, isLoading, error };
}
