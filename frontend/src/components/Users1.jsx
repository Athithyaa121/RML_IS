import React, { useEffect, useState } from "react";
import "../css/Users1.css";
import "../vendor/fontawesome-free/css/all.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Modal,
  Button,
  Typography,
  Box,
  Backdrop,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSpring, animated } from "react-spring";
import EditIcon from "@mui/icons-material/Edit";
import { red } from "@mui/material/colors";
import { blue } from "@mui/material/colors";
import * as XLSX from "xlsx";
import Topbar1 from "./topbar1";
import "../css/search_bar.css";

const Users1 = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all roles");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [username, setUsername] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [plantname, setPlantname] = useState([]);
  const [userrole, setUserrole] = useState([]);
  const [phone, setPhone] = useState([]);
  const [mail, setMail] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState({});

  const [plantCodes, setPlantCodes] = useState([]);
  const [departmentCodes, setDepartmentCodes] = useState([]);
  const [designationCodes, setDesignationCodes] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    filterData();
  };

  const filterData = () => {
    let filteredResults = data;

    if (filter !== "all roles") {
      filteredResults = filteredResults.filter((item) => {
        // return item.User_role.toLowerCase() === filter;
        return item.User_role.toLowerCase().includes(filter);
      });
    }

    if (startDate && endDate) {
      filteredResults = filteredResults.filter((item) => {
        // Assuming the date column name is 'date'
        const itemDate = new Date(item.Created_on);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    if (searchInput) {
      filteredResults = filteredResults.filter((item) => {
        // Assuming the columns to be searched are 'Username', 'Department', and 'Plant_name'
        return (
          (item.Userid && item.Userid === parseInt(searchInput)) ||
          (item.Username &&
            item.Username.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Dept_name &&
            item.Dept_name.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Plant_name &&
            item.Plant_name.toLowerCase().includes(
              searchInput.toLowerCase()
            )) ||
          (item.Designation &&
            item.Designation.toLowerCase().includes(searchInput.toLowerCase()))
        );
      });
    }

    setFilteredData(filteredResults);
  };

  const handleOpen = (item) => {
    setSelectedUser(item.Userid);
    setUsername(item.Username);
    setDepartment(item.Dept_name);
    setDesignation(item.Designation);
    setPlantname(item.Plant_name);
    setUserrole(item.User_role);
    setPhone(item.User_phone_no);
    setMail(item.User_mail_id);
    setOpen(true);
  };

  const handleEditClick = (item) => {
    setEditedUser(item.Userid);
    setUsername(item.Username);
    setDepartment(item.Dept_name);
    setDesignation(item.Designation);
    setPlantname(item.Plant_name);
    setUserrole(item.User_role);
    setPhone(item.User_phone_no);
    setMail(item.User_mail_id);
    setEditModalOpen(true);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUseridChange = (event) => {
    setEditedUser(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
  };

  const handlePlantnameChange = (event) => {
    setPlantname(event.target.value);
  };

  const handleUserroleChange = (event) => {
    setUserrole(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleMailChange = (event) => {
    setMail(event.target.value);
  };

  const handleModificationSubmit = () => {
    const updatedData = {
      id: editedUser,
      name: username,
      department: department,
      designation: designation,
      plantname: plantname,
      userrole: userrole,
      phone: phone,
      mail: mail,
    };
    axios
      .put(`http://localhost:3001/modifyUser/${editedUser}`, updatedData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Optionally update your UI or perform any other actions
        window.alert("User updated successfully");
        handleClose();
        fetchUsers();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
  };

  const handleClose = () => {
    setSelectedUser({});
    setOpen(false);
    setEditModalOpen(false);
    setEditedUser({});
  };

  const Fade = ({ children, in: open }) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
    });

    return <animated.div style={style}>{children}</animated.div>;
  };

  useEffect(() => {
    // Fetch data from the API endpoint
    const plantcode = localStorage.getItem("plantcode");
    console.log("plant", plantcode);
    axios
      .get(`http://localhost:3001/users?plantcode=${plantcode}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch("http://localhost:3001/DepartmentCodes")
      .then((response) => response.json())
      .then((data) => {
        setDepartmentCodes(data);
        if (data.length > 0) {
          setDepartment(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) =>
        console.error("Error fetching Department codes:", error)
      );

    fetch("http://localhost:3001/plantCodes")
      .then((response) => response.json())
      .then((data) => {
        setPlantCodes(data);
        if (data.length > 0) {
          setPlantname(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) => console.error("Error fetching plant codes:", error));

    fetch("http://localhost:3001/DesignationCodes")
      .then((response) => response.json())
      .then((data) => {
        setDesignationCodes(data);
        if (data.length > 0) {
          setDesignation(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) =>
        console.error("Error fetching Designation codes:", error)
      );
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const plantcode = localStorage.getItem("plantcode");
    axios
      .get(`http://localhost:3001/users?plantcode=${plantcode}`)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // EXCEL EXPORTING

  function exportToExcel() {
    // Get the table element
    const table = document.getElementById("Usertable");

    // Get the number of columns in the table
    const columnCount = table.rows[0].cells.length;

    // Exclude the last column from the table
    const columnRange = [0, columnCount - 2]; // Exclude the last column

    // Convert the specified range of the table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table, { range: columnRange });

    // Remove the last column header from the worksheet
    const lastColumnHeader = XLSX.utils.encode_cell({
      r: 0,
      c: columnCount - 1,
    });
    delete worksheet[lastColumnHeader];

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate the Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save the file
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const excelUrl = URL.createObjectURL(excelData);
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "Users.xlsx";
    link.click();
  }

  return (
    <>
      <Topbar1>
        {/* Page Wrapper */}
        <div id="wrapper">
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-2 text-gray-800">
              Users
              <a
                href="#"
                className="d-none d-sm-inline-block btn btn-sm btn-success shadow float-right"
              >
                <button
                  style={{
                    fontWeight: "bold",
                    marginRight: 10,
                    background: "transparent",
                    border: "none",
                    color: "white",
                  }}
                  onClick={exportToExcel}
                >
                  Generate Report
                </button>
                <i className="fas fa-file-excel" />
              </a>
            </h1>
            {/* DataTales Example */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h4 className="m-0 font-weight-bold text-primary">
                  User Details
                  <>
                    {/* Button trigger modal */}
                    <Link to="/Users">
                      <button
                        type="button"
                        className="btn btn-primary  float-right"
                      >
                        <i className="fas fa-user-plus" />
                      </button>
                    </Link>
                  </>
                </h4>
                <table className="filter-table">
                  <div className="rectangle">
                    <div className="cell1 ">
                      <form>
                        <label htmlFor="startDateInput">From </label>
                        <input
                          type="date"
                          id="startDateInput"
                          name="startDateInput"
                          value={startDate}
                          style={{ width: 180 }}
                          onChange={handleStartDateChange}
                        />
                      </form>
                    </div>
                    <div className="cell1">
                      <form>
                        <label htmlFor="endDateInput">To </label>
                        <input
                          type="date"
                          id="endDateInput"
                          name="endDateInput"
                          value={endDate}
                          style={{ width: 180 }}
                          onChange={handleEndDateChange}
                        />
                      </form>
                    </div>

                    <div className="cell1">
                      <form id="filterForm">
                        <label htmlFor="categoryFilter">Role </label>
                        <select
                          name="category"
                          id="categoryFilter"
                          value={filter}
                          onChange={handleFilterChange}
                          style={{ width: 180 }}
                        >
                          <option value="all roles">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="approver">Approver</option>
                          <option value="engineer">Engineer</option>
                          <option value="user">User</option>
                        </select>
                      </form>
                    </div>
                    <div className="cell1">
                      <form onSubmit={handleSearchSubmit}>
                        <input
                          type="text"
                          id="searchInput"
                          name="searchInput"
                          placeholder="Search..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          style={{ width: 180 }}
                        />
                        <button type="submit" id="searchButton">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </table>
              </div>
              <div className="card shadow mb-4">
                <div className="card-body">
                  <div
                    className="table-responsive"
                    style={{ overflow: "auto" }}
                  >
                    <a className="scroll-to-top rounded" href="#page-top">
                      <i className="fas fa-angle-up" />
                    </a>

                    <table
                      className="table table-bordered"
                      id="Usertable"
                      width="100%"
                      cellSpacing={0}
                    >
                      <thead
                        style={{ backgroundColor: "#3c63e1", color: "white" }}
                      >
                        <tr>
                          <th>Sl.No</th>
                          <th>User Id</th>
                          <th>Username</th>
                          <th>Department</th>
                          <th>Designation</th>
                          <th>Plant</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td
                              className="UserStyle"
                              onClick={() => handleOpen(item)}
                            >
                              {item.Userid}
                            </td>
                            <td>{item.Username}</td>
                            <td>{item.Dept_name}</td>
                            <td>{item.Designation}</td>
                            <td>{item.Plant_name}</td>
                            <td>{item.User_role}</td>
                            <td>
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  paddingLeft: 0,
                                  color: "blue",
                                }}
                              >
                                <EditIcon
                                  baseclassname="fas"
                                  className="fa-plus-circle"
                                  sx={{ fontSize: 30 }}
                                  onClick={() => handleEditClick(item)}
                                />
                              </button>
                              <Modal
                                open={isEditModalOpen}
                                onClose={handleClose}
                              >
                                {editedUser && (
                                  <Fade in={isEditModalOpen}>
                                    <Box className="contact-modal2">
                                      <Typography
                                        variant="h4"
                                        style={{
                                          color: "white",
                                          background: "#3c63e1",
                                          textAlign: "center",
                                          borderTopLeftRadius: "10px",
                                          borderTopRightRadius: "10px",
                                        }}
                                      >
                                        User Details Modification
                                      </Typography>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-evenly",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div style={{ marginLeft: "10%" }}>
                                          <TextField
                                            label="User ID"
                                            multiline
                                            rows={1}
                                            value={editedUser}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                              width: "40%",
                                            }}
                                            onChange={handleUseridChange}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                          <TextField
                                            label="User Name"
                                            multiline
                                            rows={1}
                                            value={username}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                            onChange={handleUsernameChange}
                                          />
                                          <TextField
                                            label="Phone Number"
                                            multiline
                                            rows={1}
                                            value={phone}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                            onChange={handlePhoneChange}
                                          />
                                          <TextField
                                            label="Mail ID"
                                            multiline
                                            rows={1}
                                            value={mail}
                                            variant="outlined"
                                            onChange={handleMailChange}
                                            style={{
                                              margin: "1rem",
                                              cursor: "initial",
                                              width: "40%",
                                            }}
                                          />
                                        </div>
                                        <div style={{ marginLeft: "10%" }}>
                                          <FormControl
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                          >
                                            <InputLabel id="department-label">
                                              Department
                                            </InputLabel>
                                            <Select
                                              labelId="department-label"
                                              label="Department"
                                              value={department}
                                              onChange={handleDepartmentChange}
                                            >
                                              {departmentCodes.map(
                                                (code, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    value={code.Dept_name}
                                                  >
                                                    {code.Dept_code} -{" "}
                                                    {code.Dept_name}
                                                  </MenuItem>
                                                )
                                              )}
                                            </Select>
                                          </FormControl>
                                          <FormControl
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                          >
                                            <InputLabel id="plantname-label">
                                              Plant Name
                                            </InputLabel>
                                            <Select
                                              labelId="plantname-label"
                                              label="Plant Name"
                                              value={plantname}
                                              onChange={handlePlantnameChange}
                                            >
                                              {plantCodes.map((name, index) => (
                                                <MenuItem
                                                  key={index}
                                                  value={name.Plant_name}
                                                >
                                                  {name.Plant_code} -{" "}
                                                  {name.Plant_name}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                          <FormControl
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                          >
                                            <InputLabel id="designation-label">
                                              designation
                                            </InputLabel>
                                            <Select
                                              labelId="designation-label"
                                              label="Designation"
                                              value={designation}
                                              onChange={handleDesignationChange}
                                            >
                                              {designationCodes.map(
                                                (desig, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    defaultValue={designation}
                                                    value={desig.Designation}
                                                  >
                                                    {desig.Designation_id} -{" "}
                                                    {desig.Designation}
                                                  </MenuItem>
                                                )
                                              )}
                                            </Select>
                                          </FormControl>
                                          <FormControl
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "40%",
                                            }}
                                          >
                                            <InputLabel id="userrole-label">
                                              User Role
                                            </InputLabel>
                                            <Select
                                              labelId="userrole-label"
                                              label="User Role"
                                              value={userrole}
                                              onChange={handleUserroleChange}
                                            >
                                              <MenuItem value="user">
                                                User{" "}
                                              </MenuItem>
                                              <MenuItem value="approver">
                                                Approver{" "}
                                              </MenuItem>
                                              <MenuItem value="engineer">
                                                Engineer
                                              </MenuItem>
                                              <MenuItem value="admin">
                                                Admin
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        </div>
                                        <div></div>
                                      </div>
                                      <div className="d-flex flex-row justify-content-center">
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={handleClose}
                                          style={{
                                            backgroundColor: red[500],
                                            width: 3,
                                            marginRight: "1%",
                                          }}
                                        >
                                          Close
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={handleModificationSubmit}
                                          style={{
                                            backgroundColor: blue[500],
                                            width: 3,
                                            marginLeft: "1%",
                                          }}
                                        >
                                          Modify
                                        </Button>
                                      </div>
                                    </Box>
                                  </Fade>
                                )}
                              </Modal>
                            </td>

                            <Modal
                              open={open}
                              onClose={handleClose}
                              closeAfterTransition
                            >
                              {selectedUser && (
                                <Fade in={open}>
                                  <Box className="contact-modal1">
                                    <Typography
                                      variant="h4"
                                      style={{
                                        color: "white",
                                        background: "#3c63e1",
                                        textAlign: "center",
                                        borderTopLeftRadius: "10px",
                                        borderTopRightRadius: "10px",
                                      }}
                                    >
                                      User Details
                                    </Typography>
                                    <div>
                                      <hr style={{ border: "2 solid white" }} />
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                      }}
                                    >
                                      <div>
                                        <Typography
                                          variant="h6"
                                          style={{ textAlign: "left" }}
                                        >
                                          User Name
                                        </Typography>
                                        <Typography variant="h6">
                                          Phone Number
                                        </Typography>
                                        <Typography variant="h6">
                                          Mail Id
                                        </Typography>
                                        <Typography variant="h6">
                                          Department
                                        </Typography>
                                        <Typography variant="h6">
                                          Designation
                                        </Typography>
                                        <Typography variant="h6">
                                          Plant Name
                                        </Typography>
                                        <Typography variant="h6">
                                          User Role
                                        </Typography>
                                      </div>
                                      <div>
                                        <Typography variant="h6">
                                          : {username}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {phone}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {mail}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {department}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {designation}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {plantname}
                                        </Typography>
                                        <Typography variant="h6">
                                          : {userrole}
                                        </Typography>
                                      </div>
                                    </div>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      onClick={handleClose}
                                      style={{
                                        backgroundColor: red[500],
                                        width: 3,
                                        marginLeft: "45%",
                                      }}
                                    >
                                      Close
                                    </Button>
                                  </Box>
                                </Fade>
                              )}
                            </Modal>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Topbar1>
    </>
  );
};

export default Users1;
