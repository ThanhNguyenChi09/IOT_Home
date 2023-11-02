const express = require("express");
const router = express.Router();

// Home page - Dashboard.
router.get("/room2", function (req, res) {
  res.render("pages/room2", {
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
  });
});

module.exports = router;