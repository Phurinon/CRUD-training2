import axios from "../axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authtoken");

  // ตรวจสอบว่า token มีค่าอยู่หรือไม่
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`, // ส่ง Bearer token ใน headers
  };

  return headers;
};

export const getData = async () => {
  try {
    const response = await axios.get(API_URL + "/user/list", {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response && error.response.status === 401) {
      // ถ้าเกิด error 401 อาจจะต้องให้ผู้ใช้ล็อกอินใหม่
      localStorage.removeItem("authtoken");
      localStorage.removeItem("user");
      // อาจจะนำผู้ใช้กลับไปที่หน้า login
    }
    throw error; // โยนข้อผิดพลาดกลับไป
  }
};

export const remove = async (id) => {
  await axios.delete(API_URL + "/user/remove/" + id, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
    },
  });
};

export const create = async (data) => {
  await axios.post(API_URL + "/user/create", data);
};

// export const getData = async () => {
//   return await axios.get(API_URL + "/user/list", { headers: getAuthHeaders() });
// };

export const read = async (id) => {
  return await axios.get(API_URL + "/user/listBy/" + id);
};

export const update = async (id, data) => {
  return await axios.put(API_URL + "/user/update/" + id, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
    },
  });
};

export const check = async (email) => {
  return await axios.get(API_URL + "/user/check-email", { params: { email } });
};

export const getRole = async () => {
  const roles = await axios.get(API_URL + "/user/get-roles", {
    headers: getAuthHeaders(),
  });
  return roles;
};

export const filterUser = async (role, gender) => {
  const response = await axios.get(API_URL + "/user/filter", {
    headers: getAuthHeaders(),
    params: {
      role: Array.isArray(role) ? role.join(",") : role,
      gender: Array.isArray(gender) ? gender.join(",") : gender,
    },
  });
  return response.data;
};
