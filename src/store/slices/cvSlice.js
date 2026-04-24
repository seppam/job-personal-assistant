import { createSlice } from '@reduxjs/toolkit';

const loadCV = () => {
  try {
    const data = localStorage.getItem('JPA_CV');
    return data ? JSON.parse(data) : {
      personal: { name: '', email: '', phone: '', location: '', summary: '' },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      targetJD: ''
    };
  } catch (e) {
    return { personal: {}, experience: [], education: [], skills: [], projects: [], targetJD: '' };
  }
};

const initialState = loadCV();

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonal: (state, action) => {
      state.personal = { ...state.personal, ...action.payload };
      localStorage.setItem('JPA_CV', JSON.stringify(state));
    },
    addExperience: (state) => {
      state.experience.push({ id: crypto.randomUUID(), company: '', role: '', dates: '', bullets: '' });
      localStorage.setItem('JPA_CV', JSON.stringify(state));
    },
    updateExperience: (state, action) => {
      const index = state.experience.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = { ...state.experience[index], ...action.payload.data };
        localStorage.setItem('JPA_CV', JSON.stringify(state));
      }
    },
    removeExperience: (state, action) => {
      state.experience = state.experience.filter(e => e.id !== action.payload);
      localStorage.setItem('JPA_CV', JSON.stringify(state));
    },
    updateSkills: (state, action) => {
      state.skills = action.payload;
      localStorage.setItem('JPA_CV', JSON.stringify(state));
    },
    setTargetJD: (state, action) => {
      state.targetJD = action.payload;
      localStorage.setItem('JPA_CV', JSON.stringify(state));
    }
  },
});

export const { 
  updatePersonal, 
  addExperience, 
  updateExperience, 
  removeExperience, 
  updateSkills, 
  setTargetJD 
} = cvSlice.actions;

export default cvSlice.reducer;
