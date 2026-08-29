import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { getEnSlug } from '../../utils/slug';

const PROJECTS_API_URL = 'https://marketing-planner-tau.vercel.app/api/v1/projects/public';
const CACHE_KEY = 'saber_projects_cache';

const loadFromCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const saveToCache = (projects) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(projects));
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

const transformProject = (raw) => {
  const photos = [];
  const videos = [];
  const mediaGroups = [];

  if (Array.isArray(raw.material)) {
    raw.material.forEach((mat) => {
      const caption = resolveBilingual(mat.caption);
      if (mat.type === 'bulk' && Array.isArray(mat.items)) {
        const items = mat.items.map((item) => ({
          url: item.url,
          thumbnail: item.thumbnail || item.url,
          caption: resolveBilingual(item.caption) || caption,
          type: item.type || (item.url?.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'photo'),
        }));
        const bulkVideos = items.filter((item) => item.type === 'video');
        const bulkPhotos = items.filter((item) => item.type !== 'video');
        videos.push(...bulkVideos);
        photos.push(...bulkPhotos);
        mediaGroups.push({ title: caption || 'Media', type: 'bulk', items });
      } else if (mat.type === 'photo' && mat.url) {
        const photo = { url: mat.url, thumbnail: mat.thumbnail || mat.url, caption, type: 'photo' };
        photos.push(photo);
        mediaGroups.push({ title: caption || 'Photo', type: 'bulk', items: [photo] });
      } else if (mat.type === 'video' && mat.url) {
        const video = { url: mat.url, thumbnail: mat.thumbnail || '', caption, type: 'video' };
        videos.push(video);
        mediaGroups.push({ title: caption || 'Video', type: 'bulk', items: [video] });
      } else if (mat.type === 'before_after') {
        const beforeItem = mat.before?.url ? {
          url: mat.before.url,
          thumbnail: mat.before.thumbnail || mat.before.url,
          caption: resolveBilingual(mat.before.label) || resolveBilingual(mat.caption) || 'Before',
          type: 'photo',
        } : null;
        const afterItem = mat.after?.url ? {
          url: mat.after.url,
          thumbnail: mat.after.thumbnail || mat.after.url,
          caption: resolveBilingual(mat.after.label) || resolveBilingual(mat.caption) || 'After',
          type: 'photo',
        } : null;
        const baItems = [beforeItem, afterItem].filter(Boolean);
        if (baItems.length > 0) {
          photos.push(...baItems);
          mediaGroups.push({
            title: caption || 'Before & After',
            type: 'before_after',
            before: beforeItem,
            after: afterItem,
            caption,
            items: baItems,
          });
        }
      }
    });
  }

  const coverImage = raw.mainCover?.url || (photos.length > 0 ? photos[0].url : '');
  const fullMainCover = raw.fullMainCover || null;
  const galleryImages = photos.map((p) => p.url);

  return {
    id: raw._id,
    slug: getEnSlug(raw),
    titleAr: raw.name?.ar || '',
    titleEn: raw.name?.en || '',
    descriptionAr: raw.description?.ar || '',
    descriptionEn: raw.description?.en || '',
    coverImage,
    fullMainCover,
    galleryImages,
    photos,
    videos,
    mediaGroups,
    clientName: resolveBilingual(raw.company),
    locationAr: raw.location?.ar || (typeof raw.location === 'string' ? raw.location : ''),
    locationEn: raw.location?.en || (typeof raw.location === 'string' ? raw.location : ''),
    location: resolveBilingual(raw.location),
    tags: (raw.tags || [])
      .map((t) => (typeof t === 'string' ? t : t.en || t.ar || ''))
      .filter(Boolean),
    services: (raw.types || [])
      .map((t) => (typeof t === 'string' ? t : t.name?.en || t.name?.ar || ''))
      .filter(Boolean),
    sectorId: (raw.categories?.[0]?.name?.en || raw.categories?.[0] || 'all'),
    mainCategory: (raw.categories?.[0]?.name?.en || raw.categories?.[0] || 'all'),
    categoryId: raw.categories?.[0]?._id || '',
    categoryNameEn: raw.categories?.[0]?.name?.en || (typeof raw.categories?.[0] === 'string' ? raw.categories[0] : ''),
    categoryNameAr: raw.categories?.[0]?.name?.ar || '',
    featured: raw.order === 1,
    order: raw.order != null ? raw.order : 999,
    photosCount: photos.length,
    videosCount: videos.length,
    reelsCount: videos.length,
    shootedAt: resolveBilingual(raw.shootedAt) || raw.shootedAt || '',
    cast: (raw.cast || []).map((c) => {
      const castData = c.castId || c;
      return {
        roleAr: castData.title || '',
        roleEn: castData.title || '',
        name: castData.name || '',
        avatar: castData.avatar || '',
      };
    }),
    published: raw.published,
    createdAt: raw.createdAt,
    parentProject: raw.parentProject,
    _raw: raw,
  };
};

export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(PROJECTS_API_URL, {
        params: { PageCount: 'all' },
      });
      const rawProjects = response.data.projects || [];
      return rawProjects.map(transformProject);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    rawProjects: loadFromCache(),
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
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.rawProjects = action.payload;
        state.error = null;
        saveToCache(action.payload);
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch projects';
        // Keep existing cached data on failure instead of clearing
        if (state.rawProjects.length === 0) {
          state.rawProjects = loadFromCache();
        }
      });
  },
});

export const { clearError } = projectsSlice.actions;

export const selectAllProjects = (state) => state.projects.rawProjects;
export const selectPublishedProjects = (state) => state.projects.rawProjects.filter((p) => p.published === true);
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsError = (state) => state.projects.error;

export const selectProjectById = (state, projectId) =>
  state.projects.rawProjects.find((p) => p.id === projectId && p.published === true);

export const selectProjectBySlug = createSelector(
  [(state) => state.projects.rawProjects, (_state, slug) => slug],
  (projects, slug) => projects.find((p) => p.slug === slug && p.published === true)
);

export const selectRelatedProjects = createSelector(
  [selectPublishedProjects, (state, _slug) => _slug],
  (projects, slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return [];
    return projects.filter(
      (p) => p.slug !== slug && p.sectorId === project.sectorId
    );
  }
);

export default projectsSlice.reducer;
