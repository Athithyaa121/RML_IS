import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import '../css/users.css';
import '../vendor/fontawesome-free/css/all.min.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { blue } from '@mui/material/colors';
import * as XLSX from 'xlsx';
import Topbar1 from './topbar1';

const Product_M = () => {
  const [data, setData] = useState([]);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [modifiedCode, setModifiedCode] = useState('');
  const [modifiedName, setModifiedName] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  
  const [inputData, setInputData] = useState({
    Product_code: '',
    Product_name: ''
  });
  

  
  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get('http://localhost:3001/product')
      .then((response) => {
        setData(response.data);
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3001/product')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleNumberChange1 = (e) => {
    setInputData({ ...inputData, Product_code: e.target.value });
  };

  const handleNameChange1 = (e) => {
    setInputData({...inputData,Product_name : e.target.value});
  };

  const userid = localStorage.getItem('userId');

  const dataToSend = {
    ...inputData,
    userid: userid, // Include the created_by field
  };

  const handleAdd = () => {
    // Check constraints before making the API call
    if (!inputData.Product_code) {
      window.alert('Please enter a product code');
      return;
    }
  
    if (!inputData.Product_name) {
      window.alert('Please enter a product name');
      return;
    }
  
    axios
      .post('http://localhost:3001/addProduct', dataToSend)
      .then((response) => {
        fetchProducts();
        console.log(response.data); // Optional: Handle success response
        setInputData({
          Product_code: '',
          Product_name: '',
        });
        handleModalClose1();
        window.alert('Product added successfully');
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
  

  const handleDelete = (recordId, productName) => {
    
    if (!window.confirm(`Are you sure you want to delete the product "${productName}"?`)) {
      return;
    }

    const requestData = {
      userid: userid,
      // Add other data if needed
    };
  
    axios
      .put(`http://localhost:3001/deleteProduct/${recordId}`,requestData)
      .then((response) => {
        fetchProducts();
        console.log(response.data);
        window.alert(`Product "${productName}" deleted successfully`);
        // Optionally update your UI after successful deletion (e.g., fetch updated data)
      })
      .catch((error) => {
        console.error(error);
        // Optional: Handle error response
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

const handleModifyshow = (item) => {
  setSelectedMenuItem(item.Product_id);
  setModifiedCode(item.Product_code);
  setModifiedName(item.Product_name);
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
    userid:userid
  };

  axios
    .put(`http://localhost:3001/modifyProduct/${selectedMenuItem}`, updatedData)
    .then((response) => {
      // Handle the response
      console.log(response.data);
      fetchProducts();
      // Optionally update your UI or perform any other actions
      window.alert('Product updated successfully');
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
    link.download = 'Product_master.xlsx';
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
                Product Master
                <>

                  {/* Button trigger modal */}
                  <button
                    type="button"
                    style={{ marginRight: 5 }}
                    className="btn btn-primary float-right"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    onClick={handleModalShow1}
                  >

                    <i className="fas fa-user-plus" />

                  </button>
                  <Modal show={modalShow1} onHide={handleModalClose1}>
                    <Modal.Header closeButton className='bg-primary text-white'>
                      <Modal.Title >Add a Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Product Code:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="number"
                            value={inputData.Product_code}
                            onChange={handleNumberChange1}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Product Name:</Form.Label>
                          <Form.Control
                            className='form-input-master'
                            type="text"
                            value={inputData.Product_name}
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
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td>{item.Product_code}</td>
                        <td>{item.Product_name}</td>
                        <td>

                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              paddingLeft: 0
                            }}
                          >
                            <EditIcon
                              style={{ color: blue[800] }} onClick={() => handleModifyshow(item)}
                              baseclassname="fas"
                              className="fa-plus-circle"
                              sx={{ fontSize: 30 }}
                            />
                          </button>

                          {selectedMenuItem && (
                            <Modal show={modalShow2} onHide={handleModalClose2}>
                              <Modal.Header closeButton className="bg-primary text-white">
                                <Modal.Title>Modify Product</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form onSubmit={handleModificationSubmit}>
                                  <Form.Group>
                                    <Form.Label>Product Code:</Form.Label>
                                    <Form.Control
                                      className='form-input-master'
                                      type="text"
                                      value={modifiedCode}
                                      readOnly
                                    />
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Label>Product Name:</Form.Label>
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
                                    <Button className='btn-success' type="submit" variant="">
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
                              sx={{ color: red[500] }}
                              className="danger"
                              onClick={() => handleDelete(item.Product_id, item.Product_name)}
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

export default Product_M;
