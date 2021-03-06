const express = require('express');
const UserModel = require('../models/usermodels');
const session = require('express-session');
const path = require('path');

let Router = express.Router();

'use strict';
const fs   = require('fs');
const jwt  = require('jsonwebtoken');

// Router.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/login.html'));
//   });

Router.post('/user', async (req,res) => {
    try {
        
        let {username, password} = req.body;
        
        let user  = new UserModel({
            name: username,
            password: password
        });

        await user.save();
        res.status(200).json({
            status: true,
            
            msg: 'user added'
        });

    } catch (e) {
        res.status(500).json({
            status: false,
            msg: 'internal error'
        });
    }
})

Router.get('/user',  async (req,res) => {
    // UserModel.find({}, (error, user) => {
    //     if(error){
    //         res.status(404).json({
    //             status: false,
    //             msg: error
    //         })
    //         return;
    //     }
    //     res.json({
    //         status: true,
    //         data: user,
    //     });
    // });
    // Promise: then, catch, 
    try {
        let user = await UserModel.find({});
        res.json({
            status: true,
            data: user
        })    
    } catch (e) {
        res.status(500).json({
            status: false,
            msg: e.message
        });
    }
    
})


Router.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '../html/login.html'));
  });
  

Router.get('/home', function (request, response) {
    console.log(request.session.users);
    if (request.session.loggedin) {
      response.render(__dirname + "../html /homepage.html", {
        username: request.session.username,
        friendsList: request.session.friendsList,
        pendingRequests: request.session.pendingRequests,
        users:  request.session.users,
      });
      response.end();
    } else {
      response.send('Please login to view this page!');
      response.end();
    }
  });


// Router.post('/login',  async (req,res) => {
//     console.log(req.session.users);
//     if (req.session.loggedin) {
//         res.render(__dirname + "/login.html", {
//         username: req.session.username,
//       });
//       res.end();
//     } else {
//         res.send('Please login to view this page!');
//         res.end();
//     }
//   });
// module.exports = Router;

//header

{ "typ";"JWT",
    "alg";"none"
 }

// PAYLOAD


var payload = {
    username1: "username 1",
    username2: "username 2",
    username3: "username 3",
    username4: "username 4",
   };

 // PRIVATE and PUBLIC key
   var privateKEY  = fs.readFileSync('./private.key', 'utf8');
   var publicKEY  = fs.readFileSync('./public.key', 'utf8');
   var i  = 'Mysoft corp';          // Issuer 
   var s  = 'some@user.com';        // Subject 
   var a  = 'http://locallost3000'; // Audience

// SIGNING OPTIONS
   var signOptions = {
    issuer:  i,
    subject:  s,
    audience:  a,
    expiresIn:  "12h",
    algorithm:  "RS256"
   };

   var token = jwt.sign(payload, privateKEY, signOptions);
   console.log("Token :" + token);