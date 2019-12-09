const express = require('express');
const UserModel = require('../models/usermodels');
const session = require('express-session');
const path = require('path');

let Router = express.Router();

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
      response.render(__dirname + "../html/homepage.html", {
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
