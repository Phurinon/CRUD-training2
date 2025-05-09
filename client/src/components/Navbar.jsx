import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// --- ไอคอน ---
// วิธีที่ 1: ใช้ไอคอน SVG ของคุณ (แนะนำให้ปรับขนาดใน CSS หรือ sx prop)

// วิธีที่ 2: (แนะนำ) ใช้ไอคอนจาก Material UI โดยตรง (ถ้ามีไอคอนที่ต้องการ)
// import HomeIconMui from '@mui/icons-material/Home';

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px

  const isLoggedIn = !!localStorage.getItem("authtoken");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("user");
    navigate("/login");
    // อาจจะ reload เพื่อให้ AppBar อัปเดตทันที (ถ้า state ไม่ได้ผูกกับ context/redux)
    // window.location.reload();
  };

  // ----- ส่วนของ Drawer ไม่ได้แก้ไข -----
  const menuItems = [
    { text: "Home", path: "/" },
    isLoggedIn && { text: "Info", path: "/info" },
  ].filter(Boolean);

  const authItems = !isLoggedIn
    ? [
        { text: "Sign up", path: "/register" },
        { text: "Sign in", path: "/login" },
      ]
    : [{ text: "Logout", action: handleLogout }];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {/* ถ้าต้องการไอคอนใน Drawer ด้วย ก็เพิ่ม ListItemIcon ที่นี่ */}
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {authItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={item.path ? Link : "button"}
              to={item.path}
              onClick={item.action}
              sx={!item.path ? { width: "100%" } : {}} // ทำให้ปุ่ม Logout กว้างเต็ม
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  // ----- จบส่วน Drawer -----

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        {/* Toolbar เป็น flex container อยู่แล้ว ใช้ alignItems: 'center' โดย default */}
        <Toolbar>
          {/* --- ส่วนเมนูด้านซ้าย --- */}
          {/* ปุ่ม Home */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            // ใช้ startIcon สำหรับใส่ไอคอน (แนะนำ)
            startIcon={<HomeIcon />} // ใช้วิธีที่ 1 หรือ 2 จากด้านบน
            sx={{ mr: 1 }} // เพิ่มระยะห่างขวาเล็กน้อย
          >
            {/* ไม่ต้องใส่ Text ก็ได้ ถ้าต้องการแค่ไอคอน */}
            {/* Home */}
          </Button>

          {/* ปุ่ม Info (แสดงเมื่อ Login แล้ว) */}
          {isLoggedIn && (
            <Button
              color="inherit"
              component={Link}
              to="/info"
              sx={{ mr: 2 }} // เพิ่มระยะห่างขวา
            >
              Info
            </Button>
          )}

          {/* --- Spacer --- */}
          {/* ใช้ Box นี้เพื่อดันส่วนถัดไปไปทางขวา */}
          <Box sx={{ flexGrow: 1 }} />

          {/* --- ส่วนเมนู/ปุ่ม ด้านขวา --- */}
          {isMobile ? (
            // --- Hamburger Menu (Mobile) ---
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right" // เปลี่ยนเป็นขวาเพื่อให้สอดคล้องกับตำแหน่งปุ่ม
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            // --- Buttons (Desktop) ---
            <>
              {!isLoggedIn ? (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Sign in
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Sign up
                  </Button>
                </>
              ) : (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
