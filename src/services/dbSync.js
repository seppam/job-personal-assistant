import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { useAuth } from '@clerk/clerk-react';

class DBSyncService {
  constructor() {
    this.config = null;
    this.baseUrl = '';
  }

  init(config) {
    this.config = config;
    if (config.atlasAppId) {
      this.baseUrl = `https://data.mongodb-api.com/app/${config.atlasAppId}/endpoint/data/v1/action`;
    }
  }

  async syncItem(collection, filter, update) {
    if (!this.config?.atlasAppId || !this.config?.atlasApiKey) return;

    try {
      await axios.post(
        `${this.baseUrl}/updateOne`,
        {
          dataSource: "Cluster0", // Default Atlas Cluster Name
          database: "JPA_Assistant",
          collection: collection,
          filter: filter,
          update: { $set: update },
          upsert: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.config.atlasApiKey,
          }
        }
      );
    } catch (error) {
      console.error(`Sync Error [${collection}]:`, error.response?.data || error.message);
    }
  }
}

export const dbSync = new DBSyncService();

// Hook for automated sync
export const useSync = () => {
  const config = useSelector((state) => state.config);
  const jobs = useSelector((state) => state.jobs.jobs);
  const cv = useSelector((state) => state.cv);
  const profile = useSelector((state) => state.profile);
  const { userId } = useAuth();

  useEffect(() => {
    dbSync.init(config);
  }, [config]);

  // Debounced Sync functions
  const debouncedSyncJobs = useCallback(
    debounce((jobsList, uid) => {
      // Use uid for isolation if present, otherwise fallback to generic type
      const filter = uid ? { userId: uid, type: 'pipeline' } : { type: 'pipeline' };
      dbSync.syncItem('jobs', filter, { entries: jobsList, lastUpdated: new Date() });
    }, 1000),
    []
  );

  const debouncedSyncCV = useCallback(
    debounce((cvData, uid) => {
      const filter = uid ? { userId: uid, type: 'master_resume' } : { type: 'master_resume' };
      dbSync.syncItem('cv', filter, { ...cvData, lastUpdated: new Date() });
    }, 1000),
    []
  );

  const debouncedSyncProfile = useCallback(
    debounce((profileData, uid) => {
      if (!uid) return; // Don't sync profile if not authenticated
      dbSync.syncItem('users', { clerkUserId: uid }, { ...profileData, lastUpdated: new Date() });
    }, 1000),
    []
  );

  useEffect(() => {
    if (jobs.length > 0) debouncedSyncJobs(jobs, userId);
  }, [jobs, userId, debouncedSyncJobs]);

  useEffect(() => {
    // Only sync if CV has content
    if (cv.personal?.name) debouncedSyncCV(cv, userId);
  }, [cv, userId, debouncedSyncCV]);

  useEffect(() => {
    // Only sync if Profile has content and we have a userId
    if ((profile.currentRole || profile.targetRole) && userId) debouncedSyncProfile(profile, userId);
  }, [profile, userId, debouncedSyncProfile]);
};
