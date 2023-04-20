const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const models = require("../models/rentals-ds");
const checkValidation = require("../models/validation");
const userModel = require("../models/userModel");
const rentalsModel = require("../models/rentalsModel");

let errors = [];
let featuredRentals = [];
var subTotal = 0;
var VAT = 0;
var grandTotal = 0;

// home page route

router.get("/", function (req, res) {
  //res.render("general/home", {
  // featuredRentals: models.getFeaturedRentals(),
  // title: "Home"
  rentalsModel
    .find({
      featuredRental: true,
    })
    .then((found) => {
      if (found) {
        console.log("found the rentals" + found);
        // foundRentals will ensure that we only have the desired rental result
        let foundRentals = found.map((value) => value.toObject()); // confirm its use once!!!!!!!!!!!!!!!!!

        res.render("general/home", {
          featuredRentals: foundRentals,
        });
      } else {
        console.log("Cannot find any feautured rentals from the list");
      }
    })
    .catch((err) => {
      console.log("Cannot try to find the rentals in DB" + err);
    });
});

// welcome page route
router.get("/welcome", (req, res) => {
  res.render("general/welcome", {
    title: "Welcome",
  });
});

// Sign up get and post

router.get("/sign-up", function (req, res) {
  res.render("general/sign-up", {
    title: "Sign-Up",
  });
});

router.post("/sign-up", (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, password } = req.body;
  const { validated, displayMessage } =
    checkValidation.fantasySheltersSignupValidation({
      firstname,
      lastname,
      email,
      password,
    });

  if (validated) {
    // now check if the email exist in the db.
    // check for uniqueness
    const newUser = new userModel({
      firstname,
      lastname,
      email,
      password,
    });

    // save the info to database

    newUser
      .save()
      .then((userSaved) => {
        console.log(`User ${userSaved.firstname} saved to db`);

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
          to: req.body.email,
          from: "elseanuj@gmail.com",
          subject: "Registration confirmation at Fantasy Shelters",
          html: `Hello ${req.body.firstname}, Thank you for Registration at Fantasy Shelters. I am Anuj Verma, here to welcome you and provide further assistance.`,
        };

        sgMail
          .send(msg)
          .then(() => {
            console.log("Redirecting to welcome page");
            res.redirect("/welcome");
          })
          .catch((err) => {
            console.log(err);
            res.render("general/sign-up", {
              title: "sign-up",
              messageToBeDisplayed: displayMessage,
              values: req.body,
            });
          });
      })

      .catch((err) => {
        console.log(typeof err);
        console.log("cannot save user to the db " + err);

        if (err.code === 11000) {
          errors.push("Please enter different email address");

          res.render("general/sign-up", {
            title: "sign-up",
            errors,
            values: {
              firstname,
              lastname,
            },
          });
        } else {
          errors.push("Something went wrong! Please try again");
          res.render("general/sign-up", {
            title: "sign-up",
            errors,
          });
        }
      });
  } else {
    res.render("general/sign-up", {
      title: "sign-up",
      messageToBeDisplayed: displayMessage,
      values: req.body,
    });
  }
});

// login get and post

router.get("/login", (req, res) => {
  console.log("opening login page");
  res.render("general/login", {
    title: "Login",
  });
});

router.post("/login", (req, res) => {
  let errorLogin = [];
  const { email, password } = req.body;
  const { validated, displayMessage } =
    checkValidation.fantasySheltersLoginValidation({
      email,
      password,
    });
  if (validated) {
    // check if the id pass exist in database and create a session.
    userModel
      .findOne({
        email: req.body.email,
      })
      .then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((isMatched) => {
            if (isMatched) {
              req.session.user = user;

              req.session.isClerk = req.body.option === "clerk";
              req.session.isCustomer = req.body.option === "customer";

              console.log("session maintained");

              if (req.body.option === "clerk") {
                console.log("clerk");
                res.redirect("/rentals/list");
              } else {
                console.log("user");
                req.session.cart = [];
                res.redirect("/cart");
              }
              // // check which button is pressed and login based on that
            } else {
              console.log("email pass not there in db");
              errorLogin.push(
                "email password combination does not match in our records"
              );
              res.render("general/login", {
                errors: errorLogin,
              });
            }
          });
        } else {
          console.log("User not found in database");
          errorLogin.push("User not found in database");
          res.render("general/login", {
            errors: errorLogin,
          });
        }
      })
      .catch((err) => {
        console.log("cannot access the db" + err);
        errorLogin.push("cannot access the db");
        res.render("general/login", {
          errors: errorLogin,
        });
      });
  } else {
    res.render("general/login", {
      title: "login",
      messageToBeDisplayed: displayMessage,
      values: req.body,
    });
  }
});

// Cart route
router.get("/cart", (req, res) => {
  console.log(req.session.user);

  if (req.session.user && !req.session.isClerk) {
    res.render("general/cart");
  } else {
    res.status(401).send("You are Not authorized to view this page.");
  }
});

// log-out route setting - should be kept in last
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login"); // redirect always look at what is there in router.get so the folder name does not need to be included here.
});

// rent route for the cart
router.get("/rent/:id", (req, res) => {
  var found = false;
  var cartId = req.params.id;
  var cart1 = req.session.cart || [];

  rentalsModel
    .findOne({ _id: cartId }).lean()
    .then(founded => {
        console.log(founded);

      cart1.forEach(val => {
        if (val.id == cartId){
          val.numNights++;
          val.priceStay = val.priceStay * val.numNights;
          found = true;
        }
      })

      if (found){
        console.log("Cart Updated");
      }

      else{
        var newObj = founded;

        cart1.push({
          id: cartId,
          numNights: 1,
          priceStay: newObj.pricePerNight,
          newObj});

        console.log("Pushed into array and now rendering to the cart.");
        console.log(cart1[0]);
      }

      subTotal = 0;

      cart1.forEach(rents =>{
        subTotal = subTotal + rents.priceStay;
        VAT = subTotal*0.10;
        grandTotal = subTotal+VAT;
      })


        res.render("general/cart", {
          title: "Cart",
          cartSend: cart1,
          subTotal: subTotal.toFixed(2),
          VAT: VAT.toFixed(2),
          grandTotal: grandTotal.toFixed(2)
        });
      }) 
    .catch((err) => {
      console.log("Cannot search in the db" + err);
    });

  });


  router.get("/remove/:id", (req, res)=> {
    var cartId = req.params.id;
    var cart1 = req.session.cart || [];

    const index = cart1.findIndex(prop => prop.id == cartId);

    if (index >= 0) {
      // Rental was found in the cart.
      message = `Remove "${cart1[index].newObj.headline}" from the cart.`;


      subTotal -= cart1[index].priceStay;
      VAT = (subTotal*0.10);
      grandTotal = subTotal+VAT;

      cart1.splice(index, 1);
  }
  else {
      // Rental was not found in the cart.
      message = "Rental was not found in the cart.";
  }


  res.render("general/cart",{
    title: "Cart",
    cartSend: cart1,
    subTotal: subTotal.toFixed(2),
    VAT: VAT.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  })
  })



router.get("/place-order", (req, res)=> {

  console.log("Emptying cart");
  // send an email

  
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

  const msg = {
    to: req.session.user.email,
    from: "elseanuj@gmail.com",
    subject: "Checkout completed",
    html: `Hello ${req.session.user.firstname}, Thank you for choosing Fantacy Shelters. Here is your checkout summary ${req.session.cart}`,
  };

  req.session.cart = [];

  sgMail
    .send(msg)
    .then(() => {

      console.log("Redirecting to home page");
      res.redirect("/");
    })

    .catch((err) => {
      console.log(err);
      res.render("general/cart", {
        title: "cart",
      });
    });


  //res.render("general/cart");
})


module.exports = router;
