import React, { useState, useEffect } from 'react';
import '../css/tickets.css';
import '../css/topbar1.css';
import '../vendor/fontawesome-free/css/all.min.css';
import axios from 'axios';
import Topbar1 from './topbar1';


const Raise_Ticket = () => {

  const [service, setService] = useState('');
  const [product, setProduct] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [asset, setAsset] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [root, setRoot] = useState('');

  const [assetCode, setAssetCode] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [serviceCode, setServiceCode] = useState([]);
  const [rootCode, setRootCode] = useState([]);

  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  const plantCode = localStorage.getItem('plantcode');

  <input
    className="form-autofill"
    required=""
    placeholder="dd/mm/yyyy"
    autoComplete="date"
    readOnly=""
    value={formattedDate}
  />

  useEffect(() => {
    fetch('http://localhost:3001/fetch_Asset')
      .then((response) => response.json())
      .then((data) => {

        setAssetCode(data);

      })
      .catch((error) => console.error('Error fetching plant codes:', error));

    fetch('http://localhost:3001/fetch_Root')
      .then((response) => response.json())
      .then((data) => {

        setRootCode(data);

      })
      .catch((error) => console.error('Error fetching plant codes:', error));

    fetch('http://localhost:3001/fetch_Product')
      .then((response) => response.json())
      .then((data) => {

        setProductCode(data);

      })
      .catch((error) => console.error('Error fetching Department codes:', error));

    fetch('http://localhost:3001/fetch_Service')
      .then((response) => response.json())
      .then((data) => {

        setServiceCode(data);

      })
      .catch((error) => console.error('Error fetching Designation codes:', error));

  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/raise_ticket ', {
        date, plantCode, asset, service, desc, serviceType, product
      });

      setAsset('');
      setService('');
      setDesc('');
      setServiceType('');
      setProduct('');

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Topbar1>
      {/* Page Wrapper */}
      <div id="wrapper">
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <h1 className="h2 mb-4 text-gray-800">
            <span>Raise a Ticket</span>
          </h1>
          {/* Content Row */}
          <div className="row">
            <div className="col-xl-6">
              <form>
                <div className="form-line-rt">
                  <div className="form-icon-rt">
                    <i className="fas fa-industry" />
                  </div>
                  
                  <input
                    placeholder="Plant Code"
                    className="form-input-rt"
                    autoComplete="plant"
                    readOnly
                    value={plantCode}
                    inputprops={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="form-line-rt">
                  <div className="form-icon-rt">
                    <i className="fas fa-calendar" />
                  </div>                  
                  <input
                  className="form-input-rt"
                   placeholder="Date"                    required=""
                    autoComplete="date"
                    readOnly=""
                    value={formattedDate}
                    onChange={(event) => setDate(event.target.value)}
                    inputprops={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="form-line-rt">
                  <div className="form-icon-rt">
                    <i className="fas fa-laptop" />
                  </div>                  
                  <select
                    className="form-input-rt" 
                    placeholder="Asset"                    
                    name="Asset"
                    value={asset}
                    onChange={(event) => setAsset(event.target.value)}
                    required="">
                    <option disabled="" >Select your Asset</option>
                    {assetCode && assetCode.map((code, index) => (
                      <option key={index} value={code.Asset_id}>
                        {code.Asset_make}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-line1-rt">
                  <div className="form-icon-rt">
                    <i className="fas fa-wrench" />
                  </div>
                  <h6>Service Type :</h6>
                  <label className="form-checkbox-rt">
                    <input
                     placeholder="service"
                      type="radio"
                      name="option"
                      defaultValue="hardware"
                      required=""
                      checked={serviceType === 'hardware'}
                      onChange={() => setServiceType('hardware')}
                    />
                    Hardware
                  </label>
                  <label className="form-checkbox-rt">
                    <input
                      type="radio"
                      name="option"
                      defaultValue="software"
                      checked={serviceType === 'software'}
                      onChange={() => setServiceType('software')}
                    />
                    Software
                  </label>
                </div>

              </form>
            </div>
            <div className="col-xl-6">
              <div className="form-line-rt">
                <div className="form-icon-rt">
                  <i className="fas fa-box" />
                </div>                
                <select
                  className="form-select-rt"
                  name="product"
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  required="">
                  <option value='0' >Select Product</option>
                  {productCode && productCode.map((code, index) => (
                    <option key={index} value={code.Product_id}>
                      {code.Product_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-line-rt">
                <div className="form-icon-rt">
                  <i className="fas fa-cogs" />
                </div>                
                <select
                  className="form-select-rt"
                  name="service_category"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  required="">
                  <option value='0'>Service Category</option>
                  {serviceCode && serviceCode.map((code, index) => (
                    <option key={index} value={code.Service_category_id}>
                      {code.Service_category}
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-line-rt">
                <div className="form-icon-rt">
                  <i className="fas fa-comments" />
                </div>
                <label className="form-input-rt" placeholder="product">
                  Problem description
                </label>
                <textarea
                  rows="4" 
                   style={{width: "300px" ,minHeight: "10px",maxHeight: "300px",resize: "vertical",overflowY: "auto"}}
                  id="message"
                  name="message"
                  placeholder="Enter your message...."
                  required=""
                  value={desc}
                  onChange={(event) => setDesc(event.target.value)}

                />
              </div>
            </div>
            <div className="submit_button-rt">
              <button
                type="submit"
                className="btn btn-primary "
                value="submit"
                onClick={handleSubmit}
              >

                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      </Topbar1>
    </>

  );
}

export default Raise_Ticket;
