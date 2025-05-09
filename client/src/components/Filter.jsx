import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Button } from "@mui/material";
import { getRole } from '../Functions/user';

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

const genders = ['Men', 'Women', 'Other'];

export default function MultipleSelectCheckmarks() {
  const [roles, setRoles] = useState([]); // ตัวเลือก role
  const [role, setRole] = useState([]);   // ค่าที่เลือก
  const [gender, setGender] = useState([]);

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

  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;

    if (value.includes('all_roles')) {
      setRole(role.length === roles.length ? [] : roles);
    } else {
      setRole(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handleChangeGender = (event) => {
    const {
      target: { value },
    } = event;

    if (value.includes('all_genders')) {
      setGender(gender.length === genders.length ? [] : genders);
    } else {
      setGender(typeof value === 'string' ? value.split(',') : value);
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
          renderValue={(selected) => selected.join(', ')}
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
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          <MenuItem value="all_genders">
            <Checkbox
              checked={gender.length === genders.length}
              indeterminate={gender.length > 0 && gender.length < genders.length}
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

      <Button variant="contained" sx={{ m:2}}>
        Search
      </Button>
    </div>
  );
}
