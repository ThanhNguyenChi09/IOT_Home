const express = require("express");
const router = express.Router();

// const { Client } = require('pg');

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Sensor_Data',
//   password: 'Chithanh09@',
//   port: 5432, // default PostgreSQL port
// });

// client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL');
//   })
//   .catch((error) => {
//     console.error('Error connecting to PostgreSQL:', error);
//   });

// router.get('/api/average', async (req, res) => {
//   try {
//     // Query the relevant data for the given day
//     const query = `
//       SELECT value, type
//       FROM data_home
//       WHERE create_at >= current_date;
//     `;
//     const result = await client.query(query);

//     // Calculate the average values for each type
//     const rows = result.rows;
//     const averages = {};
    
//     rows.forEach(row => {
//       const { value, type } = row;
//       if (!averages[type]) {
//         averages[type] = { sum: 0, count: 0 };
//       }
//       averages[type].sum += parseFloat(value);
//       averages[type].count++;
//     });

//     Object.keys(averages).forEach(type => {
//       averages[type] = averages[type].sum / averages[type].count;
//     });

//     res.json(averages);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });


// Home page - Dashboard.
router.get("/room1", function (req, res) {
  res.render("pages/room1", {
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
  });
});

module.exports = router;
