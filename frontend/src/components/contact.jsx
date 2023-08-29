import React , {useState , useEffect} from 'react';
import '../css/topbar1.css';
import '../css/contact.css';
import '../vendor/fontawesome-free/css/all.min.css';
import axios from 'axios';
import Topbar1 from './topbar1';

const Contact = () => {


  const initialFormData = {
    subject: '',
    message: '',
    email:'',
  };

  const [formData, setFormData] = useState(initialFormData);

  const [emailsent , setEmailsent] = useState(false)


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const plantid = localStorage.getItem('plantcode')

  const emaildata = {
    ...formData,
    plantid: plantid,
  };

  

  const handlesubmit = () => {
    if ( formData.message) {
    // Make an API call to your backend to send the email
    axios.post('http://localhost:3001/contact', emaildata)
      .then((response) => {
        console.log('Email sent successfully:', response.data);
        setEmailsent(true);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        // Handle any error that occurred while sending the email
      });
    }
    
  };


  useEffect(() => {
    if (emailsent) {
      window.alert("Email sent successfully");
      setEmailsent(false); 
    }
  }, [emailsent]);


  return (

    <>
    <Topbar1>
      {/* Page Wrapper */}
      <div id="wrapper">
      
        {/* Begin Page Content */}
        <div className="container-fluid">
          {/* Page Heading */}
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Query to Admin !</h1>
          </div>
          {/* Content Row */}
          <div className="row">
            <div className="col-xl-6">             
              
              <div className="form-line-contact">
                <div className="form-icon-contact">
                  <i className="fas fa-book-open" />
                </div>
                <input
                  name="subject"
                  className="form-input-contact"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              
              <h6
                style={{
                  backgroundColor: "#3c63e1",
                  color: "white",
                  height: 40,
                  fontSize: 25,
                  width: 150,
                  paddingLeft: 18,
                  paddingTop: 6,
                  borderRadius: 5
                }}
              >
                Message
              </h6>
              {/* </div> */}
              <textarea className='textarea-contact'
                id="message"
                name="message"
                placeholder="Enter your message...."
                value={formData.message}
                onChange={handleInputChange}
                
              />
            </div>            
          </div>
        </div>
      </div>
      <footer>
        <div className="text-center-contact">        
          <a 
          href="#" 
          onClick={handlesubmit}
          className="btn btn-primary btn-default"
          >
            Submit
          </a>
          
        </div>
      </footer>
      {/* End of Footer */}
      </Topbar1>
    </>

  );
}

export default Contact;