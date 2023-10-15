import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import '../../css/masters.css';
import '../../vendor/fontawesome-free/css/all.min.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { blue } from '@mui/material/colors';
import * as XLSX from 'xlsx';
import Topbar1 from '../topbar1';


const Service_Cat_M = () => {
  const [data, setData] = useState([]);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modifiedCode, setModifiedCode] = useState('');
  const [modifiedType, setModifiedType] = useState('');
  const [modifiedCategory, setModifiedCategory] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [inputData, setInputData] = useState({
    Service_id: '',
    Service_type: '',
    Service_category:''
  });

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/master/service_category')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchServiceCategory();
  }, []);

  const fetchServiceCategory = () => {
    axios.get('http://localhost:3001/master/service_category')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleNumberChange = (e) => {
      setInputData({...inputData, Service_id : e.target.value});
  }

  const handleTypeChange = (e) => {
    setInputData({...inputData,Service_type : e.target.value});
  };

  const handleServiceChange = (e) => {
    setInputData({...inputData,Service_category : e.target.value});
  };

  const userid = localStorage.getItem('userId');

  const dataToSend = {
    ...inputData,
    userid: userid, // Include the created_by field
  };

  const handleAdd = () => {
    // Check constraints before making the API call
    if (!inputData.Service_id) {
      window.alert('Please enter a service ID');
      return;
    }
  
    if (!inputData.Service_type) {
      window.alert('Please enter a service type');
      return;
    }
  
    if (!inputData.Service_category) {
      window.alert('Please enter a service category');
      return;
    }
  
    axios
      .post('http://localhost:3001/addServiveCategory', dataToSend)
      .then((response) => {
        fetchServiceCategory();
        console.log(response.data); // Optional: Handle success response
        setInputData({
          Service_id: '',
          Service_type: '',
          Service_category: '',
        });
        handleModalClose1();
        window.alert('Service added successfully');
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
  

  const handleDelete = (recordId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
      return;
    }

    const requestData = {
      userid: userid,
    };

  
    axios
      .put(`http://localhost:3001/deleteServiveCategory/${recordId}`, requestData)
      .then((response) => {
        fetchServiceCategory();
        console.log(response.data);
        window.alert(`Service "${serviceName}" deleted successfully`)
      })
      .catch((error) => {
        console.error(error);
      });
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
    setSelectedMenuItem(item.Service_category_id);
    setModifiedCode(item.Service_category_id);
    setModifiedType(item.Service_category_type);
    setModifiedCategory(item.Service_category);
    setModalShow2(true);
  };

  
  const handleModifiedTypeChange = (event) => {
    setModifiedType(event.target.value);
  };
  
  const handleModifiedCategoryChange = (event) => {
    setModifiedCategory(event.target.value);
  };

 
  const handleModificationSubmit = () => {
    // Check if required fields are empty
    if (!modifiedCode || !modifiedType || !modifiedCategory) {
      window.alert('Please fill in all required fields');
      return;
    }
  
    const updatedData = {
      code: modifiedCode,
      type: modifiedType,
      category: modifiedCategory,
      userid: userid
    };
  
    axios
      .put(`http://localhost:3001/modifyServiceCategory/${selectedMenuItem}`, updatedData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        // Optionally update your UI or perform any other actions
        window.alert('Service category updated successfully');
        handleModalClose2();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
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
    link.download = 'Service_Category.xlsx';
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
                style={{ fontWeight: "bold", marginRight: 10, background: "transparent", border: "none", color: "white" }}
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
                Service Category Master
                <>

                  {/* Button trigger modal */}
                  <button
                    type="button"
                    className="btn btn-primary float-right"
                    style={{ marginRight: 5 }}
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    onClick={handleModalShow1}
                  >

                    <i className="fas fa-user-plus" />

                  </button>
                  <Modal show={modalShow1} onHide={handleModalClose1}>
                    <Modal.Header closeButton className='bg-primary text-white'>
                      <Modal.Title >Add a Service Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Service ID:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="number"
                            value={inputData.Service_id}
                            onChange={handleNumberChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Service Type:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.Service_type}
                            onChange={handleTypeChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Service Category:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.Service_category}
                            onChange={handleServiceChange}
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className='btn-danger' variant="" onClick={handleDelete}>
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
                      <th>Service ID</th>
                      <th>Service Type</th>
                      <th>Service Category</th>
                      <th> Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td> {item.Service_category_id}</td>
                        <td>{item.Service_category_type}</td>
                        <td>{item.Service_category}</td>
                        <td>

                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              paddingLeft: 0
                            }}
                          >
                            <EditIcon
                              style={{ color: blue[800] }} onClick={() => handleModalShow2(item)}
                              baseclassname="fas"
                              className="fa-plus-circle"
                              sx={{ fontSize: 30 }}
                            />
                          </button>
                          {selectedMenuItem && (
                            <Modal show={modalShow2} onHide={handleModalClose2}>
                              <Modal.Header closeButton className="bg-primary text-white">
                                <Modal.Title>Modify Service Category</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form onSubmit={handleModificationSubmit}>
                                  <Form.Group>
                                    <Form.Label>Service Category ID:</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedCode}
                                      readOnly
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Service Type</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedType}
                                      onChange={handleModifiedTypeChange}
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Service Category</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedCategory}
                                      onChange={handleModifiedCategoryChange}
                                    />
                                  </Form.Group>
                                  <Modal.Footer>
                                    <Button className='btn-danger' variant="" onClick={handleModalClose2}>
                                      Decline
                                    </Button>
                                    <Button className='btn-success' variant="" type='submit'>
                                      Add
                                    </Button>
                                  </Modal.Footer>
                                </Form>
                              </Modal.Body>

                            </Modal>
                          )}

                          <button
                            style={{ backgroundColor: "transparent", border: "none", marginLeft: "10px" }}
                          >
                            <DeleteIcon
                              sx={{ color: red[500], fontSize: 30 }}
                              className="danger "
                              onClick={() => handleDelete(item.Service_category_id, item.Service_category)}

                            />
                          </button>
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

export default Service_Cat_M;
