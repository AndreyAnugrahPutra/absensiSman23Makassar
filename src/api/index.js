import axios from 'axios'

// const url = axios.defaults.baseURL = "http://127.0.0.1:8000/api/"

// const api = axios.create({
//   baseURL: url, // ganti dengan URL server Laravel Anda
//   // withCredentials: true,
// })

const JWToken = localStorage.token

axios.interceptors.request.use(
  config => {
      config.headers.Authorization = `Bearer ${JWToken}`;
      return config;
  },
  error => {
      return Promise.reject(error);   

  }
);

// export default(url = '') => {
  export default(url = 'http://127.0.0.1:8000/api') => {
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