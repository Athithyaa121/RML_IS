import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Modal, Button, Typography, Box, Backdrop, TextField } from '@mui/material';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
import { blue } from '@mui/material/colors';
import moment from 'moment';
import '../css/asset_list.css';
import * as XLSX from 'xlsx';
import Topbar1 from './topbar1';

const Asset_list = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [assettype, setAssettype] = useState([]);
  const [make, setMake] = useState([]);
  const [model, setModel] = useState([]);
  const [pono, setPono] = useState([]);
  const [invoiceno, setInvoiceno] = useState([]);
  const [mso, setMso] = useState([]);
  const [userid, setUserid] = useState([]);
  const [userdept, setUserDept] = useState([]);
  const [serialno, setSerialno] = useState([]);
  const [hostname, setHostname] = useState([]);
  const [key, setKey] = useState([]);
  const [dateofinstall, setDateofinstall] = useState([]);
  const [podate, setPodate] = useState([]);
  const [invoicedate, setInvoicedate] = useState([]);
  const [os, setOs] = useState([]);
  const [username, setUsername] = useState([]);
  const [warranty, setWarranty] = useState([]);
  const [ip, setIp] = useState([]);
  const [status, setStatus] = useState([]);
  const [remarks, setRemarks] = useState([]);


  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [editedAsset, setEditedAsset] = React.useState({});




  const [filter, setFilter] = useState('Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const formattedDoi = moment(dateofinstall).format('DD-MM-YYYY');
  const formattedPo = moment(podate).format('DD-MM-YYYY');
  const formattedInvoice = moment(invoicedate).format('DD-MM-YYYY');
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

  const AMstyle = {
    margin: '1rem',
    pointerEvents: 'none',
    cursor: 'initial'
  };

  const AMstyle1 = {
    margin: '1rem',
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
          (item.Username && item.Username.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Dept_name && item.Dept_name.toLowerCase().includes(searchInput.toLowerCase())) ||
          (item.Asset_sl_no && item.Asset_sl_no.toLowerCase().includes(searchInput.toLowerCase()))
          // (item.Designation && item.Designation.toLowerCase().includes(searchInput.toLowerCase()))

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
    setPono(item.Asset_po_no);
    setInvoiceno(item.Asset_invoice_no);
    setMso(item.Asset_mso_version);
    setUserid(item.Userid);
    setUserDept(item.Dept_name);
    setSerialno(item.Asset_sl_no);
    setHostname(item.Asset_host_name);
    setKey(item.Asset_specification);
    setDateofinstall(item.Asset_date_of_installation);
    setPodate(item.Asset_po_date);
    setInvoicedate(item.Asset_invoice_date);
    setOs(item.Asset_os);
    setUsername(item.Username);
    setWarranty(item.Asset_warranty_end_date);
    setIp(item.Asset_ip);
    setStatus(item.Asset_status);
    setOpen(true);
  }

  const handleEditClick = (item) => {
    setEditedAsset(item.Asset_id);
    setAssettype(item.Asset_type);
    setMake(item.Asset_make);
    setModel(item.Asset_model);
    setPono(item.Asset_po_no);
    setInvoiceno(item.Asset_invoice_no);
    setMso(item.Asset_mso_version);
    setUserid(item.Userid);
    setUserDept(item.Dept_name);
    setSerialno(item.Asset_sl_no);
    setHostname(item.Asset_host_name);
    setKey(item.Asset_specification);
    setDateofinstall(item.Asset_date_of_installation);
    setPodate(item.Asset_po_date);
    setInvoicedate(item.Asset_invoice_date);
    setOs(item.Asset_os);
    setUsername(item.Username);
    setWarranty(item.Asset_warranty_end_date);
    setIp(item.Asset_ip);
    setStatus(item.Asset_status);
    setRemarks(item.Asset_remarks);
    setEditModalOpen(true);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };


  const handleAssettypeChange = (event) => {
    setAssettype(event.target.value);
  }

  const handleMakeChange = (event) => {
    setMake(event.target.value);
  }

  const handleModelChange = (event) => {
    setModel(event.target.value);
  }


  const handlePonoChange = (event) => {
    setPono(event.target.value);
  }

  const handleMsoChange = (event) => {
    setMso(event.target.value);
  }

  const handleUseridChange = (event) => {
    setUserid(event.target.value);
  }

  const handleSerialnoChange = (event) => {
    setSerialno(event.target.value);
  }

  const handleHostnameChange = (event) => {
    setHostname(event.target.value);
  }

  const handleDateofinstallChange = (event) => {
    setDateofinstall(event.target.value);
  }

  const handlePodateChange = (event) => {
    setPodate(event.target.value);
  }

  const handleInvoicedateChange = (event) => {
    setInvoicedate(event.target.value);
  }

  const handleOsChange = (event) => {
    setOs(event.target.value);
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handleWarrantyChange = (event) => {
    setWarranty(event.target.value);
  }

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  }

  const handleIpChange = (event) => {
    setIp(event.target.value);
  }

  const handleUserdeptChange = (event) => {
    setUserDept(event.target.value);
  }

  const handleInvoicenoChange = (event) => {
    setInvoiceno(event.target.value);
  }

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  }


  const handleModificationSubmit = () => {

    if (((userid === '' && status !== 'Scrap') || (userid !== '' && status === 'Scrap')) || !ip || !mso || !hostname || !key || !os) {

      window.alert('Fill in the required fields correctly.');
      return;
    }

    if (status === 'New') {
      // Check if the status is "New"
      window.alert('Status cannot be "New".');
      return;
    }

    if (status !== 'Scrap' && !userid) {
      // Check if the status is not "Scrap" and userid is empty
      window.alert('User ID is a required field for non-"Scrap" assets.');
      return;
    }

    const updatedData = {
      id: editedAsset,
      type: assettype,
      make: make,
      model: model,
      pono: pono,
      mso: mso,
      userid: userid,
      serialno: serialno,
      host: hostname,
      doi: dateofinstall,
      podate: podate,
      invoicedate: invoicedate,
      os: os,
      username: username,
      warranty: warranty,
      ip: ip,
      dept: userdept,
      invoiceno: invoiceno,
      key: key,
      remarks: remarks,
      status: status
    };

    axios
      .put(`http://localhost:3001/modifyAsset/${editedAsset}`, updatedData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Optionally update your UI or perform any other actions
        window.alert('Plant updated successfully');
        handleClose();
        fetchAssets();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });

  };



  //User Modification

  useEffect(() => {
    if (userid) {
      fetchData();
    }
  }, [userid]);

  const fetchData = () => {
    axios
      .get(`http://localhost:3001/username?userid=${userid}`)
      .then((response) => {
        setUsername(response.data[0].Username);
        setUserDept(response.data[0].Dept_name)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };





  const handleClose = () => {
    setSelectedAsset({});
    setOpen(false);
    setEditModalOpen(false);
    setEditedAsset({});
  };


  const Fade = React.forwardRef(({ children, in: open }, ref) => {
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
      .get('http://localhost:3001/asset_list')
      .then((response) => {
        const { response1, response2 } = response.data;

        const dataFromResponse1 = response1;
        const dataFromResponse2 = response2;

        const combinedData = [...dataFromResponse1, ...dataFromResponse2];

        setData(combinedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    axios.get('http://localhost:3001/asset_list')
      .then((response) => {

        const { response1, response2 } = response.data;

        const dataFromResponse1 = response1;
        const dataFromResponse2 = response2;

        const combinedData = [...dataFromResponse1, ...dataFromResponse2];

        setFilteredData(combinedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  // EXCEL EXPORTING



  function exportToExcel() {
    // Get the table element
    const table = document.getElementById('Assettable');

    // Get the number of columns in the table
    const columnCount = table.rows[0].cells.length;

    // Exclude the last column from the table
    const columnRange = [0, columnCount - 2]; // Exclude the last column

    // Convert the specified range of the table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table, { range: columnRange });

    // Remove the last column header from the worksheet
    const lastColumnHeader = XLSX.utils.encode_cell({ r: 0, c: columnCount - 1 });
    delete worksheet[lastColumnHeader];

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the file
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const excelUrl = URL.createObjectURL(excelData);
    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = 'Assets.xlsx';
    link.click();
  }


  return (
    <>
    <Topbar1>
      <div id="wrapper">
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <h1 className="h3 mb-2 text-gray-800">Assets
            <a
              href="#"
              className="d-none d-sm-inline-block btn btn-sm btn-success shadow float-right"
            >
              <button
                style={{ fontWeight: "bold", marginRight: 10, background: "transparent", border: "none", color: "white" }}
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
                View Assets
                <Link to="/asset_add">
                  <button
                    type="button"
                    className="btn btn-primary float-right"

                  >
                    Add Asset
                  </button>
                </Link>
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
              id="Assettable"
              width="100%"
              cellSpacing={0}
            >
              <thead style={{ backgroundColor: "#3c63e1", color: "white" }}>
                <tr>
                  <th>Sl.No</th>
                  <th>Asset Id</th>
                  <th>Serial No</th>
                  <th>Host</th>
                  <th>Username</th>
                  <th>User Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td> {index + 1}</td>
                    <td className='AssetIdStyle' onClick={() => handleOpen(item)}>{item.Asset_id}</td>
                    <td>{item.Asset_sl_no}</td>
                    <td>{item.Asset_host_name}</td>
                    <td>{item.Username}</td>
                    <td>{item.Dept_name}</td>
                    <td>{item.Asset_status}</td>
                    <td>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          paddingLeft: 0,
                          color: "blue"
                        }}
                      >
                        <EditIcon baseclassname="fas" className="fa-plus-circle" sx={{ fontSize: 30 }} onClick={() => handleEditClick(item)} />
                      </button>
                      <Modal
                        open={isEditModalOpen}
                        onClose={handleClose}                  
                      >
                        {editedAsset && (
                          <Fade in={isEditModalOpen}>
                            <Box className='asset_list_modal2'>
                              <Typography variant="h4" style={{ color: 'white', background: '#3c63e1', textAlign: 'center' }}>
                                Asset Modification
                              </Typography>


                              <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>


                                <div>
                                  {/* Asset details */}
                                  <TextField
                                    label="Asset Type"
                                    multiline
                                    rows={1}
                                    value={assettype}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handleAssettypeChange}
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
                                    style={AMstyle}
                                    onChange={handleSerialnoChange}
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
                                    style={AMstyle}
                                    onChange={handleMakeChange}
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
                                    style={AMstyle}
                                    onChange={handleModelChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />



                                </div>




                                {/* Fourth column */}
                                <div>
                                  {/* Additional information text areas */}

                                  <TextField
                                    label="PO No"
                                    multiline
                                    rows={1}
                                    value={pono}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handlePonoChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                  <TextField
                                    label="PO Date"
                                    multiline
                                    rows={1}
                                    value={formattedPo}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handlePodateChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />

                                  <TextField
                                    label="Invoice No"
                                    multiline
                                    rows={1}
                                    value={invoiceno}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handleInvoicenoChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />

                                  <TextField
                                    label="Invoice Date"
                                    multiline
                                    rows={1}
                                    value={formattedInvoice}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handleInvoicedateChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />


                                </div>
                                <div>

                                  <TextField
                                    label="Operating System"
                                    multiline
                                    rows={1}
                                    value={os}
                                    variant="outlined"
                                    style={AMstyle1}
                                    onChange={handleOsChange}
                                  />

                                  <TextField
                                    label="Key Specification"
                                    multiline
                                    rows={1}
                                    value={key}
                                    variant="outlined"
                                    style={AMstyle1}
                                    onChange={handleKeyChange}
                                  />

                                  <TextField
                                    label="Warranty End Date"
                                    multiline
                                    rows={1}
                                    value={formattedWarranty}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handleWarrantyChange}
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
                                    style={AMstyle}
                                    onChange={handleDateofinstallChange}
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
                                    style={AMstyle1}
                                    onChange={handleMsoChange}
                                  />

                                  <TextField
                                    label="Department"
                                    multiline
                                    rows={1}
                                    value={userdept}
                                    variant="outlined"
                                    style={AMstyle}
                                    onChange={handleUserdeptChange}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                  />
                                  <TextField
                                    label="User ID"
                                    multiline
                                    rows={1}
                                    value={userid}
                                    variant="outlined"
                                    style={AMstyle1}
                                    onChange={handleUseridChange}
                                  />
                                  <TextField
                                    label="Username"
                                    multiline
                                    rows={1}
                                    value={username}
                                    variant="outlined"
                                    onChange={handleUsernameChange}
                                    style={AMstyle}
                                    InputProps={{
                                      readOnly: true,
                                    }}

                                  />


                                </div>

                                <div  >

                                  <TextField
                                    label="IP No"
                                    multiline
                                    rows={1}
                                    value={ip}
                                    variant="outlined"
                                    style={AMstyle1}
                                    onChange={handleIpChange}

                                  />

                                  <TextField
                                    label="Host Name"
                                    multiline
                                    rows={1}
                                    value={hostname}
                                    variant="outlined"
                                    style={AMstyle1}
                                    onChange={handleHostnameChange}
                                  />


                                  <TextField
                                    label="Remarks"
                                    multiline
                                    rows={1}
                                    value={remarks}
                                    variant="outlined"
                                    style={{ margin: '1rem', width: 'calc(2 * 200px)' }}
                                    onChange={handleRemarksChange}


                                  />

                                  <FormControl component="fieldset" style={{ marginLeft: '300px', marginTop: '1em' }}>
                                    <FormLabel component="legend" style={{ textAlign: "center" }}>Status</FormLabel>
                                    <RadioGroup row aria-label="status" name="status" value={status} onChange={handleStatusChange}>
                                      <FormControlLabel disabled value="New" control={<Radio />} label="New" />
                                      <FormControlLabel value="Live" control={<Radio />} label="Live" />
                                      <FormControlLabel value="Standby" control={<Radio />} label="Standby" />
                                      <FormControlLabel value="Scrap" control={<Radio />} label="Scrap" />
                                    </RadioGroup>
                                  </FormControl>
                                </div>

                              </div>
                              <div className='d-flex flex-row justify-content-center'>

                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={handleClose}
                                  style={{ backgroundColor: red[500], width: 3, marginRight: "1%" }}
                                >Close</Button>
                                <Button

                                  variant="contained"
                                  color="error"
                                  onClick={handleModificationSubmit}
                                  style={{ backgroundColor: blue[500], width: 3, marginLeft: "1%" }}
                                >Modify</Button>
                              </div>

                            </Box>
                          </Fade>
                        )}
                      </Modal>

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
                          <Box className='asset_list_modal1'>
                            <Typography variant="h4" style={{ color: 'white', background: '#3c63e1', textAlign: 'center' }}>
                              IT Asset Details
                            </Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                              <div>
                                {/* Asset details */}
                                <TextField
                                  label="Asset Type"
                                  multiline
                                  rows={1}
                                  value={assettype}
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
                              </div>
                              <div>
                                <TextField
                                  label="PO No"
                                  multiline
                                  rows={1}
                                  value={pono}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="PO Date"
                                  multiline
                                  rows={1}
                                  value={formattedPo}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Invoice No"
                                  multiline
                                  rows={1}
                                  value={invoiceno}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Invoice Date"
                                  multiline
                                  rows={1}
                                  value={formattedInvoice}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />

                              </div>
                              <div>

                                <TextField
                                  label="Operating System"
                                  multiline
                                  rows={1}
                                  value={os}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
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
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
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

                              </div>
                              <div>

                                <TextField
                                  label="MS Office Version"
                                  multiline
                                  rows={1}
                                  value={mso}
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
                                  label="User ID"
                                  multiline
                                  rows={1}
                                  value={userid}
                                  variant="outlined"
                                  style={{ margin: '1rem', pointerEvents: "none", cursor: "initial" }}
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

                              </div>
                              <div  >

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
                                  label="Host Name"
                                  multiline
                                  rows={1}
                                  value={hostname}
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

                                  <TextField
                                    label="Remarks"
                                    multiline
                                    rows={1}
                                    value={remarks}
                                    variant="outlined"
                                    style={{ margin: '1rem', width: 'calc(3 * 200px )' }}                                    
                                  />
                              </div>
                            </div>
                            <div className='d-flex flex-row justify-content-center'>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={handleClose}
                                style={{ backgroundColor: red[500], width: 3, marginRight: "1%" }}
                              >Close</Button>
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
}

export default Asset_list;