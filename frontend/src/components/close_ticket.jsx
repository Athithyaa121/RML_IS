import React, { useEffect, useState } from "react";
import "../css/topbar1.css";
import "../css/tickets.css";
import "../vendor/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import {
  Modal,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import Topbar1 from "./topbar1";
import "../css/search_bar.css";

const Close_Ticket = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [assetid, setAssetid] = useState("");
  const [raisedby, setRaisedby] = useState([]);
  const [raisedOn, setRaisedon] = useState([]);
  const [servicetype, setServicetype] = useState([]);
  const [servicecategory, setServiceCategory] = useState([]);
  const [department, setDepartment] = useState([]);
  const [Problem, setProblem] = useState([]);
  const [attendedby, setAttendedby] = useState([]);
  const [date, setDate] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [status, setStatus] = useState("");
  const [rootCode, setRootCode] = useState([]);

  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const formattedDate = moment(date).format("DD-MM-YYYY");

  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedcurrnetdate = `${day}-${month}-${year}`;

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const filterData = () => {
    let filteredResults = data;

    if (filter !== "Status") {
      filteredResults = filteredResults.filter((item) => {
        return item.Ticket_status === filter;
      });
    }

    if (startDate && endDate) {
      filteredResults = filteredResults.filter((item) => {
        const itemDate = new Date(item.Created_on);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    if (searchInput) {
      filteredResults = filteredResults.filter((item) => {
        return (
          (item.Ticket_id && item.Ticket_id === parseInt(searchInput)) ||
          (item.Userid && item.Userid === parseInt(searchInput)) ||
          (item.Asset_id && item.Asset_id === parseInt(searchInput))
        );
      });
    }

    setFilteredData(filteredResults);
  };

  const handleOpen = (item) => {
    setSelectedTicket(item.Ticket_id);
    setAssetid(item.Asset_id);
    setDepartment(item.Dept_name);
    setProblem(item.Problem_description);
    setDate(item.Ticket_raise_date);
    setServiceCategory(item.Service_category);
    setServicetype(item.Service_category_type);
    setStatus(item.Ticket_status);
    setAttendedby(item.Engineer_name);
    setRaisedon(item.Close_date);
    setRaisedby(item.Username);
    setRootCause(item.Root_cause_name);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedTicket({});
    setOpen(false);
  };
  const Fade = ({ children, in: open }) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
    });

    return <animated.div style={style}>{children}</animated.div>;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    axios
      .get("http://localhost:3001/close_ticket")
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3001/fetch_Root")
      .then((response) => response.json())
      .then((data) => {
        setRootCode(data);
      })
      .catch((error) => console.error("Error fetching plant codes:", error));

    // Fetch data from the API endpoint
    axios
      .get("http://localhost:3001/close_ticket")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      id: selectedTicket,
      rootCause: rootCause,
      actionTaken: actionTaken,
      status: status,
    };

    axios
      .put(`http://localhost:3001/attend_ticket/${selectedTicket}`, updatedData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Optionally update your UI or perform any other actions
        window.alert("Ticket Updated");
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
  };

  return (
    <>
      <Topbar1>
        {/* Page Wrapper */}
        <div id="wrapper">
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-2 text-gray-800">Closing a Ticket</h1>
            {/* DataTales Example */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h4 className="m-0 font-weight-bold text-primary">
                  Ticket Filter
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
                        <label htmlFor="categoryFilter">Status </label>
                        <select
                          name="category"
                          id="categoryFilter"
                          value={filter}
                          onChange={handleFilterChange}
                          style={{ width: 180 }}
                        >
                          <option value="Status">Status</option>
                          <option value="H">Hold</option>
                          <option value="P">Pending</option>
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
                  <div className="table-responsive">
                    <table
                      className="table table-bordered"
                      id="dataTable"
                      width="100%"
                      cellSpacing={0}
                    >
                      <thead
                        style={{ backgroundColor: "#3c63e1", color: "white" }}
                      >
                        <tr>
                          <th>Sl.No</th>
                          <th>Ticket Id</th>
                          <th>Raised Date</th>
                          <th>Raised By</th>
                          <th>Attended On</th>
                          <th>Attended By</th>
                          <th>Status</th>
                          <th>Problem description</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={item.id}>
                            <td> {index + 1}</td>

                            <td>{item.Ticket_id}</td>
                            <td>
                              {moment(item.Ticket_raise_date).format(
                                "DD-MM-YYYY"
                              )}
                            </td>
                            <td>{item.Userid}</td>
                            <td>{item.Close_date}</td>
                            <td>{item.Engineer_id}</td>
                            <td>{item.Ticket_status}</td>
                            <td>{item.Problem_description}</td>
                            <td>
                              <Button
                                variant="text"
                                onClick={() => handleOpen(item)}
                              >
                                ATTEND
                              </Button>
                            </td>
                            <Modal
                              open={open}
                              onClose={handleClose}
                              style={{ backgroundColor: "rgb(0 0 0 / 13%)" }}
                            >
                              {selectedTicket && (
                                <Fade in={open}>
                                  <Box className="close_ticket_modal1">
                                    <div>
                                      <Typography
                                        variant="h4"
                                        style={{
                                          color: "white",
                                          background: "#3c63e1",
                                          textAlign: "center",
                                        }}
                                      >
                                        Ticket Closure
                                      </Typography>
                                      <IconButton
                                        style={{
                                          position: "absolute",
                                          top: 5,
                                          right: 5,
                                          color: "white",
                                        }}
                                        onClick={handleClose}
                                        aria-label="Close"
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </div>

                                    <div className="details">
                                      <div className="section">
                                        <div>
                                          <TextField
                                            label="Asset ID"
                                            multiline
                                            rows={1}
                                            value={assetid}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                          <TextField
                                            label="Raised On"
                                            multiline
                                            rows={1}
                                            value={formattedDate}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                          <TextField
                                            label="Raised By"
                                            multiline
                                            rows={1}
                                            value={raisedby}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <TextField
                                            label="Department"
                                            multiline
                                            rows={1}
                                            value={department}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                          <TextField
                                            label="Service Type"
                                            multiline
                                            rows={1}
                                            value={servicetype}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                          <TextField
                                            label="Service Category"
                                            multiline
                                            rows={1}
                                            value={servicecategory}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <TextField
                                            label="Problem Description"
                                            multiline
                                            rows={2}
                                            value={Problem}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                              width: "95%",
                                              marginBottom: "2%",
                                              marginTop: "1%",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                        </div>

                                        <div className="vertical-line"></div>

                                        <div>
                                          <TextField
                                            label="Attended By:"
                                            multiline
                                            rows={1}
                                            value={attendedby}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />

                                          <TextField
                                            label="Date:"
                                            multiline
                                            rows={1}
                                            value={formattedcurrnetdate}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              pointerEvents: "none",
                                              cursor: "initial",
                                            }}
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                          />

                                          <FormControl
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",
                                              width: "28%",
                                            }}
                                          >
                                            <InputLabel id="Root cause">
                                              Root cause
                                            </InputLabel>
                                            <Select
                                              label="Root cause"
                                              id="rootCause"
                                              value={rootCause}
                                            >
                                              {rootCode &&
                                                rootCode.map((code, index) => (
                                                  <option
                                                    key={index}
                                                    value={code.Root_cause_id}
                                                  >
                                                    {code.Root_cause_name}
                                                  </option>
                                                ))}
                                            </Select>
                                          </FormControl>
                                        </div>
                                        <div>
                                          <TextField
                                            label="Action Taken:"
                                            multiline
                                            rows={2}
                                            value={actionTaken}
                                            variant="outlined"
                                            style={{
                                              margin: "1rem",                                              
                                              width: "95%",
                                              marginBottom: "2%",
                                              marginTop: "1%",
                                            }}
                                            
                                          />
                                        </div>
                                        <div
                                          className="row1"
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginLeft: "2%",
                                          }}
                                        >
                                          <label>Status:</label>
                                          <div>
                                            <input
                                              type="radio"
                                              id="statusOpen"
                                              name="status"
                                              value="H"
                                              checked={status === "H"}
                                              onChange={handleChange}
                                            />
                                            <label
                                              htmlFor="statusOpen"
                                              style={{ marginLeft: 20 }}
                                            >
                                              Hold
                                            </label>
                                            <input
                                              type="radio"
                                              id="statusClosed"
                                              name="status"
                                              value="C"
                                              checked={status === "C"}
                                              onChange={handleChange}
                                            />
                                            <label
                                              htmlFor="statusClosed"
                                              style={{ marginLeft: 20 }}
                                            >
                                              Closed
                                            </label>
                                          </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                          <button
                                            className="btn btn-success"
                                            onClick={handleSubmit}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </div>
                                    </div>
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

export default Close_Ticket;
