const express = require("express")
const router = express.Router()
const models = require("../models/rentals-ds")
const rentalModel = require("../models/rentalsModel")
const path = require("path")
//const checkValidation = require("../models/backendJS/validation")
var savedInfo;
var fs = require("fs")
const { devNull } = require("os")




router.get("/", function (req, res) {
  var arr1 = [];
  var foundRentals = [];


    rentalModel.find()
    .then((found) => {
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


// rentals/add route get part
router.get("/add", (req, res)=>{
  res.render("rentals/add");
})

// rentals/add route post part
router.post("/add", (req, res)=> {
  var errStr = {};

  var {headline, numSleeps, numBedrooms, numBathrooms, pricePerNight, city, province, featuredRental} = req.body;


  if (numSleeps < 0 || numSleeps > 100){
    errStr.numSleeps = "number of sleep value should be between 0 and 100"
  }

  if(numBathrooms < 0 || numBathrooms > 100){
    errStr.numBathrooms = "number of bathrooms value should be between 0 and 100"
  }
  if(numBedrooms < 0 || numBedrooms > 100){
    errStr.numBedrooms = "number of bedrooms value should be between 0 and 100"
  }

  if (pricePerNight <= 0.00){
    errStr.pricePerNight="price per night value should be greater than 0.00"
  }

  if (Object.keys(errStr).length > 0){
    res.render("rentals/add", {
      errStr
    })
  }
  else{
    var isFeaturedRental = featuredRental != undefined;
    // now add the entry to the database.
    var newRentalModel = new rentalModel({
      headline, numSleeps, numBedrooms, numBathrooms, pricePerNight, city, province, featuredRental: isFeaturedRental
    })

    newRentalModel.save()
    .then((savedModel)=>{
      // model is now saved
      console.log(savedModel.headline)
      // now work with Image
      let uniqueName = `rental-pic-${savedModel._id}${path.parse(req.files.imageUrl.name).ext}`;
      console.log(uniqueName + "is success");

      //STEP-2 Copy the image data to a file in the "public/profile-pictures" folder.
      req.files.imageUrl
        .mv(`assets/images/${uniqueName}`)
        .then(() => {
          // update the user document so that it includes the image URL
          console.log("Then after moving");

          // now update the name in the DB
          rentalModel.updateOne({
            _id: savedModel._id}, {
              imageUrl: `/images/${uniqueName}`
            }, {
              featuredRental: isFeaturedRental
            })
            .then(() =>{
              console.log("Document updated with new Rental pic")

                res.redirect("/");

            })
            .catch(err=>{
              console.log("Cannot update the db with new file name" + err)
            })
          }).catch(err => {
            console.log("cannot move the image file to save" + err)
          })

    }).catch(err=>{
      console.log("Cannot save the model" + err)
    })
  }

})


// rentals/edit route get part

router.get("/edit/:editRental", (req, res)=>{
  let rentalEdit = req.params.editRental;

  rentalModel.find({
    _id: rentalEdit
  }).then((found)=>{
    console.log("found entry "+ found);
    var x = found.map(value => value.toObject());
    console.log(x[0]);

    // now we can use this x to populate the table
    res.render("rentals/edit", {
      id : rentalEdit,
      savedVals: x[0]
    })
  
  }).catch(err=>{
    console.log("cannot search the DB " + err)
  })

})

// rental edit route post part
router.post("/edit", (req,res)=>{

  var {id, headline, numSleeps, numBedrooms, numBathrooms, pricePerNight, city, province ,featuredRental} = req.body;
  console.log("On here post edit page with new headline"+ headline)

  if (req.files != null){
  var uniqueName = `rental-pic-${id}${path.parse(req.files.imageUrl.name).ext}`
  }
  else{
    var uniqueName = '';
  }

  var errStr = {};

  if (numSleeps < 0 || numSleeps > 100){
    errStr.numSleeps = "number of sleep value should be between 0 and 100"
  }

  if(numBathrooms < 0 || numBathrooms > 100){
    errStr.numBathrooms = "number of bathrooms value should be between 0 and 100"
  }
  if(numBedrooms < 0 || numBedrooms > 100){
    errStr.numBedrooms = "number of bedrooms value should be between 0 and 100"
  }

  if (pricePerNight <= 0.00){
    errStr.pricePerNight="price per night value should be greater than 0.00"
  }

  if (Object.keys(errStr).length > 0){
    res.render("rentals/add", {
      errStr
    })
  }
  else{

  var isFeaturedRental = featuredRental != undefined;

  rentalModel.updateOne({
    _id: id
  }, {$set:{headline, numSleeps, numBedrooms, numBathrooms, pricePerNight, city, province, imageUrl:`/images/${uniqueName}`, featuredRental: isFeaturedRental}})
  .then((ress)=>{
    console.log("Updated the records")
    console.log(ress);
    // copying the image onto local server

    if (req.files != null){
    req.files.imageUrl
    .mv(`assets/images/${uniqueName}`)
    .then(() =>{
      console.log("moved the image")
    })
    .catch(err =>{
      console.log("error moving image to local server")
    })
  }

    res.redirect("/");

  }).catch(err =>{
    console.log("cannot update the record")
  })
}
})


//rental remove route

router.get("/remove/:removedID", (req, res)=>{
  var removedData = req.params.removedID;
  res.render("rentals/remove", {
    deletedID: removedData
  })
  
})

// post delete module
router.post("/remove", (req, res)=>{

  const{id} = req.body;


  rentalModel.deleteOne({
    _id : id
}).then(() => {
        console.log("Successfully deleted the document for: " + id);
        res.redirect(`/rentals/list`);

}).catch(err => {
        console.log("Failed to delete the document for: " + id);
        res.redirect("/rentals/list");
    });

})

  module.exports = router;
