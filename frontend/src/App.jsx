import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TopBar1 from './components/topbar1';
import Contact from './components/contact';
import Users from './components/users';
import Dept_M from './components/masters/dept_m';
import View_Ticket from './components/view_ticket';
import Desig_M from './components/masters/desig_m';
import Plant_M from './components/masters/plant_m';
import Product_M from './components/masters/product_m';
import Service_M from './components/masters/service_cat_m';
import Root_M from './components/masters/root_cause_m';
import Raise_Ticket from './components/raise_ticket';
import Close_Ticket from './components/close_ticket';
import Asset_Approval from './components/asset_approval';
import Asset_list from './components/asset_list';
import Asset_Add from './components/asset_add';
import Users1 from './components/Users1.jsx';
import Dashboard from './components/dashboard';
import About_us from './components/about_us';
import Login from './components/login';

class App extends React.Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/Users1" element={<Users1 />} />
          <Route path="/Users" element={ <Users />} />

          <Route path="/Dashboard" element={<Dashboard/>} />

          <Route path="/plant_master" element={<Plant_M/>} />
          <Route path="/department_master" element={<Dept_M/>} />
          <Route path="/designation_master" element={<Desig_M/>} />
          <Route path="/product_master" element={<Product_M/>} />
          <Route path="/service_category_master" element={<Service_M/>} />
          <Route path="/root_cause_master" element={<Root_M/>} />

          <Route path="/view_ticket" element={<View_Ticket/>} />
          <Route path="/raise_ticket" element={<Raise_Ticket/>} />
          <Route path="/close_ticket" element={<Close_Ticket/>} />

          <Route path="/asset_list" element={<Asset_list/>} />
          <Route path="/asset_approval" element={<Asset_Approval/>} />
          <Route path="/asset_add" element={<Asset_Add/>} />

          <Route path="/contact" element={<Contact/>} />
          <Route path="/about_us" element={<About_us/>} />
          {/* Define other routes similarly */}
          {/* <Route path="/Users1" element={<Users1 />} /> */}
          {/* ... */}
        </Routes>
      </div>
    );
  }
}

export default App;