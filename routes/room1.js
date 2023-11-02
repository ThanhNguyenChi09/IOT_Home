const express = require("express");
const router = express.Router();

// Home page - Dashboard.
router.get("/room1", function (req, res) {
  res.render("pages/room1", {
    name: process.env.NAME,
    dashboardTitle: process.env.DASHBOARD_TITLE,
  });
});

module.exports = router;
