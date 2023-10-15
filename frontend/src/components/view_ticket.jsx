import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import "../css/topbar1.css";
import { Modal, Button, Typography, Box, TextField } from "@mui/material";
import { useSpring, animated } from "react-spring";
import { red } from "@mui/material/colors";
import moment from "moment";
import Topbar1 from "./topbar1";
import "../css/tickets.css";
import "../css/search_bar.css";

const View_Ticket = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [problem, setProblem] = useState("");
  const [ticketid, setTicketid] = useState("");
  const [date, setDate] = useState("");
  const [plantcode, setPlantCode] = useState([]);
  const [username, setUsername] = useState([]);
  const [userid, setUserid] = useState([]);
  const [product, setProduct] = useState([]);
  const [servicetype, setServicetype] = useState([]);
  const [servicecategory, setServiceCategory] = useState([]);
  const [status, setStatus] = useState([]);
  const [rootcause, setRootcause] = useState([]);
  const [engineerid, setEngineerid] = useState([]);
  const [attendedby, setAttendedby] = useState([]);
  const [attendedOn, setAttendedon] = useState([]);

  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const formattedDate = moment(date).format("DD-MM-YYYY");
  const formattedAo = moment(attendedOn).format("DD-MM-YYYY");
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

  const filterData = () => {
    let filteredResults = data;

    if (filter !== "Status") {
      filteredResults = filteredResults.filter((item) => {
        return item.Ticket_status === filter;
        // return item.Asset_status.toLowerCase().includes(filter) ;
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
        // Assuming the columns to be searched are 'Username', 'Department', and 'Plant_name'
        return (
          (item.Ticket_id && item.Ticket_id === parseInt(searchInput)) ||
          (item.Userid && item.Userid === parseInt(searchInput)) ||
          (item.Engineer_id && item.Engineer_id === parseInt(searchInput)) ||
          (item.Asset_id && item.Asset_id === parseInt(searchInput)) ||
          (item.Service_category &&
            item.Service_category.toLowerCase().includes(
              searchInput.toLowerCase()
            ))
          // (item.Dept_name && item.Dept_name.toLowerCase().includes(searchInput.toLowerCase())) ||
          // (item.Asset_sl_no && item.Asset_sl_no.toLowerCase().includes(searchInput.toLowerCase()))
        );
      });
    }

    setFilteredData(filteredResults);
  };

  const handleOpen = (item) => {
    setSelectedTicket(item.Ticket_id);
    setTicketid(item.Ticket_id);
    setProblem(item.Problem_description);
    setDate(item.date);
    setPlantCode(item.Plant_code);
    setUsername(item.Username);
    setUserid(item.Userid);
    setProduct(item.Product_name);
    setServiceCategory(item.Service_category);
    setServicetype(item.Service_category_type);
    setRootcause(item.Root_cause_name);
    setStatus(item.Ticket_status);
    setEngineerid(item.Engineer_id);
    setAttendedby(item.Engineer_name);
    setAttendedon(item.Close_date);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedTicket({});
    setOpen(false);
  };

  const Fade = forwardRef(({ children, in: open }, ref) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
    });

    return <animated.div style={style}>{children}</animated.div>;
  });

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get(`http://localhost:3001/view_ticket`)
      .then((response1) => {
        setData(response1.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    axios
      .get("http://localhost:3001/view_ticket")
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error(error);
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
            <h1 className="h3 mb-2 text-gray-800">Ticket</h1>
            {/* DataTales Example */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h4 className="m-0 font-weight-bold text-primary">
                  View Ticket Details
                </h4>
                <table className="filter-table">
                  <div className="rectangle">
                    <div className="cell ">
                      <form>
                        <label htmlFor="startDateInput">From</label>
                        <input
                          type="date"
                          id="startDateInput"
                          name="startDateInput"
                          value={startDate}
                          style={{ width: 150 }}
                          onChange={handleStartDateChange}
                        />
                      </form>
                    </div>
                    <div className="cell">
                      <form>
                        <label htmlFor="endDateInput">To</label>
                        <input
                          type="date"
                          id="endDateInput"
                          name="endDateInput"
                          value={endDate}
                          style={{ width: 150 }}
                          onChange={handleEndDateChange}
                        />
                      </form>
                    </div>

                    <div className="cell">
                      <form id="filterForm">
                        <label htmlFor="categoryFilter">Status </label>
                        <select
                          name="category"
                          id="categoryFilter"
                          value={filter}
                          onChange={handleFilterChange}
                          style={{ width: 150 }}
                        >
                          <option value="Status">Status</option>
                          <option value="C">Completed</option>
                          <option value="H">Hold</option>
                          <option value="P">Pending</option>
                        </select>
                      </form>
                    </div>
                    <div className="cell">
                      <form onSubmit={handleSearchSubmit}>
                        <input
                          type="text"
                          id="searchInput"
                          name="searchInput"
                          placeholder="Search..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          style={{ width: 150 }}
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
                        style={{ backgroundColor: "#3c53e1", color: "white" }}
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
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={index}>
                            <td> {index + 1}</td>
                            <td
                              className="ticketIdStyle"
                              onClick={() => handleOpen(item)}
                            >
                              {item.Ticket_id}
                            </td>
                            <td>
                              {moment(item.Ticket_raise_date).format(
                                "DD-MM-YYYY"
                              )}
                            </td>
                            <td>{item.Userid}</td>
                            <td>{item.Close_date}</td>
                            <td>{item.Engineer_name}</td>
                            <td>{item.Ticket_status}</td>
                            <td>{item.Problem_description}</td>

                            <Modal
                              open={open}
                              onClose={handleClose}
                              // closeAfterTransition
                              // BackdropComponent={Backdrop}
                              // BackdropProps={{
                              //   timeout: 500,
                              // }}
                            >
                              {selectedTicket && (
                                <Fade in={open}>
                                  <Box className="view_ticket_modal1">
                                    <Typography
                                      variant="h4"
                                      style={{
                                        color: "white",
                                        background: "#3c63e1",
                                        textAlign: "center",
                                      }}
                                    >
                                      Ticket Details
                                    </Typography>
                                    <div className="details">
                                      <div
                                        className="section"
                                        style={{
                                          marginLeft: "5%",
                                          padding: 10,
                                        }}
                                      >
                                        <div className="row1">
                                          <label htmlFor="assetId">
                                            Ticket ID:
                                          </label>
                                          <input
                                            type="text"
                                            id="assetId"
                                            value={item.Ticket_id}
                                            readOnly
                                          />
                                        </div>
                                        <div className="row1">
                                          <label htmlFor="assetId">
                                            Plant Code:
                                          </label>
                                          <input
                                            type="text"
                                            id="assetId"
                                            value={plantcode}
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                      <div
                                        className="section"
                                        style={{
                                          marginRight: "10%",
                                          padding: 10,
                                        }}
                                      >
                                        <div className="row1">
                                          <label htmlFor="department">
                                            User ID:
                                          </label>
                                          <input
                                            type="text"
                                            id="department"
                                            value={userid}
                                            readOnly
                                          />
                                        </div>
                                        <div className="row1">
                                          <label htmlFor="problemDescription">
                                            User Name:
                                          </label>
                                          <input
                                            type="text"
                                            id="department"
                                            value={username}
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <hr></hr>
                                    </div>

                                    <div>
                                      <TextField
                                        label="Date:"
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
                                        label="Product"
                                        multiline
                                        rows={1}
                                        value={product}
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
                                        label="Status"
                                        multiline
                                        rows={1}
                                        value={status}
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
                                        label="Root Cause"
                                        multiline
                                        rows={1}
                                        value={rootcause}
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
                                      <TextField
                                        label="Attended By"
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
                                        label="Attended On"
                                        multiline
                                        rows={1}
                                        value={formattedAo}
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
                                    <div style={{ marginLeft: "24.5%" }}>
                                      <TextField
                                        label="Engineer ID"
                                        multiline
                                        rows={1}
                                        value={engineerid}
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
                                        label="Problem Description"
                                        multiline
                                        rows={1}
                                        value={problem}
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

export default View_Ticket;
