// import * as React from "react";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useParams } from "react-router-dom";
import { getData, read, remove, update } from "../Functions/user";
import { Button } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Filter from "../components/Filter";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Info() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const currentUser = localStorage.getItem("isAdmin");

  // console.log(currentUserData);

  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please log in",
        text: "You must be logged in to access this page.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    getData()
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(id)
          .then((res) => {
            console.log(res);
            // localStorage.removeItem("authtoken");
            // localStorage.removeItem("user");
            // localStorage.removeItem("id");

            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
            }).then(() => {
              // window.location.reload();
              loadData();
            });
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  };

  const ishaveUser = async () => {
    const id = parseInt(localStorage.getItem("id"));

    if (!id || isNaN(id)) {
      Swal.fire({
        icon: "error",
        title: "Invalid ID",
        text: "User not found please login.",
      });
      return;
    }

    try {
      await read(id); // ถ้ามี user อยู่
      navigate("/form/" + id);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Cannot proceed because the user does not exist.",
      });
    }
  };

  // Filter
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="mx-15 mt-10 ">
        <div className="border-solid-red-500 border-2 rounded-lg p-5">
          <Filter filter={filter} handleFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className="flex flex-row-reverse justify-center">
        <div className="absolute mt-2 sm:right-20 right-5">
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={ishaveUser}
          >
            Add data
          </Button>
        </div>
      </div>
      <TableContainer component={Paper} sx={{ padding: 10 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Age</StyledTableCell>
              <StyledTableCell align="right">Role</StyledTableCell>
              <StyledTableCell align="right">Gender</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {item.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {item.email}
                    </StyledTableCell>
                    <StyledTableCell align="right">{item.age}</StyledTableCell>
                    <StyledTableCell align="right">{item.role}</StyledTableCell>
                    <StyledTableCell align="right">
                      {item.gender}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {currentUser === "true" ? (
                        <span
                          onClick={() => handleDelete(item.id)}
                          className="!text-red-700 cursor-pointer"
                        >
                          Delete
                        </span>
                      ) : (
                        "-"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {currentUser === "true" ? (
                        <Link
                          to={"/edit/" + item.id}
                          className="!text-blue-700"
                        >
                          Edit
                        </Link>
                      ) : (
                        "-"
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
