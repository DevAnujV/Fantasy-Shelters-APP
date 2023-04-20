/*************************************************************************************
 * WEB322 - 2231 Project
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Anuj Verma
 * Student ID    : 180483216
 * Course/Section: WEB322 NCC
 *
 **************************************************************************************/

const path = require("path");
const express = require("express");
//const models = require("./models/backendJS/rentals-ds");
//const checkValidation = require("./models/backendJS/validation");
const mongoose = require("mongoose")
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
dotenv.config({path:"./dotenv/apiKey.env"});
const session = require("express-session");
const fileUpload = require("express-fileupload");

const app = express();


// Set up Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.static("/public"));

//set-up fileUpload
app.use(fileUpload());

// set-up express session
app.use(session({
  secret: process.env.SESSION_SECRET, // this secret is used to protect the cookies, only our web app will know what the secret it
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  // res.locals.user is a global handlebars variable
  // This means that every single handlebars file can access this variable

  // Everytime the request comes in, it will copy the user to locals, which is like global variable for handlebars. Any views hbs can access this variable.
  res.locals.user = req.session.user;
  res.locals.isClerk = req.session.isClerk;
  res.locals.isCustomer = req.session.isCustomer;
  res.locals.cart = req.session.cart;
  next();
});

// Add your routes here
// e.g. app.get() { ... }



// controller route

const generalController = require("./controllers/generalController")
const rentalsController = require("./controllers/rentalsController")
const loadDataController = require("./controllers/loadDataController")

app.use("/", generalController)
app.use("/rentals", rentalsController)
app.use("/load-data", loadDataController)



// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


mongoose.connect(process.env.MONGOOSE,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to mongoDB")
  // Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
  // because sometimes port 80 is in use by other applications on the machine
  app.listen(HTTP_PORT, onHttpStart);

})
.catch(err => {
  console.log(`unable to connct to mongoosedb ${err}`)
})

