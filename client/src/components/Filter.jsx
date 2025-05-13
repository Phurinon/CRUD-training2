import React, { useState, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Swal from 'sweetalert2';
import { Button } from "@mui/material";
import { getRole, filterUser } from "../Functions/user"; // <-- ฟังก์ชันที่ใช้เรียก API
import withReactContent from 'sweetalert2-react-content';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const genders = ["Men", "Women", "Other"];

export default function MultipleSelectCheckmarks() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState([]);
  const [gender, setGender] = useState([]);
  const [users, setUsers] = useState([]); // <-- สำหรับเก็บผลลัพธ์

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRole();
        const roleNames = res.data.map((item) => item.Role);
        setRoles(roleNames);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    if (value.includes("all_roles")) {
      setRole(role.length === roles.length ? [] : roles);
    } else {
      setRole(typeof value === "string" ? value.split(",") : value);
    }
  };

  const handleChangeGender = (event) => {
    const {
      target: { value },
    } = event;
    if (value.includes("all_genders")) {
      setGender(gender.length === genders.length ? [] : genders);
    } else {
      setGender(typeof value === "string" ? value.split(",") : value);
    }
  };

  const handleSearch = async () => {
  try {
    const res = await filterUser(role, gender);
    setUsers(res);

    if (res.length === 0) {
      Swal.fire('ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไข', '', 'info');
      return;
    }

    // สร้าง HTML table
    const tableHtml = `
      <div style="overflow-x:auto;">
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <thead>
            <tr style="background-color: #1976d2; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Email</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Age</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Role</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Gender</th>
            </tr>
          </thead>
          <tbody>
            ${res
              .map(
                (user) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${user.email}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${user.age}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${user.role}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${user.gender}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    Swal.fire({
      title: 'ผลลัพธ์การค้นหา',
      html: tableHtml,
      width: '80%',
      confirmButtonText: 'ปิด',
    });
  } catch (error) {
    console.error("Filter failed:", error);
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถค้นหาผู้ใช้ได้', 'error');
  }
};

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          multiple
          value={role}
          onChange={handleChangeRole}
          input={<OutlinedInput label="Role" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          <MenuItem value="all_roles">
            <Checkbox
              checked={role.length === roles.length}
              indeterminate={role.length > 0 && role.length < roles.length}
            />
            <ListItemText primary="เลือกทั้งหมด" />
          </MenuItem>
          {roles.map((roleItem) => (
            <MenuItem key={roleItem} value={roleItem}>
              <Checkbox checked={role.includes(roleItem)} />
              <ListItemText primary={roleItem} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          multiple
          value={gender}
          onChange={handleChangeGender}
          input={<OutlinedInput label="Gender" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          <MenuItem value="all_genders">
            <Checkbox
              checked={gender.length === genders.length}
              indeterminate={
                gender.length > 0 && gender.length < genders.length
              }
            />
            <ListItemText primary="เลือกทั้งหมด" />
          </MenuItem>
          {genders.map((genderItem) => (
            <MenuItem key={genderItem} value={genderItem}>
              <Checkbox checked={gender.includes(genderItem)} />
              <ListItemText primary={genderItem} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" sx={{ m: 2 }} onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}