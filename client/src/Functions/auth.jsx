import axios from "../axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export const create = async (data) => {
  await axios.post(API_URL + "/auth/register", data);
};

// services/authService.js
export const login = async (data) => {
  const res = await axios.post(API_URL + "/auth/login", data);

  // 👉 เก็บ accessToken และ refreshToken ลง localStorage
  // localStorage.setItem("accessToken", res.data.accessToken);
  // localStorage.setItem("refreshToken", res.data.refreshToken);
  // localStorage.setItem("userId", res.data.id);

  return res.data;
};

export const refresh = async () => {
  const token = localStorage.getItem("refreshtoken");

  if (!token) {
    console.warn("⚠️ No refresh token found in localStorage");
    throw new Error("No refresh token");
  }

  const res = await axios.post(
    API_URL + "/auth/refresh-token",
    { refreshToken: token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // 👉 เก็บ accessToken ลง localStorage
  localStorage.setItem("authtoken", res.data.accessToken);

  return res.data;
};

export const check = async (email) => {
  return await axios.get(API_URL + "/auth/check-email", { params: { email } });
};
