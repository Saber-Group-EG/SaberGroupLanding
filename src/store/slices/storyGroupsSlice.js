import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getProxiedCoverUrl } from '../../utils/imageProxy';
import { storyRenditionUrl } from '../../utils/storyRendition';

const STORY_GROUPS_API_URL = 'https://marketing-planner-tau.vercel.app/api/v1/story-groups/public';
const CACHE_KEY = 'saber_storygroups_cache_v1';

const loadFromCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const saveToCache = (storyGroups) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(storyGroups));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
};

const resolveBilingual = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (val.en || val.ar) return val.en || val.ar;
    if (val.name?.en || val.name?.ar) return val.name.en || val.name.ar;
    return '';
  }
  return '';
};

const VIDEO_URL_RE = /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i;

// Video files fed to the image proxy render as a black card, so anything that
// isn't a real image URL must be skipped.
const renderableImage = (url) =>
  typeof url === 'string' && url.trim() !== '' && !VIDEO_URL_RE.test(url.trim());

const orderValue = (item) => (Number.isFinite(Number(item?.order)) ? Number(item.order) : 999);

// Returns null for groups we must not render (deleted, or no playable video)
// so the thunk can drop them before they ever reach state.
const transformStoryGroup = (raw) => {
  if (raw.deleted === true) return null;

  // Covers on this collection are often extension-less Cloudinary/public IDs,
  // so the cover is used as-is and never run through the video-URL guard.
  const firstThumb = Array.isArray(raw.material)
    ? raw.material.find((mat) => mat?.thumbnail)?.thumbnail || ''
    : '';
  const coverRaw = raw.coverImage?.url || firstThumb || '';
  const coverImage = getProxiedCoverUrl(coverRaw, { width: 500, quality: 75 });
  const fallbackThumbnail = coverRaw
    ? getProxiedCoverUrl(coverRaw, { width: 400, quality: 40 })
    : '';

  const materials = (Array.isArray(raw.material) ? raw.material : [])
    .filter((mat) => mat?.type === 'video' && mat.url)
    .sort((a, b) => orderValue(a) - orderValue(b))
    .map((mat) => {
      const caption = resolveBilingual(mat.caption);
      return {
        id: mat._id,
        // videoUrl stays the ORIGINAL: full-quality consumers rely on it —
        // only the story viewer asks for the rendition.
        videoUrl: mat.url,
        storyVideoUrl: storyRenditionUrl(mat.url),
        thumbnail: renderableImage(mat.thumbnail)
          ? getProxiedCoverUrl(mat.thumbnail, { width: 400, quality: 40 })
          : '',
        fallbackThumbnail,
        caption,
        captionAr: mat.caption?.ar || mat.caption?.name?.ar || caption,
      };
    });

  if (materials.length === 0) return null;

  return {
    id: raw._id,
    titleAr: raw.title?.ar || '',
    titleEn: raw.title?.en || '',
    subtitleAr: raw.subtitle?.ar || '',
    subtitleEn: raw.subtitle?.en || '',
    coverImage,
    coverImageRaw: coverRaw,
    avatarImage: coverRaw ? getProxiedCoverUrl(coverRaw, { width: 96, quality: 60 }) : '',
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 999,
    videosCount: materials.length,
    materials,
  };
};

// One background refresh per full page load: cached data renders instantly,
// then the thunk refetches once so CMS changes (orders, covers) show up without
// a manual cache clear. The condition also dedupes multiple hooks that dispatch
// the same thunk in the same commit.
let fetchedThisPageLoad = false;

export const getStoryGroups = createAsyncThunk(
  'storyGroups/getStoryGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(STORY_GROUPS_API_URL, {
        // `limit` is ignored server-side and `?page` caps at 10 — PageCount=all
        // is the only way to receive the whole collection.
        params: { PageCount: 'all' },
      });
      const rawGroups = response.data.storyGroups || [];
      return rawGroups
        .map(transformStoryGroup)
        .filter(Boolean)
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (fetchedThisPageLoad || getState().storyGroups.loading) return false;
      return true;
    },
  }
);

const storyGroupsSlice = createSlice({
  name: 'storyGroups',
  initialState: {
    rawGroups: loadFromCache(),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStoryGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoryGroups.fulfilled, (state, action) => {
        fetchedThisPageLoad = true;
        state.loading = false;
        state.rawGroups = action.payload;
        state.error = null;
        saveToCache(action.payload);
      })
      .addCase(getStoryGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch story groups';
        // Keep existing cached data on failure instead of clearing
        if (state.rawGroups.length === 0) {
          state.rawGroups = loadFromCache();
        }
      });
  },
});

export const { clearError } = storyGroupsSlice.actions;

export const selectAllStoryGroups = (state) => state.storyGroups.rawGroups;
export const selectStoryGroupsLoading = (state) => state.storyGroups.loading;
export const selectStoryGroupsError = (state) => state.storyGroups.error;
export const selectHasStoryGroups = (state) => state.storyGroups.rawGroups.length > 0;

export default storyGroupsSlice.reducer;
