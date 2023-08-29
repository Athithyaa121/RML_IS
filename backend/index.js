// import express from "express";
// // import bodyParser from "body-parser";
// import {sqlDb,poolPromise} from "./connection/db.js";
// import cors from 'cors';

const express = require ('express');
const app = express();
const db = require('./connection/db')
const cors = require('cors');
const sql = require('mssql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const secretKey = 'RML';
const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');


app.use(bodyParser.json());
const port = 3001;

app.use(cors())




// Define Routes here
// const master = require('./routes/master_routes')
// app.use('/master' , master)


//EMAILS

app.post('/send_email', (req, res) => {
  const { message } = req.body;
  
  // Configure nodemailer to use your email provider
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail'
    auth: {
      user: 'athithyaa.ramesh@pec.edu',
      pass: 'vjbqasuyrqxlhitq',
    },
  });

  // Email details
  const mailOptions = {
    from: 'athithyaa.ramesh@pec.edu',
    to: 'athithyaa121@gmail.com', // Replace with the recipient's email address
    subject: 'Query from RML',
    text: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});


app.post('/contact', async (req, res) => {
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


//TOKEN


app.get('/token_verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    // Token is valid
    // Perform actions for token verification, if needed
    res.json({ message: 'Token verified' , token});
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});






//FETCH TABLE DATA


app.get('/users', async (req, res) => {
  try {

    const plantcode = req.query.plantcode;
    const pool = await db.poolPromise
    const userfetch = `
    SELECT Mst_User.Userid,Mst_User.Username ,Mst_User.User_role,Mst_User.Created_on, Mst_Department.Dept_name, Mst_Plant.Plant_name, Mst_Designation.Designation, Mst_User.Active_status,Mst_User.User_mail_id,Mst_User.User_phone_no
    FROM Mst_User
    INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id
    INNER JOIN Mst_Plant ON Mst_User.Plant_id = Mst_Plant.plant_id
    INNER JOIN Mst_Designation ON Mst_User.Designation_id = Mst_Designation.Designation_id
    where Mst_User.Active_status=1 AND Mst_User.Plant_id = @plantcode `
    const response = await pool
    .request()
    .input('plantcode', sql.Int, plantcode)
    .query(userfetch)

    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});



app.get('/department', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Department where Active_status = 1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/plant', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Plant where Active_status = 1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});


app.get('/product', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Product where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/designation', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Designation where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/service_category', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Service_Category where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/root_cause', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Root_Cause where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});


//END OF FETCHING DATA

//ADDING MASTERS

app.post('/register', async (req, res) => {
  const { username, password, department, email, plantCode, roles, designation, phoneNumber } = req.body;

  try {
    // Connect to the database
    const pool = await db.poolPromise;

    // Insert user data into the database
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('department', sql.Int  , department)
      .input('email', sql.VarChar, email)
      .input('plantCode', sql.Int, plantCode)
      .input('roles', sql.VarChar, roles.join(',')) // Convert roles array to comma-separated string
      .input('designation', sql.Int, designation)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .query(`
        INSERT INTO Mst_User (Username, User_password, Dept_id, User_mail_id, Plant_id, User_role, Designation_id, User_phone_no,Created_on,Active_status)
        VALUES (@username, @password, @department, @email, @plantCode, @roles, @designation, @phoneNumber,GETDATE(),1);
      `);

    console.log('User registered successfully');

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error while registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  } 
});




app.post('/addDepartment', async (req, res) => {
  const { dept_code, dept_name , userid} = req.body;
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Department WHERE Dept_code = ${dept_code} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const departmentExists = checkResult.recordset[0].count > 0;

    if (departmentExists) {
      return res.status(400).json({ message: 'Department code already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Department (Dept_code, Dept_name,Active_status , Created_by , Created_on) VALUES (${dept_code}, '${dept_name}',1 , ${userid},GETDATE())`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'Department added successfully' });
  } catch (error) {
    console.error('Failed to add department', error);
    res.status(500).json({ message: 'Failed to add department', error });
  } finally {
    sql.close();
  }
});

app.post('/addPlant', async (req, res) => {
  const { plant_code, plant_name,plant_location , userid } = req.body;
  
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Plant WHERE Plant_code = ${plant_code} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const plantExists = checkResult.recordset[0].count > 0;

    if (plantExists) {
      return res.status(400).json({ message: 'Plant code already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Plant (Plant_code, Plant_name,Plant_location,Active_status , Created_by , Created_on) VALUES (${plant_code}, '${plant_name}','${plant_location}',1 , ${userid},GETDATE())`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'Plant added successfully' });
  } catch (error) {
    console.error('Failed to add plant', error);
    res.status(500).json({ message: 'Failed to add plant', error });
  } finally {
    sql.close();
  }
});


app.post('/addDesignation', async (req, res) => {
  const { Designation_id, Designation , userid} = req.body;
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Designation WHERE Designation_id = ${Designation_id} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const DesignationExists = checkResult.recordset[0].count > 0;

    if (DesignationExists) {
      return res.status(400).json({ message: 'Department code already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Designation (Designation_id, Designation,Active_status , Created_by , Created_on) VALUES (${Designation_id}, '${Designation}',1 , ${userid},GETDATE())`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'Plant added successfully' });
  } catch (error) {
    console.error('Failed to add plant', error);
    res.status(500).json({ message: 'Failed to add plant', error });
  } finally {
    sql.close();
  }
});


app.post('/addProduct', async (req, res) => {
  const { Product_code, Product_name , userid} = req.body;
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Product WHERE Product_code = ${Product_code} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const ProductExists = checkResult.recordset[0].count > 0;

    if (ProductExists) {
      return res.status(400).json({ message: 'Product already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Product (Product_code, Product_name,Active_status, Created_by , Created_on) VALUES (${Product_code}, '${Product_name}',1 , ${userid} ,GETDATE() )`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Failed to add plant', error);
    res.status(500).json({ message: 'Failed to add product', error });
  } finally {
    sql.close();
  }
});

app.post('/addServiveCategory', async (req, res) => {
  const { Service_id, Service_type, Service_category , userid} = req.body;
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Service_Category WHERE Service_category_id = ${Service_id} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const departmentExists = checkResult.recordset[0].count > 0;

    if (departmentExists) {
      return res.status(400).json({ message: 'Department code already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Service_Category (Service_category_id, Service_category_type,Service_category,Active_status , Created_by , Created_on) VALUES (${Service_id}, '${Service_type}','${Service_category}',1 , ${userid},GETDATE())`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'Service added successfully' });
  } catch (error) {
    console.error('Failed to add department', error);
    res.status(500).json({ message: 'Failed to add department', error });
  } finally {
    sql.close();
  }
});


app.post('/addRootCause', async (req, res) => {
  const { Root_id, Root_cause ,userid} = req.body;
  try {
    const pool = await db.poolPromise
    const checkQuery = `SELECT COUNT(*) AS count FROM Mst_Root_Cause WHERE Root_cause_id = ${Root_id} AND Active_status = 1`;
    const checkResult = await pool.request().query(checkQuery);
    const ProductExists = checkResult.recordset[0].count > 0;

    if (ProductExists) {
      return res.status(400).json({ message: 'RootCause already exists' });
    }

    const insertQuery = `INSERT INTO Mst_Root_Cause (Root_cause_id, Root_cause_name,Active_status, Created_by , Created_on) VALUES (${Root_id}, '${Root_cause}',1,${userid},GETDATE())`;
    const response = await pool.request().query(insertQuery);

    res.status(201).json({ message: 'RootCause added successfully' });
  } catch (error) {
    console.error('Failed to add plant', error);
    res.status(500).json({ message: 'Failed to add product', error });
  } finally {
    sql.close();
  }
});



// END OF ADDING MASTERS






//DELETING MASTERS

app.put('/deleteDepartment/:id', async (req, res) => {
  const recordId = req.params.id;
  const { userid } = req.body;

  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Department SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Dept_code = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Failed to delete record', error);
    res.status(500).json({ message: 'Failed to delete record', error });
  }
});

app.put('/deletePlant/:id', async (req, res) => {

  const recordId = req.params.id;
  const { userid } = req.body;
  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Plant SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Plant_code = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Plant', error);
    res.status(500).json({ message: 'Failed to delete Plant', error });
  }
});


app.put('/deleteDesignation/:id', async (req, res) => {
  const recordId = req.params.id;
  const { userid } = req.body;

  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Designation SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Designation_id = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'Designation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ', error);
    res.status(500).json({ message: 'Failed to delete ', error });
  }
});

app.put('/deleteProduct/:id', async (req, res) => {
  const recordId = req.params.id;
  const { userid } = req.body;

  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Product SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Product_id = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ', error);
    res.status(500).json({ message: 'Failed to delete ', error });
  }
});

app.put('/deleteServiveCategory/:id', async (req, res) => {
  const recordId = req.params.id;
  const { userid } = req.body;

  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Service_Category SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Service_category_id = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ', error);
    res.status(500).json({ message: 'Failed to delete ', error });
  }
});


app.put('/deleteRootCause/:id', async (req, res) => {
  const recordId = req.params.id;
  const { userid } = req.body;

  try {
    const pool = await db.poolPromise;

    const deleteQuery = `UPDATE Mst_Root_Cause SET Active_status = 0 , Modified_by = ${userid} , Modified_on = GETDATE() WHERE Root_cause_id = ${recordId}`;
    await pool.request().query(deleteQuery);

    res.status(200).json({ message: 'RootCause deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ', error);
    res.status(500).json({ message: 'Failed to delete ', error });
  }
});



//END OF DELETING MASTERS

// MODIFYING MATSERS

app.put('/modifyPlant/:id' , async(req,res) => {
  const { code, name,location , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Plant SET Plant_name = '${name}' , Plant_location = '${location}' , Modified_by=${userid} ,Modified_on = GETDATE() where Plant_code=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})

app.put('/modifyDepartment/:id' , async(req,res) => {
  const { code, name , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Department SET Dept_name = '${name}' , Modified_by=${userid} ,Modified_on = GETDATE() where Dept_code=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})

app.put('/modifyDesignation/:id' , async(req,res) => {
  const { code, name , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Designation SET Designation = '${name}' , Modified_by=${userid} ,Modified_on = GETDATE() where Designation_id=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})


app.put('/modifyProduct/:id' , async(req,res) => {
  const { code, name , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Product SET Product_name = '${name}' , Modified_by=${userid} ,Modified_on = GETDATE()  where Product_code=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})

app.put('/modifyRootCause/:id' , async(req,res) => {
  const { code, name , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Root_Cause SET Root_cause_name = '${name}' , Modified_by=${userid} ,Modified_on = GETDATE() where Root_cause_id=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})

app.put('/modifyServiceCategory/:id' , async(req,res) => {
  const { code, type,category , userid} = req.body;

  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`UPDATE Mst_Service_Category SET Service_category_type = '${type}' , Service_category = '${category}' , Modified_by=${userid} ,Modified_on = GETDATE()  where Service_category_id=${code} and Active_status = 1`)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})







//END OF MODIFYING MASTERS

//Login

function generateToken(userId, userRole ,userName ,dept ,plant ,desig ,email,plantCode ) {
  const payload = {
    userId: userId,
    role: userRole,
    userName : userName ,
    dept : dept ,
    plantcode : plantCode ,
    plant : plant ,
    desig : desig ,
    email : email 
  };

  const options = {
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  };

  return jwt.sign(payload, secretKey, options);
}


app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const pool = await db.poolPromise;

    const query = `
                  SELECT Mst_User.* , Mst_Department.Dept_name , Mst_Plant.Plant_name , Mst_Designation.Designation
                  FROM Mst_User 
                  INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id 
                  INNER JOIN Mst_Plant ON Mst_User.Plant_id = Mst_Plant.Plant_ID 
                  INNER JOIN Mst_Designation ON Mst_User.Designation_id = Mst_Designation.Designation_id
                  WHERE Mst_User.Username = '${userName}' and Mst_User.Active_status=1 `;
    const result = await pool
      .request()
      .input("userName", userName)
      .query(query);

    if (result.recordset.length === 0) {
      res.status(401).json({ message: "Invalid username !" });
      return;
    }

     
    const user = result.recordset[0];
    
    if (user.User_password === password) {
     
      const userRole = user.User_role;
      const userId = user.Userid; 
      const dept = user.Dept_name; 
      const plant = user.Plant_name; 
      const userName = user.Username; 
      const desig = user.Designation; 
      const email = user.User_mail_id;
      const plantcode = user.Plant_id;
      const token = generateToken(userId, userRole , userName , dept , plant , desig ,email ,plantcode );
      
      res.json({ message: "Login successful", token: token });
    } else {
      res.status(401).json({ message: "Invalid password !" });
    }
  } catch (error) {
    console.error(error);
    res.json({ status: "failed", message: "Something went wrong" });
  }
});


//USERS


app.post('/register', async (req, res) => {
  const { username, password, department, email, plantCode, roles, designation, phoneNumber } = req.body;

  try {
    // Connect to the database
    const pool = await db.poolPromise;

    // Insert user data into the database
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('department', sql.Int  , department)
      .input('email', sql.VarChar, email)
      .input('plantCode', sql.Int, plantCode)
      .input('roles', sql.VarChar, roles.join(',')) // Convert roles array to comma-separated string
      .input('designation', sql.Int, designation)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .query(`
        INSERT INTO Mst_User (Username, User_password, Dept_id, User_mail_id, Plant_id, User_role, Designation_id, User_phone_no,Active_status)
        VALUES (@username, @password, @department, @email, @plantCode, @roles, @designation, @phoneNumber,1);
      `);

    console.log('User registered successfully');

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error while registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  } 
});




app.get('/plantCodes', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Plant_ID,Plant_code,Plant_name from Mst_Plant where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching plant codes:', error);
  } finally {
    sql.close();
  }
});

app.get('/DepartmentCodes', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Dept_id,Dept_code,Dept_name from Mst_Department where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Department codes:', error);
  } finally {
    sql.close();
  }
});

app.get('/DesignationCodes', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Designation_id,Designation from Mst_Designation where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Designation codes:', error);
  } finally {
    sql.close();
  }
});

app.put('/modifyUser/:id', async (req, res) => {
  const { id, name, department, designation, plantname, userrole, phone, mail } = req.body;

  try {
    const pool = await db.poolPromise;

    // Retrieve dept_id based on dept_name
    const deptQuery = `SELECT Dept_id FROM Mst_Department WHERE Dept_name = '${department}'`;
    const deptResult = await pool.request().query(deptQuery);
    const deptId = deptResult.recordset[0].Dept_id;

    const desigQuery = `SELECT Designation_id FROM Mst_Designation WHERE Designation = '${designation}'`;
    const desigResult = await pool.request().query(desigQuery);
    const desigId = desigResult.recordset[0].Designation_id;
    

    const plantQuery = `SELECT Plant_ID FROM Mst_Plant WHERE Plant_name = '${plantname}'`;
    const plantResult = await pool.request().query(plantQuery);
    const plantId = plantResult.recordset[0].Plant_ID;


    // Update the Mst_User table using the retrieved dept_id
    const UMquery = `UPDATE Mst_User SET Username = '${name}', Dept_id = ${deptId}, Designation_id=${desigId}, Plant_id =${plantId} , User_role='${userrole}' , User_phone_no =${phone} , User_mail_id = '${mail}' where Userid=${id} and Active_status = 1`;

    const response = await pool.request().query(UMquery);

    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});




// ASSET LIST


app.get('/asset_list', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response1 = await pool.request().query(`
    SELECT Mst_Asset.*, Mst_User.Username , Mst_Department.Dept_name
    FROM Mst_User 
    INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id
    INNER JOIN Mst_Asset ON Mst_Asset.Userid = Mst_User.Userid
    where Mst_Asset.Active_status=1 and Mst_Asset.Modification_status = 0`)

    const response2 = await pool.request().query(`
    SELECT * FROM Mst_Asset
    WHERE (Userid IS NULL OR Userid = '') AND Active_status = 1 AND Modification_status = 0;
    `)



    res.json({ response1: response1.recordset, response2: response2.recordset });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/checkSerialNumber', async (req, res) => {
  const { serialno } = req.query;

  try {
    const pool = await db.poolPromise ;
    const slnoquery = `SELECT COUNT(*) AS count FROM Mst_Asset WHERE Asset_sl_no = '${serialno}'`;

    // Execute the query with the provided serial number as a parameter
    const result = await pool.request().query(slnoquery);

    // Check if the count is zero to determine uniqueness
    const isUnique = result.recordset[0].count === 0;

    res.json({ isUnique });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while checking the serial number. Please try again.' });
  } 
});

app.post('/addAsset' , async(req,res) => {

  try{

  const{
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
  } = req.body;

  const pool = await db.poolPromise ;


  const result = await pool.request()
          .input('assettype', sql.VarChar, assettype)
          .input('serialno',sql.VarChar,serialno)
          .input('make' , sql.VarChar, make)
          .input('key',sql.VarChar,key)
          .input('model', sql.VarChar, model)
          .input('dateofinstall',sql.DateTime,dateofinstall)
          .input('pono' , sql.VarChar, pono)
          .input('podate',sql.DateTime,podate)
          .input('invoiceno', sql.VarChar, invoiceno)
          .input('invoicedate',sql.DateTime,invoicedate)
          .input('os',sql.VarChar,os)
          .input('warranty',sql.DateTime,warranty)
          .input('status' , sql.VarChar, status)
          .input('remark', sql.VarChar, remark)
          .query(`INSERT INTO Mst_Asset (Asset_type , Asset_sl_no , Asset_make , Asset_specification , Asset_model , Asset_date_of_installation , Asset_po_no , Asset_po_date , Asset_invoice_no , Asset_invoice_date ,  Asset_os ,  Asset_warranty_end_date , Asset_status ,   Asset_remarks , Active_status,Modification_status)
          VALUES (@assettype , @serialno , @make , @key , @model , @dateofinstall , @pono , @podate , @invoiceno , @invoicedate ,  @os ,  @warranty , @status ,  @remark , 1 , 0  )`);

          console.log('Asset added successfully');
          res.status(200).json({message:'Asset added Successfully'})

        }
        catch(error){
          console.error('Error while adding asset:', error);
          res.status(500).json({ message: 'An error occurred while adding Asset' });
        }
        
        
        
      })

app.get('/username', async (req, res) => {
  const {userid} = req.query
        try {
          
          const pool = await db.poolPromise;
          UNquery=`SELECT Mst_User.Username , Mst_Department.Dept_name 
          from Mst_User 
          INNER JOIN Mst_Department on Mst_User.Dept_id = Mst_Department.Dept_id
          where Mst_User.Userid = ${userid} and Mst_User.Active_status = 1  `
          const result = await pool.query(UNquery);
          
          res.json(result.recordset)
        } catch (error) {
          console.error('Error fetching username:', error);
        } finally {
          sql.close();
        }
      });








app.put('/modifyAsset/:id' , async(req,res) => {
  const { id,type , make,model,pono,mso,userid,serialno,host,doi,podate,invoicedate,os,username,warranty,ip,dept,invoiceno,key,remarks,status} = req.body;

  try {
    const pool = await db.poolPromise
    AMquery = `INSERT INTO Mst_Asset (Asset_type, Asset_sl_no, Asset_make, Asset_specification, Asset_model, Asset_date_of_installation, Asset_po_no, Asset_po_date, Asset_invoice_no, Asset_invoice_date, Asset_mso_version, Asset_os, Userid, Asset_warranty_end_date, Asset_status, Asset_host_name, Asset_ip, Asset_remarks , Modification_status, Active_status)
    VALUES ('${type}', '${serialno}', '${make}', '${key}', '${model}', '${doi}', '${pono}', '${podate}', '${invoiceno}', '${invoicedate}', '${mso}', '${os}', '${userid}', '${warranty}', '${status}', '${host}', '${ip}','${remarks}', 1, 1) `;
    
    const response1 = await pool.request().query(AMquery)

    AMquery1 = `UPDATE Mst_Asset SET Active_status = 0 , Modification_status = 1 where Asset_id=${id}`;

    const response2 = await pool.request().query(AMquery1);
    
    res.json({ response1: response1.recordset, response2: response2.recordset });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }

})


app.get('/asset_approval', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`
    SELECT Mst_Asset.*, Mst_User.Username , Mst_Department.Dept_name
    FROM Mst_User 
    INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id
    INNER JOIN Mst_Asset ON Mst_Asset.Userid = Mst_User.Userid 
    where Mst_Asset.Modification_status = 1 and Mst_Asset.Active_status = 1 `)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
})


app.put('/assetApprove/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await db.poolPromise;

    const approveQuery = `UPDATE Mst_Asset SET Active_status = 1 , Modification_status = 0 WHERE Asset_id = ${id}`;
    await pool.request().query(approveQuery);

    res.status(200).json({ message: 'Asset Approved' });
  } catch (error) {
    console.error('Failed to Approve ', error);
    res.status(500).json({ message: 'Failed to Approve ', error });
  }
});

// TICKET

app.get('/view_ticket', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query(`
    SELECT Trn_Ticket.*,
    Mst_User.Username,
    Mst_Department.Dept_name,
    Mst_Product.Product_name,
    Trn_Ticket.Plant_id,
    Mst_Plant.Plant_code,
    Mst_Service_Category.Service_category_type,
    Mst_Service_Category.Service_category,
    (SELECT TOP 1 Mst_User.Username
     FROM Mst_User
     INNER JOIN Trn_Ticket ON Mst_User.Userid = Trn_Ticket.Engineer_id
     ) AS Engineer_name
      FROM Trn_Ticket
      INNER JOIN Mst_User ON Trn_Ticket.Plant_id = Mst_User.Plant_id AND Trn_Ticket.userid = Mst_User.userid
      INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id
      INNER JOIN Mst_Plant ON Mst_User.Plant_id = Mst_Plant.Plant_ID
      INNER JOIN Mst_Product ON Trn_Ticket.Product_id = Mst_Product.Product_id
      INNER JOIN Mst_Service_Category ON Mst_Service_Category.Service_category_id = Trn_Ticket.Service_category_id
      
 `)
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/close_ticket', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query( `SELECT Trn_Ticket.*,
    Mst_User.Username,
    Mst_Department.Dept_name,
    Mst_Product.Product_name,
    Trn_Ticket.Plant_id,
    Mst_Plant.Plant_code,
    Mst_Service_Category.Service_category_type,
    Mst_Service_Category.Service_category,
    Mst_Root_Cause.Root_Cause_name,
    EngineerUser.Username AS Engineer_name
FROM Trn_Ticket
INNER JOIN Mst_User ON Trn_Ticket.Plant_id = Mst_User.Plant_id AND Trn_Ticket.userid = Mst_User.userid
INNER JOIN Mst_Department ON Mst_User.Dept_id = Mst_Department.Dept_id
INNER JOIN Mst_Plant ON Mst_User.Plant_id = Mst_Plant.Plant_ID
INNER JOIN Mst_Product ON Trn_Ticket.Product_id = Mst_Product.Product_id
INNER JOIN Mst_Service_Category ON Mst_Service_Category.Service_category_id = Trn_Ticket.Service_category_id
LEFT JOIN Mst_Root_Cause ON Mst_Root_Cause.Root_cause_id = Trn_Ticket.Root_cause_id
LEFT JOIN Mst_User AS EngineerUser ON Trn_Ticket.Engineer_id = EngineerUser.Userid;

      `)

      // const response2 = await pool.request().query(
      //   `SELECT Mst_User.Username AS Engineer_name From Mst_User 
      //   INNER JOIN Trn_Ticket
      //   ON Mst_User.Userid = Trn_Ticket.Engineer_id
      //   `)

      

    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }
});

app.get('/fetch_Asset', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Asset_id , Asset_make from Mst_Asset where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Assets ', error);
  } finally {
    sql.close();
  }
});

app.get('/fetch_Service', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Service_category_id, Service_category from Mst_Service_Category where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Service Category Master:', error);
  } finally {
    sql.close();
  }
});

app.get('/fetch_Product', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Product_id , Product_name from Mst_Product where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Product Master:', error);
  } finally {
    sql.close();
  }
});

app.get('/fetch_Root', async (req, res) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.query(`SELECT Root_cause_id , Root_cause_name from Mst_Root_Cause where Active_status =1 `);
    res.json(result.recordset)
  } catch (error) {
    console.error('Error fetching Root Cause Master:', error);
  } finally {
    sql.close();
  }
});



app.post('/raise_ticket', async (req, res) => {
  const { plantCode,asset,service,desc,serviceType,product } = req.body;

  try {
    // Connect to the database
    const pool = await db.poolPromise;

    const plantQuery = `SELECT Plant_id FROM Mst_Plant WHERE Plant_code = '${plantCode}'`;
    const plantResult = await pool.request().query(plantQuery);
    const plantId = plantResult.recordset[0].Plant_id;
    const userId = localStorage.getItem("userId")

    const raisequery = `INSERT INTO Trn_Ticket (Plant_id , Ticket_raise_date , Asset_id , Product_id , Service_category_id , Userid , problem_description ,Service_type , Ticket_status , Active_status) VALUES (${plantId} , GETDATE() , ${asset} , ${product} , ${service} , ${userId} ,'${desc}', '${serviceType}'  , 'P' , 1)`


    const result = await pool.request()
    .query(raisequery)


    console.log('Ticket raised successfully');

    res.status(200).json({ message: 'Ticket raised successfully' });

  }
  catch (error) {
    console.error('Error while raising ticket:', error);
    res.status(500).json({ message: 'An error occurred while raising ticket' });
  } 


});

app.put('/attend_ticket/:id' , async(req,res) => {
  const { id , rootCause , actionTaken , status } = req.body;

  try {
    const pool = await db.poolPromise

    
    // const rootCauseResult = await pool.request().query(`SELECT Root_cause_id FROM Mst_Root_Cause WHERE Root_cause_name = '${rootCause}'`);
    // const RootId = rootCauseResult.recordset[0].Root_cause_id;


    Attendquery = ` UPDATE Trn_Ticket SET Root_cause_id =${rootCause} , Action_taken = '${actionTaken}' , Ticket_status ='${status}' ,Modified_on = GETDATE() where Ticket_id =${id} `;
    
    const response = await pool.request().query(Attendquery)

    // AMquery1 = `UPDATE Mst_Asset SET Active_status = 0 , Modification_status = 1 where Asset_id=${id}`;

    // const response2 = await pool.request().query(AMquery1);
    
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await sql.close();
  }




});








app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
