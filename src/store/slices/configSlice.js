import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (e) {
    return '';
  }
};

const initialState = {
  geminiKey: loadFromStorage('JPA_GEMINI_KEY'),
  anthropicKey: loadFromStorage('JPA_ANTHROPIC_KEY'),
  mongoUri: loadFromStorage('JPA_MONGO_URI'),
  atlasAppId: loadFromStorage('JPA_ATLAS_APP_ID'),
  atlasApiKey: loadFromStorage('JPA_ATLAS_API_KEY'),
  preferredModel: loadFromStorage('JPA_PREFERRED_MODEL') || 'gemini-2.5-flash',
  isInitialized: false,
  isRateLimited: false,
  rateLimitExpiry: null,
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
