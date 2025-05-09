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
import { read, update } from "../Functions/user";
import Swal from "sweetalert2";

const FormEditUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("isAdmin");

  useEffect(() => {
    if (currentUser !== "true") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "This page is for admin only.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/info");
      });
    }
  }, [currentUser]);

  const [form, setForm] = useState({
    name: "",
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

  useEffect(() => {
    loadData(params.id);
  }, []);

  const loadData = async (id) => {
    read(id).then((res) => {
      setForm(res.data);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันตรวจสอบข้อมูลก่อนส่ง
  const validate = async () => {
    let isValid = true;
    const newErrors = { name: "", age: "", role: "", gender: "" };

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
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        if (result.isConfirmed) {
          // ถ้ากด Save → ค่อย update
          update(params.id, form)
            .then((res) => {
              Swal.fire("Saved!", "", "success").then(() => {
                navigate("/info");
              });
            })
            .catch((err) => {
              Swal.fire("Error", "Acess Denied: Admin Only", "error");
              console.log(err);
            });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info").then(() => {
            navigate("/info");
          });
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default || "#f5f5f5",
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
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="age"
                label="Age"
                id="age"
                autoComplete="age"
                value={form.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="role"
                label="Role"
                id="role"
                autoComplete="role"
                value={form.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
              />
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
    </ThemeProvider>
  );
};

export default FormEditUser;
