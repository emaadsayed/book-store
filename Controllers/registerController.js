const express = require("express");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

//to render register page
module.exports.index = (req,res)=>{
    res.render('register')
}

//to register user
module.exports.register =  (req,res)=>{
    //declared response
    let response = {success:false,data:{status:"user not added"}};
    //used to generate hash
    getHashPass(req.body.password).then(result=>{
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password: result,
            about:req.body.description
        })
        //save the user
        saveCover(user, req.body.cover)
         user.save((err,result)   =>{
             if(!err){
            res.redirect("/login");
             }else{
                 console.log(err);
               res.status(401).send(response)
             }
        })
    });
 }

 function getHashPass(params){
  return new Promise(function(fullfill,reject){
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(params, salt, function (err, hash) {
                fullfill(hash);
            });
        });
     })
 }

 function saveCover(user, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      user.coverImage = new Buffer.from(cover.data, 'base64')
      user.coverImageType = cover.type
    }
  }