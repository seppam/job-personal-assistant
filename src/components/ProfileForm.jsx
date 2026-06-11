import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/profileSlice';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const handleChange = (e) => {
    dispatch(updateProfile({ [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-obsidian-800/40 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Your Career Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">First Name (Clerk)</label>
          <input
            type="text"
            readOnly
            value={profile.firstName || ''}
            className="w-full bg-obsidian-900/50 border border-slate-700/30 rounded-lg p-2 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Email (Clerk)</label>
          <input
            type="text"
            readOnly
            value={profile.email || ''}
            className="w-full bg-obsidian-900/50 border border-slate-700/30 rounded-lg p-2 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Current Role</label>
          <input
            type="text"
            name="currentRole"
            value={profile.currentRole}
            onChange={handleChange}
            placeholder="e.g. Junior Developer"
            className="w-full bg-obsidian-900 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-violet-glow/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Target Role</label>
          <input
            type="text"
            name="targetRole"
            value={profile.targetRole}
            onChange={handleChange}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full bg-obsidian-900 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-violet-glow/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Years of Experience</label>
          <input
            type="text"
            name="yearsExperience"
            value={profile.yearsExperience}
            onChange={handleChange}
            placeholder="e.g. 2 years"
            className="w-full bg-obsidian-900 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-violet-glow/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Top Skills</label>
          <input
            type="text"
            name="topSkills"
            value={profile.topSkills}
            onChange={handleChange}
            placeholder="React, Node.js, Python"
            className="w-full bg-obsidian-900 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-violet-glow/50 transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Long-Term Career Goal</label>
          <textarea
            name="careerGoal"
            value={profile.careerGoal}
            onChange={handleChange}
            placeholder="e.g. Become a Lead AI Engineer focusing on multi-modal applications."
            className="w-full bg-obsidian-900 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-violet-glow/50 transition-colors h-24 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
