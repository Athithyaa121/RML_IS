// import sqlDb from 'mssql'
var sqlDb = require('mssql');


const config = {
    user: 'sa',
    password: 'Password@123',
    server: '127.0.0.1',
    database: 'Rane_DB',
    options: {
      encrypt: false, // Use this option for secure connections
      instance:'SQLEXPRESS'
    },
  };

const poolPromise = new sqlDb.ConnectionPool(config)
    .connect()
    .then(pool => {
console.log('Connected to MSSQL')
return pool
})
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

// export {sqlDb,poolPromise}

module.exports= 
{
  sqlDb,poolPromise
}