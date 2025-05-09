import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../components/Theme";
import { login } from "../../Functions/auth";

export default function Login() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authtoken");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // ฟังก์ชันตรวจสอบข้อมูลก่อนส่ง
  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // ตรวจสอบ email
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // ตรวจสอบ password
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      login(form)
        .then((res) => {
          console.log("RESPONSE FROM login(form):", res);

          // ตรวจสอบว่า password ถูกต้องหรือไม่
          if (res.accessToken) {
            localStorage.setItem("authtoken", res.accessToken);
            localStorage.setItem("refreshtoken", res.refreshToken);
            localStorage.setItem("id", res.payload.id);
            localStorage.setItem(
              "isAdmin",
              JSON.stringify(res.payload.isAdmin)
            );
            navigate("/info");
            // navigate("/form/" + res.data.id);
          } else {
            // กรณีรหัสผ่านไม่ถูกต้อง
            setErrors({
              ...errors,
              password: "Incorrect password or email",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrors({
            ...errors,
            password: "Incorrect password or email", // กรณีเกิดข้อผิดพลาดจากการเชื่อมต่อ API
          });
        });
    }
  };

  return (
    <div>
      <CssBaseline />
      <Box
        sx={{
          // backgroundColor: "blue-100",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LoginOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
