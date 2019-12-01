var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Database Name
const dbName = 'nodeapp';
const tableName = 'listTable';

// Create a new MongoClient
const client = new MongoClient(url);

var app = express();

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    client.connect(function (err) {
      const db = client.db(dbName);
      db.collection(tableName, function (err, collection) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db(dbName);
          var query = {
            name: username,
            password: password
          };
          dbo.collection(tableName).distinct('name', {},
          (function(err, docs){
               if(err){
                  return console.log(err);
               }
               if(docs){  
                var index = docs.indexOf(username);
                if (index > -1) {
                  docs.splice(index, 1);
                }
                request.session.users = docs;
               }
          }));

          dbo.collection(tableName).find(query).toArray(function (err, result) {
            if (result.length > 0) {
              request.session.loggedin = true;
              request.session.username = username;
              request.session.friendsList = (result[0].friendsList ? result[0].friendsList : []);
              request.session.pendingRequests = (result[0].pendingRequests ? result[0].pendingRequests : []);
              response.redirect('/home');
            } else {
              response.send('Incorrect Username and/or Password!');
            }
            response.end();
            db.close();
          });
          // client.close();
        });
      });
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.get('/home', function (request, response) {
  console.log(request.session.users);
  if (request.session.loggedin) {
    response.render(__dirname + "/home.ejs", {
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

app.post('/logout', function (request, response) {
  request.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      return response.redirect('/');
    }
  });
});

app.post('/accept', function (request, response) {
  var friendname = request.body.friendname;
  request.session.friendsList.push(friendname);

  var index = request.session.pendingRequests.indexOf(friendname);
  if (index > -1) {
    request.session.pendingRequests.splice(index, 1);
  }

  client.connect(function (err) {
    const db = client.db(dbName);
    db.collection(tableName, function (err, collection) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(tableName).update(
          {"name" : request.session.username},
          {
            $set: {
             "friendsList" : request.session.friendsList,
             "pendingRequests": request.session.pendingRequests
            }
          }
        );
        response.redirect('/home');
      });
    });
  });
});

app.post('/request', function (request, response) {
  var friendname = request.body.friendname;
  client.connect(function (err) {
    const db = client.db(dbName);
    db.collection(tableName, function (err, collection) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(tableName).update(
          {"name" : friendname},
          {
            $push: {
             "pendingRequests": request.session.username
            }
          }
        );
        response.redirect('/home');
      });
    });
  });
});

app.listen(3000);