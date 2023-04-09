const express = require("express")
const router = express.Router()
const models = require("../models/rentals-ds")
const rentalModel = require("../models/rentalsModel")
var arr1 = [];
var foundRentals = [];
//const checkValidation = require("../models/backendJS/validation")

router.get("/", function (req, res) {

    rentalModel.find().then((found) => {
      foundRentals = found.map(value => value.toObject());

  for (var i = 0; i < foundRentals.length; i++) {
    var continues = true;

    for (var j = 0; j < arr1.length && i > 0 && continues; j++) {
      if (
        arr1[j].cityProvince ==
        foundRentals[i].city + "," + foundRentals[i].province
      ) {
        continues = false;
      }
    }

    if (continues) {
      var x = foundRentals[i].city + "," + foundRentals[i].province;
      var obj = {
        cityProvince:
        foundRentals[i].city + "," + foundRentals[i].province,
        rentals: foundRentals.filter(function (something) {
          return (
            something.city == foundRentals[i].city &&
            something.province == foundRentals[i].province
          );
        }),
      };
      arr1.push(obj);
    }
  }

  res.render("rentals/rentals", {
     groupedRentals: arr1,
     title: "Rentals"

  });
  
    }).catch(err=> {
      console.log(err)
    })
    })



  // rentals.list route
router.get("/list", (req, res)=> {
  if (req.session && req.session.user && req.session.isClerk){

    rentalModel.find()
    .then((found) => {
    foundRentals = found.map(value => value.toObject());
    
    // foundRentals.sort((a,b)=>{
    //   return a.headline - b.headline;
    // })

    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const rentA = a.headline.toUpperCase();
      const rentB = b.headline.toUpperCase();
    
      let comparison = 0;
      if (rentA > rentB) {
        comparison = 1;
      } else if (rentA < rentB) {
        comparison = -1;
      }
      return comparison;
    }
    
    foundRentals.sort(compare);
    
    console.log(foundRentals);

     res.render("rentals/list", {
      headlineGrouped: foundRentals
     })
     
  }).catch(err => {
    console.log("cannot find"+err)
  })
}
  else{
    res.status(401).send("You are Not authorized to view this page")
  }
  })

  module.exports = router;