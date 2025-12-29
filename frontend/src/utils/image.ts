export const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  return `${import.meta.env.VITE_BASE_URL_API.replace('/api', '')}${path}`;
};
