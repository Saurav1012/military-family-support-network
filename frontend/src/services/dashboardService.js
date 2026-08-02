import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Always dynamically attach Bearer Token before every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getDashboardStats = async () => {
  try {
    const response = await API.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export default API;