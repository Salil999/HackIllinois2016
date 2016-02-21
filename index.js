//jshint esversion: 6
var express = require('express');
var path = require('path');
var Firebase = require('firebase');
var Client = require('node-rest-client').Client;
const ref = new Firebase('https://splitsave.firebaseio.com');

const API_KEY = '65be1ee16b2fbd6faade515551491370';
const baseURL = 'http://api.reimaginebanking.com/';
const cust_ID = '56c8ea7f061b2d440baf43dd';
const acc_ID = '56c8f105061b2d440baf43ed';
// Shashank's _id: 56c8ea7f061b2d440baf43dd
var endpoint;

var app = express();

app.get('/', function(req, res) {
    var client = new Client();

    var user = "test@test.com";
    var pass = "test";

    var uri = baseURL + 'customers/' + cust_ID + '?key=' + API_KEY;
    console.log(uri);
    client.get(uri, function(data, res) {
        //console.log(data);
        ref.authWithPassword({
            email: user,
            password: pass
        }, function(err, account) {
            if (err) {
                console.log(err);
                return;
            } else {
                var usersRef = ref.child('users').child(account.uid).child('account');
                usersRef.update({
                    id: data._id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    personalData: {
                        city: data.address.city,
                        state: data.address.state,
                        street_name: data.address.street_name,
                        street_number: data.address.street_number,
                        zip: data.address.zip
                    }
                });
            }
        });
    });

    uri = baseURL + 'customers/' + cust_ID + '/accounts' + '?key=' + API_KEY;
    client.get(uri, function(data, res) {
        //console.log(data);
        ref.authWithPassword({
            email: user,
            password: pass
        }, function(err, account) {
            if (err) {
                console.log(err);
                return;
            } else {
                var usersRef = ref.child('users').child(account.uid).child('account');
                usersRef.update({
                    money: {
                        /*balance: data[0].balance,*/
                        balance: 10000,
                        accNo: data[0].account_number,
                        type: data[0].type
                    }
                });
            }
        });
    });



    res.redirect('/home');
});

app.get('/home', function(req, res) {
    app.use(express.static(path.join(__dirname, 'public')));
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function(req, res) {
    res.send('hello world');
});

app.listen(5000);
