import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend URL
});

// Add JWT to headers for authenticated routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
