// API configuration
// In containerized environment with nginx proxy, use relative URLs
const getApiBaseUrl = () => {
  // Check if we're running in a containerized environment (port 80 suggests nginx proxy)
  const isContainerized = window.location.port === '80' || window.location.port === '';
  
  if (isContainerized) {
    // Use relative URLs so nginx can proxy to the backend
    return '';
  }
  
  // For local development (non-containerized)
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
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
