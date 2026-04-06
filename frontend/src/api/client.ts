import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

export const authApi = {
  login: (username: string, password: string) =>
    api.post("/api/token/", { username, password }),

  refresh: (refresh: string) =>
    api.post("/api/token/refresh/", { refresh }),

  register: (
    username: string,
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) =>
    api.post("/posts/api/register/", {
      username,
      name,
      email,
      password,
      confirmPassword,
    }),
};

export interface DashboardStats {
  username: string;
  user_posts_count: number;
  has_profile: boolean;
  tone_summary: string | null;
  structure_summary: string | null;
  vocabulary_keywords: string[] | null;
  typical_length: number | null;
}

export interface Post {
  id: number;
  topic: string;
  language: string;
  target_length: number;
  generated_text: string;
  created_at: string;
}

export const postsApi = {

  dashboard: () => api.get<DashboardStats>("/posts/api/dashboard/"),
  analyzeStyle: () => api.post("/posts/api/analyze/"),

  generate: (topic: string, language: string, length: number, tone: string) =>
    api.post<Post>("/posts/api/generate/", { topic, language, length, tone }),
  
  uploadPosts: (posts_text: string) =>
    api.post("/posts/api/upload-posts/", { posts_text }),

  deletePost(id: number) {
    return api.delete(`/posts/api/linkedin-posts/${id}/`);},

  listPosts() {
    return api.get("/posts/api/linkedin-posts/");},

};