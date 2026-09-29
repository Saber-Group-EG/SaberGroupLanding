import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const CAST_API_URL = 'https://marketing-planner-tau.vercel.app/api/v1/cast/public';
const CACHE_KEY = 'saber_cast_cache_v1';

const loadFromCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const saveToCache = (members) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(members));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
};

const normalizeSocials = (socialLinks) => {
  const socials = {};
  if (!Array.isArray(socialLinks)) return socials;
  socialLinks.forEach((link) => {
    if (!link || typeof link !== 'object' || !link.url) return;
    const platform = String(link.platform || '').trim().toLowerCase();
    const rawUrl = String(link.url).trim();
    // A missing protocol would resolve as a relative URL inside href
    const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    if (platform === 'linkedin') socials.linkedin = url;
    else if (platform === 'instagram') socials.instagram = url;
  });
  return socials;
};

const transformCastMember = (raw) => ({
  id: raw._id,
  name: raw.name || '',
  role: (Array.isArray(raw.title) ? raw.title : [raw.title]).filter(Boolean).join(', '),
  avatar: raw.photo || '',
  socials: normalizeSocials(raw.socialLinks),
  order: typeof raw.order === 'number' ? raw.order : null,
});

export const getCast = createAsyncThunk(
  'cast/getCast',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CAST_API_URL, {
        params: { PageCount: 'all' },
      });
      const rawCast = response.data.cast || [];
      return rawCast.filter((raw) => raw.deleted !== true).map(transformCastMember);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { cast } = getState();
      if (cast.members.length > 0 || cast.loading) return false;
      return true;
    },
  }
);

const castSlice = createSlice({
  name: 'cast',
  initialState: {
    members: loadFromCache(),
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCast.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        state.error = null;
        saveToCache(action.payload);
      })
      .addCase(getCast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cast';
        // Keep existing cached data on failure instead of clearing
        if (state.members.length === 0) {
          state.members = loadFromCache();
        }
      });
  },
});

const orderRank = (member) =>
  typeof member.order === 'number' && !Number.isNaN(member.order)
    ? member.order
    : Number.MAX_SAFE_INTEGER;

export const selectCastMembers = createSelector(
  [(state) => state.cast.members],
  (members) =>
    // Stable sort on a copy: missing/legacy order ranks last, ties keep
    // their original (API / cache) sequence.
    [...members].sort((a, b) => orderRank(a) - orderRank(b))
);
export const selectCastLoading = (state) => state.cast.loading;
export const selectCastError = (state) => state.cast.error;

export default castSlice.reducer;
