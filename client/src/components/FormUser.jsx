import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./Theme";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { create, check } from "../Functions/user";
import { getRole } from '../Functions/user';

import Swal from "sweetalert2";

export default function FormUser() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    role: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    role: "",
    gender: "",
  });

  const [roles, setRoles] = useState([]); // ตัวเลือก role

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
      const fetchRoles = async () => {
        try {
          const res = await getRole() // เปลี่ยน URL ตาม API ของคุณ
          const roleNames = res.data.map(item => item.Role); // สมมุติว่า API ส่งกลับ array ของ object ที่มี property ชื่อ name
          setRoles(roleNames); // สมมุติว่าเป็น array ของ string
        } catch (err) {
          console.error('Error fetching roles:', err);
        }
      };
      fetchRoles();
    }, []);

  // ฟังก์ชันตรวจสอบข้อมูลก่อนส่ง
  const validate = async () => {
    let isValid = true;
    const newErrors = { email: "", name: "", age: "", role: "", gender: "" };

    // ตรวจสอบ email
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else {
      try {
        const response = await check(form.email);
        if (response.data.exists) {
          newErrors.email = "Email already exists";
          isValid = false;
        }
      } catch (err) {
        console.error("Error checking email:", err);
        newErrors.email = "Could not verify email. Please try again.";
        isValid = false;
      }
    }

    // ตรวจสอบ name
    if (!form.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    // ตรวจสอบ age
    if (!form.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(form.age)) {
      newErrors.age = "Age must be a number";
      isValid = false;
    }
    // ตรวจสอบ role
    if (!form.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }
    // ตรวจสอบ gender
    if (!form.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validate(); // ✅ รอ validate ทำงานเสร็จก่อน

    if (isValid) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save this data?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, save it!",
      }).then((result) => {
        if (result.isConfirmed) {
          create({ ...form, userId: userId })
            .then((res) => {
              console.log(res);
              Swal.fire("Saved!", "Your data has been saved.", "success").then(
                () => {
                  navigate("/info");
                }
              );
            })
            .catch((err) => {
              console.log(err);
              Swal.fire("Error", "Something went wrong!", "error");
            });
        }
      });
    }
  };

  return (
    <div>
      <CssBaseline />
      <Box
        sx={{
          // backgroundColor: theme.palette.background.default || "#f5f5f5",
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
              <SaveAsOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Employee Form
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
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                autoComplete="age"
                value={form.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
              />
              {/* Roles Select */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="gender-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={form.role}
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  error={!!errors.role}
                  helperText={errors.role}
                >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
              {/* Gender Select */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={form.gender}
                  label="Gender"
                  name="gender"
                  onChange={handleChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                >
                  <MenuItem value="Men">Men</MenuItem>
                  <MenuItem value="Women">Women</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
