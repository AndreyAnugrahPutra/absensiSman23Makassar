import axios from 'axios'

// const csrfToken = await axios.get('https://happy-radically-racer.ngrok-free.app/sanctum/csrf-cookie')

const JWToken = localStorage.token

axios.interceptors.request.use(
  config => {
      // config.headers.common['X-CSRF-TOKEN'] = csrfToken;
      config.headers.Authorization = `Bearer ${JWToken}`;
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);

export default(url = 'https://happy-radically-racer.ngrok-free.app/api') => {
  // export default(url = 'http://127.0.0.1:8000/api') => {
  return axios.create({
      baseURL: url,
      withCredentials: true,
      headers :
      {
          "Authorization" : `Bearer ${JWToken}`,
      },
      timeout : 5000,
    })
};