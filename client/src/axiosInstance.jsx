// services/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/auth",
});

// ✅ ใส่ access token เข้า header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ ตรวจจับ token หมดอายุแล้วใช้ refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshtoken");

      try {
        const res = await axios.post(
          import.meta.env.VITE_API_URL + "/auth/refresh-token",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("authtoken", newAccessToken);

        // 🔁 ยิง request เดิมซ้ำ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        console.error("🔒 Refresh token invalid:", err);
        localStorage.clear();
        window.location.href = "/login"; // หรือ redirect ไปหน้า login
      }
    }

    return Promise.reject(error);
  }
);

export default API;
