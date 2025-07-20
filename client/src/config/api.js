// API configuration
// In containerized environment with nginx proxy, use relative URLs
const getApiBaseUrl = () => {
  // Always use relative URLs for API calls in containerized environment
  // Nginx will handle the proxying
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: `${API_BASE_URL}/api/auth`,
    tours: `${API_BASE_URL}/api/tours`,
    destinations: `${API_BASE_URL}/api/destinations`,
    search: `${API_BASE_URL}/api/search`
  }
};

export default apiConfig;
