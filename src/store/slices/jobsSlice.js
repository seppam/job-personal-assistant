import { createSlice } from '@reduxjs/toolkit';

const loadJobs = () => {
  try {
    const data = localStorage.getItem('JPA_JOBS');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const persistJobs = (jobs) => {
  localStorage.setItem('JPA_JOBS', JSON.stringify(jobs));
};

const initialState = {
  jobs: loadJobs(),
  columns: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    addJob: (state, action) => {
      const newJob = {
        id: crypto.randomUUID(),
        status: 'Wishlist',
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      state.jobs.push(newJob);
      persistJobs(state.jobs);
    },
    moveJob: (state, action) => {
      const { jobId, newStatus } = action.payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (job) {
        job.status = newStatus;
        persistJobs(state.jobs);
      }
    },
    deleteJob: (state, action) => {
      state.jobs = state.jobs.filter(j => j.id !== action.payload);
      persistJobs(state.jobs);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(j => j.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload };
        persistJobs(state.jobs);
      }
    }
  },
});

export const { addJob, moveJob, deleteJob, updateJob } = jobsSlice.actions;
export default jobsSlice.reducer;
