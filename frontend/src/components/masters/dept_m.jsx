import { Button, Modal, Form } from 'react-bootstrap';

import '../../css/masters.css';
import '../../vendor/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { blue } from '@mui/material/colors';
import * as XLSX from 'xlsx';
import Topbar1 from '../topbar1';


const Dept_M = () => {
  const [data, setData] = useState([]);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modifiedCode, setModifiedCode] = useState('');
  const [modifiedName, setModifiedName] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);



  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/master/department')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios.get('http://localhost:3001/master/department')
      .then((response) => {
        setData(response.data);
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


  const [inputData, setInputData] = useState({
    dept_code: '',
    dept_name: ''
  });

  const handleNumberChange1 = (e) => {
    setInputData({ ...inputData, dept_code: e.target.value });
  };

  const handleNameChange1 = (e) => {
    setInputData({ ...inputData, dept_name: e.target.value });
  };

  const userid = localStorage.getItem('userId');

  const dataToSend = {
    ...inputData,
    userid: userid, // Include the created_by field
  };

  const handleAdd = () => {
    // Check constraints before making the API call
    if (!inputData.dept_code) {
      window.alert('Please enter a department code');
      return;
    }
  
    if (!inputData.dept_name) {
      window.alert('Please enter a department name');
      return;
    }
  
    axios
      .post('http://localhost:3001/addDepartment', dataToSend)
      .then((response) => {
        fetchDepartments();
        console.log(response.data); // Optional: Handle success response
        setInputData({
          dept_code: '',
          dept_name: '',
        });
        handleModalClose1();
        window.alert('Department added successfully');
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
  

  const handleDelete = (recordId, departmentName) => {
    if (!window.confirm(`Are you sure you want to delete the department "${departmentName}"?`)) {
      return;
    }

    const requestData = {
      userid: userid,
    };
  
    axios
      .put(`http://localhost:3001/deleteDepartment/${recordId}`,requestData)
      .then((response) => {
        fetchDepartments();
        console.log(response.data);
        window.alert(`Department "${departmentName}" deleted successfully`);
        
      })
      .catch((error) => {
        console.error(error);
        
      });
  };
  
//Modifying

const handleModifyshow = (item) => {
  setSelectedMenuItem(item.Dept_id);
  setModifiedCode(item.Dept_code);
  setModifiedName(item.Dept_name);
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
    .put(`http://localhost:3001/modifyDepartment/${selectedMenuItem}`, updatedData)
    .then((response) => {
      // Handle the response
      console.log(response.data);
      // Optionally update your UI or perform any other actions
      window.alert('Department updated successfully');
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
    link.download = 'Department_master.xlsx';
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
                Department Master
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
                      <Modal.Title >Add a Department</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form >
                        <Form.Group>
                          <Form.Label>Department Code:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="number"
                            value={inputData.dept_code}
                            onChange={handleNumberChange1}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Department Name:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.dept_name}
                            onChange={handleNameChange1}
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
                      <th>Department Code</th>
                      <th>Department Name</th>
                      <th >Action</th>
                    </tr>
                  </thead>
                

                  <tbody>
                    
                      {data.map((item,index) => (
                        <tr key={index}>
                          <td>{index + 1 }</td>
                          <td>{item.Dept_code}</td>
                          <td>{item.Dept_name}</td>
                          <td>
                    
                        <button
                        style={{backgroundColor:"transparent" , 
                        border:"none", 
                        paddingLeft:0}}
                        >
                        <EditIcon 
                        style={{ color: blue[800] }} onClick={() => handleModifyshow(item)} 
                        baseclassname="fas" 
                        className="fa-plus-circle" 
                        sx={{ fontSize:30}}
                        />
                        </button>
                        
                        {selectedMenuItem && (
                          <Modal show={modalShow2} onHide={handleModalClose2}>
                            <Modal.Header closeButton className="bg-primary text-white">
                              <Modal.Title>Modify Department</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form onSubmit={handleModificationSubmit}>
                                <Form.Group>
                                  <Form.Label>Department Code:</Form.Label>
                                  <Form.Control
                                    className='form-input-master'
                                    type="text"
                                    value={modifiedCode}
                                    readOnly
                                  />
                                </Form.Group>
                                <Form.Group>
                                  <Form.Label>Department Name:</Form.Label>
                                  <Form.Control
                                    className='form-input-master'
                                    type="text"
                                    value={modifiedName}
                                    onChange={handleModifiedNameChange}
                                  />
                                </Form.Group>  
                                <Modal.Footer>                          
                              <Button className=" btn-danger" variant="" onClick={handleModalClose2}>
                                Decline
                              </Button>
                              <Button className="btn-success" variant="" type='submit' >
                                Modify
                              </Button>                              
                            </Modal.Footer>                                                              
                              </Form>
                            </Modal.Body>
                           
                          </Modal>
                        )}

                        <DeleteIcon sx={{ color: red[500] }} className="danger" onClick={() => handleDelete(item.Dept_code,item.Dept_name)}></DeleteIcon>

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

export default Dept_M;



