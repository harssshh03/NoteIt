import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export const api = axios.create({ baseURL: `${BACKEND_URL}/api/v1` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function errorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again."
) {
  if (axios.isAxiosError(err)) return err.response?.data?.msg ?? fallback;
  if (err instanceof Error) return err.message;
  return fallback;
}