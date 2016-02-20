//jshint esversion: 6
var express = require('express');
var path = require('path');
var Firebase = require('firebase');
var Client = require('node-rest-client').Client;

// Shashank's _id: 56c8ea7f061b2d440baf43dd

function getInfo(url) {
    var client = new Client();
    client.get(url, function(data, res) {
        console.log(data);
        return data;
    });
}

var app = express();

app.get('/', function(req, res) {
	console.log(getInfo('http://api.reimaginebanking.com/customers/56c8ea7f061b2d440baf43dd?key=65be1ee16b2fbd6faade515551491370'));
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
