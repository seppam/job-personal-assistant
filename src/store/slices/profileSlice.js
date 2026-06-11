import { createSlice } from '@reduxjs/toolkit';

const loadProfile = () => {
  try {
    const data = localStorage.getItem('JPA_PROFILE');
    return data ? JSON.parse(data) : {
      firstName: '',
      email: '',
      currentRole: '',
      targetRole: '',
      yearsExperience: '',
      topSkills: '',
      careerGoal: ''
    };
  } catch (e) {
    return {
      firstName: '',
      email: '',
      currentRole: '',
      targetRole: '',
      yearsExperience: '',
      topSkills: '',
      careerGoal: ''
    };
  }
};

const initialState = loadProfile();

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem('JPA_PROFILE', JSON.stringify(newState));
      return newState;
    }
  },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
