import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import '../../css/masters.css';
import '../../vendor/fontawesome-free/css/all.min.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { blue } from '@mui/material/colors';
import Topbar1 from '../topbar1';


const Plant_M = () => {
  const [data, setData] = useState([]);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modifiedCode, setModifiedCode] = useState('');
  const [modifiedName, setModifiedName] = useState('');
  const [modifiedLocation, setModifiedLocation] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  
 
  


  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/master/plant')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [inputData, setInputData] = useState({
    plant_code: '',
    plant_name: '',
    plant_location:''
  });

  const userid = localStorage.getItem('userId');

  const dataToSend = {
    ...inputData,
    userid: userid,
  };

  const handleAdd = () => {
    // Check constraints before making the API call
    if (!inputData.plant_code) {
      window.alert('Please enter a plant code');
      return;
    }
  
    if (!inputData.plant_name) {
      window.alert('Please enter a plant name');
      return;
    }
  
    if (!inputData.plant_location) {
      window.alert('Please enter a plant location');
      return;
    }
  
    axios
      .post('http://localhost:3001/addPlant', dataToSend)
      .then((response) => {
        fetchPlants();
        console.log(response.data); // Optional: Handle success response
        setInputData({
          plant_code: '',
          plant_name: '',
          plant_location: '',
        });
        handleModalClose1();
        window.alert(`${inputData.plant_name} added successfully`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          window.alert(errorMessage);
        } else {
          console.error(error);
        }
      });
  };
  

  const handleDelete = (recordId,name) => {
   
    if (!window.confirm(`Are you sure you want to delete ${recordId} - ${name} ?`)) {
      return;
    }
  
    const requestData = {
      userid: userid,
    };

    axios
      .put(`http://localhost:3001/deletePlant/${recordId}`,requestData)
      .then((response) => {
        fetchPlants();
        console.log(response.data);
        window.alert(`${name} deleted successfully`);
        // Optionally update your UI after successful deletion (e.g., fetch updated data)
      })
      .catch((error) => {
        window.alert("Failed to delete")
        console.error(error);
        // Optional: Handle error response
      });
  };
  
  


  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = () => {
    axios.get('http://localhost:3001/master/plant')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNumberChange1 = (e) => {
    setInputData({ ...inputData, plant_code: e.target.value });
  };

  const handleNameChange1 = (e) => {
    setInputData({ ...inputData, plant_name: e.target.value });
  };

  const handleLocationChange1 = (e) => {
    setInputData({...inputData,plant_location: e.target.value});
  };

  const handleModalClose1 = () => {
    setModalShow1(false);
  };

  const handleModalShow1 = () => {
    setModalShow1(true);
  };

  const handleModalClose2 = () => {
    setModalShow2(false);
  };

//Modifying

  const handleModalShow2 = (item) => {
    setSelectedMenuItem(item.Plant_ID);
    setModifiedCode(item.Plant_code);
    setModifiedName(item.Plant_name);
    setModifiedLocation(item.Plant_location);
    setModalShow2(true);
  };

  
  const handleModifiedNameChange = (event) => {
    setModifiedName(event.target.value);
  };
  
  const handleModifiedLocationChange = (event) => {
    setModifiedLocation(event.target.value);
  };

 
  const handleModificationSubmit = () => {
    // Check if required fields are empty
    if (!modifiedCode || !modifiedName || !modifiedLocation) {
      window.alert('Please fill in all required fields');
      return;
    }
  
    const updatedData = {
      code: modifiedCode,
      name: modifiedName,
      location: modifiedLocation,
      userid: userid
    };
  
    axios
      .put(`http://localhost:3001/modifyPlant/${selectedMenuItem}`, updatedData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Optionally update your UI or perform any other actions
        window.alert('Plant modified successfully');
        
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
      handleModalClose2();
  };
  
    


  
// EXCEL EXPORTING



  function exportToExcel() {
    // Get the table element
    const table = document.getElementById('dataTable');
  
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
    link.download = 'plant_master.xlsx';
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
            Masters
            <a
              href="#"
              className="d-none d-sm-inline-block btn btn-sm btn-success shadow float-right"
            >
              <button 
              style={{ fontWeight: "bold", marginRight: 10 , background : "transparent",border:"none" ,color:"white"}}
              onClick={exportToExcel}
              >
                Generate Report
              </button>
              <i className="fas fa-file-excel" />
            </a>
          </h1>
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h4 className="m-0 font-weight-bold text-primary">
                Plant Master
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                  onClick={handleModalShow1}
                >

                  <i className="fas fa-user-plus" />

                </button>
                <>
                  {/* Button trigger modal */}

                  <Modal show={modalShow1} onHide={handleModalClose1}>
                    <Modal.Header closeButton className='bg-primary text-white'>
                      <Modal.Title >Add a Plant</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Plant Code</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="number"
                            value={inputData.plant_code}
                            onChange={handleNumberChange1}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Plant Name</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.plant_name}
                            onChange={handleNameChange1}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Plant Location</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.plant_location}
                            onChange={handleLocationChange1}
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className='btn-danger' variant="" onClick={handleModalClose1}>
                        Decline
                      </Button>
                      <Button className='btn-success' variant="" onClick={handleAdd}>
                        Add
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>


              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  id="dataTable"
                  width="100%"
                  cellSpacing={0}
                >
                  <thead style={{ backgroundColor: "#3c63e1", color: "white" }}>
                    <tr>
                      <th>Sl.No</th>
                      <th>Plant Code</th>
                      <th>Plant Name</th>
                      <th>Plant Location</th>
                      <th onClick="false" style={{ color: "#3c63e1" }}>
                        <span style={{ color: "white" }}> Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.Plant_code}</td>
                        <td>{item.Plant_name}</td>
                        <td>{item.Plant_location}</td>
                        <td>
                          <EditIcon style={{ color: blue[800] }} onClick={() => handleModalShow2(item)} 
                          baseclassname="fas" 
                          className="fa-plus-circle" 
                          sx={{ fontSize: 30 }} />
                          <Modal show={modalShow2} onHide={handleModalClose2}>
                            <Modal.Header closeButton className='bg-primary text-white'>
                              <Modal.Title >Modify a Plant</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form>
                                <Form.Group>
                                  <Form.Label>Plant Code</Form.Label>
                                  <Form.Control
                                    className='form-input-master'
                                    type="text"
                                    value={modifiedCode}
                                    readOnly
                                  />
                                </Form.Group>
                                <Form.Group>
                                  <Form.Label>Plant Name</Form.Label>
                                  <Form.Control
                                    className='form-input-master'
                                    type="text"
                                    value={modifiedName}
                                    onChange={handleModifiedNameChange}
                                  />
                                </Form.Group>
                                <Form.Group>
                                  <Form.Label>Plant Location</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={modifiedLocation}
                                    onChange={handleModifiedLocationChange}
                                  />
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button className='btn-danger' variant="" onClick={handleModalClose2}>
                                Close
                              </Button>
                              <Button className='btn-success' variant='' onClick={handleModificationSubmit} type="submit" >
                                Modify
                              </Button>

                            </Modal.Footer>
                          </Modal>
                          <DeleteIcon sx={{ color: red[500] , fontSize:30}} style={{marginLeft:20}} className="danger" onClick={() => handleDelete(item.Plant_code, item.Plant_name)}></DeleteIcon>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Topbar1>
    </>

  );
}

export default Plant_M;
