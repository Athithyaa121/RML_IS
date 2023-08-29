import React, { useState , useEffect } from 'react';
import '../vendor/fontawesome-free/css/all.min.css';
import '../css/asset_add.css';
import axios from 'axios';
import Topbar1 from './topbar1';


const Asset_Add = () => {

  const [assettype, setAssettype] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [pono, setPono] = useState([]);
  const [invoiceno, setInvoiceno] = useState([]);
  const [mso, setMso] = useState('');
  const [userid, setUserid] = useState('');
  const [serialno, setSerialno] = useState('');
  const [hostname, setHostname] = useState('');
  const [key, setKey] = useState('');
  const [dateofinstall, setDateofinstall] = useState('');
  const [podate, setPodate] = useState('');
  const [invoicedate, setInvoicedate] = useState('');
  const [os, setOs] = useState('');
  const [username, setUsername] = useState('');
  const [warranty, setWarranty] = useState('');
  const [ip, setIp] = useState('');
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [message , setMessage ] = useState('');





  const handlesubmit = async (e) => {
    e.preventDefault();

    if (
      assettype === '' ||
      make === '' ||
      model ==='' ||
      pono === '' ||
      invoiceno === '' || 
      os === ''  || 
      serialno === '' ||
      
      key === '' ||
      dateofinstall === '' ||
      podate === '' ||
      invoicedate === '' ||
      status === '' ||
      warranty === '' 
    ) {
      
      setMessage('Please fill in all the required fields.');
      return; 
    }

    try {
      const response = await axios.get(`http://localhost:3001/checkSerialNumber?serialno=${serialno}`);
      const isUnique = response.data.isUnique;
  
      if (!isUnique) {
        setMessage('Serial number already exists. Please provide a unique serial number.');
        return;
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while checking the serial number. Please try again.');
      return;
    }  

    try{
      const response = await axios.post('http://localhost:3001/addAsset',{
        assettype,
        make,
        model,
        pono,
        invoiceno,
        serialno,
        key,
        dateofinstall,
        podate,
        invoicedate,
        os,
        warranty,
        status,
        remark

      });

      
      document.getElementById("assetForm").reset();

      setAssettype('');
      setMake('');
      setModel('');
      setPono('');
      setInvoiceno('');
      setSerialno('');
      setKey('');
      setDateofinstall('');
      setPodate('');
      setInvoicedate('');
      setOs('');
      setWarranty('');
      setStatus('');
      setRemark('');

      setMessage('Asset Added Successfully')


    }
    catch(error){
      console.error(error);
    }
  }
  return (
    <>     
    <Topbar1>
      {/* Page Wrapper */}
      <div id="wrapper">
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <h1 className="h2 mb-4 text-gray-800">
            <span>Add an Asset</span>
          </h1>
          {/* Content Row */}
          <form id='assetForm'>
          <div className="row">
            <div className="col-xl-6">
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-user-graduate small" />
                </div>
                <label className="form-input" placeholder="Type">
                  Type
                </label>
                <select
                className='form-select'
                name='Type'
                onChange={(e) => setAssettype(e.target.value)} 
                >
                  <option value = ''  > </option>
                  <option value='hardware'>Hardware</option>
                  <option value='software'>Software</option>

                </select>
                
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-user-graduate small" />
                </div>
                <label 
                className="form-input"
                placeholder="Make">
                  Make
                </label>
                <input  
                onChange={(e) => setMake(e.target.value)} 
                className="form-autofill" 
                required="" />
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-pager small" />
                </div>
                <label 
                className="form-input"
                placeholder="Model">
                  Model
                </label>
                <input 
                className="form-autofill" 
                onChange={(e) => setModel(e.target.value)}  
                required="" />
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-server small" />
                </div>
                <label 
                className="form-input"
                placeholder="Invoice no">
                  Serial No.
                </label>
                <input 
                className="form-autofill"  
                onChange={(e) => setSerialno(e.target.value)} 
                required="" />
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-key" />
                </div>
                <label 
                className="form-input" 
                placeholder="Key">
                  Key Specification
                </label>
                <input 
                className="form-autofill" 
                onChange={(e) => setKey(e.target.value)} 
                required="" />
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-laptop small" />
                </div>
                <label className="form-input" placeholder="Ms version">
                  Operating System
                </label>
                <input 
                onChange={(e) => setOs(e.target.value)} 
                className="form-autofill" 
                required="" />
              </div>
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-calendar" />
                </div>
                <label 
                className="form-input" 
                placeholder="Date">
                  Date of installation
                </label>
                <input 
                type="date" 
                
                onChange={(e) => setDateofinstall(e.target.value)} 
                className="form-autofill" 
                required="" />
              </div>                                          
            </div>
            {/* Donut Chart */}
            <div className="col-xl-6">
              
            <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-calendar small" />
                </div>
                <label className="form-input" placeholder="Date">
                  Warranty Date
                </label>
                <input 
                onChange={(e) => setWarranty(e.target.value)} 
                type="date" 
                className="form-autofill" 
                required="" />
              </div>
              
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-parking small" />
                </div>
                <label 
                className="form-input"
                placeholder="Po no">
                  Po. No.
                </label>
                <input 
                type='number'
                className="form-autofill"  
                onChange={(e) => setPono(e.target.value)} 
                required="" />
              </div>

              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-calendar" />
                </div>
                <label className="form-input" placeholder="Date">
                  PO Date
                </label>
                <input 
                type="date" 
                onChange={(e) => setPodate(e.target.value)} 
                className="form-autofill" 
                required="" />
              </div>


              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-newspaper small" />
                </div>
                <label 
                className="form-input"  
                placeholder="Invoice no">
                  Invoice No.
                </label>
                <input 
                type='number'
                onChange={(e) => setInvoiceno(e.target.value)}
                className="form-autofill" 
                required="" />
              </div>
              
              
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-calendar" />
                </div>
                <label className="form-input" placeholder="Date">
                  Invoice Date
                </label>
                <input 
                onChange={(e) => setInvoicedate(e.target.value)} 
                type="date" 
                className="form-autofill" 
                required="" />
              </div>            
              
              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-comments small" />
                </div>
                <label className="form-input" placeholder="product">
                  Remark
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message...."
                  className="form-ans-desc"
                  required=""
                  onChange={(e) => setRemark(e.target.value)} 
                  defaultValue={""}
                />
              </div>

              <div className="form-line">
                <div className="form-icon">
                  <i className="fas fa-laptop small" />
                </div>
                <label className="form-input" placeholder="product">
                  Asset status
                </label>
                
                <label className="form-checkbox">
                  <input
                    type="radio"
                    name="option"
                    defaultValue="New"
                    onChange={(e) => setStatus(e.target.value)}
                    
                    checked={status === "New"}
                    
                    
                  />
                  New stock
                </label>
                <label className="form-checkbox">
                  <input
                    type="radio"
                    name="option"
                    defaultValue="Live"
                    onChange={(e) => setStatus(e.target.value)}
                    disabled
                  />
                  Live
                </label>
                <label className="form-checkbox">
                  <input
                    type="radio"
                    name="option"
                    defaultValue="Standby"
                    onChange={(e) => setStatus(e.target.value)}
                    disabled
                  />
                  Standby
                </label>
                
                
              </div>

            </div>
            <div className="submit_button">
              <button 
              type="submit" 
              className="btn btn-primary " 
              value="submit"
              onClick={handlesubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className='Message'>
              {message && <p >{message}</p>}
              </div>
          </form>
        </div>
      </div>
      </Topbar1>
    </>

  );
}

export default Asset_Add;