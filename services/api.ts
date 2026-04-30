export const getApiKey = (): string => {
  const useCustomKey = localStorage.getItem('useCustomApiKey') === 'true';
  if (useCustomKey && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
};
