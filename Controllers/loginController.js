require("dotenv").config();

const express = require("express");
const User = require("../models/user");
const passport = require("passport");


  // PASSPORT
  require("./passport-config")(passport);


module.exports.index = (req,res)=>{
    res.render('login');
}

module.exports.login = passport.authenticate("local", {
    successRedirect:"/home",
    failureRedirect: "/login",
    failureFlash: true,
  })