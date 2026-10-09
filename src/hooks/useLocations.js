import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchCountries as apiFetchCountries,
  fetchCities as apiFetchCities,
  fetchGovernorates as apiFetchGovernorates,
} from '../api/generalApi';

// Localized display name from location objects ({ en, ar } or plain string).
export const formatLocationName = (item, isArabic) => {
  if (!item) return '';
  const name = item.name || '';
  if (!name) return '';
  if (typeof name === 'string') return name;
  return isArabic ? name.ar || name.en || '' : name.en || name.ar || '';
};

const isEgyptName = (name) => {
  const nm = (name || '').toString().trim().toLowerCase();
  return nm === 'egypt' || nm === 'مصر';
};

/**
 * Country / governorate / city state backed by the same public CRM endpoints
 * Contact.jsx uses. Country defaults to Egypt; governorate and city selects
 * only apply while Egypt is selected.
 *
 * Pass enabled=false to defer fetching until the UI is actually shown.
 */
export default function useLocations(isArabic, enabled = true) {
  const [countries, setCountries] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState('');
  const [government, setGovernment] = useState('');
  const [city, setCity] = useState('');
  const loadedRef = useRef(false);

  const loadGovernorates = useCallback(async (countryId) => {
    setGovernment('');
    setCity('');
    if (!countryId) {
      setGovernorates([]);
      setCities([]);
      return;
    }
    try {
      const res = await apiFetchGovernorates({
        deleted: false,
        PageCount: 1000,
        page: 1,
        country: countryId,
      });
      setGovernorates(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch governorates:', err);
      setGovernorates([]);
    }
  }, []);

  useEffect(() => {
    if (!enabled || loadedRef.current) return;
    loadedRef.current = true;
    let cancelled = false;

    const fetchCountries = async () => {
      try {
        const res = await apiFetchCountries({
          deleted: false,
          PageCount: 1000,
          page: 1,
        });
        const data = res.data?.data || [];
        if (cancelled) return;
        const filtered = data.filter((c) => {
          const name = (formatLocationName(c, isArabic) || '')
            .toString()
            .trim()
            .toLowerCase();
          return name !== 'اونلاين' && name !== 'غير محدد';
        });
        setCountries(filtered);
        const egypt = filtered.find((c) =>
          isEgyptName(formatLocationName(c, isArabic))
        );
        if (egypt) {
          setCountry(egypt._id);
          loadGovernorates(egypt._id);
        }
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      }
    };

    const fetchAllCities = async () => {
      try {
        const res = await apiFetchCities({
          deleted: false,
          PageCount: 1000,
          page: 1,
        });
        if (!cancelled) setAllCities(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    fetchCountries();
    fetchAllCities();

    return () => {
      cancelled = true;
    };
  }, [enabled, isArabic, loadGovernorates]);

  const onCountryChange = (value) => {
    setCountry(value);
    const selected = countries.find((c) => c._id === value);
    if (isEgyptName(formatLocationName(selected, isArabic))) {
      loadGovernorates(value);
    } else {
      setGovernorates([]);
      setCities([]);
      setGovernment('');
      setCity('');
    }
  };

  const onGovernmentChange = (value) => {
    setGovernment(value);
    setCities(
      allCities.filter(
        (c) =>
          c.government === value ||
          c.governmentId === value ||
          c.governorate === value ||
          c.government?._id === value
      )
    );
    setCity('');
  };

  const onCityChange = (value) => setCity(value);

  const selectedCountry = countries.find((c) => c._id === country);
  const isEgypt = isEgyptName(formatLocationName(selectedCountry, isArabic));

  return {
    countries,
    governorates,
    cities,
    country,
    government,
    city,
    isEgypt,
    onCountryChange,
    onGovernmentChange,
    onCityChange,
    formatName: (item) => formatLocationName(item, isArabic),
  };
}
