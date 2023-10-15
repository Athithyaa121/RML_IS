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

const Desig_M = () => {
  const [data, setData] = useState([]);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modifiedCode, setModifiedCode] = useState('');
  const [modifiedName, setModifiedName] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/master/designation')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchDesignation();
  }, []);

  const fetchDesignation = () => {
    axios.get('http://localhost:3001/master/designation')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [inputData, setInputData] = useState({
    Designation_id: '',
    Designation: ''
  });

  const userid = localStorage.getItem('userId');

  const dataToSend = {
    ...inputData,
    userid: userid, // Include the created_by field
  };

  const handleAdd = () => {
    // Check constraints before making the API call
    if (!inputData.Designation_id) {
      window.alert('Please enter a designation ID');
      return;
    }
  
    if (!inputData.Designation) {
      window.alert('Please enter a designation');
      return;
    }
  
    axios
      .post('http://localhost:3001/addDesignation', dataToSend)
      .then((response) => {
        fetchDesignation();
        console.log(response.data); // Optional: Handle success response
        setInputData({
          Designation_id: '',
          Designation: '',
        });
        handleModalClose1();
        window.alert('Designation added successfully');
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
  

  const handleDelete = (recordId, designationName) => {
    
    if (!window.confirm(`Are you sure you want to delete the designation "${designationName}"?`)) {
      return;
    }

    const requestData = {
      userid: userid,
    };
  
    axios
      .put(`http://localhost:3001/deleteDesignation/${recordId}`, requestData)
      .then((response) => {
        fetchDesignation();
        console.log(response.data);
        window.alert(`Designation "${designationName}" deleted successfully`);
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


  const handleNameChange1 = (e) => {
    setInputData({ ...inputData, Designation: e.target.value });
  };

  const handleNumberChange1 = (e) => {
    setInputData({ ...inputData, Designation_id: e.target.value });
  };

  

//Modifying

const handleModalShow2 = (item) => {
  setSelectedMenuItem(item.Designation_id);
  setModifiedCode(item.Designation_id);
  setModifiedName(item.Designation);
  setModalShow2(true);
};


const handleModifiedNameChange = (event) => {
  setModifiedName(event.target.value);
};



const handleModificationSubmit = () => {
  // Check if required fields are empty
  if (!modifiedCode || !modifiedName) {
    window.alert('Please fill in all required fields');
    return;
  }

  const updatedData = {
    code: modifiedCode,
    name: modifiedName,
    userid: userid
  };

  axios
    .put(`http://localhost:3001/modifyDesignation/${selectedMenuItem}`, updatedData)
    .then((response) => {
      // Handle the response
      console.log(response.data);
      // Optionally update your UI or perform any other actions
      window.alert('Designation updated successfully');
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
    link.download = 'Designation_Master.xlsx';
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
                Designation Master
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
                      <Modal.Title >Add a Designation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Designation ID:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="number"
                            value={inputData.Designation_id}
                            onChange={handleNumberChange1}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Designation:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.Designation}
                            onChange={handleNameChange1}
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
                      <th>Designation ID</th>
                      <th>Designation </th>
                      <th >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.id}>
                        <td> {index + 1}</td>
                        <td>{item.Designation_id}</td>
                        <td>{item.Designation}</td>
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
                                <Modal.Title>Modify Designation</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form onSubmit={handleModificationSubmit}>
                                  <Form.Group>
                                    <Form.Label>Designation ID:</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedCode}
                                      readOnly
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Designation:</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedName}
                                      onChange={handleModifiedNameChange}
                                    />
                                  </Form.Group>
                                  <Modal.Footer>
                                    <Button className='btn-danger' variant="" onClick={handleModalClose2}>
                                      Decline
                                    </Button>
                                    <Button className='btn-success' type='sumbit' variant="">
                                      Modify
                                    </Button>

                                  </Modal.Footer>

                                </Form>
                              </Modal.Body>

                            </Modal>
                          )}

                          <DeleteIcon sx={{ color: red[500] }} className="danger" onClick={() => handleDelete(item.Designation_id)}></DeleteIcon>
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

export default Desig_M;
