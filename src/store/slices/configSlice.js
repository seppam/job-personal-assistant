import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (e) {
    return '';
  }
};

const envGemini = import.meta.env.VITE_GEMMA_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const envAnthropic = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const envMongoUri = import.meta.env.VITE_MONGODB_URI || '';
const envAtlasAppId = import.meta.env.VITE_ATLAS_APP_ID || '';
const envAtlasApiKey = import.meta.env.VITE_ATLAS_API_KEY || '';

const initialState = {
  geminiKey: envGemini || loadFromStorage('JPA_GEMINI_KEY'),
  anthropicKey: envAnthropic || loadFromStorage('JPA_ANTHROPIC_KEY'),
  mongoUri: envMongoUri || loadFromStorage('JPA_MONGO_URI'),
  atlasAppId: envAtlasAppId || loadFromStorage('JPA_ATLAS_APP_ID'),
  atlasApiKey: envAtlasApiKey || loadFromStorage('JPA_ATLAS_API_KEY'),
  preferredModel: loadFromStorage('JPA_PREFERRED_MODEL') || 'gemini-2.5-flash',
  isInitialized: false,
  isRateLimited: false,
  rateLimitExpiry: null,
  envLocks: {
    geminiKey: !!envGemini,
    anthropicKey: !!envAnthropic,
    mongoUri: !!envMongoUri,
    atlasAppId: !!envAtlasAppId,
    atlasApiKey: !!envAtlasApiKey,
  }
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setKeys: (state, action) => {
      const { geminiKey, anthropicKey, mongoUri, atlasAppId, atlasApiKey } = action.payload;
      if (geminiKey !== undefined) state.geminiKey = geminiKey;
      if (anthropicKey !== undefined) state.anthropicKey = anthropicKey;
      if (mongoUri !== undefined) state.mongoUri = mongoUri;
      if (atlasAppId !== undefined) state.atlasAppId = atlasAppId;
      if (atlasApiKey !== undefined) state.atlasApiKey = atlasApiKey;

      // Persistence
      localStorage.setItem('JPA_GEMINI_KEY', state.geminiKey);
      localStorage.setItem('JPA_ANTHROPIC_KEY', state.anthropicKey);
      localStorage.setItem('JPA_MONGO_URI', state.mongoUri);
      localStorage.setItem('JPA_ATLAS_APP_ID', state.atlasAppId);
      localStorage.setItem('JPA_ATLAS_API_KEY', state.atlasApiKey);
    },
    setPreferredModel: (state, action) => {
      state.preferredModel = action.payload;
      localStorage.setItem('JPA_PREFERRED_MODEL', action.payload);
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    setRateLimited: (state, action) => {
      state.isRateLimited = action.payload;
    },
    clearRateLimit: (state) => {
      state.isRateLimited = false;
    },
    clearKeys: (state) => {
      state.geminiKey = '';
      state.anthropicKey = '';
      state.mongoUri = '';
      state.atlasAppId = '';
      state.atlasApiKey = '';
      localStorage.clear();
    }
  },
});

export const { setKeys, setPreferredModel, setInitialized, clearKeys, setRateLimited, clearRateLimit } = configSlice.actions;
export default configSlice.reducer;
