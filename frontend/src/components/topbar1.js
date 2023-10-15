import React, { useState } from 'react';
import { FaHome, FaClipboardList, FaAngleDown, FaTicketAlt, FaUserSecret, FaUserAlt, FaComments, FaInfoCircle } from 'react-icons/fa';
import '../css/users.css';
import '../css/sidebar.css';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';

const Topbar1 = (props) => {
  const [isMasterOpen, setMasterOpen] = useState(false);
  const [isAssetsOpen, setAssetsOpen] = useState(false);
  const [isTicketsOpen, setTicketsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMasterDropdown = () => {
    setMasterOpen(!isMasterOpen);
  };

  const toggleTicketsDropdown = () => {
    setTicketsOpen(!isTicketsOpen);
  };

  const toggleAssetsDropdown = () => {
    setAssetsOpen(!isAssetsOpen);
  };

  const handleLogout = () => {
    // Clear the desired keys from local storage
    localStorage.removeItem('IsLoggedIn');
    localStorage.clear();
    // ... add more keys if needed
    window.location.href = '/login';
    // Perform any additional logout logic (e.g., redirecting to the login page)
    // ...
  };

  return (
    <>
      {/* Page Wrapper */}
      <div id="wrapper">
        {/* Sidebar */}
        <ul className="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar">
          <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
            <div className="sidebar-brand-icon">
              <img src="../Rane.png" alt="" />
            </div>
          </a>
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <a className="nav-link" href="Dashboard">
              <FaHome className="sidebar-menu-icon" />
              <span>Dashboard</span>
            </a>
          </li>
          <hr className="sidebar-divider" />
          <li className="nav-item active">
            <a className="nav-link" href="Users1">
              <FaUserAlt className="sidebar-menu-icon" />
              <span>Users</span>
            </a>
          </li>
          <li className="nav-item active" onClick={toggleMasterDropdown}>
            <a href="#" className="nav-link ">
              <FaUserSecret className="sidebar-menu-icon" />
             <span>Masters</span>
             <span><FaAngleDown className={`sidebar-menu-dropdown-icon ${isMasterOpen ? 'open' : ''}`} /></span>
            </a>
            {isMasterOpen && (
              <ul className="sub-menu">
                <li className="sub-menu-item">
                  <a href="plant_master" className="sub-menu-link">
                    Plant Master
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="department_master" className="sub-menu-link">
                    Department Master
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="designation_master" className="sub-menu-link">
                    Designation Master
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="product_master" className="sub-menu-link">
                    Product Master
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="service_category_master" className="sub-menu-link">
                    Service Category Master
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="root_cause_master" className="sub-menu-link">
                    Root Cause Master
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item active" onClick={toggleTicketsDropdown}>
            <a href="#" className="nav-link">
              <FaTicketAlt className="sidebar-menu-icon" />
              <span>Tickets</span>
              <span><FaAngleDown className={`sidebar-menu-dropdown-icon ${isTicketsOpen ? 'open' : ''}`} /></span>
            </a>
            {isTicketsOpen && (
              <ul className="sub-menu">
                <li className="sub-menu-item">
                  <a href="view_ticket" className="sub-menu-link">
                    View Ticket
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="raise_ticket" className="sub-menu-link">
                    Raise a Ticket
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="close_ticket" className="sub-menu-link">
                    Close a Ticket
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item active" onClick={toggleAssetsDropdown}>
            <a href="#" className="nav-link">
              <FaClipboardList className="sidebar-menu-icon" />
             <span>Assets</span>
             <span><FaAngleDown className={`sidebar-menu-dropdown-icon ${isAssetsOpen ? 'open' : ''}`} /></span>
            </a>
            {isAssetsOpen && (
              <ul className="sub-menu">
                <li className="sub-menu-item">
                  <a href="asset_list" className="sub-menu-link">
                    Asset List
                  </a>
                </li>
                <li className="sub-menu-item">
                  <a href="asset_approval" className="sub-menu-link">
                    Asset Approval
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="contact">
              <FaComments className="sidebar-menu-icon" />
              <span>Contact</span>
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="about_us">
              <FaInfoCircle className="sidebar-menu-icon"/>
              <span>About Us</span>
            </a>
          </li>
          <hr className="sidebar-divider d-none d-md-block"/>
        </ul>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <nav className="navbar navbar-expand  topbar mb-4 static-top shadow">
              <div className="topbar-brand-text mx-1">IS MANAGEMENT</div>
              <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"/>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <IconButton
                      onClick={handleClick}
                      size="large"
                      sx={{ ml: 4 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <FaHome style={{ color: 'white' }}></FaHome>
                    </IconButton>                  
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar /> Change Password
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </ul>
            </nav>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Topbar1;

