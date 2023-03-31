const express = require("express")
const router = express.Router()
const models = require("../models/rentals-ds")
//const checkValidation = require("../models/backendJS/validation")

router.get("/", function (req, res) {
    res.render("rentals/rentals", {
      groupedRentals: models.getRentalsByCityAndProvince(),
      title: "Rentals"
    });
  });

  // rentals.list route
router.get("/list", (req, res)=> {
  if (req.session.isClerk){
  res.render("rentals/list")
  }
  else{
    res.status(401).send("You are Not authorized to view this page")
  }
  })

  module.exports = router;