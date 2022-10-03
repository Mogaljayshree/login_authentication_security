//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.urlencoded({ extended : true }));

app.set("views", "./views");
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"] });

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/register", function(req, res){
    const user = new User({
        email : req.body.username,
        password : req.body.password
    });
    user.save(function(err){
        if(err){
            console.log(err);
        }else{
           res.render("secrets"); 
        }
    });
});

app.post("/login", function(req, res){
    User.findOne({email : req.body.username}, function(err, foundUser){
        if(err){
            console.log(err);                   
        }else{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render("secrets");
                }
            }  
        }
    });
});

app.listen(port, function(req, res){
    console.log("App listening on port 3000");
});