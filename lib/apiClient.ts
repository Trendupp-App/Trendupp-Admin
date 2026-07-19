import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function formatValidationErrorMessage(message: unknown): string {
  if (!message) return "";

  if (Array.isArray(message)) {
    if (message.length === 0) return "";
    return formatSingleMessage(String(message[0]));
  }

  if (typeof message === "string") {
    return formatSingleMessage(message);
  }

  return String(message);
}

function formatSingleMessage(msg: string): string {
  let formatted = msg.replace(/\b([a-z]+)((?:[A-Z][a-z]*)+)\b/g, (match) => {
    const words = match
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .trim();
    return words;
  });

  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  return formatted;
}

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith("/auth/");
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      typeof window !== "undefined"
    ) {
      useAuthStore.getState().clearSession();
      window.location.href = "/admin/signin";
    }

    if (error.response?.data?.message) {
      error.response.data.message = formatValidationErrorMessage(
        error.response.data.message,
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
