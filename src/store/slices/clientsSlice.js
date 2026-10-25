import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CLIENTS_API_URL = 'https://marketing-planner-tau.vercel.app/api/v1/project-companies';
const CACHE_KEY = 'saber_clients_cache_v1';

const loadFromCache = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

const saveToCache = (clients) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(clients));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
};

const transformClient = (raw) => ({
  id: raw._id,
  nameEn: raw.name?.en || '',
  nameAr: raw.name?.ar || '',
  field: raw.field || '',
  logo: raw.logo || '',
  order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 999,
});

// One background refresh per full page load, same pattern as getProjects.
let fetchedThisPageLoad = false;

export const getClients = createAsyncThunk(
  'clients/getClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CLIENTS_API_URL, {
        params: { PageCount: 'all' },
      });
      const rawClients = response.data.projectCompanies || [];
      return rawClients
        .filter((client) => client._id && client.deleted !== true)
        .map(transformClient);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      if (fetchedThisPageLoad || getState().clients.loading) return false;
      return true;
    },
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    items: loadFromCache(),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        fetchedThisPageLoad = true;
        state.loading = false;
        state.items = action.payload;
        saveToCache(action.payload);
      })
      .addCase(getClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch clients';
      });
  },
});

export const selectClients = (state) =>
  [...state.clients.items].sort((a, b) => a.order - b.order);

export default clientsSlice.reducer;
