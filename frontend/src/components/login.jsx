import React, { useState, useEffect } from 'react';
import videoFile from '../assets/videos/Rane_login.mp4';
import ReactDOM from 'react-dom/client';
import { fromStream } from 'stream-to-it';
import { Navigate, useNavigate, useHistory } from 'react-router-dom';
import '../css/login.css';

import App from '../App';
import { Token } from '@mui/icons-material';


const Login = () => {

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('IsLoggedIn') === 'true';
    setIsLoggedIn(isAuthenticated);
  }, []);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');




  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    })
      .then(response => {
        console.log('Status Code:', response.status);
        return response.json();
      })

      .then(data => {

        if (data.token) {

          setIsLoggedIn(true);
          localStorage.setItem('IsLoggedIn', true)
          localStorage.setItem('token', data.token);
          // console.log(data.token)
          const decodedToken = decodeToken(data.token);
          if (decodedToken) {
            localStorage.setItem('userId', decodedToken.userId);
            localStorage.setItem('userRole', decodedToken.role);
            localStorage.setItem('userName', decodedToken.userName);
            localStorage.setItem('userdept', decodedToken.dept);
            localStorage.setItem('userplant', decodedToken.plant);
            localStorage.setItem('useremail', decodedToken.email);
            localStorage.setItem('plantcode', decodedToken.plantcode);

          }


          navigate('/Dashboard')
        } else {

          const message = data.message;
          console.log('Message:', message);
          setLoginMessage(message);
        }
      })

      .catch(error => {

        console.error('Error:', error.message);
        setLoginMessage('An error occurred');
      });
  };
  return (
    <>
      <div className="body">
      <div className="container">
            <div className="card-login">
                <div className="row-login">
                  <div className="col-xl-6">
                    <div className="video-container">
                      <video className="video-element" muted autoPlay>
                        <source src={videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                  <div className="col-xl-6 justify-content-center">
                    <div className="p-5 mt-5">
                      <hr />
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 bold">Welcome</h1>
                      </div>
                      {loginMessage && <p className='loginMessage'>{loginMessage}</p>}
                      <form className="user-login" onSubmit={handleLogin}>
                        <div className="form-group-login">
                          <input
                            type="text"
                            className="form-control-login"
                            id="userName"
                            value={userName}
                            onChange={handleUserNameChange}
                            aria-describedby="Username"
                            placeholder="Enter Username"
                          />
                        </div>
                        <div className="form-group-login">
                          <input
                            type="password"
                            className="form-control-login"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter Password"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary justify-content-center">
                          Login
                        </button>
                      </form>
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
  
    </>
  );


};

export default Login;
