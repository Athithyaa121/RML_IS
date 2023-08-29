import React, { useEffect, useState,forwardRef } from 'react';
import axios from 'axios';
import { Modal, Typography, Box, Backdrop, IconButton, TextField } from '@mui/material';
import '../css/topbar1.css';
import '../css/asset_approval.css';
import { useSpring, animated } from 'react-spring';
import '../vendor/fontawesome-free/css/all.min.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import Topbar1 from './topbar1';

const Asset_approval = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAsset, setSelectedAsset] = useState({});
  const [assettype, setAssettype] = useState([]);
  const [make, setMake] = useState([]);
  const [model, setModel] = useState([]);
  const [mso, setMso] = useState([]);
  const [userid, setUserid] = useState([]);
  const [userdept, setUserDept] = useState([]);
  const [serialno, setSerialno] = useState([]);
  const [hostname, setHostname] = useState([]);
  const [key, setKey] = useState([]);
  const [dateofinstall, setDateofinstall] = useState([]);
  const [os, setOs] = useState([]);
  const [username, setUsername] = useState([]);
  const [warranty, setWarranty] = useState([]);
  const [ip, setIp] = useState([]);
  const [reason, setReason] = useState([]);
  const [status, setStatus] = useState([]);
  const formattedDoi = moment(dateofinstall).format('DD-MM-YYYY');
  const formattedWarranty = moment(warranty).format('DD-MM-YYYY');


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

    filterData()
  };

  const filterData = () => {
    let filteredResults = data;

    if (filter !== 'Status') {
      filteredResults = filteredResults.filter((item) => {
        return item.Asset_status === filter;
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
          (item.Asset_id && item.Asset_id === parseInt(searchInput)) ||
          (item.Asset_type && item.Asset_type.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Asset_host_name && item.Asset_host_name.toLowerCase().includes(searchInput.toLowerCase()))
          (item.Asset_date_of_installation && item.Asset_date_of_installation.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Asset_make && item.Asset_make.toLowerCase().includes(searchInput.toLowerCase()))
          (item.Userid && item.Userid.toLowerCase().includes(searchInput.toLowerCase()))
        );
      });
    }

    setFilteredData(filteredResults);
  };

  const handleOpen = (item) => {
    setSelectedAsset(item.Asset_id);
    setAssettype(item.Asset_type);
    setMake(item.Asset_make);
    setModel(item.Asset_model);
    setMso(item.Asset_mso_version);
    setUserid(item.Userid);
    setUserDept(item.Dept_name);
    setSerialno(item.Asset_sl_no);
    setHostname(item.Asset_host_name);
    setKey(item.Asset_specification);
    setDateofinstall(item.Asset_date_of_installation);
    setOs(item.Asset_os);
    setUsername(item.Username);
    setWarranty(item.Asset_warranty_end_date);
    setIp(item.Asset_ip);
    setStatus(item.Asset_status);
    setReason(item.Asset_remarks)
    setOpen(true);
  }
  const handleOpen1 = (item) => {
    setEmail(email); // Update email state
    setMessage(message); // Update message state
    setOpen1(true);
  };
  const handleClose = () => {
    setSelectedAsset({});
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handlesend = () => {
    if (selectedAsset && message) {
    // Make an API call to your backend to send the email
    axios.post('http://localhost:3001/send_email', { message })
      .then((response) => {
        console.log('Email sent successfully:', response.data);
        // Add any additional logic you want after a successful email send
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        // Handle any error that occurred while sending the email
      });
    }
    setOpen1(false);
  };

  const handleApprove = (id) => {

    axios
      .put(`http://localhost:3001/assetApprove/${id}`)
      .then((response) => {

        fetchAssets()
        console.log(response.data);
        window.alert('Asset Approved')// Optional: Handle success response
        // Optionally update your UI after successful deletion (e.g., fetch updated data)
      })
      .catch((error) => {
        console.error(error); // Optional: Handle error response
      });

    setSelectedAsset({});
    setOpen(false);

  }

  const Fade = forwardRef(({ children, in: open }, ref) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
    });
  
    return (
      <animated.div ref={ref} style={style}>
        {children}
      </animated.div>
    );
  });

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/asset_approval')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    axios.get('http://localhost:3001/asset_approval')
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
          <h1 className="h3 mb-2 text-gray-800">Assets</h1>
          {/* DataTales Example */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h4 className="m-0 font-weight-bold text-primary">
                List of modified assets
              </h4>
              <table className="filter-table">
                <tbody>
                  <tr>
                    <td className="right">
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
                        <div className="cell1" >
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
                              <option value="Live">Live</option>
                              <option value="New">New</option>
                              <option value="Scrap">Scrap</option>
                              <option value="Standby">Standby</option>
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <thead style={{ backgroundColor: "#3c63e1", color: "white" }}>
                <tr>
                  <th>Sl.No</th>
                  <th>Asset Id</th>
                  <th>Type</th>
                  <th>Host</th>
                  <th>Date of Installation</th>
                  <th>Make</th>
                  <th>User id</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.Asset_id}</td>
                    <td>{item.Asset_type}</td>
                    <td>{item.Asset_host_name}</td>
                    <td>{moment(item.Asset_date_of_installation).format("DD-MM-YYYY")}</td>
                    <td>{item.Asset_make}</td>
                    <td>{item.Userid}</td>
                    <td>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          paddingLeft: 0,
                          color: "blue"
                        }}
                      >
                        <VisibilityOutlinedIcon onClick={() => handleOpen(item)}></VisibilityOutlinedIcon>
                      </button>
                    </td>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      // closeAfterTransition
                      // BackdropComponent={Backdrop}
                      // BackdropProps={{
                      //   timeout: 500,
                      // }}
                    >
                      {selectedAsset && (
                        <Fade in={open}>
                          <Box className='asset_approval_modal1'>
                            <Typography variant="h4" style={{ color: 'white', background: '#3c63e1', textAlign: 'center', marginTop: "2%",marginBottom:"4%" }}>
                              Approval of Asset
                            </Typography>
                            <IconButton
                              style={{ position: 'absolute', top: 5, right: 5, color: 'blue' }} onClick={handleClose}
                              aria-label="Close"
                            >
                              <CloseIcon />
                            </IconButton>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                              <div>
                                <TextField
                                  label="Asset ID"
                                  multiline
                                  rows={1}
                                  value={selectedAsset}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Make"
                                  multiline
                                  rows={1}
                                  value={make}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Model"
                                  multiline
                                  rows={1}
                                  value={model}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Asset type"
                                  multiline
                                  rows={1}
                                  value={assettype}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </div>
                              <div>
                                <TextField
                                  label="User ID"
                                  multiline
                                  rows={1}
                                  value={userid}
                                  variant="outlined"
                                  style={{ margin: '1rem' }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Username"
                                  multiline
                                  rows={1}
                                  value={username}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Department"
                                  multiline
                                  rows={1}
                                  value={userdept}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Host Name"
                                  multiline
                                  rows={1}
                                  value={hostname}
                                  variant="outlined"
                                  style={{ margin: '1rem' }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </div>
                              <div>
                                <TextField
                                  label="MS Office Version"
                                  multiline
                                  rows={1}
                                  value={mso}
                                  variant="outlined"
                                  style={{ margin: '1rem' }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Key Specification"
                                  multiline
                                  rows={1}
                                  value={key}
                                  variant="outlined"
                                  style={{ margin: '1rem' }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Date of Installation"
                                  multiline
                                  rows={1}
                                  value={formattedDoi}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Operating System"
                                  multiline
                                  rows={1}
                                  value={os}
                                  variant="outlined"
                                  style={{ margin: '1rem' }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </div>
                              <div>
                                <TextField
                                  label="IP No"
                                  multiline
                                  rows={1}
                                  value={ip}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Serial No"
                                  multiline
                                  rows={1}
                                  value={serialno}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Warranty End Date"
                                  multiline
                                  rows={1}
                                  value={formattedWarranty}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
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
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </div>
                              <div>
                                <TextField
                                  label="Reason for Modification"
                                  multiline
                                  rows={2}
                                  value={reason}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial", width: "55%", marginLeft: "20%", marginBottom: "2%", marginTop: "1%" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: "1%" }}>
                                  <button
                                    className="btn btn-success"
                                    onClick={() => handleApprove(selectedAsset)}
                                    style={{ marginRight: '10px' }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleOpen1(selectedAsset)}
                                  >
                                    Raise a Query
                                  </button>
                                  <Modal
                                    open={open1}
                                    onClose={handleClose1}
                                  >
                                    {selectedAsset && (
                                      <Fade in={open1}>
                                        <Box className='asset_approval_modal2'>
                                          <Typography variant="h4" style={{ color: 'white', background: '#3c63e1', textAlign: 'center', marginTop: "3%" }}>
                                            Raise a Query
                                          </Typography>
                                          
                                          <TextField
                                            label="Message"
                                            multiline
                                            rows={3}
                                            value={message}
                                            variant="outlined"
                                            style={{ margin: '2rem', marginBottom: "2%", marginTop: "1%" }}
                                            onChange={(e) => setMessage(e.target.value)}
                                          />
                                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop: "1%", marginBottom: "1%" }}>
                                          <button
                                            className="btn btn-success"
                                            onClick={handlesend}
                                            style={{ marginRight: '10px' }}
                                          >
                                            Send
                                          </button>
                                          <button
                                            className="btn btn-danger"
                                            onClick={handleClose1}
                                          >
                                            Close
                                          </button>     
                                          </div>                                   
                                          </Box>
                                      </Fade>
                                    )}
                                  </Modal>
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
      </Topbar1>
    </>
  );
};

export default Asset_approval;
