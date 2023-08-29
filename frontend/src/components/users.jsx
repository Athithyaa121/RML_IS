import '../css/users.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar1 from './topbar1';

const Users = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [plantCode, setPlantCode] = useState('');
  const [roles, setRoles] = useState([]);
  const [designation, setDesignation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plantCodes, setPlantCodes] = useState([]);
  const [departmentCodes, setDepartmentCodes] = useState([]);
  const [designationCodes, setDesignationCodes] = useState([]);
  const [errormessage, setErrorMessage] = useState([]);



  const validatePhoneNumber = (number) => {
    const phonePattern = /^\d{10}$/;
    return !phonePattern.test(number);
  };

  // Function to validate email
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(email);
  };

  useEffect(() => {
    fetch('http://localhost:3001/plantCodes')
      .then((response) => response.json())
      .then((data) => {

        setPlantCodes(data);
        if (data.length > 0) {
          setPlantCode(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) => console.error('Error fetching plant codes:', error));

    fetch('http://localhost:3001/DepartmentCodes')
      .then((response) => response.json())
      .then((data) => {

        setDepartmentCodes(data);
        if (data.length > 0) {
          setDepartment(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) => console.error('Error fetching Department codes:', error));

    fetch('http://localhost:3001/DesignationCodes')
      .then((response) => response.json())
      .then((data) => {

        setDesignationCodes(data);
        if (data.length > 0) {
          setDesignation(data[0].value); // Set the default value to the first option
        }
      })
      .catch((error) => console.error('Error fetching Designation codes:', error));

  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      username === '' ||
      password === '' ||
      department == null || department === '0' ||
      email === '' ||
      plantCode === '' || plantCode === '0' ||

      designation === '' || designation === '0' ||
      phoneNumber == null

    ) {
      // Display an error message or perform any other desired action
      setErrorMessage('Please fill in all the required fields.');
      return; // Exit the function without submitting the form
    }
    else if (validateEmail(email)) {
      setErrorMessage('Please enter a valid Email.');
      return;
    }

    else if (validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid Mobile Number.');
      return;
    }

    else if (department == null) {
      setErrorMessage('Please choose a Department.');
      return;
    }
    else if (plantCode == null) {
      setErrorMessage('Please choose a Plant.');
      return;
    }
    else if (designation == null) {
      setErrorMessage('Please choose a Designation.');
      return;
    }

    else if (roles.length === 0) {
      setErrorMessage('Please choose a Role.');
      return;
    }

    try {
      // Send form data to the backend
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
        department,
        email,
        plantCode,
        roles,
        designation,
        phoneNumber
      });


      setErrorMessage(<span style={{ color: 'green', marginTop: '10px' }}>'User registered successfully'</span>);

      // Clear form fields
      setUsername('');
      setPassword('');
      setDepartment('');
      setEmail('');
      setPlantCode('');
      setRoles([]);
      setDesignation('');
      setPhoneNumber('');
    } catch (error) {
      console.error(error);
    }
  };



  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRoles((prevRoles) => [...prevRoles, value]);
    } else {
      setRoles((prevRoles) => prevRoles.filter((role) => role !== value));
    }
  };



  return (
    <>
    <Topbar1>

      {/* Page Wrapper */}
      <div id="wrapper" className="d-flex justify-content-center align-items-center ">
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {/* Begin Page Content */}
            <div className="container-fluid">
              {/* Page Heading */}
              <h1 className="h2 mb-4 text-gray-800">
                <span>REGISTER</span>
              </h1>
              {/* Content Row */}
              <div className="row">
                <div className="col-xl-6">
                  <form >
                    <div className="form-line-users">
                      <div className="form-icon-users">
                        <i className="fas fa-user" />
                      </div>
                      <input
                        type="text"
                        className="form-input-users"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}

                        placeholder="Username"
                        required
                      />
                    </div>
                    <div className="form-line-users">
                      <div className="form-icon-users">
                        <i className="fas fa-lock" />
                      </div>
                      <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="form-line-users">
                      <div className="form-icon-users">
                        <i className="fas fa-users" />
                      </div>
                      <select
                        className="form-select-users"
                        name="Department"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value='0'>Department</option>
                        {departmentCodes.map((code, index) => (
                          <option key={index} value={code.Dept_id}>
                            {code.Dept_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-line-users">
                      <div className="form-icon-users">
                        <i className="fas fa-envelope" />
                      </div>
                      <input
                        type="email"
                        className="form-input-users"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required=""
                      />
                    </div>
                  </form>
                </div>
                {/* Donut Chart */}
                <div className="col-xl-6">
                  <div className="form-line-users">
                    <div className="form-icon-users">
                      <i className="fas fa-cogs" />
                    </div>
                    <select
                      value={plantCode}
                      onChange={(e) => setPlantCode(e.target.value)}
                      className="form-select-users"
                      name="plant-code"

                    >
                      <option value="" disabled selected >Plant Code</option>
                      {plantCodes.map((code, index) => (
                        <option key={index} value={code.Plant_ID}>
                          {code.Plant_code} - {code.Plant_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-line1-users">
                    <div className="form-icon-users">
                      <i className="fas fa-user-tag" placeholder="Roles" />
                    </div>
                    <h6> Role :</h6>
                    <label htmlFor="admin-role">
                      <input
                        type="checkbox"
                        id="admin-role"
                        name="role"
                        value="admin"
                        className="test"
                        onChange={handleRoleChange}
                        checked={roles.includes("admin")}
                      />
                      Admin
                    </label>
                    <label htmlFor="user-role">
                      <input
                        type="checkbox"
                        id="user-role"
                        name="role"
                        value="user"
                        className="test"
                        onChange={handleRoleChange}
                        checked={roles.includes("user")}
                      />
                      User
                    </label>
                    <label htmlFor="engineer-role">
                      <input
                        type="checkbox"
                        id="engineer-role"
                        name="role"
                        value="engineer"
                        className="test"
                        onChange={handleRoleChange}
                        checked={roles.includes("engineer")}
                      />
                      Engineer
                    </label>
                    <label htmlFor="approver-role">
                      <input
                        type="checkbox"
                        id="approver-role"
                        name="role"
                        value="approver"
                        className="test"
                        onChange={handleRoleChange}
                        checked={roles.includes("approver")}
                      />
                      Approver
                    </label>
                  </div>
                  <div className="form-line-users">
                    <div className="form-icon-users">
                      <i className="fas fa-user-tag" />
                    </div>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="form-select-users" name="designation" required="">
                      <option value="" disabled  >Designation </option>
                      {designationCodes.map((code, index) => (
                        <option key={index} value={code.Designation_id}>
                          {code.Designation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-line-users">
                    <div className="form-icon-users">
                      <i className="fas fa-phone-alt" />
                    </div>
                    <input
                      type="number"
                      className="form-input-users"
                      placeholder="Phone Number"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="submit_button-users">
                  <button
                    type="submit"
                    className="btn btn-primary "
                    id="submit"
                    value="submit"
                    // disabled={submitButtonDisabled}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>


                </div>


              </div>
              <div className='errorMessage'>
                {errormessage && <p >{errormessage}</p>}
              </div>

              {/* End of Main Content */}
            </div>
            {/* End of Content Wrapper */}
          </div>
        </div>
      </div>
      </Topbar1>
    </>
  );
}

export default Users;
