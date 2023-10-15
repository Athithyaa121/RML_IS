const express = require ('express');
const master = express.Router()
const db = require('../connection/db')




master.get('/department', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Department where Active_status = 1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
  //  finally {
  //   await sql.close();
  // }
});

master.get('/plant', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Plant where Active_status = 1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } 
  // finally {
  //   await sql.close();
  // }
});


master.get('/product', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Product where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } 
  // finally {
  //   await sql.close();
  // }
});

master.get('/designation', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Designation where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } 
  // finally {
  //   await sql.close();
  // }
});

master.get('/service_category', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Service_Category where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } 
  // finally {
  //   await sql.close();
  // }
});

master.get('/root_cause', async (req, res) => {
  try {
    const pool = await db.poolPromise
    const response = await pool.request().query('SELECT * FROM Mst_Root_Cause where Active_status=1')
    res.json(response.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'An error occurred' });
  } 
  // finally {
  //   await sql.close();
  // }
});


module.exports=master