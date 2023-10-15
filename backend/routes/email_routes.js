const express = require ('express');
const email = express.Router()
const db = require('../connection/db')
const nodemailer = require('nodemailer');


email.post('/send_email', async (req, res) => {
  const { message, plantid} = req.body;

  try {
    
    const pool = await db.poolPromise 
    
    const query = `SELECT User_mail_id FROM Mst_User WHERE Plant_id = @plantid AND User_role = 'approver'`;
    const result = await pool.request()
      .input('plantid', sql.Int, plantid)
      .query(query);

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Admin not found for the specified plant ID' });
    } else {
      const adminEmail = result.recordset[0].User_mail_id;
      console.log(adminEmail,"admin email")

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'athithyaa.ramesh@pec.edu',
          pass: 'vjbqasuyrqxlhitq',
        },
      });

      const mailOptions = {
        from: 'athithyaa.ramesh@pec.edu',
        to: adminEmail,
        subject: subject,
        text: message,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching admin email:', error);
    res.status(500).json({ error: 'Failed to fetch admin email' });
  }
});
  
  
email.post('/contact', async (req, res) => {
    const { subject, message, plantid } = req.body;
  
    try {
      // Create a connection pool
      const pool = await db.poolPromise // Replace config with your database configuration
  
      // Fetch admin's email from the database
      const query = `SELECT User_mail_id FROM Mst_User WHERE Plant_id = @plantid AND User_role = 'admin'`;
      const result = await pool.request()
        .input('plantid', sql.Int, plantid)
        .query(query);
  
      if (result.recordset.length === 0) {
        res.status(404).json({ error: 'Admin not found for the specified plant ID' });
      } else {
        const adminEmail = result.recordset[0].User_mail_id;
        console.log(adminEmail,"admin email")
  
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'athithyaa.ramesh@pec.edu',
            pass: 'vjbqasuyrqxlhitq',
          },
        });
  
        const mailOptions = {
          from: 'athithyaa.ramesh@pec.edu',
          to: adminEmail,
          subject: subject,
          text: message,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching admin email:', error);
      res.status(500).json({ error: 'Failed to fetch admin email' });
    }
  });
  

module.exports=email