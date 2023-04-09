const express = require("express")
const router = express.Router()
const models = require("../models/rentals-ds")
const rentalsModel = require("../models/rentalsModel")
var msg;

router.get("/rentals", (req, res)=> {

    // protect the route so only data clerk can access it

    if (req.session && req.session.user && req.session.isClerk){

        rentalsModel.count()
        .then(counted => {
            if (counted){
                console.log("There is something in DB already")
                msg = "There are already documents loaded from the Database";
                res.render("load-data/rentals", {
                    title: "Hello", 
                    msg
                })
            }
            else{
                console.log("no counts in db, so will add new")
                rentalsModel.insertMany(models.dbArray)
                .then(() => {
                    console.log("Added rentals to the DB");
                    msg = "Added rentals to the DB"
                    res.render("load-data/rentals", {
                        title: "Hello", 
                        msg
                    })
                })
                .catch((err)=> {
                    console.log("cannot insert the users into DB" + err)
                })
            }
        }).catch(err => {
            console.log("error in counting the documents" + err);
        })



        // console.log("opening load-data/rentals")
        // res.render("load-data/rentals", {
        //     title: "Load Data"
        // });
    }
    else{
        res.status(401).send("You are Not authorized to view this page")
    }
})

module.exports = router;