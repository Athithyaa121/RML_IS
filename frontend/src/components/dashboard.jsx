import React, { useEffect } from 'react';
import '../css/dashboard.css';
import '../css/topbar1.css';
import axios from 'axios';
import { useState } from 'react';
import Topbar1 from './topbar1';

const Dashboard = () => {
  const user = {
    name: localStorage.getItem('userName'),
    department: localStorage.getItem('userdept'),
    plantcode: localStorage.getItem('userplant'),
    email: localStorage.getItem('useremail'),
    userid: localStorage.getItem('userId'),
    role: localStorage.getItem('userrole')
  };
  const [items, setItems] = useState([]);
  useEffect(() => {
    ticketFetch();
  }, [])

  const [isRoleFlipped, setIsRoleFlipped] = useState(false);
  const [isTicketFlipped, setIsTicketFlipped] = useState(false);
  const [isAssetsFlipped, setIsAssetsFlipped] = useState(false);

  // Function to toggle the flip state for the Role of the user
  const toggleRoleFlip = () => {
    setIsRoleFlipped(!isRoleFlipped);
  };
  // Function to toggle the flip state for the Ticket flashcard
  const toggleTicketFlip = () => {
    setIsTicketFlipped(!isTicketFlipped);
  };

  // Function to toggle the flip state for the Assets flashcard
  const toggleAssetsFlip = () => {
    setIsAssetsFlipped(!isAssetsFlipped);
  };
  const ticketFetch = async () => {
    try {
      const response = await axios.get('http://example.com/api/items'); // Replace with your API endpoint URL
      setItems(response.data); // Assuming the response contains the list of items
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const tickets = [
    { id: 1, ticketId: 'T001', status: 'In Progress' },
    { id: 2, ticketId: 'T002', status: 'Resolved' },
    { id: 3, ticketId: 'T003', status: 'Open' },
    { id: 4, ticketId: 'T004', status: 'Open' },
    { id: 5, ticketId: 'T005', status: 'Open' },
    { id: 6, ticketId: 'T006', status: 'Open' },
    { id: 7, ticketId: 'T007', status: 'Open' },
    { id: 8, ticketId: 'T008', status: 'Open' },
    { id: 9, ticketId: 'T009', status: 'Open' },
    // Add more items as needed
  ];

  const assets = [
    { id: 1, assetId: 'A001', aStatus: 'Live' },
    { id: 2, assetId: 'A002', aStatus: 'Live' },
    { id: 3, assetId: 'A003', aStatus: 'Stand By' },
    { id: 4, assetId: 'A004', aStatus: 'Stand By' },
    { id: 5, assetId: 'A005', aStatus: 'Stand By' },
    // Add more items as needed
  ];

  const numberOfTickets = tickets.length; // Number of current tickets
  const numberOfAssets = assets.length; // Number of assets

  return (
    <Topbar1>
      <div id="wrapper">
        {/* Begin Page Content */}
        <div className="container-fluid">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h4 className="mb-4 font-weight-bold text-primary" >Dashboard</h4>
              <div className="row-dashboard">
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          User Name
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {user.name}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-comments fa-2x text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pending Requests Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row-dashboard no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          User id
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {user.userid}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/* Earnings (Monthly) Card Example */}

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row-dashboard no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Department 
                           </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {user.department}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar fa-2x text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row-dashboard no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Plantcode
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {user.plantcode}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                
              </div>

              {/* <table class="user-table">
                <tr>
                  <td style={{ fontSize: "20px" }} rowspan="5">{user.name}</td>
                  <td>Department: {user.department}</td>
                </tr>
                <tr>
                  <td>Plantcode: {user.plantcode}</td>
                </tr>
                <tr>
                  <td>User id: {user.userid}</td>
                </tr>
                <tr>
                  <td>Email: {user.email}</td>
                </tr>
              </table> */}
              <hr style={{ border: '10' }}></hr>
              <div className="flashcard-container">
                <div
                  className={`flashcard ${isRoleFlipped ? 'flipped' : ''}`}
                  onClick={toggleRoleFlip}
                >
                  <div className="inner">
                    <div className="front">Role</div>
                    <div className="back">{user.role}</div>
                  </div>
                </div>
                <div
                  className={`flashcard ${isTicketFlipped ? 'flipped' : ''}`}
                  onClick={toggleTicketFlip}
                >
                  <div className="inner">
                    <div className="front">Ticket</div>
                    <div className="back">{numberOfTickets}</div>
                  </div>
                </div>
                <div
                  className={`flashcard ${isAssetsFlipped ? 'flipped' : ''}`}
                  onClick={toggleAssetsFlip}
                >
                  <div className="inner">
                    <div className="front">Assets</div>
                    <div className="back">{numberOfAssets}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Topbar1>
  );
};

export default Dashboard;
