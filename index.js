//jshint esversion: 6
var express = require('express');
var path = require('path');
var jade = require('jade');
var Firebase = require('firebase');
var Client = require('node-rest-client').Client;
const ref = new Firebase('https://splitsave.firebaseio.com');

const API_KEY = '65be1ee16b2fbd6faade515551491370';
const baseURL = 'http://api.reimaginebanking.com/';
const cust_ID = '56c8ea7f061b2d440baf43dd';
const acc_ID = '56c8f105061b2d440baf43ed';
// Shashank's _id: 56c8ea7f061b2d440baf43dd

var app = express();

app.get('/', function(req, res) {
    app.use(express.static(path.join(__dirname, 'public')));
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/', function(req, res) {
    ref.authWithPassword({
        email: req.body.email,
        password: req.body.password
    }, function(err, account) {
        if (err) {
            console.log(err);
            res.send(500, 'badLogin');
            return;
        } else {
            var usersRef = ref.child('users').child(account.uid).child.child('account');
            usersRef.on('value', function(snapshot) {
                data = snapshot.val();
                console.log(data);
            });
            res.redirect('/login');
        }
    });
});

/*
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
                var fakePurchases = ref.child('users').child(account.uid).child('purchases');
                fakePurchases.update({
                    0: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-14",
                            "amount": 854.32,
                            "status": "pending",
                            "description": "hella good dinner",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c967c47742719f0e4dd4c7"
                        }
                    },
                    1: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-15",
                            "amount": 793.21,
                            "status": "pending",
                            "description": "hella good lunch",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c968037742719f0e4dd4c8"
                        }
                    },
                    2: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-16",
                            "amount": 1235.23,
                            "status": "pending",
                            "description": "hella good break",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c968267742719f0e4dd4ca"
                        }
                    },
                    3: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-17",
                            "amount": 694.32,
                            "status": "pending",
                            "description": "hella good break",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c9684e7742719f0e4dd4cb"
                        }
                    },
                    4: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-18",
                            "amount": 1031.12,
                            "status": "pending",
                            "description": "hella good snack",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c9688b7742719f0e4dd4cc"
                        }
                    },
                    5: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-19",
                            "amount": 673.32,
                            "status": "pending",
                            "description": "hella good brunch",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c968b87742719f0e4dd4cd"
                        }
                    },
                    6: {
                        "message": "Created purchase and added it to the account",
                        "code": 201,
                        "objectCreated": {
                            "merchant_id": "56c8f873061b2d440baf43f9",
                            "medium": "balance",
                            "purchase_date": "2016-02-20",
                            "amount": 823.74,
                            "status": "pending",
                            "description": "hella good late night snack",
                            "type": "merchant",
                            "payer_id": "56c8f105061b2d440baf43ed",
                            "_id": "56c9694f7742719f0e4dd4ce"
                        }
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
                    balance: 10000,
                    accNo: data[0].account_number,
                    type: data[0].type
                }
            });
        }
    });
});
*/

app.get('/home', function(req, res) {
    app.use(express.static(path.join(__dirname, 'public')));
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(5000);
