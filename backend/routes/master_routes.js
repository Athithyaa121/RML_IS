const express = require ('express');
// const app = express();
const master = express.Router()
const db = require('./connection/db')




master.get('/department', async (req, res) => {
    try {
      const pool = await db.poolPromise
      const response = await pool.request().query('SELECT * FROM Mst_Department where Active_status = 1')
    //   res.json(response.recordset);
    //   res.json(`${} department is updated`);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await sql.close();
    }
  });





module.exports=master