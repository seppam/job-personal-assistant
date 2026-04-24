import { useSelector } from 'react-redux';

/**
 * useKeyCheck
 * Verifies if required keys exist in the store.
 * Now permissive: Entry allowed if at least one AI core is active.
 */
export const useKeyCheck = () => {
  const { geminiKey, anthropicKey, mongoUri } = useSelector((state) => state.config);
  
  const hasGemini = Boolean(geminiKey && geminiKey.trim().length > 10);
  const hasAnthropic = Boolean(anthropicKey && anthropicKey.trim().length > 10);
  const hasMongo = Boolean(mongoUri && mongoUri.trim().length > 5);
  
  // Revised Logic: System unlocks if at least ONE AI engine is configured
  const hasRequiredKeys = hasGemini || hasAnthropic;
  
  return {
    hasRequiredKeys,
    hasGemini,
    hasAnthropic,
    hasMongo,
    geminiKey,
    anthropicKey,
  };
};

export default useKeyCheck;
