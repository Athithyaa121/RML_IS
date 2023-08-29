import '../css/topbar1.css';
import React from 'react';
import brochurePDF from '../css/about_us.pdf';
import Topbar1 from './topbar1';

function About_us() {
  return (
    <>
    <Topbar1>
      <div id="wrapper" className="d-flex justify-content-center align-items-center">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <div className="container-fluid">
              <h1 className="h2 mb-4 text-gray-800">
                <span>Get To Know Us</span>
              </h1>

              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h3 className="m-0 font-weight-bold text-primary">
                    Welcome to our website!
                  </h3>
                </div>
                <div className="card-body" style={{padding:20}}>
                    
                  <h5>
                  <li>This website is all about IS Service that includes Ticket Management and Asset Management.</li>
                    
                  
                   
                  <li>This manual will guide you on how to use our website effectively.</li>
                  </h5>
                  <div className="d-flex justify-content-center">
                    <a
                      href={brochurePDF}
                      download="about_us.pdf"
                      className="btn btn-primary btn-lg"
                      style={{ padding: "1% 2%", fontSize: "14px" }}
                    > <span style={{ marginRight: 10 }}>Download the brochure</span>
                    <i className="fas fa-download" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Topbar1>
    </>
  );
}

export default About_us;
