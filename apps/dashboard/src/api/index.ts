import axios from "axios";

export const instance = axios.create({ baseURL: "http://localhost:4000" });

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (typeof token === "string") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
