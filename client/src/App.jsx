import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FormUser from "./components/FormUser";
import FormEditUser from "./components/FormEditUser";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Info from "./pages/Info";
import Navbar from "./components/Navbar";
import NewNavbar from "./components/NewNavbar";
import Home from "./pages/Home";
import { refresh } from "./Functions/auth"; // 🟢 เพิ่มไฟล์ refreshToken.js

const App = () => {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("authtoken");

      if (accessToken) {
        const tokenExp = getTokenExpiration(accessToken);
        const now = Date.now();

        if (tokenExp && now >= tokenExp) {
          try {
            await refresh(); // 🟢 รีเฟรช token ถ้าหมดอายุ
            console.log("Access token refreshed");
          } catch (err) {
            console.error("Failed to refresh token", err);
            localStorage.clear(); // 🛑 ล้าง token ถ้า refresh ไม่สำเร็จ
            window.location.href = "/login";
          }
        }
      }
    };

    checkAndRefreshToken();
  }, []);

  const getTokenExpiration = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch (e) {
      return null;
    }
  };

  return (
    <BrowserRouter>
      <NewNavbar />

      <Routes>
        <Route path="/edit/:id" element={<FormEditUser />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form/:id" element={<FormUser />} />
        <Route path="/info" element={<Info />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
