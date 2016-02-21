//jshint esversion: 6
var express = require('express');
var path = require('path');
var plotly = require('plotly')('Salil999', 'kxd6nm4m81');
var bodyParser = require('body-parser');
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

app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
/*
app.get('/', function(req, res) {
    res.redirect('/login');
});
*/
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/login', function(req, res) {
    ref.authWithPassword({
        email: req.body.email,
        password: req.body.password
    }, function(err, account) {
        if (err) {
            console.log(err);
            res.send(500, 'badLogin');
            return;
        } else {

            var usersRef = ref.child('users').child(account.uid);
            usersRef.on('value', function(snapshot) {
                data = snapshot.val();
                // CURRENT BALANCE
                var lastWeekBuy = [];
                lastWeekBuy.push(data.purchases.lastWeek.mon.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.tues.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.wed.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.thurs.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.fri.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.sat.objectCreated.amount);
                lastWeekBuy.push(data.purchases.lastWeek.sun.objectCreated.amount);
                var totalSpentLastWeek = 0;
                for (var i = 0; i < lastWeekBuy.length; i++) {
                    totalSpentLastWeek += lastWeekBuy[i];
                }
                var lastWeekBalance = parseFloat(data.account.money.balance) - totalSpentLastWeek;
                // CURRENT BALANCE

                // SAVINGS
                var currWeekBuy = [];
                var totalSpentThisWeek = 0;
                currWeekBuy.push(data.purchases.currWeek.sun.objectCreated.amount);
                currWeekBuy.push(data.purchases.currWeek.mon.objectCreated.amount);
                currWeekBuy.push(data.purchases.currWeek.tues.objectCreated.amount);
                for (var i = 0; i < currWeekBuy.length; i++) {
                    totalSpentThisWeek += currWeekBuy[i];
                }
                var thisWeekAverage = totalSpentThisWeek / currWeekBuy.length;

                // Last Week's Average
                var lastWeekAverage = totalSpentLastWeek / lastWeekBuy.length;
                var avgDifference = thisWeekAverage - lastWeekAverage;
                // Last Week's Average

                var currBalance = parseFloat(data.account.money.balance) - totalSpentThisWeek;

                // SAVINGS
                var fullName = data.account.first_name + ' ' + data.account.last_name;


                // PLOTLY
                var plotting = [{
                    x: [
                        data.purchases.lastWeek.sun.objectCreated.purchase_date,
                        data.purchases.lastWeek.mon.objectCreated.purchase_date,
                        data.purchases.lastWeek.tues.objectCreated.purchase_date,
                        data.purchases.lastWeek.wed.objectCreated.purchase_date,
                        data.purchases.lastWeek.thurs.objectCreated.purchase_date,
                        data.purchases.lastWeek.fri.objectCreated.purchase_date,
                        data.purchases.lastWeek.sat.objectCreated.purchase_date
                    ],
                    y: lastWeekBuy,
                    name: "Last Week",
                    type: "scatter"
                }, {
                    x: [
                        data.purchases.currWeek.sun.objectCreated.purchase_date,
                        data.purchases.currWeek.mon.objectCreated.purchase_date,
                        data.purchases.currWeek.tues.objectCreated.purchase_date
                    ],
                    y: currWeekBuy,
                    name: "This Week",
                    type: "scatter"
                }];
                var layout = {
                    title: "Spending Trends",
                    xaxis: {
                        title: "Days",
                    },
                    yaxis: {
                        title: "Money Spent ($)"
                    }
                };
                var graphOptions = { layout: layout, filename: "date-axes", fileopt: "overwrite" };
                plotly.plot(plotting, graphOptions, function(err, msg) {
                    console.log(msg);
                    res.render(path.join(__dirname, 'public/main.jade'), {
                        name: fullName,
                        currBalance: parseFloat(currBalance).toFixed(2),
                        savings: parseFloat(avgDifference).toFixed(2),
                        spentThisWeek: parseFloat(totalSpentThisWeek).toFixed(2),
                        spentLastWeek: parseFloat(totalSpentLastWeek).toFixed(2),
                        imgURL: msg.url + '.png'
                    });
                });
                // PLOTLY
            });
        }
    });
});

app.get('/test', function(req, res) {
    res.send('Registration Successful!');
});
/*
app.get('/setData', function(req, res) {
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

                var fakePurchase = ref.child('users').child(account.uid).child('purchases').child('currWeek');
                fakePurchase.update({
                    sun: {
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
                    mon: {
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
                    tues: {
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
                    }
                });

                var fakePurchases = ref.child('users').child(account.uid).child('purchases').child('lastWeek');
                fakePurchases.update({
                    sun: {
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
                    mon: {
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
                    tues: {
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
                    wed: {
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
                    thurs: {
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
                    fri: {
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
                    sat: {
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
    res.redirect('/login');
});
*/

app.listen(5000);
