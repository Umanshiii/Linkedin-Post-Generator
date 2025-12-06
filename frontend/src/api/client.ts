// frontend/src/api/client.ts
import axios from "axios";

const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/token/", { username: email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/register/", { name, email, password }),
};

// ---- Posts ----
export interface Post {
  id: number;
  content: string;
  generated_at: string;
}

export const postsApi = {
  list: () => api.get<Post[]>("/posts/"),
  generate: (topic: string) => api.post<Post>("/posts/generate/", { topic }),
};
