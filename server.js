require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();
const loginRoute = require('./Routes/loginRoute');
const registerRoute = require('./Routes/registerRoute');
const homeRoute = require('./Routes/homeRoute');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const axios = require("axios");
const methodOverride = require("method-override");
const user = require("./models/user");
const Book = require("./models/Book");


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}).then(() => console.log("connected"))
.catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit:'5mb'  }));

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/home', homeRoute);

app.use(express.static(__dirname + "/public"));

 // INDEX
 app.get("/", async (req, res) => {
  const adventure = await Book.find({category: "Adventure"}).limit(5);
  const fanfiction = await Book.find({category: "Fanfiction"}).limit(5);
  const horror = await Book.find({category: "Horror"}).limit(5);
  const mystery = await Book.find({category: "Mystery"}).limit(5);
  const romance = await Book.find({category: "Romance"}).limit(5);
  
  res.render('index', {adventure: adventure, fanfiction: fanfiction, horror: horror, mystery: mystery, romance: romance});
});

  // LOG-OUT
  app.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
  });

let port = (process.env.PORT || '5000')
app.listen(port ,process.env.IP)

module.exports = app;
