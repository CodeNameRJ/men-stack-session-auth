const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const authController = require("./controllers/auth.js");
const session = require('express-session');
const MongoStore = require("connect-mongo");




const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    })
  })
);


// authController for handling requests that match the /auth URL
app.use("/auth", authController);



// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs", {
      user: req.session.user,
    });
  });


//VIP route

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}`)

  } else {
    res.send('Sorry, no guest allow')

  }

})











app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
