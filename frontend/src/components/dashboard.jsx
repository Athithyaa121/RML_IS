import React, { useEffect } from 'react';
import '../css/dashboard.css';
// import userimage from '../css/user_image.jpeg';
import axios from 'axios';
import { useState } from 'react';
import Topbar1 from './topbar1';

const Dashboard = () => {
  const user = {
    name: localStorage.getItem('userName'),
    department: localStorage.getItem('userdept'),
    
    plantcode:localStorage.getItem('userplant'),
    email:localStorage.getItem('useremail'),
    userid:localStorage.getItem('userId'),
  };
  const [items, setItems] = useState([]);
  useEffect(()=>{
    ticketFetch();
  },[])
 
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
            <h4 className="m-0 font-weight-bold text-primary">Dashboard</h4>
            <div className="info-boxes1">
              <div className="info-box1">
                <div className="user-profile">
                  <img className="img2"  alt="User" />
                  <div>
                    <h3>{user.name}</h3>
                      <table className='table1'>
                        <tr>
                          <td className='td1'>Department: {user.department}</td>
                          <td className='td1'>Plantcode: {user.plantcode}</td>
                        </tr>
                        <tr>
                        <td className='td1'>User id: {user.userid}</td>
                        <td className='td1'>Email: {user.email}</td>
                        </tr>
                      </table>
                  </div>
                </div>
              </div>
              <div className="info-boxes ">
                <div className="info-box">
                  <div className="left1"><h4>Current Tickets</h4></div>
                  <div className="right1"><h1>{numberOfTickets}</h1></div>
                </div>
                
                <div className="info-box">
                  <div className="left1"><h4>Number of Assets</h4></div>
                  <div className="right1"><h1>{numberOfAssets}</h1></div>
                </div>
              </div>
            </div>
          </div>
          <h3>Tickets</h3>
          <div className="ticket-list-container">
            <div className="horizontal-scroll-wrapper squares">
              <div className="ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="item-container">
                    <p>Ticket ID: {ticket.ticketId}</p>
                    <p>Status: {ticket.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div><hr style={{ borderWidth: 'transparent' }}></hr></div>

          <h3>Assets</h3>
          <div className="asset-list-container">
            <div className="horizontal-scroll-wrapper squares">
              <div className="asset-list">
                {assets.map((asset) => (
                  <div key={asset.id} className="item-asset-container">
                    <p>Asset ID: {asset.assetId}</p>
                    <p>Status: {asset.aStatus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
    </Topbar1>
  );
};

export default Dashboard;
