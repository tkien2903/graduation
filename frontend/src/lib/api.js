import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export const publicApi = axios.create({ baseURL: API_BASE_URL });
export const adminApi = axios.create({ baseURL: `${API_BASE_URL}/admin` });
