import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem("github_token");
  if (token) config.headers.Authorization = `token ${token}`;
  return config;
});


export default api;