import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // adjust this to your API's base URL
  withCredentials: true, // This is important for sending cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await axios.post('/auth/refresh', {}, {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
    });
    const newToken = response.data.token || response.data.accessToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      return newToken;
    } else {
      throw new Error('New token not received');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken()
          .then(newToken => {
            if (newToken) {
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              processQueue(null, newToken);
              resolve(api(originalRequest));
            } else {
              processQueue(new Error('Failed to refresh token'), null);
              reject(error);
            }
          })
          .catch(err => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;